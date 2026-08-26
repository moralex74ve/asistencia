import './chunks/_astro_actions_CCHzB65Z.mjs';
import { p as prisma } from './chunks/index_DV7qvZ4L.mjs';
import * as z from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { a as defineAction } from './chunks/index_BIYxzCP0.mjs';
import { v4 } from 'uuid';
import { v as validateCsrfToken } from './chunks/csrf_uqab3ft7.mjs';

const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME_MS = 15 * 60 * 1e3;
const loginAttempts = /* @__PURE__ */ new Map();
const loginUser = defineAction({
  accept: "form",
  input: z.object({
    correo: z.string().email(),
    clave: z.string(),
    _csrf: z.string().optional()
  }),
  handler: async ({ correo, clave }, { cookies, clientAddress }) => {
    const ip = clientAddress;
    const attempt = loginAttempts.get(ip);
    if (attempt && attempt.count >= MAX_ATTEMPTS && Date.now() < attempt.expiry) {
      const timeLeft = Math.ceil((attempt.expiry - Date.now()) / 6e4);
      return {
        status: 429,
        // Too Many Requests
        body: {
          message: `Demasiados intentos fallidos. Por favor, inténtelo de nuevo en ${timeLeft} minutos.`
        }
      };
    }
    console.log(`Intentando login`);
    try {
      const user = await prisma.usuarios.findUnique({
        where: {
          correo
        }
      });
      if (!user || !await bcrypt.compare(clave, user.clave)) {
        const now = Date.now();
        const newAttempt = {
          count: (attempt?.count || 0) + 1,
          expiry: now + LOCKOUT_TIME_MS
        };
        loginAttempts.set(ip, newAttempt);
        const message = newAttempt.count >= MAX_ATTEMPTS ? `Demasiados intentos fallidos. Por favor, inténtelo de nuevo en 15 minutos.` : "Credenciales inválidas";
        return {
          status: 401,
          body: { message }
        };
      }
      if (!user.activo) {
        return {
          status: 403,
          body: {
            message: "Usuario desactivado. Contacte al administrador."
          }
        };
      }
      loginAttempts.delete(ip);
      await prisma.usuarios.update({
        where: { id: user.id },
        data: {
          ultimo_login: /* @__PURE__ */ new Date()
        }
      });
      const sessionExpires = new Date(Date.now() + 60 * 60 * 24 * 1e3);
      const token = jwt.sign(
        {
          id: user.id,
          rol: user.rol
        },
        "5fe5ddf412dfa8dfe085d4cab58525b7",
        // Cargar la clave secreta desde las variables de entorno
        { expiresIn: "24h" }
        // El token expira en 24 horas
      );
      cookies.set("session", token, {
        httpOnly: true,
        secure: true,
        // true en producción, false en desarrollo
        sameSite: "strict",
        path: "/",
        expires: sessionExpires
      });
      return {
        status: 200,
        body: {
          message: "Login exitoso"
        }
      };
    } catch (error) {
      console.error("Error durante el login:", error);
      return {
        status: 500,
        body: {
          message: "Error interno del servidor"
        }
      };
    }
  }
});

const getUsers = defineAction({
  accept: "json",
  handler: async (_params, context) => {
    const user = context.locals.user;
    if (!user || user.rol !== "admin") {
      throw new Error("No autorizado");
    }
    try {
      const users = await prisma.usuarios.findMany({
        select: {
          id: true,
          nombre: true,
          correo: true,
          rol: true,
          activo: true
        }
      });
      return users;
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener los usuarios");
    }
  }
});

const UserSchema = z.object({
  nombre: z.string().min(2).max(50),
  correo: z.string().email().max(100),
  clave: z.string().min(6),
  rol: z.enum(["usuario", "admin"]),
  _csrf: z.string().optional()
});
async function validateCsrf(context) {
  const formData = await context.request.clone().formData();
  const csrfToken = formData.get("_csrf");
  const cookieToken = context.cookies.get("csrf_session")?.value;
  if (!csrfToken || !cookieToken) return false;
  return validateCsrfToken(csrfToken);
}
function isAdmin(context) {
  const user = context.locals.user;
  if (!user) {
    return {
      success: false,
      status: 401,
      message: "No autorizado: Sesión de usuario no encontrada."
    };
  }
  if (user.rol !== "admin") {
    return {
      success: false,
      status: 403,
      message: "Prohibido: No tienes permisos de administrador."
    };
  }
  return { success: true };
}
const createUser = defineAction({
  accept: "form",
  input: UserSchema,
  handler: async ({ nombre, correo, clave, rol }, context) => {
    if (!await validateCsrf(context)) {
      return { status: 403, body: { message: "Token CSRF inválido" } };
    }
    const auth = isAdmin(context);
    if (!auth.success) {
      return { status: auth.status, body: { message: auth.message } };
    }
    try {
      const existingUser = await prisma.usuarios.findUnique({
        where: { correo }
      });
      if (existingUser) {
        return {
          status: 400,
          body: { message: "El usuario ya existe" }
        };
      }
      const hashedPassword = await bcrypt.hash(clave, 10);
      const newUser = await prisma.usuarios.create({
        data: {
          id: v4(),
          nombre,
          correo,
          clave: hashedPassword,
          rol,
          activo: true,
          creado_en: /* @__PURE__ */ new Date(),
          ultimo_login: null
        }
      });
      return {
        status: 201,
        success: true,
        body: {
          message: "Usuario creado exitosamente",
          user: {
            id: newUser.id,
            nombre: newUser.nombre,
            correo: newUser.correo,
            rol: newUser.rol,
            activo: newUser.activo,
            creado_en: newUser.creado_en
          }
        }
      };
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      return {
        status: 500,
        body: { message: "Error interno del servidor" }
      };
    }
  }
});
const updateUser = defineAction({
  accept: "form",
  input: UserSchema.extend({
    id: z.string(),
    activo: z.boolean().optional(),
    clave: z.string().min(6).optional()
  }),
  handler: async ({ id, nombre, correo, clave, rol, activo }, context) => {
    if (!await validateCsrf(context)) {
      return { status: 403, body: { message: "Token CSRF inválido" } };
    }
    const auth = isAdmin(context);
    if (!auth.success) {
      return { status: auth.status, body: { message: auth.message } };
    }
    try {
      const existingUser = await prisma.usuarios.findUnique({
        where: { id }
      });
      if (!existingUser) {
        return {
          status: 404,
          body: { message: "Usuario no encontrado" }
        };
      }
      const updateData = {
        nombre,
        correo,
        rol,
        activo
      };
      if (clave && clave.trim() !== "") {
        const hashedPassword = await bcrypt.hash(clave, 10);
        updateData.clave = hashedPassword;
      }
      const updatedUser = await prisma.usuarios.update({
        where: { id },
        data: updateData
      });
      return {
        status: 200,
        success: true,
        body: {
          message: "Usuario actualizado exitosamente",
          user: {
            id: updatedUser.id,
            nombre: updatedUser.nombre,
            correo: updatedUser.correo,
            rol: updatedUser.rol,
            activo: updatedUser.activo,
            actualizado_en: updatedUser.actualizado_en
          }
        }
      };
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      return {
        status: 500,
        body: { message: "Error interno del servidor" }
      };
    }
  }
});
const deleteUser = defineAction({
  accept: "form",
  input: z.object({
    id: z.string()
  }),
  handler: async ({ id }, context) => {
    if (!await validateCsrf(context)) {
      return { success: false, message: "Token CSRF inválido" };
    }
    const auth = isAdmin(context);
    if (!auth.success) {
      return { success: false, message: auth.message };
    }
    try {
      const userExists = await prisma.usuarios.findUnique({
        where: { id }
      });
      if (!userExists) {
        return {
          success: false,
          message: "Usuario no encontrado"
        };
      }
      await prisma.usuarios.delete({
        where: { id }
      });
      return {
        success: true,
        message: "Usuario eliminado correctamente"
      };
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      return {
        success: false,
        message: "No se pudo eliminar el usuario. Verifique que no tenga registros relacionados."
      };
    }
  }
});

const server = {
  getUsers,
  loginUser,
  createUser,
  updateUser,
  deleteUser
};

export { server };

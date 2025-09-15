import { defineAction } from "astro:actions";
import { prisma } from "../../db";
import { z } from "astro:schema";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';

export const loginUser = defineAction({
  accept: "form",
  input: z.object({
    correo: z.string().email(),
    clave: z.string(),
  }),
  handler: async ({ correo, clave }, { cookies }) => {
    console.log("Intentando login con:", correo);
    try {
      const user = await prisma.usuarios.findUnique({
        where: {
          correo: correo,
        },
      });

      // Si el usuario no existe, o si la contraseña no es válida, devuelve el mismo error.
      // Esto previene la enumeración de usuarios.
      if (!user || !(await bcrypt.compare(clave, user.clave))) {
        return {
          status: 401,
          body: {
            message: "Credenciales inválidas"
          }
        };
      }

      // Verificar si el usuario está activo
      if (!user.activo) {
        return {
          status: 403,
          body: {
            message: "Usuario desactivado. Contacte al administrador."
          }
        };
      }

      // Actualizar último login
      await prisma.usuarios.update({
        where: { id: user.id },
        data: { 
          ultimo_login: new Date()
        }
      });

      // Crear un ID de sesión seguro
      const sessionId = uuidv4();
      
      // Establecer la cookie de sesión directamente aquí
      cookies.set("session", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 // 24 horas
      });

      // Establecer la cookie de usuario
      cookies.set("user", JSON.stringify({
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
        activo: user.activo,
        ultimo_login: user.ultimo_login
      }), {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 // 24 horas
      });

      return {
        status: 200,
        body: {
          message: "Login exitoso",
          session: sessionId,
          user: {
            id: user.id,
            nombre: user.nombre,
            correo: user.correo,
            rol: user.rol,
            activo: user.activo,
            ultimo_login: user.ultimo_login
          }
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
  },
});

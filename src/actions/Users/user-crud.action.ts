import { defineAction, type ActionAPIContext } from "astro:actions";
import { prisma } from "../../db";
import { z } from 'astro:schema';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import type { usuarios } from "@prisma/client"; // Import the User type

// Esquema común para usuario
const UserSchema = z.object({
  nombre: z.string().min(2).max(50),
  correo: z.string().email().max(100),
  clave: z.string().min(6),
  rol: z.enum(['usuario', 'admin']),
});

// Define a complete Locals interface for ActionAPIContext
interface CustomActionLocals {
  user?: usuarios;
  // Add other properties that ActionAPIContext.locals might have if needed
  // For now, we'll assume 'user' is the only custom property
}

// Define a custom ActionAPIContext that uses our custom Locals
interface CustomActionAPIContext extends ActionAPIContext {
  locals: CustomActionLocals;
}

// Función reutilizable para verificar la autorización del administrador
function isAdmin(context: CustomActionAPIContext) { // Use the custom context type
  const user = context.locals.user;
  if (!user) {
    return { success: false, status: 401, message: "No autorizado: Sesión de usuario no encontrada." };
  }
  if (user.rol !== 'admin') {
    return { success: false, status: 403, message: "Prohibido: No tienes permisos de administrador." };
  }
  return { success: true };
}

export const createUser = defineAction({
  accept: "form",
  input: UserSchema,
  handler: async ({ nombre, correo, clave, rol }, context) => {
    const auth = isAdmin(context as CustomActionAPIContext); // Cast context here
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
          id: uuidv4(),
          nombre,
          correo,
          clave: hashedPassword,
          rol,
          activo: true,
          creado_en: new Date(),
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
      console.error('Error al crear el usuario:', error);
      return {
        status: 500,
        body: { message: "Error interno del servidor" }
      };
    }
  }
});

export const updateUser = defineAction({
  accept: "form",
  input: UserSchema.extend({
    id: z.string(),
    activo: z.boolean().optional(),
    clave: z.string().min(6).optional()
  }),
  handler: async ({ id, nombre, correo, clave, rol, activo }, context) => {
    const auth = isAdmin(context as CustomActionAPIContext); // Cast context here
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

      const updateData: any = {
        nombre,
        correo,
        rol,
        activo,
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
      console.error('Error al actualizar el usuario:', error);
      return {
        status: 500,
        body: { message: "Error interno del servidor" }
      };
    }
  }
});

export const deleteUser = defineAction({
  accept: "form",
  input: z.object({
    id: z.string()
  }),
  handler: async ({ id }, context): Promise<{ success: boolean; message: string }> => {
    const auth = isAdmin(context as CustomActionAPIContext); // Cast context here
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
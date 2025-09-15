import { defineAction } from "astro:actions";
import { prisma } from "../../db";
import { z } from 'astro:schema';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// Esquema común para usuario
const UserSchema = z.object({
  nombre: z.string().min(2).max(50),
  correo: z.string().email().max(100),
  clave: z.string().min(6),
  rol: z.enum(['usuario', 'admin']),
});

export const createUser = defineAction({
  accept: "form",
  input: UserSchema,
  handler: async ({ nombre, correo, clave, rol }, { cookies }) => {
    const userCookie = cookies.get('user');
    if (!userCookie) {
      return {
        status: 401,
        body: { message: "No autorizado: Sesión de usuario no encontrada." }
      };
    }

    let user;
    try {
      user = JSON.parse(userCookie.value);
    } catch (e) {
      return {
        status: 401,
        body: { message: "No autorizado: Formato de cookie de usuario inválido." }
      };
    }

    if (user.rol !== 'admin') {
      return {
        status: 403,
        body: { message: "Prohibido: No tienes permisos de administrador." }
      };
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
    id: z.string(), // Assuming uuid is represented as a string
    activo: z.boolean().optional(),
    clave: z.string().min(6).optional() // Hacemos la clave opcional en actualizaciones
  }),
  handler: async ({ id, nombre, correo, clave, rol, activo }, { cookies }) => {
    const userCookie = cookies.get('user');
    if (!userCookie) {
      return {
        status: 401,
        body: { message: "No autorizado: Sesión de usuario no encontrada." }
      };
    }

    let user;
    try {
      user = JSON.parse(userCookie.value);
    } catch (e) {
      return {
        status: 401,
        body: { message: "No autorizado: Formato de cookie de usuario inválido." }
      };
    }

    if (user.rol !== 'admin') {
      return {
        status: 403,
        body: { message: "Prohibido: No tienes permisos de administrador." }
      };
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

      // Preparar datos de actualización
      const updateData: any = {
        nombre,
        correo,
        rol,
        activo,
      };

      // Si se proporciona una nueva contraseña, encriptarla
      if (clave && clave.trim() !== "") {
        const hashedPassword = await bcrypt.hash(clave, 10);
        updateData.clave = hashedPassword;
      }

      // console.log('Datos de actualización:', updateData);

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
    id: z.string() // Assuming uuid is represented as a string
  }),
  handler: async ({ id }, { cookies }): Promise<{ success: boolean; message: string }> => {
    const userCookie = cookies.get('user');
    if (!userCookie) {
      return {
        success: false,
        message: "No autorizado: Sesión de usuario no encontrada."
      };
    }

    let user;
    try {
      user = JSON.parse(userCookie.value);
    } catch (e) {
      return {
        success: false,
        message: "No autorizado: Formato de cookie de usuario inválido."
      };
    }

    if (user.rol !== 'admin') {
      return {
        success: false,
        message: "Prohibido: No tienes permisos de administrador."
      };
    }

    try {
      console.log('Datos recibidos:', { id });

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
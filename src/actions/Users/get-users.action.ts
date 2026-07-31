import { defineAction, type ActionAPIContext } from "astro:actions";
import { prisma } from "../../db";

interface JWTUser {
  id: string;
  rol: string;
}

export const getUsers = defineAction({
  accept: "json",
  handler: async (_params: unknown, context: ActionAPIContext) => {
    const user = (context.locals as { user?: JWTUser }).user;
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
          activo: true,
        },
      });
      return users;
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener los usuarios");
    }
  },
});

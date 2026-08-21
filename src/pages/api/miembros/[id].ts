import type { APIRoute } from "astro";
import { prisma } from "../../../db";
import jwt from "jsonwebtoken";

/* export const prerender = false; */

export const DELETE: APIRoute = async ({ params, request: _request, cookies }) => {
  const { id } = params;

  // Verificar autenticación
  const token = cookies.get("session")?.value;
  if (!token) {
    return new Response(JSON.stringify({ message: "No autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    jwt.verify(token, import.meta.env.JWT_SECRET, { algorithms: ["HS256"] });
  } catch {
    cookies.delete("session", { path: "/" });
    return new Response(JSON.stringify({ message: "Sesión inválida" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!id) {
    return new Response(
      JSON.stringify({ message: "Se requiere el ID del miembro" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    await prisma.miembros.delete({
      where: { id: id },
    });

    return new Response(
      JSON.stringify({ message: "Miembro eliminado correctamente" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error(error);
    // Check for specific Prisma error for record not found
    if (error.code === "P2025") {
      return new Response(
        JSON.stringify({ message: "El registro no existe." }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({ message: "Error al eliminar el miembro" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};

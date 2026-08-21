import type { APIRoute } from "astro";
import { prisma } from "../../../db";
import jwt from "jsonwebtoken";

async function verificarAutenticacion(cookies: {
  get: (name: string) => { value?: string } | undefined;
}): Promise<boolean> {
  const token = cookies.get("session")?.value;
  if (!token) return false;
  try {
    jwt.verify(token, import.meta.env.JWT_SECRET, { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ message: "Se requiere el ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!(await verificarAutenticacion(cookies))) {
    cookies.delete("session", { path: "/" });
    return new Response(JSON.stringify({ message: "No autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let action: string;
  try {
    const body = await request.json();
    action = body.action;
  } catch {
    return new Response(JSON.stringify({ message: "Cuerpo inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    if (action === "marcar") {
      await prisma.asistencia.update({
        where: { id },
        data: { presente: true, hora_llegada: new Date() },
      });
    } else if (action === "limpiar") {
      await prisma.asistencia.update({
        where: { id },
        data: { presente: false, hora_llegada: null },
      });
    } else {
      return new Response(JSON.stringify({ message: "Acción inválida" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Actualizado correctamente" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: unknown) {
    console.error(error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return new Response(
        JSON.stringify({ message: "Registro no encontrado" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
    return new Response(JSON.stringify({ message: "Error al actualizar" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

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
    return new Response(JSON.stringify({ message: "Se requiere el ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await prisma.asistencia.delete({
      where: { id: id },
    });

    return new Response(
      JSON.stringify({ message: "Eliminado correctamente" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") {
      return new Response(
        JSON.stringify({ message: "Registro no encontrado" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ message: "Error al eliminar" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

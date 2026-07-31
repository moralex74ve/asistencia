import type { APIRoute } from "astro";
import { prisma } from "../../../db";
import jwt from "jsonwebtoken";

export const GET: APIRoute = async ({ url, cookies }) => {
  const cedula = url.searchParams.get("cedula");
  const excludeId = url.searchParams.get("excludeId");

  if (!cedula) {
    return new Response(
      JSON.stringify({ exists: false, message: "Cédula requerida" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Verificar autenticación
  const token = cookies.get("session")?.value;
  if (!token) {
    return new Response(
      JSON.stringify({ exists: false, message: "No autorizado" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    jwt.verify(token, import.meta.env.JWT_SECRET, { algorithms: ["HS256"] });
  } catch {
    return new Response(
      JSON.stringify({ exists: false, message: "Sesión inválida" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    const existing = await prisma.miembros.findFirst({
      where: {
        cedula,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });

    return new Response(JSON.stringify({ exists: !!existing }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ exists: false, message: "Error al verificar cédula" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};

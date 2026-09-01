import type { APIRoute } from "astro";
import { prisma } from "../../../../db";
import jwt from "jsonwebtoken";

// src/pages/api/eventos/[id]/incluir-miembro.ts
// Actualiza la cédula/nombre/apellido de un miembro y lo incluye en el evento.

interface CookieAccess {
  get: (name: string) => { value?: string } | undefined;
}

async function verificarAutenticacion(cookies: CookieAccess): Promise<boolean> {
  const token = cookies.get("session")?.value;
  if (!token) return false;
  try {
    jwt.verify(token, import.meta.env.JWT_SECRET, { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

const capitalize = (str: string): string => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const POST: APIRoute = async ({ params, request, cookies }) => {
  const { id: eventoId } = params;

  if (!eventoId) {
    return new Response(
      JSON.stringify({ ok: false, message: "Se requiere el ID del evento" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  if (!(await verificarAutenticacion(cookies))) {
    cookies.delete("session", { path: "/" });
    return new Response(
      JSON.stringify({ ok: false, message: "No autorizado" }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  let body: { miembroId?: string; cedula?: string; nombre?: string; apellido?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ ok: false, message: "Cuerpo inválido" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const { miembroId, cedula, nombre, apellido } = body || {};

  if (!miembroId || !cedula || !nombre || !apellido) {
    return new Response(
      JSON.stringify({
        ok: false,
        message: "Miembro, cédula, nombre y apellido son requeridos",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const cedulaLimpia = cedula.trim();
  if (!cedulaLimpia) {
    return new Response(
      JSON.stringify({ ok: false, message: "La cédula es requerida" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    // 1. La nueva cédula no debe pertenecer a otro miembro
    const duplicado = await prisma.miembros.findFirst({
      where: { cedula: cedulaLimpia, id: { not: miembroId } },
      select: { id: true },
    });
    if (duplicado) {
      return new Response(
        JSON.stringify({ ok: false, message: "La cédula ya está registrada en el sistema." }),
        { status: 409, headers: { "Content-Type": "application/json" } },
      );
    }

    // 2. Actualizar cédula / nombre / apellido del miembro
    await prisma.miembros.update({
      where: { id: miembroId },
      data: {
        cedula: cedulaLimpia,
        nombre: capitalize(nombre),
        apellido: capitalize(apellido),
      },
    });

    // 3. Incluir en el evento (idempotente ante carreras)
    const ahora = new Date();
    await prisma.asistencia.upsert({
      where: {
        miembro_id_evento_id: { miembro_id: miembroId, evento_id: eventoId },
      },
      update: { presente: true, hora_llegada: ahora },
      create: {
        miembro_id: miembroId,
        evento_id: eventoId,
        presente: true,
        hora_llegada: ahora,
      },
    });

    return new Response(
      JSON.stringify({ ok: true, message: "Miembro actualizado e incluido" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: unknown) {
    console.error(error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      ((error as { code: string }).code === "P2002" ||
        (error as { code: string }).code === "P2025")
    ) {
      const code = (error as { code: string }).code;
      const message =
        code === "P2002"
          ? "La cédula ya está registrada en el sistema."
          : "Miembro no encontrado.";
      return new Response(JSON.stringify({ ok: false, message }), {
        status: code === "P2002" ? 409 : 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ ok: false, message: "Error al guardar" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
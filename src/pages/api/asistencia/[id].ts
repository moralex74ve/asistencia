import type { APIRoute } from 'astro';
import { prisma } from '../../../db';
import jwt from 'jsonwebtoken';

export const DELETE: APIRoute = async ({ params, request, cookies }) => {
  const { id } = params;

  // Verificar autenticación
  const token = cookies.get("session")?.value;
  if (!token) {
    return new Response(JSON.stringify({ message: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    jwt.verify(token, import.meta.env.JWT_SECRET);
  } catch {
    cookies.delete("session", { path: "/" });
    return new Response(JSON.stringify({ message: 'Sesión inválida' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!id) {
    return new Response(JSON.stringify({ message: 'Se requiere el ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await prisma.asistencia.delete({
      where: { id: id },
    });

    return new Response(JSON.stringify({ message: 'Eliminado correctamente' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return new Response(JSON.stringify({ message: 'Registro no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Error al eliminar' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

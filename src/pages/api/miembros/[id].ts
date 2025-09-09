import type { APIRoute } from 'astro';
import { prisma } from '../../../db';

export const prerender = false;

export const DELETE: APIRoute = async ({ params, request }) => {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ message: 'Se requiere el ID del miembro' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await prisma.miembros.delete({
      where: { id: id },
    });

    return new Response(JSON.stringify({ message: 'Miembro eliminado correctamente' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    // Check for specific Prisma error for record not found
    if (error.code === 'P2025') {
        return new Response(JSON.stringify({ message: 'El registro no existe.' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ message: 'Error al eliminar el miembro' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

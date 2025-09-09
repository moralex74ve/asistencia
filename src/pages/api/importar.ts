import type { APIRoute } from 'astro';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();
const ZONA_ID_PENDIENTE = '83c3944f-2843-43d7-8c00-998c8ed97354';

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
      return new Response(JSON.stringify({ message: "Bad Request" }), { status: 400 });
  }

  try {
    const jsonPath = path.resolve(process.cwd(), 'src/ovejas.json');
    const jsonData = await fs.readFile(jsonPath, 'utf-8');
    const ovejas = JSON.parse(jsonData);

    let importedCount = 0;
    let skippedCount = 0;

    for (const oveja of ovejas) {
      if (!oveja.cedula) {
        skippedCount++;
        continue;
      }

      const existingMiembro = await prisma.miembros.findUnique({
        where: { cedula: String(oveja.cedula) },
      });

      if (existingMiembro) {
        skippedCount++;
        continue;
      }

      await prisma.miembros.create({
        data: {
          nombre: oveja.nombre,
          apellido: oveja.apellido,
          cedula: String(oveja.cedula),
          direccion: oveja.direccion || null,
          telef: oveja.tel2 || null,
          telf_2: oveja.Tel1 || null,
          status: true,
          zona_id: ZONA_ID_PENDIENTE,
        },
      });
      importedCount++;
    }

    return new Response(JSON.stringify({ 
        message: 'Importación completada', 
        importedCount, 
        skippedCount 
    }), { status: 200 });

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido en el servidor';
    return new Response(JSON.stringify({ message: `Error durante la importación: ${errorMessage}` }), { status: 500 });
  }
};

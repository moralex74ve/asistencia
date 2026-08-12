import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const prisma = new PrismaClient();
const rl = createInterface({ input, output });

let cerrado = false;
rl.on("close", () => {
  cerrado = true;
});

async function preguntar(prompt: string): Promise<string> {
  if (cerrado) return "Q";
  try {
    return await rl.question(prompt);
  } catch {
    return "Q";
  }
}

const VALIDOS = ["M", "F", "O"] as const;
type Genero = (typeof VALIDOS)[number];

function esValido(v: string): v is Genero {
  return VALIDOS.includes(v.toUpperCase() as Genero);
}

function normalizar(valor: string): string {
  return valor.trim().toUpperCase();
}

async function main() {
  const miembros = await prisma.miembros.findMany({
    orderBy: [{ nombre: "asc" }, { apellido: "asc" }],
    select: { id: true, nombre: true, apellido: true, genero: true },
  });

  const total = miembros.length;
  if (total === 0) {
    console.log("No hay miembros registrados.");
    return;
  }

  console.log(`\nTotal de registros: ${total}\n`);
  console.log("Opciones: M (Masculino) | F (Femenino) | O (Otro)");
  console.log('Enter sin escribir: saltar persona.  "q": salir.\n');

  let actualizados = 0;
  let saltados = 0;

  for (let i = 0; i < total; i++) {
    const m = miembros[i];
    const actual = (m.genero || "?").toUpperCase();

    console.log(
      `[${i + 1}/${total}] ${m.nombre} ${m.apellido}  |  Género actual: ${actual}`,
    );

    const respuesta = normalizar(await preguntar("  Nuevo género (M/F/O): "));

    if (respuesta === "Q") {
      console.log("\nProceso cancelado por el usuario.");
      break;
    }

    if (respuesta === "") {
      saltados++;
      console.log("  (Saltado)\n");
      continue;
    }

    if (!esValido(respuesta)) {
      console.log("  Opción inválida. (Saltado)\n");
      saltados++;
      continue;
    }

    if (respuesta === actual) {
      console.log("  Sin cambios.\n");
      continue;
    }

    await prisma.miembros.update({
      where: { id: m.id },
      data: { genero: respuesta },
    });

    actualizados++;
    console.log(`  ✔ Actualizado a ${respuesta}\n`);
  }

  console.log("-------------------------------");
  console.log(`Registros revisados: ${total}`);
  console.log(`Actualizados: ${actualizados}`);
  console.log(`Saltados: ${saltados}`);
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const niveles = [
  { nivel_cod: "niv1", nombre_nivel: "Nivel I" },
  { nivel_cod: "niv2", nombre_nivel: "Nivel II" },
  { nivel_cod: "niv3", nombre_nivel: "Nivel III" },
  { nivel_cod: "niv4", nombre_nivel: "Nivel IV" },
  { nivel_cod: "niv5", nombre_nivel: "Nivel V" },
  { nivel_cod: "niv6", nombre_nivel: "Nivel VI" },
  { nivel_cod: "niv7", nombre_nivel: "Extraordinario" },
];

async function main() {
  for (const nivel of niveles) {
    await prisma.discipulado.upsert({
      where: { nivel_cod: nivel.nivel_cod },
      update: {},
      create: nivel,
    });
    console.log(`✓ ${nivel.nombre_nivel} (${nivel.nivel_cod})`);
  }
  console.log("Seed de discipulado completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

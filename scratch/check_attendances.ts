import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const attendances = await prisma.asistencia.findMany({
    include: {
      miembros: true,
      evento: true
    },
    take: 10
  })
  console.log(JSON.stringify(attendances.map(a => ({
    miembro: a.miembros.nombre,
    evento: a.evento.nombre,
    fecha: a.evento.fecha,
    presente: a.presente
  })), null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

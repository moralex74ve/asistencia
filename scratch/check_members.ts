import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const members = await prisma.miembros.findMany({
    include: {
      asistencia: {
        include: { evento: true },
        orderBy: { evento: { fecha: 'desc' } }
      }
    },
    take: 5
  })
  console.log(JSON.stringify(members.map(m => ({
    nombre: m.nombre,
    asistencias: m.asistencia.map(a => ({
        evento: a.evento.nombre,
        fecha: a.evento.fecha,
        presente: a.presente
    }))
  })), null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

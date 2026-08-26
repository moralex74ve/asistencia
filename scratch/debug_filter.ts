import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const ultimos10Eventos = await prisma.evento.findMany({
    orderBy: { fecha: 'desc' },
    take: 10,
    select: { id: true, nombre: true }
  });
  const idsUltimos10 = ultimos10Eventos.map(e => e.id);
  const idsUltimos3 = idsUltimos10.slice(0, 3);

  const member = await prisma.miembros.findFirst({
    where: { nombre: 'Cruz Mayela ' },
    include: {
      asistencia: {
        include: { evento: true },
        orderBy: { evento: { fecha: 'desc' } },
        take: 10
      }
    }
  })

  if (member) {
    console.log('Global Last 3 IDs:', idsUltimos3);
    console.log('Member attendance IDs:', member.asistencia.map(a => a.evento_id));
    console.log('Types:', typeof idsUltimos3[0], typeof member.asistencia[0].evento_id);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

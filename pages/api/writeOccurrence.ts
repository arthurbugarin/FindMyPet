import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export default function handler(req, res) {
  const occurrence: Prisma.OccurrenceCreateArgs = req.body.occurrence;

  writeOccurrence(occurrence).then(async () => {
    await prisma.$disconnect();
    return res.status(200).json({});
  }).catch(async (error) => {
    await prisma.$disconnect();
    return res.status(500).json({
      error
    });
  });
}

async function writeOccurrence(occurrence: Prisma.OccurrenceCreateArgs) {
  await prisma.occurrence.create({
    data:
    occurrence
  });
}

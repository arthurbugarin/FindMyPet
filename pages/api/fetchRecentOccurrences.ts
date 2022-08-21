import { PrismaClient, Prisma, Occurrence } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {  
  try {
    const recentOccurrences: Occurrence[] = await fetchOccurences(5);
    await prisma.$disconnect();
    return res.status(200).json(recentOccurrences);
  }
  catch (error) {
    await prisma.$disconnect();
    return res.status(500).json({
      error
    });
  }
}

async function fetchOccurences(numberOfOccurrences: number = 5) {
  return prisma.occurrence.findMany({
    where: {
      solved: false,
    },
    take: numberOfOccurrences,
    orderBy: [{createTime: "desc"}],
  });
}

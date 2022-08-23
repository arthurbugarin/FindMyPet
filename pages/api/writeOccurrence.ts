import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const parameters = JSON.parse(req.body);
  const occurrence: Prisma.OccurrenceCreateInput = {
      petName: parameters.petName as string,
      author: parameters.author as string,
      lat: Number(parameters.lat),
      lon: Number(parameters.lon),
      petDescription: parameters.petDescription as string
  }

  try {
    await prisma.occurrence.create({
      data: occurrence
    });

    await prisma.$disconnect();
    return res.status(200).end();
  } catch (error) {
    await prisma.$disconnect();
    console.error(error);
    return res.status(500).send(error);
  };
}

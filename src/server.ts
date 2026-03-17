import prisma from "./config/db.ts";

async function testDB() {
  try {
    await prisma.$connect();
    console.log("DB Connected Successfully");

    const result = await prisma.$queryRaw`SELECT 1`;
    console.log("Query Result:", result);
  } catch (error) {
    console.error("DB Connection Failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDB();

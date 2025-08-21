import { PrismaClient } from '@prisma/client';


export const prisma = new PrismaClient();


async function connect() {
    try {
      await prisma.$connect();
      console.log("✅ Conectado ao banco de dados com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao conectar no banco de dados:", error);
    } finally {
      await prisma.$disconnect();
    }
  }
  
  connect();

  
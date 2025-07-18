/*
  Warnings:

  - Added the required column `date` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- Adicionar coluna como NULLABLE
ALTER TABLE "Activity" ADD COLUMN "date" TEXT;

-- Preencher registros existentes com uma data padrão
UPDATE "Activity" SET "date" = '2024-01-01' WHERE "date" IS NULL;

-- Tornar a coluna obrigatória
ALTER TABLE "Activity" ALTER COLUMN "date" SET NOT NULL;

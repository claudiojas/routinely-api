-- CreateTable
CREATE TABLE "DayComment" (
    "id" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DayComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DayComment_weekId_dayOfWeek_key" ON "DayComment"("weekId", "dayOfWeek");

-- AddForeignKey
ALTER TABLE "DayComment" ADD CONSTRAINT "DayComment_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "Week"("id") ON DELETE CASCADE ON UPDATE CASCADE;

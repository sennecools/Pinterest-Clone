/*
  Warnings:

  - You are about to drop the column `boardId` on the `Pin` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pin" DROP CONSTRAINT "Pin_boardId_fkey";

-- AlterTable
ALTER TABLE "Pin" DROP COLUMN "boardId";

-- CreateTable
CREATE TABLE "_BoardPins" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BoardPins_AB_unique" ON "_BoardPins"("A", "B");

-- CreateIndex
CREATE INDEX "_BoardPins_B_index" ON "_BoardPins"("B");

-- AddForeignKey
ALTER TABLE "_BoardPins" ADD CONSTRAINT "_BoardPins_A_fkey" FOREIGN KEY ("A") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoardPins" ADD CONSTRAINT "_BoardPins_B_fkey" FOREIGN KEY ("B") REFERENCES "Pin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `responseId` on the `Message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_responseId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "responseId",
ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "silent" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "_MessageReplies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MessageReplies_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MessageReplies_B_index" ON "_MessageReplies"("B");

-- AddForeignKey
ALTER TABLE "_MessageReplies" ADD CONSTRAINT "_MessageReplies_A_fkey" FOREIGN KEY ("A") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessageReplies" ADD CONSTRAINT "_MessageReplies_B_fkey" FOREIGN KEY ("B") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

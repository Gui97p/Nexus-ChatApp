-- CreateTable
CREATE TABLE "_ActiveChannels" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ActiveChannels_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ActiveChannels_B_index" ON "_ActiveChannels"("B");

-- AddForeignKey
ALTER TABLE "_ActiveChannels" ADD CONSTRAINT "_ActiveChannels_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActiveChannels" ADD CONSTRAINT "_ActiveChannels_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

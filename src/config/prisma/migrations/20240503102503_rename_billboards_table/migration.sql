/*
  Warnings:

  - You are about to drop the `bill_boards` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "bill_boards" DROP CONSTRAINT "bill_boards_store_id_fkey";

-- DropTable
DROP TABLE "bill_boards";

-- CreateTable
CREATE TABLE "billboards" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "billboards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "billboards_store_id_idx" ON "billboards"("store_id");

-- AddForeignKey
ALTER TABLE "billboards" ADD CONSTRAINT "billboards_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

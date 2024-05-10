-- CreateTable
CREATE TABLE "bill_boards" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bill_boards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bill_boards_store_id_idx" ON "bill_boards"("store_id");

-- AddForeignKey
ALTER TABLE "bill_boards" ADD CONSTRAINT "bill_boards_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

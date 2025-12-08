-- AlterTable
ALTER TABLE "sales" ADD COLUMN     "note" TEXT,
ADD COLUMN     "shippingAddress" TEXT;

-- CreateTable
CREATE TABLE "sale_history" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "note" TEXT,
    "changedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sale_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sale_history" ADD CONSTRAINT "sale_history_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

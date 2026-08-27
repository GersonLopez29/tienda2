-- CreateEnum
CREATE TYPE "GarmentType" AS ENUM ('CASACA', 'HOODIE', 'POLERA', 'PANTALON', 'VESTIDO', 'ZAPATILLA', 'OTRO');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "type" "GarmentType" NOT NULL DEFAULT 'OTRO';

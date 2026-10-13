-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('KILN_OWNER', 'DISTRIBUTOR', 'MANUFACTURER');

-- AlterTable
ALTER TABLE "BhattaDetail" ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "accountTitle" TEXT,
ADD COLUMN     "avgDailyProduction" INTEGER,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "bhattaImageUrl" TEXT,
ADD COLUMN     "brickTypes" TEXT,
ADD COLUMN     "businessDescription" TEXT,
ADD COLUMN     "businessLicenseUrl" TEXT,
ADD COLUMN     "businessType" "BusinessType",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "cnicBackUrl" TEXT,
ADD COLUMN     "cnicFrontUrl" TEXT,
ADD COLUMN     "cnicNumber" TEXT,
ADD COLUMN     "deliveryAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "deliveryCharges" DOUBLE PRECISION,
ADD COLUMN     "deliveryRadius" INTEGER,
ADD COLUMN     "easypaisaNumber" TEXT,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "minOrderQty" INTEGER,
ADD COLUMN     "pickupAvailable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "province" TEXT,
ADD COLUMN     "yearsExperience" INTEGER;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "city" TEXT,
ADD COLUMN     "phoneNumber" TEXT;

-- CreateTable
CREATE TABLE "DriverDetail" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "cnicNumber" TEXT,
    "cnicFrontUrl" TEXT,
    "cnicBackUrl" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "profilePhotoUrl" TEXT,
    "licenseNumber" TEXT,
    "licenseExpiry" TIMESTAMP(3),
    "licenseImageUrl" TEXT,
    "vehicleType" TEXT,
    "vehicleModel" TEXT,
    "registrationNo" TEXT,
    "registrationBook" TEXT,
    "loadCapacity" INTEGER,
    "vehicleImageUrl" TEXT,
    "bankTitle" TEXT,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "easypaisaNumber" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "availableDays" TEXT,
    "workingHours" TEXT,
    "urgentAvailable" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DriverDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactReport" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DriverDetail_driverId_key" ON "DriverDetail"("driverId");

-- AddForeignKey
ALTER TABLE "DriverDetail" ADD CONSTRAINT "DriverDetail_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[serial_number]` on the table `devices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serial_number` to the `devices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "devices" ADD COLUMN     "serial_number" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Active';

-- CreateIndex
CREATE UNIQUE INDEX "devices_serial_number_key" ON "devices"("serial_number");

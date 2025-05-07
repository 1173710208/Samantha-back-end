/*
  Warnings:

  - A unique constraint covering the columns `[firstName,secondName]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[firstName,secondName]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Doctor_firstName_secondName_key" ON "Doctor"("firstName", "secondName");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_firstName_secondName_key" ON "Patient"("firstName", "secondName");

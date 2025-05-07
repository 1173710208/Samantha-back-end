-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_patientId_fkey";

-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "patientId" DROP NOT NULL,
ALTER COLUMN "doctorId" DROP NOT NULL,
ALTER COLUMN "reportDate" DROP NOT NULL,
ALTER COLUMN "subject" DROP NOT NULL,
ALTER COLUMN "contactSource" DROP NOT NULL,
ALTER COLUMN "storeIn" DROP NOT NULL,
ALTER COLUMN "category" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

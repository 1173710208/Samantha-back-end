-- CreateEnum
CREATE TYPE "StoreType" AS ENUM ('Correspondence', 'Investigations');

-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('Admissions_summary', 'Advance_care_planning', 'Allied_health_letter', 'Certificate', 'Clinical_notes', 'Clinical_photograph', 'Consent_form', 'DAS21', 'Discharge_summary', 'ECG', 'Email', 'Form', 'Immunisation', 'Indigenous_PIP', 'Letter', 'Medical_imaging_report', 'MyHealth_registration', 'New_PT_registration_form', 'Pathology_results', 'Patient_consent', 'Record_request', 'Referral_letter', 'Workcover', 'Workcover_consent');

-- CreateEnum
CREATE TYPE "ImportStatus" AS ENUM ('PENDING', 'IMPORTED');

-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "secondName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "phone" TEXT,
    "email" TEXT,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "secondName" TEXT NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "subject" TEXT NOT NULL,
    "contactSource" TEXT NOT NULL,
    "storeIn" "StoreType" NOT NULL,
    "category" "CategoryType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "status" "ImportStatus" NOT NULL DEFAULT 'PENDING',
    "importedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

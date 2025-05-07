// src/document/document.service.ts
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PrismaService } from '../prisma/prisma.service';
import { LlmService } from '../llm/llm.service';
import { ImportStatus } from '@prisma/client';
import { console } from 'inspector';

@Injectable()
export class DocumentService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly prisma: PrismaService,
    private readonly llmService: LlmService,
  ) {}

  async uploadAndSave(file: Express.Multer.File) {
    const fileUrl = await this.supabaseService.uploadFile(file);
    console.log('File URL:', fileUrl);

    const extracted = await this.llmService.extractFieldsFromPdf(file.buffer, file.originalname);
    console.log('Extracted fields:', extracted);

    const [patientFirst, ...patientRest] = extracted.patientName?.split(' ') ?? [];
    const [doctorFirst, ...doctorRest] = extracted.doctorName?.split(' ') ?? [];

    const patient = extracted.patientName
      ? await this.prisma.patient.upsert({
          where: {
            firstName_secondName: {
              firstName: patientFirst,
              secondName: patientRest.join(' ') || '',
            },
          },
          update: {},
          create: {
            firstName: patientFirst,
            secondName: patientRest.join(' ') || '',
          },
        })
      : null;

    const doctor = extracted.doctorName
      ? await this.prisma.doctor.upsert({
          where: {
            firstName_secondName: {
              firstName: doctorFirst,
              secondName: doctorRest.join(' ') || '',
            },
          },
          update: {},
          create: {
            firstName: doctorFirst,
            secondName: doctorRest.join(' ') || '',
          },
        })
      : null;



    const updatedDocument = await this.prisma.document.create({
      data: {
        fileUrl,
        patientId: patient?.id ?? null,
        doctorId: doctor?.id ?? null,
        reportDate: extracted.reportDate ? new Date(extracted.reportDate) : null,
        subject: extracted.subject ?? null,
        contactSource: extracted.contactSource ?? null,
        storeIn: extracted.storeIn ?? null,
        category: extracted.category ?? null,
        status: ImportStatus.PENDING,
        importedAt: new Date(),
      },
    });

    return {
      id: updatedDocument.id,
      fileUrl: updatedDocument.fileUrl,
      status: updatedDocument.status,
      createdAt: updatedDocument.createdAt,
      ...extracted,
    };
  }

  async uploadAndSaveMultiple(files: Express.Multer.File[]) {
    const results: any[] = [];
    for (const file of files) {
      const result = await this.uploadAndSave(file); 
      results.push(result);
    }
    return results;
  }
}
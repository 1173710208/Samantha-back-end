// src/document/document.service.ts
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PrismaService } from '../prisma/prisma.service';
import { ImportStatus } from '@prisma/client';

@Injectable()
export class DocumentService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly prisma: PrismaService,
  ) {}

  async uploadAndSave(file: Express.Multer.File) {
    const fileUrl = await this.supabaseService.uploadFile(file);
    console.log("File uploaded to Supabase:", fileUrl);
    const document = await this.prisma.document.create({
      data: {
        fileUrl,
        status: ImportStatus.PENDING,
      },
    });
    console.log("Document created:", document);
    return {
      id: document.id,
      fileUrl: document.fileUrl,
      status: document.status,
      createdAt: document.createdAt,
    };
  }
}

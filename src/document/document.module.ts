// src/document/document.module.ts
import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { ConfigModule } from '@nestjs/config';
import { DocumentService } from './document.service';
import { SupabaseService } from '../supabase/supabase.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LlmService } from '../llm/llm.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [DocumentController],
  providers: [DocumentService, SupabaseService, LlmService],
})
export class DocumentModule {}
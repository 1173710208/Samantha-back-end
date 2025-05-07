// src/document/document.module.ts
import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { ConfigModule } from '@nestjs/config';
import { DocumentService } from './document.service';
import { SupabaseService } from '../supabase/supabase.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ConfigModule, PrismaModule], 
  controllers: [DocumentController],
  providers: [DocumentService, SupabaseService],
})
export class DocumentModule {}

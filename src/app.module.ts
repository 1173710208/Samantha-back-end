// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DocumentModule } from './document/document.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { LlmService } from './llm/llm.service';

@Module({
  imports: [ConfigModule.forRoot(), DocumentModule, PrismaModule],
  providers: [PrismaService, LlmService],
})
export class AppModule {}

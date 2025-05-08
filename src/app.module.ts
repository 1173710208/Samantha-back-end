// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DocumentModule } from './document/document.module';
import { PatientModule } from './patient/patient.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { LlmService } from './llm/llm.service';

@Module({
  imports: [ConfigModule.forRoot(), DocumentModule, PrismaModule, PatientModule, UserModule],
  providers: [PrismaService, LlmService],
})
export class AppModule {}

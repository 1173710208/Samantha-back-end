// src/patient/patient.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatientService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllPatients() {
    return this.prisma.patient.findMany({
      orderBy: { firstName: 'asc' },
    });
  }

  async getPatientById(id: number) {
    return this.prisma.patient.findUnique({
      where: { id },
      include: { documents: true },
    });
  }
}

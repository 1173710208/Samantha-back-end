// src/user/user.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllDoctors() {
    return this.prisma.doctor.findMany({
      orderBy: { firstName: 'asc' },
    });
  }

  async getDoctorById(id: number) {
    return this.prisma.doctor.findUnique({
      where: { id },
      include: { documents: true },
    });
  }
}

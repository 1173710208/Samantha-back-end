// src/patient/patient.controller.ts

import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PatientService } from './patient.service';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  getAllPatients() {
    return this.patientService.getAllPatients();
  }

  @Get(':id')
  getPatientById(@Param('id', ParseIntPipe) id: number) {
    return this.patientService.getPatientById(id);
  }
}

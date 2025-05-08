// src/user/user.controller.ts

import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('doctors')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllDoctors() {
    return this.userService.getAllDoctors();
  }

  @Get(':id')
  getDoctorById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getDoctorById(id);
  }
}

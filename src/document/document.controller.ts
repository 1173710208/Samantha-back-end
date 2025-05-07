//document.controller.ts
import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { DocumentService } from './document.service';
  
  @Controller('documents')
  export class DocumentController {
    constructor(private readonly documentService: DocumentService) {}
  
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadPdf(@UploadedFile() file: Express.Multer.File) {
      return this.documentService.uploadAndSave(file);
    }
  }
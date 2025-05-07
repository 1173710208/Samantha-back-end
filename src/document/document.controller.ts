//document.controller.ts
import {
    Controller,
    Post,
    UploadedFiles,
    UseInterceptors,
  } from '@nestjs/common';
  import { FilesInterceptor } from '@nestjs/platform-express';
  import { DocumentService } from './document.service';
  
  @Controller('documents')
  export class DocumentController {
    constructor(private readonly documentService: DocumentService) {}
  
    @Post('upload')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadMultiplePdfs(@UploadedFiles() files: Express.Multer.File[]) {
      return this.documentService.uploadAndSaveMultiple(files);
    }
  }
//document.controller.ts
import {
    Controller,
    Post,
    Get,
    Put,
    Param,
    Body,
    ParseIntPipe,
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

    @Get('imported')
    getImportedDocuments() {
      return this.documentService.getDocumentsByStatus('IMPORTED');
    }
  
    @Get('pending')
    getPendingDocuments() {
      return this.documentService.getDocumentsByStatus('PENDING');
    }
  
    @Get(':id')
    getDocumentById(@Param('id', ParseIntPipe) id: number) {
      return this.documentService.getDocumentById(id);
    }
  
    @Put(':id')
    updateDocument(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateData: any,
    ) {
      return this.documentService.updateDocument(id, updateData);
    }
  }
// src/supabase/supabase.service.ts
import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SupabaseService {
  private supabase;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')!, 
    );
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${uuidv4()}.pdf`;

    const { error } = await this.supabase.storage
      .from('documents') 
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw new Error(error.message);

    const { data: publicUrlData } = this.supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  }
}

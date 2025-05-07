import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import OpenAI from 'openai';

@Injectable()
export class LlmService {
  private openai: OpenAI;
  private assistantId: string;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    this.assistantId = this.configService.get<string>('OPENAI_ASSISTANT_ID')!;
  }

  async extractFieldsFromPdf(fileBuffer: Buffer, originalName: string): Promise<any> {
    const tempDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const ext = path.extname(originalName).toLowerCase(); 
    const base = path.basename(originalName, path.extname(originalName)); 
    const safeName = `${Date.now()}-${base}${ext}`;
    const tempPath = path.join(tempDir, safeName);

    fs.writeFileSync(tempPath, fileBuffer);

    const uploadedFile = await this.openai.files.create({
      file: fs.createReadStream(tempPath),
      purpose: 'assistants',
    });

    fs.unlinkSync(tempPath);

    const thread = await this.openai.beta.threads.create();

    await this.openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: `You are a medical assistant AI. Please extract the following fields from the uploaded medical PDF:
    Return a JSON with the following keys:
    {
      "patientName": string,
      "reportDate": string (YYYY-MM-DD),
      "subject": string,
      "contactSource": string,
      "storeIn": "Correspondence" | "Investigations",
      "doctorName": string,
      "category": string (one of predefined list:
        Admissions_summary
        Advance_care_planning 
        Allied_health_letter
        Certificate 
        Clinical_notes
        Clinical_photograph
        Consent_form
        DAS21
        Discharge_summary
        ECG
        Email
        Form
        Immunisation
        Indigenous_PIP
        Letter
        Medical_imaging_report 
        MyHealth_registration
        New_PT_registration_form
        Pathology_results
        Patient_consent
        Record_request 
        Referral_letter
        Workcover
        Workcover_consent)
    }
        If you are not sure about a field, please return null for that field.
        The Patient Name and Doctor Name should be in the format "FirstName LastName".
        Only return a valid JSON object. Do NOT include any explanations, comments, or extra text. Do NOT use markdown formatting like \`\`\`json.`,
      attachments: [
        {
          file_id: uploadedFile.id,
          tools: [{ type: 'file_search' }],
        },
      ],
    });

    const run = await this.openai.beta.threads.runs.create(thread.id, {
      assistant_id: this.assistantId,
    });

    // Poll until the run is complete
    let runStatus = run.status;
    while (runStatus !== 'completed' && runStatus !== 'failed' && runStatus !== 'cancelled') {
      await new Promise((r) => setTimeout(r, 2000));
      const currentRun = await this.openai.beta.threads.runs.retrieve(thread.id, run.id);
      runStatus = currentRun.status;
    }

    if (runStatus !== 'completed') {
      throw new Error(`Assistant run failed with status: ${runStatus}`);
    }

    const messages = await this.openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data.find((msg) => msg.role === 'assistant');

    const textBlock = lastMessage?.content.find(
      (block) => block.type === 'text'
    ) as { type: 'text'; text: { value: string } } | undefined;

    const content = textBlock?.text?.value;
    console.log('Assistant raw response:', content);
    try {
      return JSON.parse(content || '{}');
    } catch (e) {
      throw new Error('Failed to parse JSON response from assistant');
    }
  }
}

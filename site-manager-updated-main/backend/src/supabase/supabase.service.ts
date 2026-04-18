import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private client: SupabaseClient;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    const url = this.config.get<string>('SUPABASE_URL');
    const serviceKey = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!url || !serviceKey) {
      this.logger.warn(
        'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. ' +
        'Update backend/.env with your Supabase credentials before making API calls.',
      );
    }

    // Use the service-role key so the backend can bypass Row Level Security
    this.client = createClient(url ?? '', serviceKey ?? '', {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  /**
   * Generate a short-lived signed URL for a private storage object.
   * @param bucket - Supabase storage bucket name
   * @param path   - Object path inside the bucket
   * @param expiresInSeconds - URL lifetime (default 60 min)
   */
  async getSignedUrl(
    bucket: string,
    path: string,
    expiresInSeconds = 3600,
  ): Promise<string | null> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .createSignedUrl(path, expiresInSeconds);

    if (error) {
      this.logger.error(`Failed to create signed URL for ${bucket}/${path}: ${error.message}`);
      return null;
    }
    return data.signedUrl;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class QrScanService {
  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Look up a QR code record by application_id and return
   * the full volunteer deployment details for the site manager.
   */
  async verifyByApplication(applicationId: string) {
    const client = this.supabase.getClient();

    // 1. Find the QR code record
    const { data: qrRecord, error: qrErr } = await client
      .from('qr_codes')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (qrErr || !qrRecord) {
      throw new NotFoundException('QR code not found for this application');
    }

    // 2. Fetch the volunteer profile
    const { data: profile } = await client
      .from('user_profiles')
      .select('auth_user_id, first_name, last_name, phone, address, barangay, municipality, province, profile_photo_key, role')
      .eq('auth_user_id', qrRecord.volunteer_auth_id)
      .single();

    // 3. Fetch the application details
    const { data: application } = await client
      .from('volunteer_applications')
      .select('id, role_id, status, applied_at')
      .eq('id', applicationId)
      .single();

    // 4. Fetch the volunteer role
    let volRole: any = null;
    if (application?.role_id) {
      const { data } = await client
        .from('volunteer_roles')
        .select('id, title, campaign_id, location, start_date, end_date, status')
        .eq('id', application.role_id)
        .single();
      volRole = data;
    }

    // 5. Fetch the campaign
    let campaign: any = null;
    const campaignId = qrRecord.campaign_id || volRole?.campaign_id;
    if (campaignId) {
      const { data } = await client
        .from('bh_campaigns')
        .select('id, title, description, type, status')
        .eq('id', campaignId)
        .single();
      campaign = data;
    }

    return {
      verified: true,
      qr_type: qrRecord.qr_type,
      issued_at: qrRecord.created_at,
      volunteer: profile
        ? {
            name: `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim(),
            phone: profile.phone ?? '',
            address: profile.municipality
              ? `${profile.barangay ?? ''}, ${profile.municipality}, ${profile.province ?? ''}`.replace(/^, |, $/g, '')
              : profile.address ?? '',
            role_in_system: profile.role,
          }
        : null,
      role: volRole?.title ?? 'Volunteer',
      campaign: campaign
        ? { id: campaign.id, title: campaign.title, status: campaign.status }
        : null,
      deployment: volRole
        ? {
            location: volRole.location,
            start_date: volRole.start_date,
            end_date: volRole.end_date,
            status: volRole.status,
          }
        : null,
      application_status: application?.status ?? 'unknown',
    };
  }
}

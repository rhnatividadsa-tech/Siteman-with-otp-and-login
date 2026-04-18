import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class CampaignsService {
  constructor(private supabase: SupabaseService) {}

  private get db() {
    return this.supabase.getClient();
  }

  async findAll(type?: string, status?: string) {
    let query = this.db
      .from('bh_campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    if (type) query = query.eq('type', type);
    if (status) query = query.eq('status', status);

    const { data: campaigns, error } = await query;
    if (error) throw new BadRequestException(error.message);
    const items = campaigns ?? [];
    if (items.length === 0) return [];

    const orgIds = [...new Set(items.map((c) => c.org_id).filter(Boolean))];
    const campaignIds = items.map((c) => c.id);

    const [orgsRes, rolesRes] = await Promise.all([
      orgIds.length
        ? this.db.from('organizations').select('id, name, type, contact_email').in('id', orgIds)
        : Promise.resolve({ data: [] as any[], error: null }),
      this.db.from('volunteer_roles').select('id, campaign_id, title, slots_total, slots_filled, status').in('campaign_id', campaignIds),
    ]);
    if (orgsRes.error) throw new BadRequestException(orgsRes.error.message);
    if (rolesRes.error) throw new BadRequestException(rolesRes.error.message);

    const orgMap = new Map((orgsRes.data ?? []).map((o) => [o.id, o]));
    const rolesMap: Record<string, any[]> = {};
    for (const r of rolesRes.data ?? []) {
      if (!rolesMap[r.campaign_id]) rolesMap[r.campaign_id] = [];
      rolesMap[r.campaign_id].push(r);
    }

    return items.map((c) => ({
      ...c,
      organizations: orgMap.get(c.org_id) ?? null,
      volunteer_roles: rolesMap[c.id] ?? [],
    }));
  }

  async findOne(id: string) {
    const { data: campaign, error } = await this.db
      .from('bh_campaigns')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !campaign) throw new NotFoundException(`Campaign ${id} not found`);

    const [orgRes, rolesRes, donationsRes] = await Promise.all([
      (campaign as any).org_id
        ? this.db.from('organizations').select('id, name, type, contact_email, contact_phone, address, verified').eq('id', (campaign as any).org_id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      this.db.from('volunteer_roles').select('id, title, description, requirements, slots_total, slots_filled, location, start_date, end_date, status').eq('campaign_id', id),
      this.db.from('donations').select('id, amount, currency, status, donated_at').eq('campaign_id', id),
    ]);

    let coverSignedUrl: string | null = null;
    if ((campaign as any).cover_image_key) {
      coverSignedUrl = await this.supabase.getSignedUrl('campaign-covers', (campaign as any).cover_image_key);
    }

    return {
      ...campaign,
      organizations: orgRes.data ?? null,
      volunteer_roles: rolesRes.data ?? [],
      donations: donationsRes.data ?? [],
      cover_signed_url: coverSignedUrl,
    };
  }
}

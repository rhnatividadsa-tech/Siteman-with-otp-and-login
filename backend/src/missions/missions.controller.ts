import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { MissionsService, ActivateMissionDto } from './missions.service';

@Controller('missions')
export class MissionsController {
  constructor(private readonly service: MissionsService) {}

  /** POST /api/missions/activate — activate a new mission session */
  @Post('activate')
  activate(
    @Body() dto: ActivateMissionDto & { activated_by?: string },
  ) {
    const { activated_by, ...missionDto } = dto;
    return this.service.activateMission(missionDto, activated_by ?? 'site-manager');
  }

  /** GET /api/missions/volunteer-summary — real-time volunteer summary */
  @Get('volunteer-summary')
  getVolunteerSummary(@Query('campaign_id') campaignId?: string) {
    return this.service.getVolunteerSummary(campaignId);
  }
}

import { Controller, Get, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly service: CampaignsService) {}

  @Get()
  findAll(@Query('type') type?: string, @Query('status') status?: string) {
    return this.service.findAll(type, status);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }
}

import { Controller, Get, Param } from '@nestjs/common';
import { QrScanService } from './qr-scan.service';

@Controller('qr-scan')
export class QrScanController {
  constructor(private readonly qrScanService: QrScanService) {}

  /**
   * GET /api/qr-scan/:applicationId
   * Site manager scans a QR code → frontend extracts application_id → calls this.
   * Returns full volunteer deployment details for verification.
   */
  @Get(':applicationId')
  verify(@Param('applicationId') applicationId: string) {
    return this.qrScanService.verifyByApplication(applicationId);
  }
}

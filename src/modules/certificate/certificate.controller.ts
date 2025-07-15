import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { UserGuard } from 'src/common/guards/user.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { User } from '../user/entities/user.entity';

@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}
    @UseGuards(UserGuard)
    @Post('level/:levelId')
    async generateCertificate(
      @Param('levelId') levelId: number,
      @CurrentUser() user: User
    ) {
      return this.certificateService.generateCertificate(user.id, levelId);
    }
}
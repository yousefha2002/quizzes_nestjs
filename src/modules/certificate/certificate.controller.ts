import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { UserGuard } from 'src/common/guards/user.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { User } from '../user/entities/user.entity';
import { Serilaize } from 'src/common/interceptors/serialize.interceptor';
import { CertificateDto } from './dto/certificate.dto';

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

    @Serilaize(CertificateDto)
    @UseGuards(UserGuard)
    @Get(':certificateId')
    async getCertificate(@Param('certificateId') certificateId:number,@CurrentUser() user:User)
    {
      return this.certificateService.getCertificate(user.id,certificateId)
    }
}
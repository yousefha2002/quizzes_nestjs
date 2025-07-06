import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { CertificateProvider } from './providers/certificate.provider';

@Module({
  controllers: [CertificateController],
  providers: [CertificateService,...CertificateProvider],
})
export class CertificateModule {}

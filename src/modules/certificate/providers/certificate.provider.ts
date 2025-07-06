import { repositories } from 'src/common/enums/repositories';
import { Certificate } from '../entities/certificate.entity';

export const CertificateProvider = [
    {
        provide: repositories.certificate_repository,
        useValue: Certificate,
    },
];

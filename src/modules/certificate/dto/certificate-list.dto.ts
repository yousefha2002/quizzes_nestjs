import { Expose, Type } from "class-transformer"
import { LevelInfoDto } from "src/modules/level/dto/level-info.dto"

export class CertificateListDto {
    @Expose()
    id:number

    @Expose()
    obtainedAt:string

    @Expose()
    @Type(() => LevelInfoDto)
    level:LevelInfoDto
}

export class PaginatedCertificateListDto{
    @Expose()
    @Type(() => CertificateListDto)
    certificates:CertificateListDto[]

    @Expose()
    totalPages:number
}
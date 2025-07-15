import { Expose, Type } from "class-transformer";
import { LevelInfoDto } from "src/modules/level/dto/level-info.dto";

class UserInfo {
    @Expose()
    name:string

    @Expose()
    id:number
}

export class CertificateDto {
    @Expose()
    id:number

    @Expose()
    obtainedAt:string

    @Expose()
    @Type(() => LevelInfoDto)
    level:LevelInfoDto

    @Expose()
    @Type(()=>UserInfo)
    user:UserInfo
}
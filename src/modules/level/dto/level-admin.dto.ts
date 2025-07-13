import { Expose } from 'class-transformer';
import { LevelBaseDto } from './level-base.dto';

export class LevelAdminDto extends LevelBaseDto{
  @Expose()
  isPublished: boolean;
}

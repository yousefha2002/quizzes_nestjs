import { Controller } from '@nestjs/common';
import { LevelProgressService } from './level-progress.service';

@Controller('level-progress')
export class LevelProgressController {
  constructor(private readonly levelProgressService: LevelProgressService) {}
}

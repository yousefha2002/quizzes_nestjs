import { repositories } from 'src/common/enums/repositories';
import { User } from '../entities/user.entity';

export const UserProvider = [
  {
    provide: repositories.user_repository,
    useValue: User,
  },
];
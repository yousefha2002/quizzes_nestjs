import { Expose, Type } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  createdAt: string;
}

export class PaginatedUserDto {
  @Expose()
  @Type(() => UserDto)
  users: UserDto[];

  @Expose()
  totalPages: number;
}

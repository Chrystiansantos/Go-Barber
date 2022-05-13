import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import Users from '../infra/typeorm/entities/User';

import IUserRepository from '../repositories/IUsersRepositories';

interface IRequest {
  user_id: string;
}

@injectable()
export default class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<Users> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }
    return user;
  }
}

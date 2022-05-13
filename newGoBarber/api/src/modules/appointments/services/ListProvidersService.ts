import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepositories';
import ICacheProvider from '@shared/container/Provider/CacheProvider/model/ICacheProvider';

interface IRequest {
  user_id: string;
}
@injectable()
export default class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User[]> {
    let user = await this.cacheProvider.recovery<User[]>(
      `providers-list:${user_id}`,
    );
    if (!user) {
      user = await this.userRepository.findAllProviders({
        except_user_id: user_id,
      });
      console.log('A query no banco foi executada');
      await this.cacheProvider.save(`providers-list:${user_id}`, user);
    }

    return user;
  }
}

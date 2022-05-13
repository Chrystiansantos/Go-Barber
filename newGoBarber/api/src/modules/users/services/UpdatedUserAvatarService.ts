import Users from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IStorageProvider from '@shared/container/Provider/StorageProvider/models/IStorageProvider';
import IUsersRepository from '../repositories/IUsersRepositories';

interface IRequest {
  user_id: string;
  avatarFileName: string;
}
@injectable()
class UpdatedUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ user_id, avatarFileName }: IRequest): Promise<Users> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) throw new AppError('Only authenticated can change avatar');

    if (user.avatar) {
      // Aqui vou verificar se existe este arquivo no storage
      await this.storageProvider.deleteFile(user.avatar);
    }
    const filename = await this.storageProvider.saveFile(avatarFileName);
    user.avatar = filename;

    user.avatar = avatarFileName;
    await this.usersRepository.save(user);
    return user;
  }
}

export default UpdatedUserAvatarService;

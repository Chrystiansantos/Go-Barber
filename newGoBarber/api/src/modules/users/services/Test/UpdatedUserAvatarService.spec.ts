import FakeStorageProvicer from '@shared/container/Provider/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../../repositories/fakes/FakeUserRepositories';
import UpdateUserAvatarService from '../UpdatedUserAvatarService';

let fakeUsersRepository: FakeUserRepository;
let fakeStorageProvider: FakeStorageProvicer;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdatedUserAvatarService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeStorageProvider = new FakeStorageProvicer();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to change user avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Chrystian Santos',
      email: 'chrystian@gmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar from nom existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatarFileName: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be delete old avatar when updateting new one', async () => {
    // irei buscar a funcao deleteFIle dentro do provider
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'Chrystian Santos',
      email: 'chrystian@gmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });
    // toHaveBeenCalledWith ira verificar qual foi o parametro passado para o deleteFile
    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');

    expect(user.avatar).toBe('avatar.jpg');
  });
});

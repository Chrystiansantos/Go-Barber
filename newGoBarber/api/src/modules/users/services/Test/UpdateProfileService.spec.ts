import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../../repositories/fakes/FakeUserRepositories';
import UpdateProfileService from '../UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Chrystian',
      email: 'chrystian@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Teste',
      email: 'teste@gmail.com',
    });
    expect(updatedUser.name).toBe('Teste');
    expect(updatedUser.email).toBe('teste@gmail.com');
  });
  it('should not be able to change to another use email', async () => {
    await fakeUsersRepository.create({
      name: 'chrystian',
      email: 'chrystian@gmail.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'teste',
      email: 'teste@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        email: 'chrystian@gmail.com',
        name: 'Teste',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('shoul not be able show the profile from non-existing user', async () => {
    expect(
      updateProfileService.execute({
        user_id: 'user_id_does_not_existis',
        name: 'Chrystian',
        email: 'chrsytian@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Chrystian',
      email: 'chrystian@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Teste',
      email: 'teste@gmail.com',
      password: '123123',
      old_password: '123456',
    });
    expect(updatedUser.name).toBe('Teste');
    expect(updatedUser.password).toBe('123123');
  });
  it('should be able to update the password without oldPassoword', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Chrystian',
      email: 'chrystian@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Teste',
        email: 'teste@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Chrystian',
      email: 'chrystian@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        email: 'teste@gmail.com',
        name: 'Teste',
        password: '123123',
        old_password: 'wrong-old-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

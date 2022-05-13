import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../../repositories/fakes/FakeUserRepositories';
import FakeUserTokenRepository from '../../repositories/fakes/FakeUsertTokensRepository';
import ResetPasswordService from '../ResetPasswordService';
import FakeHashProvider from '../../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokenRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokenRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Chrystian',
      email: 'chrystian@gmail.com',
      password: '123456',
    });
    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      password: '123123',
      token,
    });
    const updatedUser = await fakeUsersRepository.findById(user.id);
    // verifico se a funcao foi chamada com o parametro 123123
    expect(generateHash).toHaveBeenCalledWith('123123');
    expect(updatedUser?.password).toBe('123123');
  });

  it('should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'non-exists-token',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existing-user',
    );
    await expect(
      resetPasswordService.execute({
        token,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password if passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      email: 'chrystian@gmail.com',
      name: 'Chrystian',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    // mockiImplementation quando meu codigo chamar a funcao date.NOw ele ira retornar esse valor
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({ password: '123123', token }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

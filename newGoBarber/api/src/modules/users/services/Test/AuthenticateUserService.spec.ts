import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepositories';
import FakeHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';
import AuthenticateService from '@modules/users/services/AuthenticateUserService';
import CreateUserService from '@modules/users/services/CreateUserService';
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/Provider/CacheProvider/fakes/FakeCacheProvider';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUserService: AuthenticateService;
let createUserService: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;
describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    authenticateUserService = new AuthenticateService(
      fakeUserRepository,
      fakeHashProvider,
    );
    createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await createUserService.execute({
      name: 'Chrystian Santos',
      email: 'chrystian@gmail.com',
      password: '123456',
    });
    const response = await authenticateUserService.execute({
      email: 'chrystian@gmail.com',
      password: '123456',
    });
    // VERIRICO SE OS OBJETOS SAO IGUAIS
    expect(response.user).toEqual(user);
    expect(response).toHaveProperty('token');
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUserService.execute({
        email: 'chrystian@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong passowrd', async () => {
    await createUserService.execute({
      name: 'Chrystian Santos',
      email: 'chrystian@gmail.com',
      password: '12345623',
    });

    // VERIRICO SE OS OBJETOS SAO IGUAIS
    await expect(
      authenticateUserService.execute({
        email: 'chrystian@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

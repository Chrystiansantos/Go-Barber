import FakeUserRepositories from '@modules/users/repositories/fakes/FakeUserRepositories';
import CreateUserService from '@modules/users/services/CreateUserService';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/Provider/CacheProvider/fakes/FakeCacheProvider';

let fakeUserRepository: FakeUserRepositories;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUserService: CreateUserService;
describe('Createuser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepositories();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('Should be able to create a new User', async () => {
    const user = await createUserService.execute({
      name: 'Chrystian',
      email: 'chrystian@gmail.com',
      password: 'olaMundo',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another', async () => {
    createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );

    await createUserService.execute({
      name: 'Chrystian',
      email: 'chrystian@gmail.com',
      password: 'olaMundo',
    });

    await expect(
      createUserService.execute({
        name: 'Chrystian',
        email: 'chrystian@gmail.com',
        password: 'olaMundo',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

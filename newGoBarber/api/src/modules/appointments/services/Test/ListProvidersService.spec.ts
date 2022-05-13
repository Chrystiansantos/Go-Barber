import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepositories';
import FakeCacheProvider from '@shared/container/Provider/CacheProvider/fakes/FakeCacheProvider';

import ListProvidersService from '../ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;
describe('ListProvidersService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProvidersService = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Chrystian',
      email: 'chrystian@gmail.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'teste',
      email: 'teste@gmail.com',
      password: '123456',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'teste 1',
      email: 'teste1@gmail.com',
      password: '123456',
    });

    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});

import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../../repositories/fakes/FakeUserRepositories';
import ShowProfileService from '../ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfileService = new ShowProfileService(fakeUsersRepository);
  });
  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Chrystian',
      email: 'chrystian@gmail.com',
      password: '123456',
    });
    const profile = await showProfileService.execute({ user_id: user.id });

    expect(profile.name).toBe('Chrystian');
    expect(profile.email).toBe('chrystian@gmail.com');
  });

  it('should be able to show the profile from non-existing user', async () => {
    await expect(
      showProfileService.execute({ user_id: 'user_id_does_not_exists' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

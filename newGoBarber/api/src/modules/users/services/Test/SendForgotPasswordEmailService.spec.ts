// import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/Provider/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUserTokenRepository from '@modules/users/repositories/fakes/FakeUsertTokensRepository';
import FakeUsersRepository from '../../repositories/fakes/FakeUserRepositories';
import SendForgotPasswordEmailService from '../SendForgotPasswordEmailService';

let fakeUserRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokenRepository: FakeUserTokenRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('sendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserRepository = new FakeUsersRepository();
    fakeUserTokenRepository = new FakeUserTokenRepository();
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokenRepository,
    );
  });

  it('should be able to recover the password in using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUserRepository.create({
      name: 'Chrystian',
      email: 'chrystian@gmail.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({ email: 'chrystian@gmail.com' });
    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'chrystian@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generatedToken = jest.spyOn(fakeUserTokenRepository, 'generate');

    const user = await fakeUserRepository.create({
      name: 'chrystian',
      email: 'chrystian@gmail.com',
      password: '123456',
    });
    await sendForgotPasswordEmail.execute({
      email: 'chrystian@gmail.com',
    });
    expect(generatedToken).toHaveBeenCalledWith(user.id);
  });
});

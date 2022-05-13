import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationRepository';
import FakeCacheProvider from '@shared/container/Provider/CacheProvider/fakes/FakeCacheProvider';

import AppError from '@shared/errors/AppError';
import CreateAppointmentService from '../CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;
let fakeNotificationRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
// describe cria como se  fosse uma categoria pra facilitar a vizualizaca dos resultados
// geralmente passo o nome do service sem o service
describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 12, 12).getTime();
    });

    const appointment = await createAppointmentService.execute({
      date: new Date(2020, 10, 12, 13),
      user_id: 'user-id',
      provider_id: '123123',
    });
    // ira verificar se existe essa propriedade
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123');
  });
  it('should not be able to create two appointments on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 12, 12).getTime();
    });

    const appointmentDate = new Date(2020, 10, 12, 13);

    await createAppointmentService.execute({
      date: appointmentDate,
      user_id: 'user-id',
      provider_id: '123123',
    });
    // Dessa forma eu espero que a funcao rejeite um erro e esse erro seja
    // uma instance de AppError
    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        user_id: 'user-id',
        provider_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to acreatea an appointments a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 12, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 10, 12, 11),
        provider_id: 'provider_id',
        user_id: 'user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 12, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 10, 12, 13),
        user_id: 'provider_id',
        provider_id: 'provider_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointment before 08:am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 12, 12).getTime();
    });
    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 10, 13, 7),
        user_id: 'user_id',
        provider_id: 'provider_id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 10, 13, 18),
        user_id: 'user_id',
        provider_id: 'provider_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

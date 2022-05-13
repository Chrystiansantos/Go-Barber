import { container } from 'tsyringe';

import '@modules/users/providers';
import './Provider';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepositories';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepositories';

import IUserTokensRepository from '@modules/users/repositories/ITokenUserRespository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokenRepository';

import NotificationRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationRepository';

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentRepository',
  AppointmentRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokenRepository',
  UserTokensRepository,
);

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationRepository,
);

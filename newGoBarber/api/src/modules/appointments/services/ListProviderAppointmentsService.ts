import ICacheProvider from '@shared/container/Provider/CacheProvider/model/ICacheProvider';
import { classToClass } from 'class-transformer';
import { inject, injectable } from 'tsyringe';
import Appointment from '../infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}
@injectable()
export default class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    day,
    month,
    year,
    provider_id,
  }: IRequest): Promise<Appointment[]> {
    const cacheKey = `provider-appointment:${provider_id}-${year}-${month}-${day}`;
    let appointments = await this.cacheProvider.recovery<Appointment[]>(
      cacheKey,
    );
    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllInDayFromProvider(
        {
          provider_id,
          year,
          month,
          day,
        },
      );
      console.log('buscou do banco');
      await this.cacheProvider.save(cacheKey, classToClass(appointments));
    }
    return appointments;
  }
}

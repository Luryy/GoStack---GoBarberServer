import { injectable, inject } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
// import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
// import { classToClass } from 'class-transformer';

interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

@injectable()
class ListProviderMonthAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository, // @inject('CacheProvider') // private cacheProvider: ICacheProvider,
    ) {}

    public async execute({
        provider_id,
        day,
        month,
        year,
    }: IRequest): Promise<Appointment[]> {
        // let appointments = await this.cacheProvider.recover<Appointment[]>(
        //     `provider-appointments:${provider_id}:${day}-${month}-${year}`,
        // );

        // if (!appointments) {
        const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
            {
                provider_id,
                day,
                month,
                year,
            },
        );

        // await this.cacheProvider.save({
        //     key: `provider-appointments:${provider_id}:${day}-${month}-${year}`,
        //     value: appointments, // value: classToClass(appointments),
        // });
        // }

        return appointments;
    }
}

export default ListProviderMonthAvailabilityService;

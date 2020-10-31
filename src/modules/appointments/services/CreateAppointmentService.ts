import { startOfHour, isBefore, getHours, parseISO, format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppError from '@shared/errors/AppError';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
    provider_id: string;
    user_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentsService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('NotificationsRepository')
        private notificationsRepository: INotificationsRepository,
    ) {}

    public async execute({
        provider_id,
        user_id,
        date,
    }: IRequestDTO): Promise<Appointment> {
        const appointmentDate = startOfHour(parseISO(String(date)));

        if (isBefore(appointmentDate, Date.now())) {
            throw new AppError("You can't book appointments in past dates");
        }

        if (provider_id === user_id) {
            throw new AppError("You can't book appointments with yourself");
        }

        if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
            throw new AppError(
                "You can't book appointments outside commercial time",
            );
        }

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmentInSameDate) {
            throw new AppError('The appointment is already booked');
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            user_id,
            date: appointmentDate,
        });

        const dateFormatted = format(
            appointmentDate,
            "dd/MM/yyyy 'às' HH:mm'h'",
        );

        await this.notificationsRepository.create({
            recipient_id: provider_id,
            content: `Novo agendamento para ${dateFormatted}`,
        });

        return appointment;
    }
}

export default CreateAppointmentsService;

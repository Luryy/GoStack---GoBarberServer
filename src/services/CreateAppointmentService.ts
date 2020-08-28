// import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import AppError from '../errors/AppError';

interface RequestDTO {
    provider: string;
    date: Date;
}

class CreateAppointmentsService {
    public async execute({ provider, date }: RequestDTO): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(
            AppointmentsRepository,
        );

        // const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await appointmentsRepository.findByDate(
            date,
        );

        if (findAppointmentInSameDate) {
            throw new AppError('The appointment is already booked');
        }

        const appointment = appointmentsRepository.create({
            provider,
            date,
        });

        await appointmentsRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentsService;

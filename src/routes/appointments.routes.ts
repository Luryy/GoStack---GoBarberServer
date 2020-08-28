import { Router } from 'express';

import { getCustomRepository } from 'typeorm';
import CreateAppointmentService from '../services/CreateAppointmentService';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();

appointmentsRouter.get('/', async (request, response) => {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointments = await appointmentsRepository.find();

    return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
    const { provider, date } = request.body;

    const createAppointment = new CreateAppointmentService();

    const appoinment = await createAppointment.execute({
        date,
        provider,
    });

    response.json(appoinment);
});

export default appointmentsRouter;

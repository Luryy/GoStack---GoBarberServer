import { hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestDTO {
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUsersService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute({
        name,
        email,
        password,
    }: IRequestDTO): Promise<User> {
        const findIfEmailExist = await this.usersRepository.findByEmail(email);

        if (findIfEmailExist) {
            throw new AppError('Email already in use');
        }

        const hashedPassword = await hash(password, 8);

        const user = this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        return user;
    }
}

export default CreateUsersService;

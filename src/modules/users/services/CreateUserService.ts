import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

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

        @inject('HashProvider')
        private hashProvider: IHashProvider,
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

        const hashedPassword = await this.hashProvider.generateHash(password);

        const user = this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        return user;
    }
}

export default CreateUsersService;

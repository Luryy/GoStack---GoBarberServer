import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import authConfig from '@config/auth';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

@injectable()
class AuthenticateUsersService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ email, password }: IRequestDTO): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Incorrect Email/Password combination');
        }

        const passwordMached = await this.hashProvider.compareHash(
            password,
            user.password,
        );

        if (!passwordMached) {
            throw new AppError('Incorrect Email/Password combination');
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return {
            user,
            token,
        };
    }
}

export default AuthenticateUsersService;

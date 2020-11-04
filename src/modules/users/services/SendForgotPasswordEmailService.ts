import path from 'path';
// import { APP_WEB_URL } from '@shared/utils/environment';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IMailProvider from '@shared/containers/providers/MailProvider/models/IMailProvider';

import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

interface IRequest {
    email: string;
}
@injectable()
class SendForgotPasswordEmailService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('MailProvider')
        private mailProvider: IMailProvider,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,
    ) {}

    public async execute({ email }: IRequest): Promise<void> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Email not exists', 401);
        }

        const { token } = await this.userTokensRepository.generate(user.id);

        await this.mailProvider.sendMail({
            to: {
                name: user.name, // remove
                email: user.email,
            },
            subject: '[GoBarber] Recuperação de senha',
            templateData: {
                file: path.resolve(
                    __dirname,
                    '..',
                    'views',
                    'forgot_password.hbs',
                ),
                variables: {
                    name: user.name,
                    // link: `${APP_WEB_URL}/reset-password?token=${token}`,
                    link: `http://localhost:3333/reset-password?token=${token}`,
                },
            },
        });
    }
}

export default SendForgotPasswordEmailService;

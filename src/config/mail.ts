// import {
//   MAIL_DRIVER,
//   MAIL_OWNER,
//   MAIL_DOMAIN,
// } from '@shared/utils/environment';

interface IMailConfig {
    driver: 'ethereal' | 'ses';
    defaults: {
        from: {
            name: string;
            email: string;
        };
    };
}

export default {
    driver: process.env.MAIL_DRIVER || 'ethereal',
    defaults: {
        from: {
            name: process.env.MAIL_OWNER,
            email: process.env.MAIL_DOMAIN,
        },
    },
} as IMailConfig;

import path from 'path';
import multer, { StorageEngine } from 'multer';
import crypto from 'crypto';

interface IUploadConfig {
    driver: 's3' | 'disk';
    tmpFolder: string;
    uploadsFolder: string;
    multer: {
        storage: StorageEngine;
    };

    config: {
        // disk: {};
        aws: {
            bucket: string;
        };
    };
}

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');
const uploadsFolder = path.resolve(tmpFolder, 'uploads');

export default {
    driver: process.env.STORAGE_DRIVER,
    tmpFolder,
    uploadsFolder,

    multer: {
        storage: multer.diskStorage({
            destination: tmpFolder,
            filename(request, file, callback) {
                const fileHash = crypto.randomBytes(16).toString('hex');
                const fileName = `${fileHash}-${file.originalname}`;

                return callback(null, fileName);
            },
        }),
    },

    config: {
        // disk: {},
        aws: {
            bucket: 'gobarber-lucasyuri',
        },
    },
} as IUploadConfig;

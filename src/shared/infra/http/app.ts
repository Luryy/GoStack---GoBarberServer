import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import { errors } from 'celebrate';

import upload from '@config/upload';
import AppError from '@shared/errors/AppError';
import '@shared/infra/typeorm';
import '@shared/containers';
import routes from './routes';

const app = express();

app.use(express.json());
app.use('/files', express.static(upload.uploadsFolder));
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    console.error(err);

    return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
});

export default app;

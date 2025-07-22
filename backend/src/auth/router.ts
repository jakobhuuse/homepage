import express from 'express';

import { login, register } from './controller/auth';

export default (router: express.Router) => {
    const authRouter = express.Router();

    authRouter.post('/register', register);
    authRouter.post('/login', login);

    router.use('/auth', authRouter);
}
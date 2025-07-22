import express from 'express';
import auth from './auth/router';

const router = express.Router();

export default (): express.Router => {
    auth(router);
    return router;
};
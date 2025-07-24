import { Router } from 'express';
import { userRoutes } from '../domains/users/controllers/UserController';

const router = Router();

router.use('/users', userRoutes);

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

export default router;
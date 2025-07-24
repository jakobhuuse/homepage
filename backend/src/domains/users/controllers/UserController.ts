import { Request, Response, Router } from 'express';
import { UserService } from '../services/UserService';

const userService = new UserService();
const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    res.json(user);
});

router.post('/', async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.updateUser(id, req.body);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json(user);
});

router.delete('/:id', async (req: Request, res: Response) => {
  await userService.deleteUser(req.params.id);
  res.status(204).send();
});

export { router as userRoutes };
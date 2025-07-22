import { createUser, getUserByEmail } from '../db/users';
import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).send('Missing required fields');
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.status(409).send('User already exists');
        }

        const user = await createUser({
            username,
            email,
            password: await bcrypt.hash(password, 10) 
        });

        const token = jwt.sign({ username: user.email }, 'secretKey', { expiresIn: '1h' });

        return res.status(201).json(token).end();
    } catch (error) {
        console.log(error)
        return res.sendStatus(400);
    }
}

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('Missing required fields');
        }

        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Invalid credentials');
        }

        const token = jwt.sign({ username: user.email }, 'secretKey', { expiresIn: '1h' });
        
        return res.status(200).json(token).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './shared/routes';
import { AppDataSource } from './config/data-source';
import http from 'http';
import { Server as SocketIOServer } from "socket.io";


AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server)

dotenv.config();
app.use(cors({
    credentials: true,
}))
app.use(express.json());
app.use('/api', router)

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`);
});

export { io };

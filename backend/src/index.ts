import express from 'express';
import swaggerjsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './shared/routes';
import { AppDataSource } from './config/data-source';
import http from 'http';
import { Server as SocketIOServer } from "socket.io";
import { swaggerOptions } from './config/swagger';


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
const swaggerDocs = swaggerjsdoc(swaggerOptions)

dotenv.config();
app.use(cors({
    credentials: true,
}))
app.use(express.json());
app.use('/api', router)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
});

app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`);
});

export { io };

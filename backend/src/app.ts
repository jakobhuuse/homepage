import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
import dotenv from 'dotenv';


// Initialize the Express application
const app = express();

dotenv.config();
app.use(cors({
    credentials: true,
}))
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/api', router())

// Connect to MongoDB
const mongo_url = process.env.DB_URL
mongoose.Promise = Promise;
mongoose.connect(mongo_url)
mongoose.connection.on('error', (err: Error) => {
    console.log(err); })

// Run the server
const server = http.createServer(app);
const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log('Server is running on http://localhost:' + port);
});


module.exports = app;
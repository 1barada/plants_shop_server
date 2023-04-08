import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRouter from './routes/authRouter.js';
import productRouter from './routes/productRouter.js';
import profileRouter from './routes/profileRouter.js';
import path from 'path';
import __dirname from './__dirname.js';

const app = express();
dotenv.config();
mongoose.set('strictQuery', false);

app.use(express.json());
app.use(cors());

const port = process.env.PORT ?? 3001;

app.listen(port, async () => {
    console.log(`Server started on port: ${port}`)

    await mongoose.connect(`mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@cluster0.mqr4fau.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
        .then(() => console.log('DB connected'))
        .catch(error => {
            console.log(error);
        });
});

app.use('/auth', authRouter);
app.use('/product', productRouter);
app.use('/profile', profileRouter);
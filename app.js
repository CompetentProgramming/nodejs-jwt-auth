import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './router/user-router.js'
dotenv.config();

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use('/auth', userRouter);

async function start() {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nxglt.mongodb.net/node-js-auth?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });

        app.listen(3000, () => {
            console.log('APP is running');
        });

    } catch (err) {
        console.log(err);
    }
}

start();
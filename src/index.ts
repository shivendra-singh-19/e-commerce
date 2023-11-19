import fs from 'fs';
import { UserAccountRouter } from './Routes/routes';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

const configFile = fs.readFileSync(__dirname+'/../config/config.development.json', 'utf-8');
export const config = JSON.parse(configFile);

const { server, database } = config;
const { port } = server;
const { url, name } = database;
mongoose.connect(`${url}/${name}`);

const app = express();
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
    res.send("Running");
})

app.use('/user', UserAccountRouter);

app.listen(port, (): void => {
    console.log(`Server Running at ${port}`);
});
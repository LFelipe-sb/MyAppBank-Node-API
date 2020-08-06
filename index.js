import express from 'express';
import { promises as fs} from 'fs';
import accountRouter from './Routes/accounts.js';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import {swaggerDocument} from './doc.js'

import winston from 'winston';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use('/account', accountRouter);

const {combine, printf, timestamp, label} = winston.format;
const myformat = printf(({level, message, label, timestamp}) => {
    return `${timestamp} [${label}] -> ${level}: ${message}`;
});

global.logger = winston.createLogger({
    level: "silly",
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({filename: "my-bank-api.log"})
    ],
    format: combine(
        label({label: "my-bank-api"}),
        timestamp(),
        myformat
    )
});

app.listen(3001, async() => {
    try{
        await fs.readFile('accounts.json');
        global.logger.info('API Started');
    } catch(err) {
        const initialJson = {
            nextID: 1,
            account: []
        }
        fs.writeFile('accounts.json', JSON.stringify(initialJson, null, 2)).then(() => {
            global.logger.info('API Started and created file.');
        }).catch(err => {
            global.logger.error(err);
        });
    }
});
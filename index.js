import express from 'express';
import { promises as fs} from 'fs';
import accountRouter from './Routes/accounts.js'

const app = express();
app.use(express.json());

app.use('/account', accountRouter);

app.listen(3001, async() => {
    try{
        await fs.readFile('accounts.json');
        console.log('API Started');
    } catch(err) {
        const initialJson = {
            nextID: 1,
            account: []
        }
        fs.writeFile('accounts.json', JSON.stringify(initialJson, null, 2)).then(() => {
            console.log('API Started and created file.');
        }).catch(err => {
            console.log(err);
        });
    }
});



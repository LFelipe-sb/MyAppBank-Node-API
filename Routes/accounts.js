import express from 'express';
import { promises as fs} from 'fs';

const router = express.Router();

router.post('/', async(req, res) => {
    try {
        let account = req.body;
        const data = JSON.parse( await fs.readFile('accounts.json'));
        
        account = {id: data.nextID++, ...account};
        data.account.push(account);
        
        await fs.writeFile('accounts.json', JSON.stringify(data, null, 2));
        
        res.send('Criado com sucesso. ' + JSON.stringify(account));
    } catch (err) {
        res.status(500).send('Ocorreu um erro. ' + err);
    }
});

router.get('/', async(_req, res) => {
    try{
        const data = JSON.parse(await fs.readFile('accounts.json'));
        delete data.nextID;
        res.send(data);
    } catch (err) {
        res.status(500).send('Ocorreu um erro. ' + err);
    }
});

router.get('/:id', async(req, res) => {
    try{
        const data = JSON.parse(await fs.readFile('accounts.json'));
        const account = data.account.find((account) => account.id === parseInt(req.params.id));
        res.send(account);
    } catch(err) {
        res.status(500).send('Ocorreu um erro. ' + err);
    }
});

router.delete('/:id', async(req, res) => {
    try{
        const data = JSON.parse(await fs.readFile('accounts.json'));
        data.account = data.account.filter((account) => account.id !== parseInt(req.params.id));
        await fs.writeFile('accounts.json', JSON.stringify(data, null, 2));
        res.send('Item excluido com sucesso.')
    } catch(err) {
        res.status(500).send('Ocorreu um erro. ' + err);
    }
});

router.put('/', async(req, res) => {
    try {
        const data = JSON.parse(await fs.readFile('accounts.json'));
        const accountData = req.body;
        const index = data.account.findIndex((item) => item.id === parseInt(accountData.id));
        data.account[index] = accountData;
        await fs.writeFile('accounts.json', JSON.stringify(data));
        res.send(data);
    } catch (err) {
        res.status(500).send('Ocorreu um erro. ' + err);
    }
});

router.patch('/updateBalance', async(req, res) => {
    try{
        const data = JSON.parse(await fs.readFile('accounts.json'));
        const accountData = req.body;

        const index = data.account.findIndex((item) => item.id === parseInt(accountData.id));
        data.account[index].balance = accountData.balance;

        await fs.writeFile('accounts.json', JSON.stringify(data));
        res.send(data.account[index]);
    } catch(err) {
        res.status(500).send('Ocorreu um erro. ' + err);
    }
});

export default router;
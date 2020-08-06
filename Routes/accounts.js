import express from 'express';
import { promises as fs} from 'fs';

const router = express.Router();

router.post('/', async(req, res, next) => {
    try {
        let account = req.body;
        const data = JSON.parse( await fs.readFile('accounts.json'));
        
        account = {id: data.nextID++, ...account};
        data.account.push(account);
        
        await fs.writeFile('accounts.json', JSON.stringify(data, null, 2));
        res.send('Criado com sucesso. ' + JSON.stringify(account));

        logger.info(`POST /Account - ${JSON.stringify(account)}`);
    } catch (err) {
        next(err);
    }
});

router.get('/', async(_req, res, next) => {
    try{
        const data = JSON.parse(await fs.readFile('accounts.json'));
        delete data.nextID;
        res.send(data);

        logger.info(`GET /Account`);

    } catch (err) {
        next(err);
    }
});

router.get('/:id', async(req, res, next) => {
    try{
        const data = JSON.parse(await fs.readFile('accounts.json'));
        const account = data.account.find((account) => account.id === parseInt(req.params.id));
        res.send(account);

        logger.info(`GET /Account/${req.params.id}`);
    } catch(err) {
        next(err);
    }
});

router.delete('/:id', async(req, res, next) => {
    try{
        const data = JSON.parse(await fs.readFile('accounts.json'));
        data.account = data.account.filter((account) => account.id !== parseInt(req.params.id));
        await fs.writeFile('accounts.json', JSON.stringify(data, null, 2));
        res.send('Item excluido com sucesso.');
        logger.info(`DELETE /Account/${req.params.id}`);
    } catch(err) {
        next(err);
    }
});

router.put('/', async(req, res, next) => {
    try {
        const data = JSON.parse(await fs.readFile('accounts.json'));
        const accountData = req.body;
        const index = data.account.findIndex((item) => item.id === parseInt(accountData.id));
        data.account[index] = accountData;
        await fs.writeFile('accounts.json', JSON.stringify(data, 2, null));
        res.send(data);
        logger.info(`PUT /Account - ${JSON.stringify(account)}`);
    } catch (err) {
        next(err);
    }
});

router.patch('/updateBalance', async(req, res, next) => {
    try{
        const data = JSON.parse(await fs.readFile('accounts.json'));
        const accountData = req.body;

        const index = data.account.findIndex((item) => item.id === parseInt(accountData.id));
        data.account[index].balance = accountData.balance;

        await fs.writeFile('accounts.json', JSON.stringify(data, null, 2));
        res.send(data.account[index]);
        logger.info(`PATCH /Account - ${JSON.stringify(account)}`);
    } catch(err) {
        next(err);
    }
});

//Tratamento de erros.
router.use((err, req, res, _next) => {
    global.logger.error(`${req.method} ${req.baseUrl} -> ${err.message}`)
    res.status(500).send('Ocorreu um erro. ' + err);

});

export default router;
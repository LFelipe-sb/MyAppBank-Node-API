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
        res.status(500).send('Ocorreu um erro.' + err)
    }
});

export default router;
import express from 'express';
import VaccinesService from '../services/vaccines.service';
import { IVaccine } from '../interfaces/vaccine.interface';

class VaccinesMiddleware {
    private static instance: VaccinesMiddleware;

    public static getInstance() {
        if (!VaccinesMiddleware.instance) {
            VaccinesMiddleware.instance = new VaccinesMiddleware();
        }
        return VaccinesMiddleware.instance;
    }

    public async validateFields(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        const keys: Array<string> = Object.keys(req.body);

        if (
            keys.includes('nome') && keys.includes('esquema')
            && keys.includes('data_vacinacao') && keys.includes('imunidade')
        ) {
            next();
        } else {
            res.status(400).send({error: 'Favor preencher todos os campos obrigatórios.'});
        }
    }
    
    public async validateExists(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        const vaccine: IVaccine | undefined = await VaccinesService.getById(parseInt(req.params.id));

        if (vaccine) {
            next();
        } else {
            res.status(404).send({error: 'Vacina não encontrada.'});
        }
    }
}

export default VaccinesMiddleware.getInstance();
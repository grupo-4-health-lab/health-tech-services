import express from 'express';
import CipaMeetingsService from '../services/cipa-meetings.service';
import { ICipaMeeting } from '../interfaces/cipa-meetings.interface';

class CipaMeetingsMiddleware {
    private static instance: CipaMeetingsMiddleware;

    public static getInstance() {
        if (!CipaMeetingsMiddleware.instance) {
            CipaMeetingsMiddleware.instance = new CipaMeetingsMiddleware();
        }
        return CipaMeetingsMiddleware.instance;
    }

    public async validateFields(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        const keys: Array<string> = Object.keys(req.body);

        if (
            keys.includes('nome') && keys.includes('descricao')
            && keys.includes('data') && keys.includes('tipo')
        ) {
            next();
        } else {
            res.status(400).send({error: 'Favor preencher todos os campos obrigatórios.'});
        }
    }
    
    public async validateExists(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        const meeting: ICipaMeeting | undefined = await CipaMeetingsService.getById(parseInt(req.params.id));

        if (meeting) {
            next();
        } else {
            res.status(404).send({error: 'Reunião não encontrada.'});
        }
    }
}

export default CipaMeetingsMiddleware.getInstance();
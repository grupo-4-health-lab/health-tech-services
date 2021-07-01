import express from 'express';
import CollaboratorsService from '../services/collaborators.service';
import { ICollaborator } from '../interfaces/collaborator.interface';

class CollaboratorsMiddleware {
    private static instance: CollaboratorsMiddleware;

    public static getInstance() {
        if (!CollaboratorsMiddleware.instance) {
            CollaboratorsMiddleware.instance = new CollaboratorsMiddleware();
        }
        return CollaboratorsMiddleware.instance;
    }

    public async validateFields(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        const keys: Array<string> = Object.keys(req.body);

        if (
            keys.includes('permissao') && keys.includes('nome')
            && keys.includes('sexo') && keys.includes('rg')
            && keys.includes('orgao_expedidor') && keys.includes('uf_rg')
            && keys.includes('cpf') && keys.includes('email')
            && keys.includes('unidade') && keys.includes('matricula')
            && keys.includes('codigo_interno') && keys.includes('situacao')
            && keys.includes('etnia') && keys.includes('pcd')
        ) {
            next();
        } else {
            res.status(400).send({error: 'Favor preencher todos os campos obrigatórios.'});
        }
    }
    
    public async validateExistentEmail(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        if (req.method === 'PUT' && !req.body.email) {
            next();
            return;
        }

        const collaborator: ICollaborator | undefined = await CollaboratorsService.getByEmail(req.body.email);

        if (collaborator && req.method === 'POST') {
            res.status(400).send({error: 'Colaborador com este email já existente.'});
        } 
        else if (collaborator && req.method === 'PUT' && parseInt(req.params['id']) !== collaborator.id) {
            res.status(400).send({error: 'Colaborador com este email já existente.'});
        }
        else {
            next();
        }
    }
    
    public async validateExists(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        const collaborator: ICollaborator | undefined = await CollaboratorsService.getById(parseInt(req.params.id));

        if (collaborator) {
            next();
        } else {
            res.status(404).send({error: 'Colaborador não encontrado.'});
        }
    }
}

export default CollaboratorsMiddleware.getInstance();
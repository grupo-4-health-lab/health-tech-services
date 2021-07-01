import express from 'express';
import argon2 from 'argon2';
import crypto from 'crypto';
import { ValidationError } from 'sequelize';
import collaboratorsDao from './collaborators.dao';

class CollaboratorsController {
    private static instance: CollaboratorsController;

    public static getInstance(): CollaboratorsController {
        if (!CollaboratorsController.instance) {
            CollaboratorsController.instance = new CollaboratorsController();
        }
        return CollaboratorsController.instance;
    }

    public async list(_: express.Request, res: express.Response): Promise<void> {
        const collaborators = await collaboratorsDao.getList().then(colls => colls.map(col => { delete col.senha; return col; }));
        res.status(200).send(collaborators);
    }

    public async get(req: express.Request, res: express.Response): Promise<void> {
        const collaborator = await collaboratorsDao.getById(parseInt(req.params.id));
        delete collaborator?.senha;
        res.status(200).send(collaborator);
    }

    public async create(req: express.Request, res: express.Response): Promise<void> {
        try {
            const newPassword: string = crypto.randomBytes(4).toString('hex');
            req.body.senha = await argon2.hash(newPassword);

            const id = await collaboratorsDao.create(req.body);

            res.status(201).send({
                id,
                message: `Colaborador '${req.body.nome}' adicionado com sucesso.`,
                password: newPassword
            });
        }
        catch (err) {
            if (err instanceof ValidationError) {              
                res.status(400).send({error: 'Favor preencher os campos adequadamente'});
                return;
            }

            res.sendStatus(500);
        }
    }

    public async update(req: express.Request, res: express.Response): Promise<void> {
        try {
            if (req.body.permission_level) {
                res.status(409).send({ error: "Não é permitido a alteração de nível de permissão." });
                return;
            }
            
            await collaboratorsDao.update({id: parseInt(req.params.id), ...req.body});
            res.status(204).send();
        }
        catch (err) {
            if (err instanceof ValidationError) {                
                res.status(400).send({error: 'Favor preencher os campos adequadamente'});
                return;
            }

            res.sendStatus(500);
        }
    }

    public async delete(req: express.Request, res: express.Response): Promise<void> {
        try {
            await collaboratorsDao.delete(parseInt(req.params.id));
            res.sendStatus(204);
        }
        catch (err) {
            res.sendStatus(500);
        }
    }
}

export default CollaboratorsController.getInstance();
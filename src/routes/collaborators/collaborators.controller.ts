import express from 'express';
import argon2 from 'argon2';
import crypto from 'crypto';
import { ValidationError } from 'sequelize';
import CollaboratorsService from '../../services/collaborators.service';

class CollaboratorsController {
    private static instance: CollaboratorsController;

    public static getInstance(): CollaboratorsController {
        if (!CollaboratorsController.instance) {
            CollaboratorsController.instance = new CollaboratorsController();
        }
        return CollaboratorsController.instance;
    }

    public async list(_: express.Request, res: express.Response): Promise<void> {
        const collaborators = await CollaboratorsService.getList().then(colls => colls.map(col => { delete col.senha; return col; }));
        res.status(200).send(collaborators);
    }

    public async get(req: express.Request, res: express.Response): Promise<void> {
        const collaborator = await CollaboratorsService.getById(parseInt(req.params.id));
        delete collaborator?.senha;
        res.status(200).send(collaborator);
    }

    public async create(req: express.Request, res: express.Response): Promise<void> {
        try {
            const newPassword: string = crypto.randomBytes(4).toString('hex');
            req.body.senha = await argon2.hash(newPassword);

            const id = await CollaboratorsService.create(req.body);

            res.status(201).send({
                id,
                message: `Colaborador '${req.body.nome}' adicionado com sucesso.`,
                password: newPassword
            });
        }
        catch (err) {
            if (err instanceof ValidationError) {
                res.status(400).send({error: `Favor preencher os campos adequadamente: ${err.errors.map(error => error.message)}`});
                return;
            }

            res.sendStatus(500);
        }
    }

    public async update(req: express.Request, res: express.Response): Promise<void> {
        try {
            delete req.body.senha;

            if (parseInt(req.params.id) === 1 && (req.body.permissao !== 2 || req.body.email !== 'admin@admin.com')) {
                res.status(400).send({error: 'Não é possível alterar a permissão/email de um administrador.' });
                return;
            }

            await CollaboratorsService.update({id: parseInt(req.params.id), ...req.body});
            res.status(204).send();
        }
        catch (err) {
            if (err instanceof ValidationError) {
                res.status(400).send({error: `Favor preencher os campos adequadamente: ${err.errors.map(error => error.message)}`});
                return;
            }

            res.sendStatus(500);
        }
    }

    public async delete(req: express.Request, res: express.Response): Promise<void> {
        try {
            await CollaboratorsService.delete(parseInt(req.params.id));
            res.sendStatus(204);
        }
        catch (err) {
            res.sendStatus(500);
        }
    }
}

export default CollaboratorsController.getInstance();
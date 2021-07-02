import express from 'express';
import { ValidationError } from 'sequelize';
import VaccinesService from '../../services/vaccines.service';

class VaccinesController {
    private static instance: VaccinesController;

    public static getInstance(): VaccinesController {
        if (!VaccinesController.instance) {
            VaccinesController.instance = new VaccinesController();
        }
        return VaccinesController.instance;
    }

    public async list(_: express.Request, res: express.Response): Promise<void> {
        const vaccines = await VaccinesService.getList();
        res.status(200).send(vaccines);
    }

    public async get(req: express.Request, res: express.Response): Promise<void> {
        const vaccine = await VaccinesService.getById(parseInt(req.params.id));
        res.status(200).send(vaccine);
    }

    public async create(req: express.Request, res: express.Response): Promise<void> {
        try {
            const id = await VaccinesService.create(req.body);

            res.status(201).send({
                id,
                message: `Vacina '${req.body.nome}' adicionada com sucesso.`
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
            await VaccinesService.update({id: parseInt(req.params.id), ...req.body});
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
            await VaccinesService.delete(parseInt(req.params.id));
            res.sendStatus(204);
        }
        catch (err) {
            res.sendStatus(500);
        }
    }
}

export default VaccinesController.getInstance();
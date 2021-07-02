import express from 'express';
import { ValidationError } from 'sequelize';
import CipaMeetingsService from '../../services/cipa-meetings.service';

class CipaMeetingsController {
    private static instance: CipaMeetingsController;

    public static getInstance(): CipaMeetingsController {
        if (!CipaMeetingsController.instance) {
            CipaMeetingsController.instance = new CipaMeetingsController();
        }
        return CipaMeetingsController.instance;
    }

    public async list(_: express.Request, res: express.Response): Promise<void> {
        const meetings = await CipaMeetingsService.getList();
        res.status(200).send(meetings);
    }

    public async get(req: express.Request, res: express.Response): Promise<void> {
        const meeting = await CipaMeetingsService.getById(parseInt(req.params.id));
        res.status(200).send(meeting);
    }

    public async create(req: express.Request, res: express.Response): Promise<void> {
        try {
            const id = await CipaMeetingsService.create(req.body);

            res.status(201).send({
                id,
                message: `Reunião '${req.body.nome}' marcada com sucesso.`
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
            await CipaMeetingsService.update({id: parseInt(req.params.id), ...req.body});
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
            await CipaMeetingsService.delete(parseInt(req.params.id));
            res.sendStatus(204);
        }
        catch (err) {
            res.sendStatus(500);
        }
    }
}

export default CipaMeetingsController.getInstance();
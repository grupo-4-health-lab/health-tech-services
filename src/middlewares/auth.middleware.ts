import express from 'express';
import CollaboratorsDao from '../routes/collaborators/collaborators.dao';
import argon2 from 'argon2';
import { ICollaborator } from '../routes/collaborators/collaborators.dto';

class AuthMiddleware {
    private static instance: AuthMiddleware;

    public static getInstance(): AuthMiddleware {
        if (!AuthMiddleware.instance) {
            AuthMiddleware.instance = new AuthMiddleware();
        }
        return AuthMiddleware.instance;
    }

    public validateBodyRequest(req: express.Request, res: express.Response, next: express.NextFunction): void {
        if (req.body && req.body.email && req.body.senha) {
            next();
        } else {
            res.status(400).send({error: 'Campos obrigatórios de email/senha faltando.'});
        }
    }

    public async verifyPassword(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        const collaborator: ICollaborator | undefined = await CollaboratorsDao.getByEmail(req.body.email);

        if (collaborator && await argon2.verify(collaborator.senha, req.body.senha)) {
            next();
            return;
        }

        res.status(400).send({error: 'Usuário ou senha incorreto(s)'});
    }
}

export default AuthMiddleware.getInstance();
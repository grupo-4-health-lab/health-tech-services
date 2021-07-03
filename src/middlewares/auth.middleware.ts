import express from 'express';
import argon2 from 'argon2';
import CollaboratorsService from '../services/collaborators.service';
import { ICollaborator } from '../interfaces/collaborator.interface';

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
        const collaborator: ICollaborator | undefined = await CollaboratorsService.getByEmail(req.body.email);

        if (collaborator && await argon2.verify(collaborator.senha!, req.body.senha)) {
            req.body.id = collaborator.id;
            req.body.permissao = collaborator.permissao;
            next();
        }
        else {
            res.status(401).send({error: 'Usuário ou senha incorreto(s)'});
        }
    }
}

export default AuthMiddleware.getInstance();
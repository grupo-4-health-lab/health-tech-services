import express from 'express';

enum CollaboratorPermissionLevel {
    DEFAULT_PERMISSION = 1,
    ADMIN_PERMISSION = 2
}

class PermissionMiddleware {
    private static instance: PermissionMiddleware;

    public static getInstance(): PermissionMiddleware {
        if (!PermissionMiddleware.instance) {
            PermissionMiddleware.instance = new PermissionMiddleware();
        }
        return PermissionMiddleware.instance;
    }

    public onlyAdmin(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const permissionLevel: CollaboratorPermissionLevel = parseInt(req.body.jwt.permissao);

        if (permissionLevel & CollaboratorPermissionLevel.ADMIN_PERMISSION) {
            next();
        }
        else {
            res.status(403).send({ error: 'Operação permitida apenas para administradores.' });
            return;
        }
    };
}

export default PermissionMiddleware.getInstance();
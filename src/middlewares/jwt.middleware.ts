import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

class JWTMiddleware {
    private static instance: JWTMiddleware;
    private static readonly jwtSecret: string = process.env.JWT_SECRET! || 'HT';

    public static getInstance(): JWTMiddleware {
        if (!JWTMiddleware.instance) {
            JWTMiddleware.instance = new JWTMiddleware();
        }
        return JWTMiddleware.instance;
    }

    public verifyRefreshBodyField(req: express.Request, res: express.Response, next: express.NextFunction): void {
        if (req.body && req.body.refreshToken) {
            next();
        }
        else {
            res.status(401).send({ error: 'Não autorizado.' });
        }
    };

    public validRefreshNeeded(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const refreshToken: string = Buffer.from(req.body.refreshToken, 'base64').toString();
        const hash: string = crypto.createHmac('sha512', req.body.jwt.refreshKey).update(req.body.jwt.id + JWTMiddleware.jwtSecret).digest("base64");

        if (hash === refreshToken) {
            next();
        }
        else {
            res.status(401).send({ error: 'Token inválido.' });
        }
    };

    public validJWTNeeded(req: express.Request, res: express.Response, next: express.NextFunction): void {
        let authorization: string | undefined = req.headers.authorization;

        if (authorization && authorization.startsWith('Bearer ')) {
            try {
                req.body.jwt = jwt.verify(authorization.replace('Bearer ', ''), JWTMiddleware.jwtSecret);
                next();
            }
            catch {
                res.status(401).send({ error: 'Token inválido.' });
            }
        }
        else {
            res.status(401).send({ error: 'Token inválido.' });
        }
    };
}

export default JWTMiddleware.getInstance();
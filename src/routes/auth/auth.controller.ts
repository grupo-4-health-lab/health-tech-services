import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

class AuthController {
    private static instance: AuthController;
    private static readonly jwtSecret: string = process.env.JWT_SECRET! || 'HT';
    private static readonly expirationSeconds: number = 3600;

    public static getInstance(): AuthController {
        if (!AuthController.instance) {
            AuthController.instance = new AuthController();
        }
        return AuthController.instance;
    }

    public async createJWT(req: express.Request, res: express.Response): Promise<void> {
        try {
            const refreshId: string = req.body.id + AuthController.jwtSecret;
            
            const salt: string = crypto.randomBytes(16).toString('base64');
            const hash: string = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");

            req.body.refreshKey = salt;

            const token: string = jwt.sign(req.body, AuthController.jwtSecret, {expiresIn: AuthController.expirationSeconds});
            const refreshToken: string = Buffer.from(hash).toString('base64');

            res.status(201).send({ accessToken: token, refreshToken: refreshToken });
        }
        catch (err) {
            res.status(500).send(err);
        }
    }
}

export default AuthController.getInstance();
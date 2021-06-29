import { BaseRouter } from '../base.router';
import authController from './auth.controller';
import jwtMiddleware from '../../middlewares/jwt.middleware';
import authMiddleware from '../../middlewares/auth.middleware';
import express from 'express';

export class AuthRouter extends BaseRouter {
    constructor(app: express.Application) {
        super(app, 'AuthRoutes');
    }

    public configureRoutes(): express.Application {
        this.app.post(`/auth`, [
            authMiddleware.validateBodyRequest,
            authMiddleware.verifyPassword,
            authController.createJWT
        ]);

        this.app.post(`/auth/refresh-token`, [
            jwtMiddleware.validJWTNeeded,
            jwtMiddleware.verifyRefreshBodyField,
            jwtMiddleware.validRefreshNeeded,
            authController.createJWT
        ]);

        return this.app;
    }
}
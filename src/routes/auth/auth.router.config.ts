import { BaseRouter } from '../base.router';
import AuthController from './auth.controller';
import JWTMiddleware from '../../middlewares/jwt.middleware';
import AuthMiddleware from '../../middlewares/auth.middleware';
import express from 'express';

export class AuthRouter extends BaseRouter {
    constructor(app: express.Application) {
        super(app, 'AuthRoutes');
    }

    public configureRoutes(): express.Application {
        this.app.post(`/auth`, [
            AuthMiddleware.validateBodyRequest,
            AuthMiddleware.verifyPassword,
            AuthController.createJWT
        ]);

        this.app.post(`/auth/refresh-token`, [
            JWTMiddleware.validJWTNeeded,
            JWTMiddleware.verifyRefreshBodyField,
            JWTMiddleware.validRefreshNeeded,
            AuthController.createJWT
        ]);

        return this.app;
    }
}
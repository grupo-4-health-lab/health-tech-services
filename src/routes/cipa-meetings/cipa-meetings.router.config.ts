import { BaseRouter } from '../base.router';
import CipaMeetingsController from './cipa-meetings.controller';
import CipaMeetingsMiddleware from '../../middlewares/cipa-meetings.middleware';
import JWTMiddleware from '../../middlewares/jwt.middleware';
import express from 'express';

export class CipaMeetingsRouter extends BaseRouter {
    constructor(app: express.Application) {
        super(app, 'CipaMeetingsRoutes');
    }

    public configureRoutes(): express.Application {
        this.app.route(`/cipa-meetings`)
            .all(JWTMiddleware.validJWTNeeded)
            .get(CipaMeetingsController.list)
            .post(CipaMeetingsMiddleware.validateFields, CipaMeetingsController.create);

        this.app.route(`/cipa-meetings/:id`)
            .all(JWTMiddleware.validJWTNeeded, CipaMeetingsMiddleware.validateExists)
            .get(CipaMeetingsController.get)
            .put(CipaMeetingsController.update)
            .delete(CipaMeetingsController.delete);

        return this.app;
    }
}
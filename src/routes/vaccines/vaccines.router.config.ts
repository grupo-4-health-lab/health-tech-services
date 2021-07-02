import { BaseRouter } from '../base.router';
import VaccinesController from './vaccines.controller';
import VaccinesMiddleware from '../../middlewares/vaccines.middleware';
import JWTMiddleware from '../../middlewares/jwt.middleware';
import express from 'express';

export class VaccinesRouter extends BaseRouter {
    constructor(app: express.Application) {
        super(app, 'VaccinesRoutes');
    }

    public configureRoutes(): express.Application {
        this.app.route(`/vaccines`)
            .all(JWTMiddleware.validJWTNeeded)
            .get(VaccinesController.list)
            .post(VaccinesMiddleware.validateFields, VaccinesController.create);

        this.app.route(`/vaccines/:id`)
            .all(JWTMiddleware.validJWTNeeded, VaccinesMiddleware.validateExists)
            .get(VaccinesController.get)
            .put(VaccinesController.update)
            .delete(VaccinesController.delete);

        return this.app;
    }
}
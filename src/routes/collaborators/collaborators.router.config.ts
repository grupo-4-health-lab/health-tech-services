import { BaseRouter } from '../base.router';
import CollaboratorsController from './collaborators.controller';
import CollaboratorsMiddleware from '../../middlewares/collaborators.middleware';
import JWTMiddleware from '../../middlewares/jwt.middleware';
import PermissionsMiddleware from '../../middlewares/permissions.middleware';
import express from 'express';

export class CollaboratorsRouter extends BaseRouter {
    constructor(app: express.Application) {
        super(app, 'CollaboratorsRoutes');
    }

    public configureRoutes(): express.Application {
        this.app.route(`/collaborators`)
            .all(JWTMiddleware.validJWTNeeded)
            .get(CollaboratorsController.list)
            .post(PermissionsMiddleware.onlyAdmin, CollaboratorsMiddleware.validateFields, CollaboratorsMiddleware.validateExistentEmail, CollaboratorsController.create);

        this.app.route(`/collaborators/:id`)
            .all(JWTMiddleware.validJWTNeeded, CollaboratorsMiddleware.validateExists)
            .get(CollaboratorsController.get)
            .put(CollaboratorsMiddleware.validateExistentEmail, CollaboratorsController.update)
            .delete(PermissionsMiddleware.onlyAdmin, CollaboratorsController.delete);

        return this.app;
    }
}
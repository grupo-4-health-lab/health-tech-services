import express from 'express';
import bodyParser from 'body-parser';
import * as http from 'http';
import { AddressInfo } from 'net';

import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import debug from 'debug';
import helmet from 'helmet';

import swaggerUi from 'swagger-ui-express';
const swaggerDocument = require('./swagger.json');

import { BaseRouter }  from './src/routes/base.router';

import { AuthRouter } from './src/routes/auth/auth.router.config';
import { CollaboratorsRouter } from './src/routes/collaborators/collaborators.router.config';
import { CipaMeetingsRouter } from './src/routes/cipa-meetings/cipa-meetings.router.config';
import { VaccinesRouter } from './src/routes/vaccines/vaccines.router.config';

const routes: Array<BaseRouter> = [];
const debugLog: debug.IDebugger = debug('app:initialize');

class Server {
    private app: express.Application = express();

    public start(): http.Server {
        debugLog(`Configuring server...`);
        
        const server: http.Server = http.createServer(this.app);
        const port: Number = +process.env.PORT! || 3000;

        this.app.use(bodyParser.json());

        this.loadMiddlewares();
        this.loadRoutes();

        return server.listen(port, () => {
            debugLog(`Server running at http://${this.getAddress(server)}:${port}`);
            routes.forEach((route: BaseRouter) => {
                debugLog(`Routes configured for ${route.getName()}`);
            });
        });
    }

    private getAddress(server: http.Server): string {
        const addressInfo: AddressInfo = server.address() as AddressInfo;
        return addressInfo.address === '::' ? 'localhost' : addressInfo.address;
    }

    private loadMiddlewares(): void {
        this.app.use(cors());
        this.app.use(helmet());
        
        this.app.use(expressWinston.logger({
            transports: [
                new winston.transports.Console()
            ],
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.json()
            )
        }));
        
        this.app.use(expressWinston.errorLogger({
            transports: [
                new winston.transports.Console()
            ],
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.json()
            )
        }));

        this.app.use(
            '/api-docs',
            swaggerUi.serve, 
            swaggerUi.setup(swaggerDocument)
        );
    }

    private loadRoutes(): void {
        routes.push(new AuthRouter(this.app));
        routes.push(new CollaboratorsRouter(this.app));
        routes.push(new VaccinesRouter(this.app));
        routes.push(new CipaMeetingsRouter(this.app));
        
        this.app.get('/', (_: express.Request, res: express.Response) => {
            res.status(200).send('Online');
        });
    }
}

export default new Server().start();
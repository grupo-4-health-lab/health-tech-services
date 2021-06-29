import express from 'express';
import * as http from 'http';

import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import debug from 'debug';
import helmet from 'helmet';

import { BaseRouter }  from './src/routes/base.router';
import { AuthRouter } from './src/routes/auth/auth.router.config';

import { AddressInfo } from 'net';

const routes: Array<BaseRouter> = [];
const debugLog: debug.IDebugger = debug('app:initialize');

class Server {
    private app: express.Application = express();

    public start(): http.Server {
        debugLog(`Configuring server...`);
        
        const server: http.Server = http.createServer(this.app);
        const port: Number = +process.env.PORT! || 3000;

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
    }

    private loadRoutes(): void {
        routes.push(new AuthRouter(this.app));
        
        this.app.get('/', (_: express.Request, res: express.Response) => {
            res.sendStatus(200);
        });
    }
}

export default new Server().start();
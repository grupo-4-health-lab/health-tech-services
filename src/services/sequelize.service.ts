import { Sequelize } from 'sequelize';
import debug from 'debug';

const config = require('../config/config.js');
const debugLog: debug.IDebugger = debug('database:instance');

class SequelizeService {
    private static instance: SequelizeService;
    private environment: string = process.env.NODE_ENV! || 'development';
    public sequelize: Sequelize;

    constructor() {
        console.log(this.environment);
        this.sequelize = new Sequelize(
            config[this.environment].database,
            config[this.environment].username,
            config[this.environment].password,
            {
                host: config[this.environment].host,
                dialect: 'mysql',
                port: 3306,
                retry: {
                    max: 3
                },            
                pool: {
                    min: 0,
                    max: 10
                },
                logging: debugLog
            }
        );

        this.connect();
    };

    public static getInstance(): SequelizeService {
        if (!this.instance) {
            this.instance = new SequelizeService();
        }

        return this.instance;
    };

    public getSequelize(): Sequelize {
        return this.sequelize;
    };

    private connect(): void {
        debugLog('Trying to connect to MySQL server instance...');

        this.sequelize.authenticate()
            .then(() => debugLog('MySQL database connected.'))
            .catch((err) => debugLog('Unable to connect to the MySQL database. Error: ', err));
    };
}

export default SequelizeService.getInstance();
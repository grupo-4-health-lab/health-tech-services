import { DataTypes, ModelDefined } from 'sequelize';
import sequelizeService from './sequelize.service';
import debug from 'debug';
import { IVaccine } from '../interfaces/vaccine.interface';

const debugLog: debug.IDebugger = debug('app:services:vaccines');

class VaccinesService {
    private static instance: VaccinesService;

    constructor() {
        debugLog('Defining vaccines...');
        this.Vaccines.sync();
    }

    Vaccines: ModelDefined<IVaccine, IVaccine> = sequelizeService.getSequelize().define('Vaccines', {
            id: {
                type: DataTypes.INTEGER,
                unique: true,
                primaryKey: true,
                autoIncrement: true
            },
            nome: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [0, 128]
                }
            },
            esquema: {
                type: DataTypes.TEXT({ length: 'long' }),
                allowNull: false
            },
            data_vacinacao: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            imunidade: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            }
    }, { createdAt: false, updatedAt: false });

    static getInstance(): VaccinesService {
        if (!VaccinesService.instance) {
            VaccinesService.instance = new VaccinesService();
        }
        return VaccinesService.instance;
    }

    async getList() {
        return this.Vaccines.findAll().then((VaccinesList) => { return VaccinesList.map((item) => { return item.get(); }) });
    }
    
    async getById(vaccineId: number) {
        return this.Vaccines.findByPk(vaccineId).then((vaccine) => { return vaccine?.get(); });
    }

    async create(vaccine: IVaccine) {
        return this.Vaccines.create(vaccine).then(vaccine => { return vaccine.get().id; });
    }

    async update(vaccine: IVaccine) {
        return this.Vaccines.update(vaccine, { where: { id: vaccine.id } });
    }

    async delete(vaccineId: number) {
        return this.Vaccines.destroy({ where: { id: vaccineId } });
    }
}

export default VaccinesService.getInstance();
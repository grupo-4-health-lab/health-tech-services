import { DataTypes, ModelDefined } from 'sequelize';
import sequelizeService from './sequelize.service';
import debug from 'debug';
import { ICipaMeeting } from '../interfaces/cipa-meetings.interface';

const debugLog: debug.IDebugger = debug('app:services:cipa-meetings');

class CipaMeetingsService {
    private static instance: CipaMeetingsService;

    constructor() {
        debugLog('Defining CIPA meetings...');
        this.CipaMeetings.sync();
    }

    CipaMeetings: ModelDefined<ICipaMeeting, ICipaMeeting> = sequelizeService.getSequelize().define('CipaMeetings', {
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
            descricao: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [0, 128]
                }
            },
            data: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            tipo: {
                type: DataTypes.ENUM('1', '2', '3', '4', '5'),
                allowNull: false,
                validate: {     
                    notEmpty: true,
                    isInt: true
                }
            }
    }, { createdAt: false, updatedAt: false });

    static getInstance(): CipaMeetingsService {
        if (!CipaMeetingsService.instance) {
            CipaMeetingsService.instance = new CipaMeetingsService();
        }
        return CipaMeetingsService.instance;
    }

    async getList() {
        return this.CipaMeetings.findAll().then((meetingsList) => { return meetingsList.map((item) => { return item.get(); }) });
    }
    
    async getById(meetingId: number) {
        return this.CipaMeetings.findByPk(meetingId).then((meeting) => { return meeting?.get(); });
    }

    async create(meeting: ICipaMeeting) {
        return this.CipaMeetings.create(meeting).then(meeting => { return meeting.get().id; });
    }

    async update(meeting: ICipaMeeting) {
        return this.CipaMeetings.update(meeting, { where: { id: meeting.id } });
    }

    async delete(meetingId: number) {
        return this.CipaMeetings.destroy({ where: { id: meetingId } });
    }
}

export default CipaMeetingsService.getInstance();
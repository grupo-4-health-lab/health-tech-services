import { DataTypes, ModelDefined } from 'sequelize';
import sequelizeService from './sequelize.service';
import debug from 'debug';
import { ICollaborator } from '../interfaces/collaborator.interface';

const debugLog: debug.IDebugger = debug('app:dao');

class CollaboratorsService {
    private static instance: CollaboratorsService;

    constructor() {
        debugLog('Defining collaborators...');
        this.Collaborators.sync();
    }

    Collaborators: ModelDefined<ICollaborator, ICollaborator> = sequelizeService.getSequelize().define('Collaborators', {
            id: {
                type: DataTypes.INTEGER,
                unique: true,
                primaryKey: true,
                autoIncrement: true
            },
            permissao: {
                type: DataTypes.ENUM('1', '2'),
                allowNull: false,
                validate: {     
                    notEmpty: true,
                    isInt: true
                }
            },
            nome: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [0, 128]
                }
            },
            centro_custo: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isAlphanumeric: true, 
                    len: [0, 128]
                }
            },
            data_nascimento: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            sexo: {
                type: DataTypes.ENUM('1', '2'),
                allowNull: false,
                validate: {     
                    notEmpty: true,
                    isInt: true
                }
            },
            rg: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isNumeric: true, 
                    len: [8, 8]
                }
            },
            orgao_expedidor: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [0, 6]
                }
            },
            uf_rg: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [2, 2]
                }
            },
            cpf: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isNumeric: true, 
                    len: [11, 11]
                }
            },
            pis_pasep: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isNumeric: true, 
                    len: [11, 11]
                }
            },
            ctps: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isNumeric: true, 
                    len: [7, 7]
                }
            },
            exped_ctps: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            serie_ctps: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isNumeric: true, 
                    len: [4, 4]
                }
            },
            uf_ctps: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: [2, 2]
                }
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                    notEmpty: true
                }
            },
            setor: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: [1, 128]
                }
            },
            logradouro: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: [0, 128]
                }
            },
            bairro: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: [0, 128]
                }
            },
            cidade: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: [0, 128]
                }
            },
            uf: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: [2, 2]
                }
            },
            cep: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isNumeric: true, 
                    len: [8, 8]
                }
            },
            telefone: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isNumeric: true, 
                    len: [10, 11]
                }
            },
            naturalidade: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: [2, 20]
                }
            },
            nome_mae: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: [2, 100]
                }
            },
            nome_pai: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: [2, 100]
                }
            },
            unidade: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [0, 20]
                }
            },
            id_empresa: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            nome_empresa: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: [0, 20]
                }
            },
            id_cargo: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            nome_cargo: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: [0, 56]
                }
            },
            matricula: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isNumeric: true, 
                    len: [0, 24]
                }
            },
            codigo_interno: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isNumeric: true, 
                    len: [0, 24]
                }
            },
            situacao: {
                type: DataTypes.ENUM('1', '2'),
                allowNull: false,
                validate: {     
                    notEmpty: true,
                    isInt: true
                }
            },
            data_admissao: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                defaultValue: new Date()
            },
            data_rescisao: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            descricao: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: [0, 256]
                }
            },
            etnia: {
                type: DataTypes.ENUM('1', '2', '3', '4', '5', '6'),
                allowNull: false,
                validate: {     
                    notEmpty: true,
                    isInt: true
                }
            },
            pcd: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            tipo_pcd: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: [0, 24]
                }
            },
            cbo: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isNumeric: true,
                    len: [5, 5]
                }
            },
            ccbo_2002: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isNumeric: true,
                    len: [6, 6]
                }
            },
            codigo_filial: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isNumeric: true,
                    len: [0, 8]
                }
            },
            nome_filial: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: [0, 128]
                }
            },
            bairro_filial: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: [0, 128]
                }
            },
            estado_filial: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: [2, 2]
                }
            },
            cep_filial: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isInt: true,
                    len: [8, 8]
                }
            },
            cnpj_filial: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isInt: true,
                    len: [14, 14]
                }
            },
            telefone_filial: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isNumeric: true,
                    len: [10, 11]
                }
            },
            senha: {
                type: DataTypes.STRING
            }
    }, { createdAt: false, updatedAt: false });

    static getInstance(): CollaboratorsService {
        if (!CollaboratorsService.instance) {
            CollaboratorsService.instance = new CollaboratorsService();
        }
        return CollaboratorsService.instance;
    }

    async getList() {
        return this.Collaborators.findAll().then((CollaboratorsList) => { return CollaboratorsList.map((item) => { return item.get(); }) });
    }
    
    async getById(collaboratorId: number) {
        return this.Collaborators.findByPk(collaboratorId).then((collaborator) => { return collaborator?.get(); });
    }
    
    async getByEmail(email: string) {
        return this.Collaborators.findOne({ where: { email } }).then((collaborator) => { return collaborator?.get(); });
    }

    async create(collaborator: ICollaborator) {
        return this.Collaborators.create(collaborator).then(collaborator => { return collaborator.get().id; });
    }

    async update(collaborator: ICollaborator) {
        return this.Collaborators.update(collaborator, { where: { id: collaborator.id } });
    }

    async delete(collaboratorId: number) {
        return this.Collaborators.destroy({ where: { id: collaboratorId } });
    }
}

export default CollaboratorsService.getInstance();
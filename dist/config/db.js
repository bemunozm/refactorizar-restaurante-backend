"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const colors_1 = __importDefault(require("colors"));
const setupRoles_1 = require("./setupRoles");
class Database {
    static instance;
    URI;
    setupDefaultRolesService;
    constructor() {
        this.URI = process.env.DATABASE_URL || "";
        this.setupDefaultRolesService = new setupRoles_1.SetupDefaultRolesService();
        this.connect();
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    async connect(retries = 5, delay = 5000) {
        try {
            const connection = await mongoose_1.default.connect(this.URI);
            const url = `${connection.connection.host}:${connection.connection.port}`;
            console.log(colors_1.default.magenta.bold(`MongoDB Connected: ${url}`));
            await this.initializeDefaultRoles();
        }
        catch (error) {
            console.log(colors_1.default.red.bold(`Error al conectar MongoDB: ${error.message}`));
            // Intentar reconectar si hay reintentos disponibles
            if (retries > 0) {
                console.log(colors_1.default.yellow.bold(`Reintentando conexión en ${delay / 1000} segundos...`));
                setTimeout(() => this.connect(retries - 1, delay), delay);
            }
            else {
                console.error(colors_1.default.red.bold("No se pudo conectar a la base de datos después de varios intentos."));
                process.exit(1); // Cerrar la aplicación después de múltiples intentos fallidos
            }
        }
    }
    async initializeDefaultRoles() {
        try {
            await this.setupDefaultRolesService.setupDefaultRoles();
            console.log(colors_1.default.green.bold('Roles por defecto verificados/creados exitosamente'));
        }
        catch (error) {
            console.error(colors_1.default.red.bold("Error inicializando roles por defecto:"), error);
        }
    }
}
exports.default = Database;
//# sourceMappingURL=db.js.map
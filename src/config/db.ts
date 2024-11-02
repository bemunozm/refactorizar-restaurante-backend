import mongoose from "mongoose";
import colors from "colors";
import { SetupDefaultRolesService } from "./setupRoles";

class Database {
    private static instance: Database;
    private readonly URI: string;
    private setupDefaultRolesService: SetupDefaultRolesService;

    private constructor() {
        this.URI = process.env.DATABASE_URL || "";
        this.setupDefaultRolesService = new SetupDefaultRolesService();
        this.connect();
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    private async connect(retries = 5, delay = 5000): Promise<void> {
        try {
            const connection = await mongoose.connect(this.URI);
            const url = `${connection.connection.host}:${connection.connection.port}`;
            console.log(colors.magenta.bold(`MongoDB Connected: ${url}`));

            await this.initializeDefaultRoles();
        } catch (error: any) {
            console.log(colors.red.bold(`Error al conectar MongoDB: ${error.message}`));
            
            // Intentar reconectar si hay reintentos disponibles
            if (retries > 0) {
                console.log(colors.yellow.bold(`Reintentando conexión en ${delay / 1000} segundos...`));
                setTimeout(() => this.connect(retries - 1, delay), delay);
            } else {
                console.error(colors.red.bold("No se pudo conectar a la base de datos después de varios intentos."));
                process.exit(1); // Cerrar la aplicación después de múltiples intentos fallidos
            }
        }
    }

    private async initializeDefaultRoles() {
        try {
            await this.setupDefaultRolesService.setupDefaultRoles();
            console.log(colors.green.bold('Roles por defecto verificados/creados exitosamente'));
        } catch (error) {
            console.error(colors.red.bold("Error inicializando roles por defecto:"), error);
        }
    }
}

export default Database;

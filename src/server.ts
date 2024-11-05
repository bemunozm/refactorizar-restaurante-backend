import express, { Application } from "express";
import cors from "cors";
import colors from "colors";
import morgan from "morgan";
import dotenv from "dotenv";
import Database from "./config/db"; // Importa la clase Database
import authRoutes from "./routes/authRoutes"; // Importa las rutas de autenticación (agrega otras según necesites)

dotenv.config(); // Configuración de variables de entorno

class App {
  public readonly app: Application;
  private readonly port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || "4000", 10); // Puerto por defecto 4000
    this.init();
  }

  private init() {
    this.initConfig();
    this.initMiddlewares();
    this.initRoutes();
  }

  private initConfig() {
    // Configura la conexión a la base de datos utilizando el patrón Singleton
    Database.getInstance(); // Se asegura de que solo haya una conexión activa y configura los roles por defecto
  }

  private initMiddlewares() {
    this.app.use(cors());
    this.app.use(morgan("dev")); // Logging
    this.app.use(express.json()); // Leer datos de formularios
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initRoutes() {
    this.app.use("/api/auth", authRoutes); // Ejemplo de ruta; agrega otras rutas según tu aplicación
    // Otras rutas de la API pueden agregarse aquí (userRoutes, productRoutes, etc.)
  }


  public listen() {
    this.app.listen(this.port, () => {
      console.log(colors.cyan.bold(`El servidor está en funcionamiento en http://localhost:${this.port}`));
    });
  }
  
}

export default App;

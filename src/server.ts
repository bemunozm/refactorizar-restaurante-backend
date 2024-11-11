import express, { Application } from "express";
import cors from "cors";
import colors from "colors";
import morgan from "morgan";
import dotenv from "dotenv";
import Database from "./config/db"; // Importa la clase Database
import authRoutes from "./routes/authRoutes"; // Importa las rutas de autenticación (agrega otras según necesites)
import { User } from "./models/User";
import { UserRepository } from "./repositories/UserRepository";
import { UserService } from "./services/UserService";
import { AuthService } from "./services/AuthService";
import sessionRoutes from "./routes/sessionRoutes";
import tableRoutes from "./routes/tableRoutes";
import productRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import orderRoutes from "./routes/orderRoutes";
import ingredientRoutes from "./routes/ingredientRoutes";
import path from "path";
import roleRoutes from "./routes/roleRoutes";
import transbankRoutes from "./routes/transbankRoutes";

dotenv.config(); // Configuración de variables de entorno

class App {
  public readonly app: Application;
  private readonly port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || "4000", 10); // Puerto por defecto 4000
    this.init();
    //this.unitaryTest(); // Ejecuta las pruebas unitarias
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
    this.app.use("/api/session", sessionRoutes);
    this.app.use("/api/table", tableRoutes);
    this.app.use("/api/product", productRoutes);
    this.app.use("/api/category", categoryRoutes);
    this.app.use("/api/order", orderRoutes);
    this.app.use("/api/role", roleRoutes);
    this.app.use("/api/ingredient", ingredientRoutes);
    this.app.use("/api/transbank", transbankRoutes); // Ejemplo de ruta; agrega otras rutas según tu aplicación
    // Servir las imágenes estáticas
    this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
    // Otras rutas de la API pueden agregarse aquí (userRoutes, productRoutes, etc.)
  }


  public listen() {
    this.app.listen(this.port, () => {
      console.log(colors.cyan.bold(`El servidor está en funcionamiento en http://localhost:${this.port}`));
    });
  }

  public async unitaryTest() {
    // Aquí puedes agregar tus pruebas unitarias
    const user = new AuthService();
    console.log(await user.confirmAccount('379504'))
  }
  
}

export default App;

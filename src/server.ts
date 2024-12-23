import express, { Application } from "express";
import cors from "cors";
import colors from "colors";
import morgan from "morgan";
import dotenv from "dotenv";
import http from "http"; // Importa http para crear el servidor

import Database from "./config/db"; // Importa la clase Database
import authRoutes from "./routes/authRoutes"; // Importa las rutas de autenticación (agrega otras según necesites)
import sessionRoutes from "./routes/sessionRoutes";
import tableRoutes from "./routes/tableRoutes";
import productRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import orderRoutes from "./routes/orderRoutes";
import path from "path";
import roleRoutes from "./routes/roleRoutes";
import transbankRoutes from "./routes/transbankRoutes";
import { Server, Socket } from "socket.io";
import { SocketService } from "./services/SocketService";
import assistanceRoutes from "./routes/assistanceRoutes";
import deliveryRoutes from "./routes/deliveryRoutes";
import discountRoutes from "./routes/discountRoutes";
import statisticsRoutes from "./routes/statisticsRoutes";
import emailRoutes from "./routes/emailRoutes"; // Importa las rutas de correo

dotenv.config(); // Configuración de variables de entorno

class App {
  public readonly app: Application;
  private readonly port: number;
  private server: http.Server; // Servidor HTTP para usar con Socket.IO
  private io: Server; // Instancia de Socket.IO

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || "4000", 10); // Puerto por defecto 4000
    this.server = http.createServer(this.app); // Crear el servidor HTTP
    this.io = new Server(this.server, {
      cors: {
        origin: process.env.FRONTEND_URL, // Configura el origen permitido
        methods: ["GET", "POST", "PUT", "DELETE"],
      },
    }); // Inicializa Socket.IO
    this.init();
  }

  private init() {
    this.initConfig();
    this.initMiddlewares();
    this.initRoutes();
    this.initSockets(); // Inicializa los sockets
  }

  private initConfig() {
    // Configura la conexión a la base de datos utilizando el patrón Singleton
    Database.getInstance(); // Se asegura de que solo haya una conexión activa y configura los roles por defecto
  }

  private initMiddlewares() {
    this.app.use(cors({origin: process.env.FRONTEND_URL, methods: ["GET", "POST", "PUT", "DELETE"]}));
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
    this.app.use("/api/transbank", transbankRoutes);
    this.app.use("/api/assistance", assistanceRoutes);
    this.app.use("/api/delivery", deliveryRoutes);
    this.app.use("/api/discount", discountRoutes);
    this.app.use("/api/statistics", statisticsRoutes);
    this.app.use("/api/email", emailRoutes); // Agrega la ruta de correo
    // Servir las imágenes estáticas

    
    this.app.use('/uploads', (req, res, next) => {
      res.setHeader('ngrok-skip-browser-warning', 'true');
      next();
    }, express.static(path.join(__dirname, '../uploads')));
    
  }

  private initSockets() {
    SocketService.init(this.io);
    let connectedUsers = [];
    this.io.on("connection", (socket) => {
      console.log(`Cliente conectado: ${socket.id}`);
      
      socket.on("joinUserRoom", (userId: string) => {
        socket.join(userId); // Usuario se une a la sala específica
        console.log(`Cliente ${socket.id} se unió a la sala ${userId}`);
      });

      // Aquí puedes configurar eventos de socket
      socket.on("joinRoom", (roomId: string) => {
        socket.join(roomId);
        console.log(`Cliente ${socket.id} se unió a la sala ${roomId}`);
      });

      socket.on("joinAdmin", () => {
        socket.join("admin");
        console.log(`Cliente ${socket.id} se unió a la sala de administradores`);
      });

      socket.on("joinKitchen", () => {
        socket.join("kitchen");
        console.log(`Cliente ${socket.id} se unió a la sala de cocina`);
      });

      socket.on("joinWaiter", () => {
        socket.join("waiter");
        console.log(`Cliente ${socket.id} se unió a la sala de meseros`);
      });

      socket.on("joinDeliveryAdmin", () => {
        socket.join("deliveryRoom");
        console.log(`Cliente ${socket.id} se unió a la sala de entregas como administrador`);
        socket.emit('connectedUsers', connectedUsers);
      });

      socket.on('leaveDeliveryAdmin', () => {
        console.log(`Cliente ${socket.id} salió de la sala de entregas como administrador`);
        socket.leave("deliveryRoom");
      });

      socket.on('joinDeliveryRoute', (deliveryId: string) => {
        socket.join(`deliveryRoute-${deliveryId}`);
        console.log(`Cliente ${socket.id} se unió a la sala de entrega ${deliveryId}`);
      });

      socket.on('leaveDeliveryRoute', (deliveryId: string) => {
        console.log(`Cliente ${socket.id} salió de la sala de entrega ${deliveryId}`);
        socket.leave(`deliveryRoute-${deliveryId}`);
      });

      socket.on('updateLocation', (location: { lat: number, lng: number }, deliveryId: string) => {
        socket.to(`deliveryRoute-${deliveryId}`).emit('updateLocation', location);
      });

      socket.on('joinDeliveryRoom', ({ user }) => {
        // Añadir el usuario a la lista de conectados si no está ya
        socket.join("deliveryRoom");
        if (!connectedUsers.some(user => user.user.userId === user.userId)) {
            connectedUsers.push({ user: user, socketId: socket.id });
            console.log(`Usuario ${user.userId} conectado a la sala de entregas.`);
        }
        // Emitir la lista actualizada de usuarios conectados
        socket.broadcast.emit('connectedUsers', connectedUsers);
    });

      socket.on('leaveDeliveryRoom', ({ user }) => {
        // Eliminar el usuario de la lista de conectados
        connectedUsers = connectedUsers.filter(user => user.user.userId !== user.userId);
        console.log(`Usuario ${user.userId} desconectado de la sala de entregas.`);
        // Emitir la lista actualizada de usuarios conectados
        socket.broadcast.emit('connectedUsers', connectedUsers);
        socket.leave("deliveryRoom");
    });

      socket.on("joinWaiterRoom", () => {
        socket.join("waiterRoom");
        console.log(`Cliente ${socket.id} se unió a la sala de pedidos de meseros`);
      });

      socket.on('leaveWaiterRoom', () => { 
        socket.leave('waiter');
        console.log(`Cliente ${socket.id} salió de la sala de pedidos de meseros`);
      });

      socket.on("disconnect", () => {
        connectedUsers = connectedUsers.filter(user => user.socketId !== socket.id);
        socket.broadcast.emit('connectedUsers', connectedUsers);
        console.log(`Cliente desconectado: ${socket.id}`);
      });
    });
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log(colors.cyan.bold(`El servidor está en funcionamiento en http://localhost:${this.port}`));
    });
  }

  public async unitaryTest() {
    // Aquí puedes agregar tus pruebas unitarias
    console.log("Pruebas unitarias no configuradas.");
  }
}

export default App;

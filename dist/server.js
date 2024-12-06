"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const colors_1 = __importDefault(require("colors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http")); // Importa http para crear el servidor
const db_1 = __importDefault(require("./config/db")); // Importa la clase Database
const authRoutes_1 = __importDefault(require("./routes/authRoutes")); // Importa las rutas de autenticación (agrega otras según necesites)
const sessionRoutes_1 = __importDefault(require("./routes/sessionRoutes"));
const tableRoutes_1 = __importDefault(require("./routes/tableRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const ingredientRoutes_1 = __importDefault(require("./routes/ingredientRoutes"));
const path_1 = __importDefault(require("path"));
const roleRoutes_1 = __importDefault(require("./routes/roleRoutes"));
const transbankRoutes_1 = __importDefault(require("./routes/transbankRoutes"));
const socket_io_1 = require("socket.io");
const SocketService_1 = require("./services/SocketService");
const assistanceRoutes_1 = __importDefault(require("./routes/assistanceRoutes"));
const deliveryRoutes_1 = __importDefault(require("./routes/deliveryRoutes"));
dotenv_1.default.config(); // Configuración de variables de entorno
class App {
    app;
    port;
    server; // Servidor HTTP para usar con Socket.IO
    io; // Instancia de Socket.IO
    constructor() {
        this.app = (0, express_1.default)();
        this.port = parseInt(process.env.PORT || "4000", 10); // Puerto por defecto 4000
        this.server = http_1.default.createServer(this.app); // Crear el servidor HTTP
        this.io = new socket_io_1.Server(this.server, {
            cors: {
                origin: process.env.FRONTEND_URL, // Configura el origen permitido
                methods: ["GET", "POST"],
            },
        }); // Inicializa Socket.IO
        this.init();
        //this.unitaryTest(); // Ejecuta las pruebas unitarias
    }
    init() {
        this.initConfig();
        this.initMiddlewares();
        this.initRoutes();
        this.initSockets(); // Inicializa los sockets
    }
    initConfig() {
        // Configura la conexión a la base de datos utilizando el patrón Singleton
        db_1.default.getInstance(); // Se asegura de que solo haya una conexión activa y configura los roles por defecto
    }
    initMiddlewares() {
        this.app.use((0, cors_1.default)());
        this.app.use((0, morgan_1.default)("dev")); // Logging
        this.app.use(express_1.default.json()); // Leer datos de formularios
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    initRoutes() {
        this.app.use("/api/auth", authRoutes_1.default); // Ejemplo de ruta; agrega otras rutas según tu aplicación
        this.app.use("/api/session", sessionRoutes_1.default);
        this.app.use("/api/table", tableRoutes_1.default);
        this.app.use("/api/product", productRoutes_1.default);
        this.app.use("/api/category", categoryRoutes_1.default);
        this.app.use("/api/order", orderRoutes_1.default);
        this.app.use("/api/role", roleRoutes_1.default);
        this.app.use("/api/ingredient", ingredientRoutes_1.default);
        this.app.use("/api/transbank", transbankRoutes_1.default);
        this.app.use("/api/assistance", assistanceRoutes_1.default);
        this.app.use("/api/delivery", deliveryRoutes_1.default);
        // Servir las imágenes estáticas
        this.app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
    }
    initSockets() {
        SocketService_1.SocketService.init(this.io);
        let connectedUsers = [];
        this.io.on("connection", (socket) => {
            console.log(`Cliente conectado: ${socket.id}`);
            socket.on("joinUserRoom", (userId) => {
                socket.join(userId); // Usuario se une a la sala específica
                console.log(`Cliente ${socket.id} se unió a la sala ${userId}`);
            });
            // Aquí puedes configurar eventos de socket
            socket.on("joinRoom", (roomId) => {
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
            socket.on('joinDeliveryRoute', (deliveryId) => {
                socket.join(`deliveryRoute-${deliveryId}`);
                console.log(`Cliente ${socket.id} se unió a la sala de entrega ${deliveryId}`);
            });
            socket.on('leaveDeliveryRoute', (deliveryId) => {
                console.log(`Cliente ${socket.id} salió de la sala de entrega ${deliveryId}`);
                socket.leave(`deliveryRoute-${deliveryId}`);
            });
            socket.on('updateLocation', (location, deliveryId) => {
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
    listen() {
        this.server.listen(this.port, () => {
            console.log(colors_1.default.cyan.bold(`El servidor está en funcionamiento en http://localhost:${this.port}`));
        });
    }
    async unitaryTest() {
        // Aquí puedes agregar tus pruebas unitarias
        console.log("Pruebas unitarias no configuradas.");
    }
}
exports.default = App;
//# sourceMappingURL=server.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assistance = void 0;
const AssistanceRepository_1 = require("../repositories/AssistanceRepository");
const Session_1 = require("./Session");
const User_1 = require("./User");
const Product_1 = require("./Product"); // Asegúrate de que esta clase exista o crea una que contenga los detalles del producto
class Assistance {
    assistanceId;
    session;
    user;
    type;
    status;
    transactionToken;
    itemId;
    itemDetails;
    createdAt;
    updatedAt;
    assistanceRepository;
    constructor(assistance) {
        this.assistanceId = assistance.assistanceId?.toString();
        this.type = assistance.type;
        this.status = assistance.status || 'Pendiente';
        this.transactionToken = assistance.transactionToken;
        this.itemId = assistance.itemId;
        this.itemDetails = assistance.itemDetails; // Mantener los detalles del ítem tal como fueron pasados
        this.createdAt = assistance.createdAt;
        this.updatedAt = assistance.updatedAt;
        this.assistanceRepository = new AssistanceRepository_1.AssistanceRepository();
        // Sanitiza los datos iniciales
        this.sanitizeData(assistance);
    }
    /**
     * Método para sanear y crear instancias mínimas de los datos relacionados.
     */
    sanitizeData(assistance) {
        // Crear una instancia de `Session` con solo el ID si `session` es un string
        this.session = assistance.session instanceof Session_1.Session
            ? assistance.session
            : new Session_1.Session({ sessionId: assistance.session });
        // Crear una instancia de `User` con solo el ID si `user` es un string
        this.user = assistance.user instanceof User_1.User
            ? assistance.user
            : assistance.user
                ? new User_1.User({ userId: assistance.user })
                : null;
    }
    /**
     * Método populate para cargar los datos completos de los objetos relacionados.
     */
    async populate() {
        // Poblar el objeto `Session` si no está completamente cargado
        if (this.session.sessionId) {
            this.session = await this.session.findById();
        }
        // Poblar el objeto `User` si no está completamente cargado
        if (this.user?.userId) {
            this.user = await this.user.findById();
        }
        // Poblar el objeto `Product` dentro de itemDetails si no está completamente cargado
        if (this.itemDetails.product && this.itemDetails?.product.productId) {
            this.itemDetails.product = await this.itemDetails.product.findById();
        }
    }
    /**
     * Método para guardar la asistencia en la base de datos.
     */
    async save() {
        const assistanceData = {
            session: this.session.sessionId,
            user: this.user?.userId || null,
            type: this.type,
            status: this.status,
            transactionToken: this.transactionToken,
            itemId: this.itemId,
            itemDetails: this.itemDetails ? {
                product: this.itemDetails.product.productId, // Asegúrate de que el producto tenga un método `toObject`
                quantity: this.itemDetails.quantity,
                comment: this.itemDetails.comment
            } : undefined, // Guardar los detalles del ítem si existen
        };
        const savedAssistance = await this.assistanceRepository.save(assistanceData);
        await this.populateAssistance(savedAssistance);
        await this.populate();
        return this;
    }
    /**
     * Método estático para obtener todas las asistencias.
     */
    static async getAll() {
        const assistanceRepository = new AssistanceRepository_1.AssistanceRepository();
        const assistances = await assistanceRepository.findAll();
        return Promise.all(assistances.map(async (assistanceDoc) => {
            const assistance = new Assistance({});
            await assistance.populateAssistance(assistanceDoc);
            await assistance.populate();
            return assistance;
        }));
    }
    static async getAllAvailable() {
        const assistanceRepository = new AssistanceRepository_1.AssistanceRepository();
        const assistances = await assistanceRepository.getAllAssistance();
        return Promise.all(assistances.map(async (assistanceDoc) => {
            const assistance = new Assistance({});
            await assistance.populateAssistance(assistanceDoc);
            await assistance.populate();
            return assistance;
        }));
    }
    static async isSessionAssignedToOtherWaiter(sessionId, userId) {
        const assistanceRepository = new AssistanceRepository_1.AssistanceRepository();
        const assistances = await assistanceRepository.findBySessionId(sessionId);
        const formattedAssistances = await Promise.all(assistances.map(async (assistanceDoc) => {
            const assistance = new Assistance({});
            await assistance.populateAssistance(assistanceDoc);
            await assistance.populate();
            return assistance;
        }));
        return formattedAssistances.some(assistance => assistance.status === 'En Progreso' && assistance.user?.userId !== userId);
    }
    /**
     * Método para buscar una asistencia por ID.
     */
    async findById() {
        const assistanceDoc = await this.assistanceRepository.findById(this.assistanceId);
        if (assistanceDoc) {
            await this.populateAssistance(assistanceDoc);
            await this.populate();
            return this;
        }
        return null;
    }
    async findByItemId() {
        const assistanceDoc = await this.assistanceRepository.findByItemId(this.itemId);
        if (assistanceDoc) {
            await this.populateAssistance(assistanceDoc);
            await this.populate();
            return this;
        }
        return null;
    }
    async findBySessionId() {
        const assistances = await this.assistanceRepository.findBySessionId(this.session.sessionId);
        if (assistances) {
            return Promise.all(assistances.map(async (assistanceDoc) => {
                const assistance = new Assistance({});
                await assistance.populateAssistance(assistanceDoc);
                await assistance.populate();
                return assistance;
            }));
        }
        return null;
    }
    /**
     * Método para asignar un usuario a una asistencia.
     */
    async assignUser(userId) {
        const user = new User_1.User({ userId });
        if (!(await user.findById())) {
            throw new Error('Usuario no encontrado');
        }
        this.user = user;
        const updatedAssistance = await this.assistanceRepository.update(this.assistanceId, {
            user: user.userId,
        });
        if (updatedAssistance) {
            await this.populateAssistance(updatedAssistance);
            await this.populate();
            return this;
        }
        return null;
    }
    /**
     * Método para confirmar una transacción asociada a la asistencia.
     */
    async confirmTransaction(transactionToken) {
        if (this.transactionToken !== transactionToken) {
            throw new Error('Token de transacción inválido');
        }
        this.status = 'Completado';
        const updatedAssistance = await this.assistanceRepository.update(this.assistanceId, { status: 'Completado' });
        if (updatedAssistance) {
            await this.populateAssistance(updatedAssistance);
            await this.populate();
            return this;
        }
        return null;
    }
    async updateStatus(status) {
        this.status = status;
        const updatedAssistance = await this.assistanceRepository.update(this.assistanceId, { status });
        if (updatedAssistance) {
            await this.populateAssistance(updatedAssistance);
            await this.populate();
            return this;
        }
        return null;
    }
    /**
     * Método para completar una asistencia.
     */
    async complete() {
        this.status = 'Completado';
        const updatedAssistance = await this.assistanceRepository.update(this.assistanceId, { status: 'Completado' });
        if (updatedAssistance) {
            await this.populateAssistance(updatedAssistance);
            return this;
        }
        return null;
    }
    static async getAssistancesBetweenDates(startDate, endDate) {
        const assistanceRepository = new AssistanceRepository_1.AssistanceRepository();
        const assistances = await assistanceRepository.getAssistancesBetweenDates(startDate, endDate);
        return Promise.all(assistances.map(async (assistanceDoc) => {
            const assistance = new Assistance({});
            await assistance.populateAssistance(assistanceDoc);
            await assistance.populate();
            return assistance;
        }));
    }
    /**
     * Método privado para popular los datos de un documento de asistencia.
     */
    async populateAssistance(assistanceDoc) {
        this.assistanceId = assistanceDoc._id.toString();
        this.session = new Session_1.Session({ sessionId: assistanceDoc.session.toString() });
        this.user = assistanceDoc.user ? new User_1.User({ userId: assistanceDoc.user.toString() }) : null;
        this.type = assistanceDoc.type;
        this.status = assistanceDoc.status;
        this.transactionToken = assistanceDoc.transactionToken;
        this.itemId = assistanceDoc.itemId;
        // Asignar itemDetails si existen
        this.itemDetails = assistanceDoc.itemDetails
            ? {
                product: assistanceDoc.itemDetails.product ? new Product_1.Product({ productId: assistanceDoc.itemDetails.product.toString() }) : null, // Asegúrate de crear una clase Product si no existe
                quantity: assistanceDoc.itemDetails.quantity,
                comment: assistanceDoc.itemDetails.comment,
            }
            : undefined;
        this.createdAt = assistanceDoc.createdAt;
        this.updatedAt = assistanceDoc.updatedAt;
    }
}
exports.Assistance = Assistance;
//# sourceMappingURL=Assistance.js.map
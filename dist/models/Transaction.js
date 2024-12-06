"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const TransactionRepository_1 = require("../repositories/TransactionRepository");
const Session_1 = require("./Session");
const Order_1 = require("./Order");
class Transaction {
    transactionId;
    token;
    orders;
    session;
    onlineOrderId;
    amount;
    status;
    transactionRepository;
    constructor(data) {
        this.transactionId = data.transactionId;
        this.token = data.token || '';
        this.amount = data.amount || 0;
        this.status = data.status || 'CREADA';
        this.onlineOrderId = data.onlineOrderId;
        // Sanitizar datos para asegurar que `session` y `orders` sean instancias de sus modelos
        this.sanitizeData(data);
        this.transactionRepository = new TransactionRepository_1.TransactionRepository();
    }
    /**
     * Método para sanear y crear instancias mínimas de los datos relacionados.
     */
    sanitizeData(data) {
        // Asegurar que `session` sea una instancia de `Session`
        this.session = data.session ? (data.session instanceof Session_1.Session
            ? data.session
            : new Session_1.Session({ sessionId: data.session || '' }))
            : undefined;
        // Asegurar que cada elemento en `orders` sea una instancia de `Order`, si `orders` está presente
        this.orders = data.orders ? data.orders.map(order => order instanceof Order_1.Order
            ? order
            : new Order_1.Order({ orderId: order || '' })) : undefined;
    }
    /**
     * Método para cargar completamente `session` y `orders`.
     */
    async populate() {
        // Poblar `session` si solo tiene el ID
        if (this.session && !this.session.table.tableId) {
            this.session = await this.session.findById();
        }
        // Poblar cada orden en `orders`
        this.orders = await Promise.all(this.orders.map(async (order) => {
            if (!order.status) { // Si solo tiene el ID
                return await order.findById();
            }
            return order;
        }));
    }
    /**
     * Guarda la transacción en la base de datos.
     */
    async save() {
        const orders = this.orders ? this.orders.map(order => order.orderId) : [];
        const DataToSave = {
            token: this.token,
            amount: this.amount,
            status: this.status,
            session: this.session?.sessionId,
            onlineOrderId: this.onlineOrderId,
            orders: orders,
        };
        const savedTransaction = await this.transactionRepository.save(DataToSave);
        this.transactionId = savedTransaction.id;
        this.status = savedTransaction.status;
        return this;
    }
    /**
     * Encuentra la transacción por token y carga sus datos completos.
     */
    async findByToken() {
        const transaction = await this.transactionRepository.findByToken(this.token);
        if (transaction) {
            this.transactionId = transaction.id;
            this.token = transaction.token;
            this.amount = transaction.amount;
            this.status = transaction.status;
            this.onlineOrderId = transaction.onlineOrderId;
            // Sanitizar y poblar `session` y `orders`
            this.sanitizeData(transaction);
            await this.populate();
            return this;
        }
        return null;
    }
    /**
     * Encuentra la transacción por ID y carga sus datos completos.
     */
    async findById() {
        const transaction = await this.transactionRepository.findById(this.transactionId);
        if (transaction) {
            this.transactionId = transaction.id;
            this.token = transaction.token;
            this.amount = transaction.amount;
            this.status = transaction.status;
            this.onlineOrderId = transaction.onlineOrderId;
            // Sanitizar y poblar `session` y `orders`
            this.sanitizeData(transaction);
            await this.populate();
            return this;
        }
        return null;
    }
    /**
     * Actualiza el token de la transacción.
     */
    async updateToken(token) {
        await this.transactionRepository.updateToken(this.transactionId, token);
        this.token = token;
    }
    /**
     * Actualiza el estado de la transacción.
     */
    async updateStatus(status) {
        await this.transactionRepository.updateStatus(this.transactionId, status);
        this.status = status;
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=Transaction.js.map
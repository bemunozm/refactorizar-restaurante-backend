"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const OrderRepository_1 = require("../repositories/OrderRepository");
const Session_1 = require("./Session");
const Table_1 = require("./Table");
const Product_1 = require("./Product");
const User_1 = require("./User");
class Order {
    orderId;
    session;
    table;
    guest;
    user;
    type;
    items;
    status;
    createdAt;
    updatedAt;
    orderRepository;
    constructor(order) {
        this.orderId = order.orderId?.toString();
        this.status = order.status || 'Sin Pagar';
        this.guest = order.guest || { name: '', orders: [] };
        this.type = order.type || 'Presencial';
        this.items = order.items || [];
        this.createdAt = order.createdAt;
        this.updatedAt = order.updatedAt;
        this.orderRepository = new OrderRepository_1.OrderRepository();
        // Sanitiza los datos iniciales
        this.sanitizeData(order);
    }
    /**
     * Método para sanear y crear instancias mínimas de los datos relacionados.
     */
    sanitizeData(order) {
        this.session = order.session instanceof Session_1.Session
            ? order.session
            : order.session ? new Session_1.Session({ sessionId: order.session }) : undefined;
        this.table = order.table instanceof Table_1.Table
            ? order.table
            : order.table ? new Table_1.Table({ tableId: order.table }) : undefined;
        this.user = order.user instanceof User_1.User
            ? order.user
            : order.user ? new User_1.User({ userId: order.user }) : undefined;
        if (this.guest?.user && typeof this.guest.user === 'string') {
            this.guest.user = new User_1.User({ userId: this.guest.user });
        }
        this.items = (order.items || []).map(item => ({
            product: item.product instanceof Product_1.Product
                ? item.product
                : new Product_1.Product({ productId: item.product }),
            quantity: item.quantity,
            status: item.status,
            comment: item.comment
        }));
    }
    /**
     * Método populate para cargar los datos completos de los objetos relacionados.
     */
    async populate() {
        if (this.session && !this.session.table) {
            this.session = await this.session.findById();
        }
        if (this.table && !this.table.tableNumber) {
            this.table = await this.table.findById();
        }
        if (this.user && !this.user.name && this.user.userId) {
            this.user = await this.user.findById();
        }
        if (this.guest?.user instanceof User_1.User && !this.guest.user.name) {
            this.guest.user = await this.guest.user.findById();
        }
        this.items = await Promise.all(this.items.map(async (item) => {
            if (!(item.product instanceof Product_1.Product) || !item.product.name) {
                item.product = await item.product.findById();
            }
            return item;
        }));
    }
    async save() {
        const items = this.items.map(item => ({
            product: item.product instanceof Product_1.Product
                ? item.product.productId
                : item.product,
            quantity: item.quantity,
            status: item.status || 'Pendiente',
            comment: item.comment || ''
        }));
        const DataToSave = {
            session: this.session ? this.session.sessionId : undefined,
            table: this.table ? this.table.tableId : undefined,
            user: this.user ? this.user.userId : undefined,
            guest: this.guest ? this.guest.guestId : undefined,
            items,
            status: this.status,
            type: this.type
        };
        const savedOrder = await this.orderRepository.save(DataToSave);
        await this.populateOrder(savedOrder);
        return this;
    }
    static async getAll() {
        const orderRepository = new OrderRepository_1.OrderRepository();
        const orders = await orderRepository.findAll();
        return Promise.all(orders.map(async (orderDoc) => {
            const order = new Order({});
            await order.populateOrder(orderDoc);
            await order.populate();
            return order;
        }));
    }
    static async findBySessionId(sessionId) {
        const orderRepository = new OrderRepository_1.OrderRepository();
        const orders = await orderRepository.findBySessionId(sessionId);
        if (orders) {
            return await Promise.all(orders.map(async (orderDoc) => {
                const order = new Order({});
                await order.populateOrder(orderDoc);
                await order.populate();
                return order;
            }));
        }
        return null;
    }
    async updateItemStatus(itemId, status) {
        const updatedOrder = await this.orderRepository.updateItemStatus(itemId, status);
        console.log('Updated Order', updatedOrder);
        if (updatedOrder) {
            await this.populateOrder(updatedOrder);
            await this.populate();
            return this;
        }
        return null;
    }
    async updateOrderStatus(status) {
        const updatedOrder = await this.orderRepository.update(this.orderId, { status });
        console.log('Updated Order', updatedOrder);
        if (updatedOrder) {
            await this.populateOrder(updatedOrder);
            return this;
        }
        return null;
    }
    async findById() {
        const orderDoc = await this.orderRepository.findById(this.orderId);
        if (orderDoc) {
            await this.populateOrder(orderDoc);
            await this.populate();
            return this;
        }
        return null;
    }
    async findForKitchen() {
        const orders = await this.orderRepository.findForKitchen();
        console.log('Kitchen Data', orders);
        return Promise.all(orders.map(async (orderDoc) => {
            const order = new Order({});
            await order.populateOrder(orderDoc);
            await order.populate();
            return order;
        }));
    }
    static async findByUserId(userId) {
        const orderRepository = new OrderRepository_1.OrderRepository();
        const orders = await orderRepository.findByUserId(userId);
        if (orders) {
            return Promise.all(orders.map(async (orderDoc) => {
                const order = new Order({});
                await order.populateOrder(orderDoc);
                await order.populate();
                return order;
            }));
        }
        return null;
    }
    async updateGuestToUserOrders() {
        if (!this.guest || !this.user)
            return false;
        const updated = await this.orderRepository.updateGuestToUserOrders(this.guest.guestId, this.user.userId);
        return updated ? true : false;
    }
    static async getOrdersBetweenDates(startDate, endDate) {
        const orderRepository = new OrderRepository_1.OrderRepository();
        const orders = await orderRepository.getOrdersBetweenDates(startDate, endDate);
        if (orders) {
            return Promise.all(orders.map(async (orderDoc) => {
                const order = new Order({});
                await order.populateOrder(orderDoc);
                await order.populate();
                return order;
            }));
        }
        return null;
    }
    /**
     * Popula los datos de un documento de orden.
     */
    async populateOrder(orderDoc) {
        this.orderId = orderDoc.id;
        this.session = orderDoc.session ? new Session_1.Session({ sessionId: orderDoc.session.toString() }) : undefined;
        this.table = orderDoc.table ? new Table_1.Table({ tableId: orderDoc.table.toString() }) : undefined;
        this.user = orderDoc.user ? new User_1.User({ userId: orderDoc.user.toString() }) : undefined;
        this.status = orderDoc.status;
        this.type = orderDoc.type;
        this.items = orderDoc.items.map((item) => ({
            itemId: item._id.toString(),
            product: new Product_1.Product({ productId: item.product.toString() }),
            quantity: item.quantity,
            status: item.status,
            comment: item.comment
        }));
        this.createdAt = orderDoc.createdAt;
        this.updatedAt = orderDoc.updatedAt;
        this.guest = orderDoc.guest ? {
            guestId: orderDoc.guest.toString(),
            name: orderDoc.guest.name || '',
            user: typeof orderDoc.guest.user === 'string'
                ? new User_1.User({ userId: orderDoc.guest.user })
                : orderDoc.guest.user,
            orders: orderDoc.guest.orders || []
        } : undefined;
    }
}
exports.Order = Order;
//# sourceMappingURL=Order.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delivery = void 0;
const DeliveryRepository_1 = require("../repositories/DeliveryRepository");
const Order_1 = require("./Order");
const User_1 = require("./User");
class Delivery {
    deliveryId;
    orders;
    status;
    customerInformation;
    address;
    startPoint;
    user;
    deliveryMan;
    createdAt;
    updatedAt;
    deliveryRepository;
    constructor(delivery) {
        this.deliveryId = delivery.deliveryId;
        this.status = delivery.status || 'Recibido';
        this.customerInformation = delivery.customerInformation;
        this.address = delivery.address;
        this.startPoint = delivery.startPoint;
        this.createdAt = delivery.createdAt;
        this.updatedAt = delivery.updatedAt;
        this.deliveryRepository = new DeliveryRepository_1.DeliveryRepository();
        this.sanitizeData(delivery);
    }
    sanitizeData(delivery) {
        // Asegurar que cada elemento en `orders` sea una instancia de `Order`
        this.orders = (delivery.orders || []).map(order => order instanceof Order_1.Order
            ? order
            : new Order_1.Order({ orderId: order || '' }));
        this.user = delivery.user instanceof User_1.User
            ? delivery.user
            : delivery.user
                ? new User_1.User({ userId: delivery.user })
                : undefined;
        this.deliveryMan = delivery.deliveryMan instanceof User_1.User
            ? delivery.deliveryMan
            : delivery.deliveryMan
                ? new User_1.User({ userId: delivery.deliveryMan })
                : undefined;
    }
    async save() {
        const deliveryData = {
            orders: this.orders.map(order => order.orderId),
            status: this.status,
            address: this.address,
            startPoint: this.startPoint,
            user: this.user?.userId,
            deliveryMan: this.deliveryMan?.userId,
            customerInformation: this.customerInformation
        };
        const savedDelivery = await this.deliveryRepository.save(deliveryData);
        await this.populateDelivery(savedDelivery);
        return this;
    }
    static async getAll() {
        const deliveryRepository = new DeliveryRepository_1.DeliveryRepository();
        const deliveries = await deliveryRepository.findAll();
        return Promise.all(deliveries.map(async (deliveryDoc) => {
            const assistance = new Delivery({});
            await assistance.populateDelivery(deliveryDoc);
            return assistance;
        }));
    }
    static async getByOrderId(orderId) {
        const deliveryRepository = new DeliveryRepository_1.DeliveryRepository();
        const deliveryDoc = await deliveryRepository.findByOrderId(orderId);
        if (deliveryDoc) {
            const delivery = new Delivery({});
            await delivery.populateDelivery(deliveryDoc);
            return delivery;
        }
        return null;
    }
    async assignUser(userId) {
        const user = new User_1.User({ userId });
        if (!(await user.findById())) {
            throw new Error('Usuario no encontrado');
        }
        this.deliveryMan = user;
        const updatedDelivery = await this.deliveryRepository.update(this.deliveryId, { deliveryMan: user.userId });
        if (updatedDelivery) {
            await this.populateDelivery(updatedDelivery);
            return this;
        }
        return null;
    }
    async start() {
        const updatedDelivery = await this.deliveryRepository.update(this.deliveryId, { status: 'En Camino', startPoint: this.startPoint });
        if (updatedDelivery) {
            await this.populateDelivery(updatedDelivery);
            return this;
        }
        return null;
    }
    async updateStatus(status) {
        this.status = status;
        const updatedDelivery = await this.deliveryRepository.update(this.deliveryId, { status });
        if (updatedDelivery) {
            await this.populateDelivery(updatedDelivery);
            return this;
        }
        return null;
    }
    async complete() {
        this.status = 'Completado';
        const updatedDelivery = await this.deliveryRepository.update(this.deliveryId, { status: 'Completado' });
        if (updatedDelivery) {
            await this.populateDelivery(updatedDelivery);
            return this;
        }
        return null;
    }
    async inProgress() {
        this.status = 'En Preparación';
        const updatedDelivery = await this.deliveryRepository.update(this.deliveryId, { status: 'En Preparación' });
        if (updatedDelivery) {
            await this.populateDelivery(updatedDelivery);
            return this;
        }
        return null;
    }
    async pending() {
        this.status = 'Recibido';
        const updatedDelivery = await this.deliveryRepository.update(this.deliveryId, { status: 'Recibido' });
        if (updatedDelivery) {
            await this.populateDelivery(updatedDelivery);
            return this;
        }
        return null;
    }
    async findById() {
        const deliveryDoc = await this.deliveryRepository.findById(this.deliveryId);
        if (deliveryDoc) {
            await this.populateDelivery(deliveryDoc);
            return this;
        }
        return null;
    }
    async populateDelivery(deliveryDoc) {
        this.deliveryId = deliveryDoc._id.toString();
        this.orders = await Promise.all(deliveryDoc.orders.map(async (orderId) => {
            const order = new Order_1.Order({ orderId });
            return await order.findById();
        }));
        this.customerInformation = deliveryDoc.customerInformation;
        this.status = deliveryDoc.status;
        this.address = deliveryDoc.address;
        this.startPoint = deliveryDoc.startPoint;
        this.user = deliveryDoc.user ? await new User_1.User({ userId: deliveryDoc.user.toString() }).findById() : undefined;
        this.deliveryMan = deliveryDoc.deliveryMan ? await new User_1.User({ userId: deliveryDoc.deliveryMan.toString() }).findById() : undefined;
        this.createdAt = deliveryDoc.createdAt;
        this.updatedAt = deliveryDoc.updatedAt;
    }
}
exports.Delivery = Delivery;
//# sourceMappingURL=Delivery.js.map
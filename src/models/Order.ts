import { OrderDocument, OrderInterface, OrderItemInterface, OrderItemDocument } from "../interfaces/OrderInterface";
import { OrderRepository } from "../repositories/OrderRepository";
import { Session } from "./Session";
import { Table } from "./Table";
import { Product } from "./Product";
import { User } from "./User";
import { GuestInterface } from "../interfaces/GuestInterface";

export class Order implements OrderInterface {
    public orderId?: string;
    public session?: Session;
    public table?: Table;
    public guest?: GuestInterface;
    public user?: User;
    public type: 'Retiro en Tienda' | 'Delivery' | 'Presencial';
    public items: OrderItemInterface[];
    public status: 'Sin Pagar' | 'Pagado' | 'Pendiente' | 'Cancelado' | 'Entregado' | 'Listo' | 'En Preparacion';
    public createdAt?: Date;
    public updatedAt?: Date;
    private orderRepository: OrderRepository;

    constructor(order: Partial<OrderInterface>) {
        this.orderId = order.orderId?.toString();
        this.status = order.status || 'Sin Pagar';
        this.guest = order.guest || { name: '', orders: [] };
        this.type = order.type || 'Presencial';
        this.items = order.items || [];
        this.createdAt = order.createdAt;
        this.updatedAt = order.updatedAt;
        this.orderRepository = new OrderRepository();

        // Sanitiza los datos iniciales
        this.sanitizeData(order);
    }

    /**
     * Método para sanear y crear instancias mínimas de los datos relacionados.
     */
    private sanitizeData(order: Partial<OrderInterface>) {
        this.session = order.session instanceof Session 
            ? order.session 
            : order.session ? new Session({ sessionId: order.session }) : undefined;

        this.table = order.table instanceof Table 
            ? order.table 
            : order.table ? new Table({ tableId: order.table }) : undefined;

        this.user = order.user instanceof User 
            ? order.user 
            : order.user ? new User({ userId: order.user }) : undefined;

        if (this.guest?.user && typeof this.guest.user === 'string') {
            this.guest.user = new User({ userId: this.guest.user });
        }

        this.items = (order.items || []).map(item => ({
            product: item.product instanceof Product 
                ? item.product 
                : new Product({ productId: item.product }),
            quantity: item.quantity,
            status: item.status,
            comment: item.comment
        }));
    }

    /**
     * Método populate para cargar los datos completos de los objetos relacionados.
     */
    public async populate(): Promise<void> {
        if (this.session && !this.session.table) {
            this.session = await this.session.findById();
        }

        if (this.table && !this.table.tableNumber) {
            this.table = await this.table.findById();
        }

        if (this.user && !this.user.name && this.user.userId) {
            this.user = await this.user.findById();
        }

        if (this.guest?.user instanceof User && !this.guest.user.name) {
            this.guest.user = await this.guest.user.findById();
        }

        this.items = await Promise.all(
            this.items.map(async item => {
                if (!(item.product instanceof Product) || !item.product.name) {
                    item.product = await (item.product as Product).findById();
                }
                return item;
            })
        );
    }

    public async save(): Promise<Order> {
        const items = this.items.map(item => ({
            product: item.product instanceof Product
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

    static async getAll(): Promise<Order[]> {
        const orderRepository = new OrderRepository();
        const orders = await orderRepository.findAll();
        return Promise.all(orders.map(async (orderDoc) => {
            const order = new Order({});
            await order.populateOrder(orderDoc);
            await order.populate();
            return order;
        }));
    }

    static async findBySessionId(sessionId: string): Promise<Order[] | null> {
        const orderRepository = new OrderRepository();
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

    public async updateItemStatus(itemId: string, status: string): Promise<Order | null> {
        const updatedOrder = await this.orderRepository.updateItemStatus(itemId, status);
        console.log('Updated Order', updatedOrder);
        if (updatedOrder) {
            await this.populateOrder(updatedOrder);
            await this.populate();
            return this;
        }
        return null;
    }

    public async updateOrderStatus(status: 'Sin Pagar' | 'Pagado' | 'Pendiente' | 'Cancelado' | 'Entregado' | 'Listo' | 'En Preparacion'): Promise<Order | null> {
        const updatedOrder = await this.orderRepository.update(this.orderId, { status });
        console.log('Updated Order', updatedOrder);
        if (updatedOrder) {
            await this.populateOrder(updatedOrder);
            return this;
        }
        return null;
    }

    public async findById(): Promise<Order | null> {
        const orderDoc = await this.orderRepository.findById(this.orderId);
        if (orderDoc) {
            await this.populateOrder(orderDoc);
            await this.populate();
            return this;
        }
        return null;
    }

    public async findForKitchen(): Promise<Order[]> {
        const orders = await this.orderRepository.findForKitchen();
        console.log('Kitchen Data', orders);
        return Promise.all(orders.map(async (orderDoc) => {
            const order = new Order({});
            await order.populateOrder(orderDoc);
            await order.populate();
            return order;
        }));
    }

    static async findByUserId(userId: string): Promise<Order[]> {
        const orderRepository = new OrderRepository();
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

    public async updateGuestToUserOrders(): Promise<boolean> {
        if (!this.guest || !this.user) return false;
        const updated = await this.orderRepository.updateGuestToUserOrders(this.guest.guestId, this.user.userId);
        return updated ? true : false;
    }

    static async getOrdersBetweenDates(startDate: Date, endDate: Date): Promise<Order[]> {
        const orderRepository = new OrderRepository();
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
    private async populateOrder(orderDoc: OrderDocument): Promise<void> {
        this.orderId = orderDoc.id;
        this.session = orderDoc.session ? new Session({ sessionId: orderDoc.session.toString() }) : undefined;
        this.table = orderDoc.table ? new Table({ tableId: orderDoc.table.toString() }) : undefined;
        this.user = orderDoc.user ? new User({ userId: orderDoc.user.toString() }) : undefined;
        this.status = orderDoc.status;
        this.type = orderDoc.type;
        
        this.items = orderDoc.items.map((item: OrderItemDocument) => ({
            itemId: item._id.toString(),
            product: new Product({ productId: item.product.toString() }),
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
                ? new User({ userId: orderDoc.guest.user })
                : orderDoc.guest.user,
            orders: orderDoc.guest.orders || []
        } : undefined;
    }
}

import { OrderDocument, OrderInterface, OrderItemDocument, OrderItemInterface } from "../interfaces/OrderInterface";
import { OrderRepository } from "../repositories/OrderRepository";
import { Session } from "./Session";
import { Table } from "./Table";
import { Product } from "./Product";
import { User } from "./User";
import { GuestInterface } from "../interfaces/GuestInterface";

export class Order implements OrderInterface {
    public orderId?: string;
    public sessionId: Session;
    public tableId: Table;
    public guestId: GuestInterface; // Usamos GuestInterface directamente
    public userId: User;
    public items: OrderItemInterface[];
    public status: 'Sin Pagar' | 'Pagado' | 'Pendiente';
    public createdAt?: Date;
    public updatedAt?: Date;
    private orderRepository: OrderRepository;

    constructor(order: Partial<OrderInterface>) {
        this.orderId = order.orderId?.toString();
        this.sessionId = new Session({ sessionId: order.sessionId?.toString() || '' });
        this.tableId = new Table({ tableId: order.tableId?.toString() || '' });
        this.guestId = order.guestId || { name: '', orders: [] }; // Asignar GuestInterface vacío si no está definido
        this.userId = new User({ userId: order.userId?.toString() || '' });
        this.items = order.items || [];
        this.status = order.status || 'Sin Pagar';
        this.orderRepository = new OrderRepository();
    }

    // Método para poblar la orden con instancias completas de sus objetos relacionados
    private async populateOrder(orderDoc: OrderDocument): Promise<void> {
        this.orderId = orderDoc.id;
    
        // Cargar instancias completas de Session, Table y User solo si los valores están definidos
        this.sessionId = orderDoc.sessionId ? await new Session({ sessionId: orderDoc.sessionId.toString() }).findById() : null;
        this.tableId = orderDoc.tableId ? await new Table({ tableId: orderDoc.tableId.toString() }).findById() : null;
        this.userId = orderDoc.userId ? await new User({ userId: orderDoc.userId.toString() }).findById() : null;
    
        // Mapear items a objetos de tipo OrderItemInterface con instancias de Product
        this.items = await Promise.all(orderDoc.items.map(async (item: OrderItemDocument) => ({
            itemId: item.id,
            productId: item.productId ? await new Product({ productId: item.productId.toString() }).findById() : null,
            quantity: item.quantity,
            status: item.status,
            comment: item.comment
        }))) as OrderItemInterface[];
    
        this.status = orderDoc.status;

        // Asignar directamente guestId conforme a GuestInterface sin necesidad de instanciar
        this.guestId = {
            guestId: orderDoc.guestId?.toString(),
            name: orderDoc.guestId?.name || '',
            user: (orderDoc.guestId && typeof orderDoc.guestId !== 'string') ? orderDoc.guestId.user : undefined,
            orders: orderDoc.guestId?.orders || []
        };

        this.createdAt = orderDoc.createdAt;
        this.updatedAt = orderDoc.updatedAt;
    }
    
    public async save(): Promise<Order> {
        const savedOrder = await this.orderRepository.save(this);
        await this.populateOrder(savedOrder);
        return this;
    }

    static async getAll(): Promise<Order[]> {
        const orderRepository = new OrderRepository();
        const orders = await orderRepository.findAll();
        return Promise.all(orders.map(async (orderDoc) => {
            const order = new Order({});
            await order.populateOrder(orderDoc);
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
                return order;
            }));
        }
        return null;
    }

    public async updateItemStatus(itemId: string, status: string): Promise<Order | null> {
        const updatedOrder = await this.orderRepository.updateItemStatus(itemId, status);
        if (updatedOrder) {
            await this.populateOrder(updatedOrder);
            return this;
        }
        return null;
    }

    public async updateOrderStatus(status: 'Sin Pagar' | 'Pagado' | 'Pendiente'): Promise<Order | null> {
        const updatedOrder = await this.orderRepository.update(this.orderId, { status });
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
            return this;
        }
        return null;
    }

    public async findForKitchen(): Promise<Order[]> {
        const orders = await this.orderRepository.findForKitchen();
        return Promise.all(orders.map(async (orderDoc) => {
            const order = new Order({});
            await order.populateOrder(orderDoc);
            return order;
        }));
    }

    public async findByUserId(): Promise<Order[]> {
        const orders = await this.orderRepository.findByUserId(this.userId.userId);	
        if (orders) {
            return Promise.all(orders.map(async (orderDoc) => {
                const order = new Order({});
                await order.populateOrder(orderDoc);
                return order;
            }));
        }
        return null;
    }

    public async updateGuestToUserOrders(): Promise<boolean> {
        const updated = await this.orderRepository.updateGuestToUserOrders(this.guestId.guestId, this.userId.userId);
        return updated ? true : false;
    }
}

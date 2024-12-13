import { OrderInterface, OrderItemInterface } from "../interfaces/OrderInterface";
import { Session } from "./Session";
import { Table } from "./Table";
import { User } from "./User";
import { GuestInterface } from "../interfaces/GuestInterface";
export declare class Order implements OrderInterface {
    orderId?: string;
    session?: Session;
    table?: Table;
    guest?: GuestInterface;
    user?: User;
    type: 'Retiro en Tienda' | 'Delivery' | 'Presencial';
    items: OrderItemInterface[];
    status: 'Sin Pagar' | 'Pagado' | 'Pendiente';
    createdAt?: Date;
    updatedAt?: Date;
    private orderRepository;
    constructor(order: Partial<OrderInterface>);
    /**
     * Método para sanear y crear instancias mínimas de los datos relacionados.
     */
    private sanitizeData;
    /**
     * Método populate para cargar los datos completos de los objetos relacionados.
     */
    populate(): Promise<void>;
    save(): Promise<Order>;
    static getAll(): Promise<Order[]>;
    static findBySessionId(sessionId: string): Promise<Order[] | null>;
    updateItemStatus(itemId: string, status: string): Promise<Order | null>;
    updateOrderStatus(status: 'Sin Pagar' | 'Pagado' | 'Pendiente'): Promise<Order | null>;
    findById(): Promise<Order | null>;
    findForKitchen(): Promise<Order[]>;
    static findByUserId(userId: string): Promise<Order[]>;
    updateGuestToUserOrders(): Promise<boolean>;
    static getOrdersBetweenDates(startDate: Date, endDate: Date): Promise<Order[]>;
    /**
     * Popula los datos de un documento de orden.
     */
    private populateOrder;
}

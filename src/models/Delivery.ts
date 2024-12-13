import { DeliveryInterface } from '../interfaces/DeliveryInterface';
import { DeliveryRepository } from '../repositories/DeliveryRepository';
import { Order } from './Order';
import { User } from './User';

export class Delivery implements DeliveryInterface {
    public deliveryId?: string;
    public orders: Order[];
    public status: 'Recibido' | 'En Preparación' | 'En Camino' | 'Completado' | 'Listo para Entregar';
    public customerInformation: {
        name: string;
        lastName: string;
        phone: string;
        email?: string;
        instructions?: string | null;
    };
    public address: { lat: number; lng: number };
    public startPoint: { lat: number; lng: number };
    public user?: User;
    public deliveryMan?: User;
    public createdAt?: Date;
    public updatedAt?: Date;
    private deliveryRepository: DeliveryRepository;

    constructor(delivery: Partial<DeliveryInterface>) {
        this.deliveryId = delivery.deliveryId;
        this.status = delivery.status || 'Recibido';
        this.customerInformation = delivery.customerInformation;
        this.address = delivery.address;
        this.startPoint = delivery.startPoint;
        this.createdAt = delivery.createdAt;
        this.updatedAt = delivery.updatedAt;
        this.deliveryRepository = new DeliveryRepository();

        this.sanitizeData(delivery);
    }

    private sanitizeData(delivery: Partial<DeliveryInterface>) {

        // Asegurar que cada elemento en `orders` sea una instancia de `Order`
        this.orders = (delivery.orders || []).map(order =>
            order instanceof Order
                ? order
                : new Order({ orderId: order || '' })
        );

        this.user = delivery.user instanceof User 
            ? delivery.user 
            : delivery.user 
                ? new User({ userId: delivery.user })
                : undefined;

        this.deliveryMan = delivery.deliveryMan instanceof User 
            ? delivery.deliveryMan 
            : delivery.deliveryMan 
                ? new User({ userId: delivery.deliveryMan })
                : undefined;
    }

    public async save(): Promise<Delivery> {
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

    public static async getAll(): Promise<Delivery[]> {
        const deliveryRepository = new DeliveryRepository();
        const deliveries = await deliveryRepository.findAll();

        return Promise.all(deliveries.map(async (deliveryDoc) => {
            const assistance = new Delivery({});
            await assistance.populateDelivery(deliveryDoc);
            return assistance;
        }));
    }

    public static async getByOrderId(orderId: string): Promise<Delivery | null> {
        const deliveryRepository = new DeliveryRepository();
        const deliveryDoc = await deliveryRepository.findByOrderId(orderId);
        if (deliveryDoc) {
            const delivery = new Delivery({});
            await delivery.populateDelivery(deliveryDoc);
            return delivery;
        }
        return null;
    }

    public async assignUser(userId: string): Promise<Delivery | null> {
        const user = new User({ userId });
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

    public async start(): Promise<Delivery | null> {
        const updatedDelivery = await this.deliveryRepository.update(this.deliveryId, { status: 'En Camino', startPoint: this.startPoint  });
        if (updatedDelivery) {
            await this.populateDelivery(updatedDelivery);
            return this;
        }
        return null;
    }

    public async updateStatus(status: 'Recibido' | 'En Preparación' | 'En Camino' | 'Completado' | 'Listo para Entregar'): Promise<Delivery | null> {
        this.status = status;
        const updatedDelivery = await this.deliveryRepository.update(this.deliveryId, { status });
        if (updatedDelivery) {
            await this.populateDelivery(updatedDelivery);
            return this;
        }
        return null;
    }

    public async complete(): Promise<Delivery | null> {
        this.status = 'Completado';
        const updatedDelivery = await this.deliveryRepository.update(this.deliveryId, { status: 'Completado' });
        if (updatedDelivery) {
            await this.populateDelivery(updatedDelivery);
            return this;
        }
        return null;
    }

    public async inProgress(): Promise<Delivery | null> {
        this.status = 'En Preparación';
        const updatedDelivery = await this.deliveryRepository.update(this.deliveryId, { status: 'En Preparación' });
        if (updatedDelivery) {
            await this.populateDelivery(updatedDelivery);
            return this;
        }
        return null;
    }

    public async pending(): Promise<Delivery | null> {
        this.status = 'Recibido';
        const updatedDelivery = await this.deliveryRepository.update(this.deliveryId, { status: 'Recibido' });
        if (updatedDelivery) {
            await this.populateDelivery(updatedDelivery);
            return this;
        }
        return null;
    }

    public async findById(): Promise<Delivery | null> {
        const deliveryDoc = await this.deliveryRepository.findById(this.deliveryId);
        if (deliveryDoc) {
            await this.populateDelivery(deliveryDoc);
            return this;
        }
        return null;
    }

    private async populateDelivery(deliveryDoc: any): Promise<void> {
        this.deliveryId = deliveryDoc._id.toString();
        this.orders = await Promise.all(deliveryDoc.orders.map(async (orderId: string) => {
            const order = new Order({ orderId });
            return await order.findById();
        }));
        this.customerInformation = deliveryDoc.customerInformation;
        this.status = deliveryDoc.status;
        this.address = deliveryDoc.address;
        this.startPoint = deliveryDoc.startPoint;
        this.user = deliveryDoc.user ? await new User({ userId: deliveryDoc.user.toString() }).findById() : undefined;
        this.deliveryMan = deliveryDoc.deliveryMan ? await new User({ userId: deliveryDoc.deliveryMan.toString() }).findById() : undefined;
        this.createdAt = deliveryDoc.createdAt;
        this.updatedAt = deliveryDoc.updatedAt;
    }
} 
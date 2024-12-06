import { GenericRepository } from './GenericRepository';
import DeliveryModel from '../schemas/DeliverySchema';
import { DeliveryDocument, DeliveryInterface } from '../interfaces/DeliveryInterface';

export class DeliveryRepository extends GenericRepository<DeliveryDocument> {
    private static mongooseModel = DeliveryModel;

    constructor() {
        super(DeliveryRepository.mongooseModel);
    }

    public async save(delivery: Partial<DeliveryInterface>){
        try {
            const deliveryDocument = new this.model(delivery);
            return await deliveryDocument.save();
        } catch (error) {
            console.error(`Error al guardar la entrega: ${error}`);
            throw new Error('Error al guardar la entrega');
        }
    }

    public async update(id: string, data: Partial<DeliveryDocument>): Promise<DeliveryDocument | null> {
        try {
            return await this.model.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error(`Error al actualizar la entrega: ${error}`);
            throw new Error('Error al actualizar la entrega');
        }
    }

    public async findByOrderId(orderId: string): Promise<DeliveryDocument | null> {
        try {
            return await this.model.findOne({ orders: { $in: [orderId] } });
        } catch (error) {
            console.error(`Error al encontrar la entrega por orderId: ${error}`);
            throw new Error('Error al encontrar la entrega por orderId');
        }
    }

    public async findById(id: string): Promise<DeliveryDocument | null> {
        try {
            return await this.model.findById(id);
        } catch (error) {
            console.error(`Error al encontrar la entrega: ${error}`);
            throw new Error('Error al encontrar la entrega');
        }
    }
} 
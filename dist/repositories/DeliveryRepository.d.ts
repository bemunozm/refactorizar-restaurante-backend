import { GenericRepository } from './GenericRepository';
import { DeliveryDocument, DeliveryInterface } from '../interfaces/DeliveryInterface';
export declare class DeliveryRepository extends GenericRepository<DeliveryDocument> {
    private static mongooseModel;
    constructor();
    save(delivery: Partial<DeliveryInterface>): Promise<import("mongoose").Document<unknown, {}, DeliveryDocument> & DeliveryDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(id: string, data: Partial<DeliveryDocument>): Promise<DeliveryDocument | null>;
    findByOrderId(orderId: string): Promise<DeliveryDocument | null>;
    findById(id: string): Promise<DeliveryDocument | null>;
}

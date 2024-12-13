import { GenericRepository } from "./GenericRepository";
import { OrderDocument } from "../interfaces/OrderInterface";
export declare class OrderRepository extends GenericRepository<OrderDocument> {
    private static mongooseModel;
    constructor();
    updateGuestToUserOrders(guestId: string, userId: string): Promise<import("mongoose").UpdateWriteOpResult>;
    save(order: any): Promise<OrderDocument>;
    updateItemStatus(itemId: string, status: string): Promise<import("mongoose").Document<unknown, {}, OrderDocument> & OrderDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findForKitchen(): Promise<(import("mongoose").Document<unknown, {}, OrderDocument> & OrderDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findByUserId(userId: string): Promise<(import("mongoose").Document<unknown, {}, OrderDocument> & OrderDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findBySessionId(sessionId: string): Promise<(import("mongoose").Document<unknown, {}, OrderDocument> & OrderDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getOrdersBetweenDates(startDate: Date, endDate: Date): Promise<(import("mongoose").Document<unknown, {}, OrderDocument> & OrderDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}

import { TransactionDocument } from "../interfaces/TransactionInterface";
import { GenericRepository } from "./GenericRepository";
export declare class TransactionRepository extends GenericRepository<TransactionDocument> {
    private static mongooseModel;
    constructor();
    save(transaction: any): Promise<any>;
    findByToken(token: string): Promise<import("mongoose").Document<unknown, {}, TransactionDocument> & TransactionDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, TransactionDocument> & TransactionDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateToken(transactionId: string, token: string): Promise<import("mongoose").UpdateWriteOpResult>;
    updateStatus(transactionId: string, status: string): Promise<import("mongoose").UpdateWriteOpResult>;
}

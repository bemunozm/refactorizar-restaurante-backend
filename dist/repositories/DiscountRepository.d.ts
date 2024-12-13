import { DiscountDocument, DiscountInterface } from "../interfaces/DiscountInterface";
import { GenericRepository } from "./GenericRepository";
export declare class DiscountRepository extends GenericRepository<DiscountDocument> {
    private static mongooseModel;
    constructor();
    save(data: Partial<DiscountInterface>): Promise<import("mongoose").Document<unknown, {}, DiscountDocument> & DiscountDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findById(id: string): Promise<DiscountDocument | null>;
    update(id: string, data: Partial<DiscountDocument>): Promise<DiscountDocument | null>;
}

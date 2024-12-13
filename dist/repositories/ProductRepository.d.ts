import { ProductDocument } from "../interfaces/ProductInterface";
import { GenericRepository } from "./GenericRepository";
export declare class ProductRepository extends GenericRepository<ProductDocument> {
    private static mongooseModel;
    constructor();
    update(id: string, data: Partial<ProductDocument>): Promise<ProductDocument>;
    save(product: any): Promise<import("mongoose").Document<unknown, {}, ProductDocument> & ProductDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findByCategoryId(categoryId: string): Promise<(import("mongoose").Document<unknown, {}, ProductDocument> & ProductDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getMostSoldProduct(startDate: Date, endDate: Date): Promise<(import("mongoose").Document<unknown, {}, ProductDocument> & ProductDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}

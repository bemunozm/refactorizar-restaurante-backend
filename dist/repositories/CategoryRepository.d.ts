import { CategoryDocument, CategoryInterface } from "../interfaces/CategoryInterface";
import { GenericRepository } from "./GenericRepository";
export declare class CategoryRepository extends GenericRepository<CategoryDocument> {
    private static mongooseModel;
    constructor();
    save(category: CategoryInterface): Promise<import("mongoose").Document<unknown, {}, CategoryDocument> & CategoryDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}

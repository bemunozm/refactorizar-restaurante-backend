import { TableDocument, TableInterface } from "../interfaces/TableInterface";
import { GenericRepository } from "./GenericRepository";
export declare class TableRepository extends GenericRepository<TableDocument> {
    private static mongooseModel;
    constructor();
    save(table: TableInterface): Promise<import("mongoose").Document<unknown, {}, TableDocument> & TableDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}

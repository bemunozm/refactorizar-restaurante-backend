import TableModel from "../schemas/TableSchema";
import { TableDocument, TableInterface } from "../interfaces/TableInterface";
import { GenericRepository } from "./GenericRepository";

export class TableRepository extends GenericRepository<TableDocument> {

    private static mongooseModel = TableModel;

    constructor() {
        super(TableRepository.mongooseModel);
    }

    public async save(table: TableInterface) {
        try {
            const tableDocument = new this.model({
                tableNumber: table.tableNumber,
                status: table.status,
            });
            return await tableDocument.save();
        } catch (error) {
            console.error("Error saving table:", error);
            throw error;
        }
    }


}

import { Table } from "../models/Table";
export declare class TableService {
    createTable(data: any): Promise<Table>;
    updateTable(id: string, updateData: any): Promise<Table>;
    getTables(): Promise<Table[]>;
    getTable(id: string): Promise<Table>;
    deleteTable(id: string): Promise<boolean>;
}

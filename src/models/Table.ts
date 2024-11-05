import mongoose, { Model } from "mongoose";
import { TableDocument, TableInterface } from "../interfaces/TableInterface";
import { TableSchema } from "../schemas/TableSchema";

export class Table implements TableInterface {
    public tableId?: string;  
    public tableNumber: number;
    public status: "Disponible" | "Ocupada" | "Reservada";
    private static mongooseModel: Model<TableDocument>;
  
    public static getModel(): Model<TableDocument> {
      if (!this.mongooseModel) {
        this.mongooseModel = mongoose.model<TableDocument>("Table", TableSchema);
      }
      return this.mongooseModel;
    }
}
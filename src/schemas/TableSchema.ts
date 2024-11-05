import mongoose, { Schema } from "mongoose";
import { TableDocument } from "../interfaces/TableInterface";

export const TableSchema = new Schema<TableDocument>(
    {
      tableNumber: { type: Number, required: true, unique: true },
      status: { type: String, enum: ["Disponible", "Ocupada", "Reservada"], default: "Disponible" },
    },
    { timestamps: true }
);

const TableModel = mongoose.models.Table || mongoose.model<TableDocument>("Table", TableSchema);
export default TableModel;
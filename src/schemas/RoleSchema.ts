import { Schema } from "mongoose";
import { RoleDocument } from "../interfaces/RoleInterface";

export const RoleSchema = new Schema<RoleDocument>({
  name: { type: String, required: true, unique: true },
  permissions: { type: [String], required: true },
}, { timestamps: true });

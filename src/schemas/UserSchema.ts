import { Schema } from "mongoose";
import { UserDocument } from "../interfaces/UserInterface";

export const UserSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  confirmed: { type: Boolean, default: false },
  roles: [{ type: Schema.Types.ObjectId, ref: "Role", required: true }],
}, { timestamps: true });

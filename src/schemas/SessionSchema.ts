import mongoose, { Schema, Types } from "mongoose";
import { GuestSchema } from "./GuestSchema";
import { SessionDocument } from "../interfaces/SessionInterface";

export const SessionSchema = new Schema<SessionDocument>(
  {
    tableId: { type: Schema.Types.ObjectId, ref: "Table", required: true },
    guests: [GuestSchema],
    status: {
      type: String,
      enum: ["Activa", "Pagando", "Finalizada"],
      default: "Activa",
    },
  },
  { timestamps: true }
);

const SessionModel =
  mongoose.models.Session ||
  mongoose.model<SessionDocument>("Session", SessionSchema);
export default SessionModel;

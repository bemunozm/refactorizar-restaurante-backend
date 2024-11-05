import mongoose, { Model } from "mongoose";
import { SessionDocument, SessionInterface } from "../interfaces/SessionInterface";
import { SessionSchema } from "../schemas/SessionSchema";
import { GuestInterface } from "../interfaces/GuestInterface";

export class Session implements SessionInterface {
    public sessionId?: string;
    public tableId: string;
    public guests: GuestInterface[];
    public status: 'Activa' | 'Pagando' | 'Finalizada';
    private static mongooseModel: Model<SessionDocument>;
  
    public static getModel(): Model<SessionDocument> {
      if (!this.mongooseModel) {
        this.mongooseModel = mongoose.model<SessionDocument>("Session", SessionSchema);
      }
      return this.mongooseModel;
    }
}
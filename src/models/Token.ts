import mongoose, { Model } from "mongoose";
import { TokenDocument, TokenInterface } from "../interfaces/TokenInterface";
import { TokenSchema } from "../schemas/TokenSchema";

export class Token implements TokenInterface {
    public token: string;
    public user?: string;
    public session?: string;
  private static mongooseModel: Model<TokenDocument>;

  constructor(data: TokenInterface) {
    this.token = data.token;
    this.user = data.user || undefined;
    this.session = data.session || undefined;
  }

  // Métodos específicos para usuario podrían añadirse aquí
  public static getModel(): Model<TokenDocument> {
    if (!this.mongooseModel) {
      this.mongooseModel = mongoose.model<TokenDocument>("Token", TokenSchema);
    }
    return this.mongooseModel;
  }
}

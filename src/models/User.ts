import mongoose, { Document, Model } from "mongoose";
import { UserDocument, UserInterface } from "../interfaces/UserInterface";
import { UserSchema } from "../schemas/UserSchema";

export class User implements UserInterface {
  public name: string;
  public lastname: string;
  public email: string;
  public password: string;
  public confirmed: boolean;
  public roles: UserInterface["roles"];
  private static mongooseModel: Model<UserDocument>;

  constructor(data: UserInterface) {
    this.name = data.name;
    this.lastname = data.lastname;
    this.email = data.email;
    this.password = data.password;
    this.confirmed = data.confirmed || false;
    this.roles = data.roles || [];
  }

  // Métodos específicos para usuario podrían añadirse aquí
  public static getModel(): Model<UserDocument> {
    if (!this.mongooseModel) {
      this.mongooseModel = mongoose.model<UserDocument>("User", UserSchema);
    }
    return this.mongooseModel;
  }
}

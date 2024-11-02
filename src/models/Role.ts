import mongoose, { Model } from "mongoose";
import { RoleDocument, RoleInterface } from "../interfaces/RoleInterface";
import { RoleSchema } from "../schemas/RoleSchema";

export class Role implements RoleInterface {
  public name: string;
  public permissions: RoleInterface["permissions"];
  private static mongooseModel: Model<RoleDocument>;

  constructor(data: RoleInterface) {
    this.name = data.name;
    this.permissions = data.permissions;
  }

  // Métodos específicos para rol podrían añadirse aquí
  public static getModel(): Model<RoleDocument> {
    if (!this.mongooseModel) {
      this.mongooseModel = mongoose.model<RoleDocument>("Role", RoleSchema);
    }
    return this.mongooseModel;
  }
}

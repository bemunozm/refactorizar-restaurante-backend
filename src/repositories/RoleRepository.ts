import { GenericRepository } from "./GenericRepository";
import { Role } from "../models/Role"; // Importamos la clase User con el modelo encapsulado
import { RoleDocument, RoleInterface } from "../interfaces/RoleInterface";
import mongoose from "mongoose";
import RoleModel, { RoleSchema } from "../schemas/RoleSchema";

export class RoleRepository extends GenericRepository<RoleDocument> {
  private static mongooseModel = RoleModel;

  constructor() {
    super(RoleRepository.mongooseModel);
  }

  // Métodos específicos de UserRepository pueden añadirse aquí
  public async save(role: RoleInterface) {
    const roleDocument = new this.model({
        name: role.name,
        permissions: role.permissions
    });
    return await roleDocument.save();
  }

}

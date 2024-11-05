import { GenericRepository } from "./GenericRepository";
import { Role } from "../models/Role"; // Importamos la clase User con el modelo encapsulado
import { RoleDocument } from "../interfaces/RoleInterface";
import mongoose from "mongoose";
import RoleModel, { RoleSchema } from "../schemas/RoleSchema";

export class RoleRepository extends GenericRepository<RoleDocument> {
  private static mongooseModel = RoleModel;

  constructor() {
    super(RoleRepository.mongooseModel);
  }

  // Métodos específicos de UserRepository pueden añadirse aquí
}

import { GenericRepository } from "./GenericRepository";
import { Role } from "../models/Role"; // Importamos la clase User con el modelo encapsulado
import { RoleDocument } from "../interfaces/RoleInterface";

export class RoleRepository extends GenericRepository<RoleDocument> {
  constructor() {
    super(Role.getModel()); // Usamos el modelo encapsulado dentro de User
  }

  // Métodos específicos de UserRepository pueden añadirse aquí
}

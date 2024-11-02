import { UserDocument } from "../interfaces/UserInterface";
import { GenericRepository } from "./GenericRepository";
import { User } from "../models/User"; // Importamos la clase User con el modelo encapsulado

export class UserRepository extends GenericRepository<UserDocument> {
  constructor() {
    super(User.getModel()); // Usamos el modelo encapsulado dentro de User
  }

  // Métodos específicos de UserRepository pueden añadirse aquí
}

import { TokenDocument } from "../interfaces/TokenInterface";
import { GenericRepository } from "./GenericRepository";
import { Token } from "../models/Token"; // Importamos la clase User con el modelo encapsulado

export class TokenRepository extends GenericRepository<TokenDocument> {
  constructor() {
    super(Token.getModel()); // Usamos el modelo encapsulado dentro de User
  }

  // Métodos específicos de UserRepository pueden añadirse aquí
}

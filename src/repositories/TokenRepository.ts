import { TokenDocument } from "../interfaces/TokenInterface";
import { GenericRepository } from "./GenericRepository";
import { Token } from "../models/Token"; // Importamos la clase User con el modelo encapsulado
import TokenModel, { TokenSchema } from "../schemas/TokenSchema";

export class TokenRepository extends GenericRepository<TokenDocument> {
  private static mongooseModel = TokenModel;

  constructor() {
    super(TokenRepository.mongooseModel);
  }

  // Métodos específicos de UserRepository pueden añadirse aquí
  public async findByUserId(userId: string): Promise<TokenDocument | null> {
    try {
      return await this.model.findOne({ user: userId }).exec();
    } catch (error) {
        console.error(`Error al buscar por userId: ${error}`);
        throw new Error("Error al buscar el documento por userId");
    }
  }

  // Método para guardar una instancia de Token en la base de datos
  public async save(token: Token): Promise<TokenDocument> {
    try {
      const tokenDocument = new this.model({
        token: token.token,
        user: token.user,
        session: token.session,
      });
      return await tokenDocument.save();
    } catch (error) {
      console.error(`Error al guardar el token: ${error}`);
      throw new Error("Error al guardar el documento del token");
    }
  }

}

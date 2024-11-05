import mongoose, { Model } from "mongoose";
import { TokenDocument, TokenInterface } from "../interfaces/TokenInterface";
import { TokenSchema } from "../schemas/TokenSchema";
import { TokenRepository } from "../repositories/TokenRepository";
import { generateToken } from "../utils/token";

export class Token implements TokenInterface {
    public tokenId?: string;
    public token: string;
    public user?: string;
    public session?: string;
    private tokenRepository: TokenRepository;

  constructor(data: TokenInterface) {
    this.token = data.token;
    this.user = data.user || undefined;
    this.session = data.session || undefined;
    this.tokenRepository = new TokenRepository();
  }

  // Métodos específicos para usuario podrían añadirse aquí
  public async save(): Promise<void> {
    const savedToken = await this.tokenRepository.save(this);
    this.tokenId = savedToken.id; // Actualiza el userId con el ID generado por Mongoose
  }
}

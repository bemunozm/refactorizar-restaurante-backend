
import { TokenInterface } from "../interfaces/TokenInterface";
import { TokenRepository } from "../repositories/TokenRepository";

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
  public async findByToken() {
    const tokenData = await this.tokenRepository.findOne({token: this.token});
    
    if (tokenData) {
      // Cargar los datos directamente en la instancia actual usando el objeto plano
      this.tokenId = tokenData.id;
      this.user = tokenData.user;
      this.session = tokenData.session;
      return this;
    }

    return false;
  }

  public async findByUserId() {
    const tokenData = await this.tokenRepository.findByUserId(this.user);
    
    if (tokenData) {
      // Cargar los datos directamente en la instancia actual usando el objeto plano
      this.tokenId = tokenData.id;
      this.token = tokenData.token;
      this.session = tokenData.session;
      return this;
    }

    return false;
  }

  public async findBySessionId() {
    const tokenData = await this.tokenRepository.findOne({session: this.session});
    
    if (tokenData) {
      // Cargar los datos directamente en la instancia actual usando el objeto plano
      this.tokenId = tokenData.id;
      this.token = tokenData.token;
      this.user = tokenData.user;
      return this;
    }

    return false;
  }

  public async deleteToken() {
    await this.tokenRepository.delete(this.tokenId);
  }

  public async save() {
    const savedToken = await this.tokenRepository.save(this);
    this.tokenId = savedToken.id; // Actualiza el userId con el ID generado por Mongoose
    return this;
  }
}

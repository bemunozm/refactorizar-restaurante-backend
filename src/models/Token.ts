import { TokenInterface } from "../interfaces/TokenInterface";
import { TokenRepository } from "../repositories/TokenRepository";
import { Session } from "./Session";
import { User } from "./User";

export class Token implements TokenInterface {
    public tokenId?: string;
    public token: string;
    public user?: User;
    public session?: Session;
    private tokenRepository: TokenRepository;

    constructor(data: Partial<TokenInterface>) {
        this.tokenId = data.tokenId;
        this.token = data.token || '';
        this.user = data.user instanceof User ? data.user : data.user ? new User({ userId: data.user }) : undefined;
        this.session = data.session instanceof Session ? data.session : data.session ? new Session({ sessionId: data.session }) : undefined;
        this.tokenRepository = new TokenRepository();
    }

    // Cargar una instancia de User si es necesario
    private async populateUser(userId: string): Promise<User | undefined> {
        if (this.user && this.user.userId === userId) return this.user;
        const userInstance = new User({ userId });
        return await userInstance.findById();
    }

    // Cargar una instancia de Session si es necesario
    private async populateSession(sessionId: string): Promise<Session | undefined> {
        if (this.session && this.session.sessionId === sessionId) return this.session;
        const sessionInstance = new Session({ sessionId });
        return await sessionInstance.findById();
    }

    public async findByToken(): Promise<Token | false> {
        const tokenData = await this.tokenRepository.findOne({ token: this.token });
        if (tokenData) {
            this.tokenId = tokenData.id;
            this.token = tokenData.token;
            this.user = tokenData.user ? await this.populateUser(tokenData.user.toString()) : undefined;
            this.session = tokenData.session ? await this.populateSession(tokenData.session.toString()) : undefined;
            return this;
        }
        return false;
    }

    public async findByUserId(): Promise<Token | false> {
        if (!this.user || !this.user.userId) return false;
        const tokenData = await this.tokenRepository.findByUserId(this.user.userId);
        if (tokenData) {
            this.tokenId = tokenData.id;
            this.token = tokenData.token;
            this.user = tokenData.user ? await this.populateUser(tokenData.user.toString()) : undefined;
            this.session = tokenData.session ? await this.populateSession(tokenData.session.toString()) : undefined;
            return this;
        }
        return false;
    }

    public async findBySessionId(): Promise<Token | false> {
        if (!this.session || !this.session.sessionId) return false;
        const tokenData = await this.tokenRepository.findOne({ session: this.session.sessionId });
        if (tokenData) {
            this.tokenId = tokenData.id;
            this.token = tokenData.token;
            this.user = tokenData.user ? await this.populateUser(tokenData.user.toString()) : undefined;
            this.session = tokenData.session ? await this.populateSession(tokenData.session.toString()) : undefined;
            return this;
        }
        return false;
    }

    public async deleteToken(): Promise<void> {
        await this.tokenRepository.delete(this.tokenId);
    }

    public async save(): Promise<Token> {
        const savedToken = await this.tokenRepository.save(this);
        this.tokenId = savedToken.id;
        return this;
    }
}

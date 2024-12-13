import { TokenInterface } from "../interfaces/TokenInterface";
import { Session } from "./Session";
import { User } from "./User";
export declare class Token implements TokenInterface {
    tokenId?: string;
    token: string;
    user?: User;
    session?: Session;
    private tokenRepository;
    constructor(data: Partial<TokenInterface>);
    /**
     * Método para sanear y crear instancias mínimas de los datos relacionados.
     */
    private sanitizeData;
    /**
     * Cargar una instancia de `User` completa si es necesario.
     */
    private populateUser;
    /**
     * Cargar una instancia de `Session` completa si es necesario.
     */
    private populateSession;
    findByToken(): Promise<Token | false>;
    findByUserId(): Promise<Token | false>;
    findBySessionId(): Promise<Token | false>;
    deleteToken(): Promise<void>;
    save(): Promise<Token>;
}

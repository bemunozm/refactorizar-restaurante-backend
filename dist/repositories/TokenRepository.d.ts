import { TokenDocument } from "../interfaces/TokenInterface";
import { GenericRepository } from "./GenericRepository";
import { Token } from "../models/Token";
export declare class TokenRepository extends GenericRepository<TokenDocument> {
    private static mongooseModel;
    constructor();
    findByUserId(userId: string): Promise<TokenDocument | null>;
    save(token: Token): Promise<TokenDocument>;
}

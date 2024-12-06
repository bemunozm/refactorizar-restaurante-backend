"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenRepository = void 0;
const GenericRepository_1 = require("./GenericRepository");
const TokenSchema_1 = __importDefault(require("../schemas/TokenSchema"));
class TokenRepository extends GenericRepository_1.GenericRepository {
    static mongooseModel = TokenSchema_1.default;
    constructor() {
        super(TokenRepository.mongooseModel);
    }
    // Métodos específicos de UserRepository pueden añadirse aquí
    async findByUserId(userId) {
        try {
            return await this.model.findOne({ user: userId }).exec();
        }
        catch (error) {
            console.error(`Error al buscar por userId: ${error}`);
            throw new Error("Error al buscar el documento por userId");
        }
    }
    // Método para guardar una instancia de Token en la base de datos
    async save(token) {
        try {
            const tokenDocument = new this.model({
                token: token.token,
                user: token.user ? token.user.userId : undefined,
                session: token.session ? token.session.sessionId : undefined,
            });
            return await tokenDocument.save();
        }
        catch (error) {
            console.error(`Error al guardar el token: ${error}`);
            throw new Error("Error al guardar el documento del token");
        }
    }
}
exports.TokenRepository = TokenRepository;
//# sourceMappingURL=TokenRepository.js.map
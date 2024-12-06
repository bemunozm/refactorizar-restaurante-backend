"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const TokenRepository_1 = require("../repositories/TokenRepository");
const Session_1 = require("./Session");
const User_1 = require("./User");
class Token {
    tokenId;
    token;
    user;
    session;
    tokenRepository;
    constructor(data) {
        this.tokenId = data.tokenId;
        this.token = data.token || '';
        // Sanitiza los datos iniciales para asegurar instancias mínimas de User y Session
        this.sanitizeData(data);
        this.tokenRepository = new TokenRepository_1.TokenRepository();
    }
    /**
     * Método para sanear y crear instancias mínimas de los datos relacionados.
     */
    sanitizeData(data) {
        // Crear una instancia mínima de `User` si `user` es un string
        this.user = data.user instanceof User_1.User
            ? data.user
            : data.user
                ? new User_1.User({ userId: data.user.toString() })
                : undefined;
        // Crear una instancia mínima de `Session` si `session` es un string
        this.session = data.session instanceof Session_1.Session
            ? data.session
            : data.session
                ? new Session_1.Session({ sessionId: data.session.toString() })
                : undefined;
    }
    /**
     * Cargar una instancia de `User` completa si es necesario.
     */
    async populateUser(userId) {
        if (this.user && this.user.userId === userId)
            return this.user;
        const userInstance = new User_1.User({ userId });
        return await userInstance.findById();
    }
    /**
     * Cargar una instancia de `Session` completa si es necesario.
     */
    async populateSession(sessionId) {
        if (this.session && this.session.sessionId === sessionId)
            return this.session;
        const sessionInstance = new Session_1.Session({ sessionId });
        return await sessionInstance.findById();
    }
    async findByToken() {
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
    async findByUserId() {
        if (!this.user || !this.user.userId)
            return false;
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
    async findBySessionId() {
        if (!this.session || !this.session.sessionId)
            return false;
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
    async deleteToken() {
        await this.tokenRepository.delete(this.tokenId);
    }
    async save() {
        const savedToken = await this.tokenRepository.save(this);
        this.tokenId = savedToken.id;
        return this;
    }
}
exports.Token = Token;
//# sourceMappingURL=Token.js.map
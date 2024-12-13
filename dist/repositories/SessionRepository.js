"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionRepository = void 0;
const GenericRepository_1 = require("./GenericRepository");
const SessionSchema_1 = __importDefault(require("../schemas/SessionSchema"));
class SessionRepository extends GenericRepository_1.GenericRepository {
    static mongooseModel = SessionSchema_1.default;
    constructor() {
        super(SessionRepository.mongooseModel);
    }
    async findActiveSessionByTableId(tableId) {
        return await this.model.findOne({ table: tableId, status: { $ne: 'Finalizada' } }).exec();
    }
    async findBySessionId(sessionId) {
        return await this.model.findById(sessionId).exec();
    }
    async updateGuestToLogged(sessionId, userId, guestId) {
        return await this.model.findOneAndUpdate({ _id: sessionId, "guests._id": guestId }, { $set: { "guests.$.user": userId } }, // Solo actualizar el campo `user` del invitado
        { new: true }).exec();
    }
    async save(session) {
        const sessionDocument = new this.model({
            table: session.table.tableId,
            guests: session.guests.map(guest => ({
                id: guest.guestId,
                name: guest.name,
                user: guest.user instanceof Object ? guest.user.userId : guest.user,
                orders: guest.orders.map(order => order.orderId),
            })),
            status: session.status,
        });
        return await sessionDocument.save();
    }
    async findSessionsBetweenDates(startDate, endDate) {
        return await this.model.find({ createdAt: { $gte: startDate, $lte: endDate } }).exec();
    }
    async pushGuest(sessionId, guestData) {
        return await this.model.findByIdAndUpdate(sessionId, { $push: { guests: guestData } }, // Solo agregar el nuevo invitado
        { new: true } // Retornar el documento actualizado
        ).exec();
    }
}
exports.SessionRepository = SessionRepository;
//# sourceMappingURL=SessionRepository.js.map
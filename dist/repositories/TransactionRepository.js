"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepository = void 0;
const TransactionSchema_1 = __importDefault(require("../schemas/TransactionSchema"));
const GenericRepository_1 = require("./GenericRepository");
class TransactionRepository extends GenericRepository_1.GenericRepository {
    static mongooseModel = TransactionSchema_1.default;
    constructor() {
        super(TransactionRepository.mongooseModel);
    }
    async save(transaction) {
        const transactionDocument = new TransactionSchema_1.default({
            token: transaction.token,
            orders: transaction.orders ? transaction.orders : undefined,
            session: transaction.session,
            onlineOrderId: transaction.onlineOrderId,
            amount: transaction.amount,
            status: transaction.status,
        });
        return await transactionDocument.save();
    }
    async findByToken(token) {
        return await this.model.findOne({ token });
    }
    async findById(id) {
        return await this.model.findById(id);
    }
    async updateToken(transactionId, token) {
        return await TransactionSchema_1.default.updateOne({ _id: transactionId }, { $set: { token } });
    }
    async updateStatus(transactionId, status) {
        return await TransactionSchema_1.default.updateOne({ _id: transactionId }, { $set: { status } });
    }
    async getTransactionsBetweenDates(startDate, endDate) {
        return await this.model.find({ createdAt: { $gte: startDate, $lte: endDate } });
    }
}
exports.TransactionRepository = TransactionRepository;
//# sourceMappingURL=TransactionRepository.js.map
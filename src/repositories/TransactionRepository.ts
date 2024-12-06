import TransactionModel from "../schemas/TransactionSchema";
import {  TransactionDocument, TransactionInterface } from "../interfaces/TransactionInterface";
import { GenericRepository } from "./GenericRepository";

export class TransactionRepository extends GenericRepository<TransactionDocument> {

    private static mongooseModel = TransactionModel;

    constructor() {
        super(TransactionRepository.mongooseModel);
    }

    public async save(transaction) {
        const transactionDocument = new TransactionModel({
            token: transaction.token,
            orders: transaction.orders ? transaction.orders : undefined,
            session: transaction.session,
            onlineOrderId: transaction.onlineOrderId,
            amount: transaction.amount,
            status: transaction.status,
        });
        return await transactionDocument.save();
    }

    public async findByToken(token: string) {
        return await this.model.findOne({ token });
    }

    public async findById(id: string) {
        return await this.model.findById(id);
    }

    public async updateToken(transactionId: string, token: string) {
        return await TransactionModel.updateOne({ _id: transactionId }, { $set: { token } });
    }

    public async updateStatus(transactionId: string, status: string) {
        return await TransactionModel.updateOne({ _id: transactionId }, { $set: { status } });
    }
}

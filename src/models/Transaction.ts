import { TransactionRepository } from "../repositories/TransactionRepository";
import { TransactionInterface } from "../interfaces/TransactionInterface";
import { OrderInterface } from "../interfaces/OrderInterface";

export class Transaction implements TransactionInterface {
    public transactionId?: string;
    public token: string;
    public orders: OrderInterface[];
    public sessionId: string;
    public amount: number;
    public status: 'CREADA' | 'CONFIRMADA' | 'ANULADA';
    private transactionRepository: TransactionRepository;

    constructor(data: Partial<TransactionInterface>) {
        this.transactionId = data.transactionId;
        this.token = data.token || '';
        this.orders = data.orders || [];
        this.sessionId = data.sessionId.toString() || '';
        this.amount = data.amount || 0;
        this.status = data.status || 'CREADA';
        this.transactionRepository = new TransactionRepository();
    }

    private populateOrders(orders: any[]): OrderInterface[] {
        return orders.map((order) => ({
            orderId: order._id.toString(),
            sessionId: order.sessionId.toString(),
            tableId: order.tableId.toString(),
            guestId: order.guestId ? order.guestId.toString() : null,
            userId: order.userId ? order.userId.toString() : null,
            items: order.items.map((item: any) => ({
                productId: item.productId.toString(),
                quantity: item.quantity,
                status: item.status,
                comment: item.comment || ''
            })),
            status: order.status
        }));
    }

    public async save() {
        const savedTransaction = await this.transactionRepository.save(this);
        this.transactionId = savedTransaction.transactionId;
        this.status = savedTransaction.status;
        return this;
    }

    public async findByToken() {
        const transaction = await this.transactionRepository.findByToken(this.token);
        if (transaction) {
            this.transactionId = transaction.transactionId;
            this.sessionId = transaction.sessionId.toString();
            this.orders = this.populateOrders(transaction.orders);
            this.amount = transaction.amount;
            this.status = transaction.status;
            return this;
        }
        return null;
    }

    public async findById() {
        const transaction = await this.transactionRepository.findById(this.transactionId);
        if (transaction) {
            this.token = transaction.token;
            this.orders = this.populateOrders(transaction.orders);
            this.sessionId = transaction.sessionId.toString();
            this.amount = transaction.amount;
            this.status = transaction.status;
            return this;
        }
        return null;
    }

    public async updateToken(token: string) {
        await this.transactionRepository.updateToken(this.transactionId, token);
        this.token = token;
    }

    public async updateStatus(status: 'CREADA' | 'CONFIRMADA' | 'ANULADA') {
        await this.transactionRepository.updateStatus(this.transactionId, status);
        this.status = status;
    }
}

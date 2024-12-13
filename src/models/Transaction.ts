import { TransactionRepository } from "../repositories/TransactionRepository";
import { TransactionInterface } from "../interfaces/TransactionInterface";
import { OrderInterface } from "../interfaces/OrderInterface";
import { Session } from "./Session";
import { Order } from "./Order";

export class Transaction implements TransactionInterface {
    public transactionId?: string;
    public token: string;
    public orders?: Order[];
    public session?: Session;
    public onlineOrderId?: string;
    public amount: number;
    public status: 'CREADA' | 'CONFIRMADA' | 'ANULADA';
    private transactionRepository: TransactionRepository;

    constructor(data: Partial<TransactionInterface>) {
        this.transactionId = data.transactionId;
        this.token = data.token || '';
        this.amount = data.amount || 0;
        this.status = data.status || 'CREADA';
        this.onlineOrderId = data.onlineOrderId;

        // Sanitizar datos para asegurar que `session` y `orders` sean instancias de sus modelos
        this.sanitizeData(data);

        this.transactionRepository = new TransactionRepository();
    }

    /**
     * Método para sanear y crear instancias mínimas de los datos relacionados.
     */
    private sanitizeData(data: Partial<TransactionInterface>) {
        // Asegurar que `session` sea una instancia de `Session`
        this.session = data.session ? (data.session instanceof Session 
            ? data.session 
            : new Session({ sessionId: data.session || '' }))
            : undefined;

        // Asegurar que cada elemento en `orders` sea una instancia de `Order`, si `orders` está presente
        this.orders = data.orders ? data.orders.map(order =>
            order instanceof Order
                ? order
                : new Order({ orderId: order || '' })
        ) : undefined;
    }

    /**
     * Método para cargar completamente `session` y `orders`.
     */
    public async populate(): Promise<void> {
        // Poblar `session` si solo tiene el ID

        if (this.session && !this.session.table.tableId) {
            this.session = await this.session.findById();
        }

        // Poblar cada orden en `orders`
        this.orders = await Promise.all(
            this.orders.map(async (order) => {
                if (!order.status) {  // Si solo tiene el ID
                    return await order.findById();
                }
                return order;
            })
        );
    }

    /**
     * Guarda la transacción en la base de datos.
     */
    public async save(): Promise<Transaction> {
        const orders = this.orders ? this.orders.map(order => order.orderId) : [];

        const DataToSave = {
            token: this.token,
            amount: this.amount,
            status: this.status,
            session: this.session?.sessionId,
            onlineOrderId: this.onlineOrderId,
            orders: orders,
        }

        const savedTransaction = await this.transactionRepository.save(DataToSave);
        this.transactionId = savedTransaction.id;
        this.status = savedTransaction.status;
        return this;
    }

    /**
     * Encuentra la transacción por token y carga sus datos completos.
     */
    public async findByToken(): Promise<Transaction | null> {
        const transaction = await this.transactionRepository.findByToken(this.token);
        if (transaction) {
            this.transactionId = transaction.id;
            this.token = transaction.token;
            this.amount = transaction.amount;
            this.status = transaction.status;
            this.onlineOrderId = transaction.onlineOrderId;

            // Sanitizar y poblar `session` y `orders`
            this.sanitizeData(transaction);
            await this.populate();

            return this;
        }
        return null;
    }

    /**
     * Encuentra la transacción por ID y carga sus datos completos.
     */
    public async findById(): Promise<Transaction | null> {
        const transaction = await this.transactionRepository.findById(this.transactionId);
        if (transaction) {
            this.transactionId = transaction.id;
            this.token = transaction.token;
            this.amount = transaction.amount;
            this.status = transaction.status;
            this.onlineOrderId = transaction.onlineOrderId;

            // Sanitizar y poblar `session` y `orders`
            this.sanitizeData(transaction);
            await this.populate();

            return this;
        }
        return null;
    }

    /**
     * Actualiza el token de la transacción.
     */
    public async updateToken(token: string): Promise<void> {
        await this.transactionRepository.updateToken(this.transactionId, token);
        this.token = token;
    }

    /**
     * Actualiza el estado de la transacción.
     */
    public async updateStatus(status: 'CREADA' | 'CONFIRMADA' | 'ANULADA'): Promise<void> {
        await this.transactionRepository.updateStatus(this.transactionId, status);
        this.status = status;
    }

    static async findByOnlineOrderId(onlineOrderId: string): Promise<Transaction | null> {
        const transactionRepository = new TransactionRepository();
        const transaction = await transactionRepository.findOne({ onlineOrderId: onlineOrderId });
        console.log(transaction);
        if (transaction) {
            const transactionInstance = new Transaction(transaction);
            await transactionInstance.populate();
            return transactionInstance;
        } else {
            return null;
        }
    }

    static async getTransactionsBetweenDates(startDate: Date, endDate: Date): Promise<Transaction[]> {
        const transactionRepository = new TransactionRepository();
        const transactions = await transactionRepository.getTransactionsBetweenDates(startDate, endDate);
        if (transactions) {
            return Promise.all(transactions.map(async (transaction) => {
                const transactionInstance = new Transaction(transaction);
                transactionInstance.transactionId = transaction.id;
                await transactionInstance.populate();
                return transactionInstance;
            }));
        }
        return [];
    }
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryRepository = void 0;
const GenericRepository_1 = require("./GenericRepository");
const DeliverySchema_1 = __importDefault(require("../schemas/DeliverySchema"));
class DeliveryRepository extends GenericRepository_1.GenericRepository {
    static mongooseModel = DeliverySchema_1.default;
    constructor() {
        super(DeliveryRepository.mongooseModel);
    }
    async save(delivery) {
        try {
            const deliveryDocument = new this.model(delivery);
            return await deliveryDocument.save();
        }
        catch (error) {
            console.error(`Error al guardar la entrega: ${error}`);
            throw new Error('Error al guardar la entrega');
        }
    }
    async update(id, data) {
        try {
            return await this.model.findByIdAndUpdate(id, data, { new: true });
        }
        catch (error) {
            console.error(`Error al actualizar la entrega: ${error}`);
            throw new Error('Error al actualizar la entrega');
        }
    }
    async findByOrderId(orderId) {
        try {
            return await this.model.findOne({ orders: { $in: [orderId] } });
        }
        catch (error) {
            console.error(`Error al encontrar la entrega por orderId: ${error}`);
            throw new Error('Error al encontrar la entrega por orderId');
        }
    }
    async findById(id) {
        try {
            return await this.model.findById(id);
        }
        catch (error) {
            console.error(`Error al encontrar la entrega: ${error}`);
            throw new Error('Error al encontrar la entrega');
        }
    }
}
exports.DeliveryRepository = DeliveryRepository;
//# sourceMappingURL=DeliveryRepository.js.map
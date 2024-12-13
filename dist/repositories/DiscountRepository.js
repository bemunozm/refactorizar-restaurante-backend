"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountRepository = void 0;
const DiscountSchema_1 = __importDefault(require("../schemas/DiscountSchema"));
const GenericRepository_1 = require("./GenericRepository");
class DiscountRepository extends GenericRepository_1.GenericRepository {
    static mongooseModel = DiscountSchema_1.default;
    constructor() {
        super(DiscountRepository.mongooseModel);
    }
    async save(data) {
        //extraer la id de los objetos de las condiciones
        const conditions = {
            minOrder: data.conditions?.minOrder,
            maxOrder: data.conditions?.maxOrder,
            category: data.conditions?.category ? data.conditions?.category?.categoryId : null,
            product: data.conditions?.product ? data.conditions?.product?.productId : null,
            excludeProduct: data.conditions?.excludeProduct ? data.conditions?.excludeProduct?.productId : null,
            minQuantity: data.conditions?.minQuantity,
            maxQuantity: data.conditions?.maxQuantity,
            user: data.conditions?.user ? data.conditions?.user?.userId : null,
            excludeUser: data.conditions?.excludeUser ? data.conditions?.excludeUser?.userId : null,
            validOn: data.conditions?.validOn,
            validBetween: data.conditions?.validBetween,
            validHours: data.conditions?.validHours,
            maxDiscount: data.conditions?.maxDiscount,
            orderType: data.conditions?.orderType,
            promoCode: data.conditions?.promoCode
        };
        console.log('Descuento desde el repositorio', data, conditions);
        const discountDocument = new this.model({
            name: data.name,
            type: data.type,
            description: data.description,
            value: data.value,
            conditions: conditions,
            maxUses: data.maxUses,
            usedCount: data.usedCount,
            startDate: data.startDate,
            endDate: data.endDate,
            isActive: data.isActive,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        });
        return await discountDocument.save();
    }
    async findById(id) {
        return await this.model.findById(id);
    }
    async update(id, data) {
        const conditions = {
            minOrder: data.conditions?.minOrder,
            maxOrder: data.conditions?.maxOrder,
            category: data.conditions?.category ? data.conditions?.category?.categoryId : null,
            product: data.conditions?.product ? data.conditions?.product?.productId : null,
            excludeProduct: data.conditions?.excludeProduct ? data.conditions?.excludeProduct?.productId : null,
            minQuantity: data.conditions?.minQuantity,
            maxQuantity: data.conditions?.maxQuantity,
            user: data.conditions?.user ? data.conditions?.user?.userId : null,
            excludeUser: data.conditions?.excludeUser ? data.conditions?.excludeUser?.userId : null,
            validOn: data.conditions?.validOn,
            validBetween: data.conditions?.validBetween,
            validHours: data.conditions?.validHours,
            maxDiscount: data.conditions?.maxDiscount,
            orderType: data.conditions?.orderType,
            promoCode: data.conditions?.promoCode
        };
        const discountData = {
            name: data.name,
            type: data.type,
            description: data.description,
            value: data.value,
            conditions: conditions,
            maxUses: data.maxUses,
            usedCount: data.usedCount,
            startDate: data.startDate,
            endDate: data.endDate,
            isActive: data.isActive,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        };
        return await this.model.findByIdAndUpdate(id, discountData, { new: true });
    }
}
exports.DiscountRepository = DiscountRepository;
//# sourceMappingURL=DiscountRepository.js.map
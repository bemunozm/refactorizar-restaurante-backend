import DiscountModel from "../schemas/DiscountSchema";
import { DiscountDocument, DiscountInterface } from "../interfaces/DiscountInterface";
import { GenericRepository } from "./GenericRepository";

export class DiscountRepository extends GenericRepository<DiscountDocument> {
    private static mongooseModel = DiscountModel;

    constructor() {
        super(DiscountRepository.mongooseModel);
    }

    public async save(data: Partial<DiscountInterface>) {
        
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
        }

        
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

    public async findById(id: string): Promise<DiscountDocument | null> {
        return await this.model.findById(id);
    }

    public async update(id: string, data: Partial<DiscountDocument>): Promise<DiscountDocument | null> {
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
        }

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
        }
        
        return await this.model.findByIdAndUpdate(id, discountData, { new: true });
    }
} 
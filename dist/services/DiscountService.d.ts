import { DiscountInterface } from "../interfaces/DiscountInterface";
import { OrderItemInterface } from "../interfaces/OrderInterface";
import { Discount } from "../models/Discount";
import { Product } from "../models/Product";
export declare class DiscountService {
    createDiscount(discountData: Partial<DiscountInterface>): Promise<Discount>;
    getDiscountById(discountId: string): Promise<Discount | null>;
    updateDiscount(discountId: string, updateData: Partial<DiscountInterface>): Promise<Discount | null>;
    deleteDiscount(discountId: string): Promise<void>;
    getDiscounts(): Promise<Discount[]>;
    activateDiscount(discountId: string): Promise<void>;
    deactivateDiscount(discountId: string): Promise<void>;
    validateDiscountByPromotionCode(promotionCode: string, orders?: string[]): Promise<{
        discount: Discount;
        validItems: {
            product: Product;
            quantity: number;
        }[];
    }>;
    validateDiscountByPromotionCodeOnline(items: OrderItemInterface[], promotionCode: string, type: 'Retiro en Tienda' | 'Delivery', userId?: string): Promise<{
        discount: Discount;
        validItems: {
            product: Product;
            quantity: number;
        }[];
    }>;
}

import { Document } from "mongoose";
import { Category } from "../models/Category";
import { Product } from "../models/Product";
import { User } from "../models/User";
export interface DiscountConditions {
    minOrder?: number;
    maxOrder?: number;
    category?: Category;
    product?: Product;
    excludeProduct?: Product;
    minQuantity?: number;
    maxQuantity?: number;
    user?: User;
    excludeUser?: User;
    validOn?: string;
    validBetween?: [string, string];
    validHours?: [string, string];
    maxDiscount?: number;
    orderType?: "Retiro en Tienda" | "Delivery" | "Presencial";
    promoCode?: string;
}
export interface DiscountInterface {
    discountId: string;
    name: string;
    description?: string;
    type: "percentage" | "fixed" | "conditional";
    value: number;
    conditions?: DiscountConditions;
    maxUses?: number;
    usedCount?: number;
    startDate?: string;
    endDate?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface DiscountDocument extends DiscountInterface, Document {
}

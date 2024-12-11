import mongoose, { Schema, Document, Types } from "mongoose";
import { DiscountDocument, DiscountInterface } from "../interfaces/DiscountInterface";



const DiscountConditionsSchema: Schema = new Schema({
  minOrder: { type: Number },
  maxOrder: { type: Number },
  category: { type: Types.ObjectId, ref: "Category" },
  product: { type: Types.ObjectId, ref: "Product" },
  excludeProduct: { type: Types.ObjectId, ref: "Product" },
  minQuantity: { type: Number },
  maxQuantity: { type: Number },
  user: { type: Types.ObjectId, ref: "User" },
  excludeUser: { type: Types.ObjectId, ref: "User" },
  paymentMethod: { type: String, enum: ["Pago con Efectivo", "Pago con Tarjeta", "Transferencia"] },
  validOn: { type: String },
  validBetween: { type: [String] },
  validHours: { type: [String] },
  firstPurchase: { type: Boolean },
  orderType: { type: String, enum: ["Retiro en Tienda", "Delivery", "Presencial"] },
  promoCode: { type: String },
});

const DiscountSchema: Schema<DiscountDocument> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: null },
    type: { type: String, enum: ["percentage", "fixed", "conditional"], required: true },
    value: { type: Number, required: true },
    conditions: { type: DiscountConditionsSchema, default: {} },
    maxUses: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    startDate: { type: String },
    endDate: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const DiscountModel = mongoose.models.Discount || mongoose.model<DiscountDocument>("Discount", DiscountSchema);
export default DiscountModel;

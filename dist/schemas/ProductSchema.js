"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.ProductSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, trim: true },
    image: { type: String, required: false, trim: true },
    about: { type: String, required: true, trim: true },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    ingredients: [
        {
            ingredient: { type: mongoose_1.Types.ObjectId, ref: "Ingredient", required: true },
            quantityRequired: { type: Number, required: true, min: 0 },
        }
    ],
}, { timestamps: true });
const ProductModel = mongoose_1.default.models.Product || mongoose_1.default.model("Product", exports.ProductSchema);
exports.default = ProductModel;
//# sourceMappingURL=ProductSchema.js.map
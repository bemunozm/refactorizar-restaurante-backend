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
const mongoose_1 = __importStar(require("mongoose"));
const DeliverySchema = new mongoose_1.Schema({
    orders: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Order', required: true }],
    status: { type: String, enum: ['Recibido', 'En Preparación', 'En Camino', 'Completado'], default: 'Recibido' },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', default: null },
    customerInformation: {
        name: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String },
        instructions: { type: String, default: null }
    },
    address: {
        lat: { type: Number },
        lng: { type: Number }
    },
    startPoint: {
        lat: { type: Number },
        lng: { type: Number }
    },
    deliveryMan: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });
const DeliveryModel = mongoose_1.default.models.Delivery || mongoose_1.default.model('Delivery', DeliverySchema);
exports.default = DeliveryModel;
//# sourceMappingURL=DeliverySchema.js.map
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssistanceSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.AssistanceSchema = new mongoose_1.Schema({
    session: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Session', required: true },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', default: null },
    type: { type: String, enum: ['Pago con Tarjeta', 'Pago con Efectivo', 'Solicita Asistencia', 'Pedido Listo'], required: true },
    status: { type: String, enum: ['Pendiente', 'En Progreso', 'Completado'], default: 'Pendiente' },
    transactionToken: { type: String }, // Nuevo campo para almacenar el token.
    itemId: { type: String },
    itemDetails: {
        product: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number },
        comment: { type: String }
    }
}, { timestamps: true });
const AssistanceModel = mongoose_1.default.models.Assistance || mongoose_1.default.model('Assistance', exports.AssistanceSchema);
exports.default = AssistanceModel;
//# sourceMappingURL=AssistanceSchema.js.map
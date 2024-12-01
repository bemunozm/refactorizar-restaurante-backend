import mongoose, { Schema } from 'mongoose';
import { AssistanceDocument } from '../interfaces/AssistanceInterface';


export const AssistanceSchema = new Schema<AssistanceDocument>({
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    type: { type: String, enum: ['Pago con Tarjeta', 'Pago con Efectivo', 'Solicita Asistencia', 'Pedido Listo'], required: true },
    status: { type: String, enum: ['Pendiente', 'En Progreso', 'Completado'], default: 'Pendiente' },
    transactionToken: { type: String }, // Nuevo campo para almacenar el token.
    itemId: { type: String },
    itemDetails: {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number },
        comment: { type: String }
    }
}, { timestamps: true });

const AssistanceModel = mongoose.models.Assistance || mongoose.model<AssistanceDocument>('Assistance', AssistanceSchema);
export default AssistanceModel;
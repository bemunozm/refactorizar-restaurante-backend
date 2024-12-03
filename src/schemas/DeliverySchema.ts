import mongoose, { Schema } from 'mongoose';
import { DeliveryDocument } from '../interfaces/DeliveryInterface';

const DeliverySchema = new Schema<DeliveryDocument>({
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }],
    status: { type: String, enum: ['Pendiente', 'En Progreso', 'Completado'], default: 'Pendiente' },
    address: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    startPoint: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

const DeliveryModel = mongoose.models.Delivery || mongoose.model<DeliveryDocument>('Delivery', DeliverySchema);
export default DeliveryModel; 
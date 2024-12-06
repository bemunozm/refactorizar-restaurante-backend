import mongoose, { Schema } from 'mongoose';
import { DeliveryDocument } from '../interfaces/DeliveryInterface';

const DeliverySchema = new Schema<DeliveryDocument>({
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }],
    status: { type: String, enum: ['Recibido', 'En Preparación', 'En Camino', 'Completado'], default: 'Recibido' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    customerInformation: {
        name: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String },
        instructions: { type: String, default: null }
    },
    address: {
        lat: { type: Number},
        lng: { type: Number}
    },
    startPoint: {
        lat: { type: Number},
        lng: { type: Number}
    },
    deliveryMan: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

const DeliveryModel = mongoose.models.Delivery || mongoose.model<DeliveryDocument>('Delivery', DeliverySchema);
export default DeliveryModel; 
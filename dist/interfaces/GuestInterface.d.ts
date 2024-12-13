import { Document } from "mongoose";
import { OrderInterface } from "./OrderInterface";
import { User } from "../models/User";
export interface GuestInterface {
    guestId?: string;
    name: string;
    user?: User;
    orders: OrderInterface[];
}
export interface GuestDocument extends GuestInterface, Document {
}

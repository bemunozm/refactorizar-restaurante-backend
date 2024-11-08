import { Document, Types } from "mongoose";
import { UserInterface } from "./UserInterface";
import { OrderInterface } from "./OrderInterface";


export interface GuestInterface {
  guestId?: string;
  name: string;
  user?: string | Types.ObjectId | UserInterface;
  orders: OrderInterface[];
}

export interface GuestDocument extends GuestInterface, Document {}
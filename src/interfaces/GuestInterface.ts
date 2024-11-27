import { Document, Types } from "mongoose";
import { UserInterface } from "./UserInterface";
import { OrderInterface } from "./OrderInterface";
import { User } from "../models/User";
import { Order } from "../models/Order";


export interface GuestInterface {
  guestId?: string;
  name: string;
  user?: User;
  orders: OrderInterface[]; // Cambiado de Order[] a OrderInterface[]
}

export interface GuestDocument extends GuestInterface, Document {}
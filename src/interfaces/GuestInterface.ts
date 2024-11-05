import { Document, Types } from "mongoose";


export interface GuestInterface {
  name: string;
  user?: Types.ObjectId | string;
  orders: null;
}

export interface GuestDocument extends GuestInterface, Document {}
import { Document, Types } from "mongoose";
import { UserInterface } from "./UserInterface";


export interface GuestInterface {
  name: string;
  user?: UserInterface;
  orders: null;
}

export interface GuestDocument extends GuestInterface, Document {}
import { Document } from "mongoose";
import { RoleInterface } from "./RoleInterface";

export interface UserInterface {
  userId?: string;
  name: string;
  lastname: string;
  email: string;
  password: string;
  confirmed: boolean;
  roles: RoleInterface[];
}

export interface UserDocument extends UserInterface, Document {}

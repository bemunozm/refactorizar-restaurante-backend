import { Document } from "mongoose";
import { RoleInterface } from "./RoleInterface";
import { Role } from "../models/Role";

export interface UserInterface {
  userId?: string;
  name: string;
  lastname: string;
  email: string;
  password: string;
  confirmed: boolean;
  roles: Role[];
}

export interface UserDocument extends UserInterface, Document {}

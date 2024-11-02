import { Document } from "mongoose";


export interface RoleInterface {
  name: string;
  permissions: string[];
}

export interface RoleDocument extends RoleInterface, Document {}
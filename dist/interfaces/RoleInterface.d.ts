import { Document } from "mongoose";
export interface RoleInterface {
    roleId?: string;
    name?: string;
    permissions?: string[];
}
export interface RoleDocument extends RoleInterface, Document {
}

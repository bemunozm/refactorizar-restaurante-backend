import { BaseRepository } from "../interfaces/BaseRespository";
import { Document, FilterQuery, Model } from "mongoose";
export declare class GenericRepository<T extends Document> implements BaseRepository<T> {
    protected model: Model<T>;
    constructor(model: Model<T>);
    findAll(populate?: string | string[]): Promise<T[]>;
    findOne(query: FilterQuery<T>, populate?: string | string[]): Promise<T | null>;
    findById(id: string, populate?: string | string[]): Promise<T | null>;
    create(data: Partial<T>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}

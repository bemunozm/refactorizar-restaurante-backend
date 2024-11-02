import { BaseRepository } from "../interfaces/BaseRespository";
import { Document, FilterQuery, Model } from "mongoose";

export class GenericRepository<T extends Document> implements BaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public async findAll(): Promise<T[]> {
    try {
      return await this.model.find().exec();
    } catch (error) {
      console.error(`Error al buscar todos: ${error}`);
      throw new Error("Error al buscar todos los documentos");
    }
  }

  public async findOne(query: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(query).exec();
    } catch (error) {
      console.error(`Error al buscar: ${error}`);
      throw new Error("Error al buscar el documento");
    }
  }

  public async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id).exec();
    } catch (error) {
      console.error(`Error al buscar por ID: ${error}`);
      throw new Error("Error al buscar el documento por ID");
    }
  }

  public async create(data: Partial<T>): Promise<T> {
    try {
      const instance = new this.model(data);
      return await instance.save();
    } catch (error) {
      console.error(`Error al crear: ${error}`);
      throw new Error("Error al crear el documento");
    }
  }

  public async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    } catch (error) {
      console.error(`Error al actualizar: ${error}`);
      throw new Error("Error al actualizar el documento");
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id).exec();
      return result !== null;
    } catch (error) {
      console.error(`Error al borrar: ${error}`);
      throw new Error("Error Borrando el documento");
    }
  }
}

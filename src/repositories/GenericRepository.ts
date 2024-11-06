import { BaseRepository } from "../interfaces/BaseRespository";
import { Document, FilterQuery, Model } from "mongoose";

export class GenericRepository<T extends Document> implements BaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  // Obtener todos los documentos con opción de popular
  public async findAll(populate?: string | string[]): Promise<T[]> {
    try {
      const query = this.model.find();
      if (populate) {
        query.populate(populate); // Aplica `populate` si se especifica
      }
      return await query.exec();
    } catch (error) {
      console.error(`Error al buscar todos: ${error}`);
      throw new Error("Error al buscar todos los documentos");
    }
  }

  // Obtener un solo documento con opción de popular
  public async findOne(query: FilterQuery<T>, populate?: string | string[]): Promise<T | null> {
    try {
      const dbQuery = this.model.findOne(query);
      if (populate) {
        dbQuery.populate(populate);
      }
      return await dbQuery.exec();
    } catch (error) {
      console.error(`Error al buscar: ${error}`);
      throw new Error("Error al buscar el documento");
    }
  }

  // Obtener un documento por ID con opción de popular
  public async findById(id: string, populate?: string | string[]): Promise<T | null> {
    try {
      const query = this.model.findById(id);
      if (populate) {
        query.populate(populate);
      }
      return await query.exec();
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
      throw new Error("Error borrando el documento");
    }
  }
}

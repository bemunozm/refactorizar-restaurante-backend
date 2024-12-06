"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericRepository = void 0;
class GenericRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    // Obtener todos los documentos con opción de popular
    async findAll(populate) {
        try {
            const query = this.model.find();
            if (populate) {
                query.populate(populate); // Aplica `populate` si se especifica
            }
            return await query.exec();
        }
        catch (error) {
            console.error(`Error al buscar todos: ${error}`);
            throw new Error("Error al buscar todos los documentos");
        }
    }
    // Obtener un solo documento con opción de popular
    async findOne(query, populate) {
        try {
            const dbQuery = this.model.findOne(query);
            if (populate) {
                dbQuery.populate(populate);
            }
            return await dbQuery.exec();
        }
        catch (error) {
            console.error(`Error al buscar: ${error}`);
            throw new Error("Error al buscar el documento");
        }
    }
    // Obtener un documento por ID con opción de popular
    async findById(id, populate) {
        try {
            const query = this.model.findById(id);
            if (populate) {
                query.populate(populate);
            }
            return await query.exec();
        }
        catch (error) {
            console.error(`Error al buscar por ID: ${error}`);
            throw new Error("Error al buscar el documento por ID");
        }
    }
    async create(data) {
        try {
            const instance = new this.model(data);
            return await instance.save();
        }
        catch (error) {
            console.error(`Error al crear: ${error}`);
            throw new Error("Error al crear el documento");
        }
    }
    async update(id, data) {
        try {
            return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
        }
        catch (error) {
            console.error(`Error al actualizar: ${error}`);
            throw new Error("Error al actualizar el documento");
        }
    }
    async delete(id) {
        try {
            const result = await this.model.findByIdAndDelete(id).exec();
            return result !== null;
        }
        catch (error) {
            console.error(`Error al borrar: ${error}`);
            throw new Error("Error borrando el documento");
        }
    }
}
exports.GenericRepository = GenericRepository;
//# sourceMappingURL=GenericRepository.js.map
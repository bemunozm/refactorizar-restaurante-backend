"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableRepository = void 0;
const TableSchema_1 = __importDefault(require("../schemas/TableSchema"));
const GenericRepository_1 = require("./GenericRepository");
class TableRepository extends GenericRepository_1.GenericRepository {
    static mongooseModel = TableSchema_1.default;
    constructor() {
        super(TableRepository.mongooseModel);
    }
    async save(table) {
        try {
            const tableDocument = new this.model({
                tableNumber: table.tableNumber,
                status: table.status,
            });
            return await tableDocument.save();
        }
        catch (error) {
            console.error("Error saving table:", error);
            throw error;
        }
    }
}
exports.TableRepository = TableRepository;
//# sourceMappingURL=TableRepository.js.map
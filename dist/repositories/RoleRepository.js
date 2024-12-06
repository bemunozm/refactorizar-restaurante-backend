"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepository = void 0;
const GenericRepository_1 = require("./GenericRepository");
const RoleSchema_1 = __importDefault(require("../schemas/RoleSchema"));
class RoleRepository extends GenericRepository_1.GenericRepository {
    static mongooseModel = RoleSchema_1.default;
    constructor() {
        super(RoleRepository.mongooseModel);
    }
    async save(roleData) {
        const roleDocument = new this.model(roleData);
        return await roleDocument.save();
    }
}
exports.RoleRepository = RoleRepository;
//# sourceMappingURL=RoleRepository.js.map
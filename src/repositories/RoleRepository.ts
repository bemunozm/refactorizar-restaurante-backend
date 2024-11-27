import { GenericRepository } from "./GenericRepository";
import { RoleDocument } from "../interfaces/RoleInterface";
import RoleModel from "../schemas/RoleSchema";

export class RoleRepository extends GenericRepository<RoleDocument> {
    private static mongooseModel = RoleModel;

    constructor() {
        super(RoleRepository.mongooseModel);
    }

    public async save(roleData: { name: string, permissions: string[] }) {
        const roleDocument = new this.model(roleData);
        return await roleDocument.save();
    }
}

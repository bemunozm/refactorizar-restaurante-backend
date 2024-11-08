import CategoryModel from "../schemas/CategorySchema";
import { CategoryDocument, CategoryInterface } from "../interfaces/CategoryInterface";
import { GenericRepository } from "./GenericRepository";

export class CategoryRepository extends GenericRepository<CategoryDocument> {

    private static mongooseModel = CategoryModel;

    constructor() {
        super(CategoryRepository.mongooseModel);
    }


    public async save(category: CategoryInterface) {
        const categoryDocument = new this.model({
            name: category.name,
            image: category.image,
        });
        return await categoryDocument.save();
    }

}

import ProductModel from "../schemas/ProductSchema";
import { ProductDocument, ProductInterface } from "../interfaces/ProductInterface";
import { GenericRepository } from "./GenericRepository";

export class ProductRepository extends GenericRepository<ProductDocument> {

    private static mongooseModel = ProductModel;

    constructor() {
        super(ProductRepository.mongooseModel);
    }
    public async save(product: ProductInterface) {
        const productDocument = new this.model({
            name: product.name,
            price: product.price,
            about: product.about,
            categoryId: product.categoryId.categoryId,
            ingredients: product.ingredients,
            image: product.image,
        });
        return await productDocument.save();
    }

    public async findByCategoryId(categoryId: string) {
        return await this.model.find({ categoryId });
    }
}

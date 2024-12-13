import ProductModel from "../schemas/ProductSchema";
import { ProductDocument } from "../interfaces/ProductInterface";
import { GenericRepository } from "./GenericRepository";
export class ProductRepository extends GenericRepository<ProductDocument> {

    private static mongooseModel = ProductModel;

    constructor() {
        super(ProductRepository.mongooseModel);
    }

    public update(id: string, data: Partial<ProductDocument>): Promise<ProductDocument> {

        

        const updateData = {
            name: data.name,
            price: data.price,
            about: data.about,
            category: data.category.categoryId,
            image: data.image,
            isAvailable: data.isAvailable,
        }
        return this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    public async save(product) {
        
    
        const productDocument = new this.model({
            name: product.name,
            price: product.price,
            about: product.about,
            category: product.category,
            image: product.image,
            isAvailable: product.isAvailable,
        });
        return await productDocument.save();
    }

    public async findByCategoryId(categoryId: string) {
        return await this.model.find({ category: categoryId });
    }

    public async getMostSoldProduct(startDate: Date, endDate: Date) {
        return await this.model.find({ createdAt: { $gte: startDate, $lte: endDate } });
    }
}

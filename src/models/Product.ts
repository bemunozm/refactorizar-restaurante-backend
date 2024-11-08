import { ProductRepository } from "../repositories/ProductRepository";
import { ProductInterface } from "../interfaces/ProductInterface";
import { IngredientInterface } from "../interfaces/IngredientInterface";
import { CategoryInterface } from "../interfaces/CategoryInterface";
import { Category } from "./Category";

export class Product implements ProductInterface {
    public productId?: string;
    public name: string;
    public price: number;
    public about: string;
    public image: string;
    public categoryId: Category;
    public ingredients: IngredientInterface[];
    private productRepository: ProductRepository;

    constructor(data: Partial<ProductInterface>) {
        this.productId = data.productId.toString();
        this.name = data.name || '';
        this.price = data.price || 0;
        this.about = data.about || '';
        this.categoryId = data.categoryId instanceof Category ? data.categoryId : new Category(data.categoryId || {});
        this.ingredients = data.ingredients || [];
        this.image = data.image || '';
        this.productRepository = new ProductRepository();
    }

    public async save() {
        const savedProduct = await this.productRepository.save(this);
        this.productId = savedProduct.id;
        return this;
    }

    static async getAll() {
        const productRepository = new ProductRepository();
        const productInstances = await productRepository.findAll('categoryId');
        console.log(productInstances);

        if (productInstances) {
            const products = productInstances.map((productInstance) => {
                const categoryInstance = new Category({
                    categoryId: productInstance.categoryId?.categoryId.toString(),
                    name: productInstance.categoryId?.name
                });
                
                return new Product({
                    productId: productInstance.id,
                    name: productInstance.name,
                    price: productInstance.price,
                    about: productInstance.about,
                    categoryId: categoryInstance,
                    ingredients: productInstance.ingredients,
                    image: productInstance.image,
                });
            });

            return products;
        }

        return [];
    }

    public async findById() {
        const product = await this.productRepository.findById(this.productId);

        if (product) {
            this.productId = product.id;
            this.name = product.name;
            this.price = product.price;
            this.about = product.about;
            this.categoryId = new Category({
                categoryId: product.categoryId.categoryId,
                name: product.categoryId.name
            });
            this.ingredients = product.ingredients;
            this.image = product.image;
            return this;
        } else {
            return null;
        }
    }

    public async update(updateData: Partial<ProductInterface>) {
        const updatedInstance = await this.productRepository.update(this.productId, updateData);

        if (updatedInstance) {
            this.productId = updatedInstance.id;
            this.name = updatedInstance.name;
            this.price = updatedInstance.price;
            this.about = updatedInstance.about;
            this.categoryId = await new Category(updatedInstance.categoryId).findById();
            this.ingredients = updatedInstance.ingredients;
            this.image = updatedInstance.image;
            return this;
        } else {
            return null;
        }
    }

    public async delete() {
        return await this.productRepository.delete(this.productId);
    }

    static async findByCategoryId(categoryId: string) {
        const productRepository = new ProductRepository();
        const productInstances = await productRepository.findByCategoryId(categoryId);

        if (productInstances) {
            const products = productInstances.map((productInstance) => {
                return new Product({
                    productId: productInstance.id,
                    name: productInstance.name,
                    price: productInstance.price,
                    about: productInstance.about,
                    categoryId: new Category(productInstance.categoryId),
                    ingredients: productInstance.ingredients,
                    image: productInstance.image,
                });
            });

            return products;
        } else {
            return [];
        }
    }
}

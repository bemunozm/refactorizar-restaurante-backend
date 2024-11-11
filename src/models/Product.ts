import { ProductRepository } from "../repositories/ProductRepository";
import { ProductInterface } from "../interfaces/ProductInterface";
import { IngredientInterface } from "../interfaces/IngredientInterface";
import { CategoryInterface } from "../interfaces/CategoryInterface";
import { Category } from "./Category";
import { Ingredient } from "./Ingredient";

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
        this.productId = data.productId?.toString();
        this.name = data.name || '';
        this.price = data.price || 0;
        this.about = data.about || '';
        this.categoryId = data.categoryId instanceof Category ? data.categoryId : new Category({categoryId: data.categoryId || ''});
        this.ingredients = data.ingredients || [];
        this.image = data.image || '';
        this.productRepository = new ProductRepository();
    }

    private async populateProduct(productDoc: any): Promise<void> {
        this.productId = productDoc.id;
        this.name = productDoc.name;
        this.price = productDoc.price;
        this.about = productDoc.about;
        this.image = productDoc.image;

        // Cargar la categoría completa si está presente
        if (productDoc.categoryId) {
            this.categoryId = await new Category({categoryId:productDoc.categoryId}).findById();
        }

        // Cargar los ingredientes completos si están presentes
        this.ingredients = await Promise.all(
            productDoc.ingredients.map(async (ingredientDoc: any) => {
                const ingredient = await new Ingredient({ingredientId: ingredientDoc.ingredientId}).findById();

                const ingredientData = {
                    ingredientId: ingredient.ingredientId,
                    name: ingredient.name,
                    image: ingredient.image,
                    unit: ingredient.unit,
                    quantityRequired: ingredientDoc.quantityRequired,
                };
                return ingredientData;
            })
        );
    }

    public async save() {
        const savedProduct = await this.productRepository.save(this);
        this.productId = savedProduct.id;
        return this;
    }

    static async getAll() {
        const productRepository = new ProductRepository();
        const productInstances = await productRepository.findAll();

        console.log(productInstances);
        return Promise.all(productInstances.map(async (productInstance) => {
            const product = new Product({});
            await product.populateProduct(productInstance);
            console.log(product);
            return product;
        }));
    }

    public async findById() {
        const product = await this.productRepository.findById(this.productId);
        if (product) {
            await this.populateProduct(product);
            return this;
        } else {
            return null;
        }
    }

    public async update(updateData: Partial<ProductInterface>) {
        const updatedInstance = await this.productRepository.update(this.productId, updateData);
        if (updatedInstance) {
            await this.populateProduct(updatedInstance);
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

        const products = await Promise.all(productInstances.map(async (productInstance) => {
            const product = new Product({});
            await product.populateProduct(productInstance);
            return product;
        }));

        return products;
    }
}

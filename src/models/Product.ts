// Product.ts
import { ProductRepository } from "../repositories/ProductRepository";
import { ProductInterface, ProductIngredientInterface } from "../interfaces/ProductInterface";
import { Category } from "./Category";
import { Ingredient } from "./Ingredient";

export class Product implements ProductInterface {
    public productId?: string;
    public name: string;
    public price: number;
    public about: string;
    public image: string;
    public category: Category;
    public ingredients: ProductIngredientInterface[];
    private productRepository: ProductRepository;

    constructor(data: Partial<ProductInterface>) {
        this.productId = data.productId?.toString();
        this.name = data.name || '';
        this.price = data.price || 0;
        this.about = data.about || '';
        this.image = data.image || '';
        this.sanitizeData(data);
        this.productRepository = new ProductRepository();
    }

    private sanitizeData(data: Partial<ProductInterface>) {
        this.category = data.category instanceof Category 
            ? data.category 
            : new Category({ categoryId: data.category });

        this.ingredients = (data.ingredients || []).map(ingredient =>
            ingredient.ingredient instanceof Ingredient
                ? ingredient
                : { ingredient: new Ingredient({ ingredientId: ingredient.ingredient }), quantityRequired: ingredient.quantityRequired }
        );
    }

    public async populate(): Promise<void> {
        if (this.category && !this.category.name) this.category = await this.category.findById();

        this.ingredients = await Promise.all(
            this.ingredients.map(async ingredientRef => {
                if (ingredientRef.ingredient instanceof Ingredient && !ingredientRef.ingredient.name) {
                    ingredientRef.ingredient = await ingredientRef.ingredient.findById();
                }
                return ingredientRef;
            })
        );
    }

    public async save() {
        const ingredients = this.ingredients.map(ingredient => ({
            ingredient: ingredient.ingredient instanceof Ingredient ? ingredient.ingredient.ingredientId : ingredient.ingredient,
            quantityRequired: ingredient.quantityRequired
        }));

        const dataToSave = {
            name: this.name,
            price: this.price,
            about: this.about,
            category: this.category.categoryId,
            ingredients: ingredients,
            image: this.image,
        };

        const savedProduct = await this.productRepository.save(dataToSave);
        this.productId = savedProduct.id;
        return this;
    }

    static async getAll() {
        const productRepository = new ProductRepository();
        const productInstances = await productRepository.findAll();
        return Promise.all(productInstances.map(async (productInstance) => {
            const product = new Product({});
            await product.populateProduct(productInstance);
            await product.populate();
            return product;
        }));
    }

    public async findById() {
        const product = await this.productRepository.findById(this.productId);
        if (product) {
            await this.populateProduct(product);
            await this.populate();
            return this;
        }
        return null;
    }

    public async update(updateData: Partial<ProductInterface>) {
        // Actualizamos `updateData.ingredients` con los objetos `Ingredient`
        const updatedInstance = await this.productRepository.update(this.productId, { ...updateData });
        
        if (updatedInstance) {
            await this.populateProduct(updatedInstance);
            await this.populate(); // Cargar datos completos después de la actualización
            return this;
        }
        return null;
    }
    

    public async delete() {
        return await this.productRepository.delete(this.productId);
    }

    static async findByCategoryId(categoryId: string) {
        const productRepository = new ProductRepository();
        const productInstances = await productRepository.findByCategoryId(categoryId);
        return Promise.all(productInstances.map(async (productInstance) => {
            const product = new Product({});
            await product.populateProduct(productInstance);
            await product.populate();
            return product;
        }));
    }

    private async populateProduct(productDoc: any): Promise<void> {
        this.productId = productDoc.id;
        this.name = productDoc.name;
        this.price = productDoc.price;
        this.about = productDoc.about;
        this.image = productDoc.image;
        this.category = new Category({ categoryId: productDoc.category });
        this.ingredients = productDoc.ingredients.map((ingredientDoc: any) => ({
            ingredient: ingredientDoc.ingredient instanceof Ingredient
                ? ingredientDoc.ingredient
                : new Ingredient({ ingredientId: ingredientDoc.ingredient }),
            quantityRequired: ingredientDoc.quantityRequired,
        }));
    }
}

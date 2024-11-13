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

        // Sanitizar los datos para manejar category e ingredients
        this.sanitizeData(data);

        this.productRepository = new ProductRepository();
    }

    /**
     * Método para sanear y crear instancias mínimas de los datos relacionados.
     */
    private sanitizeData(data: Partial<ProductInterface>) {
        // Si `data.category` es un string, crea una instancia mínima de `Category`
        this.category = data.category instanceof Category 
            ? data.category 
            : new Category({ categoryId: data.category || '' });

        // Para cada `ingredient`, crea una instancia mínima de `Ingredient` si `ingredient` es un string
        this.ingredients = (data.ingredients || []).map(ingredient =>
            ingredient.ingredient instanceof Ingredient
                ? ingredient
                : {
                    ingredient: new Ingredient({ ingredientId: ingredient.ingredient }),
                    quantityRequired: ingredient.quantityRequired || 0,
                }
        );
    }

    /**
     * Método populate para cargar los datos completos de la categoría y los ingredientes.
     */
    public async populate(): Promise<void> {
        // Cargar la categoría completa si solo tiene el ID
        if (this.category && !this.category.name) {
            this.category = await this.category.findById();
        }

        // Cargar cada ingrediente completo si solo tiene el ID
        this.ingredients = await Promise.all(
            this.ingredients.map(async ingredientRef => {
                if (ingredientRef.ingredient instanceof Ingredient && !ingredientRef.ingredient.name) {  // Verifica si el objeto está completo
                    ingredientRef.ingredient = await ingredientRef.ingredient.findById();
                }
                return ingredientRef;
            })
        );
    }

    /**
     * Guarda el producto en la base de datos.
     */
    public async save() {
        // Convertir `ingredients` a IDs
        const ingredients = this.ingredients.map(ingredient => ({
            ingredient: ingredient.ingredient instanceof Ingredient
                ? ingredient.ingredient.ingredientId
                : ingredient.ingredient,
            quantityRequired: ingredient.quantityRequired
        }));
    
        // Crear un objeto con los datos procesados
        const dataToSave = {
            name: this.name,
            price: this.price,
            about: this.about,
            category: this.category.categoryId,
            ingredients: ingredients,
            image: this.image,
        };
    
        // Llamar al repositorio con datos ya convertidos a IDs
        const savedProduct = await this.productRepository.save(dataToSave);
        this.productId = savedProduct.id;
        return this;
    }

    /**
     * Recupera todos los productos y hace `populate` de los datos.
     */
    static async getAll() {
        const productRepository = new ProductRepository();
        const productInstances = await productRepository.findAll();
        return Promise.all(productInstances.map(async (productInstance) => {
            const product = new Product({});
            await product.populateProduct(productInstance);
            await product.populate(); // Llama al método populate para cargar datos completos
            
            return product;
        }));
    }

    /**
     * Encuentra un producto por su ID y hace `populate` de los datos.
     */
    public async findById() {
        const product = await this.productRepository.findById(this.productId);
        if (product) {
            await this.populateProduct(product);
            await this.populate(); // Llama al método populate para cargar datos completos
            return this;
        }
        return null;
    }

    /**
     * Actualiza el producto con los datos proporcionados.
     */
    public async update(updateData: Partial<ProductInterface>) {
        const ingredients = updateData.ingredients.map(ingredient => {
            return {
                ingredient: ingredient.ingredient instanceof Ingredient ? ingredient.ingredient.ingredientId : ingredient.ingredient,
                quantityRequired: ingredient.quantityRequired
            }
        });
        updateData.ingredients = ingredients;
        const updatedInstance = await this.productRepository.update(this.productId, updateData);
        if (updatedInstance) {
            await this.populateProduct(updatedInstance);
            await this.populate(); // Llama al método populate para cargar datos completos
            return this;
        }
        return null;
    }

    /**
     * Elimina el producto de la base de datos.
     */
    public async delete() {
        return await this.productRepository.delete(this.productId);
    }

    /**
     * Encuentra productos por `categoryId` y hace `populate` de los datos.
     */
    static async findByCategoryId(categoryId: string) {
        const productRepository = new ProductRepository();
        const productInstances = await productRepository.findByCategoryId(categoryId);
        console.log(productInstances);
        return Promise.all(productInstances.map(async (productInstance) => {
            const product = new Product({});
            await product.populateProduct(productInstance);
            await product.populate(); // Llama al método populate para cargar datos completos
            return product;
        }));
    }

    /**
     * Popula los datos de un documento de producto.
     */
    private async populateProduct(productDoc: any): Promise<void> {
        this.productId = productDoc.id;
        this.name = productDoc.name;
        this.price = productDoc.price;
        this.about = productDoc.about;
        this.image = productDoc.image;

        // Asigna el ID a la categoría inicialmente; se poblará con `populate` si es necesario
        this.category = new Category({ categoryId: productDoc.category });

        // Solo asigna los IDs a cada ingrediente; se poblará con `populate` si es necesario
        this.ingredients = productDoc.ingredients.map((ingredientDoc: any) => ({
            ingredient: ingredientDoc.ingredient instanceof Ingredient
                ? ingredientDoc.ingredient
                : new Ingredient({ ingredientId: ingredientDoc.ingredient }),
            quantityRequired: ingredientDoc.quantityRequired,
        }));
    }
}

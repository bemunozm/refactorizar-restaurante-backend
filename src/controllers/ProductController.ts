import type { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';

export class ProductController {
    private readonly productService: ProductService;

    constructor() {
        this.productService = new ProductService();
    }

    public async createProduct(req: Request, res: Response): Promise<Response> {
        try {
            const result = await this.productService.createProduct(req.body, req.file);
            return res.status(201).json({ message: 'Producto creado exitosamente', product: result });
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error al crear el producto');
        }
    }

    public async getProducts(req: Request, res: Response): Promise<Response> {
        try {
            const products = await this.productService.getProducts();
            return res.status(200).send(products);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error al obtener los productos');
        }
    }

    public async getProduct(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const product = await this.productService.getProduct(id);
            return product
                ? res.status(200).send(product)
                : res.status(404).send('Producto no encontrado');
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error al obtener el producto');
        }
    }

    public async updateProduct(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const updatedProduct = await this.productService.updateProduct(id, req.body, req.file);
            return updatedProduct
                ? res.status(200).json({ message: 'Producto actualizado exitosamente', product: updatedProduct })
                : res.status(404).json({ message: 'Producto no encontrado' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al actualizar el producto' });
        }
    }

    public async deleteProduct(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const result = await this.productService.deleteProduct(id);
            return result
                ? res.status(200).send('Producto eliminado exitosamente')
                : res.status(404).send('Producto no encontrado');
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error al eliminar el producto');
        }
    }

    public async getProductsByCategory(req: Request, res: Response): Promise<Response> {
        try {
            const { categoryName } = req.params;
            const products = await this.productService.getProductsByCategory(categoryName);
            return products
                ? res.status(200).send(products)
                : res.status(404).send('Categoría no encontrada');
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error al obtener los productos');
        }
    }
}

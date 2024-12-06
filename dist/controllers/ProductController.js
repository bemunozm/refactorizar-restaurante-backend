"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const ProductService_1 = require("../services/ProductService");
class ProductController {
    productService;
    constructor() {
        this.productService = new ProductService_1.ProductService();
    }
    async createProduct(req, res) {
        try {
            const result = await this.productService.createProduct(req.body, req.file);
            return res.status(201).json({ message: 'Producto creado exitosamente', product: result });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('Error al crear el producto');
        }
    }
    async getProducts(req, res) {
        try {
            const products = await this.productService.getProducts();
            return res.status(200).send(products);
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('Error al obtener los productos');
        }
    }
    async getProduct(req, res) {
        try {
            const { id } = req.params;
            const product = await this.productService.getProduct(id);
            return product
                ? res.status(200).send(product)
                : res.status(404).send('Producto no encontrado');
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('Error al obtener el producto');
        }
    }
    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const updatedProduct = await this.productService.updateProduct(id, req.body, req.file);
            return updatedProduct
                ? res.status(200).json({ message: 'Producto actualizado exitosamente', product: updatedProduct })
                : res.status(404).json({ message: 'Producto no encontrado' });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al actualizar el producto' });
        }
    }
    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            const result = await this.productService.deleteProduct(id);
            return result
                ? res.status(200).send('Producto eliminado exitosamente')
                : res.status(404).send('Producto no encontrado');
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('Error al eliminar el producto');
        }
    }
    async getProductsByCategory(req, res) {
        try {
            const { categoryName } = req.params;
            const products = await this.productService.getProductsByCategory(categoryName);
            return products
                ? res.status(200).send(products)
                : res.status(404).send('Categoría no encontrada');
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('Error al obtener los productos');
        }
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=ProductController.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountController = void 0;
const DiscountService_1 = require("../services/DiscountService");
class DiscountController {
    discountService;
    constructor() {
        this.discountService = new DiscountService_1.DiscountService();
    }
    async createDiscount(req, res) {
        try {
            console.log(req.body);
            const discount = await this.discountService.createDiscount(req.body);
            return res.status(201).json(discount);
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Error al crear el descuento');
        }
    }
    async getDiscountById(req, res) {
        try {
            const discount = await this.discountService.getDiscountById(req.params.id);
            if (!discount) {
                return res.status(404).send('Descuento no encontrado');
            }
            return res.status(200).send(discount);
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener el descuento');
        }
    }
    async updateDiscount(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const discount = await this.discountService.updateDiscount(id, updateData);
            if (!discount) {
                return res.status(404).json({ message: 'Descuento no encontrado' });
            }
            return res.status(200).json(discount);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al actualizar el descuento' });
        }
    }
    async deleteDiscount(req, res) {
        try {
            await this.discountService.deleteDiscount(req.params.id);
            return res.status(200).send('Descuento eliminado exitosamente');
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Error al eliminar el descuento');
        }
    }
    async getDiscounts(req, res) {
        try {
            const discounts = await this.discountService.getDiscounts();
            return res.status(200).send(discounts);
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('Error al obtener los descuentos');
        }
    }
    async validateDiscountByPromotionCode(req, res) {
        try {
            const { promotionCode, orders, items, orderType } = req.body;
            const discount = await this.discountService.validateDiscountByPromotionCode(promotionCode, orders);
            return res.status(200).json(discount);
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('Error al validar el descuento');
        }
    }
    async validateDiscountByPromotionCodeOnline(req, res) {
        try {
            const { promotionCode, items, userId, type } = req.body;
            const discount = await this.discountService.validateDiscountByPromotionCodeOnline(items, promotionCode, type, userId);
            return res.status(200).json(discount);
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('Error al validar el descuento');
        }
    }
}
exports.DiscountController = DiscountController;
//# sourceMappingURL=DiscountController.js.map
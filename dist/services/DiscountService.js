"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountService = void 0;
const Discount_1 = require("../models/Discount");
const Order_1 = require("../models/Order");
const User_1 = require("../models/User");
class DiscountService {
    async createDiscount(discountData) {
        const discount = new Discount_1.Discount(discountData);
        return await discount.save();
    }
    async getDiscountById(discountId) {
        const discount = new Discount_1.Discount({ discountId });
        await discount.findById();
        console.log(discount);
        return discount;
    }
    async updateDiscount(discountId, updateData) {
        const discount = new Discount_1.Discount(updateData);
        return await discount.update(updateData);
    }
    async deleteDiscount(discountId) {
        const discount = new Discount_1.Discount({ discountId });
        await discount.delete();
    }
    async getDiscounts() {
        return await Discount_1.Discount.getAll();
    }
    async activateDiscount(discountId) {
        const discount = new Discount_1.Discount({ discountId });
        await discount.activate();
    }
    async deactivateDiscount(discountId) {
        const discount = new Discount_1.Discount({ discountId });
        await discount.deactivate();
    }
    async validateDiscountByPromotionCode(promotionCode, orders) {
        const discount = new Discount_1.Discount({ conditions: { promoCode: promotionCode } });
        const discountFound = await discount.findByPromotionCode();
        if (!discountFound) {
            throw new Error("Descuento no encontrado");
        }
        if (!discountFound.isActive) {
            throw new Error("Descuento no activo");
        }
        // Pasar las ordenes a objetos Order
        const ordersToApply = await Promise.all(orders.map(async (orderId) => await new Order_1.Order({ orderId }).findById()));
        if (ordersToApply.some(order => !order)) {
            throw new Error("Alguna de las ordenes no existe");
        }
        // Validar cada orden individualmente y mapear a { product, quantity }
        const validOrders = ordersToApply
            .filter(order => discountFound.validateConditions([order]))
            .map(order => order.items.map(item => ({ product: item.product, quantity: item.quantity })))
            .flat();
        if (validOrders.length === 0) {
            throw new Error("Ninguna de las ordenes cumple con las condiciones del descuento");
        }
        // Retornar los productos y cantidades que cumplen con las condiciones
        return { discount: discountFound, validItems: validOrders };
    }
    async validateDiscountByPromotionCodeOnline(items, promotionCode, type, userId) {
        const user = userId ? new User_1.User({ userId }) : null;
        if (user)
            await user.findById();
        const discount = new Discount_1.Discount({ conditions: { promoCode: promotionCode } });
        const discountFound = await discount.findByPromotionCode();
        if (!discountFound) {
            throw new Error("Descuento no encontrado");
        }
        if (!discountFound.isActive) {
            throw new Error("Descuento no activo");
        }
        // Filtrar los ítems que cumplen con las condiciones del descuento
        const validItems = await Promise.all(items.map(async (item) => {
            const order = new Order_1.Order({ items: [item], user: user, type });
            await order.populate();
            if (discountFound.validateConditions([order])) {
                return { product: order.items[0].product, quantity: item.quantity };
            }
            return null;
        }));
        const filteredValidItems = validItems.filter(item => item !== null);
        console.log(filteredValidItems);
        if (filteredValidItems.length === 0) {
            throw new Error("Ninguno de los ítems cumple con las condiciones del descuento");
        }
        return { discount: discountFound, validItems: filteredValidItems };
    }
}
exports.DiscountService = DiscountService;
//# sourceMappingURL=DiscountService.js.map
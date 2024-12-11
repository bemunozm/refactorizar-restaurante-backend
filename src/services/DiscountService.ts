import { DiscountInterface } from "../interfaces/DiscountInterface";
import { OrderItemInterface } from "../interfaces/OrderInterface";
import { Discount } from "../models/Discount";
import { Order } from "../models/Order";
import { User } from "../models/User";
import { Product } from "../models/Product";

export class DiscountService {

    

    public async createDiscount(discountData: Partial<DiscountInterface>): Promise<Discount> {
        const discount = new Discount(discountData);
        return await discount.save();
    }

    public async getDiscountById(discountId: string): Promise<Discount | null> {
        const discount = new Discount({ discountId });
        await discount.findById();
        console.log(discount);
        return discount;
    }

    public async updateDiscount(discountId: string, updateData: Partial<DiscountInterface>): Promise<Discount | null> {
        const discount = new Discount(updateData);
        return await discount.update(updateData);

    }

    public async deleteDiscount(discountId: string): Promise<void> {
        const discount = new Discount({ discountId });
        await discount.delete();
    }

    public async getDiscounts(): Promise<Discount[]> {
        return await Discount.getAll();
    }

    public async activateDiscount(discountId: string): Promise<void> {
        const discount = new Discount({ discountId });
        await discount.activate();
    }

    public async deactivateDiscount(discountId: string): Promise<void> {
        const discount = new Discount({ discountId });
        await discount.deactivate();
    }

    public async validateDiscountByPromotionCode(promotionCode: string, orders?: string[]): Promise<{ discount: Discount, validItems: { product: Product, quantity: number }[] }> {
        const discount = new Discount({ conditions: { promoCode: promotionCode } });
        const discountFound = await discount.findByPromotionCode();
        if (!discountFound) {
            throw new Error("Descuento no encontrado");
        }

        if (!discountFound.isActive) {
            throw new Error("Descuento no activo");
        }

        // Pasar las ordenes a objetos Order
        const ordersToApply = await Promise.all(orders.map(async (orderId) => await new Order({ orderId }).findById()));

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

    public async validateDiscountByPromotionCodeOnline(items: OrderItemInterface[], promotionCode: string, type: 'Retiro en Tienda' | 'Delivery', userId?: string): Promise<{ discount: Discount, validItems: { product: Product, quantity: number }[] }> {
        const user = userId ? new User({ userId }) : null;
        if (user) await user.findById();
        
        const discount = new Discount({ conditions: { promoCode: promotionCode } });
        const discountFound = await discount.findByPromotionCode();
        if (!discountFound) {
            throw new Error("Descuento no encontrado");
        }

        if (!discountFound.isActive) {
            throw new Error("Descuento no activo");
        }

        // Filtrar los ítems que cumplen con las condiciones del descuento
        const validItems = await Promise.all(items.map(async item => {
            const order = new Order({ items: [item], user: user, type });
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
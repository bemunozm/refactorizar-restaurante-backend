import { Request, Response } from 'express';
import { DiscountService } from '../services/DiscountService';

export class DiscountController {

    private readonly discountService: DiscountService;

    constructor() {
        this.discountService = new DiscountService();
    }

    public async createDiscount(req: Request, res: Response): Promise<Response> {
        try {
            console.log(req.body);
            const discount = await this.discountService.createDiscount(req.body);
            return res.status(201).json(discount);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al crear el descuento');
        }
    }

    public async getDiscountById(req: Request, res: Response): Promise<Response> {
        try {
            const discount = await this.discountService.getDiscountById(req.params.id);
            if (!discount) {
                return res.status(404).send('Descuento no encontrado');
            }
            return res.status(200).send(discount);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener el descuento');
        }
    }

    public async updateDiscount(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const discount = await this.discountService.updateDiscount(id, updateData);
            if (!discount) {
                return res.status(404).json({ message: 'Descuento no encontrado' });
            }
            return res.status(200).json(discount);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al actualizar el descuento' });
        }
    }

    public async deleteDiscount(req: Request, res: Response): Promise<Response> {
        try {
            await this.discountService.deleteDiscount(req.params.id);
            return res.status(200).send('Descuento eliminado exitosamente');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al eliminar el descuento');
        }
    }

    public async getDiscounts(req: Request, res: Response): Promise<Response> {
        try {
            const discounts = await this.discountService.getDiscounts();
            return res.status(200).send(discounts);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error al obtener los descuentos');
        }
    }

    public async validateDiscountByPromotionCode(req: Request, res: Response): Promise<Response> {
        try {
            const { promotionCode, orders, items, orderType } = req.body;
            const discount = await this.discountService.validateDiscountByPromotionCode(promotionCode, orders);
            return res.status(200).json(discount);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error al validar el descuento');
        }
    }

    public async validateDiscountByPromotionCodeOnline(req: Request, res: Response): Promise<Response> {
        try {
            const { promotionCode, items, userId, type } = req.body;
            const discount = await this.discountService.validateDiscountByPromotionCodeOnline(items, promotionCode, type, userId);
            return res.status(200).json(discount);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error al validar el descuento');
        }
    }
}

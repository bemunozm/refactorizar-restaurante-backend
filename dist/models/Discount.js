"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Discount = void 0;
const DiscountRepository_1 = require("../repositories/DiscountRepository");
const Category_1 = require("../models/Category");
const Product_1 = require("../models/Product");
const User_1 = require("../models/User");
class Discount {
    discountId;
    name;
    description;
    type;
    value;
    conditions;
    maxUses;
    usedCount;
    startDate;
    endDate;
    isActive;
    createdAt;
    updatedAt;
    discountRepository;
    constructor(discount) {
        this.discountId = discount.discountId || '';
        this.name = discount.name || '';
        this.description = discount.description;
        this.type = discount.type || 'percentage';
        this.value = discount.value || 0;
        this.conditions = discount.conditions;
        this.maxUses = discount.maxUses;
        this.usedCount = discount.usedCount || 0;
        this.startDate = discount.startDate;
        this.endDate = discount.endDate;
        this.isActive = discount.isActive || true;
        this.createdAt = discount.createdAt || '';
        this.updatedAt = discount.updatedAt || '';
        this.discountRepository = new DiscountRepository_1.DiscountRepository();
        this.sanitizeConditions(discount);
    }
    async sanitizeConditions(discount) {
        if (discount.conditions?.category) {
            this.conditions.category = discount.conditions.category instanceof Category_1.Category ? discount.conditions.category : new Category_1.Category({ categoryId: discount.conditions.category });
        }
        if (discount.conditions?.product) {
            this.conditions.product = discount.conditions.product instanceof Product_1.Product ? discount.conditions.product : new Product_1.Product({ productId: discount.conditions.product });
        }
        if (discount.conditions?.excludeProduct) {
            this.conditions.excludeProduct = discount.conditions.excludeProduct instanceof Product_1.Product ? discount.conditions.excludeProduct : new Product_1.Product({ productId: discount.conditions.excludeProduct });
        }
        if (discount.conditions?.user) {
            this.conditions.user = discount.conditions.user instanceof User_1.User ? discount.conditions.user : new User_1.User({ userId: discount.conditions.user });
        }
        if (discount.conditions?.excludeUser) {
            this.conditions.excludeUser = discount.conditions.excludeUser instanceof User_1.User ? discount.conditions.excludeUser : new User_1.User({ userId: discount.conditions.excludeUser });
        }
    }
    async save() {
        const savedDiscount = await this.discountRepository.save(this);
        this.populateFromDocument(savedDiscount);
        return this;
    }
    async findById() {
        const discountDocument = await this.discountRepository.findById(this.discountId);
        if (discountDocument) {
            await this.populateFromDocument(discountDocument);
            return this;
        }
        return null;
    }
    async update(updateData) {
        const updatedDiscount = await this.discountRepository.update(this.discountId, updateData);
        if (updatedDiscount) {
            this.populateFromDocument(updatedDiscount);
            return this;
        }
        return null;
    }
    async delete() {
        await this.discountRepository.delete(this.discountId);
    }
    static async getAll() {
        const discountRepository = new DiscountRepository_1.DiscountRepository();
        const discounts = await discountRepository.findAll();
        return await Promise.all(discounts.map(async (discount) => {
            const discountModel = new Discount({});
            await discountModel.populateFromDocument(discount);
            return discountModel;
        }));
    }
    async activate() {
        const updatedDiscount = await this.discountRepository.update(this.discountId, { isActive: true });
        if (updatedDiscount) {
            this.populateFromDocument(updatedDiscount);
        }
    }
    async deactivate() {
        const updatedDiscount = await this.discountRepository.update(this.discountId, { isActive: false });
        if (updatedDiscount) {
            this.populateFromDocument(updatedDiscount);
        }
    }
    async findByPromotionCode() {
        const discount = await this.discountRepository.findOne({ 'conditions.promoCode': this.conditions?.promoCode });
        if (discount) {
            this.populateFromDocument(discount);
            return this;
        }
        return null;
    }
    validateConditions(orders) {
        for (const order of orders) {
            // Verificar condiciones de cantidad mínima y máxima
            if (this.conditions?.minQuantity || this.conditions?.maxQuantity) {
                const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
                if (this.conditions.minQuantity && totalQuantity < this.conditions.minQuantity) {
                    console.log('no cumple minQuantity');
                    return false;
                }
                if (this.conditions.maxQuantity && totalQuantity > this.conditions.maxQuantity) {
                    console.log('no cumple maxQuantity');
                    return false;
                }
            }
            // Verificar condiciones de categoría
            if (this.conditions?.category) {
                const hasCategory = order.items.some(item => item.product.category.categoryId === this.conditions.category.categoryId);
                if (!hasCategory) {
                    console.log('no cumple category');
                    return false;
                }
            }
            // Verificar condiciones de producto
            if (this.conditions?.product) {
                const hasProduct = order.items.some(item => item.product.productId === this.conditions.product.productId);
                if (!hasProduct) {
                    console.log('no cumple product');
                    return false;
                }
            }
            // Verificar exclusión de producto
            if (this.conditions?.excludeProduct) {
                const hasExcludedProduct = order.items.some(item => item.product.productId === this.conditions.excludeProduct.productId);
                if (hasExcludedProduct) {
                    console.log('no cumple excludeProduct');
                    return false;
                }
            }
            // Verificar condiciones de usuario
            if (this.conditions?.user && (!order.user.userId || order.user.userId !== this.conditions.user.userId)) {
                console.log('no cumple user');
                return false;
            }
            // Verificar exclusión de usuario
            if (this.conditions?.excludeUser && order.user.userId && order.user.userId === this.conditions.excludeUser.userId) {
                console.log('no cumple excludeUser');
                return false;
            }
            // Verificar tipo de orden
            if (this.conditions?.orderType && order.type !== this.conditions.orderType) {
                console.log('no cumple orderType');
                return false;
            }
        }
        return true;
    }
    async populateFromDocument(discountDoc) {
        this.discountId = discountDoc.id.toString();
        this.name = discountDoc.name;
        this.description = discountDoc.description;
        this.type = discountDoc.type;
        this.value = discountDoc.value;
        const populatedConditions = await this.populateConditions(discountDoc.conditions);
        this.conditions = populatedConditions;
        this.maxUses = discountDoc.maxUses;
        this.usedCount = discountDoc.usedCount;
        this.startDate = discountDoc.startDate;
        this.endDate = discountDoc.endDate;
        this.isActive = discountDoc.isActive;
        this.createdAt = discountDoc.createdAt;
        this.updatedAt = discountDoc.updatedAt;
    }
    async populateConditions(conditions) {
        // Inicializa conditions si es undefined
        if (!this.conditions) {
            this.conditions = {};
        }
        this.conditions.minQuantity = conditions.minQuantity;
        this.conditions.minOrder = conditions.minOrder;
        this.conditions.maxQuantity = conditions.maxQuantity;
        this.conditions.maxOrder = conditions.maxOrder;
        this.conditions.orderType = conditions.orderType;
        this.conditions.promoCode = conditions.promoCode;
        this.conditions.validOn = conditions.validOn;
        this.conditions.validBetween = conditions.validBetween;
        this.conditions.validHours = conditions.validHours;
        this.conditions.maxDiscount = conditions.maxDiscount;
        this.conditions.category = conditions.category ? (conditions.category instanceof Category_1.Category ? conditions.category : await new Category_1.Category({ categoryId: conditions.category }).findById()) : null;
        this.conditions.product = conditions.product ? (conditions.product instanceof Product_1.Product ? conditions.product : await new Product_1.Product({ productId: conditions.product }).findById()) : null;
        this.conditions.excludeProduct = conditions.excludeProduct ? (conditions.excludeProduct instanceof Product_1.Product ? conditions.excludeProduct : await new Product_1.Product({ productId: conditions.excludeProduct }).findById()) : null;
        this.conditions.user = conditions.user ? (conditions.user instanceof User_1.User ? conditions.user : await new User_1.User({ userId: conditions.user }).findById()) : null;
        this.conditions.excludeUser = conditions.excludeUser ? (conditions.excludeUser instanceof User_1.User ? conditions.excludeUser : await new User_1.User({ userId: conditions.excludeUser }).findById()) : null;
        return this.conditions;
    }
    async populate() {
        if (this.conditions?.category) {
            const category = new Category_1.Category({ categoryId: this.conditions.category.categoryId });
            this.conditions.category = await category.findById();
        }
        if (this.conditions?.product) {
            const product = new Product_1.Product({ productId: this.conditions.product.productId });
            this.conditions.product = await product.findById();
        }
        if (this.conditions?.excludeProduct) {
            const product = new Product_1.Product({ productId: this.conditions.excludeProduct.productId });
            this.conditions.excludeProduct = await product.findById();
        }
        if (this.conditions?.user) {
            const user = new User_1.User({ userId: this.conditions.user.userId });
            this.conditions.user = await user.findById();
        }
        if (this.conditions?.excludeUser) {
            const user = new User_1.User({ userId: this.conditions.excludeUser.userId });
            this.conditions.excludeUser = await user.findById();
        }
    }
}
exports.Discount = Discount;
//# sourceMappingURL=Discount.js.map
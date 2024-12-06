"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const IngredientController_1 = require("../controllers/IngredientController");
const validation_1 = __importDefault(require("../middleware/validation"));
const auth_1 = __importDefault(require("../middleware/auth"));
const permission_1 = __importDefault(require("../middleware/permission"));
const express_validator_1 = require("express-validator");
const multer_1 = __importDefault(require("../config/multer"));
class IngredientRoute {
    ingredientController;
    router;
    constructor() {
        this.ingredientController = new IngredientController_1.IngredientController();
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post("/create", auth_1.default.authenticate, permission_1.default.checkPermission("CREATE_INGREDIENT"), multer_1.default.single("image"), [
            (0, express_validator_1.body)("name").isString().notEmpty().withMessage("El nombre del ingrediente es obligatorio."),
            (0, express_validator_1.body)("stockQuantity").isNumeric().withMessage("La cantidad en stock debe ser un número."),
            (0, express_validator_1.body)("unit").isString().notEmpty().withMessage("La unidad es obligatoria."),
            validation_1.default.handleInputErrors
        ], this.ingredientController.createIngredient.bind(this.ingredientController));
        this.router.get("/get", auth_1.default.authenticate, permission_1.default.checkPermission("VIEW_INGREDIENTS"), this.ingredientController.getIngredients.bind(this.ingredientController));
        this.router.get("/get/:id", auth_1.default.authenticate, permission_1.default.checkPermission("VIEW_INGREDIENT"), (0, express_validator_1.param)("id").isMongoId().withMessage("ID de ingrediente inválido."), validation_1.default.handleInputErrors, this.ingredientController.getIngredient.bind(this.ingredientController));
        this.router.put("/update/:id", auth_1.default.authenticate, permission_1.default.checkPermission("UPDATE_INGREDIENT"), multer_1.default.single("image"), [
            (0, express_validator_1.param)("id").isMongoId().withMessage("ID de ingrediente inválido."),
            (0, express_validator_1.body)("name").optional().isString().notEmpty().withMessage("El nombre debe ser una cadena no vacía."),
            (0, express_validator_1.body)("stockQuantity").optional().isNumeric().withMessage("La cantidad en stock debe ser un número."),
            (0, express_validator_1.body)("unit").optional().isString().notEmpty().withMessage("La unidad debe ser una cadena no vacía."),
            validation_1.default.handleInputErrors
        ], this.ingredientController.updateIngredient.bind(this.ingredientController));
        this.router.delete("/delete/:id", auth_1.default.authenticate, permission_1.default.checkPermission("DELETE_INGREDIENT"), (0, express_validator_1.param)("id").isMongoId().withMessage("ID de ingrediente inválido."), validation_1.default.handleInputErrors, this.ingredientController.deleteIngredient.bind(this.ingredientController));
    }
}
exports.default = new IngredientRoute().router;
//# sourceMappingURL=ingredientRoutes.js.map
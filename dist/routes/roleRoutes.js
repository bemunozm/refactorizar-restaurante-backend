"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RoleController_1 = require("../controllers/RoleController");
const validation_1 = __importDefault(require("../middleware/validation"));
const auth_1 = __importDefault(require("../middleware/auth"));
const permission_1 = __importDefault(require("../middleware/permission"));
const express_validator_1 = require("express-validator");
class RoleRoute {
    roleController;
    router;
    constructor() {
        this.roleController = new RoleController_1.RoleController();
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        this.router.get("/permissions", auth_1.default.authenticate, 
        //PermissionMiddleware.checkPermission("VIEW_PERMISSIONS"),
        this.roleController.getPermissions.bind(this.roleController));
        this.router.post("/create", auth_1.default.authenticate, permission_1.default.checkPermission("CREATE_ROLE"), [
            (0, express_validator_1.body)("name").isString().notEmpty().withMessage("El nombre del rol es obligatorio."),
            (0, express_validator_1.body)("permissions").isArray().withMessage("Los permisos deben ser un array."),
            (0, express_validator_1.body)("permissions.*").isString().withMessage("Cada permiso debe ser una cadena de texto."),
            validation_1.default.handleInputErrors
        ], this.roleController.createRole.bind(this.roleController));
        this.router.get("/get", auth_1.default.authenticate, permission_1.default.checkPermission("VIEW_ROLES"), this.roleController.getRoles.bind(this.roleController));
        this.router.get("/get/:id", auth_1.default.authenticate, permission_1.default.checkPermission("VIEW_ROLE"), (0, express_validator_1.param)("id").isMongoId().withMessage("ID de rol inválido."), validation_1.default.handleInputErrors, this.roleController.getRoleById.bind(this.roleController));
        this.router.put("/update/:id", auth_1.default.authenticate, permission_1.default.checkPermission("UPDATE_ROLE"), [
            (0, express_validator_1.param)("id").isMongoId().withMessage("ID de rol inválido."),
            (0, express_validator_1.body)("name").isString().optional(),
            (0, express_validator_1.body)("permissions").isArray().optional(),
            (0, express_validator_1.body)("permissions.*").isString().optional(),
            validation_1.default.handleInputErrors
        ], this.roleController.updateRole.bind(this.roleController));
        this.router.delete("/delete/:id", auth_1.default.authenticate, permission_1.default.checkPermission("DELETE_ROLE"), (0, express_validator_1.param)("id").isMongoId().withMessage("ID de rol inválido."), validation_1.default.handleInputErrors, this.roleController.deleteRole.bind(this.roleController));
    }
}
exports.default = new RoleRoute().router;
//# sourceMappingURL=roleRoutes.js.map
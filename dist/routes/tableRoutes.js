"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TableController_1 = require("../controllers/TableController");
const validation_1 = __importDefault(require("../middleware/validation"));
const auth_1 = __importDefault(require("../middleware/auth"));
const permission_1 = __importDefault(require("../middleware/permission"));
const express_validator_1 = require("express-validator");
class TableRoute {
    tableController;
    router;
    constructor() {
        this.tableController = new TableController_1.TableController();
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post("/create", auth_1.default.authenticate, permission_1.default.checkPermission("CREATE_TABLE"), [
            (0, express_validator_1.body)("tableNumber").isInt({ min: 1 }).withMessage("El número de mesa debe ser un número entero positivo."),
            validation_1.default.handleInputErrors
        ], this.tableController.createTable.bind(this.tableController));
        this.router.get("/get", auth_1.default.authenticate, permission_1.default.checkPermission("VIEW_TABLES"), this.tableController.getTables.bind(this.tableController));
        this.router.get("/get/:id", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_TABLE"),
        (0, express_validator_1.param)("id").isMongoId().withMessage("ID de mesa inválido."), validation_1.default.handleInputErrors, this.tableController.getTable.bind(this.tableController));
        this.router.put("/update/:id", auth_1.default.authenticate, permission_1.default.checkPermission("UPDATE_TABLE"), [
            (0, express_validator_1.param)("id").isMongoId().withMessage("ID de mesa inválido."),
            (0, express_validator_1.body)("tableNumber").optional().isInt({ min: 1 }).withMessage("El número de mesa debe ser un número entero positivo."),
            validation_1.default.handleInputErrors
        ], this.tableController.updateTable.bind(this.tableController));
        this.router.delete("/delete/:id", auth_1.default.authenticate, permission_1.default.checkPermission("DELETE_TABLE"), (0, express_validator_1.param)("id").isMongoId().withMessage("ID de mesa inválido."), validation_1.default.handleInputErrors, this.tableController.deleteTable.bind(this.tableController));
    }
}
exports.default = new TableRoute().router;
//# sourceMappingURL=tableRoutes.js.map
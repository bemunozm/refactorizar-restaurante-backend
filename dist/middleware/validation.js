"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
class ValidationMiddleware {
    // Maneja los errores de entrada y valida los resultados
    static handleInputErrors(req, res, next) {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        next();
    }
}
exports.default = ValidationMiddleware;
//# sourceMappingURL=validation.js.map
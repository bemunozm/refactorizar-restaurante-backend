"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
exports.corsOptions = {
    origin: function (origin, callback) {
        const whitelist = [process.env.FRONTEND_URL];
        if (whitelist.includes(origin)) {
            return callback(null, true);
        }
        else {
            callback(new Error('ERROR DE CORS'));
        }
    }
};
//# sourceMappingURL=cors.js.map
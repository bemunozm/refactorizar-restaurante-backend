"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Configuración de almacenamiento de multer
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path_1.default.join(__dirname, '../../uploads/images');
        // Verifica si la carpeta existe, si no, la crea
        fs_1.default.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${path_1.default.extname(file.originalname)}`); // Nombre de archivo único
    }
});
// Filtro de archivos para validar tipo de archivo
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
// Límite de tamaño para los archivos (10MB)
const limits = {
    fileSize: 10 * 1024 * 1024, // 10 MB
};
// Inicialización de multer con la configuración anterior
const upload = (0, multer_1.default)({ storage, fileFilter, limits });
exports.default = upload;
//# sourceMappingURL=multer.js.map
"use strict";
// src/constants/permissions.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionGroups = exports.Permissions = void 0;
// Definición de permisos disponibles en el sistema
var Permissions;
(function (Permissions) {
    // Gestión de cuentas
    Permissions["CREATE_USER_ACCOUNT_ADMIN"] = "CREATE_USER_ACCOUNT_ADMIN";
    Permissions["VIEW_USER_PROFILE"] = "VIEW_USER_PROFILE";
    Permissions["UPDATE_USER_PROFILE"] = "UPDATE_USER_PROFILE";
    Permissions["UPDATE_USER_PASSWORD"] = "UPDATE_USER_PASSWORD";
    Permissions["CHECK_USER_PASSWORD"] = "CHECK_USER_PASSWORD";
    // Gestión de usuarios
    Permissions["VIEW_USERS"] = "VIEW_USERS";
    Permissions["VIEW_USER"] = "VIEW_USER";
    Permissions["UPDATE_USER"] = "UPDATE_USER";
    Permissions["DELETE_USER"] = "DELETE_USER";
    // Gestión de categorías
    Permissions["CREATE_CATEGORY"] = "CREATE_CATEGORY";
    Permissions["VIEW_CATEGORIES"] = "VIEW_CATEGORIES";
    Permissions["VIEW_CATEGORY"] = "VIEW_CATEGORY";
    Permissions["UPDATE_CATEGORY"] = "UPDATE_CATEGORY";
    Permissions["DELETE_CATEGORY"] = "DELETE_CATEGORY";
    // Gestión de productos
    Permissions["CREATE_PRODUCT"] = "CREATE_PRODUCT";
    Permissions["VIEW_PRODUCTS"] = "VIEW_PRODUCTS";
    Permissions["VIEW_PRODUCT"] = "VIEW_PRODUCT";
    Permissions["UPDATE_PRODUCT"] = "UPDATE_PRODUCT";
    Permissions["DELETE_PRODUCT"] = "DELETE_PRODUCT";
    // Gestión de sesiones
    Permissions["CREATE_SESSION"] = "CREATE_SESSION";
    Permissions["VIEW_SESSIONS"] = "VIEW_SESSIONS";
    Permissions["VIEW_SESSION"] = "VIEW_SESSION";
    Permissions["UPDATE_SESSION"] = "UPDATE_SESSION";
    Permissions["DELETE_SESSION"] = "DELETE_SESSION";
    Permissions["ADD_GUEST_TO_SESSION"] = "ADD_GUEST_TO_SESSION";
    Permissions["TRANSFER_GUEST_ORDERS"] = "TRANSFER_GUEST_ORDERS";
    Permissions["CHECK_SESSION"] = "CHECK_SESSION";
    // Gestión de roles
    Permissions["CREATE_ROLE"] = "CREATE_ROLE";
    Permissions["VIEW_ROLES"] = "VIEW_ROLES";
    Permissions["VIEW_ROLE"] = "VIEW_ROLE";
    Permissions["UPDATE_ROLE"] = "UPDATE_ROLE";
    Permissions["DELETE_ROLE"] = "DELETE_ROLE";
    // Gestión de transacciones
    Permissions["CREATE_TRANSACTION"] = "CREATE_TRANSACTION";
    Permissions["VIEW_TRANSACTIONS"] = "VIEW_TRANSACTIONS";
    Permissions["VIEW_TRANSACTION"] = "VIEW_TRANSACTION";
    Permissions["UPDATE_TRANSACTION"] = "UPDATE_TRANSACTION";
    Permissions["DELETE_TRANSACTION"] = "DELETE_TRANSACTION";
    // Gestión de pedidos
    Permissions["CREATE_ORDER"] = "CREATE_ORDER";
    Permissions["VIEW_ORDERS"] = "VIEW_ORDERS";
    Permissions["VIEW_ORDER"] = "VIEW_ORDER";
    Permissions["UPDATE_ORDER"] = "UPDATE_ORDER";
    Permissions["DELETE_ORDER"] = "DELETE_ORDER";
    // Gestión de asistencia
    Permissions["CREATE_ASSISTANCE"] = "CREATE_ASSISTANCE";
    Permissions["UPDATE_ASSISTANCE_STATUS"] = "UPDATE_ASSISTANCE_STATUS";
    Permissions["ASSIGN_ASSISTANCE"] = "ASSIGN_ASSISTANCE";
    Permissions["COMPLETE_ASSISTANCE"] = "COMPLETE_ASSISTANCE";
    Permissions["CONFIRM_TRANSACTION"] = "CONFIRM_TRANSACTION";
    Permissions["DECLINE_TRANSACTION"] = "DECLINE_TRANSACTION";
    Permissions["VIEW_ASSISTANCES"] = "VIEW_ASSISTANCES";
    // Gestión de descuentos
    Permissions["CREATE_DISCOUNT"] = "CREATE_DISCOUNT";
    Permissions["VIEW_DISCOUNT"] = "VIEW_DISCOUNT";
    Permissions["UPDATE_DISCOUNT"] = "UPDATE_DISCOUNT";
    Permissions["DELETE_DISCOUNT"] = "DELETE_DISCOUNT";
    // Gestión de entregas
    Permissions["CREATE_DELIVERY"] = "CREATE_DELIVERY";
    Permissions["VIEW_DELIVERIES"] = "VIEW_DELIVERIES";
    Permissions["UPDATE_DELIVERY_STATUS"] = "UPDATE_DELIVERY_STATUS";
    // Gestión de estadísticas
    Permissions["VIEW_STATISTICS"] = "VIEW_STATISTICS";
})(Permissions || (exports.Permissions = Permissions = {}));
// Agrupación de permisos en categorías para su uso en el frontend
exports.permissionGroups = {
    "Gestión de Cuentas": [
        Permissions.VIEW_USER_PROFILE,
        Permissions.UPDATE_USER_PROFILE,
        Permissions.UPDATE_USER_PASSWORD,
        Permissions.CHECK_USER_PASSWORD,
    ],
    "Gestión de Usuarios": [
        Permissions.CREATE_USER_ACCOUNT_ADMIN,
        Permissions.VIEW_USERS,
        Permissions.VIEW_USER,
        Permissions.UPDATE_USER,
        Permissions.DELETE_USER,
    ],
    "Gestión de Categorías": [
        Permissions.CREATE_CATEGORY,
        Permissions.VIEW_CATEGORIES,
        Permissions.VIEW_CATEGORY,
        Permissions.UPDATE_CATEGORY,
        Permissions.DELETE_CATEGORY,
    ],
    "Gestión de Productos": [
        Permissions.CREATE_PRODUCT,
        Permissions.VIEW_PRODUCTS,
        Permissions.VIEW_PRODUCT,
        Permissions.UPDATE_PRODUCT,
        Permissions.DELETE_PRODUCT,
    ],
    "Gestión de Sesiones": [
        Permissions.CREATE_SESSION,
        Permissions.VIEW_SESSIONS,
        Permissions.VIEW_SESSION,
        Permissions.UPDATE_SESSION,
        Permissions.DELETE_SESSION,
        Permissions.ADD_GUEST_TO_SESSION,
        Permissions.TRANSFER_GUEST_ORDERS,
        Permissions.CHECK_SESSION,
    ],
    "Gestión de Roles": [
        Permissions.CREATE_ROLE,
        Permissions.VIEW_ROLES,
        Permissions.VIEW_ROLE,
        Permissions.UPDATE_ROLE,
        Permissions.DELETE_ROLE,
    ],
    "Gestión de Transacciones": [
        Permissions.CREATE_TRANSACTION,
        Permissions.VIEW_TRANSACTIONS,
        Permissions.VIEW_TRANSACTION,
        Permissions.UPDATE_TRANSACTION,
        Permissions.DELETE_TRANSACTION,
    ],
    "Gestión de Pedidos": [
        Permissions.CREATE_ORDER,
        Permissions.VIEW_ORDERS,
        Permissions.VIEW_ORDER,
        Permissions.UPDATE_ORDER,
        Permissions.DELETE_ORDER,
    ],
    "Gestión de Asistencia": [
        Permissions.CREATE_ASSISTANCE,
        Permissions.UPDATE_ASSISTANCE_STATUS,
        Permissions.ASSIGN_ASSISTANCE,
        Permissions.COMPLETE_ASSISTANCE,
        Permissions.CONFIRM_TRANSACTION,
        Permissions.DECLINE_TRANSACTION,
        Permissions.VIEW_ASSISTANCES,
    ],
    "Gestión de Descuentos": [
        Permissions.CREATE_DISCOUNT,
        Permissions.VIEW_DISCOUNT,
        Permissions.UPDATE_DISCOUNT,
        Permissions.DELETE_DISCOUNT,
    ],
    "Gestión de Entregas": [
        Permissions.CREATE_DELIVERY,
        Permissions.VIEW_DELIVERIES,
        Permissions.UPDATE_DELIVERY_STATUS,
    ],
    "Gestión de Estadísticas": [
        Permissions.VIEW_STATISTICS,
    ],
};
//# sourceMappingURL=permissions.js.map
// src/constants/permissions.ts

// Definición de permisos disponibles en el sistema
export enum Permissions {
  // Gestión de cuentas
  CREATE_USER_ACCOUNT_ADMIN = "CREATE_USER_ACCOUNT_ADMIN",
  VIEW_USER_PROFILE = "VIEW_USER_PROFILE",
  UPDATE_USER_PROFILE = "UPDATE_USER_PROFILE",
  UPDATE_USER_PASSWORD = "UPDATE_USER_PASSWORD",
  CHECK_USER_PASSWORD = "CHECK_USER_PASSWORD",

  // Gestión de usuarios
  VIEW_USERS = "VIEW_USERS",
  VIEW_USER = "VIEW_USER",
  UPDATE_USER = "UPDATE_USER",
  DELETE_USER = "DELETE_USER",

  // Gestión de categorías
  CREATE_CATEGORY = "CREATE_CATEGORY",
  VIEW_CATEGORIES = "VIEW_CATEGORIES",
  VIEW_CATEGORY = "VIEW_CATEGORY",
  UPDATE_CATEGORY = "UPDATE_CATEGORY",
  DELETE_CATEGORY = "DELETE_CATEGORY",

  // Gestión de productos
  CREATE_PRODUCT = "CREATE_PRODUCT",
  VIEW_PRODUCTS = "VIEW_PRODUCTS",
  VIEW_PRODUCT = "VIEW_PRODUCT",
  UPDATE_PRODUCT = "UPDATE_PRODUCT",
  DELETE_PRODUCT = "DELETE_PRODUCT",

  // Gestión de sesiones
  CREATE_SESSION = "CREATE_SESSION",
  VIEW_SESSIONS = "VIEW_SESSIONS",
  VIEW_SESSION = "VIEW_SESSION",
  UPDATE_SESSION = "UPDATE_SESSION",
  DELETE_SESSION = "DELETE_SESSION",
  ADD_GUEST_TO_SESSION = "ADD_GUEST_TO_SESSION",
  TRANSFER_GUEST_ORDERS = "TRANSFER_GUEST_ORDERS",
  CHECK_SESSION = "CHECK_SESSION",

  // Gestión de roles
  CREATE_ROLE = "CREATE_ROLE",
  VIEW_ROLES = "VIEW_ROLES",
  VIEW_ROLE = "VIEW_ROLE",
  UPDATE_ROLE = "UPDATE_ROLE",
  DELETE_ROLE = "DELETE_ROLE",

  // Gestión de transacciones
  CREATE_TRANSACTION = "CREATE_TRANSACTION",
  VIEW_TRANSACTIONS = "VIEW_TRANSACTIONS",
  VIEW_TRANSACTION = "VIEW_TRANSACTION",
  UPDATE_TRANSACTION = "UPDATE_TRANSACTION",
  DELETE_TRANSACTION = "DELETE_TRANSACTION",

  // Gestión de pedidos
  CREATE_ORDER = "CREATE_ORDER",
  VIEW_ORDERS = "VIEW_ORDERS",
  VIEW_ORDER = "VIEW_ORDER",
  UPDATE_ORDER = "UPDATE_ORDER",
  DELETE_ORDER = "DELETE_ORDER",

  // Gestión de asistencia
  CREATE_ASSISTANCE = "CREATE_ASSISTANCE",
  UPDATE_ASSISTANCE_STATUS = "UPDATE_ASSISTANCE_STATUS",
  ASSIGN_ASSISTANCE = "ASSIGN_ASSISTANCE",
  COMPLETE_ASSISTANCE = "COMPLETE_ASSISTANCE",
  CONFIRM_TRANSACTION = "CONFIRM_TRANSACTION",
  DECLINE_TRANSACTION = "DECLINE_TRANSACTION",
  VIEW_ASSISTANCES = "VIEW_ASSISTANCES",

  // Gestión de descuentos
  CREATE_DISCOUNT = "CREATE_DISCOUNT",
  VIEW_DISCOUNT = "VIEW_DISCOUNT",
  UPDATE_DISCOUNT = "UPDATE_DISCOUNT",
  DELETE_DISCOUNT = "DELETE_DISCOUNT",

  // Gestión de entregas
  CREATE_DELIVERY = "CREATE_DELIVERY",
  VIEW_DELIVERIES = "VIEW_DELIVERIES",
  UPDATE_DELIVERY_STATUS = "UPDATE_DELIVERY_STATUS",

  // Gestión de estadísticas
  VIEW_STATISTICS = "VIEW_STATISTICS",
}

// Agrupación de permisos en categorías para su uso en el frontend
export const permissionGroups = {
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

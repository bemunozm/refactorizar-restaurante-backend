"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupDefaultRolesService = void 0;
const RoleRepository_1 = require("../repositories/RoleRepository");
const defaultRoles = [
    {
        name: "Administrador",
        permissions: [
            'CREATE_USER_ACCOUNT_ADMIN',
            'VIEW_USER_PROFILE',
            'UPDATE_USER_PROFILE',
            'UPDATE_USER_PASSWORD',
            'CHECK_USER_PASSWORD',
            'CREATE_CATEGORY',
            'VIEW_CATEGORIES',
            'VIEW_CATEGORY',
            'UPDATE_CATEGORY',
            'DELETE_CATEGORY',
            'CREATE_INGREDIENT',
            'VIEW_INGREDIENTS',
            'VIEW_INGREDIENT',
            'UPDATE_INGREDIENT',
            'DELETE_INGREDIENT',
            'CREATE_PRODUCT',
            'VIEW_PRODUCTS',
            'VIEW_PRODUCT',
            'UPDATE_PRODUCT',
            'DELETE_PRODUCT',
            'VIEW_SESSIONS',
            'VIEW_SESSION',
            'UPDATE_SESSION',
            'DELETE_SESSION',
            'CREATE_TABLE',
            'VIEW_TABLES',
            'VIEW_TABLE',
            'UPDATE_TABLE',
            'DELETE_TABLE',
            "CREATE_ROLE",
            "VIEW_ROLES",
            "VIEW_ROLE",
            "UPDATE_ROLE",
            "DELETE_ROLE",
            "VIEW_USER",
            "UPDATE_USER",
            "DELETE_USER",
        ],
    },
    {
        name: "Usuario",
        permissions: [
            "VIEW_USER_PROFILE",
            "UPDATE_USER_PROFILE",
            "UPDATE_USER_PASSWORD",
            "CHECK_USER_PASSWORD"
        ],
    },
    {
        name: "Cocinero",
        permissions: [
            'CREATE_USER_ACCOUNT_ADMIN',
            'VIEW_USER_PROFILE',
            'UPDATE_USER_PROFILE',
            'UPDATE_USER_PASSWORD',
            'CHECK_USER_PASSWORD',
            'CREATE_CATEGORY',
            'VIEW_CATEGORIES',
            'VIEW_CATEGORY',
            'UPDATE_CATEGORY',
            'DELETE_CATEGORY',
            'CREATE_INGREDIENT',
            'VIEW_INGREDIENTS',
            'VIEW_INGREDIENT',
            'UPDATE_INGREDIENT',
            'DELETE_INGREDIENT',
            'CREATE_PRODUCT',
            'VIEW_PRODUCTS',
            'VIEW_PRODUCT',
            'UPDATE_PRODUCT',
            'DELETE_PRODUCT',
            'VIEW_SESSIONS',
            'VIEW_SESSION',
            'UPDATE_SESSION',
            'DELETE_SESSION',
            'CREATE_TABLE',
            'VIEW_TABLES',
            'VIEW_TABLE',
            'UPDATE_TABLE',
            'DELETE_TABLE',
            "CREATE_ROLE",
            "VIEW_ROLES",
            "VIEW_ROLE",
            "UPDATE_ROLE",
            "DELETE_ROLE",
            "VIEW_USER",
            "UPDATE_USER",
            "DELETE_USER",
        ],
    },
    {
        name: "Garzon",
        permissions: [
            'CREATE_USER_ACCOUNT_ADMIN',
            'VIEW_USER_PROFILE',
            'UPDATE_USER_PROFILE',
            'UPDATE_USER_PASSWORD',
            'CHECK_USER_PASSWORD',
            'CREATE_CATEGORY',
            'VIEW_CATEGORIES',
            'VIEW_CATEGORY',
            'UPDATE_CATEGORY',
            'DELETE_CATEGORY',
            'CREATE_INGREDIENT',
            'VIEW_INGREDIENTS',
            'VIEW_INGREDIENT',
            'UPDATE_INGREDIENT',
            'DELETE_INGREDIENT',
            'CREATE_PRODUCT',
            'VIEW_PRODUCTS',
            'VIEW_PRODUCT',
            'UPDATE_PRODUCT',
            'DELETE_PRODUCT',
            'VIEW_SESSIONS',
            'VIEW_SESSION',
            'UPDATE_SESSION',
            'DELETE_SESSION',
            'CREATE_TABLE',
            'VIEW_TABLES',
            'VIEW_TABLE',
            'UPDATE_TABLE',
            'DELETE_TABLE',
            "CREATE_ROLE",
            "VIEW_ROLES",
            "VIEW_ROLE",
            "UPDATE_ROLE",
            "DELETE_ROLE",
            "VIEW_USER",
            "UPDATE_USER",
            "DELETE_USER",
        ],
    },
    {
        name: "Repartidor",
        permissions: [
            'CREATE_USER_ACCOUNT_ADMIN',
            'VIEW_USER_PROFILE',
            'UPDATE_USER_PROFILE',
            'UPDATE_USER_PASSWORD',
            'CHECK_USER_PASSWORD',
            'CREATE_CATEGORY',
            'VIEW_CATEGORIES',
            'VIEW_CATEGORY',
            'UPDATE_CATEGORY',
            'DELETE_CATEGORY',
            'CREATE_INGREDIENT',
            'VIEW_INGREDIENTS',
            'VIEW_INGREDIENT',
            'UPDATE_INGREDIENT',
            'DELETE_INGREDIENT',
            'CREATE_PRODUCT',
            'VIEW_PRODUCTS',
            'VIEW_PRODUCT',
            'UPDATE_PRODUCT',
            'DELETE_PRODUCT',
            'VIEW_SESSIONS',
            'VIEW_SESSION',
            'UPDATE_SESSION',
            'DELETE_SESSION',
            'CREATE_TABLE',
            'VIEW_TABLES',
            'VIEW_TABLE',
            'UPDATE_TABLE',
            'DELETE_TABLE',
            "CREATE_ROLE",
            "VIEW_ROLES",
            "VIEW_ROLE",
            "UPDATE_ROLE",
            "DELETE_ROLE",
            "VIEW_USER",
            "UPDATE_USER",
            "DELETE_USER",
        ],
    },
];
class SetupDefaultRolesService {
    rolesData = defaultRoles;
    roleRepository;
    constructor() {
        this.roleRepository = new RoleRepository_1.RoleRepository();
    }
    async setupDefaultRoles() {
        try {
            for (const roleData of this.rolesData) {
                const existingRole = await this.roleRepository.findOne({ name: roleData.name });
                if (!existingRole) {
                    await this.roleRepository.create(roleData);
                    console.log(`Rol ${roleData.name} creado.`);
                }
                else {
                    console.log(`Rol ${roleData.name} ya existe.`);
                }
            }
        }
        catch (error) {
            console.error("Error configurando roles por defecto:", error);
        }
    }
}
exports.SetupDefaultRolesService = SetupDefaultRolesService;
//# sourceMappingURL=setupRoles.js.map
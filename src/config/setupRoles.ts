import { RoleRepository } from "../repositories/RoleRepository";

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
      'CREATE_PRODUCT',
      'VIEW_PRODUCTS',
      'VIEW_PRODUCT',
      'UPDATE_PRODUCT',
      'DELETE_PRODUCT',
      'CREATE_SESSION',
      'VIEW_SESSIONS',
      'VIEW_SESSION',
      'UPDATE_SESSION',
      'DELETE_SESSION',
      'ADD_GUEST_TO_SESSION',
      'TRANSFER_GUEST_ORDERS',
      'CHECK_SESSION',
      'CREATE_ROLE',
      'VIEW_ROLES',
      'VIEW_ROLE',
      'UPDATE_ROLE',
      'DELETE_ROLE',
      'CREATE_TRANSACTION',
      'VIEW_TRANSACTIONS',
      'VIEW_TRANSACTION',
      'UPDATE_TRANSACTION',
      'DELETE_TRANSACTION',
      'CREATE_ORDER',
      'VIEW_ORDERS',
      'VIEW_ORDER',
      'UPDATE_ORDER',
      'DELETE_ORDER',
      'CREATE_ASSISTANCE',
      'UPDATE_ASSISTANCE_STATUS',
      'ASSIGN_ASSISTANCE',
      'COMPLETE_ASSISTANCE',
      'CONFIRM_TRANSACTION',
      'DECLINE_TRANSACTION',
      'VIEW_ASSISTANCES',
      'CREATE_DISCOUNT',
      'VIEW_DISCOUNT',
      'UPDATE_DISCOUNT',
      'DELETE_DISCOUNT',
      'CREATE_DELIVERY',
      'VIEW_DELIVERIES',
      'UPDATE_DELIVERY_STATUS',
      'VIEW_STATISTICS',
      'VIEW_TABLES',
      'VIEW_TABLE',
      'UPDATE_TABLE',
      'DELETE_TABLE',
      'VIEW_KITCHEN',
      'VIEW_WAITER',
      'VIEW_DASHBOARD',
      'VIEW_USERS',
      'VIEW_USER',
      'UPDATE_USER',
      'UPDATE_USER_PASSWORD',
      'CHECK_USER_PASSWORD',
      'UPDATE_ITEM_STATUS',
      'UPDATE_ORDER_ITEM_STATUS',
    ],
  },
  {
    name: "Cocinero",
    permissions: [
      'VIEW_USER_PROFILE',
      'UPDATE_USER_PROFILE',
      'UPDATE_USER_PASSWORD',
      'CHECK_USER_PASSWORD',
      'VIEW_CATEGORIES',
      'VIEW_CATEGORY',
      'VIEW_PRODUCTS',
      'VIEW_PRODUCT',
      'VIEW_SESSIONS',
      'VIEW_SESSION',
      'VIEW_TABLES',
      'VIEW_TABLE',
      'VIEW_ROLES',
      'VIEW_USER',
      'UPDATE_USER',
      'VIEW_ORDERS',
      'VIEW_ORDER',
      'CREATE_ORDER',
      'UPDATE_ORDER',
      'CREATE_ASSISTANCE',
      'COMPLETE_ASSISTANCE',
      'VIEW_ASSISTANCES',
      'VIEW_KITCHEN',
      'UPDATE_ORDER_ITEM_STATUS',
      'UPDATE_ITEM_STATUS',
    ],
  },
  {
    name: "Garzon",
    permissions: [
      'VIEW_USER_PROFILE',
      'UPDATE_USER_PROFILE',
      'UPDATE_USER_PASSWORD',
      'CHECK_USER_PASSWORD',
      'VIEW_CATEGORIES',
      'VIEW_CATEGORY',
      'VIEW_PRODUCTS',
      'VIEW_PRODUCT',
      'VIEW_SESSIONS',
      'VIEW_SESSION',
      'VIEW_TABLES',
      'VIEW_TABLE',
      'VIEW_ROLES',
      'VIEW_USER',
      'UPDATE_USER',
      'VIEW_ORDERS',
      'VIEW_ORDER',
      'CREATE_ORDER',
      'UPDATE_ORDER',
      'CREATE_ASSISTANCE',
      'COMPLETE_ASSISTANCE',
      'VIEW_ASSISTANCES',
      'VIEW_WAITER',
      'UPDATE_ORDER_ITEM_STATUS',
      'UPDATE_ITEM_STATUS',
      'CREATE_TABLE',
      'VIEW_TABLES',
      'VIEW_TABLE',
      'UPDATE_TABLE',
      'DELETE_TABLE',
      'CREATE_ASSISTANCE',
      'COMPLETE_ASSISTANCE',
      'VIEW_ASSISTANCES',
    ],
  },
  {
    name: "Repartidor",
    permissions: [
      'VIEW_USER_PROFILE',
      'UPDATE_USER_PROFILE',
      'UPDATE_USER_PASSWORD',
      'CHECK_USER_PASSWORD',
      'VIEW_ORDERS',
      'VIEW_ORDER',
      'CREATE_ORDER',
      'UPDATE_ORDER',
      'CREATE_ASSISTANCE',
      'COMPLETE_ASSISTANCE',
      'VIEW_ASSISTANCES',
      'CREATE_DELIVERY',
      'VIEW_DELIVERIES',
      'UPDATE_DELIVERY_STATUS',
    ],
  },
  {
    name: "Usuario",
    permissions: [
      'VIEW_USER_PROFILE',
      'UPDATE_USER_PROFILE',
      'VIEW_ORDERS',
      'VIEW_ORDER',
      'VIEW_USER',
      'UPDATE_USER',
      'VIEW_USER_ORDERS',
    ],
  },
];

export class SetupDefaultRolesService {
    private readonly rolesData = defaultRoles;
    private roleRepository: RoleRepository;

    constructor() {
        this.roleRepository = new RoleRepository();
    }

    public async setupDefaultRoles(): Promise<void> {
        try {
            for (const roleData of this.rolesData) {
                const existingRole = await this.roleRepository.findOne({ name: roleData.name });
                
                if (!existingRole) {
                    await this.roleRepository.create(roleData);
                    console.log(`Rol ${roleData.name} creado.`);
                } else {
                    console.log(`Rol ${roleData.name} ya existe.`);
                }
            }
        } catch (error) {
            console.error("Error configurando roles por defecto:", error);
        }
    }
}

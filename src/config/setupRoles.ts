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
      "DELETE_ROLE"
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

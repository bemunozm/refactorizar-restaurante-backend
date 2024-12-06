declare class Database {
    private static instance;
    private readonly URI;
    private setupDefaultRolesService;
    private constructor();
    static getInstance(): Database;
    private connect;
    private initializeDefaultRoles;
}
export default Database;

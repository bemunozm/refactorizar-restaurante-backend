import { Request, Response } from 'express';
import { RoleService } from '../services/RoleService';

export class RoleController {
    private readonly roleService: RoleService;

    constructor() {
        this.roleService = new RoleService();
    }

    public getPermissions(req: Request, res: Response): Response {
        try {
            const permissions = this.roleService.getPermissions();
            return res.status(200).json(permissions);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener la lista de permisos' });
        }
    }

    public async createRole(req: Request, res: Response): Promise<Response> {
        try {
            const { name, permissions } = req.body;
            const role = await this.roleService.createRole({ name, permissions });
            return res.status(201).json(role);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al crear el rol' });
        }
    }

    public async getRoles(req: Request, res: Response): Promise<Response> {
        try {
            const roles = await this.roleService.getRoles();
            return res.status(200).json(roles);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener los roles' });
        }
    }

    public async getRoleById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const role = await this.roleService.getRoleById(id);
            return role
                ? res.status(200).json(role)
                : res.status(404).json({ error: 'Rol no encontrado' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener el rol' });
        }
    }

    public async updateRole(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { name, permissions } = req.body;
            const result = await this.roleService.updateRole(id, { name, permissions });
            return result
                ? res.status(200).json({ message: 'Rol actualizado correctamente' })
                : res.status(403).json({ message: 'No se puede modificar este rol por defecto' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al actualizar el rol', error });
        }
    }

    public async deleteRole(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const result = await this.roleService.deleteRole(id);
            return result
                ? res.status(200).json({ message: 'Rol eliminado correctamente' })
                : res.status(404).json({ message: 'Rol no encontrado' });
        } catch (error: any) {
            if (error.message === 'No se puede eliminar el rol porque tiene usuarios asociados') {
                return res.status(400).json({ message: error.message });
            }
            console.error(error);
            return res.status(500).json({ message: 'Error al eliminar el rol', error });
        }
    }
}

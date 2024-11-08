import { UserDocument } from "../interfaces/UserInterface";
import { GenericRepository } from "./GenericRepository";
import { User } from "../models/User"; // Importamos la clase User con el modelo encapsulado
import UserModel from "../schemas/UserSchema";

export class UserRepository extends GenericRepository<UserDocument> {
  private static mongooseModel = UserModel;

  constructor() {
    super(UserRepository.mongooseModel);
  }

  // Métodos específicos de UserRepository pueden añadirse aquí
  public async findByEmail(email: string): Promise<Partial<UserDocument> | null> {
    try {
      const userModel = await this.model.findOne({ email }).populate("roles").exec();
      if (userModel){
        return {
          userId: userModel.id,
          name: userModel.name,
          lastname: userModel.lastname,
          email: userModel.email,
          password: userModel.password,
          confirmed: userModel.confirmed,
          roles: userModel.roles
        }
      } else {
        return null
      }
    } catch (error) {
        console.error(`Error al buscar por email: ${error}`);
        throw new Error("Error al buscar el documento por email");
        }
  }

  public async getAllUsers (populate?: string | string[]) {
    try {
      const userModel = await super.findAll(populate);
      if (userModel){
        return userModel.map(user => {
          return {
            userId: user.id,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            password: user.password,
            confirmed: user.confirmed,
            roles: user.roles
          }
        })	
      } else {
        return null
      }
    } catch (error) {
        console.error(`Error al buscar por email: ${error}`);
        throw new Error("Error al buscar el documento por email");
        }
  }

  // Método para guardar una instancia de User en la base de datos
  public async save(user: User): Promise<UserDocument> {
    try {
      const assignedRoleIds = user.roles.map(role => role.roleId);

      const userDocument = new this.model({
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        password: user.password,
        confirmed: user.confirmed,
        roles: assignedRoleIds,
      });
      return await userDocument.save();
    } catch (error) {
      console.error(`Error al guardar el usuario: ${error}`);
      throw new Error("Error al guardar el documento del usuario");
    }
  }
}

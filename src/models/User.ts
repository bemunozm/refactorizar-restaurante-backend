import mongoose, { Document, Model } from "mongoose";
import { UserDocument, UserInterface } from "../interfaces/UserInterface";
import { UserSchema } from "../schemas/UserSchema";
import { checkPassword, hashPassword } from "../utils/auth";
import { UserRepository } from "../repositories/UserRepository";

export class User implements UserInterface {
  public userId: string;
  public name: string;
  public lastname: string;
  public email: string;
  public password: string;
  public confirmed: boolean;
  public roles: UserInterface["roles"];
  private userRepository: UserRepository;

  constructor(data: UserInterface) {
    this.name = data.name || '';
    this.lastname = data.lastname || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.confirmed = data.confirmed || false;
    this.roles = data.roles || [];
    this.userRepository = new UserRepository()
  }

  //Verificar si existe
  public async doesThatExist(){
    const userData = await this.userRepository.findByEmail(this.email);
    
    if (userData) {
      this.userId = userData.userId;
      this.name = userData.name;
      this.lastname = userData.lastname;
      this.email = userData.email;
      this.password = userData.password;
      this.confirmed = userData.confirmed;
      this.roles = userData.roles;
      return true;
    }

    return false;
  }

  //Encriptar contraseña
  public async hashPassword(){
    const hashedPassword = await hashPassword(this.password)
    this.password = hashedPassword
  }

  //Verificar contraseña
  public async checkPassword(password: string){
    return await checkPassword(password, this.password)
  }

  //Guardar en la base de datos
  public async save(): Promise<void> {
    const savedUser = await this.userRepository.save(this);
    this.userId = savedUser.userId; // Actualiza el userId con el ID generado por Mongoose
  }
}

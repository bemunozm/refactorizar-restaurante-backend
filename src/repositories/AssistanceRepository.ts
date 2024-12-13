import { GenericRepository } from './GenericRepository';
import AssistanceModel from '../schemas/AssistanceSchema';
import { AssistanceDocument } from '../interfaces/AssistanceInterface';

export class AssistanceRepository extends GenericRepository<AssistanceDocument> {
  private static mongooseModel = AssistanceModel;

  constructor() {
    super(AssistanceRepository.mongooseModel);
  }

  /**
   * Guarda una nueva instancia de Assistance en la base de datos.
   * @param assistance Datos de la asistencia.
   * @returns Documento de Assistance.
   */
  public async save(assistance): Promise<AssistanceDocument> {
    try {
      const assistanceDocument = new this.model({
        session: assistance.session,
        user: assistance.user || undefined,
        type: assistance.type,
        status: assistance.status,
        transactionToken: assistance.transactionToken,
        itemId: assistance.itemId,
        itemDetails: assistance.itemDetails,
      });
      return await assistanceDocument.save();
    } catch (error) {
      console.error(`Error al guardar la asistencia: ${error}`);
      throw new Error('Error al guardar la asistencia');
    }
  }

  public async update(id: string, data: any): Promise<AssistanceDocument> {
    try {
        
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
        console.error(`Error al actualizar la asistencia: ${error}`);
        throw new Error('Error al actualizar la asistencia');
        }
  }

  /**
   * Encuentra asistencias relacionadas con una sesión específica.
   * @param sessionId ID de la sesión.
   * @returns Lista de asistencias.
   */
  public async findBySessionId(sessionId: string): Promise<AssistanceDocument[]> {
    try {
      return await this.model.find({ session: sessionId });
    } catch (error) {
      console.error(`Error al buscar asistencias por sesión: ${error}`);
      throw new Error('Error al buscar asistencias por sesión');
    }
  }

  public async findByItemId(itemId: string): Promise<AssistanceDocument> {
    try {
      return await this.model.findOne({ itemId });
    } catch (error) {
      console.error(`Error al buscar asistencias por item: ${error}`);
      throw new Error('Error al buscar asistencias por item');
    }
  }

  /**
   * Encuentra asistencias asignadas a un usuario específico.
   * @param userId ID del usuario.
   * @returns Lista de asistencias.
   */
  public async findByUserId(userId: string): Promise<AssistanceDocument[]> {
    try {
      return await this.model.find({ user: userId });
    } catch (error) {
      console.error(`Error al buscar asistencias por usuario: ${error}`);
      throw new Error('Error al buscar asistencias por usuario');
    }
  }

  /**
   * Encuentra asistencias con un estado específico.
   * @param status Estado de la asistencia ('Pendiente', 'En Progreso', 'Completado').
   * @returns Lista de asistencias.
   */
  public async findByStatus(status: 'Pendiente' | 'En Progreso' | 'Completado'): Promise<AssistanceDocument[]> {
    try {
      return await this.model.find({ status });
    } catch (error) {
      console.error(`Error al buscar asistencias por estado: ${error}`);
      throw new Error('Error al buscar asistencias por estado');
    }
  }

  /**
   * Actualiza el estado de una asistencia.
   * @param assistanceId ID de la asistencia.
   * @param status Nuevo estado de la asistencia.
   * @returns Documento de Assistance actualizado.
   */
  public async updateStatus(assistanceId: string, status: 'Pendiente' | 'En Progreso' | 'Completado'): Promise<AssistanceDocument | null> {
    try {
      return await this.model.findByIdAndUpdate(
        assistanceId,
        { status },
        { new: true }
      );
    } catch (error) {
      console.error(`Error al actualizar el estado de la asistencia: ${error}`);
      throw new Error('Error al actualizar el estado de la asistencia');
    }
  }

  /**
   * Encuentra todas las asistencias pendientes.
   * @returns Lista de asistencias pendientes.
   */
  public async findPendingAssistances(): Promise<AssistanceDocument[]> {
    return this.findByStatus('Pendiente');
  }

  /**
   * Encuentra todas las asistencias completadas.
   * @returns Lista de asistencias completadas.
   */
  public async findCompletedAssistances(): Promise<AssistanceDocument[]> {
    return this.findByStatus('Completado');
  }
  

  //Encuentra todas las asitencias con status diferente a Completado
    public async getAllAssistance(): Promise<AssistanceDocument[]> {
        try {
            return await this.model.find({ status: { $ne: 'Completado' } });
        } catch (error) {
            console.error(`Error al buscar asistencias no completadas y sin usuario: ${error}`);
            throw new Error('Error al buscar asistencias no completadas y sin usuario');
        }
    }

    public async getAssistancesBetweenDates(startDate: Date, endDate: Date): Promise<AssistanceDocument[]> {
        return await this.model.find({ createdAt: { $gte: startDate, $lte: endDate } });
    }
}

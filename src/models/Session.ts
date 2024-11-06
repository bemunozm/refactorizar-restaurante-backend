import mongoose, { Model } from "mongoose";
import { SessionDocument, SessionInterface } from "../interfaces/SessionInterface";
import { SessionSchema } from "../schemas/SessionSchema";
import { GuestInterface } from "../interfaces/GuestInterface";
import { SessionRepository } from "../repositories/SessionRepository";

export class Session implements SessionInterface {
    public sessionId?: string;
    public tableId: string;
    public guests: GuestInterface[];
    public status: 'Activa' | 'Pagando' | 'Finalizada';
    private sessionRepository: SessionRepository;
  
    constructor(data: SessionInterface) {
      this.sessionId = data.sessionId.toString();
      this.tableId = data.tableId.toString();
      this.guests = data.guests;
      this.status = data.status;
      this.sessionRepository = new SessionRepository();
    }

    public async findById(): Promise<Session | null> {
      try {
        const session = await this.sessionRepository.findBySessionId(this.sessionId);
        if (session) {
          this.sessionId = session.sessionId;
          this.tableId = session.tableId.toString();
          this.guests = session.guests;
          this.status = session.status;
          return this;
        }
        return null;
      } catch (error) {
        console.error(`Error encontrando sessiones por la ID: ${this.sessionId}`, error);
        return null;
      }
    }

    public async save() {
        const savedSession = await this.sessionRepository.save(this);
        this.sessionId = savedSession.sessionId;
        return this;
    }
}
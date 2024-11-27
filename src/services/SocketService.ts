import { Server } from "socket.io";

export class SocketService {
  private static io: Server;

  public static init(io: Server) {
    this.io = io;
  }

  public static emit(event: string, data: any) {
    if (this.io) {
      this.io.emit(event, data);
    }
  }

  public static to(room: string, event: string, data: any) {
    if (this.io) {
      this.io.to(room).emit(event, data);
    }
  }
}

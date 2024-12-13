import { Server } from "socket.io";
export declare class SocketService {
    private static io;
    static init(io: Server): void;
    static emit(event: string, data: any): void;
    static to(room: string, event: string, data: any): void;
}

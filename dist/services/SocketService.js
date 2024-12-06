"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
class SocketService {
    static io;
    static init(io) {
        this.io = io;
    }
    static emit(event, data) {
        if (this.io) {
            this.io.emit(event, data);
        }
    }
    static to(room, event, data) {
        if (this.io) {
            this.io.to(room).emit(event, data);
        }
    }
}
exports.SocketService = SocketService;
//# sourceMappingURL=SocketService.js.map
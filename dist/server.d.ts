import { Application } from "express";
declare class App {
    readonly app: Application;
    private readonly port;
    private server;
    private io;
    constructor();
    private init;
    private initConfig;
    private initMiddlewares;
    private initRoutes;
    private initSockets;
    listen(): void;
    unitaryTest(): Promise<void>;
}
export default App;

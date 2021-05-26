import { Server } from 'http';
import { Injectable } from 'injection-js';
import { server as WebSocketServer } from 'websocket';

@Injectable()
class WebSocketServerWrap extends WebSocketServer {
    constructor(public server: Server) {
        super({
            httpServer: server,
            autoAcceptConnections: true
        });
    }
}

export default WebSocketServerWrap;

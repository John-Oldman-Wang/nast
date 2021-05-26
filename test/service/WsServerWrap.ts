import { Server } from 'http';
import { Injectable } from 'injection-js';
import { Server as WebSocketServer } from 'ws';

@Injectable()
class WsServerWrap extends WebSocketServer {
    constructor(public server: Server) {
        super({
            server,
        });
    }
    broadcast(mes: string) {
        this.clients.forEach(client => {
            client.send(mes);
        })
    }
}

export default WsServerWrap;

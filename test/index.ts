import { Injector } from 'injection-js';
import { Module, Controller, create } from '../src/index';
// import WebSocketServerWrap from './service/WebSocketServerWrap';
import WebSocketServerWrap from './service/WsServerWrap';

@Controller('/a')
class A {
    use(ctx: any) {
        ctx.body = 'this is a';
        // console.log(ctx);
    }
}

@Controller('/b')
class B {
    constructor(public ws: WebSocketServerWrap) {}
    use(ctx: any) {
        this.ws.broadcast('call b')
        ctx.body = 'this is b';
    }
}

@Controller()
class Index {
    use(ctx: any, next: any) {
        ctx.body = 'index';
        return next();
    }
}

@Module({
    controllers: [Index, A, B],
    providers: [WebSocketServerWrap]
})
class App {
    constructor(public injector: Injector) {}
    init() {
        this.injector.get(WebSocketServerWrap)
    }
}

const app = create(App);

app.listen(8888, () => {
    console.log(`server start at http://localhost:8888/`);
});

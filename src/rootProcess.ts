import { Injectable, Injector, ReflectiveInjector } from 'injection-js';
import Application, { Context } from 'koa';
import { Server } from 'http';
import { ListenOptions } from 'net';

export { Context } from 'koa';

function pathMatch(controllerPath: RegExp | string, requestPath: string): boolean {
    if (controllerPath instanceof RegExp) {
        return controllerPath.test(requestPath);
    }
    return requestPath.startsWith(controllerPath);
}

function noopMiddleware(ctx: Context, next: Function) {
    return next();
}

const noopController = {
    use: noopMiddleware
};

type listenArgs =
    | [port?: number, hostname?: string, backlog?: number, listeningListener?: () => void]
    | [port?: number, hostname?: string, listeningListener?: () => void]
    | [port?: number, backlog?: number, listeningListener?: () => void]
    | [port?: number, listeningListener?: () => void]
    | [path: string, backlog?: number, listeningListener?: () => void]
    | [path: string, listeningListener?: () => void]
    | [options: ListenOptions, listeningListener?: () => void]
    | [handle: any, backlog?: number, listeningListener?: () => void]
    | [handle: any, listeningListener?: () => void];

@Injectable()
export default class RootProcess extends Application {
    controllers: Array<any> = [];
    constructor(public injector: Injector) {
        super();
    }

    useController(...controllers: Array<any>) {
        this.controllers.push(...controllers);
        return this;
    }

    pathMatch(controllerPath: RegExp | string, requestPath: string): boolean {
        if (controllerPath instanceof RegExp) {
            return controllerPath.test(requestPath);
        }
        return requestPath.startsWith(controllerPath);
    }

    getRequestPath(ctx: any) {
        return ctx.url;
    }

    callback() {
        const fn = this.composeControllers(this.controllers);
        const handleRequest = (req: any, res: any) => {
            const ctx = this.createContext(req, res);
            return (this as any).handleRequest(ctx, fn);
        };

        return handleRequest;
    }

    listen(...args: listenArgs) {
        const server: Server = this.injector.get(Server);
        server.addListener('request', this.callback());
        server.listen(...args);
        return server;
    }

    composeControllers(controllers: FunctionConstructor[]) {
        const rootInjector = this.injector;

        return async (ctx: any, next: () => Promise<any> = async () => {}) => {
            let index = -1;
            const requestPath = this.getRequestPath(ctx);
            return dispatch(0);
            function dispatch(i: number) {
                if (i <= index) return Promise.reject(new Error('next() called multiple times'));
                index = i;
                const controller = controllers[i];
                let middlewareController;
                if (i === controllers.length) {
                    middlewareController = {
                        use: next
                    };
                } else {
                    const path = Reflect.getMetadata('path', controller);
                    if (pathMatch(path, requestPath)) {
                        const controllerInjector = ReflectiveInjector.resolveAndCreate([controller], rootInjector);
                        const instance = controllerInjector.get(controller);
                        middlewareController = instance;
                    } else {
                        middlewareController = noopController;
                    }
                }

                try {
                    return Promise.resolve(middlewareController.use(ctx, dispatch.bind(null, i + 1)));
                } catch (error) {
                    return Promise.reject(error);
                }
            }
        };
    }
}

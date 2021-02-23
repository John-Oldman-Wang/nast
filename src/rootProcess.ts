
import { IncomingMessage, ServerResponse } from 'http';
import { Injectable, Injector, Provider, ReflectiveInjector } from 'injection-js';

function pathMatch(controllerPath: RegExp | string, requestPath: string): boolean {
    if (controllerPath instanceof RegExp) {
        return controllerPath.test(requestPath);
    }
    return requestPath.startsWith(controllerPath);
}



function noopMiddleware(ctx: any, next: Function) {
    return next();
}

@Injectable()
export default class RootProcess {
    constructor(public injector: Injector) {}
    pathMatch(controllerPath: RegExp | string, requestPath: string): boolean {
        if (controllerPath instanceof RegExp) {
            return controllerPath.test(requestPath);
        }
        return requestPath.startsWith(controllerPath);
    }

    getRequestPath(ctx: any) {
        return ctx.url;
    }

    createContext(req: IncomingMessage, res: ServerResponse): any {
        // todo
        return {
            url: req.url,
            response: res
        };
    }

    handleRequest(ctx: any, fn: Function): Promise<any> {
        // todo
        return fn(ctx)
            .then(() => {
                ctx.response.end(ctx.body)
            })
            .catch(() => {});
    }

    callBack(controllers: FunctionConstructor[]) {
        const fn = this.composeControllers(controllers);
        const handleRequest = (req: any, res: any) => {
            const ctx = this.createContext(req, res);
            return this.handleRequest(ctx, fn);
        };

        return handleRequest;
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
                let middleware;
                if (i === controllers.length) {
                    middleware = next;
                } else {
                    const path = Reflect.getMetadata('path', controller);
                    if (pathMatch(path, requestPath)) {
                        const controllerInjector = ReflectiveInjector.resolveAndCreate([controller], rootInjector);
                        const instance = controllerInjector.get(controller);
                        middleware = instance.use.bind(instance);
                    } else {
                        middleware = noopMiddleware;
                    }
                }

                try {
                    return Promise.resolve(middleware(ctx, dispatch.bind(null, i + 1)));
                } catch (error) {
                    return Promise.reject(error);
                }
            }
        };
    }
}
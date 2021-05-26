import 'reflect-metadata';
import { Server } from 'http';
import { Provider, ReflectiveInjector } from 'injection-js';
import NistApplication from './application';

export { default as Application } from './application';
export * from './decorators/index';
export * from './application';
export interface Type<T = any> extends Function {
    new (...args: any[]): T;
}

export function create(AppModule: Type) {
    const providers: Provider[] = Reflect.getMetadata('providers', AppModule) || [];
    const controllers: Type[] = Reflect.getMetadata('controllers', AppModule) || [];
    const rootInjector = ReflectiveInjector.resolveAndCreate([
        ...providers,
        NistApplication,
        {
            provide: Server,
            useFactory: function () {
                return new Server();
            }
        }
    ]);
    const application: NistApplication = rootInjector.get(NistApplication);
    application.useController(...controllers);
    const appInjector = ReflectiveInjector.resolveAndCreate([AppModule], rootInjector);
    // life circle
    const app = appInjector.get(AppModule);
    if (typeof app?.init === 'function') {
        app.init();
    }
    return application;
}

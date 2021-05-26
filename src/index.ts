import 'reflect-metadata';
import { Server } from 'http';
import { Provider, ReflectiveInjector } from 'injection-js';
import RootProcess from './rootProcess';

export { default as RootProcess } from './rootProcess';
export * from './decorators/index';
export * from './rootProcess';

export function create<T extends Function>(appModule: T) {
    const providers: Provider[] = Reflect.getMetadata('providers', appModule) || [];
    const controllers: FunctionConstructor[] = Reflect.getMetadata('controllers', appModule) || [];
    const rootInjector = ReflectiveInjector.resolveAndCreate([
        ...providers,
        RootProcess,
        {
            provide: Server,
            useFactory: function () {
                return new Server();
            }
        }
    ]);
    const rootProcess: RootProcess = rootInjector.get(RootProcess);
    rootProcess.useController(...controllers);
    return rootProcess;
}

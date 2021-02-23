import 'reflect-metadata';
import { Provider, ReflectiveInjector } from 'injection-js';
import RootProcess from './rootProcess';

export { default as RootProcess } from './rootProcess';
export * from './decorators/index';
export default function bootstrap(appModule: Function) {
    const providers: Provider[] = Reflect.getMetadata('providers', appModule) || [];
    const controllers: FunctionConstructor[] = Reflect.getMetadata('controllers', appModule) || [];
    const defaultInjector = ReflectiveInjector.resolveAndCreate([RootProcess])
    const rootInjector = ReflectiveInjector.resolveAndCreate([...providers], defaultInjector);
    const rootProcess: RootProcess = rootInjector.get(RootProcess);
    return rootProcess.callBack(controllers);
}

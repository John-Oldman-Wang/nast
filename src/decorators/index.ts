import 'reflect-metadata';
import { Provider } from 'injection-js';
interface ModuleMetaData {
    providers?: Provider[];
    controllers?: any[];
}

export function Module(metadata: ModuleMetaData): ClassDecorator {
    return (target: Function) => {
        for (const property in metadata) {
            if (metadata.hasOwnProperty(property)) {
                Reflect.defineMetadata(property, (metadata as any)[property], target);
            }
        }
    };
}

interface ControllerOptions {
    path?: string;
}

export function Controller(): ClassDecorator;

export function Controller(prefix: string): ClassDecorator;

export function Controller(options: ControllerOptions): ClassDecorator;

export function Controller(prefixOrOptions?: string | ControllerOptions): ClassDecorator {
    const defaultPath = '/';
    const [path] =
        prefixOrOptions === undefined
            ? [defaultPath]
            : typeof prefixOrOptions === 'string'
            ? [prefixOrOptions]
            : [prefixOrOptions.path || defaultPath];
    return function (target: Object) {
        Reflect.defineMetadata('path', path, target);
    };
}

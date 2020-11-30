import glob from 'fast-glob';
import { GraphQLFieldResolver, defaultFieldResolver } from 'graphql';
import * as path from 'path';
import resolveValue from './resolve-value';

type Resolver = unknown;

interface Options {
    resolversDir: string;
}

export default async (options: Options): Promise<GraphQLFieldResolver<unknown, unknown>> => {
    const files = await glob('*.{ts,js}', {
        cwd: options.resolversDir,
        onlyFiles: true,
        absolute: true,
    });
    const modules = await Promise.all(
        files.map(async (file) => {
            const type = path.parse(file).name;
            const mod = await require(path.relative(__dirname, file));
            if ('default' in mod) {
                return [type, mod.default as Resolver] as const;
            }

            throw new Error('Resolver modules should export as default');
        }),
    );
    const resolvers = Object.fromEntries(modules);

    return (parent, args, context, info) => {
        if (parent && typeof parent === 'object' && info.fieldName in parent) {
            return defaultFieldResolver(parent, args, context, info);
        }

        return resolveValue(info.returnType, parent, args, { resolvers });
    };
};

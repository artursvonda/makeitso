import glob from 'fast-glob';
import * as path from 'path';
import { Resolver } from './types';

interface Options {
    resolversDir: string;
}

type Resolvers = {
    [key: string]: Resolver;
};

export default async (options: Options): Promise<Resolvers> => {
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

    return Object.fromEntries(modules);
};

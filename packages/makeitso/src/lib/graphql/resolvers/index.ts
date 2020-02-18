import * as path from 'path';
import { Database } from '../../database';
import { Structure } from '../utils';
import { Base } from './Base';
import { ObjectType } from './types';

const getTypeModule = (type: string, dir: string) => {
    let importPath = path.relative(__dirname, path.resolve(dir, type));
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
        importPath = './' + importPath;
    }

    return import(importPath);
};

const getCustomTypeResolver = async (field: ObjectType, context: Context): Promise<typeof Base> => {
    try {
        const module = await getTypeModule(field.type, context.resolversDir);
        if ('default' in module) {
            return module.default;
        }
    } catch {}

    return Base;
};

interface Context {
    resolversDir: string;
    database: Database;
}

const getClasses = async (structure: Structure, context: Context) => {
    const promises = Object.entries(structure)
        .filter(([key, value]) => value.resolvedType === 'object')
        .map(async ([key, value]) => {
            const resolver = await getCustomTypeResolver(value as ObjectType, context);

            return [key, resolver] as const;
        });

    return Object.fromEntries(await Promise.all(promises));
};

export const getResolver = async (structure: Structure, context: Context) => {
    if (!structure.Query || structure.Query.resolvedType !== 'object') {
        throw new Error('Missing root Query');
    }

    const classes = await getClasses(structure, context);
    const Query = classes.Query;

    return new Query(
        {},
        {
            db: context.database,
            type: structure.Query,
            classes,
        },
    );
};

import * as path from 'path';
import { map } from 'utils/dist/object';
import uuid from 'uuid';
import { Types, ObjectType, Fields, Structure } from '../utils';

type ScalarValue = string | number | boolean;
type ResolvedValue = ScalarValue | ScalarValue[] | Resolver | Resolver[] | ObjectResolver | null;
type Resolver = () => ResolvedValue;
type ObjectResolver = { [key: string]: Resolver };

const getTypeModule = (type: string, dir: string) =>
    import(path.relative(__dirname, path.resolve(dir, type)));

const getTypeResolver = async (field: ObjectType, context: Context) => {
    const resolver = await getObjectResolver(field.fields, context);
    try {
        const module = await getTypeModule(field.type, context.resolversDir);

        if ('resolve' in module) {
            return () => module.resolve(resolver, dbData);
        }
    } catch {}

    return () => resolver;
};

const getFieldMock = async (field: Types, context: Context): Promise<Resolver> => {
    switch (field.resolvedType) {
        case 'string':
            const val = field.type === 'ID' ? uuid.v4() : 'string value';

            return () => val;
        case 'int':
            return () => 123;
        case 'float':
            return () => 1.23;
        case 'bool':
            return () => true;
        case 'enum':
            return () => field.values[0];
        case 'object':
            return getTypeResolver(field, context);
        case 'array':
            const mockField = await getFieldMock(field.children, context);

            return () => [mockField() as string];
        case 'unknown':
        default:
            return () => {
                throw new Error('unknown type');
            };
    }
};

interface Context {
    resolversDir: string;
}

const getObjectResolver = async (obj: Fields, context: Context): Promise<ObjectResolver> => {
    const resolvers = await Promise.all(
        Object.entries(obj).map(async ([key, field]) => {
            const mock = await getFieldMock(field, context);

            return [key, mock];
        }),
    );

    return Object.fromEntries(resolvers);
};

const dbData: { [key: string]: unknown[] } = {};
const db = {
    add(type: string, value: unknown) {
        dbData[type].push(value);
    },
};

const getMutations = async (structure: Structure, context: Context): Promise<ObjectResolver> => {
    const types = Object.keys(structure);
    const mutations = await Promise.all(
        types.map(async type => {
            try {
                const module = await getTypeModule(type, context.resolversDir);

                if ('mutations' in module) {
                    return map(module.mutations, fn => (input: unknown) => fn(db, input));
                }
            } catch {}

            return {};
        }),
    );
    Object.assign(dbData, ...types.map(type => ({ [type]: [] })));

    return Object.assign({}, ...mutations);
};

export const getResolver = async (
    structure: Structure,
    context: Context,
): Promise<ObjectResolver> => {
    if (!structure.Query) {
        throw new Error('Missing root Query');
    }

    const [resolvers, mutations] = await Promise.all([
        getObjectResolver(structure.Query.fields, context),
        getMutations(structure, context),
    ]);

    return { ...resolvers, ...mutations };
};

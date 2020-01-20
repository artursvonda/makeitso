import { map } from 'utils/dist';
import uuid from 'uuid';
import { Field, Structure } from '../utils';

type ScalarValue = string | number | boolean;
type ResolvedValue = ScalarValue | ScalarValue[] | Resolver | Resolver[] | ObjectResolver | null;
type Resolver = () => ResolvedValue;
type ObjectResolver = { [key: string]: Resolver };

const getFieldMock = (field: Field, context: Context): Resolver => {
    switch (field.resolvedType) {
        case 'string':
            return () => (field.type === 'ID' ? uuid.v4() : 'string value');
        case 'int':
            return () => 123;
        case 'float':
            return () => 1.23;
        case 'bool':
            return () => true;
        case 'enum':
            return () => field.children[0];
        case 'object':
            return () => getResolver(field.children, context);
        case 'array':
            return () => [getFieldMock(field.children, context)() as string];
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

export const getResolver = (obj: Structure, context: Context): ObjectResolver =>
    map(obj, field => getFieldMock(field, context));

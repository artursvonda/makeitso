import { Database } from '../../database';
import { Node } from '../../database/interface';
import { ObjectType } from './types';

const getEntity = (type: ObjectType) => {
    if (type.type.endsWith('Edge')) {
        return type.fields.node.type;
    }

    return type.type;
};

interface Context {
    type: ObjectType;
    db: Database;
    classes: { [key: string]: typeof Base };
}

export class Base<T extends {}> {
    protected db: Database;
    protected context: Context;
    protected data: T;

    public constructor(data: T, context: Context) {
        this.data = data;
        this.context = context;
        this.db = context.db;

        const inst = this;

        // @ts-ignore
        return new Proxy(data, {
            set() {
                throw new Error('unable to set props for db objects');
            },
            get(target, prop: keyof T) {
                if (prop in inst) {
                    return (inst as any)[prop];
                }

                if (prop in target) {
                    return target[prop];
                }

                const { type, isArray } = inst._getTypeName(prop as string);

                if (type) {
                    if (type.resolvedType === 'object' && type.type in inst.context.classes) {
                        const entity = getEntity(type);

                        return (args: {}) => {
                            const fullArgs = { ...args, __typename: entity };
                            if (isArray) {
                                const data = inst.db.find(fullArgs);

                                return (data.length || !type.required ? data : [{} as Node]).map(
                                    item =>
                                        new inst.context.classes[type.type](item, {
                                            ...inst.context,
                                            type,
                                        }),
                                );
                            } else {
                                const data = inst.db.findOne(fullArgs);

                                if (data || type.required) {
                                    return new inst.context.classes[type.type](data || {}, {
                                        ...inst.context,
                                        type,
                                    });
                                }
                            }

                            return undefined;
                        };
                    }

                    switch (type.resolvedType) {
                        case 'string':
                            return 'string value';
                        case 'int':
                            return 123;
                        case 'float':
                            return 1.23;
                        case 'bool':
                            return true;
                        case 'enum':
                            return type.values[0];
                    }
                }
            },
        });
    }

    private _getTypeName(prop: string) {
        const type = this.context.type;
        if (!(prop in type.fields)) {
            return {};
        }

        const fieldType = type.fields[prop];

        if (fieldType.resolvedType === 'array') {
            return { type: fieldType.children, isArray: true };
        }

        return { type: fieldType, isArray: false };
    }
}

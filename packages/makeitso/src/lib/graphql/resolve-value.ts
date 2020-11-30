import {
    GraphQLNonNull,
    GraphQLOutputType,
    isEnumType,
    isLeafType,
    isListType,
    isNullableType,
    isObjectType,
} from 'graphql';
import isClass from 'is-class';

interface Options {
    resolvers: {
        [key: string]: unknown;
    };
}

const resolveValue = (
    type: GraphQLOutputType,
    parent?: unknown,
    args?: unknown,
    options: Options = { resolvers: {} },
): unknown => {
    const { resolvers } = options;
    if (isNullableType(type)) {
        return null;
    }

    const realType = (type as GraphQLNonNull<GraphQLOutputType>).ofType;

    if (isLeafType(realType)) {
        switch (realType.name) {
            case 'String':
                return 'string value';
            case 'Float':
                return 1.23;
            case 'Int':
                return 123;
            case 'Boolean':
                return true;
            default:
                if (isEnumType(realType)) {
                    return realType.getValues()[0].value;
                }

                throw new Error(`Unknown type ${realType.name}`);
        }
    }

    if (isListType(realType)) {
        return [resolveValue(realType.ofType as GraphQLOutputType, parent, args, options)];
    }

    if (isObjectType(realType)) {
        if (realType.name in resolvers) {
            const resolver = resolvers[realType.name];
            if (isClass(resolver)) {
                return new resolver(parent);
            }

            return resolver;
        }

        return Object.fromEntries(
            Object.values(realType.getFields()).map((field) => [
                field.name,
                resolveValue(field.type as GraphQLOutputType, parent, args, options),
            ]),
        );
    }

    return null;
};

export default resolveValue;

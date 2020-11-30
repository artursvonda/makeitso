import {
    GraphQLNonNull,
    GraphQLOutputType,
    isEnumType,
    isLeafType,
    isListType,
    isNullableType,
    isObjectType,
} from 'graphql';

const resolveValue = (type: GraphQLOutputType): unknown => {
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
        return [resolveValue(realType.ofType as GraphQLOutputType)];
    }

    if (isObjectType(realType)) {
        return Object.fromEntries(
            Object.values(realType.getFields()).map((field) => [
                field.name,
                resolveValue(field.type as GraphQLOutputType),
            ]),
        );
    }

    return null;
};

export default resolveValue;

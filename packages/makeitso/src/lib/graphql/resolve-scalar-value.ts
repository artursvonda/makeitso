import { GraphQLLeafType, isEnumType } from 'graphql';

export default (type: GraphQLLeafType) => {
    switch (type.name) {
        case 'String':
            return 'string value';
        case 'Float':
            return 1.23;
        case 'Int':
            return 123;
        case 'Boolean':
            return true;
        default:
            if (isEnumType(type)) {
                return type.getValues()[0].value;
            }

            throw new Error(`Unknown type ${type.name}`);
    }
};

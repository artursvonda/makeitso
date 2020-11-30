import {
    GraphQLBoolean,
    GraphQLEnumType,
    GraphQLFloat,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
} from 'graphql';
import resolveValue from '../resolve-value';

const RGBType = new GraphQLEnumType({
    name: 'RGB',
    values: {
        RED: { value: 0 },
        GREEN: { value: 1 },
        BLUE: { value: 2 },
    },
});

const StringList = new GraphQLList(new GraphQLNonNull(GraphQLString));

const ObjectType = new GraphQLObjectType({
    name: 'Object',
    fields: () => ({
        string: { type: new GraphQLNonNull(GraphQLString) },
    }),
});

describe('resolve-value', () => {
    it('resolves null if type is not non-nullable', () => {
        expect(resolveValue(GraphQLString)).toBe(null);
    });

    it('resolves String value', () => {
        expect(resolveValue(new GraphQLNonNull(GraphQLString))).toBe('string value');
    });

    it('resolves Float value', () => {
        expect(resolveValue(new GraphQLNonNull(GraphQLFloat))).toBe(1.23);
    });

    it('resolves Int value', () => {
        expect(resolveValue(new GraphQLNonNull(GraphQLInt))).toBe(123);
    });

    it('resolves Boolean value', () => {
        expect(resolveValue(new GraphQLNonNull(GraphQLBoolean))).toBe(true);
    });

    it('resolves Enum value', () => {
        expect(resolveValue(new GraphQLNonNull(RGBType))).toBe(0);
    });

    it('resolves List value', () => {
        expect(resolveValue(new GraphQLNonNull(StringList))).toStrictEqual(['string value']);
    });

    it('resolves Object value', () => {
        expect(resolveValue(new GraphQLNonNull(ObjectType))).toStrictEqual({
            string: 'string value',
        });
    });
});

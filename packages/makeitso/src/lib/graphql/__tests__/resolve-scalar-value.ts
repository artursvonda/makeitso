import { GraphQLBoolean, GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLString } from 'graphql';
import resolveScalarValue from '../resolve-scalar-value';

const RGBType = new GraphQLEnumType({
    name: 'RGB',
    values: {
        RED: { value: 0 },
        GREEN: { value: 1 },
        BLUE: { value: 2 },
    },
});

describe('resolve-scalar-value', () => {
    it('resolves String value', () => {
        expect(resolveScalarValue(GraphQLString)).toBe('string value');
    });

    it('resolves Float value', () => {
        expect(resolveScalarValue(GraphQLFloat)).toBe(1.23);
    });

    it('resolves Int value', () => {
        expect(resolveScalarValue(GraphQLInt)).toBe(123);
    });

    it('resolves Boolean value', () => {
        expect(resolveScalarValue(GraphQLBoolean)).toBe(true);
    });

    it('resolves Enum value', () => {
        expect(resolveScalarValue(RGBType)).toBe(0);
    });
});

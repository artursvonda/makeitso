import { getGraphQlType, getStructure } from './index';

describe('getStructure', () => {
    it('requires root query', () => {
        expect(() => getStructure('')).toThrow('Syntax Error: Unexpected <EOF>');
        expect(() => getStructure('type NotQuery { field: String }')).toThrow(
            'Missing Query type in schema',
        );
    });

    it('requires at least one field in query', () => {
        expect(() => getStructure('type Query {}')).toThrow('Syntax Error: Expected Name, found }');
    });

    it('requires at least one field in query', () => {
        expect(
            Object.keys(
                getStructure(`
                    type Query {
                        field: String!
                    }`),
            ),
        ).toMatchObject(['field']);
    });

    it('returns basic types', () => {
        expect(
            getStructure(`
                    type Query {
                        string: String!
                        int: Int!
                        float: Float!
                        bool: Boolean!
                    }`),
        ).toMatchObject({
            string: { type: 'String', resolvedType: 'string', required: true },
            int: { type: 'Int', resolvedType: 'int', required: true },
            float: { type: 'Float', resolvedType: 'float', required: true },
            bool: { type: 'Boolean', resolvedType: 'bool', required: true },
        });
    });

    it('handles optional types', () => {
        expect(
            getStructure(`
                    type Query {
                        string: String
                    }`),
        ).toMatchObject({ string: { type: 'String', resolvedType: 'string', required: false } });
    });

    it('handles scalar values', () => {
        expect(
            getStructure(`
                    scalar ScalarType

                    type Query {
                        string: ScalarType
                    }`),
        ).toMatchObject({
            string: { type: 'ScalarType', resolvedType: 'unknown', required: false },
        });
    });

    it('handles enum values', () => {
        expect(
            getStructure(`
                    enum EnumValue {
                        One
                        Two
                    }

                    type Query {
                        string: EnumValue
                    }`),
        ).toMatchObject({
            string: {
                type: 'EnumValue',
                resolvedType: 'enum',
                required: false,
                children: ['One', 'Two'],
            },
        });
    });

    it('handles array types', () => {
        expect(
            getStructure(`
                    type Query {
                        string: [String]
                    }`),
        ).toMatchObject({
            string: {
                type: 'ListType',
                resolvedType: 'array',
                required: false,
                children: { type: 'String', resolvedType: 'string', required: false },
            },
        });

        expect(
            getStructure(`
                    type Query {
                        string: [String!]!
                    }`),
        ).toMatchObject({
            string: {
                type: 'ListType',
                resolvedType: 'array',
                required: true,
                children: { type: 'String', resolvedType: 'string', required: true },
            },
        });
    });

    it('handles nested structures', () => {
        expect(
            getStructure(`
                    type Nested {
                        string: String!
                    }

                    type Query {
                        nested: Nested!
                    }`),
        ).toMatchObject({
            nested: {
                type: 'Nested',
                resolvedType: 'object',
                required: true,
                children: {
                    string: { type: 'String', resolvedType: 'string', required: true },
                },
            },
        });
    });

    it('handles recursive nested structures', () => {
        const child = {
            type: 'Child',
            resolvedType: 'object',
            required: true,
            children: {} as { [key: string]: unknown },
        };
        child.children.child = child;

        const structure = getStructure(`
                type Child {
                    child: Child!
                }

                type Query {
                    child: Child!
                }`);
        expect(structure).toMatchObject({ child });
        expect((structure.child as any).children).toMatchObject({ child });
    });
});

describe('getGraphQlType', () => {
    it('returns type for simple NamedType', () => {
        expect(getGraphQlType({ kind: 'NamedType', name: { kind: 'Name', value: 'String' } })).toBe(
            'String',
        );
    });

    it('returns type for NonNullType', () => {
        expect(
            getGraphQlType({
                kind: 'NonNullType',
                type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
            }),
        ).toBe('String');
    });

    it('returns type for ListType', () => {
        expect(
            getGraphQlType({
                kind: 'ListType',
                type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
            }),
        ).toBe('ListType');
    });

    it('returns type for NonNull ListType', () => {
        expect(
            getGraphQlType({
                kind: 'NonNullType',
                type: {
                    kind: 'ListType',
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
            }),
        ).toBe('ListType');
    });
});

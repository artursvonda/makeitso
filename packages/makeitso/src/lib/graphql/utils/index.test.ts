import { getGraphQlType, getStructure, ObjectField } from './index';

describe('getStructure', () => {
    it('requires valid graphql schema', () => {
        expect(() => getStructure('')).toThrow('Syntax Error: Unexpected <EOF>');
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
            Query: {
                fields: {
                    string: { type: 'String', resolvedType: 'string', required: true },
                    int: { type: 'Int', resolvedType: 'int', required: true },
                    float: { type: 'Float', resolvedType: 'float', required: true },
                    bool: { type: 'Boolean', resolvedType: 'bool', required: true },
                },
            },
        });
    });

    it('handles optional types', () => {
        expect(
            getStructure(`
                    type Query {
                        string: String
                    }`),
        ).toMatchObject({
            Query: {
                fields: { string: { type: 'String', resolvedType: 'string', required: false } },
            },
        });
    });

    it('handles scalar values', () => {
        expect(
            getStructure(`
                    scalar ScalarType

                    type Query {
                        string: ScalarType
                    }`),
        ).toMatchObject({
            Query: {
                fields: {
                    string: { type: 'ScalarType', resolvedType: 'unknown', required: false },
                },
            },
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
            Query: {
                fields: {
                    string: {
                        type: 'EnumValue',
                        resolvedType: 'enum',
                        required: false,
                        children: ['One', 'Two'],
                    },
                },
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
            Query: {
                fields: {
                    string: {
                        type: 'ListType',
                        resolvedType: 'array',
                        required: false,
                        children: { type: 'String', resolvedType: 'string', required: false },
                    },
                },
            },
        });

        expect(
            getStructure(`
                    type Query {
                        string: [String!]!
                    }`),
        ).toMatchObject({
            Query: {
                fields: {
                    string: {
                        type: 'ListType',
                        resolvedType: 'array',
                        required: true,
                        children: { type: 'String', resolvedType: 'string', required: true },
                    },
                },
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
            Nested: {
                fields: {
                    string: { type: 'String', resolvedType: 'string', required: true },
                },
            },
            Query: {
                fields: {
                    nested: {
                        type: 'Nested',
                        resolvedType: 'object',
                        required: true,
                        children: {
                            type: 'Nested',
                            fields: {
                                string: { type: 'String', resolvedType: 'string', required: true },
                            },
                        },
                    },
                },
            },
        });
    });

    it('handles recursive nested structures', () => {
        const child = {
            type: 'Child',
            resolvedType: 'object',
            required: true,
            children: {} as any,
        };

        const Child = {
            type: 'Child',
            fields: { child },
        };

        child.children = Child;

        const structure = getStructure(`
                type Child {
                    child: Child!
                }

                type Query {
                    child: Child!
                }`);
        // For some reason doesn't match when both Child and Query are present in object
        expect(structure).toMatchObject({ Child });
        expect(structure).toMatchObject({ Query: { ...Child, type: 'Query' } });
        expect((structure.Query.fields.child as ObjectField).children).toMatchObject(Child);
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

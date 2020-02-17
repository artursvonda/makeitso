import { getGraphQlType } from './types';

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

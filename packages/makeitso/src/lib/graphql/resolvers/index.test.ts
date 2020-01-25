import { buildSchema, execute, parse } from 'graphql';
import * as path from 'path';
import { getStructure } from '../utils';
import { getResolver } from './index';

describe('getResolver', () => {
    const context = { resolversDir: path.join(__dirname, '__fixtures__') };

    const getResult = async (source: string, query: string) => {
        const structure = getStructure(source);
        const schema = buildSchema(source);
        const resolver = await getResolver(structure, context);
        const document = parse(query);

        return execute(schema, document, resolver);
    };

    it('it resolves scalars', async done => {
        const source = `
            enum EnumValue {
                ONE
            }
                
            type Query {
                string: String!
                int: Int!
                float: Float!
                bool: Boolean!
                enum: EnumValue!
            }
        `;
        const query = `{
            string
            int
            float
            bool
            enum
         }`;

        const result = await getResult(source, query);

        expect(result).toMatchObject({
            data: {
                string: 'string value',
                int: 123,
                float: 1.23,
                bool: true,
                enum: 'ONE',
            },
        });
        done();
    });

    it('it resolves Nested Objects', async done => {
        const source = `
            type Nested {
                string: String!
            }
                
            type Query {
                nested: Nested!
            }
        `;
        const query = `{
            nested {
                string
            }
         }`;

        const result = await getResult(source, query);

        expect(result).toMatchObject({
            data: {
                nested: {
                    string: 'string value',
                },
            },
        });
        done();
    });

    it('it looks for custom type resolvers', async done => {
        const source = `
            type CustomNested {
                string: String!
            }
                
            type Query {
                nested: CustomNested!
            }
        `;
        const query = `{
            nested {
                string
            }
         }`;

        const result = await getResult(source, query);

        expect(result).toMatchObject({
            data: {
                nested: {
                    string: 'custom',
                },
            },
        });
        done();
    });
});

import { buildSchema, execute, parse } from 'graphql';
import * as path from 'path';
import { Database } from '../../database';
import { initWithSamplesFromDir, SampleDatabase } from '../../database/sampledb';
import { getStructure } from '../utils';
import { getResolver } from './index';

const getContext = (namespace: string) => ({
    resolversDir: path.join(__dirname, '__fixtures__', namespace),
});

describe('getResolver', () => {
    const getResult = async (source: string, query: string, subDir = '', db?: Database) => {
        const baseContext = getContext(subDir);
        const context = {
            ...baseContext,
            database: db || (await initWithSamplesFromDir(baseContext.resolversDir)),
        };

        const structure = getStructure(source);
        const schema = buildSchema(source);
        const resolver = await getResolver(structure, context);
        const document = parse(query);

        return execute(schema, document, resolver);
    };

    it('resolves scalars', async done => {
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

    it('resolves Nested Objects', async done => {
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

    it('looks for custom type resolvers', async done => {
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

        const result = await getResult(source, query, 'CustomNested');

        expect(result).toMatchObject({
            data: {
                nested: {
                    string: 'custom',
                },
            },
        });
        done();
    });

    it('accepts arguments', async done => {
        const source = `
            type Query {
                get(arg: String!): String!
            }
        `;
        const query = `{
            get(arg: "input")
         }`;

        const result = await getResult(source, query, 'WithArgument');

        expect(result).toMatchObject({
            data: {
                get: 'input',
            },
        });
        done();
    });

    it('accepts arguments in nested object', async done => {
        const source = `
            type Nested {
                get(arg: String!): String!
            }
            
            type Query {
                nested: Nested!
            }
        `;
        const query = `{
            nested {
                get(arg: "input")
            }
         }`;

        const result = await getResult(source, query, 'WithArgumentInNested');

        expect(result).toMatchObject({
            data: {
                nested: {
                    get: 'input',
                },
            },
        });
        done();
    });

    it('gives access to database', async done => {
        const source = `
            type Obj {
                id: ID!
                name: String!
            }
            
            type Query {
                obj: Obj!
            }
        `;
        const query = `{
            obj {
                id
                name
            }
         }`;

        const result = await getResult(source, query, 'WithFixtures');

        expect(result).toMatchObject({
            data: {
                obj: {
                    id: '1',
                    name: 'name',
                },
            },
        });
        done();
    });
});

import express from 'express';
import graphqlHTTP from 'express-graphql';
import { promises } from 'fs';
import { buildSchema } from 'graphql';
import { info } from 'utils/dist/debug';
import { map } from 'utils/dist/object';
import uuid from 'uuid';
import { Field, getStructure, Structure } from '../graphql';

const { readFile } = promises;

type ScalarValue = string | number | boolean;
type ResolvedValue = ScalarValue | ScalarValue[] | Resolver | Resolver[] | ObjectResolver | null;
type Resolver = () => ResolvedValue | ScalarValue[];
type ObjectResolver = { [key: string]: Resolver };

const scalarResolvers = (field: Field) => ({
    string: () => (field.type === 'ID' ? uuid.v4() : 'string value'),
    bool: () => true,
    int: () => 123,
    float: () => 1.23,
});

const getFieldMock = (field: Field): Resolver => {
    if (field.resolvedType === 'array') {
        return () => [getFieldMock(field.children)() as string];
    } else if (field.resolvedType === 'object') {
        return () => getObjectMock(field.children);
    } else if (field.resolvedType === 'enum') {
        return () => field.children[0];
    } else if (field.resolvedType === 'unknown') {
        return () => {
            throw new Error('unknown type');
        };
    } else {
        return scalarResolvers(field)[field.resolvedType] || (() => null);
    }
};

const getObjectMock = (obj: Structure): ObjectResolver => map(obj, field => getFieldMock(field));

interface Arguments {
    input: string;
}

export default async ({ input }: Arguments) => {
    const host = 'localhost';
    const port = 4000;

    info`
Starting GrqphQL server
        
Source: {green ${input}}
Server: {green http://${host}:${port}/grqphql}`;
    const body = await readFile(input);
    const schemaInput = body.toString();
    const schema = buildSchema(schemaInput);

    const structure = getStructure(schemaInput);

    const root = getObjectMock(structure);

    const app = express();
    app.use(
        '/graphql',
        graphqlHTTP({
            schema: schema,
            rootValue: root,
            graphiql: true,
        }),
    );

    const server = app.listen(port);

    return new Promise(resolve => {
        server.on('close', resolve);
    });
};

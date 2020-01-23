import cors from 'cors';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import { promises } from 'fs';
import { buildSchema } from 'graphql';
import * as path from 'path';
import { info } from 'utils/dist/debug';
import { getResolver } from '../graphql/resolvers';
import { getStructure } from '../graphql/utils';

const { readFile } = promises;

interface Arguments {
    schemaFile: string;
    resolversDir?: string;
    host?: string;
    port?: number;
}

export default async ({
    schemaFile,
    resolversDir = `${path.dirname(schemaFile)}/resolvers`,
    host = 'localhost',
    port = 4000,
}: Arguments) => {
    info`
Starting GrqphQL server
        
Source: {green ${schemaFile}}
Server: {green http://${host}:${port}/grqphql}`;
    const body = await readFile(schemaFile);
    const schemaInput = body.toString();
    const schema = buildSchema(schemaInput);

    const structure = getStructure(schemaInput);

    const root = await getResolver(structure, { resolversDir });

    const app = express();
    app.use(cors());

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

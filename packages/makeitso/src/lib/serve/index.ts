import cors from 'cors';
import initDebug from 'debug';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { promises } from 'fs';
import { buildSchema } from 'graphql';
// import * as path from 'path';
import { info } from 'utils/dist/debug';
import resolveValue from '../graphql/resolve-value';

const debug = initDebug('makeitso:serve');

const { readFile } = promises;

interface Arguments {
    schemaFile: string;
    resolversDir?: string;
    host?: string;
    port?: number;
}

export default async ({
    schemaFile,
    // resolversDir = `${path.dirname(schemaFile)}/resolvers`,
    host = 'localhost',
    port = 4000,
}: Arguments) => {
    info`
Starting GraphQL server
        
Source: {green ${schemaFile}}
Server: {green http://${host}:${port}/graphql}`;
    const body = await readFile(schemaFile);
    const schemaInput = body.toString();
    try {
        const schema = buildSchema(schemaInput);

        const app = express();
        app.use(cors());

        app.use(
            '/graphql',
            graphqlHTTP({
                schema: schema,
                rootValue: {},
                graphiql: true,
                fieldResolver: (parent, args, context, info) => resolveValue(info.returnType),
            }),
        );

        const server = app.listen(port);

        return new Promise((resolve) => {
            server.on('close', resolve);
        });
    } catch (e) {
        console.error(e);
        debug(e);
    }
};

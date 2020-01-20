import { BuilderCallback } from 'yargs';
import build from '../lib/build';
import { resolve } from 'path';

interface Arguments {
    env: string;
    input: string;
}

export const command = 'build [env]';

export const desc = 'Build environment';

export const builder: BuilderCallback<Arguments, {}> = yargs => {
    yargs.default('env', 'dev', 'Environment');
    yargs.option('input', { default: 'data/schema.graphql' });
};

export const handler = async (argv: Arguments) => {
    const input = resolve(process.cwd(), argv.input);
    try {
        await build({ schemaFile: input });

        process.exit(0);
    } catch {
        process.exit(1);
    }
};

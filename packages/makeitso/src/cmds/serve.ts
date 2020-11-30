import { BuilderCallback } from 'yargs';
import serve from '../lib/serve';
import { resolve } from 'path';

interface Arguments {
    env: string;
    input: string;
}

export const command = 'serve';

export const desc = 'Serves environment';

export const builder: BuilderCallback<Arguments, {}> = (yargs) => {
    yargs.option('input', { default: 'data/schema.graphql' });
};

export const handler = async (argv: Arguments) => {
    const input = resolve(process.cwd(), argv.input);
    try {
        await serve({ schemaFile: input });

        process.exit(0);
    } catch {
        process.exit(1);
    }
};

import { error } from '../utils';
import { BuilderCallback } from 'yargs';
import serve from '../lib/serve';
import { resolve } from 'path';

interface Arguments {
    env: string;
    input: string;
}

export const command = ['serve', '$0'];

export const desc = 'Serves environment';

export const builder: BuilderCallback<Arguments, {}> = (yargs) => {
    yargs.option('input', { default: 'data/schema.graphql' });
};

export const handler = async (argv: Arguments) => {
    const input = resolve(process.cwd(), argv.input);
    try {
        await serve({ schemaFile: input });

        process.exit(0);
    } catch (e) {
        error(e.message);

        process.exit(1);
    }
};

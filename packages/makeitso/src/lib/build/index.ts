import { promises } from 'fs';

const { readFile } = promises;

interface Arguments {
    schemaFile: string;
}

const build = async ({ schemaFile }: Arguments) => {
    const body = await readFile(schemaFile);
    console.log(body);
};

export default build;

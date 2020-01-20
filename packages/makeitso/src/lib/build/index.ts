import { promises } from 'fs';
import { getStructure } from '../graphql/utils';

const { readFile } = promises;

interface Arguments {
    schemaFile: string;
}

const build = async ({ schemaFile }: Arguments) => {
    const body = await readFile(schemaFile);

    const structure = getStructure(body.toString());

    console.log(structure);
};

export default build;

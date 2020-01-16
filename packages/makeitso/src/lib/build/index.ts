import { promises } from 'fs';
import { getStructure } from '../graphql';

const { readFile } = promises;

interface Arguments {
    input: string;
}

const build = async ({ input }: Arguments) => {
    const body = await readFile(input);

    const structure = getStructure(body.toString());

    console.log(structure);
};

export default build;

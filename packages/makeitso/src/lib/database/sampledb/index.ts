import glob from 'fast-glob';
import * as path from 'path';
import { Database, Node } from '../interface';

export const initWithSamplesFromDir = async (cwd: string) => {
    const files = await glob('**/*.samples.{json,js,ts}', { cwd, absolute: true });
    const samplesContent = await Promise.all(
        files.map(async (file) => {
            const fileSamples = (await import(file)).default;
            const type = path.basename(file).replace(/\.samples\.js(on)?/, '');

            return fileSamples.map((sample: {}) => ({ ...sample, __typename: type }));
        }),
    );
    const samples = samplesContent.reduce((all, file) => [...all, ...file], []);

    return new SampleDatabase(samples);
};

const isMatchingArgs = (sample: Node, args: Record<string, unknown>) =>
    Object.entries(args).every(([key, value]) => sample[key] === value);

export class SampleDatabase implements Database {
    private samples: Node[];

    constructor(samples: Node[]) {
        this.samples = samples;
    }

    public findById(id: string) {
        return this.samples.find((sample) => sample.id === id);
    }

    public find(args: Record<string, unknown> = {}): Node[] {
        return this.samples.filter((sample) => isMatchingArgs(sample, args));
    }

    public findOne(args: Record<string, unknown>): Node | undefined {
        return this.find(args)[0];
    }

    public add(node: Node): boolean {
        this.samples.push(node);

        return true;
    }
}

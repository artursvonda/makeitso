import { Resolver } from 'makeitso-cli';

export default class Mutation extends Resolver<any> {
    addTask(input: { name: string }) {
        const id = this.generateNewId();

        const node = { id, ...input, __typename: 'Mutation' };

        this.db.add(node);

        return node;
    }
}

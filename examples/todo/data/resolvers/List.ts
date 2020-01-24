import { ListBase, Task } from '../schema';

class List implements ListBase {
    private readonly _tasks: Task[];

    constructor(tasks: Task[]) {
        this._tasks = tasks;
    }
    public id() {
        return 'List ID';
    }

    public name() {
        return 'list Name';
    }

    public tasks() {
        return {
            edges: this._tasks.map(node => ({ cursor: node.id, node })),
            pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
                startCursor: '',
                endCursor: '',
            },
        };
    }
}

export const resolve = (resolver: ListBase, db: { Task: Task[] }) => new List(db.Task);

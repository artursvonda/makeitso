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

    public tasks(): Task[] {
        return this._tasks;
    }
}

export const resolve = (resolver: ListBase, db: { Task: Task[] }) => new List(db.Task);

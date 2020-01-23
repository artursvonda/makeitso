import { TaskBase, TaskMutations } from '../schema';
import * as uuid from 'uuid';

class Task implements TaskBase {
    private readonly _id: string;

    constructor(id: string) {
        this._id = id;
    }
    public id() {
        return this._id;
    }

    public name() {
        return 'list Name';
    }

    public done() {
        return Math.random() < 0.5;
    }
}

export const resolve = (resolver: TaskBase) => new Task(resolver.id());

export const mutations: TaskMutations = {
    addTask: (db, args) => {
        const task = { ...args.task, id: uuid.v4(), done: false };
        db.add('Task', task);

        return task;
    },
};

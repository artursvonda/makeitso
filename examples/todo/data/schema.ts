type Resolver<T> = {
    [P in keyof T]: () => T[P];
};

type Mutation<TModel, TInput> = (
    db: { add(type: string, model: TModel): void },
    args: TInput,
) => TModel;

export interface Task {
    id: string;
    name: string;
    done: boolean;
}

export interface List {
    id: string;
    name: string;
    tasks: Task[];
}

export type ListBase = Resolver<List>;

export interface TaskMutations {
    addTask: Mutation<Task, { task: { name: string } }>;
}

export type TaskBase = Resolver<Task>;

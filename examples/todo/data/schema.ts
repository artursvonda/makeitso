type Resolver<T> = {
    [P in keyof T]: () => T[P];
};

type Mutation<TModel, TInput, TResponse = TModel> = (
    db: { add(type: string, model: TModel): void },
    args: TInput,
) => TResponse;

type Connection<TModel> = { edges: { node: TModel }[] };

export interface Task {
    id: string;
    name: string;
    done: boolean;
}

export interface List {
    id: string;
    name: string;
    tasks: Connection<Task>;
}

export type ListBase = Resolver<List>;

export interface TaskMutations {
    addTask: Mutation<Task, { task: { name: string } }, { task: { node: Task } }>;
}

export type TaskBase = Resolver<Task>;

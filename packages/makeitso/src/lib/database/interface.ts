export interface Node {
    id: string;
    [key: string]: unknown;
}

export interface Database {
    findById(id: string): Node | undefined;
    find(args?: Record<string, unknown>): Node[];
    findOne(args: Record<string, unknown>): Node | undefined;
    add(node: Node): boolean;
}

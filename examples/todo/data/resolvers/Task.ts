import { GraphQLResolveInfo, responsePathAsArray } from 'graphql';

const Task = {
    task(_args: unknown, _context: unknown, info: GraphQLResolveInfo) {
        return responsePathAsArray(info.path).join(' -> ');
    },
};

export default Task;

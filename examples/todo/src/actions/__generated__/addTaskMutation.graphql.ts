/* tslint:disable */
/* eslint-disable */
/* @relayHash 4c58a0daa2f466ad20f33d889293777b */

import { ConcreteRequest } from 'relay-runtime';
export type addTaskMutationVariables = {
    name: string;
};
export type addTaskMutationResponse = {
    readonly addTask: {
        readonly name: string;
    };
};
export type addTaskMutation = {
    readonly response: addTaskMutationResponse;
    readonly variables: addTaskMutationVariables;
};

/*
mutation addTaskMutation(
  $name: String!
) {
  addTask(task: {name: $name}) {
    name
    id
  }
}
*/

const node: ConcreteRequest = (function() {
    var v0 = [
            {
                kind: 'LocalArgument',
                name: 'name',
                type: 'String!',
                defaultValue: null,
            },
        ],
        v1 = [
            {
                kind: 'ObjectValue',
                name: 'task',
                fields: [
                    {
                        kind: 'Variable',
                        name: 'name',
                        variableName: 'name',
                    },
                ],
            },
        ],
        v2 = {
            kind: 'ScalarField',
            alias: null,
            name: 'name',
            args: null,
            storageKey: null,
        };
    return {
        kind: 'Request',
        fragment: {
            kind: 'Fragment',
            name: 'addTaskMutation',
            type: 'Mutation',
            metadata: null,
            argumentDefinitions: v0 /*: any*/,
            selections: [
                {
                    kind: 'LinkedField',
                    alias: null,
                    name: 'addTask',
                    storageKey: null,
                    args: v1 /*: any*/,
                    concreteType: 'Task',
                    plural: false,
                    selections: [v2 /*: any*/],
                },
            ],
        },
        operation: {
            kind: 'Operation',
            name: 'addTaskMutation',
            argumentDefinitions: v0 /*: any*/,
            selections: [
                {
                    kind: 'LinkedField',
                    alias: null,
                    name: 'addTask',
                    storageKey: null,
                    args: v1 /*: any*/,
                    concreteType: 'Task',
                    plural: false,
                    selections: [
                        v2 /*: any*/,
                        {
                            kind: 'ScalarField',
                            alias: null,
                            name: 'id',
                            args: null,
                            storageKey: null,
                        },
                    ],
                },
            ],
        },
        params: {
            operationKind: 'mutation',
            name: 'addTaskMutation',
            id: null,
            text:
                'mutation addTaskMutation(\n  $name: String!\n) {\n  addTask(task: {name: $name}) {\n    name\n    id\n  }\n}\n',
            metadata: {},
        },
    };
})();
(node as any).hash = 'a2e29f324b382f5771f917196558ebb0';
export default node;

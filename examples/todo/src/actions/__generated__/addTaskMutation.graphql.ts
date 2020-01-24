/* tslint:disable */
/* eslint-disable */
/* @relayHash 191baf979ef489f708d70ed04515f8ae */

import { ConcreteRequest } from 'relay-runtime';
export type addTaskMutationVariables = {
    name: string;
};
export type addTaskMutationResponse = {
    readonly addTask: {
        readonly task: {
            readonly node: {
                readonly id: string;
                readonly name: string;
            } | null;
        } | null;
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
    task {
      node {
        id
        name
      }
    }
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
                kind: 'LinkedField',
                alias: null,
                name: 'addTask',
                storageKey: null,
                args: [
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
                concreteType: 'AddTaskPayload',
                plural: false,
                selections: [
                    {
                        kind: 'LinkedField',
                        alias: null,
                        name: 'task',
                        storageKey: null,
                        args: null,
                        concreteType: 'TaskEdge',
                        plural: false,
                        selections: [
                            {
                                kind: 'LinkedField',
                                alias: null,
                                name: 'node',
                                storageKey: null,
                                args: null,
                                concreteType: 'Task',
                                plural: false,
                                selections: [
                                    {
                                        kind: 'ScalarField',
                                        alias: null,
                                        name: 'id',
                                        args: null,
                                        storageKey: null,
                                    },
                                    {
                                        kind: 'ScalarField',
                                        alias: null,
                                        name: 'name',
                                        args: null,
                                        storageKey: null,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ];
    return {
        kind: 'Request',
        fragment: {
            kind: 'Fragment',
            name: 'addTaskMutation',
            type: 'Mutation',
            metadata: null,
            argumentDefinitions: v0 /*: any*/,
            selections: v1 /*: any*/,
        },
        operation: {
            kind: 'Operation',
            name: 'addTaskMutation',
            argumentDefinitions: v0 /*: any*/,
            selections: v1 /*: any*/,
        },
        params: {
            operationKind: 'mutation',
            name: 'addTaskMutation',
            id: null,
            text:
                'mutation addTaskMutation(\n  $name: String!\n) {\n  addTask(task: {name: $name}) {\n    task {\n      node {\n        id\n        name\n      }\n    }\n  }\n}\n',
            metadata: {},
        },
    };
})();
(node as any).hash = 'd869e12e1722d9fe6e0f513dd5ab4de6';
export default node;

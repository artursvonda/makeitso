/* tslint:disable */
/* eslint-disable */
/* @relayHash eb81e7d0641990b110bd646e09d6498c */

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from 'relay-runtime';
export type ListsListQueryVariables = {};
export type ListsListQueryResponse = {
    readonly viewer: {
        readonly lists: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly id: string;
                    readonly ' $fragmentRefs': FragmentRefs<'List_list'>;
                } | null;
            } | null> | null;
        } | null;
    } | null;
};
export type ListsListQuery = {
    readonly response: ListsListQueryResponse;
    readonly variables: ListsListQueryVariables;
};

/*
query ListsListQuery {
  viewer {
    lists(first: 100) {
      edges {
        node {
          id
          ...List_list
        }
      }
    }
    id
  }
}

fragment List_list on List {
  id
  name
  tasks(first: 100) {
    edges {
      node {
        id
        ...Task_task
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

fragment Task_task on Task {
  name
  done
}
*/

const node: ConcreteRequest = (function() {
    var v0 = [
            {
                kind: 'Literal',
                name: 'first',
                value: 100,
            },
        ],
        v1 = {
            kind: 'ScalarField',
            alias: null,
            name: 'id',
            args: null,
            storageKey: null,
        },
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
            name: 'ListsListQuery',
            type: 'Query',
            metadata: null,
            argumentDefinitions: [],
            selections: [
                {
                    kind: 'LinkedField',
                    alias: null,
                    name: 'viewer',
                    storageKey: null,
                    args: null,
                    concreteType: 'User',
                    plural: false,
                    selections: [
                        {
                            kind: 'LinkedField',
                            alias: null,
                            name: 'lists',
                            storageKey: 'lists(first:100)',
                            args: v0 /*: any*/,
                            concreteType: 'ListConnection',
                            plural: false,
                            selections: [
                                {
                                    kind: 'LinkedField',
                                    alias: null,
                                    name: 'edges',
                                    storageKey: null,
                                    args: null,
                                    concreteType: 'ListEdge',
                                    plural: true,
                                    selections: [
                                        {
                                            kind: 'LinkedField',
                                            alias: null,
                                            name: 'node',
                                            storageKey: null,
                                            args: null,
                                            concreteType: 'List',
                                            plural: false,
                                            selections: [
                                                v1 /*: any*/,
                                                {
                                                    kind: 'FragmentSpread',
                                                    name: 'List_list',
                                                    args: null,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        operation: {
            kind: 'Operation',
            name: 'ListsListQuery',
            argumentDefinitions: [],
            selections: [
                {
                    kind: 'LinkedField',
                    alias: null,
                    name: 'viewer',
                    storageKey: null,
                    args: null,
                    concreteType: 'User',
                    plural: false,
                    selections: [
                        {
                            kind: 'LinkedField',
                            alias: null,
                            name: 'lists',
                            storageKey: 'lists(first:100)',
                            args: v0 /*: any*/,
                            concreteType: 'ListConnection',
                            plural: false,
                            selections: [
                                {
                                    kind: 'LinkedField',
                                    alias: null,
                                    name: 'edges',
                                    storageKey: null,
                                    args: null,
                                    concreteType: 'ListEdge',
                                    plural: true,
                                    selections: [
                                        {
                                            kind: 'LinkedField',
                                            alias: null,
                                            name: 'node',
                                            storageKey: null,
                                            args: null,
                                            concreteType: 'List',
                                            plural: false,
                                            selections: [
                                                v1 /*: any*/,
                                                v2 /*: any*/,
                                                {
                                                    kind: 'LinkedField',
                                                    alias: null,
                                                    name: 'tasks',
                                                    storageKey: 'tasks(first:100)',
                                                    args: v0 /*: any*/,
                                                    concreteType: 'TaskConnection',
                                                    plural: false,
                                                    selections: [
                                                        {
                                                            kind: 'LinkedField',
                                                            alias: null,
                                                            name: 'edges',
                                                            storageKey: null,
                                                            args: null,
                                                            concreteType: 'TaskEdge',
                                                            plural: true,
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
                                                                        v1 /*: any*/,
                                                                        v2 /*: any*/,
                                                                        {
                                                                            kind: 'ScalarField',
                                                                            alias: null,
                                                                            name: 'done',
                                                                            args: null,
                                                                            storageKey: null,
                                                                        },
                                                                        {
                                                                            kind: 'ScalarField',
                                                                            alias: null,
                                                                            name: '__typename',
                                                                            args: null,
                                                                            storageKey: null,
                                                                        },
                                                                    ],
                                                                },
                                                                {
                                                                    kind: 'ScalarField',
                                                                    alias: null,
                                                                    name: 'cursor',
                                                                    args: null,
                                                                    storageKey: null,
                                                                },
                                                            ],
                                                        },
                                                        {
                                                            kind: 'LinkedField',
                                                            alias: null,
                                                            name: 'pageInfo',
                                                            storageKey: null,
                                                            args: null,
                                                            concreteType: 'PageInfo',
                                                            plural: false,
                                                            selections: [
                                                                {
                                                                    kind: 'ScalarField',
                                                                    alias: null,
                                                                    name: 'endCursor',
                                                                    args: null,
                                                                    storageKey: null,
                                                                },
                                                                {
                                                                    kind: 'ScalarField',
                                                                    alias: null,
                                                                    name: 'hasNextPage',
                                                                    args: null,
                                                                    storageKey: null,
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                                {
                                                    kind: 'LinkedHandle',
                                                    alias: null,
                                                    name: 'tasks',
                                                    args: v0 /*: any*/,
                                                    handle: 'connection',
                                                    key: 'List_tasks',
                                                    filters: null,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        v1 /*: any*/,
                    ],
                },
            ],
        },
        params: {
            operationKind: 'query',
            name: 'ListsListQuery',
            id: null,
            text:
                'query ListsListQuery {\n  viewer {\n    lists(first: 100) {\n      edges {\n        node {\n          id\n          ...List_list\n        }\n      }\n    }\n    id\n  }\n}\n\nfragment List_list on List {\n  id\n  name\n  tasks(first: 100) {\n    edges {\n      node {\n        id\n        ...Task_task\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment Task_task on Task {\n  name\n  done\n}\n',
            metadata: {},
        },
    };
})();
(node as any).hash = '834d4b7c82ccc72e6bd3ab91018e2352';
export default node;

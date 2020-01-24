/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from 'relay-runtime';
export type List_list = {
    readonly id: string;
    readonly name: string;
    readonly tasks: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly ' $fragmentRefs': FragmentRefs<'Task_task'>;
            } | null;
        } | null> | null;
    } | null;
    readonly ' $refType': 'List_list';
};
export type List_list$data = List_list;
export type List_list$key = {
    readonly ' $data'?: List_list$data;
    readonly ' $fragmentRefs': FragmentRefs<'List_list'>;
};

const node: ReaderFragment = (function() {
    var v0 = {
        kind: 'ScalarField',
        alias: null,
        name: 'id',
        args: null,
        storageKey: null,
    };
    return {
        kind: 'Fragment',
        name: 'List_list',
        type: 'List',
        metadata: {
            connection: [
                {
                    count: null,
                    cursor: null,
                    direction: 'forward',
                    path: ['tasks'],
                },
            ],
        },
        argumentDefinitions: [],
        selections: [
            v0 /*: any*/,
            {
                kind: 'ScalarField',
                alias: null,
                name: 'name',
                args: null,
                storageKey: null,
            },
            {
                kind: 'LinkedField',
                alias: 'tasks',
                name: '__List_tasks_connection',
                storageKey: null,
                args: null,
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
                                    v0 /*: any*/,
                                    {
                                        kind: 'ScalarField',
                                        alias: null,
                                        name: '__typename',
                                        args: null,
                                        storageKey: null,
                                    },
                                    {
                                        kind: 'FragmentSpread',
                                        name: 'Task_task',
                                        args: null,
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
        ],
    };
})();
(node as any).hash = '6af4f0dfc9e44d4e2f5dfbce50ea4936';
export default node;

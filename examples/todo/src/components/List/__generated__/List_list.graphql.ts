/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from 'relay-runtime';
export type List_list = {
    readonly name: string;
    readonly tasks: ReadonlyArray<{
        readonly id: string;
        readonly ' $fragmentRefs': FragmentRefs<'Task_task'>;
    }>;
    readonly ' $refType': 'List_list';
};
export type List_list$data = List_list;
export type List_list$key = {
    readonly ' $data'?: List_list$data;
    readonly ' $fragmentRefs': FragmentRefs<'List_list'>;
};

const node: ReaderFragment = {
    kind: 'Fragment',
    name: 'List_list',
    type: 'List',
    metadata: null,
    argumentDefinitions: [],
    selections: [
        {
            kind: 'ScalarField',
            alias: null,
            name: 'name',
            args: null,
            storageKey: null,
        },
        {
            kind: 'LinkedField',
            alias: null,
            name: 'tasks',
            storageKey: null,
            args: null,
            concreteType: 'Task',
            plural: true,
            selections: [
                {
                    kind: 'ScalarField',
                    alias: null,
                    name: 'id',
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
    ],
};
(node as any).hash = 'ff55eae937b7449cd5583e663c46005a';
export default node;

/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Task_task = {
    readonly name: string;
    readonly done: boolean;
    readonly " $refType": "Task_task";
};
export type Task_task$data = Task_task;
export type Task_task$key = {
    readonly " $data"?: Task_task$data;
    readonly " $fragmentRefs": FragmentRefs<"Task_task">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Task_task",
  "type": "Task",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "done",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '13713f1761467e3959ed237cab59eeb4';
export default node;

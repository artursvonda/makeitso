/* tslint:disable */
/* eslint-disable */
/* @relayHash d003c51c5dbca343ed121ef44232f37f */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ListsListQueryVariables = {};
export type ListsListQueryResponse = {
    readonly viewer: {
        readonly lists: ReadonlyArray<{
            readonly " $fragmentRefs": FragmentRefs<"List_list">;
        }>;
    } | null;
};
export type ListsListQuery = {
    readonly response: ListsListQueryResponse;
    readonly variables: ListsListQueryVariables;
};



/*
query ListsListQuery {
  viewer {
    lists {
      ...List_list
      id
    }
    id
  }
}

fragment List_list on List {
  name
  tasks {
    ...Task_task
  }
}

fragment Task_task on Task {
  name
  done
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ListsListQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "lists",
            "storageKey": null,
            "args": null,
            "concreteType": "List",
            "plural": true,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "List_list",
                "args": null
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ListsListQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "lists",
            "storageKey": null,
            "args": null,
            "concreteType": "List",
            "plural": true,
            "selections": [
              (v0/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "tasks",
                "storageKey": null,
                "args": null,
                "concreteType": "Task",
                "plural": true,
                "selections": [
                  (v0/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "done",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              (v1/*: any*/)
            ]
          },
          (v1/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ListsListQuery",
    "id": null,
    "text": "query ListsListQuery {\n  viewer {\n    lists {\n      ...List_list\n      id\n    }\n    id\n  }\n}\n\nfragment List_list on List {\n  name\n  tasks {\n    ...Task_task\n  }\n}\n\nfragment Task_task on Task {\n  name\n  done\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '788acb2bcff380fb2dd4568e0a5cd5b6';
export default node;

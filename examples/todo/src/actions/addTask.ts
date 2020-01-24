import graphql from 'babel-plugin-relay/macro';
import { commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime/lib/store/RelayStoreTypes';
import { addTaskMutation } from './__generated__/addTaskMutation.graphql';

const mutation = graphql`
    mutation addTaskMutation($name: String!) {
        addTask(task: { name: $name }) {
            task {
                node {
                    id
                    name
                }
            }
        }
    }
`;

export default (environment: Environment, listId: string, name: string) =>
    commitMutation<addTaskMutation>(environment, {
        mutation,
        variables: { name },
        optimisticResponse: {
            addTask: {
                task: {
                    node: {
                        id: 'test',
                        name,
                    },
                },
            },
        },
        configs: [
            {
                type: 'RANGE_ADD',
                parentID: listId,
                connectionInfo: [
                    {
                        key: 'List_tasks',
                        rangeBehavior: 'append',
                    },
                ],
                edgeName: 'task',
            },
        ],
        // updater: (store, payload) => {
        //     const task = payload.addTask.task;
        //     const list = store.get(listId);
        //     const conn = ConnectionHandler.getConnection(list!, 'List_tasks');
        //     console.log(conn);
        // },
        onCompleted: (response, errors) => {
            console.log('Response received from server.');
        },
        onError: err => console.error(err),
    });

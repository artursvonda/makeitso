import graphql from 'babel-plugin-relay/macro';
import { commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime/lib/store/RelayStoreTypes';

const mutation = graphql`
    mutation addTaskMutation($name: String!) {
        addTask(task: { name: $name }) {
            name
        }
    }
`;

export default (environment: Environment, name: string) =>
    commitMutation(environment, {
        mutation,
        variables: { name },
        onCompleted: (response, errors) => {
            console.log('Response received from server.');
        },
        onError: err => console.error(err),
    });

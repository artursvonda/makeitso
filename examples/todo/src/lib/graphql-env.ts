import { Environment, Network, RecordSource, Store } from 'relay-runtime';

const environment = new Environment({
    network: Network.create((operation, variables) =>
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: operation.text,
                variables,
            }),
        }).then(response => response.json()),
    ),
    store: new Store(new RecordSource()),
});

export default environment;

import React from 'react';
import { graphql, QueryRenderer } from 'react-relay';
import environment from '../../lib/graphql-env';
import Task from '../Task';

const query = graphql`
    query ListsListQuery {
        # The root field for the query
        viewer {
            # A reference to your fragment container
            ...Task_task
        }
    }
`;

// You can usually have use one query renderer per page
// and it represents the root of a query
const Lists = () => (
    <QueryRenderer
        environment={environment}
        query={query}
        variables={{}}
        render={({ error, props }) => {
            if (error) {
                return <div>{error.message}</div>;
            } else if (props) {
                return <Task task={props.task} />;
            }
            return <div>Loading</div>;
        }}
    />
);

export default Lists;

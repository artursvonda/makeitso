import graphql from 'babel-plugin-relay/macro';
import React from 'react';
import { QueryRenderer } from 'react-relay';
import environment from '../../lib/graphql-env';
import List from '../List';
import { ListsListQuery } from './__generated__/ListsListQuery.graphql';

const query = graphql`
    query ListsListQuery {
        # The root field for the query
        viewer {
            lists {
                ...List_list
            }
        }
    }
`;

// You can usually have use one query renderer per page
// and it represents the root of a query
const Lists = () => (
    <QueryRenderer<ListsListQuery>
        environment={environment}
        query={query}
        variables={{}}
        render={({ error, props }) => {
            if (error) {
                console.log(error);

                return <div>Err: {error.message}</div>;
            } else if (props && props.viewer) {
                return (
                    <>
                        {props.viewer.lists.map(list => (
                            <List list={list} />
                        ))}
                    </>
                );
            }

            return <div>Loading</div>;
        }}
    />
);

export default Lists;

import graphql from 'babel-plugin-relay/macro';
import React, { FC } from 'react';
import { createFragmentContainer } from 'react-relay';
import AddTask from '../AddTask';
import Task from '../Task';
import { List_list } from './__generated__/List_list.graphql';

interface Props {
    list: List_list;
}

const List: FC<Props> = ({ list: { id, name, tasks } }) => (
    <div>
        <h2>{name}</h2>
        {tasks?.edges
            ?.filter(edge => !!edge?.node)
            .map(edge => (
                <Task key={edge!.node!.id} task={edge!.node!} />
            ))}
        <AddTask listId={id} />
    </div>
);

export default createFragmentContainer(List, {
    list: graphql`
        fragment List_list on List {
            id
            name
            tasks(first: 100) @connection(key: "List_tasks") {
                edges {
                    node {
                        id
                        ...Task_task
                    }
                }
            }
        }
    `,
});

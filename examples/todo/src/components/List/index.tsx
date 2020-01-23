import graphql from 'babel-plugin-relay/macro';
import React, { FC } from 'react';
import { createFragmentContainer } from 'react-relay';
import Task from '../Task';
import { List_list } from './__generated__/List_list.graphql';

interface Props {
    list: List_list;
}

const List: FC<Props> = ({ list: { name, tasks } }) => (
    <div>
        <h2>{name}</h2>
        {tasks.map(task => (
            <Task key={task.id} task={task} />
        ))}
    </div>
);

export default createFragmentContainer(List, {
    list: graphql`
        fragment List_list on List {
            name
            tasks {
                id
                ...Task_task
            }
        }
    `,
});

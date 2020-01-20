import React, { FC } from 'react';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import { Task_task } from './__generated__/Task_task.graphql';

interface Props {
    task: Task_task;
}

const Task: FC<Props> = ({ task: { name, done } }) => (
    <div>
        <input type="checkbox" checked={done} /> {name}
    </div>
);

export default createFragmentContainer(Task, {
    task: graphql`
        fragment Task_task on Task {
            name
            done
        }
    `,
});

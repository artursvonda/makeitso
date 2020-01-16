import React, { FC } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

interface Props {
    task: {
        name: string;
        done: boolean;
    };
}

const Task: FC<Props> = ({ task: { name, done } }) => (
    <div>
        <input type="checkbox" checked={done} /> {name}
    </div>
);

const task = graphql`
    fragment Task_task on Task {
        name
        done
    }
`;

export default createFragmentContainer(Task, { task });

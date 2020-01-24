import React, { ChangeEvent, FC, FormEvent, useCallback, useState } from 'react';
import addTask from '../../actions/addTask';
import environment from '../../lib/graphql-env';

interface Props {
    listId: string;
}

const AddTask: FC<Props> = ({ listId }) => {
    const [task, setTask] = useState('');
    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setTask(event.target.value);
    }, []);
    const handleAdd = useCallback(
        (e: FormEvent) => {
            e.preventDefault();

            addTask(environment, listId, task);
            setTask('');
        },
        [listId, task],
    );

    return (
        <form onSubmit={handleAdd}>
            <input type="text" onChange={handleChange} value={task} />
            <button type="submit">Add</button>
        </form>
    );
};

export default AddTask;

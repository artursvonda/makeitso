import React, { ChangeEvent, FC, useCallback, useState } from 'react';
import addTask from '../../actions/addTask';
import environment from '../../lib/graphql-env';

interface Props {}

const AddTask: FC<Props> = () => {
    const [task, setTask] = useState('');
    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setTask(event.target.value);
    }, []);
    const handleAdd = useCallback(() => {
        addTask(environment, task);
    }, [task]);

    return (
        <div>
            <input type="text" onChange={handleChange} value={task} />
            <button type="submit" onClick={handleAdd}>
                Add
            </button>
        </div>
    );
};

export default AddTask;

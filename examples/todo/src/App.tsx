import React from 'react';
import styled from 'styled-components';
import AddTask from './components/AddTask';
import Lists from './components/Lists';

// const user = 'daf05c2f-f0b3-44cb-b602-09f71c675f70';

const Container = styled.div`
    margin: 0 auto;
    max-width: 500px;
`;

const App: React.FC = () => (
    <Container>
        <Lists />
        <AddTask />
    </Container>
);

export default App;

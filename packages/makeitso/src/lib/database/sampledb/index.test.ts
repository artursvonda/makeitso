import * as path from 'path';
import { initWithSamplesFromDir } from './index';

const getFixturesDir = (dir: string) => path.resolve(__dirname, '__fixtures__', dir);

describe('initWithSamplesFromDir', () => {
    it('initialises with json samples', async done => {
        const db = await initWithSamplesFromDir(getFixturesDir('Json'));
        expect(db.find({})).toMatchObject([{ id: '1', name: 'name', __typename: 'Obj' }]);
        done();
    });

    it('initialises with javascript samples', async done => {
        const db = await initWithSamplesFromDir(getFixturesDir('Js'));
        expect(db.find({})).toMatchObject([{ id: '1', name: 'name', __typename: 'Obj' }]);
        done();
    });
});

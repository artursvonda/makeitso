import { Base } from '../../base';

export default class CustomNested extends Base<{}> {
    string() {
        return 'custom';
    }
}

import { Base } from '../../Base';

export default class CustomNested extends Base<{}> {
    string() {
        return 'custom';
    }
}

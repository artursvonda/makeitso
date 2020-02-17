import { Base } from '../../base';

export default class Nested extends Base<{}> {
    get(args: { arg: string }) {
        return args.arg;
    }
}

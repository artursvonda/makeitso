import { Base } from '../../Base';

export default class Nested extends Base<{}> {
    get(args: { arg: string }) {
        return args.arg;
    }
}

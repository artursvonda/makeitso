import { Base } from '../../Base';

export default class Query extends Base<{}> {
    get(args: { arg: string }) {
        return args.arg;
    }
}

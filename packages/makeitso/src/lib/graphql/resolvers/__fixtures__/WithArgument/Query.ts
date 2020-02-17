import { Base } from '../../base';

export default class Query extends Base<{}> {
    get(args: { arg: string }) {
        return args.arg;
    }
}

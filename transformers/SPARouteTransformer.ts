import * as eta from "../eta";
import * as querystring from "querystring";

export default class SPARouteTransformer extends eta.IRequestTransformer {
    private static prefixes: string[];
    public async onRequest(): Promise<void> {
        if (!SPARouteTransformer.prefixes) {
            SPARouteTransformer.prefixes = (await Promise.all(this.server.app.getActionsWithFlag<string[]>("spaRoute", this)
                .map(({ action }) => action())))
                .reduce((p, v) => p.concat(v), []);
        }
        const prefix = SPARouteTransformer.prefixes.find(p => this.req.mvcPath.startsWith(p + "/"));
        if (!prefix) return;
        this.redirect(prefix + "?" + querystring.stringify(eta._.defaults(this.req.query, {
            "_spaPath": this.req.mvcPath
        })));
    }
}

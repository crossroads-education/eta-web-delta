import * as eta from "../eta";
import * as querystring from "querystring";

export default class SPARouteTransformer extends eta.IRequestTransformer {
    private static prefixes: string[];
    public async onRequest(): Promise<void> {
        if (this.req.headers["x-eta-delta-component"]) return; // don't transform these
        if (!SPARouteTransformer.prefixes) {
            // build prefixes array
            SPARouteTransformer.prefixes = this.server.app.getActionsWithFlag("spaRoute", this)
                .map(a => <string>a.flagValue);
        }
        // check if a prefix exists for this request
        const prefix = SPARouteTransformer.prefixes.find(p => this.req.mvcPath.startsWith(p + "/"));
        if (!prefix) return; // if not, ignore this request
        // redirect with _spaPath parameter (handled on client-side)
        this.redirect(prefix + "?" + querystring.stringify(eta._.defaults(this.req.query, {
            "_deltaPath": this.req.mvcPath
        })));
    }
}

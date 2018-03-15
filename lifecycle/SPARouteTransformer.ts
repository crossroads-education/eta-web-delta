import * as eta from "../eta";
import * as querystring from "querystring";

export default class SPARouteTransformer extends eta.LifecycleHandler {
    private prefixes: string[];

    public register(): void {
        this.app.on("app:start", this.onAppStart.bind(this));
        this.app.on("request", this.onRequest.bind(this));
    }

    private async onAppStart(): Promise<void> {
        // build prefixes array
        this.prefixes = this.app.getActionsWithFlag("spaRoute", <any>{})
            .map(a => <string>a.flagValue);
    }

    private async onRequest(http: eta.IRequestHandler): Promise<void> {
        if (http.req.headers["x-eta-delta-component"]) return; // don't transform these
        // check if a prefix exists for this request
        const prefix = this.prefixes.find(p => http.req.mvcPath.startsWith(p + "/"));
        if (!prefix) return; // if not, ignore this request
        // redirect with _spaPath parameter (handled on client-side)
        http.redirect(prefix + "?" + querystring.stringify(eta._.defaults(http.req.query, {
            "_deltaPath": http.req.mvcPath
        })));
    }
}

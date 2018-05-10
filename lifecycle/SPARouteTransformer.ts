import * as eta from "@eta/eta";
import * as querystring from "querystring";

export default class SPARouteTransformer extends eta.LifecycleHandler {
    private routes: {
        prefix: string;
        isRoutable(path: string): boolean
    }[];

    public register(): void {
        this.app.on("database:connect", this.onDatabaseConnect.bind(this));
        this.app.on("request", this.onRequest.bind(this));
    }

    private async onDatabaseConnect(): Promise<void> {
        // build prefixes array
        this.routes = this.app.getActionsWithFlag("spa", undefined)
            .map(a => <any>a.flagValue);
    }

    private async onRequest(http: eta.RequestHandler): Promise<void> {
        if (http.req.headers["x-eta-delta-component"]) return; // don't transform these
        // check if a valid route exists for this request
        const route = this.routes.find(r =>
            http.req.mvcPath.startsWith(r.prefix + "/") &&
            r.isRoutable(http.req.mvcPath));
        if (!route) return; // if not, ignore this request
        // redirect with _deltaPath parameter (handled on client-side)
        http.redirect(route.prefix + "?" + querystring.stringify(eta._.defaults(http.req.query, {
            "_deltaPath": http.req.mvcPath
        })));
    }
}

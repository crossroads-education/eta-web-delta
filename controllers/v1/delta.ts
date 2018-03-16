import * as eta from "../../eta";
import * as db from "../../db";

@eta.mvc.route("/delta/v1")
@eta.mvc.controller()
export default class DeltaController extends eta.IHttpController {
    @eta.mvc.raw()
    @eta.mvc.get()
    public async routes({ basePath }: { basePath: string}): Promise<void> {
        const routes: string[] = [];
        Object.keys(this.server.app.staticFiles).forEach(r => {
            if (!r.endsWith(".js")) return;
            r = r.replace(/\.js$/, "");
            // check that the route comes from the base directory and is not the base file itself
            if (r.startsWith(basePath) && r !== basePath) {
                routes.push(r.substring(basePath.length));
            }
        });
        this.result(db.GenericApiResult.Success, { routes });
    }
}

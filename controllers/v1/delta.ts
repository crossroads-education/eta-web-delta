import * as eta from "../../eta";
import * as db from "../../db";

@eta.mvc.route("/delta/v1")
@eta.mvc.controller()
export default class DeltaController extends eta.IHttpController {
    @eta.mvc.raw()
    @eta.mvc.post()
    public async getRoutes( { basePath }: { basePath: string} ): Promise<void> {
        const routes: string[] = [];
        // get routes from Eta Application
        Object.keys(this.server.app.viewFiles).forEach(r => {
            const route: any = r.split("/");
            // check that the route comes from the base directory and is not the base file itself
            if (route.slice(0, 2).join("/") === basePath && r !== basePath) {
                // push the route without the base path prefix
                routes.push("/" + route.slice(2).join("/"));
            }
        });
        this.result(db.GenericApiResult.Success, { routes });
    }
}

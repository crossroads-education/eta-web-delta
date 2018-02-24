import * as eta from "../../eta";
import * as db from "../../db";

@eta.mvc.route("/delta/v1")
@eta.mvc.controller()
export default class DeltaController extends eta.IHttpController {
    @eta.mvc.raw()
    @eta.mvc.post()
    public async getRoutes( { basePath }: { basePath: string} ): Promise<void> {
        let routes: string[] = [];
        // Get routes from Eta Application
        Object.keys(this.server.app.viewFiles).forEach(r => {
            let route: any = r.split("/")
            // Check that it comes from a Delta directory and is not the base file
            if (route.slice(0,2).join("/") === basePath && r !== basePath) {
                // Push the route without the prefix
                routes.push("/" + route.slice(2).join("/"));
            }
        });
        this.result(db.GenericApiResult.Success, { routes });
    }
}

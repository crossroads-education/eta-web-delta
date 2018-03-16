import * as eta from "../../eta";
import * as db from "../../db";

@eta.mvc.route("/delta/v1")
@eta.mvc.controller()
export default class DeltaController extends eta.IHttpController {
    @eta.mvc.raw()
    @eta.mvc.get()
    public async routes({ basePath }: { basePath: string}): Promise<void> {
        this.result(db.GenericApiResult.Success, {
            routes: Object.keys(this.server.app.viewFiles).filter(mvcPath =>
                mvcPath.startsWith(basePath + "/") &&
                this.server.app.staticFiles[`/js${mvcPath}.js`] !== undefined
            ).map(mvcPath => mvcPath.substring(basePath.length))
        });
    }
}

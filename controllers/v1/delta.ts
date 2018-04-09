import * as eta from "@eta/eta";
import * as db from "@eta/db";

@eta.controller("/delta/v1")
export default class DeltaController extends eta.HttpController {
    async routes(basePath: string) {
        return {
            result: db.GenericApiResult.Success,
            routes: Object.keys(this.server.app.viewFiles).filter(mvcPath =>
                mvcPath.startsWith(basePath + "/") &&
                this.server.app.staticFiles[`/js${mvcPath}.js`] !== undefined
            ).map(mvcPath => mvcPath.substring(basePath.length))
        };
    }
}

import * as eta from "../eta";
import * as db from "../db";

@eta.mvc.route("/")
@eta.mvc.controller()
export default class DeltaController extends eta.IHttpController {
    @eta.mvc.flags({
        "spaRoute": "/delta" // mark /delta as a SPA
    })
    @eta.mvc.get()
    public async delta(): Promise<void> { }
}

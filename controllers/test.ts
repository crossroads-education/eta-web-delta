import * as eta from "../eta";
import * as db from "../db";

@eta.mvc.route("/test")
@eta.mvc.controller()
export default class TestController extends eta.IHttpController {
    @eta.mvc.flags({
        "spaRoute": "/test/" // mark /test/index as a SPA
    })
    @eta.mvc.get()
    public async index(): Promise<void> {
        // TODO: Implement
    }

}

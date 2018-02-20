import * as eta from "../eta";
import * as db from "../db";

@eta.mvc.route("/")
@eta.mvc.controller()
export default class TestController extends eta.IHttpController {
    @eta.mvc.flags({
        "spaRoute": "/test" // mark /test as a SPA
    })
    @eta.mvc.get()
    public async test(): Promise<void> { }
}

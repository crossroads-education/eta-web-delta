import * as eta from "../eta";
import * as db from "../db";

@eta.mvc.route("/test")
@eta.mvc.controller()
export default class TestController extends eta.IHttpController {
    @eta.mvc.get()
    public async index(): Promise<void> {
        // TODO: Implement
    }

    @eta.mvc.flags({
        "spaRoute": true
    })
    public async testSPA(): Promise<string[]> {
        return ["/test/index"];
    }
}

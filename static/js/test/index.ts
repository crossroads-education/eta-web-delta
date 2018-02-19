import Navigo from "navigo";

$(document).ready(function() {
    const router = new Navigo(undefined, false);

    router.on("/*", function() {
        $("#root").load("./content");
    }).resolve();
});

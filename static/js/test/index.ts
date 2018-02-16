import Navigo from "navigo";

$(document).ready(function() {
    const router = new Navigo(null, false);

    router.on("/*", function() {
        $("#root").load("./content");
        }).resolve();
});

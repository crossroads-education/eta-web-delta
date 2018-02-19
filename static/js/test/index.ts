import Navigo from "navigo";

// polyfill for this since it's unsupported in IE (and most Edge versions)
import URLSearchParamsPolyfill from "url-search-params";
("URLSearchParams" in window) || (window.URLSearchParams = URLSearchParamsPolyfill);

$(document).ready(function() {
    const router = new Navigo(undefined, false);
    router.on("/*", function() {
        $("#root").load("/test/content");
    });
    if (window.location.search.includes("_spaPath")) {
        const params = new URLSearchParams(window.location.search);
        const originalPath = params.get("_spaPath");
        params.delete("_spaPath");
        let newPath = originalPath + "?" + params.toString();
        if (newPath.slice(-1)[0] === "?") newPath = originalPath;
        router.navigate(newPath, true);
    } else {
        router.resolve();
    }
});

import Navigo from "navigo";

// polyfill for URL parameter parser since it's unsupported in IE (and most Edge versions)
import URLSearchParamsPolyfill from "url-search-params";
("URLSearchParams" in window) || (window.URLSearchParams = URLSearchParamsPolyfill);

const routes: any = ["test/navAway", "test/landing"];


/*
router.on("test", function() {
    // NOTE absolute paths are important, since the relative root may change
    $("#root").load("/test/content");
});
router.on("test/navAway", () => {
    $("#root").load("/test/navAway");
});
*/
$(document).ready(function() {
    const router = new Navigo(undefined, false);
    router.on("test", function() {
        $("#root").load("/test/landing");
        console.log("load bitch");
    });
    for (const r of routes) {
        router.on(r, function() {
            $("#root").load("/" + r);
        });
    }

    if (window.location.search.includes("_spaPath")) {
        // build a parameter parser
        const params = new URLSearchParams(window.location.search);
        // _spaPath is the server-set original path (redirected from)
        const originalPath = params.get("_spaPath");
        // remove _spaPath so we can recreate the original query string
        params.delete("_spaPath");
        // recreate original query string
        let newPath = originalPath;
       // if there were other params, add them back
       if (params.toString()) newPath = originalPath + "?" + params.toString();
        // re-route to the correct path
        router.navigate(newPath, true);
    } else {
        // user loaded the SPA's root, no need to handle server redirects
        router.resolve();

    }
});

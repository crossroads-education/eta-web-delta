import Navigo from "navigo";

// polyfill for URL parameter parser since it's unsupported in IE (and most Edge versions)
import URLSearchParamsPolyfill from "url-search-params";
("URLSearchParams" in window) || (window.URLSearchParams = URLSearchParamsPolyfill);

// Get array of route paths from Application object
const routes: any = ["test/navAway", "test/landing"];

function renderContent(path: string) {
    $("#cssRoot, #root").html("");
    // TODO Implement error handling to handle views/js/css not found - fs.stat?
    $("#cssRoot").load("/css" + path + ".css");
    $("#root").load(path);
    SystemJS.import("/js" + path + ".js");
}

$(document).ready(function() {
    const router = new Navigo(undefined, false);
    // Router to retrieve base page's actual content
    router.on("test", function() {
        router.navigate("/test/landing");
    }).resolve();
    // Universal router - for each route passed, render that page's full content
    for (const r of routes) {
        router.on(r, function() {
            renderContent("/" + r);
        }).resolve();
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

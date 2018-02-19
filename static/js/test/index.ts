import Navigo from "navigo";

// polyfill for URL parameter parser since it's unsupported in IE (and most Edge versions)
import URLSearchParamsPolyfill from "url-search-params";
("URLSearchParams" in window) || (window.URLSearchParams = URLSearchParamsPolyfill);

const routes: any = ["test/navAway", "test/landing"];

function renderContent(path: string) {
    $("#root").load(path);
}

$(document).ready(function() {
    const router = new Navigo(undefined, false);
    // Router to retrieve "index" page content
    router.on("test", function() {
        renderContent("/test/landing");
    }).resolve();
    // Universal router for each route passed, render that page's content
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

import Navigo from "navigo";

// polyfill for URL parameter parser since it's unsupported in IE (and most Edge versions)
import URLSearchParamsPolyfill from "url-search-params";
("URLSearchParams" in window) || ((<any>window).URLSearchParams = URLSearchParamsPolyfill);

function renderContent(path: string) {
    $("#root, #cssRoot").html("");
    // TODO figure out how to retrieve view metadata to import additional css and js files
    const isBase: boolean = path.slice(-1)[0] === "/";
    if (!isBase) {
        $("#cssRoot").load("/css" + path + ".css");
    }
    $.ajax({
        url: path,
        method: "GET",
        beforeSend: xhr => {
            xhr.setRequestHeader("x-eta-spacomponent", "true");
        },
        success: data => {
            $("#root").html(data);
        }
    }).done(() => {
        if (!isBase) {
            SystemJS.import("/js" + path + ".js");
        }
    });
}

const routes = ["/index", "/", "/navAway"];

$(document).ready(function() {
    const basePath = window.location.pathname;
    const router = new Navigo("http://localhost:3000" + basePath, false);
    // Universal router for each route passed, render that page's content
    for (const r of routes) {
        router.on(r, (p, x) => {
            renderContent(basePath + r);
        }).resolve();
    }
    router.on("/", () => {
        router.navigate("/index", false);
    });
    router.updatePageLinks();
    // handle server redirection
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
        if (params.toString()) newPath += "?" + params.toString();
        // re-route to the correct path
        router.navigate(newPath.substring(basePath.length), false);
    } else {
        // user loaded the SPA's root, no need to handle server redirects
        router.navigate("/index", false);
    }
    router.resolve();
});

import Navigo from "navigo";

// polyfill for URL parameter parser since it's unsupported in IE (and most Edge versions)
import URLSearchParamsPolyfill from "url-search-params";

("URLSearchParams" in window) || ((<any>window).URLSearchParams = URLSearchParamsPolyfill);

function renderContent(path: string) {
    $("#root").html("");
    $.ajax({
        url: path,
        method: "GET",
        beforeSend: xhr => {
            xhr.setRequestHeader("x-eta-delta-component", "true");
        },
        success: view => {
            // hide root until CSS is loaded
            $("#root").css("display", "none").html(view);
            // build promises to wait for all <link>s to load
            Promise.all($("#root link").toArray().map(e =>
                new Promise((resolve, reject) => {
                    // handle errors and loads equally
                    // if we reject the promise, we'd miss other links that might load fine
                    $(e).on("load", resolve).on("error", resolve);
                })
            )).then(() => {
                $("#root").removeAttr("style"); // unhide root
            });
        }
    });
}

async function setupRoutes(basePath: string, router: Navigo): Promise<void> {
    let routes: string[];
    // Retrieve this directory's routes before acting on them
    await $.post("/delta/v1/getRoutes", { basePath }, info => {
        routes = info.routes;
    });
    // Router to handle base page
    router.on("/", () => {
        router.navigate("/index", false);
    });
    // Universal router: for each route passed, render that page's content
    for (const r of routes) {
        router.on(r, (p, x) => {
            renderContent(basePath + r);
        });
    }
    router.updatePageLinks();
    router.resolve();
}

$(document).ready(function() {
    const basePath = window.location.pathname;
    const router = new Navigo("http://localhost:3000" + basePath, false);
    setupRoutes(basePath, router);
    // build a parameter parser
    const urlParams = new URLSearchParams(window.location.search);
    // handle server redirection
    if (urlParams.has("_deltaPath")) {
        // _spaPath is the server-set original path (redirected from)
        const originalPath = urlParams.get("_deltaPath");
        // remove _spaPath so we can recreate the original query string
        urlParams.delete("_deltaPath");
        // recreate original query string with params if necessary
        const newPath = originalPath.substring(basePath.length) + (urlParams.toString() ? "?" + urlParams.toString() : "");
        // re-route to the correct path
        router.navigate(newPath, false);
    }
});

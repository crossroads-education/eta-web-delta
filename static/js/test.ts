import Navigo from "navigo";
import * as Handlebars from "handlebars";

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
        success: html => {
            // Prepare Handlebars template from the raw HTML
            const template = Handlebars.compile(html);
            // Need to get context and helpers
            const view = template({});
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

const routes = ["/index", "/navAway"];

$(document).ready(function() {
    const basePath = window.location.pathname;
    const router = new Navigo("http://localhost:3000" + basePath, false);
    router.on("/", () => {
        router.navigate("/index", false);
    });
    // Universal router for each route passed, render that page's content
    for (const r of routes) {
        router.on(r, (p, x) => {
            renderContent(basePath + r);
        });
    }
    router.updatePageLinks();
    // build a parameter parser
    const urlParams = new URLSearchParams(window.location.search);
    // handle server redirection
    if (urlParams.has("_deltaPath")) {
        // _spaPath is the server-set original path (redirected from)
        const originalPath = urlParams.get("_deltaPath");
        // remove _spaPath so we can recreate the original query string
        urlParams.delete("_deltaPath");
        // recreate original query string
        const newPath = originalPath.substring(basePath.length) + (urlParams.toString() ? "?" + urlParams.toString() : ""); // if there were other params, add them back
        // re-route to the correct path
        router.navigate(newPath, false);
    }
    router.resolve();
});

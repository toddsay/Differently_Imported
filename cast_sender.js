(function() {
    var e = function() { var a = window.navigator.userAgent.match(/Chrome\/([0-9]+)/); return a ? parseInt(a[1], 10) : 0 },
        f = function(a) { return document.currentScript && (-1 != document.currentScript.src.indexOf("?" + a) || -1 != document.currentScript.src.indexOf("&" + a)) },
        g = f("loadGamesSDK") ? "/cast_game_sender.js" : "/cast_sender.js",
        h = f("loadCastFramework"),
        k = function() { return "function" == typeof window.__onGCastApiAvailable ? window.__onGCastApiAvailable : null },
        l = ["boadgeojelhgndaghljhdicfkmllpafd", "dliochdbjfkdbacpmhlcpmleaejidimm",
            "enhhojjnijigcajfphajepfemndkmdlo", "fmfcbgogabcbclcofgocippekhfcmgfj"
        ],
        m = ["pkedcjkdefgpdelpbcmbmeomcjbeemfm", "fjhoaacokmgbjemoflkofnenfaiekifl"],
        n = 50 <= e() ? m.concat(l) : l.concat(m),
        p = function(a, c) {
            var b = new XMLHttpRequest;
            b.onreadystatechange = function() { 4 == b.readyState && 200 == b.status && c(!0) };
            b.onerror = function() { c(!1) };
            try { b.open("GET", a, !0), b.send() } catch (d) { c(!1) }
        },
        t = function(a) {
            if (a >= n.length) q();
            else {
                var c = n[a],
                    b = "chrome-extension://" + c + g;
                0 <= l.indexOf(c) ? p(b, function(d) {
                    d ? (window.chrome.cast = window.chrome.cast || {}, window.chrome.cast.extensionId = c, r(b, q)) : t(a + 1)
                }) : r(b, function() { t(a + 1) })
            }
        },
        r = function(a, c, b) {
            var d = document.createElement("script");
            d.onerror = c;
            b && (d.onload = b);
            d.src = a;
            (document.head || document.documentElement).appendChild(d)
        },
        q = function() {
            var a = k();
            a && a(!1, "No cast extension found")
        },
        u = function() {
            if (h) {
                var a = 2,
                    c = k(),
                    b = function() {
                        a--;
                        0 == a && c && c(!0)
                    };
                window.__onGCastApiAvailable = b;
                r("cast_framework.js", q, b)
            }
        };
    a: {
        if (0 <= window.navigator.userAgent.indexOf("CriOS")) {
            var v = window.__gCrWeb && window.__gCrWeb.message && window.__gCrWeb.message.invokeOnHost;
            if (v) {
                u();
                v({ command: "cast.sender.init" });
                break a
            }
        }
        if (window.chrome) {
            u();
            var w = window.navigator.userAgent;
            if (0 <= w.indexOf("Android") && 0 <= w.indexOf("Chrome/") && window.navigator.presentation) {
                var x = "",
                    y = e();
                55 <= y ? x = "55" : 50 <= y && (x = "50");
                r("//www.gstatic.com/eureka/clank" + x + g, q)
            } else t(0)
        } else q()
    };
})();
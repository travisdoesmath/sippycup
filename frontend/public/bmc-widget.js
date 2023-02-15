!function(e) {
    var t = {};
    function n(o) {
        if (t[o])
            return t[o].exports;
        var a = t[o] = {
            i: o,
            l: !1,
            exports: {}
        };
        return e[o].call(a.exports, a, a.exports, n),
        a.l = !0,
        a.exports
    }
    n.m = e,
    n.c = t,
    n.d = function(e, t, o) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: o
        })
    }
    ,
    n.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    n.t = function(e, t) {
        if (1 & t && (e = n(e)),
        8 & t)
            return e;
        if (4 & t && "object" == typeof e && e && e.__esModule)
            return e;
        var o = Object.create(null);
        if (n.r(o),
        Object.defineProperty(o, "default", {
            enumerable: !0,
            value: e
        }),
        2 & t && "string" != typeof e)
            for (var a in e)
                n.d(o, a, function(t) {
                    return e[t]
                }
                .bind(null, a));
        return o
    }
    ,
    n.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        }
        : function() {
            return e
        }
        ;
        return n.d(t, "a", t),
        t
    }
    ,
    n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    ,
    n.p = "",
    n(n.s = 0)
}([function(e, t, n) {
    var o = document.querySelector('script[data-name="BMC-Widget"]');
    window.addEventListener("DOMContentLoaded", (function() {
        new FontFace("Avenir Book1","url(https://bmc-cdn.nyc3.digitaloceanspaces.com/Fonts/710789a0-1557-48a1-8cec-03d52d663d74.eot)"),
        new FontFace("Avenir Book2","url(https://bmc-cdn.nyc3.digitaloceanspaces.com/Fonts/710789a0-1557-48a1-8cec-03d52d663d74.eot)"),
        new FontFace("Avenir Book3","url(https://bmc-cdn.nyc3.digitaloceanspaces.com/Fonts/710789a0-1557-48a1-8cec-03d52d663d74.eot)"),
        new FontFace("Avenir Book4","url(https://bmc-cdn.nyc3.digitaloceanspaces.com/Fonts/65d75eb0-2601-4da5-a9a4-9ee67a470a59.woff)"),
        new FontFace("Avenir Book5","url(https://bmc-cdn.nyc3.digitaloceanspaces.com/Fonts/65d75eb0-2601-4da5-a9a4-9ee67a470a59.woff)");
        new FontFace("Avenir Book6","url(https://bmc-cdn.nyc3.digitaloceanspaces.com/Fonts/65d75eb0-2601-4da5-a9a4-9ee67a470a59.woff)").load().then((function(e) {
            document.fonts.add(e)
        }
        )).catch((function(e) {}
        ));
        var e = document.createElement("div");
        e.id = "bmc-wbtn",
        e.style.display = "none",
        e.style.opacity = 0,
        e.style.alignItems = "center",
        e.style.justifyContent = "center",
        e.style.width = "64px",
        e.style.height = "64px",
        e.style.background = o.dataset.color,
        e.style.color = "white",
        e.style.borderRadius = "32px",
        e.style.position = "fixed",
        "left" == o.dataset.position ? e.style.left = o.dataset.x_margin + "px" : e.style.right = o.dataset.x_margin + "px",
        e.style.bottom = o.dataset.y_margin + "px",
        e.style.boxShadow = "0 4px 8px rgba(0,0,0,.4)",
        e.innerHTML = '<img src="https://cdn.buymeacoffee.com/widget/assets/coffee%20cup.svg" alt="Buy Me A Coffee" style="height: 40px; width: 40px; margin: 0; padding: 0;">',
        e.style.zIndex = "9999",
        e.style.cursor = "pointer",
        e.style.fontWeight = "600",
        e.style.transition = "all .2s ease";
        var t = document.createElement("div");
        t.style.position = "fixed",
        t.style.top = "0",
        t.style.left = "0",
        t.style.width = "0",
        t.style.height = "0",
        t.style.background = "rgba(0, 0, 0, 0)",
        t.style.textAlign = "center",
        t.style.zIndex = "99999";
        var n = document.createElement("iframe");
        n.title = "Buy Me a Coffee",
        n.style.position = "fixed",
        n.style.margin = "0",
        n.style.border = "0",
        "left" == o.dataset.position ? n.style.left = o.dataset.x_margin + "px" : n.style.right = o.dataset.x_margin + "px",
        n.style.bottom = parseInt(o.dataset.y_margin, 10) + 80 + "px",
        n.style.height = "0",
        n.style.opacity = "0",
        n.style.width = "calc(100% - 38px)",
        n.style.maxWidth = "350px",
        n.style.borderRadius = "10px",
        n.style.boxShadow = "-6px 0px 30px rgba(13, 12, 34, 0.1)",
        n.style.background = "#fff",
        n.style.backgroundImage = "url(https://cdn.buymeacoffee.com/assets/img/widget/loader.svg)",
        n.style.backgroundPosition = "center",
        n.style.backgroundSize = "64px",
        n.style.backgroundRepeat = "no-repeat",
        n.style.zIndex = "999999",
        n.style.transition = "all .4s ease",
        n.style.maxHeight = "620px";
        var a = document.createElement("div");
        a.style.position = "fixed",
        "left" == o.dataset.position ? a.style.left = parseInt(o.dataset.x_margin, 10) + 84 + "px" : a.style.right = parseInt(o.dataset.x_margin, 10) + 84 + "px",
        a.style.bottom = parseInt(o.dataset.y_margin, 10) - 2 + "px",
        a.style.background = "#ffffff",
        a.style.zIndex = "9999",
        a.innerText = o.dataset.message,
        a.style.boxShadow = "-6px 0px 30px rgba(13, 12, 34, 0.1)",
        a.style.padding = "23px 24px",
        a.style.borderRadius = "4px",
        a.style.fontSize = "18px",
        a.style.color = "#0D0C22",
        a.style.width = "auto",
        a.style.maxWidth = "260px",
        a.style.lineHeight = "1.5",
        a.style.fontFamily = '"Avenir Book1", "Avenir Book2", "Avenir Book3", "Avenir Book4", "Avenir Book5", "Avenir Book6", sans-serif',
        setTimeout(()=>{
            a.style.display = "none",
            a.style.opacity = "0"
        }
        , 5e3),
        document.body.appendChild(t),
        t.appendChild(n),
        document.body.appendChild(e),
        document.body.appendChild(a);
        var s = 0;
        e.onclick = function() {
            s || (n.src = "https://www.buymeacoffee.com/widget/page/" + o.dataset.id + "?description=" + encodeURIComponent(o.dataset.description) + "&color=" + encodeURIComponent(o.dataset.color)),
            s++,
            a.style.display = "none",
            a.style.opacity = "0",
            t.style.width = "100%",
            t.style.height = "100%",
            n.style.height = "calc(100% - 140px)",
            n.style.opacity = "1",
            e.style.transform = "scale(.8)",
            e.innerHTML = '<svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.1133 0L8 6.11331L1.88669 0L0 1.88663L8 9.88663L16 1.88663L14.1133 0Z" fill="white"/></svg>'
        }
        ,
        e.onmouseover = function() {}
        ,
        e.onmouseleave = function() {
            a.style.display = "none",
            a.style.opacity = "0"
        }
        ,
        t.onclick = function() {
            t.style.width = "0",
            t.style.height = "0",
            n.style.height = "0",
            n.style.opacity = "0",
            e.style.transform = "scale(1)",
            e.innerHTML = '<img src="https://cdn.buymeacoffee.com/widget/assets/coffee%20cup.svg" alt="Buy Me A Coffee" style="height: 40px; width: 40px; margin: 0; padding: 0;">'
        }
        ;
        var i = document.cookie;
        i.split(";");
        var l = new Date;
        l.setTime(l.getTime() + 864e5);
        var d = "; expires=" + l.toGMTString();
        i.includes("visited") || "" == o.dataset.message ? (a.style.display = "none",
        a.style.opacity = "0") : (document.cookie = `visited=1${d};path=/`,
        setTimeout(()=>{
            a.style.display = "none",
            a.style.opacity = "0"
        }
        , 5e3))
    }
    ))
}
]);

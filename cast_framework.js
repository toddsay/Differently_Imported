// Copyright Google Inc. All Rights Reserved.
(function() {
    'use strict';
    var f, g = function(a, b) {
            function c() {}
            c.prototype = b.prototype;
            a.prototype = new c;
            a.prototype.constructor = a;
            for (var d in b)
                if (Object.defineProperties) {
                    var e = Object.getOwnPropertyDescriptor(b, d);
                    e && Object.defineProperty(a, d, e)
                } else a[d] = b[d]
        },
        aa = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
            if (c.get || c.set) throw new TypeError("ES3 does not support getters and setters.");
            a != Array.prototype && a != Object.prototype && (a[b] = c.value)
        },
        h = "undefined" != typeof window &&
        window === this ? this : "undefined" != typeof global && null != global ? global : this,
        ca = function() {
            ca = function() {};
            h.Symbol || (h.Symbol = da)
        },
        ea = 0,
        da = function(a) { return "jscomp_symbol_" + (a || "") + ea++ },
        ga = function() {
            ca();
            var a = h.Symbol.iterator;
            a || (a = h.Symbol.iterator = h.Symbol("iterator"));
            "function" != typeof Array.prototype[a] && aa(Array.prototype, a, { configurable: !0, writable: !0, value: function() { return fa(this) } });
            ga = function() {}
        },
        fa = function(a) { var b = 0; return ha(function() { return b < a.length ? { done: !1, value: a[b++] } : { done: !0 } }) },
        ha = function(a) {
            ga();
            a = { next: a };
            a[h.Symbol.iterator] = function() { return this };
            return a
        },
        ia = function(a) { ga(); var b = a[Symbol.iterator]; return b ? b.call(a) : fa(a) },
        k = this,
        m = function() {},
        ja = function(a) {
            var b = typeof a;
            if ("object" == b)
                if (a) {
                    if (a instanceof Array) return "array";
                    if (a instanceof Object) return b;
                    var c = Object.prototype.toString.call(a);
                    if ("[object Window]" == c) return "object";
                    if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable &&
                        !a.propertyIsEnumerable("splice")) return "array";
                    if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) return "function"
                } else return "null";
            else if ("function" == b && "undefined" == typeof a.call) return "object";
            return b
        },
        ka = function(a) { var b = ja(a); return "array" == b || "object" == b && "number" == typeof a.length },
        n = function(a) { return "function" == ja(a) },
        la = function(a, b, c) { return a.call.apply(a.bind, arguments) },
        ma = function(a, b, c) {
            if (!a) throw Error();
            if (2 < arguments.length) {
                var d = Array.prototype.slice.call(arguments, 2);
                return function() {
                    var c = Array.prototype.slice.call(arguments);
                    Array.prototype.unshift.apply(c, d);
                    return a.apply(b, c)
                }
            }
            return function() { return a.apply(b, arguments) }
        },
        r = function(a, b, c) { r = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? la : ma; return r.apply(null, arguments) },
        na = Date.now || function() { return +new Date },
        t = function(a, b) {
            a = a.split(".");
            var c = k;
            a[0] in c || !c.execScript || c.execScript("var " +
                a[0]);
            for (var d; a.length && (d = a.shift());) a.length || void 0 === b ? c = c[d] && c[d] !== Object.prototype[d] ? c[d] : c[d] = {} : c[d] = b
        },
        u = function(a, b) {
            function c() {}
            c.prototype = b.prototype;
            a.Ob = b.prototype;
            a.prototype = new c;
            a.prototype.constructor = a;
            a.Nb = function(a, c, p) { for (var d = Array(arguments.length - 2), e = 2; e < arguments.length; e++) d[e - 2] = arguments[e]; return b.prototype[c].apply(a, d) }
        };
    var v = function(a) {
        if (Error.captureStackTrace) Error.captureStackTrace(this, v);
        else {
            var b = Error().stack;
            b && (this.stack = b)
        }
        a && (this.message = String(a))
    };
    u(v, Error);
    v.prototype.name = "CustomError";
    var oa = function(a, b) { for (var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1); e.length && 1 < c.length;) d += c.shift() + e.shift(); return d + c.join("%s") },
        pa = String.prototype.trim ? function(a) { return a.trim() } : function(a) { return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "") },
        qa = function(a, b) { return a < b ? -1 : a > b ? 1 : 0 };
    var ra = function(a, b) {
        b.unshift(a);
        v.call(this, oa.apply(null, b));
        b.shift()
    };
    u(ra, v);
    ra.prototype.name = "AssertionError";
    var sa = function(a, b) { throw new ra("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)); };
    var w;
    a: {
        var ta = k.navigator;
        if (ta) { var ua = ta.userAgent; if (ua) { w = ua; break a } }
        w = ""
    }
    var x = function(a) { return -1 != w.indexOf(a) };
    var wa = function(a, b) { var c = va; return Object.prototype.hasOwnProperty.call(c, a) ? c[a] : c[a] = b(a) };
    var xa = x("Opera"),
        y = x("Trident") || x("MSIE"),
        ya = x("Edge"),
        za = x("Gecko") && !(-1 != w.toLowerCase().indexOf("webkit") && !x("Edge")) && !(x("Trident") || x("MSIE")) && !x("Edge"),
        Aa = -1 != w.toLowerCase().indexOf("webkit") && !x("Edge"),
        Ba;
    a: {
        var Ca = "",
            Da = function() { var a = w; if (za) return /rv\:([^\);]+)(\)|;)/.exec(a); if (ya) return /Edge\/([\d\.]+)/.exec(a); if (y) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a); if (Aa) return /WebKit\/(\S+)/.exec(a); if (xa) return /(?:Version)[ \/]?(\S+)/.exec(a) }();Da && (Ca = Da ? Da[1] : "");
        if (y) {
            var z, Ea = k.document;
            z = Ea ? Ea.documentMode : void 0;
            if (null != z && z > parseFloat(Ca)) { Ba = String(z); break a }
        }
        Ba = Ca
    }
    var Fa = Ba,
        va = {},
        A = function(a) {
            return wa(a, function() {
                for (var b = 0, c = pa(String(Fa)).split("."), d = pa(String(a)).split("."), e = Math.max(c.length, d.length), p = 0; 0 == b && p < e; p++) {
                    var l = c[p] || "",
                        q = d[p] || "";
                    do {
                        l = /(\d*)(\D*)(.*)/.exec(l) || ["", "", "", ""];
                        q = /(\d*)(\D*)(.*)/.exec(q) || ["", "", "", ""];
                        if (0 == l[0].length && 0 == q[0].length) break;
                        b = qa(0 == l[1].length ? 0 : parseInt(l[1], 10), 0 == q[1].length ? 0 : parseInt(q[1], 10)) || qa(0 == l[2].length, 0 == q[2].length) || qa(l[2], q[2]);
                        l = l[3];
                        q = q[3]
                    } while (0 == b)
                }
                return 0 <= b
            })
        };
    var B = function(a, b, c, d, e) { this.reset(a, b, c, d, e) };
    B.prototype.ga = null;
    var Ga = 0;
    B.prototype.reset = function(a, b, c, d, e) {
        "number" == typeof e || Ga++;
        this.Sa = d || na();
        this.w = a;
        this.Ha = b;
        this.Ea = c;
        delete this.ga
    };
    B.prototype.wa = function(a) { this.w = a };
    var C = function(a) {
            this.Ia = a;
            this.N = this.ea = this.w = this.j = null
        },
        D = function(a, b) {
            this.name = a;
            this.value = b
        };
    D.prototype.toString = function() { return this.name };
    var Ha = new D("SHOUT", 1200),
        E = new D("SEVERE", 1E3),
        Ia = new D("WARNING", 900),
        Ja = new D("INFO", 800),
        Ka = new D("CONFIG", 700),
        La = [new D("OFF", Infinity), Ha, E, Ia, Ja, Ka, new D("FINE", 500), new D("FINER", 400), new D("FINEST", 300), new D("ALL", 0)],
        F = null,
        Ma = function(a) {
            if (!F) { F = {}; for (var b = 0, c; c = La[b]; b++) F[c.value] = c, F[c.name] = c }
            if (a in F) return F[a];
            for (b = 0; b < La.length; ++b)
                if (c = La[b], c.value <= a) return c;
            return null
        };
    C.prototype.getName = function() { return this.Ia };
    C.prototype.getParent = function() { return this.j };
    C.prototype.wa = function(a) { this.w = a };
    var Na = function(a) {
        if (a.w) return a.w;
        if (a.j) return Na(a.j);
        sa("Root logger has no level set.");
        return null
    };
    C.prototype.log = function(a, b, c) {
        if (a.value >= Na(this).value)
            for (n(b) && (b = b()), a = new B(a, String(b), this.Ia), c && (a.ga = c), c = "log:" + a.Ha, k.console && (k.console.timeStamp ? k.console.timeStamp(c) : k.console.markTimeline && k.console.markTimeline(c)), k.msWriteProfilerMark && k.msWriteProfilerMark(c), c = this; c;) {
                var d = c,
                    e = a;
                if (d.N)
                    for (var p = 0; b = d.N[p]; p++) b(e);
                c = c.getParent()
            }
    };
    C.prototype.info = function(a, b) { this.log(Ja, a, b) };
    var Oa = {},
        G = null,
        Pa = function() { G || (G = new C(""), Oa[""] = G, G.wa(Ka)) },
        Qa = function() { Pa(); return G },
        H = function(a) {
            Pa();
            var b;
            if (!(b = Oa[a])) {
                b = new C(a);
                var c = a.lastIndexOf("."),
                    d = a.substr(c + 1),
                    c = H(a.substr(0, c));
                c.ea || (c.ea = {});
                c.ea[d] = b;
                b.j = c;
                Oa[a] = b
            }
            return b
        };
    var I = function(a) {
        var b = Ra;
        b && b.log(Ia, a, void 0)
    };
    var J = function() { this.Ma = na() },
        Sa = new J;
    J.prototype.set = function(a) { this.Ma = a };
    J.prototype.reset = function() { this.set(na()) };
    J.prototype.get = function() { return this.Ma };
    var Ta = function(a) {
        this.yb = a || "";
        this.Jb = Sa
    };
    f = Ta.prototype;
    f.ya = !0;
    f.Qa = !0;
    f.Hb = !0;
    f.Gb = !0;
    f.Ra = !1;
    f.Ib = !1;
    var K = function(a) { return 10 > a ? "0" + a : String(a) },
        Ua = function(a, b) {
            a = (a.Sa - b) / 1E3;
            b = a.toFixed(3);
            var c = 0;
            if (1 > a) c = 2;
            else
                for (; 100 > a;) c++, a *= 10;
            for (; 0 < c--;) b = " " + b;
            return b
        },
        Va = function(a) { Ta.call(this, a) };
    u(Va, Ta);
    var Wa = function() {
        this.zb = r(this.Ta, this);
        this.V = new Va;
        this.V.Qa = !1;
        this.V.Ra = !1;
        this.Da = this.V.ya = !1;
        this.bb = {}
    };
    Wa.prototype.Ta = function(a) {
        if (!this.bb[a.Ea]) {
            var b;
            b = this.V;
            var c = [];
            c.push(b.yb, " ");
            if (b.Qa) {
                var d = new Date(a.Sa);
                c.push("[", K(d.getFullYear() - 2E3) + K(d.getMonth() + 1) + K(d.getDate()) + " " + K(d.getHours()) + ":" + K(d.getMinutes()) + ":" + K(d.getSeconds()) + "." + K(Math.floor(d.getMilliseconds() / 10)), "] ")
            }
            b.Hb && c.push("[", Ua(a, b.Jb.get()), "s] ");
            b.Gb && c.push("[", a.Ea, "] ");
            b.Ib && c.push("[", a.w.name, "] ");
            c.push(a.Ha);
            b.Ra && (d = a.ga) && c.push("\n", d instanceof Error ? d.message : d.toString());
            b.ya && c.push("\n");
            b = c.join("");
            if (c = Xa) switch (a.w) {
                case Ha:
                    M(c, "info", b);
                    break;
                case E:
                    M(c, "error", b);
                    break;
                case Ia:
                    M(c, "warn", b);
                    break;
                default:
                    M(c, "debug", b)
            }
        }
    };
    var N = null,
        Xa = k.console,
        M = function(a, b, c) {
            if (a[b]) a[b](c);
            else a.log(c)
        };
    var Ya = function(a, b, c) {
        this.pb = c;
        this.Xa = a;
        this.Cb = b;
        this.$ = 0;
        this.X = null
    };
    Ya.prototype.get = function() {
        var a;
        0 < this.$ ? (this.$--, a = this.X, this.X = a.next, a.next = null) : a = this.Xa();
        return a
    };
    Ya.prototype.put = function(a) {
        this.Cb(a);
        this.$ < this.pb && (this.$++, a.next = this.X, this.X = a)
    };
    var Za = function(a) { k.setTimeout(function() { throw a; }, 0) },
        $a, ab = function() {
            var a = k.MessageChannel;
            "undefined" === typeof a && "undefined" !== typeof window && window.postMessage && window.addEventListener && !x("Presto") && (a = function() {
                var a = document.createElement("IFRAME");
                a.style.display = "none";
                a.src = "";
                document.documentElement.appendChild(a);
                var b = a.contentWindow,
                    a = b.document;
                a.open();
                a.write("");
                a.close();
                var c = "callImmediate" + Math.random(),
                    d = "file:" == b.location.protocol ? "*" : b.location.protocol + "//" + b.location.host,
                    a = r(function(a) { if (("*" == d || a.origin == d) && a.data == c) this.port1.onmessage() }, this);
                b.addEventListener("message", a, !1);
                this.port1 = {};
                this.port2 = { postMessage: function() { b.postMessage(c, d) } }
            });
            if ("undefined" !== typeof a && !x("Trident") && !x("MSIE")) {
                var b = new a,
                    c = {},
                    d = c;
                b.port1.onmessage = function() {
                    if (void 0 !== c.next) {
                        c = c.next;
                        var a = c.za;
                        c.za = null;
                        a()
                    }
                };
                return function(a) {
                    d.next = { za: a };
                    d = d.next;
                    b.port2.postMessage(0)
                }
            }
            return "undefined" !== typeof document && "onreadystatechange" in document.createElement("SCRIPT") ?
                function(a) {
                    var b = document.createElement("SCRIPT");
                    b.onreadystatechange = function() {
                        b.onreadystatechange = null;
                        b.parentNode.removeChild(b);
                        b = null;
                        a();
                        a = null
                    };
                    document.documentElement.appendChild(b)
                } : function(a) { k.setTimeout(a, 0) }
        };
    var bb = function() { this.ba = this.K = null },
        db = new Ya(function() { return new cb }, function(a) { a.reset() }, 100);
    bb.prototype.add = function(a, b) {
        var c = db.get();
        c.set(a, b);
        this.ba ? this.ba.next = c : this.K = c;
        this.ba = c
    };
    bb.prototype.remove = function() {
        var a = null;
        this.K && (a = this.K, this.K = this.K.next, this.K || (this.ba = null), a.next = null);
        return a
    };
    var cb = function() { this.next = this.scope = this.ia = null };
    cb.prototype.set = function(a, b) {
        this.ia = a;
        this.scope = b;
        this.next = null
    };
    cb.prototype.reset = function() { this.next = this.scope = this.ia = null };
    var ib = function(a, b) {
            eb || fb();
            gb || (eb(), gb = !0);
            hb.add(a, b)
        },
        eb, fb = function() {
            if (-1 != String(k.Promise).indexOf("[native code]")) {
                var a = k.Promise.resolve(void 0);
                eb = function() { a.then(jb) }
            } else eb = function() { var a = jb;!n(k.setImmediate) || k.Window && k.Window.prototype && !x("Edge") && k.Window.prototype.setImmediate == k.setImmediate ? ($a || ($a = ab()), $a(a)) : k.setImmediate(a) }
        },
        gb = !1,
        hb = new bb,
        jb = function() {
            for (var a; a = hb.remove();) {
                try { a.ia.call(a.scope) } catch (b) { Za(b) }
                db.put(a)
            }
            gb = !1
        };
    var Q = function(a, b) {
            this.g = 0;
            this.Na = void 0;
            this.B = this.m = this.j = null;
            this.W = this.ha = !1;
            if (a != m) try {
                var c = this;
                a.call(b, function(a) { O(c, 2, a) }, function(a) {
                    if (!(a instanceof P)) try { if (a instanceof Error) throw a; throw Error("Promise rejected."); } catch (e) {}
                    O(c, 3, a)
                })
            } catch (d) { O(this, 3, d) }
        },
        kb = function() {
            this.next = this.context = this.F = this.P = this.v = null;
            this.U = !1
        };
    kb.prototype.reset = function() {
        this.context = this.F = this.P = this.v = null;
        this.U = !1
    };
    var lb = new Ya(function() { return new kb }, function(a) { a.reset() }, 100),
        mb = function(a, b, c) {
            var d = lb.get();
            d.P = a;
            d.F = b;
            d.context = c;
            return d
        },
        R = function() {
            var a, b, c = new Q(function(c, e) {
                a = c;
                b = e
            });
            return new nb(c, a, b)
        };
    Q.prototype.then = function(a, b, c) { return ob(this, n(a) ? a : null, n(b) ? b : null, c) };
    Q.prototype.then = Q.prototype.then;
    Q.prototype.$goog_Thenable = !0;
    Q.prototype.cancel = function(a) {
        0 == this.g && ib(function() {
            var b = new P(a);
            pb(this, b)
        }, this)
    };
    var pb = function(a, b) {
            if (0 == a.g)
                if (a.j) {
                    var c = a.j;
                    if (c.m) {
                        for (var d = 0, e = null, p = null, l = c.m; l && (l.U || (d++, l.v == a && (e = l), !(e && 1 < d))); l = l.next) e || (p = l);
                        e && (0 == c.g && 1 == d ? pb(c, b) : (p ? (d = p, d.next == c.B && (c.B = d), d.next = d.next.next) : qb(c), rb(c, e, 3, b)))
                    }
                    a.j = null
                } else O(a, 3, b)
        },
        tb = function(a, b) {
            a.m || 2 != a.g && 3 != a.g || sb(a);
            a.B ? a.B.next = b : a.m = b;
            a.B = b
        },
        ob = function(a, b, c, d) {
            var e = mb(null, null, null);
            e.v = new Q(function(a, l) {
                e.P = b ? function(c) {
                    try {
                        var e = b.call(d, c);
                        a(e)
                    } catch (L) { l(L) }
                } : a;
                e.F = c ? function(b) {
                    try {
                        var e = c.call(d,
                            b);
                        void 0 === e && b instanceof P ? l(b) : a(e)
                    } catch (L) { l(L) }
                } : l
            });
            e.v.j = a;
            tb(a, e);
            return e.v
        };
    Q.prototype.Kb = function(a) {
        this.g = 0;
        O(this, 2, a)
    };
    Q.prototype.Lb = function(a) {
        this.g = 0;
        O(this, 3, a)
    };
    var O = function(a, b, c) {
            if (0 == a.g) {
                a === c && (b = 3, c = new TypeError("Promise cannot resolve to itself"));
                a.g = 1;
                var d;
                a: {
                    var e = c,
                        p = a.Kb,
                        l = a.Lb;
                    if (e instanceof Q) tb(e, mb(p || m, l || null, a)),
                    d = !0;
                    else {
                        var q;
                        if (e) try { q = !!e.$goog_Thenable } catch (L) { q = !1 } else q = !1;
                        if (q) e.then(p, l, a), d = !0;
                        else {
                            q = typeof e;
                            if ("object" == q && null != e || "function" == q) try {
                                var ba = e.then;
                                if (n(ba)) {
                                    ub(e, ba, p, l, a);
                                    d = !0;
                                    break a
                                }
                            } catch (L) {
                                l.call(a, L);
                                d = !0;
                                break a
                            }
                            d = !1
                        }
                    }
                }
                d || (a.Na = c, a.g = b, a.j = null, sb(a), 3 != b || c instanceof P || vb(a, c))
            }
        },
        ub = function(a,
            b, c, d, e) {
            var p = !1,
                l = function(a) { p || (p = !0, c.call(e, a)) },
                q = function(a) { p || (p = !0, d.call(e, a)) };
            try { b.call(a, l, q) } catch (ba) { q(ba) }
        },
        sb = function(a) { a.ha || (a.ha = !0, ib(a.$a, a)) },
        qb = function(a) {
            var b = null;
            a.m && (b = a.m, a.m = b.next, b.next = null);
            a.m || (a.B = null);
            return b
        };
    Q.prototype.$a = function() {
        for (var a; a = qb(this);) rb(this, a, this.g, this.Na);
        this.ha = !1
    };
    var rb = function(a, b, c, d) {
            if (3 == c && b.F && !b.U)
                for (; a && a.W; a = a.j) a.W = !1;
            if (b.v) b.v.j = null, wb(b, c, d);
            else try { b.U ? b.P.call(b.context) : wb(b, c, d) } catch (e) { xb.call(null, e) }
            lb.put(b)
        },
        wb = function(a, b, c) { 2 == b ? a.P.call(a.context, c) : a.F && a.F.call(a.context, c) },
        vb = function(a, b) {
            a.W = !0;
            ib(function() { a.W && xb.call(null, b) })
        },
        xb = Za,
        P = function(a) { v.call(this, a) };
    u(P, v);
    P.prototype.name = "cancel";
    var nb = function(a, b, c) {
        this.I = a;
        this.resolve = b;
        this.reject = c
    };
    var yb = function() {
        this.Ba = this.Ba;
        this.vb = this.vb
    };
    yb.prototype.Ba = !1;
    y && A("9");
    !Aa || A("528");
    za && A("1.9b") || y && A("8") || xa && A("9.5") || Aa && A("528");
    za && !A("8") || y && A("9");
    var zb = function(a, b, c) {
        yb.call(this);
        this.qb = null != c ? r(a, c) : a;
        this.ob = b;
        this.Wa = r(this.xb, this);
        this.da = []
    };
    u(zb, yb);
    f = zb.prototype;
    f.J = !1;
    f.R = 0;
    f.A = null;
    f.cb = function(a) {
        this.da = arguments;
        this.A || this.R ? this.J = !0 : Ab(this)
    };
    f.stop = function() { this.A && (k.clearTimeout(this.A), this.A = null, this.J = !1, this.da = []) };
    f.pause = function() { this.R++ };
    f.resume = function() {
        this.R--;
        this.R || !this.J || this.A || (this.J = !1, Ab(this))
    };
    f.xb = function() {
        this.A = null;
        this.J && !this.R && (this.J = !1, Ab(this))
    };
    var Ab = function(a) {
        var b;
        b = a.Wa;
        var c = a.ob;
        if (!n(b))
            if (b && "function" == typeof b.handleEvent) b = r(b.handleEvent, b);
            else throw Error("Invalid listener argument");
        b = 2147483647 < Number(c) ? -1 : k.setTimeout(b, c || 0);
        a.A = b;
        a.qb.apply(null, a.da)
    };
    var S = function(a) {
        a.controller = this;
        this.a = a;
        this.s = this.c = this.b = null;
        this.Ka = this.wb.bind(this);
        this.C = this.sb.bind(this);
        this.D = this.tb.bind(this);
        this.l = 0;
        this.Mb = new zb(this.ab, 200, this)
    };
    f = S.prototype;
    f.sa = function() { this.c && (this.l++, this.a.isPaused = !this.a.isPaused, this.a.isPaused ? this.c.pause(null, this.D, this.C) : this.c.play(null, this.D, this.C)) };
    f.stop = function() { this.c && (this.l++, this.c.stop(null, this.D, this.C)) };
    f.seek = function() {
        if (this.c) {
            this.s && (clearTimeout(this.s), this.s = null);
            this.l++;
            var a = new chrome.cast.media.SeekRequest;
            a.currentTime = this.a.currentTime;
            this.c.seek(a, this.D, this.C)
        }
    };
    f.qa = function() {
        this.l++;
        this.a.isMuted = !this.a.isMuted;
        this.b.setReceiverMuted(this.a.isMuted, this.D, this.C)
    };
    f.xa = function() { this.Mb.cb() };
    f.ab = function() {
        this.l++;
        this.b.setReceiverVolumeLevel(this.a.volumeLevel, this.D, this.C)
    };
    f.tb = function() {
        this.l--;
        this.u()
    };
    f.sb = function() {
        this.l--;
        this.c && this.c.getStatus(null, m, m)
    };
    f.wb = function() { this.c && (this.a.currentTime = this.c.getEstimatedTime(), this.s = setTimeout(this.Ka, 1E3)) };
    f.u = function(a) {
        if (!(0 < this.l))
            if (this.b) {
                this.a.displayName = this.b.displayName || "";
                var b = this.b.statusText || "";
                this.a.displayStatus = b != this.a.displayName ? b : "";
                !a && this.b.receiver && (a = this.b.receiver.volume) && (null != a.muted && (this.a.isMuted = a.muted), null != a.level && (this.a.volumeLevel = a.level));
                this.c ? (this.a.isMediaLoaded = this.c.playerState != chrome.cast.media.PlayerState.IDLE, this.a.isPaused = this.c.playerState == chrome.cast.media.PlayerState.PAUSED, this.a.canPause = 0 <= this.c.supportedMediaCommands.indexOf(chrome.cast.media.MediaCommand.PAUSE),
                    this.T(this.c.media), this.a.canSeek = 0 <= this.c.supportedMediaCommands.indexOf(chrome.cast.media.MediaCommand.SEEK) && 0 != this.a.duration, this.a.currentTime = this.c.getEstimatedTime(), this.s && (clearTimeout(this.s), this.s = null), this.c.playerState == chrome.cast.media.PlayerState.PLAYING && (this.s = setTimeout(this.Ka, 1E3))) : this.T(null)
            } else this.a.displayName = "", this.a.displayStatus = "", this.T(null)
    };
    f.T = function(a) { a ? (this.a.duration = a.duration || 0, a.metadata && a.metadata.title && (this.a.displayStatus = a.metadata.title)) : (this.a.isMediaLoaded = !1, this.a.canPause = !1, this.a.canSeek = !1, this.a.currentTime = 0, this.a.duration = 0) };
    var Bb = function(a) {
            if (!a.c)
                for (var b = 0, c = a.b.media; b < c.length; b++)
                    if (!c[b].idleReason) {
                        a.c = c[b];
                        a.c.addUpdateListener(a.rb.bind(a));
                        break
                    }
        },
        Cb = function(a, b) {
            a.b = b;
            b.addMediaListener(a.Fa.bind(a));
            b.addUpdateListener(a.va.bind(a));
            Bb(a);
            a.u()
        };
    f = S.prototype;
    f.va = function(a) {
        a || (this.c = this.b = null);
        this.u()
    };
    f.Fa = function() {
        Bb(this);
        this.u(!0)
    };
    f.rb = function(a) {
        a || (this.c = null);
        this.u(!0)
    };
    f.ka = function(a, b) { return b ? 100 * a / b : 0 };
    f.la = function(a, b) { return b ? a * b / 100 : 0 };
    f.ja = function(a) { return 0 > a ? "" : [("0" + Math.floor(a / 3600)).substr(-2), ("0" + Math.floor(a / 60) % 60).substr(-2), ("0" + Math.floor(a) % 60).substr(-2)].join(":") };
    var Db = H("cast.common.loadScript"),
        Eb = function() {
            new Promise(function(a, b) {
                var c = document.createElement("script");
                c.type = "text/javascript";
                c.src = "https://www.gstatic.com/external_hosted/polymer/v1/webcomponents.min.js";
                c.onload = function() {
                    Db && Db.info("library(https://www.gstatic.com/external_hosted/polymer/v1/webcomponents.min.js is loaded", void 0);
                    a()
                };
                c.onerror = function() {
                    Db && Db.log(E, "library(https://www.gstatic.com/external_hosted/polymer/v1/webcomponents.min.js) failed to load", void 0);
                    b()
                };
                (document.head || document.body || document).appendChild(c)
            })
        };
    t("cast.framework.VERSION", "1.0.03");
    t("cast.framework.LoggerLevel", { DEBUG: 0, INFO: 800, WARNING: 900, ERROR: 1E3, NONE: 1500 });
    t("cast.framework.CastState", { NO_DEVICES_AVAILABLE: "NO_DEVICES_AVAILABLE", NOT_CONNECTED: "NOT_CONNECTED", CONNECTING: "CONNECTING", CONNECTED: "CONNECTED" });
    t("cast.framework.SessionState", { NO_SESSION: "NO_SESSION", SESSION_STARTING: "SESSION_STARTING", SESSION_STARTED: "SESSION_STARTED", SESSION_START_FAILED: "SESSION_START_FAILED", SESSION_ENDING: "SESSION_ENDING", SESSION_ENDED: "SESSION_ENDED", SESSION_RESUMED: "SESSION_RESUMED" });
    t("cast.framework.CastContextEventType", { CAST_STATE_CHANGED: "caststatechanged", SESSION_STATE_CHANGED: "sessionstatechanged" });
    t("cast.framework.SessionEventType", { APPLICATION_STATUS_CHANGED: "applicationstatuschanged", APPLICATION_METADATA_CHANGED: "applicationmetadatachanged", ACTIVE_INPUT_STATE_CHANGED: "activeinputstatechanged", VOLUME_CHANGED: "volumechanged", MEDIA_SESSION: "mediasession" });
    t("cast.framework.RemotePlayerEventType", {
        ANY_CHANGE: "anyChanged",
        IS_CONNECTED_CHANGED: "isConnectedChanged",
        IS_MEDIA_LOADED_CHANGED: "isMediaLoadedChanged",
        DURATION_CHANGED: "durationChanged",
        CURRENT_TIME_CHANGED: "currentTimeChanged",
        IS_PAUSED_CHANGED: "isPausedChanged",
        VOLUME_LEVEL_CHANGED: "volumeLevelChanged",
        IS_MUTED_CHANGED: "isMutedChanged",
        CAN_PAUSE_CHANGED: "canPauseChanged",
        CAN_SEEK_CHANGED: "canSeekChanged",
        DISPLAY_NAME_CHANGED: "displayNameChanged",
        STATUS_TEXT_CHANGED: "statusTextChanged",
        TITLE_CHANGED: "titleChanged",
        DISPLAY_STATUS_CHANGED: "displayStatusChanged",
        MEDIA_INFO_CHANGED: "mediaInfoChanged",
        IMAGE_URL_CHANGED: "imageUrlChanged",
        PLAYER_STATE_CHANGED: "playerStateChanged"
    });
    t("cast.framework.ActiveInputState", { ACTIVE_INPUT_STATE_UNKNOWN: -1, ACTIVE_INPUT_STATE_NO: 0, ACTIVE_INPUT_STATE_YES: 1 });
    var Fb = function(a) { Qa().wa(Ma(a)) };
    t("cast.framework.setLoggerLevel", Fb);
    N || (N = new Wa);
    if (N) {
        var Gb = N;
        if (1 != Gb.Da) {
            var Hb = Qa(),
                Ib = Gb.zb;
            Hb.N || (Hb.N = []);
            Hb.N.push(Ib);
            Gb.Da = !0
        }
    }
    Fb(1E3);
    var T = function(a) { this.type = a };
    t("cast.framework.EventData", T);
    var Jb = function(a) {
        this.type = "activeinputstatechanged";
        this.activeInputState = a
    };
    g(Jb, T);
    t("cast.framework.ActiveInputStateEventData", Jb);
    var Kb = function(a) {
        this.applicationId = a.appId;
        this.name = a.displayName;
        this.images = a.appImages;
        this.namespaces = this.ra(a.namespaces || [])
    };
    t("cast.framework.ApplicationMetadata", Kb);
    Kb.prototype.ra = function(a) { return a.map(function(a) { return a.name }) };
    var Lb = function(a) {
        this.type = "applicationmetadatachanged";
        this.metadata = a
    };
    g(Lb, T);
    t("cast.framework.ApplicationMetadataEventData", Lb);
    var Mb = function(a) {
        this.type = "applicationstatuschanged";
        this.status = a
    };
    g(Mb, T);
    t("cast.framework.ApplicationStatusEventData", Mb);
    var Nb = H("cast.framework.EventTarget"),
        U = function() { this.O = {} };
    U.prototype.addEventListener = function(a, b) {
        a in this.O || (this.O[a] = []);
        a = this.O[a];
        a.includes(b) || a.push(b)
    };
    U.prototype.removeEventListener = function(a, b) {
        a = this.O[a] || [];
        b = a.indexOf(b);
        0 <= b && a.splice(b, 1)
    };
    U.prototype.dispatchEvent = function(a) { a && a.type && (this.O[a.type] || []).forEach(function(b) { try { b(a) } catch (c) { Nb && Nb.log(E, "Handler for " + a.type + " event failed: " + c, c) } }) };
    var Ob = function(a) {
        a = a || {};
        this.receiverApplicationId = a.receiverApplicationId || null;
        this.resumeSavedSession = void 0 !== a.resumeSavedSession ? a.resumeSavedSession : !0;
        this.autoJoinPolicy = void 0 !== a.autoJoinPolicy ? a.autoJoinPolicy : chrome.cast.AutoJoinPolicy.TAB_AND_ORIGIN_SCOPED;
        this.language = a.language || null
    };
    t("cast.framework.CastOptions", Ob);
    var Pb = function(a) {
        this.type = "mediasession";
        this.mediaSession = a
    };
    g(Pb, T);
    t("cast.framework.MediaSessionEventData", Pb);
    var Qb = function(a, b) {
        this.type = "volumechanged";
        this.volume = a;
        this.isMute = b
    };
    g(Qb, T);
    t("cast.framework.VolumeEventData", Qb);
    var V = function(a, b) {
        this.h = new U;
        this.g = b;
        this.f = a;
        this.Oa = a.sessionId;
        this.S = a.statusText;
        this.La = a.receiver;
        this.i = a.receiver.volume;
        this.Z = new Kb(a);
        this.Y = a.receiver.isActiveInput;
        a: {
            a = this.f;
            if (a.media)
                for (a = ia(a.media), b = a.next(); !b.done; b = a.next())
                    if (b = b.value, !b.idleReason) { a = b; break a }
            a = null
        }
        this.pa = a;
        this.f.addMediaListener(this.Ga.bind(this))
    };
    t("cast.framework.CastSession", V);
    V.prototype.addEventListener = function(a, b) { this.h.addEventListener(a, b) };
    V.prototype.addEventListener = V.prototype.addEventListener;
    V.prototype.removeEventListener = function(a, b) { this.h.removeEventListener(a, b) };
    V.prototype.removeEventListener = V.prototype.removeEventListener;
    var Sb = function(a, b) {
        a.La = b;
        !b.volume || a.i && a.i.muted == b.volume.muted && a.i.level == b.volume.level || (a.i = b.volume, a.h.dispatchEvent(new Qb(a.i.level, a.i.muted)));
        a.Y != b.isActiveInput && (a.Y = b.isActiveInput, a.h.dispatchEvent(new Jb(Rb(a.Y))))
    };
    V.prototype.mb = function() { return this.f };
    V.prototype.getSessionObj = V.prototype.mb;
    V.prototype.lb = function() { return this.Oa };
    V.prototype.getSessionId = V.prototype.lb;
    V.prototype.ma = function() { return this.g };
    V.prototype.getSessionState = V.prototype.ma;
    V.prototype.hb = function() { return this.La };
    V.prototype.getCastDevice = V.prototype.hb;
    V.prototype.fb = function() { return this.Z };
    V.prototype.getApplicationMetadata = V.prototype.fb;
    V.prototype.gb = function() { return this.S };
    V.prototype.getApplicationStatus = V.prototype.gb;
    V.prototype.eb = function() { return Rb(this.Y) };
    V.prototype.getActiveInputState = V.prototype.eb;
    V.prototype.Ca = function(a) { "SESSION_ENDED" != this.g && (a ? this.f.stop(m, m) : this.f.leave(m, m)) };
    V.prototype.endSession = V.prototype.Ca;
    V.prototype.setVolume = function(a) {
        var b = R(),
            c = Promise.resolve(b.I);
        this.i && (this.i.level = a, this.i.muted = !1);
        this.f.setReceiverVolumeLevel(a, function() { return b.resolve() }, function(a) { return b.reject(a.code) });
        return c
    };
    V.prototype.setVolume = V.prototype.setVolume;
    V.prototype.nb = function() { return this.i ? this.i.level : null };
    V.prototype.getVolume = V.prototype.nb;
    V.prototype.Eb = function(a) {
        var b = R(),
            c = Promise.resolve(b.I);
        this.i && (this.i.muted = a);
        this.f.setReceiverMuted(a, function() { return b.resolve() }, function(a) { return b.reject(a.code) });
        return c
    };
    V.prototype.setMute = V.prototype.Eb;
    V.prototype.isMute = function() { return this.i ? this.i.muted : null };
    V.prototype.isMute = V.prototype.isMute;
    V.prototype.sendMessage = function(a, b) {
        var c = R(),
            d = Promise.resolve(c.I);
        this.f.sendMessage(a, b, function() { return c.resolve() }, function(a) { return c.reject(a.code) });
        return d
    };
    V.prototype.sendMessage = V.prototype.sendMessage;
    V.prototype.addMessageListener = function(a, b) { this.f.addMessageListener(a, b) };
    V.prototype.addMessageListener = V.prototype.addMessageListener;
    V.prototype.removeMessageListener = function(a, b) { this.f.removeMessageListener(a, b) };
    V.prototype.removeMessageListener = V.prototype.removeMessageListener;
    V.prototype.loadMedia = function(a) {
        var b = this,
            c = R(),
            d = Promise.resolve(c.I);
        this.f.loadMedia(a, function(a) {
            b.Ga(a);
            c.resolve()
        }, function(a) { c.reject(a.code) });
        return d
    };
    V.prototype.loadMedia = V.prototype.loadMedia;
    V.prototype.kb = function() { return this.pa };
    V.prototype.getMediaSession = V.prototype.kb;
    V.prototype.Ga = function(a) { a.media && (this.pa = a, this.h.dispatchEvent(new Pb(a))) };
    var Rb = function(a) { return null == a ? -1 : a ? 1 : 0 };
    V.prototype.ra = function(a) { return a.map(function(a, c) { return c.name }) };
    var Tb = function(a) {
        this.type = "caststatechanged";
        this.castState = a
    };
    g(Tb, T);
    t("cast.framework.CastStateEventData", Tb);
    var Ub = function(a, b, c) {
        this.type = "sessionstatechanged";
        this.session = a;
        this.sessionState = b;
        this.errorCode = void 0 !== c ? c : null
    };
    g(Ub, T);
    t("cast.framework.SessionStateEventData", Ub);
    var Ra = H("cast.framework.CastContext"),
        W = function() {
            this.h = new U;
            this.oa = !1;
            this.G = null;
            this.ua = !1;
            this.L = "NO_DEVICES_AVAILABLE";
            this.o = "NO_SESSION";
            this.aa = this.b = null
        };
    t("cast.framework.CastContext", W);
    W.prototype.addEventListener = function(a, b) { this.h.addEventListener(a, b) };
    W.prototype.addEventListener = W.prototype.addEventListener;
    W.prototype.removeEventListener = function(a, b) { this.h.removeEventListener(a, b) };
    W.prototype.removeEventListener = W.prototype.removeEventListener;
    W.prototype.Fb = function(a) {
        if (this.oa) I("CastContext already initialized, new options are ignored");
        else {
            this.G = new Ob(a);
            if (!this.G || !this.G.receiverApplicationId) throw Error("Missing application id in cast options");
            a = new chrome.cast.SessionRequest(this.G.receiverApplicationId);
            a = new chrome.cast.ApiConfig(a, this.Pa.bind(this), this.Bb.bind(this), this.G.autoJoinPolicy);
            chrome.cast.initialize(a, m, m);
            chrome.cast.addReceiverActionListener(this.Ab.bind(this));
            this.oa = !0
        }
    };
    W.prototype.setOptions = W.prototype.Fb;
    W.prototype.ib = function() { return this.L };
    W.prototype.getCastState = W.prototype.ib;
    W.prototype.ma = function() { return this.o };
    W.prototype.getSessionState = W.prototype.ma;
    W.prototype.requestSession = function() {
        var a = this;
        if (!this.oa) throw Error("Cannot start session before cast options are provided");
        var b = R(),
            c = Promise.resolve(b.I);
        ob(b.I, null, m, void 0);
        c.catch(m);
        var d = "NOT_CONNECTED" == this.L;
        chrome.cast.requestSession(function(c) {
            a.Pa(c);
            b.resolve(null)
        }, function(c) {
            d && X(a, "SESSION_START_FAILED", c ? c.code : void 0);
            b.reject(c.code)
        });
        return c
    };
    W.prototype.requestSession = W.prototype.requestSession;
    W.prototype.jb = function() { return this.b };
    W.prototype.getCurrentSession = W.prototype.jb;
    W.prototype.Za = function(a) { this.b && this.b.Ca(a) };
    W.prototype.endCurrentSession = W.prototype.Za;
    W.prototype.Bb = function(a) {
        (this.ua = a == chrome.cast.ReceiverAvailability.AVAILABLE) && !this.b && this.aa && this.G.resumeSavedSession && chrome.cast.requestSessionById(this.aa);
        Vb(this)
    };
    W.prototype.Ab = function(a, b) { this.b || b != chrome.cast.ReceiverAction.CAST ? this.b && b == chrome.cast.ReceiverAction.STOP ? X(this, "SESSION_ENDING") : a && Sb(this.b, a) : X(this, "SESSION_STARTING") };
    W.prototype.Pa = function(a) {
        var b = "SESSION_STARTING" == this.o ? "SESSION_STARTED" : "SESSION_RESUMED";
        this.aa = null;
        this.b = new V(a, b);
        a.addUpdateListener(this.va.bind(this));
        X(this, b)
    };
    W.prototype.va = function() {
        if (this.b) switch (this.b.f.status) {
            case chrome.cast.SessionStatus.DISCONNECTED:
            case chrome.cast.SessionStatus.STOPPED:
                X(this, "SESSION_ENDED");
                this.aa = this.b.Oa;
                this.b = null;
                break;
            case chrome.cast.SessionStatus.CONNECTED:
                var a = this.b,
                    b = a.Z,
                    c = a.f,
                    d;
                if (!(d = b.applicationId != c.appId || b.name != c.displayName)) {
                    a: if (d = b.namespaces, b = b.ra(c.namespaces || []), ka(d) && ka(b) && d.length == b.length) {
                        for (var c = d.length, e = 0; e < c; e++)
                            if (d[e] !== b[e]) { d = !1; break a }
                        d = !0
                    } else d = !1;d = !d
                }
                d && (a.Z = new Kb(a.f),
                    a.h.dispatchEvent(new Lb(a.Z)));
                Sb(a, a.f.receiver);
                a.S != a.f.statusText && (a.S = a.f.statusText, a.h.dispatchEvent(new Mb(a.S)));
                break;
            default:
                I("Unknown session status " + this.b.f.status)
        } else I("Received session update event without known session")
    };
    var X = function(a, b, c) { b != a.o && (a.o = b, a.b && (a.b.g = a.o), a.h.dispatchEvent(new Ub(a.b, a.o, c)), Vb(a)) },
        Vb = function(a) {
            var b = "NO_DEVICES_AVAILABLE";
            switch (a.o) {
                case "SESSION_STARTING":
                case "SESSION_ENDING":
                    b = "CONNECTING";
                    break;
                case "SESSION_STARTED":
                case "SESSION_RESUMED":
                    b = "CONNECTED";
                    break;
                case "NO_SESSION":
                case "SESSION_ENDED":
                case "SESSION_START_FAILED":
                    b = a.ua ? "NOT_CONNECTED" : "NO_DEVICES_AVAILABLE";
                    break;
                default:
                    I("Unexpected session state: " + a.o)
            }
            b !== a.L && (a.L = b, a.h.dispatchEvent(new Tb(b)))
        };
    W.na = void 0;
    W.M = function() { return W.na ? W.na : W.na = new W };
    W.getInstance = W.M;
    var Y = function() { return HTMLButtonElement.call(this) || this };
    g(Y, HTMLButtonElement);
    Y.prototype.createdCallback = function() { this.createShadowRoot && (this.createShadowRoot().innerHTML = '<style>.connected {fill:var(--connected-color,#4285F4);}.disconnected {fill:var(--disconnected-color,#7D7D7D);}.hidden {opacity:0;}</style><svg id "svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 24 24"><g><path id="arch0" class="disconnected" d="M1,18 L1,21 L4,21 C4,19.34 2.66,18 1,18 L1,18 Z"/><path id="arch1" class="disconnected" d="M1,14 L1,16 C3.76,16 6,18.24 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path id="arch2" class="disconnected" d="M1,10 L1,12 C5.97,12 10,16.03 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path id="box" class="disconnected" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/><path id="boxfill" class="hidden" d="M5,7 L5,8.63 C8,8.63 13.37,14 13.37,17 L19,17 L19,7 Z"/></g></svg>') };
    Y.prototype.attachedCallback = function() {
        if (this.shadowRoot) {
            this.fa = W.M();
            this.Ja = this.ub.bind(this);
            this.ca = [];
            for (var a = 0; 3 > a; a++) this.ca.push(this.shadowRoot.getElementById("arch" + a));
            this.Ua = this.shadowRoot.getElementById("box");
            this.Va = this.shadowRoot.getElementById("boxfill");
            this.ta = 0;
            this.H = null;
            this.Ya = window.getComputedStyle(this, null).display;
            this.g = this.fa.L;
            Wb(this);
            this.addEventListener("click", Xb);
            this.fa.addEventListener("caststatechanged", this.Ja)
        }
    };
    Y.prototype.detachedCallback = function() {
        this.fa.removeEventListener("caststatechanged", this.Ja);
        null !== this.H && (window.clearTimeout(this.H), this.H = null)
    };
    var Xb = function() { W.M().requestSession() };
    Y.prototype.ub = function(a) {
        this.g = a.castState;
        Wb(this)
    };
    var Wb = function(a) {
        if ("NO_DEVICES_AVAILABLE" == a.g) a.style.display = "none";
        else switch (a.style.display = a.Ya, a.g) {
            case "NOT_CONNECTED":
                Yb(a, !1, "hidden");
                break;
            case "CONNECTING":
                Yb(a, !1, "hidden");
                a.H || a.Aa();
                break;
            case "CONNECTED":
                Yb(a, !0, "connected")
        }
    };
    Y.prototype.Aa = function() {
        this.H = null;
        if ("CONNECTING" == this.g) {
            for (var a = 0; 3 > a; a++) Zb(this.ca[a], a == this.ta);
            this.ta = (this.ta + 1) % 3;
            this.H = window.setTimeout(this.Aa.bind(this), 300)
        }
    };
    var Yb = function(a, b, c) {
            for (var d = ia(a.ca), e = d.next(); !e.done; e = d.next()) Zb(e.value, b);
            Zb(a.Ua, b);
            a.Va.setAttribute("class", c)
        },
        Zb = function(a, b) { a.setAttribute("class", b ? "connected" : "disconnected") };
    (function() {
        var a = function() { document.registerElement("google-cast-button", { prototype: Y.prototype, extends: "button" }) };
        if (document.registerElement) a();
        else {
            window.addEventListener("WebComponentsReady", a);
            Eb();
            for (var a = ia(document.querySelectorAll("button[is=google-cast-button]")), b = a.next(); !b.done; b = a.next()) b.value.onclick = Xb
        }
    })();
    t("cast.framework.RemotePlayer", function() {
        this.isMediaLoaded = this.isConnected = !1;
        this.currentTime = this.duration = 0;
        this.volumeLevel = 1;
        this.canSeek = this.canPause = this.isMuted = this.isPaused = !1;
        this.displayStatus = this.title = this.statusText = this.displayName = "";
        this.controller = this.savedPlayerState = this.playerState = this.imageUrl = this.mediaInfo = null
    });
    var $b = function(a, b, c) {
        this.type = a;
        this.field = b;
        this.value = c
    };
    g($b, T);
    t("cast.framework.RemotePlayerChangedEvent", $b);
    var Z = function(a) {
        var b = new U;
        S.call(this, ac(a, b));
        this.h = b;
        a = W.M();
        a.addEventListener("sessionstatechanged", this.Db.bind(this));
        (a = a.b) ? Cb(this, a.f): this.u()
    };
    g(Z, S);
    t("cast.framework.RemotePlayerController", Z);
    var ac = function(a, b) {
        return new window.Proxy(a, {
            set: function(a, d, e) {
                if (e === a[d]) return !0;
                a[d] = e;
                b.dispatchEvent(new $b(d + "Changed", d, e));
                b.dispatchEvent(new $b("anyChanged", d, e));
                return !0
            }
        })
    };
    Z.prototype.addEventListener = function(a, b) { this.h.addEventListener(a, b) };
    Z.prototype.addEventListener = Z.prototype.addEventListener;
    Z.prototype.removeEventListener = function(a, b) { this.h.removeEventListener(a, b) };
    Z.prototype.removeEventListener = Z.prototype.removeEventListener;
    Z.prototype.Db = function(a) {
        switch (a.sessionState) {
            case "SESSION_STARTED":
            case "SESSION_RESUMED":
                this.a.isConnected = !0;
                var b = a.session && a.session.f;
                b && (Cb(this, b), a.session.addEventListener("mediasession", this.Fa.bind(this)))
        }
    };
    Z.prototype.u = function(a) {
        var b = W.M().b;
        b ? this.a.savedPlayerState = null : this.a.isConnected && (this.a.savedPlayerState = { mediaInfo: this.a.mediaInfo, currentTime: this.a.currentTime, isPaused: this.a.isPaused });
        S.prototype.u.call(this, a);
        this.a.isConnected = !!b;
        this.a.statusText = b && b.S || "";
        a = b && b.pa;
        this.a.playerState = a && a.playerState || null
    };
    Z.prototype.T = function(a) {
        S.prototype.T.call(this, a);
        var b = (this.a.mediaInfo = a) && a.metadata;
        a = null;
        var c = "";
        b && (c = b.title || "", (b = b.images) && 0 < b.length && (a = b[0].url));
        this.a.title = c;
        this.a.imageUrl = a
    };
    Z.prototype.sa = function() { S.prototype.sa.call(this) };
    Z.prototype.playOrPause = Z.prototype.sa;
    Z.prototype.stop = function() { S.prototype.stop.call(this) };
    Z.prototype.stop = Z.prototype.stop;
    Z.prototype.seek = function() { S.prototype.seek.call(this) };
    Z.prototype.seek = Z.prototype.seek;
    Z.prototype.qa = function() { S.prototype.qa.call(this) };
    Z.prototype.muteOrUnmute = Z.prototype.qa;
    Z.prototype.xa = function() { S.prototype.xa.call(this) };
    Z.prototype.setVolumeLevel = Z.prototype.xa;
    Z.prototype.ja = function(a) { return S.prototype.ja.call(this, a) };
    Z.prototype.getFormattedTime = Z.prototype.ja;
    Z.prototype.ka = function(a, b) { return S.prototype.ka.call(this, a, b) };
    Z.prototype.getSeekPosition = Z.prototype.ka;
    Z.prototype.la = function(a, b) { return S.prototype.la.call(this, a, b) };
    Z.prototype.getSeekTime = Z.prototype.la;
}).call(window);
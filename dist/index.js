var cookie;
(function (cookie_1) {
    cookie_1.names = {
        userId: 'user-id',
        test: 'test',
    };
    const namesValues = Object.values(cookie_1.names);
    cookie_1.get = (name) => {
        const nameIsOk = namesValues.some((n) => n === name);
        if (nameIsOk) {
            const cookies = document.cookie.split('; ');
            console.log('%c cookies:', 'background: #ffcc00; color: #003300', cookies);
            for (const cookie of cookies) {
                const [key, value] = cookie.split('=');
                if (key === name) {
                    return decodeURIComponent(value);
                }
            }
            return undefined;
        }
        return null;
    };
})(cookie || (cookie = {}));
const idb = (storeName) => (function () {
    const promisifyRequest = (request) => new Promise((resolve, reject) => {
        request.oncomplete = request.onsuccess = () => resolve(request.result);
        request.onabort = request.onerror = () => reject(request.error);
    });
    const createStore = (dbName, storeName) => {
        const request = indexedDB.open(dbName);
        request.onupgradeneeded = () => request.result.createObjectStore(storeName);
        const dbp = promisifyRequest(request);
        return (txMode, callback) => dbp.then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)));
    };
    let defaultGetStoreFunc;
    const defaultGetStore = () => {
        if (!defaultGetStoreFunc) {
            defaultGetStoreFunc = createStore('rolnik', storeName);
        }
        return defaultGetStoreFunc;
    };
    const get = (key, customStore = defaultGetStore()) => customStore('readonly', (store) => promisifyRequest(store.get(key)));
    const set = (key, value, customStore = defaultGetStore()) => customStore('readwrite', (store) => {
        store.put(value, key);
        return promisifyRequest(store.transaction);
    });
    const update = (key, updater, customStore = defaultGetStore()) => customStore('readwrite', (store) => new Promise((resolve, reject) => {
        store.get(key).onsuccess = function () {
            try {
                store.put(updater(this.result), key);
                resolve(promisifyRequest(store.transaction));
            }
            catch (err) {
                reject(err);
            }
        };
    }));
    const del = (key, customStore = defaultGetStore()) => customStore('readwrite', (store) => {
        store.delete(key);
        return promisifyRequest(store.transaction);
    });
    const eachCursor = (store, callback) => {
        store.openCursor().onsuccess = function () {
            if (!this.result)
                return;
            callback(this.result);
            this.result.continue();
        };
        return promisifyRequest(store.transaction);
    };
    const keys = (customStore = defaultGetStore()) => customStore('readonly', (store) => {
        if (store.getAllKeys) {
            return promisifyRequest(store.getAllKeys());
        }
        const items = [];
        return eachCursor(store, (cursor) => items.push(cursor.key)).then(() => items);
    });
}());
const checked = {
    yes: 'yes',
    no: 'no',
};
const storageNames = {
    theme: 'theme',
    questionsData: 'questions-data',
    imgData: 'img-data',
    userId: 'user-id',
    version: 'version',
    config: 'config',
};
const configData = {
    tests: 'null',
    img: [],
};
const defaultData = {
    theme: '',
    questionsData: checked.yes,
    imgData: checked.yes,
    userId: 'null',
    version: 'null',
    config: configData,
};
const getStorage = async () => {
    const isValidJSONStringify = (value) => {
        try {
            const result = JSON.stringify(value);
            return result !== undefined;
        }
        catch {
            return false;
        }
    };
    const isValidJSONParse = (value) => {
        try {
            JSON.parse(value);
            return true;
        }
        catch {
            return false;
        }
    };
    const set = (key, value) => {
        if (!isValidJSONStringify(value)) {
            throw new Error(`Value for key "${key}" is not JSON serializable`);
        }
        localStorage.setItem(key, JSON.stringify(value));
    };
    const get = (key) => {
        const value = localStorage.getItem(key);
        if (value === null)
            return null;
        if (!isValidJSONParse(value)) {
            return value;
        }
        return JSON.parse(value);
    };
    const remove = (key) => {
        localStorage.removeItem(key);
    };
    const clear = () => {
        localStorage.clear();
    };
    const initData = () => {
        const keys = Object.keys(storageNames);
        keys.forEach((key) => {
            const keyName = storageNames[key];
            const data = get(keyName);
            if (data === null) {
                set(keyName, defaultData[key]);
            }
        });
    };
    initData();
    return {
        set,
        get,
        remove,
        clear,
        isValidJSONStringify,
        isValidJSONParse,
    };
};
var core;
(function (core) {
    core.store = null;
    core.idbTest = null;
    core.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB10|PlayBook|IEMobile|Windows Phone|Opera Mini|Opera Mobi|Mobile Safari|Fennec|Kindle|Silk|Ubuntu Touch/i
        .test(navigator.userAgent)
        || window.innerWidth < 768;
})(core || (core = {}));
var dom;
(function (dom) {
    dom.root = document.documentElement;
    dom.byId = (id) => {
        return document.getElementById(id);
    };
    dom.byQuery = (query) => document.querySelector(query);
    dom.byQueryAll = (query) => document.querySelectorAll(query);
    dom.byQ = (elem, query) => elem.querySelector(query);
    dom.byQAll = (elem, query) => elem.querySelectorAll(query);
    dom.getPx = (num) => `${num}px`;
    dom.inner = (elem, txt) => elem.innerHTML = txt;
    dom.getAllById = (obj) => {
        const results = {};
        Object.keys(obj).forEach((key) => {
            const value = obj[key];
            if (typeof value === "string") {
                results[key] = dom.byId(value);
            }
            else if (Array.isArray(value)) {
                results[key] = value.map(id => dom.byId(id));
            }
            else if (typeof value === "object" && value !== null) {
                results[key] = dom.getAllById(value);
            }
        });
        return results;
    };
    dom.prepare = (node, options) => {
        const elem = typeof node === "string" ? document.createElement(node) : node;
        if (elem && elem instanceof HTMLElement) {
            if (options.delete) {
                elem.remove();
                return;
            }
            if (options?.id)
                elem.id = options.id;
            options?.classes?.forEach((c) => elem.classList.add(c));
            options?.children?.forEach((c) => elem.appendChild(c));
            if (options?.src && elem instanceof HTMLImageElement) {
                elem.src = options.src;
            }
            if (options?.inner) {
                elem.textContent = options.inner;
            }
            if (options?.position) {
                elem.style.left = `${options.position.x}px`;
                elem.style.top = `${options.position.y}px`;
            }
            return elem;
        }
    };
    dom.setStyle = (element, style, value) => {
        element.style[style] = value;
    };
    dom.setAllStyles = (styles) => styles.forEach((s) => dom.setStyle(s[0], s[1], s[2]));
    dom.setAttribute = (element, attribute, value) => element.setAttribute(attribute, value);
    dom.setAllAttributes = (attributes) => attributes.forEach((a) => a[0].setAttribute(a[1], a[2]));
    dom.disable = (elem) => elem.setAttribute('disabled', '');
    dom.enable = (elem) => elem.removeAttribute('disabled');
    dom.check = (elem) => elem.checked = true;
    dom.uncheck = (elem) => elem.checked = false;
    dom.display = (elem, attribute) => elem.style.display = attribute;
    dom.setColor = (elem, color) => elem.style.color = color;
    dom.removeClass = (elem, attribute) => elem.classList.remove(attribute);
    dom.addClass = (elem, attribute) => elem.classList.add(attribute);
    dom.colors = {
        line: 'var(--line_color)',
        prime: 'var(--prime_color)',
        off1: 'var(--off_prime_color)',
        off2: 'var(--off_second_color)',
    };
    dom.add = (elem, name, fn) => elem.addEventListener(name, fn);
    dom.remove = (elem, name, fn) => elem.removeEventListener(name, fn);
    dom.xmlns = 'http://www.w3.org/2000/svg';
    dom.newNS = (name) => document.createElementNS(dom.xmlns, 'rect');
})(dom || (dom = {}));
const setConsole = () => (function () {
    let styles = [
        'background: linear-gradient(169deg, #f60707 0%, #ffd600 38%, #edff00 51%, #c4ed18 62%, #00ff19 100%)',
        'border: 1px solid #3E0E02',
        'width: 220px',
        'color: black',
        'display: block',
        'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)',
        'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset',
        'line-height: 30px',
        'text-align: center',
        'font-weight: bold',
        'font-size: 24px',
        'margin: 10px 0',
        'padding: 10px 0 15px 0'
    ].join(';');
    console.log('%c👉rol 04👈', styles);
    let styles2 = [
        'background: linear-gradient(169deg, #f60707 0%, #ffd600 38%, #edff00 51%, #c4ed18 62%, #00ff19 100%)',
        'border: 1px solid #3E0E02',
        'width: 220px',
        'color: black',
        'display: block',
        'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)',
        'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset',
        'line-height: 18px',
        'text-align: center',
        'font-weight: bold',
        'font-size: 16px',
        'margin: 10px 0',
        'padding: 10px 0 15px 0'
    ].join(';');
    console.log('%c   𝒂𝒖𝒕𝒐𝒓: 𝐌𝐢𝐜𝐡𝐚𝐥 𝐀𝐧𝐢𝐨𝐥 😎   ', styles2);
}());
!function (e, t) { "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.axios = t() : e.axios = t(); }(window, (function () { return function (e) { var t = {}; function r(n) { if (t[n])
    return t[n].exports; var o = t[n] = { i: n, l: !1, exports: {} }; return e[n].call(o.exports, o, o.exports, r), o.l = !0, o.exports; } return r.m = e, r.c = t, r.d = function (e, t, n) { r.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: n }); }, r.r = function (e) { "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 }); }, r.t = function (e, t) { if (1 & t && (e = r(e)), 8 & t)
    return e; if (4 & t && "object" == typeof e && e && e.__esModule)
    return e; var n = Object.create(null); if (r.r(n), Object.defineProperty(n, "default", { enumerable: !0, value: e }), 2 & t && "string" != typeof e)
    for (var o in e)
        r.d(n, o, function (t) { return e[t]; }.bind(null, o)); return n; }, r.n = function (e) { var t = e && e.__esModule ? function () { return e.default; } : function () { return e; }; return r.d(t, "a", t), t; }, r.o = function (e, t) { return Object.prototype.hasOwnProperty.call(e, t); }, r.p = "", r(r.s = 10); }([function (e, t, r) {
        "use strict";
        var n = r(2), o = Object.prototype.toString;
        function i(e) { return "[object Array]" === o.call(e); }
        function s(e) { return void 0 === e; }
        function a(e) { return null !== e && "object" == typeof e; }
        function u(e) { if ("[object Object]" !== o.call(e))
            return !1; var t = Object.getPrototypeOf(e); return null === t || t === Object.prototype; }
        function c(e) { return "[object Function]" === o.call(e); }
        function f(e, t) { if (null != e)
            if ("object" != typeof e && (e = [e]), i(e))
                for (var r = 0, n = e.length; r < n; r++)
                    t.call(null, e[r], r, e);
            else
                for (var o in e)
                    Object.prototype.hasOwnProperty.call(e, o) && t.call(null, e[o], o, e); }
        e.exports = { isArray: i, isArrayBuffer: function (e) { return "[object ArrayBuffer]" === o.call(e); }, isBuffer: function (e) { return null !== e && !s(e) && null !== e.constructor && !s(e.constructor) && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e); }, isFormData: function (e) { return "undefined" != typeof FormData && e instanceof FormData; }, isArrayBufferView: function (e) { return "undefined" != typeof ArrayBuffer && ArrayBuffer.isView ? ArrayBuffer.isView(e) : e && e.buffer && e.buffer instanceof ArrayBuffer; }, isString: function (e) { return "string" == typeof e; }, isNumber: function (e) { return "number" == typeof e; }, isObject: a, isPlainObject: u, isUndefined: s, isDate: function (e) { return "[object Date]" === o.call(e); }, isFile: function (e) { return "[object File]" === o.call(e); }, isBlob: function (e) { return "[object Blob]" === o.call(e); }, isFunction: c, isStream: function (e) { return a(e) && c(e.pipe); }, isURLSearchParams: function (e) { return "undefined" != typeof URLSearchParams && e instanceof URLSearchParams; }, isStandardBrowserEnv: function () { return ("undefined" == typeof navigator || "ReactNative" !== navigator.product && "NativeScript" !== navigator.product && "NS" !== navigator.product) && ("undefined" != typeof window && "undefined" != typeof document); }, forEach: f, merge: function e() { var t = {}; function r(r, n) { u(t[n]) && u(r) ? t[n] = e(t[n], r) : u(r) ? t[n] = e({}, r) : i(r) ? t[n] = r.slice() : t[n] = r; } for (var n = 0, o = arguments.length; n < o; n++)
                f(arguments[n], r); return t; }, extend: function (e, t, r) { return f(t, (function (t, o) { e[o] = r && "function" == typeof t ? n(t, r) : t; })), e; }, trim: function (e) { return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, ""); }, stripBOM: function (e) { return 65279 === e.charCodeAt(0) && (e = e.slice(1)), e; } };
    }, function (e, t, r) {
        "use strict";
        var n = r(0), o = r(16), i = r(4), s = { "Content-Type": "application/x-www-form-urlencoded" };
        function a(e, t) { !n.isUndefined(e) && n.isUndefined(e["Content-Type"]) && (e["Content-Type"] = t); }
        var u, c = { transitional: { silentJSONParsing: !0, forcedJSONParsing: !0, clarifyTimeoutError: !1 }, adapter: (("undefined" != typeof XMLHttpRequest || "undefined" != typeof process && "[object process]" === Object.prototype.toString.call(process)) && (u = r(5)), u), transformRequest: [function (e, t) { return o(t, "Accept"), o(t, "Content-Type"), n.isFormData(e) || n.isArrayBuffer(e) || n.isBuffer(e) || n.isStream(e) || n.isFile(e) || n.isBlob(e) ? e : n.isArrayBufferView(e) ? e.buffer : n.isURLSearchParams(e) ? (a(t, "application/x-www-form-urlencoded;charset=utf-8"), e.toString()) : n.isObject(e) || t && "application/json" === t["Content-Type"] ? (a(t, "application/json"), function (e, t, r) { if (n.isString(e))
                    try {
                        return (t || JSON.parse)(e), n.trim(e);
                    }
                    catch (e) {
                        if ("SyntaxError" !== e.name)
                            throw e;
                    } return (r || JSON.stringify)(e); }(e)) : e; }], transformResponse: [function (e) { var t = this.transitional, r = t && t.silentJSONParsing, o = t && t.forcedJSONParsing, s = !r && "json" === this.responseType; if (s || o && n.isString(e) && e.length)
                    try {
                        return JSON.parse(e);
                    }
                    catch (e) {
                        if (s) {
                            if ("SyntaxError" === e.name)
                                throw i(e, this, "E_JSON_PARSE");
                            throw e;
                        }
                    } return e; }], timeout: 0, xsrfCookieName: "XSRF-TOKEN", xsrfHeaderName: "X-XSRF-TOKEN", maxContentLength: -1, maxBodyLength: -1, validateStatus: function (e) { return e >= 200 && e < 300; } };
        c.headers = { common: { Accept: "application/json, text/plain, */*" } }, n.forEach(["delete", "get", "head"], (function (e) { c.headers[e] = {}; })), n.forEach(["post", "put", "patch"], (function (e) { c.headers[e] = n.merge(s); })), e.exports = c;
    }, function (e, t, r) {
        "use strict";
        e.exports = function (e, t) { return function () { for (var r = new Array(arguments.length), n = 0; n < r.length; n++)
            r[n] = arguments[n]; return e.apply(t, r); }; };
    }, function (e, t, r) {
        "use strict";
        var n = r(0);
        function o(e) { return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]"); }
        e.exports = function (e, t, r) { if (!t)
            return e; var i; if (r)
            i = r(t);
        else if (n.isURLSearchParams(t))
            i = t.toString();
        else {
            var s = [];
            n.forEach(t, (function (e, t) { null != e && (n.isArray(e) ? t += "[]" : e = [e], n.forEach(e, (function (e) { n.isDate(e) ? e = e.toISOString() : n.isObject(e) && (e = JSON.stringify(e)), s.push(o(t) + "=" + o(e)); }))); })), i = s.join("&");
        } if (i) {
            var a = e.indexOf("#");
            -1 !== a && (e = e.slice(0, a)), e += (-1 === e.indexOf("?") ? "?" : "&") + i;
        } return e; };
    }, function (e, t, r) {
        "use strict";
        e.exports = function (e, t, r, n, o) { return e.config = t, r && (e.code = r), e.request = n, e.response = o, e.isAxiosError = !0, e.toJSON = function () { return { message: this.message, name: this.name, description: this.description, number: this.number, fileName: this.fileName, lineNumber: this.lineNumber, columnNumber: this.columnNumber, stack: this.stack, config: this.config, code: this.code }; }, e; };
    }, function (e, t, r) {
        "use strict";
        var n = r(0), o = r(17), i = r(18), s = r(3), a = r(19), u = r(22), c = r(23), f = r(6);
        e.exports = function (e) { return new Promise((function (t, r) { var p = e.data, l = e.headers, d = e.responseType; n.isFormData(p) && delete l["Content-Type"]; var h = new XMLHttpRequest; if (e.auth) {
            var m = e.auth.username || "", g = e.auth.password ? unescape(encodeURIComponent(e.auth.password)) : "";
            l.Authorization = "Basic " + btoa(m + ":" + g);
        } var v = a(e.baseURL, e.url); function y() { if (h) {
            var n = "getAllResponseHeaders" in h ? u(h.getAllResponseHeaders()) : null, i = { data: d && "text" !== d && "json" !== d ? h.response : h.responseText, status: h.status, statusText: h.statusText, headers: n, config: e, request: h };
            o(t, r, i), h = null;
        } } if (h.open(e.method.toUpperCase(), s(v, e.params, e.paramsSerializer), !0), h.timeout = e.timeout, "onloadend" in h ? h.onloadend = y : h.onreadystatechange = function () { h && 4 === h.readyState && (0 !== h.status || h.responseURL && 0 === h.responseURL.indexOf("file:")) && setTimeout(y); }, h.onabort = function () { h && (r(f("Request aborted", e, "ECONNABORTED", h)), h = null); }, h.onerror = function () { r(f("Network Error", e, null, h)), h = null; }, h.ontimeout = function () { var t = "timeout of " + e.timeout + "ms exceeded"; e.timeoutErrorMessage && (t = e.timeoutErrorMessage), r(f(t, e, e.transitional && e.transitional.clarifyTimeoutError ? "ETIMEDOUT" : "ECONNABORTED", h)), h = null; }, n.isStandardBrowserEnv()) {
            var b = (e.withCredentials || c(v)) && e.xsrfCookieName ? i.read(e.xsrfCookieName) : void 0;
            b && (l[e.xsrfHeaderName] = b);
        } "setRequestHeader" in h && n.forEach(l, (function (e, t) { void 0 === p && "content-type" === t.toLowerCase() ? delete l[t] : h.setRequestHeader(t, e); })), n.isUndefined(e.withCredentials) || (h.withCredentials = !!e.withCredentials), d && "json" !== d && (h.responseType = e.responseType), "function" == typeof e.onDownloadProgress && h.addEventListener("progress", e.onDownloadProgress), "function" == typeof e.onUploadProgress && h.upload && h.upload.addEventListener("progress", e.onUploadProgress), e.cancelToken && e.cancelToken.promise.then((function (e) { h && (h.abort(), r(e), h = null); })), p || (p = null), h.send(p); })); };
    }, function (e, t, r) {
        "use strict";
        var n = r(4);
        e.exports = function (e, t, r, o, i) { var s = new Error(e); return n(s, t, r, o, i); };
    }, function (e, t, r) {
        "use strict";
        e.exports = function (e) { return !(!e || !e.__CANCEL__); };
    }, function (e, t, r) {
        "use strict";
        var n = r(0);
        e.exports = function (e, t) { t = t || {}; var r = {}, o = ["url", "method", "data"], i = ["headers", "auth", "proxy", "params"], s = ["baseURL", "transformRequest", "transformResponse", "paramsSerializer", "timeout", "timeoutMessage", "withCredentials", "adapter", "responseType", "xsrfCookieName", "xsrfHeaderName", "onUploadProgress", "onDownloadProgress", "decompress", "maxContentLength", "maxBodyLength", "maxRedirects", "transport", "httpAgent", "httpsAgent", "cancelToken", "socketPath", "responseEncoding"], a = ["validateStatus"]; function u(e, t) { return n.isPlainObject(e) && n.isPlainObject(t) ? n.merge(e, t) : n.isPlainObject(t) ? n.merge({}, t) : n.isArray(t) ? t.slice() : t; } function c(o) { n.isUndefined(t[o]) ? n.isUndefined(e[o]) || (r[o] = u(void 0, e[o])) : r[o] = u(e[o], t[o]); } n.forEach(o, (function (e) { n.isUndefined(t[e]) || (r[e] = u(void 0, t[e])); })), n.forEach(i, c), n.forEach(s, (function (o) { n.isUndefined(t[o]) ? n.isUndefined(e[o]) || (r[o] = u(void 0, e[o])) : r[o] = u(void 0, t[o]); })), n.forEach(a, (function (n) { n in t ? r[n] = u(e[n], t[n]) : n in e && (r[n] = u(void 0, e[n])); })); var f = o.concat(i).concat(s).concat(a), p = Object.keys(e).concat(Object.keys(t)).filter((function (e) { return -1 === f.indexOf(e); })); return n.forEach(p, c), r; };
    }, function (e, t, r) {
        "use strict";
        function n(e) { this.message = e; }
        n.prototype.toString = function () { return "Cancel" + (this.message ? ": " + this.message : ""); }, n.prototype.__CANCEL__ = !0, e.exports = n;
    }, function (e, t, r) { e.exports = r(11); }, function (e, t, r) {
        "use strict";
        var n = r(0), o = r(2), i = r(12), s = r(8);
        function a(e) { var t = new i(e), r = o(i.prototype.request, t); return n.extend(r, i.prototype, t), n.extend(r, t), r; }
        var u = a(r(1));
        u.Axios = i, u.create = function (e) { return a(s(u.defaults, e)); }, u.Cancel = r(9), u.CancelToken = r(26), u.isCancel = r(7), u.all = function (e) { return Promise.all(e); }, u.spread = r(27), u.isAxiosError = r(28), e.exports = u, e.exports.default = u;
    }, function (e, t, r) {
        "use strict";
        var n = r(0), o = r(3), i = r(13), s = r(14), a = r(8), u = r(24), c = u.validators;
        function f(e) { this.defaults = e, this.interceptors = { request: new i, response: new i }; }
        f.prototype.request = function (e) { "string" == typeof e ? (e = arguments[1] || {}).url = arguments[0] : e = e || {}, (e = a(this.defaults, e)).method ? e.method = e.method.toLowerCase() : this.defaults.method ? e.method = this.defaults.method.toLowerCase() : e.method = "get"; var t = e.transitional; void 0 !== t && u.assertOptions(t, { silentJSONParsing: c.transitional(c.boolean, "1.0.0"), forcedJSONParsing: c.transitional(c.boolean, "1.0.0"), clarifyTimeoutError: c.transitional(c.boolean, "1.0.0") }, !1); var r = [], n = !0; this.interceptors.request.forEach((function (t) { "function" == typeof t.runWhen && !1 === t.runWhen(e) || (n = n && t.synchronous, r.unshift(t.fulfilled, t.rejected)); })); var o, i = []; if (this.interceptors.response.forEach((function (e) { i.push(e.fulfilled, e.rejected); })), !n) {
            var f = [s, void 0];
            for (Array.prototype.unshift.apply(f, r), f = f.concat(i), o = Promise.resolve(e); f.length;)
                o = o.then(f.shift(), f.shift());
            return o;
        } for (var p = e; r.length;) {
            var l = r.shift(), d = r.shift();
            try {
                p = l(p);
            }
            catch (e) {
                d(e);
                break;
            }
        } try {
            o = s(p);
        }
        catch (e) {
            return Promise.reject(e);
        } for (; i.length;)
            o = o.then(i.shift(), i.shift()); return o; }, f.prototype.getUri = function (e) { return e = a(this.defaults, e), o(e.url, e.params, e.paramsSerializer).replace(/^\?/, ""); }, n.forEach(["delete", "get", "head", "options"], (function (e) { f.prototype[e] = function (t, r) { return this.request(a(r || {}, { method: e, url: t, data: (r || {}).data })); }; })), n.forEach(["post", "put", "patch"], (function (e) { f.prototype[e] = function (t, r, n) { return this.request(a(n || {}, { method: e, url: t, data: r })); }; })), e.exports = f;
    }, function (e, t, r) {
        "use strict";
        var n = r(0);
        function o() { this.handlers = []; }
        o.prototype.use = function (e, t, r) { return this.handlers.push({ fulfilled: e, rejected: t, synchronous: !!r && r.synchronous, runWhen: r ? r.runWhen : null }), this.handlers.length - 1; }, o.prototype.eject = function (e) { this.handlers[e] && (this.handlers[e] = null); }, o.prototype.forEach = function (e) { n.forEach(this.handlers, (function (t) { null !== t && e(t); })); }, e.exports = o;
    }, function (e, t, r) {
        "use strict";
        var n = r(0), o = r(15), i = r(7), s = r(1);
        function a(e) { e.cancelToken && e.cancelToken.throwIfRequested(); }
        e.exports = function (e) { return a(e), e.headers = e.headers || {}, e.data = o.call(e, e.data, e.headers, e.transformRequest), e.headers = n.merge(e.headers.common || {}, e.headers[e.method] || {}, e.headers), n.forEach(["delete", "get", "head", "post", "put", "patch", "common"], (function (t) { delete e.headers[t]; })), (e.adapter || s.adapter)(e).then((function (t) { return a(e), t.data = o.call(e, t.data, t.headers, e.transformResponse), t; }), (function (t) { return i(t) || (a(e), t && t.response && (t.response.data = o.call(e, t.response.data, t.response.headers, e.transformResponse))), Promise.reject(t); })); };
    }, function (e, t, r) {
        "use strict";
        var n = r(0), o = r(1);
        e.exports = function (e, t, r) { var i = this || o; return n.forEach(r, (function (r) { e = r.call(i, e, t); })), e; };
    }, function (e, t, r) {
        "use strict";
        var n = r(0);
        e.exports = function (e, t) { n.forEach(e, (function (r, n) { n !== t && n.toUpperCase() === t.toUpperCase() && (e[t] = r, delete e[n]); })); };
    }, function (e, t, r) {
        "use strict";
        var n = r(6);
        e.exports = function (e, t, r) { var o = r.config.validateStatus; r.status && o && !o(r.status) ? t(n("Request failed with status code " + r.status, r.config, null, r.request, r)) : e(r); };
    }, function (e, t, r) {
        "use strict";
        var n = r(0);
        e.exports = n.isStandardBrowserEnv() ? { write: function (e, t, r, o, i, s) { var a = []; a.push(e + "=" + encodeURIComponent(t)), n.isNumber(r) && a.push("expires=" + new Date(r).toGMTString()), n.isString(o) && a.push("path=" + o), n.isString(i) && a.push("domain=" + i), !0 === s && a.push("secure"), document.cookie = a.join("; "); }, read: function (e) { var t = document.cookie.match(new RegExp("(^|;\\s*)(" + e + ")=([^;]*)")); return t ? decodeURIComponent(t[3]) : null; }, remove: function (e) { this.write(e, "", Date.now() - 864e5); } } : { write: function () { }, read: function () { return null; }, remove: function () { } };
    }, function (e, t, r) {
        "use strict";
        var n = r(20), o = r(21);
        e.exports = function (e, t) { return e && !n(t) ? o(e, t) : t; };
    }, function (e, t, r) {
        "use strict";
        e.exports = function (e) { return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e); };
    }, function (e, t, r) {
        "use strict";
        e.exports = function (e, t) { return t ? e.replace(/\/+$/, "") + "/" + t.replace(/^\/+/, "") : e; };
    }, function (e, t, r) {
        "use strict";
        var n = r(0), o = ["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"];
        e.exports = function (e) { var t, r, i, s = {}; return e ? (n.forEach(e.split("\n"), (function (e) { if (i = e.indexOf(":"), t = n.trim(e.substr(0, i)).toLowerCase(), r = n.trim(e.substr(i + 1)), t) {
            if (s[t] && o.indexOf(t) >= 0)
                return;
            s[t] = "set-cookie" === t ? (s[t] ? s[t] : []).concat([r]) : s[t] ? s[t] + ", " + r : r;
        } })), s) : s; };
    }, function (e, t, r) {
        "use strict";
        var n = r(0);
        e.exports = n.isStandardBrowserEnv() ? function () { var e, t = /(msie|trident)/i.test(navigator.userAgent), r = document.createElement("a"); function o(e) { var n = e; return t && (r.setAttribute("href", n), n = r.href), r.setAttribute("href", n), { href: r.href, protocol: r.protocol ? r.protocol.replace(/:$/, "") : "", host: r.host, search: r.search ? r.search.replace(/^\?/, "") : "", hash: r.hash ? r.hash.replace(/^#/, "") : "", hostname: r.hostname, port: r.port, pathname: "/" === r.pathname.charAt(0) ? r.pathname : "/" + r.pathname }; } return e = o(window.location.href), function (t) { var r = n.isString(t) ? o(t) : t; return r.protocol === e.protocol && r.host === e.host; }; }() : function () { return !0; };
    }, function (e, t, r) {
        "use strict";
        var n = r(25), o = {};
        ["object", "boolean", "number", "function", "string", "symbol"].forEach((function (e, t) { o[e] = function (r) { return typeof r === e || "a" + (t < 1 ? "n " : " ") + e; }; }));
        var i = {}, s = n.version.split(".");
        function a(e, t) { for (var r = t ? t.split(".") : s, n = e.split("."), o = 0; o < 3; o++) {
            if (r[o] > n[o])
                return !0;
            if (r[o] < n[o])
                return !1;
        } return !1; }
        o.transitional = function (e, t, r) { var o = t && a(t); function s(e, t) { return "[Axios v" + n.version + "] Transitional option '" + e + "'" + t + (r ? ". " + r : ""); } return function (r, n, a) { if (!1 === e)
            throw new Error(s(n, " has been removed in " + t)); return o && !i[n] && (i[n] = !0, console.warn(s(n, " has been deprecated since v" + t + " and will be removed in the near future"))), !e || e(r, n, a); }; }, e.exports = { isOlderVersion: a, assertOptions: function (e, t, r) { if ("object" != typeof e)
                throw new TypeError("options must be an object"); for (var n = Object.keys(e), o = n.length; o-- > 0;) {
                var i = n[o], s = t[i];
                if (s) {
                    var a = e[i], u = void 0 === a || s(a, i, e);
                    if (!0 !== u)
                        throw new TypeError("option " + i + " must be " + u);
                }
                else if (!0 !== r)
                    throw Error("Unknown option " + i);
            } }, validators: o };
    }, function (e) { e.exports = JSON.parse('{"name":"axios","version":"0.21.4","description":"Promise based HTTP client for the browser and node.js","main":"index.js","scripts":{"test":"grunt test","start":"node ./sandbox/server.js","build":"NODE_ENV=production grunt build","preversion":"npm test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json","postversion":"git push && git push --tags","examples":"node ./examples/server.js","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","fix":"eslint --fix lib/**/*.js"},"repository":{"type":"git","url":"https://github.com/axios/axios.git"},"keywords":["xhr","http","ajax","promise","node"],"author":"Matt Zabriskie","license":"MIT","bugs":{"url":"https://github.com/axios/axios/issues"},"homepage":"https://axios-http.com","devDependencies":{"coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.3.0","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^23.0.0","grunt-karma":"^4.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^4.0.2","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^6.3.2","karma-chrome-launcher":"^3.1.0","karma-firefox-launcher":"^2.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^4.3.6","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.8","karma-webpack":"^4.0.2","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^8.2.1","sinon":"^4.5.0","terser-webpack-plugin":"^4.2.3","typescript":"^4.0.5","url-search-params":"^0.10.0","webpack":"^4.44.2","webpack-dev-server":"^3.11.0"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"jsdelivr":"dist/axios.min.js","unpkg":"dist/axios.min.js","typings":"./index.d.ts","dependencies":{"follow-redirects":"^1.14.0"},"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}]}'); }, function (e, t, r) {
        "use strict";
        var n = r(9);
        function o(e) { if ("function" != typeof e)
            throw new TypeError("executor must be a function."); var t; this.promise = new Promise((function (e) { t = e; })); var r = this; e((function (e) { r.reason || (r.reason = new n(e), t(r.reason)); })); }
        o.prototype.throwIfRequested = function () { if (this.reason)
            throw this.reason; }, o.source = function () { var e; return { token: new o((function (t) { e = t; })), cancel: e }; }, e.exports = o;
    }, function (e, t, r) {
        "use strict";
        e.exports = function (e) { return function (t) { return e.apply(null, t); }; };
    }, function (e, t, r) {
        "use strict";
        e.exports = function (e) { return "object" == typeof e && !0 === e.isAxiosError; };
    }]); }));
var utils;
(function (utils) {
    utils.resize = () => {
        const functionList = [];
        const add = (fn) => functionList.push(fn);
        const run = () => {
            const w = window.visualViewport.width;
            const h = window.visualViewport.height;
            functionList.forEach(f => f(w, h));
        };
        window.onresize = run;
        return {
            add,
            run
        };
    };
})(utils || (utils = {}));
var utils;
(function (utils) {
    utils.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
})(utils || (utils = {}));
var utils;
(function (utils) {
    const { byId, byQ, add, remove } = dom;
    utils.getRadio = (radioData) => {
        const themeElements = radioData.elementList.map(tn => byId(radioData.prefix + tn));
        const newRadioData = [];
        const shift = (num) => newRadioData.forEach((rd, i) => rd.checkbox.checked = i === num);
        radioData.nameList.forEach((name, i) => {
            const click = radioData.clickList && radioData.clickList[i] ? () => {
                radioData.clickList[i]();
                core.store.set(radioData.storeName, name);
                shift(i);
            } : () => {
                core.store.set(radioData.storeName, name);
                shift(i);
            };
            const elem = themeElements[i];
            newRadioData.push({
                item: elem,
                click,
                checkbox: byQ(elem, 'input'),
                name: name,
            });
        });
        const getSaved = () => core.store.get(radioData.storeName);
        const mark = (name) => newRadioData.forEach(rd => rd.checkbox.checked = rd.name === name);
        const active = () => newRadioData.forEach(rd => add(rd.item, 'click', rd.click));
        const deactivate = () => newRadioData.forEach(rd => remove(rd.item, 'click', rd.click));
        const init = () => {
            active();
            const saved = getSaved();
            if (radioData.init)
                radioData.init(saved);
            mark(saved);
            return saved;
        };
        return {
            init,
            active,
            deactivate,
        };
    };
})(utils || (utils = {}));
var queries;
(function (queries) {
    queries.responseCommand = {
        main: {
            ddos: 'DDoS',
            ddosId: 'DDoSid',
            csrf: 'csrf',
        },
        secure: {
            noMahakala: 'noMahakala',
            wrongMahakala: 'wrongMahakala',
            generateUserId: 'generateUserId',
            go: 'go',
            testOk: 'testOk'
        },
        user: {
            set: 'userSet',
            ok: 'userOk',
            no: 'noUser',
            noId: 'noId',
            qr: 'qr',
        }
    };
})(queries || (queries = {}));
var queries;
(function (queries) {
    queries.url = (function () {
        const main = `api/`;
        const rol04 = `rol04/api/`;
        return {
            test: {
                csrf: `${main}csrf`,
                ddos: `${main}ddos`,
                ddosId: `${main}ddos-id`,
                noMahakala: `${main}no-mahakala`,
                wrongMahakala: `${main}wrong-mahakala`,
            },
            secure: {
                get: `${main}secure`,
                test: `${main}secure-test`,
            },
            user: {
                set: `${rol04}set-user`,
                check: `${rol04}check-user`,
                getQr: `${rol04}get-user-qr-code`,
                setQr: `${rol04}set-user-by-qr-code`,
            },
            data: {
                version: `${rol04}get-version`,
                config: `${rol04}get-config`,
                questions: `${rol04}get-questions`,
                images: `${rol04}get-images`,
            },
        };
    }());
})(queries || (queries = {}));
var queries;
(function (queries) {
    const okCodes = [304, 401, 403, 429];
    queries.api = axios.create({
        baseURL: 'https://192.168.1.109:3331/',
        validateStatus: function (status) {
            return status >= 200 && status < 300 || okCodes.some(c => c === status);
        }
    });
})(queries || (queries = {}));
var queries;
(function (queries) {
    let test;
    (function (test) {
        test.getCsrf = async () => await queries.checkError(async () => {
            return await queries.api.get(queries.url.test.csrf, {
                withCredentials: true,
            });
        }, queries.url.test.csrf);
        test.getDdos = async () => queries.checkError(async () => {
            return await queries.api.get(queries.url.test.ddos, {
                withCredentials: true,
            });
        }, queries.url.test.ddos);
        test.getDdosId = async () => queries.checkError(async () => {
            return await queries.api.get(queries.url.test.ddosId, {
                withCredentials: true,
            });
        }, queries.url.test.ddosId);
        test.getNoMahakala = async () => queries.checkError(async () => {
            return await queries.api.get(queries.url.test.noMahakala, {
                withCredentials: true,
            });
        }, queries.url.test.noMahakala);
        test.getWrongMahakala = async () => queries.checkError(async () => {
            return await queries.api.get(queries.url.test.wrongMahakala, {
                withCredentials: true,
            });
        }, queries.url.test.wrongMahakala);
    })(test = queries.test || (queries.test = {}));
})(queries || (queries = {}));
var queries;
(function (queries) {
    queries.responseState = {
        ok: 'ok',
        noNetwork: 'noNetwork',
        csrf: 'csrf',
        ddos: 'ddos',
        ddosId: 'DDoSid',
        noMahakala: 'noMahakala',
        wrongMahakala: 'wrongMahakala',
        otherProblem: 'otherProblem',
        error: 'error'
    };
    const baseErrorsChecker = async (promise) => {
        return await promise()
            .then((response) => {
            const okCodes = [200, 304];
            if (okCodes.includes(response?.status)) {
                return {
                    state: queries.responseState.ok,
                    data: response.data,
                };
            }
            if (response?.status === 403) {
                return {
                    state: queries.responseState.csrf,
                    data: response.data,
                };
            }
            if (response?.status === 429) {
                if (response.data.command === queries.responseCommand.main.ddos) {
                    return {
                        state: queries.responseState.ddos,
                        data: response.data,
                    };
                }
                else {
                    return {
                        state: queries.responseState.ddosId,
                        data: response.data,
                    };
                }
            }
            if (response?.status === 401) {
                if (response.data.command === queries.responseCommand.secure.noMahakala) {
                    return {
                        state: queries.responseState.noMahakala,
                        data: response.data,
                    };
                }
                else {
                    return {
                        state: queries.responseState.wrongMahakala,
                        data: response.data,
                    };
                }
            }
            return {
                state: queries.responseState.otherProblem,
                data: response?.data,
            };
        }).catch((error) => {
            if (error.code === "ERR_NETWORK" || !error.response) {
                const result = {
                    state: queries.responseState.noNetwork,
                    data: null,
                };
                return result;
            }
            const errorState = error.response?.status ? `${queries.responseState.error}: ${error.response?.status}` : null;
            return {
                state: errorState,
                data: error.response?.data ?? null,
            };
        });
    };
    queries.checkError = async (promise, endpointName) => {
        const response = await baseErrorsChecker(promise);
        const canGo = true;
        if (response.state === queries.responseState.ok) {
            return response.data;
        }
        return new Promise((resolve) => {
            const onClose = () => {
                resolve(response?.data);
                return response.data;
            };
            const getShow = (txt) => {
                if (endpointName) {
                    modal.error.show(`endpoint: .../${endpointName}<br><br>${txt}`, canGo, onClose);
                }
                else {
                    modal.error.show(txt, canGo, onClose);
                }
            };
            switch (response.state) {
                case queries.responseState.noNetwork:
                    getShow('Brak dostępu do sieci.');
                    break;
                case queries.responseState.csrf:
                    getShow('CSRF token jest błędny.');
                    break;
                case queries.responseState.ddos:
                    getShow('Przekroczono limit zapytań do serwera. Limit zrestartuje się za godzinę.');
                    break;
                case queries.responseState.ddosId:
                    getShow('Przekroczono limit tworzenia uzytkownikow na dzień.  Limit zrestartuje się za 24 godziny');
                    break;
                case queries.responseState.noMahakala:
                    getShow('Brak mahakala token');
                    break;
                case queries.responseState.wrongMahakala:
                    getShow('Wadliwy mahakala token');
                    break;
                case queries.responseState.otherProblem:
                    getShow('Nieznany problem.');
                    break;
                case queries.responseState.error:
                    getShow(response.state);
                    break;
            }
        });
    };
})(queries || (queries = {}));
var queries;
(function (queries) {
    let secure;
    (function (secure) {
        secure.getSecure = async () => queries.checkError(async () => {
            return await queries.api.get(queries.url.secure.get, {
                withCredentials: true,
            });
        });
    })(secure = queries.secure || (queries.secure = {}));
})(queries || (queries = {}));
var queries;
(function (queries) {
    let secure;
    (function (secure) {
        secure.secureTest = async () => {
            try {
                const response = await queries.api.post(queries.url.secure.test, {}, {
                    withCredentials: true,
                });
                const data = response.data;
                console.log('---->>> ', data);
                return data;
            }
            catch (error) {
                console.error('Błąd podczas pobierania konfiguracji:', error);
                return null;
            }
        };
    })(secure = queries.secure || (queries.secure = {}));
})(queries || (queries = {}));
var queries;
(function (queries) {
    let user;
    (function (user) {
        user.checkId = async (userId) => {
            const result = await queries.api.post(queries.url.user.check, { userId }, { withCredentials: true, });
            return result.data;
        };
    })(user = queries.user || (queries.user = {}));
})(queries || (queries = {}));
var queries;
(function (queries) {
    let user;
    (function (user) {
        user.set = async () => {
            const result = await queries.api.post(queries.url.user.set, {}, { withCredentials: true });
            return result.data;
        };
    })(user = queries.user || (queries.user = {}));
})(queries || (queries = {}));
var queries;
(function (queries) {
    let data;
    (function (data) {
        data.getVersion = async (version) => {
            const result = await queries.api.post(queries.url.data.version, { version }, { withCredentials: true, });
            return result.data;
        };
    })(data = queries.data || (queries.data = {}));
})(queries || (queries = {}));
var queries;
(function (queries) {
    let data;
    (function (data) {
        data.getConfig = async () => {
            const result = await queries.api.get(queries.url.data.config, { withCredentials: true, });
            return result.data;
        };
    })(data = queries.data || (queries.data = {}));
})(queries || (queries = {}));
var controllers;
(function (controllers) {
    const { add } = dom;
    const keysListener = (event) => {
        console.log('%c event.code:', 'background: #ffcc00; color: #003300', event.code);
        switch (event.code) {
            case 'Tab':
                {
                    event.preventDefault();
                }
                break;
            case 'Space':
                {
                    tab.mobile.changeVisibility();
                }
                break;
            case 'ArrowRight':
            case 'KeyD':
                {
                    tab.goRight();
                }
                break;
            case 'ArrowLeft':
            case 'KeyA':
                {
                    tab.goLeft();
                }
                break;
        }
    };
    controllers.initKeys = () => {
        document.addEventListener('keydown', keysListener);
    };
})(controllers || (controllers = {}));
var starter;
(function (starter) {
    const { byId, add, getPx, setStyle, setAttribute } = dom;
    starter.elements = {
        logoDark: null,
        logoLight: null,
        svgTitle: null,
        title_1: null,
        title_2: null,
        userLabel: null,
        userId: null,
        statusNow: null,
        statusAction: null,
        version: null,
    };
    starter.init = async () => {
        starter.elements.logoDark = byId('logo-dark');
        starter.elements.logoLight = byId('logo-light');
        starter.elements.svgTitle = byId('starter-svg-title');
        starter.elements.title_1 = byId('starter-title-1');
        starter.elements.title_2 = byId('starter-title-2');
        starter.elements.userLabel = byId('starter-user-label');
        starter.elements.userId = byId('starter-user-id');
        starter.elements.statusNow = byId('status-now');
        starter.elements.statusAction = byId('status-action');
        starter.elements.version = byId('starter-version');
    };
    starter.resize = (w, h) => {
        const versionX = w - starter.elements.version.getComputedTextLength() - 6 - (core.isMobile ? 0 : 200);
        const versionY = h - 6;
        setAttribute(starter.elements.version, 'x', `${getPx(versionX)}`);
        setAttribute(starter.elements.version, 'y', `${getPx(versionY)}`);
        const svgHeight = `${getPx(h)}`;
        const setTitleSize = (size) => {
            setStyle(starter.elements.svgTitle, 'height', svgHeight);
            const fontSize = `${getPx(size)}`;
            let y = size;
            [starter.elements.title_1, starter.elements.title_2].forEach(title => {
                setStyle(title, 'fontSize', fontSize);
                setStyle(title, 'lineHeight', fontSize);
                setAttribute(title, 'y', `${getPx(y)}`);
                y += size * 1.1;
            });
            y += 50;
            [starter.elements.userLabel, starter.elements.userId].forEach(user => {
                setAttribute(user, 'y', `${getPx(y)}`);
                y += 24;
            });
            y += 20;
            [starter.elements.statusNow, starter.elements.statusAction].forEach(status => {
                setAttribute(status, 'y', `${getPx(y)}`);
                y += 24;
            });
        };
        const setLogoSize = (width, height) => {
            [starter.elements.logoDark, starter.elements.logoLight].forEach((elem) => {
                setStyle(elem, 'width', width);
                setStyle(elem, 'height', height);
            });
        };
        if (core.isMobile) {
            const fontSize = w / 7;
            setTitleSize(fontSize);
            setLogoSize('100%', 'nope');
        }
        else {
            const fontSize = (w < h) ? w / 12 : h / 12;
            setTitleSize(fontSize);
            if (w < h) {
                setLogoSize('100%', 'nope');
            }
            else {
                const scaledH = h * 0.6;
                const height = `${scaledH}px`;
                const ratio = 270.9 / 289.7;
                const width = `${scaledH * ratio}px`;
                setLogoSize(width, height);
            }
        }
    };
    starter.active = () => { };
    starter.deactivate = () => { };
})(starter || (starter = {}));
var starter;
(function (starter) {
    let user;
    (function (user) {
        const { inner, setStyle, disable, enable } = dom;
        const memoUserId = (userId) => {
            core.store.set(storageNames.userId, userId);
            dom.inner(starter.elements.userId, userId);
        };
        const alphabetData = {
            azSmall: 'qwertyuiopasdfghjklzxcvbnm',
            azBig: 'QWERTYUIOPASDFGHJKLZXCVBNM',
            numbers: '1234567890',
        };
        const ALPHABET = alphabetData.numbers + alphabetData.azSmall + alphabetData.azBig;
        const regex = new RegExp(`^[${ALPHABET}]{21}$`);
        user.init = async () => {
            const secure = await queries.secure.getSecure();
            console.log('%c secure:', 'background:rgb(0, 42, 255); color: #003300', secure);
            if (secure.command === queries.responseCommand.secure.generateUserId) {
                const setNewUser = async () => {
                    const userIdSet = await queries.user.set();
                    memoUserId(userIdSet.userId);
                };
                const getNo = (info, btn) => (text) => {
                    inner(info, text);
                    setStyle(info, 'color', 'var(--off_prime_color)');
                    disable(btn);
                };
                const validateUserId = (info, btn) => (event) => {
                    const value = event.target.value;
                    const no = getNo(info, btn);
                    if (value.length < 21) {
                        no('Za krótki min 21 znaków');
                        return;
                    }
                    if (value.length > 21) {
                        no('Za długi max 21 znaków');
                        return;
                    }
                    if (!regex.test(value)) {
                        no('String zawiera niedozwolone znaki');
                        return;
                    }
                    inner(info, 'jest OK.');
                    setStyle(info, 'color', 'var(--on_second_color)');
                    enable(btn);
                };
                const checkUserId = (info, btn, input, hide) => async () => {
                    const userIdSet = await queries.user.checkId(input.value);
                    console.log('%c userIdSet:', 'background: #ffcc00; color: #003300', userIdSet);
                    const state = userIdSet.command;
                    const no = getNo(info, btn);
                    if (state === queries.responseCommand.user.ok) {
                        memoUserId(input.value);
                        hide();
                    }
                    else {
                        no('Niema takiego użytkownika');
                    }
                };
                modal.user.show(setNewUser, validateUserId, checkUserId);
            }
            else if (secure.command === queries.responseCommand.secure.go) {
                memoUserId(secure.userId);
            }
        };
    })(user = starter.user || (starter.user = {}));
})(starter || (starter = {}));
var starter;
(function (starter) {
    let data;
    (function (data) {
        data.check = async () => {
            const versionDb = await core.store.get(storageNames.version);
            const response = await queries.data.getVersion(versionDb);
            const versionRes = response.version;
            if (versionRes !== versionDb) {
                const configRes = await queries.data.getConfig();
                const configDb = await core.store.get(storageNames.config);
                console.log('%c configDb:', 'background: #ffcc00; color: #003300', configDb);
                if (configRes.tests !== configDb.tests) {
                }
            }
        };
    })(data = starter.data || (starter.data = {}));
})(starter || (starter = {}));
var starter;
(function (starter) {
    starter.run = async () => {
        await starter.user.init();
        await starter.data.check();
    };
})(starter || (starter = {}));
var statistics;
(function (statistics) {
    statistics.init = () => { };
    statistics.active = () => { };
    statistics.deactivate = () => { };
})(statistics || (statistics = {}));
var learning;
(function (learning) {
    const { byId, byQueryAll, setStyle, add, remove } = dom;
    const elements = {
        question: null,
        answers: null,
        answersField: null,
        checkbox: null,
        confirm: null,
    };
    const mark = (num) => () => {
        elements.checkbox.forEach((a, i) => a.checked = (i === num));
        elements.answersField.forEach((a, i) => i === num ? setStyle(a, 'border', '2px solid var(--mine_color)') : setStyle(a, 'border', '2px solid transparent'));
    };
    learning.init = () => {
        elements.question = byId('question');
        elements.answers = byQueryAll('.answer p');
        elements.answersField = byQueryAll('.answer');
        elements.checkbox = byQueryAll('.answer input');
        elements.checkbox.forEach(c => c.checked = false);
        elements.confirm = byId('learning-confirm-btn');
        mark(-1)();
    };
    learning.active = () => {
        elements.answersField.forEach((a, i) => add(a, 'click', mark(i)));
    };
    learning.deactivate = () => {
        elements.answersField.forEach((a, i) => remove(a, 'click', mark(i)));
    };
})(learning || (learning = {}));
var answers;
(function (answers) {
    answers.init = () => { };
    answers.active = () => { };
    answers.deactivate = () => { };
})(answers || (answers = {}));
var settings;
(function (settings) {
    let info;
    (function (info) {
        const { byId, byQuery, getPx, setStyle, add, remove } = dom;
        const elements = {
            settingsAppInfo: null,
            settingsAppInfoMore: null,
            settingsAppInfoLess: null,
            settingsAppInfoContent: null,
        };
        const state = {
            settingsAppInfoContentHeight: null
        };
        info.init = () => {
            elements.settingsAppInfo = byId('settings-app-info-title');
            elements.settingsAppInfoMore = byId('settings-app-info-more');
            elements.settingsAppInfoLess = byId('settings-app-info-less');
            elements.settingsAppInfoContent = byId('settings-app-info-content');
            const contentBox = elements.settingsAppInfoContent.getBoundingClientRect();
            state.settingsAppInfoContentHeight = contentBox.height;
            setStyle(elements.settingsAppInfoLess, 'display', 'none');
            setStyle(elements.settingsAppInfoContent, 'height', '0px');
        };
        info.active = () => {
            add(elements.settingsAppInfo, 'click', () => {
                setStyle(elements.settingsAppInfoContent, 'height', `${state.settingsAppInfoContentHeight}px`);
            });
        };
        info.deactivate = () => { };
    })(info = settings.info || (settings.info = {}));
})(settings || (settings = {}));
var settings;
(function (settings) {
    let dataControl;
    (function (dataControl) {
        const { byId, byQuery, getPx, setStyle } = dom;
        const ids = {
            prefix: 'setting-data-',
            questions: {
                offline: 'questions-offline',
                online: 'questions-online',
            },
            img: {
                offline: 'img-offline',
                online: 'img-online',
            },
        };
        const valuesList = [checked.yes, checked.no];
        const questionsNames = Object.values(ids.questions);
        const controlQuestionsData = {
            prefix: ids.prefix,
            storeName: storageNames.questionsData,
            elementList: questionsNames,
            nameList: valuesList,
        };
        const imgNames = Object.values(ids.img);
        const controlImgData = {
            prefix: ids.prefix,
            storeName: storageNames.imgData,
            elementList: imgNames,
            nameList: valuesList,
        };
        dataControl.init = () => {
            dataControl.questionsRatio = utils.getRadio(controlQuestionsData);
            dataControl.questionsRatio.init();
            dataControl.imgRatio = utils.getRadio(controlImgData);
            dataControl.imgRatio.init();
        };
    })(dataControl = settings.dataControl || (settings.dataControl = {}));
})(settings || (settings = {}));
var settings;
(function (settings) {
    const { root, setAttribute, setStyle, removeClass, addClass } = dom;
    let theme;
    (function (theme_1) {
        theme_1.theme = {
            dark: 'dark',
            light: 'light',
        };
        theme_1.themeMode = {
            ...theme_1.theme,
            system: 'system',
        };
        const themeNames = Object.values(theme_1.themeMode);
        const memo = {
            theme: null
        };
        theme_1.get = () => memo.theme;
        const apply = (theme) => {
            root.setAttribute('data-theme', theme);
            setAttribute(root, 'data-theme', theme);
            removeClass(root, theme_1.themeMode.dark);
            removeClass(root, theme_1.themeMode.light);
            addClass(root, theme);
            setStyle(root, 'colorScheme', theme);
        };
        const setSystemTheme = () => {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const newTheme = systemPrefersDark ? theme_1.theme.dark : theme_1.theme.light;
            apply(newTheme);
            memo.theme = newTheme;
        };
        const set = (saved) => {
            if (saved === theme_1.theme.dark || saved === theme_1.theme.light) {
                apply(saved);
                return saved;
            }
            if (saved === theme_1.themeMode.system) {
                setSystemTheme();
                return saved;
            }
            core.store.set(storageNames.theme, theme_1.themeMode.system);
            setSystemTheme();
            return theme_1.themeMode.system;
        };
        const themeData = {
            prefix: 'setting-theme-',
            storeName: storageNames.theme,
            elementList: themeNames,
            nameList: themeNames,
            clickList: themeNames.map((name, i) => () => set(name)),
            init: set,
        };
        theme_1.init = async () => {
            theme_1.ratio = utils.getRadio(themeData);
            theme_1.ratio.init();
        };
    })(theme = settings.theme || (settings.theme = {}));
})(settings || (settings = {}));
var settings;
(function (settings) {
    const { byQuery, getPx, setStyle } = dom;
    const elements = {
        scrollBox: null,
    };
    settings.resize = (w, h) => {
        setStyle(elements.scrollBox, 'height', `calc(${getPx(h)} - 32px - var(--font_title_size))`);
    };
    settings.init = () => {
        elements.scrollBox = byQuery('#settings-tab-box .scroll-box');
        settings.info.init();
        settings.theme.init();
        settings.dataControl.init();
    };
    settings.active = () => {
        settings.info.active();
        settings.theme.ratio.active();
        settings.dataControl.questionsRatio.active();
        settings.dataControl.imgRatio.active();
    };
    settings.deactivate = () => {
        settings.info.deactivate();
        settings.theme.ratio.deactivate();
        settings.dataControl.questionsRatio.deactivate();
        settings.dataControl.imgRatio.deactivate();
    };
})(settings || (settings = {}));
var tab;
(function (tab_1) {
    const { byId, byQueryAll, getPx, setStyle, display, add } = dom;
    const WEB_MENU_WIDTH = 200;
    const elements = {
        carousel: null,
        carouselBox: null,
        allTabs: null,
        tabs: null,
        menu: {
            web: null,
            mobile: null,
            items: null
        },
    };
    tab_1.state = {
        screen: 0,
        max: 0,
        carouselLeftPos: 0,
        tabWidth: 0,
    };
    tab_1.screens = [
        starter,
        statistics,
        learning,
        answers,
        settings
    ];
    const getTabLeftPos = () => (tab_1.state.tabWidth * tab_1.state.screen);
    tab_1.setTab = () => {
        elements.carousel.style.left = getPx(-getTabLeftPos());
        tab_1.screens.forEach((s, i) => (i === tab_1.state.screen) ? s.active() : s.deactivate());
    };
    tab_1.goLeft = () => {
        if (tab_1.state.screen > 0) {
            tab_1.state.screen--;
            tab_1.setTab();
        }
    };
    tab_1.goRight = () => {
        if (tab_1.state.screen < tab_1.state.max - 1) {
            tab_1.state.screen++;
            tab_1.setTab();
        }
    };
    tab_1.getGoTo = (screenNum) => () => {
        tab_1.state.screen = screenNum;
        tab_1.setTab();
    };
    tab_1.blur = () => {
        setStyle(elements.allTabs, 'filter', 'blur(5px)');
    };
    tab_1.unBlur = () => {
        setStyle(elements.allTabs, 'filter', 'blur(0px)');
    };
    tab_1.init = () => {
        elements.carousel = byId('carousel');
        elements.carouselBox = byId('carousel-box');
        elements.allTabs = byId('tabs');
        elements.tabs = byQueryAll('.tab');
        tab_1.state.max = elements.tabs.length;
        elements.menu.web = byId('menu-web');
        if (core.isMobile) {
            display(elements.menu.web, 'none');
        }
        else {
            tab_1.state.carouselLeftPos = WEB_MENU_WIDTH;
            elements.menu.items = byQueryAll('.menu-web-item');
            for (let i = 0; i < elements.menu.items.length; ++i) {
                const item = elements.menu.items[i];
                add(item, 'click', tab_1.getGoTo(i));
            }
        }
    };
    tab_1.resize = (w, h) => {
        tab_1.state.tabWidth = w - tab_1.state.carouselLeftPos;
        for (let i = 0; i < elements.tabs.length; ++i) {
            const tab = elements.tabs[i];
            setStyle(tab, 'width', getPx(tab_1.state.tabWidth));
            setStyle(tab, 'height', getPx(h));
        }
        setStyle(elements.allTabs, 'width', getPx(w));
        setStyle(elements.allTabs, 'height', getPx(h));
        setStyle(elements.carouselBox, 'width', getPx(tab_1.state.tabWidth));
        setStyle(elements.carouselBox, 'left', getPx(tab_1.state.carouselLeftPos));
        setStyle(elements.carousel, 'width', getPx(tab_1.state.max * tab_1.state.tabWidth));
        tab_1.setTab();
    };
})(tab || (tab = {}));
var tab;
(function (tab) {
    let mobile;
    (function (mobile) {
        const { setStyle } = dom;
        const vizElem = {
            menu: [
                ['width', 'mobile_diameter'],
                ['height', 'mobile_diameter'],
                ['right', 'mobile_negative_radius'],
                ['bottom', 'mobile_negative_radius'],
            ],
            back: [
                ['width', 'mobile_back_diameter'],
                ['height', 'mobile_back_diameter'],
                ['bottom', 'mobile_negative_radius'],
                ['right', 'mobile_negative_radius'],
            ],
            dot: [
                ['width', 'mobile_dot'],
                ['height', 'mobile_dot'],
            ],
            iconHide: [
                ['bottom', 'mobile_icon_hide_pos'],
                ['right', 'mobile_icon_hide_pos'],
            ],
        };
        const setTypeValues = {
            on: '_on',
            off: '_off',
        };
        const getCssValue = (val, setType) => `var(--${val}${setType})`;
        const set = (key, val, setType) => setStyle(mobile.elements[key], val[0], getCssValue(val[1], setType));
        const setOn = (key, val) => set(key, val, setTypeValues.on);
        const setOff = (key, val) => set(key, val, setTypeValues.off);
        const getShow = () => () => {
            Object.keys(vizElem).forEach((key) => vizElem[key].forEach(val => setOn(key, val)));
            mobile.elements.items.forEach((item) => setStyle(item, 'top', 'var(--mobile_negative_radius_on)'));
            setStyle(mobile.elements.dot, 'backgroundColor', 'var(--mobile_color_prime)');
        };
        const getHide = () => () => {
            Object.keys(vizElem).forEach((key) => vizElem[key].forEach(val => setOff(key, val)));
            mobile.elements.items.forEach((item) => setStyle(item, 'top', 'var(--mobile_negative_radius_off)'));
            setStyle(mobile.elements.dot, 'backgroundColor', 'var(--mobile_color_second)');
        };
        const show = getShow();
        const hide = getHide();
        let visible = true;
        mobile.changeVisibility = () => {
            if (visible) {
                hide();
                visible = false;
            }
            else {
                show();
                visible = true;
            }
        };
    })(mobile = tab.mobile || (tab.mobile = {}));
})(tab || (tab = {}));
var tab;
(function (tab) {
    let mobile;
    (function (mobile) {
        let touch;
        (function (touch) {
            const { byId, byQAll, getPx, setStyle, add } = dom;
            const state = {
                pivot: {
                    x: 0,
                    y: 0,
                },
                start: {
                    x: 0,
                    y: 0,
                },
                originAngle: 0,
                startAngle: 0,
                angle: 0,
            };
            touch.resize = () => {
                const menu = mobile.elements.menu.getBoundingClientRect();
                const r = menu.width / 2;
                state.pivot.x = menu.left + r;
                state.pivot.y = menu.top + r;
                console.log('%c state:', 'background: #ffcc00; color: #003300', state.pivot);
            };
            const setDeg = () => {
                const style = window.getComputedStyle(mobile.elements.list);
                const transform = style.transform;
                const values = transform.match(/matrix\(([^)]+)\)/)?.[1].split(',').map(v => parseFloat(v));
                if (values) {
                    const [a, b, c, d] = values;
                    const angleRad = Math.atan2(b, a);
                    const angleDeg = angleRad * 180 / Math.PI;
                    state.originAngle = angleDeg;
                }
            };
            const getDeg = () => `rotate(${(state.originAngle + state.angle - state.startAngle)}deg)`;
            const rotate = () => {
                setStyle(mobile.elements.list, 'transform', getDeg());
            };
            const getAngle = (dx, dy) => Math.atan2(dx, -dy) * 180 / Math.PI;
            const touchstart = (e) => {
                const t = e.touches[0];
                state.start.x = t.clientX;
                state.start.y = t.clientY;
                const dx = state.start.x - state.pivot.x;
                const dy = state.start.y - state.pivot.y;
                state.startAngle = getAngle(dx, dy);
                setDeg();
            };
            const touchmove = (e) => {
                const t = e.touches[0];
                const x = t.clientX;
                const y = t.clientY;
                const dx = x - state.pivot.x;
                const dy = y - state.pivot.y;
                state.angle = getAngle(dx, dy);
                rotate();
            };
            const touchend = (e) => {
                const t = e.changedTouches[0];
                const x = t.clientX;
                const y = t.clientY;
                console.log(x, y);
            };
            touch.init = () => {
                add(mobile.elements.menu, 'touchstart', touchstart);
                add(mobile.elements.menu, 'touchmove', touchmove);
                add(mobile.elements.menu, 'touchend', touchend);
            };
        })(touch = mobile.touch || (mobile.touch = {}));
    })(mobile = tab.mobile || (tab.mobile = {}));
})(tab || (tab = {}));
var tab;
(function (tab) {
    let simpleMenu;
    (function (simpleMenu) {
        const { byId, byQuery, byQAll, getPx, setStyle } = dom;
        simpleMenu.elements = {
            menu: null,
        };
        simpleMenu.resize = () => {
        };
        simpleMenu.init = () => {
        };
    })(simpleMenu = tab.simpleMenu || (tab.simpleMenu = {}));
})(tab || (tab = {}));
var tab;
(function (tab) {
    let mobile;
    (function (mobile) {
        const { byId, byQuery, byQAll, getPx, setStyle } = dom;
        mobile.elements = {
            menu: null,
            back: null,
            list: null,
            items: null,
            dot: null,
            iconHide: null,
        };
        mobile.resize = () => {
            mobile.touch.resize();
        };
        mobile.init = () => {
            mobile.elements.menu = byId('menu-mobile');
            mobile.elements.back = byId('menu-mobile-back');
            mobile.elements.list = byQuery('.menu-mobile-list');
            mobile.elements.items = byQAll(mobile.elements.menu, '.menu-mobile-item');
            mobile.elements.dot = byId('menu-mobile-dot');
            mobile.elements.iconHide = byId('menu-mobile-icon-hide');
            setStyle(mobile.elements.back, 'display', 'initial');
            mobile.touch.init();
        };
    })(mobile = tab.mobile || (tab.mobile = {}));
})(tab || (tab = {}));
var modal;
(function (modal_1) {
    const { byId, inner, setStyle, add, remove } = dom;
    const elements = {
        modal: null,
        btnNewUser: null,
        idInfo: null,
        idInput: null,
        btnOldUser: null,
    };
    const hideUserModal = () => {
        modal_1.hide();
        setStyle(elements.modal, 'display', 'none');
    };
    modal_1.user = {
        init: () => {
            elements.btnNewUser = byId('modal-user-btn-new-user');
            elements.modal = byId('modal-user');
            elements.idInfo = byId('modal-user-id-info');
            elements.idInput = byId('modal-user-id-input');
            elements.btnOldUser = byId('modal-user-btn-old-user');
            console.log('%c elements:', 'background: #ffcc00; color: #003300', elements);
        },
        show: (setNewUser, getValidateUserId, getCheckUserId) => {
            modal_1.show();
            const { modal, btnNewUser, idInfo, idInput, btnOldUser } = elements;
            setStyle(modal, 'display', 'flex');
            btnOldUser.disabled = true;
            add(btnNewUser, 'click', async () => {
                await setNewUser();
                hideUserModal();
            });
            const validateUserId = getValidateUserId(idInfo, btnOldUser);
            add(idInput, 'input', validateUserId);
            const checkUserId = getCheckUserId(idInfo, btnOldUser, idInput, hideUserModal);
            add(btnOldUser, 'click', checkUserId);
        },
        hide: hideUserModal
    };
})(modal || (modal = {}));
var modal;
(function (modal) {
    const { byId, byQuery, getPx, setStyle, inner, add, remove } = dom;
    const elements = {
        modal: null,
        txt: null,
        info: null,
        btn: null,
    };
    const reload = () => window.location.reload();
    let close = null;
    modal.error = {
        init: () => {
            elements.modal = byId('modal-error');
            elements.txt = byId('modal-error-txt');
            elements.info = byId('modal-error-info');
            elements.btn = byId('modal-error-btn');
        },
        show: (err, canWork, onClose) => {
            modal.show();
            setStyle(elements.modal, 'display', 'flex');
            close = onClose;
            if (canWork) {
                inner(elements.txt, err);
                inner(elements.info, "Będzie działać dzięki zapamiętanym danym.");
                setStyle(elements.info, 'color', 'var(--on_prime_color)');
                inner(elements.btn, 'Dalej');
                add(elements.btn, 'click', modal.error.hide);
            }
            else {
                inner(elements.txt, err);
                inner(elements.info, 'Brak danych aby uruchomić aplikację.');
                setStyle(elements.info, 'color', 'var(--off_prime_color)');
                inner(elements.btn, 'Przeładuj');
                add(elements.btn, 'click', reload);
            }
        },
        hide: () => {
            modal.hide();
            setStyle(elements.modal, 'display', 'none');
            remove(elements.btn, 'click', reload);
            remove(elements.btn, 'click', modal.error.hide);
            if (close)
                close();
        }
    };
})(modal || (modal = {}));
var modal;
(function (modal) {
    const { byId, getPx, setStyle, add } = dom;
    const elements = {
        modal: null,
        back: null,
    };
    modal.init = () => {
        elements.modal = byId('modal');
        elements.back = byId('modal-back');
        modal.error.init();
        modal.user.init();
    };
    modal.resize = (w, h) => {
        setStyle(elements.back, 'width', getPx(w));
        setStyle(elements.back, 'height', getPx(h));
    };
    let visible = false;
    modal.show = () => {
        visible = true;
        setStyle(elements.modal, 'opacity', '0');
        setStyle(elements.modal, 'display', 'flex');
        setTimeout(() => {
            setStyle(elements.modal, 'opacity', '1');
        }, 30);
        tab.blur();
    };
    modal.hide = () => {
        visible = false;
        setStyle(elements.modal, 'opacity', '0');
        setTimeout(() => {
            if (!visible) {
                setStyle(elements.modal, 'display', 'none');
            }
        }, 330);
        tab.unBlur();
    };
})(modal || (modal = {}));
var tests;
(function (tests) {
    tests.errorModal = async () => {
        const test1 = await queries.test.getCsrf();
        console.log('test 1:', test1);
        await utils.sleep(100);
        const test2 = await queries.test.getDdos();
        console.log('test 2:', test2);
        await utils.sleep(100);
        const test3 = await queries.test.getDdosId();
        console.log('test 3:', test3);
        await utils.sleep(100);
        const test4 = await queries.test.getNoMahakala();
        console.log('test 4:', test4);
        await utils.sleep(100);
        const test5 = await queries.test.getWrongMahakala();
        console.log('test 5:', test5);
    };
})(tests || (tests = {}));
const serviceWorker = () => {
    console.log('serviceWorker');
    if ("serviceWorker" in navigator) {
        console.log('serviceWorker - ok');
    }
    navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("Service Worker zarejestrowany"))
        .catch((err) => console.error("Błąd SW:", err));
};
(function () {
    axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
    axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
    axios.defaults.withCredentials = true;
    const modules = [
        ...tab.screens,
        tab,
        modal
    ];
    getStorage().then(async (store) => {
        core.store = store;
        document.addEventListener("DOMContentLoaded", () => {
            controllers.initKeys();
            modules.forEach(m => { if (m.init)
                m.init(); });
            const resize = utils.resize();
            modules.forEach(m => { if (m.resize) {
                resize.add(m.resize);
            } });
            resize.run();
            setTimeout(starter.run, 300);
            setTimeout(() => {
                tab.getGoTo(0)();
            }, 100);
        });
        setConsole();
        serviceWorker();
    });
}());

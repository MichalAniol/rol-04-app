"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all3) => {
    for (var name in all3)
      __defProp(target, name, { get: all3[name], enumerable: true });
  };

  // node_modules/axios/lib/helpers/bind.js
  function bind(fn, thisArg) {
    return function wrap() {
      return fn.apply(thisArg, arguments);
    };
  }

  // node_modules/axios/lib/utils.js
  var { toString } = Object.prototype;
  var { getPrototypeOf } = Object;
  var { iterator, toStringTag } = Symbol;
  var kindOf = /* @__PURE__ */ ((cache) => (thing) => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  })(/* @__PURE__ */ Object.create(null));
  var kindOfTest = (type) => {
    type = type.toLowerCase();
    return (thing) => kindOf(thing) === type;
  };
  var typeOfTest = (type) => (thing) => typeof thing === type;
  var { isArray } = Array;
  var isUndefined = typeOfTest("undefined");
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
  }
  var isArrayBuffer = kindOfTest("ArrayBuffer");
  function isArrayBufferView(val) {
    let result;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
      result = ArrayBuffer.isView(val);
    } else {
      result = val && val.buffer && isArrayBuffer(val.buffer);
    }
    return result;
  }
  var isString = typeOfTest("string");
  var isFunction = typeOfTest("function");
  var isNumber = typeOfTest("number");
  var isObject = (thing) => thing !== null && typeof thing === "object";
  var isBoolean = (thing) => thing === true || thing === false;
  var isPlainObject = (val) => {
    if (kindOf(val) !== "object") {
      return false;
    }
    const prototype2 = getPrototypeOf(val);
    return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(toStringTag in val) && !(iterator in val);
  };
  var isEmptyObject = (val) => {
    if (!isObject(val) || isBuffer(val)) {
      return false;
    }
    try {
      return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
    } catch (e) {
      return false;
    }
  };
  var isDate = kindOfTest("Date");
  var isFile = kindOfTest("File");
  var isReactNativeBlob = (value) => {
    return !!(value && typeof value.uri !== "undefined");
  };
  var isReactNative = (formData) => formData && typeof formData.getParts !== "undefined";
  var isBlob = kindOfTest("Blob");
  var isFileList = kindOfTest("FileList");
  var isStream = (val) => isObject(val) && isFunction(val.pipe);
  function getGlobal() {
    if (typeof globalThis !== "undefined") return globalThis;
    if (typeof self !== "undefined") return self;
    if (typeof window !== "undefined") return window;
    if (typeof global !== "undefined") return global;
    return {};
  }
  var G = getGlobal();
  var FormDataCtor = typeof G.FormData !== "undefined" ? G.FormData : void 0;
  var isFormData = (thing) => {
    if (!thing) return false;
    if (FormDataCtor && thing instanceof FormDataCtor) return true;
    const proto = getPrototypeOf(thing);
    if (!proto || proto === Object.prototype) return false;
    if (!isFunction(thing.append)) return false;
    const kind = kindOf(thing);
    return kind === "formdata" || // detect form-data instance
    kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]";
  };
  var isURLSearchParams = kindOfTest("URLSearchParams");
  var [isReadableStream, isRequest, isResponse, isHeaders] = [
    "ReadableStream",
    "Request",
    "Response",
    "Headers"
  ].map(kindOfTest);
  var trim = (str) => {
    return str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  };
  function forEach(obj, fn, { allOwnKeys = false } = {}) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }
    let i;
    let l;
    if (typeof obj !== "object") {
      obj = [obj];
    }
    if (isArray(obj)) {
      for (i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      if (isBuffer(obj)) {
        return;
      }
      const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
      const len = keys.length;
      let key;
      for (i = 0; i < len; i++) {
        key = keys[i];
        fn.call(null, obj[key], key, obj);
      }
    }
  }
  function findKey(obj, key) {
    if (isBuffer(obj)) {
      return null;
    }
    key = key.toLowerCase();
    const keys = Object.keys(obj);
    let i = keys.length;
    let _key;
    while (i-- > 0) {
      _key = keys[i];
      if (key === _key.toLowerCase()) {
        return _key;
      }
    }
    return null;
  }
  var _global = (() => {
    if (typeof globalThis !== "undefined") return globalThis;
    return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
  })();
  var isContextDefined = (context) => !isUndefined(context) && context !== _global;
  function merge(...objs) {
    const { caseless, skipUndefined } = isContextDefined(this) && this || {};
    const result = {};
    const assignValue = (val, key) => {
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        return;
      }
      const targetKey = caseless && findKey(result, key) || key;
      const existing = hasOwnProperty(result, targetKey) ? result[targetKey] : void 0;
      if (isPlainObject(existing) && isPlainObject(val)) {
        result[targetKey] = merge(existing, val);
      } else if (isPlainObject(val)) {
        result[targetKey] = merge({}, val);
      } else if (isArray(val)) {
        result[targetKey] = val.slice();
      } else if (!skipUndefined || !isUndefined(val)) {
        result[targetKey] = val;
      }
    };
    for (let i = 0, l = objs.length; i < l; i++) {
      objs[i] && forEach(objs[i], assignValue);
    }
    return result;
  }
  var extend = (a, b, thisArg, { allOwnKeys } = {}) => {
    forEach(
      b,
      (val, key) => {
        if (thisArg && isFunction(val)) {
          Object.defineProperty(a, key, {
            // Null-proto descriptor so a polluted Object.prototype.get cannot
            // hijack defineProperty's accessor-vs-data resolution.
            __proto__: null,
            value: bind(val, thisArg),
            writable: true,
            enumerable: true,
            configurable: true
          });
        } else {
          Object.defineProperty(a, key, {
            __proto__: null,
            value: val,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      },
      { allOwnKeys }
    );
    return a;
  };
  var stripBOM = (content) => {
    if (content.charCodeAt(0) === 65279) {
      content = content.slice(1);
    }
    return content;
  };
  var inherits = (constructor, superConstructor, props, descriptors) => {
    constructor.prototype = Object.create(superConstructor.prototype, descriptors);
    Object.defineProperty(constructor.prototype, "constructor", {
      __proto__: null,
      value: constructor,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(constructor, "super", {
      __proto__: null,
      value: superConstructor.prototype
    });
    props && Object.assign(constructor.prototype, props);
  };
  var toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
    let props;
    let i;
    let prop;
    const merged = {};
    destObj = destObj || {};
    if (sourceObj == null) return destObj;
    do {
      props = Object.getOwnPropertyNames(sourceObj);
      i = props.length;
      while (i-- > 0) {
        prop = props[i];
        if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
          destObj[prop] = sourceObj[prop];
          merged[prop] = true;
        }
      }
      sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
    } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
    return destObj;
  };
  var endsWith = (str, searchString, position) => {
    str = String(str);
    if (position === void 0 || position > str.length) {
      position = str.length;
    }
    position -= searchString.length;
    const lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
  var toArray = (thing) => {
    if (!thing) return null;
    if (isArray(thing)) return thing;
    let i = thing.length;
    if (!isNumber(i)) return null;
    const arr = new Array(i);
    while (i-- > 0) {
      arr[i] = thing[i];
    }
    return arr;
  };
  var isTypedArray = /* @__PURE__ */ ((TypedArray) => {
    return (thing) => {
      return TypedArray && thing instanceof TypedArray;
    };
  })(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
  var forEachEntry = (obj, fn) => {
    const generator = obj && obj[iterator];
    const _iterator = generator.call(obj);
    let result;
    while ((result = _iterator.next()) && !result.done) {
      const pair = result.value;
      fn.call(obj, pair[0], pair[1]);
    }
  };
  var matchAll = (regExp, str) => {
    let matches;
    const arr = [];
    while ((matches = regExp.exec(str)) !== null) {
      arr.push(matches);
    }
    return arr;
  };
  var isHTMLForm = kindOfTest("HTMLFormElement");
  var toCamelCase = (str) => {
    return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    });
  };
  var hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
  var isRegExp = kindOfTest("RegExp");
  var reduceDescriptors = (obj, reducer) => {
    const descriptors = Object.getOwnPropertyDescriptors(obj);
    const reducedDescriptors = {};
    forEach(descriptors, (descriptor, name) => {
      let ret;
      if ((ret = reducer(descriptor, name, obj)) !== false) {
        reducedDescriptors[name] = ret || descriptor;
      }
    });
    Object.defineProperties(obj, reducedDescriptors);
  };
  var freezeMethods = (obj) => {
    reduceDescriptors(obj, (descriptor, name) => {
      if (isFunction(obj) && ["arguments", "caller", "callee"].includes(name)) {
        return false;
      }
      const value = obj[name];
      if (!isFunction(value)) return;
      descriptor.enumerable = false;
      if ("writable" in descriptor) {
        descriptor.writable = false;
        return;
      }
      if (!descriptor.set) {
        descriptor.set = () => {
          throw Error("Can not rewrite read-only method '" + name + "'");
        };
      }
    });
  };
  var toObjectSet = (arrayOrString, delimiter) => {
    const obj = {};
    const define = (arr) => {
      arr.forEach((value) => {
        obj[value] = true;
      });
    };
    isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
    return obj;
  };
  var noop = () => {
  };
  var toFiniteNumber = (value, defaultValue) => {
    return value != null && Number.isFinite(value = +value) ? value : defaultValue;
  };
  function isSpecCompliantForm(thing) {
    return !!(thing && isFunction(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
  }
  var toJSONObject = (obj) => {
    const visited = /* @__PURE__ */ new WeakSet();
    const visit = (source) => {
      if (isObject(source)) {
        if (visited.has(source)) {
          return;
        }
        if (isBuffer(source)) {
          return source;
        }
        if (!("toJSON" in source)) {
          visited.add(source);
          const target = isArray(source) ? [] : {};
          forEach(source, (value, key) => {
            const reducedValue = visit(value);
            !isUndefined(reducedValue) && (target[key] = reducedValue);
          });
          visited.delete(source);
          return target;
        }
      }
      return source;
    };
    return visit(obj);
  };
  var isAsyncFn = kindOfTest("AsyncFunction");
  var isThenable = (thing) => thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
  var _setImmediate = ((setImmediateSupported, postMessageSupported) => {
    if (setImmediateSupported) {
      return setImmediate;
    }
    return postMessageSupported ? ((token, callbacks) => {
      _global.addEventListener(
        "message",
        ({ source, data: data7 }) => {
          if (source === _global && data7 === token) {
            callbacks.length && callbacks.shift()();
          }
        },
        false
      );
      return (cb) => {
        callbacks.push(cb);
        _global.postMessage(token, "*");
      };
    })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
  })(typeof setImmediate === "function", isFunction(_global.postMessage));
  var asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
  var isIterable = (thing) => thing != null && isFunction(thing[iterator]);
  var utils_default = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isBoolean,
    isObject,
    isPlainObject,
    isEmptyObject,
    isReadableStream,
    isRequest,
    isResponse,
    isHeaders,
    isUndefined,
    isDate,
    isFile,
    isReactNativeBlob,
    isReactNative,
    isBlob,
    isRegExp,
    isFunction,
    isStream,
    isURLSearchParams,
    isTypedArray,
    isFileList,
    forEach,
    merge,
    extend,
    trim,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray,
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty,
    hasOwnProp: hasOwnProperty,
    // an alias to avoid ESLint no-prototype-builtins detection
    reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase,
    noop,
    toFiniteNumber,
    findKey,
    global: _global,
    isContextDefined,
    isSpecCompliantForm,
    toJSONObject,
    isAsyncFn,
    isThenable,
    setImmediate: _setImmediate,
    asap,
    isIterable
  };

  // node_modules/axios/lib/helpers/parseHeaders.js
  var ignoreDuplicateOf = utils_default.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ]);
  var parseHeaders_default = (rawHeaders) => {
    const parsed = {};
    let key;
    let val;
    let i;
    rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
      i = line.indexOf(":");
      key = line.substring(0, i).trim().toLowerCase();
      val = line.substring(i + 1).trim();
      if (!key || parsed[key] && ignoreDuplicateOf[key]) {
        return;
      }
      if (key === "set-cookie") {
        if (parsed[key]) {
          parsed[key].push(val);
        } else {
          parsed[key] = [val];
        }
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
      }
    });
    return parsed;
  };

  // node_modules/axios/lib/helpers/sanitizeHeaderValue.js
  function trimSPorHTAB(str) {
    let start2 = 0;
    let end2 = str.length;
    while (start2 < end2) {
      const code = str.charCodeAt(start2);
      if (code !== 9 && code !== 32) {
        break;
      }
      start2 += 1;
    }
    while (end2 > start2) {
      const code = str.charCodeAt(end2 - 1);
      if (code !== 9 && code !== 32) {
        break;
      }
      end2 -= 1;
    }
    return start2 === 0 && end2 === str.length ? str : str.slice(start2, end2);
  }
  var INVALID_UNICODE_HEADER_VALUE_CHARS = new RegExp("[\\u0000-\\u0008\\u000a-\\u001f\\u007f]+", "g");
  var INVALID_BYTE_STRING_HEADER_VALUE_CHARS = new RegExp("[^\\u0009\\u0020-\\u007e\\u0080-\\u00ff]+", "g");
  function sanitizeValue(value, invalidChars) {
    if (utils_default.isArray(value)) {
      return value.map((item) => sanitizeValue(item, invalidChars));
    }
    return trimSPorHTAB(String(value).replace(invalidChars, ""));
  }
  var sanitizeHeaderValue = (value) => sanitizeValue(value, INVALID_UNICODE_HEADER_VALUE_CHARS);
  var sanitizeByteStringHeaderValue = (value) => sanitizeValue(value, INVALID_BYTE_STRING_HEADER_VALUE_CHARS);
  function toByteStringHeaderObject(headers) {
    const byteStringHeaders = /* @__PURE__ */ Object.create(null);
    utils_default.forEach(headers.toJSON(), (value, header) => {
      byteStringHeaders[header] = sanitizeByteStringHeaderValue(value);
    });
    return byteStringHeaders;
  }

  // node_modules/axios/lib/core/AxiosHeaders.js
  var $internals = Symbol("internals");
  function normalizeHeader(header) {
    return header && String(header).trim().toLowerCase();
  }
  function normalizeValue(value) {
    if (value === false || value == null) {
      return value;
    }
    return utils_default.isArray(value) ? value.map(normalizeValue) : sanitizeHeaderValue(String(value));
  }
  function parseTokens(str) {
    const tokens = /* @__PURE__ */ Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match;
    while (match = tokensRE.exec(str)) {
      tokens[match[1]] = match[2];
    }
    return tokens;
  }
  var isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
  function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
    if (utils_default.isFunction(filter2)) {
      return filter2.call(this, value, header);
    }
    if (isHeaderNameFilter) {
      value = header;
    }
    if (!utils_default.isString(value)) return;
    if (utils_default.isString(filter2)) {
      return value.indexOf(filter2) !== -1;
    }
    if (utils_default.isRegExp(filter2)) {
      return filter2.test(value);
    }
  }
  function formatHeader(header) {
    return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
  }
  function buildAccessors(obj, header) {
    const accessorName = utils_default.toCamelCase(" " + header);
    ["get", "set", "has"].forEach((methodName) => {
      Object.defineProperty(obj, methodName + accessorName, {
        // Null-proto descriptor so a polluted Object.prototype.get cannot turn
        // this data descriptor into an accessor descriptor on the way in.
        __proto__: null,
        value: function(arg1, arg2, arg3) {
          return this[methodName].call(this, header, arg1, arg2, arg3);
        },
        configurable: true
      });
    });
  }
  var AxiosHeaders = class {
    constructor(headers) {
      headers && this.set(headers);
    }
    set(header, valueOrRewrite, rewrite) {
      const self2 = this;
      function setHeader(_value, _header, _rewrite) {
        const lHeader = normalizeHeader(_header);
        if (!lHeader) {
          throw new Error("header name must be a non-empty string");
        }
        const key = utils_default.findKey(self2, lHeader);
        if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
          self2[key || _header] = normalizeValue(_value);
        }
      }
      const setHeaders = (headers, _rewrite) => utils_default.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
      if (utils_default.isPlainObject(header) || header instanceof this.constructor) {
        setHeaders(header, valueOrRewrite);
      } else if (utils_default.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
        setHeaders(parseHeaders_default(header), valueOrRewrite);
      } else if (utils_default.isObject(header) && utils_default.isIterable(header)) {
        let obj = {}, dest, key;
        for (const entry of header) {
          if (!utils_default.isArray(entry)) {
            throw TypeError("Object iterator must return a key-value pair");
          }
          obj[key = entry[0]] = (dest = obj[key]) ? utils_default.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]] : entry[1];
        }
        setHeaders(obj, valueOrRewrite);
      } else {
        header != null && setHeader(valueOrRewrite, header, rewrite);
      }
      return this;
    }
    get(header, parser) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils_default.findKey(this, header);
        if (key) {
          const value = this[key];
          if (!parser) {
            return value;
          }
          if (parser === true) {
            return parseTokens(value);
          }
          if (utils_default.isFunction(parser)) {
            return parser.call(this, value, key);
          }
          if (utils_default.isRegExp(parser)) {
            return parser.exec(value);
          }
          throw new TypeError("parser must be boolean|regexp|function");
        }
      }
    }
    has(header, matcher) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils_default.findKey(this, header);
        return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
      }
      return false;
    }
    delete(header, matcher) {
      const self2 = this;
      let deleted = false;
      function deleteHeader(_header) {
        _header = normalizeHeader(_header);
        if (_header) {
          const key = utils_default.findKey(self2, _header);
          if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
            delete self2[key];
            deleted = true;
          }
        }
      }
      if (utils_default.isArray(header)) {
        header.forEach(deleteHeader);
      } else {
        deleteHeader(header);
      }
      return deleted;
    }
    clear(matcher) {
      const keys = Object.keys(this);
      let i = keys.length;
      let deleted = false;
      while (i--) {
        const key = keys[i];
        if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
          delete this[key];
          deleted = true;
        }
      }
      return deleted;
    }
    normalize(format) {
      const self2 = this;
      const headers = {};
      utils_default.forEach(this, (value, header) => {
        const key = utils_default.findKey(headers, header);
        if (key) {
          self2[key] = normalizeValue(value);
          delete self2[header];
          return;
        }
        const normalized = format ? formatHeader(header) : String(header).trim();
        if (normalized !== header) {
          delete self2[header];
        }
        self2[normalized] = normalizeValue(value);
        headers[normalized] = true;
      });
      return this;
    }
    concat(...targets) {
      return this.constructor.concat(this, ...targets);
    }
    toJSON(asStrings) {
      const obj = /* @__PURE__ */ Object.create(null);
      utils_default.forEach(this, (value, header) => {
        value != null && value !== false && (obj[header] = asStrings && utils_default.isArray(value) ? value.join(", ") : value);
      });
      return obj;
    }
    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
      return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
    }
    getSetCookie() {
      return this.get("set-cookie") || [];
    }
    get [Symbol.toStringTag]() {
      return "AxiosHeaders";
    }
    static from(thing) {
      return thing instanceof this ? thing : new this(thing);
    }
    static concat(first, ...targets) {
      const computed = new this(first);
      targets.forEach((target) => computed.set(target));
      return computed;
    }
    static accessor(header) {
      const internals = this[$internals] = this[$internals] = {
        accessors: {}
      };
      const accessors = internals.accessors;
      const prototype2 = this.prototype;
      function defineAccessor(_header) {
        const lHeader = normalizeHeader(_header);
        if (!accessors[lHeader]) {
          buildAccessors(prototype2, _header);
          accessors[lHeader] = true;
        }
      }
      utils_default.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
      return this;
    }
  };
  AxiosHeaders.accessor([
    "Content-Type",
    "Content-Length",
    "Accept",
    "Accept-Encoding",
    "User-Agent",
    "Authorization"
  ]);
  utils_default.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
    let mapped = key[0].toUpperCase() + key.slice(1);
    return {
      get: () => value,
      set(headerValue) {
        this[mapped] = headerValue;
      }
    };
  });
  utils_default.freezeMethods(AxiosHeaders);
  var AxiosHeaders_default = AxiosHeaders;

  // node_modules/axios/lib/core/AxiosError.js
  var REDACTED = "[REDACTED ****]";
  function hasOwnOrPrototypeToJSON(source) {
    if (utils_default.hasOwnProp(source, "toJSON")) {
      return true;
    }
    let prototype2 = Object.getPrototypeOf(source);
    while (prototype2 && prototype2 !== Object.prototype) {
      if (utils_default.hasOwnProp(prototype2, "toJSON")) {
        return true;
      }
      prototype2 = Object.getPrototypeOf(prototype2);
    }
    return false;
  }
  function redactConfig(config, redactKeys) {
    const lowerKeys = new Set(redactKeys.map((k) => String(k).toLowerCase()));
    const seen = [];
    const visit = (source) => {
      if (source === null || typeof source !== "object") return source;
      if (utils_default.isBuffer(source)) return source;
      if (seen.indexOf(source) !== -1) return void 0;
      if (source instanceof AxiosHeaders_default) {
        source = source.toJSON();
      }
      seen.push(source);
      let result;
      if (utils_default.isArray(source)) {
        result = [];
        source.forEach((v, i) => {
          const reducedValue = visit(v);
          if (!utils_default.isUndefined(reducedValue)) {
            result[i] = reducedValue;
          }
        });
      } else {
        if (!utils_default.isPlainObject(source) && hasOwnOrPrototypeToJSON(source)) {
          seen.pop();
          return source;
        }
        result = /* @__PURE__ */ Object.create(null);
        for (const [key, value] of Object.entries(source)) {
          const reducedValue = lowerKeys.has(key.toLowerCase()) ? REDACTED : visit(value);
          if (!utils_default.isUndefined(reducedValue)) {
            result[key] = reducedValue;
          }
        }
      }
      seen.pop();
      return result;
    };
    return visit(config);
  }
  var AxiosError = class _AxiosError extends Error {
    static from(error2, code, config, request, response, customProps) {
      const axiosError = new _AxiosError(error2.message, code || error2.code, config, request, response);
      axiosError.cause = error2;
      axiosError.name = error2.name;
      if (error2.status != null && axiosError.status == null) {
        axiosError.status = error2.status;
      }
      customProps && Object.assign(axiosError, customProps);
      return axiosError;
    }
    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [config] The config.
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     *
     * @returns {Error} The created error.
     */
    constructor(message, code, config, request, response) {
      super(message);
      Object.defineProperty(this, "message", {
        // Null-proto descriptor so a polluted Object.prototype.get cannot turn
        // this data descriptor into an accessor descriptor on the way in.
        __proto__: null,
        value: message,
        enumerable: true,
        writable: true,
        configurable: true
      });
      this.name = "AxiosError";
      this.isAxiosError = true;
      code && (this.code = code);
      config && (this.config = config);
      request && (this.request = request);
      if (response) {
        this.response = response;
        this.status = response.status;
      }
    }
    toJSON() {
      const config = this.config;
      const redactKeys = config && utils_default.hasOwnProp(config, "redact") ? config.redact : void 0;
      const serializedConfig = utils_default.isArray(redactKeys) && redactKeys.length > 0 ? redactConfig(config, redactKeys) : utils_default.toJSONObject(config);
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: serializedConfig,
        code: this.code,
        status: this.status
      };
    }
  };
  AxiosError.ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE";
  AxiosError.ERR_BAD_OPTION = "ERR_BAD_OPTION";
  AxiosError.ECONNABORTED = "ECONNABORTED";
  AxiosError.ETIMEDOUT = "ETIMEDOUT";
  AxiosError.ECONNREFUSED = "ECONNREFUSED";
  AxiosError.ERR_NETWORK = "ERR_NETWORK";
  AxiosError.ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS";
  AxiosError.ERR_DEPRECATED = "ERR_DEPRECATED";
  AxiosError.ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE";
  AxiosError.ERR_BAD_REQUEST = "ERR_BAD_REQUEST";
  AxiosError.ERR_CANCELED = "ERR_CANCELED";
  AxiosError.ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT";
  AxiosError.ERR_INVALID_URL = "ERR_INVALID_URL";
  AxiosError.ERR_FORM_DATA_DEPTH_EXCEEDED = "ERR_FORM_DATA_DEPTH_EXCEEDED";
  var AxiosError_default = AxiosError;

  // node_modules/axios/lib/helpers/null.js
  var null_default = null;

  // node_modules/axios/lib/helpers/toFormData.js
  function isVisitable(thing) {
    return utils_default.isPlainObject(thing) || utils_default.isArray(thing);
  }
  function removeBrackets(key) {
    return utils_default.endsWith(key, "[]") ? key.slice(0, -2) : key;
  }
  function renderKey(path, key, dots) {
    if (!path) return key;
    return path.concat(key).map(function each(token, i) {
      token = removeBrackets(token);
      return !dots && i ? "[" + token + "]" : token;
    }).join(dots ? "." : "");
  }
  function isFlatArray(arr) {
    return utils_default.isArray(arr) && !arr.some(isVisitable);
  }
  var predicates = utils_default.toFlatObject(utils_default, {}, null, function filter(prop) {
    return /^is[A-Z]/.test(prop);
  });
  function toFormData(obj, formData, options) {
    if (!utils_default.isObject(obj)) {
      throw new TypeError("target must be an object");
    }
    formData = formData || new (null_default || FormData)();
    options = utils_default.toFlatObject(
      options,
      {
        metaTokens: true,
        dots: false,
        indexes: false
      },
      false,
      function defined(option, source) {
        return !utils_default.isUndefined(source[option]);
      }
    );
    const metaTokens = options.metaTokens;
    const visitor = options.visitor || defaultVisitor;
    const dots = options.dots;
    const indexes = options.indexes;
    const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
    const maxDepth = options.maxDepth === void 0 ? 100 : options.maxDepth;
    const useBlob = _Blob && utils_default.isSpecCompliantForm(formData);
    if (!utils_default.isFunction(visitor)) {
      throw new TypeError("visitor must be a function");
    }
    function convertValue(value) {
      if (value === null) return "";
      if (utils_default.isDate(value)) {
        return value.toISOString();
      }
      if (utils_default.isBoolean(value)) {
        return value.toString();
      }
      if (!useBlob && utils_default.isBlob(value)) {
        throw new AxiosError_default("Blob is not supported. Use a Buffer instead.");
      }
      if (utils_default.isArrayBuffer(value) || utils_default.isTypedArray(value)) {
        return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
      }
      return value;
    }
    function defaultVisitor(value, key, path) {
      let arr = value;
      if (utils_default.isReactNative(formData) && utils_default.isReactNativeBlob(value)) {
        formData.append(renderKey(path, key, dots), convertValue(value));
        return false;
      }
      if (value && !path && typeof value === "object") {
        if (utils_default.endsWith(key, "{}")) {
          key = metaTokens ? key : key.slice(0, -2);
          value = JSON.stringify(value);
        } else if (utils_default.isArray(value) && isFlatArray(value) || (utils_default.isFileList(value) || utils_default.endsWith(key, "[]")) && (arr = utils_default.toArray(value))) {
          key = removeBrackets(key);
          arr.forEach(function each(el, index) {
            !(utils_default.isUndefined(el) || el === null) && formData.append(
              // eslint-disable-next-line no-nested-ternary
              indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
              convertValue(el)
            );
          });
          return false;
        }
      }
      if (isVisitable(value)) {
        return true;
      }
      formData.append(renderKey(path, key, dots), convertValue(value));
      return false;
    }
    const stack = [];
    const exposedHelpers = Object.assign(predicates, {
      defaultVisitor,
      convertValue,
      isVisitable
    });
    function build(value, path, depth = 0) {
      if (utils_default.isUndefined(value)) return;
      if (depth > maxDepth) {
        throw new AxiosError_default(
          "Object is too deeply nested (" + depth + " levels). Max depth: " + maxDepth,
          AxiosError_default.ERR_FORM_DATA_DEPTH_EXCEEDED
        );
      }
      if (stack.indexOf(value) !== -1) {
        throw Error("Circular reference detected in " + path.join("."));
      }
      stack.push(value);
      utils_default.forEach(value, function each(el, key) {
        const result = !(utils_default.isUndefined(el) || el === null) && visitor.call(formData, el, utils_default.isString(key) ? key.trim() : key, path, exposedHelpers);
        if (result === true) {
          build(el, path ? path.concat(key) : [key], depth + 1);
        }
      });
      stack.pop();
    }
    if (!utils_default.isObject(obj)) {
      throw new TypeError("data must be an object");
    }
    build(obj);
    return formData;
  }
  var toFormData_default = toFormData;

  // node_modules/axios/lib/helpers/AxiosURLSearchParams.js
  function encode(str) {
    const charMap = {
      "!": "%21",
      "'": "%27",
      "(": "%28",
      ")": "%29",
      "~": "%7E",
      "%20": "+"
    };
    return encodeURIComponent(str).replace(/[!'()~]|%20/g, function replacer(match) {
      return charMap[match];
    });
  }
  function AxiosURLSearchParams(params, options) {
    this._pairs = [];
    params && toFormData_default(params, this, options);
  }
  var prototype = AxiosURLSearchParams.prototype;
  prototype.append = function append(name, value) {
    this._pairs.push([name, value]);
  };
  prototype.toString = function toString2(encoder) {
    const _encode = encoder ? function(value) {
      return encoder.call(this, value, encode);
    } : encode;
    return this._pairs.map(function each(pair) {
      return _encode(pair[0]) + "=" + _encode(pair[1]);
    }, "").join("&");
  };
  var AxiosURLSearchParams_default = AxiosURLSearchParams;

  // node_modules/axios/lib/helpers/buildURL.js
  function encode2(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
  }
  function buildURL(url2, params, options) {
    if (!params) {
      return url2;
    }
    const _encode = options && options.encode || encode2;
    const _options = utils_default.isFunction(options) ? {
      serialize: options
    } : options;
    const serializeFn = _options && _options.serialize;
    let serializedParams;
    if (serializeFn) {
      serializedParams = serializeFn(params, _options);
    } else {
      serializedParams = utils_default.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams_default(params, _options).toString(_encode);
    }
    if (serializedParams) {
      const hashmarkIndex = url2.indexOf("#");
      if (hashmarkIndex !== -1) {
        url2 = url2.slice(0, hashmarkIndex);
      }
      url2 += (url2.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url2;
  }

  // node_modules/axios/lib/core/InterceptorManager.js
  var InterceptorManager = class {
    constructor() {
      this.handlers = [];
    }
    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     * @param {Object} options The options for the interceptor, synchronous and runWhen
     *
     * @return {Number} An ID used to remove interceptor later
     */
    use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    }
    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     *
     * @returns {void}
     */
    eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    }
    /**
     * Clear all interceptors from the stack
     *
     * @returns {void}
     */
    clear() {
      if (this.handlers) {
        this.handlers = [];
      }
    }
    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     *
     * @returns {void}
     */
    forEach(fn) {
      utils_default.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    }
  };
  var InterceptorManager_default = InterceptorManager;

  // node_modules/axios/lib/defaults/transitional.js
  var transitional_default = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false,
    legacyInterceptorReqResOrdering: true
  };

  // node_modules/axios/lib/platform/browser/classes/URLSearchParams.js
  var URLSearchParams_default = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams_default;

  // node_modules/axios/lib/platform/browser/classes/FormData.js
  var FormData_default = typeof FormData !== "undefined" ? FormData : null;

  // node_modules/axios/lib/platform/browser/classes/Blob.js
  var Blob_default = typeof Blob !== "undefined" ? Blob : null;

  // node_modules/axios/lib/platform/browser/index.js
  var browser_default = {
    isBrowser: true,
    classes: {
      URLSearchParams: URLSearchParams_default,
      FormData: FormData_default,
      Blob: Blob_default
    },
    protocols: ["http", "https", "file", "blob", "url", "data"]
  };

  // node_modules/axios/lib/platform/common/utils.js
  var utils_exports = {};
  __export(utils_exports, {
    hasBrowserEnv: () => hasBrowserEnv,
    hasStandardBrowserEnv: () => hasStandardBrowserEnv,
    hasStandardBrowserWebWorkerEnv: () => hasStandardBrowserWebWorkerEnv,
    navigator: () => _navigator,
    origin: () => origin
  });
  var hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
  var _navigator = typeof navigator === "object" && navigator || void 0;
  var hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
  var hasStandardBrowserWebWorkerEnv = (() => {
    return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
  })();
  var origin = hasBrowserEnv && window.location.href || "http://localhost";

  // node_modules/axios/lib/platform/index.js
  var platform_default = {
    ...utils_exports,
    ...browser_default
  };

  // node_modules/axios/lib/helpers/toURLEncodedForm.js
  function toURLEncodedForm(data7, options) {
    return toFormData_default(data7, new platform_default.classes.URLSearchParams(), {
      visitor: function(value, key, path, helpers) {
        if (platform_default.isNode && utils_default.isBuffer(value)) {
          this.append(key, value.toString("base64"));
          return false;
        }
        return helpers.defaultVisitor.apply(this, arguments);
      },
      ...options
    });
  }

  // node_modules/axios/lib/helpers/formDataToJSON.js
  function parsePropPath(name) {
    return utils_default.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
      return match[0] === "[]" ? "" : match[1] || match[0];
    });
  }
  function arrayToObject(arr) {
    const obj = {};
    const keys = Object.keys(arr);
    let i;
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      obj[key] = arr[key];
    }
    return obj;
  }
  function formDataToJSON(formData) {
    function buildPath(path, value, target, index) {
      let name = path[index++];
      if (name === "__proto__") return true;
      const isNumericKey = Number.isFinite(+name);
      const isLast = index >= path.length;
      name = !name && utils_default.isArray(target) ? target.length : name;
      if (isLast) {
        if (utils_default.hasOwnProp(target, name)) {
          target[name] = utils_default.isArray(target[name]) ? target[name].concat(value) : [target[name], value];
        } else {
          target[name] = value;
        }
        return !isNumericKey;
      }
      if (!utils_default.hasOwnProp(target, name) || !utils_default.isObject(target[name])) {
        target[name] = [];
      }
      const result = buildPath(path, value, target[name], index);
      if (result && utils_default.isArray(target[name])) {
        target[name] = arrayToObject(target[name]);
      }
      return !isNumericKey;
    }
    if (utils_default.isFormData(formData) && utils_default.isFunction(formData.entries)) {
      const obj = {};
      utils_default.forEachEntry(formData, (name, value) => {
        buildPath(parsePropPath(name), value, obj, 0);
      });
      return obj;
    }
    return null;
  }
  var formDataToJSON_default = formDataToJSON;

  // node_modules/axios/lib/defaults/index.js
  var own = (obj, key) => obj != null && utils_default.hasOwnProp(obj, key) ? obj[key] : void 0;
  function stringifySafely(rawValue, parser, encoder) {
    if (utils_default.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils_default.trim(rawValue);
      } catch (e) {
        if (e.name !== "SyntaxError") {
          throw e;
        }
      }
    }
    return (encoder || JSON.stringify)(rawValue);
  }
  var defaults = {
    transitional: transitional_default,
    adapter: ["xhr", "http", "fetch"],
    transformRequest: [
      function transformRequest(data7, headers) {
        const contentType = headers.getContentType() || "";
        const hasJSONContentType = contentType.indexOf("application/json") > -1;
        const isObjectPayload = utils_default.isObject(data7);
        if (isObjectPayload && utils_default.isHTMLForm(data7)) {
          data7 = new FormData(data7);
        }
        const isFormData2 = utils_default.isFormData(data7);
        if (isFormData2) {
          return hasJSONContentType ? JSON.stringify(formDataToJSON_default(data7)) : data7;
        }
        if (utils_default.isArrayBuffer(data7) || utils_default.isBuffer(data7) || utils_default.isStream(data7) || utils_default.isFile(data7) || utils_default.isBlob(data7) || utils_default.isReadableStream(data7)) {
          return data7;
        }
        if (utils_default.isArrayBufferView(data7)) {
          return data7.buffer;
        }
        if (utils_default.isURLSearchParams(data7)) {
          headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
          return data7.toString();
        }
        let isFileList2;
        if (isObjectPayload) {
          const formSerializer = own(this, "formSerializer");
          if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
            return toURLEncodedForm(data7, formSerializer).toString();
          }
          if ((isFileList2 = utils_default.isFileList(data7)) || contentType.indexOf("multipart/form-data") > -1) {
            const env = own(this, "env");
            const _FormData = env && env.FormData;
            return toFormData_default(
              isFileList2 ? { "files[]": data7 } : data7,
              _FormData && new _FormData(),
              formSerializer
            );
          }
        }
        if (isObjectPayload || hasJSONContentType) {
          headers.setContentType("application/json", false);
          return stringifySafely(data7);
        }
        return data7;
      }
    ],
    transformResponse: [
      function transformResponse(data7) {
        const transitional2 = own(this, "transitional") || defaults.transitional;
        const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
        const responseType = own(this, "responseType");
        const JSONRequested = responseType === "json";
        if (utils_default.isResponse(data7) || utils_default.isReadableStream(data7)) {
          return data7;
        }
        if (data7 && utils_default.isString(data7) && (forcedJSONParsing && !responseType || JSONRequested)) {
          const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
          const strictJSONParsing = !silentJSONParsing && JSONRequested;
          try {
            return JSON.parse(data7, own(this, "parseReviver"));
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === "SyntaxError") {
                throw AxiosError_default.from(e, AxiosError_default.ERR_BAD_RESPONSE, this, null, own(this, "response"));
              }
              throw e;
            }
          }
        }
        return data7;
      }
    ],
    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
      FormData: platform_default.classes.FormData,
      Blob: platform_default.classes.Blob
    },
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },
    headers: {
      common: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": void 0
      }
    }
  };
  utils_default.forEach(["delete", "get", "head", "post", "put", "patch", "query"], (method) => {
    defaults.headers[method] = {};
  });
  var defaults_default = defaults;

  // node_modules/axios/lib/core/transformData.js
  function transformData(fns2, response) {
    const config = this || defaults_default;
    const context = response || config;
    const headers = AxiosHeaders_default.from(context.headers);
    let data7 = context.data;
    utils_default.forEach(fns2, function transform(fn) {
      data7 = fn.call(config, data7, headers.normalize(), response ? response.status : void 0);
    });
    headers.normalize();
    return data7;
  }

  // node_modules/axios/lib/cancel/isCancel.js
  function isCancel(value) {
    return !!(value && value.__CANCEL__);
  }

  // node_modules/axios/lib/cancel/CanceledError.js
  var CanceledError = class extends AxiosError_default {
    /**
     * A `CanceledError` is an object that is thrown when an operation is canceled.
     *
     * @param {string=} message The message.
     * @param {Object=} config The config.
     * @param {Object=} request The request.
     *
     * @returns {CanceledError} The created error.
     */
    constructor(message, config, request) {
      super(message == null ? "canceled" : message, AxiosError_default.ERR_CANCELED, config, request);
      this.name = "CanceledError";
      this.__CANCEL__ = true;
    }
  };
  var CanceledError_default = CanceledError;

  // node_modules/axios/lib/core/settle.js
  function settle(resolve, reject, response) {
    const validateStatus2 = response.config.validateStatus;
    if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
      resolve(response);
    } else {
      reject(new AxiosError_default(
        "Request failed with status code " + response.status,
        response.status >= 400 && response.status < 500 ? AxiosError_default.ERR_BAD_REQUEST : AxiosError_default.ERR_BAD_RESPONSE,
        response.config,
        response.request,
        response
      ));
    }
  }

  // node_modules/axios/lib/helpers/parseProtocol.js
  function parseProtocol(url2) {
    const match = /^([-+\w]{1,25}):(?:\/\/)?/.exec(url2);
    return match && match[1] || "";
  }

  // node_modules/axios/lib/helpers/speedometer.js
  function speedometer(samplesCount, min) {
    samplesCount = samplesCount || 10;
    const bytes = new Array(samplesCount);
    const timestamps = new Array(samplesCount);
    let head = 0;
    let tail = 0;
    let firstSampleTS;
    min = min !== void 0 ? min : 1e3;
    return function push(chunkLength) {
      const now = Date.now();
      const startedAt = timestamps[tail];
      if (!firstSampleTS) {
        firstSampleTS = now;
      }
      bytes[head] = chunkLength;
      timestamps[head] = now;
      let i = tail;
      let bytesCount = 0;
      while (i !== head) {
        bytesCount += bytes[i++];
        i = i % samplesCount;
      }
      head = (head + 1) % samplesCount;
      if (head === tail) {
        tail = (tail + 1) % samplesCount;
      }
      if (now - firstSampleTS < min) {
        return;
      }
      const passed = startedAt && now - startedAt;
      return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
    };
  }
  var speedometer_default = speedometer;

  // node_modules/axios/lib/helpers/throttle.js
  function throttle(fn, freq) {
    let timestamp = 0;
    let threshold = 1e3 / freq;
    let lastArgs;
    let timer;
    const invoke = (args, now = Date.now()) => {
      timestamp = now;
      lastArgs = null;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn(...args);
    };
    const throttled = (...args) => {
      const now = Date.now();
      const passed = now - timestamp;
      if (passed >= threshold) {
        invoke(args, now);
      } else {
        lastArgs = args;
        if (!timer) {
          timer = setTimeout(() => {
            timer = null;
            invoke(lastArgs);
          }, threshold - passed);
        }
      }
    };
    const flush = () => lastArgs && invoke(lastArgs);
    return [throttled, flush];
  }
  var throttle_default = throttle;

  // node_modules/axios/lib/helpers/progressEventReducer.js
  var progressEventReducer = (listener, isDownloadStream, freq = 3) => {
    let bytesNotified = 0;
    const _speedometer = speedometer_default(50, 250);
    return throttle_default((e) => {
      if (!e || typeof e.loaded !== "number") {
        return;
      }
      const rawLoaded = e.loaded;
      const total = e.lengthComputable ? e.total : void 0;
      const loaded = total != null ? Math.min(rawLoaded, total) : rawLoaded;
      const progressBytes = Math.max(0, loaded - bytesNotified);
      const rate = _speedometer(progressBytes);
      bytesNotified = Math.max(bytesNotified, loaded);
      const data7 = {
        loaded,
        total,
        progress: total ? loaded / total : void 0,
        bytes: progressBytes,
        rate: rate ? rate : void 0,
        estimated: rate && total ? (total - loaded) / rate : void 0,
        event: e,
        lengthComputable: total != null,
        [isDownloadStream ? "download" : "upload"]: true
      };
      listener(data7);
    }, freq);
  };
  var progressEventDecorator = (total, throttled) => {
    const lengthComputable = total != null;
    return [
      (loaded) => throttled[0]({
        lengthComputable,
        total,
        loaded
      }),
      throttled[1]
    ];
  };
  var asyncDecorator = (fn) => (...args) => utils_default.asap(() => fn(...args));

  // node_modules/axios/lib/helpers/isURLSameOrigin.js
  var isURLSameOrigin_default = platform_default.hasStandardBrowserEnv ? /* @__PURE__ */ ((origin2, isMSIE) => (url2) => {
    url2 = new URL(url2, platform_default.origin);
    return origin2.protocol === url2.protocol && origin2.host === url2.host && (isMSIE || origin2.port === url2.port);
  })(
    new URL(platform_default.origin),
    platform_default.navigator && /(msie|trident)/i.test(platform_default.navigator.userAgent)
  ) : () => true;

  // node_modules/axios/lib/helpers/cookies.js
  var cookies_default = platform_default.hasStandardBrowserEnv ? (
    // Standard browser envs support document.cookie
    {
      write(name, value, expires, path, domain, secure, sameSite) {
        if (typeof document === "undefined") return;
        const cookie = [`${name}=${encodeURIComponent(value)}`];
        if (utils_default.isNumber(expires)) {
          cookie.push(`expires=${new Date(expires).toUTCString()}`);
        }
        if (utils_default.isString(path)) {
          cookie.push(`path=${path}`);
        }
        if (utils_default.isString(domain)) {
          cookie.push(`domain=${domain}`);
        }
        if (secure === true) {
          cookie.push("secure");
        }
        if (utils_default.isString(sameSite)) {
          cookie.push(`SameSite=${sameSite}`);
        }
        document.cookie = cookie.join("; ");
      },
      read(name) {
        if (typeof document === "undefined") return null;
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].replace(/^\s+/, "");
          const eq = cookie.indexOf("=");
          if (eq !== -1 && cookie.slice(0, eq) === name) {
            return decodeURIComponent(cookie.slice(eq + 1));
          }
        }
        return null;
      },
      remove(name) {
        this.write(name, "", Date.now() - 864e5, "/");
      }
    }
  ) : (
    // Non-standard browser env (web workers, react-native) lack needed support.
    {
      write() {
      },
      read() {
        return null;
      },
      remove() {
      }
    }
  );

  // node_modules/axios/lib/helpers/isAbsoluteURL.js
  function isAbsoluteURL(url2) {
    if (typeof url2 !== "string") {
      return false;
    }
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url2);
  }

  // node_modules/axios/lib/helpers/combineURLs.js
  function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  }

  // node_modules/axios/lib/core/buildFullPath.js
  function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
    let isRelativeUrl = !isAbsoluteURL(requestedURL);
    if (baseURL && (isRelativeUrl || allowAbsoluteUrls === false)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  }

  // node_modules/axios/lib/core/mergeConfig.js
  var headersToObject = (thing) => thing instanceof AxiosHeaders_default ? { ...thing } : thing;
  function mergeConfig(config1, config2) {
    config2 = config2 || {};
    const config = /* @__PURE__ */ Object.create(null);
    Object.defineProperty(config, "hasOwnProperty", {
      // Null-proto descriptor so a polluted Object.prototype.get cannot turn
      // this data descriptor into an accessor descriptor on the way in.
      __proto__: null,
      value: Object.prototype.hasOwnProperty,
      enumerable: false,
      writable: true,
      configurable: true
    });
    function getMergedValue(target, source, prop, caseless) {
      if (utils_default.isPlainObject(target) && utils_default.isPlainObject(source)) {
        return utils_default.merge.call({ caseless }, target, source);
      } else if (utils_default.isPlainObject(source)) {
        return utils_default.merge({}, source);
      } else if (utils_default.isArray(source)) {
        return source.slice();
      }
      return source;
    }
    function mergeDeepProperties(a, b, prop, caseless) {
      if (!utils_default.isUndefined(b)) {
        return getMergedValue(a, b, prop, caseless);
      } else if (!utils_default.isUndefined(a)) {
        return getMergedValue(void 0, a, prop, caseless);
      }
    }
    function valueFromConfig2(a, b) {
      if (!utils_default.isUndefined(b)) {
        return getMergedValue(void 0, b);
      }
    }
    function defaultToConfig2(a, b) {
      if (!utils_default.isUndefined(b)) {
        return getMergedValue(void 0, b);
      } else if (!utils_default.isUndefined(a)) {
        return getMergedValue(void 0, a);
      }
    }
    function mergeDirectKeys(a, b, prop) {
      if (utils_default.hasOwnProp(config2, prop)) {
        return getMergedValue(a, b);
      } else if (utils_default.hasOwnProp(config1, prop)) {
        return getMergedValue(void 0, a);
      }
    }
    const mergeMap = {
      url: valueFromConfig2,
      method: valueFromConfig2,
      data: valueFromConfig2,
      baseURL: defaultToConfig2,
      transformRequest: defaultToConfig2,
      transformResponse: defaultToConfig2,
      paramsSerializer: defaultToConfig2,
      timeout: defaultToConfig2,
      timeoutMessage: defaultToConfig2,
      withCredentials: defaultToConfig2,
      withXSRFToken: defaultToConfig2,
      adapter: defaultToConfig2,
      responseType: defaultToConfig2,
      xsrfCookieName: defaultToConfig2,
      xsrfHeaderName: defaultToConfig2,
      onUploadProgress: defaultToConfig2,
      onDownloadProgress: defaultToConfig2,
      decompress: defaultToConfig2,
      maxContentLength: defaultToConfig2,
      maxBodyLength: defaultToConfig2,
      beforeRedirect: defaultToConfig2,
      transport: defaultToConfig2,
      httpAgent: defaultToConfig2,
      httpsAgent: defaultToConfig2,
      cancelToken: defaultToConfig2,
      socketPath: defaultToConfig2,
      allowedSocketPaths: defaultToConfig2,
      responseEncoding: defaultToConfig2,
      validateStatus: mergeDirectKeys,
      headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
    };
    utils_default.forEach(Object.keys({ ...config1, ...config2 }), function computeConfigValue(prop) {
      if (prop === "__proto__" || prop === "constructor" || prop === "prototype") return;
      const merge2 = utils_default.hasOwnProp(mergeMap, prop) ? mergeMap[prop] : mergeDeepProperties;
      const a = utils_default.hasOwnProp(config1, prop) ? config1[prop] : void 0;
      const b = utils_default.hasOwnProp(config2, prop) ? config2[prop] : void 0;
      const configValue = merge2(a, b, prop);
      utils_default.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
    });
    return config;
  }

  // node_modules/axios/lib/helpers/resolveConfig.js
  var FORM_DATA_CONTENT_HEADERS = ["content-type", "content-length"];
  function setFormDataHeaders(headers, formHeaders, policy) {
    if (policy !== "content-only") {
      headers.set(formHeaders);
      return;
    }
    Object.entries(formHeaders).forEach(([key, val]) => {
      if (FORM_DATA_CONTENT_HEADERS.includes(key.toLowerCase())) {
        headers.set(key, val);
      }
    });
  }
  var encodeUTF8 = (str) => encodeURIComponent(str).replace(
    /%([0-9A-F]{2})/gi,
    (_, hex) => String.fromCharCode(parseInt(hex, 16))
  );
  var resolveConfig_default = (config) => {
    const newConfig = mergeConfig({}, config);
    const own2 = (key) => utils_default.hasOwnProp(newConfig, key) ? newConfig[key] : void 0;
    const data7 = own2("data");
    let withXSRFToken = own2("withXSRFToken");
    const xsrfHeaderName = own2("xsrfHeaderName");
    const xsrfCookieName = own2("xsrfCookieName");
    let headers = own2("headers");
    const auth = own2("auth");
    const baseURL = own2("baseURL");
    const allowAbsoluteUrls = own2("allowAbsoluteUrls");
    const url2 = own2("url");
    newConfig.headers = headers = AxiosHeaders_default.from(headers);
    newConfig.url = buildURL(
      buildFullPath(baseURL, url2, allowAbsoluteUrls),
      config.params,
      config.paramsSerializer
    );
    if (auth) {
      headers.set(
        "Authorization",
        "Basic " + btoa((auth.username || "") + ":" + (auth.password ? encodeUTF8(auth.password) : ""))
      );
    }
    if (utils_default.isFormData(data7)) {
      if (platform_default.hasStandardBrowserEnv || platform_default.hasStandardBrowserWebWorkerEnv) {
        headers.setContentType(void 0);
      } else if (utils_default.isFunction(data7.getHeaders)) {
        setFormDataHeaders(headers, data7.getHeaders(), own2("formDataHeaderPolicy"));
      }
    }
    if (platform_default.hasStandardBrowserEnv) {
      if (utils_default.isFunction(withXSRFToken)) {
        withXSRFToken = withXSRFToken(newConfig);
      }
      const shouldSendXSRF = withXSRFToken === true || withXSRFToken == null && isURLSameOrigin_default(newConfig.url);
      if (shouldSendXSRF) {
        const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies_default.read(xsrfCookieName);
        if (xsrfValue) {
          headers.set(xsrfHeaderName, xsrfValue);
        }
      }
    }
    return newConfig;
  };

  // node_modules/axios/lib/adapters/xhr.js
  var isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
  var xhr_default = isXHRAdapterSupported && function(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      const _config = resolveConfig_default(config);
      let requestData = _config.data;
      const requestHeaders = AxiosHeaders_default.from(_config.headers).normalize();
      let { responseType, onUploadProgress, onDownloadProgress } = _config;
      let onCanceled;
      let uploadThrottled, downloadThrottled;
      let flushUpload, flushDownload;
      function done() {
        flushUpload && flushUpload();
        flushDownload && flushDownload();
        _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
        _config.signal && _config.signal.removeEventListener("abort", onCanceled);
      }
      let request = new XMLHttpRequest();
      request.open(_config.method.toUpperCase(), _config.url, true);
      request.timeout = _config.timeout;
      function onloadend() {
        if (!request) {
          return;
        }
        const responseHeaders = AxiosHeaders_default.from(
          "getAllResponseHeaders" in request && request.getAllResponseHeaders()
        );
        const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
        const response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        };
        settle(
          function _resolve(value) {
            resolve(value);
            done();
          },
          function _reject(err) {
            reject(err);
            done();
          },
          response
        );
        request = null;
      }
      if ("onloadend" in request) {
        request.onloadend = onloadend;
      } else {
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }
          if (request.status === 0 && !(request.responseURL && request.responseURL.startsWith("file:"))) {
            return;
          }
          setTimeout(onloadend);
        };
      }
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }
        reject(new AxiosError_default("Request aborted", AxiosError_default.ECONNABORTED, config, request));
        done();
        request = null;
      };
      request.onerror = function handleError(event) {
        const msg = event && event.message ? event.message : "Network Error";
        const err = new AxiosError_default(msg, AxiosError_default.ERR_NETWORK, config, request);
        err.event = event || null;
        reject(err);
        done();
        request = null;
      };
      request.ontimeout = function handleTimeout() {
        let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
        const transitional2 = _config.transitional || transitional_default;
        if (_config.timeoutErrorMessage) {
          timeoutErrorMessage = _config.timeoutErrorMessage;
        }
        reject(
          new AxiosError_default(
            timeoutErrorMessage,
            transitional2.clarifyTimeoutError ? AxiosError_default.ETIMEDOUT : AxiosError_default.ECONNABORTED,
            config,
            request
          )
        );
        done();
        request = null;
      };
      requestData === void 0 && requestHeaders.setContentType(null);
      if ("setRequestHeader" in request) {
        utils_default.forEach(toByteStringHeaderObject(requestHeaders), function setRequestHeader(val, key) {
          request.setRequestHeader(key, val);
        });
      }
      if (!utils_default.isUndefined(_config.withCredentials)) {
        request.withCredentials = !!_config.withCredentials;
      }
      if (responseType && responseType !== "json") {
        request.responseType = _config.responseType;
      }
      if (onDownloadProgress) {
        [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
        request.addEventListener("progress", downloadThrottled);
      }
      if (onUploadProgress && request.upload) {
        [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
        request.upload.addEventListener("progress", uploadThrottled);
        request.upload.addEventListener("loadend", flushUpload);
      }
      if (_config.cancelToken || _config.signal) {
        onCanceled = (cancel) => {
          if (!request) {
            return;
          }
          reject(!cancel || cancel.type ? new CanceledError_default(null, config, request) : cancel);
          request.abort();
          done();
          request = null;
        };
        _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
        if (_config.signal) {
          _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
        }
      }
      const protocol = parseProtocol(_config.url);
      if (protocol && !platform_default.protocols.includes(protocol)) {
        reject(
          new AxiosError_default(
            "Unsupported protocol " + protocol + ":",
            AxiosError_default.ERR_BAD_REQUEST,
            config
          )
        );
        return;
      }
      request.send(requestData || null);
    });
  };

  // node_modules/axios/lib/helpers/composeSignals.js
  var composeSignals = (signals, timeout) => {
    signals = signals ? signals.filter(Boolean) : [];
    if (!timeout && !signals.length) {
      return;
    }
    const controller = new AbortController();
    let aborted = false;
    const onabort = function(reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(
          err instanceof AxiosError_default ? err : new CanceledError_default(err instanceof Error ? err.message : err)
        );
      }
    };
    let timer = timeout && setTimeout(() => {
      timer = null;
      onabort(new AxiosError_default(`timeout of ${timeout}ms exceeded`, AxiosError_default.ETIMEDOUT));
    }, timeout);
    const unsubscribe = () => {
      if (!signals) {
        return;
      }
      timer && clearTimeout(timer);
      timer = null;
      signals.forEach((signal2) => {
        signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
      });
      signals = null;
    };
    signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
    const { signal } = controller;
    signal.unsubscribe = () => utils_default.asap(unsubscribe);
    return signal;
  };
  var composeSignals_default = composeSignals;

  // node_modules/axios/lib/helpers/trackStream.js
  var streamChunk = function* (chunk, chunkSize) {
    let len = chunk.byteLength;
    if (!chunkSize || len < chunkSize) {
      yield chunk;
      return;
    }
    let pos = 0;
    let end2;
    while (pos < len) {
      end2 = pos + chunkSize;
      yield chunk.slice(pos, end2);
      pos = end2;
    }
  };
  var readBytes = async function* (iterable, chunkSize) {
    for await (const chunk of readStream(iterable)) {
      yield* streamChunk(chunk, chunkSize);
    }
  };
  var readStream = async function* (stream) {
    if (stream[Symbol.asyncIterator]) {
      yield* stream;
      return;
    }
    const reader = stream.getReader();
    try {
      for (; ; ) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        yield value;
      }
    } finally {
      await reader.cancel();
    }
  };
  var trackStream = (stream, chunkSize, onProgress, onFinish) => {
    const iterator2 = readBytes(stream, chunkSize);
    let bytes = 0;
    let done;
    let _onFinish = (e) => {
      if (!done) {
        done = true;
        onFinish && onFinish(e);
      }
    };
    return new ReadableStream(
      {
        async pull(controller) {
          try {
            const { done: done2, value } = await iterator2.next();
            if (done2) {
              _onFinish();
              controller.close();
              return;
            }
            let len = value.byteLength;
            if (onProgress) {
              let loadedBytes = bytes += len;
              onProgress(loadedBytes);
            }
            controller.enqueue(new Uint8Array(value));
          } catch (err) {
            _onFinish(err);
            throw err;
          }
        },
        cancel(reason) {
          _onFinish(reason);
          return iterator2.return();
        }
      },
      {
        highWaterMark: 2
      }
    );
  };

  // node_modules/axios/lib/helpers/estimateDataURLDecodedBytes.js
  function estimateDataURLDecodedBytes(url2) {
    if (!url2 || typeof url2 !== "string") return 0;
    if (!url2.startsWith("data:")) return 0;
    const comma = url2.indexOf(",");
    if (comma < 0) return 0;
    const meta = url2.slice(5, comma);
    const body = url2.slice(comma + 1);
    const isBase64 = /;base64/i.test(meta);
    if (isBase64) {
      let effectiveLen = body.length;
      const len = body.length;
      for (let i = 0; i < len; i++) {
        if (body.charCodeAt(i) === 37 && i + 2 < len) {
          const a = body.charCodeAt(i + 1);
          const b = body.charCodeAt(i + 2);
          const isHex = (a >= 48 && a <= 57 || a >= 65 && a <= 70 || a >= 97 && a <= 102) && (b >= 48 && b <= 57 || b >= 65 && b <= 70 || b >= 97 && b <= 102);
          if (isHex) {
            effectiveLen -= 2;
            i += 2;
          }
        }
      }
      let pad = 0;
      let idx = len - 1;
      const tailIsPct3D = (j) => j >= 2 && body.charCodeAt(j - 2) === 37 && // '%'
      body.charCodeAt(j - 1) === 51 && // '3'
      (body.charCodeAt(j) === 68 || body.charCodeAt(j) === 100);
      if (idx >= 0) {
        if (body.charCodeAt(idx) === 61) {
          pad++;
          idx--;
        } else if (tailIsPct3D(idx)) {
          pad++;
          idx -= 3;
        }
      }
      if (pad === 1 && idx >= 0) {
        if (body.charCodeAt(idx) === 61) {
          pad++;
        } else if (tailIsPct3D(idx)) {
          pad++;
        }
      }
      const groups = Math.floor(effectiveLen / 4);
      const bytes2 = groups * 3 - (pad || 0);
      return bytes2 > 0 ? bytes2 : 0;
    }
    if (typeof Buffer !== "undefined" && typeof Buffer.byteLength === "function") {
      return Buffer.byteLength(body, "utf8");
    }
    let bytes = 0;
    for (let i = 0, len = body.length; i < len; i++) {
      const c = body.charCodeAt(i);
      if (c < 128) {
        bytes += 1;
      } else if (c < 2048) {
        bytes += 2;
      } else if (c >= 55296 && c <= 56319 && i + 1 < len) {
        const next = body.charCodeAt(i + 1);
        if (next >= 56320 && next <= 57343) {
          bytes += 4;
          i++;
        } else {
          bytes += 3;
        }
      } else {
        bytes += 3;
      }
    }
    return bytes;
  }

  // node_modules/axios/lib/env/data.js
  var VERSION = "1.16.1";

  // node_modules/axios/lib/adapters/fetch.js
  var DEFAULT_CHUNK_SIZE = 64 * 1024;
  var { isFunction: isFunction2 } = utils_default;
  var test = (fn, ...args) => {
    try {
      return !!fn(...args);
    } catch (e) {
      return false;
    }
  };
  var factory = (env) => {
    const globalObject = utils_default.global !== void 0 && utils_default.global !== null ? utils_default.global : globalThis;
    const { ReadableStream: ReadableStream2, TextEncoder } = globalObject;
    env = utils_default.merge.call(
      {
        skipUndefined: true
      },
      {
        Request: globalObject.Request,
        Response: globalObject.Response
      },
      env
    );
    const { fetch: envFetch, Request, Response } = env;
    const isFetchSupported = envFetch ? isFunction2(envFetch) : typeof fetch === "function";
    const isRequestSupported = isFunction2(Request);
    const isResponseSupported = isFunction2(Response);
    if (!isFetchSupported) {
      return false;
    }
    const isReadableStreamSupported = isFetchSupported && isFunction2(ReadableStream2);
    const encodeText = isFetchSupported && (typeof TextEncoder === "function" ? /* @__PURE__ */ ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) : async (str) => new Uint8Array(await new Request(str).arrayBuffer()));
    const supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(() => {
      let duplexAccessed = false;
      const request = new Request(platform_default.origin, {
        body: new ReadableStream2(),
        method: "POST",
        get duplex() {
          duplexAccessed = true;
          return "half";
        }
      });
      const hasContentType = request.headers.has("Content-Type");
      if (request.body != null) {
        request.body.cancel();
      }
      return duplexAccessed && !hasContentType;
    });
    const supportsResponseStream = isResponseSupported && isReadableStreamSupported && test(() => utils_default.isReadableStream(new Response("").body));
    const resolvers = {
      stream: supportsResponseStream && ((res) => res.body)
    };
    isFetchSupported && (() => {
      ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
        !resolvers[type] && (resolvers[type] = (res, config) => {
          let method = res && res[type];
          if (method) {
            return method.call(res);
          }
          throw new AxiosError_default(
            `Response type '${type}' is not supported`,
            AxiosError_default.ERR_NOT_SUPPORT,
            config
          );
        });
      });
    })();
    const getBodyLength = async (body) => {
      if (body == null) {
        return 0;
      }
      if (utils_default.isBlob(body)) {
        return body.size;
      }
      if (utils_default.isSpecCompliantForm(body)) {
        const _request = new Request(platform_default.origin, {
          method: "POST",
          body
        });
        return (await _request.arrayBuffer()).byteLength;
      }
      if (utils_default.isArrayBufferView(body) || utils_default.isArrayBuffer(body)) {
        return body.byteLength;
      }
      if (utils_default.isURLSearchParams(body)) {
        body = body + "";
      }
      if (utils_default.isString(body)) {
        return (await encodeText(body)).byteLength;
      }
    };
    const resolveBodyLength = async (headers, body) => {
      const length = utils_default.toFiniteNumber(headers.getContentLength());
      return length == null ? getBodyLength(body) : length;
    };
    return async (config) => {
      let {
        url: url2,
        method,
        data: data7,
        signal,
        cancelToken,
        timeout,
        onDownloadProgress,
        onUploadProgress,
        responseType,
        headers,
        withCredentials = "same-origin",
        fetchOptions,
        maxContentLength,
        maxBodyLength
      } = resolveConfig_default(config);
      const hasMaxContentLength = utils_default.isNumber(maxContentLength) && maxContentLength > -1;
      const hasMaxBodyLength = utils_default.isNumber(maxBodyLength) && maxBodyLength > -1;
      let _fetch = envFetch || fetch;
      responseType = responseType ? (responseType + "").toLowerCase() : "text";
      let composedSignal = composeSignals_default(
        [signal, cancelToken && cancelToken.toAbortSignal()],
        timeout
      );
      let request = null;
      const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
        composedSignal.unsubscribe();
      });
      let requestContentLength;
      try {
        if (hasMaxContentLength && typeof url2 === "string" && url2.startsWith("data:")) {
          const estimated = estimateDataURLDecodedBytes(url2);
          if (estimated > maxContentLength) {
            throw new AxiosError_default(
              "maxContentLength size of " + maxContentLength + " exceeded",
              AxiosError_default.ERR_BAD_RESPONSE,
              config,
              request
            );
          }
        }
        if (hasMaxBodyLength && method !== "get" && method !== "head") {
          const outboundLength = await resolveBodyLength(headers, data7);
          if (typeof outboundLength === "number" && isFinite(outboundLength) && outboundLength > maxBodyLength) {
            throw new AxiosError_default(
              "Request body larger than maxBodyLength limit",
              AxiosError_default.ERR_BAD_REQUEST,
              config,
              request
            );
          }
        }
        if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data7)) !== 0) {
          let _request = new Request(url2, {
            method: "POST",
            body: data7,
            duplex: "half"
          });
          let contentTypeHeader;
          if (utils_default.isFormData(data7) && (contentTypeHeader = _request.headers.get("content-type"))) {
            headers.setContentType(contentTypeHeader);
          }
          if (_request.body) {
            const [onProgress, flush] = progressEventDecorator(
              requestContentLength,
              progressEventReducer(asyncDecorator(onUploadProgress))
            );
            data7 = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
          }
        }
        if (!utils_default.isString(withCredentials)) {
          withCredentials = withCredentials ? "include" : "omit";
        }
        const isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;
        if (utils_default.isFormData(data7)) {
          const contentType = headers.getContentType();
          if (contentType && /^multipart\/form-data/i.test(contentType) && !/boundary=/i.test(contentType)) {
            headers.delete("content-type");
          }
        }
        headers.set("User-Agent", "axios/" + VERSION, false);
        const resolvedOptions = {
          ...fetchOptions,
          signal: composedSignal,
          method: method.toUpperCase(),
          headers: toByteStringHeaderObject(headers.normalize()),
          body: data7,
          duplex: "half",
          credentials: isCredentialsSupported ? withCredentials : void 0
        };
        request = isRequestSupported && new Request(url2, resolvedOptions);
        let response = await (isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url2, resolvedOptions));
        if (hasMaxContentLength) {
          const declaredLength = utils_default.toFiniteNumber(response.headers.get("content-length"));
          if (declaredLength != null && declaredLength > maxContentLength) {
            throw new AxiosError_default(
              "maxContentLength size of " + maxContentLength + " exceeded",
              AxiosError_default.ERR_BAD_RESPONSE,
              config,
              request
            );
          }
        }
        const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
        if (supportsResponseStream && response.body && (onDownloadProgress || hasMaxContentLength || isStreamResponse && unsubscribe)) {
          const options = {};
          ["status", "statusText", "headers"].forEach((prop) => {
            options[prop] = response[prop];
          });
          const responseContentLength = utils_default.toFiniteNumber(response.headers.get("content-length"));
          const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
            responseContentLength,
            progressEventReducer(asyncDecorator(onDownloadProgress), true)
          ) || [];
          let bytesRead = 0;
          const onChunkProgress = (loadedBytes) => {
            if (hasMaxContentLength) {
              bytesRead = loadedBytes;
              if (bytesRead > maxContentLength) {
                throw new AxiosError_default(
                  "maxContentLength size of " + maxContentLength + " exceeded",
                  AxiosError_default.ERR_BAD_RESPONSE,
                  config,
                  request
                );
              }
            }
            onProgress && onProgress(loadedBytes);
          };
          response = new Response(
            trackStream(response.body, DEFAULT_CHUNK_SIZE, onChunkProgress, () => {
              flush && flush();
              unsubscribe && unsubscribe();
            }),
            options
          );
        }
        responseType = responseType || "text";
        let responseData = await resolvers[utils_default.findKey(resolvers, responseType) || "text"](
          response,
          config
        );
        if (hasMaxContentLength && !supportsResponseStream && !isStreamResponse) {
          let materializedSize;
          if (responseData != null) {
            if (typeof responseData.byteLength === "number") {
              materializedSize = responseData.byteLength;
            } else if (typeof responseData.size === "number") {
              materializedSize = responseData.size;
            } else if (typeof responseData === "string") {
              materializedSize = typeof TextEncoder === "function" ? new TextEncoder().encode(responseData).byteLength : responseData.length;
            }
          }
          if (typeof materializedSize === "number" && materializedSize > maxContentLength) {
            throw new AxiosError_default(
              "maxContentLength size of " + maxContentLength + " exceeded",
              AxiosError_default.ERR_BAD_RESPONSE,
              config,
              request
            );
          }
        }
        !isStreamResponse && unsubscribe && unsubscribe();
        return await new Promise((resolve, reject) => {
          settle(resolve, reject, {
            data: responseData,
            headers: AxiosHeaders_default.from(response.headers),
            status: response.status,
            statusText: response.statusText,
            config,
            request
          });
        });
      } catch (err) {
        unsubscribe && unsubscribe();
        if (composedSignal && composedSignal.aborted && composedSignal.reason instanceof AxiosError_default) {
          const canceledError = composedSignal.reason;
          canceledError.config = config;
          request && (canceledError.request = request);
          err !== canceledError && (canceledError.cause = err);
          throw canceledError;
        }
        if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) {
          throw Object.assign(
            new AxiosError_default(
              "Network Error",
              AxiosError_default.ERR_NETWORK,
              config,
              request,
              err && err.response
            ),
            {
              cause: err.cause || err
            }
          );
        }
        throw AxiosError_default.from(err, err && err.code, config, request, err && err.response);
      }
    };
  };
  var seedCache = /* @__PURE__ */ new Map();
  var getFetch = (config) => {
    let env = config && config.env || {};
    const { fetch: fetch2, Request, Response } = env;
    const seeds = [Request, Response, fetch2];
    let len = seeds.length, i = len, seed, target, map = seedCache;
    while (i--) {
      seed = seeds[i];
      target = map.get(seed);
      target === void 0 && map.set(seed, target = i ? /* @__PURE__ */ new Map() : factory(env));
      map = target;
    }
    return target;
  };
  var adapter = getFetch();

  // node_modules/axios/lib/adapters/adapters.js
  var knownAdapters = {
    http: null_default,
    xhr: xhr_default,
    fetch: {
      get: getFetch
    }
  };
  utils_default.forEach(knownAdapters, (fn, value) => {
    if (fn) {
      try {
        Object.defineProperty(fn, "name", { __proto__: null, value });
      } catch (e) {
      }
      Object.defineProperty(fn, "adapterName", { __proto__: null, value });
    }
  });
  var renderReason = (reason) => `- ${reason}`;
  var isResolvedHandle = (adapter2) => utils_default.isFunction(adapter2) || adapter2 === null || adapter2 === false;
  function getAdapter(adapters, config) {
    adapters = utils_default.isArray(adapters) ? adapters : [adapters];
    const { length } = adapters;
    let nameOrAdapter;
    let adapter2;
    const rejectedReasons = {};
    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;
      adapter2 = nameOrAdapter;
      if (!isResolvedHandle(nameOrAdapter)) {
        adapter2 = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
        if (adapter2 === void 0) {
          throw new AxiosError_default(`Unknown adapter '${id}'`);
        }
      }
      if (adapter2 && (utils_default.isFunction(adapter2) || (adapter2 = adapter2.get(config)))) {
        break;
      }
      rejectedReasons[id || "#" + i] = adapter2;
    }
    if (!adapter2) {
      const reasons = Object.entries(rejectedReasons).map(
        ([id, state5]) => `adapter ${id} ` + (state5 === false ? "is not supported by the environment" : "is not available in the build")
      );
      let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
      throw new AxiosError_default(
        `There is no suitable adapter to dispatch the request ` + s,
        "ERR_NOT_SUPPORT"
      );
    }
    return adapter2;
  }
  var adapters_default = {
    /**
     * Resolve an adapter from a list of adapter names or functions.
     * @type {Function}
     */
    getAdapter,
    /**
     * Exposes all known adapters
     * @type {Object<string, Function|Object>}
     */
    adapters: knownAdapters
  };

  // node_modules/axios/lib/core/dispatchRequest.js
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
    if (config.signal && config.signal.aborted) {
      throw new CanceledError_default(null, config);
    }
  }
  function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    config.headers = AxiosHeaders_default.from(config.headers);
    config.data = transformData.call(config, config.transformRequest);
    if (["post", "put", "patch"].indexOf(config.method) !== -1) {
      config.headers.setContentType("application/x-www-form-urlencoded", false);
    }
    const adapter2 = adapters_default.getAdapter(config.adapter || defaults_default.adapter, config);
    return adapter2(config).then(
      function onAdapterResolution(response) {
        throwIfCancellationRequested(config);
        config.response = response;
        try {
          response.data = transformData.call(config, config.transformResponse, response);
        } finally {
          delete config.response;
        }
        response.headers = AxiosHeaders_default.from(response.headers);
        return response;
      },
      function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);
          if (reason && reason.response) {
            config.response = reason.response;
            try {
              reason.response.data = transformData.call(
                config,
                config.transformResponse,
                reason.response
              );
            } finally {
              delete config.response;
            }
            reason.response.headers = AxiosHeaders_default.from(reason.response.headers);
          }
        }
        return Promise.reject(reason);
      }
    );
  }

  // node_modules/axios/lib/helpers/validator.js
  var validators = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
    validators[type] = function validator(thing) {
      return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
    };
  });
  var deprecatedWarnings = {};
  validators.transitional = function transitional(validator, version, message) {
    function formatMessage(opt, desc) {
      return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
    }
    return (value, opt, opts) => {
      if (validator === false) {
        throw new AxiosError_default(
          formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
          AxiosError_default.ERR_DEPRECATED
        );
      }
      if (version && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        console.warn(
          formatMessage(
            opt,
            " has been deprecated since v" + version + " and will be removed in the near future"
          )
        );
      }
      return validator ? validator(value, opt, opts) : true;
    };
  };
  validators.spelling = function spelling(correctSpelling) {
    return (value, opt) => {
      console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
      return true;
    };
  };
  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== "object") {
      throw new AxiosError_default("options must be an object", AxiosError_default.ERR_BAD_OPTION_VALUE);
    }
    const keys = Object.keys(options);
    let i = keys.length;
    while (i-- > 0) {
      const opt = keys[i];
      const validator = Object.prototype.hasOwnProperty.call(schema, opt) ? schema[opt] : void 0;
      if (validator) {
        const value = options[opt];
        const result = value === void 0 || validator(value, opt, options);
        if (result !== true) {
          throw new AxiosError_default(
            "option " + opt + " must be " + result,
            AxiosError_default.ERR_BAD_OPTION_VALUE
          );
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw new AxiosError_default("Unknown option " + opt, AxiosError_default.ERR_BAD_OPTION);
      }
    }
  }
  var validator_default = {
    assertOptions,
    validators
  };

  // node_modules/axios/lib/core/Axios.js
  var validators2 = validator_default.validators;
  var Axios = class {
    constructor(instanceConfig) {
      this.defaults = instanceConfig || {};
      this.interceptors = {
        request: new InterceptorManager_default(),
        response: new InterceptorManager_default()
      };
    }
    /**
     * Dispatch a request
     *
     * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
     * @param {?Object} config
     *
     * @returns {Promise} The Promise to be fulfilled
     */
    async request(configOrUrl, config) {
      try {
        return await this._request(configOrUrl, config);
      } catch (err) {
        if (err instanceof Error) {
          let dummy = {};
          Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();
          const stack = (() => {
            if (!dummy.stack) {
              return "";
            }
            const firstNewlineIndex = dummy.stack.indexOf("\n");
            return firstNewlineIndex === -1 ? "" : dummy.stack.slice(firstNewlineIndex + 1);
          })();
          try {
            if (!err.stack) {
              err.stack = stack;
            } else if (stack) {
              const firstNewlineIndex = stack.indexOf("\n");
              const secondNewlineIndex = firstNewlineIndex === -1 ? -1 : stack.indexOf("\n", firstNewlineIndex + 1);
              const stackWithoutTwoTopLines = secondNewlineIndex === -1 ? "" : stack.slice(secondNewlineIndex + 1);
              if (!String(err.stack).endsWith(stackWithoutTwoTopLines)) {
                err.stack += "\n" + stack;
              }
            }
          } catch (e) {
          }
        }
        throw err;
      }
    }
    _request(configOrUrl, config) {
      if (typeof configOrUrl === "string") {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }
      config = mergeConfig(this.defaults, config);
      const { transitional: transitional2, paramsSerializer, headers } = config;
      if (transitional2 !== void 0) {
        validator_default.assertOptions(
          transitional2,
          {
            silentJSONParsing: validators2.transitional(validators2.boolean),
            forcedJSONParsing: validators2.transitional(validators2.boolean),
            clarifyTimeoutError: validators2.transitional(validators2.boolean),
            legacyInterceptorReqResOrdering: validators2.transitional(validators2.boolean)
          },
          false
        );
      }
      if (paramsSerializer != null) {
        if (utils_default.isFunction(paramsSerializer)) {
          config.paramsSerializer = {
            serialize: paramsSerializer
          };
        } else {
          validator_default.assertOptions(
            paramsSerializer,
            {
              encode: validators2.function,
              serialize: validators2.function
            },
            true
          );
        }
      }
      if (config.allowAbsoluteUrls !== void 0) {
      } else if (this.defaults.allowAbsoluteUrls !== void 0) {
        config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
      } else {
        config.allowAbsoluteUrls = true;
      }
      validator_default.assertOptions(
        config,
        {
          baseUrl: validators2.spelling("baseURL"),
          withXsrfToken: validators2.spelling("withXSRFToken")
        },
        true
      );
      config.method = (config.method || this.defaults.method || "get").toLowerCase();
      let contextHeaders = headers && utils_default.merge(headers.common, headers[config.method]);
      headers && utils_default.forEach(["delete", "get", "head", "post", "put", "patch", "query", "common"], (method) => {
        delete headers[method];
      });
      config.headers = AxiosHeaders_default.concat(contextHeaders, headers);
      const requestInterceptorChain = [];
      let synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
          return;
        }
        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
        const transitional3 = config.transitional || transitional_default;
        const legacyInterceptorReqResOrdering = transitional3 && transitional3.legacyInterceptorReqResOrdering;
        if (legacyInterceptorReqResOrdering) {
          requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
        } else {
          requestInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
        }
      });
      const responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });
      let promise;
      let i = 0;
      let len;
      if (!synchronousRequestInterceptors) {
        const chain = [dispatchRequest.bind(this), void 0];
        chain.unshift(...requestInterceptorChain);
        chain.push(...responseInterceptorChain);
        len = chain.length;
        promise = Promise.resolve(config);
        while (i < len) {
          promise = promise.then(chain[i++], chain[i++]);
        }
        return promise;
      }
      len = requestInterceptorChain.length;
      let newConfig = config;
      while (i < len) {
        const onFulfilled = requestInterceptorChain[i++];
        const onRejected = requestInterceptorChain[i++];
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error2) {
          onRejected.call(this, error2);
          break;
        }
      }
      try {
        promise = dispatchRequest.call(this, newConfig);
      } catch (error2) {
        return Promise.reject(error2);
      }
      i = 0;
      len = responseInterceptorChain.length;
      while (i < len) {
        promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
      }
      return promise;
    }
    getUri(config) {
      config = mergeConfig(this.defaults, config);
      const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    }
  };
  utils_default.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
    Axios.prototype[method] = function(url2, config) {
      return this.request(
        mergeConfig(config || {}, {
          method,
          url: url2,
          data: (config || {}).data
        })
      );
    };
  });
  utils_default.forEach(["post", "put", "patch", "query"], function forEachMethodWithData(method) {
    function generateHTTPMethod(isForm) {
      return function httpMethod(url2, data7, config) {
        return this.request(
          mergeConfig(config || {}, {
            method,
            headers: isForm ? {
              "Content-Type": "multipart/form-data"
            } : {},
            url: url2,
            data: data7
          })
        );
      };
    }
    Axios.prototype[method] = generateHTTPMethod();
    if (method !== "query") {
      Axios.prototype[method + "Form"] = generateHTTPMethod(true);
    }
  });
  var Axios_default = Axios;

  // node_modules/axios/lib/cancel/CancelToken.js
  var CancelToken = class _CancelToken {
    constructor(executor) {
      if (typeof executor !== "function") {
        throw new TypeError("executor must be a function.");
      }
      let resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      const token = this;
      this.promise.then((cancel) => {
        if (!token._listeners) return;
        let i = token._listeners.length;
        while (i-- > 0) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });
      this.promise.then = (onfulfilled) => {
        let _resolve;
        const promise = new Promise((resolve) => {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);
        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };
        return promise;
      };
      executor(function cancel(message, config, request) {
        if (token.reason) {
          return;
        }
        token.reason = new CanceledError_default(message, config, request);
        resolvePromise(token.reason);
      });
    }
    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    }
    /**
     * Subscribe to the cancel signal
     */
    subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }
      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    }
    /**
     * Unsubscribe from the cancel signal
     */
    unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      const index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    }
    toAbortSignal() {
      const controller = new AbortController();
      const abort = (err) => {
        controller.abort(err);
      };
      this.subscribe(abort);
      controller.signal.unsubscribe = () => this.unsubscribe(abort);
      return controller.signal;
    }
    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    static source() {
      let cancel;
      const token = new _CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token,
        cancel
      };
    }
  };
  var CancelToken_default = CancelToken;

  // node_modules/axios/lib/helpers/spread.js
  function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  }

  // node_modules/axios/lib/helpers/isAxiosError.js
  function isAxiosError(payload) {
    return utils_default.isObject(payload) && payload.isAxiosError === true;
  }

  // node_modules/axios/lib/helpers/HttpStatusCode.js
  var HttpStatusCode = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511,
    WebServerIsDown: 521,
    ConnectionTimedOut: 522,
    OriginIsUnreachable: 523,
    TimeoutOccurred: 524,
    SslHandshakeFailed: 525,
    InvalidSslCertificate: 526
  };
  Object.entries(HttpStatusCode).forEach(([key, value]) => {
    HttpStatusCode[value] = key;
  });
  var HttpStatusCode_default = HttpStatusCode;

  // node_modules/axios/lib/axios.js
  function createInstance(defaultConfig) {
    const context = new Axios_default(defaultConfig);
    const instance = bind(Axios_default.prototype.request, context);
    utils_default.extend(instance, Axios_default.prototype, context, { allOwnKeys: true });
    utils_default.extend(instance, context, null, { allOwnKeys: true });
    instance.create = function create2(instanceConfig) {
      return createInstance(mergeConfig(defaultConfig, instanceConfig));
    };
    return instance;
  }
  var axios = createInstance(defaults_default);
  axios.Axios = Axios_default;
  axios.CanceledError = CanceledError_default;
  axios.CancelToken = CancelToken_default;
  axios.isCancel = isCancel;
  axios.VERSION = VERSION;
  axios.toFormData = toFormData_default;
  axios.AxiosError = AxiosError_default;
  axios.Cancel = axios.CanceledError;
  axios.all = function all(promises) {
    return Promise.all(promises);
  };
  axios.spread = spread;
  axios.isAxiosError = isAxiosError;
  axios.mergeConfig = mergeConfig;
  axios.AxiosHeaders = AxiosHeaders_default;
  axios.formToJSON = (thing) => formDataToJSON_default(utils_default.isHTMLForm(thing) ? new FormData(thing) : thing);
  axios.getAdapter = adapters_default.getAdapter;
  axios.HttpStatusCode = HttpStatusCode_default;
  axios.default = axios;
  var axios_default = axios;

  // node_modules/axios/index.js
  var {
    Axios: Axios2,
    AxiosError: AxiosError2,
    CanceledError: CanceledError2,
    isCancel: isCancel2,
    CancelToken: CancelToken2,
    VERSION: VERSION2,
    all: all2,
    Cancel,
    isAxiosError: isAxiosError2,
    spread: spread2,
    toFormData: toFormData2,
    AxiosHeaders: AxiosHeaders2,
    HttpStatusCode: HttpStatusCode2,
    formToJSON,
    getAdapter: getAdapter2,
    mergeConfig: mergeConfig2,
    create
  } = axios_default;

  // src/dom.ts
  var root = document.documentElement;
  var style = window.getComputedStyle(document.body);
  var byId = (id) => {
    return document.getElementById(id);
  };
  var byQuery = (query) => document.querySelector(query);
  var byQueryAll = (query) => document.querySelectorAll(query);
  var byQ = (elem, query) => elem.querySelector(query);
  var byQAll = (elem, query) => elem.querySelectorAll(query);
  var getPx = (num) => `${num}px`;
  var inner = (elem, txt) => elem.innerHTML = txt;
  var prepare = (node, options) => {
    const elem = typeof node === "string" ? document.createElement(node) : node;
    if (elem && elem instanceof HTMLElement) {
      if (options?.delete) {
        elem.remove();
        return;
      }
      if (options?.id) elem.id = options.id;
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
    return null;
  };
  var setStyle = (element, style2, value) => {
    element.style[style2] = value;
  };
  var getColorFromStyle = (name) => style.getPropertyValue(name).trim();
  var setAttribute = (element, attribute, value) => element.setAttribute(attribute, value);
  var disable = (elem) => elem.setAttribute("disabled", "");
  var enable = (elem) => elem.removeAttribute("disabled");
  var display = (elem, attribute) => elem.style.display = attribute;
  var removeClass = (elem, attribute) => elem.classList.remove(attribute);
  var addClass = (elem, attribute) => elem.classList.add(attribute);
  var add = (elem, name, fn) => elem.addEventListener(name, fn);
  var remove = (elem, name, fn) => elem.removeEventListener(name, fn);
  var boundRect = (elem) => elem.getBoundingClientRect();

  // src/core.ts
  var core = {
    // store: null,
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB10|PlayBook|IEMobile|Windows Phone|Opera Mini|Opera Mobi|Mobile Safari|Fennec|Kindle|Silk|Ubuntu Touch/i.test(navigator.userAgent) || window.innerWidth < 768,
    idb: {}
    // _csrf: null
  };

  // src/engine/helpers.ts
  var getDateAtNoonInXDays = (daysPlus, date) => {
    const newDate = date ? new Date(date) : /* @__PURE__ */ new Date();
    const targetDate = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate() + daysPlus,
      12,
      0,
      0,
      0
    );
    return targetDate.getTime();
  };
  var generateTriangularSequence = (length) => {
    const result = [];
    let n = 1, current = 0;
    for (let i = 0; i < length; i++) {
      current += n;
      result.push(current);
      n++;
    }
    return result;
  };

  // src/engine/params.ts
  var determinants = {
    questionInSession: 30,
    numLastRequiredQuestions: 3,
    // ile razy pod rząd trzeba odpowiedzieć, żeby było uznane, że umiesz (100%)
    numLastHighlyRatedQuestions: 6,
    // --//-- , że umiesz super dobrze (200%)
    // intelligence: 1 / 3, // prawdopodobieństwo na ile % odpowiada dobrze
    repetition: generateTriangularSequence(10),
    whenManyToAnswerPercent: 15
  };
  var repeatable = {
    lastUsed: 0.1,
    // ostatnie użycie pytania
    nextUse: 0.3,
    // następne planowane użycie pytania
    appearance: 0.1,
    // w ilu testach pojawiło się pytanie
    rating: 1.2,
    // poziom nauki pytań
    littleUsed: 0,
    // najmniej powtarzalne pytania
    temperature: 0.1
    // wielkość zbioru do losowania
  };
  var repeatableGood = {
    lastUsed: 0.1,
    // ostatnie użycie pytania
    nextUse: 0.3,
    // następne planowane użycie pytania
    appearance: 0.1,
    // w ilu testach pojawiło się pytanie
    rating: 0.2,
    // poziom nauki pytań
    littleUsed: 0,
    // najmniej powtarzalne pytania
    temperature: 1
    // wielkość zbioru do losowania
  };
  var single = {
    lastUsed: 0.1,
    // ostatnie użycie pytania
    nextUse: 0.2,
    // następne planowane użycie pytania
    appearance: 0.1,
    // w ilu testach pojawiło się pytanie
    rating: 5,
    // poziom nauki pytań
    littleUsed: 0,
    // najmniej powtarzalne pytania
    temperature: 0.05
  };
  var singleGood = {
    lastUsed: 0.1,
    // ostatnie użycie pytania
    nextUse: 0.2,
    // następne planowane użycie pytania
    appearance: 0.1,
    // w ilu testach pojawiło się pytanie
    rating: 0.3,
    // poziom nauki pytań
    littleUsed: 0,
    // najmniej powtarzalne pytania
    temperature: 1
  };
  var data = {
    weights: null,
    answers: [],
    repeatableAnswers: [],
    singleAnswers: [],
    quantities: [],
    sume: 0,
    normalizedWeights: {},
    numOfQuestions: {
      repeatable: 0,
      single: 0
    },
    session: [],
    index: -1
  };
  var getNormalizedWeights = (weights) => {
    let sume = 0;
    Object.keys(weights).forEach((key) => sume += weights[key]);
    sume -= weights.temperature;
    const normalizedWeights = { ...weights };
    Object.keys(weights).forEach((key) => normalizedWeights[key] = weights[key] / sume);
    normalizedWeights.temperature = weights.temperature;
    return normalizedWeights;
  };
  var init = async () => {
    data.normalizedWeights.repeatable = getNormalizedWeights(repeatable);
    data.normalizedWeights.repeatableGood = getNormalizedWeights(repeatableGood);
    data.normalizedWeights.single = getNormalizedWeights(single);
    data.normalizedWeights.singleGood = getNormalizedWeights(singleGood);
    const questionRatio = Number(core.store.get(storageNames.questionsRatio));
    const questionNum = determinants.questionInSession;
    data.numOfQuestions.repeatable = questionRatio;
    data.numOfQuestions.single = questionNum - questionRatio;
  };
  var updateAnswers = async () => {
    const answersDb = await core.idb.answers.getAllData();
    const newAnswers = answersDb.map((answer) => {
      const index = answer[0];
      const item = answer[1];
      item.drawn = false;
      item.index = index;
      return item;
    });
    const answers = newAnswers.sort((a, b) => b.used - a.used);
    data.answers = [];
    data.repeatableAnswers = [];
    data.singleAnswers = [];
    answers.forEach((answer, i) => {
      data.answers[i] = answer;
      if (answer.used === 1) {
        data.singleAnswers.push(answer);
      } else {
        data.repeatableAnswers.push(answer);
      }
    });
  };

  // src/storage.ts
  var checked = {
    yes: "yes",
    no: "no"
  };
  var storageNames = {
    theme: "theme",
    questionsData: "questions-data",
    imgData: "img-data",
    imgAvailable: "img-available",
    //
    userId: "user-id",
    version: "version",
    configTests: "config-tests",
    menuLeft: "menu-left",
    questionsRatio: "questions-ratio",
    sessionStarted: "session-started",
    infoVersion: "info-version"
  };
  var START_QUESTIONS_RATIO = 0.85;
  var getQuestionsRatio = () => Math.floor(determinants.questionInSession * START_QUESTIONS_RATIO).toString();
  var defaultData = {
    theme: "",
    questionsData: checked.yes,
    imgData: checked.yes,
    imgAvailable: checked.no,
    userId: "null",
    version: "null",
    configTests: "null",
    menuLeft: checked.no,
    questionsRatio: 25,
    sessionStarted: checked.no,
    infoVersion: "null"
  };
  var getStorage = async () => {
    const isValidJSONStringify = (value) => {
      try {
        const result = JSON.stringify(value);
        return result !== void 0;
      } catch {
        return false;
      }
    };
    const isValidJSONParse = (value) => {
      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    };
    const set3 = (key, value) => {
      if (!isValidJSONStringify(value)) {
        throw new Error(`Value for key "${key}" is not JSON serializable`);
      }
      localStorage.setItem(key, JSON.stringify(value));
    };
    const get3 = (key) => {
      const value = localStorage.getItem(key);
      if (value === null) return null;
      if (!isValidJSONParse(value)) {
        return value;
      }
      return JSON.parse(value);
    };
    const remove2 = (key) => {
      localStorage.removeItem(key);
    };
    const clear = () => {
      localStorage.clear();
    };
    const initData = () => {
      const keys = Object.keys(storageNames);
      keys.forEach((key) => {
        const keyName = storageNames[key];
        const data7 = get3(keyName);
        if (data7 === null) {
          set3(keyName, defaultData[key]);
        }
      });
      const questionsRatio = get3(storageNames.questionsRatio);
      if (questionsRatio === null) {
        set3(storageNames.questionsRatio, getQuestionsRatio());
      }
    };
    initData();
    return {
      set: set3,
      get: get3,
      remove: remove2,
      clear,
      isValidJSONStringify,
      isValidJSONParse
    };
  };

  // src/utils/isNotNull.ts
  var getObjectPath = (keys) => {
    let path = "";
    keys.forEach((key) => {
      if (typeof key === "number") {
        path += `[${key}]`;
        return;
      }
      path += path ? `.${key}` : key;
    });
    return path;
  };
  var isNotNull = (value, keys = []) => {
    if (value === null) {
      console.log(
        "%c AssertionError:",
        "background:rgb(255, 0, 212); color: #003300",
        `Passed value at "${getObjectPath(keys)}" is nullable`
      );
    }
  };
  var areNotNull = (value, keys = []) => {
    isNotNull(value, keys);
    if (value === null) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        areNotNull(item, [
          ...keys,
          index
        ]);
      });
      return;
    }
    if (typeof value === "object") {
      Object.entries(value).forEach(
        ([key, nestedValue]) => {
          areNotNull(nestedValue, [
            ...keys,
            key
          ]);
        }
      );
    }
  };

  // src/tab/simpleMenu/simpleMenu.ts
  var elements = {};
  var setIconsColor = (index) => elements.items.forEach((item, i) => {
    if (index === i) {
      setStyle(item, "fill", "var(--mine_color)");
    } else {
      setStyle(item, "fill", "var(--mine_6_color)");
    }
  });
  var init3 = (getGoTo2, items) => {
    elements.menu = byId("menu-mobile");
    elements.list = byQuery(".menu-mobile-list");
    elements.items = byQAll(elements.menu, ".menu-mobile-item");
    elements.iconShowHide = byId("menu-mobile-icon-menu");
    elements.iconShow = byId("menu-mobile-icon-show");
    elements.iconHide = byId("menu-mobile-icon-hide");
    elements.iconHideSvg = byId("menu-mobile-icon-hide-svg");
    elements.items.forEach((item, index) => {
      items.push(item);
      const goTo = getGoTo2(index);
      add(item, "click", () => {
        goTo();
        setIconsColor(index);
      });
    });
    areNotNull(elements, ["simpleMenu"]);
    display(elements.menu, "none");
    setIconsColor(0);
    init2();
  };
  var showMenu = () => display(elements.menu, "flex");

  // src/tab/simpleMenu/visible.ts
  var leftSide = checked.no;
  var showHideIcon = {};
  var moveIconLeft = () => {
    showHideIcon.hide = () => {
      setStyle(elements.menu, "borderRadius", "0 30% 0 0");
      setStyle(elements.menu, "right", "");
      setStyle(elements.menu, "left", "-3%");
      setStyle(elements.iconHideSvg, "marginLeft", "0%");
    };
    showHideIcon.show = () => {
      setStyle(elements.menu, "borderRadius", "0");
      setStyle(elements.menu, "right", "");
      setStyle(elements.menu, "left", "0px");
      setStyle(elements.iconHideSvg, "marginLeft", "15%");
    };
  };
  var moveIconRight = () => {
    showHideIcon.hide = () => {
      setStyle(elements.menu, "borderRadius", "30% 0 0 0");
      setStyle(elements.menu, "right", "-3%");
      setStyle(elements.menu, "left", "");
      setStyle(elements.iconHideSvg, "marginLeft", "15%");
    };
    showHideIcon.show = () => {
      setStyle(elements.menu, "borderRadius", "0");
      setStyle(elements.menu, "right", "0px");
      setStyle(elements.menu, "left", "");
      setStyle(elements.iconHideSvg, "marginLeft", "15%");
    };
  };
  var hide = async () => {
    display(elements.iconHide, "initial");
    display(elements.iconShow, "none");
    display(elements.list, "none");
    setStyle(elements.menu, "width", "17%");
    setStyle(elements.iconShowHide, "width", "80%");
    if (showHideIcon.hide) showHideIcon.hide();
  };
  var show = async () => {
    display(elements.iconHide, "none");
    display(elements.iconShow, "initial");
    display(elements.list, "flex");
    setStyle(elements.menu, "width", "100%");
    setStyle(elements.iconShowHide, "width", "17%");
    if (showHideIcon.show) showHideIcon.show();
  };
  var isVisible = true;
  var menuSide = async (side) => {
    if (side === checked.yes) {
      addClass(elements.iconShowHide, "menu-mobile-left-icon");
      moveIconLeft();
      elements.items.forEach((i) => {
        setStyle(i, "borderLeft", "3px solid var(--fourth_from_end_color)");
        setStyle(i, "borderRight", "0px solid var(--fourth_from_end_color)");
      });
    } else {
      removeClass(elements.iconShowHide, "menu-mobile-left-icon");
      moveIconRight();
      elements.items.forEach((i) => {
        setStyle(i, "borderLeft", "0px solid var(--fourth_from_end_color)");
        setStyle(i, "borderRight", "3px solid var(--fourth_from_end_color)");
      });
    }
    if (isVisible) {
      showHideIcon.show();
    } else {
      showHideIcon.hide();
    }
  };
  var changeVisibility = () => {
    if (isVisible) {
      hide();
      isVisible = false;
    } else {
      show();
      isVisible = true;
    }
  };
  var init2 = async () => {
    leftSide = await core.store.get(storageNames.menuLeft);
    menuSide(leftSide);
    add(elements.iconShowHide, "click", changeVisibility);
  };

  // src/tab/tab.ts
  var tab_exports = {};
  __export(tab_exports, {
    blur: () => blur,
    getGoTo: () => getGoTo,
    goLeft: () => goLeft,
    goRight: () => goRight,
    init: () => init23,
    resize: () => resize7,
    screens: () => screens,
    setTab: () => setTab,
    state: () => state4,
    unBlur: () => unBlur
  });

  // src/screens/starter/starter.ts
  var starter_exports = {};
  __export(starter_exports, {
    active: () => active,
    deactivate: () => deactivate,
    elements: () => elements2,
    hideStatus: () => hideStatus,
    imgStatus: () => imgStatus,
    init: () => init4,
    initStatus: () => initStatus,
    questionsStatus: () => questionsStatus,
    resize: () => resize,
    setStartImgStatus: () => setStartImgStatus,
    setUserId: () => setUserId,
    setVersionPos: () => setVersionPos,
    showStatus: () => showStatus
  });
  var elements2 = {};
  var init4 = async () => {
    elements2.logoDark = byId("logo-dark");
    elements2.logoLight = byId("logo-light");
    elements2.svgTitle = byId("starter-svg-title");
    elements2.title_1 = byId("starter-title-1");
    elements2.title_2 = byId("starter-title-2");
    elements2.userLabel = byId("starter-user-label");
    elements2.userId = byId("starter-user-id");
    elements2.statusNow = byId("status-now");
    elements2.statusAction = byId("status-action");
    elements2.version = byId("starter-version");
    areNotNull(elements2, ["starter", "screen"]);
  };
  var setVersionPos = () => {
    const w = window.visualViewport?.width;
    const h = window.visualViewport?.height;
    const menuH = 121 / 701 * w;
    const versionX = w - elements2.version.getComputedTextLength() - 6 - (core.isMobile ? 0 : 200);
    const versionY = h - 6 - (core.isMobile ? menuH : 0);
    setAttribute(elements2.version, "x", `${getPx(versionX)}`);
    setAttribute(elements2.version, "y", `${getPx(versionY)}`);
  };
  var resize = async (w, h) => {
    const versionDb = await core.store.get(storageNames.version);
    inner(elements2.version, `version: ${versionDb}`);
    setTimeout(() => setVersionPos(), 200);
    const svgHeight = `${getPx(h)}`;
    const setTitleSize = (size) => {
      setStyle(elements2.svgTitle, "height", svgHeight);
      const fontSize = `${getPx(size)}`;
      let y = size;
      [elements2.title_1, elements2.title_2].forEach((title) => {
        setStyle(title, "fontSize", fontSize);
        setStyle(title, "lineHeight", fontSize);
        setAttribute(title, "y", `${getPx(y)}`);
        y += size * 1.1;
      });
      y += 50;
      setAttribute(elements2.userLabel, "y", `${getPx(y)}`);
      const correctW = core.isMobile ? w : w - 200;
      const userIdSize = (correctW < h ? correctW : h) / 14;
      y += userIdSize + 6;
      setStyle(elements2.userId, "fontSize", `${getPx(userIdSize)}`);
      setAttribute(elements2.userId, "y", `${getPx(y)}`);
      y += 24 + 24;
      [elements2.statusNow, elements2.statusAction].forEach((status) => {
        setAttribute(status, "y", `${getPx(y)}`);
        y += 24;
      });
    };
    const setLogoSize = (width, height) => {
      [elements2.logoDark, elements2.logoLight].forEach((elem) => {
        setStyle(elem, "width", width);
        setStyle(elem, "height", height);
      });
    };
    if (core.isMobile) {
      const fontSize = w / 7;
      setTitleSize(fontSize);
      setLogoSize("100%", "nope");
    } else {
      const fontSize = w < h ? w / 12 : h / 12;
      setTitleSize(fontSize);
      if (w < h) {
        setLogoSize("100%", "nope");
      } else {
        const scaledH = h * 0.6;
        const height = `${scaledH}px`;
        const ratio2 = 270.9 / 289.7;
        const width = `${scaledH * ratio2}px`;
        setLogoSize(width, height);
      }
    }
  };
  var initStatus = (versionRes) => {
    setStyle(elements2.statusAction, "display", "initial");
    inner(elements2.statusAction, "wczytywanie pyta\u0144");
    inner(elements2.version, `version: ${versionRes}`);
  };
  var showStatus = () => setStyle(elements2.statusNow, "display", "initial");
  var hideStatus = () => {
    setStyle(elements2.statusNow, "display", "none");
    setStyle(elements2.statusAction, "display", "none");
  };
  var questionsStatus = (num, all3) => inner(elements2.statusAction, `wczytywanie pyta\u0144 ${num}/${all3}`);
  var setStartImgStatus = () => inner(elements2.statusAction, `wczytywanie obraz\xF3w`);
  var imgStatus = (num, all3) => inner(elements2.statusAction, `wczytywanie obraz\xF3w ${num}/${all3}`);
  var active = () => {
  };
  var deactivate = () => {
  };
  var setUserId = (userId) => inner(elements2.userId, userId);

  // src/screens/statistics/statistics.ts
  var statistics_exports = {};
  __export(statistics_exports, {
    active: () => active4,
    deactivate: () => deactivate4,
    elements: () => elements3,
    firstUse: () => firstUse,
    init: () => init9,
    resize: () => resize4
  });

  // src/screens/statistics/data.ts
  var data2 = {
    // background: null,
    base: {
      used: {},
      bad: {},
      good: {}
    },
    steps: {
      used: [],
      bad: [],
      good: []
    },
    monitor: {
      size: 0,
      width: 0,
      pos: {
        x: 0,
        y: 0
      }
    },
    cell: {
      size: 0,
      space: 0,
      all: 0
    }
  };
  var determinants2 = {
    cell: {
      size: 20,
      space: 2
    }
  };

  // src/types.ts
  var rating = {
    bad: "bad",
    good: "good"
  };
  var ratingNames = Object.values(rating);

  // src/screens/statistics/helpers.ts
  var hexToRgb = (hex) => {
    const newHex = hex.trim().replace(/^#/, "");
    if (newHex.length !== 6) {
      throw new Error(`Nieprawid\u0142owy format koloru HEX: "${hex}"`);
    }
    const bigint = parseInt(newHex, 16);
    return {
      r: bigint >> 16 & 255,
      g: bigint >> 8 & 255,
      b: bigint & 255
    };
  };
  var mix = (from, to, ratio2) => {
    const rgb = {
      r: Math.round(from.r + (to.r - from.r) * ratio2),
      g: Math.round(from.g + (to.g - from.g) * ratio2),
      b: Math.round(from.b + (to.b - from.b) * ratio2)
    };
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  };
  var getColorSteps = (from, to, steps) => {
    const result = [];
    const ratio2 = 1 / (steps - 1);
    for (let i = 0; i < steps; ++i) {
      result.push(mix(hexToRgb(from), hexToRgb(to), ratio2 * i));
    }
    return result;
  };
  var getColor = (answer) => {
    if (answer.rating) {
      if (answer.rating.type === rating.bad) {
        return data2.steps.bad[answer.rating.scale];
      }
      if (answer.rating.type === rating.good) {
        return data2.steps.good[answer.rating.scale];
      }
    }
    return data2.steps.used[answer.used - 1];
  };
  var getOnThisSession = (answer) => data.session.some((item) => item.id === answer.id);

  // src/screens/learning/learning.ts
  var learning_exports = {};
  __export(learning_exports, {
    active: () => active2,
    deactivate: () => deactivate2,
    elements: () => elements4,
    init: () => init7,
    resize: () => resize2
  });

  // src/screens/statistics/legend.ts
  var listElements = {
    bad: null,
    good: null,
    used: null
  };
  var data3 = [
    { name: "poprawne", id: "good" },
    { name: "nieu\u017Cyte", id: "used" },
    { name: "b\u0142\u0119dne", id: "bad" }
  ];
  var prepareColorLines = () => {
    elements3.legend.replaceChildren();
    const children = [
      prepare("div", {
        classes: ["statistics-box-title"],
        inner: "legenda"
      })
    ];
    const setLegendColors = (name, id) => {
      children.push(prepare("div", {
        classes: ["statistics-colors-title"],
        inner: name
      }));
      const item = prepare("div", {
        id: `statistics-${id}-colors`,
        classes: ["statistics-section"]
      });
      listElements[id] = item;
      children.push(item);
    };
    data3.forEach((item) => setLegendColors(item.name, item.id));
    prepare(elements3.legend, {
      children
    });
  };
  var setColorLine = (key) => {
    const colors = data2.steps[key];
    const parent = listElements[key];
    setTimeout(() => {
      colors.forEach((color, index) => {
        const elem = prepare("div", {
          classes: ["statistics-color"]
        });
        setStyle(elem, "backgroundColor", color);
        prepare(parent, { children: [elem] });
        const p = prepare("p", {
          inner: `${index + 1}x`
        });
        prepare(elem, { children: [p] });
      });
    }, 500);
  };
  var setMonitorLegend = () => {
    prepareColorLines();
    Object.keys(data2.steps).forEach((key) => setColorLine(key));
  };

  // src/utils/radio.ts
  var getRadio = (radioData) => {
    const themeElements = radioData.elementList.map((tn) => byId(radioData.prefix + tn));
    const newRadioData = [];
    const shift = (num) => newRadioData.forEach((rd, i) => rd.checkbox.checked = i === num);
    radioData.nameList.forEach((name, i) => {
      const click2 = radioData.clickList && radioData.clickList[i] ? () => {
        const fn = radioData.clickList[i];
        fn();
        core.store.set(radioData.storeName, name);
        shift(i);
      } : () => {
        core.store.set(radioData.storeName, name);
        shift(i);
      };
      const elem = themeElements[i];
      newRadioData.push({
        item: elem,
        click: click2,
        checkbox: byQ(elem, "input"),
        name
      });
    });
    const getSaved = () => core.store.get(radioData.storeName);
    const mark2 = (name) => newRadioData.forEach((rd) => rd.checkbox.checked = rd.name === name);
    const active11 = () => newRadioData.forEach((rd) => add(rd.item, "click", rd.click));
    const deactivate11 = () => newRadioData.forEach((rd) => remove(rd.item, "click", rd.click));
    const init24 = () => {
      active11();
      const saved = getSaved();
      if (radioData.init) radioData.init(saved);
      mark2(saved);
      return saved;
    };
    return {
      init: init24,
      active: active11,
      deactivate: deactivate11
    };
  };

  // src/screens/settings/theme/theme.ts
  var theme = {
    dark: "dark",
    light: "light"
  };
  var themeMode = {
    ...theme,
    system: "system"
  };
  var themeNames = Object.values(themeMode);
  var memo = {
    theme: null
  };
  var get = () => memo.theme;
  var apply = (theme2) => {
    root.setAttribute("data-theme", theme2);
    setAttribute(root, "data-theme", theme2);
    removeClass(root, themeMode.dark);
    removeClass(root, themeMode.light);
    addClass(root, theme2);
    setStyle(root, "colorScheme", theme2);
  };
  var setSystemTheme = () => {
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const newTheme = systemPrefersDark ? theme.dark : theme.light;
    apply(newTheme);
    memo.theme = newTheme;
  };
  var set = (saved) => {
    if (saved === theme.dark || saved === theme.light) {
      apply(saved);
      memo.theme = saved;
      return saved;
    }
    if (saved === themeMode.system) {
      setSystemTheme();
      return saved;
    }
    core.store.set(storageNames.theme, themeMode.system);
    setSystemTheme();
    return themeMode.system;
  };
  var themeData = {
    prefix: "setting-theme-",
    storeName: storageNames.theme,
    elementList: themeNames,
    nameList: themeNames,
    clickList: themeNames.map((name) => () => {
      set(name);
      setTimeout(() => {
        themeChange();
        setMonitorLegend();
      }, 100);
    }),
    init: set
  };
  var ratio;
  var init5 = async () => {
    ratio = getRadio(themeData);
    ratio.init();
  };

  // src/screens/learning/evaluation.ts
  var mark = (num) => () => {
    if (data4.confirm) {
      return;
    }
    if (num === -1) {
      disable(elements4.confirm);
    } else {
      enable(elements4.confirm);
    }
    data4.mark = num;
    elements4.checkbox.forEach((a, i) => a.checked = i === num);
    elements4.answersFields.forEach((a, i) => i === num ? setStyle(a, "border", "2px solid var(--mine_color)") : setStyle(a, "border", "2px solid transparent"));
  };
  var setResult = (result, history) => {
    history.forEach((h) => {
      if (h.result) {
        result.good++;
      } else {
        result.bad++;
      }
    });
    return result;
  };
  var getRateHistory = (history) => {
    const getResult = () => ({ good: 0, bad: 0 });
    const sortedHistory = history.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
    const lastThree = sortedHistory.slice(-determinants.numLastRequiredQuestions);
    const resultOne = setResult(getResult(), lastThree);
    if (resultOne.bad > 0) {
      return {
        type: rating.bad,
        scale: resultOne.bad - 1
      };
    } else {
      const lastSix = sortedHistory.slice(-determinants.numLastHighlyRatedQuestions);
      const resultTwo = setResult(getResult(), lastSix);
      return {
        type: rating.good,
        scale: resultTwo.good - 1
      };
    }
  };
  var sumAndMemo = async () => {
    const answer = data4.answers.shuffled[data4.mark];
    const timestamp = Date.now();
    data4.answers.origin?.answer.history.push({
      timestamp,
      result: answer.correct
    });
    const rate = getRateHistory(data4.answers.origin?.answer.history);
    data4.answers.origin.answer.rating = rate;
    const { drawn, index, ...answerDb } = data4.answers.origin.answer;
    core.idb.answers.update(index, (old) => old = answerDb);
    const log = {
      action: data4.answers.origin.answer.id,
      result: answer.correct
    };
    core.idb.logs.set(timestamp, log);
  };
  var setGreen = (field) => {
    setStyle(field, "backgroundColor", "var(--on_prime_color)");
    const theme2 = get();
    if (theme2 === theme.dark) {
      setStyle(field, "color", "var(--last_color)");
    }
  };
  var showResult = async () => {
    data4.confirm = true;
    inner(elements4.confirm, "Nast\u0119pne");
    disable(elements4.confirm);
    setTimeout(() => {
      enable(elements4.confirm);
    }, 600);
    const markedAnswer = data4.answers.shuffled[data4.mark];
    if (markedAnswer.correct) {
      setGreen(elements4.answersFields[data4.mark]);
    } else {
      elements4.answersFields.forEach((field, index) => {
        if (index === data4.mark) {
          setStyle(field, "backgroundColor", "var(--off_prime_color)");
        }
        const correct = data4.answers.shuffled[index].correct;
        if (correct) {
          setGreen(field);
        }
      });
    }
    await sumAndMemo();
  };
  var clearResults = () => {
    data4.confirm = false;
    inner(elements4.confirm, "Zatwierd\u017A");
    setQuestion();
    elements4.answersFields.forEach((field, index) => {
      if (index % 2 === 0) {
        setStyle(field, "backgroundColor", "var(--penultimate_color)");
      } else {
        setStyle(field, "backgroundColor", "var(--third_from_end_color)");
      }
    });
  };
  var confirmClick = async () => {
    if (data4.confirm) {
      clearResults();
    } else {
      await showResult();
    }
  };

  // src/engine/analize.ts
  var countLastFewFalse = (answer) => {
    if (answer) {
      const sortedHistory = [...answer.history].sort((a, b) => b.timestamp - a.timestamp);
      const lastFew = sortedHistory.slice(0, determinants.numLastRequiredQuestions);
      return {
        falsies: lastFew.filter((entry) => !entry.result).length,
        trues: lastFew.filter((entry) => entry.result).length
      };
    }
    return {
      falsies: 0,
      trues: 0
    };
  };
  var prepareData = (reverseLastUse, answers) => {
    const now = getDateAtNoonInXDays(1);
    let maxLastUse = now;
    let maxNextUse = now;
    let maxImportance = 1;
    let maxUsed = 0;
    const preData = answers.map((answer, index) => {
      let lastUsed = 0;
      let nextUse = 0;
      let rating2 = 0;
      if (answer !== null) {
        let theLastOne = 0;
        lastUsed = now - theLastOne;
        nextUse = nextUse - now;
        if (maxNextUse < nextUse) maxNextUse = nextUse;
        let lastAnswers = countLastFewFalse(answer);
        let rating3 = 0;
        if (lastAnswers.trues >= determinants.numLastRequiredQuestions) {
          rating3 = -10;
        } else {
          rating3 = lastAnswers.falsies / determinants.numLastRequiredQuestions;
        }
      }
      if (lastUsed < maxLastUse) maxLastUse = lastUsed;
      const appearance = answer.used;
      if (maxImportance < appearance) maxImportance = appearance;
      if (answer && maxUsed < answer.history.length) maxUsed = answer.history.length;
      return {
        id: answer.id,
        index,
        // index
        used: answer ? answer.history.length : 0,
        lastUsed,
        nextUse,
        appearance,
        rating: rating2
      };
    });
    const data7 = preData.map((p) => {
      let lastUsed = p.lastUsed === 0 ? 1 : p.lastUsed / maxLastUse;
      if (reverseLastUse) lastUsed = 1 - lastUsed;
      const used = maxUsed === 0 ? 1 : 1 - p.used / maxUsed;
      return {
        id: p.id,
        index: p.index,
        used,
        // 1 czym zadziej uzyto
        lastUsed,
        nextUse: p.nextUse / maxNextUse,
        // 1 czym bliżej w czasie
        appearance: p.appearance / maxImportance,
        // 1 czym więcej użyte
        rating: p.rating
        // 1 czym więcej pomyłek
      };
    });
    return data7;
  };
  var scoringData = (data7, weights) => {
    const scoredData = data7.map((d) => {
      const score = weights.lastUsed * d.lastUsed + weights.nextUse * d.nextUse + weights.appearance * d.appearance + weights.rating * d.rating + weights.littleUsed * d.used;
      return { ...d, score };
    });
    return scoredData.sort((a, b) => b.score - a.score);
  };
  var getTensors = async (normalizedWeights, answers) => {
    const data7 = prepareData(false, answers);
    const result = scoringData(data7, normalizedWeights);
    return result;
  };

  // src/engine/select.ts
  var selectByTemperature = (array, temperature, num) => {
    if (temperature < 0) {
      throw new Error("Temperature musi by\u0107 w zakresie od 0 do 1.");
    }
    if (temperature > 1) temperature = 1;
    if (num > array.length) {
      throw new Error("Nie mo\u017Cna wybra\u0107 wi\u0119cej element\xF3w ni\u017C zawiera tablica.");
    }
    const baseSharpness = 50;
    const k = baseSharpness * (1 - temperature);
    const weights = array.map((_, i) => 1 / Math.log(k * i + 2));
    const result = [];
    const usedIndices = /* @__PURE__ */ new Set();
    const TestWeights = [];
    while (result.length < num) {
      const totalWeight = weights.reduce((sum, w, i) => usedIndices.has(i) ? sum : sum + w, 0);
      let rand = Math.random() * totalWeight * temperature;
      for (let i = 0; i < array.length; i++) {
        if (usedIndices.has(i)) continue;
        rand -= weights[i];
        if (rand <= 0) {
          result.push(array[i]);
          usedIndices.add(i);
          TestWeights.push(rand);
          break;
        }
      }
    }
    return result;
  };

  // src/utils/shuffle.ts
  var shuffle = (arr) => {
    const shuffleOnce = (a) => {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = a[i];
        a[i] = a[j];
        a[j] = temp;
      }
    };
    for (let k = 0; k < 3; k++) {
      shuffleOnce(arr);
    }
    return arr;
  };

  // src/engine/run.ts
  var getGoodBadSplit = (answers, numOfQuestions) => {
    const goodAnswers = [];
    const badAnswers = [];
    const manyToAnswer = Math.round(determinants.whenManyToAnswerPercent / 100 * numOfQuestions);
    answers.forEach((a) => {
      const isGood = a.rating?.type === rating.good && a.rating?.scale + 1 >= determinants.numLastRequiredQuestions;
      if (isGood) {
        goodAnswers.push(a);
      } else {
        badAnswers.push(a);
      }
    });
    const result = {
      numGood: 0,
      numBad: 0,
      goodAnswers,
      badAnswers
    };
    if (badAnswers.length < numOfQuestions - manyToAnswer) {
      result.numGood = numOfQuestions - badAnswers.length;
      result.numBad = badAnswers.length;
    } else {
      const good = manyToAnswer > goodAnswers.length ? goodAnswers.length : manyToAnswer;
      result.numGood = good;
      result.numBad = numOfQuestions - good;
    }
    return result;
  };
  var getSpecificTensors = async (answers, goodWeights, badWeights, numOfQuestions) => {
    const splitted = getGoodBadSplit(answers, numOfQuestions);
    const good = await getTensors(goodWeights, splitted.goodAnswers);
    const goodTensors = selectByTemperature(
      good,
      goodWeights.temperature,
      splitted.numGood
    );
    const bad = await getTensors(badWeights, splitted.badAnswers);
    const badTensors = selectByTemperature(
      bad,
      badWeights.temperature,
      splitted.numBad
    );
    return [...goodTensors, ...badTensors];
  };
  var getTensors2 = async () => {
    await updateAnswers();
    const selectedRepeatableTensors = await getSpecificTensors(data.repeatableAnswers, data.normalizedWeights.repeatableGood, data.normalizedWeights.repeatable, data.numOfQuestions.repeatable);
    const selectedSingleTensors = await getSpecificTensors(data.singleAnswers, data.normalizedWeights.singleGood, data.normalizedWeights.single, data.numOfQuestions.single);
    const result = shuffle([...selectedRepeatableTensors, ...selectedSingleTensors]);
    return result;
  };
  var startSession = async () => {
    data.session = await getTensors2();
    data.index = 0;
  };
  var endSession = async () => {
    data.session = [];
    data.index = -1;
  };
  var getNextQuestion = async () => {
    if (data.index === -1) {
      await startSession();
    }
    const result = data.session[data.index];
    data.index++;
    if (data.index >= data.session.length) {
      await startSession();
    }
    return result;
  };
  var init6 = async () => {
  };
  var getItem = async () => {
    const tensor = await getNextQuestion();
    const answer = data.answers.find((a) => a.id === tensor.id);
    const questions = await core.idb.questions.getAllData();
    const questionDb = questions.find((q) => q[1].id === answer?.id);
    const question = questionDb[1];
    const result = {
      question,
      answer,
      index: tensor.index
    };
    return result;
  };

  // src/queries/url.ts
  var url = (function() {
    const main = `api/`;
    return {
      test: {
        csrf: `${main}csrf`,
        ddos: `${main}ddos`,
        ddosId: `${main}ddos-id`,
        noMahakala: `${main}no-mahakala`,
        wrongMahakala: `${main}wrong-mahakala`
      },
      secure: {
        get: `${main}secure`,
        test: `${main}secure-test`
      },
      user: {
        set: `${main}set-user`,
        check: `${main}check-user`,
        getQr: `${main}get-user-qr-code`,
        setQr: `${main}set-user-by-qr-code`
      },
      data: {
        version: `${main}get-version`,
        config: `${main}get-config`,
        questions: `${main}get-questions`,
        images: `${main}get-images`
      },
      statistics: {
        memoAnswers: `${main}memo-answers`,
        getAnswers: `${main}get-answers`,
        getLastLogTimestamp: `${main}get-last-log-timestamp`,
        memoLogs: `${main}memo-logs`
      }
    };
  })();

  // src/queries/responseCommand.ts
  var responseCommand = {
    main: {
      ddos: "DDoS",
      ddosId: "DDoSid",
      csrf: "csrf"
    },
    secure: {
      noMahakala: "noMahakala",
      wrongMahakala: "wrongMahakala",
      generateUserId: "generateUserId",
      go: "go",
      testOk: "testOk"
    },
    user: {
      set: "userSet",
      ok: "userOk",
      no: "noUser",
      noId: "noId",
      qr: "qr"
    },
    statistics: {
      answersMemoried: "answersMemoried",
      noAnswers: "noAnswers",
      logsMemoried: "logsMemoried",
      lastLogTimestamp: "lastLogTimestamp",
      noLogs: "noLogs"
    },
    error: {
      none: "none"
    }
  };

  // src/queries/api.ts
  var okCodes = [304, 401, 403, 429];
  var api = axios_default.create(
    // @ts-ignore
    {
      baseURL: "https://frog02-32047.wykr.es/",
      validateStatus: function(status) {
        return status >= 200 && status < 300 || okCodes.some((c) => c === status);
      }
    }
  );
  var nothing = {
    message: "nieudane",
    command: responseCommand.error.none
  };

  // src/queries/statistics/memoAnswers.ts
  var memoAnswers = async () => {
    const answersDb = await core.idb.answers.getAllData();
    const answers = [];
    answersDb.forEach((answer) => {
      const history = answer[1].history;
      if (history.length > 0) {
        answers.push({
          id: answer[1].id,
          history
          // history: lastSix,
        });
      }
    });
    if (answers.length > 0) {
      const result = await api.post(
        url.statistics.memoAnswers,
        { answers },
        { withCredentials: true }
      );
      return result.data;
    }
    return nothing;
  };

  // src/queries/statistics/getLastLogTimestamp.ts
  var getLastLogTimestamp = async () => {
    const result = await api.get(
      url.statistics.getLastLogTimestamp,
      { withCredentials: true }
    );
    return result.data;
  };

  // src/queries/statistics/memoLogs.ts
  var memoLogs = async () => {
    const convertLog = (log) => ({
      action: log[1].action,
      result: log[1].result,
      timestamp: log[0]
    });
    const sentAndGetData = async (logs) => {
      const result = await api.post(
        url.statistics.memoLogs,
        { logs },
        { withCredentials: true }
      );
      return result.data;
    };
    const logsDb = await core.idb.logs.getAllData();
    const timestampLog = await getLastLogTimestamp();
    if (timestampLog.command === responseCommand.statistics.noLogs) {
      const logs = logsDb.map((log) => convertLog(log));
      await sentAndGetData(logs);
    } else {
      const logs = logsDb.filter((log) => log[0] > Number(timestampLog.timestamp)).map((log) => convertLog(log));
      if (logs.length > 0) {
        await sentAndGetData(logs);
      }
    }
    return nothing;
  };

  // src/screens/learning/startEnd.ts
  var start = async () => {
    await core.store.set(storageNames.sessionStarted, checked.yes);
    setStyle(elements4.sheet, "opacity", `0`);
    const vv = window.visualViewport;
    resize2(vv.width, vv.height);
    inner(elements4.startEndBtn, "Zako\u0144cz");
    setStyle(elements4.startEndBtn, "backgroundColor", "var(--mine_4_color)");
    remove(elements4.startEndBtn, "click", start);
    add(elements4.startEndBtn, "click", end);
    await init6();
    setTimeout(() => {
      display(elements4.sheet, "block");
      setQuestion();
    }, 500);
  };
  var end = async () => {
    await core.store.set(storageNames.sessionStarted, checked.no);
    display(elements4.sheet, "none");
    const vv = window.visualViewport;
    resize2(vv.width, vv.height);
    inner(elements4.startEndBtn, "Rozpocznij");
    setStyle(elements4.startEndBtn, "backgroundColor", "var(--mine_color)");
    remove(elements4.startEndBtn, "click", end);
    add(elements4.startEndBtn, "click", start);
    memoAnswers();
    memoLogs();
    endSession();
    data4.answers.origin = null;
  };

  // src/utils/drawImage.ts
  var drawImage = () => /* @__PURE__ */ (() => {
    const data7 = {
      canvas: null,
      ctx: null,
      fitCanvas: null,
      fitCtx: null,
      fitWidth: 0
    };
    const init24 = (canvas, fitCanvas) => {
      data7.canvas = canvas;
      data7.ctx = canvas.getContext("2d");
      data7.fitCanvas = fitCanvas;
      data7.fitCtx = fitCanvas.getContext("2d");
    };
    const setWidth = (width) => data7.fitWidth = width;
    const fitToWidth = (img) => {
      if (!data7.fitCanvas || !data7.fitCtx) return;
      const scale = data7.fitWidth / img.width;
      const displayWidth = img.width * scale;
      const displayHeight = img.height * scale;
      const dpr = window.devicePixelRatio || 1;
      data7.fitCanvas.style.width = displayWidth + "px";
      data7.fitCanvas.style.height = displayHeight + "px";
      data7.fitCanvas.width = displayWidth * dpr;
      data7.fitCanvas.height = displayHeight * dpr;
      data7.fitCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      data7.fitCtx.clearRect(
        0,
        0,
        displayWidth,
        displayHeight
      );
      data7.fitCtx.drawImage(
        img,
        0,
        0,
        displayWidth,
        displayHeight
      );
    };
    const draw = /* @__PURE__ */ (() => {
      let currentUrl = null;
      return async (source) => {
        if (!data7.ctx || !data7.canvas) return;
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl);
          currentUrl = null;
        }
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
          if (typeof source === "string") {
            img.src = source;
          } else {
            currentUrl = URL.createObjectURL(source);
            img.src = currentUrl;
          }
        });
        data7.canvas.width = img.width;
        data7.canvas.height = img.height;
        data7.ctx.clearRect(0, 0, img.width, img.height);
        data7.ctx.drawImage(img, 0, 0);
        fitToWidth(img);
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl);
          currentUrl = null;
        }
      };
    })();
    return {
      init: init24,
      setWidth,
      draw
    };
  })();

  // src/screens/learning/learning.ts
  var elements4 = {};
  var init7 = () => {
    elements4.startEnd = byId("learning-start-end");
    elements4.startEndBtn = byId("learning-start-end-btn");
    elements4.sheet = byId("learning-sheet");
    elements4.measure = byId("learning-measure");
    elements4.imgBig = byId("learning-img-big");
    elements4.info = byId("learning-question-info");
    elements4.separator = byId("learning-sheet-separator");
    elements4.question = byId("question");
    elements4.img = byId("learning-img");
    elements4.answers = byQueryAll(".answer p");
    elements4.answersFields = byQueryAll(".answer");
    elements4.checkbox = byQueryAll(".answer input");
    elements4.checkbox.forEach((c) => c.checked = false);
    elements4.confirm = byId("learning-confirm-btn");
    elements4.bottom = byId("learning-bottom-separator");
    elements4.drawImage = drawImage();
    const canvas = byId("learning-img-big-canvas");
    const fitCanvas = byId("learning-img-canvas");
    elements4.drawImage.init(canvas, fitCanvas);
    areNotNull(elements4, ["screens", "learning"]);
    display(elements4.sheet, "none");
  };
  var LOW_START_END_BTN = 12 + 28 + 12;
  var resize2 = (w, h) => {
    const menuH = core.isMobile ? 121 / 701 * w : 0;
    data4.tabH = h - 30 - menuH - 20;
    const tabW = w - (core.isMobile ? 0 : 200);
    setStyle(elements4.imgBig, "height", getPx(h));
    setStyle(elements4.imgBig, "width", getPx(tabW));
    setStyle(elements4.imgBig, "left", getPx(core.isMobile ? 0 : 200));
    setStyle(elements4.bottom, "height", getPx(menuH));
    elements4.drawImage.setWidth(tabW - 80);
    const started = core.store.get(storageNames.sessionStarted);
    if (started === checked.yes) {
      setStyle(elements4.startEnd, "height", getPx(LOW_START_END_BTN));
      setStyle(elements4.startEndBtn, "padding", "12px 0");
      setSheetHight();
    } else {
      setStyle(elements4.sheet, "height", `calc(${getPx(h - LOW_START_END_BTN - menuH)})`);
      setStyle(elements4.startEnd, "height", getPx(h - 30 - menuH - 20));
      setStyle(elements4.startEndBtn, "padding", "24px 0");
    }
  };
  var showBigImg = () => display(elements4.imgBig, "flex");
  var hideBigImg = () => display(elements4.imgBig, "none");
  var active2 = () => {
    elements4.answersFields.forEach((a, i) => add(a, "click", mark(i)));
    const started = core.store.get(storageNames.sessionStarted);
    add(elements4.startEndBtn, "click", started === checked.yes ? end : start);
    add(elements4.confirm, "click", confirmClick);
    add(elements4.img, "click", showBigImg);
    add(elements4.imgBig, "click", hideBigImg);
  };
  var deactivate2 = () => {
    elements4.answersFields.forEach((a, i) => remove(a, "click", mark(i)));
    remove(elements4.startEndBtn, "click", start);
    remove(elements4.startEndBtn, "click", end);
    remove(elements4.confirm, "click", confirmClick);
    remove(elements4.img, "click", showBigImg);
    remove(elements4.imgBig, "click", hideBigImg);
  };

  // src/utils/idToDate.ts
  var getMonth = (key) => {
    const idToMonth = {
      paz: "pazdziernik",
      cze: "czerwiec",
      sty: "stycze\u0144",
      lut: "stycze\u0144",
      wrz: "wrzesie\u0144"
    };
    return idToMonth[key];
  };
  var idToDate = (id) => {
    const splittedId = id.split("-");
    const year = splittedId[0];
    const month = getMonth(splittedId[1]);
    return `${month} ${year}`;
  };
  var get2 = (ids2) => {
    let result = "";
    ids2.forEach((id, i, arr) => result += idToDate(id) + (i === arr.length - 1 ? "" : ", "));
    return result;
  };

  // src/screens/learning/preparation.ts
  var data4 = {
    mark: 0,
    confirm: false,
    tabH: 0,
    answers: {
      // origin: null,
      // shuffled: [],
    }
  };
  var setSheetHight = () => {
    setStyle(elements4.separator, "height", ``);
    setStyle(elements4.sheet, "height", ``);
    setStyle(elements4.sheet, "opacity", `0`);
    setTimeout(() => {
      const vv = window.visualViewport;
      const menuH = core.isMobile ? 121 / 701 * vv.width : 0;
      const sheetH = boundRect(elements4.measure).height - menuH;
      const condition = sheetH < data4.tabH - menuH - 60;
      setStyle(elements4.bottom, "height", getPx(menuH + (condition ? 0 : 80)));
      const separatorH = condition ? getPx(data4.tabH - sheetH - 80) : "";
      setStyle(elements4.separator, "height", separatorH);
      setStyle(elements4.sheet, "opacity", `1`);
    }, 300);
  };
  var setQuestion = async () => {
    const item = await getItem();
    if (item.question.img) {
      const imgData = await core.idb.images.get(item.question.img);
      if (imgData === null) {
        setQuestion();
        return;
      }
    }
    data4.answers.origin = item;
    mark(-1)();
    setStyle(elements4.sheet, "opacity", `0`);
    setTimeout(() => {
      const usedList = [item.question.id];
      item.question.used.forEach((u) => usedList.push(u));
      setTimeout(() => {
        inner(elements4.info, `nazwa: <b>${item.question.id}</b><br><br>wyst\u0105pi\u0142o <b>${usedList.length}x</b> w: ${get2(usedList)}.`);
      }, 100);
    }, 100);
    if (item.question.img) {
      display(elements4.img, "block");
      const imgData = await core.idb.images.get(item.question.img);
      elements4.drawImage.draw(imgData.data);
    } else {
      display(elements4.img, "none");
    }
    inner(elements4.question, item.question.question);
    const answers = [{
      content: item.question.answer,
      correct: true,
      number: -1
    }];
    item.question.falseAnswers.forEach((falseAnswer, index) => {
      answers.push({
        content: falseAnswer,
        correct: false,
        number: index
      });
    });
    data4.answers.shuffled = shuffle(answers);
    elements4.answers.forEach((a, i) => {
      inner(a, data4.answers.shuffled[i].content);
    });
    elements4.answersFields.forEach((a) => {
      setStyle(a, "color", "var(--prime_color)");
    });
    setSheetHight();
  };

  // src/utils/waitFor.ts
  var waitFor = (condition, fn) => {
    const check2 = () => {
      setTimeout(() => {
        if (condition()) {
          fn();
          return;
        }
        check2();
      }, 100);
    };
    return check2;
  };

  // src/screens/statistics/draw.ts
  var getMetrics = () => {
    const halfSpace = data2.cell.space / 2;
    const offset = data2.cell.space + halfSpace;
    const smallRect = data2.cell.size - offset * 2;
    return {
      twoPi: Math.PI * 2,
      halfSpace,
      offset,
      smallRect,
      center: data2.cell.size / 2,
      quarter: data2.cell.size / 4
    };
  };
  var themeChange = () => {
    data2.background = getColorFromStyle("--last_color");
    data2.base.used.min = getColorFromStyle("--mine_6_color");
    data2.base.used.max = getColorFromStyle("--mine_color");
    data2.steps.used = getColorSteps(data2.base.used.min, data2.base.used.max, data.quantities.length);
    data2.base.bad.min = getColorFromStyle("--off_second_color");
    data2.base.bad.max = getColorFromStyle("--off_prime_color");
    data2.steps.bad = getColorSteps(data2.base.bad.min, data2.base.bad.max, determinants.numLastRequiredQuestions);
    data2.base.good.min = getColorFromStyle("--on_second_color");
    data2.base.good.max = getColorFromStyle("--on_prime_color");
    data2.steps.good = getColorSteps(data2.base.good.min, data2.base.good.max, determinants.numLastHighlyRatedQuestions);
  };
  var cells = async () => {
    elements3.ctx.clearRect(0, 0, elements3.monitor.width, elements3.monitor.height);
    const { twoPi, offset, smallRect, center, quarter } = getMetrics();
    const answers = data.answers;
    if (answers === null) return;
    answers.forEach((answer, index) => {
      const pozX = index % data2.monitor.size * (data2.cell.size + data2.cell.space);
      const pozY = Math.floor(index / data2.monitor.size) * (data2.cell.size + data2.cell.space);
      elements3.ctx.fillStyle = getColor(answer);
      elements3.ctx.fillRect(pozX, pozY, data2.cell.size, data2.cell.size);
      const onThisSession = getOnThisSession(answer);
      if (onThisSession) {
        elements3.ctx.strokeStyle = data2.background;
        elements3.ctx.lineWidth = data2.cell.space;
        const sesX = pozX + offset;
        const sesY = pozY + offset;
        const sesSize = smallRect;
        elements3.ctx.strokeRect(sesX, sesY, sesSize, sesSize);
      }
      if (data4.answers.origin?.answer) {
        const condition = data4.answers.origin.answer.id === answer.id;
        if (condition) {
          elements3.ctx.fillStyle = data2.background;
          const nowX = pozX + center;
          const nowY = pozY + center;
          elements3.ctx.beginPath();
          elements3.ctx.arc(nowX, nowY, quarter, 0, twoPi);
          elements3.ctx.fill();
        }
      }
      {
        if (false) {
          if (answer.history.length > 0) {
            elements3.ctx.fillStyle = data2.background;
            elements3.ctx.lineWidth = data2.cell.space;
            const endX = pozX + data2.cell.size - data2.cell.space * 3;
            const endY = pozY + data2.cell.size - data2.cell.space * 3;
            elements3.ctx.beginPath();
            elements3.ctx.moveTo(pozX + data2.cell.space * 3, pozY + data2.cell.space * 3);
            elements3.ctx.lineTo(endX, endY);
            elements3.ctx.stroke();
          }
        }
      }
    });
  };
  var init8 = () => {
    waitFor(() => data.sume !== 0, () => {
      themeChange();
      const vv = window.visualViewport;
      resize3(vv.width, vv.height);
    })();
  };
  var resize3 = (w, h) => {
    const bit = data2.monitor.width / (determinants2.cell.size * data2.monitor.size + determinants2.cell.space * (data2.monitor.size - 1));
    data2.cell.size = determinants2.cell.size * bit;
    data2.cell.space = determinants2.cell.space * bit;
    data2.cell.all = data2.cell.size + data2.cell.space;
    elements3.monitor.width = data2.monitor.width;
    elements3.monitor.height = data2.monitor.width;
    const monitorPos = boundRect(elements3.monitor);
    data2.monitor.pos.x = monitorPos.x;
    data2.monitor.pos.y = monitorPos.y;
    cells();
  };

  // src/screens/statistics/table.ts
  var colNames = ["good", "bad", "unused"];
  var rowNames = ["all", "allPercent", "moreOne", "moreOnePercent", "one", "onePercent"];
  var createTableData = () => {
    const data7 = {};
    for (const row of rowNames) {
      const rowObj = {};
      for (const col of colNames) {
        rowObj[col] = 0;
      }
      data7[row] = rowObj;
    }
    return data7;
  };
  var setValues = (row, answer) => {
    if (answer.rating?.type === rating.bad) {
      row.bad++;
    } else if (answer.rating?.type === rating.good) {
      row.good += (answer.rating.scale + 1) / determinants.numLastRequiredQuestions;
    } else {
      row.unused++;
    }
  };
  var countPercent = (numRow, percRow, sum) => {
    Object.keys(numRow).forEach((key) => {
      const num = numRow[key];
      percRow[key] = Math.round(sum === 0 ? 0 : num / sum * 1e3) / 10;
    });
  };
  var getElement = (row, col) => byQ(elements3.table, `tr[data-row="${row}"] td[data-col="${col}"]`);
  var showTableData = (data7) => {
    const percentNames = ["allPercent", "moreOnePercent", "onePercent"];
    for (const row of rowNames) {
      for (const col of colNames) {
        const value = data7[row][col];
        const suffix = percentNames.some((pn) => pn === row) ? "%" : "";
        const elem = getElement(row, col);
        inner(elem, value.toFixed(1) + suffix);
      }
    }
  };
  var setData = () => {
    if (data.answers === null) return;
    const tableData = createTableData();
    const sumeMoreOne = data.sume - data.quantities[0];
    data.answers.forEach((answer) => {
      if (answer.used > 1) {
        setValues(tableData.moreOne, answer);
      } else {
        setValues(tableData.one, answer);
      }
      setValues(tableData.all, answer);
    });
    countPercent(tableData.all, tableData.allPercent, data.sume);
    countPercent(tableData.moreOne, tableData.moreOnePercent, sumeMoreOne);
    countPercent(tableData.one, tableData.onePercent, data.quantities[0]);
    showTableData(tableData);
  };

  // src/screens/statistics/mouse.ts
  var lastCell = null;
  var mousemove = ((event) => {
    const pozX = event.clientX;
    const pozY = event.clientY;
    const monitorPos = boundRect(elements3.monitor);
    const pxX = pozX - monitorPos.x;
    const pxY = pozY - monitorPos.y;
    const x = Math.floor(pxX / data2.cell.all);
    const y = Math.floor(pxY / data2.cell.all);
    const cellNum = x + y * data2.monitor.size;
    const cell = cellNum >= data.sume ? null : cellNum;
    const condition = data2.monitor.width - 250 < pxX;
    setStyle(elements3.tooltip, "left", `${pozX - (core.isMobile ? 0 : 200) + (condition ? -8 - boundRect(elements3.tooltip).width : 16)}px`);
    setStyle(elements3.tooltip, "top", `${pozY + 16}px`);
    if (cell === null) {
      display(elements3.tooltip, "none");
      lastCell = -1;
      return;
    }
    if (cell !== lastCell) {
      lastCell = cell;
      const answer = data.answers[cell];
      if (!answer) {
        return;
      }
      const question = data.questions.find((q) => q.id === answer.id);
      const usedList = [question.id, ...question.used];
      display(elements3.tooltip, "block");
      inner(elements3.tooltip, `${get2(usedList)}`);
    }
  });
  var mouseleave = () => {
    display(elements3.tooltip, "none");
  };
  var active3 = () => {
    if (!core.isMobile) {
      add(elements3.monitor, "mousemove", mousemove);
      add(elements3.monitor, "mouseleave", mouseleave);
    }
  };
  var deactivate3 = () => {
    if (!core.isMobile) {
      remove(elements3.monitor, "mousemove", mousemove);
      remove(elements3.monitor, "mouseleave", mouseleave);
    }
  };

  // src/screens/statistics/statistics.ts
  var elements3 = {};
  var init9 = async () => {
    elements3.sheet = byId("statistics-sheet");
    elements3.monitor = byId("statistics-monitor");
    elements3.ctx = elements3.monitor.getContext("2d");
    elements3.table = byId("statistics-table");
    elements3.legend = byId("statistics-colors-legend");
    elements3.bottom = byId("statistics-bottom");
    elements3.tooltip = byId("tooltip");
    areNotNull(elements3, ["screens", "drawing"]);
    await updateAnswers();
    init8();
    waitFor(() => data.answers.length !== 0 && data2.steps.used.length !== 0 && elements3.legend !== null, setMonitorLegend)();
  };
  var resize4 = (w, h) => {
    data2.monitor.width = Math.min(w - 60 - (core.isMobile ? 0 : 220), 660);
    const menuH = core.isMobile ? 121 / 701 * w : 0;
    setStyle(elements3.sheet, "height", `calc(${getPx(h)})`);
    setStyle(elements3.bottom, "height", getPx(menuH));
    resize3(w, h);
  };
  var active4 = () => {
    waitFor(() => data2.monitor.size !== 0, cells)();
    waitFor(() => data2.monitor.size !== 0, setData)();
    active3();
  };
  var deactivate4 = () => {
    deactivate3();
  };
  var firstUse = () => {
    init9();
    const vv = visualViewport;
    resize4(vv.width, vv.height);
    cells();
  };

  // src/screens/answers/answers.ts
  var answers_exports = {};
  __export(answers_exports, {
    active: () => active6,
    deactivate: () => deactivate6,
    init: () => init11
  });

  // src/screens/answers/filter/filter.ts
  var elements5 = {};
  var state = {
    answersFilterContentHeight: null,
    open: false
  };
  var init10 = () => {
    elements5.answersFilter = byId("answers-filter-title");
    elements5.answersFilterMore = byId("answer-filter-more");
    elements5.answersFilterLess = byId("answer-filter-less");
    elements5.answersFilterContent = byId("answer-filter-content");
    areNotNull(elements5, ["settings", "info"]);
    setTimeout(() => {
      const contentBox = elements5.answersFilterContent.getBoundingClientRect();
      state.answersFilterContentHeight = contentBox.height;
      setStyle(elements5.answersFilterLess, "display", "none");
      setStyle(elements5.answersFilterContent, "height", "0px");
    }, 100);
  };
  var showInfo = () => {
    if (state.open) {
      setStyle(elements5.answersFilterLess, "display", "none");
      setStyle(elements5.answersFilterMore, "display", "initial");
      setStyle(elements5.answersFilterContent, "height", "0px");
    } else {
      setStyle(elements5.answersFilterLess, "display", "initial");
      setStyle(elements5.answersFilterMore, "display", "none");
      setStyle(elements5.answersFilterContent, "height", `${state.answersFilterContentHeight}px`);
    }
    state.open = !state.open;
  };
  var active5 = () => {
    add(elements5.answersFilter, "click", showInfo);
  };
  var deactivate5 = () => {
    remove(elements5.answersFilter, "click", showInfo);
  };

  // src/screens/answers/answers.ts
  var init11 = () => {
    init10();
  };
  var active6 = () => {
    active5();
  };
  var deactivate6 = () => {
    deactivate5();
  };

  // src/screens/settings/settings.ts
  var settings_exports = {};
  __export(settings_exports, {
    active: () => active10,
    deactivate: () => deactivate10,
    init: () => init22,
    resize: () => resize6
  });

  // src/screens/settings/info/info.ts
  var elements6 = {};
  var state2 = {
    settingsAppInfoContentHeight: null,
    open: false
  };
  var init12 = () => {
    elements6.settingsAppInfo = byId("settings-app-info-title");
    elements6.settingsAppInfoMore = byId("settings-app-info-more");
    elements6.settingsAppInfoLess = byId("settings-app-info-less");
    elements6.settingsAppInfoContent = byId("settings-app-info-content");
    areNotNull(elements6, ["settings", "info"]);
    setTimeout(() => {
      const contentBox = elements6.settingsAppInfoContent.getBoundingClientRect();
      state2.settingsAppInfoContentHeight = contentBox.height;
      setStyle(elements6.settingsAppInfoLess, "display", "none");
      setStyle(elements6.settingsAppInfoContent, "height", "0px");
    }, 100);
  };
  var showInfo2 = () => {
    if (state2.open) {
      setStyle(elements6.settingsAppInfoLess, "display", "none");
      setStyle(elements6.settingsAppInfoMore, "display", "initial");
      setStyle(elements6.settingsAppInfoContent, "height", "0px");
    } else {
      setStyle(elements6.settingsAppInfoLess, "display", "initial");
      setStyle(elements6.settingsAppInfoMore, "display", "none");
      setStyle(elements6.settingsAppInfoContent, "height", `${state2.settingsAppInfoContentHeight}px`);
    }
    state2.open = !state2.open;
  };
  var active7 = () => {
    add(elements6.settingsAppInfo, "click", showInfo2);
  };
  var deactivate7 = () => {
    remove(elements6.settingsAppInfo, "click", showInfo2);
  };

  // src/screens/settings/ratio/ratio.ts
  var elements7 = {};
  var state3 = {
    ratio: 0
  };
  var init13 = async () => {
    elements7.settingsSliderRepeatable = byId("settings-slider-repeatable");
    elements7.settingsSliderSingle = byId("settings-slider-single");
    elements7.settingsSliderInput = byId("settings-slider-input");
    areNotNull(elements7, ["settings", "ratio"]);
    state3.ratio = Number(await core.store.get(storageNames.questionsRatio));
    elements7.settingsSliderInput.value = state3.ratio.toString();
    elements7.settingsSliderInput.max = determinants.questionInSession.toString();
    inner(elements7.settingsSliderRepeatable, state3.ratio.toString());
    inner(elements7.settingsSliderSingle, (determinants.questionInSession - state3.ratio).toString());
  };
  var showRatio = (event) => {
    const value = event.target.value;
    inner(elements7.settingsSliderRepeatable, value);
    inner(elements7.settingsSliderSingle, (determinants.questionInSession - Number(value)).toString());
  };
  var memoRatio = async (event) => {
    const value = event.target.value;
    state3.ratio = Number(value);
    await core.store.set(storageNames.questionsRatio, value);
    data.numOfQuestions.repeatable = state3.ratio;
    const single2 = determinants.questionInSession - state3.ratio;
    data.numOfQuestions.single = single2;
  };
  var active8 = () => {
    add(elements7.settingsSliderInput, "input", showRatio);
    add(elements7.settingsSliderInput, "change", memoRatio);
  };
  var deactivate8 = () => {
    remove(elements7.settingsSliderInput, "input", showRatio);
    remove(elements7.settingsSliderInput, "change", memoRatio);
  };

  // src/queries/data/version.ts
  var getVersion = async (version) => {
    const result = await api.post(
      url.data.version,
      { version },
      { withCredentials: true }
    );
    return result.data;
  };

  // src/queries/data/config.ts
  var getConfig = async () => {
    const result = await api.get(
      url.data.config,
      { withCredentials: true }
    );
    return result.data;
  };

  // src/queries/data/questions.ts
  var getAllQuestions = async () => {
    const result = await api.get(
      url.data.questions,
      { withCredentials: true }
    );
    return result.data;
  };

  // src/queries/data/images.ts
  var getImage = async (name) => {
    const result = await api.post(
      url.data.images,
      { name },
      {
        withCredentials: true,
        responseType: "blob"
      }
    );
    return result.data;
  };

  // src/queries/statistics/getAnswers.ts
  var getAnswers = async () => {
    const result = await api.get(
      url.statistics.getAnswers,
      { withCredentials: true }
    );
    return result.data;
  };

  // src/utils/blob.ts
  var toString3 = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  // src/modal/modal.ts
  var modal_exports = {};
  __export(modal_exports, {
    hide: () => hide2,
    init: () => init19,
    resize: () => resize5,
    show: () => show2
  });

  // src/modal/error/error.ts
  var elements8 = {};
  var reload = () => window.location.reload();
  var close = null;
  var error = {
    init: () => {
      elements8.modal = byId("modal-error");
      elements8.txt = byId("modal-error-txt");
      elements8.info = byId("modal-error-info");
      elements8.btn = byId("modal-error-btn");
    },
    show: (err, canWork, onClose) => {
      show2();
      setStyle(elements8.modal, "display", "flex");
      close = onClose;
      if (canWork) {
        inner(elements8.txt, err);
        inner(elements8.info, "B\u0119dzie dzia\u0142a\u0107 dzi\u0119ki zapami\u0119tanym danym.");
        setStyle(elements8.info, "color", "var(--on_prime_color)");
        inner(elements8.btn, "Dalej");
        add(elements8.btn, "click", error.hide);
      } else {
        inner(elements8.txt, err);
        inner(elements8.info, "Brak danych aby uruchomi\u0107 aplikacj\u0119.");
        setStyle(elements8.info, "color", "var(--off_prime_color)");
        inner(elements8.btn, "Prze\u0142aduj");
        add(elements8.btn, "click", reload);
      }
    },
    hide: () => {
      hide2();
      setStyle(elements8.modal, "display", "none");
      remove(elements8.btn, "click", reload);
      remove(elements8.btn, "click", error.hide);
      if (close) close();
    }
  };

  // src/queries/user/setId.ts
  var set2 = async () => {
    const result = await api.post(
      url.user.set,
      {},
      // body
      { withCredentials: true }
      // config
    );
    return result.data;
  };

  // src/queries/error.ts
  var responseState = {
    ok: "ok",
    noNetwork: "noNetwork",
    csrf: "csrf",
    ddos: "ddos",
    ddosId: "DDoSid",
    noMahakala: "noMahakala",
    wrongMahakala: "wrongMahakala",
    otherProblem: "otherProblem",
    error: "error"
  };
  var baseErrorsChecker = async (promise) => {
    return await promise().then((response) => {
      const okCodes2 = [200, 304];
      if (okCodes2.includes(response?.status)) {
        return {
          state: responseState.ok,
          data: response.data
        };
      }
      if (response?.status === 403) {
        return {
          state: responseState.csrf,
          data: response.data
        };
      }
      if (response?.status === 429) {
        if (response.data.command === responseCommand.main.ddos) {
          return {
            state: responseState.ddos,
            data: response.data
          };
        } else {
          return {
            state: responseState.ddosId,
            data: response.data
          };
        }
      }
      if (response?.status === 401) {
        if (response.data.command === responseCommand.secure.noMahakala) {
          return {
            state: responseState.noMahakala,
            data: response.data
          };
        } else {
          return {
            state: responseState.wrongMahakala,
            data: response.data
          };
        }
      }
      return {
        state: responseState.otherProblem,
        data: response?.data
      };
    }).catch((error2) => {
      if (error2.code === "ERR_NETWORK" || !error2.response) {
        const result = {
          state: responseState.noNetwork,
          data: null
        };
        return result;
      }
      const errorState = error2.response?.status ? `${responseState.error}: ${error2.response?.status}` : null;
      return {
        state: errorState,
        data: error2.response?.data ?? null
      };
    });
  };
  var checkError = async (promise, endpointName) => {
    const response = await baseErrorsChecker(promise);
    const canGo = true;
    if (response.state === responseState.ok) {
      return response.data;
    }
    return new Promise((resolve) => {
      const onClose = () => {
        resolve(response?.data);
        return response.data;
      };
      const getShow = (txt) => {
        if (endpointName) {
          error.show(`endpoint: .../${endpointName}<br><br>${txt}`, canGo, onClose);
        } else {
          error.show(txt, canGo, onClose);
        }
      };
      switch (response.state) {
        case responseState.noNetwork:
          getShow("Brak dost\u0119pu do sieci.");
          break;
        case responseState.csrf:
          getShow("CSRF token jest b\u0142\u0119dny.");
          break;
        case responseState.ddos:
          getShow("Przekroczono limit zapyta\u0144 do serwera. Limit zrestartuje si\u0119 za godzin\u0119.");
          break;
        case responseState.ddosId:
          getShow("Przekroczono limit tworzenia uzytkownikow na dzie\u0144.  Limit zrestartuje si\u0119 za 24 godziny");
          break;
        case responseState.noMahakala:
          getShow("Brak mahakala token");
          break;
        case responseState.wrongMahakala:
          getShow("Wadliwy mahakala token");
          break;
        case responseState.otherProblem:
          getShow("Nieznany problem.");
          break;
        case responseState.error:
          getShow(response.state);
          break;
      }
    });
  };

  // src/queries/secure/secure.ts
  var getSecure = async () => checkError(async () => {
    return await api.get(url.secure.get, {
      withCredentials: true
    });
  });

  // src/modal/installer/installer.ts
  var elements9 = {};
  var deferredPrompt = null;
  var isAppInstalled = () => {
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    return isInstalled;
  };
  var beforeInstallPrompt = (e) => {
    e.preventDefault();
    deferredPrompt = e;
  };
  add(window, "beforeinstallprompt", beforeInstallPrompt);
  var instalClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === "accepted") {
      console.log("U\u017Cytkownik zainstalowa\u0142 aplikacj\u0119");
    } else {
      console.log("U\u017Cytkownik odrzuci\u0142 instalacj\u0119");
    }
    deferredPrompt = null;
    setStyle(elements9.btnSvg, "display", "block");
    inner(elements9.btnText, "instalowanie");
    waitFor(isAppInstalled, hideInstallerModal);
  };
  var init14 = () => {
    elements9.modal = byId("modal-installer");
    elements9.installBtn = byId("modal-installer-btn");
    elements9.noInstallBtn = byId("modal-installer-btn-no");
    elements9.btnText = byId("modal-installer-btn-tex");
    elements9.btnSvg = byId("modal-installer-btn-loader");
    areNotNull(elements9, ["modal", "user"]);
    setStyle(elements9.modal, "display", "none");
    setStyle(elements9.btnSvg, "display", "none");
  };
  var data5 = {};
  var showInstallerModal = (hideFn) => {
    show2();
    setStyle(elements9.modal, "display", "flex");
    add(elements9.installBtn, "click", instalClick);
    add(elements9.noInstallBtn, "click", hideInstallerModal);
    data5.hideFn = hideFn;
  };
  var hideInstallerModal = () => {
    hide2();
    setStyle(elements9.modal, "display", "none");
    remove(elements9.installBtn, "click", instalClick);
    remove(elements9.noInstallBtn, "click", hideInstallerModal);
    data5.hideFn();
  };

  // src/init/init.ts
  var getSecureAndCheckData = async () => {
    await getSecure();
    setTimeout(() => check(), 100);
  };
  var init16 = async () => {
    waitFor(() => data.sume !== 0, async () => {
      const started = await core.store.get(storageNames.sessionStarted);
      if (started === checked.yes) {
        await memoAnswers();
        await memoLogs();
        await core.store.set(storageNames.sessionStarted, checked.no);
        const vv = window.visualViewport;
        resize2(vv.width, vv.height);
      }
    })();
    await init15();
  };

  // src/init/user.ts
  var memoUserId = (userId) => {
    core.store.set(storageNames.userId, userId);
    setUserId(userId);
  };
  var init15 = async () => {
    const secure = await getSecure();
    const startApp = () => {
      if (secure.command === responseCommand.secure.generateUserId) {
        showUserModal();
      } else if (secure.command === responseCommand.secure.go) {
        memoUserId(secure.userId || "");
        getSecureAndCheckData();
      }
    };
    if (true) {
      if (!isAppInstalled()) {
        showInstallerModal(startApp);
      } else {
        startApp();
      }
    } else {
      startApp();
    }
  };

  // src/utils/validateUserId.ts
  var alphabetData = {
    azSmall: "qwertyuiopasdfghjklzxcvbnm",
    azBig: "QWERTYUIOPASDFGHJKLZXCVBNM",
    numbers: "1234567890"
  };
  var ALPHABET = alphabetData.numbers + alphabetData.azSmall + alphabetData.azBig;
  var regex = new RegExp(`^[${ALPHABET}]{21}$`);
  var validateUserId = (value) => {
    const result = {
      text: "",
      correct: false
    };
    if (value.length < 21) {
      result.text = "Za kr\xF3tki min 21 znak\xF3w";
      return result;
    }
    if (value.length > 21) {
      result.text = "Za d\u0142ugi max 21 znak\xF3w";
      return result;
    }
    if (!regex.test(value)) {
      result.text = "String zawiera niedozwolone znaki";
      return result;
    }
    result.text = "jest OK.";
    result.correct = true;
    return result;
  };

  // src/queries/user/checkId.ts
  var checkId = async (userId) => {
    const result = await api.post(
      url.user.check,
      { userId },
      { withCredentials: true }
    );
    return result.data;
  };

  // src/modal/user/user.ts
  var elements10 = {};
  var init17 = () => {
    elements10.btnNewUser = byId("modal-user-btn-new-user");
    elements10.modal = byId("modal-user");
    elements10.idInfo = byId("modal-user-id-info");
    elements10.idInput = byId("modal-user-id-input");
    elements10.btnOldUser = byId("modal-user-btn-old-user");
    elements10.btnClose = byId("modal-user-btn-close");
    areNotNull(elements10, ["modal", "user"]);
  };
  var setNewUser = async () => {
    const userIdSet = await set2();
    memoUserId(userIdSet.userId || "");
    getSecureAndCheckData();
  };
  var no = (text) => {
    inner(elements10.idInfo, text);
    setStyle(elements10.idInfo, "color", "var(--off_prime_color)");
    disable(elements10.btnOldUser);
  };
  var getValidateUserId = (event) => {
    const value = event.target.value;
    const validate = validateUserId(value);
    if (validate.correct) {
      inner(elements10.idInfo, validate.text);
      setStyle(elements10.idInfo, "color", "var(--on_second_color)");
      enable(elements10.btnOldUser);
    } else {
      no(validate.text);
    }
  };
  var checkUserId = async () => {
    const userIdSet = await checkId(elements10.idInput.value);
    const state5 = userIdSet.command;
    if (state5 === responseCommand.user.ok) {
      memoUserId(elements10.idInput.value);
      hideUserModal();
      getSecureAndCheckData();
      getAnswersFromServer();
    } else {
      no("Niema takiego u\u017Cytkownika");
    }
  };
  var click = async () => {
    await setNewUser();
    hideUserModal();
  };
  var showUserModal = (required = true) => {
    show2();
    const { modal, btnNewUser, idInput, btnOldUser } = elements10;
    display(modal, "flex");
    btnOldUser.disabled = true;
    add(btnNewUser, "click", click);
    add(idInput, "input", getValidateUserId);
    add(btnOldUser, "click", checkUserId);
    display(elements10.btnClose, required ? "none" : "block");
    add(elements10.btnClose, "click", hideUserModal);
  };
  var hideUserModal = () => {
    hide2();
    setStyle(elements10.modal, "display", "none");
    const { btnNewUser, idInput, btnOldUser } = elements10;
    remove(btnNewUser, "click", click);
    remove(idInput, "input", getValidateUserId);
    remove(btnOldUser, "click", checkUserId);
    remove(elements10.btnClose, "click", hideUserModal);
  };

  // src/modal/modal.ts
  var elements11 = {};
  var init19 = () => {
    elements11.modal = byId("modal");
    elements11.back = byId("modal-back");
    areNotNull(elements11, ["modal"]);
    error.init();
    init17();
    init14();
    init18();
  };
  var resize5 = (w, h) => {
    setStyle(elements11.back, "width", getPx(w));
    setStyle(elements11.back, "height", getPx(h));
  };
  var visible = false;
  var show2 = () => {
    visible = true;
    setStyle(elements11.modal, "opacity", "0");
    setStyle(elements11.modal, "display", "flex");
    setTimeout(() => {
      setStyle(elements11.modal, "opacity", "1");
    }, 30);
    blur();
  };
  var hide2 = () => {
    visible = false;
    setStyle(elements11.modal, "opacity", "0");
    setTimeout(() => {
      if (!visible) {
        setStyle(elements11.modal, "display", "none");
      }
    }, 330);
    unBlur();
  };

  // src/modal/info/info.ts
  var elements12 = {};
  var init18 = () => {
    elements12.modal = byId("modal-info");
    elements12.title = byId("modal-info-title");
    elements12.text = byId("modal-info-section");
    elements12.btnOk = byId("modal-info-btn-ok");
    elements12.btnCancel = byId("modal-info-btn-cancel");
    areNotNull(elements12, ["modal", "info"]);
    display(elements12.modal, "none");
  };
  var fns = {};
  var withClose = (fn) => () => {
    fn();
    closeModal();
  };
  var showInfoModal = (title, text, ok, cancel, okFn, cancelFn) => {
    inner(elements12.title, title);
    inner(elements12.text, text);
    display(elements12.btnOk, ok ? "block" : "none");
    display(elements12.btnCancel, cancel ? "block" : "none");
    fns.ok = okFn ? withClose(okFn) : closeModal;
    fns.cancel = cancelFn ? withClose(cancelFn) : closeModal;
    show2();
    display(elements12.modal, "flex");
    add(elements12.btnOk, "click", fns.ok);
    add(elements12.btnCancel, "click", fns.cancel);
  };
  var closeModal = () => {
    hide2();
    display(elements12.modal, "none");
    remove(elements12.btnOk, "click", fns.ok);
    remove(elements12.btnCancel, "click", fns.cancel);
  };

  // src/init/data.ts
  var clearAnswers = async (all3 = false) => {
    const questions = await core.idb.questions.getAllData();
    let maxUsed = 0;
    await questions.forEach(async (question, index) => {
      const key = question[0];
      const q = question[1];
      if (maxUsed < q.used.length + 1) maxUsed = q.used.length + 1;
      const answer = await core.idb.answers.get(key);
      if (!answer || all3) {
        await core.idb.answers.set(index, {
          id: q.id,
          history: [],
          // expectedUse: 0,
          used: q.used.length + 1
        });
      }
    });
    return maxUsed;
  };
  var getAnswersFromServer = async () => {
    const answers = await getAnswers();
    if (answers !== null) {
      await clearAnswers(true);
      const answersOld = await core.idb.answers.getAllData();
      answers.forEach(async (answer) => {
        const oldAnswer = await answersOld.find((a) => a[1].id === answer.id);
        const index = oldAnswer[0];
        const rating2 = getRateHistory(answer.history);
        console.log("%c rating:", "background: #ffcc00; color: #003300", index, rating2);
        core.idb.answers.update(index, (old) => old = {
          id: answer.id,
          history: answer.history,
          used: oldAnswer[1].used,
          rating: rating2
        });
      });
    }
  };
  var check = async () => {
    const waitForIntervalClear = (intervalFn, time) => {
      return new Promise((resolve) => {
        let interval;
        const clear = () => {
          clearInterval(interval);
          resolve();
        };
        const fn = intervalFn(clear);
        interval = setInterval(fn, time);
      });
    };
    const versionDb = await core.store.get(storageNames.version);
    const response = await getVersion(versionDb);
    const versionRes = response.version;
    const infoVersion = core.store.get(storageNames.infoVersion);
    if (versionRes !== infoVersion) {
      showInfoModal("Aktualizacja", "dodano w ustawieniach przyciski wczytania u\u017Cytkownika i restart pyta\u0144.", true, false);
      core.store.set(storageNames.infoVersion, versionRes);
    }
    if (versionRes !== versionDb) {
      await core.store.set(storageNames.imgAvailable, checked.no);
      initStatus(versionRes);
      setTimeout(() => setVersionPos(), 200);
      const configRes = await getConfig();
      const configTestsDb = await core.store.get(storageNames.configTests);
      if (configRes.tests !== configTestsDb) {
        showStatus();
        const allQuestionsRes = await getAllQuestions();
        const allQuestions = allQuestionsRes.map((question) => {
          if (!question.used) question.used = [];
          return question;
        });
        const newQuestions = allQuestions.map((question, index2) => [index2, question]);
        await core.idb.questions.setMany(newQuestions);
        await core.store.set(storageNames.configTests, configRes.tests);
        if (core.isMobile) showMenu();
      }
      setStartImgStatus();
      const imgSToAdd = [];
      await configRes.img.forEach(async (img) => {
        const imgDb = await core.idb.images.get(img.name);
        if (!imgDb || imgDb.version !== img.version) imgSToAdd.push(img);
      });
      let index = 0;
      const imageInterval = (clear) => async () => {
        const imageDataRes = imgSToAdd[index];
        if (!imageDataRes) {
          await core.store.set(storageNames.imgAvailable, checked.yes);
          hideStatus();
          await core.store.set(storageNames.version, versionRes);
          clear();
          return;
        }
        imgStatus(index + 1, imgSToAdd.length);
        index++;
        const image = await getImage(imageDataRes.name);
        if (image) {
          await core.idb.images.set(imageDataRes.name, {
            version: imageDataRes.version,
            data: await toString3(image)
          });
        }
      };
      waitForIntervalClear(imageInterval, 1e3);
    }
    const maxUsed = await clearAnswers();
    data.quantities = Array(maxUsed).fill(0);
    data.sume = 0;
    const questions = await core.idb.questions.getAllData();
    questions.forEach((q) => {
      const index = q[1].used.length;
      data.quantities[index]++;
      data.sume++;
    });
    await updateAnswers();
    data2.monitor.size = Math.ceil(Math.sqrt(data.sume));
    firstUse();
    if (core.isMobile) showMenu();
  };

  // src/screens/settings/options/options.ts
  var elements13 = {};
  var init20 = () => {
    elements13.btnChangeUser = byId("settings-option-change-user-btn");
    elements13.btnReset = byId("settings-option-reset-btn");
    areNotNull(elements13, ["modal", "user"]);
  };
  var setUserId2 = () => showUserModal(false);
  var reset = () => {
    showInfoModal("Reset odpowiedzi", "Wszystkie odpowiedzi zostan\u0105 usuni\u0119te. Nauka zacznie si\u0119 od pocz\u0105tku.", true, true, clearAnswers);
  };
  var active9 = () => {
    add(elements13.btnChangeUser, "click", setUserId2);
    add(elements13.btnReset, "click", reset);
  };
  var deactivate9 = () => {
    remove(elements13.btnReset, "click", setUserId2);
    remove(elements13.btnChangeUser, "click", reset);
  };

  // src/screens/settings/menu/menu.ts
  var ids = {
    prefix: "setting-menu-",
    side: {
      right: "right",
      left: "left"
    }
  };
  var valuesList = [checked.no, checked.yes];
  var menuNames = Object.values(ids.side);
  var controlMenuData = {
    prefix: ids.prefix,
    storeName: storageNames.menuLeft,
    elementList: menuNames,
    nameList: valuesList,
    clickList: []
  };
  var menuRatio;
  var init21 = () => {
    controlMenuData.clickList = [
      () => menuSide(checked.no),
      () => menuSide(checked.yes)
    ];
    menuRatio = getRadio(controlMenuData);
    menuRatio.init();
  };

  // src/screens/settings/settings.ts
  var elements14 = {};
  var resize6 = (w, h) => {
    setStyle(elements14.scrollBox, "height", `calc(${getPx(h)} - 32px - var(--font_title_size))`);
  };
  var init22 = () => {
    elements14.scrollBox = byQuery("#settings-tab-box .scroll-box");
    areNotNull(elements14, ["settings"]);
    init12();
    init5();
    init13();
    init21();
    init20();
  };
  var active10 = () => {
    active7();
    ratio.active();
    active8();
    active9();
  };
  var deactivate10 = () => {
    deactivate7();
    ratio.deactivate();
    deactivate8();
    deactivate9();
  };

  // src/tab/tab.ts
  var WEB_MENU_WIDTH = 200;
  var elements15 = {};
  var state4 = {
    screen: 0,
    max: 0,
    carouselLeftPos: 0,
    tabWidth: 0
  };
  var screens = [
    starter_exports,
    statistics_exports,
    learning_exports,
    answers_exports,
    settings_exports
  ];
  var getTabLeftPos = () => state4.tabWidth * state4.screen;
  var setTab = () => {
    elements15.carousel.style.left = getPx(-getTabLeftPos());
    screens.forEach((s, i) => {
      i === state4.screen ? s.active() : s.deactivate();
    });
  };
  var goLeft = () => {
    if (state4.screen > 0) {
      state4.screen--;
      setTab();
    }
  };
  var goRight = () => {
    if (state4.screen < state4.max - 1) {
      state4.screen++;
      setTab();
    }
  };
  var setWebBtnsColor = (index) => {
    elements15.menu.items.forEach((item, i) => {
      if (index === i) {
        setStyle(item, "backgroundColor", "var(--mine_color)");
        setStyle(item, "color", "var(--last_color)");
      } else {
        setStyle(item, "backgroundColor", "var(--penultimate_color)");
        setStyle(item, "color", "var(--prime_color)");
      }
    });
  };
  var getGoTo = (screenNum) => () => {
    state4.screen = screenNum;
    setTab();
    if (core.isMobile) {
      setIconsColor(screenNum);
    } else {
      setWebBtnsColor(screenNum);
    }
  };
  var blur = () => {
    setStyle(elements15.allTabs, "filter", "blur(5px)");
  };
  var unBlur = () => {
    setStyle(elements15.allTabs, "filter", "blur(0px)");
  };
  var init23 = () => {
    elements15.carousel = byId("carousel");
    elements15.carouselBox = byId("carousel-box");
    elements15.allTabs = byId("tabs");
    elements15.tabs = byQueryAll(".tab");
    state4.max = elements15.tabs.length;
    elements15.menu = {};
    elements15.menu.mobile = byId("menu-mobile");
    elements15.menu.web = byId("menu-web");
    if (core.isMobile) {
      display(elements15.menu.web, "none");
      elements15.menu.items = [];
      init3(getGoTo, elements15.menu.items);
    } else {
      display(elements15.menu.mobile, "none");
      state4.carouselLeftPos = WEB_MENU_WIDTH;
      elements15.menu.items = byQueryAll(".menu-web-item");
      for (let i = 0; i < elements15.menu.items.length; ++i) {
        const item = elements15.menu.items[i];
        add(item, "click", getGoTo(i));
      }
    }
    areNotNull(elements15, ["tab"]);
  };
  var resize7 = (w, h) => {
    state4.tabWidth = w - state4.carouselLeftPos;
    for (let i = 0; i < elements15.tabs.length; ++i) {
      const tab = elements15.tabs[i];
      setStyle(tab, "width", getPx(state4.tabWidth));
      setStyle(tab, "height", getPx(h));
    }
    setStyle(elements15.allTabs, "width", getPx(w));
    setStyle(elements15.allTabs, "height", getPx(h));
    setStyle(elements15.carouselBox, "width", getPx(state4.tabWidth));
    setStyle(elements15.carouselBox, "left", getPx(state4.carouselLeftPos));
    setStyle(elements15.carousel, "width", getPx(state4.max * state4.tabWidth));
    setTab();
  };

  // src/inputs/keys.ts
  var keysListener = async (event) => {
    switch (event.code) {
      case "Tab":
        {
          event.preventDefault();
        }
        break;
      case "Space":
        {
          changeVisibility();
        }
        break;
      case "ArrowRight":
      case "KeyD":
        {
          goRight();
        }
        break;
      case "ArrowLeft":
      case "KeyA":
        {
          goLeft();
        }
        break;
      case "KeyQ":
        {
          if (false) {
            const sessionStarted = await core2.store.get(storageNames2.sessionStarted);
            if (sessionStarted) {
              const timestamp = Date.now();
              data6.answers.origin?.answer.history.push({
                timestamp,
                result: true
              });
              const rate = getRateHistory2(data6.answers.origin?.answer.history);
              data6.answers.origin.answer.rating = rate;
              const { drawn, index, ...answerDb } = data6.answers.origin.answer;
              core2.idb.answers.update(index, (old) => old = answerDb);
              const log = {
                action: data6.answers.origin.answer.id,
                result: true
              };
              core2.idb.logs.set(timestamp, log);
              clearResults2();
              setQuestion2();
            }
          }
        }
        break;
    }
  };
  var controllers = {
    keysListener,
    initKeys: () => {
      add(document, "keydown", keysListener);
    }
  };

  // src/idb.ts
  var DB_NAME = "rol04";
  var STORES = ["questions", "images", "answers", "logs"];
  var DB_VERSION = STORES.length;
  var dbPromise = null;
  var promisifyRequest = (request) => new Promise((resolve, reject) => {
    const tx = request;
    const req = request;
    const isTx = typeof request.objectStoreNames !== "undefined";
    if (isTx) {
      const done = () => resolve(void 0);
      tx.addEventListener("complete", done, { once: true });
      tx.addEventListener("error", () => reject(tx.error), { once: true });
      tx.addEventListener("abort", () => reject(tx.error), { once: true });
      return;
    }
    req.addEventListener("success", () => resolve(req.result), { once: true });
    req.addEventListener("error", () => reject(req.error), { once: true });
  });
  var openDb = async () => {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        for (const storeName of STORES) {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName);
          }
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return dbPromise;
  };
  var createStore = (storeName) => {
    if (!STORES.includes(storeName)) {
      throw new Error(`Unknown IndexedDB store "${storeName}"`);
    }
    return async (txMode, callback) => {
      const db = await openDb();
      const tx = db.transaction(storeName, txMode);
      const store = tx.objectStore(storeName);
      const result = await callback(store);
      await new Promise((resolve, reject) => {
        tx.addEventListener("complete", () => resolve(), { once: true });
        tx.addEventListener("error", () => reject(tx.error), { once: true });
        tx.addEventListener("abort", () => reject(tx.error), { once: true });
      });
      return result;
    };
  };
  var idb = (storeName) => {
    let cachedStore;
    const getStore = () => {
      if (!cachedStore) cachedStore = createStore(storeName);
      return cachedStore;
    };
    const get3 = (key, store = getStore()) => {
      if (key == null) return Promise.resolve(null);
      return store("readonly", async (store2) => {
        const req = store2.get(key);
        const res = await promisifyRequest(req);
        return res ?? null;
      });
    };
    const set3 = (key, value, store = getStore()) => store("readwrite", (store2) => {
      store2.put(value, key);
      return void 0;
    });
    const setMany = (entries, store = getStore()) => store("readwrite", (store2) => {
      for (const [key, value] of entries) {
        store2.put(value, key);
      }
      return void 0;
    });
    const getMany = (keys2, store = getStore()) => store(
      "readonly",
      (store2) => Promise.all(keys2.map((k) => promisifyRequest(store2.get(k)))).then((res) => res.map((v) => v ?? void 0))
    );
    const update = (key, updater, store = getStore()) => store("readwrite", (store2) => {
      return new Promise((resolve, reject) => {
        const req = store2.get(key);
        req.onsuccess = () => {
          try {
            const next = updater(req.result);
            store2.put(next, key);
            resolve();
          } catch (e) {
            reject(e);
          }
        };
        req.onerror = () => reject(req.error);
      });
    });
    const del = (key, store = getStore()) => store("readwrite", (store2) => {
      store2.delete(key);
      return void 0;
    });
    const delMany = (keys2, store = getStore()) => store("readwrite", (store2) => {
      for (const key of keys2) store2.delete(key);
      return void 0;
    });
    const eachCursor = (store, cb) => new Promise((resolve, reject) => {
      const req = store.openCursor();
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        const cursor = req.result;
        if (!cursor) return resolve();
        cb(cursor);
        cursor.continue();
      };
    });
    const keys = (store = getStore()) => store("readonly", (store2) => {
      if (store2.getAllKeys) {
        return promisifyRequest(store2.getAllKeys());
      }
      const out = [];
      return eachCursor(store2, (c) => out.push(c.key)).then(() => out);
    });
    const values = (store = getStore()) => store("readonly", (store2) => {
      if (store2.getAll) {
        return promisifyRequest(store2.getAll());
      }
      const out = [];
      return eachCursor(store2, (c) => out.push(c.value)).then(() => out);
    });
    const getAllData = (store = getStore()) => store("readonly", async (store2) => {
      if (store2.getAll && store2.getAllKeys) {
        const [keys2, values2] = await Promise.all([
          promisifyRequest(store2.getAllKeys()),
          promisifyRequest(store2.getAll())
        ]);
        return keys2.map((k, i) => [k, values2[i]]);
      }
      const out = [];
      return eachCursor(store2, (c) => {
        out.push([c.key, c.value]);
      }).then(() => out);
    });
    const clear = (store = getStore()) => store("readwrite", (store2) => {
      store2.clear();
      return void 0;
    });
    return {
      get: get3,
      set: set3,
      setMany,
      getMany,
      update,
      del,
      delMany,
      keys,
      values,
      getAllData,
      clear
    };
  };

  // src/utils/resize.ts
  var resize8 = () => {
    const functionList = [];
    const add2 = (fn) => functionList.push(fn);
    const run = () => {
      const vv = window.visualViewport;
      const w = vv.width;
      const h = vv.height;
      functionList.forEach((f) => f(w, h));
    };
    window.onresize = run;
    return {
      add: add2,
      run
    };
  };

  // src/serviceWorker.ts
  var serviceWorker = async () => {
    if (!("serviceWorker" in navigator)) {
      return;
    }
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        updateViaCache: "none"
      });
      registration.update();
      if (registration.waiting) {
        registration.waiting.postMessage({
          type: "SKIP_WAITING"
        });
      }
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) {
          return;
        }
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            newWorker.postMessage({
              type: "SKIP_WAITING"
            });
          }
        });
      });
      let refreshing = false;
      navigator.serviceWorker.addEventListener(
        "controllerchange",
        () => {
          if (refreshing) {
            return;
          }
          refreshing = true;
          window.location.reload();
        }
      );
    } catch (err) {
      console.error("SW error:", err);
    }
  };

  // src/console.ts
  var setConsole = () => (function() {
    let styles = [
      "background: linear-gradient(169deg, #f60707 0%, #ffd600 38%, #edff00 51%, #c4ed18 62%, #00ff19 100%)",
      "border: 1px solid #3E0E02",
      "width: 220px",
      "color: black",
      "display: block",
      "text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)",
      "box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset",
      "line-height: 30px",
      "text-align: center",
      "font-weight: bold",
      "font-size: 24px",
      "margin: 10px 0",
      "padding: 10px 0 15px 0"
    ].join(";");
    console.log("%c\u{1F449}rol 04\u{1F448}", styles);
    let styles2 = [
      "background: linear-gradient(169deg, #f60707 0%, #ffd600 38%, #edff00 51%, #c4ed18 62%, #00ff19 100%)",
      "border: 1px solid #3E0E02",
      "width: 220px",
      "color: black",
      "display: block",
      "text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)",
      "box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset",
      "line-height: 18px",
      "text-align: center",
      "font-weight: bold",
      "font-size: 16px",
      "margin: 10px 0",
      "padding: 10px 0 15px 0"
    ].join(";");
    console.log("%c   \u{1D482}\u{1D496}\u{1D495}\u{1D490}\u{1D493}: \u{1D40C}\u{1D422}\u{1D41C}\u{1D421}\u{1D41A}\u{1D425} \u{1D400}\u{1D427}\u{1D422}\u{1D428}\u{1D425} \u{1F60E}   ", styles2);
  })();

  // src/app.ts
  (function() {
    axios_default.defaults.xsrfCookieName = "XSRF-TOKEN";
    axios_default.defaults.xsrfHeaderName = "X-XSRF-TOKEN";
    axios_default.defaults.withCredentials = true;
    const modules = [
      ...screens,
      tab_exports,
      modal_exports
    ];
    getStorage().then(async (store) => {
      core.store = store;
      core.idb.questions = idb("questions");
      core.idb.images = idb("images");
      core.idb.answers = idb("answers");
      core.idb.logs = idb("logs");
      const domContentLoaded = async () => {
        controllers.initKeys();
        modules.forEach((m) => {
          if (m.init) m.init();
        });
        const resize9 = resize8();
        modules.forEach((m) => {
          if (m.resize) {
            resize9.add(m.resize);
          }
        });
        resize9.run();
        await init16();
        setTimeout(async () => {
          getGoTo(0)();
          await init();
        }, 300);
      };
      add(document, "DOMContentLoaded", domContentLoaded);
      setConsole();
      await serviceWorker();
    });
  })();
})();

(function (window) {
    "use strict";

    function var_dump() {
        for (var i = 0; i < arguments.length; ++i) {
            console.log(dump(arguments[i], 0, []));
        }
    }

    var_dump.INDENT_WIDTH = 4;

    function dump(value, depth, stack) {
        var type = typeof value;

        switch (type) {
            case "boolean":
            case "bigint":
            case "number":
                return type + "(" + value + ")";

            case "string":
                return "string(" + value.length + ") \"" + value + "\"";

            case "function":
                return dumpFunction(value, depth);

            case "object":
                if (Array.isArray(value))
                {
                    return dumpArray(value, depth, stack);
                }

                return dumpObject(value, depth, stack);

            default: // undefined, symbol
                return type;
        }
    }

    function createIndentation(depth) {
        depth *= var_dump.INDENT_WIDTH;

        if (String.prototype.repeat) {
            return " ".repeat(depth);
        }

        if (depth === 0) {
            return "";
        }

        var result = "";
        for (var i = 0; i < depth; ++i) {
            result += " ";
        }

        return result;
    }

    function dumpArray(array, depth, stack) {
        var result      = "array(" + array.length + ") {\n";
        var arrayIndent = createIndentation(depth);
        var propIndent  = createIndentation(depth + 1);

        for (var i = 0; i < array.length; ++i) {
            result += propIndent + "[" + i + "] => " + dump(array[i], depth + 1, stack) + "\n";
        }

        return result + arrayIndent + "}";
    }

    /** @see https://stackoverflow.com/a/9924463 */
    function getFuncArgs(func) {
        var STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
        var ARG_NAME = /([^\s,]+)/g;

        var str    = func.toString().replace(STRIP_COMMENTS, "");
        var result = str.slice(str.indexOf('(') + 1, str.indexOf(')')).match(ARG_NAME);

        if (result === null) {
            return [];
        }

        return result;
    }

    function dumpFunction(func, depth) {
        var name = func.name.length > 0 ? func.name : "(anonymous)";
        var args = getFuncArgs(func);

        var funcIndent = createIndentation(depth);
        var attrIndent = createIndentation(depth + 1);
        var result     = "function {\n" + attrIndent + "[name] => " + name;

        if (args.length > 0) {
            result += "\n" + attrIndent + "[parameters] => " + dump(args, depth + 1, []);
        }

        return result + "\n" + funcIndent + "}";
    }

    function isElement(value) {
        if (typeof HTMLElement === "object") {
            return value instanceof HTMLElement;
        }

        return typeof value === "object" && value !== null && value.nodeType === 1 && typeof value.nodeName === "string";
    }

    function dumpObject(obj, depth, stack) {
        if (stack.indexOf(obj) !== -1) {
            return "*RECURSION*";
        }

        // Handle recursion
        stack.push(obj);

        switch (obj) {
            case null:
                return "NULL";

            case window:
                return "object(window)";

            case window.document:
                return "object(document)";

            default:
                if (isElement(obj)) {
                    return "HTMLElement(" + obj.nodeName + ")";
                }
        }

        var name   = typeof obj.constructor !== "undefined" ? obj.constructor.name : "";
        var keys   = Object.keys(obj);
        var result = "object(" + (name !== "" ? name : "@anonymous") + ") (" + keys.length + ") {\n";
        var objIndent  = createIndentation(depth);
        var propIndent = createIndentation(depth + 1);

        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (typeof obj.hasOwnProperty === "function" && obj.hasOwnProperty(key)) {
                result += propIndent + "[\"" + key + "\"] => " + dump(obj[key], depth + 1, stack) + "\n";
            }
        }

        return result + objIndent + "}";
    }

    window.var_dump = var_dump;
})(window);

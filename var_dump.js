(function (window) {
    function _dump(value, level) {
        var dump = typeof value;

        switch (dump) {
            case "undefined": return dump;
            case "boolean": return dump + "(" + (value ? "true" : "false") + ")";
            case "number": return dump + "(" + value + ")";
            case "bigint": return dump + "(" + value + ")";
            case "string": return dump + "(" + value.length + ") \"" + value + "\"";
            case "function": return varIsFunction(value, level);
            case "object": return varIsObject(value, level);
        }
    }
    
    /**
     * Checks if the given value is a HTML element.
     * 
     * @param {any} value
     * @return {boolean}
     */
    function isElement(value) {
        if (typeof HTMLElement === "object") {
            return value instanceof HTMLElement;
        }
        
        return typeof value === "object" && value !== null && value.nodeType === 1 && typeof value.nodeName === "string";
    }
    
    /**
     * Tells if a variable is empty.
     * Returns FALSE for the following values:
     *  undefined
     *  null
     *  false
     *  document.all @see https://developer.mozilla.org/en-US/docs/Glossary/Falsy
     *  [] (empty array)
     *  {} (empty object)
     *  "" (empty string)
     *  0 (as int)
     *  0.0 (as float)
     *  NaN
     * 
     * @param {any} value
     * @return {boolean}
     */
    function isEmpty(value) {
        if (!value) {
            return true;
        }
        else if (typeof value === "object") {
            if (Array.isArray(value)) {
                return value.length === 0;
            }
            else if (Object.keys) {
                return Object.keys(value).length === 0;
            }
            else { // IE 8 or lower (Is there anyone who continues using it?)
                var count = 0;
                for (var key in value) {
                    if (value.hasOwnProperty(key)) {
                        count++;
                    }
                }
                
                return count === 0;
            }
        }
        
        // Not empty!
        return false;
    }

    function getIndent(level) {
        var str = "";
        level *= 4;

        for (var i = 0; i < level; i++) {
            str += " ";
        }

        return str;
    }

    function varIsFunction(func, level) {
        var name = func.name;
        var args = getFuncArgs(func);
        var curIndent = getIndent(level);
        var nextIndent = getIndent(level + 1);
        var dump = "function {\n" + nextIndent + "[name] => " + (isEmpty(name) ? "(anonymous)" : name);

        if (args.length > 0) {
            dump += "\n" + nextIndent + "[parameters] => {\n";
            var argsIndent = getIndent(level + 2);

            for (var i = 0; i < args.length; i++) {
                dump += argsIndent + args[i] + "\n";
            }

            dump += nextIndent + "}";
        }

        return dump + "\n" + curIndent + "}";
    }
    
    /** @see https://stackoverflow.com/a/9924463 */
    var STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
    var ARGUMENT_NAMES = /([^\s,]+)/g;
    
    function getFuncArgs(func) {
        var str = func.toString().replace(STRIP_COMMENTS, '');
        var result = str.slice(str.indexOf('(') + 1, str.indexOf(')')).match(ARGUMENT_NAMES);
        
        if (result === null) {
            return [];
        }
        
        return result;
    }

    function varIsObject(obj, level) {
        if (obj === null) {
            return "object(NULL)";
        }
        else if (obj === window) {
            return "object(window)";
        }
        else if (obj === window.document) {
            return "object(document)";
        }
        else if (isElement(obj)) {
            return "HTMLElement(" + obj.nodeName + ")";
        }

        var dump = null;
        var length = 0;
        var numericIndex = true;

        if (Array.isArray(obj)) {
            length = obj.length;
            dump = "array(" + length + ") ";
        }
        else {
            length = Object.keys(obj).length;
            dump = "object(" + length + ") ";
            numericIndex = false;
        }

        if (length === 0) {
            return dump + "{}";
        }

        var curIndent = getIndent(level);
        var nextIndent = getIndent(level + 1);

        dump += "{\n";
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                dump += nextIndent + "[" + (numericIndex ? i : "\"" + i + "\"") + "] => " + _dump(obj[i], level + 1) + "\n";
            }
        }

        return dump + curIndent + "}";
    }
    
    function var_dump(value) {
        return _dump(value, 0);
    }
    
    window.var_dump = var_dump;
}(window));
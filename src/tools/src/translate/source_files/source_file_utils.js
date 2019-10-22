(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/source_files/source_file_utils", ["require", "exports", "tslib", "@angular/localize", "@babel/types"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var localize_1 = require("@angular/localize");
    var t = require("@babel/types");
    /**
     * Is the given `expression` an identifier with the correct name
     * @param expression The expression to check.
     */
    function isNamedIdentifier(expression, name) {
        return expression.isIdentifier() && expression.node.name === name;
    }
    exports.isNamedIdentifier = isNamedIdentifier;
    /**
    * Is the given `identifier` declared globally.
    * @param identifier The identifier to check.
    */
    function isGlobalIdentifier(identifier) {
        return !identifier.scope || !identifier.scope.hasBinding(identifier.node.name);
    }
    exports.isGlobalIdentifier = isGlobalIdentifier;
    /**
    * Build a translated expression to replace the call to `$localize`.
    * @param messageParts The static parts of the message.
    * @param substitutions The expressions to substitute into the message.
    */
    function buildLocalizeReplacement(messageParts, substitutions) {
        var mappedString = t.stringLiteral(messageParts[0]);
        for (var i = 1; i < messageParts.length; i++) {
            mappedString =
                t.binaryExpression('+', mappedString, wrapInParensIfNecessary(substitutions[i - 1]));
            mappedString = t.binaryExpression('+', mappedString, t.stringLiteral(messageParts[i]));
        }
        return mappedString;
    }
    exports.buildLocalizeReplacement = buildLocalizeReplacement;
    /**
    * Extract the message parts from the given `call` (to `$localize`).
    *
    * The message parts will either by the first argument to the `call` or it will be wrapped in call
    * to a helper function like `__makeTemplateObject`.
    *
    * @param call The AST node of the call to process.
    */
    function unwrapMessagePartsFromLocalizeCall(call) {
        var cooked = call.get('arguments')[0];
        if (cooked === undefined) {
            throw new BabelParseError(call.node, '`$localize` called without any arguments.');
        }
        if (!cooked.isExpression()) {
            throw new BabelParseError(cooked.node, 'Unexpected argument to `$localize` (expected an array).');
        }
        // If there is no call to `__makeTemplateObject(...)`, then `raw` must be the same as `cooked`.
        var raw = cooked;
        // Check for cached call of the form `x || x = __makeTemplateObject(...)`
        if (cooked.isLogicalExpression() && cooked.node.operator === '||' &&
            cooked.get('left').isIdentifier()) {
            var right = cooked.get('right');
            if (right.isAssignmentExpression()) {
                cooked = right.get('right');
                if (!cooked.isExpression()) {
                    throw new BabelParseError(cooked.node, 'Unexpected "makeTemplateObject()" function (expected an expression).');
                }
            }
        }
        // Check for `__makeTemplateObject(cooked, raw)` or `__templateObject()` calls.
        if (cooked.isCallExpression()) {
            var call_1 = cooked;
            if (call_1.get('arguments').length === 0) {
                // No arguments so perhaps it is a `__templateObject()` call.
                // Unwrap this to get the `_taggedTemplateLiteral(cooked, raw)` call.
                call_1 = unwrapLazyLoadHelperCall(call_1);
            }
            cooked = call_1.get('arguments')[0];
            if (!cooked.isExpression()) {
                throw new BabelParseError(cooked.node, 'Unexpected `cooked` argument to the "makeTemplateObject()" function (expected an expression).');
            }
            var arg2 = call_1.get('arguments')[1];
            if (arg2 && !arg2.isExpression()) {
                throw new BabelParseError(arg2.node, 'Unexpected `raw` argument to the "makeTemplateObject()" function (expected an expression).');
            }
            // If there is no second argument then assume that raw and cooked are the same
            raw = arg2 !== undefined ? arg2 : cooked;
        }
        var cookedStrings = unwrapStringLiteralArray(cooked.node);
        var rawStrings = unwrapStringLiteralArray(raw.node);
        return localize_1.ɵmakeTemplateObject(cookedStrings, rawStrings);
    }
    exports.unwrapMessagePartsFromLocalizeCall = unwrapMessagePartsFromLocalizeCall;
    function unwrapSubstitutionsFromLocalizeCall(call) {
        var expressions = call.arguments.splice(1);
        if (!isArrayOfExpressions(expressions)) {
            var badExpression = expressions.find(function (expression) { return !t.isExpression(expression); });
            throw new BabelParseError(badExpression, 'Invalid substitutions for `$localize` (expected all substitution arguments to be expressions).');
        }
        return expressions;
    }
    exports.unwrapSubstitutionsFromLocalizeCall = unwrapSubstitutionsFromLocalizeCall;
    function unwrapMessagePartsFromTemplateLiteral(elements) {
        var cooked = elements.map(function (q) {
            if (q.value.cooked === undefined) {
                throw new BabelParseError(q, "Unexpected undefined message part in \"" + elements.map(function (q) { return q.value.cooked; }) + "\"");
            }
            return q.value.cooked;
        });
        var raw = elements.map(function (q) { return q.value.raw; });
        return localize_1.ɵmakeTemplateObject(cooked, raw);
    }
    exports.unwrapMessagePartsFromTemplateLiteral = unwrapMessagePartsFromTemplateLiteral;
    /**
    * Wrap the given `expression` in parentheses if it is a binary expression.
    *
    * This ensures that this expression is evaluated correctly if it is embedded in another expression.
    *
    * @param expression The expression to potentially wrap.
    */
    function wrapInParensIfNecessary(expression) {
        if (t.isBinaryExpression(expression)) {
            return t.parenthesizedExpression(expression);
        }
        else {
            return expression;
        }
    }
    exports.wrapInParensIfNecessary = wrapInParensIfNecessary;
    /**
    * Extract the string values from an `array` of string literals.
    * @param array The array to unwrap.
    */
    function unwrapStringLiteralArray(array) {
        if (!isStringLiteralArray(array)) {
            throw new BabelParseError(array, 'Unexpected messageParts for `$localize` (expected an array of strings).');
        }
        return array.elements.map(function (str) { return str.value; });
    }
    exports.unwrapStringLiteralArray = unwrapStringLiteralArray;
    /**
     * This expression is believed to be a call to a "lazy-load" template object helper function.
     * This is expected to be of the form:
     *
     * ```ts
     *  function _templateObject() {
     *    var e = _taggedTemplateLiteral(['cooked string', 'raw string']);
     *    return _templateObject = function() { return e }, e
     *  }
     * ```
     *
     * We unwrap this to return the call to `_taggedTemplateLiteral()`.
     *
     * @param call the call expression to unwrap
     * @returns the  call expression
     */
    function unwrapLazyLoadHelperCall(call) {
        var callee = call.get('callee');
        if (!callee.isIdentifier()) {
            throw new BabelParseError(callee.node, 'Unexpected lazy-load helper call (expected a call of the form `_templateObject()`).');
        }
        var lazyLoadBinding = call.scope.getBinding(callee.node.name);
        if (!lazyLoadBinding) {
            throw new BabelParseError(callee.node, 'Missing declaration for lazy-load helper function');
        }
        var lazyLoadFn = lazyLoadBinding.path;
        if (!lazyLoadFn.isFunctionDeclaration()) {
            throw new BabelParseError(lazyLoadFn.node, 'Unexpected expression (expected a function declaration');
        }
        var returnedNode = getReturnedExpression(lazyLoadFn);
        if (returnedNode.isCallExpression()) {
            return returnedNode;
        }
        if (returnedNode.isIdentifier()) {
            var identifierName = returnedNode.node.name;
            var declaration = returnedNode.scope.getBinding(identifierName);
            if (declaration === undefined) {
                throw new BabelParseError(returnedNode.node, 'Missing declaration for return value from helper.');
            }
            if (!declaration.path.isVariableDeclarator()) {
                throw new BabelParseError(declaration.path.node, 'Unexpected helper return value declaration (expected a variable declaration).');
            }
            var initializer = declaration.path.get('init');
            if (!initializer.isCallExpression()) {
                throw new BabelParseError(declaration.path.node, 'Unexpected return value from helper (expected a call expression).');
            }
            // Remove the lazy load helper if this is the only reference to it.
            if (lazyLoadBinding.references === 1) {
                lazyLoadFn.remove();
            }
            return initializer;
        }
        return call;
    }
    exports.unwrapLazyLoadHelperCall = unwrapLazyLoadHelperCall;
    function getReturnedExpression(fn) {
        var e_1, _a;
        var bodyStatements = fn.get('body').get('body');
        try {
            for (var bodyStatements_1 = tslib_1.__values(bodyStatements), bodyStatements_1_1 = bodyStatements_1.next(); !bodyStatements_1_1.done; bodyStatements_1_1 = bodyStatements_1.next()) {
                var statement = bodyStatements_1_1.value;
                if (statement.isReturnStatement()) {
                    var argument = statement.get('argument');
                    if (argument.isSequenceExpression()) {
                        var expressions = argument.get('expressions');
                        return Array.isArray(expressions) ? expressions[expressions.length - 1] : expressions;
                    }
                    else if (argument.isExpression()) {
                        return argument;
                    }
                    else {
                        throw new BabelParseError(statement.node, 'Invalid return argument in helper function (expected an expression).');
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (bodyStatements_1_1 && !bodyStatements_1_1.done && (_a = bodyStatements_1.return)) _a.call(bodyStatements_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        throw new BabelParseError(fn.node, 'Missing return statement in helper function.');
    }
    /**
    * Is the given `node` an array of literal strings?
    *
    * @param node The node to test.
    */
    function isStringLiteralArray(node) {
        return t.isArrayExpression(node) && node.elements.every(function (element) { return t.isStringLiteral(element); });
    }
    exports.isStringLiteralArray = isStringLiteralArray;
    /**
    * Are all the given `nodes` expressions?
    * @param nodes The nodes to test.
    */
    function isArrayOfExpressions(nodes) {
        return nodes.every(function (element) { return t.isExpression(element); });
    }
    exports.isArrayOfExpressions = isArrayOfExpressions;
    /**
     * Translate the text of the given message, using the given translations.
     *
     * Logs as warning if the translation is not available
     */
    function translate(diagnostics, translations, messageParts, substitutions, missingTranslation) {
        try {
            return localize_1.ɵtranslate(translations, messageParts, substitutions);
        }
        catch (e) {
            if (localize_1.ɵisMissingTranslationError(e)) {
                if (missingTranslation === 'error') {
                    diagnostics.error(e.message);
                }
                else if (missingTranslation === 'warning') {
                    diagnostics.warn(e.message);
                }
                // Return the parsed message because this will have the meta blocks stripped
                return [
                    localize_1.ɵmakeTemplateObject(e.parsedMessage.messageParts, e.parsedMessage.messageParts),
                    substitutions
                ];
            }
            else {
                diagnostics.error(e.message);
                return [messageParts, substitutions];
            }
        }
    }
    exports.translate = translate;
    var BabelParseError = /** @class */ (function (_super) {
        tslib_1.__extends(BabelParseError, _super);
        function BabelParseError(node, message) {
            var _this = _super.call(this, message) || this;
            _this.node = node;
            _this.type = 'BabelParseError';
            return _this;
        }
        return BabelParseError;
    }(Error));
    exports.BabelParseError = BabelParseError;
    function isBabelParseError(e) {
        return e.type === 'BabelParseError';
    }
    exports.isBabelParseError = isBabelParseError;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX2ZpbGVfdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS9zb3VyY2VfZmlsZXMvc291cmNlX2ZpbGVfdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOENBQWtIO0lBRWxILGdDQUFrQztJQUdsQzs7O09BR0c7SUFDSCxTQUFnQixpQkFBaUIsQ0FDN0IsVUFBb0IsRUFBRSxJQUFZO1FBQ3BDLE9BQU8sVUFBVSxDQUFDLFlBQVksRUFBRSxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQztJQUNwRSxDQUFDO0lBSEQsOENBR0M7SUFFRDs7O01BR0U7SUFDRixTQUFnQixrQkFBa0IsQ0FBQyxVQUFrQztRQUNuRSxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakYsQ0FBQztJQUZELGdEQUVDO0lBRUQ7Ozs7TUFJRTtJQUNGLFNBQWdCLHdCQUF3QixDQUNwQyxZQUFrQyxFQUFFLGFBQXNDO1FBQzVFLElBQUksWUFBWSxHQUFpQixDQUFDLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzVDLFlBQVk7Z0JBQ1IsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxZQUFZLEVBQUUsdUJBQXVCLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFD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QUN0QztTQUNGO0lBQ0gsQ0FBQztJQXZCRCw4QkF1QkM7SUFFRDtRQUFxQywyQ0FBSztRQUV4Qyx5QkFBbUIsSUFBWSxFQUFFLE9BQWU7WUFBaEQsWUFBb0Qsa0JBQU0sT0FBTyxDQUFDLFNBQUc7WUFBbEQsVUFBSSxHQUFKLElBQUksQ0FBUTtZQURkLFVBQUksR0FBRyxpQkFBaUIsQ0FBQzs7UUFDMEIsQ0FBQztRQUN2RSxzQkFBQztJQUFELENBQUMsQUFIRCxDQUFxQyxLQUFLLEdBR3pDO0lBSFksMENBQWU7SUFLNUIsU0FBZ0IsaUJBQWlCLENBQUMsQ0FBTTtRQUN0QyxPQUFPLENBQUMsQ0FBQyxJQUFJLEtBQUssaUJBQWlCLENBQUM7SUFDdEMsQ0FBQztJQUZELDhDQUVDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHvJtVBhcnNlZFRyYW5zbGF0aW9uLCDJtWlzTWlzc2luZ1RyYW5zbGF0aW9uRXJyb3IsIMm1bWFrZVRlbXBsYXRlT2JqZWN0LCDJtXRyYW5zbGF0ZX0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuaW1wb3J0IHtOb2RlUGF0aH0gZnJvbSAnQGJhYmVsL3RyYXZlcnNlJztcbmltcG9ydCAqIGFzIHQgZnJvbSAnQGJhYmVsL3R5cGVzJztcbmltcG9ydCB7RGlhZ25vc3RpY3N9IGZyb20gJy4uLy4uL2RpYWdub3N0aWNzJztcblxuLyoqXG4gKiBJcyB0aGUgZ2l2ZW4gYGV4cHJlc3Npb25gIGFuIGlkZW50aWZpZXIgd2l0aCB0aGUgY29ycmVjdCBuYW1lXG4gKiBAcGFyYW0gZXhwcmVzc2lvbiBUaGUgZXhwcmVzc2lvbiB0byBjaGVjay5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTmFtZWRJZGVudGlmaWVyKFxuICAgIGV4cHJlc3Npb246IE5vZGVQYXRoLCBuYW1lOiBzdHJpbmcpOiBleHByZXNzaW9uIGlzIE5vZGVQYXRoPHQuSWRlbnRpZmllcj4ge1xuICByZXR1cm4gZXhwcmVzc2lvbi5pc0lkZW50aWZpZXIoKSAmJiBleHByZXNzaW9uLm5vZGUubmFtZSA9PT0gbmFtZTtcbn1cblxuLyoqXG4qIElzIHRoZSBnaXZlbiBgaWRlbnRpZmllcmAgZGVjbGFyZWQgZ2xvYmFsbHkuXG4qIEBwYXJhbSBpZGVudGlmaWVyIFRoZSBpZGVudGlmaWVyIHRvIGNoZWNrLlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0dsb2JhbElkZW50aWZpZXIoaWRlbnRpZmllcjogTm9kZVBhdGg8dC5JZGVudGlmaWVyPikge1xuICByZXR1cm4gIWlkZW50aWZpZXIuc2NvcGUgfHwgIWlkZW50aWZpZXIuc2NvcGUuaGFzQmluZGluZyhpZGVudGlmaWVyLm5vZGUubmFtZSk7XG59XG5cbi8qKlxuKiBCdWlsZCBhIHRyYW5zbGF0ZWQgZXhwcmVzc2lvbiB0byByZXBsYWNlIHRoZSBjYWxsIHRvIGAkbG9jYWxpemVgLlxuKiBAcGFyYW0gbWVzc2FnZVBhcnRzIFRoZSBzdGF0aWMgcGFydHMgb2YgdGhlIG1lc3NhZ2UuXG4qIEBwYXJhbSBzdWJzdGl0dXRpb25zIFRoZSBleHByZXNzaW9ucyB0byBzdWJzdGl0dXRlIGludG8gdGhlIG1lc3NhZ2UuXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTG9jYWxpemVSZXBsYWNlbWVudChcbiAgICBtZXNzYWdlUGFydHM6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCBzdWJzdGl0dXRpb25zOiByZWFkb25seSB0LkV4cHJlc3Npb25bXSk6IHQuRXhwcmVzc2lvbiB7XG4gIGxldCBtYXBwZWRTdHJpbmc6IHQuRXhwcmVzc2lvbiA9IHQuc3RyaW5nTGl0ZXJhbChtZXNzYWdlUGFydHNbMF0pO1xuICBmb3IgKGxldCBpID0gMTsgaSA8IG1lc3NhZ2VQYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIG1hcHBlZFN0cmluZyA9XG4gICAgICAgIHQuYmluYXJ5RXhwcmVzc2lvbignKycsIG1hcHBlZFN0cmluZywgd3JhcEluUGFyZW5zSWZOZWNlc3Nhcnkoc3Vic3RpdHV0aW9uc1tpIC0gMV0pKTtcbiAgICBtYXBwZWRTdHJpbmcgPSB0LmJpbmFyeUV4cHJlc3Npb24oJysnLCBtYXBwZWRTdHJpbmcsIHQuc3RyaW5nTGl0ZXJhbChtZXNzYWdlUGFydHNbaV0pKTtcbiAgfVxuICByZXR1cm4gbWFwcGVkU3RyaW5nO1xufVxuXG4vKipcbiogRXh0cmFjdCB0aGUgbWVzc2FnZSBwYXJ0cyBmcm9tIHRoZSBnaXZlbiBgY2FsbGAgKHRvIGAkbG9jYWxpemVgKS5cbipcbiogVGhlIG1lc3NhZ2UgcGFydHMgd2lsbCBlaXRoZXIgYnkgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIHRoZSBgY2FsbGAgb3IgaXQgd2lsbCBiZSB3cmFwcGVkIGluIGNhbGxcbiogdG8gYSBoZWxwZXIgZnVuY3Rpb24gbGlrZSBgX19tYWtlVGVtcGxhdGVPYmplY3RgLlxuKlxuKiBAcGFyYW0gY2FsbCBUaGUgQVNUIG5vZGUgb2YgdGhlIGNhbGwgdG8gcHJvY2Vzcy5cbiovXG5leHBvcnQgZnVuY3Rpb24gdW53cmFwTWVzc2FnZVBhcnRzRnJvbUxvY2FsaXplQ2FsbChjYWxsOiBOb2RlUGF0aDx0LkNhbGxFeHByZXNzaW9uPik6XG4gICAgVGVtcGxhdGVTdHJpbmdzQXJyYXkge1xuICBsZXQgY29va2VkID0gY2FsbC5nZXQoJ2FyZ3VtZW50cycpWzBdO1xuXG4gIGlmIChjb29rZWQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoY2FsbC5ub2RlLCAnYCRsb2NhbGl6ZWAgY2FsbGVkIHdpdGhvdXQgYW55IGFyZ3VtZW50cy4nKTtcbiAgfVxuICBpZiAoIWNvb2tlZC5pc0V4cHJlc3Npb24oKSkge1xuICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgIGNvb2tlZC5ub2RlLCAnVW5leHBlY3RlZCBhcmd1bWVudCB0byBgJGxvY2FsaXplYCAoZXhwZWN0ZWQgYW4gYXJyYXkpLicpO1xuICB9XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gY2FsbCB0byBgX19tYWtlVGVtcGxhdGVPYmplY3QoLi4uKWAsIHRoZW4gYHJhd2AgbXVzdCBiZSB0aGUgc2FtZSBhcyBgY29va2VkYC5cbiAgbGV0IHJhdyA9IGNvb2tlZDtcblxuICAvLyBDaGVjayBmb3IgY2FjaGVkIGNhbGwgb2YgdGhlIGZvcm0gYHggfHwgeCA9IF9fbWFrZVRlbXBsYXRlT2JqZWN0KC4uLilgXG4gIGlmIChjb29rZWQuaXNMb2dpY2FsRXhwcmVzc2lvbigpICYmIGNvb2tlZC5ub2RlLm9wZXJhdG9yID09PSAnfHwnICYmXG4gICAgICBjb29rZWQuZ2V0KCdsZWZ0JykuaXNJZGVudGlmaWVyKCkpIHtcbiAgICBjb25zdCByaWdodCA9IGNvb2tlZC5nZXQoJ3JpZ2h0Jyk7XG4gICAgaWYgKHJpZ2h0LmlzQXNzaWdubWVudEV4cHJlc3Npb24oKSkge1xuICAgICAgY29va2VkID0gcmlnaHQuZ2V0KCdyaWdodCcpO1xuICAgICAgaWYgKCFjb29rZWQuaXNFeHByZXNzaW9uKCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICAgIGNvb2tlZC5ub2RlLCAnVW5leHBlY3RlZCBcIm1ha2VUZW1wbGF0ZU9iamVjdCgpXCIgZnVuY3Rpb24gKGV4cGVjdGVkIGFuIGV4cHJlc3Npb24pLicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENoZWNrIGZvciBgX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpYCBvciBgX190ZW1wbGF0ZU9iamVjdCgpYCBjYWxscy5cbiAgaWYgKGNvb2tlZC5pc0NhbGxFeHByZXNzaW9uKCkpIHtcbiAgICBsZXQgY2FsbCA9IGNvb2tlZDtcbiAgICBpZiAoY2FsbC5nZXQoJ2FyZ3VtZW50cycpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gTm8gYXJndW1lbnRzIHNvIHBlcmhhcHMgaXQgaXMgYSBgX190ZW1wbGF0ZU9iamVjdCgpYCBjYWxsLlxuICAgICAgLy8gVW53cmFwIHRoaXMgdG8gZ2V0IHRoZSBgX3RhZ2dlZFRlbXBsYXRlTGl0ZXJhbChjb29rZWQsIHJhdylgIGNhbGwuXG4gICAgICBjYWxsID0gdW53cmFwTGF6eUxvYWRIZWxwZXJDYWxsKGNhbGwpO1xuICAgIH1cblxuICAgIGNvb2tlZCA9IGNhbGwuZ2V0KCdhcmd1bWVudHMnKVswXTtcbiAgICBpZiAoIWNvb2tlZC5pc0V4cHJlc3Npb24oKSkge1xuICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICBjb29rZWQubm9kZSxcbiAgICAgICAgICAnVW5leHBlY3RlZCBgY29va2VkYCBhcmd1bWVudCB0byB0aGUgXCJtYWtlVGVtcGxhdGVPYmplY3QoKVwiIGZ1bmN0aW9uIChleHBlY3RlZCBhbiBleHByZXNzaW9uKS4nKTtcbiAgICB9XG4gICAgY29uc3QgYXJnMiA9IGNhbGwuZ2V0KCdhcmd1bWVudHMnKVsxXTtcbiAgICBpZiAoYXJnMiAmJiAhYXJnMi5pc0V4cHJlc3Npb24oKSkge1xuICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICBhcmcyLm5vZGUsXG4gICAgICAgICAgJ1VuZXhwZWN0ZWQgYHJhd2AgYXJndW1lbnQgdG8gdGhlIFwibWFrZVRlbXBsYXRlT2JqZWN0KClcIiBmdW5jdGlvbiAoZXhwZWN0ZWQgYW4gZXhwcmVzc2lvbikuJyk7XG4gICAgfVxuICAgIC8vIElmIHRoZXJlIGlzIG5vIHNlY29uZCBhcmd1bWVudCB0aGVuIGFzc3VtZSB0aGF0IHJhdyBhbmQgY29va2VkIGFyZSB0aGUgc2FtZVxuICAgIHJhdyA9IGFyZzIgIT09IHVuZGVmaW5lZCA/IGFyZzIgOiBjb29rZWQ7XG4gIH1cblxuICBjb25zdCBjb29rZWRTdHJpbmdzID0gdW53cmFwU3RyaW5nTGl0ZXJhbEFycmF5KGNvb2tlZC5ub2RlKTtcbiAgY29uc3QgcmF3U3RyaW5ncyA9IHVud3JhcFN0cmluZ0xpdGVyYWxBcnJheShyYXcubm9kZSk7XG4gIHJldHVybiDJtW1ha2VUZW1wbGF0ZU9iamVjdChjb29rZWRTdHJpbmdzLCByYXdTdHJpbmdzKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gdW53cmFwU3Vic3RpdHV0aW9uc0Zyb21Mb2NhbGl6ZUNhbGwoY2FsbDogdC5DYWxsRXhwcmVzc2lvbik6IHQuRXhwcmVzc2lvbltdIHtcbiAgY29uc3QgZXhwcmVzc2lvbnMgPSBjYWxsLmFyZ3VtZW50cy5zcGxpY2UoMSk7XG4gIGlmICghaXNBcnJheU9mRXhwcmVzc2lvbnMoZXhwcmVzc2lvbnMpKSB7XG4gICAgY29uc3QgYmFkRXhwcmVzc2lvbiA9IGV4cHJlc3Npb25zLmZpbmQoZXhwcmVzc2lvbiA9PiAhdC5pc0V4cHJlc3Npb24oZXhwcmVzc2lvbikpICE7XG4gICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgYmFkRXhwcmVzc2lvbixcbiAgICAgICAgJ0ludmFsaWQgc3Vic3RpdHV0aW9ucyBmb3IgYCRsb2NhbGl6ZWAgKGV4cGVjdGVkIGFsbCBzdWJzdGl0dXRpb24gYXJndW1lbnRzIHRvIGJlIGV4cHJlc3Npb25zKS4nKTtcbiAgfVxuICByZXR1cm4gZXhwcmVzc2lvbnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bndyYXBNZXNzYWdlUGFydHNGcm9tVGVtcGxhdGVMaXRlcmFsKGVsZW1lbnRzOiB0LlRlbXBsYXRlRWxlbWVudFtdKTpcbiAgICBUZW1wbGF0ZVN0cmluZ3NBcnJheSB7XG4gIGNvbnN0IGNvb2tlZCA9IGVsZW1lbnRzLm1hcChxID0+IHtcbiAgICBpZiAocS52YWx1ZS5jb29rZWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICBxLCBgVW5leHBlY3RlZCB1bmRlZmluZWQgbWVzc2FnZSBwYXJ0IGluIFwiJHtlbGVtZW50cy5tYXAocSA9PiBxLnZhbHVlLmNvb2tlZCl9XCJgKTtcbiAgICB9XG4gICAgcmV0dXJuIHEudmFsdWUuY29va2VkO1xuICB9KTtcbiAgY29uc3QgcmF3ID0gZWxlbWVudHMubWFwKHEgPT4gcS52YWx1ZS5yYXcpO1xuICByZXR1cm4gybVtYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpO1xufVxuXG4vKipcbiogV3JhcCB0aGUgZ2l2ZW4gYGV4cHJlc3Npb25gIGluIHBhcmVudGhlc2VzIGlmIGl0IGlzIGEgYmluYXJ5IGV4cHJlc3Npb24uXG4qXG4qIFRoaXMgZW5zdXJlcyB0aGF0IHRoaXMgZXhwcmVzc2lvbiBpcyBldmFsdWF0ZWQgY29ycmVjdGx5IGlmIGl0IGlzIGVtYmVkZGVkIGluIGFub3RoZXIgZXhwcmVzc2lvbi5cbipcbiogQHBhcmFtIGV4cHJlc3Npb24gVGhlIGV4cHJlc3Npb24gdG8gcG90ZW50aWFsbHkgd3JhcC5cbiovXG5leHBvcnQgZnVuY3Rpb24gd3JhcEluUGFyZW5zSWZOZWNlc3NhcnkoZXhwcmVzc2lvbjogdC5FeHByZXNzaW9uKTogdC5FeHByZXNzaW9uIHtcbiAgaWYgKHQuaXNCaW5hcnlFeHByZXNzaW9uKGV4cHJlc3Npb24pKSB7XG4gICAgcmV0dXJuIHQucGFyZW50aGVzaXplZEV4cHJlc3Npb24oZXhwcmVzc2lvbik7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGV4cHJlc3Npb247XG4gIH1cbn1cblxuLyoqXG4qIEV4dHJhY3QgdGhlIHN0cmluZyB2YWx1ZXMgZnJvbSBhbiBgYXJyYXlgIG9mIHN0cmluZyBsaXRlcmFscy5cbiogQHBhcmFtIGFycmF5IFRoZSBhcnJheSB0byB1bndyYXAuXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIHVud3JhcFN0cmluZ0xpdGVyYWxBcnJheShhcnJheTogdC5FeHByZXNzaW9uKTogc3RyaW5nW10ge1xuICBpZiAoIWlzU3RyaW5nTGl0ZXJhbEFycmF5KGFycmF5KSkge1xuICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgIGFycmF5LCAnVW5leHBlY3RlZCBtZXNzYWdlUGFydHMgZm9yIGAkbG9jYWxpemVgIChleHBlY3RlZCBhbiBhcnJheSBvZiBzdHJpbmdzKS4nKTtcbiAgfVxuICByZXR1cm4gYXJyYXkuZWxlbWVudHMubWFwKChzdHI6IHQuU3RyaW5nTGl0ZXJhbCkgPT4gc3RyLnZhbHVlKTtcbn1cblxuLyoqXG4gKiBUaGlzIGV4cHJlc3Npb24gaXMgYmVsaWV2ZWQgdG8gYmUgYSBjYWxsIHRvIGEgXCJsYXp5LWxvYWRcIiB0ZW1wbGF0ZSBvYmplY3QgaGVscGVyIGZ1bmN0aW9uLlxuICogVGhpcyBpcyBleHBlY3RlZCB0byBiZSBvZiB0aGUgZm9ybTpcbiAqXG4gKiBgYGB0c1xuICogIGZ1bmN0aW9uIF90ZW1wbGF0ZU9iamVjdCgpIHtcbiAqICAgIHZhciBlID0gX3RhZ2dlZFRlbXBsYXRlTGl0ZXJhbChbJ2Nvb2tlZCBzdHJpbmcnLCAncmF3IHN0cmluZyddKTtcbiAqICAgIHJldHVybiBfdGVtcGxhdGVPYmplY3QgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGUgfSwgZVxuICogIH1cbiAqIGBgYFxuICpcbiAqIFdlIHVud3JhcCB0aGlzIHRvIHJldHVybiB0aGUgY2FsbCB0byBgX3RhZ2dlZFRlbXBsYXRlTGl0ZXJhbCgpYC5cbiAqXG4gKiBAcGFyYW0gY2FsbCB0aGUgY2FsbCBleHByZXNzaW9uIHRvIHVud3JhcFxuICogQHJldHVybnMgdGhlICBjYWxsIGV4cHJlc3Npb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVud3JhcExhenlMb2FkSGVscGVyQ2FsbChjYWxsOiBOb2RlUGF0aDx0LkNhbGxFeHByZXNzaW9uPik6XG4gICAgTm9kZVBhdGg8dC5DYWxsRXhwcmVzc2lvbj4ge1xuICBjb25zdCBjYWxsZWUgPSBjYWxsLmdldCgnY2FsbGVlJyk7XG4gIGlmICghY2FsbGVlLmlzSWRlbnRpZmllcigpKSB7XG4gICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgY2FsbGVlLm5vZGUsXG4gICAgICAgICdVbmV4cGVjdGVkIGxhenktbG9hZCBoZWxwZXIgY2FsbCAoZXhwZWN0ZWQgYSBjYWxsIG9mIHRoZSBmb3JtIGBfdGVtcGxhdGVPYmplY3QoKWApLicpO1xuICB9XG4gIGNvbnN0IGxhenlMb2FkQmluZGluZyA9IGNhbGwuc2NvcGUuZ2V0QmluZGluZyhjYWxsZWUubm9kZS5uYW1lKTtcbiAgaWYgKCFsYXp5TG9hZEJpbmRpbmcpIHtcbiAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKGNhbGxlZS5ub2RlLCAnTWlzc2luZyBkZWNsYXJhdGlvbiBmb3IgbGF6eS1sb2FkIGhlbHBlciBmdW5jdGlvbicpO1xuICB9XG4gIGNvbnN0IGxhenlMb2FkRm4gPSBsYXp5TG9hZEJpbmRpbmcucGF0aDtcbiAgaWYgKCFsYXp5TG9hZEZuLmlzRnVuY3Rpb25EZWNsYXJhdGlvbigpKSB7XG4gICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgbGF6eUxvYWRGbi5ub2RlLCAnVW5leHBlY3RlZCBleHByZXNzaW9uIChleHBlY3RlZCBhIGZ1bmN0aW9uIGRlY2xhcmF0aW9uJyk7XG4gIH1cbiAgY29uc3QgcmV0dXJuZWROb2RlID0gZ2V0UmV0dXJuZWRFeHByZXNzaW9uKGxhenlMb2FkRm4pO1xuXG4gIGlmIChyZXR1cm5lZE5vZGUuaXNDYWxsRXhwcmVzc2lvbigpKSB7XG4gICAgcmV0dXJuIHJldHVybmVkTm9kZTtcbiAgfVxuXG4gIGlmIChyZXR1cm5lZE5vZGUuaXNJZGVudGlmaWVyKCkpIHtcbiAgICBjb25zdCBpZGVudGlmaWVyTmFtZSA9IHJldHVybmVkTm9kZS5ub2RlLm5hbWU7XG4gICAgY29uc3QgZGVjbGFyYXRpb24gPSByZXR1cm5lZE5vZGUuc2NvcGUuZ2V0QmluZGluZyhpZGVudGlmaWVyTmFtZSk7XG4gICAgaWYgKGRlY2xhcmF0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgICAgcmV0dXJuZWROb2RlLm5vZGUsICdNaXNzaW5nIGRlY2xhcmF0aW9uIGZvciByZXR1cm4gdmFsdWUgZnJvbSBoZWxwZXIuJyk7XG4gICAgfVxuICAgIGlmICghZGVjbGFyYXRpb24ucGF0aC5pc1ZhcmlhYmxlRGVjbGFyYXRvcigpKSB7XG4gICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICAgIGRlY2xhcmF0aW9uLnBhdGgubm9kZSxcbiAgICAgICAgICAnVW5leHBlY3RlZCBoZWxwZXIgcmV0dXJuIHZhbHVlIGRlY2xhcmF0aW9uIChleHBlY3RlZCBhIHZhcmlhYmxlIGRlY2xhcmF0aW9uKS4nKTtcbiAgICB9XG4gICAgY29uc3QgaW5pdGlhbGl6ZXIgPSBkZWNsYXJhdGlvbi5wYXRoLmdldCgnaW5pdCcpO1xuICAgIGlmICghaW5pdGlhbGl6ZXIuaXNDYWxsRXhwcmVzc2lvbigpKSB7XG4gICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICAgIGRlY2xhcmF0aW9uLnBhdGgubm9kZSxcbiAgICAgICAgICAnVW5leHBlY3RlZCByZXR1cm4gdmFsdWUgZnJvbSBoZWxwZXIgKGV4cGVjdGVkIGEgY2FsbCBleHByZXNzaW9uKS4nKTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgdGhlIGxhenkgbG9hZCBoZWxwZXIgaWYgdGhpcyBpcyB0aGUgb25seSByZWZlcmVuY2UgdG8gaXQuXG4gICAgaWYgKGxhenlMb2FkQmluZGluZy5yZWZlcmVuY2VzID09PSAxKSB7XG4gICAgICBsYXp5TG9hZEZuLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBpbml0aWFsaXplcjtcbiAgfVxuICByZXR1cm4gY2FsbDtcbn1cblxuZnVuY3Rpb24gZ2V0UmV0dXJuZWRFeHByZXNzaW9uKGZuOiBOb2RlUGF0aDx0LkZ1bmN0aW9uRGVjbGFyYXRpb24+KTogTm9kZVBhdGg8dC5FeHByZXNzaW9uPiB7XG4gIGNvbnN0IGJvZHlTdGF0ZW1lbnRzID0gZm4uZ2V0KCdib2R5JykuZ2V0KCdib2R5Jyk7XG4gIGZvciAoY29uc3Qgc3RhdGVtZW50IG9mIGJvZHlTdGF0ZW1lbnRzKSB7XG4gICAgaWYgKHN0YXRlbWVudC5pc1JldHVyblN0YXRlbWVudCgpKSB7XG4gICAgICBjb25zdCBhcmd1bWVudCA9IHN0YXRlbWVudC5nZXQoJ2FyZ3VtZW50Jyk7XG4gICAgICBpZiAoYXJndW1lbnQuaXNTZXF1ZW5jZUV4cHJlc3Npb24oKSkge1xuICAgICAgICBjb25zdCBleHByZXNzaW9ucyA9IGFyZ3VtZW50LmdldCgnZXhwcmVzc2lvbnMnKTtcbiAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoZXhwcmVzc2lvbnMpID8gZXhwcmVzc2lvbnNbZXhwcmVzc2lvbnMubGVuZ3RoIC0gMV0gOiBleHByZXNzaW9ucztcbiAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnQuaXNFeHByZXNzaW9uKCkpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICAgIHN0YXRlbWVudC5ub2RlLCAnSW52YWxpZCByZXR1cm4gYXJndW1lbnQgaW4gaGVscGVyIGZ1bmN0aW9uIChleHBlY3RlZCBhbiBleHByZXNzaW9uKS4nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihmbi5ub2RlLCAnTWlzc2luZyByZXR1cm4gc3RhdGVtZW50IGluIGhlbHBlciBmdW5jdGlvbi4nKTtcbn1cblxuLyoqXG4qIElzIHRoZSBnaXZlbiBgbm9kZWAgYW4gYXJyYXkgb2YgbGl0ZXJhbCBzdHJpbmdzP1xuKlxuKiBAcGFyYW0gbm9kZSBUaGUgbm9kZSB0byB0ZXN0LlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1N0cmluZ0xpdGVyYWxBcnJheShub2RlOiB0Lk5vZGUpOiBub2RlIGlzIHQuRXhwcmVzc2lvbiZcbiAgICB7ZWxlbWVudHM6IHQuU3RyaW5nTGl0ZXJhbFtdfSB7XG4gIHJldHVybiB0LmlzQXJyYXlFeHByZXNzaW9uKG5vZGUpICYmIG5vZGUuZWxlbWVudHMuZXZlcnkoZWxlbWVudCA9PiB0LmlzU3RyaW5nTGl0ZXJhbChlbGVtZW50KSk7XG59XG5cbi8qKlxuKiBBcmUgYWxsIHRoZSBnaXZlbiBgbm9kZXNgIGV4cHJlc3Npb25zP1xuKiBAcGFyYW0gbm9kZXMgVGhlIG5vZGVzIHRvIHRlc3QuXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXlPZkV4cHJlc3Npb25zKG5vZGVzOiB0Lk5vZGVbXSk6IG5vZGVzIGlzIHQuRXhwcmVzc2lvbltdIHtcbiAgcmV0dXJuIG5vZGVzLmV2ZXJ5KGVsZW1lbnQgPT4gdC5pc0V4cHJlc3Npb24oZWxlbWVudCkpO1xufVxuXG4vKiogT3B0aW9ucyB0aGF0IGFmZmVjdCBob3cgdGhlIGBtYWtlRXNYWFhUcmFuc2xhdGVQbHVnaW4oKWAgZnVuY3Rpb25zIHdvcmsuICovXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zbGF0ZVBsdWdpbk9wdGlvbnMge1xuICBtaXNzaW5nVHJhbnNsYXRpb24/OiBNaXNzaW5nVHJhbnNsYXRpb25TdHJhdGVneTtcbiAgbG9jYWxpemVOYW1lPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEhvdyB0byBoYW5kbGUgbWlzc2luZyB0cmFuc2xhdGlvbnMuXG4gKi9cbmV4cG9ydCB0eXBlIE1pc3NpbmdUcmFuc2xhdGlvblN0cmF0ZWd5ID0gJ2Vycm9yJyB8ICd3YXJuaW5nJyB8ICdpZ25vcmUnO1xuXG4vKipcbiAqIFRyYW5zbGF0ZSB0aGUgdGV4dCBvZiB0aGUgZ2l2ZW4gbWVzc2FnZSwgdXNpbmcgdGhlIGdpdmVuIHRyYW5zbGF0aW9ucy5cbiAqXG4gKiBMb2dzIGFzIHdhcm5pbmcgaWYgdGhlIHRyYW5zbGF0aW9uIGlzIG5vdCBhdmFpbGFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zbGF0ZShcbiAgICBkaWFnbm9zdGljczogRGlhZ25vc3RpY3MsIHRyYW5zbGF0aW9uczogUmVjb3JkPHN0cmluZywgybVQYXJzZWRUcmFuc2xhdGlvbj4sXG4gICAgbWVzc2FnZVBhcnRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgc3Vic3RpdHV0aW9uczogcmVhZG9ubHkgYW55W10sXG4gICAgbWlzc2luZ1RyYW5zbGF0aW9uOiBNaXNzaW5nVHJhbnNsYXRpb25TdHJhdGVneSk6IFtUZW1wbGF0ZVN0cmluZ3NBcnJheSwgcmVhZG9ubHkgYW55W11dIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gybV0cmFuc2xhdGUodHJhbnNsYXRpb25zLCBtZXNzYWdlUGFydHMsIHN1YnN0aXR1dGlvbnMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKMm1aXNNaXNzaW5nVHJhbnNsYXRpb25FcnJvcihlKSkge1xuICAgICAgaWYgKG1pc3NpbmdUcmFuc2xhdGlvbiA9PT0gJ2Vycm9yJykge1xuICAgICAgICBkaWFnbm9zdGljcy5lcnJvcihlLm1lc3NhZ2UpO1xuICAgICAgfSBlbHNlIGlmIChtaXNzaW5nVHJhbnNsYXRpb24gPT09ICd3YXJuaW5nJykge1xuICAgICAgICBkaWFnbm9zdGljcy53YXJuKGUubWVzc2FnZSk7XG4gICAgICB9XG4gICAgICAvLyBSZXR1cm4gdGhlIHBhcnNlZCBtZXNzYWdlIGJlY2F1c2UgdGhpcyB3aWxsIGhhdmUgdGhlIG1ldGEgYmxvY2tzIHN0cmlwcGVkXG4gICAgICByZXR1cm4gW1xuICAgICAgICDJtW1ha2VUZW1wbGF0ZU9iamVjdChlLnBhcnNlZE1lc3NhZ2UubWVzc2FnZVBhcnRzLCBlLnBhcnNlZE1lc3NhZ2UubWVzc2FnZVBhcnRzKSxcbiAgICAgICAgc3Vic3RpdHV0aW9uc1xuICAgICAgXTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGlhZ25vc3RpY3MuZXJyb3IoZS5tZXNzYWdlKTtcbiAgICAgIHJldHVybiBbbWVzc2FnZVBhcnRzLCBzdWJzdGl0dXRpb25zXTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEJhYmVsUGFyc2VFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgcHJpdmF0ZSByZWFkb25seSB0eXBlID0gJ0JhYmVsUGFyc2VFcnJvcic7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBub2RlOiB0Lk5vZGUsIG1lc3NhZ2U6IHN0cmluZykgeyBzdXBlcihtZXNzYWdlKTsgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNCYWJlbFBhcnNlRXJyb3IoZTogYW55KTogZSBpcyBCYWJlbFBhcnNlRXJyb3Ige1xuICByZXR1cm4gZS50eXBlID09PSAnQmFiZWxQYXJzZUVycm9yJztcbn1cbiJdfQ==
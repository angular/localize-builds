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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX2ZpbGVfdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS9zb3VyY2VfZmlsZXMvc291cmNlX2ZpbGVfdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOENBQWtIO0lBRWxILGdDQUFrQztJQUdsQzs7O09BR0c7SUFDSCxTQUFnQixpQkFBaUIsQ0FDN0IsVUFBa0MsRUFBRSxJQUFZO1FBQ2xELE9BQU8sVUFBVSxDQUFDLFlBQVksRUFBRSxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQztJQUNwRSxDQUFDO0lBSEQsOENBR0M7SUFFRDs7O01BR0U7SUFDRixTQUFnQixrQkFBa0IsQ0FBQyxVQUFrQztRQUNuRSxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakYsQ0FBQztJQUZELGdEQUVDO0lBRUQ7Ozs7TUFJRTtJQUNGLFNBQWdCLHdCQUF3QixDQUNwQyxZQUFrQyxFQUFFLGFBQXNDO1FBQzVFLElBQUksWUFBWSxHQUFpQixDQUFDLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzVDLFlBQVk7Z0JBQ1IsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxZQUFZLEVBQUUsdUJBQXVCLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFD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QUN0QztTQUNGO0lBQ0gsQ0FBQztJQXZCRCw4QkF1QkM7SUFFRDtRQUFxQywyQ0FBSztRQUV4Qyx5QkFBbUIsSUFBZ0IsRUFBRSxPQUFlO1lBQXBELFlBQXdELGtCQUFNLE9BQU8sQ0FBQyxTQUFHO1lBQXRELFVBQUksR0FBSixJQUFJLENBQVk7WUFEbEIsVUFBSSxHQUFHLGlCQUFpQixDQUFDOztRQUM4QixDQUFDO1FBQzNFLHNCQUFDO0lBQUQsQ0FBQyxBQUhELENBQXFDLEtBQUssR0FHekM7SUFIWSwwQ0FBZTtJQUs1QixTQUFnQixpQkFBaUIsQ0FBQyxDQUFNO1FBQ3RDLE9BQU8sQ0FBQyxDQUFDLElBQUksS0FBSyxpQkFBaUIsQ0FBQztJQUN0QyxDQUFDO0lBRkQsOENBRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge8m1UGFyc2VkVHJhbnNsYXRpb24sIMm1aXNNaXNzaW5nVHJhbnNsYXRpb25FcnJvciwgybVtYWtlVGVtcGxhdGVPYmplY3QsIMm1dHJhbnNsYXRlfSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5pbXBvcnQge05vZGVQYXRofSBmcm9tICdAYmFiZWwvdHJhdmVyc2UnO1xuaW1wb3J0ICogYXMgdCBmcm9tICdAYmFiZWwvdHlwZXMnO1xuaW1wb3J0IHtEaWFnbm9zdGljc30gZnJvbSAnLi4vLi4vZGlhZ25vc3RpY3MnO1xuXG4vKipcbiAqIElzIHRoZSBnaXZlbiBgZXhwcmVzc2lvbmAgYW4gaWRlbnRpZmllciB3aXRoIHRoZSBjb3JyZWN0IG5hbWVcbiAqIEBwYXJhbSBleHByZXNzaW9uIFRoZSBleHByZXNzaW9uIHRvIGNoZWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNOYW1lZElkZW50aWZpZXIoXG4gICAgZXhwcmVzc2lvbjogTm9kZVBhdGg8dC5FeHByZXNzaW9uPiwgbmFtZTogc3RyaW5nKTogZXhwcmVzc2lvbiBpcyBOb2RlUGF0aDx0LklkZW50aWZpZXI+IHtcbiAgcmV0dXJuIGV4cHJlc3Npb24uaXNJZGVudGlmaWVyKCkgJiYgZXhwcmVzc2lvbi5ub2RlLm5hbWUgPT09IG5hbWU7XG59XG5cbi8qKlxuKiBJcyB0aGUgZ2l2ZW4gYGlkZW50aWZpZXJgIGRlY2xhcmVkIGdsb2JhbGx5LlxuKiBAcGFyYW0gaWRlbnRpZmllciBUaGUgaWRlbnRpZmllciB0byBjaGVjay5cbiovXG5leHBvcnQgZnVuY3Rpb24gaXNHbG9iYWxJZGVudGlmaWVyKGlkZW50aWZpZXI6IE5vZGVQYXRoPHQuSWRlbnRpZmllcj4pIHtcbiAgcmV0dXJuICFpZGVudGlmaWVyLnNjb3BlIHx8ICFpZGVudGlmaWVyLnNjb3BlLmhhc0JpbmRpbmcoaWRlbnRpZmllci5ub2RlLm5hbWUpO1xufVxuXG4vKipcbiogQnVpbGQgYSB0cmFuc2xhdGVkIGV4cHJlc3Npb24gdG8gcmVwbGFjZSB0aGUgY2FsbCB0byBgJGxvY2FsaXplYC5cbiogQHBhcmFtIG1lc3NhZ2VQYXJ0cyBUaGUgc3RhdGljIHBhcnRzIG9mIHRoZSBtZXNzYWdlLlxuKiBAcGFyYW0gc3Vic3RpdHV0aW9ucyBUaGUgZXhwcmVzc2lvbnMgdG8gc3Vic3RpdHV0ZSBpbnRvIHRoZSBtZXNzYWdlLlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZExvY2FsaXplUmVwbGFjZW1lbnQoXG4gICAgbWVzc2FnZVBhcnRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgc3Vic3RpdHV0aW9uczogcmVhZG9ubHkgdC5FeHByZXNzaW9uW10pOiB0LkV4cHJlc3Npb24ge1xuICBsZXQgbWFwcGVkU3RyaW5nOiB0LkV4cHJlc3Npb24gPSB0LnN0cmluZ0xpdGVyYWwobWVzc2FnZVBhcnRzWzBdKTtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBtZXNzYWdlUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBtYXBwZWRTdHJpbmcgPVxuICAgICAgICB0LmJpbmFyeUV4cHJlc3Npb24oJysnLCBtYXBwZWRTdHJpbmcsIHdyYXBJblBhcmVuc0lmTmVjZXNzYXJ5KHN1YnN0aXR1dGlvbnNbaSAtIDFdKSk7XG4gICAgbWFwcGVkU3RyaW5nID0gdC5iaW5hcnlFeHByZXNzaW9uKCcrJywgbWFwcGVkU3RyaW5nLCB0LnN0cmluZ0xpdGVyYWwobWVzc2FnZVBhcnRzW2ldKSk7XG4gIH1cbiAgcmV0dXJuIG1hcHBlZFN0cmluZztcbn1cblxuLyoqXG4qIEV4dHJhY3QgdGhlIG1lc3NhZ2UgcGFydHMgZnJvbSB0aGUgZ2l2ZW4gYGNhbGxgICh0byBgJGxvY2FsaXplYCkuXG4qXG4qIFRoZSBtZXNzYWdlIHBhcnRzIHdpbGwgZWl0aGVyIGJ5IHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgYGNhbGxgIG9yIGl0IHdpbGwgYmUgd3JhcHBlZCBpbiBjYWxsXG4qIHRvIGEgaGVscGVyIGZ1bmN0aW9uIGxpa2UgYF9fbWFrZVRlbXBsYXRlT2JqZWN0YC5cbipcbiogQHBhcmFtIGNhbGwgVGhlIEFTVCBub2RlIG9mIHRoZSBjYWxsIHRvIHByb2Nlc3MuXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIHVud3JhcE1lc3NhZ2VQYXJ0c0Zyb21Mb2NhbGl6ZUNhbGwoY2FsbDogTm9kZVBhdGg8dC5DYWxsRXhwcmVzc2lvbj4pOlxuICAgIFRlbXBsYXRlU3RyaW5nc0FycmF5IHtcbiAgbGV0IGNvb2tlZCA9IGNhbGwuZ2V0KCdhcmd1bWVudHMnKVswXTtcblxuICBpZiAoY29va2VkID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKGNhbGwubm9kZSwgJ2AkbG9jYWxpemVgIGNhbGxlZCB3aXRob3V0IGFueSBhcmd1bWVudHMuJyk7XG4gIH1cbiAgaWYgKCFjb29rZWQuaXNFeHByZXNzaW9uKCkpIHtcbiAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICBjb29rZWQubm9kZSwgJ1VuZXhwZWN0ZWQgYXJndW1lbnQgdG8gYCRsb2NhbGl6ZWAgKGV4cGVjdGVkIGFuIGFycmF5KS4nKTtcbiAgfVxuXG4gIC8vIElmIHRoZXJlIGlzIG5vIGNhbGwgdG8gYF9fbWFrZVRlbXBsYXRlT2JqZWN0KC4uLilgLCB0aGVuIGByYXdgIG11c3QgYmUgdGhlIHNhbWUgYXMgYGNvb2tlZGAuXG4gIGxldCByYXcgPSBjb29rZWQ7XG5cbiAgLy8gQ2hlY2sgZm9yIGNhY2hlZCBjYWxsIG9mIHRoZSBmb3JtIGB4IHx8IHggPSBfX21ha2VUZW1wbGF0ZU9iamVjdCguLi4pYFxuICBpZiAoY29va2VkLmlzTG9naWNhbEV4cHJlc3Npb24oKSAmJiBjb29rZWQubm9kZS5vcGVyYXRvciA9PT0gJ3x8JyAmJlxuICAgICAgY29va2VkLmdldCgnbGVmdCcpLmlzSWRlbnRpZmllcigpKSB7XG4gICAgY29uc3QgcmlnaHQgPSBjb29rZWQuZ2V0KCdyaWdodCcpO1xuICAgIGlmIChyaWdodC5pc0Fzc2lnbm1lbnRFeHByZXNzaW9uKCkpIHtcbiAgICAgIGNvb2tlZCA9IHJpZ2h0LmdldCgncmlnaHQnKTtcbiAgICAgIGlmICghY29va2VkLmlzRXhwcmVzc2lvbigpKSB7XG4gICAgICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgICAgICBjb29rZWQubm9kZSwgJ1VuZXhwZWN0ZWQgXCJtYWtlVGVtcGxhdGVPYmplY3QoKVwiIGZ1bmN0aW9uIChleHBlY3RlZCBhbiBleHByZXNzaW9uKS4nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDaGVjayBmb3IgYF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KWAgb3IgYF9fdGVtcGxhdGVPYmplY3QoKWAgY2FsbHMuXG4gIGlmIChjb29rZWQuaXNDYWxsRXhwcmVzc2lvbigpKSB7XG4gICAgbGV0IGNhbGwgPSBjb29rZWQ7XG4gICAgaWYgKGNhbGwuZ2V0KCdhcmd1bWVudHMnKS5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIE5vIGFyZ3VtZW50cyBzbyBwZXJoYXBzIGl0IGlzIGEgYF9fdGVtcGxhdGVPYmplY3QoKWAgY2FsbC5cbiAgICAgIC8vIFVud3JhcCB0aGlzIHRvIGdldCB0aGUgYF90YWdnZWRUZW1wbGF0ZUxpdGVyYWwoY29va2VkLCByYXcpYCBjYWxsLlxuICAgICAgY2FsbCA9IHVud3JhcExhenlMb2FkSGVscGVyQ2FsbChjYWxsKTtcbiAgICB9XG5cbiAgICBjb29rZWQgPSBjYWxsLmdldCgnYXJndW1lbnRzJylbMF07XG4gICAgaWYgKCFjb29rZWQuaXNFeHByZXNzaW9uKCkpIHtcbiAgICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgICAgY29va2VkLm5vZGUsXG4gICAgICAgICAgJ1VuZXhwZWN0ZWQgYGNvb2tlZGAgYXJndW1lbnQgdG8gdGhlIFwibWFrZVRlbXBsYXRlT2JqZWN0KClcIiBmdW5jdGlvbiAoZXhwZWN0ZWQgYW4gZXhwcmVzc2lvbikuJyk7XG4gICAgfVxuICAgIGNvbnN0IGFyZzIgPSBjYWxsLmdldCgnYXJndW1lbnRzJylbMV07XG4gICAgaWYgKGFyZzIgJiYgIWFyZzIuaXNFeHByZXNzaW9uKCkpIHtcbiAgICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgICAgYXJnMi5ub2RlLFxuICAgICAgICAgICdVbmV4cGVjdGVkIGByYXdgIGFyZ3VtZW50IHRvIHRoZSBcIm1ha2VUZW1wbGF0ZU9iamVjdCgpXCIgZnVuY3Rpb24gKGV4cGVjdGVkIGFuIGV4cHJlc3Npb24pLicpO1xuICAgIH1cbiAgICAvLyBJZiB0aGVyZSBpcyBubyBzZWNvbmQgYXJndW1lbnQgdGhlbiBhc3N1bWUgdGhhdCByYXcgYW5kIGNvb2tlZCBhcmUgdGhlIHNhbWVcbiAgICByYXcgPSBhcmcyICE9PSB1bmRlZmluZWQgPyBhcmcyIDogY29va2VkO1xuICB9XG5cbiAgY29uc3QgY29va2VkU3RyaW5ncyA9IHVud3JhcFN0cmluZ0xpdGVyYWxBcnJheShjb29rZWQubm9kZSk7XG4gIGNvbnN0IHJhd1N0cmluZ3MgPSB1bndyYXBTdHJpbmdMaXRlcmFsQXJyYXkocmF3Lm5vZGUpO1xuICByZXR1cm4gybVtYWtlVGVtcGxhdGVPYmplY3QoY29va2VkU3RyaW5ncywgcmF3U3RyaW5ncyk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHVud3JhcFN1YnN0aXR1dGlvbnNGcm9tTG9jYWxpemVDYWxsKGNhbGw6IHQuQ2FsbEV4cHJlc3Npb24pOiB0LkV4cHJlc3Npb25bXSB7XG4gIGNvbnN0IGV4cHJlc3Npb25zID0gY2FsbC5hcmd1bWVudHMuc3BsaWNlKDEpO1xuICBpZiAoIWlzQXJyYXlPZkV4cHJlc3Npb25zKGV4cHJlc3Npb25zKSkge1xuICAgIGNvbnN0IGJhZEV4cHJlc3Npb24gPSBleHByZXNzaW9ucy5maW5kKGV4cHJlc3Npb24gPT4gIXQuaXNFeHByZXNzaW9uKGV4cHJlc3Npb24pKSAhO1xuICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgIGJhZEV4cHJlc3Npb24sXG4gICAgICAgICdJbnZhbGlkIHN1YnN0aXR1dGlvbnMgZm9yIGAkbG9jYWxpemVgIChleHBlY3RlZCBhbGwgc3Vic3RpdHV0aW9uIGFyZ3VtZW50cyB0byBiZSBleHByZXNzaW9ucykuJyk7XG4gIH1cbiAgcmV0dXJuIGV4cHJlc3Npb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW53cmFwTWVzc2FnZVBhcnRzRnJvbVRlbXBsYXRlTGl0ZXJhbChlbGVtZW50czogdC5UZW1wbGF0ZUVsZW1lbnRbXSk6XG4gICAgVGVtcGxhdGVTdHJpbmdzQXJyYXkge1xuICBjb25zdCBjb29rZWQgPSBlbGVtZW50cy5tYXAocSA9PiB7XG4gICAgaWYgKHEudmFsdWUuY29va2VkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgICAgcSwgYFVuZXhwZWN0ZWQgdW5kZWZpbmVkIG1lc3NhZ2UgcGFydCBpbiBcIiR7ZWxlbWVudHMubWFwKHEgPT4gcS52YWx1ZS5jb29rZWQpfVwiYCk7XG4gICAgfVxuICAgIHJldHVybiBxLnZhbHVlLmNvb2tlZDtcbiAgfSk7XG4gIGNvbnN0IHJhdyA9IGVsZW1lbnRzLm1hcChxID0+IHEudmFsdWUucmF3KTtcbiAgcmV0dXJuIMm1bWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KTtcbn1cblxuLyoqXG4qIFdyYXAgdGhlIGdpdmVuIGBleHByZXNzaW9uYCBpbiBwYXJlbnRoZXNlcyBpZiBpdCBpcyBhIGJpbmFyeSBleHByZXNzaW9uLlxuKlxuKiBUaGlzIGVuc3VyZXMgdGhhdCB0aGlzIGV4cHJlc3Npb24gaXMgZXZhbHVhdGVkIGNvcnJlY3RseSBpZiBpdCBpcyBlbWJlZGRlZCBpbiBhbm90aGVyIGV4cHJlc3Npb24uXG4qXG4qIEBwYXJhbSBleHByZXNzaW9uIFRoZSBleHByZXNzaW9uIHRvIHBvdGVudGlhbGx5IHdyYXAuXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIHdyYXBJblBhcmVuc0lmTmVjZXNzYXJ5KGV4cHJlc3Npb246IHQuRXhwcmVzc2lvbik6IHQuRXhwcmVzc2lvbiB7XG4gIGlmICh0LmlzQmluYXJ5RXhwcmVzc2lvbihleHByZXNzaW9uKSkge1xuICAgIHJldHVybiB0LnBhcmVudGhlc2l6ZWRFeHByZXNzaW9uKGV4cHJlc3Npb24pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBleHByZXNzaW9uO1xuICB9XG59XG5cbi8qKlxuKiBFeHRyYWN0IHRoZSBzdHJpbmcgdmFsdWVzIGZyb20gYW4gYGFycmF5YCBvZiBzdHJpbmcgbGl0ZXJhbHMuXG4qIEBwYXJhbSBhcnJheSBUaGUgYXJyYXkgdG8gdW53cmFwLlxuKi9cbmV4cG9ydCBmdW5jdGlvbiB1bndyYXBTdHJpbmdMaXRlcmFsQXJyYXkoYXJyYXk6IHQuRXhwcmVzc2lvbik6IHN0cmluZ1tdIHtcbiAgaWYgKCFpc1N0cmluZ0xpdGVyYWxBcnJheShhcnJheSkpIHtcbiAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICBhcnJheSwgJ1VuZXhwZWN0ZWQgbWVzc2FnZVBhcnRzIGZvciBgJGxvY2FsaXplYCAoZXhwZWN0ZWQgYW4gYXJyYXkgb2Ygc3RyaW5ncykuJyk7XG4gIH1cbiAgcmV0dXJuIGFycmF5LmVsZW1lbnRzLm1hcCgoc3RyOiB0LlN0cmluZ0xpdGVyYWwpID0+IHN0ci52YWx1ZSk7XG59XG5cbi8qKlxuICogVGhpcyBleHByZXNzaW9uIGlzIGJlbGlldmVkIHRvIGJlIGEgY2FsbCB0byBhIFwibGF6eS1sb2FkXCIgdGVtcGxhdGUgb2JqZWN0IGhlbHBlciBmdW5jdGlvbi5cbiAqIFRoaXMgaXMgZXhwZWN0ZWQgdG8gYmUgb2YgdGhlIGZvcm06XG4gKlxuICogYGBgdHNcbiAqICBmdW5jdGlvbiBfdGVtcGxhdGVPYmplY3QoKSB7XG4gKiAgICB2YXIgZSA9IF90YWdnZWRUZW1wbGF0ZUxpdGVyYWwoWydjb29rZWQgc3RyaW5nJywgJ3JhdyBzdHJpbmcnXSk7XG4gKiAgICByZXR1cm4gX3RlbXBsYXRlT2JqZWN0ID0gZnVuY3Rpb24oKSB7IHJldHVybiBlIH0sIGVcbiAqICB9XG4gKiBgYGBcbiAqXG4gKiBXZSB1bndyYXAgdGhpcyB0byByZXR1cm4gdGhlIGNhbGwgdG8gYF90YWdnZWRUZW1wbGF0ZUxpdGVyYWwoKWAuXG4gKlxuICogQHBhcmFtIGNhbGwgdGhlIGNhbGwgZXhwcmVzc2lvbiB0byB1bndyYXBcbiAqIEByZXR1cm5zIHRoZSAgY2FsbCBleHByZXNzaW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bndyYXBMYXp5TG9hZEhlbHBlckNhbGwoY2FsbDogTm9kZVBhdGg8dC5DYWxsRXhwcmVzc2lvbj4pOlxuICAgIE5vZGVQYXRoPHQuQ2FsbEV4cHJlc3Npb24+IHtcbiAgY29uc3QgY2FsbGVlID0gY2FsbC5nZXQoJ2NhbGxlZScpO1xuICBpZiAoIWNhbGxlZS5pc0lkZW50aWZpZXIoKSkge1xuICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgIGNhbGxlZS5ub2RlLFxuICAgICAgICAnVW5leHBlY3RlZCBsYXp5LWxvYWQgaGVscGVyIGNhbGwgKGV4cGVjdGVkIGEgY2FsbCBvZiB0aGUgZm9ybSBgX3RlbXBsYXRlT2JqZWN0KClgKS4nKTtcbiAgfVxuICBjb25zdCBsYXp5TG9hZEJpbmRpbmcgPSBjYWxsLnNjb3BlLmdldEJpbmRpbmcoY2FsbGVlLm5vZGUubmFtZSk7XG4gIGlmICghbGF6eUxvYWRCaW5kaW5nKSB7XG4gICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihjYWxsZWUubm9kZSwgJ01pc3NpbmcgZGVjbGFyYXRpb24gZm9yIGxhenktbG9hZCBoZWxwZXIgZnVuY3Rpb24nKTtcbiAgfVxuICBjb25zdCBsYXp5TG9hZEZuID0gbGF6eUxvYWRCaW5kaW5nLnBhdGg7XG4gIGlmICghbGF6eUxvYWRGbi5pc0Z1bmN0aW9uRGVjbGFyYXRpb24oKSkge1xuICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgIGxhenlMb2FkRm4ubm9kZSwgJ1VuZXhwZWN0ZWQgZXhwcmVzc2lvbiAoZXhwZWN0ZWQgYSBmdW5jdGlvbiBkZWNsYXJhdGlvbicpO1xuICB9XG4gIGNvbnN0IHJldHVybmVkTm9kZSA9IGdldFJldHVybmVkRXhwcmVzc2lvbihsYXp5TG9hZEZuKTtcblxuICBpZiAocmV0dXJuZWROb2RlLmlzQ2FsbEV4cHJlc3Npb24oKSkge1xuICAgIHJldHVybiByZXR1cm5lZE5vZGU7XG4gIH1cblxuICBpZiAocmV0dXJuZWROb2RlLmlzSWRlbnRpZmllcigpKSB7XG4gICAgY29uc3QgaWRlbnRpZmllck5hbWUgPSByZXR1cm5lZE5vZGUubm9kZS5uYW1lO1xuICAgIGNvbnN0IGRlY2xhcmF0aW9uID0gcmV0dXJuZWROb2RlLnNjb3BlLmdldEJpbmRpbmcoaWRlbnRpZmllck5hbWUpO1xuICAgIGlmIChkZWNsYXJhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICAgIHJldHVybmVkTm9kZS5ub2RlLCAnTWlzc2luZyBkZWNsYXJhdGlvbiBmb3IgcmV0dXJuIHZhbHVlIGZyb20gaGVscGVyLicpO1xuICAgIH1cbiAgICBpZiAoIWRlY2xhcmF0aW9uLnBhdGguaXNWYXJpYWJsZURlY2xhcmF0b3IoKSkge1xuICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICBkZWNsYXJhdGlvbi5wYXRoLm5vZGUsXG4gICAgICAgICAgJ1VuZXhwZWN0ZWQgaGVscGVyIHJldHVybiB2YWx1ZSBkZWNsYXJhdGlvbiAoZXhwZWN0ZWQgYSB2YXJpYWJsZSBkZWNsYXJhdGlvbikuJyk7XG4gICAgfVxuICAgIGNvbnN0IGluaXRpYWxpemVyID0gZGVjbGFyYXRpb24ucGF0aC5nZXQoJ2luaXQnKTtcbiAgICBpZiAoIWluaXRpYWxpemVyLmlzQ2FsbEV4cHJlc3Npb24oKSkge1xuICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICBkZWNsYXJhdGlvbi5wYXRoLm5vZGUsXG4gICAgICAgICAgJ1VuZXhwZWN0ZWQgcmV0dXJuIHZhbHVlIGZyb20gaGVscGVyIChleHBlY3RlZCBhIGNhbGwgZXhwcmVzc2lvbikuJyk7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIHRoZSBsYXp5IGxvYWQgaGVscGVyIGlmIHRoaXMgaXMgdGhlIG9ubHkgcmVmZXJlbmNlIHRvIGl0LlxuICAgIGlmIChsYXp5TG9hZEJpbmRpbmcucmVmZXJlbmNlcyA9PT0gMSkge1xuICAgICAgbGF6eUxvYWRGbi5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5pdGlhbGl6ZXI7XG4gIH1cbiAgcmV0dXJuIGNhbGw7XG59XG5cbmZ1bmN0aW9uIGdldFJldHVybmVkRXhwcmVzc2lvbihmbjogTm9kZVBhdGg8dC5GdW5jdGlvbkRlY2xhcmF0aW9uPik6IE5vZGVQYXRoPHQuRXhwcmVzc2lvbj4ge1xuICBjb25zdCBib2R5U3RhdGVtZW50cyA9IGZuLmdldCgnYm9keScpLmdldCgnYm9keScpO1xuICBmb3IgKGNvbnN0IHN0YXRlbWVudCBvZiBib2R5U3RhdGVtZW50cykge1xuICAgIGlmIChzdGF0ZW1lbnQuaXNSZXR1cm5TdGF0ZW1lbnQoKSkge1xuICAgICAgY29uc3QgYXJndW1lbnQgPSBzdGF0ZW1lbnQuZ2V0KCdhcmd1bWVudCcpO1xuICAgICAgaWYgKGFyZ3VtZW50LmlzU2VxdWVuY2VFeHByZXNzaW9uKCkpIHtcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvbnMgPSBhcmd1bWVudC5nZXQoJ2V4cHJlc3Npb25zJyk7XG4gICAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KGV4cHJlc3Npb25zKSA/IGV4cHJlc3Npb25zW2V4cHJlc3Npb25zLmxlbmd0aCAtIDFdIDogZXhwcmVzc2lvbnM7XG4gICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50LmlzRXhwcmVzc2lvbigpKSB7XG4gICAgICAgIHJldHVybiBhcmd1bWVudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgICAgICBzdGF0ZW1lbnQubm9kZSwgJ0ludmFsaWQgcmV0dXJuIGFyZ3VtZW50IGluIGhlbHBlciBmdW5jdGlvbiAoZXhwZWN0ZWQgYW4gZXhwcmVzc2lvbikuJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoZm4ubm9kZSwgJ01pc3NpbmcgcmV0dXJuIHN0YXRlbWVudCBpbiBoZWxwZXIgZnVuY3Rpb24uJyk7XG59XG5cbi8qKlxuKiBJcyB0aGUgZ2l2ZW4gYG5vZGVgIGFuIGFycmF5IG9mIGxpdGVyYWwgc3RyaW5ncz9cbipcbiogQHBhcmFtIG5vZGUgVGhlIG5vZGUgdG8gdGVzdC5cbiovXG5leHBvcnQgZnVuY3Rpb24gaXNTdHJpbmdMaXRlcmFsQXJyYXkobm9kZTogdC5Ob2RlKTogbm9kZSBpcyB0LkV4cHJlc3Npb24mXG4gICAge2VsZW1lbnRzOiB0LlN0cmluZ0xpdGVyYWxbXX0ge1xuICByZXR1cm4gdC5pc0FycmF5RXhwcmVzc2lvbihub2RlKSAmJiBub2RlLmVsZW1lbnRzLmV2ZXJ5KGVsZW1lbnQgPT4gdC5pc1N0cmluZ0xpdGVyYWwoZWxlbWVudCkpO1xufVxuXG4vKipcbiogQXJlIGFsbCB0aGUgZ2l2ZW4gYG5vZGVzYCBleHByZXNzaW9ucz9cbiogQHBhcmFtIG5vZGVzIFRoZSBub2RlcyB0byB0ZXN0LlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5T2ZFeHByZXNzaW9ucyhub2RlczogdC5Ob2RlW10pOiBub2RlcyBpcyB0LkV4cHJlc3Npb25bXSB7XG4gIHJldHVybiBub2Rlcy5ldmVyeShlbGVtZW50ID0+IHQuaXNFeHByZXNzaW9uKGVsZW1lbnQpKTtcbn1cblxuLyoqIE9wdGlvbnMgdGhhdCBhZmZlY3QgaG93IHRoZSBgbWFrZUVzWFhYVHJhbnNsYXRlUGx1Z2luKClgIGZ1bmN0aW9ucyB3b3JrLiAqL1xuZXhwb3J0IGludGVyZmFjZSBUcmFuc2xhdGVQbHVnaW5PcHRpb25zIHtcbiAgbWlzc2luZ1RyYW5zbGF0aW9uPzogTWlzc2luZ1RyYW5zbGF0aW9uU3RyYXRlZ3k7XG4gIGxvY2FsaXplTmFtZT86IHN0cmluZztcbn1cblxuLyoqXG4gKiBIb3cgdG8gaGFuZGxlIG1pc3NpbmcgdHJhbnNsYXRpb25zLlxuICovXG5leHBvcnQgdHlwZSBNaXNzaW5nVHJhbnNsYXRpb25TdHJhdGVneSA9ICdlcnJvcicgfCAnd2FybmluZycgfCAnaWdub3JlJztcblxuLyoqXG4gKiBUcmFuc2xhdGUgdGhlIHRleHQgb2YgdGhlIGdpdmVuIG1lc3NhZ2UsIHVzaW5nIHRoZSBnaXZlbiB0cmFuc2xhdGlvbnMuXG4gKlxuICogTG9ncyBhcyB3YXJuaW5nIGlmIHRoZSB0cmFuc2xhdGlvbiBpcyBub3QgYXZhaWxhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2xhdGUoXG4gICAgZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzLCB0cmFuc2xhdGlvbnM6IFJlY29yZDxzdHJpbmcsIMm1UGFyc2VkVHJhbnNsYXRpb24+LFxuICAgIG1lc3NhZ2VQYXJ0czogVGVtcGxhdGVTdHJpbmdzQXJyYXksIHN1YnN0aXR1dGlvbnM6IHJlYWRvbmx5IGFueVtdLFxuICAgIG1pc3NpbmdUcmFuc2xhdGlvbjogTWlzc2luZ1RyYW5zbGF0aW9uU3RyYXRlZ3kpOiBbVGVtcGxhdGVTdHJpbmdzQXJyYXksIHJlYWRvbmx5IGFueVtdXSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIMm1dHJhbnNsYXRlKHRyYW5zbGF0aW9ucywgbWVzc2FnZVBhcnRzLCBzdWJzdGl0dXRpb25zKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmICjJtWlzTWlzc2luZ1RyYW5zbGF0aW9uRXJyb3IoZSkpIHtcbiAgICAgIGlmIChtaXNzaW5nVHJhbnNsYXRpb24gPT09ICdlcnJvcicpIHtcbiAgICAgICAgZGlhZ25vc3RpY3MuZXJyb3IoZS5tZXNzYWdlKTtcbiAgICAgIH0gZWxzZSBpZiAobWlzc2luZ1RyYW5zbGF0aW9uID09PSAnd2FybmluZycpIHtcbiAgICAgICAgZGlhZ25vc3RpY3Mud2FybihlLm1lc3NhZ2UpO1xuICAgICAgfVxuICAgICAgLy8gUmV0dXJuIHRoZSBwYXJzZWQgbWVzc2FnZSBiZWNhdXNlIHRoaXMgd2lsbCBoYXZlIHRoZSBtZXRhIGJsb2NrcyBzdHJpcHBlZFxuICAgICAgcmV0dXJuIFtcbiAgICAgICAgybVtYWtlVGVtcGxhdGVPYmplY3QoZS5wYXJzZWRNZXNzYWdlLm1lc3NhZ2VQYXJ0cywgZS5wYXJzZWRNZXNzYWdlLm1lc3NhZ2VQYXJ0cyksXG4gICAgICAgIHN1YnN0aXR1dGlvbnNcbiAgICAgIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpYWdub3N0aWNzLmVycm9yKGUubWVzc2FnZSk7XG4gICAgICByZXR1cm4gW21lc3NhZ2VQYXJ0cywgc3Vic3RpdHV0aW9uc107XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCYWJlbFBhcnNlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIHByaXZhdGUgcmVhZG9ubHkgdHlwZSA9ICdCYWJlbFBhcnNlRXJyb3InO1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbm9kZTogdC5CYXNlTm9kZSwgbWVzc2FnZTogc3RyaW5nKSB7IHN1cGVyKG1lc3NhZ2UpOyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0JhYmVsUGFyc2VFcnJvcihlOiBhbnkpOiBlIGlzIEJhYmVsUGFyc2VFcnJvciB7XG4gIHJldHVybiBlLnR5cGUgPT09ICdCYWJlbFBhcnNlRXJyb3InO1xufVxuIl19
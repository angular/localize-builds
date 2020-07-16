(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/source_file_utils", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/localize", "@babel/types"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.serializeLocationPosition = exports.getLocation = exports.buildCodeFrameError = exports.isBabelParseError = exports.BabelParseError = exports.translate = exports.isArrayOfExpressions = exports.isStringLiteralArray = exports.unwrapLazyLoadHelperCall = exports.unwrapStringLiteralArray = exports.wrapInParensIfNecessary = exports.unwrapMessagePartsFromTemplateLiteral = exports.unwrapSubstitutionsFromLocalizeCall = exports.unwrapMessagePartsFromLocalizeCall = exports.buildLocalizeReplacement = exports.isGlobalIdentifier = exports.isNamedIdentifier = exports.isLocalize = void 0;
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var localize_1 = require("@angular/localize");
    var t = require("@babel/types");
    /**
     * Is the given `expression` the global `$localize` identifier?
     *
     * @param expression The expression to check.
     * @param localizeName The configured name of `$localize`.
     */
    function isLocalize(expression, localizeName) {
        return isNamedIdentifier(expression, localizeName) && isGlobalIdentifier(expression);
    }
    exports.isLocalize = isLocalize;
    /**
     * Is the given `expression` an identifier with the correct `name`?
     *
     * @param expression The expression to check.
     * @param name The name of the identifier we are looking for.
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
            else if (right.isSequenceExpression()) {
                var expressions = right.get('expressions');
                if (expressions.length > 2) {
                    // This is a minified sequence expression, where the first two expressions in the sequence
                    // are assignments of the cooked and raw arrays respectively.
                    var _a = tslib_1.__read(expressions, 2), first = _a[0], second = _a[1];
                    if (first.isAssignmentExpression() && second.isAssignmentExpression()) {
                        cooked = first.get('right');
                        if (!cooked.isExpression()) {
                            throw new BabelParseError(first.node, 'Unexpected cooked value, expected an expression.');
                        }
                        raw = second.get('right');
                        if (!raw.isExpression()) {
                            throw new BabelParseError(second.node, 'Unexpected raw value, expected an expression.');
                        }
                    }
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
                diagnostics.add(missingTranslation, e.message);
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
    function buildCodeFrameError(path, e) {
        var filename = path.hub.file.opts.filename || '(unknown file)';
        var message = path.hub.file.buildCodeFrameError(e.node, e.message).message;
        return filename + ": " + message;
    }
    exports.buildCodeFrameError = buildCodeFrameError;
    function getLocation(startPath, endPath) {
        var startLocation = startPath.node.loc;
        var file = getFileFromPath(startPath);
        if (!startLocation || !file) {
            return undefined;
        }
        var endLocation = endPath && getFileFromPath(endPath) === file && endPath.node.loc || startLocation;
        return {
            start: getLineAndColumn(startLocation.start),
            end: getLineAndColumn(endLocation.end),
            file: file
        };
    }
    exports.getLocation = getLocation;
    function serializeLocationPosition(location) {
        var endLineString = location.end !== undefined && location.end.line !== location.start.line ?
            "," + (location.end.line + 1) :
            '';
        return "" + (location.start.line + 1) + endLineString;
    }
    exports.serializeLocationPosition = serializeLocationPosition;
    function getFileFromPath(path) {
        var opts = path === null || path === void 0 ? void 0 : path.hub.file.opts;
        return (opts === null || opts === void 0 ? void 0 : opts.filename) ?
            file_system_1.resolve(opts.generatorOpts.sourceRoot, file_system_1.relative(opts.cwd, opts.filename)) :
            null;
    }
    function getLineAndColumn(loc) {
        // Note we want 0-based line numbers but Babel returns 1-based.
        return { line: loc.line - 1, column: loc.column };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX2ZpbGVfdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3NvdXJjZV9maWxlX3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCwyRUFBOEY7SUFDOUYsOENBQW1JO0lBRW5JLGdDQUFrQztJQUlsQzs7Ozs7T0FLRztJQUNILFNBQWdCLFVBQVUsQ0FDdEIsVUFBb0IsRUFBRSxZQUFvQjtRQUM1QyxPQUFPLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN2RixDQUFDO0lBSEQsZ0NBR0M7SUFFRDs7Ozs7T0FLRztJQUNILFNBQWdCLGlCQUFpQixDQUM3QixVQUFvQixFQUFFLElBQVk7UUFDcEMsT0FBTyxVQUFVLENBQUMsWUFBWSxFQUFFLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDO0lBQ3BFLENBQUM7SUFIRCw4Q0FHQztJQUVEOzs7T0FHRztJQUNILFNBQWdCLGtCQUFrQixDQUFDLFVBQWtDO1FBQ25FLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBRkQsZ0RBRUM7SUFFRDs7OztPQUlHO0lBQ0gsU0FBZ0Isd0JBQXdCLENBQ3BDLFlBQWtDLEVBQUUsYUFBc0M7UUFDNUUsSUFBSSxZQUFZLEdBQWlCLENBQUMsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVB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LEdBQUcsS0FBSyxTQUFTLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzRixPQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBRSxDQUFDLENBQUM7WUFDN0IsRUFBRSxDQUFDO1FBQ1AsT0FBTyxNQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBRyxhQUFlLENBQUM7SUFDdEQsQ0FBQztJQUxELDhEQUtDO0lBRUQsU0FBUyxlQUFlLENBQUMsSUFBd0I7UUFDL0MsSUFBTSxJQUFJLEdBQUcsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2pDLE9BQU8sQ0FBQSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsUUFBUSxFQUFDLENBQUM7WUFDbkIscUJBQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxzQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzRSxJQUFJLENBQUM7SUFDWCxDQUFDO0lBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxHQUFtQztRQUMzRCwrREFBK0Q7UUFDL0QsT0FBTyxFQUFDLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBQyxDQUFDO0lBQ2xELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGgsIHJlbGF0aXZlLCByZXNvbHZlfSBmcm9tICdAYW5ndWxhci9jb21waWxlci1jbGkvc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7ybVpc01pc3NpbmdUcmFuc2xhdGlvbkVycm9yLCDJtW1ha2VUZW1wbGF0ZU9iamVjdCwgybVQYXJzZWRUcmFuc2xhdGlvbiwgybVTb3VyY2VMb2NhdGlvbiwgybV0cmFuc2xhdGV9IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcbmltcG9ydCB7Tm9kZVBhdGh9IGZyb20gJ0BiYWJlbC90cmF2ZXJzZSc7XG5pbXBvcnQgKiBhcyB0IGZyb20gJ0BiYWJlbC90eXBlcyc7XG5cbmltcG9ydCB7RGlhZ25vc3RpY0hhbmRsaW5nU3RyYXRlZ3ksIERpYWdub3N0aWNzfSBmcm9tICcuL2RpYWdub3N0aWNzJztcblxuLyoqXG4gKiBJcyB0aGUgZ2l2ZW4gYGV4cHJlc3Npb25gIHRoZSBnbG9iYWwgYCRsb2NhbGl6ZWAgaWRlbnRpZmllcj9cbiAqXG4gKiBAcGFyYW0gZXhwcmVzc2lvbiBUaGUgZXhwcmVzc2lvbiB0byBjaGVjay5cbiAqIEBwYXJhbSBsb2NhbGl6ZU5hbWUgVGhlIGNvbmZpZ3VyZWQgbmFtZSBvZiBgJGxvY2FsaXplYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTG9jYWxpemUoXG4gICAgZXhwcmVzc2lvbjogTm9kZVBhdGgsIGxvY2FsaXplTmFtZTogc3RyaW5nKTogZXhwcmVzc2lvbiBpcyBOb2RlUGF0aDx0LklkZW50aWZpZXI+IHtcbiAgcmV0dXJuIGlzTmFtZWRJZGVudGlmaWVyKGV4cHJlc3Npb24sIGxvY2FsaXplTmFtZSkgJiYgaXNHbG9iYWxJZGVudGlmaWVyKGV4cHJlc3Npb24pO1xufVxuXG4vKipcbiAqIElzIHRoZSBnaXZlbiBgZXhwcmVzc2lvbmAgYW4gaWRlbnRpZmllciB3aXRoIHRoZSBjb3JyZWN0IGBuYW1lYD9cbiAqXG4gKiBAcGFyYW0gZXhwcmVzc2lvbiBUaGUgZXhwcmVzc2lvbiB0byBjaGVjay5cbiAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBpZGVudGlmaWVyIHdlIGFyZSBsb29raW5nIGZvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTmFtZWRJZGVudGlmaWVyKFxuICAgIGV4cHJlc3Npb246IE5vZGVQYXRoLCBuYW1lOiBzdHJpbmcpOiBleHByZXNzaW9uIGlzIE5vZGVQYXRoPHQuSWRlbnRpZmllcj4ge1xuICByZXR1cm4gZXhwcmVzc2lvbi5pc0lkZW50aWZpZXIoKSAmJiBleHByZXNzaW9uLm5vZGUubmFtZSA9PT0gbmFtZTtcbn1cblxuLyoqXG4gKiBJcyB0aGUgZ2l2ZW4gYGlkZW50aWZpZXJgIGRlY2xhcmVkIGdsb2JhbGx5LlxuICogQHBhcmFtIGlkZW50aWZpZXIgVGhlIGlkZW50aWZpZXIgdG8gY2hlY2suXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0dsb2JhbElkZW50aWZpZXIoaWRlbnRpZmllcjogTm9kZVBhdGg8dC5JZGVudGlmaWVyPikge1xuICByZXR1cm4gIWlkZW50aWZpZXIuc2NvcGUgfHwgIWlkZW50aWZpZXIuc2NvcGUuaGFzQmluZGluZyhpZGVudGlmaWVyLm5vZGUubmFtZSk7XG59XG5cbi8qKlxuICogQnVpbGQgYSB0cmFuc2xhdGVkIGV4cHJlc3Npb24gdG8gcmVwbGFjZSB0aGUgY2FsbCB0byBgJGxvY2FsaXplYC5cbiAqIEBwYXJhbSBtZXNzYWdlUGFydHMgVGhlIHN0YXRpYyBwYXJ0cyBvZiB0aGUgbWVzc2FnZS5cbiAqIEBwYXJhbSBzdWJzdGl0dXRpb25zIFRoZSBleHByZXNzaW9ucyB0byBzdWJzdGl0dXRlIGludG8gdGhlIG1lc3NhZ2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZExvY2FsaXplUmVwbGFjZW1lbnQoXG4gICAgbWVzc2FnZVBhcnRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgc3Vic3RpdHV0aW9uczogcmVhZG9ubHkgdC5FeHByZXNzaW9uW10pOiB0LkV4cHJlc3Npb24ge1xuICBsZXQgbWFwcGVkU3RyaW5nOiB0LkV4cHJlc3Npb24gPSB0LnN0cmluZ0xpdGVyYWwobWVzc2FnZVBhcnRzWzBdKTtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBtZXNzYWdlUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBtYXBwZWRTdHJpbmcgPVxuICAgICAgICB0LmJpbmFyeUV4cHJlc3Npb24oJysnLCBtYXBwZWRTdHJpbmcsIHdyYXBJblBhcmVuc0lmTmVjZXNzYXJ5KHN1YnN0aXR1dGlvbnNbaSAtIDFdKSk7XG4gICAgbWFwcGVkU3RyaW5nID0gdC5iaW5hcnlFeHByZXNzaW9uKCcrJywgbWFwcGVkU3RyaW5nLCB0LnN0cmluZ0xpdGVyYWwobWVzc2FnZVBhcnRzW2ldKSk7XG4gIH1cbiAgcmV0dXJuIG1hcHBlZFN0cmluZztcbn1cblxuLyoqXG4gKiBFeHRyYWN0IHRoZSBtZXNzYWdlIHBhcnRzIGZyb20gdGhlIGdpdmVuIGBjYWxsYCAodG8gYCRsb2NhbGl6ZWApLlxuICpcbiAqIFRoZSBtZXNzYWdlIHBhcnRzIHdpbGwgZWl0aGVyIGJ5IHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgYGNhbGxgIG9yIGl0IHdpbGwgYmUgd3JhcHBlZCBpbiBjYWxsXG4gKiB0byBhIGhlbHBlciBmdW5jdGlvbiBsaWtlIGBfX21ha2VUZW1wbGF0ZU9iamVjdGAuXG4gKlxuICogQHBhcmFtIGNhbGwgVGhlIEFTVCBub2RlIG9mIHRoZSBjYWxsIHRvIHByb2Nlc3MuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bndyYXBNZXNzYWdlUGFydHNGcm9tTG9jYWxpemVDYWxsKGNhbGw6IE5vZGVQYXRoPHQuQ2FsbEV4cHJlc3Npb24+KTpcbiAgICBUZW1wbGF0ZVN0cmluZ3NBcnJheSB7XG4gIGxldCBjb29rZWQgPSBjYWxsLmdldCgnYXJndW1lbnRzJylbMF07XG5cbiAgaWYgKGNvb2tlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihjYWxsLm5vZGUsICdgJGxvY2FsaXplYCBjYWxsZWQgd2l0aG91dCBhbnkgYXJndW1lbnRzLicpO1xuICB9XG4gIGlmICghY29va2VkLmlzRXhwcmVzc2lvbigpKSB7XG4gICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgY29va2VkLm5vZGUsICdVbmV4cGVjdGVkIGFyZ3VtZW50IHRvIGAkbG9jYWxpemVgIChleHBlY3RlZCBhbiBhcnJheSkuJyk7XG4gIH1cblxuICAvLyBJZiB0aGVyZSBpcyBubyBjYWxsIHRvIGBfX21ha2VUZW1wbGF0ZU9iamVjdCguLi4pYCwgdGhlbiBgcmF3YCBtdXN0IGJlIHRoZSBzYW1lIGFzIGBjb29rZWRgLlxuICBsZXQgcmF3ID0gY29va2VkO1xuXG4gIC8vIENoZWNrIGZvciBjYWNoZWQgY2FsbCBvZiB0aGUgZm9ybSBgeCB8fCB4ID0gX19tYWtlVGVtcGxhdGVPYmplY3QoLi4uKWBcbiAgaWYgKGNvb2tlZC5pc0xvZ2ljYWxFeHByZXNzaW9uKCkgJiYgY29va2VkLm5vZGUub3BlcmF0b3IgPT09ICd8fCcgJiZcbiAgICAgIGNvb2tlZC5nZXQoJ2xlZnQnKS5pc0lkZW50aWZpZXIoKSkge1xuICAgIGNvbnN0IHJpZ2h0ID0gY29va2VkLmdldCgncmlnaHQnKTtcbiAgICBpZiAocmlnaHQuaXNBc3NpZ25tZW50RXhwcmVzc2lvbigpKSB7XG4gICAgICBjb29rZWQgPSByaWdodC5nZXQoJ3JpZ2h0Jyk7XG4gICAgICBpZiAoIWNvb2tlZC5pc0V4cHJlc3Npb24oKSkge1xuICAgICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICAgICAgY29va2VkLm5vZGUsICdVbmV4cGVjdGVkIFwibWFrZVRlbXBsYXRlT2JqZWN0KClcIiBmdW5jdGlvbiAoZXhwZWN0ZWQgYW4gZXhwcmVzc2lvbikuJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChyaWdodC5pc1NlcXVlbmNlRXhwcmVzc2lvbigpKSB7XG4gICAgICBjb25zdCBleHByZXNzaW9ucyA9IHJpZ2h0LmdldCgnZXhwcmVzc2lvbnMnKTtcbiAgICAgIGlmIChleHByZXNzaW9ucy5sZW5ndGggPiAyKSB7XG4gICAgICAgIC8vIFRoaXMgaXMgYSBtaW5pZmllZCBzZXF1ZW5jZSBleHByZXNzaW9uLCB3aGVyZSB0aGUgZmlyc3QgdHdvIGV4cHJlc3Npb25zIGluIHRoZSBzZXF1ZW5jZVxuICAgICAgICAvLyBhcmUgYXNzaWdubWVudHMgb2YgdGhlIGNvb2tlZCBhbmQgcmF3IGFycmF5cyByZXNwZWN0aXZlbHkuXG4gICAgICAgIGNvbnN0IFtmaXJzdCwgc2Vjb25kXSA9IGV4cHJlc3Npb25zO1xuICAgICAgICBpZiAoZmlyc3QuaXNBc3NpZ25tZW50RXhwcmVzc2lvbigpICYmIHNlY29uZC5pc0Fzc2lnbm1lbnRFeHByZXNzaW9uKCkpIHtcbiAgICAgICAgICBjb29rZWQgPSBmaXJzdC5nZXQoJ3JpZ2h0Jyk7XG4gICAgICAgICAgaWYgKCFjb29rZWQuaXNFeHByZXNzaW9uKCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgICAgICAgICAgZmlyc3Qubm9kZSwgJ1VuZXhwZWN0ZWQgY29va2VkIHZhbHVlLCBleHBlY3RlZCBhbiBleHByZXNzaW9uLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByYXcgPSBzZWNvbmQuZ2V0KCdyaWdodCcpO1xuICAgICAgICAgIGlmICghcmF3LmlzRXhwcmVzc2lvbigpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKHNlY29uZC5ub2RlLCAnVW5leHBlY3RlZCByYXcgdmFsdWUsIGV4cGVjdGVkIGFuIGV4cHJlc3Npb24uJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ2hlY2sgZm9yIGBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdylgIG9yIGBfX3RlbXBsYXRlT2JqZWN0KClgIGNhbGxzLlxuICBpZiAoY29va2VkLmlzQ2FsbEV4cHJlc3Npb24oKSkge1xuICAgIGxldCBjYWxsID0gY29va2VkO1xuICAgIGlmIChjYWxsLmdldCgnYXJndW1lbnRzJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBObyBhcmd1bWVudHMgc28gcGVyaGFwcyBpdCBpcyBhIGBfX3RlbXBsYXRlT2JqZWN0KClgIGNhbGwuXG4gICAgICAvLyBVbndyYXAgdGhpcyB0byBnZXQgdGhlIGBfdGFnZ2VkVGVtcGxhdGVMaXRlcmFsKGNvb2tlZCwgcmF3KWAgY2FsbC5cbiAgICAgIGNhbGwgPSB1bndyYXBMYXp5TG9hZEhlbHBlckNhbGwoY2FsbCk7XG4gICAgfVxuXG4gICAgY29va2VkID0gY2FsbC5nZXQoJ2FyZ3VtZW50cycpWzBdO1xuICAgIGlmICghY29va2VkLmlzRXhwcmVzc2lvbigpKSB7XG4gICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICAgIGNvb2tlZC5ub2RlLFxuICAgICAgICAgICdVbmV4cGVjdGVkIGBjb29rZWRgIGFyZ3VtZW50IHRvIHRoZSBcIm1ha2VUZW1wbGF0ZU9iamVjdCgpXCIgZnVuY3Rpb24gKGV4cGVjdGVkIGFuIGV4cHJlc3Npb24pLicpO1xuICAgIH1cbiAgICBjb25zdCBhcmcyID0gY2FsbC5nZXQoJ2FyZ3VtZW50cycpWzFdO1xuICAgIGlmIChhcmcyICYmICFhcmcyLmlzRXhwcmVzc2lvbigpKSB7XG4gICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICAgIGFyZzIubm9kZSxcbiAgICAgICAgICAnVW5leHBlY3RlZCBgcmF3YCBhcmd1bWVudCB0byB0aGUgXCJtYWtlVGVtcGxhdGVPYmplY3QoKVwiIGZ1bmN0aW9uIChleHBlY3RlZCBhbiBleHByZXNzaW9uKS4nKTtcbiAgICB9XG4gICAgLy8gSWYgdGhlcmUgaXMgbm8gc2Vjb25kIGFyZ3VtZW50IHRoZW4gYXNzdW1lIHRoYXQgcmF3IGFuZCBjb29rZWQgYXJlIHRoZSBzYW1lXG4gICAgcmF3ID0gYXJnMiAhPT0gdW5kZWZpbmVkID8gYXJnMiA6IGNvb2tlZDtcbiAgfVxuXG4gIGNvbnN0IGNvb2tlZFN0cmluZ3MgPSB1bndyYXBTdHJpbmdMaXRlcmFsQXJyYXkoY29va2VkLm5vZGUpO1xuICBjb25zdCByYXdTdHJpbmdzID0gdW53cmFwU3RyaW5nTGl0ZXJhbEFycmF5KHJhdy5ub2RlKTtcbiAgcmV0dXJuIMm1bWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZFN0cmluZ3MsIHJhd1N0cmluZ3MpO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiB1bndyYXBTdWJzdGl0dXRpb25zRnJvbUxvY2FsaXplQ2FsbChjYWxsOiB0LkNhbGxFeHByZXNzaW9uKTogdC5FeHByZXNzaW9uW10ge1xuICBjb25zdCBleHByZXNzaW9ucyA9IGNhbGwuYXJndW1lbnRzLnNwbGljZSgxKTtcbiAgaWYgKCFpc0FycmF5T2ZFeHByZXNzaW9ucyhleHByZXNzaW9ucykpIHtcbiAgICBjb25zdCBiYWRFeHByZXNzaW9uID0gZXhwcmVzc2lvbnMuZmluZChleHByZXNzaW9uID0+ICF0LmlzRXhwcmVzc2lvbihleHByZXNzaW9uKSkhO1xuICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgIGJhZEV4cHJlc3Npb24sXG4gICAgICAgICdJbnZhbGlkIHN1YnN0aXR1dGlvbnMgZm9yIGAkbG9jYWxpemVgIChleHBlY3RlZCBhbGwgc3Vic3RpdHV0aW9uIGFyZ3VtZW50cyB0byBiZSBleHByZXNzaW9ucykuJyk7XG4gIH1cbiAgcmV0dXJuIGV4cHJlc3Npb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW53cmFwTWVzc2FnZVBhcnRzRnJvbVRlbXBsYXRlTGl0ZXJhbChlbGVtZW50czogdC5UZW1wbGF0ZUVsZW1lbnRbXSk6XG4gICAgVGVtcGxhdGVTdHJpbmdzQXJyYXkge1xuICBjb25zdCBjb29rZWQgPSBlbGVtZW50cy5tYXAocSA9PiB7XG4gICAgaWYgKHEudmFsdWUuY29va2VkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgICAgcSwgYFVuZXhwZWN0ZWQgdW5kZWZpbmVkIG1lc3NhZ2UgcGFydCBpbiBcIiR7ZWxlbWVudHMubWFwKHEgPT4gcS52YWx1ZS5jb29rZWQpfVwiYCk7XG4gICAgfVxuICAgIHJldHVybiBxLnZhbHVlLmNvb2tlZDtcbiAgfSk7XG4gIGNvbnN0IHJhdyA9IGVsZW1lbnRzLm1hcChxID0+IHEudmFsdWUucmF3KTtcbiAgcmV0dXJuIMm1bWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KTtcbn1cblxuLyoqXG4gKiBXcmFwIHRoZSBnaXZlbiBgZXhwcmVzc2lvbmAgaW4gcGFyZW50aGVzZXMgaWYgaXQgaXMgYSBiaW5hcnkgZXhwcmVzc2lvbi5cbiAqXG4gKiBUaGlzIGVuc3VyZXMgdGhhdCB0aGlzIGV4cHJlc3Npb24gaXMgZXZhbHVhdGVkIGNvcnJlY3RseSBpZiBpdCBpcyBlbWJlZGRlZCBpbiBhbm90aGVyIGV4cHJlc3Npb24uXG4gKlxuICogQHBhcmFtIGV4cHJlc3Npb24gVGhlIGV4cHJlc3Npb24gdG8gcG90ZW50aWFsbHkgd3JhcC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdyYXBJblBhcmVuc0lmTmVjZXNzYXJ5KGV4cHJlc3Npb246IHQuRXhwcmVzc2lvbik6IHQuRXhwcmVzc2lvbiB7XG4gIGlmICh0LmlzQmluYXJ5RXhwcmVzc2lvbihleHByZXNzaW9uKSkge1xuICAgIHJldHVybiB0LnBhcmVudGhlc2l6ZWRFeHByZXNzaW9uKGV4cHJlc3Npb24pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBleHByZXNzaW9uO1xuICB9XG59XG5cbi8qKlxuICogRXh0cmFjdCB0aGUgc3RyaW5nIHZhbHVlcyBmcm9tIGFuIGBhcnJheWAgb2Ygc3RyaW5nIGxpdGVyYWxzLlxuICogQHBhcmFtIGFycmF5IFRoZSBhcnJheSB0byB1bndyYXAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bndyYXBTdHJpbmdMaXRlcmFsQXJyYXkoYXJyYXk6IHQuRXhwcmVzc2lvbik6IHN0cmluZ1tdIHtcbiAgaWYgKCFpc1N0cmluZ0xpdGVyYWxBcnJheShhcnJheSkpIHtcbiAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICBhcnJheSwgJ1VuZXhwZWN0ZWQgbWVzc2FnZVBhcnRzIGZvciBgJGxvY2FsaXplYCAoZXhwZWN0ZWQgYW4gYXJyYXkgb2Ygc3RyaW5ncykuJyk7XG4gIH1cbiAgcmV0dXJuIGFycmF5LmVsZW1lbnRzLm1hcCgoc3RyOiB0LlN0cmluZ0xpdGVyYWwpID0+IHN0ci52YWx1ZSk7XG59XG5cbi8qKlxuICogVGhpcyBleHByZXNzaW9uIGlzIGJlbGlldmVkIHRvIGJlIGEgY2FsbCB0byBhIFwibGF6eS1sb2FkXCIgdGVtcGxhdGUgb2JqZWN0IGhlbHBlciBmdW5jdGlvbi5cbiAqIFRoaXMgaXMgZXhwZWN0ZWQgdG8gYmUgb2YgdGhlIGZvcm06XG4gKlxuICogYGBgdHNcbiAqICBmdW5jdGlvbiBfdGVtcGxhdGVPYmplY3QoKSB7XG4gKiAgICB2YXIgZSA9IF90YWdnZWRUZW1wbGF0ZUxpdGVyYWwoWydjb29rZWQgc3RyaW5nJywgJ3JhdyBzdHJpbmcnXSk7XG4gKiAgICByZXR1cm4gX3RlbXBsYXRlT2JqZWN0ID0gZnVuY3Rpb24oKSB7IHJldHVybiBlIH0sIGVcbiAqICB9XG4gKiBgYGBcbiAqXG4gKiBXZSB1bndyYXAgdGhpcyB0byByZXR1cm4gdGhlIGNhbGwgdG8gYF90YWdnZWRUZW1wbGF0ZUxpdGVyYWwoKWAuXG4gKlxuICogQHBhcmFtIGNhbGwgdGhlIGNhbGwgZXhwcmVzc2lvbiB0byB1bndyYXBcbiAqIEByZXR1cm5zIHRoZSAgY2FsbCBleHByZXNzaW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bndyYXBMYXp5TG9hZEhlbHBlckNhbGwoY2FsbDogTm9kZVBhdGg8dC5DYWxsRXhwcmVzc2lvbj4pOlxuICAgIE5vZGVQYXRoPHQuQ2FsbEV4cHJlc3Npb24+IHtcbiAgY29uc3QgY2FsbGVlID0gY2FsbC5nZXQoJ2NhbGxlZScpO1xuICBpZiAoIWNhbGxlZS5pc0lkZW50aWZpZXIoKSkge1xuICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgIGNhbGxlZS5ub2RlLFxuICAgICAgICAnVW5leHBlY3RlZCBsYXp5LWxvYWQgaGVscGVyIGNhbGwgKGV4cGVjdGVkIGEgY2FsbCBvZiB0aGUgZm9ybSBgX3RlbXBsYXRlT2JqZWN0KClgKS4nKTtcbiAgfVxuICBjb25zdCBsYXp5TG9hZEJpbmRpbmcgPSBjYWxsLnNjb3BlLmdldEJpbmRpbmcoY2FsbGVlLm5vZGUubmFtZSk7XG4gIGlmICghbGF6eUxvYWRCaW5kaW5nKSB7XG4gICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihjYWxsZWUubm9kZSwgJ01pc3NpbmcgZGVjbGFyYXRpb24gZm9yIGxhenktbG9hZCBoZWxwZXIgZnVuY3Rpb24nKTtcbiAgfVxuICBjb25zdCBsYXp5TG9hZEZuID0gbGF6eUxvYWRCaW5kaW5nLnBhdGg7XG4gIGlmICghbGF6eUxvYWRGbi5pc0Z1bmN0aW9uRGVjbGFyYXRpb24oKSkge1xuICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgIGxhenlMb2FkRm4ubm9kZSwgJ1VuZXhwZWN0ZWQgZXhwcmVzc2lvbiAoZXhwZWN0ZWQgYSBmdW5jdGlvbiBkZWNsYXJhdGlvbicpO1xuICB9XG4gIGNvbnN0IHJldHVybmVkTm9kZSA9IGdldFJldHVybmVkRXhwcmVzc2lvbihsYXp5TG9hZEZuKTtcblxuICBpZiAocmV0dXJuZWROb2RlLmlzQ2FsbEV4cHJlc3Npb24oKSkge1xuICAgIHJldHVybiByZXR1cm5lZE5vZGU7XG4gIH1cblxuICBpZiAocmV0dXJuZWROb2RlLmlzSWRlbnRpZmllcigpKSB7XG4gICAgY29uc3QgaWRlbnRpZmllck5hbWUgPSByZXR1cm5lZE5vZGUubm9kZS5uYW1lO1xuICAgIGNvbnN0IGRlY2xhcmF0aW9uID0gcmV0dXJuZWROb2RlLnNjb3BlLmdldEJpbmRpbmcoaWRlbnRpZmllck5hbWUpO1xuICAgIGlmIChkZWNsYXJhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICAgIHJldHVybmVkTm9kZS5ub2RlLCAnTWlzc2luZyBkZWNsYXJhdGlvbiBmb3IgcmV0dXJuIHZhbHVlIGZyb20gaGVscGVyLicpO1xuICAgIH1cbiAgICBpZiAoIWRlY2xhcmF0aW9uLnBhdGguaXNWYXJpYWJsZURlY2xhcmF0b3IoKSkge1xuICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICBkZWNsYXJhdGlvbi5wYXRoLm5vZGUsXG4gICAgICAgICAgJ1VuZXhwZWN0ZWQgaGVscGVyIHJldHVybiB2YWx1ZSBkZWNsYXJhdGlvbiAoZXhwZWN0ZWQgYSB2YXJpYWJsZSBkZWNsYXJhdGlvbikuJyk7XG4gICAgfVxuICAgIGNvbnN0IGluaXRpYWxpemVyID0gZGVjbGFyYXRpb24ucGF0aC5nZXQoJ2luaXQnKTtcbiAgICBpZiAoIWluaXRpYWxpemVyLmlzQ2FsbEV4cHJlc3Npb24oKSkge1xuICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICBkZWNsYXJhdGlvbi5wYXRoLm5vZGUsXG4gICAgICAgICAgJ1VuZXhwZWN0ZWQgcmV0dXJuIHZhbHVlIGZyb20gaGVscGVyIChleHBlY3RlZCBhIGNhbGwgZXhwcmVzc2lvbikuJyk7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIHRoZSBsYXp5IGxvYWQgaGVscGVyIGlmIHRoaXMgaXMgdGhlIG9ubHkgcmVmZXJlbmNlIHRvIGl0LlxuICAgIGlmIChsYXp5TG9hZEJpbmRpbmcucmVmZXJlbmNlcyA9PT0gMSkge1xuICAgICAgbGF6eUxvYWRGbi5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5pdGlhbGl6ZXI7XG4gIH1cbiAgcmV0dXJuIGNhbGw7XG59XG5cbmZ1bmN0aW9uIGdldFJldHVybmVkRXhwcmVzc2lvbihmbjogTm9kZVBhdGg8dC5GdW5jdGlvbkRlY2xhcmF0aW9uPik6IE5vZGVQYXRoPHQuRXhwcmVzc2lvbj4ge1xuICBjb25zdCBib2R5U3RhdGVtZW50cyA9IGZuLmdldCgnYm9keScpLmdldCgnYm9keScpO1xuICBmb3IgKGNvbnN0IHN0YXRlbWVudCBvZiBib2R5U3RhdGVtZW50cykge1xuICAgIGlmIChzdGF0ZW1lbnQuaXNSZXR1cm5TdGF0ZW1lbnQoKSkge1xuICAgICAgY29uc3QgYXJndW1lbnQgPSBzdGF0ZW1lbnQuZ2V0KCdhcmd1bWVudCcpO1xuICAgICAgaWYgKGFyZ3VtZW50LmlzU2VxdWVuY2VFeHByZXNzaW9uKCkpIHtcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvbnMgPSBhcmd1bWVudC5nZXQoJ2V4cHJlc3Npb25zJyk7XG4gICAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KGV4cHJlc3Npb25zKSA/IGV4cHJlc3Npb25zW2V4cHJlc3Npb25zLmxlbmd0aCAtIDFdIDogZXhwcmVzc2lvbnM7XG4gICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50LmlzRXhwcmVzc2lvbigpKSB7XG4gICAgICAgIHJldHVybiBhcmd1bWVudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgICAgICBzdGF0ZW1lbnQubm9kZSwgJ0ludmFsaWQgcmV0dXJuIGFyZ3VtZW50IGluIGhlbHBlciBmdW5jdGlvbiAoZXhwZWN0ZWQgYW4gZXhwcmVzc2lvbikuJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoZm4ubm9kZSwgJ01pc3NpbmcgcmV0dXJuIHN0YXRlbWVudCBpbiBoZWxwZXIgZnVuY3Rpb24uJyk7XG59XG5cbi8qKlxuICogSXMgdGhlIGdpdmVuIGBub2RlYCBhbiBhcnJheSBvZiBsaXRlcmFsIHN0cmluZ3M/XG4gKlxuICogQHBhcmFtIG5vZGUgVGhlIG5vZGUgdG8gdGVzdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nTGl0ZXJhbEFycmF5KG5vZGU6IHQuTm9kZSk6IG5vZGUgaXMgdC5FeHByZXNzaW9uJlxuICAgIHtlbGVtZW50czogdC5TdHJpbmdMaXRlcmFsW119IHtcbiAgcmV0dXJuIHQuaXNBcnJheUV4cHJlc3Npb24obm9kZSkgJiYgbm9kZS5lbGVtZW50cy5ldmVyeShlbGVtZW50ID0+IHQuaXNTdHJpbmdMaXRlcmFsKGVsZW1lbnQpKTtcbn1cblxuLyoqXG4gKiBBcmUgYWxsIHRoZSBnaXZlbiBgbm9kZXNgIGV4cHJlc3Npb25zP1xuICogQHBhcmFtIG5vZGVzIFRoZSBub2RlcyB0byB0ZXN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheU9mRXhwcmVzc2lvbnMobm9kZXM6IHQuTm9kZVtdKTogbm9kZXMgaXMgdC5FeHByZXNzaW9uW10ge1xuICByZXR1cm4gbm9kZXMuZXZlcnkoZWxlbWVudCA9PiB0LmlzRXhwcmVzc2lvbihlbGVtZW50KSk7XG59XG5cbi8qKiBPcHRpb25zIHRoYXQgYWZmZWN0IGhvdyB0aGUgYG1ha2VFc1hYWFRyYW5zbGF0ZVBsdWdpbigpYCBmdW5jdGlvbnMgd29yay4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVHJhbnNsYXRlUGx1Z2luT3B0aW9ucyB7XG4gIG1pc3NpbmdUcmFuc2xhdGlvbj86IERpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5O1xuICBsb2NhbGl6ZU5hbWU/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogVHJhbnNsYXRlIHRoZSB0ZXh0IG9mIHRoZSBnaXZlbiBtZXNzYWdlLCB1c2luZyB0aGUgZ2l2ZW4gdHJhbnNsYXRpb25zLlxuICpcbiAqIExvZ3MgYXMgd2FybmluZyBpZiB0aGUgdHJhbnNsYXRpb24gaXMgbm90IGF2YWlsYWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNsYXRlKFxuICAgIGRpYWdub3N0aWNzOiBEaWFnbm9zdGljcywgdHJhbnNsYXRpb25zOiBSZWNvcmQ8c3RyaW5nLCDJtVBhcnNlZFRyYW5zbGF0aW9uPixcbiAgICBtZXNzYWdlUGFydHM6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCBzdWJzdGl0dXRpb25zOiByZWFkb25seSBhbnlbXSxcbiAgICBtaXNzaW5nVHJhbnNsYXRpb246IERpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5KTogW1RlbXBsYXRlU3RyaW5nc0FycmF5LCByZWFkb25seSBhbnlbXV0ge1xuICB0cnkge1xuICAgIHJldHVybiDJtXRyYW5zbGF0ZSh0cmFuc2xhdGlvbnMsIG1lc3NhZ2VQYXJ0cywgc3Vic3RpdHV0aW9ucyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoybVpc01pc3NpbmdUcmFuc2xhdGlvbkVycm9yKGUpKSB7XG4gICAgICBkaWFnbm9zdGljcy5hZGQobWlzc2luZ1RyYW5zbGF0aW9uLCBlLm1lc3NhZ2UpO1xuICAgICAgLy8gUmV0dXJuIHRoZSBwYXJzZWQgbWVzc2FnZSBiZWNhdXNlIHRoaXMgd2lsbCBoYXZlIHRoZSBtZXRhIGJsb2NrcyBzdHJpcHBlZFxuICAgICAgcmV0dXJuIFtcbiAgICAgICAgybVtYWtlVGVtcGxhdGVPYmplY3QoZS5wYXJzZWRNZXNzYWdlLm1lc3NhZ2VQYXJ0cywgZS5wYXJzZWRNZXNzYWdlLm1lc3NhZ2VQYXJ0cyksXG4gICAgICAgIHN1YnN0aXR1dGlvbnNcbiAgICAgIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpYWdub3N0aWNzLmVycm9yKGUubWVzc2FnZSk7XG4gICAgICByZXR1cm4gW21lc3NhZ2VQYXJ0cywgc3Vic3RpdHV0aW9uc107XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCYWJlbFBhcnNlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIHByaXZhdGUgcmVhZG9ubHkgdHlwZSA9ICdCYWJlbFBhcnNlRXJyb3InO1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbm9kZTogdC5Ob2RlLCBtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNCYWJlbFBhcnNlRXJyb3IoZTogYW55KTogZSBpcyBCYWJlbFBhcnNlRXJyb3Ige1xuICByZXR1cm4gZS50eXBlID09PSAnQmFiZWxQYXJzZUVycm9yJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQ29kZUZyYW1lRXJyb3IocGF0aDogTm9kZVBhdGgsIGU6IEJhYmVsUGFyc2VFcnJvcik6IHN0cmluZyB7XG4gIGNvbnN0IGZpbGVuYW1lID0gcGF0aC5odWIuZmlsZS5vcHRzLmZpbGVuYW1lIHx8ICcodW5rbm93biBmaWxlKSc7XG4gIGNvbnN0IG1lc3NhZ2UgPSBwYXRoLmh1Yi5maWxlLmJ1aWxkQ29kZUZyYW1lRXJyb3IoZS5ub2RlLCBlLm1lc3NhZ2UpLm1lc3NhZ2U7XG4gIHJldHVybiBgJHtmaWxlbmFtZX06ICR7bWVzc2FnZX1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYXRpb24oc3RhcnRQYXRoOiBOb2RlUGF0aCwgZW5kUGF0aD86IE5vZGVQYXRoKTogybVTb3VyY2VMb2NhdGlvbnx1bmRlZmluZWQge1xuICBjb25zdCBzdGFydExvY2F0aW9uID0gc3RhcnRQYXRoLm5vZGUubG9jO1xuICBjb25zdCBmaWxlID0gZ2V0RmlsZUZyb21QYXRoKHN0YXJ0UGF0aCk7XG4gIGlmICghc3RhcnRMb2NhdGlvbiB8fCAhZmlsZSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCBlbmRMb2NhdGlvbiA9XG4gICAgICBlbmRQYXRoICYmIGdldEZpbGVGcm9tUGF0aChlbmRQYXRoKSA9PT0gZmlsZSAmJiBlbmRQYXRoLm5vZGUubG9jIHx8IHN0YXJ0TG9jYXRpb247XG5cbiAgcmV0dXJuIHtcbiAgICBzdGFydDogZ2V0TGluZUFuZENvbHVtbihzdGFydExvY2F0aW9uLnN0YXJ0KSxcbiAgICBlbmQ6IGdldExpbmVBbmRDb2x1bW4oZW5kTG9jYXRpb24uZW5kKSxcbiAgICBmaWxlXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXJpYWxpemVMb2NhdGlvblBvc2l0aW9uKGxvY2F0aW9uOiDJtVNvdXJjZUxvY2F0aW9uKTogc3RyaW5nIHtcbiAgY29uc3QgZW5kTGluZVN0cmluZyA9IGxvY2F0aW9uLmVuZCAhPT0gdW5kZWZpbmVkICYmIGxvY2F0aW9uLmVuZC5saW5lICE9PSBsb2NhdGlvbi5zdGFydC5saW5lID9cbiAgICAgIGAsJHtsb2NhdGlvbi5lbmQubGluZSArIDF9YCA6XG4gICAgICAnJztcbiAgcmV0dXJuIGAke2xvY2F0aW9uLnN0YXJ0LmxpbmUgKyAxfSR7ZW5kTGluZVN0cmluZ31gO1xufVxuXG5mdW5jdGlvbiBnZXRGaWxlRnJvbVBhdGgocGF0aDogTm9kZVBhdGh8dW5kZWZpbmVkKTogQWJzb2x1dGVGc1BhdGh8bnVsbCB7XG4gIGNvbnN0IG9wdHMgPSBwYXRoPy5odWIuZmlsZS5vcHRzO1xuICByZXR1cm4gb3B0cz8uZmlsZW5hbWUgP1xuICAgICAgcmVzb2x2ZShvcHRzLmdlbmVyYXRvck9wdHMuc291cmNlUm9vdCwgcmVsYXRpdmUob3B0cy5jd2QsIG9wdHMuZmlsZW5hbWUpKSA6XG4gICAgICBudWxsO1xufVxuXG5mdW5jdGlvbiBnZXRMaW5lQW5kQ29sdW1uKGxvYzoge2xpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXJ9KToge2xpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXJ9IHtcbiAgLy8gTm90ZSB3ZSB3YW50IDAtYmFzZWQgbGluZSBudW1iZXJzIGJ1dCBCYWJlbCByZXR1cm5zIDEtYmFzZWQuXG4gIHJldHVybiB7bGluZTogbG9jLmxpbmUgLSAxLCBjb2x1bW46IGxvYy5jb2x1bW59O1xufVxuIl19
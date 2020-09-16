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
    exports.serializeLocationPosition = exports.getLocation = exports.buildCodeFrameError = exports.isBabelParseError = exports.BabelParseError = exports.translate = exports.isArrayOfExpressions = exports.isStringLiteralArray = exports.unwrapLazyLoadHelperCall = exports.unwrapStringLiteralArray = exports.wrapInParensIfNecessary = exports.unwrapExpressionsFromTemplateLiteral = exports.unwrapMessagePartsFromTemplateLiteral = exports.unwrapSubstitutionsFromLocalizeCall = exports.unwrapMessagePartsFromLocalizeCall = exports.buildLocalizeReplacement = exports.isGlobalIdentifier = exports.isNamedIdentifier = exports.isLocalize = void 0;
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
        var _b = tslib_1.__read(unwrapStringLiteralArray(cooked), 1), cookedStrings = _b[0];
        var _c = tslib_1.__read(unwrapStringLiteralArray(raw), 2), rawStrings = _c[0], rawLocations = _c[1];
        return [localize_1.ɵmakeTemplateObject(cookedStrings, rawStrings), rawLocations];
    }
    exports.unwrapMessagePartsFromLocalizeCall = unwrapMessagePartsFromLocalizeCall;
    function unwrapSubstitutionsFromLocalizeCall(call) {
        var expressions = call.get('arguments').splice(1);
        if (!isArrayOfExpressions(expressions)) {
            var badExpression = expressions.find(function (expression) { return !expression.isExpression(); });
            throw new BabelParseError(badExpression.node, 'Invalid substitutions for `$localize` (expected all substitution arguments to be expressions).');
        }
        return [
            expressions.map(function (path) { return path.node; }), expressions.map(function (expression) { return getLocation(expression); })
        ];
    }
    exports.unwrapSubstitutionsFromLocalizeCall = unwrapSubstitutionsFromLocalizeCall;
    function unwrapMessagePartsFromTemplateLiteral(elements) {
        var cooked = elements.map(function (q) {
            if (q.node.value.cooked === undefined) {
                throw new BabelParseError(q.node, "Unexpected undefined message part in \"" + elements.map(function (q) { return q.node.value.cooked; }) + "\"");
            }
            return q.node.value.cooked;
        });
        var raw = elements.map(function (q) { return q.node.value.raw; });
        var locations = elements.map(function (q) { return getLocation(q); });
        return [localize_1.ɵmakeTemplateObject(cooked, raw), locations];
    }
    exports.unwrapMessagePartsFromTemplateLiteral = unwrapMessagePartsFromTemplateLiteral;
    function unwrapExpressionsFromTemplateLiteral(quasi) {
        return [quasi.node.expressions, quasi.get('expressions').map(function (e) { return getLocation(e); })];
    }
    exports.unwrapExpressionsFromTemplateLiteral = unwrapExpressionsFromTemplateLiteral;
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
        if (!isStringLiteralArray(array.node)) {
            throw new BabelParseError(array.node, 'Unexpected messageParts for `$localize` (expected an array of strings).');
        }
        var elements = array.get('elements');
        return [elements.map(function (str) { return str.node.value; }), elements.map(function (str) { return getLocation(str); })];
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
    function isArrayOfExpressions(paths) {
        return paths.every(function (element) { return element.isExpression(); });
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
            file: file,
            text: getText(startPath),
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
        var _a;
        var opts = path === null || path === void 0 ? void 0 : path.hub.file.opts;
        return (opts === null || opts === void 0 ? void 0 : opts.filename) ?
            file_system_1.resolve((_a = opts.generatorOpts.sourceRoot) !== null && _a !== void 0 ? _a : opts.cwd, file_system_1.relative(opts.cwd, opts.filename)) :
            null;
    }
    function getLineAndColumn(loc) {
        // Note we want 0-based line numbers but Babel returns 1-based.
        return { line: loc.line - 1, column: loc.column };
    }
    function getText(path) {
        if (path.node.start === null || path.node.end === null) {
            return undefined;
        }
        return path.hub.file.code.substring(path.node.start, path.node.end);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX2ZpbGVfdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3NvdXJjZV9maWxlX3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCwyRUFBOEY7SUFDOUYsOENBQW1JO0lBRW5JLGdDQUFrQztJQUlsQzs7Ozs7T0FLRztJQUNILFNBQWdCLFVBQVUsQ0FDdEIsVUFBb0IsRUFBRSxZQUFvQjtRQUM1QyxPQUFPLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN2RixDQUFDO0lBSEQsZ0NBR0M7SUFFRDs7Ozs7T0FLRztJQUNILFNBQWdCLGlCQUFpQixDQUM3QixVQUFvQixFQUFFLElBQVk7UUFDcEMsT0FBTyxVQUFVLENBQUMsWUFBWSxFQUFFLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDO0lBQ3BFLENBQUM7SUFIRCw4Q0FHQztJQUVEOzs7T0FHRztJQUNILFNBQWdCLGtCQUFrQixDQUFDLFVBQWtDO1FBQ25FLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBRkQsZ0RBRUM7SUFFRDs7OztPQUlHO0lBQ0gsU0FBZ0Isd0JBQXdCLENBQ3BDLFlBQWtDLEVBQUUsYUFBc0M7UUFDNUUsSUFBSSxZQUFZLEdBQWlCLENBQUMsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVB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Q0FBQztJQUN0RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0Fic29sdXRlRnNQYXRoLCByZWxhdGl2ZSwgcmVzb2x2ZX0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQge8m1aXNNaXNzaW5nVHJhbnNsYXRpb25FcnJvciwgybVtYWtlVGVtcGxhdGVPYmplY3QsIMm1UGFyc2VkVHJhbnNsYXRpb24sIMm1U291cmNlTG9jYXRpb24sIMm1dHJhbnNsYXRlfSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5pbXBvcnQge05vZGVQYXRofSBmcm9tICdAYmFiZWwvdHJhdmVyc2UnO1xuaW1wb3J0ICogYXMgdCBmcm9tICdAYmFiZWwvdHlwZXMnO1xuXG5pbXBvcnQge0RpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5LCBEaWFnbm9zdGljc30gZnJvbSAnLi9kaWFnbm9zdGljcyc7XG5cbi8qKlxuICogSXMgdGhlIGdpdmVuIGBleHByZXNzaW9uYCB0aGUgZ2xvYmFsIGAkbG9jYWxpemVgIGlkZW50aWZpZXI/XG4gKlxuICogQHBhcmFtIGV4cHJlc3Npb24gVGhlIGV4cHJlc3Npb24gdG8gY2hlY2suXG4gKiBAcGFyYW0gbG9jYWxpemVOYW1lIFRoZSBjb25maWd1cmVkIG5hbWUgb2YgYCRsb2NhbGl6ZWAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0xvY2FsaXplKFxuICAgIGV4cHJlc3Npb246IE5vZGVQYXRoLCBsb2NhbGl6ZU5hbWU6IHN0cmluZyk6IGV4cHJlc3Npb24gaXMgTm9kZVBhdGg8dC5JZGVudGlmaWVyPiB7XG4gIHJldHVybiBpc05hbWVkSWRlbnRpZmllcihleHByZXNzaW9uLCBsb2NhbGl6ZU5hbWUpICYmIGlzR2xvYmFsSWRlbnRpZmllcihleHByZXNzaW9uKTtcbn1cblxuLyoqXG4gKiBJcyB0aGUgZ2l2ZW4gYGV4cHJlc3Npb25gIGFuIGlkZW50aWZpZXIgd2l0aCB0aGUgY29ycmVjdCBgbmFtZWA/XG4gKlxuICogQHBhcmFtIGV4cHJlc3Npb24gVGhlIGV4cHJlc3Npb24gdG8gY2hlY2suXG4gKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSBvZiB0aGUgaWRlbnRpZmllciB3ZSBhcmUgbG9va2luZyBmb3IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05hbWVkSWRlbnRpZmllcihcbiAgICBleHByZXNzaW9uOiBOb2RlUGF0aCwgbmFtZTogc3RyaW5nKTogZXhwcmVzc2lvbiBpcyBOb2RlUGF0aDx0LklkZW50aWZpZXI+IHtcbiAgcmV0dXJuIGV4cHJlc3Npb24uaXNJZGVudGlmaWVyKCkgJiYgZXhwcmVzc2lvbi5ub2RlLm5hbWUgPT09IG5hbWU7XG59XG5cbi8qKlxuICogSXMgdGhlIGdpdmVuIGBpZGVudGlmaWVyYCBkZWNsYXJlZCBnbG9iYWxseS5cbiAqIEBwYXJhbSBpZGVudGlmaWVyIFRoZSBpZGVudGlmaWVyIHRvIGNoZWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNHbG9iYWxJZGVudGlmaWVyKGlkZW50aWZpZXI6IE5vZGVQYXRoPHQuSWRlbnRpZmllcj4pIHtcbiAgcmV0dXJuICFpZGVudGlmaWVyLnNjb3BlIHx8ICFpZGVudGlmaWVyLnNjb3BlLmhhc0JpbmRpbmcoaWRlbnRpZmllci5ub2RlLm5hbWUpO1xufVxuXG4vKipcbiAqIEJ1aWxkIGEgdHJhbnNsYXRlZCBleHByZXNzaW9uIHRvIHJlcGxhY2UgdGhlIGNhbGwgdG8gYCRsb2NhbGl6ZWAuXG4gKiBAcGFyYW0gbWVzc2FnZVBhcnRzIFRoZSBzdGF0aWMgcGFydHMgb2YgdGhlIG1lc3NhZ2UuXG4gKiBAcGFyYW0gc3Vic3RpdHV0aW9ucyBUaGUgZXhwcmVzc2lvbnMgdG8gc3Vic3RpdHV0ZSBpbnRvIHRoZSBtZXNzYWdlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRMb2NhbGl6ZVJlcGxhY2VtZW50KFxuICAgIG1lc3NhZ2VQYXJ0czogVGVtcGxhdGVTdHJpbmdzQXJyYXksIHN1YnN0aXR1dGlvbnM6IHJlYWRvbmx5IHQuRXhwcmVzc2lvbltdKTogdC5FeHByZXNzaW9uIHtcbiAgbGV0IG1hcHBlZFN0cmluZzogdC5FeHByZXNzaW9uID0gdC5zdHJpbmdMaXRlcmFsKG1lc3NhZ2VQYXJ0c1swXSk7XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgbWVzc2FnZVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgbWFwcGVkU3RyaW5nID1cbiAgICAgICAgdC5iaW5hcnlFeHByZXNzaW9uKCcrJywgbWFwcGVkU3RyaW5nLCB3cmFwSW5QYXJlbnNJZk5lY2Vzc2FyeShzdWJzdGl0dXRpb25zW2kgLSAxXSkpO1xuICAgIG1hcHBlZFN0cmluZyA9IHQuYmluYXJ5RXhwcmVzc2lvbignKycsIG1hcHBlZFN0cmluZywgdC5zdHJpbmdMaXRlcmFsKG1lc3NhZ2VQYXJ0c1tpXSkpO1xuICB9XG4gIHJldHVybiBtYXBwZWRTdHJpbmc7XG59XG5cbi8qKlxuICogRXh0cmFjdCB0aGUgbWVzc2FnZSBwYXJ0cyBmcm9tIHRoZSBnaXZlbiBgY2FsbGAgKHRvIGAkbG9jYWxpemVgKS5cbiAqXG4gKiBUaGUgbWVzc2FnZSBwYXJ0cyB3aWxsIGVpdGhlciBieSB0aGUgZmlyc3QgYXJndW1lbnQgdG8gdGhlIGBjYWxsYCBvciBpdCB3aWxsIGJlIHdyYXBwZWQgaW4gY2FsbFxuICogdG8gYSBoZWxwZXIgZnVuY3Rpb24gbGlrZSBgX19tYWtlVGVtcGxhdGVPYmplY3RgLlxuICpcbiAqIEBwYXJhbSBjYWxsIFRoZSBBU1Qgbm9kZSBvZiB0aGUgY2FsbCB0byBwcm9jZXNzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdW53cmFwTWVzc2FnZVBhcnRzRnJvbUxvY2FsaXplQ2FsbChjYWxsOiBOb2RlUGF0aDx0LkNhbGxFeHByZXNzaW9uPik6XG4gICAgW1RlbXBsYXRlU3RyaW5nc0FycmF5LCAoybVTb3VyY2VMb2NhdGlvbiB8IHVuZGVmaW5lZClbXV0ge1xuICBsZXQgY29va2VkID0gY2FsbC5nZXQoJ2FyZ3VtZW50cycpWzBdO1xuXG4gIGlmIChjb29rZWQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoY2FsbC5ub2RlLCAnYCRsb2NhbGl6ZWAgY2FsbGVkIHdpdGhvdXQgYW55IGFyZ3VtZW50cy4nKTtcbiAgfVxuICBpZiAoIWNvb2tlZC5pc0V4cHJlc3Npb24oKSkge1xuICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgIGNvb2tlZC5ub2RlLCAnVW5leHBlY3RlZCBhcmd1bWVudCB0byBgJGxvY2FsaXplYCAoZXhwZWN0ZWQgYW4gYXJyYXkpLicpO1xuICB9XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gY2FsbCB0byBgX19tYWtlVGVtcGxhdGVPYmplY3QoLi4uKWAsIHRoZW4gYHJhd2AgbXVzdCBiZSB0aGUgc2FtZSBhcyBgY29va2VkYC5cbiAgbGV0IHJhdyA9IGNvb2tlZDtcblxuICAvLyBDaGVjayBmb3IgY2FjaGVkIGNhbGwgb2YgdGhlIGZvcm0gYHggfHwgeCA9IF9fbWFrZVRlbXBsYXRlT2JqZWN0KC4uLilgXG4gIGlmIChjb29rZWQuaXNMb2dpY2FsRXhwcmVzc2lvbigpICYmIGNvb2tlZC5ub2RlLm9wZXJhdG9yID09PSAnfHwnICYmXG4gICAgICBjb29rZWQuZ2V0KCdsZWZ0JykuaXNJZGVudGlmaWVyKCkpIHtcbiAgICBjb25zdCByaWdodCA9IGNvb2tlZC5nZXQoJ3JpZ2h0Jyk7XG4gICAgaWYgKHJpZ2h0LmlzQXNzaWdubWVudEV4cHJlc3Npb24oKSkge1xuICAgICAgY29va2VkID0gcmlnaHQuZ2V0KCdyaWdodCcpO1xuICAgICAgaWYgKCFjb29rZWQuaXNFeHByZXNzaW9uKCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICAgIGNvb2tlZC5ub2RlLCAnVW5leHBlY3RlZCBcIm1ha2VUZW1wbGF0ZU9iamVjdCgpXCIgZnVuY3Rpb24gKGV4cGVjdGVkIGFuIGV4cHJlc3Npb24pLicpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmlnaHQuaXNTZXF1ZW5jZUV4cHJlc3Npb24oKSkge1xuICAgICAgY29uc3QgZXhwcmVzc2lvbnMgPSByaWdodC5nZXQoJ2V4cHJlc3Npb25zJyk7XG4gICAgICBpZiAoZXhwcmVzc2lvbnMubGVuZ3RoID4gMikge1xuICAgICAgICAvLyBUaGlzIGlzIGEgbWluaWZpZWQgc2VxdWVuY2UgZXhwcmVzc2lvbiwgd2hlcmUgdGhlIGZpcnN0IHR3byBleHByZXNzaW9ucyBpbiB0aGUgc2VxdWVuY2VcbiAgICAgICAgLy8gYXJlIGFzc2lnbm1lbnRzIG9mIHRoZSBjb29rZWQgYW5kIHJhdyBhcnJheXMgcmVzcGVjdGl2ZWx5LlxuICAgICAgICBjb25zdCBbZmlyc3QsIHNlY29uZF0gPSBleHByZXNzaW9ucztcbiAgICAgICAgaWYgKGZpcnN0LmlzQXNzaWdubWVudEV4cHJlc3Npb24oKSAmJiBzZWNvbmQuaXNBc3NpZ25tZW50RXhwcmVzc2lvbigpKSB7XG4gICAgICAgICAgY29va2VkID0gZmlyc3QuZ2V0KCdyaWdodCcpO1xuICAgICAgICAgIGlmICghY29va2VkLmlzRXhwcmVzc2lvbigpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICAgICAgICAgIGZpcnN0Lm5vZGUsICdVbmV4cGVjdGVkIGNvb2tlZCB2YWx1ZSwgZXhwZWN0ZWQgYW4gZXhwcmVzc2lvbi4nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmF3ID0gc2Vjb25kLmdldCgncmlnaHQnKTtcbiAgICAgICAgICBpZiAoIXJhdy5pc0V4cHJlc3Npb24oKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihzZWNvbmQubm9kZSwgJ1VuZXhwZWN0ZWQgcmF3IHZhbHVlLCBleHBlY3RlZCBhbiBleHByZXNzaW9uLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENoZWNrIGZvciBgX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpYCBvciBgX190ZW1wbGF0ZU9iamVjdCgpYCBjYWxscy5cbiAgaWYgKGNvb2tlZC5pc0NhbGxFeHByZXNzaW9uKCkpIHtcbiAgICBsZXQgY2FsbCA9IGNvb2tlZDtcbiAgICBpZiAoY2FsbC5nZXQoJ2FyZ3VtZW50cycpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gTm8gYXJndW1lbnRzIHNvIHBlcmhhcHMgaXQgaXMgYSBgX190ZW1wbGF0ZU9iamVjdCgpYCBjYWxsLlxuICAgICAgLy8gVW53cmFwIHRoaXMgdG8gZ2V0IHRoZSBgX3RhZ2dlZFRlbXBsYXRlTGl0ZXJhbChjb29rZWQsIHJhdylgIGNhbGwuXG4gICAgICBjYWxsID0gdW53cmFwTGF6eUxvYWRIZWxwZXJDYWxsKGNhbGwpO1xuICAgIH1cblxuICAgIGNvb2tlZCA9IGNhbGwuZ2V0KCdhcmd1bWVudHMnKVswXTtcbiAgICBpZiAoIWNvb2tlZC5pc0V4cHJlc3Npb24oKSkge1xuICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICBjb29rZWQubm9kZSxcbiAgICAgICAgICAnVW5leHBlY3RlZCBgY29va2VkYCBhcmd1bWVudCB0byB0aGUgXCJtYWtlVGVtcGxhdGVPYmplY3QoKVwiIGZ1bmN0aW9uIChleHBlY3RlZCBhbiBleHByZXNzaW9uKS4nKTtcbiAgICB9XG4gICAgY29uc3QgYXJnMiA9IGNhbGwuZ2V0KCdhcmd1bWVudHMnKVsxXTtcbiAgICBpZiAoYXJnMiAmJiAhYXJnMi5pc0V4cHJlc3Npb24oKSkge1xuICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICBhcmcyLm5vZGUsXG4gICAgICAgICAgJ1VuZXhwZWN0ZWQgYHJhd2AgYXJndW1lbnQgdG8gdGhlIFwibWFrZVRlbXBsYXRlT2JqZWN0KClcIiBmdW5jdGlvbiAoZXhwZWN0ZWQgYW4gZXhwcmVzc2lvbikuJyk7XG4gICAgfVxuICAgIC8vIElmIHRoZXJlIGlzIG5vIHNlY29uZCBhcmd1bWVudCB0aGVuIGFzc3VtZSB0aGF0IHJhdyBhbmQgY29va2VkIGFyZSB0aGUgc2FtZVxuICAgIHJhdyA9IGFyZzIgIT09IHVuZGVmaW5lZCA/IGFyZzIgOiBjb29rZWQ7XG4gIH1cblxuICBjb25zdCBbY29va2VkU3RyaW5nc10gPSB1bndyYXBTdHJpbmdMaXRlcmFsQXJyYXkoY29va2VkKTtcbiAgY29uc3QgW3Jhd1N0cmluZ3MsIHJhd0xvY2F0aW9uc10gPSB1bndyYXBTdHJpbmdMaXRlcmFsQXJyYXkocmF3KTtcbiAgcmV0dXJuIFvJtW1ha2VUZW1wbGF0ZU9iamVjdChjb29rZWRTdHJpbmdzLCByYXdTdHJpbmdzKSwgcmF3TG9jYXRpb25zXTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gdW53cmFwU3Vic3RpdHV0aW9uc0Zyb21Mb2NhbGl6ZUNhbGwoY2FsbDogTm9kZVBhdGg8dC5DYWxsRXhwcmVzc2lvbj4pOlxuICAgIFt0LkV4cHJlc3Npb25bXSwgKMm1U291cmNlTG9jYXRpb24gfCB1bmRlZmluZWQpW11dIHtcbiAgY29uc3QgZXhwcmVzc2lvbnMgPSBjYWxsLmdldCgnYXJndW1lbnRzJykuc3BsaWNlKDEpO1xuICBpZiAoIWlzQXJyYXlPZkV4cHJlc3Npb25zKGV4cHJlc3Npb25zKSkge1xuICAgIGNvbnN0IGJhZEV4cHJlc3Npb24gPSBleHByZXNzaW9ucy5maW5kKGV4cHJlc3Npb24gPT4gIWV4cHJlc3Npb24uaXNFeHByZXNzaW9uKCkpITtcbiAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICBiYWRFeHByZXNzaW9uLm5vZGUsXG4gICAgICAgICdJbnZhbGlkIHN1YnN0aXR1dGlvbnMgZm9yIGAkbG9jYWxpemVgIChleHBlY3RlZCBhbGwgc3Vic3RpdHV0aW9uIGFyZ3VtZW50cyB0byBiZSBleHByZXNzaW9ucykuJyk7XG4gIH1cbiAgcmV0dXJuIFtcbiAgICBleHByZXNzaW9ucy5tYXAocGF0aCA9PiBwYXRoLm5vZGUpLCBleHByZXNzaW9ucy5tYXAoZXhwcmVzc2lvbiA9PiBnZXRMb2NhdGlvbihleHByZXNzaW9uKSlcbiAgXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVud3JhcE1lc3NhZ2VQYXJ0c0Zyb21UZW1wbGF0ZUxpdGVyYWwoZWxlbWVudHM6IE5vZGVQYXRoPHQuVGVtcGxhdGVFbGVtZW50PltdKTpcbiAgICBbVGVtcGxhdGVTdHJpbmdzQXJyYXksICjJtVNvdXJjZUxvY2F0aW9uIHwgdW5kZWZpbmVkKVtdXSB7XG4gIGNvbnN0IGNvb2tlZCA9IGVsZW1lbnRzLm1hcChxID0+IHtcbiAgICBpZiAocS5ub2RlLnZhbHVlLmNvb2tlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICAgIHEubm9kZSxcbiAgICAgICAgICBgVW5leHBlY3RlZCB1bmRlZmluZWQgbWVzc2FnZSBwYXJ0IGluIFwiJHtlbGVtZW50cy5tYXAocSA9PiBxLm5vZGUudmFsdWUuY29va2VkKX1cImApO1xuICAgIH1cbiAgICByZXR1cm4gcS5ub2RlLnZhbHVlLmNvb2tlZDtcbiAgfSk7XG4gIGNvbnN0IHJhdyA9IGVsZW1lbnRzLm1hcChxID0+IHEubm9kZS52YWx1ZS5yYXcpO1xuICBjb25zdCBsb2NhdGlvbnMgPSBlbGVtZW50cy5tYXAocSA9PiBnZXRMb2NhdGlvbihxKSk7XG4gIHJldHVybiBbybVtYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpLCBsb2NhdGlvbnNdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW53cmFwRXhwcmVzc2lvbnNGcm9tVGVtcGxhdGVMaXRlcmFsKHF1YXNpOiBOb2RlUGF0aDx0LlRlbXBsYXRlTGl0ZXJhbD4pOlxuICAgIFt0LkV4cHJlc3Npb25bXSwgKMm1U291cmNlTG9jYXRpb24gfCB1bmRlZmluZWQpW11dIHtcbiAgcmV0dXJuIFtxdWFzaS5ub2RlLmV4cHJlc3Npb25zLCBxdWFzaS5nZXQoJ2V4cHJlc3Npb25zJykubWFwKGUgPT4gZ2V0TG9jYXRpb24oZSkpXTtcbn1cblxuLyoqXG4gKiBXcmFwIHRoZSBnaXZlbiBgZXhwcmVzc2lvbmAgaW4gcGFyZW50aGVzZXMgaWYgaXQgaXMgYSBiaW5hcnkgZXhwcmVzc2lvbi5cbiAqXG4gKiBUaGlzIGVuc3VyZXMgdGhhdCB0aGlzIGV4cHJlc3Npb24gaXMgZXZhbHVhdGVkIGNvcnJlY3RseSBpZiBpdCBpcyBlbWJlZGRlZCBpbiBhbm90aGVyIGV4cHJlc3Npb24uXG4gKlxuICogQHBhcmFtIGV4cHJlc3Npb24gVGhlIGV4cHJlc3Npb24gdG8gcG90ZW50aWFsbHkgd3JhcC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdyYXBJblBhcmVuc0lmTmVjZXNzYXJ5KGV4cHJlc3Npb246IHQuRXhwcmVzc2lvbik6IHQuRXhwcmVzc2lvbiB7XG4gIGlmICh0LmlzQmluYXJ5RXhwcmVzc2lvbihleHByZXNzaW9uKSkge1xuICAgIHJldHVybiB0LnBhcmVudGhlc2l6ZWRFeHByZXNzaW9uKGV4cHJlc3Npb24pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBleHByZXNzaW9uO1xuICB9XG59XG5cbi8qKlxuICogRXh0cmFjdCB0aGUgc3RyaW5nIHZhbHVlcyBmcm9tIGFuIGBhcnJheWAgb2Ygc3RyaW5nIGxpdGVyYWxzLlxuICogQHBhcmFtIGFycmF5IFRoZSBhcnJheSB0byB1bndyYXAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bndyYXBTdHJpbmdMaXRlcmFsQXJyYXkoYXJyYXk6IE5vZGVQYXRoPHQuRXhwcmVzc2lvbj4pOlxuICAgIFtzdHJpbmdbXSwgKMm1U291cmNlTG9jYXRpb24gfCB1bmRlZmluZWQpW11dIHtcbiAgaWYgKCFpc1N0cmluZ0xpdGVyYWxBcnJheShhcnJheS5ub2RlKSkge1xuICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgIGFycmF5Lm5vZGUsICdVbmV4cGVjdGVkIG1lc3NhZ2VQYXJ0cyBmb3IgYCRsb2NhbGl6ZWAgKGV4cGVjdGVkIGFuIGFycmF5IG9mIHN0cmluZ3MpLicpO1xuICB9XG4gIGNvbnN0IGVsZW1lbnRzID0gYXJyYXkuZ2V0KCdlbGVtZW50cycpIGFzIE5vZGVQYXRoPHQuU3RyaW5nTGl0ZXJhbD5bXTtcbiAgcmV0dXJuIFtlbGVtZW50cy5tYXAoc3RyID0+IHN0ci5ub2RlLnZhbHVlKSwgZWxlbWVudHMubWFwKHN0ciA9PiBnZXRMb2NhdGlvbihzdHIpKV07XG59XG5cbi8qKlxuICogVGhpcyBleHByZXNzaW9uIGlzIGJlbGlldmVkIHRvIGJlIGEgY2FsbCB0byBhIFwibGF6eS1sb2FkXCIgdGVtcGxhdGUgb2JqZWN0IGhlbHBlciBmdW5jdGlvbi5cbiAqIFRoaXMgaXMgZXhwZWN0ZWQgdG8gYmUgb2YgdGhlIGZvcm06XG4gKlxuICogYGBgdHNcbiAqICBmdW5jdGlvbiBfdGVtcGxhdGVPYmplY3QoKSB7XG4gKiAgICB2YXIgZSA9IF90YWdnZWRUZW1wbGF0ZUxpdGVyYWwoWydjb29rZWQgc3RyaW5nJywgJ3JhdyBzdHJpbmcnXSk7XG4gKiAgICByZXR1cm4gX3RlbXBsYXRlT2JqZWN0ID0gZnVuY3Rpb24oKSB7IHJldHVybiBlIH0sIGVcbiAqICB9XG4gKiBgYGBcbiAqXG4gKiBXZSB1bndyYXAgdGhpcyB0byByZXR1cm4gdGhlIGNhbGwgdG8gYF90YWdnZWRUZW1wbGF0ZUxpdGVyYWwoKWAuXG4gKlxuICogQHBhcmFtIGNhbGwgdGhlIGNhbGwgZXhwcmVzc2lvbiB0byB1bndyYXBcbiAqIEByZXR1cm5zIHRoZSAgY2FsbCBleHByZXNzaW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bndyYXBMYXp5TG9hZEhlbHBlckNhbGwoY2FsbDogTm9kZVBhdGg8dC5DYWxsRXhwcmVzc2lvbj4pOlxuICAgIE5vZGVQYXRoPHQuQ2FsbEV4cHJlc3Npb24+IHtcbiAgY29uc3QgY2FsbGVlID0gY2FsbC5nZXQoJ2NhbGxlZScpO1xuICBpZiAoIWNhbGxlZS5pc0lkZW50aWZpZXIoKSkge1xuICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgIGNhbGxlZS5ub2RlLFxuICAgICAgICAnVW5leHBlY3RlZCBsYXp5LWxvYWQgaGVscGVyIGNhbGwgKGV4cGVjdGVkIGEgY2FsbCBvZiB0aGUgZm9ybSBgX3RlbXBsYXRlT2JqZWN0KClgKS4nKTtcbiAgfVxuICBjb25zdCBsYXp5TG9hZEJpbmRpbmcgPSBjYWxsLnNjb3BlLmdldEJpbmRpbmcoY2FsbGVlLm5vZGUubmFtZSk7XG4gIGlmICghbGF6eUxvYWRCaW5kaW5nKSB7XG4gICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihjYWxsZWUubm9kZSwgJ01pc3NpbmcgZGVjbGFyYXRpb24gZm9yIGxhenktbG9hZCBoZWxwZXIgZnVuY3Rpb24nKTtcbiAgfVxuICBjb25zdCBsYXp5TG9hZEZuID0gbGF6eUxvYWRCaW5kaW5nLnBhdGg7XG4gIGlmICghbGF6eUxvYWRGbi5pc0Z1bmN0aW9uRGVjbGFyYXRpb24oKSkge1xuICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgIGxhenlMb2FkRm4ubm9kZSwgJ1VuZXhwZWN0ZWQgZXhwcmVzc2lvbiAoZXhwZWN0ZWQgYSBmdW5jdGlvbiBkZWNsYXJhdGlvbicpO1xuICB9XG4gIGNvbnN0IHJldHVybmVkTm9kZSA9IGdldFJldHVybmVkRXhwcmVzc2lvbihsYXp5TG9hZEZuKTtcblxuICBpZiAocmV0dXJuZWROb2RlLmlzQ2FsbEV4cHJlc3Npb24oKSkge1xuICAgIHJldHVybiByZXR1cm5lZE5vZGU7XG4gIH1cblxuICBpZiAocmV0dXJuZWROb2RlLmlzSWRlbnRpZmllcigpKSB7XG4gICAgY29uc3QgaWRlbnRpZmllck5hbWUgPSByZXR1cm5lZE5vZGUubm9kZS5uYW1lO1xuICAgIGNvbnN0IGRlY2xhcmF0aW9uID0gcmV0dXJuZWROb2RlLnNjb3BlLmdldEJpbmRpbmcoaWRlbnRpZmllck5hbWUpO1xuICAgIGlmIChkZWNsYXJhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICAgIHJldHVybmVkTm9kZS5ub2RlLCAnTWlzc2luZyBkZWNsYXJhdGlvbiBmb3IgcmV0dXJuIHZhbHVlIGZyb20gaGVscGVyLicpO1xuICAgIH1cbiAgICBpZiAoIWRlY2xhcmF0aW9uLnBhdGguaXNWYXJpYWJsZURlY2xhcmF0b3IoKSkge1xuICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICBkZWNsYXJhdGlvbi5wYXRoLm5vZGUsXG4gICAgICAgICAgJ1VuZXhwZWN0ZWQgaGVscGVyIHJldHVybiB2YWx1ZSBkZWNsYXJhdGlvbiAoZXhwZWN0ZWQgYSB2YXJpYWJsZSBkZWNsYXJhdGlvbikuJyk7XG4gICAgfVxuICAgIGNvbnN0IGluaXRpYWxpemVyID0gZGVjbGFyYXRpb24ucGF0aC5nZXQoJ2luaXQnKTtcbiAgICBpZiAoIWluaXRpYWxpemVyLmlzQ2FsbEV4cHJlc3Npb24oKSkge1xuICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICBkZWNsYXJhdGlvbi5wYXRoLm5vZGUsXG4gICAgICAgICAgJ1VuZXhwZWN0ZWQgcmV0dXJuIHZhbHVlIGZyb20gaGVscGVyIChleHBlY3RlZCBhIGNhbGwgZXhwcmVzc2lvbikuJyk7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIHRoZSBsYXp5IGxvYWQgaGVscGVyIGlmIHRoaXMgaXMgdGhlIG9ubHkgcmVmZXJlbmNlIHRvIGl0LlxuICAgIGlmIChsYXp5TG9hZEJpbmRpbmcucmVmZXJlbmNlcyA9PT0gMSkge1xuICAgICAgbGF6eUxvYWRGbi5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5pdGlhbGl6ZXI7XG4gIH1cbiAgcmV0dXJuIGNhbGw7XG59XG5cbmZ1bmN0aW9uIGdldFJldHVybmVkRXhwcmVzc2lvbihmbjogTm9kZVBhdGg8dC5GdW5jdGlvbkRlY2xhcmF0aW9uPik6IE5vZGVQYXRoPHQuRXhwcmVzc2lvbj4ge1xuICBjb25zdCBib2R5U3RhdGVtZW50cyA9IGZuLmdldCgnYm9keScpLmdldCgnYm9keScpO1xuICBmb3IgKGNvbnN0IHN0YXRlbWVudCBvZiBib2R5U3RhdGVtZW50cykge1xuICAgIGlmIChzdGF0ZW1lbnQuaXNSZXR1cm5TdGF0ZW1lbnQoKSkge1xuICAgICAgY29uc3QgYXJndW1lbnQgPSBzdGF0ZW1lbnQuZ2V0KCdhcmd1bWVudCcpO1xuICAgICAgaWYgKGFyZ3VtZW50LmlzU2VxdWVuY2VFeHByZXNzaW9uKCkpIHtcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvbnMgPSBhcmd1bWVudC5nZXQoJ2V4cHJlc3Npb25zJyk7XG4gICAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KGV4cHJlc3Npb25zKSA/IGV4cHJlc3Npb25zW2V4cHJlc3Npb25zLmxlbmd0aCAtIDFdIDogZXhwcmVzc2lvbnM7XG4gICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50LmlzRXhwcmVzc2lvbigpKSB7XG4gICAgICAgIHJldHVybiBhcmd1bWVudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgICAgICBzdGF0ZW1lbnQubm9kZSwgJ0ludmFsaWQgcmV0dXJuIGFyZ3VtZW50IGluIGhlbHBlciBmdW5jdGlvbiAoZXhwZWN0ZWQgYW4gZXhwcmVzc2lvbikuJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoZm4ubm9kZSwgJ01pc3NpbmcgcmV0dXJuIHN0YXRlbWVudCBpbiBoZWxwZXIgZnVuY3Rpb24uJyk7XG59XG5cbi8qKlxuICogSXMgdGhlIGdpdmVuIGBub2RlYCBhbiBhcnJheSBvZiBsaXRlcmFsIHN0cmluZ3M/XG4gKlxuICogQHBhcmFtIG5vZGUgVGhlIG5vZGUgdG8gdGVzdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nTGl0ZXJhbEFycmF5KG5vZGU6IHQuTm9kZSk6IG5vZGUgaXMgdC5FeHByZXNzaW9uJlxuICAgIHtlbGVtZW50czogdC5TdHJpbmdMaXRlcmFsW119IHtcbiAgcmV0dXJuIHQuaXNBcnJheUV4cHJlc3Npb24obm9kZSkgJiYgbm9kZS5lbGVtZW50cy5ldmVyeShlbGVtZW50ID0+IHQuaXNTdHJpbmdMaXRlcmFsKGVsZW1lbnQpKTtcbn1cblxuLyoqXG4gKiBBcmUgYWxsIHRoZSBnaXZlbiBgbm9kZXNgIGV4cHJlc3Npb25zP1xuICogQHBhcmFtIG5vZGVzIFRoZSBub2RlcyB0byB0ZXN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheU9mRXhwcmVzc2lvbnMocGF0aHM6IE5vZGVQYXRoPHQuTm9kZT5bXSk6IHBhdGhzIGlzIE5vZGVQYXRoPHQuRXhwcmVzc2lvbj5bXSB7XG4gIHJldHVybiBwYXRocy5ldmVyeShlbGVtZW50ID0+IGVsZW1lbnQuaXNFeHByZXNzaW9uKCkpO1xufVxuXG4vKiogT3B0aW9ucyB0aGF0IGFmZmVjdCBob3cgdGhlIGBtYWtlRXNYWFhUcmFuc2xhdGVQbHVnaW4oKWAgZnVuY3Rpb25zIHdvcmsuICovXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zbGF0ZVBsdWdpbk9wdGlvbnMge1xuICBtaXNzaW5nVHJhbnNsYXRpb24/OiBEaWFnbm9zdGljSGFuZGxpbmdTdHJhdGVneTtcbiAgbG9jYWxpemVOYW1lPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRyYW5zbGF0ZSB0aGUgdGV4dCBvZiB0aGUgZ2l2ZW4gbWVzc2FnZSwgdXNpbmcgdGhlIGdpdmVuIHRyYW5zbGF0aW9ucy5cbiAqXG4gKiBMb2dzIGFzIHdhcm5pbmcgaWYgdGhlIHRyYW5zbGF0aW9uIGlzIG5vdCBhdmFpbGFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zbGF0ZShcbiAgICBkaWFnbm9zdGljczogRGlhZ25vc3RpY3MsIHRyYW5zbGF0aW9uczogUmVjb3JkPHN0cmluZywgybVQYXJzZWRUcmFuc2xhdGlvbj4sXG4gICAgbWVzc2FnZVBhcnRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgc3Vic3RpdHV0aW9uczogcmVhZG9ubHkgYW55W10sXG4gICAgbWlzc2luZ1RyYW5zbGF0aW9uOiBEaWFnbm9zdGljSGFuZGxpbmdTdHJhdGVneSk6IFtUZW1wbGF0ZVN0cmluZ3NBcnJheSwgcmVhZG9ubHkgYW55W11dIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gybV0cmFuc2xhdGUodHJhbnNsYXRpb25zLCBtZXNzYWdlUGFydHMsIHN1YnN0aXR1dGlvbnMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKMm1aXNNaXNzaW5nVHJhbnNsYXRpb25FcnJvcihlKSkge1xuICAgICAgZGlhZ25vc3RpY3MuYWRkKG1pc3NpbmdUcmFuc2xhdGlvbiwgZS5tZXNzYWdlKTtcbiAgICAgIC8vIFJldHVybiB0aGUgcGFyc2VkIG1lc3NhZ2UgYmVjYXVzZSB0aGlzIHdpbGwgaGF2ZSB0aGUgbWV0YSBibG9ja3Mgc3RyaXBwZWRcbiAgICAgIHJldHVybiBbXG4gICAgICAgIMm1bWFrZVRlbXBsYXRlT2JqZWN0KGUucGFyc2VkTWVzc2FnZS5tZXNzYWdlUGFydHMsIGUucGFyc2VkTWVzc2FnZS5tZXNzYWdlUGFydHMpLFxuICAgICAgICBzdWJzdGl0dXRpb25zXG4gICAgICBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBkaWFnbm9zdGljcy5lcnJvcihlLm1lc3NhZ2UpO1xuICAgICAgcmV0dXJuIFttZXNzYWdlUGFydHMsIHN1YnN0aXR1dGlvbnNdO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQmFiZWxQYXJzZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBwcml2YXRlIHJlYWRvbmx5IHR5cGUgPSAnQmFiZWxQYXJzZUVycm9yJztcbiAgY29uc3RydWN0b3IocHVibGljIG5vZGU6IHQuTm9kZSwgbWVzc2FnZTogc3RyaW5nKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQmFiZWxQYXJzZUVycm9yKGU6IGFueSk6IGUgaXMgQmFiZWxQYXJzZUVycm9yIHtcbiAgcmV0dXJuIGUudHlwZSA9PT0gJ0JhYmVsUGFyc2VFcnJvcic7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZENvZGVGcmFtZUVycm9yKHBhdGg6IE5vZGVQYXRoLCBlOiBCYWJlbFBhcnNlRXJyb3IpOiBzdHJpbmcge1xuICBjb25zdCBmaWxlbmFtZSA9IHBhdGguaHViLmZpbGUub3B0cy5maWxlbmFtZSB8fCAnKHVua25vd24gZmlsZSknO1xuICBjb25zdCBtZXNzYWdlID0gcGF0aC5odWIuZmlsZS5idWlsZENvZGVGcmFtZUVycm9yKGUubm9kZSwgZS5tZXNzYWdlKS5tZXNzYWdlO1xuICByZXR1cm4gYCR7ZmlsZW5hbWV9OiAke21lc3NhZ2V9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2F0aW9uKHN0YXJ0UGF0aDogTm9kZVBhdGgsIGVuZFBhdGg/OiBOb2RlUGF0aCk6IMm1U291cmNlTG9jYXRpb258dW5kZWZpbmVkIHtcbiAgY29uc3Qgc3RhcnRMb2NhdGlvbiA9IHN0YXJ0UGF0aC5ub2RlLmxvYztcbiAgY29uc3QgZmlsZSA9IGdldEZpbGVGcm9tUGF0aChzdGFydFBhdGgpO1xuICBpZiAoIXN0YXJ0TG9jYXRpb24gfHwgIWZpbGUpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgZW5kTG9jYXRpb24gPVxuICAgICAgZW5kUGF0aCAmJiBnZXRGaWxlRnJvbVBhdGgoZW5kUGF0aCkgPT09IGZpbGUgJiYgZW5kUGF0aC5ub2RlLmxvYyB8fCBzdGFydExvY2F0aW9uO1xuXG4gIHJldHVybiB7XG4gICAgc3RhcnQ6IGdldExpbmVBbmRDb2x1bW4oc3RhcnRMb2NhdGlvbi5zdGFydCksXG4gICAgZW5kOiBnZXRMaW5lQW5kQ29sdW1uKGVuZExvY2F0aW9uLmVuZCksXG4gICAgZmlsZSxcbiAgICB0ZXh0OiBnZXRUZXh0KHN0YXJ0UGF0aCksXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXJpYWxpemVMb2NhdGlvblBvc2l0aW9uKGxvY2F0aW9uOiDJtVNvdXJjZUxvY2F0aW9uKTogc3RyaW5nIHtcbiAgY29uc3QgZW5kTGluZVN0cmluZyA9IGxvY2F0aW9uLmVuZCAhPT0gdW5kZWZpbmVkICYmIGxvY2F0aW9uLmVuZC5saW5lICE9PSBsb2NhdGlvbi5zdGFydC5saW5lID9cbiAgICAgIGAsJHtsb2NhdGlvbi5lbmQubGluZSArIDF9YCA6XG4gICAgICAnJztcbiAgcmV0dXJuIGAke2xvY2F0aW9uLnN0YXJ0LmxpbmUgKyAxfSR7ZW5kTGluZVN0cmluZ31gO1xufVxuXG5mdW5jdGlvbiBnZXRGaWxlRnJvbVBhdGgocGF0aDogTm9kZVBhdGh8dW5kZWZpbmVkKTogQWJzb2x1dGVGc1BhdGh8bnVsbCB7XG4gIGNvbnN0IG9wdHMgPSBwYXRoPy5odWIuZmlsZS5vcHRzO1xuICByZXR1cm4gb3B0cz8uZmlsZW5hbWUgP1xuICAgICAgcmVzb2x2ZShvcHRzLmdlbmVyYXRvck9wdHMuc291cmNlUm9vdCA/PyBvcHRzLmN3ZCwgcmVsYXRpdmUob3B0cy5jd2QsIG9wdHMuZmlsZW5hbWUpKSA6XG4gICAgICBudWxsO1xufVxuXG5mdW5jdGlvbiBnZXRMaW5lQW5kQ29sdW1uKGxvYzoge2xpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXJ9KToge2xpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXJ9IHtcbiAgLy8gTm90ZSB3ZSB3YW50IDAtYmFzZWQgbGluZSBudW1iZXJzIGJ1dCBCYWJlbCByZXR1cm5zIDEtYmFzZWQuXG4gIHJldHVybiB7bGluZTogbG9jLmxpbmUgLSAxLCBjb2x1bW46IGxvYy5jb2x1bW59O1xufVxuXG5mdW5jdGlvbiBnZXRUZXh0KHBhdGg6IE5vZGVQYXRoKTogc3RyaW5nfHVuZGVmaW5lZCB7XG4gIGlmIChwYXRoLm5vZGUuc3RhcnQgPT09IG51bGwgfHwgcGF0aC5ub2RlLmVuZCA9PT0gbnVsbCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIHBhdGguaHViLmZpbGUuY29kZS5zdWJzdHJpbmcocGF0aC5ub2RlLnN0YXJ0LCBwYXRoLm5vZGUuZW5kKTtcbn1cbiJdfQ==
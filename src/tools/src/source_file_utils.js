(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/source_file_utils", ["require", "exports", "tslib", "@angular/localize", "@babel/types"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getLocation = exports.buildCodeFrameError = exports.isBabelParseError = exports.BabelParseError = exports.translate = exports.isArrayOfExpressions = exports.isStringLiteralArray = exports.unwrapLazyLoadHelperCall = exports.unwrapStringLiteralArray = exports.wrapInParensIfNecessary = exports.unwrapMessagePartsFromTemplateLiteral = exports.unwrapSubstitutionsFromLocalizeCall = exports.unwrapMessagePartsFromLocalizeCall = exports.buildLocalizeReplacement = exports.isGlobalIdentifier = exports.isNamedIdentifier = exports.isLocalize = void 0;
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
    function getLocation(path) {
        var location = path.node.loc;
        var file = path.hub.file.opts.filename;
        if (!location || !file) {
            return undefined;
        }
        // Note we clone the `start` and `end` objects so that their prototype chains,
        // from Babel, do not leak into our code.
        return { start: tslib_1.__assign({}, location.start), end: tslib_1.__assign({}, location.end), file: file };
    }
    exports.getLocation = getLocation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX2ZpbGVfdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3NvdXJjZV9maWxlX3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCw4Q0FBbUk7SUFFbkksZ0NBQWtDO0lBSWxDOzs7OztPQUtHO0lBQ0gsU0FBZ0IsVUFBVSxDQUN0QixVQUFvQixFQUFFLFlBQW9CO1FBQzVDLE9BQU8saUJBQWlCLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxJQUFJLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFIRCxnQ0FHQztJQUVEOzs7OztPQUtHO0lBQ0gsU0FBZ0IsaUJBQWlCLENBQzdCLFVBQW9CLEVBQUUsSUFBWTtRQUNwQyxPQUFPLFVBQVUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUM7SUFDcEUsQ0FBQztJQUhELDhDQUdDO0lBRUQ7OztPQUdHO0lBQ0gsU0FBZ0Isa0JBQWtCLENBQUMsVUFBa0M7UUFDbkUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pGLENBQUM7SUFGRCxnREFFQztJQUVEOzs7O09BSUc7SUFDSCxTQUFnQix3QkFBd0IsQ0FDcEMsWUFBa0MsRUFBRSxhQUFzQztRQUM1RSxJQUFJLFlBQVksR0FBaUIsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUs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QUFDLENBQU07UUFDdEMsT0FBTyxDQUFDLENBQUMsSUFBSSxLQUFLLGlCQUFpQixDQUFDO0lBQ3RDLENBQUM7SUFGRCw4Q0FFQztJQUVELFNBQWdCLG1CQUFtQixDQUFDLElBQWMsRUFBRSxDQUFrQjtRQUNwRSxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLGdCQUFnQixDQUFDO1FBQ2pFLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUM3RSxPQUFVLFFBQVEsVUFBSyxPQUFTLENBQUM7SUFDbkMsQ0FBQztJQUpELGtEQUlDO0lBRUQsU0FBZ0IsV0FBVyxDQUFDLElBQWM7UUFDeEMsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDL0IsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUV6QyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ3RCLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBRUQsOEVBQThFO1FBQzlFLHlDQUF5QztRQUN6QyxPQUFPLEVBQUMsS0FBSyx1QkFBTSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyx1QkFBTSxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxNQUFBLEVBQUMsQ0FBQztJQUNwRSxDQUFDO0lBWEQsa0NBV0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge8m1aXNNaXNzaW5nVHJhbnNsYXRpb25FcnJvciwgybVtYWtlVGVtcGxhdGVPYmplY3QsIMm1UGFyc2VkVHJhbnNsYXRpb24sIMm1U291cmNlTG9jYXRpb24sIMm1dHJhbnNsYXRlfSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5pbXBvcnQge05vZGVQYXRofSBmcm9tICdAYmFiZWwvdHJhdmVyc2UnO1xuaW1wb3J0ICogYXMgdCBmcm9tICdAYmFiZWwvdHlwZXMnO1xuXG5pbXBvcnQge0RpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5LCBEaWFnbm9zdGljc30gZnJvbSAnLi9kaWFnbm9zdGljcyc7XG5cbi8qKlxuICogSXMgdGhlIGdpdmVuIGBleHByZXNzaW9uYCB0aGUgZ2xvYmFsIGAkbG9jYWxpemVgIGlkZW50aWZpZXI/XG4gKlxuICogQHBhcmFtIGV4cHJlc3Npb24gVGhlIGV4cHJlc3Npb24gdG8gY2hlY2suXG4gKiBAcGFyYW0gbG9jYWxpemVOYW1lIFRoZSBjb25maWd1cmVkIG5hbWUgb2YgYCRsb2NhbGl6ZWAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0xvY2FsaXplKFxuICAgIGV4cHJlc3Npb246IE5vZGVQYXRoLCBsb2NhbGl6ZU5hbWU6IHN0cmluZyk6IGV4cHJlc3Npb24gaXMgTm9kZVBhdGg8dC5JZGVudGlmaWVyPiB7XG4gIHJldHVybiBpc05hbWVkSWRlbnRpZmllcihleHByZXNzaW9uLCBsb2NhbGl6ZU5hbWUpICYmIGlzR2xvYmFsSWRlbnRpZmllcihleHByZXNzaW9uKTtcbn1cblxuLyoqXG4gKiBJcyB0aGUgZ2l2ZW4gYGV4cHJlc3Npb25gIGFuIGlkZW50aWZpZXIgd2l0aCB0aGUgY29ycmVjdCBgbmFtZWA/XG4gKlxuICogQHBhcmFtIGV4cHJlc3Npb24gVGhlIGV4cHJlc3Npb24gdG8gY2hlY2suXG4gKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSBvZiB0aGUgaWRlbnRpZmllciB3ZSBhcmUgbG9va2luZyBmb3IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05hbWVkSWRlbnRpZmllcihcbiAgICBleHByZXNzaW9uOiBOb2RlUGF0aCwgbmFtZTogc3RyaW5nKTogZXhwcmVzc2lvbiBpcyBOb2RlUGF0aDx0LklkZW50aWZpZXI+IHtcbiAgcmV0dXJuIGV4cHJlc3Npb24uaXNJZGVudGlmaWVyKCkgJiYgZXhwcmVzc2lvbi5ub2RlLm5hbWUgPT09IG5hbWU7XG59XG5cbi8qKlxuICogSXMgdGhlIGdpdmVuIGBpZGVudGlmaWVyYCBkZWNsYXJlZCBnbG9iYWxseS5cbiAqIEBwYXJhbSBpZGVudGlmaWVyIFRoZSBpZGVudGlmaWVyIHRvIGNoZWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNHbG9iYWxJZGVudGlmaWVyKGlkZW50aWZpZXI6IE5vZGVQYXRoPHQuSWRlbnRpZmllcj4pIHtcbiAgcmV0dXJuICFpZGVudGlmaWVyLnNjb3BlIHx8ICFpZGVudGlmaWVyLnNjb3BlLmhhc0JpbmRpbmcoaWRlbnRpZmllci5ub2RlLm5hbWUpO1xufVxuXG4vKipcbiAqIEJ1aWxkIGEgdHJhbnNsYXRlZCBleHByZXNzaW9uIHRvIHJlcGxhY2UgdGhlIGNhbGwgdG8gYCRsb2NhbGl6ZWAuXG4gKiBAcGFyYW0gbWVzc2FnZVBhcnRzIFRoZSBzdGF0aWMgcGFydHMgb2YgdGhlIG1lc3NhZ2UuXG4gKiBAcGFyYW0gc3Vic3RpdHV0aW9ucyBUaGUgZXhwcmVzc2lvbnMgdG8gc3Vic3RpdHV0ZSBpbnRvIHRoZSBtZXNzYWdlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRMb2NhbGl6ZVJlcGxhY2VtZW50KFxuICAgIG1lc3NhZ2VQYXJ0czogVGVtcGxhdGVTdHJpbmdzQXJyYXksIHN1YnN0aXR1dGlvbnM6IHJlYWRvbmx5IHQuRXhwcmVzc2lvbltdKTogdC5FeHByZXNzaW9uIHtcbiAgbGV0IG1hcHBlZFN0cmluZzogdC5FeHByZXNzaW9uID0gdC5zdHJpbmdMaXRlcmFsKG1lc3NhZ2VQYXJ0c1swXSk7XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgbWVzc2FnZVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgbWFwcGVkU3RyaW5nID1cbiAgICAgICAgdC5iaW5hcnlFeHByZXNzaW9uKCcrJywgbWFwcGVkU3RyaW5nLCB3cmFwSW5QYXJlbnNJZk5lY2Vzc2FyeShzdWJzdGl0dXRpb25zW2kgLSAxXSkpO1xuICAgIG1hcHBlZFN0cmluZyA9IHQuYmluYXJ5RXhwcmVzc2lvbignKycsIG1hcHBlZFN0cmluZywgdC5zdHJpbmdMaXRlcmFsKG1lc3NhZ2VQYXJ0c1tpXSkpO1xuICB9XG4gIHJldHVybiBtYXBwZWRTdHJpbmc7XG59XG5cbi8qKlxuICogRXh0cmFjdCB0aGUgbWVzc2FnZSBwYXJ0cyBmcm9tIHRoZSBnaXZlbiBgY2FsbGAgKHRvIGAkbG9jYWxpemVgKS5cbiAqXG4gKiBUaGUgbWVzc2FnZSBwYXJ0cyB3aWxsIGVpdGhlciBieSB0aGUgZmlyc3QgYXJndW1lbnQgdG8gdGhlIGBjYWxsYCBvciBpdCB3aWxsIGJlIHdyYXBwZWQgaW4gY2FsbFxuICogdG8gYSBoZWxwZXIgZnVuY3Rpb24gbGlrZSBgX19tYWtlVGVtcGxhdGVPYmplY3RgLlxuICpcbiAqIEBwYXJhbSBjYWxsIFRoZSBBU1Qgbm9kZSBvZiB0aGUgY2FsbCB0byBwcm9jZXNzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdW53cmFwTWVzc2FnZVBhcnRzRnJvbUxvY2FsaXplQ2FsbChjYWxsOiBOb2RlUGF0aDx0LkNhbGxFeHByZXNzaW9uPik6XG4gICAgVGVtcGxhdGVTdHJpbmdzQXJyYXkge1xuICBsZXQgY29va2VkID0gY2FsbC5nZXQoJ2FyZ3VtZW50cycpWzBdO1xuXG4gIGlmIChjb29rZWQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoY2FsbC5ub2RlLCAnYCRsb2NhbGl6ZWAgY2FsbGVkIHdpdGhvdXQgYW55IGFyZ3VtZW50cy4nKTtcbiAgfVxuICBpZiAoIWNvb2tlZC5pc0V4cHJlc3Npb24oKSkge1xuICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgIGNvb2tlZC5ub2RlLCAnVW5leHBlY3RlZCBhcmd1bWVudCB0byBgJGxvY2FsaXplYCAoZXhwZWN0ZWQgYW4gYXJyYXkpLicpO1xuICB9XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gY2FsbCB0byBgX19tYWtlVGVtcGxhdGVPYmplY3QoLi4uKWAsIHRoZW4gYHJhd2AgbXVzdCBiZSB0aGUgc2FtZSBhcyBgY29va2VkYC5cbiAgbGV0IHJhdyA9IGNvb2tlZDtcblxuICAvLyBDaGVjayBmb3IgY2FjaGVkIGNhbGwgb2YgdGhlIGZvcm0gYHggfHwgeCA9IF9fbWFrZVRlbXBsYXRlT2JqZWN0KC4uLilgXG4gIGlmIChjb29rZWQuaXNMb2dpY2FsRXhwcmVzc2lvbigpICYmIGNvb2tlZC5ub2RlLm9wZXJhdG9yID09PSAnfHwnICYmXG4gICAgICBjb29rZWQuZ2V0KCdsZWZ0JykuaXNJZGVudGlmaWVyKCkpIHtcbiAgICBjb25zdCByaWdodCA9IGNvb2tlZC5nZXQoJ3JpZ2h0Jyk7XG4gICAgaWYgKHJpZ2h0LmlzQXNzaWdubWVudEV4cHJlc3Npb24oKSkge1xuICAgICAgY29va2VkID0gcmlnaHQuZ2V0KCdyaWdodCcpO1xuICAgICAgaWYgKCFjb29rZWQuaXNFeHByZXNzaW9uKCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICAgIGNvb2tlZC5ub2RlLCAnVW5leHBlY3RlZCBcIm1ha2VUZW1wbGF0ZU9iamVjdCgpXCIgZnVuY3Rpb24gKGV4cGVjdGVkIGFuIGV4cHJlc3Npb24pLicpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmlnaHQuaXNTZXF1ZW5jZUV4cHJlc3Npb24oKSkge1xuICAgICAgY29uc3QgZXhwcmVzc2lvbnMgPSByaWdodC5nZXQoJ2V4cHJlc3Npb25zJyk7XG4gICAgICBpZiAoZXhwcmVzc2lvbnMubGVuZ3RoID4gMikge1xuICAgICAgICAvLyBUaGlzIGlzIGEgbWluaWZpZWQgc2VxdWVuY2UgZXhwcmVzc2lvbiwgd2hlcmUgdGhlIGZpcnN0IHR3byBleHByZXNzaW9ucyBpbiB0aGUgc2VxdWVuY2VcbiAgICAgICAgLy8gYXJlIGFzc2lnbm1lbnRzIG9mIHRoZSBjb29rZWQgYW5kIHJhdyBhcnJheXMgcmVzcGVjdGl2ZWx5LlxuICAgICAgICBjb25zdCBbZmlyc3QsIHNlY29uZF0gPSBleHByZXNzaW9ucztcbiAgICAgICAgaWYgKGZpcnN0LmlzQXNzaWdubWVudEV4cHJlc3Npb24oKSAmJiBzZWNvbmQuaXNBc3NpZ25tZW50RXhwcmVzc2lvbigpKSB7XG4gICAgICAgICAgY29va2VkID0gZmlyc3QuZ2V0KCdyaWdodCcpO1xuICAgICAgICAgIGlmICghY29va2VkLmlzRXhwcmVzc2lvbigpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICAgICAgICAgIGZpcnN0Lm5vZGUsICdVbmV4cGVjdGVkIGNvb2tlZCB2YWx1ZSwgZXhwZWN0ZWQgYW4gZXhwcmVzc2lvbi4nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmF3ID0gc2Vjb25kLmdldCgncmlnaHQnKTtcbiAgICAgICAgICBpZiAoIXJhdy5pc0V4cHJlc3Npb24oKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihzZWNvbmQubm9kZSwgJ1VuZXhwZWN0ZWQgcmF3IHZhbHVlLCBleHBlY3RlZCBhbiBleHByZXNzaW9uLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENoZWNrIGZvciBgX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpYCBvciBgX190ZW1wbGF0ZU9iamVjdCgpYCBjYWxscy5cbiAgaWYgKGNvb2tlZC5pc0NhbGxFeHByZXNzaW9uKCkpIHtcbiAgICBsZXQgY2FsbCA9IGNvb2tlZDtcbiAgICBpZiAoY2FsbC5nZXQoJ2FyZ3VtZW50cycpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gTm8gYXJndW1lbnRzIHNvIHBlcmhhcHMgaXQgaXMgYSBgX190ZW1wbGF0ZU9iamVjdCgpYCBjYWxsLlxuICAgICAgLy8gVW53cmFwIHRoaXMgdG8gZ2V0IHRoZSBgX3RhZ2dlZFRlbXBsYXRlTGl0ZXJhbChjb29rZWQsIHJhdylgIGNhbGwuXG4gICAgICBjYWxsID0gdW53cmFwTGF6eUxvYWRIZWxwZXJDYWxsKGNhbGwpO1xuICAgIH1cblxuICAgIGNvb2tlZCA9IGNhbGwuZ2V0KCdhcmd1bWVudHMnKVswXTtcbiAgICBpZiAoIWNvb2tlZC5pc0V4cHJlc3Npb24oKSkge1xuICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICBjb29rZWQubm9kZSxcbiAgICAgICAgICAnVW5leHBlY3RlZCBgY29va2VkYCBhcmd1bWVudCB0byB0aGUgXCJtYWtlVGVtcGxhdGVPYmplY3QoKVwiIGZ1bmN0aW9uIChleHBlY3RlZCBhbiBleHByZXNzaW9uKS4nKTtcbiAgICB9XG4gICAgY29uc3QgYXJnMiA9IGNhbGwuZ2V0KCdhcmd1bWVudHMnKVsxXTtcbiAgICBpZiAoYXJnMiAmJiAhYXJnMi5pc0V4cHJlc3Npb24oKSkge1xuICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICBhcmcyLm5vZGUsXG4gICAgICAgICAgJ1VuZXhwZWN0ZWQgYHJhd2AgYXJndW1lbnQgdG8gdGhlIFwibWFrZVRlbXBsYXRlT2JqZWN0KClcIiBmdW5jdGlvbiAoZXhwZWN0ZWQgYW4gZXhwcmVzc2lvbikuJyk7XG4gICAgfVxuICAgIC8vIElmIHRoZXJlIGlzIG5vIHNlY29uZCBhcmd1bWVudCB0aGVuIGFzc3VtZSB0aGF0IHJhdyBhbmQgY29va2VkIGFyZSB0aGUgc2FtZVxuICAgIHJhdyA9IGFyZzIgIT09IHVuZGVmaW5lZCA/IGFyZzIgOiBjb29rZWQ7XG4gIH1cblxuICBjb25zdCBjb29rZWRTdHJpbmdzID0gdW53cmFwU3RyaW5nTGl0ZXJhbEFycmF5KGNvb2tlZC5ub2RlKTtcbiAgY29uc3QgcmF3U3RyaW5ncyA9IHVud3JhcFN0cmluZ0xpdGVyYWxBcnJheShyYXcubm9kZSk7XG4gIHJldHVybiDJtW1ha2VUZW1wbGF0ZU9iamVjdChjb29rZWRTdHJpbmdzLCByYXdTdHJpbmdzKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gdW53cmFwU3Vic3RpdHV0aW9uc0Zyb21Mb2NhbGl6ZUNhbGwoY2FsbDogdC5DYWxsRXhwcmVzc2lvbik6IHQuRXhwcmVzc2lvbltdIHtcbiAgY29uc3QgZXhwcmVzc2lvbnMgPSBjYWxsLmFyZ3VtZW50cy5zcGxpY2UoMSk7XG4gIGlmICghaXNBcnJheU9mRXhwcmVzc2lvbnMoZXhwcmVzc2lvbnMpKSB7XG4gICAgY29uc3QgYmFkRXhwcmVzc2lvbiA9IGV4cHJlc3Npb25zLmZpbmQoZXhwcmVzc2lvbiA9PiAhdC5pc0V4cHJlc3Npb24oZXhwcmVzc2lvbikpITtcbiAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICBiYWRFeHByZXNzaW9uLFxuICAgICAgICAnSW52YWxpZCBzdWJzdGl0dXRpb25zIGZvciBgJGxvY2FsaXplYCAoZXhwZWN0ZWQgYWxsIHN1YnN0aXR1dGlvbiBhcmd1bWVudHMgdG8gYmUgZXhwcmVzc2lvbnMpLicpO1xuICB9XG4gIHJldHVybiBleHByZXNzaW9ucztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVud3JhcE1lc3NhZ2VQYXJ0c0Zyb21UZW1wbGF0ZUxpdGVyYWwoZWxlbWVudHM6IHQuVGVtcGxhdGVFbGVtZW50W10pOlxuICAgIFRlbXBsYXRlU3RyaW5nc0FycmF5IHtcbiAgY29uc3QgY29va2VkID0gZWxlbWVudHMubWFwKHEgPT4ge1xuICAgIGlmIChxLnZhbHVlLmNvb2tlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICAgIHEsIGBVbmV4cGVjdGVkIHVuZGVmaW5lZCBtZXNzYWdlIHBhcnQgaW4gXCIke2VsZW1lbnRzLm1hcChxID0+IHEudmFsdWUuY29va2VkKX1cImApO1xuICAgIH1cbiAgICByZXR1cm4gcS52YWx1ZS5jb29rZWQ7XG4gIH0pO1xuICBjb25zdCByYXcgPSBlbGVtZW50cy5tYXAocSA9PiBxLnZhbHVlLnJhdyk7XG4gIHJldHVybiDJtW1ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdyk7XG59XG5cbi8qKlxuICogV3JhcCB0aGUgZ2l2ZW4gYGV4cHJlc3Npb25gIGluIHBhcmVudGhlc2VzIGlmIGl0IGlzIGEgYmluYXJ5IGV4cHJlc3Npb24uXG4gKlxuICogVGhpcyBlbnN1cmVzIHRoYXQgdGhpcyBleHByZXNzaW9uIGlzIGV2YWx1YXRlZCBjb3JyZWN0bHkgaWYgaXQgaXMgZW1iZWRkZWQgaW4gYW5vdGhlciBleHByZXNzaW9uLlxuICpcbiAqIEBwYXJhbSBleHByZXNzaW9uIFRoZSBleHByZXNzaW9uIHRvIHBvdGVudGlhbGx5IHdyYXAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3cmFwSW5QYXJlbnNJZk5lY2Vzc2FyeShleHByZXNzaW9uOiB0LkV4cHJlc3Npb24pOiB0LkV4cHJlc3Npb24ge1xuICBpZiAodC5pc0JpbmFyeUV4cHJlc3Npb24oZXhwcmVzc2lvbikpIHtcbiAgICByZXR1cm4gdC5wYXJlbnRoZXNpemVkRXhwcmVzc2lvbihleHByZXNzaW9uKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZXhwcmVzc2lvbjtcbiAgfVxufVxuXG4vKipcbiAqIEV4dHJhY3QgdGhlIHN0cmluZyB2YWx1ZXMgZnJvbSBhbiBgYXJyYXlgIG9mIHN0cmluZyBsaXRlcmFscy5cbiAqIEBwYXJhbSBhcnJheSBUaGUgYXJyYXkgdG8gdW53cmFwLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdW53cmFwU3RyaW5nTGl0ZXJhbEFycmF5KGFycmF5OiB0LkV4cHJlc3Npb24pOiBzdHJpbmdbXSB7XG4gIGlmICghaXNTdHJpbmdMaXRlcmFsQXJyYXkoYXJyYXkpKSB7XG4gICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgYXJyYXksICdVbmV4cGVjdGVkIG1lc3NhZ2VQYXJ0cyBmb3IgYCRsb2NhbGl6ZWAgKGV4cGVjdGVkIGFuIGFycmF5IG9mIHN0cmluZ3MpLicpO1xuICB9XG4gIHJldHVybiBhcnJheS5lbGVtZW50cy5tYXAoKHN0cjogdC5TdHJpbmdMaXRlcmFsKSA9PiBzdHIudmFsdWUpO1xufVxuXG4vKipcbiAqIFRoaXMgZXhwcmVzc2lvbiBpcyBiZWxpZXZlZCB0byBiZSBhIGNhbGwgdG8gYSBcImxhenktbG9hZFwiIHRlbXBsYXRlIG9iamVjdCBoZWxwZXIgZnVuY3Rpb24uXG4gKiBUaGlzIGlzIGV4cGVjdGVkIHRvIGJlIG9mIHRoZSBmb3JtOlxuICpcbiAqIGBgYHRzXG4gKiAgZnVuY3Rpb24gX3RlbXBsYXRlT2JqZWN0KCkge1xuICogICAgdmFyIGUgPSBfdGFnZ2VkVGVtcGxhdGVMaXRlcmFsKFsnY29va2VkIHN0cmluZycsICdyYXcgc3RyaW5nJ10pO1xuICogICAgcmV0dXJuIF90ZW1wbGF0ZU9iamVjdCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gZSB9LCBlXG4gKiAgfVxuICogYGBgXG4gKlxuICogV2UgdW53cmFwIHRoaXMgdG8gcmV0dXJuIHRoZSBjYWxsIHRvIGBfdGFnZ2VkVGVtcGxhdGVMaXRlcmFsKClgLlxuICpcbiAqIEBwYXJhbSBjYWxsIHRoZSBjYWxsIGV4cHJlc3Npb24gdG8gdW53cmFwXG4gKiBAcmV0dXJucyB0aGUgIGNhbGwgZXhwcmVzc2lvblxuICovXG5leHBvcnQgZnVuY3Rpb24gdW53cmFwTGF6eUxvYWRIZWxwZXJDYWxsKGNhbGw6IE5vZGVQYXRoPHQuQ2FsbEV4cHJlc3Npb24+KTpcbiAgICBOb2RlUGF0aDx0LkNhbGxFeHByZXNzaW9uPiB7XG4gIGNvbnN0IGNhbGxlZSA9IGNhbGwuZ2V0KCdjYWxsZWUnKTtcbiAgaWYgKCFjYWxsZWUuaXNJZGVudGlmaWVyKCkpIHtcbiAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICBjYWxsZWUubm9kZSxcbiAgICAgICAgJ1VuZXhwZWN0ZWQgbGF6eS1sb2FkIGhlbHBlciBjYWxsIChleHBlY3RlZCBhIGNhbGwgb2YgdGhlIGZvcm0gYF90ZW1wbGF0ZU9iamVjdCgpYCkuJyk7XG4gIH1cbiAgY29uc3QgbGF6eUxvYWRCaW5kaW5nID0gY2FsbC5zY29wZS5nZXRCaW5kaW5nKGNhbGxlZS5ub2RlLm5hbWUpO1xuICBpZiAoIWxhenlMb2FkQmluZGluZykge1xuICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoY2FsbGVlLm5vZGUsICdNaXNzaW5nIGRlY2xhcmF0aW9uIGZvciBsYXp5LWxvYWQgaGVscGVyIGZ1bmN0aW9uJyk7XG4gIH1cbiAgY29uc3QgbGF6eUxvYWRGbiA9IGxhenlMb2FkQmluZGluZy5wYXRoO1xuICBpZiAoIWxhenlMb2FkRm4uaXNGdW5jdGlvbkRlY2xhcmF0aW9uKCkpIHtcbiAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICBsYXp5TG9hZEZuLm5vZGUsICdVbmV4cGVjdGVkIGV4cHJlc3Npb24gKGV4cGVjdGVkIGEgZnVuY3Rpb24gZGVjbGFyYXRpb24nKTtcbiAgfVxuICBjb25zdCByZXR1cm5lZE5vZGUgPSBnZXRSZXR1cm5lZEV4cHJlc3Npb24obGF6eUxvYWRGbik7XG5cbiAgaWYgKHJldHVybmVkTm9kZS5pc0NhbGxFeHByZXNzaW9uKCkpIHtcbiAgICByZXR1cm4gcmV0dXJuZWROb2RlO1xuICB9XG5cbiAgaWYgKHJldHVybmVkTm9kZS5pc0lkZW50aWZpZXIoKSkge1xuICAgIGNvbnN0IGlkZW50aWZpZXJOYW1lID0gcmV0dXJuZWROb2RlLm5vZGUubmFtZTtcbiAgICBjb25zdCBkZWNsYXJhdGlvbiA9IHJldHVybmVkTm9kZS5zY29wZS5nZXRCaW5kaW5nKGlkZW50aWZpZXJOYW1lKTtcbiAgICBpZiAoZGVjbGFyYXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICByZXR1cm5lZE5vZGUubm9kZSwgJ01pc3NpbmcgZGVjbGFyYXRpb24gZm9yIHJldHVybiB2YWx1ZSBmcm9tIGhlbHBlci4nKTtcbiAgICB9XG4gICAgaWYgKCFkZWNsYXJhdGlvbi5wYXRoLmlzVmFyaWFibGVEZWNsYXJhdG9yKCkpIHtcbiAgICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgICAgZGVjbGFyYXRpb24ucGF0aC5ub2RlLFxuICAgICAgICAgICdVbmV4cGVjdGVkIGhlbHBlciByZXR1cm4gdmFsdWUgZGVjbGFyYXRpb24gKGV4cGVjdGVkIGEgdmFyaWFibGUgZGVjbGFyYXRpb24pLicpO1xuICAgIH1cbiAgICBjb25zdCBpbml0aWFsaXplciA9IGRlY2xhcmF0aW9uLnBhdGguZ2V0KCdpbml0Jyk7XG4gICAgaWYgKCFpbml0aWFsaXplci5pc0NhbGxFeHByZXNzaW9uKCkpIHtcbiAgICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgICAgZGVjbGFyYXRpb24ucGF0aC5ub2RlLFxuICAgICAgICAgICdVbmV4cGVjdGVkIHJldHVybiB2YWx1ZSBmcm9tIGhlbHBlciAoZXhwZWN0ZWQgYSBjYWxsIGV4cHJlc3Npb24pLicpO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSB0aGUgbGF6eSBsb2FkIGhlbHBlciBpZiB0aGlzIGlzIHRoZSBvbmx5IHJlZmVyZW5jZSB0byBpdC5cbiAgICBpZiAobGF6eUxvYWRCaW5kaW5nLnJlZmVyZW5jZXMgPT09IDEpIHtcbiAgICAgIGxhenlMb2FkRm4ucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGluaXRpYWxpemVyO1xuICB9XG4gIHJldHVybiBjYWxsO1xufVxuXG5mdW5jdGlvbiBnZXRSZXR1cm5lZEV4cHJlc3Npb24oZm46IE5vZGVQYXRoPHQuRnVuY3Rpb25EZWNsYXJhdGlvbj4pOiBOb2RlUGF0aDx0LkV4cHJlc3Npb24+IHtcbiAgY29uc3QgYm9keVN0YXRlbWVudHMgPSBmbi5nZXQoJ2JvZHknKS5nZXQoJ2JvZHknKTtcbiAgZm9yIChjb25zdCBzdGF0ZW1lbnQgb2YgYm9keVN0YXRlbWVudHMpIHtcbiAgICBpZiAoc3RhdGVtZW50LmlzUmV0dXJuU3RhdGVtZW50KCkpIHtcbiAgICAgIGNvbnN0IGFyZ3VtZW50ID0gc3RhdGVtZW50LmdldCgnYXJndW1lbnQnKTtcbiAgICAgIGlmIChhcmd1bWVudC5pc1NlcXVlbmNlRXhwcmVzc2lvbigpKSB7XG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb25zID0gYXJndW1lbnQuZ2V0KCdleHByZXNzaW9ucycpO1xuICAgICAgICByZXR1cm4gQXJyYXkuaXNBcnJheShleHByZXNzaW9ucykgPyBleHByZXNzaW9uc1tleHByZXNzaW9ucy5sZW5ndGggLSAxXSA6IGV4cHJlc3Npb25zO1xuICAgICAgfSBlbHNlIGlmIChhcmd1bWVudC5pc0V4cHJlc3Npb24oKSkge1xuICAgICAgICByZXR1cm4gYXJndW1lbnQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICAgICAgc3RhdGVtZW50Lm5vZGUsICdJbnZhbGlkIHJldHVybiBhcmd1bWVudCBpbiBoZWxwZXIgZnVuY3Rpb24gKGV4cGVjdGVkIGFuIGV4cHJlc3Npb24pLicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKGZuLm5vZGUsICdNaXNzaW5nIHJldHVybiBzdGF0ZW1lbnQgaW4gaGVscGVyIGZ1bmN0aW9uLicpO1xufVxuXG4vKipcbiAqIElzIHRoZSBnaXZlbiBgbm9kZWAgYW4gYXJyYXkgb2YgbGl0ZXJhbCBzdHJpbmdzP1xuICpcbiAqIEBwYXJhbSBub2RlIFRoZSBub2RlIHRvIHRlc3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1N0cmluZ0xpdGVyYWxBcnJheShub2RlOiB0Lk5vZGUpOiBub2RlIGlzIHQuRXhwcmVzc2lvbiZcbiAgICB7ZWxlbWVudHM6IHQuU3RyaW5nTGl0ZXJhbFtdfSB7XG4gIHJldHVybiB0LmlzQXJyYXlFeHByZXNzaW9uKG5vZGUpICYmIG5vZGUuZWxlbWVudHMuZXZlcnkoZWxlbWVudCA9PiB0LmlzU3RyaW5nTGl0ZXJhbChlbGVtZW50KSk7XG59XG5cbi8qKlxuICogQXJlIGFsbCB0aGUgZ2l2ZW4gYG5vZGVzYCBleHByZXNzaW9ucz9cbiAqIEBwYXJhbSBub2RlcyBUaGUgbm9kZXMgdG8gdGVzdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXlPZkV4cHJlc3Npb25zKG5vZGVzOiB0Lk5vZGVbXSk6IG5vZGVzIGlzIHQuRXhwcmVzc2lvbltdIHtcbiAgcmV0dXJuIG5vZGVzLmV2ZXJ5KGVsZW1lbnQgPT4gdC5pc0V4cHJlc3Npb24oZWxlbWVudCkpO1xufVxuXG4vKiogT3B0aW9ucyB0aGF0IGFmZmVjdCBob3cgdGhlIGBtYWtlRXNYWFhUcmFuc2xhdGVQbHVnaW4oKWAgZnVuY3Rpb25zIHdvcmsuICovXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zbGF0ZVBsdWdpbk9wdGlvbnMge1xuICBtaXNzaW5nVHJhbnNsYXRpb24/OiBEaWFnbm9zdGljSGFuZGxpbmdTdHJhdGVneTtcbiAgbG9jYWxpemVOYW1lPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRyYW5zbGF0ZSB0aGUgdGV4dCBvZiB0aGUgZ2l2ZW4gbWVzc2FnZSwgdXNpbmcgdGhlIGdpdmVuIHRyYW5zbGF0aW9ucy5cbiAqXG4gKiBMb2dzIGFzIHdhcm5pbmcgaWYgdGhlIHRyYW5zbGF0aW9uIGlzIG5vdCBhdmFpbGFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zbGF0ZShcbiAgICBkaWFnbm9zdGljczogRGlhZ25vc3RpY3MsIHRyYW5zbGF0aW9uczogUmVjb3JkPHN0cmluZywgybVQYXJzZWRUcmFuc2xhdGlvbj4sXG4gICAgbWVzc2FnZVBhcnRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgc3Vic3RpdHV0aW9uczogcmVhZG9ubHkgYW55W10sXG4gICAgbWlzc2luZ1RyYW5zbGF0aW9uOiBEaWFnbm9zdGljSGFuZGxpbmdTdHJhdGVneSk6IFtUZW1wbGF0ZVN0cmluZ3NBcnJheSwgcmVhZG9ubHkgYW55W11dIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gybV0cmFuc2xhdGUodHJhbnNsYXRpb25zLCBtZXNzYWdlUGFydHMsIHN1YnN0aXR1dGlvbnMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKMm1aXNNaXNzaW5nVHJhbnNsYXRpb25FcnJvcihlKSkge1xuICAgICAgZGlhZ25vc3RpY3MuYWRkKG1pc3NpbmdUcmFuc2xhdGlvbiwgZS5tZXNzYWdlKTtcbiAgICAgIC8vIFJldHVybiB0aGUgcGFyc2VkIG1lc3NhZ2UgYmVjYXVzZSB0aGlzIHdpbGwgaGF2ZSB0aGUgbWV0YSBibG9ja3Mgc3RyaXBwZWRcbiAgICAgIHJldHVybiBbXG4gICAgICAgIMm1bWFrZVRlbXBsYXRlT2JqZWN0KGUucGFyc2VkTWVzc2FnZS5tZXNzYWdlUGFydHMsIGUucGFyc2VkTWVzc2FnZS5tZXNzYWdlUGFydHMpLFxuICAgICAgICBzdWJzdGl0dXRpb25zXG4gICAgICBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBkaWFnbm9zdGljcy5lcnJvcihlLm1lc3NhZ2UpO1xuICAgICAgcmV0dXJuIFttZXNzYWdlUGFydHMsIHN1YnN0aXR1dGlvbnNdO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQmFiZWxQYXJzZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBwcml2YXRlIHJlYWRvbmx5IHR5cGUgPSAnQmFiZWxQYXJzZUVycm9yJztcbiAgY29uc3RydWN0b3IocHVibGljIG5vZGU6IHQuTm9kZSwgbWVzc2FnZTogc3RyaW5nKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQmFiZWxQYXJzZUVycm9yKGU6IGFueSk6IGUgaXMgQmFiZWxQYXJzZUVycm9yIHtcbiAgcmV0dXJuIGUudHlwZSA9PT0gJ0JhYmVsUGFyc2VFcnJvcic7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZENvZGVGcmFtZUVycm9yKHBhdGg6IE5vZGVQYXRoLCBlOiBCYWJlbFBhcnNlRXJyb3IpOiBzdHJpbmcge1xuICBjb25zdCBmaWxlbmFtZSA9IHBhdGguaHViLmZpbGUub3B0cy5maWxlbmFtZSB8fCAnKHVua25vd24gZmlsZSknO1xuICBjb25zdCBtZXNzYWdlID0gcGF0aC5odWIuZmlsZS5idWlsZENvZGVGcmFtZUVycm9yKGUubm9kZSwgZS5tZXNzYWdlKS5tZXNzYWdlO1xuICByZXR1cm4gYCR7ZmlsZW5hbWV9OiAke21lc3NhZ2V9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2F0aW9uKHBhdGg6IE5vZGVQYXRoKTogybVTb3VyY2VMb2NhdGlvbnx1bmRlZmluZWQge1xuICBjb25zdCBsb2NhdGlvbiA9IHBhdGgubm9kZS5sb2M7XG4gIGNvbnN0IGZpbGUgPSBwYXRoLmh1Yi5maWxlLm9wdHMuZmlsZW5hbWU7XG5cbiAgaWYgKCFsb2NhdGlvbiB8fCAhZmlsZSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvLyBOb3RlIHdlIGNsb25lIHRoZSBgc3RhcnRgIGFuZCBgZW5kYCBvYmplY3RzIHNvIHRoYXQgdGhlaXIgcHJvdG90eXBlIGNoYWlucyxcbiAgLy8gZnJvbSBCYWJlbCwgZG8gbm90IGxlYWsgaW50byBvdXIgY29kZS5cbiAgcmV0dXJuIHtzdGFydDogey4uLmxvY2F0aW9uLnN0YXJ0fSwgZW5kOiB7Li4ubG9jYXRpb24uZW5kfSwgZmlsZX07XG59XG4iXX0=
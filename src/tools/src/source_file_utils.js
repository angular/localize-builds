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
     *
     * @param identifier The identifier to check.
     * @publicApi used by CLI
     */
    function isGlobalIdentifier(identifier) {
        return !identifier.scope || !identifier.scope.hasBinding(identifier.node.name);
    }
    exports.isGlobalIdentifier = isGlobalIdentifier;
    /**
     * Build a translated expression to replace the call to `$localize`.
     * @param messageParts The static parts of the message.
     * @param substitutions The expressions to substitute into the message.
     * @publicApi used by CLI
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
     * @param fs The file system to use when computing source-map paths. If not provided then it uses
     *     the "current" FileSystem.
     * @publicApi used by CLI
     */
    function unwrapMessagePartsFromLocalizeCall(call, fs) {
        if (fs === void 0) { fs = file_system_1.getFileSystem(); }
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
        var _b = tslib_1.__read(unwrapStringLiteralArray(cooked, fs), 1), cookedStrings = _b[0];
        var _c = tslib_1.__read(unwrapStringLiteralArray(raw, fs), 2), rawStrings = _c[0], rawLocations = _c[1];
        return [localize_1.ɵmakeTemplateObject(cookedStrings, rawStrings), rawLocations];
    }
    exports.unwrapMessagePartsFromLocalizeCall = unwrapMessagePartsFromLocalizeCall;
    /**
     * Parse the localize call expression to extract the arguments that hold the substition expressions.
     *
     * @param call The AST node of the call to process.
     * @param fs The file system to use when computing source-map paths. If not provided then it uses
     *     the "current" FileSystem.
     * @publicApi used by CLI
     */
    function unwrapSubstitutionsFromLocalizeCall(call, fs) {
        if (fs === void 0) { fs = file_system_1.getFileSystem(); }
        var expressions = call.get('arguments').splice(1);
        if (!isArrayOfExpressions(expressions)) {
            var badExpression = expressions.find(function (expression) { return !expression.isExpression(); });
            throw new BabelParseError(badExpression.node, 'Invalid substitutions for `$localize` (expected all substitution arguments to be expressions).');
        }
        return [
            expressions.map(function (path) { return path.node; }), expressions.map(function (expression) { return getLocation(fs, expression); })
        ];
    }
    exports.unwrapSubstitutionsFromLocalizeCall = unwrapSubstitutionsFromLocalizeCall;
    /**
     * Parse the tagged template literal to extract the message parts.
     *
     * @param elements The elements of the template literal to process.
     * @param fs The file system to use when computing source-map paths. If not provided then it uses
     *     the "current" FileSystem.
     * @publicApi used by CLI
     */
    function unwrapMessagePartsFromTemplateLiteral(elements, fs) {
        if (fs === void 0) { fs = file_system_1.getFileSystem(); }
        var cooked = elements.map(function (q) {
            if (q.node.value.cooked === undefined) {
                throw new BabelParseError(q.node, "Unexpected undefined message part in \"" + elements.map(function (q) { return q.node.value.cooked; }) + "\"");
            }
            return q.node.value.cooked;
        });
        var raw = elements.map(function (q) { return q.node.value.raw; });
        var locations = elements.map(function (q) { return getLocation(fs, q); });
        return [localize_1.ɵmakeTemplateObject(cooked, raw), locations];
    }
    exports.unwrapMessagePartsFromTemplateLiteral = unwrapMessagePartsFromTemplateLiteral;
    /**
     * Parse the tagged template literal to extract the interpolation expressions.
     *
     * @param quasi The AST node of the template literal to process.
     * @param fs The file system to use when computing source-map paths. If not provided then it uses
     *     the "current" FileSystem.
     * @publicApi used by CLI
     */
    function unwrapExpressionsFromTemplateLiteral(quasi, fs) {
        if (fs === void 0) { fs = file_system_1.getFileSystem(); }
        return [quasi.node.expressions, quasi.get('expressions').map(function (e) { return getLocation(fs, e); })];
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
     *
     * @param array The array to unwrap.
     * @param fs The file system to use when computing source-map paths. If not provided then it uses
     *     the "current" FileSystem.
     */
    function unwrapStringLiteralArray(array, fs) {
        if (fs === void 0) { fs = file_system_1.getFileSystem(); }
        if (!isStringLiteralArray(array.node)) {
            throw new BabelParseError(array.node, 'Unexpected messageParts for `$localize` (expected an array of strings).');
        }
        var elements = array.get('elements');
        return [elements.map(function (str) { return str.node.value; }), elements.map(function (str) { return getLocation(fs, str); })];
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
     * @publicApi used by CLI
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
    function getLocation(fs, startPath, endPath) {
        var startLocation = startPath.node.loc;
        var file = getFileFromPath(fs, startPath);
        if (!startLocation || !file) {
            return undefined;
        }
        var endLocation = endPath && getFileFromPath(fs, endPath) === file && endPath.node.loc || startLocation;
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
    function getFileFromPath(fs, path) {
        var _a;
        var opts = path === null || path === void 0 ? void 0 : path.hub.file.opts;
        return (opts === null || opts === void 0 ? void 0 : opts.filename) ?
            fs.resolve((_a = opts.generatorOpts.sourceRoot) !== null && _a !== void 0 ? _a : opts.cwd, fs.relative(opts.cwd, opts.filename)) :
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX2ZpbGVfdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3NvdXJjZV9maWxlX3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCwyRUFBNEc7SUFDNUcsOENBQW1JO0lBRW5JLGdDQUFrQztJQUlsQzs7Ozs7T0FLRztJQUNILFNBQWdCLFVBQVUsQ0FDdEIsVUFBb0IsRUFBRSxZQUFvQjtRQUM1QyxPQUFPLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN2RixDQUFDO0lBSEQsZ0NBR0M7SUFFRDs7Ozs7T0FLRztJQUNILFNBQWdCLGlCQUFpQixDQUM3QixVQUFvQixFQUFFLElBQVk7UUFDcEMsT0FBTyxVQUFVLENBQUMsWUFBWSxFQUFFLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDO0lBQ3BFLENBQUM7SUFIRCw4Q0FHQztJQUVEOzs7OztPQUtHO0lBQ0gsU0FBZ0Isa0JBQWtCLENBQUMsVUFBa0M7UUFDbkUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pGLENBQUM7SUFGRCxnREFFQztJQUVEOzs7OztPQUtHO0lBQ0gsU0FBZ0Isd0JBQXdCLENBQ3BDLFlBQWtDLEVBQUUsYUFBc0M7UUFDNUUsSUFBSSxZQUFZLEdBQWlCLENBQUMsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFN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O0lBQ1gsQ0FBQztJQUVELFNBQVMsZ0JBQWdCLENBQUMsR0FBbUM7UUFDM0QsK0RBQStEO1FBQy9ELE9BQU8sRUFBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsU0FBUyxPQUFPLENBQUMsSUFBYztRQUM3QixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxJQUFJLEVBQUU7WUFDdEQsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFDRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN0RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0Fic29sdXRlRnNQYXRoLCBnZXRGaWxlU3lzdGVtLCBQYXRoTWFuaXB1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb21waWxlci1jbGkvc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7ybVpc01pc3NpbmdUcmFuc2xhdGlvbkVycm9yLCDJtW1ha2VUZW1wbGF0ZU9iamVjdCwgybVQYXJzZWRUcmFuc2xhdGlvbiwgybVTb3VyY2VMb2NhdGlvbiwgybV0cmFuc2xhdGV9IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcbmltcG9ydCB7Tm9kZVBhdGh9IGZyb20gJ0BiYWJlbC90cmF2ZXJzZSc7XG5pbXBvcnQgKiBhcyB0IGZyb20gJ0BiYWJlbC90eXBlcyc7XG5cbmltcG9ydCB7RGlhZ25vc3RpY0hhbmRsaW5nU3RyYXRlZ3ksIERpYWdub3N0aWNzfSBmcm9tICcuL2RpYWdub3N0aWNzJztcblxuLyoqXG4gKiBJcyB0aGUgZ2l2ZW4gYGV4cHJlc3Npb25gIHRoZSBnbG9iYWwgYCRsb2NhbGl6ZWAgaWRlbnRpZmllcj9cbiAqXG4gKiBAcGFyYW0gZXhwcmVzc2lvbiBUaGUgZXhwcmVzc2lvbiB0byBjaGVjay5cbiAqIEBwYXJhbSBsb2NhbGl6ZU5hbWUgVGhlIGNvbmZpZ3VyZWQgbmFtZSBvZiBgJGxvY2FsaXplYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTG9jYWxpemUoXG4gICAgZXhwcmVzc2lvbjogTm9kZVBhdGgsIGxvY2FsaXplTmFtZTogc3RyaW5nKTogZXhwcmVzc2lvbiBpcyBOb2RlUGF0aDx0LklkZW50aWZpZXI+IHtcbiAgcmV0dXJuIGlzTmFtZWRJZGVudGlmaWVyKGV4cHJlc3Npb24sIGxvY2FsaXplTmFtZSkgJiYgaXNHbG9iYWxJZGVudGlmaWVyKGV4cHJlc3Npb24pO1xufVxuXG4vKipcbiAqIElzIHRoZSBnaXZlbiBgZXhwcmVzc2lvbmAgYW4gaWRlbnRpZmllciB3aXRoIHRoZSBjb3JyZWN0IGBuYW1lYD9cbiAqXG4gKiBAcGFyYW0gZXhwcmVzc2lvbiBUaGUgZXhwcmVzc2lvbiB0byBjaGVjay5cbiAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBpZGVudGlmaWVyIHdlIGFyZSBsb29raW5nIGZvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTmFtZWRJZGVudGlmaWVyKFxuICAgIGV4cHJlc3Npb246IE5vZGVQYXRoLCBuYW1lOiBzdHJpbmcpOiBleHByZXNzaW9uIGlzIE5vZGVQYXRoPHQuSWRlbnRpZmllcj4ge1xuICByZXR1cm4gZXhwcmVzc2lvbi5pc0lkZW50aWZpZXIoKSAmJiBleHByZXNzaW9uLm5vZGUubmFtZSA9PT0gbmFtZTtcbn1cblxuLyoqXG4gKiBJcyB0aGUgZ2l2ZW4gYGlkZW50aWZpZXJgIGRlY2xhcmVkIGdsb2JhbGx5LlxuICpcbiAqIEBwYXJhbSBpZGVudGlmaWVyIFRoZSBpZGVudGlmaWVyIHRvIGNoZWNrLlxuICogQHB1YmxpY0FwaSB1c2VkIGJ5IENMSVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNHbG9iYWxJZGVudGlmaWVyKGlkZW50aWZpZXI6IE5vZGVQYXRoPHQuSWRlbnRpZmllcj4pIHtcbiAgcmV0dXJuICFpZGVudGlmaWVyLnNjb3BlIHx8ICFpZGVudGlmaWVyLnNjb3BlLmhhc0JpbmRpbmcoaWRlbnRpZmllci5ub2RlLm5hbWUpO1xufVxuXG4vKipcbiAqIEJ1aWxkIGEgdHJhbnNsYXRlZCBleHByZXNzaW9uIHRvIHJlcGxhY2UgdGhlIGNhbGwgdG8gYCRsb2NhbGl6ZWAuXG4gKiBAcGFyYW0gbWVzc2FnZVBhcnRzIFRoZSBzdGF0aWMgcGFydHMgb2YgdGhlIG1lc3NhZ2UuXG4gKiBAcGFyYW0gc3Vic3RpdHV0aW9ucyBUaGUgZXhwcmVzc2lvbnMgdG8gc3Vic3RpdHV0ZSBpbnRvIHRoZSBtZXNzYWdlLlxuICogQHB1YmxpY0FwaSB1c2VkIGJ5IENMSVxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRMb2NhbGl6ZVJlcGxhY2VtZW50KFxuICAgIG1lc3NhZ2VQYXJ0czogVGVtcGxhdGVTdHJpbmdzQXJyYXksIHN1YnN0aXR1dGlvbnM6IHJlYWRvbmx5IHQuRXhwcmVzc2lvbltdKTogdC5FeHByZXNzaW9uIHtcbiAgbGV0IG1hcHBlZFN0cmluZzogdC5FeHByZXNzaW9uID0gdC5zdHJpbmdMaXRlcmFsKG1lc3NhZ2VQYXJ0c1swXSk7XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgbWVzc2FnZVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgbWFwcGVkU3RyaW5nID1cbiAgICAgICAgdC5iaW5hcnlFeHByZXNzaW9uKCcrJywgbWFwcGVkU3RyaW5nLCB3cmFwSW5QYXJlbnNJZk5lY2Vzc2FyeShzdWJzdGl0dXRpb25zW2kgLSAxXSkpO1xuICAgIG1hcHBlZFN0cmluZyA9IHQuYmluYXJ5RXhwcmVzc2lvbignKycsIG1hcHBlZFN0cmluZywgdC5zdHJpbmdMaXRlcmFsKG1lc3NhZ2VQYXJ0c1tpXSkpO1xuICB9XG4gIHJldHVybiBtYXBwZWRTdHJpbmc7XG59XG5cbi8qKlxuICogRXh0cmFjdCB0aGUgbWVzc2FnZSBwYXJ0cyBmcm9tIHRoZSBnaXZlbiBgY2FsbGAgKHRvIGAkbG9jYWxpemVgKS5cbiAqXG4gKiBUaGUgbWVzc2FnZSBwYXJ0cyB3aWxsIGVpdGhlciBieSB0aGUgZmlyc3QgYXJndW1lbnQgdG8gdGhlIGBjYWxsYCBvciBpdCB3aWxsIGJlIHdyYXBwZWQgaW4gY2FsbFxuICogdG8gYSBoZWxwZXIgZnVuY3Rpb24gbGlrZSBgX19tYWtlVGVtcGxhdGVPYmplY3RgLlxuICpcbiAqIEBwYXJhbSBjYWxsIFRoZSBBU1Qgbm9kZSBvZiB0aGUgY2FsbCB0byBwcm9jZXNzLlxuICogQHBhcmFtIGZzIFRoZSBmaWxlIHN5c3RlbSB0byB1c2Ugd2hlbiBjb21wdXRpbmcgc291cmNlLW1hcCBwYXRocy4gSWYgbm90IHByb3ZpZGVkIHRoZW4gaXQgdXNlc1xuICogICAgIHRoZSBcImN1cnJlbnRcIiBGaWxlU3lzdGVtLlxuICogQHB1YmxpY0FwaSB1c2VkIGJ5IENMSVxuICovXG5leHBvcnQgZnVuY3Rpb24gdW53cmFwTWVzc2FnZVBhcnRzRnJvbUxvY2FsaXplQ2FsbChcbiAgICBjYWxsOiBOb2RlUGF0aDx0LkNhbGxFeHByZXNzaW9uPixcbiAgICBmczogUGF0aE1hbmlwdWxhdGlvbiA9IGdldEZpbGVTeXN0ZW0oKSxcbiAgICApOiBbVGVtcGxhdGVTdHJpbmdzQXJyYXksICjJtVNvdXJjZUxvY2F0aW9uIHwgdW5kZWZpbmVkKVtdXSB7XG4gIGxldCBjb29rZWQgPSBjYWxsLmdldCgnYXJndW1lbnRzJylbMF07XG5cbiAgaWYgKGNvb2tlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihjYWxsLm5vZGUsICdgJGxvY2FsaXplYCBjYWxsZWQgd2l0aG91dCBhbnkgYXJndW1lbnRzLicpO1xuICB9XG4gIGlmICghY29va2VkLmlzRXhwcmVzc2lvbigpKSB7XG4gICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgY29va2VkLm5vZGUsICdVbmV4cGVjdGVkIGFyZ3VtZW50IHRvIGAkbG9jYWxpemVgIChleHBlY3RlZCBhbiBhcnJheSkuJyk7XG4gIH1cblxuICAvLyBJZiB0aGVyZSBpcyBubyBjYWxsIHRvIGBfX21ha2VUZW1wbGF0ZU9iamVjdCguLi4pYCwgdGhlbiBgcmF3YCBtdXN0IGJlIHRoZSBzYW1lIGFzIGBjb29rZWRgLlxuICBsZXQgcmF3ID0gY29va2VkO1xuXG4gIC8vIENoZWNrIGZvciBjYWNoZWQgY2FsbCBvZiB0aGUgZm9ybSBgeCB8fCB4ID0gX19tYWtlVGVtcGxhdGVPYmplY3QoLi4uKWBcbiAgaWYgKGNvb2tlZC5pc0xvZ2ljYWxFeHByZXNzaW9uKCkgJiYgY29va2VkLm5vZGUub3BlcmF0b3IgPT09ICd8fCcgJiZcbiAgICAgIGNvb2tlZC5nZXQoJ2xlZnQnKS5pc0lkZW50aWZpZXIoKSkge1xuICAgIGNvbnN0IHJpZ2h0ID0gY29va2VkLmdldCgncmlnaHQnKTtcbiAgICBpZiAocmlnaHQuaXNBc3NpZ25tZW50RXhwcmVzc2lvbigpKSB7XG4gICAgICBjb29rZWQgPSByaWdodC5nZXQoJ3JpZ2h0Jyk7XG4gICAgICBpZiAoIWNvb2tlZC5pc0V4cHJlc3Npb24oKSkge1xuICAgICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICAgICAgY29va2VkLm5vZGUsICdVbmV4cGVjdGVkIFwibWFrZVRlbXBsYXRlT2JqZWN0KClcIiBmdW5jdGlvbiAoZXhwZWN0ZWQgYW4gZXhwcmVzc2lvbikuJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChyaWdodC5pc1NlcXVlbmNlRXhwcmVzc2lvbigpKSB7XG4gICAgICBjb25zdCBleHByZXNzaW9ucyA9IHJpZ2h0LmdldCgnZXhwcmVzc2lvbnMnKTtcbiAgICAgIGlmIChleHByZXNzaW9ucy5sZW5ndGggPiAyKSB7XG4gICAgICAgIC8vIFRoaXMgaXMgYSBtaW5pZmllZCBzZXF1ZW5jZSBleHByZXNzaW9uLCB3aGVyZSB0aGUgZmlyc3QgdHdvIGV4cHJlc3Npb25zIGluIHRoZSBzZXF1ZW5jZVxuICAgICAgICAvLyBhcmUgYXNzaWdubWVudHMgb2YgdGhlIGNvb2tlZCBhbmQgcmF3IGFycmF5cyByZXNwZWN0aXZlbHkuXG4gICAgICAgIGNvbnN0IFtmaXJzdCwgc2Vjb25kXSA9IGV4cHJlc3Npb25zO1xuICAgICAgICBpZiAoZmlyc3QuaXNBc3NpZ25tZW50RXhwcmVzc2lvbigpICYmIHNlY29uZC5pc0Fzc2lnbm1lbnRFeHByZXNzaW9uKCkpIHtcbiAgICAgICAgICBjb29rZWQgPSBmaXJzdC5nZXQoJ3JpZ2h0Jyk7XG4gICAgICAgICAgaWYgKCFjb29rZWQuaXNFeHByZXNzaW9uKCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgICAgICAgICAgZmlyc3Qubm9kZSwgJ1VuZXhwZWN0ZWQgY29va2VkIHZhbHVlLCBleHBlY3RlZCBhbiBleHByZXNzaW9uLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByYXcgPSBzZWNvbmQuZ2V0KCdyaWdodCcpO1xuICAgICAgICAgIGlmICghcmF3LmlzRXhwcmVzc2lvbigpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKHNlY29uZC5ub2RlLCAnVW5leHBlY3RlZCByYXcgdmFsdWUsIGV4cGVjdGVkIGFuIGV4cHJlc3Npb24uJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ2hlY2sgZm9yIGBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdylgIG9yIGBfX3RlbXBsYXRlT2JqZWN0KClgIGNhbGxzLlxuICBpZiAoY29va2VkLmlzQ2FsbEV4cHJlc3Npb24oKSkge1xuICAgIGxldCBjYWxsID0gY29va2VkO1xuICAgIGlmIChjYWxsLmdldCgnYXJndW1lbnRzJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBObyBhcmd1bWVudHMgc28gcGVyaGFwcyBpdCBpcyBhIGBfX3RlbXBsYXRlT2JqZWN0KClgIGNhbGwuXG4gICAgICAvLyBVbndyYXAgdGhpcyB0byBnZXQgdGhlIGBfdGFnZ2VkVGVtcGxhdGVMaXRlcmFsKGNvb2tlZCwgcmF3KWAgY2FsbC5cbiAgICAgIGNhbGwgPSB1bndyYXBMYXp5TG9hZEhlbHBlckNhbGwoY2FsbCk7XG4gICAgfVxuXG4gICAgY29va2VkID0gY2FsbC5nZXQoJ2FyZ3VtZW50cycpWzBdO1xuICAgIGlmICghY29va2VkLmlzRXhwcmVzc2lvbigpKSB7XG4gICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICAgIGNvb2tlZC5ub2RlLFxuICAgICAgICAgICdVbmV4cGVjdGVkIGBjb29rZWRgIGFyZ3VtZW50IHRvIHRoZSBcIm1ha2VUZW1wbGF0ZU9iamVjdCgpXCIgZnVuY3Rpb24gKGV4cGVjdGVkIGFuIGV4cHJlc3Npb24pLicpO1xuICAgIH1cbiAgICBjb25zdCBhcmcyID0gY2FsbC5nZXQoJ2FyZ3VtZW50cycpWzFdO1xuICAgIGlmIChhcmcyICYmICFhcmcyLmlzRXhwcmVzc2lvbigpKSB7XG4gICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICAgIGFyZzIubm9kZSxcbiAgICAgICAgICAnVW5leHBlY3RlZCBgcmF3YCBhcmd1bWVudCB0byB0aGUgXCJtYWtlVGVtcGxhdGVPYmplY3QoKVwiIGZ1bmN0aW9uIChleHBlY3RlZCBhbiBleHByZXNzaW9uKS4nKTtcbiAgICB9XG4gICAgLy8gSWYgdGhlcmUgaXMgbm8gc2Vjb25kIGFyZ3VtZW50IHRoZW4gYXNzdW1lIHRoYXQgcmF3IGFuZCBjb29rZWQgYXJlIHRoZSBzYW1lXG4gICAgcmF3ID0gYXJnMiAhPT0gdW5kZWZpbmVkID8gYXJnMiA6IGNvb2tlZDtcbiAgfVxuXG4gIGNvbnN0IFtjb29rZWRTdHJpbmdzXSA9IHVud3JhcFN0cmluZ0xpdGVyYWxBcnJheShjb29rZWQsIGZzKTtcbiAgY29uc3QgW3Jhd1N0cmluZ3MsIHJhd0xvY2F0aW9uc10gPSB1bndyYXBTdHJpbmdMaXRlcmFsQXJyYXkocmF3LCBmcyk7XG4gIHJldHVybiBbybVtYWtlVGVtcGxhdGVPYmplY3QoY29va2VkU3RyaW5ncywgcmF3U3RyaW5ncyksIHJhd0xvY2F0aW9uc107XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIGxvY2FsaXplIGNhbGwgZXhwcmVzc2lvbiB0byBleHRyYWN0IHRoZSBhcmd1bWVudHMgdGhhdCBob2xkIHRoZSBzdWJzdGl0aW9uIGV4cHJlc3Npb25zLlxuICpcbiAqIEBwYXJhbSBjYWxsIFRoZSBBU1Qgbm9kZSBvZiB0aGUgY2FsbCB0byBwcm9jZXNzLlxuICogQHBhcmFtIGZzIFRoZSBmaWxlIHN5c3RlbSB0byB1c2Ugd2hlbiBjb21wdXRpbmcgc291cmNlLW1hcCBwYXRocy4gSWYgbm90IHByb3ZpZGVkIHRoZW4gaXQgdXNlc1xuICogICAgIHRoZSBcImN1cnJlbnRcIiBGaWxlU3lzdGVtLlxuICogQHB1YmxpY0FwaSB1c2VkIGJ5IENMSVxuICovXG5leHBvcnQgZnVuY3Rpb24gdW53cmFwU3Vic3RpdHV0aW9uc0Zyb21Mb2NhbGl6ZUNhbGwoXG4gICAgY2FsbDogTm9kZVBhdGg8dC5DYWxsRXhwcmVzc2lvbj4sXG4gICAgZnM6IFBhdGhNYW5pcHVsYXRpb24gPSBnZXRGaWxlU3lzdGVtKCkpOiBbdC5FeHByZXNzaW9uW10sICjJtVNvdXJjZUxvY2F0aW9uIHwgdW5kZWZpbmVkKVtdXSB7XG4gIGNvbnN0IGV4cHJlc3Npb25zID0gY2FsbC5nZXQoJ2FyZ3VtZW50cycpLnNwbGljZSgxKTtcbiAgaWYgKCFpc0FycmF5T2ZFeHByZXNzaW9ucyhleHByZXNzaW9ucykpIHtcbiAgICBjb25zdCBiYWRFeHByZXNzaW9uID0gZXhwcmVzc2lvbnMuZmluZChleHByZXNzaW9uID0+ICFleHByZXNzaW9uLmlzRXhwcmVzc2lvbigpKSE7XG4gICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgYmFkRXhwcmVzc2lvbi5ub2RlLFxuICAgICAgICAnSW52YWxpZCBzdWJzdGl0dXRpb25zIGZvciBgJGxvY2FsaXplYCAoZXhwZWN0ZWQgYWxsIHN1YnN0aXR1dGlvbiBhcmd1bWVudHMgdG8gYmUgZXhwcmVzc2lvbnMpLicpO1xuICB9XG4gIHJldHVybiBbXG4gICAgZXhwcmVzc2lvbnMubWFwKHBhdGggPT4gcGF0aC5ub2RlKSwgZXhwcmVzc2lvbnMubWFwKGV4cHJlc3Npb24gPT4gZ2V0TG9jYXRpb24oZnMsIGV4cHJlc3Npb24pKVxuICBdO1xufVxuXG4vKipcbiAqIFBhcnNlIHRoZSB0YWdnZWQgdGVtcGxhdGUgbGl0ZXJhbCB0byBleHRyYWN0IHRoZSBtZXNzYWdlIHBhcnRzLlxuICpcbiAqIEBwYXJhbSBlbGVtZW50cyBUaGUgZWxlbWVudHMgb2YgdGhlIHRlbXBsYXRlIGxpdGVyYWwgdG8gcHJvY2Vzcy5cbiAqIEBwYXJhbSBmcyBUaGUgZmlsZSBzeXN0ZW0gdG8gdXNlIHdoZW4gY29tcHV0aW5nIHNvdXJjZS1tYXAgcGF0aHMuIElmIG5vdCBwcm92aWRlZCB0aGVuIGl0IHVzZXNcbiAqICAgICB0aGUgXCJjdXJyZW50XCIgRmlsZVN5c3RlbS5cbiAqIEBwdWJsaWNBcGkgdXNlZCBieSBDTElcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVud3JhcE1lc3NhZ2VQYXJ0c0Zyb21UZW1wbGF0ZUxpdGVyYWwoXG4gICAgZWxlbWVudHM6IE5vZGVQYXRoPHQuVGVtcGxhdGVFbGVtZW50PltdLCBmczogUGF0aE1hbmlwdWxhdGlvbiA9IGdldEZpbGVTeXN0ZW0oKSk6XG4gICAgW1RlbXBsYXRlU3RyaW5nc0FycmF5LCAoybVTb3VyY2VMb2NhdGlvbiB8IHVuZGVmaW5lZClbXV0ge1xuICBjb25zdCBjb29rZWQgPSBlbGVtZW50cy5tYXAocSA9PiB7XG4gICAgaWYgKHEubm9kZS52YWx1ZS5jb29rZWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICBxLm5vZGUsXG4gICAgICAgICAgYFVuZXhwZWN0ZWQgdW5kZWZpbmVkIG1lc3NhZ2UgcGFydCBpbiBcIiR7ZWxlbWVudHMubWFwKHEgPT4gcS5ub2RlLnZhbHVlLmNvb2tlZCl9XCJgKTtcbiAgICB9XG4gICAgcmV0dXJuIHEubm9kZS52YWx1ZS5jb29rZWQ7XG4gIH0pO1xuICBjb25zdCByYXcgPSBlbGVtZW50cy5tYXAocSA9PiBxLm5vZGUudmFsdWUucmF3KTtcbiAgY29uc3QgbG9jYXRpb25zID0gZWxlbWVudHMubWFwKHEgPT4gZ2V0TG9jYXRpb24oZnMsIHEpKTtcbiAgcmV0dXJuIFvJtW1ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdyksIGxvY2F0aW9uc107XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIHRhZ2dlZCB0ZW1wbGF0ZSBsaXRlcmFsIHRvIGV4dHJhY3QgdGhlIGludGVycG9sYXRpb24gZXhwcmVzc2lvbnMuXG4gKlxuICogQHBhcmFtIHF1YXNpIFRoZSBBU1Qgbm9kZSBvZiB0aGUgdGVtcGxhdGUgbGl0ZXJhbCB0byBwcm9jZXNzLlxuICogQHBhcmFtIGZzIFRoZSBmaWxlIHN5c3RlbSB0byB1c2Ugd2hlbiBjb21wdXRpbmcgc291cmNlLW1hcCBwYXRocy4gSWYgbm90IHByb3ZpZGVkIHRoZW4gaXQgdXNlc1xuICogICAgIHRoZSBcImN1cnJlbnRcIiBGaWxlU3lzdGVtLlxuICogQHB1YmxpY0FwaSB1c2VkIGJ5IENMSVxuICovXG5leHBvcnQgZnVuY3Rpb24gdW53cmFwRXhwcmVzc2lvbnNGcm9tVGVtcGxhdGVMaXRlcmFsKFxuICAgIHF1YXNpOiBOb2RlUGF0aDx0LlRlbXBsYXRlTGl0ZXJhbD4sXG4gICAgZnM6IFBhdGhNYW5pcHVsYXRpb24gPSBnZXRGaWxlU3lzdGVtKCkpOiBbdC5FeHByZXNzaW9uW10sICjJtVNvdXJjZUxvY2F0aW9uIHwgdW5kZWZpbmVkKVtdXSB7XG4gIHJldHVybiBbcXVhc2kubm9kZS5leHByZXNzaW9ucywgcXVhc2kuZ2V0KCdleHByZXNzaW9ucycpLm1hcChlID0+IGdldExvY2F0aW9uKGZzLCBlKSldO1xufVxuXG4vKipcbiAqIFdyYXAgdGhlIGdpdmVuIGBleHByZXNzaW9uYCBpbiBwYXJlbnRoZXNlcyBpZiBpdCBpcyBhIGJpbmFyeSBleHByZXNzaW9uLlxuICpcbiAqIFRoaXMgZW5zdXJlcyB0aGF0IHRoaXMgZXhwcmVzc2lvbiBpcyBldmFsdWF0ZWQgY29ycmVjdGx5IGlmIGl0IGlzIGVtYmVkZGVkIGluIGFub3RoZXIgZXhwcmVzc2lvbi5cbiAqXG4gKiBAcGFyYW0gZXhwcmVzc2lvbiBUaGUgZXhwcmVzc2lvbiB0byBwb3RlbnRpYWxseSB3cmFwLlxuICovXG5leHBvcnQgZnVuY3Rpb24gd3JhcEluUGFyZW5zSWZOZWNlc3NhcnkoZXhwcmVzc2lvbjogdC5FeHByZXNzaW9uKTogdC5FeHByZXNzaW9uIHtcbiAgaWYgKHQuaXNCaW5hcnlFeHByZXNzaW9uKGV4cHJlc3Npb24pKSB7XG4gICAgcmV0dXJuIHQucGFyZW50aGVzaXplZEV4cHJlc3Npb24oZXhwcmVzc2lvbik7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGV4cHJlc3Npb247XG4gIH1cbn1cblxuLyoqXG4gKiBFeHRyYWN0IHRoZSBzdHJpbmcgdmFsdWVzIGZyb20gYW4gYGFycmF5YCBvZiBzdHJpbmcgbGl0ZXJhbHMuXG4gKlxuICogQHBhcmFtIGFycmF5IFRoZSBhcnJheSB0byB1bndyYXAuXG4gKiBAcGFyYW0gZnMgVGhlIGZpbGUgc3lzdGVtIHRvIHVzZSB3aGVuIGNvbXB1dGluZyBzb3VyY2UtbWFwIHBhdGhzLiBJZiBub3QgcHJvdmlkZWQgdGhlbiBpdCB1c2VzXG4gKiAgICAgdGhlIFwiY3VycmVudFwiIEZpbGVTeXN0ZW0uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bndyYXBTdHJpbmdMaXRlcmFsQXJyYXkoXG4gICAgYXJyYXk6IE5vZGVQYXRoPHQuRXhwcmVzc2lvbj4sXG4gICAgZnM6IFBhdGhNYW5pcHVsYXRpb24gPSBnZXRGaWxlU3lzdGVtKCkpOiBbc3RyaW5nW10sICjJtVNvdXJjZUxvY2F0aW9uIHwgdW5kZWZpbmVkKVtdXSB7XG4gIGlmICghaXNTdHJpbmdMaXRlcmFsQXJyYXkoYXJyYXkubm9kZSkpIHtcbiAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICBhcnJheS5ub2RlLCAnVW5leHBlY3RlZCBtZXNzYWdlUGFydHMgZm9yIGAkbG9jYWxpemVgIChleHBlY3RlZCBhbiBhcnJheSBvZiBzdHJpbmdzKS4nKTtcbiAgfVxuICBjb25zdCBlbGVtZW50cyA9IGFycmF5LmdldCgnZWxlbWVudHMnKSBhcyBOb2RlUGF0aDx0LlN0cmluZ0xpdGVyYWw+W107XG4gIHJldHVybiBbZWxlbWVudHMubWFwKHN0ciA9PiBzdHIubm9kZS52YWx1ZSksIGVsZW1lbnRzLm1hcChzdHIgPT4gZ2V0TG9jYXRpb24oZnMsIHN0cikpXTtcbn1cblxuLyoqXG4gKiBUaGlzIGV4cHJlc3Npb24gaXMgYmVsaWV2ZWQgdG8gYmUgYSBjYWxsIHRvIGEgXCJsYXp5LWxvYWRcIiB0ZW1wbGF0ZSBvYmplY3QgaGVscGVyIGZ1bmN0aW9uLlxuICogVGhpcyBpcyBleHBlY3RlZCB0byBiZSBvZiB0aGUgZm9ybTpcbiAqXG4gKiBgYGB0c1xuICogIGZ1bmN0aW9uIF90ZW1wbGF0ZU9iamVjdCgpIHtcbiAqICAgIHZhciBlID0gX3RhZ2dlZFRlbXBsYXRlTGl0ZXJhbChbJ2Nvb2tlZCBzdHJpbmcnLCAncmF3IHN0cmluZyddKTtcbiAqICAgIHJldHVybiBfdGVtcGxhdGVPYmplY3QgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGUgfSwgZVxuICogIH1cbiAqIGBgYFxuICpcbiAqIFdlIHVud3JhcCB0aGlzIHRvIHJldHVybiB0aGUgY2FsbCB0byBgX3RhZ2dlZFRlbXBsYXRlTGl0ZXJhbCgpYC5cbiAqXG4gKiBAcGFyYW0gY2FsbCB0aGUgY2FsbCBleHByZXNzaW9uIHRvIHVud3JhcFxuICogQHJldHVybnMgdGhlICBjYWxsIGV4cHJlc3Npb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVud3JhcExhenlMb2FkSGVscGVyQ2FsbChjYWxsOiBOb2RlUGF0aDx0LkNhbGxFeHByZXNzaW9uPik6XG4gICAgTm9kZVBhdGg8dC5DYWxsRXhwcmVzc2lvbj4ge1xuICBjb25zdCBjYWxsZWUgPSBjYWxsLmdldCgnY2FsbGVlJyk7XG4gIGlmICghY2FsbGVlLmlzSWRlbnRpZmllcigpKSB7XG4gICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgY2FsbGVlLm5vZGUsXG4gICAgICAgICdVbmV4cGVjdGVkIGxhenktbG9hZCBoZWxwZXIgY2FsbCAoZXhwZWN0ZWQgYSBjYWxsIG9mIHRoZSBmb3JtIGBfdGVtcGxhdGVPYmplY3QoKWApLicpO1xuICB9XG4gIGNvbnN0IGxhenlMb2FkQmluZGluZyA9IGNhbGwuc2NvcGUuZ2V0QmluZGluZyhjYWxsZWUubm9kZS5uYW1lKTtcbiAgaWYgKCFsYXp5TG9hZEJpbmRpbmcpIHtcbiAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKGNhbGxlZS5ub2RlLCAnTWlzc2luZyBkZWNsYXJhdGlvbiBmb3IgbGF6eS1sb2FkIGhlbHBlciBmdW5jdGlvbicpO1xuICB9XG4gIGNvbnN0IGxhenlMb2FkRm4gPSBsYXp5TG9hZEJpbmRpbmcucGF0aDtcbiAgaWYgKCFsYXp5TG9hZEZuLmlzRnVuY3Rpb25EZWNsYXJhdGlvbigpKSB7XG4gICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgbGF6eUxvYWRGbi5ub2RlLCAnVW5leHBlY3RlZCBleHByZXNzaW9uIChleHBlY3RlZCBhIGZ1bmN0aW9uIGRlY2xhcmF0aW9uJyk7XG4gIH1cbiAgY29uc3QgcmV0dXJuZWROb2RlID0gZ2V0UmV0dXJuZWRFeHByZXNzaW9uKGxhenlMb2FkRm4pO1xuXG4gIGlmIChyZXR1cm5lZE5vZGUuaXNDYWxsRXhwcmVzc2lvbigpKSB7XG4gICAgcmV0dXJuIHJldHVybmVkTm9kZTtcbiAgfVxuXG4gIGlmIChyZXR1cm5lZE5vZGUuaXNJZGVudGlmaWVyKCkpIHtcbiAgICBjb25zdCBpZGVudGlmaWVyTmFtZSA9IHJldHVybmVkTm9kZS5ub2RlLm5hbWU7XG4gICAgY29uc3QgZGVjbGFyYXRpb24gPSByZXR1cm5lZE5vZGUuc2NvcGUuZ2V0QmluZGluZyhpZGVudGlmaWVyTmFtZSk7XG4gICAgaWYgKGRlY2xhcmF0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgICAgcmV0dXJuZWROb2RlLm5vZGUsICdNaXNzaW5nIGRlY2xhcmF0aW9uIGZvciByZXR1cm4gdmFsdWUgZnJvbSBoZWxwZXIuJyk7XG4gICAgfVxuICAgIGlmICghZGVjbGFyYXRpb24ucGF0aC5pc1ZhcmlhYmxlRGVjbGFyYXRvcigpKSB7XG4gICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICAgIGRlY2xhcmF0aW9uLnBhdGgubm9kZSxcbiAgICAgICAgICAnVW5leHBlY3RlZCBoZWxwZXIgcmV0dXJuIHZhbHVlIGRlY2xhcmF0aW9uIChleHBlY3RlZCBhIHZhcmlhYmxlIGRlY2xhcmF0aW9uKS4nKTtcbiAgICB9XG4gICAgY29uc3QgaW5pdGlhbGl6ZXIgPSBkZWNsYXJhdGlvbi5wYXRoLmdldCgnaW5pdCcpO1xuICAgIGlmICghaW5pdGlhbGl6ZXIuaXNDYWxsRXhwcmVzc2lvbigpKSB7XG4gICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICAgIGRlY2xhcmF0aW9uLnBhdGgubm9kZSxcbiAgICAgICAgICAnVW5leHBlY3RlZCByZXR1cm4gdmFsdWUgZnJvbSBoZWxwZXIgKGV4cGVjdGVkIGEgY2FsbCBleHByZXNzaW9uKS4nKTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgdGhlIGxhenkgbG9hZCBoZWxwZXIgaWYgdGhpcyBpcyB0aGUgb25seSByZWZlcmVuY2UgdG8gaXQuXG4gICAgaWYgKGxhenlMb2FkQmluZGluZy5yZWZlcmVuY2VzID09PSAxKSB7XG4gICAgICBsYXp5TG9hZEZuLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBpbml0aWFsaXplcjtcbiAgfVxuICByZXR1cm4gY2FsbDtcbn1cblxuZnVuY3Rpb24gZ2V0UmV0dXJuZWRFeHByZXNzaW9uKGZuOiBOb2RlUGF0aDx0LkZ1bmN0aW9uRGVjbGFyYXRpb24+KTogTm9kZVBhdGg8dC5FeHByZXNzaW9uPiB7XG4gIGNvbnN0IGJvZHlTdGF0ZW1lbnRzID0gZm4uZ2V0KCdib2R5JykuZ2V0KCdib2R5Jyk7XG4gIGZvciAoY29uc3Qgc3RhdGVtZW50IG9mIGJvZHlTdGF0ZW1lbnRzKSB7XG4gICAgaWYgKHN0YXRlbWVudC5pc1JldHVyblN0YXRlbWVudCgpKSB7XG4gICAgICBjb25zdCBhcmd1bWVudCA9IHN0YXRlbWVudC5nZXQoJ2FyZ3VtZW50Jyk7XG4gICAgICBpZiAoYXJndW1lbnQuaXNTZXF1ZW5jZUV4cHJlc3Npb24oKSkge1xuICAgICAgICBjb25zdCBleHByZXNzaW9ucyA9IGFyZ3VtZW50LmdldCgnZXhwcmVzc2lvbnMnKTtcbiAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoZXhwcmVzc2lvbnMpID8gZXhwcmVzc2lvbnNbZXhwcmVzc2lvbnMubGVuZ3RoIC0gMV0gOiBleHByZXNzaW9ucztcbiAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnQuaXNFeHByZXNzaW9uKCkpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICAgIHN0YXRlbWVudC5ub2RlLCAnSW52YWxpZCByZXR1cm4gYXJndW1lbnQgaW4gaGVscGVyIGZ1bmN0aW9uIChleHBlY3RlZCBhbiBleHByZXNzaW9uKS4nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihmbi5ub2RlLCAnTWlzc2luZyByZXR1cm4gc3RhdGVtZW50IGluIGhlbHBlciBmdW5jdGlvbi4nKTtcbn1cblxuLyoqXG4gKiBJcyB0aGUgZ2l2ZW4gYG5vZGVgIGFuIGFycmF5IG9mIGxpdGVyYWwgc3RyaW5ncz9cbiAqXG4gKiBAcGFyYW0gbm9kZSBUaGUgbm9kZSB0byB0ZXN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTdHJpbmdMaXRlcmFsQXJyYXkobm9kZTogdC5Ob2RlKTogbm9kZSBpcyB0LkV4cHJlc3Npb24mXG4gICAge2VsZW1lbnRzOiB0LlN0cmluZ0xpdGVyYWxbXX0ge1xuICByZXR1cm4gdC5pc0FycmF5RXhwcmVzc2lvbihub2RlKSAmJiBub2RlLmVsZW1lbnRzLmV2ZXJ5KGVsZW1lbnQgPT4gdC5pc1N0cmluZ0xpdGVyYWwoZWxlbWVudCkpO1xufVxuXG4vKipcbiAqIEFyZSBhbGwgdGhlIGdpdmVuIGBub2Rlc2AgZXhwcmVzc2lvbnM/XG4gKiBAcGFyYW0gbm9kZXMgVGhlIG5vZGVzIHRvIHRlc3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5T2ZFeHByZXNzaW9ucyhwYXRoczogTm9kZVBhdGg8dC5Ob2RlPltdKTogcGF0aHMgaXMgTm9kZVBhdGg8dC5FeHByZXNzaW9uPltdIHtcbiAgcmV0dXJuIHBhdGhzLmV2ZXJ5KGVsZW1lbnQgPT4gZWxlbWVudC5pc0V4cHJlc3Npb24oKSk7XG59XG5cbi8qKiBPcHRpb25zIHRoYXQgYWZmZWN0IGhvdyB0aGUgYG1ha2VFc1hYWFRyYW5zbGF0ZVBsdWdpbigpYCBmdW5jdGlvbnMgd29yay4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVHJhbnNsYXRlUGx1Z2luT3B0aW9ucyB7XG4gIG1pc3NpbmdUcmFuc2xhdGlvbj86IERpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5O1xuICBsb2NhbGl6ZU5hbWU/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogVHJhbnNsYXRlIHRoZSB0ZXh0IG9mIHRoZSBnaXZlbiBtZXNzYWdlLCB1c2luZyB0aGUgZ2l2ZW4gdHJhbnNsYXRpb25zLlxuICpcbiAqIExvZ3MgYXMgd2FybmluZyBpZiB0aGUgdHJhbnNsYXRpb24gaXMgbm90IGF2YWlsYWJsZVxuICogQHB1YmxpY0FwaSB1c2VkIGJ5IENMSVxuICovXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNsYXRlKFxuICAgIGRpYWdub3N0aWNzOiBEaWFnbm9zdGljcywgdHJhbnNsYXRpb25zOiBSZWNvcmQ8c3RyaW5nLCDJtVBhcnNlZFRyYW5zbGF0aW9uPixcbiAgICBtZXNzYWdlUGFydHM6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCBzdWJzdGl0dXRpb25zOiByZWFkb25seSBhbnlbXSxcbiAgICBtaXNzaW5nVHJhbnNsYXRpb246IERpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5KTogW1RlbXBsYXRlU3RyaW5nc0FycmF5LCByZWFkb25seSBhbnlbXV0ge1xuICB0cnkge1xuICAgIHJldHVybiDJtXRyYW5zbGF0ZSh0cmFuc2xhdGlvbnMsIG1lc3NhZ2VQYXJ0cywgc3Vic3RpdHV0aW9ucyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoybVpc01pc3NpbmdUcmFuc2xhdGlvbkVycm9yKGUpKSB7XG4gICAgICBkaWFnbm9zdGljcy5hZGQobWlzc2luZ1RyYW5zbGF0aW9uLCBlLm1lc3NhZ2UpO1xuICAgICAgLy8gUmV0dXJuIHRoZSBwYXJzZWQgbWVzc2FnZSBiZWNhdXNlIHRoaXMgd2lsbCBoYXZlIHRoZSBtZXRhIGJsb2NrcyBzdHJpcHBlZFxuICAgICAgcmV0dXJuIFtcbiAgICAgICAgybVtYWtlVGVtcGxhdGVPYmplY3QoZS5wYXJzZWRNZXNzYWdlLm1lc3NhZ2VQYXJ0cywgZS5wYXJzZWRNZXNzYWdlLm1lc3NhZ2VQYXJ0cyksXG4gICAgICAgIHN1YnN0aXR1dGlvbnNcbiAgICAgIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpYWdub3N0aWNzLmVycm9yKGUubWVzc2FnZSk7XG4gICAgICByZXR1cm4gW21lc3NhZ2VQYXJ0cywgc3Vic3RpdHV0aW9uc107XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCYWJlbFBhcnNlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIHByaXZhdGUgcmVhZG9ubHkgdHlwZSA9ICdCYWJlbFBhcnNlRXJyb3InO1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbm9kZTogdC5Ob2RlLCBtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNCYWJlbFBhcnNlRXJyb3IoZTogYW55KTogZSBpcyBCYWJlbFBhcnNlRXJyb3Ige1xuICByZXR1cm4gZS50eXBlID09PSAnQmFiZWxQYXJzZUVycm9yJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQ29kZUZyYW1lRXJyb3IocGF0aDogTm9kZVBhdGgsIGU6IEJhYmVsUGFyc2VFcnJvcik6IHN0cmluZyB7XG4gIGNvbnN0IGZpbGVuYW1lID0gcGF0aC5odWIuZmlsZS5vcHRzLmZpbGVuYW1lIHx8ICcodW5rbm93biBmaWxlKSc7XG4gIGNvbnN0IG1lc3NhZ2UgPSBwYXRoLmh1Yi5maWxlLmJ1aWxkQ29kZUZyYW1lRXJyb3IoZS5ub2RlLCBlLm1lc3NhZ2UpLm1lc3NhZ2U7XG4gIHJldHVybiBgJHtmaWxlbmFtZX06ICR7bWVzc2FnZX1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYXRpb24oXG4gICAgZnM6IFBhdGhNYW5pcHVsYXRpb24sIHN0YXJ0UGF0aDogTm9kZVBhdGgsIGVuZFBhdGg/OiBOb2RlUGF0aCk6IMm1U291cmNlTG9jYXRpb258dW5kZWZpbmVkIHtcbiAgY29uc3Qgc3RhcnRMb2NhdGlvbiA9IHN0YXJ0UGF0aC5ub2RlLmxvYztcbiAgY29uc3QgZmlsZSA9IGdldEZpbGVGcm9tUGF0aChmcywgc3RhcnRQYXRoKTtcbiAgaWYgKCFzdGFydExvY2F0aW9uIHx8ICFmaWxlKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IGVuZExvY2F0aW9uID1cbiAgICAgIGVuZFBhdGggJiYgZ2V0RmlsZUZyb21QYXRoKGZzLCBlbmRQYXRoKSA9PT0gZmlsZSAmJiBlbmRQYXRoLm5vZGUubG9jIHx8IHN0YXJ0TG9jYXRpb247XG5cbiAgcmV0dXJuIHtcbiAgICBzdGFydDogZ2V0TGluZUFuZENvbHVtbihzdGFydExvY2F0aW9uLnN0YXJ0KSxcbiAgICBlbmQ6IGdldExpbmVBbmRDb2x1bW4oZW5kTG9jYXRpb24uZW5kKSxcbiAgICBmaWxlLFxuICAgIHRleHQ6IGdldFRleHQoc3RhcnRQYXRoKSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZUxvY2F0aW9uUG9zaXRpb24obG9jYXRpb246IMm1U291cmNlTG9jYXRpb24pOiBzdHJpbmcge1xuICBjb25zdCBlbmRMaW5lU3RyaW5nID0gbG9jYXRpb24uZW5kICE9PSB1bmRlZmluZWQgJiYgbG9jYXRpb24uZW5kLmxpbmUgIT09IGxvY2F0aW9uLnN0YXJ0LmxpbmUgP1xuICAgICAgYCwke2xvY2F0aW9uLmVuZC5saW5lICsgMX1gIDpcbiAgICAgICcnO1xuICByZXR1cm4gYCR7bG9jYXRpb24uc3RhcnQubGluZSArIDF9JHtlbmRMaW5lU3RyaW5nfWA7XG59XG5cbmZ1bmN0aW9uIGdldEZpbGVGcm9tUGF0aChmczogUGF0aE1hbmlwdWxhdGlvbiwgcGF0aDogTm9kZVBhdGh8dW5kZWZpbmVkKTogQWJzb2x1dGVGc1BhdGh8bnVsbCB7XG4gIGNvbnN0IG9wdHMgPSBwYXRoPy5odWIuZmlsZS5vcHRzO1xuICByZXR1cm4gb3B0cz8uZmlsZW5hbWUgP1xuICAgICAgZnMucmVzb2x2ZShvcHRzLmdlbmVyYXRvck9wdHMuc291cmNlUm9vdCA/PyBvcHRzLmN3ZCwgZnMucmVsYXRpdmUob3B0cy5jd2QsIG9wdHMuZmlsZW5hbWUpKSA6XG4gICAgICBudWxsO1xufVxuXG5mdW5jdGlvbiBnZXRMaW5lQW5kQ29sdW1uKGxvYzoge2xpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXJ9KToge2xpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXJ9IHtcbiAgLy8gTm90ZSB3ZSB3YW50IDAtYmFzZWQgbGluZSBudW1iZXJzIGJ1dCBCYWJlbCByZXR1cm5zIDEtYmFzZWQuXG4gIHJldHVybiB7bGluZTogbG9jLmxpbmUgLSAxLCBjb2x1bW46IGxvYy5jb2x1bW59O1xufVxuXG5mdW5jdGlvbiBnZXRUZXh0KHBhdGg6IE5vZGVQYXRoKTogc3RyaW5nfHVuZGVmaW5lZCB7XG4gIGlmIChwYXRoLm5vZGUuc3RhcnQgPT09IG51bGwgfHwgcGF0aC5ub2RlLmVuZCA9PT0gbnVsbCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIHBhdGguaHViLmZpbGUuY29kZS5zdWJzdHJpbmcocGF0aC5ub2RlLnN0YXJ0LCBwYXRoLm5vZGUuZW5kKTtcbn1cbiJdfQ==
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
        var cooked = call.arguments[0];
        if (!t.isExpression(cooked)) {
            throw new BabelParseError(call, 'Unexpected argument to `$localize`: ' + cooked);
        }
        // If there is no call to `__makeTemplateObject(...)`, then `raw` must be the same as `cooked`.
        var raw = cooked;
        // Check for cached call of the form `x || x = __makeTemplateObject(...)`
        if (t.isLogicalExpression(cooked) && cooked.operator === '||' && t.isIdentifier(cooked.left) &&
            t.isExpression(cooked.right)) {
            if (t.isAssignmentExpression(cooked.right)) {
                cooked = cooked.right.right;
            }
        }
        // Check for `__makeTemplateObject(cooked, raw)` call
        if (t.isCallExpression(cooked)) {
            raw = cooked.arguments[1];
            if (!t.isExpression(raw)) {
                throw new BabelParseError(raw, 'Unexpected `raw` argument to the "makeTemplateObject()" function (expected an expression).');
            }
            cooked = cooked.arguments[0];
            if (!t.isExpression(cooked)) {
                throw new BabelParseError(cooked, 'Unexpected `cooked` argument to the "makeTemplateObject()" function (expected an expression).');
            }
        }
        var cookedStrings = unwrapStringLiteralArray(cooked);
        var rawStrings = unwrapStringLiteralArray(raw);
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
            }
            else {
                diagnostics.error(e.message);
            }
            return [messageParts, substitutions];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX2ZpbGVfdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS9zb3VyY2VfZmlsZXMvc291cmNlX2ZpbGVfdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOENBQWtIO0lBRWxILGdDQUFrQztJQUdsQzs7O09BR0c7SUFDSCxTQUFnQixpQkFBaUIsQ0FDN0IsVUFBa0MsRUFBRSxJQUFZO1FBQ2xELE9BQU8sVUFBVSxDQUFDLFlBQVksRUFBRSxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQztJQUNwRSxDQUFDO0lBSEQsOENBR0M7SUFFRDs7O01BR0U7SUFDRixTQUFnQixrQkFBa0IsQ0FBQyxVQUFrQztRQUNuRSxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakYsQ0FBQztJQUZELGdEQUVDO0lBRUQ7Ozs7TUFJRTtJQUNGLFNBQWdCLHdCQUF3QixDQUNwQyxZQUFrQyxFQUFFLGFBQXNDO1FBQzVFLElBQUksWUFBWSxHQUFpQixDQUFDLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzVDLFlBQVk7Z0JBQ1IsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxZQUFZLEVBQUUsdUJBQXVCLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFD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LFNBQUc7WUFBdEQsVUFBSSxHQUFKLElBQUksQ0FBWTtZQURsQixVQUFJLEdBQUcsaUJBQWlCLENBQUM7O1FBQzhCLENBQUM7UUFDM0Usc0JBQUM7SUFBRCxDQUFDLEFBSEQsQ0FBcUMsS0FBSyxHQUd6QztJQUhZLDBDQUFlO0lBSzVCLFNBQWdCLGlCQUFpQixDQUFDLENBQU07UUFDdEMsT0FBTyxDQUFDLENBQUMsSUFBSSxLQUFLLGlCQUFpQixDQUFDO0lBQ3RDLENBQUM7SUFGRCw4Q0FFQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7ybVQYXJzZWRUcmFuc2xhdGlvbiwgybVpc01pc3NpbmdUcmFuc2xhdGlvbkVycm9yLCDJtW1ha2VUZW1wbGF0ZU9iamVjdCwgybV0cmFuc2xhdGV9IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcbmltcG9ydCB7Tm9kZVBhdGh9IGZyb20gJ0BiYWJlbC90cmF2ZXJzZSc7XG5pbXBvcnQgKiBhcyB0IGZyb20gJ0BiYWJlbC90eXBlcyc7XG5pbXBvcnQge0RpYWdub3N0aWNzfSBmcm9tICcuLi8uLi9kaWFnbm9zdGljcyc7XG5cbi8qKlxuICogSXMgdGhlIGdpdmVuIGBleHByZXNzaW9uYCBhbiBpZGVudGlmaWVyIHdpdGggdGhlIGNvcnJlY3QgbmFtZVxuICogQHBhcmFtIGV4cHJlc3Npb24gVGhlIGV4cHJlc3Npb24gdG8gY2hlY2suXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05hbWVkSWRlbnRpZmllcihcbiAgICBleHByZXNzaW9uOiBOb2RlUGF0aDx0LkV4cHJlc3Npb24+LCBuYW1lOiBzdHJpbmcpOiBleHByZXNzaW9uIGlzIE5vZGVQYXRoPHQuSWRlbnRpZmllcj4ge1xuICByZXR1cm4gZXhwcmVzc2lvbi5pc0lkZW50aWZpZXIoKSAmJiBleHByZXNzaW9uLm5vZGUubmFtZSA9PT0gbmFtZTtcbn1cblxuLyoqXG4qIElzIHRoZSBnaXZlbiBgaWRlbnRpZmllcmAgZGVjbGFyZWQgZ2xvYmFsbHkuXG4qIEBwYXJhbSBpZGVudGlmaWVyIFRoZSBpZGVudGlmaWVyIHRvIGNoZWNrLlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0dsb2JhbElkZW50aWZpZXIoaWRlbnRpZmllcjogTm9kZVBhdGg8dC5JZGVudGlmaWVyPikge1xuICByZXR1cm4gIWlkZW50aWZpZXIuc2NvcGUgfHwgIWlkZW50aWZpZXIuc2NvcGUuaGFzQmluZGluZyhpZGVudGlmaWVyLm5vZGUubmFtZSk7XG59XG5cbi8qKlxuKiBCdWlsZCBhIHRyYW5zbGF0ZWQgZXhwcmVzc2lvbiB0byByZXBsYWNlIHRoZSBjYWxsIHRvIGAkbG9jYWxpemVgLlxuKiBAcGFyYW0gbWVzc2FnZVBhcnRzIFRoZSBzdGF0aWMgcGFydHMgb2YgdGhlIG1lc3NhZ2UuXG4qIEBwYXJhbSBzdWJzdGl0dXRpb25zIFRoZSBleHByZXNzaW9ucyB0byBzdWJzdGl0dXRlIGludG8gdGhlIG1lc3NhZ2UuXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTG9jYWxpemVSZXBsYWNlbWVudChcbiAgICBtZXNzYWdlUGFydHM6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCBzdWJzdGl0dXRpb25zOiByZWFkb25seSB0LkV4cHJlc3Npb25bXSk6IHQuRXhwcmVzc2lvbiB7XG4gIGxldCBtYXBwZWRTdHJpbmc6IHQuRXhwcmVzc2lvbiA9IHQuc3RyaW5nTGl0ZXJhbChtZXNzYWdlUGFydHNbMF0pO1xuICBmb3IgKGxldCBpID0gMTsgaSA8IG1lc3NhZ2VQYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIG1hcHBlZFN0cmluZyA9XG4gICAgICAgIHQuYmluYXJ5RXhwcmVzc2lvbignKycsIG1hcHBlZFN0cmluZywgd3JhcEluUGFyZW5zSWZOZWNlc3Nhcnkoc3Vic3RpdHV0aW9uc1tpIC0gMV0pKTtcbiAgICBtYXBwZWRTdHJpbmcgPSB0LmJpbmFyeUV4cHJlc3Npb24oJysnLCBtYXBwZWRTdHJpbmcsIHQuc3RyaW5nTGl0ZXJhbChtZXNzYWdlUGFydHNbaV0pKTtcbiAgfVxuICByZXR1cm4gbWFwcGVkU3RyaW5nO1xufVxuXG4vKipcbiogRXh0cmFjdCB0aGUgbWVzc2FnZSBwYXJ0cyBmcm9tIHRoZSBnaXZlbiBgY2FsbGAgKHRvIGAkbG9jYWxpemVgKS5cbipcbiogVGhlIG1lc3NhZ2UgcGFydHMgd2lsbCBlaXRoZXIgYnkgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIHRoZSBgY2FsbGAgb3IgaXQgd2lsbCBiZSB3cmFwcGVkIGluIGNhbGxcbiogdG8gYSBoZWxwZXIgZnVuY3Rpb24gbGlrZSBgX19tYWtlVGVtcGxhdGVPYmplY3RgLlxuKlxuKiBAcGFyYW0gY2FsbCBUaGUgQVNUIG5vZGUgb2YgdGhlIGNhbGwgdG8gcHJvY2Vzcy5cbiovXG5leHBvcnQgZnVuY3Rpb24gdW53cmFwTWVzc2FnZVBhcnRzRnJvbUxvY2FsaXplQ2FsbChjYWxsOiB0LkNhbGxFeHByZXNzaW9uKTogVGVtcGxhdGVTdHJpbmdzQXJyYXkge1xuICBsZXQgY29va2VkID0gY2FsbC5hcmd1bWVudHNbMF07XG4gIGlmICghdC5pc0V4cHJlc3Npb24oY29va2VkKSkge1xuICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoY2FsbCwgJ1VuZXhwZWN0ZWQgYXJndW1lbnQgdG8gYCRsb2NhbGl6ZWA6ICcgKyBjb29rZWQpO1xuICB9XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gY2FsbCB0byBgX19tYWtlVGVtcGxhdGVPYmplY3QoLi4uKWAsIHRoZW4gYHJhd2AgbXVzdCBiZSB0aGUgc2FtZSBhcyBgY29va2VkYC5cbiAgbGV0IHJhdyA9IGNvb2tlZDtcblxuICAvLyBDaGVjayBmb3IgY2FjaGVkIGNhbGwgb2YgdGhlIGZvcm0gYHggfHwgeCA9IF9fbWFrZVRlbXBsYXRlT2JqZWN0KC4uLilgXG4gIGlmICh0LmlzTG9naWNhbEV4cHJlc3Npb24oY29va2VkKSAmJiBjb29rZWQub3BlcmF0b3IgPT09ICd8fCcgJiYgdC5pc0lkZW50aWZpZXIoY29va2VkLmxlZnQpICYmXG4gICAgICB0LmlzRXhwcmVzc2lvbihjb29rZWQucmlnaHQpKSB7XG4gICAgaWYgKHQuaXNBc3NpZ25tZW50RXhwcmVzc2lvbihjb29rZWQucmlnaHQpKSB7XG4gICAgICBjb29rZWQgPSBjb29rZWQucmlnaHQucmlnaHQ7XG4gICAgfVxuICB9XG5cbiAgLy8gQ2hlY2sgZm9yIGBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdylgIGNhbGxcbiAgaWYgKHQuaXNDYWxsRXhwcmVzc2lvbihjb29rZWQpKSB7XG4gICAgcmF3ID0gY29va2VkLmFyZ3VtZW50c1sxXSBhcyB0LkV4cHJlc3Npb247XG4gICAgaWYgKCF0LmlzRXhwcmVzc2lvbihyYXcpKSB7XG4gICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICAgIHJhdyxcbiAgICAgICAgICAnVW5leHBlY3RlZCBgcmF3YCBhcmd1bWVudCB0byB0aGUgXCJtYWtlVGVtcGxhdGVPYmplY3QoKVwiIGZ1bmN0aW9uIChleHBlY3RlZCBhbiBleHByZXNzaW9uKS4nKTtcbiAgICB9XG4gICAgY29va2VkID0gY29va2VkLmFyZ3VtZW50c1swXTtcbiAgICBpZiAoIXQuaXNFeHByZXNzaW9uKGNvb2tlZCkpIHtcbiAgICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgICAgY29va2VkLFxuICAgICAgICAgICdVbmV4cGVjdGVkIGBjb29rZWRgIGFyZ3VtZW50IHRvIHRoZSBcIm1ha2VUZW1wbGF0ZU9iamVjdCgpXCIgZnVuY3Rpb24gKGV4cGVjdGVkIGFuIGV4cHJlc3Npb24pLicpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGNvb2tlZFN0cmluZ3MgPSB1bndyYXBTdHJpbmdMaXRlcmFsQXJyYXkoY29va2VkKTtcbiAgY29uc3QgcmF3U3RyaW5ncyA9IHVud3JhcFN0cmluZ0xpdGVyYWxBcnJheShyYXcpO1xuICByZXR1cm4gybVtYWtlVGVtcGxhdGVPYmplY3QoY29va2VkU3RyaW5ncywgcmF3U3RyaW5ncyk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHVud3JhcFN1YnN0aXR1dGlvbnNGcm9tTG9jYWxpemVDYWxsKGNhbGw6IHQuQ2FsbEV4cHJlc3Npb24pOiB0LkV4cHJlc3Npb25bXSB7XG4gIGNvbnN0IGV4cHJlc3Npb25zID0gY2FsbC5hcmd1bWVudHMuc3BsaWNlKDEpO1xuICBpZiAoIWlzQXJyYXlPZkV4cHJlc3Npb25zKGV4cHJlc3Npb25zKSkge1xuICAgIGNvbnN0IGJhZEV4cHJlc3Npb24gPSBleHByZXNzaW9ucy5maW5kKGV4cHJlc3Npb24gPT4gIXQuaXNFeHByZXNzaW9uKGV4cHJlc3Npb24pKSAhO1xuICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgIGJhZEV4cHJlc3Npb24sXG4gICAgICAgICdJbnZhbGlkIHN1YnN0aXR1dGlvbnMgZm9yIGAkbG9jYWxpemVgIChleHBlY3RlZCBhbGwgc3Vic3RpdHV0aW9uIGFyZ3VtZW50cyB0byBiZSBleHByZXNzaW9ucykuJyk7XG4gIH1cbiAgcmV0dXJuIGV4cHJlc3Npb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW53cmFwTWVzc2FnZVBhcnRzRnJvbVRlbXBsYXRlTGl0ZXJhbChlbGVtZW50czogdC5UZW1wbGF0ZUVsZW1lbnRbXSk6XG4gICAgVGVtcGxhdGVTdHJpbmdzQXJyYXkge1xuICBjb25zdCBjb29rZWQgPSBlbGVtZW50cy5tYXAocSA9PiB7XG4gICAgaWYgKHEudmFsdWUuY29va2VkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgICAgcSwgYFVuZXhwZWN0ZWQgdW5kZWZpbmVkIG1lc3NhZ2UgcGFydCBpbiBcIiR7ZWxlbWVudHMubWFwKHEgPT4gcS52YWx1ZS5jb29rZWQpfVwiYCk7XG4gICAgfVxuICAgIHJldHVybiBxLnZhbHVlLmNvb2tlZDtcbiAgfSk7XG4gIGNvbnN0IHJhdyA9IGVsZW1lbnRzLm1hcChxID0+IHEudmFsdWUucmF3KTtcbiAgcmV0dXJuIMm1bWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KTtcbn1cblxuLyoqXG4qIFdyYXAgdGhlIGdpdmVuIGBleHByZXNzaW9uYCBpbiBwYXJlbnRoZXNlcyBpZiBpdCBpcyBhIGJpbmFyeSBleHByZXNzaW9uLlxuKlxuKiBUaGlzIGVuc3VyZXMgdGhhdCB0aGlzIGV4cHJlc3Npb24gaXMgZXZhbHVhdGVkIGNvcnJlY3RseSBpZiBpdCBpcyBlbWJlZGRlZCBpbiBhbm90aGVyIGV4cHJlc3Npb24uXG4qXG4qIEBwYXJhbSBleHByZXNzaW9uIFRoZSBleHByZXNzaW9uIHRvIHBvdGVudGlhbGx5IHdyYXAuXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIHdyYXBJblBhcmVuc0lmTmVjZXNzYXJ5KGV4cHJlc3Npb246IHQuRXhwcmVzc2lvbik6IHQuRXhwcmVzc2lvbiB7XG4gIGlmICh0LmlzQmluYXJ5RXhwcmVzc2lvbihleHByZXNzaW9uKSkge1xuICAgIHJldHVybiB0LnBhcmVudGhlc2l6ZWRFeHByZXNzaW9uKGV4cHJlc3Npb24pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBleHByZXNzaW9uO1xuICB9XG59XG5cbi8qKlxuKiBFeHRyYWN0IHRoZSBzdHJpbmcgdmFsdWVzIGZyb20gYW4gYGFycmF5YCBvZiBzdHJpbmcgbGl0ZXJhbHMuXG4qIEBwYXJhbSBhcnJheSBUaGUgYXJyYXkgdG8gdW53cmFwLlxuKi9cbmV4cG9ydCBmdW5jdGlvbiB1bndyYXBTdHJpbmdMaXRlcmFsQXJyYXkoYXJyYXk6IHQuRXhwcmVzc2lvbik6IHN0cmluZ1tdIHtcbiAgaWYgKCFpc1N0cmluZ0xpdGVyYWxBcnJheShhcnJheSkpIHtcbiAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICBhcnJheSwgJ1VuZXhwZWN0ZWQgbWVzc2FnZVBhcnRzIGZvciBgJGxvY2FsaXplYCAoZXhwZWN0ZWQgYW4gYXJyYXkgb2Ygc3RyaW5ncykuJyk7XG4gIH1cbiAgcmV0dXJuIGFycmF5LmVsZW1lbnRzLm1hcCgoc3RyOiB0LlN0cmluZ0xpdGVyYWwpID0+IHN0ci52YWx1ZSk7XG59XG5cbi8qKlxuKiBJcyB0aGUgZ2l2ZW4gYG5vZGVgIGFuIGFycmF5IG9mIGxpdGVyYWwgc3RyaW5ncz9cbipcbiogQHBhcmFtIG5vZGUgVGhlIG5vZGUgdG8gdGVzdC5cbiovXG5leHBvcnQgZnVuY3Rpb24gaXNTdHJpbmdMaXRlcmFsQXJyYXkobm9kZTogdC5Ob2RlKTogbm9kZSBpcyB0LkV4cHJlc3Npb24mXG4gICAge2VsZW1lbnRzOiB0LlN0cmluZ0xpdGVyYWxbXX0ge1xuICByZXR1cm4gdC5pc0FycmF5RXhwcmVzc2lvbihub2RlKSAmJiBub2RlLmVsZW1lbnRzLmV2ZXJ5KGVsZW1lbnQgPT4gdC5pc1N0cmluZ0xpdGVyYWwoZWxlbWVudCkpO1xufVxuXG4vKipcbiogQXJlIGFsbCB0aGUgZ2l2ZW4gYG5vZGVzYCBleHByZXNzaW9ucz9cbiogQHBhcmFtIG5vZGVzIFRoZSBub2RlcyB0byB0ZXN0LlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5T2ZFeHByZXNzaW9ucyhub2RlczogdC5Ob2RlW10pOiBub2RlcyBpcyB0LkV4cHJlc3Npb25bXSB7XG4gIHJldHVybiBub2Rlcy5ldmVyeShlbGVtZW50ID0+IHQuaXNFeHByZXNzaW9uKGVsZW1lbnQpKTtcbn1cblxuLyoqIE9wdGlvbnMgdGhhdCBhZmZlY3QgaG93IHRoZSBgbWFrZUVzWFhYVHJhbnNsYXRlUGx1Z2luKClgIGZ1bmN0aW9ucyB3b3JrLiAqL1xuZXhwb3J0IGludGVyZmFjZSBUcmFuc2xhdGVQbHVnaW5PcHRpb25zIHtcbiAgbWlzc2luZ1RyYW5zbGF0aW9uPzogTWlzc2luZ1RyYW5zbGF0aW9uU3RyYXRlZ3k7XG4gIGxvY2FsaXplTmFtZT86IHN0cmluZztcbn1cblxuLyoqXG4gKiBIb3cgdG8gaGFuZGxlIG1pc3NpbmcgdHJhbnNsYXRpb25zLlxuICovXG5leHBvcnQgdHlwZSBNaXNzaW5nVHJhbnNsYXRpb25TdHJhdGVneSA9ICdlcnJvcicgfCAnd2FybmluZycgfCAnaWdub3JlJztcblxuLyoqXG4gKiBUcmFuc2xhdGUgdGhlIHRleHQgb2YgdGhlIGdpdmVuIG1lc3NhZ2UsIHVzaW5nIHRoZSBnaXZlbiB0cmFuc2xhdGlvbnMuXG4gKlxuICogTG9ncyBhcyB3YXJuaW5nIGlmIHRoZSB0cmFuc2xhdGlvbiBpcyBub3QgYXZhaWxhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2xhdGUoXG4gICAgZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzLCB0cmFuc2xhdGlvbnM6IFJlY29yZDxzdHJpbmcsIMm1UGFyc2VkVHJhbnNsYXRpb24+LFxuICAgIG1lc3NhZ2VQYXJ0czogVGVtcGxhdGVTdHJpbmdzQXJyYXksIHN1YnN0aXR1dGlvbnM6IHJlYWRvbmx5IGFueVtdLFxuICAgIG1pc3NpbmdUcmFuc2xhdGlvbjogTWlzc2luZ1RyYW5zbGF0aW9uU3RyYXRlZ3kpOiBbVGVtcGxhdGVTdHJpbmdzQXJyYXksIHJlYWRvbmx5IGFueVtdXSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIMm1dHJhbnNsYXRlKHRyYW5zbGF0aW9ucywgbWVzc2FnZVBhcnRzLCBzdWJzdGl0dXRpb25zKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmICjJtWlzTWlzc2luZ1RyYW5zbGF0aW9uRXJyb3IoZSkpIHtcbiAgICAgIGlmIChtaXNzaW5nVHJhbnNsYXRpb24gPT09ICdlcnJvcicpIHtcbiAgICAgICAgZGlhZ25vc3RpY3MuZXJyb3IoZS5tZXNzYWdlKTtcbiAgICAgIH0gZWxzZSBpZiAobWlzc2luZ1RyYW5zbGF0aW9uID09PSAnd2FybmluZycpIHtcbiAgICAgICAgZGlhZ25vc3RpY3Mud2FybihlLm1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkaWFnbm9zdGljcy5lcnJvcihlLm1lc3NhZ2UpO1xuICAgIH1cbiAgICByZXR1cm4gW21lc3NhZ2VQYXJ0cywgc3Vic3RpdHV0aW9uc107XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEJhYmVsUGFyc2VFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgcHJpdmF0ZSByZWFkb25seSB0eXBlID0gJ0JhYmVsUGFyc2VFcnJvcic7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBub2RlOiB0LkJhc2VOb2RlLCBtZXNzYWdlOiBzdHJpbmcpIHsgc3VwZXIobWVzc2FnZSk7IH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQmFiZWxQYXJzZUVycm9yKGU6IGFueSk6IGUgaXMgQmFiZWxQYXJzZUVycm9yIHtcbiAgcmV0dXJuIGUudHlwZSA9PT0gJ0JhYmVsUGFyc2VFcnJvcic7XG59XG4iXX0=
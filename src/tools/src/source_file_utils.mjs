/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { getFileSystem } from '@angular/compiler-cli/src/ngtsc/file_system';
import { ɵisMissingTranslationError, ɵmakeTemplateObject, ɵtranslate } from '@angular/localize';
import * as t from '@babel/types';
/**
 * Is the given `expression` the global `$localize` identifier?
 *
 * @param expression The expression to check.
 * @param localizeName The configured name of `$localize`.
 */
export function isLocalize(expression, localizeName) {
    return isNamedIdentifier(expression, localizeName) && isGlobalIdentifier(expression);
}
/**
 * Is the given `expression` an identifier with the correct `name`?
 *
 * @param expression The expression to check.
 * @param name The name of the identifier we are looking for.
 */
export function isNamedIdentifier(expression, name) {
    return expression.isIdentifier() && expression.node.name === name;
}
/**
 * Is the given `identifier` declared globally.
 *
 * @param identifier The identifier to check.
 * @publicApi used by CLI
 */
export function isGlobalIdentifier(identifier) {
    return !identifier.scope || !identifier.scope.hasBinding(identifier.node.name);
}
/**
 * Build a translated expression to replace the call to `$localize`.
 * @param messageParts The static parts of the message.
 * @param substitutions The expressions to substitute into the message.
 * @publicApi used by CLI
 */
export function buildLocalizeReplacement(messageParts, substitutions) {
    let mappedString = t.stringLiteral(messageParts[0]);
    for (let i = 1; i < messageParts.length; i++) {
        mappedString =
            t.binaryExpression('+', mappedString, wrapInParensIfNecessary(substitutions[i - 1]));
        mappedString = t.binaryExpression('+', mappedString, t.stringLiteral(messageParts[i]));
    }
    return mappedString;
}
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
export function unwrapMessagePartsFromLocalizeCall(call, fs = getFileSystem()) {
    let cooked = call.get('arguments')[0];
    if (cooked === undefined) {
        throw new BabelParseError(call.node, '`$localize` called without any arguments.');
    }
    if (!cooked.isExpression()) {
        throw new BabelParseError(cooked.node, 'Unexpected argument to `$localize` (expected an array).');
    }
    // If there is no call to `__makeTemplateObject(...)`, then `raw` must be the same as `cooked`.
    let raw = cooked;
    // Check for a memoized form: `x || x = ...`
    if (cooked.isLogicalExpression() && cooked.node.operator === '||' &&
        cooked.get('left').isIdentifier()) {
        const right = cooked.get('right');
        if (right.isAssignmentExpression()) {
            cooked = right.get('right');
            if (!cooked.isExpression()) {
                throw new BabelParseError(cooked.node, 'Unexpected "makeTemplateObject()" function (expected an expression).');
            }
        }
        else if (right.isSequenceExpression()) {
            const expressions = right.get('expressions');
            if (expressions.length > 2) {
                // This is a minified sequence expression, where the first two expressions in the sequence
                // are assignments of the cooked and raw arrays respectively.
                const [first, second] = expressions;
                if (first.isAssignmentExpression()) {
                    cooked = first.get('right');
                    if (!cooked.isExpression()) {
                        throw new BabelParseError(first.node, 'Unexpected cooked value, expected an expression.');
                    }
                    if (second.isAssignmentExpression()) {
                        raw = second.get('right');
                        if (!raw.isExpression()) {
                            throw new BabelParseError(second.node, 'Unexpected raw value, expected an expression.');
                        }
                    }
                    else {
                        // If the second expression is not an assignment then it is probably code to take a copy
                        // of the cooked array. For example: `raw || (raw=cooked.slice(0))`.
                        raw = cooked;
                    }
                }
            }
        }
    }
    // Check for `__makeTemplateObject(cooked, raw)` or `__templateObject()` calls.
    if (cooked.isCallExpression()) {
        let call = cooked;
        if (call.get('arguments').length === 0) {
            // No arguments so perhaps it is a `__templateObject()` call.
            // Unwrap this to get the `_taggedTemplateLiteral(cooked, raw)` call.
            call = unwrapLazyLoadHelperCall(call);
        }
        cooked = call.get('arguments')[0];
        if (!cooked.isExpression()) {
            throw new BabelParseError(cooked.node, 'Unexpected `cooked` argument to the "makeTemplateObject()" function (expected an expression).');
        }
        const arg2 = call.get('arguments')[1];
        if (arg2 && !arg2.isExpression()) {
            throw new BabelParseError(arg2.node, 'Unexpected `raw` argument to the "makeTemplateObject()" function (expected an expression).');
        }
        // If there is no second argument then assume that raw and cooked are the same
        raw = arg2 !== undefined ? arg2 : cooked;
    }
    const [cookedStrings] = unwrapStringLiteralArray(cooked, fs);
    const [rawStrings, rawLocations] = unwrapStringLiteralArray(raw, fs);
    return [ɵmakeTemplateObject(cookedStrings, rawStrings), rawLocations];
}
/**
 * Parse the localize call expression to extract the arguments that hold the substition expressions.
 *
 * @param call The AST node of the call to process.
 * @param fs The file system to use when computing source-map paths. If not provided then it uses
 *     the "current" FileSystem.
 * @publicApi used by CLI
 */
export function unwrapSubstitutionsFromLocalizeCall(call, fs = getFileSystem()) {
    const expressions = call.get('arguments').splice(1);
    if (!isArrayOfExpressions(expressions)) {
        const badExpression = expressions.find(expression => !expression.isExpression());
        throw new BabelParseError(badExpression.node, 'Invalid substitutions for `$localize` (expected all substitution arguments to be expressions).');
    }
    return [
        expressions.map(path => path.node), expressions.map(expression => getLocation(fs, expression))
    ];
}
/**
 * Parse the tagged template literal to extract the message parts.
 *
 * @param elements The elements of the template literal to process.
 * @param fs The file system to use when computing source-map paths. If not provided then it uses
 *     the "current" FileSystem.
 * @publicApi used by CLI
 */
export function unwrapMessagePartsFromTemplateLiteral(elements, fs = getFileSystem()) {
    const cooked = elements.map(q => {
        if (q.node.value.cooked === undefined) {
            throw new BabelParseError(q.node, `Unexpected undefined message part in "${elements.map(q => q.node.value.cooked)}"`);
        }
        return q.node.value.cooked;
    });
    const raw = elements.map(q => q.node.value.raw);
    const locations = elements.map(q => getLocation(fs, q));
    return [ɵmakeTemplateObject(cooked, raw), locations];
}
/**
 * Parse the tagged template literal to extract the interpolation expressions.
 *
 * @param quasi The AST node of the template literal to process.
 * @param fs The file system to use when computing source-map paths. If not provided then it uses
 *     the "current" FileSystem.
 * @publicApi used by CLI
 */
export function unwrapExpressionsFromTemplateLiteral(quasi, fs = getFileSystem()) {
    return [quasi.node.expressions, quasi.get('expressions').map(e => getLocation(fs, e))];
}
/**
 * Wrap the given `expression` in parentheses if it is a binary expression.
 *
 * This ensures that this expression is evaluated correctly if it is embedded in another expression.
 *
 * @param expression The expression to potentially wrap.
 */
export function wrapInParensIfNecessary(expression) {
    if (t.isBinaryExpression(expression)) {
        return t.parenthesizedExpression(expression);
    }
    else {
        return expression;
    }
}
/**
 * Extract the string values from an `array` of string literals.
 *
 * @param array The array to unwrap.
 * @param fs The file system to use when computing source-map paths. If not provided then it uses
 *     the "current" FileSystem.
 */
export function unwrapStringLiteralArray(array, fs = getFileSystem()) {
    if (!isStringLiteralArray(array.node)) {
        throw new BabelParseError(array.node, 'Unexpected messageParts for `$localize` (expected an array of strings).');
    }
    const elements = array.get('elements');
    return [elements.map(str => str.node.value), elements.map(str => getLocation(fs, str))];
}
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
export function unwrapLazyLoadHelperCall(call) {
    const callee = call.get('callee');
    if (!callee.isIdentifier()) {
        throw new BabelParseError(callee.node, 'Unexpected lazy-load helper call (expected a call of the form `_templateObject()`).');
    }
    const lazyLoadBinding = call.scope.getBinding(callee.node.name);
    if (!lazyLoadBinding) {
        throw new BabelParseError(callee.node, 'Missing declaration for lazy-load helper function');
    }
    const lazyLoadFn = lazyLoadBinding.path;
    if (!lazyLoadFn.isFunctionDeclaration()) {
        throw new BabelParseError(lazyLoadFn.node, 'Unexpected expression (expected a function declaration');
    }
    const returnedNode = getReturnedExpression(lazyLoadFn);
    if (returnedNode.isCallExpression()) {
        return returnedNode;
    }
    if (returnedNode.isIdentifier()) {
        const identifierName = returnedNode.node.name;
        const declaration = returnedNode.scope.getBinding(identifierName);
        if (declaration === undefined) {
            throw new BabelParseError(returnedNode.node, 'Missing declaration for return value from helper.');
        }
        if (!declaration.path.isVariableDeclarator()) {
            throw new BabelParseError(declaration.path.node, 'Unexpected helper return value declaration (expected a variable declaration).');
        }
        const initializer = declaration.path.get('init');
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
function getReturnedExpression(fn) {
    const bodyStatements = fn.get('body').get('body');
    for (const statement of bodyStatements) {
        if (statement.isReturnStatement()) {
            const argument = statement.get('argument');
            if (argument.isSequenceExpression()) {
                const expressions = argument.get('expressions');
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
    throw new BabelParseError(fn.node, 'Missing return statement in helper function.');
}
/**
 * Is the given `node` an array of literal strings?
 *
 * @param node The node to test.
 */
export function isStringLiteralArray(node) {
    return t.isArrayExpression(node) && node.elements.every(element => t.isStringLiteral(element));
}
/**
 * Are all the given `nodes` expressions?
 * @param nodes The nodes to test.
 */
export function isArrayOfExpressions(paths) {
    return paths.every(element => element.isExpression());
}
/**
 * Translate the text of the given message, using the given translations.
 *
 * Logs as warning if the translation is not available
 * @publicApi used by CLI
 */
export function translate(diagnostics, translations, messageParts, substitutions, missingTranslation) {
    try {
        return ɵtranslate(translations, messageParts, substitutions);
    }
    catch (e) {
        if (ɵisMissingTranslationError(e)) {
            diagnostics.add(missingTranslation, e.message);
            // Return the parsed message because this will have the meta blocks stripped
            return [
                ɵmakeTemplateObject(e.parsedMessage.messageParts, e.parsedMessage.messageParts),
                substitutions
            ];
        }
        else {
            diagnostics.error(e.message);
            return [messageParts, substitutions];
        }
    }
}
export class BabelParseError extends Error {
    constructor(node, message) {
        super(message);
        this.node = node;
        this.type = 'BabelParseError';
    }
}
export function isBabelParseError(e) {
    return e.type === 'BabelParseError';
}
export function buildCodeFrameError(fs, path, e) {
    let filename = path.hub.file.opts.filename;
    if (filename) {
        filename = fs.resolve(filename);
        let cwd = path.hub.file.opts.cwd;
        if (cwd) {
            cwd = fs.resolve(cwd);
            filename = fs.relative(cwd, filename);
        }
    }
    else {
        filename = '(unknown file)';
    }
    const message = path.hub.file.buildCodeFrameError(e.node, e.message).message;
    return `${filename}: ${message}`;
}
export function getLocation(fs, startPath, endPath) {
    const startLocation = startPath.node.loc;
    const file = getFileFromPath(fs, startPath);
    if (!startLocation || !file) {
        return undefined;
    }
    const endLocation = endPath && getFileFromPath(fs, endPath) === file && endPath.node.loc || startLocation;
    return {
        start: getLineAndColumn(startLocation.start),
        end: getLineAndColumn(endLocation.end),
        file,
        text: getText(startPath),
    };
}
export function serializeLocationPosition(location) {
    const endLineString = location.end !== undefined && location.end.line !== location.start.line ?
        `,${location.end.line + 1}` :
        '';
    return `${location.start.line + 1}${endLineString}`;
}
function getFileFromPath(fs, path) {
    var _a;
    const opts = path === null || path === void 0 ? void 0 : path.hub.file.opts;
    const filename = opts === null || opts === void 0 ? void 0 : opts.filename;
    if (!filename) {
        return null;
    }
    const relativePath = fs.relative(opts.cwd, filename);
    const root = (_a = opts.generatorOpts.sourceRoot) !== null && _a !== void 0 ? _a : opts.cwd;
    const absPath = fs.resolve(root, relativePath);
    return absPath;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX2ZpbGVfdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3NvdXJjZV9maWxlX3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBK0IsYUFBYSxFQUFtQixNQUFNLDZDQUE2QyxDQUFDO0FBQzFILE9BQU8sRUFBQywwQkFBMEIsRUFBRSxtQkFBbUIsRUFBdUMsVUFBVSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFbkksT0FBTyxLQUFLLENBQUMsTUFBTSxjQUFjLENBQUM7QUFJbEM7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsVUFBVSxDQUN0QixVQUFvQixFQUFFLFlBQW9CO0lBQzVDLE9BQU8saUJBQWlCLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxJQUFJLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZGLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxpQkFBaUIsQ0FDN0IsVUFBb0IsRUFBRSxJQUFZO0lBQ3BDLE9BQU8sVUFBVSxDQUFDLFlBQVksRUFBRSxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQztBQUNwRSxDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsa0JBQWtCLENBQUMsVUFBa0M7SUFDbkUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pGLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSx3QkFBd0IsQ0FDcEMsWUFBa0MsRUFBRSxhQUFzQztJQUM1RSxJQUFJLFlBQVksR0FBaUIsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMs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QUFDO0lBQ3ZELE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQy9DLE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUM7QUFFRCxTQUFTLGdCQUFnQixDQUFDLEdBQW1DO0lBQzNELCtEQUErRDtJQUMvRCxPQUFPLEVBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFDLENBQUM7QUFDbEQsQ0FBQztBQUVELFNBQVMsT0FBTyxDQUFDLElBQWM7SUFDN0IsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssSUFBSSxFQUFFO1FBQ3RELE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0lBQ0QsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHthYnNvbHV0ZUZyb20sIEFic29sdXRlRnNQYXRoLCBnZXRGaWxlU3lzdGVtLCBQYXRoTWFuaXB1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb21waWxlci1jbGkvc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7ybVpc01pc3NpbmdUcmFuc2xhdGlvbkVycm9yLCDJtW1ha2VUZW1wbGF0ZU9iamVjdCwgybVQYXJzZWRUcmFuc2xhdGlvbiwgybVTb3VyY2VMb2NhdGlvbiwgybV0cmFuc2xhdGV9IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcbmltcG9ydCB7Tm9kZVBhdGh9IGZyb20gJ0BiYWJlbC90cmF2ZXJzZSc7XG5pbXBvcnQgKiBhcyB0IGZyb20gJ0BiYWJlbC90eXBlcyc7XG5cbmltcG9ydCB7RGlhZ25vc3RpY0hhbmRsaW5nU3RyYXRlZ3ksIERpYWdub3N0aWNzfSBmcm9tICcuL2RpYWdub3N0aWNzJztcblxuLyoqXG4gKiBJcyB0aGUgZ2l2ZW4gYGV4cHJlc3Npb25gIHRoZSBnbG9iYWwgYCRsb2NhbGl6ZWAgaWRlbnRpZmllcj9cbiAqXG4gKiBAcGFyYW0gZXhwcmVzc2lvbiBUaGUgZXhwcmVzc2lvbiB0byBjaGVjay5cbiAqIEBwYXJhbSBsb2NhbGl6ZU5hbWUgVGhlIGNvbmZpZ3VyZWQgbmFtZSBvZiBgJGxvY2FsaXplYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTG9jYWxpemUoXG4gICAgZXhwcmVzc2lvbjogTm9kZVBhdGgsIGxvY2FsaXplTmFtZTogc3RyaW5nKTogZXhwcmVzc2lvbiBpcyBOb2RlUGF0aDx0LklkZW50aWZpZXI+IHtcbiAgcmV0dXJuIGlzTmFtZWRJZGVudGlmaWVyKGV4cHJlc3Npb24sIGxvY2FsaXplTmFtZSkgJiYgaXNHbG9iYWxJZGVudGlmaWVyKGV4cHJlc3Npb24pO1xufVxuXG4vKipcbiAqIElzIHRoZSBnaXZlbiBgZXhwcmVzc2lvbmAgYW4gaWRlbnRpZmllciB3aXRoIHRoZSBjb3JyZWN0IGBuYW1lYD9cbiAqXG4gKiBAcGFyYW0gZXhwcmVzc2lvbiBUaGUgZXhwcmVzc2lvbiB0byBjaGVjay5cbiAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBpZGVudGlmaWVyIHdlIGFyZSBsb29raW5nIGZvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTmFtZWRJZGVudGlmaWVyKFxuICAgIGV4cHJlc3Npb246IE5vZGVQYXRoLCBuYW1lOiBzdHJpbmcpOiBleHByZXNzaW9uIGlzIE5vZGVQYXRoPHQuSWRlbnRpZmllcj4ge1xuICByZXR1cm4gZXhwcmVzc2lvbi5pc0lkZW50aWZpZXIoKSAmJiBleHByZXNzaW9uLm5vZGUubmFtZSA9PT0gbmFtZTtcbn1cblxuLyoqXG4gKiBJcyB0aGUgZ2l2ZW4gYGlkZW50aWZpZXJgIGRlY2xhcmVkIGdsb2JhbGx5LlxuICpcbiAqIEBwYXJhbSBpZGVudGlmaWVyIFRoZSBpZGVudGlmaWVyIHRvIGNoZWNrLlxuICogQHB1YmxpY0FwaSB1c2VkIGJ5IENMSVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNHbG9iYWxJZGVudGlmaWVyKGlkZW50aWZpZXI6IE5vZGVQYXRoPHQuSWRlbnRpZmllcj4pIHtcbiAgcmV0dXJuICFpZGVudGlmaWVyLnNjb3BlIHx8ICFpZGVudGlmaWVyLnNjb3BlLmhhc0JpbmRpbmcoaWRlbnRpZmllci5ub2RlLm5hbWUpO1xufVxuXG4vKipcbiAqIEJ1aWxkIGEgdHJhbnNsYXRlZCBleHByZXNzaW9uIHRvIHJlcGxhY2UgdGhlIGNhbGwgdG8gYCRsb2NhbGl6ZWAuXG4gKiBAcGFyYW0gbWVzc2FnZVBhcnRzIFRoZSBzdGF0aWMgcGFydHMgb2YgdGhlIG1lc3NhZ2UuXG4gKiBAcGFyYW0gc3Vic3RpdHV0aW9ucyBUaGUgZXhwcmVzc2lvbnMgdG8gc3Vic3RpdHV0ZSBpbnRvIHRoZSBtZXNzYWdlLlxuICogQHB1YmxpY0FwaSB1c2VkIGJ5IENMSVxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRMb2NhbGl6ZVJlcGxhY2VtZW50KFxuICAgIG1lc3NhZ2VQYXJ0czogVGVtcGxhdGVTdHJpbmdzQXJyYXksIHN1YnN0aXR1dGlvbnM6IHJlYWRvbmx5IHQuRXhwcmVzc2lvbltdKTogdC5FeHByZXNzaW9uIHtcbiAgbGV0IG1hcHBlZFN0cmluZzogdC5FeHByZXNzaW9uID0gdC5zdHJpbmdMaXRlcmFsKG1lc3NhZ2VQYXJ0c1swXSk7XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgbWVzc2FnZVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgbWFwcGVkU3RyaW5nID1cbiAgICAgICAgdC5iaW5hcnlFeHByZXNzaW9uKCcrJywgbWFwcGVkU3RyaW5nLCB3cmFwSW5QYXJlbnNJZk5lY2Vzc2FyeShzdWJzdGl0dXRpb25zW2kgLSAxXSkpO1xuICAgIG1hcHBlZFN0cmluZyA9IHQuYmluYXJ5RXhwcmVzc2lvbignKycsIG1hcHBlZFN0cmluZywgdC5zdHJpbmdMaXRlcmFsKG1lc3NhZ2VQYXJ0c1tpXSkpO1xuICB9XG4gIHJldHVybiBtYXBwZWRTdHJpbmc7XG59XG5cbi8qKlxuICogRXh0cmFjdCB0aGUgbWVzc2FnZSBwYXJ0cyBmcm9tIHRoZSBnaXZlbiBgY2FsbGAgKHRvIGAkbG9jYWxpemVgKS5cbiAqXG4gKiBUaGUgbWVzc2FnZSBwYXJ0cyB3aWxsIGVpdGhlciBieSB0aGUgZmlyc3QgYXJndW1lbnQgdG8gdGhlIGBjYWxsYCBvciBpdCB3aWxsIGJlIHdyYXBwZWQgaW4gY2FsbFxuICogdG8gYSBoZWxwZXIgZnVuY3Rpb24gbGlrZSBgX19tYWtlVGVtcGxhdGVPYmplY3RgLlxuICpcbiAqIEBwYXJhbSBjYWxsIFRoZSBBU1Qgbm9kZSBvZiB0aGUgY2FsbCB0byBwcm9jZXNzLlxuICogQHBhcmFtIGZzIFRoZSBmaWxlIHN5c3RlbSB0byB1c2Ugd2hlbiBjb21wdXRpbmcgc291cmNlLW1hcCBwYXRocy4gSWYgbm90IHByb3ZpZGVkIHRoZW4gaXQgdXNlc1xuICogICAgIHRoZSBcImN1cnJlbnRcIiBGaWxlU3lzdGVtLlxuICogQHB1YmxpY0FwaSB1c2VkIGJ5IENMSVxuICovXG5leHBvcnQgZnVuY3Rpb24gdW53cmFwTWVzc2FnZVBhcnRzRnJvbUxvY2FsaXplQ2FsbChcbiAgICBjYWxsOiBOb2RlUGF0aDx0LkNhbGxFeHByZXNzaW9uPixcbiAgICBmczogUGF0aE1hbmlwdWxhdGlvbiA9IGdldEZpbGVTeXN0ZW0oKSxcbiAgICApOiBbVGVtcGxhdGVTdHJpbmdzQXJyYXksICjJtVNvdXJjZUxvY2F0aW9uIHwgdW5kZWZpbmVkKVtdXSB7XG4gIGxldCBjb29rZWQgPSBjYWxsLmdldCgnYXJndW1lbnRzJylbMF07XG5cbiAgaWYgKGNvb2tlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihjYWxsLm5vZGUsICdgJGxvY2FsaXplYCBjYWxsZWQgd2l0aG91dCBhbnkgYXJndW1lbnRzLicpO1xuICB9XG4gIGlmICghY29va2VkLmlzRXhwcmVzc2lvbigpKSB7XG4gICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgY29va2VkLm5vZGUsICdVbmV4cGVjdGVkIGFyZ3VtZW50IHRvIGAkbG9jYWxpemVgIChleHBlY3RlZCBhbiBhcnJheSkuJyk7XG4gIH1cblxuICAvLyBJZiB0aGVyZSBpcyBubyBjYWxsIHRvIGBfX21ha2VUZW1wbGF0ZU9iamVjdCguLi4pYCwgdGhlbiBgcmF3YCBtdXN0IGJlIHRoZSBzYW1lIGFzIGBjb29rZWRgLlxuICBsZXQgcmF3ID0gY29va2VkO1xuXG4gIC8vIENoZWNrIGZvciBhIG1lbW9pemVkIGZvcm06IGB4IHx8IHggPSAuLi5gXG4gIGlmIChjb29rZWQuaXNMb2dpY2FsRXhwcmVzc2lvbigpICYmIGNvb2tlZC5ub2RlLm9wZXJhdG9yID09PSAnfHwnICYmXG4gICAgICBjb29rZWQuZ2V0KCdsZWZ0JykuaXNJZGVudGlmaWVyKCkpIHtcbiAgICBjb25zdCByaWdodCA9IGNvb2tlZC5nZXQoJ3JpZ2h0Jyk7XG4gICAgaWYgKHJpZ2h0LmlzQXNzaWdubWVudEV4cHJlc3Npb24oKSkge1xuICAgICAgY29va2VkID0gcmlnaHQuZ2V0KCdyaWdodCcpO1xuICAgICAgaWYgKCFjb29rZWQuaXNFeHByZXNzaW9uKCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICAgIGNvb2tlZC5ub2RlLCAnVW5leHBlY3RlZCBcIm1ha2VUZW1wbGF0ZU9iamVjdCgpXCIgZnVuY3Rpb24gKGV4cGVjdGVkIGFuIGV4cHJlc3Npb24pLicpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmlnaHQuaXNTZXF1ZW5jZUV4cHJlc3Npb24oKSkge1xuICAgICAgY29uc3QgZXhwcmVzc2lvbnMgPSByaWdodC5nZXQoJ2V4cHJlc3Npb25zJyk7XG4gICAgICBpZiAoZXhwcmVzc2lvbnMubGVuZ3RoID4gMikge1xuICAgICAgICAvLyBUaGlzIGlzIGEgbWluaWZpZWQgc2VxdWVuY2UgZXhwcmVzc2lvbiwgd2hlcmUgdGhlIGZpcnN0IHR3byBleHByZXNzaW9ucyBpbiB0aGUgc2VxdWVuY2VcbiAgICAgICAgLy8gYXJlIGFzc2lnbm1lbnRzIG9mIHRoZSBjb29rZWQgYW5kIHJhdyBhcnJheXMgcmVzcGVjdGl2ZWx5LlxuICAgICAgICBjb25zdCBbZmlyc3QsIHNlY29uZF0gPSBleHByZXNzaW9ucztcbiAgICAgICAgaWYgKGZpcnN0LmlzQXNzaWdubWVudEV4cHJlc3Npb24oKSkge1xuICAgICAgICAgIGNvb2tlZCA9IGZpcnN0LmdldCgncmlnaHQnKTtcbiAgICAgICAgICBpZiAoIWNvb2tlZC5pc0V4cHJlc3Npb24oKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICAgICAgICBmaXJzdC5ub2RlLCAnVW5leHBlY3RlZCBjb29rZWQgdmFsdWUsIGV4cGVjdGVkIGFuIGV4cHJlc3Npb24uJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzZWNvbmQuaXNBc3NpZ25tZW50RXhwcmVzc2lvbigpKSB7XG4gICAgICAgICAgICByYXcgPSBzZWNvbmQuZ2V0KCdyaWdodCcpO1xuICAgICAgICAgICAgaWYgKCFyYXcuaXNFeHByZXNzaW9uKCkpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICAgICAgICAgIHNlY29uZC5ub2RlLCAnVW5leHBlY3RlZCByYXcgdmFsdWUsIGV4cGVjdGVkIGFuIGV4cHJlc3Npb24uJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSBzZWNvbmQgZXhwcmVzc2lvbiBpcyBub3QgYW4gYXNzaWdubWVudCB0aGVuIGl0IGlzIHByb2JhYmx5IGNvZGUgdG8gdGFrZSBhIGNvcHlcbiAgICAgICAgICAgIC8vIG9mIHRoZSBjb29rZWQgYXJyYXkuIEZvciBleGFtcGxlOiBgcmF3IHx8IChyYXc9Y29va2VkLnNsaWNlKDApKWAuXG4gICAgICAgICAgICByYXcgPSBjb29rZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ2hlY2sgZm9yIGBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdylgIG9yIGBfX3RlbXBsYXRlT2JqZWN0KClgIGNhbGxzLlxuICBpZiAoY29va2VkLmlzQ2FsbEV4cHJlc3Npb24oKSkge1xuICAgIGxldCBjYWxsID0gY29va2VkO1xuICAgIGlmIChjYWxsLmdldCgnYXJndW1lbnRzJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBObyBhcmd1bWVudHMgc28gcGVyaGFwcyBpdCBpcyBhIGBfX3RlbXBsYXRlT2JqZWN0KClgIGNhbGwuXG4gICAgICAvLyBVbndyYXAgdGhpcyB0byBnZXQgdGhlIGBfdGFnZ2VkVGVtcGxhdGVMaXRlcmFsKGNvb2tlZCwgcmF3KWAgY2FsbC5cbiAgICAgIGNhbGwgPSB1bndyYXBMYXp5TG9hZEhlbHBlckNhbGwoY2FsbCk7XG4gICAgfVxuXG4gICAgY29va2VkID0gY2FsbC5nZXQoJ2FyZ3VtZW50cycpWzBdO1xuICAgIGlmICghY29va2VkLmlzRXhwcmVzc2lvbigpKSB7XG4gICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICAgIGNvb2tlZC5ub2RlLFxuICAgICAgICAgICdVbmV4cGVjdGVkIGBjb29rZWRgIGFyZ3VtZW50IHRvIHRoZSBcIm1ha2VUZW1wbGF0ZU9iamVjdCgpXCIgZnVuY3Rpb24gKGV4cGVjdGVkIGFuIGV4cHJlc3Npb24pLicpO1xuICAgIH1cbiAgICBjb25zdCBhcmcyID0gY2FsbC5nZXQoJ2FyZ3VtZW50cycpWzFdO1xuICAgIGlmIChhcmcyICYmICFhcmcyLmlzRXhwcmVzc2lvbigpKSB7XG4gICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICAgIGFyZzIubm9kZSxcbiAgICAgICAgICAnVW5leHBlY3RlZCBgcmF3YCBhcmd1bWVudCB0byB0aGUgXCJtYWtlVGVtcGxhdGVPYmplY3QoKVwiIGZ1bmN0aW9uIChleHBlY3RlZCBhbiBleHByZXNzaW9uKS4nKTtcbiAgICB9XG4gICAgLy8gSWYgdGhlcmUgaXMgbm8gc2Vjb25kIGFyZ3VtZW50IHRoZW4gYXNzdW1lIHRoYXQgcmF3IGFuZCBjb29rZWQgYXJlIHRoZSBzYW1lXG4gICAgcmF3ID0gYXJnMiAhPT0gdW5kZWZpbmVkID8gYXJnMiA6IGNvb2tlZDtcbiAgfVxuXG4gIGNvbnN0IFtjb29rZWRTdHJpbmdzXSA9IHVud3JhcFN0cmluZ0xpdGVyYWxBcnJheShjb29rZWQsIGZzKTtcbiAgY29uc3QgW3Jhd1N0cmluZ3MsIHJhd0xvY2F0aW9uc10gPSB1bndyYXBTdHJpbmdMaXRlcmFsQXJyYXkocmF3LCBmcyk7XG4gIHJldHVybiBbybVtYWtlVGVtcGxhdGVPYmplY3QoY29va2VkU3RyaW5ncywgcmF3U3RyaW5ncyksIHJhd0xvY2F0aW9uc107XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIGxvY2FsaXplIGNhbGwgZXhwcmVzc2lvbiB0byBleHRyYWN0IHRoZSBhcmd1bWVudHMgdGhhdCBob2xkIHRoZSBzdWJzdGl0aW9uIGV4cHJlc3Npb25zLlxuICpcbiAqIEBwYXJhbSBjYWxsIFRoZSBBU1Qgbm9kZSBvZiB0aGUgY2FsbCB0byBwcm9jZXNzLlxuICogQHBhcmFtIGZzIFRoZSBmaWxlIHN5c3RlbSB0byB1c2Ugd2hlbiBjb21wdXRpbmcgc291cmNlLW1hcCBwYXRocy4gSWYgbm90IHByb3ZpZGVkIHRoZW4gaXQgdXNlc1xuICogICAgIHRoZSBcImN1cnJlbnRcIiBGaWxlU3lzdGVtLlxuICogQHB1YmxpY0FwaSB1c2VkIGJ5IENMSVxuICovXG5leHBvcnQgZnVuY3Rpb24gdW53cmFwU3Vic3RpdHV0aW9uc0Zyb21Mb2NhbGl6ZUNhbGwoXG4gICAgY2FsbDogTm9kZVBhdGg8dC5DYWxsRXhwcmVzc2lvbj4sXG4gICAgZnM6IFBhdGhNYW5pcHVsYXRpb24gPSBnZXRGaWxlU3lzdGVtKCkpOiBbdC5FeHByZXNzaW9uW10sICjJtVNvdXJjZUxvY2F0aW9uIHwgdW5kZWZpbmVkKVtdXSB7XG4gIGNvbnN0IGV4cHJlc3Npb25zID0gY2FsbC5nZXQoJ2FyZ3VtZW50cycpLnNwbGljZSgxKTtcbiAgaWYgKCFpc0FycmF5T2ZFeHByZXNzaW9ucyhleHByZXNzaW9ucykpIHtcbiAgICBjb25zdCBiYWRFeHByZXNzaW9uID0gZXhwcmVzc2lvbnMuZmluZChleHByZXNzaW9uID0+ICFleHByZXNzaW9uLmlzRXhwcmVzc2lvbigpKSE7XG4gICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgYmFkRXhwcmVzc2lvbi5ub2RlLFxuICAgICAgICAnSW52YWxpZCBzdWJzdGl0dXRpb25zIGZvciBgJGxvY2FsaXplYCAoZXhwZWN0ZWQgYWxsIHN1YnN0aXR1dGlvbiBhcmd1bWVudHMgdG8gYmUgZXhwcmVzc2lvbnMpLicpO1xuICB9XG4gIHJldHVybiBbXG4gICAgZXhwcmVzc2lvbnMubWFwKHBhdGggPT4gcGF0aC5ub2RlKSwgZXhwcmVzc2lvbnMubWFwKGV4cHJlc3Npb24gPT4gZ2V0TG9jYXRpb24oZnMsIGV4cHJlc3Npb24pKVxuICBdO1xufVxuXG4vKipcbiAqIFBhcnNlIHRoZSB0YWdnZWQgdGVtcGxhdGUgbGl0ZXJhbCB0byBleHRyYWN0IHRoZSBtZXNzYWdlIHBhcnRzLlxuICpcbiAqIEBwYXJhbSBlbGVtZW50cyBUaGUgZWxlbWVudHMgb2YgdGhlIHRlbXBsYXRlIGxpdGVyYWwgdG8gcHJvY2Vzcy5cbiAqIEBwYXJhbSBmcyBUaGUgZmlsZSBzeXN0ZW0gdG8gdXNlIHdoZW4gY29tcHV0aW5nIHNvdXJjZS1tYXAgcGF0aHMuIElmIG5vdCBwcm92aWRlZCB0aGVuIGl0IHVzZXNcbiAqICAgICB0aGUgXCJjdXJyZW50XCIgRmlsZVN5c3RlbS5cbiAqIEBwdWJsaWNBcGkgdXNlZCBieSBDTElcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVud3JhcE1lc3NhZ2VQYXJ0c0Zyb21UZW1wbGF0ZUxpdGVyYWwoXG4gICAgZWxlbWVudHM6IE5vZGVQYXRoPHQuVGVtcGxhdGVFbGVtZW50PltdLCBmczogUGF0aE1hbmlwdWxhdGlvbiA9IGdldEZpbGVTeXN0ZW0oKSk6XG4gICAgW1RlbXBsYXRlU3RyaW5nc0FycmF5LCAoybVTb3VyY2VMb2NhdGlvbiB8IHVuZGVmaW5lZClbXV0ge1xuICBjb25zdCBjb29rZWQgPSBlbGVtZW50cy5tYXAocSA9PiB7XG4gICAgaWYgKHEubm9kZS52YWx1ZS5jb29rZWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICBxLm5vZGUsXG4gICAgICAgICAgYFVuZXhwZWN0ZWQgdW5kZWZpbmVkIG1lc3NhZ2UgcGFydCBpbiBcIiR7ZWxlbWVudHMubWFwKHEgPT4gcS5ub2RlLnZhbHVlLmNvb2tlZCl9XCJgKTtcbiAgICB9XG4gICAgcmV0dXJuIHEubm9kZS52YWx1ZS5jb29rZWQ7XG4gIH0pO1xuICBjb25zdCByYXcgPSBlbGVtZW50cy5tYXAocSA9PiBxLm5vZGUudmFsdWUucmF3KTtcbiAgY29uc3QgbG9jYXRpb25zID0gZWxlbWVudHMubWFwKHEgPT4gZ2V0TG9jYXRpb24oZnMsIHEpKTtcbiAgcmV0dXJuIFvJtW1ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdyksIGxvY2F0aW9uc107XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIHRhZ2dlZCB0ZW1wbGF0ZSBsaXRlcmFsIHRvIGV4dHJhY3QgdGhlIGludGVycG9sYXRpb24gZXhwcmVzc2lvbnMuXG4gKlxuICogQHBhcmFtIHF1YXNpIFRoZSBBU1Qgbm9kZSBvZiB0aGUgdGVtcGxhdGUgbGl0ZXJhbCB0byBwcm9jZXNzLlxuICogQHBhcmFtIGZzIFRoZSBmaWxlIHN5c3RlbSB0byB1c2Ugd2hlbiBjb21wdXRpbmcgc291cmNlLW1hcCBwYXRocy4gSWYgbm90IHByb3ZpZGVkIHRoZW4gaXQgdXNlc1xuICogICAgIHRoZSBcImN1cnJlbnRcIiBGaWxlU3lzdGVtLlxuICogQHB1YmxpY0FwaSB1c2VkIGJ5IENMSVxuICovXG5leHBvcnQgZnVuY3Rpb24gdW53cmFwRXhwcmVzc2lvbnNGcm9tVGVtcGxhdGVMaXRlcmFsKFxuICAgIHF1YXNpOiBOb2RlUGF0aDx0LlRlbXBsYXRlTGl0ZXJhbD4sXG4gICAgZnM6IFBhdGhNYW5pcHVsYXRpb24gPSBnZXRGaWxlU3lzdGVtKCkpOiBbdC5FeHByZXNzaW9uW10sICjJtVNvdXJjZUxvY2F0aW9uIHwgdW5kZWZpbmVkKVtdXSB7XG4gIHJldHVybiBbcXVhc2kubm9kZS5leHByZXNzaW9ucywgcXVhc2kuZ2V0KCdleHByZXNzaW9ucycpLm1hcChlID0+IGdldExvY2F0aW9uKGZzLCBlKSldO1xufVxuXG4vKipcbiAqIFdyYXAgdGhlIGdpdmVuIGBleHByZXNzaW9uYCBpbiBwYXJlbnRoZXNlcyBpZiBpdCBpcyBhIGJpbmFyeSBleHByZXNzaW9uLlxuICpcbiAqIFRoaXMgZW5zdXJlcyB0aGF0IHRoaXMgZXhwcmVzc2lvbiBpcyBldmFsdWF0ZWQgY29ycmVjdGx5IGlmIGl0IGlzIGVtYmVkZGVkIGluIGFub3RoZXIgZXhwcmVzc2lvbi5cbiAqXG4gKiBAcGFyYW0gZXhwcmVzc2lvbiBUaGUgZXhwcmVzc2lvbiB0byBwb3RlbnRpYWxseSB3cmFwLlxuICovXG5leHBvcnQgZnVuY3Rpb24gd3JhcEluUGFyZW5zSWZOZWNlc3NhcnkoZXhwcmVzc2lvbjogdC5FeHByZXNzaW9uKTogdC5FeHByZXNzaW9uIHtcbiAgaWYgKHQuaXNCaW5hcnlFeHByZXNzaW9uKGV4cHJlc3Npb24pKSB7XG4gICAgcmV0dXJuIHQucGFyZW50aGVzaXplZEV4cHJlc3Npb24oZXhwcmVzc2lvbik7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGV4cHJlc3Npb247XG4gIH1cbn1cblxuLyoqXG4gKiBFeHRyYWN0IHRoZSBzdHJpbmcgdmFsdWVzIGZyb20gYW4gYGFycmF5YCBvZiBzdHJpbmcgbGl0ZXJhbHMuXG4gKlxuICogQHBhcmFtIGFycmF5IFRoZSBhcnJheSB0byB1bndyYXAuXG4gKiBAcGFyYW0gZnMgVGhlIGZpbGUgc3lzdGVtIHRvIHVzZSB3aGVuIGNvbXB1dGluZyBzb3VyY2UtbWFwIHBhdGhzLiBJZiBub3QgcHJvdmlkZWQgdGhlbiBpdCB1c2VzXG4gKiAgICAgdGhlIFwiY3VycmVudFwiIEZpbGVTeXN0ZW0uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bndyYXBTdHJpbmdMaXRlcmFsQXJyYXkoXG4gICAgYXJyYXk6IE5vZGVQYXRoPHQuRXhwcmVzc2lvbj4sXG4gICAgZnM6IFBhdGhNYW5pcHVsYXRpb24gPSBnZXRGaWxlU3lzdGVtKCkpOiBbc3RyaW5nW10sICjJtVNvdXJjZUxvY2F0aW9uIHwgdW5kZWZpbmVkKVtdXSB7XG4gIGlmICghaXNTdHJpbmdMaXRlcmFsQXJyYXkoYXJyYXkubm9kZSkpIHtcbiAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICBhcnJheS5ub2RlLCAnVW5leHBlY3RlZCBtZXNzYWdlUGFydHMgZm9yIGAkbG9jYWxpemVgIChleHBlY3RlZCBhbiBhcnJheSBvZiBzdHJpbmdzKS4nKTtcbiAgfVxuICBjb25zdCBlbGVtZW50cyA9IGFycmF5LmdldCgnZWxlbWVudHMnKSBhcyBOb2RlUGF0aDx0LlN0cmluZ0xpdGVyYWw+W107XG4gIHJldHVybiBbZWxlbWVudHMubWFwKHN0ciA9PiBzdHIubm9kZS52YWx1ZSksIGVsZW1lbnRzLm1hcChzdHIgPT4gZ2V0TG9jYXRpb24oZnMsIHN0cikpXTtcbn1cblxuLyoqXG4gKiBUaGlzIGV4cHJlc3Npb24gaXMgYmVsaWV2ZWQgdG8gYmUgYSBjYWxsIHRvIGEgXCJsYXp5LWxvYWRcIiB0ZW1wbGF0ZSBvYmplY3QgaGVscGVyIGZ1bmN0aW9uLlxuICogVGhpcyBpcyBleHBlY3RlZCB0byBiZSBvZiB0aGUgZm9ybTpcbiAqXG4gKiBgYGB0c1xuICogIGZ1bmN0aW9uIF90ZW1wbGF0ZU9iamVjdCgpIHtcbiAqICAgIHZhciBlID0gX3RhZ2dlZFRlbXBsYXRlTGl0ZXJhbChbJ2Nvb2tlZCBzdHJpbmcnLCAncmF3IHN0cmluZyddKTtcbiAqICAgIHJldHVybiBfdGVtcGxhdGVPYmplY3QgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGUgfSwgZVxuICogIH1cbiAqIGBgYFxuICpcbiAqIFdlIHVud3JhcCB0aGlzIHRvIHJldHVybiB0aGUgY2FsbCB0byBgX3RhZ2dlZFRlbXBsYXRlTGl0ZXJhbCgpYC5cbiAqXG4gKiBAcGFyYW0gY2FsbCB0aGUgY2FsbCBleHByZXNzaW9uIHRvIHVud3JhcFxuICogQHJldHVybnMgdGhlICBjYWxsIGV4cHJlc3Npb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVud3JhcExhenlMb2FkSGVscGVyQ2FsbChjYWxsOiBOb2RlUGF0aDx0LkNhbGxFeHByZXNzaW9uPik6XG4gICAgTm9kZVBhdGg8dC5DYWxsRXhwcmVzc2lvbj4ge1xuICBjb25zdCBjYWxsZWUgPSBjYWxsLmdldCgnY2FsbGVlJyk7XG4gIGlmICghY2FsbGVlLmlzSWRlbnRpZmllcigpKSB7XG4gICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgY2FsbGVlLm5vZGUsXG4gICAgICAgICdVbmV4cGVjdGVkIGxhenktbG9hZCBoZWxwZXIgY2FsbCAoZXhwZWN0ZWQgYSBjYWxsIG9mIHRoZSBmb3JtIGBfdGVtcGxhdGVPYmplY3QoKWApLicpO1xuICB9XG4gIGNvbnN0IGxhenlMb2FkQmluZGluZyA9IGNhbGwuc2NvcGUuZ2V0QmluZGluZyhjYWxsZWUubm9kZS5uYW1lKTtcbiAgaWYgKCFsYXp5TG9hZEJpbmRpbmcpIHtcbiAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKGNhbGxlZS5ub2RlLCAnTWlzc2luZyBkZWNsYXJhdGlvbiBmb3IgbGF6eS1sb2FkIGhlbHBlciBmdW5jdGlvbicpO1xuICB9XG4gIGNvbnN0IGxhenlMb2FkRm4gPSBsYXp5TG9hZEJpbmRpbmcucGF0aDtcbiAgaWYgKCFsYXp5TG9hZEZuLmlzRnVuY3Rpb25EZWNsYXJhdGlvbigpKSB7XG4gICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgbGF6eUxvYWRGbi5ub2RlLCAnVW5leHBlY3RlZCBleHByZXNzaW9uIChleHBlY3RlZCBhIGZ1bmN0aW9uIGRlY2xhcmF0aW9uJyk7XG4gIH1cbiAgY29uc3QgcmV0dXJuZWROb2RlID0gZ2V0UmV0dXJuZWRFeHByZXNzaW9uKGxhenlMb2FkRm4pO1xuXG4gIGlmIChyZXR1cm5lZE5vZGUuaXNDYWxsRXhwcmVzc2lvbigpKSB7XG4gICAgcmV0dXJuIHJldHVybmVkTm9kZTtcbiAgfVxuXG4gIGlmIChyZXR1cm5lZE5vZGUuaXNJZGVudGlmaWVyKCkpIHtcbiAgICBjb25zdCBpZGVudGlmaWVyTmFtZSA9IHJldHVybmVkTm9kZS5ub2RlLm5hbWU7XG4gICAgY29uc3QgZGVjbGFyYXRpb24gPSByZXR1cm5lZE5vZGUuc2NvcGUuZ2V0QmluZGluZyhpZGVudGlmaWVyTmFtZSk7XG4gICAgaWYgKGRlY2xhcmF0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBCYWJlbFBhcnNlRXJyb3IoXG4gICAgICAgICAgcmV0dXJuZWROb2RlLm5vZGUsICdNaXNzaW5nIGRlY2xhcmF0aW9uIGZvciByZXR1cm4gdmFsdWUgZnJvbSBoZWxwZXIuJyk7XG4gICAgfVxuICAgIGlmICghZGVjbGFyYXRpb24ucGF0aC5pc1ZhcmlhYmxlRGVjbGFyYXRvcigpKSB7XG4gICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICAgIGRlY2xhcmF0aW9uLnBhdGgubm9kZSxcbiAgICAgICAgICAnVW5leHBlY3RlZCBoZWxwZXIgcmV0dXJuIHZhbHVlIGRlY2xhcmF0aW9uIChleHBlY3RlZCBhIHZhcmlhYmxlIGRlY2xhcmF0aW9uKS4nKTtcbiAgICB9XG4gICAgY29uc3QgaW5pdGlhbGl6ZXIgPSBkZWNsYXJhdGlvbi5wYXRoLmdldCgnaW5pdCcpO1xuICAgIGlmICghaW5pdGlhbGl6ZXIuaXNDYWxsRXhwcmVzc2lvbigpKSB7XG4gICAgICB0aHJvdyBuZXcgQmFiZWxQYXJzZUVycm9yKFxuICAgICAgICAgIGRlY2xhcmF0aW9uLnBhdGgubm9kZSxcbiAgICAgICAgICAnVW5leHBlY3RlZCByZXR1cm4gdmFsdWUgZnJvbSBoZWxwZXIgKGV4cGVjdGVkIGEgY2FsbCBleHByZXNzaW9uKS4nKTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgdGhlIGxhenkgbG9hZCBoZWxwZXIgaWYgdGhpcyBpcyB0aGUgb25seSByZWZlcmVuY2UgdG8gaXQuXG4gICAgaWYgKGxhenlMb2FkQmluZGluZy5yZWZlcmVuY2VzID09PSAxKSB7XG4gICAgICBsYXp5TG9hZEZuLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBpbml0aWFsaXplcjtcbiAgfVxuICByZXR1cm4gY2FsbDtcbn1cblxuZnVuY3Rpb24gZ2V0UmV0dXJuZWRFeHByZXNzaW9uKGZuOiBOb2RlUGF0aDx0LkZ1bmN0aW9uRGVjbGFyYXRpb24+KTogTm9kZVBhdGg8dC5FeHByZXNzaW9uPiB7XG4gIGNvbnN0IGJvZHlTdGF0ZW1lbnRzID0gZm4uZ2V0KCdib2R5JykuZ2V0KCdib2R5Jyk7XG4gIGZvciAoY29uc3Qgc3RhdGVtZW50IG9mIGJvZHlTdGF0ZW1lbnRzKSB7XG4gICAgaWYgKHN0YXRlbWVudC5pc1JldHVyblN0YXRlbWVudCgpKSB7XG4gICAgICBjb25zdCBhcmd1bWVudCA9IHN0YXRlbWVudC5nZXQoJ2FyZ3VtZW50Jyk7XG4gICAgICBpZiAoYXJndW1lbnQuaXNTZXF1ZW5jZUV4cHJlc3Npb24oKSkge1xuICAgICAgICBjb25zdCBleHByZXNzaW9ucyA9IGFyZ3VtZW50LmdldCgnZXhwcmVzc2lvbnMnKTtcbiAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoZXhwcmVzc2lvbnMpID8gZXhwcmVzc2lvbnNbZXhwcmVzc2lvbnMubGVuZ3RoIC0gMV0gOiBleHByZXNzaW9ucztcbiAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnQuaXNFeHByZXNzaW9uKCkpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihcbiAgICAgICAgICAgIHN0YXRlbWVudC5ub2RlLCAnSW52YWxpZCByZXR1cm4gYXJndW1lbnQgaW4gaGVscGVyIGZ1bmN0aW9uIChleHBlY3RlZCBhbiBleHByZXNzaW9uKS4nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgdGhyb3cgbmV3IEJhYmVsUGFyc2VFcnJvcihmbi5ub2RlLCAnTWlzc2luZyByZXR1cm4gc3RhdGVtZW50IGluIGhlbHBlciBmdW5jdGlvbi4nKTtcbn1cblxuLyoqXG4gKiBJcyB0aGUgZ2l2ZW4gYG5vZGVgIGFuIGFycmF5IG9mIGxpdGVyYWwgc3RyaW5ncz9cbiAqXG4gKiBAcGFyYW0gbm9kZSBUaGUgbm9kZSB0byB0ZXN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTdHJpbmdMaXRlcmFsQXJyYXkobm9kZTogdC5Ob2RlKTogbm9kZSBpcyB0LkV4cHJlc3Npb24mXG4gICAge2VsZW1lbnRzOiB0LlN0cmluZ0xpdGVyYWxbXX0ge1xuICByZXR1cm4gdC5pc0FycmF5RXhwcmVzc2lvbihub2RlKSAmJiBub2RlLmVsZW1lbnRzLmV2ZXJ5KGVsZW1lbnQgPT4gdC5pc1N0cmluZ0xpdGVyYWwoZWxlbWVudCkpO1xufVxuXG4vKipcbiAqIEFyZSBhbGwgdGhlIGdpdmVuIGBub2Rlc2AgZXhwcmVzc2lvbnM/XG4gKiBAcGFyYW0gbm9kZXMgVGhlIG5vZGVzIHRvIHRlc3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5T2ZFeHByZXNzaW9ucyhwYXRoczogTm9kZVBhdGg8dC5Ob2RlPltdKTogcGF0aHMgaXMgTm9kZVBhdGg8dC5FeHByZXNzaW9uPltdIHtcbiAgcmV0dXJuIHBhdGhzLmV2ZXJ5KGVsZW1lbnQgPT4gZWxlbWVudC5pc0V4cHJlc3Npb24oKSk7XG59XG5cbi8qKiBPcHRpb25zIHRoYXQgYWZmZWN0IGhvdyB0aGUgYG1ha2VFc1hYWFRyYW5zbGF0ZVBsdWdpbigpYCBmdW5jdGlvbnMgd29yay4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVHJhbnNsYXRlUGx1Z2luT3B0aW9ucyB7XG4gIG1pc3NpbmdUcmFuc2xhdGlvbj86IERpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5O1xuICBsb2NhbGl6ZU5hbWU/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogVHJhbnNsYXRlIHRoZSB0ZXh0IG9mIHRoZSBnaXZlbiBtZXNzYWdlLCB1c2luZyB0aGUgZ2l2ZW4gdHJhbnNsYXRpb25zLlxuICpcbiAqIExvZ3MgYXMgd2FybmluZyBpZiB0aGUgdHJhbnNsYXRpb24gaXMgbm90IGF2YWlsYWJsZVxuICogQHB1YmxpY0FwaSB1c2VkIGJ5IENMSVxuICovXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNsYXRlKFxuICAgIGRpYWdub3N0aWNzOiBEaWFnbm9zdGljcywgdHJhbnNsYXRpb25zOiBSZWNvcmQ8c3RyaW5nLCDJtVBhcnNlZFRyYW5zbGF0aW9uPixcbiAgICBtZXNzYWdlUGFydHM6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCBzdWJzdGl0dXRpb25zOiByZWFkb25seSBhbnlbXSxcbiAgICBtaXNzaW5nVHJhbnNsYXRpb246IERpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5KTogW1RlbXBsYXRlU3RyaW5nc0FycmF5LCByZWFkb25seSBhbnlbXV0ge1xuICB0cnkge1xuICAgIHJldHVybiDJtXRyYW5zbGF0ZSh0cmFuc2xhdGlvbnMsIG1lc3NhZ2VQYXJ0cywgc3Vic3RpdHV0aW9ucyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoybVpc01pc3NpbmdUcmFuc2xhdGlvbkVycm9yKGUpKSB7XG4gICAgICBkaWFnbm9zdGljcy5hZGQobWlzc2luZ1RyYW5zbGF0aW9uLCBlLm1lc3NhZ2UpO1xuICAgICAgLy8gUmV0dXJuIHRoZSBwYXJzZWQgbWVzc2FnZSBiZWNhdXNlIHRoaXMgd2lsbCBoYXZlIHRoZSBtZXRhIGJsb2NrcyBzdHJpcHBlZFxuICAgICAgcmV0dXJuIFtcbiAgICAgICAgybVtYWtlVGVtcGxhdGVPYmplY3QoZS5wYXJzZWRNZXNzYWdlLm1lc3NhZ2VQYXJ0cywgZS5wYXJzZWRNZXNzYWdlLm1lc3NhZ2VQYXJ0cyksXG4gICAgICAgIHN1YnN0aXR1dGlvbnNcbiAgICAgIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpYWdub3N0aWNzLmVycm9yKGUubWVzc2FnZSk7XG4gICAgICByZXR1cm4gW21lc3NhZ2VQYXJ0cywgc3Vic3RpdHV0aW9uc107XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCYWJlbFBhcnNlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIHByaXZhdGUgcmVhZG9ubHkgdHlwZSA9ICdCYWJlbFBhcnNlRXJyb3InO1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbm9kZTogdC5Ob2RlLCBtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNCYWJlbFBhcnNlRXJyb3IoZTogYW55KTogZSBpcyBCYWJlbFBhcnNlRXJyb3Ige1xuICByZXR1cm4gZS50eXBlID09PSAnQmFiZWxQYXJzZUVycm9yJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQ29kZUZyYW1lRXJyb3IoXG4gICAgZnM6IFBhdGhNYW5pcHVsYXRpb24sIHBhdGg6IE5vZGVQYXRoLCBlOiBCYWJlbFBhcnNlRXJyb3IpOiBzdHJpbmcge1xuICBsZXQgZmlsZW5hbWUgPSBwYXRoLmh1Yi5maWxlLm9wdHMuZmlsZW5hbWU7XG4gIGlmIChmaWxlbmFtZSkge1xuICAgIGZpbGVuYW1lID0gZnMucmVzb2x2ZShmaWxlbmFtZSk7XG4gICAgbGV0IGN3ZCA9IHBhdGguaHViLmZpbGUub3B0cy5jd2Q7XG4gICAgaWYgKGN3ZCkge1xuICAgICAgY3dkID0gZnMucmVzb2x2ZShjd2QpO1xuICAgICAgZmlsZW5hbWUgPSBmcy5yZWxhdGl2ZShjd2QsIGZpbGVuYW1lKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZmlsZW5hbWUgPSAnKHVua25vd24gZmlsZSknO1xuICB9XG4gIGNvbnN0IG1lc3NhZ2UgPSBwYXRoLmh1Yi5maWxlLmJ1aWxkQ29kZUZyYW1lRXJyb3IoZS5ub2RlLCBlLm1lc3NhZ2UpLm1lc3NhZ2U7XG4gIHJldHVybiBgJHtmaWxlbmFtZX06ICR7bWVzc2FnZX1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYXRpb24oXG4gICAgZnM6IFBhdGhNYW5pcHVsYXRpb24sIHN0YXJ0UGF0aDogTm9kZVBhdGgsIGVuZFBhdGg/OiBOb2RlUGF0aCk6IMm1U291cmNlTG9jYXRpb258dW5kZWZpbmVkIHtcbiAgY29uc3Qgc3RhcnRMb2NhdGlvbiA9IHN0YXJ0UGF0aC5ub2RlLmxvYztcbiAgY29uc3QgZmlsZSA9IGdldEZpbGVGcm9tUGF0aChmcywgc3RhcnRQYXRoKTtcbiAgaWYgKCFzdGFydExvY2F0aW9uIHx8ICFmaWxlKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IGVuZExvY2F0aW9uID1cbiAgICAgIGVuZFBhdGggJiYgZ2V0RmlsZUZyb21QYXRoKGZzLCBlbmRQYXRoKSA9PT0gZmlsZSAmJiBlbmRQYXRoLm5vZGUubG9jIHx8IHN0YXJ0TG9jYXRpb247XG5cbiAgcmV0dXJuIHtcbiAgICBzdGFydDogZ2V0TGluZUFuZENvbHVtbihzdGFydExvY2F0aW9uLnN0YXJ0KSxcbiAgICBlbmQ6IGdldExpbmVBbmRDb2x1bW4oZW5kTG9jYXRpb24uZW5kKSxcbiAgICBmaWxlLFxuICAgIHRleHQ6IGdldFRleHQoc3RhcnRQYXRoKSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZUxvY2F0aW9uUG9zaXRpb24obG9jYXRpb246IMm1U291cmNlTG9jYXRpb24pOiBzdHJpbmcge1xuICBjb25zdCBlbmRMaW5lU3RyaW5nID0gbG9jYXRpb24uZW5kICE9PSB1bmRlZmluZWQgJiYgbG9jYXRpb24uZW5kLmxpbmUgIT09IGxvY2F0aW9uLnN0YXJ0LmxpbmUgP1xuICAgICAgYCwke2xvY2F0aW9uLmVuZC5saW5lICsgMX1gIDpcbiAgICAgICcnO1xuICByZXR1cm4gYCR7bG9jYXRpb24uc3RhcnQubGluZSArIDF9JHtlbmRMaW5lU3RyaW5nfWA7XG59XG5cbmZ1bmN0aW9uIGdldEZpbGVGcm9tUGF0aChmczogUGF0aE1hbmlwdWxhdGlvbiwgcGF0aDogTm9kZVBhdGh8dW5kZWZpbmVkKTogQWJzb2x1dGVGc1BhdGh8bnVsbCB7XG4gIGNvbnN0IG9wdHMgPSBwYXRoPy5odWIuZmlsZS5vcHRzO1xuICBjb25zdCBmaWxlbmFtZSA9IG9wdHM/LmZpbGVuYW1lO1xuICBpZiAoIWZpbGVuYW1lKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29uc3QgcmVsYXRpdmVQYXRoID0gZnMucmVsYXRpdmUob3B0cy5jd2QsIGZpbGVuYW1lKTtcbiAgY29uc3Qgcm9vdCA9IG9wdHMuZ2VuZXJhdG9yT3B0cy5zb3VyY2VSb290ID8/IG9wdHMuY3dkO1xuICBjb25zdCBhYnNQYXRoID0gZnMucmVzb2x2ZShyb290LCByZWxhdGl2ZVBhdGgpO1xuICByZXR1cm4gYWJzUGF0aDtcbn1cblxuZnVuY3Rpb24gZ2V0TGluZUFuZENvbHVtbihsb2M6IHtsaW5lOiBudW1iZXIsIGNvbHVtbjogbnVtYmVyfSk6IHtsaW5lOiBudW1iZXIsIGNvbHVtbjogbnVtYmVyfSB7XG4gIC8vIE5vdGUgd2Ugd2FudCAwLWJhc2VkIGxpbmUgbnVtYmVycyBidXQgQmFiZWwgcmV0dXJucyAxLWJhc2VkLlxuICByZXR1cm4ge2xpbmU6IGxvYy5saW5lIC0gMSwgY29sdW1uOiBsb2MuY29sdW1ufTtcbn1cblxuZnVuY3Rpb24gZ2V0VGV4dChwYXRoOiBOb2RlUGF0aCk6IHN0cmluZ3x1bmRlZmluZWQge1xuICBpZiAocGF0aC5ub2RlLnN0YXJ0ID09PSBudWxsIHx8IHBhdGgubm9kZS5lbmQgPT09IG51bGwpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHJldHVybiBwYXRoLmh1Yi5maWxlLmNvZGUuc3Vic3RyaW5nKHBhdGgubm9kZS5zdGFydCwgcGF0aC5ub2RlLmVuZCk7XG59XG4iXX0=
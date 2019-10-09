/// <amd-module name="@angular/localize/src/tools/src/translate/source_files/source_file_utils" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ɵParsedTranslation } from '@angular/localize';
import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { Diagnostics } from '../../diagnostics';
/**
 * Is the given `expression` an identifier with the correct name
 * @param expression The expression to check.
 */
export declare function isNamedIdentifier(expression: NodePath<t.Expression>, name: string): expression is NodePath<t.Identifier>;
/**
* Is the given `identifier` declared globally.
* @param identifier The identifier to check.
*/
export declare function isGlobalIdentifier(identifier: NodePath<t.Identifier>): boolean;
/**
* Build a translated expression to replace the call to `$localize`.
* @param messageParts The static parts of the message.
* @param substitutions The expressions to substitute into the message.
*/
export declare function buildLocalizeReplacement(messageParts: TemplateStringsArray, substitutions: readonly t.Expression[]): t.Expression;
/**
* Extract the message parts from the given `call` (to `$localize`).
*
* The message parts will either by the first argument to the `call` or it will be wrapped in call
* to a helper function like `__makeTemplateObject`.
*
* @param call The AST node of the call to process.
*/
export declare function unwrapMessagePartsFromLocalizeCall(call: t.CallExpression): TemplateStringsArray;
export declare function unwrapSubstitutionsFromLocalizeCall(call: t.CallExpression): t.Expression[];
export declare function unwrapMessagePartsFromTemplateLiteral(elements: t.TemplateElement[]): TemplateStringsArray;
/**
* Wrap the given `expression` in parentheses if it is a binary expression.
*
* This ensures that this expression is evaluated correctly if it is embedded in another expression.
*
* @param expression The expression to potentially wrap.
*/
export declare function wrapInParensIfNecessary(expression: t.Expression): t.Expression;
/**
* Extract the string values from an `array` of string literals.
* @param array The array to unwrap.
*/
export declare function unwrapStringLiteralArray(array: t.Expression): string[];
/**
* Is the given `node` an array of literal strings?
*
* @param node The node to test.
*/
export declare function isStringLiteralArray(node: t.Node): node is t.Expression & {
    elements: t.StringLiteral[];
};
/**
* Are all the given `nodes` expressions?
* @param nodes The nodes to test.
*/
export declare function isArrayOfExpressions(nodes: t.Node[]): nodes is t.Expression[];
/** Options that affect how the `makeEsXXXTranslatePlugin()` functions work. */
export interface TranslatePluginOptions {
    missingTranslation?: MissingTranslationStrategy;
    localizeName?: string;
}
/**
 * How to handle missing translations.
 */
export declare type MissingTranslationStrategy = 'error' | 'warning' | 'ignore';
/**
 * Translate the text of the given message, using the given translations.
 *
 * Logs as warning if the translation is not available
 */
export declare function translate(diagnostics: Diagnostics, translations: Record<string, ɵParsedTranslation>, messageParts: TemplateStringsArray, substitutions: readonly any[], missingTranslation: MissingTranslationStrategy): [TemplateStringsArray, readonly any[]];
export declare class BabelParseError extends Error {
    node: t.BaseNode;
    private readonly type;
    constructor(node: t.BaseNode, message: string);
}
export declare function isBabelParseError(e: any): e is BabelParseError;

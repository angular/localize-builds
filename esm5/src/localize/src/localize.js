/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Tag a template literal string for localization.
 *
 * For example:
 *
 * ```ts
 * $localize `some string to localize`
 * ```
 *
 * **Naming placeholders**
 *
 * If the template literal string contains expressions then you can optionally name the placeholder
 * associated with each expression. Do this by providing the placeholder name wrapped in `:`
 * characters directly after the expression. These placeholder names are stripped out of the
 * rendered localized string.
 *
 * For example, to name the `item.length` expression placeholder `itemCount` you write:
 *
 * ```ts
 * $localize `There are ${item.length}:itemCount: items`;
 * ```
 *
 * If you need to use a `:` character directly an expression you must either provide a name or you
 * can escape the `:` by preceding it with a backslash:
 *
 * For example:
 *
 * ```ts
 * $localize `${label}:label:: ${}`
 * // or
 * $localize `${label}\: ${}`
 * ```
 *
 * **Processing localized strings:**
 *
 * There are three scenarios:
 *
 * * **compile-time inlining**: the `$localize` tag is transformed at compile time by a transpiler,
 * removing the tag and replacing the template literal string with a translated literal string
 * from a collection of translations provided to the transpilation tool.
 *
 * * **run-time evaluation**: the `$localize` tag is a run-time function that replaces and reorders
 * the parts (static strings and expressions) of the template literal string with strings from a
 * collection of translations loaded at run-time.
 *
 * * **pass-through evaluation**: the `$localize` tag is a run-time function that simply evaluates
 * the original template literal string without applying any translations to the parts. This version
 * is used during development or where there is no need to translate the localized template
 * literals.
 *
 * @param messageParts a collection of the static parts of the template string.
 * @param expressions a collection of the values of each placeholder in the template string.
 * @returns the translated string, with the `messageParts` and `expressions` interleaved together.
 */
export var $localize = function (messageParts) {
    var expressions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        expressions[_i - 1] = arguments[_i];
    }
    if ($localize.translate) {
        // Don't use array expansion here to avoid the compiler adding `__read()` helper unnecessarily.
        var translation = $localize.translate(messageParts, expressions);
        messageParts = translation[0];
        expressions = translation[1];
    }
    var message = stripBlock(messageParts[0], messageParts.raw[0]);
    for (var i = 1; i < messageParts.length; i++) {
        message += expressions[i - 1] + stripBlock(messageParts[i], messageParts.raw[i]);
    }
    return message;
};
var BLOCK_MARKER = ':';
/**
 * Strip a delimited "block" from the start of the `messagePart`, if it is found.
 *
 * If a marker character (:) actually appears in the content at the start of a tagged string or
 * after a substitution expression, where a block has not been provided the character must be
 * escaped with a backslash, `\:`. This function checks for this by looking at the `raw`
 * messagePart, which should still contain the backslash.
 *
 * If the template literal was synthesized, rather than appearing in original source code, then its
 * raw array will only contain empty strings. This is because the current TypeScript compiler use
 * the original source code to find the raw text and in the case of synthesized AST nodes, there is
 * no source code to draw upon.
 *
 * The workaround in this function is to assume that the template literal did not contain an escaped
 * placeholder name, and fall back on checking the cooked array instead. This should be OK because
 * synthesized nodes (from the Angular template compiler) will always provide explicit delimited
 * blocks and so will never need to escape placeholder name markers.
 *
 * @param messagePart The cooked message part to process.
 * @param rawMessagePart The raw message part to check.
 * @returns the message part with the placeholder name stripped, if found.
 */
function stripBlock(messagePart, rawMessagePart) {
    return (rawMessagePart || messagePart).charAt(0) === BLOCK_MARKER ?
        messagePart.substring(messagePart.indexOf(BLOCK_MARKER, 1) + 1) :
        messagePart;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvbG9jYWxpemUvc3JjL2xvY2FsaXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQXVCSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxREc7QUFDSCxNQUFNLENBQUMsSUFBTSxTQUFTLEdBQWUsVUFDakMsWUFBa0M7SUFBRSxxQkFBOEI7U0FBOUIsVUFBOEIsRUFBOUIscUJBQThCLEVBQTlCLElBQThCO1FBQTlCLG9DQUE4Qjs7SUFDcEUsSUFBSSxTQUFTLENBQUMsU0FBUyxFQUFFO1FBQ3ZCLCtGQUErRjtRQUMvRixJQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNuRSxZQUFZLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLFdBQVcsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDOUI7SUFDRCxJQUFJLE9BQU8sR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUM1QyxPQUFPLElBQUksV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsRjtJQUNELE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUMsQ0FBQztBQUVGLElBQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQztBQUV6Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUJHO0FBQ0gsU0FBUyxVQUFVLENBQUMsV0FBbUIsRUFBRSxjQUFzQjtJQUM3RCxPQUFPLENBQUMsY0FBYyxJQUFJLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxZQUFZLENBQUMsQ0FBQztRQUMvRCxXQUFXLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakUsV0FBVyxDQUFDO0FBQ2xCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmV4cG9ydCBpbnRlcmZhY2UgTG9jYWxpemVGbiB7XG4gIChtZXNzYWdlUGFydHM6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi5leHByZXNzaW9uczogcmVhZG9ubHkgYW55W10pOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgZnVuY3Rpb24gdGhhdCBjb252ZXJ0cyBhbiBpbnB1dCBcIm1lc3NhZ2Ugd2l0aCBleHByZXNzaW9uc1wiIGludG8gYSB0cmFuc2xhdGVkIFwibWVzc2FnZSB3aXRoXG4gICAqIGV4cHJlc3Npb25zXCIuXG4gICAqXG4gICAqIFRoZSBjb252ZXJzaW9uIG1heSBiZSBkb25lIGluIHBsYWNlLCBtb2RpZnlpbmcgdGhlIGFycmF5IHBhc3NlZCB0byB0aGUgZnVuY3Rpb24sIHNvXG4gICAqIGRvbid0IGFzc3VtZSB0aGF0IHRoaXMgaGFzIG5vIHNpZGUtZWZmZWN0cy5cbiAgICpcbiAgICogVGhlIGV4cHJlc3Npb25zIG11c3QgYmUgcGFzc2VkIGluIHNpbmNlIGl0IG1pZ2h0IGJlIHRoZXkgbmVlZCB0byBiZSByZW9yZGVyZWQgZm9yXG4gICAqIGRpZmZlcmVudCB0cmFuc2xhdGlvbnMuXG4gICAqL1xuICB0cmFuc2xhdGU/OiBUcmFuc2xhdGVGbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUcmFuc2xhdGVGbiB7XG4gIChtZXNzYWdlUGFydHM6IFRlbXBsYXRlU3RyaW5nc0FycmF5LFxuICAgZXhwcmVzc2lvbnM6IHJlYWRvbmx5IGFueVtdKTogW1RlbXBsYXRlU3RyaW5nc0FycmF5LCByZWFkb25seSBhbnlbXV07XG59XG5cbi8qKlxuICogVGFnIGEgdGVtcGxhdGUgbGl0ZXJhbCBzdHJpbmcgZm9yIGxvY2FsaXphdGlvbi5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogJGxvY2FsaXplIGBzb21lIHN0cmluZyB0byBsb2NhbGl6ZWBcbiAqIGBgYFxuICpcbiAqICoqTmFtaW5nIHBsYWNlaG9sZGVycyoqXG4gKlxuICogSWYgdGhlIHRlbXBsYXRlIGxpdGVyYWwgc3RyaW5nIGNvbnRhaW5zIGV4cHJlc3Npb25zIHRoZW4geW91IGNhbiBvcHRpb25hbGx5IG5hbWUgdGhlIHBsYWNlaG9sZGVyXG4gKiBhc3NvY2lhdGVkIHdpdGggZWFjaCBleHByZXNzaW9uLiBEbyB0aGlzIGJ5IHByb3ZpZGluZyB0aGUgcGxhY2Vob2xkZXIgbmFtZSB3cmFwcGVkIGluIGA6YFxuICogY2hhcmFjdGVycyBkaXJlY3RseSBhZnRlciB0aGUgZXhwcmVzc2lvbi4gVGhlc2UgcGxhY2Vob2xkZXIgbmFtZXMgYXJlIHN0cmlwcGVkIG91dCBvZiB0aGVcbiAqIHJlbmRlcmVkIGxvY2FsaXplZCBzdHJpbmcuXG4gKlxuICogRm9yIGV4YW1wbGUsIHRvIG5hbWUgdGhlIGBpdGVtLmxlbmd0aGAgZXhwcmVzc2lvbiBwbGFjZWhvbGRlciBgaXRlbUNvdW50YCB5b3Ugd3JpdGU6XG4gKlxuICogYGBgdHNcbiAqICRsb2NhbGl6ZSBgVGhlcmUgYXJlICR7aXRlbS5sZW5ndGh9Oml0ZW1Db3VudDogaXRlbXNgO1xuICogYGBgXG4gKlxuICogSWYgeW91IG5lZWQgdG8gdXNlIGEgYDpgIGNoYXJhY3RlciBkaXJlY3RseSBhbiBleHByZXNzaW9uIHlvdSBtdXN0IGVpdGhlciBwcm92aWRlIGEgbmFtZSBvciB5b3VcbiAqIGNhbiBlc2NhcGUgdGhlIGA6YCBieSBwcmVjZWRpbmcgaXQgd2l0aCBhIGJhY2tzbGFzaDpcbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogJGxvY2FsaXplIGAke2xhYmVsfTpsYWJlbDo6ICR7fWBcbiAqIC8vIG9yXG4gKiAkbG9jYWxpemUgYCR7bGFiZWx9XFw6ICR7fWBcbiAqIGBgYFxuICpcbiAqICoqUHJvY2Vzc2luZyBsb2NhbGl6ZWQgc3RyaW5nczoqKlxuICpcbiAqIFRoZXJlIGFyZSB0aHJlZSBzY2VuYXJpb3M6XG4gKlxuICogKiAqKmNvbXBpbGUtdGltZSBpbmxpbmluZyoqOiB0aGUgYCRsb2NhbGl6ZWAgdGFnIGlzIHRyYW5zZm9ybWVkIGF0IGNvbXBpbGUgdGltZSBieSBhIHRyYW5zcGlsZXIsXG4gKiByZW1vdmluZyB0aGUgdGFnIGFuZCByZXBsYWNpbmcgdGhlIHRlbXBsYXRlIGxpdGVyYWwgc3RyaW5nIHdpdGggYSB0cmFuc2xhdGVkIGxpdGVyYWwgc3RyaW5nXG4gKiBmcm9tIGEgY29sbGVjdGlvbiBvZiB0cmFuc2xhdGlvbnMgcHJvdmlkZWQgdG8gdGhlIHRyYW5zcGlsYXRpb24gdG9vbC5cbiAqXG4gKiAqICoqcnVuLXRpbWUgZXZhbHVhdGlvbioqOiB0aGUgYCRsb2NhbGl6ZWAgdGFnIGlzIGEgcnVuLXRpbWUgZnVuY3Rpb24gdGhhdCByZXBsYWNlcyBhbmQgcmVvcmRlcnNcbiAqIHRoZSBwYXJ0cyAoc3RhdGljIHN0cmluZ3MgYW5kIGV4cHJlc3Npb25zKSBvZiB0aGUgdGVtcGxhdGUgbGl0ZXJhbCBzdHJpbmcgd2l0aCBzdHJpbmdzIGZyb20gYVxuICogY29sbGVjdGlvbiBvZiB0cmFuc2xhdGlvbnMgbG9hZGVkIGF0IHJ1bi10aW1lLlxuICpcbiAqICogKipwYXNzLXRocm91Z2ggZXZhbHVhdGlvbioqOiB0aGUgYCRsb2NhbGl6ZWAgdGFnIGlzIGEgcnVuLXRpbWUgZnVuY3Rpb24gdGhhdCBzaW1wbHkgZXZhbHVhdGVzXG4gKiB0aGUgb3JpZ2luYWwgdGVtcGxhdGUgbGl0ZXJhbCBzdHJpbmcgd2l0aG91dCBhcHBseWluZyBhbnkgdHJhbnNsYXRpb25zIHRvIHRoZSBwYXJ0cy4gVGhpcyB2ZXJzaW9uXG4gKiBpcyB1c2VkIGR1cmluZyBkZXZlbG9wbWVudCBvciB3aGVyZSB0aGVyZSBpcyBubyBuZWVkIHRvIHRyYW5zbGF0ZSB0aGUgbG9jYWxpemVkIHRlbXBsYXRlXG4gKiBsaXRlcmFscy5cbiAqXG4gKiBAcGFyYW0gbWVzc2FnZVBhcnRzIGEgY29sbGVjdGlvbiBvZiB0aGUgc3RhdGljIHBhcnRzIG9mIHRoZSB0ZW1wbGF0ZSBzdHJpbmcuXG4gKiBAcGFyYW0gZXhwcmVzc2lvbnMgYSBjb2xsZWN0aW9uIG9mIHRoZSB2YWx1ZXMgb2YgZWFjaCBwbGFjZWhvbGRlciBpbiB0aGUgdGVtcGxhdGUgc3RyaW5nLlxuICogQHJldHVybnMgdGhlIHRyYW5zbGF0ZWQgc3RyaW5nLCB3aXRoIHRoZSBgbWVzc2FnZVBhcnRzYCBhbmQgYGV4cHJlc3Npb25zYCBpbnRlcmxlYXZlZCB0b2dldGhlci5cbiAqL1xuZXhwb3J0IGNvbnN0ICRsb2NhbGl6ZTogTG9jYWxpemVGbiA9IGZ1bmN0aW9uKFxuICAgIG1lc3NhZ2VQYXJ0czogVGVtcGxhdGVTdHJpbmdzQXJyYXksIC4uLmV4cHJlc3Npb25zOiByZWFkb25seSBhbnlbXSkge1xuICBpZiAoJGxvY2FsaXplLnRyYW5zbGF0ZSkge1xuICAgIC8vIERvbid0IHVzZSBhcnJheSBleHBhbnNpb24gaGVyZSB0byBhdm9pZCB0aGUgY29tcGlsZXIgYWRkaW5nIGBfX3JlYWQoKWAgaGVscGVyIHVubmVjZXNzYXJpbHkuXG4gICAgY29uc3QgdHJhbnNsYXRpb24gPSAkbG9jYWxpemUudHJhbnNsYXRlKG1lc3NhZ2VQYXJ0cywgZXhwcmVzc2lvbnMpO1xuICAgIG1lc3NhZ2VQYXJ0cyA9IHRyYW5zbGF0aW9uWzBdO1xuICAgIGV4cHJlc3Npb25zID0gdHJhbnNsYXRpb25bMV07XG4gIH1cbiAgbGV0IG1lc3NhZ2UgPSBzdHJpcEJsb2NrKG1lc3NhZ2VQYXJ0c1swXSwgbWVzc2FnZVBhcnRzLnJhd1swXSk7XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgbWVzc2FnZVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgbWVzc2FnZSArPSBleHByZXNzaW9uc1tpIC0gMV0gKyBzdHJpcEJsb2NrKG1lc3NhZ2VQYXJ0c1tpXSwgbWVzc2FnZVBhcnRzLnJhd1tpXSk7XG4gIH1cbiAgcmV0dXJuIG1lc3NhZ2U7XG59O1xuXG5jb25zdCBCTE9DS19NQVJLRVIgPSAnOic7XG5cbi8qKlxuICogU3RyaXAgYSBkZWxpbWl0ZWQgXCJibG9ja1wiIGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBgbWVzc2FnZVBhcnRgLCBpZiBpdCBpcyBmb3VuZC5cbiAqXG4gKiBJZiBhIG1hcmtlciBjaGFyYWN0ZXIgKDopIGFjdHVhbGx5IGFwcGVhcnMgaW4gdGhlIGNvbnRlbnQgYXQgdGhlIHN0YXJ0IG9mIGEgdGFnZ2VkIHN0cmluZyBvclxuICogYWZ0ZXIgYSBzdWJzdGl0dXRpb24gZXhwcmVzc2lvbiwgd2hlcmUgYSBibG9jayBoYXMgbm90IGJlZW4gcHJvdmlkZWQgdGhlIGNoYXJhY3RlciBtdXN0IGJlXG4gKiBlc2NhcGVkIHdpdGggYSBiYWNrc2xhc2gsIGBcXDpgLiBUaGlzIGZ1bmN0aW9uIGNoZWNrcyBmb3IgdGhpcyBieSBsb29raW5nIGF0IHRoZSBgcmF3YFxuICogbWVzc2FnZVBhcnQsIHdoaWNoIHNob3VsZCBzdGlsbCBjb250YWluIHRoZSBiYWNrc2xhc2guXG4gKlxuICogSWYgdGhlIHRlbXBsYXRlIGxpdGVyYWwgd2FzIHN5bnRoZXNpemVkLCByYXRoZXIgdGhhbiBhcHBlYXJpbmcgaW4gb3JpZ2luYWwgc291cmNlIGNvZGUsIHRoZW4gaXRzXG4gKiByYXcgYXJyYXkgd2lsbCBvbmx5IGNvbnRhaW4gZW1wdHkgc3RyaW5ncy4gVGhpcyBpcyBiZWNhdXNlIHRoZSBjdXJyZW50IFR5cGVTY3JpcHQgY29tcGlsZXIgdXNlXG4gKiB0aGUgb3JpZ2luYWwgc291cmNlIGNvZGUgdG8gZmluZCB0aGUgcmF3IHRleHQgYW5kIGluIHRoZSBjYXNlIG9mIHN5bnRoZXNpemVkIEFTVCBub2RlcywgdGhlcmUgaXNcbiAqIG5vIHNvdXJjZSBjb2RlIHRvIGRyYXcgdXBvbi5cbiAqXG4gKiBUaGUgd29ya2Fyb3VuZCBpbiB0aGlzIGZ1bmN0aW9uIGlzIHRvIGFzc3VtZSB0aGF0IHRoZSB0ZW1wbGF0ZSBsaXRlcmFsIGRpZCBub3QgY29udGFpbiBhbiBlc2NhcGVkXG4gKiBwbGFjZWhvbGRlciBuYW1lLCBhbmQgZmFsbCBiYWNrIG9uIGNoZWNraW5nIHRoZSBjb29rZWQgYXJyYXkgaW5zdGVhZC4gVGhpcyBzaG91bGQgYmUgT0sgYmVjYXVzZVxuICogc3ludGhlc2l6ZWQgbm9kZXMgKGZyb20gdGhlIEFuZ3VsYXIgdGVtcGxhdGUgY29tcGlsZXIpIHdpbGwgYWx3YXlzIHByb3ZpZGUgZXhwbGljaXQgZGVsaW1pdGVkXG4gKiBibG9ja3MgYW5kIHNvIHdpbGwgbmV2ZXIgbmVlZCB0byBlc2NhcGUgcGxhY2Vob2xkZXIgbmFtZSBtYXJrZXJzLlxuICpcbiAqIEBwYXJhbSBtZXNzYWdlUGFydCBUaGUgY29va2VkIG1lc3NhZ2UgcGFydCB0byBwcm9jZXNzLlxuICogQHBhcmFtIHJhd01lc3NhZ2VQYXJ0IFRoZSByYXcgbWVzc2FnZSBwYXJ0IHRvIGNoZWNrLlxuICogQHJldHVybnMgdGhlIG1lc3NhZ2UgcGFydCB3aXRoIHRoZSBwbGFjZWhvbGRlciBuYW1lIHN0cmlwcGVkLCBpZiBmb3VuZC5cbiAqL1xuZnVuY3Rpb24gc3RyaXBCbG9jayhtZXNzYWdlUGFydDogc3RyaW5nLCByYXdNZXNzYWdlUGFydDogc3RyaW5nKSB7XG4gIHJldHVybiAocmF3TWVzc2FnZVBhcnQgfHwgbWVzc2FnZVBhcnQpLmNoYXJBdCgwKSA9PT0gQkxPQ0tfTUFSS0VSID9cbiAgICAgIG1lc3NhZ2VQYXJ0LnN1YnN0cmluZyhtZXNzYWdlUGFydC5pbmRleE9mKEJMT0NLX01BUktFUiwgMSkgKyAxKSA6XG4gICAgICBtZXNzYWdlUGFydDtcbn1cbiJdfQ==
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
 * **Providing meaning, description and id**
 *
 * You can optionally specify one or more of `meaning`, `description` and `id` for a localized
 * string by pre-pending it with a colon delimited block of the form:
 *
 * ```ts
 * $localize`:meaning|description@@id:source message text`;
 *
 * $localize`:meaning|:source message text`;
 * $localize`:description:source message text`;
 * $localize`:@@id:source message text`;
 * ```
 *
 * This format is the same as that used for `i18n` markers in Angular templates. See the
 * [Angular 18n guide](guide/i18n#template-translations).
 *
 * **Naming placeholders**
 *
 * If the template literal string contains expressions, then the expressions will be automatically
 * associated with placeholder names for you.
 *
 * For example:
 *
 * ```ts
 * $localize `Hi ${name}! There are ${items.length} items.`;
 * ```
 *
 * will generate a message-source of `Hi {$PH}! There are {$PH_1} items`.
 *
 * The recommended practice is to name the placeholder associated with each expression though.
 *
 * Do this by providing the placeholder name wrapped in `:` characters directly after the
 * expression. These placeholder names are stripped out of the rendered localized string.
 *
 * For example, to name the `items.length` expression placeholder `itemCount` you write:
 *
 * ```ts
 * $localize `There are ${items.length}:itemCount: items`;
 * ```
 *
 * **Escaping colon markers**
 *
 * If you need to use a `:` character directly at the start of a tagged string that has no
 * metadata block, or directly after a substitution expression that has no name you must escape
 * the `:` by preceding it with a backslash:
 *
 * For example:
 *
 * ```ts
 * // message has a metadata block so no need to escape colon
 * $localize `:some description::this message starts with a colon (:)`;
 * // no metadata block so the colon must be escaped
 * $localize `\:this message starts with a colon (:)`;
 * ```
 *
 * ```ts
 * // named substitution so no need to escape colon
 * $localize `${label}:label:: ${}`
 * // anonymous substitution so colon must be escaped
 * $localize `${label}\: ${}`
 * ```
 *
 * **Processing localized strings:**
 *
 * There are three scenarios:
 *
 * * **compile-time inlining**: the `$localize` tag is transformed at compile time by a
 * transpiler, removing the tag and replacing the template literal string with a translated
 * literal string from a collection of translations provided to the transpilation tool.
 *
 * * **run-time evaluation**: the `$localize` tag is a run-time function that replaces and
 * reorders the parts (static strings and expressions) of the template literal string with strings
 * from a collection of translations loaded at run-time.
 *
 * * **pass-through evaluation**: the `$localize` tag is a run-time function that simply evaluates
 * the original template literal string without applying any translations to the parts. This
 * version is used during development or where there is no need to translate the localized
 * template literals.
 * @param messageParts a collection of the static parts of the template string.
 * @param expressions a collection of the values of each placeholder in the template string.
 * @returns the translated string, with the `messageParts` and `expressions` interleaved together.
 */
export const $localize = function (messageParts, ...expressions) {
    if ($localize.translate) {
        // Don't use array expansion here to avoid the compiler adding `__read()` helper unnecessarily.
        const translation = $localize.translate(messageParts, expressions);
        messageParts = translation[0];
        expressions = translation[1];
    }
    let message = stripBlock(messageParts[0], messageParts.raw[0]);
    for (let i = 1; i < messageParts.length; i++) {
        message += expressions[i - 1] + stripBlock(messageParts[i], messageParts.raw[i]);
    }
    return message;
};
const BLOCK_MARKER = ':';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvbG9jYWxpemUvc3JjL2xvY2FsaXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQXVCSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMEZHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFlLFVBQ2pDLFlBQWtDLEVBQUUsR0FBRyxXQUEyQjtJQUNwRSxJQUFJLFNBQVMsQ0FBQyxTQUFTLEVBQUU7UUFDdkIsK0ZBQStGO1FBQy9GLE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ25FLFlBQVksR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsV0FBVyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM5QjtJQUNELElBQUksT0FBTyxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9ELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzVDLE9BQU8sSUFBSSxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2xGO0lBQ0QsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQyxDQUFDO0FBRUYsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDO0FBRXpCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxQkc7QUFDSCxTQUFTLFVBQVUsQ0FBQyxXQUFtQixFQUFFLGNBQXNCO0lBQzdELE9BQU8sQ0FBQyxjQUFjLElBQUksV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLFlBQVksQ0FBQyxDQUFDO1FBQy9ELFdBQVcsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRSxXQUFXLENBQUM7QUFDbEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuZXhwb3J0IGludGVyZmFjZSBMb2NhbGl6ZUZuIHtcbiAgKG1lc3NhZ2VQYXJ0czogVGVtcGxhdGVTdHJpbmdzQXJyYXksIC4uLmV4cHJlc3Npb25zOiByZWFkb25seSBhbnlbXSk6IHN0cmluZztcblxuICAvKipcbiAgICogQSBmdW5jdGlvbiB0aGF0IGNvbnZlcnRzIGFuIGlucHV0IFwibWVzc2FnZSB3aXRoIGV4cHJlc3Npb25zXCIgaW50byBhIHRyYW5zbGF0ZWQgXCJtZXNzYWdlIHdpdGhcbiAgICogZXhwcmVzc2lvbnNcIi5cbiAgICpcbiAgICogVGhlIGNvbnZlcnNpb24gbWF5IGJlIGRvbmUgaW4gcGxhY2UsIG1vZGlmeWluZyB0aGUgYXJyYXkgcGFzc2VkIHRvIHRoZSBmdW5jdGlvbiwgc29cbiAgICogZG9uJ3QgYXNzdW1lIHRoYXQgdGhpcyBoYXMgbm8gc2lkZS1lZmZlY3RzLlxuICAgKlxuICAgKiBUaGUgZXhwcmVzc2lvbnMgbXVzdCBiZSBwYXNzZWQgaW4gc2luY2UgaXQgbWlnaHQgYmUgdGhleSBuZWVkIHRvIGJlIHJlb3JkZXJlZCBmb3JcbiAgICogZGlmZmVyZW50IHRyYW5zbGF0aW9ucy5cbiAgICovXG4gIHRyYW5zbGF0ZT86IFRyYW5zbGF0ZUZuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zbGF0ZUZuIHtcbiAgKG1lc3NhZ2VQYXJ0czogVGVtcGxhdGVTdHJpbmdzQXJyYXksXG4gICBleHByZXNzaW9uczogcmVhZG9ubHkgYW55W10pOiBbVGVtcGxhdGVTdHJpbmdzQXJyYXksIHJlYWRvbmx5IGFueVtdXTtcbn1cblxuLyoqXG4gKiBUYWcgYSB0ZW1wbGF0ZSBsaXRlcmFsIHN0cmluZyBmb3IgbG9jYWxpemF0aW9uLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYHRzXG4gKiAkbG9jYWxpemUgYHNvbWUgc3RyaW5nIHRvIGxvY2FsaXplYFxuICogYGBgXG4gKlxuICogKipQcm92aWRpbmcgbWVhbmluZywgZGVzY3JpcHRpb24gYW5kIGlkKipcbiAqXG4gKiBZb3UgY2FuIG9wdGlvbmFsbHkgc3BlY2lmeSBvbmUgb3IgbW9yZSBvZiBgbWVhbmluZ2AsIGBkZXNjcmlwdGlvbmAgYW5kIGBpZGAgZm9yIGEgbG9jYWxpemVkXG4gKiBzdHJpbmcgYnkgcHJlLXBlbmRpbmcgaXQgd2l0aCBhIGNvbG9uIGRlbGltaXRlZCBibG9jayBvZiB0aGUgZm9ybTpcbiAqXG4gKiBgYGB0c1xuICogJGxvY2FsaXplYDptZWFuaW5nfGRlc2NyaXB0aW9uQEBpZDpzb3VyY2UgbWVzc2FnZSB0ZXh0YDtcbiAqXG4gKiAkbG9jYWxpemVgOm1lYW5pbmd8OnNvdXJjZSBtZXNzYWdlIHRleHRgO1xuICogJGxvY2FsaXplYDpkZXNjcmlwdGlvbjpzb3VyY2UgbWVzc2FnZSB0ZXh0YDtcbiAqICRsb2NhbGl6ZWA6QEBpZDpzb3VyY2UgbWVzc2FnZSB0ZXh0YDtcbiAqIGBgYFxuICpcbiAqIFRoaXMgZm9ybWF0IGlzIHRoZSBzYW1lIGFzIHRoYXQgdXNlZCBmb3IgYGkxOG5gIG1hcmtlcnMgaW4gQW5ndWxhciB0ZW1wbGF0ZXMuIFNlZSB0aGVcbiAqIFtBbmd1bGFyIDE4biBndWlkZV0oZ3VpZGUvaTE4biN0ZW1wbGF0ZS10cmFuc2xhdGlvbnMpLlxuICpcbiAqICoqTmFtaW5nIHBsYWNlaG9sZGVycyoqXG4gKlxuICogSWYgdGhlIHRlbXBsYXRlIGxpdGVyYWwgc3RyaW5nIGNvbnRhaW5zIGV4cHJlc3Npb25zLCB0aGVuIHRoZSBleHByZXNzaW9ucyB3aWxsIGJlIGF1dG9tYXRpY2FsbHlcbiAqIGFzc29jaWF0ZWQgd2l0aCBwbGFjZWhvbGRlciBuYW1lcyBmb3IgeW91LlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYHRzXG4gKiAkbG9jYWxpemUgYEhpICR7bmFtZX0hIFRoZXJlIGFyZSAke2l0ZW1zLmxlbmd0aH0gaXRlbXMuYDtcbiAqIGBgYFxuICpcbiAqIHdpbGwgZ2VuZXJhdGUgYSBtZXNzYWdlLXNvdXJjZSBvZiBgSGkgeyRQSH0hIFRoZXJlIGFyZSB7JFBIXzF9IGl0ZW1zYC5cbiAqXG4gKiBUaGUgcmVjb21tZW5kZWQgcHJhY3RpY2UgaXMgdG8gbmFtZSB0aGUgcGxhY2Vob2xkZXIgYXNzb2NpYXRlZCB3aXRoIGVhY2ggZXhwcmVzc2lvbiB0aG91Z2guXG4gKlxuICogRG8gdGhpcyBieSBwcm92aWRpbmcgdGhlIHBsYWNlaG9sZGVyIG5hbWUgd3JhcHBlZCBpbiBgOmAgY2hhcmFjdGVycyBkaXJlY3RseSBhZnRlciB0aGVcbiAqIGV4cHJlc3Npb24uIFRoZXNlIHBsYWNlaG9sZGVyIG5hbWVzIGFyZSBzdHJpcHBlZCBvdXQgb2YgdGhlIHJlbmRlcmVkIGxvY2FsaXplZCBzdHJpbmcuXG4gKlxuICogRm9yIGV4YW1wbGUsIHRvIG5hbWUgdGhlIGBpdGVtcy5sZW5ndGhgIGV4cHJlc3Npb24gcGxhY2Vob2xkZXIgYGl0ZW1Db3VudGAgeW91IHdyaXRlOlxuICpcbiAqIGBgYHRzXG4gKiAkbG9jYWxpemUgYFRoZXJlIGFyZSAke2l0ZW1zLmxlbmd0aH06aXRlbUNvdW50OiBpdGVtc2A7XG4gKiBgYGBcbiAqXG4gKiAqKkVzY2FwaW5nIGNvbG9uIG1hcmtlcnMqKlxuICpcbiAqIElmIHlvdSBuZWVkIHRvIHVzZSBhIGA6YCBjaGFyYWN0ZXIgZGlyZWN0bHkgYXQgdGhlIHN0YXJ0IG9mIGEgdGFnZ2VkIHN0cmluZyB0aGF0IGhhcyBub1xuICogbWV0YWRhdGEgYmxvY2ssIG9yIGRpcmVjdGx5IGFmdGVyIGEgc3Vic3RpdHV0aW9uIGV4cHJlc3Npb24gdGhhdCBoYXMgbm8gbmFtZSB5b3UgbXVzdCBlc2NhcGVcbiAqIHRoZSBgOmAgYnkgcHJlY2VkaW5nIGl0IHdpdGggYSBiYWNrc2xhc2g6XG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogYGBgdHNcbiAqIC8vIG1lc3NhZ2UgaGFzIGEgbWV0YWRhdGEgYmxvY2sgc28gbm8gbmVlZCB0byBlc2NhcGUgY29sb25cbiAqICRsb2NhbGl6ZSBgOnNvbWUgZGVzY3JpcHRpb246OnRoaXMgbWVzc2FnZSBzdGFydHMgd2l0aCBhIGNvbG9uICg6KWA7XG4gKiAvLyBubyBtZXRhZGF0YSBibG9jayBzbyB0aGUgY29sb24gbXVzdCBiZSBlc2NhcGVkXG4gKiAkbG9jYWxpemUgYFxcOnRoaXMgbWVzc2FnZSBzdGFydHMgd2l0aCBhIGNvbG9uICg6KWA7XG4gKiBgYGBcbiAqXG4gKiBgYGB0c1xuICogLy8gbmFtZWQgc3Vic3RpdHV0aW9uIHNvIG5vIG5lZWQgdG8gZXNjYXBlIGNvbG9uXG4gKiAkbG9jYWxpemUgYCR7bGFiZWx9OmxhYmVsOjogJHt9YFxuICogLy8gYW5vbnltb3VzIHN1YnN0aXR1dGlvbiBzbyBjb2xvbiBtdXN0IGJlIGVzY2FwZWRcbiAqICRsb2NhbGl6ZSBgJHtsYWJlbH1cXDogJHt9YFxuICogYGBgXG4gKlxuICogKipQcm9jZXNzaW5nIGxvY2FsaXplZCBzdHJpbmdzOioqXG4gKlxuICogVGhlcmUgYXJlIHRocmVlIHNjZW5hcmlvczpcbiAqXG4gKiAqICoqY29tcGlsZS10aW1lIGlubGluaW5nKio6IHRoZSBgJGxvY2FsaXplYCB0YWcgaXMgdHJhbnNmb3JtZWQgYXQgY29tcGlsZSB0aW1lIGJ5IGFcbiAqIHRyYW5zcGlsZXIsIHJlbW92aW5nIHRoZSB0YWcgYW5kIHJlcGxhY2luZyB0aGUgdGVtcGxhdGUgbGl0ZXJhbCBzdHJpbmcgd2l0aCBhIHRyYW5zbGF0ZWRcbiAqIGxpdGVyYWwgc3RyaW5nIGZyb20gYSBjb2xsZWN0aW9uIG9mIHRyYW5zbGF0aW9ucyBwcm92aWRlZCB0byB0aGUgdHJhbnNwaWxhdGlvbiB0b29sLlxuICpcbiAqICogKipydW4tdGltZSBldmFsdWF0aW9uKio6IHRoZSBgJGxvY2FsaXplYCB0YWcgaXMgYSBydW4tdGltZSBmdW5jdGlvbiB0aGF0IHJlcGxhY2VzIGFuZFxuICogcmVvcmRlcnMgdGhlIHBhcnRzIChzdGF0aWMgc3RyaW5ncyBhbmQgZXhwcmVzc2lvbnMpIG9mIHRoZSB0ZW1wbGF0ZSBsaXRlcmFsIHN0cmluZyB3aXRoIHN0cmluZ3NcbiAqIGZyb20gYSBjb2xsZWN0aW9uIG9mIHRyYW5zbGF0aW9ucyBsb2FkZWQgYXQgcnVuLXRpbWUuXG4gKlxuICogKiAqKnBhc3MtdGhyb3VnaCBldmFsdWF0aW9uKio6IHRoZSBgJGxvY2FsaXplYCB0YWcgaXMgYSBydW4tdGltZSBmdW5jdGlvbiB0aGF0IHNpbXBseSBldmFsdWF0ZXNcbiAqIHRoZSBvcmlnaW5hbCB0ZW1wbGF0ZSBsaXRlcmFsIHN0cmluZyB3aXRob3V0IGFwcGx5aW5nIGFueSB0cmFuc2xhdGlvbnMgdG8gdGhlIHBhcnRzLiBUaGlzXG4gKiB2ZXJzaW9uIGlzIHVzZWQgZHVyaW5nIGRldmVsb3BtZW50IG9yIHdoZXJlIHRoZXJlIGlzIG5vIG5lZWQgdG8gdHJhbnNsYXRlIHRoZSBsb2NhbGl6ZWRcbiAqIHRlbXBsYXRlIGxpdGVyYWxzLlxuICogQHBhcmFtIG1lc3NhZ2VQYXJ0cyBhIGNvbGxlY3Rpb24gb2YgdGhlIHN0YXRpYyBwYXJ0cyBvZiB0aGUgdGVtcGxhdGUgc3RyaW5nLlxuICogQHBhcmFtIGV4cHJlc3Npb25zIGEgY29sbGVjdGlvbiBvZiB0aGUgdmFsdWVzIG9mIGVhY2ggcGxhY2Vob2xkZXIgaW4gdGhlIHRlbXBsYXRlIHN0cmluZy5cbiAqIEByZXR1cm5zIHRoZSB0cmFuc2xhdGVkIHN0cmluZywgd2l0aCB0aGUgYG1lc3NhZ2VQYXJ0c2AgYW5kIGBleHByZXNzaW9uc2AgaW50ZXJsZWF2ZWQgdG9nZXRoZXIuXG4gKi9cbmV4cG9ydCBjb25zdCAkbG9jYWxpemU6IExvY2FsaXplRm4gPSBmdW5jdGlvbihcbiAgICBtZXNzYWdlUGFydHM6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi5leHByZXNzaW9uczogcmVhZG9ubHkgYW55W10pIHtcbiAgaWYgKCRsb2NhbGl6ZS50cmFuc2xhdGUpIHtcbiAgICAvLyBEb24ndCB1c2UgYXJyYXkgZXhwYW5zaW9uIGhlcmUgdG8gYXZvaWQgdGhlIGNvbXBpbGVyIGFkZGluZyBgX19yZWFkKClgIGhlbHBlciB1bm5lY2Vzc2FyaWx5LlxuICAgIGNvbnN0IHRyYW5zbGF0aW9uID0gJGxvY2FsaXplLnRyYW5zbGF0ZShtZXNzYWdlUGFydHMsIGV4cHJlc3Npb25zKTtcbiAgICBtZXNzYWdlUGFydHMgPSB0cmFuc2xhdGlvblswXTtcbiAgICBleHByZXNzaW9ucyA9IHRyYW5zbGF0aW9uWzFdO1xuICB9XG4gIGxldCBtZXNzYWdlID0gc3RyaXBCbG9jayhtZXNzYWdlUGFydHNbMF0sIG1lc3NhZ2VQYXJ0cy5yYXdbMF0pO1xuICBmb3IgKGxldCBpID0gMTsgaSA8IG1lc3NhZ2VQYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIG1lc3NhZ2UgKz0gZXhwcmVzc2lvbnNbaSAtIDFdICsgc3RyaXBCbG9jayhtZXNzYWdlUGFydHNbaV0sIG1lc3NhZ2VQYXJ0cy5yYXdbaV0pO1xuICB9XG4gIHJldHVybiBtZXNzYWdlO1xufTtcblxuY29uc3QgQkxPQ0tfTUFSS0VSID0gJzonO1xuXG4vKipcbiAqIFN0cmlwIGEgZGVsaW1pdGVkIFwiYmxvY2tcIiBmcm9tIHRoZSBzdGFydCBvZiB0aGUgYG1lc3NhZ2VQYXJ0YCwgaWYgaXQgaXMgZm91bmQuXG4gKlxuICogSWYgYSBtYXJrZXIgY2hhcmFjdGVyICg6KSBhY3R1YWxseSBhcHBlYXJzIGluIHRoZSBjb250ZW50IGF0IHRoZSBzdGFydCBvZiBhIHRhZ2dlZCBzdHJpbmcgb3JcbiAqIGFmdGVyIGEgc3Vic3RpdHV0aW9uIGV4cHJlc3Npb24sIHdoZXJlIGEgYmxvY2sgaGFzIG5vdCBiZWVuIHByb3ZpZGVkIHRoZSBjaGFyYWN0ZXIgbXVzdCBiZVxuICogZXNjYXBlZCB3aXRoIGEgYmFja3NsYXNoLCBgXFw6YC4gVGhpcyBmdW5jdGlvbiBjaGVja3MgZm9yIHRoaXMgYnkgbG9va2luZyBhdCB0aGUgYHJhd2BcbiAqIG1lc3NhZ2VQYXJ0LCB3aGljaCBzaG91bGQgc3RpbGwgY29udGFpbiB0aGUgYmFja3NsYXNoLlxuICpcbiAqIElmIHRoZSB0ZW1wbGF0ZSBsaXRlcmFsIHdhcyBzeW50aGVzaXplZCwgcmF0aGVyIHRoYW4gYXBwZWFyaW5nIGluIG9yaWdpbmFsIHNvdXJjZSBjb2RlLCB0aGVuIGl0c1xuICogcmF3IGFycmF5IHdpbGwgb25seSBjb250YWluIGVtcHR5IHN0cmluZ3MuIFRoaXMgaXMgYmVjYXVzZSB0aGUgY3VycmVudCBUeXBlU2NyaXB0IGNvbXBpbGVyIHVzZVxuICogdGhlIG9yaWdpbmFsIHNvdXJjZSBjb2RlIHRvIGZpbmQgdGhlIHJhdyB0ZXh0IGFuZCBpbiB0aGUgY2FzZSBvZiBzeW50aGVzaXplZCBBU1Qgbm9kZXMsIHRoZXJlIGlzXG4gKiBubyBzb3VyY2UgY29kZSB0byBkcmF3IHVwb24uXG4gKlxuICogVGhlIHdvcmthcm91bmQgaW4gdGhpcyBmdW5jdGlvbiBpcyB0byBhc3N1bWUgdGhhdCB0aGUgdGVtcGxhdGUgbGl0ZXJhbCBkaWQgbm90IGNvbnRhaW4gYW4gZXNjYXBlZFxuICogcGxhY2Vob2xkZXIgbmFtZSwgYW5kIGZhbGwgYmFjayBvbiBjaGVja2luZyB0aGUgY29va2VkIGFycmF5IGluc3RlYWQuIFRoaXMgc2hvdWxkIGJlIE9LIGJlY2F1c2VcbiAqIHN5bnRoZXNpemVkIG5vZGVzIChmcm9tIHRoZSBBbmd1bGFyIHRlbXBsYXRlIGNvbXBpbGVyKSB3aWxsIGFsd2F5cyBwcm92aWRlIGV4cGxpY2l0IGRlbGltaXRlZFxuICogYmxvY2tzIGFuZCBzbyB3aWxsIG5ldmVyIG5lZWQgdG8gZXNjYXBlIHBsYWNlaG9sZGVyIG5hbWUgbWFya2Vycy5cbiAqXG4gKiBAcGFyYW0gbWVzc2FnZVBhcnQgVGhlIGNvb2tlZCBtZXNzYWdlIHBhcnQgdG8gcHJvY2Vzcy5cbiAqIEBwYXJhbSByYXdNZXNzYWdlUGFydCBUaGUgcmF3IG1lc3NhZ2UgcGFydCB0byBjaGVjay5cbiAqIEByZXR1cm5zIHRoZSBtZXNzYWdlIHBhcnQgd2l0aCB0aGUgcGxhY2Vob2xkZXIgbmFtZSBzdHJpcHBlZCwgaWYgZm91bmQuXG4gKi9cbmZ1bmN0aW9uIHN0cmlwQmxvY2sobWVzc2FnZVBhcnQ6IHN0cmluZywgcmF3TWVzc2FnZVBhcnQ6IHN0cmluZykge1xuICByZXR1cm4gKHJhd01lc3NhZ2VQYXJ0IHx8IG1lc3NhZ2VQYXJ0KS5jaGFyQXQoMCkgPT09IEJMT0NLX01BUktFUiA/XG4gICAgICBtZXNzYWdlUGFydC5zdWJzdHJpbmcobWVzc2FnZVBhcnQuaW5kZXhPZihCTE9DS19NQVJLRVIsIDEpICsgMSkgOlxuICAgICAgbWVzc2FnZVBhcnQ7XG59XG4iXX0=
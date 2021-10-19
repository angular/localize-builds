/**
 * @license
 * Copyright Google LLC All Rights Reserved.
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
 * [Angular 18n guide](guide/i18n-common-prepare#mark-text-in-component-template).
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
 *
 * @param messageParts a collection of the static parts of the template string.
 * @param expressions a collection of the values of each placeholder in the template string.
 * @returns the translated string, with the `messageParts` and `expressions` interleaved together.
 *
 * @globalApi
 * @publicApi
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
 * @param messagePart The cooked message part to process.
 * @param rawMessagePart The raw message part to check.
 * @returns the message part with the placeholder name stripped, if found.
 * @throws an error if the block is unterminated
 */
function stripBlock(messagePart, rawMessagePart) {
    return rawMessagePart.charAt(0) === BLOCK_MARKER ?
        messagePart.substring(findEndOfBlock(messagePart, rawMessagePart) + 1) :
        messagePart;
}
/**
 * Find the end of a "marked block" indicated by the first non-escaped colon.
 *
 * @param cooked The cooked string (where escaped chars have been processed)
 * @param raw The raw string (where escape sequences are still in place)
 *
 * @returns the index of the end of block marker
 * @throws an error if the block is unterminated
 */
function findEndOfBlock(cooked, raw) {
    /***********************************************************************************************
     * This function is repeated in `src/utils/messages.ts` and the two should be kept in sync.
     * The reason is that this file is marked as having side-effects, and if we import `messages.ts`
     * into it, the whole of `src/utils` will be included in this bundle and none of the functions
     * will be tree shaken.
     ***********************************************************************************************/
    for (let cookedIndex = 1, rawIndex = 1; cookedIndex < cooked.length; cookedIndex++, rawIndex++) {
        if (raw[rawIndex] === '\\') {
            rawIndex++;
        }
        else if (cooked[cookedIndex] === BLOCK_MARKER) {
            return cookedIndex;
        }
    }
    throw new Error(`Unterminated $localize metadata block in "${raw}".`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvbG9jYWxpemUvc3JjL2xvY2FsaXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQXlDSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQThGRztBQUNILE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBZSxVQUNqQyxZQUFrQyxFQUFFLEdBQUcsV0FBMkI7SUFDcEUsSUFBSSxTQUFTLENBQUMsU0FBUyxFQUFFO1FBQ3ZCLCtGQUErRjtRQUMvRixNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNuRSxZQUFZLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLFdBQVcsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDOUI7SUFDRCxJQUFJLE9BQU8sR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUM1QyxPQUFPLElBQUksV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsRjtJQUNELE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUMsQ0FBQztBQUVGLE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQztBQUV6Qjs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxTQUFTLFVBQVUsQ0FBQyxXQUFtQixFQUFFLGNBQXNCO0lBQzdELE9BQU8sY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxZQUFZLENBQUMsQ0FBQztRQUM5QyxXQUFXLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4RSxXQUFXLENBQUM7QUFDbEIsQ0FBQztBQUVEOzs7Ozs7OztHQVFHO0FBQ0gsU0FBUyxjQUFjLENBQUMsTUFBYyxFQUFFLEdBQVc7SUFDakQ7Ozs7O3FHQUtpRztJQUNqRyxLQUFLLElBQUksV0FBVyxHQUFHLENBQUMsRUFBRSxRQUFRLEdBQUcsQ0FBQyxFQUFFLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFO1FBQzlGLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUMxQixRQUFRLEVBQUUsQ0FBQztTQUNaO2FBQU0sSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssWUFBWSxFQUFFO1lBQy9DLE9BQU8sV0FBVyxDQUFDO1NBQ3BCO0tBQ0Y7SUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQ3hFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqIEBub2RvYyAqL1xuZXhwb3J0IGludGVyZmFjZSBMb2NhbGl6ZUZuIHtcbiAgKG1lc3NhZ2VQYXJ0czogVGVtcGxhdGVTdHJpbmdzQXJyYXksIC4uLmV4cHJlc3Npb25zOiByZWFkb25seSBhbnlbXSk6IHN0cmluZztcblxuICAvKipcbiAgICogQSBmdW5jdGlvbiB0aGF0IGNvbnZlcnRzIGFuIGlucHV0IFwibWVzc2FnZSB3aXRoIGV4cHJlc3Npb25zXCIgaW50byBhIHRyYW5zbGF0ZWQgXCJtZXNzYWdlIHdpdGhcbiAgICogZXhwcmVzc2lvbnNcIi5cbiAgICpcbiAgICogVGhlIGNvbnZlcnNpb24gbWF5IGJlIGRvbmUgaW4gcGxhY2UsIG1vZGlmeWluZyB0aGUgYXJyYXkgcGFzc2VkIHRvIHRoZSBmdW5jdGlvbiwgc29cbiAgICogZG9uJ3QgYXNzdW1lIHRoYXQgdGhpcyBoYXMgbm8gc2lkZS1lZmZlY3RzLlxuICAgKlxuICAgKiBUaGUgZXhwcmVzc2lvbnMgbXVzdCBiZSBwYXNzZWQgaW4gc2luY2UgaXQgbWlnaHQgYmUgdGhleSBuZWVkIHRvIGJlIHJlb3JkZXJlZCBmb3JcbiAgICogZGlmZmVyZW50IHRyYW5zbGF0aW9ucy5cbiAgICovXG4gIHRyYW5zbGF0ZT86IFRyYW5zbGF0ZUZuO1xuICAvKipcbiAgICogVGhlIGN1cnJlbnQgbG9jYWxlIG9mIHRoZSB0cmFuc2xhdGVkIG1lc3NhZ2VzLlxuICAgKlxuICAgKiBUaGUgY29tcGlsZS10aW1lIHRyYW5zbGF0aW9uIGlubGluZXIgaXMgYWJsZSB0byByZXBsYWNlIHRoZSBmb2xsb3dpbmcgY29kZTpcbiAgICpcbiAgICogYGBgXG4gICAqIHR5cGVvZiAkbG9jYWxpemUgIT09IFwidW5kZWZpbmVkXCIgJiYgJGxvY2FsaXplLmxvY2FsZVxuICAgKiBgYGBcbiAgICpcbiAgICogd2l0aCBhIHN0cmluZyBsaXRlcmFsIG9mIHRoZSBjdXJyZW50IGxvY2FsZS4gRS5nLlxuICAgKlxuICAgKiBgYGBcbiAgICogXCJmclwiXG4gICAqIGBgYFxuICAgKi9cbiAgbG9jYWxlPzogc3RyaW5nO1xufVxuXG4vKiogQG5vZG9jICovXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zbGF0ZUZuIHtcbiAgKG1lc3NhZ2VQYXJ0czogVGVtcGxhdGVTdHJpbmdzQXJyYXksXG4gICBleHByZXNzaW9uczogcmVhZG9ubHkgYW55W10pOiBbVGVtcGxhdGVTdHJpbmdzQXJyYXksIHJlYWRvbmx5IGFueVtdXTtcbn1cblxuLyoqXG4gKiBUYWcgYSB0ZW1wbGF0ZSBsaXRlcmFsIHN0cmluZyBmb3IgbG9jYWxpemF0aW9uLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYHRzXG4gKiAkbG9jYWxpemUgYHNvbWUgc3RyaW5nIHRvIGxvY2FsaXplYFxuICogYGBgXG4gKlxuICogKipQcm92aWRpbmcgbWVhbmluZywgZGVzY3JpcHRpb24gYW5kIGlkKipcbiAqXG4gKiBZb3UgY2FuIG9wdGlvbmFsbHkgc3BlY2lmeSBvbmUgb3IgbW9yZSBvZiBgbWVhbmluZ2AsIGBkZXNjcmlwdGlvbmAgYW5kIGBpZGAgZm9yIGEgbG9jYWxpemVkXG4gKiBzdHJpbmcgYnkgcHJlLXBlbmRpbmcgaXQgd2l0aCBhIGNvbG9uIGRlbGltaXRlZCBibG9jayBvZiB0aGUgZm9ybTpcbiAqXG4gKiBgYGB0c1xuICogJGxvY2FsaXplYDptZWFuaW5nfGRlc2NyaXB0aW9uQEBpZDpzb3VyY2UgbWVzc2FnZSB0ZXh0YDtcbiAqXG4gKiAkbG9jYWxpemVgOm1lYW5pbmd8OnNvdXJjZSBtZXNzYWdlIHRleHRgO1xuICogJGxvY2FsaXplYDpkZXNjcmlwdGlvbjpzb3VyY2UgbWVzc2FnZSB0ZXh0YDtcbiAqICRsb2NhbGl6ZWA6QEBpZDpzb3VyY2UgbWVzc2FnZSB0ZXh0YDtcbiAqIGBgYFxuICpcbiAqIFRoaXMgZm9ybWF0IGlzIHRoZSBzYW1lIGFzIHRoYXQgdXNlZCBmb3IgYGkxOG5gIG1hcmtlcnMgaW4gQW5ndWxhciB0ZW1wbGF0ZXMuIFNlZSB0aGVcbiAqIFtBbmd1bGFyIDE4biBndWlkZV0oZ3VpZGUvaTE4bi1jb21tb24tcHJlcGFyZSNtYXJrLXRleHQtaW4tY29tcG9uZW50LXRlbXBsYXRlKS5cbiAqXG4gKiAqKk5hbWluZyBwbGFjZWhvbGRlcnMqKlxuICpcbiAqIElmIHRoZSB0ZW1wbGF0ZSBsaXRlcmFsIHN0cmluZyBjb250YWlucyBleHByZXNzaW9ucywgdGhlbiB0aGUgZXhwcmVzc2lvbnMgd2lsbCBiZSBhdXRvbWF0aWNhbGx5XG4gKiBhc3NvY2lhdGVkIHdpdGggcGxhY2Vob2xkZXIgbmFtZXMgZm9yIHlvdS5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogJGxvY2FsaXplIGBIaSAke25hbWV9ISBUaGVyZSBhcmUgJHtpdGVtcy5sZW5ndGh9IGl0ZW1zLmA7XG4gKiBgYGBcbiAqXG4gKiB3aWxsIGdlbmVyYXRlIGEgbWVzc2FnZS1zb3VyY2Ugb2YgYEhpIHskUEh9ISBUaGVyZSBhcmUgeyRQSF8xfSBpdGVtc2AuXG4gKlxuICogVGhlIHJlY29tbWVuZGVkIHByYWN0aWNlIGlzIHRvIG5hbWUgdGhlIHBsYWNlaG9sZGVyIGFzc29jaWF0ZWQgd2l0aCBlYWNoIGV4cHJlc3Npb24gdGhvdWdoLlxuICpcbiAqIERvIHRoaXMgYnkgcHJvdmlkaW5nIHRoZSBwbGFjZWhvbGRlciBuYW1lIHdyYXBwZWQgaW4gYDpgIGNoYXJhY3RlcnMgZGlyZWN0bHkgYWZ0ZXIgdGhlXG4gKiBleHByZXNzaW9uLiBUaGVzZSBwbGFjZWhvbGRlciBuYW1lcyBhcmUgc3RyaXBwZWQgb3V0IG9mIHRoZSByZW5kZXJlZCBsb2NhbGl6ZWQgc3RyaW5nLlxuICpcbiAqIEZvciBleGFtcGxlLCB0byBuYW1lIHRoZSBgaXRlbXMubGVuZ3RoYCBleHByZXNzaW9uIHBsYWNlaG9sZGVyIGBpdGVtQ291bnRgIHlvdSB3cml0ZTpcbiAqXG4gKiBgYGB0c1xuICogJGxvY2FsaXplIGBUaGVyZSBhcmUgJHtpdGVtcy5sZW5ndGh9Oml0ZW1Db3VudDogaXRlbXNgO1xuICogYGBgXG4gKlxuICogKipFc2NhcGluZyBjb2xvbiBtYXJrZXJzKipcbiAqXG4gKiBJZiB5b3UgbmVlZCB0byB1c2UgYSBgOmAgY2hhcmFjdGVyIGRpcmVjdGx5IGF0IHRoZSBzdGFydCBvZiBhIHRhZ2dlZCBzdHJpbmcgdGhhdCBoYXMgbm9cbiAqIG1ldGFkYXRhIGJsb2NrLCBvciBkaXJlY3RseSBhZnRlciBhIHN1YnN0aXR1dGlvbiBleHByZXNzaW9uIHRoYXQgaGFzIG5vIG5hbWUgeW91IG11c3QgZXNjYXBlXG4gKiB0aGUgYDpgIGJ5IHByZWNlZGluZyBpdCB3aXRoIGEgYmFja3NsYXNoOlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYHRzXG4gKiAvLyBtZXNzYWdlIGhhcyBhIG1ldGFkYXRhIGJsb2NrIHNvIG5vIG5lZWQgdG8gZXNjYXBlIGNvbG9uXG4gKiAkbG9jYWxpemUgYDpzb21lIGRlc2NyaXB0aW9uOjp0aGlzIG1lc3NhZ2Ugc3RhcnRzIHdpdGggYSBjb2xvbiAoOilgO1xuICogLy8gbm8gbWV0YWRhdGEgYmxvY2sgc28gdGhlIGNvbG9uIG11c3QgYmUgZXNjYXBlZFxuICogJGxvY2FsaXplIGBcXDp0aGlzIG1lc3NhZ2Ugc3RhcnRzIHdpdGggYSBjb2xvbiAoOilgO1xuICogYGBgXG4gKlxuICogYGBgdHNcbiAqIC8vIG5hbWVkIHN1YnN0aXR1dGlvbiBzbyBubyBuZWVkIHRvIGVzY2FwZSBjb2xvblxuICogJGxvY2FsaXplIGAke2xhYmVsfTpsYWJlbDo6ICR7fWBcbiAqIC8vIGFub255bW91cyBzdWJzdGl0dXRpb24gc28gY29sb24gbXVzdCBiZSBlc2NhcGVkXG4gKiAkbG9jYWxpemUgYCR7bGFiZWx9XFw6ICR7fWBcbiAqIGBgYFxuICpcbiAqICoqUHJvY2Vzc2luZyBsb2NhbGl6ZWQgc3RyaW5nczoqKlxuICpcbiAqIFRoZXJlIGFyZSB0aHJlZSBzY2VuYXJpb3M6XG4gKlxuICogKiAqKmNvbXBpbGUtdGltZSBpbmxpbmluZyoqOiB0aGUgYCRsb2NhbGl6ZWAgdGFnIGlzIHRyYW5zZm9ybWVkIGF0IGNvbXBpbGUgdGltZSBieSBhXG4gKiB0cmFuc3BpbGVyLCByZW1vdmluZyB0aGUgdGFnIGFuZCByZXBsYWNpbmcgdGhlIHRlbXBsYXRlIGxpdGVyYWwgc3RyaW5nIHdpdGggYSB0cmFuc2xhdGVkXG4gKiBsaXRlcmFsIHN0cmluZyBmcm9tIGEgY29sbGVjdGlvbiBvZiB0cmFuc2xhdGlvbnMgcHJvdmlkZWQgdG8gdGhlIHRyYW5zcGlsYXRpb24gdG9vbC5cbiAqXG4gKiAqICoqcnVuLXRpbWUgZXZhbHVhdGlvbioqOiB0aGUgYCRsb2NhbGl6ZWAgdGFnIGlzIGEgcnVuLXRpbWUgZnVuY3Rpb24gdGhhdCByZXBsYWNlcyBhbmRcbiAqIHJlb3JkZXJzIHRoZSBwYXJ0cyAoc3RhdGljIHN0cmluZ3MgYW5kIGV4cHJlc3Npb25zKSBvZiB0aGUgdGVtcGxhdGUgbGl0ZXJhbCBzdHJpbmcgd2l0aCBzdHJpbmdzXG4gKiBmcm9tIGEgY29sbGVjdGlvbiBvZiB0cmFuc2xhdGlvbnMgbG9hZGVkIGF0IHJ1bi10aW1lLlxuICpcbiAqICogKipwYXNzLXRocm91Z2ggZXZhbHVhdGlvbioqOiB0aGUgYCRsb2NhbGl6ZWAgdGFnIGlzIGEgcnVuLXRpbWUgZnVuY3Rpb24gdGhhdCBzaW1wbHkgZXZhbHVhdGVzXG4gKiB0aGUgb3JpZ2luYWwgdGVtcGxhdGUgbGl0ZXJhbCBzdHJpbmcgd2l0aG91dCBhcHBseWluZyBhbnkgdHJhbnNsYXRpb25zIHRvIHRoZSBwYXJ0cy4gVGhpc1xuICogdmVyc2lvbiBpcyB1c2VkIGR1cmluZyBkZXZlbG9wbWVudCBvciB3aGVyZSB0aGVyZSBpcyBubyBuZWVkIHRvIHRyYW5zbGF0ZSB0aGUgbG9jYWxpemVkXG4gKiB0ZW1wbGF0ZSBsaXRlcmFscy5cbiAqXG4gKiBAcGFyYW0gbWVzc2FnZVBhcnRzIGEgY29sbGVjdGlvbiBvZiB0aGUgc3RhdGljIHBhcnRzIG9mIHRoZSB0ZW1wbGF0ZSBzdHJpbmcuXG4gKiBAcGFyYW0gZXhwcmVzc2lvbnMgYSBjb2xsZWN0aW9uIG9mIHRoZSB2YWx1ZXMgb2YgZWFjaCBwbGFjZWhvbGRlciBpbiB0aGUgdGVtcGxhdGUgc3RyaW5nLlxuICogQHJldHVybnMgdGhlIHRyYW5zbGF0ZWQgc3RyaW5nLCB3aXRoIHRoZSBgbWVzc2FnZVBhcnRzYCBhbmQgYGV4cHJlc3Npb25zYCBpbnRlcmxlYXZlZCB0b2dldGhlci5cbiAqXG4gKiBAZ2xvYmFsQXBpXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjb25zdCAkbG9jYWxpemU6IExvY2FsaXplRm4gPSBmdW5jdGlvbihcbiAgICBtZXNzYWdlUGFydHM6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi5leHByZXNzaW9uczogcmVhZG9ubHkgYW55W10pIHtcbiAgaWYgKCRsb2NhbGl6ZS50cmFuc2xhdGUpIHtcbiAgICAvLyBEb24ndCB1c2UgYXJyYXkgZXhwYW5zaW9uIGhlcmUgdG8gYXZvaWQgdGhlIGNvbXBpbGVyIGFkZGluZyBgX19yZWFkKClgIGhlbHBlciB1bm5lY2Vzc2FyaWx5LlxuICAgIGNvbnN0IHRyYW5zbGF0aW9uID0gJGxvY2FsaXplLnRyYW5zbGF0ZShtZXNzYWdlUGFydHMsIGV4cHJlc3Npb25zKTtcbiAgICBtZXNzYWdlUGFydHMgPSB0cmFuc2xhdGlvblswXTtcbiAgICBleHByZXNzaW9ucyA9IHRyYW5zbGF0aW9uWzFdO1xuICB9XG4gIGxldCBtZXNzYWdlID0gc3RyaXBCbG9jayhtZXNzYWdlUGFydHNbMF0sIG1lc3NhZ2VQYXJ0cy5yYXdbMF0pO1xuICBmb3IgKGxldCBpID0gMTsgaSA8IG1lc3NhZ2VQYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIG1lc3NhZ2UgKz0gZXhwcmVzc2lvbnNbaSAtIDFdICsgc3RyaXBCbG9jayhtZXNzYWdlUGFydHNbaV0sIG1lc3NhZ2VQYXJ0cy5yYXdbaV0pO1xuICB9XG4gIHJldHVybiBtZXNzYWdlO1xufTtcblxuY29uc3QgQkxPQ0tfTUFSS0VSID0gJzonO1xuXG4vKipcbiAqIFN0cmlwIGEgZGVsaW1pdGVkIFwiYmxvY2tcIiBmcm9tIHRoZSBzdGFydCBvZiB0aGUgYG1lc3NhZ2VQYXJ0YCwgaWYgaXQgaXMgZm91bmQuXG4gKlxuICogSWYgYSBtYXJrZXIgY2hhcmFjdGVyICg6KSBhY3R1YWxseSBhcHBlYXJzIGluIHRoZSBjb250ZW50IGF0IHRoZSBzdGFydCBvZiBhIHRhZ2dlZCBzdHJpbmcgb3JcbiAqIGFmdGVyIGEgc3Vic3RpdHV0aW9uIGV4cHJlc3Npb24sIHdoZXJlIGEgYmxvY2sgaGFzIG5vdCBiZWVuIHByb3ZpZGVkIHRoZSBjaGFyYWN0ZXIgbXVzdCBiZVxuICogZXNjYXBlZCB3aXRoIGEgYmFja3NsYXNoLCBgXFw6YC4gVGhpcyBmdW5jdGlvbiBjaGVja3MgZm9yIHRoaXMgYnkgbG9va2luZyBhdCB0aGUgYHJhd2BcbiAqIG1lc3NhZ2VQYXJ0LCB3aGljaCBzaG91bGQgc3RpbGwgY29udGFpbiB0aGUgYmFja3NsYXNoLlxuICpcbiAqIEBwYXJhbSBtZXNzYWdlUGFydCBUaGUgY29va2VkIG1lc3NhZ2UgcGFydCB0byBwcm9jZXNzLlxuICogQHBhcmFtIHJhd01lc3NhZ2VQYXJ0IFRoZSByYXcgbWVzc2FnZSBwYXJ0IHRvIGNoZWNrLlxuICogQHJldHVybnMgdGhlIG1lc3NhZ2UgcGFydCB3aXRoIHRoZSBwbGFjZWhvbGRlciBuYW1lIHN0cmlwcGVkLCBpZiBmb3VuZC5cbiAqIEB0aHJvd3MgYW4gZXJyb3IgaWYgdGhlIGJsb2NrIGlzIHVudGVybWluYXRlZFxuICovXG5mdW5jdGlvbiBzdHJpcEJsb2NrKG1lc3NhZ2VQYXJ0OiBzdHJpbmcsIHJhd01lc3NhZ2VQYXJ0OiBzdHJpbmcpIHtcbiAgcmV0dXJuIHJhd01lc3NhZ2VQYXJ0LmNoYXJBdCgwKSA9PT0gQkxPQ0tfTUFSS0VSID9cbiAgICAgIG1lc3NhZ2VQYXJ0LnN1YnN0cmluZyhmaW5kRW5kT2ZCbG9jayhtZXNzYWdlUGFydCwgcmF3TWVzc2FnZVBhcnQpICsgMSkgOlxuICAgICAgbWVzc2FnZVBhcnQ7XG59XG5cbi8qKlxuICogRmluZCB0aGUgZW5kIG9mIGEgXCJtYXJrZWQgYmxvY2tcIiBpbmRpY2F0ZWQgYnkgdGhlIGZpcnN0IG5vbi1lc2NhcGVkIGNvbG9uLlxuICpcbiAqIEBwYXJhbSBjb29rZWQgVGhlIGNvb2tlZCBzdHJpbmcgKHdoZXJlIGVzY2FwZWQgY2hhcnMgaGF2ZSBiZWVuIHByb2Nlc3NlZClcbiAqIEBwYXJhbSByYXcgVGhlIHJhdyBzdHJpbmcgKHdoZXJlIGVzY2FwZSBzZXF1ZW5jZXMgYXJlIHN0aWxsIGluIHBsYWNlKVxuICpcbiAqIEByZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgZW5kIG9mIGJsb2NrIG1hcmtlclxuICogQHRocm93cyBhbiBlcnJvciBpZiB0aGUgYmxvY2sgaXMgdW50ZXJtaW5hdGVkXG4gKi9cbmZ1bmN0aW9uIGZpbmRFbmRPZkJsb2NrKGNvb2tlZDogc3RyaW5nLCByYXc6IHN0cmluZyk6IG51bWJlciB7XG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGlzIHJlcGVhdGVkIGluIGBzcmMvdXRpbHMvbWVzc2FnZXMudHNgIGFuZCB0aGUgdHdvIHNob3VsZCBiZSBrZXB0IGluIHN5bmMuXG4gICAqIFRoZSByZWFzb24gaXMgdGhhdCB0aGlzIGZpbGUgaXMgbWFya2VkIGFzIGhhdmluZyBzaWRlLWVmZmVjdHMsIGFuZCBpZiB3ZSBpbXBvcnQgYG1lc3NhZ2VzLnRzYFxuICAgKiBpbnRvIGl0LCB0aGUgd2hvbGUgb2YgYHNyYy91dGlsc2Agd2lsbCBiZSBpbmNsdWRlZCBpbiB0aGlzIGJ1bmRsZSBhbmQgbm9uZSBvZiB0aGUgZnVuY3Rpb25zXG4gICAqIHdpbGwgYmUgdHJlZSBzaGFrZW4uXG4gICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgZm9yIChsZXQgY29va2VkSW5kZXggPSAxLCByYXdJbmRleCA9IDE7IGNvb2tlZEluZGV4IDwgY29va2VkLmxlbmd0aDsgY29va2VkSW5kZXgrKywgcmF3SW5kZXgrKykge1xuICAgIGlmIChyYXdbcmF3SW5kZXhdID09PSAnXFxcXCcpIHtcbiAgICAgIHJhd0luZGV4Kys7XG4gICAgfSBlbHNlIGlmIChjb29rZWRbY29va2VkSW5kZXhdID09PSBCTE9DS19NQVJLRVIpIHtcbiAgICAgIHJldHVybiBjb29rZWRJbmRleDtcbiAgICB9XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKGBVbnRlcm1pbmF0ZWQgJGxvY2FsaXplIG1ldGFkYXRhIGJsb2NrIGluIFwiJHtyYXd9XCIuYCk7XG59XG4iXX0=
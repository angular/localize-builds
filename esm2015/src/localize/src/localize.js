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
 * ---
 *
 * If the template literal was synthesized and downleveled by TypeScript to ES5 then its
 * raw array will only contain empty strings. This is because the current TypeScript compiler uses
 * the original source code to find the raw text and in the case of synthesized AST nodes, there is
 * no source code to draw upon.
 *
 * The workaround in this function is to assume that the template literal did not contain an escaped
 * placeholder name, and fall back on checking the cooked array instead.
 * This is a limitation if compiling to ES5 in TypeScript but is not a problem if the TypeScript
 * output is ES2015 and the code is downleveled by a separate tool as happens in the Angular CLI.
 *
 * @param messagePart The cooked message part to process.
 * @param rawMessagePart The raw message part to check.
 * @returns the message part with the placeholder name stripped, if found.
 * @throws an error if the block is unterminated
 */
function stripBlock(messagePart, rawMessagePart) {
    rawMessagePart = rawMessagePart || messagePart;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvbG9jYWxpemUvc3JjL2xvY2FsaXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQXVDSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMEZHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFlLFVBQ2pDLFlBQWtDLEVBQUUsR0FBRyxXQUEyQjtJQUNwRSxJQUFJLFNBQVMsQ0FBQyxTQUFTLEVBQUU7UUFDdkIsK0ZBQStGO1FBQy9GLE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ25FLFlBQVksR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsV0FBVyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM5QjtJQUNELElBQUksT0FBTyxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9ELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzVDLE9BQU8sSUFBSSxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2xGO0lBQ0QsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQyxDQUFDO0FBRUYsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDO0FBRXpCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFDSCxTQUFTLFVBQVUsQ0FBQyxXQUFtQixFQUFFLGNBQXNCO0lBQzdELGNBQWMsR0FBRyxjQUFjLElBQUksV0FBVyxDQUFDO0lBQy9DLE9BQU8sY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxZQUFZLENBQUMsQ0FBQztRQUM5QyxXQUFXLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4RSxXQUFXLENBQUM7QUFDbEIsQ0FBQztBQUVEOzs7Ozs7OztHQVFHO0FBQ0gsU0FBUyxjQUFjLENBQUMsTUFBYyxFQUFFLEdBQVc7SUFDakQ7Ozs7O3FHQUtpRztJQUNqRyxLQUFLLElBQUksV0FBVyxHQUFHLENBQUMsRUFBRSxRQUFRLEdBQUcsQ0FBQyxFQUFFLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFO1FBQzlGLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUMxQixRQUFRLEVBQUUsQ0FBQztTQUNaO2FBQU0sSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssWUFBWSxFQUFFO1lBQy9DLE9BQU8sV0FBVyxDQUFDO1NBQ3BCO0tBQ0Y7SUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQ3hFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmV4cG9ydCBpbnRlcmZhY2UgTG9jYWxpemVGbiB7XG4gIChtZXNzYWdlUGFydHM6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi5leHByZXNzaW9uczogcmVhZG9ubHkgYW55W10pOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgZnVuY3Rpb24gdGhhdCBjb252ZXJ0cyBhbiBpbnB1dCBcIm1lc3NhZ2Ugd2l0aCBleHByZXNzaW9uc1wiIGludG8gYSB0cmFuc2xhdGVkIFwibWVzc2FnZSB3aXRoXG4gICAqIGV4cHJlc3Npb25zXCIuXG4gICAqXG4gICAqIFRoZSBjb252ZXJzaW9uIG1heSBiZSBkb25lIGluIHBsYWNlLCBtb2RpZnlpbmcgdGhlIGFycmF5IHBhc3NlZCB0byB0aGUgZnVuY3Rpb24sIHNvXG4gICAqIGRvbid0IGFzc3VtZSB0aGF0IHRoaXMgaGFzIG5vIHNpZGUtZWZmZWN0cy5cbiAgICpcbiAgICogVGhlIGV4cHJlc3Npb25zIG11c3QgYmUgcGFzc2VkIGluIHNpbmNlIGl0IG1pZ2h0IGJlIHRoZXkgbmVlZCB0byBiZSByZW9yZGVyZWQgZm9yXG4gICAqIGRpZmZlcmVudCB0cmFuc2xhdGlvbnMuXG4gICAqL1xuICB0cmFuc2xhdGU/OiBUcmFuc2xhdGVGbjtcbiAgLyoqXG4gICAqIFRoZSBjdXJyZW50IGxvY2FsZSBvZiB0aGUgdHJhbnNsYXRlZCBtZXNzYWdlcy5cbiAgICpcbiAgICogVGhlIGNvbXBpbGUtdGltZSB0cmFuc2xhdGlvbiBpbmxpbmVyIGlzIGFibGUgdG8gcmVwbGFjZSB0aGUgZm9sbG93aW5nIGNvZGU6XG4gICAqXG4gICAqIGBgYFxuICAgKiB0eXBlb2YgJGxvY2FsaXplICE9PSBcInVuZGVmaW5lZFwiICYmICRsb2NhbGl6ZS5sb2NhbGVcbiAgICogYGBgXG4gICAqXG4gICAqIHdpdGggYSBzdHJpbmcgbGl0ZXJhbCBvZiB0aGUgY3VycmVudCBsb2NhbGUuIEUuZy5cbiAgICpcbiAgICogYGBgXG4gICAqIFwiZnJcIlxuICAgKiBgYGBcbiAgICovXG4gIGxvY2FsZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUcmFuc2xhdGVGbiB7XG4gIChtZXNzYWdlUGFydHM6IFRlbXBsYXRlU3RyaW5nc0FycmF5LFxuICAgZXhwcmVzc2lvbnM6IHJlYWRvbmx5IGFueVtdKTogW1RlbXBsYXRlU3RyaW5nc0FycmF5LCByZWFkb25seSBhbnlbXV07XG59XG5cbi8qKlxuICogVGFnIGEgdGVtcGxhdGUgbGl0ZXJhbCBzdHJpbmcgZm9yIGxvY2FsaXphdGlvbi5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogJGxvY2FsaXplIGBzb21lIHN0cmluZyB0byBsb2NhbGl6ZWBcbiAqIGBgYFxuICpcbiAqICoqUHJvdmlkaW5nIG1lYW5pbmcsIGRlc2NyaXB0aW9uIGFuZCBpZCoqXG4gKlxuICogWW91IGNhbiBvcHRpb25hbGx5IHNwZWNpZnkgb25lIG9yIG1vcmUgb2YgYG1lYW5pbmdgLCBgZGVzY3JpcHRpb25gIGFuZCBgaWRgIGZvciBhIGxvY2FsaXplZFxuICogc3RyaW5nIGJ5IHByZS1wZW5kaW5nIGl0IHdpdGggYSBjb2xvbiBkZWxpbWl0ZWQgYmxvY2sgb2YgdGhlIGZvcm06XG4gKlxuICogYGBgdHNcbiAqICRsb2NhbGl6ZWA6bWVhbmluZ3xkZXNjcmlwdGlvbkBAaWQ6c291cmNlIG1lc3NhZ2UgdGV4dGA7XG4gKlxuICogJGxvY2FsaXplYDptZWFuaW5nfDpzb3VyY2UgbWVzc2FnZSB0ZXh0YDtcbiAqICRsb2NhbGl6ZWA6ZGVzY3JpcHRpb246c291cmNlIG1lc3NhZ2UgdGV4dGA7XG4gKiAkbG9jYWxpemVgOkBAaWQ6c291cmNlIG1lc3NhZ2UgdGV4dGA7XG4gKiBgYGBcbiAqXG4gKiBUaGlzIGZvcm1hdCBpcyB0aGUgc2FtZSBhcyB0aGF0IHVzZWQgZm9yIGBpMThuYCBtYXJrZXJzIGluIEFuZ3VsYXIgdGVtcGxhdGVzLiBTZWUgdGhlXG4gKiBbQW5ndWxhciAxOG4gZ3VpZGVdKGd1aWRlL2kxOG4jdGVtcGxhdGUtdHJhbnNsYXRpb25zKS5cbiAqXG4gKiAqKk5hbWluZyBwbGFjZWhvbGRlcnMqKlxuICpcbiAqIElmIHRoZSB0ZW1wbGF0ZSBsaXRlcmFsIHN0cmluZyBjb250YWlucyBleHByZXNzaW9ucywgdGhlbiB0aGUgZXhwcmVzc2lvbnMgd2lsbCBiZSBhdXRvbWF0aWNhbGx5XG4gKiBhc3NvY2lhdGVkIHdpdGggcGxhY2Vob2xkZXIgbmFtZXMgZm9yIHlvdS5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogJGxvY2FsaXplIGBIaSAke25hbWV9ISBUaGVyZSBhcmUgJHtpdGVtcy5sZW5ndGh9IGl0ZW1zLmA7XG4gKiBgYGBcbiAqXG4gKiB3aWxsIGdlbmVyYXRlIGEgbWVzc2FnZS1zb3VyY2Ugb2YgYEhpIHskUEh9ISBUaGVyZSBhcmUgeyRQSF8xfSBpdGVtc2AuXG4gKlxuICogVGhlIHJlY29tbWVuZGVkIHByYWN0aWNlIGlzIHRvIG5hbWUgdGhlIHBsYWNlaG9sZGVyIGFzc29jaWF0ZWQgd2l0aCBlYWNoIGV4cHJlc3Npb24gdGhvdWdoLlxuICpcbiAqIERvIHRoaXMgYnkgcHJvdmlkaW5nIHRoZSBwbGFjZWhvbGRlciBuYW1lIHdyYXBwZWQgaW4gYDpgIGNoYXJhY3RlcnMgZGlyZWN0bHkgYWZ0ZXIgdGhlXG4gKiBleHByZXNzaW9uLiBUaGVzZSBwbGFjZWhvbGRlciBuYW1lcyBhcmUgc3RyaXBwZWQgb3V0IG9mIHRoZSByZW5kZXJlZCBsb2NhbGl6ZWQgc3RyaW5nLlxuICpcbiAqIEZvciBleGFtcGxlLCB0byBuYW1lIHRoZSBgaXRlbXMubGVuZ3RoYCBleHByZXNzaW9uIHBsYWNlaG9sZGVyIGBpdGVtQ291bnRgIHlvdSB3cml0ZTpcbiAqXG4gKiBgYGB0c1xuICogJGxvY2FsaXplIGBUaGVyZSBhcmUgJHtpdGVtcy5sZW5ndGh9Oml0ZW1Db3VudDogaXRlbXNgO1xuICogYGBgXG4gKlxuICogKipFc2NhcGluZyBjb2xvbiBtYXJrZXJzKipcbiAqXG4gKiBJZiB5b3UgbmVlZCB0byB1c2UgYSBgOmAgY2hhcmFjdGVyIGRpcmVjdGx5IGF0IHRoZSBzdGFydCBvZiBhIHRhZ2dlZCBzdHJpbmcgdGhhdCBoYXMgbm9cbiAqIG1ldGFkYXRhIGJsb2NrLCBvciBkaXJlY3RseSBhZnRlciBhIHN1YnN0aXR1dGlvbiBleHByZXNzaW9uIHRoYXQgaGFzIG5vIG5hbWUgeW91IG11c3QgZXNjYXBlXG4gKiB0aGUgYDpgIGJ5IHByZWNlZGluZyBpdCB3aXRoIGEgYmFja3NsYXNoOlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYHRzXG4gKiAvLyBtZXNzYWdlIGhhcyBhIG1ldGFkYXRhIGJsb2NrIHNvIG5vIG5lZWQgdG8gZXNjYXBlIGNvbG9uXG4gKiAkbG9jYWxpemUgYDpzb21lIGRlc2NyaXB0aW9uOjp0aGlzIG1lc3NhZ2Ugc3RhcnRzIHdpdGggYSBjb2xvbiAoOilgO1xuICogLy8gbm8gbWV0YWRhdGEgYmxvY2sgc28gdGhlIGNvbG9uIG11c3QgYmUgZXNjYXBlZFxuICogJGxvY2FsaXplIGBcXDp0aGlzIG1lc3NhZ2Ugc3RhcnRzIHdpdGggYSBjb2xvbiAoOilgO1xuICogYGBgXG4gKlxuICogYGBgdHNcbiAqIC8vIG5hbWVkIHN1YnN0aXR1dGlvbiBzbyBubyBuZWVkIHRvIGVzY2FwZSBjb2xvblxuICogJGxvY2FsaXplIGAke2xhYmVsfTpsYWJlbDo6ICR7fWBcbiAqIC8vIGFub255bW91cyBzdWJzdGl0dXRpb24gc28gY29sb24gbXVzdCBiZSBlc2NhcGVkXG4gKiAkbG9jYWxpemUgYCR7bGFiZWx9XFw6ICR7fWBcbiAqIGBgYFxuICpcbiAqICoqUHJvY2Vzc2luZyBsb2NhbGl6ZWQgc3RyaW5nczoqKlxuICpcbiAqIFRoZXJlIGFyZSB0aHJlZSBzY2VuYXJpb3M6XG4gKlxuICogKiAqKmNvbXBpbGUtdGltZSBpbmxpbmluZyoqOiB0aGUgYCRsb2NhbGl6ZWAgdGFnIGlzIHRyYW5zZm9ybWVkIGF0IGNvbXBpbGUgdGltZSBieSBhXG4gKiB0cmFuc3BpbGVyLCByZW1vdmluZyB0aGUgdGFnIGFuZCByZXBsYWNpbmcgdGhlIHRlbXBsYXRlIGxpdGVyYWwgc3RyaW5nIHdpdGggYSB0cmFuc2xhdGVkXG4gKiBsaXRlcmFsIHN0cmluZyBmcm9tIGEgY29sbGVjdGlvbiBvZiB0cmFuc2xhdGlvbnMgcHJvdmlkZWQgdG8gdGhlIHRyYW5zcGlsYXRpb24gdG9vbC5cbiAqXG4gKiAqICoqcnVuLXRpbWUgZXZhbHVhdGlvbioqOiB0aGUgYCRsb2NhbGl6ZWAgdGFnIGlzIGEgcnVuLXRpbWUgZnVuY3Rpb24gdGhhdCByZXBsYWNlcyBhbmRcbiAqIHJlb3JkZXJzIHRoZSBwYXJ0cyAoc3RhdGljIHN0cmluZ3MgYW5kIGV4cHJlc3Npb25zKSBvZiB0aGUgdGVtcGxhdGUgbGl0ZXJhbCBzdHJpbmcgd2l0aCBzdHJpbmdzXG4gKiBmcm9tIGEgY29sbGVjdGlvbiBvZiB0cmFuc2xhdGlvbnMgbG9hZGVkIGF0IHJ1bi10aW1lLlxuICpcbiAqICogKipwYXNzLXRocm91Z2ggZXZhbHVhdGlvbioqOiB0aGUgYCRsb2NhbGl6ZWAgdGFnIGlzIGEgcnVuLXRpbWUgZnVuY3Rpb24gdGhhdCBzaW1wbHkgZXZhbHVhdGVzXG4gKiB0aGUgb3JpZ2luYWwgdGVtcGxhdGUgbGl0ZXJhbCBzdHJpbmcgd2l0aG91dCBhcHBseWluZyBhbnkgdHJhbnNsYXRpb25zIHRvIHRoZSBwYXJ0cy4gVGhpc1xuICogdmVyc2lvbiBpcyB1c2VkIGR1cmluZyBkZXZlbG9wbWVudCBvciB3aGVyZSB0aGVyZSBpcyBubyBuZWVkIHRvIHRyYW5zbGF0ZSB0aGUgbG9jYWxpemVkXG4gKiB0ZW1wbGF0ZSBsaXRlcmFscy5cbiAqIEBwYXJhbSBtZXNzYWdlUGFydHMgYSBjb2xsZWN0aW9uIG9mIHRoZSBzdGF0aWMgcGFydHMgb2YgdGhlIHRlbXBsYXRlIHN0cmluZy5cbiAqIEBwYXJhbSBleHByZXNzaW9ucyBhIGNvbGxlY3Rpb24gb2YgdGhlIHZhbHVlcyBvZiBlYWNoIHBsYWNlaG9sZGVyIGluIHRoZSB0ZW1wbGF0ZSBzdHJpbmcuXG4gKiBAcmV0dXJucyB0aGUgdHJhbnNsYXRlZCBzdHJpbmcsIHdpdGggdGhlIGBtZXNzYWdlUGFydHNgIGFuZCBgZXhwcmVzc2lvbnNgIGludGVybGVhdmVkIHRvZ2V0aGVyLlxuICovXG5leHBvcnQgY29uc3QgJGxvY2FsaXplOiBMb2NhbGl6ZUZuID0gZnVuY3Rpb24oXG4gICAgbWVzc2FnZVBhcnRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4uZXhwcmVzc2lvbnM6IHJlYWRvbmx5IGFueVtdKSB7XG4gIGlmICgkbG9jYWxpemUudHJhbnNsYXRlKSB7XG4gICAgLy8gRG9uJ3QgdXNlIGFycmF5IGV4cGFuc2lvbiBoZXJlIHRvIGF2b2lkIHRoZSBjb21waWxlciBhZGRpbmcgYF9fcmVhZCgpYCBoZWxwZXIgdW5uZWNlc3NhcmlseS5cbiAgICBjb25zdCB0cmFuc2xhdGlvbiA9ICRsb2NhbGl6ZS50cmFuc2xhdGUobWVzc2FnZVBhcnRzLCBleHByZXNzaW9ucyk7XG4gICAgbWVzc2FnZVBhcnRzID0gdHJhbnNsYXRpb25bMF07XG4gICAgZXhwcmVzc2lvbnMgPSB0cmFuc2xhdGlvblsxXTtcbiAgfVxuICBsZXQgbWVzc2FnZSA9IHN0cmlwQmxvY2sobWVzc2FnZVBhcnRzWzBdLCBtZXNzYWdlUGFydHMucmF3WzBdKTtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBtZXNzYWdlUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBtZXNzYWdlICs9IGV4cHJlc3Npb25zW2kgLSAxXSArIHN0cmlwQmxvY2sobWVzc2FnZVBhcnRzW2ldLCBtZXNzYWdlUGFydHMucmF3W2ldKTtcbiAgfVxuICByZXR1cm4gbWVzc2FnZTtcbn07XG5cbmNvbnN0IEJMT0NLX01BUktFUiA9ICc6JztcblxuLyoqXG4gKiBTdHJpcCBhIGRlbGltaXRlZCBcImJsb2NrXCIgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIGBtZXNzYWdlUGFydGAsIGlmIGl0IGlzIGZvdW5kLlxuICpcbiAqIElmIGEgbWFya2VyIGNoYXJhY3RlciAoOikgYWN0dWFsbHkgYXBwZWFycyBpbiB0aGUgY29udGVudCBhdCB0aGUgc3RhcnQgb2YgYSB0YWdnZWQgc3RyaW5nIG9yXG4gKiBhZnRlciBhIHN1YnN0aXR1dGlvbiBleHByZXNzaW9uLCB3aGVyZSBhIGJsb2NrIGhhcyBub3QgYmVlbiBwcm92aWRlZCB0aGUgY2hhcmFjdGVyIG11c3QgYmVcbiAqIGVzY2FwZWQgd2l0aCBhIGJhY2tzbGFzaCwgYFxcOmAuIFRoaXMgZnVuY3Rpb24gY2hlY2tzIGZvciB0aGlzIGJ5IGxvb2tpbmcgYXQgdGhlIGByYXdgXG4gKiBtZXNzYWdlUGFydCwgd2hpY2ggc2hvdWxkIHN0aWxsIGNvbnRhaW4gdGhlIGJhY2tzbGFzaC5cbiAqXG4gKiAtLS1cbiAqXG4gKiBJZiB0aGUgdGVtcGxhdGUgbGl0ZXJhbCB3YXMgc3ludGhlc2l6ZWQgYW5kIGRvd25sZXZlbGVkIGJ5IFR5cGVTY3JpcHQgdG8gRVM1IHRoZW4gaXRzXG4gKiByYXcgYXJyYXkgd2lsbCBvbmx5IGNvbnRhaW4gZW1wdHkgc3RyaW5ncy4gVGhpcyBpcyBiZWNhdXNlIHRoZSBjdXJyZW50IFR5cGVTY3JpcHQgY29tcGlsZXIgdXNlc1xuICogdGhlIG9yaWdpbmFsIHNvdXJjZSBjb2RlIHRvIGZpbmQgdGhlIHJhdyB0ZXh0IGFuZCBpbiB0aGUgY2FzZSBvZiBzeW50aGVzaXplZCBBU1Qgbm9kZXMsIHRoZXJlIGlzXG4gKiBubyBzb3VyY2UgY29kZSB0byBkcmF3IHVwb24uXG4gKlxuICogVGhlIHdvcmthcm91bmQgaW4gdGhpcyBmdW5jdGlvbiBpcyB0byBhc3N1bWUgdGhhdCB0aGUgdGVtcGxhdGUgbGl0ZXJhbCBkaWQgbm90IGNvbnRhaW4gYW4gZXNjYXBlZFxuICogcGxhY2Vob2xkZXIgbmFtZSwgYW5kIGZhbGwgYmFjayBvbiBjaGVja2luZyB0aGUgY29va2VkIGFycmF5IGluc3RlYWQuXG4gKiBUaGlzIGlzIGEgbGltaXRhdGlvbiBpZiBjb21waWxpbmcgdG8gRVM1IGluIFR5cGVTY3JpcHQgYnV0IGlzIG5vdCBhIHByb2JsZW0gaWYgdGhlIFR5cGVTY3JpcHRcbiAqIG91dHB1dCBpcyBFUzIwMTUgYW5kIHRoZSBjb2RlIGlzIGRvd25sZXZlbGVkIGJ5IGEgc2VwYXJhdGUgdG9vbCBhcyBoYXBwZW5zIGluIHRoZSBBbmd1bGFyIENMSS5cbiAqXG4gKiBAcGFyYW0gbWVzc2FnZVBhcnQgVGhlIGNvb2tlZCBtZXNzYWdlIHBhcnQgdG8gcHJvY2Vzcy5cbiAqIEBwYXJhbSByYXdNZXNzYWdlUGFydCBUaGUgcmF3IG1lc3NhZ2UgcGFydCB0byBjaGVjay5cbiAqIEByZXR1cm5zIHRoZSBtZXNzYWdlIHBhcnQgd2l0aCB0aGUgcGxhY2Vob2xkZXIgbmFtZSBzdHJpcHBlZCwgaWYgZm91bmQuXG4gKiBAdGhyb3dzIGFuIGVycm9yIGlmIHRoZSBibG9jayBpcyB1bnRlcm1pbmF0ZWRcbiAqL1xuZnVuY3Rpb24gc3RyaXBCbG9jayhtZXNzYWdlUGFydDogc3RyaW5nLCByYXdNZXNzYWdlUGFydDogc3RyaW5nKSB7XG4gIHJhd01lc3NhZ2VQYXJ0ID0gcmF3TWVzc2FnZVBhcnQgfHwgbWVzc2FnZVBhcnQ7XG4gIHJldHVybiByYXdNZXNzYWdlUGFydC5jaGFyQXQoMCkgPT09IEJMT0NLX01BUktFUiA/XG4gICAgICBtZXNzYWdlUGFydC5zdWJzdHJpbmcoZmluZEVuZE9mQmxvY2sobWVzc2FnZVBhcnQsIHJhd01lc3NhZ2VQYXJ0KSArIDEpIDpcbiAgICAgIG1lc3NhZ2VQYXJ0O1xufVxuXG4vKipcbiAqIEZpbmQgdGhlIGVuZCBvZiBhIFwibWFya2VkIGJsb2NrXCIgaW5kaWNhdGVkIGJ5IHRoZSBmaXJzdCBub24tZXNjYXBlZCBjb2xvbi5cbiAqXG4gKiBAcGFyYW0gY29va2VkIFRoZSBjb29rZWQgc3RyaW5nICh3aGVyZSBlc2NhcGVkIGNoYXJzIGhhdmUgYmVlbiBwcm9jZXNzZWQpXG4gKiBAcGFyYW0gcmF3IFRoZSByYXcgc3RyaW5nICh3aGVyZSBlc2NhcGUgc2VxdWVuY2VzIGFyZSBzdGlsbCBpbiBwbGFjZSlcbiAqXG4gKiBAcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGVuZCBvZiBibG9jayBtYXJrZXJcbiAqIEB0aHJvd3MgYW4gZXJyb3IgaWYgdGhlIGJsb2NrIGlzIHVudGVybWluYXRlZFxuICovXG5mdW5jdGlvbiBmaW5kRW5kT2ZCbG9jayhjb29rZWQ6IHN0cmluZywgcmF3OiBzdHJpbmcpOiBudW1iZXIge1xuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICogVGhpcyBmdW5jdGlvbiBpcyByZXBlYXRlZCBpbiBgc3JjL3V0aWxzL21lc3NhZ2VzLnRzYCBhbmQgdGhlIHR3byBzaG91bGQgYmUga2VwdCBpbiBzeW5jLlxuICAgKiBUaGUgcmVhc29uIGlzIHRoYXQgdGhpcyBmaWxlIGlzIG1hcmtlZCBhcyBoYXZpbmcgc2lkZS1lZmZlY3RzLCBhbmQgaWYgd2UgaW1wb3J0IGBtZXNzYWdlcy50c2BcbiAgICogaW50byBpdCwgdGhlIHdob2xlIG9mIGBzcmMvdXRpbHNgIHdpbGwgYmUgaW5jbHVkZWQgaW4gdGhpcyBidW5kbGUgYW5kIG5vbmUgb2YgdGhlIGZ1bmN0aW9uc1xuICAgKiB3aWxsIGJlIHRyZWUgc2hha2VuLlxuICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gIGZvciAobGV0IGNvb2tlZEluZGV4ID0gMSwgcmF3SW5kZXggPSAxOyBjb29rZWRJbmRleCA8IGNvb2tlZC5sZW5ndGg7IGNvb2tlZEluZGV4KyssIHJhd0luZGV4KyspIHtcbiAgICBpZiAocmF3W3Jhd0luZGV4XSA9PT0gJ1xcXFwnKSB7XG4gICAgICByYXdJbmRleCsrO1xuICAgIH0gZWxzZSBpZiAoY29va2VkW2Nvb2tlZEluZGV4XSA9PT0gQkxPQ0tfTUFSS0VSKSB7XG4gICAgICByZXR1cm4gY29va2VkSW5kZXg7XG4gICAgfVxuICB9XG4gIHRocm93IG5ldyBFcnJvcihgVW50ZXJtaW5hdGVkICRsb2NhbGl6ZSBtZXRhZGF0YSBibG9jayBpbiBcIiR7cmF3fVwiLmApO1xufSJdfQ==
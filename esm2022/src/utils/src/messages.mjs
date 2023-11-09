/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// This module specifier is intentionally a relative path to allow bundling the code directly
// into the package.
// @ng_package: ignore-cross-repo-import
import { computeMsgId } from '../../../../compiler/src/i18n/digest';
import { BLOCK_MARKER, ID_SEPARATOR, LEGACY_ID_INDICATOR, MEANING_SEPARATOR } from './constants';
/**
 * Re-export this helper function so that users of `@angular/localize` don't need to actively import
 * from `@angular/compiler`.
 */
export { computeMsgId };
/**
 * Parse a `$localize` tagged string into a structure that can be used for translation or
 * extraction.
 *
 * See `ParsedMessage` for an example.
 */
export function parseMessage(messageParts, expressions, location, messagePartLocations, expressionLocations = []) {
    const substitutions = {};
    const substitutionLocations = {};
    const associatedMessageIds = {};
    const metadata = parseMetadata(messageParts[0], messageParts.raw[0]);
    const cleanedMessageParts = [metadata.text];
    const placeholderNames = [];
    let messageString = metadata.text;
    for (let i = 1; i < messageParts.length; i++) {
        const { messagePart, placeholderName = computePlaceholderName(i), associatedMessageId } = parsePlaceholder(messageParts[i], messageParts.raw[i]);
        messageString += `{$${placeholderName}}${messagePart}`;
        if (expressions !== undefined) {
            substitutions[placeholderName] = expressions[i - 1];
            substitutionLocations[placeholderName] = expressionLocations[i - 1];
        }
        placeholderNames.push(placeholderName);
        if (associatedMessageId !== undefined) {
            associatedMessageIds[placeholderName] = associatedMessageId;
        }
        cleanedMessageParts.push(messagePart);
    }
    const messageId = metadata.customId || computeMsgId(messageString, metadata.meaning || '');
    const legacyIds = metadata.legacyIds ? metadata.legacyIds.filter(id => id !== messageId) : [];
    return {
        id: messageId,
        legacyIds,
        substitutions,
        substitutionLocations,
        text: messageString,
        customId: metadata.customId,
        meaning: metadata.meaning || '',
        description: metadata.description || '',
        messageParts: cleanedMessageParts,
        messagePartLocations,
        placeholderNames,
        associatedMessageIds,
        location,
    };
}
/**
 * Parse the given message part (`cooked` + `raw`) to extract the message metadata from the text.
 *
 * If the message part has a metadata block this function will extract the `meaning`,
 * `description`, `customId` and `legacyId` (if provided) from the block. These metadata properties
 * are serialized in the string delimited by `|`, `@@` and `␟` respectively.
 *
 * (Note that `␟` is the `LEGACY_ID_INDICATOR` - see `constants.ts`.)
 *
 * For example:
 *
 * ```ts
 * `:meaning|description@@custom-id:`
 * `:meaning|@@custom-id:`
 * `:meaning|description:`
 * `:description@@custom-id:`
 * `:meaning|:`
 * `:description:`
 * `:@@custom-id:`
 * `:meaning|description@@custom-id␟legacy-id-1␟legacy-id-2:`
 * ```
 *
 * @param cooked The cooked version of the message part to parse.
 * @param raw The raw version of the message part to parse.
 * @returns A object containing any metadata that was parsed from the message part.
 */
export function parseMetadata(cooked, raw) {
    const { text: messageString, block } = splitBlock(cooked, raw);
    if (block === undefined) {
        return { text: messageString };
    }
    else {
        const [meaningDescAndId, ...legacyIds] = block.split(LEGACY_ID_INDICATOR);
        const [meaningAndDesc, customId] = meaningDescAndId.split(ID_SEPARATOR, 2);
        let [meaning, description] = meaningAndDesc.split(MEANING_SEPARATOR, 2);
        if (description === undefined) {
            description = meaning;
            meaning = undefined;
        }
        if (description === '') {
            description = undefined;
        }
        return { text: messageString, meaning, description, customId, legacyIds };
    }
}
/**
 * Parse the given message part (`cooked` + `raw`) to extract any placeholder metadata from the
 * text.
 *
 * If the message part has a metadata block this function will extract the `placeholderName` and
 * `associatedMessageId` (if provided) from the block.
 *
 * These metadata properties are serialized in the string delimited by `@@`.
 *
 * For example:
 *
 * ```ts
 * `:placeholder-name@@associated-id:`
 * ```
 *
 * @param cooked The cooked version of the message part to parse.
 * @param raw The raw version of the message part to parse.
 * @returns A object containing the metadata (`placeholderName` and `associatedMessageId`) of the
 *     preceding placeholder, along with the static text that follows.
 */
export function parsePlaceholder(cooked, raw) {
    const { text: messagePart, block } = splitBlock(cooked, raw);
    if (block === undefined) {
        return { messagePart };
    }
    else {
        const [placeholderName, associatedMessageId] = block.split(ID_SEPARATOR);
        return { messagePart, placeholderName, associatedMessageId };
    }
}
/**
 * Split a message part (`cooked` + `raw`) into an optional delimited "block" off the front and the
 * rest of the text of the message part.
 *
 * Blocks appear at the start of message parts. They are delimited by a colon `:` character at the
 * start and end of the block.
 *
 * If the block is in the first message part then it will be metadata about the whole message:
 * meaning, description, id.  Otherwise it will be metadata about the immediately preceding
 * substitution: placeholder name.
 *
 * Since blocks are optional, it is possible that the content of a message block actually starts
 * with a block marker. In this case the marker must be escaped `\:`.
 *
 * @param cooked The cooked version of the message part to parse.
 * @param raw The raw version of the message part to parse.
 * @returns An object containing the `text` of the message part and the text of the `block`, if it
 * exists.
 * @throws an error if the `block` is unterminated
 */
export function splitBlock(cooked, raw) {
    if (raw.charAt(0) !== BLOCK_MARKER) {
        return { text: cooked };
    }
    else {
        const endOfBlock = findEndOfBlock(cooked, raw);
        return {
            block: cooked.substring(1, endOfBlock),
            text: cooked.substring(endOfBlock + 1),
        };
    }
}
function computePlaceholderName(index) {
    return index === 1 ? 'PH' : `PH_${index - 1}`;
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
export function findEndOfBlock(cooked, raw) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdXRpbHMvc3JjL21lc3NhZ2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILDZGQUE2RjtBQUM3RixvQkFBb0I7QUFDcEIsd0NBQXdDO0FBQ3hDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUVsRSxPQUFPLEVBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxtQkFBbUIsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUvRjs7O0dBR0c7QUFDSCxPQUFPLEVBQUMsWUFBWSxFQUFDLENBQUM7QUFrSnRCOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FDeEIsWUFBa0MsRUFBRSxXQUE0QixFQUFFLFFBQXlCLEVBQzNGLG9CQUFtRCxFQUNuRCxzQkFBb0QsRUFBRTtJQUN4RCxNQUFNLGFBQWEsR0FBcUMsRUFBRSxDQUFDO0lBQzNELE1BQU0scUJBQXFCLEdBQTBELEVBQUUsQ0FBQztJQUN4RixNQUFNLG9CQUFvQixHQUEyQyxFQUFFLENBQUM7SUFDeEUsTUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckUsTUFBTSxtQkFBbUIsR0FBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0RCxNQUFNLGdCQUFnQixHQUFhLEVBQUUsQ0FBQztJQUN0QyxJQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ2xDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDN0MsTUFBTSxFQUFDLFdBQVcs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O0lBQzNDLE9BQU8sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUNoRCxDQUFDO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLFVBQVUsY0FBYyxDQUFDLE1BQWMsRUFBRSxHQUFXO0lBQ3hELEtBQUssSUFBSSxXQUFXLEdBQUcsQ0FBQyxFQUFFLFFBQVEsR0FBRyxDQUFDLEVBQUUsV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQztRQUMvRixJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUMzQixRQUFRLEVBQUUsQ0FBQztRQUNiLENBQUM7YUFBTSxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxZQUFZLEVBQUUsQ0FBQztZQUNoRCxPQUFPLFdBQVcsQ0FBQztRQUNyQixDQUFDO0lBQ0gsQ0FBQztJQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsNkNBQTZDLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDeEUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuLy8gVGhpcyBtb2R1bGUgc3BlY2lmaWVyIGlzIGludGVudGlvbmFsbHkgYSByZWxhdGl2ZSBwYXRoIHRvIGFsbG93IGJ1bmRsaW5nIHRoZSBjb2RlIGRpcmVjdGx5XG4vLyBpbnRvIHRoZSBwYWNrYWdlLlxuLy8gQG5nX3BhY2thZ2U6IGlnbm9yZS1jcm9zcy1yZXBvLWltcG9ydFxuaW1wb3J0IHtjb21wdXRlTXNnSWR9IGZyb20gJy4uLy4uLy4uLy4uL2NvbXBpbGVyL3NyYy9pMThuL2RpZ2VzdCc7XG5cbmltcG9ydCB7QkxPQ0tfTUFSS0VSLCBJRF9TRVBBUkFUT1IsIExFR0FDWV9JRF9JTkRJQ0FUT1IsIE1FQU5JTkdfU0VQQVJBVE9SfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbi8qKlxuICogUmUtZXhwb3J0IHRoaXMgaGVscGVyIGZ1bmN0aW9uIHNvIHRoYXQgdXNlcnMgb2YgYEBhbmd1bGFyL2xvY2FsaXplYCBkb24ndCBuZWVkIHRvIGFjdGl2ZWx5IGltcG9ydFxuICogZnJvbSBgQGFuZ3VsYXIvY29tcGlsZXJgLlxuICovXG5leHBvcnQge2NvbXB1dGVNc2dJZH07XG5cbi8qKlxuICogQSBzdHJpbmcgY29udGFpbmluZyBhIHRyYW5zbGF0aW9uIHNvdXJjZSBtZXNzYWdlLlxuICpcbiAqIEkuRS4gdGhlIG1lc3NhZ2UgdGhhdCBpbmRpY2F0ZXMgd2hhdCB3aWxsIGJlIHRyYW5zbGF0ZWQgZnJvbS5cbiAqXG4gKiBVc2VzIGB7JHBsYWNlaG9sZGVyLW5hbWV9YCB0byBpbmRpY2F0ZSBhIHBsYWNlaG9sZGVyLlxuICovXG5leHBvcnQgdHlwZSBTb3VyY2VNZXNzYWdlID0gc3RyaW5nO1xuXG4vKipcbiAqIEEgc3RyaW5nIGNvbnRhaW5pbmcgYSB0cmFuc2xhdGlvbiB0YXJnZXQgbWVzc2FnZS5cbiAqXG4gKiBJLkUuIHRoZSBtZXNzYWdlIHRoYXQgaW5kaWNhdGVzIHdoYXQgd2lsbCBiZSB0cmFuc2xhdGVkIHRvLlxuICpcbiAqIFVzZXMgYHskcGxhY2Vob2xkZXItbmFtZX1gIHRvIGluZGljYXRlIGEgcGxhY2Vob2xkZXIuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgdHlwZSBUYXJnZXRNZXNzYWdlID0gc3RyaW5nO1xuXG4vKipcbiAqIEEgc3RyaW5nIHRoYXQgdW5pcXVlbHkgaWRlbnRpZmllcyBhIG1lc3NhZ2UsIHRvIGJlIHVzZWQgZm9yIG1hdGNoaW5nIHRyYW5zbGF0aW9ucy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCB0eXBlIE1lc3NhZ2VJZCA9IHN0cmluZztcblxuLyoqXG4gKiBEZWNsYXJlcyBhIGNvcHkgb2YgdGhlIGBBYnNvbHV0ZUZzUGF0aGAgYnJhbmRlZCB0eXBlIGluIGBAYW5ndWxhci9jb21waWxlci1jbGlgIHRvIGF2b2lkIGFuXG4gKiBpbXBvcnQgaW50byBgQGFuZ3VsYXIvY29tcGlsZXItY2xpYC4gVGhlIGNvbXBpbGVyLWNsaSdzIGRlY2xhcmF0aW9uIGZpbGVzIGFyZSBub3QgbmVjZXNzYXJpbHlcbiAqIGNvbXBhdGlibGUgd2l0aCB3ZWIgZW52aXJvbm1lbnRzIHRoYXQgdXNlIGBAYW5ndWxhci9sb2NhbGl6ZWAsIGFuZCB3b3VsZCBpbmFkdmVydGVudGx5IGluY2x1ZGVcbiAqIGB0eXBlc2NyaXB0YCBkZWNsYXJhdGlvbiBmaWxlcyBpbiBhbnkgY29tcGlsYXRpb24gdW5pdCB0aGF0IHVzZXMgYEBhbmd1bGFyL2xvY2FsaXplYCAod2hpY2hcbiAqIGluY3JlYXNlcyBwYXJzaW5nIHRpbWUgYW5kIG1lbW9yeSB1c2FnZSBkdXJpbmcgYnVpbGRzKSB1c2luZyBhIGRlZmF1bHQgaW1wb3J0IHRoYXQgb25seVxuICogdHlwZS1jaGVja3Mgd2hlbiBgYWxsb3dTeW50aGV0aWNEZWZhdWx0SW1wb3J0c2AgaXMgZW5hYmxlZC5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzQ1MTc5XG4gKi9cbnR5cGUgQWJzb2x1dGVGc1BhdGhMb2NhbGl6ZUNvcHkgPSBzdHJpbmcme19icmFuZDogJ0Fic29sdXRlRnNQYXRoJ307XG5cbi8qKlxuICogVGhlIGxvY2F0aW9uIG9mIHRoZSBtZXNzYWdlIGluIHRoZSBzb3VyY2UgZmlsZS5cbiAqXG4gKiBUaGUgYGxpbmVgIGFuZCBgY29sdW1uYCB2YWx1ZXMgZm9yIHRoZSBgc3RhcnRgIGFuZCBgZW5kYCBwcm9wZXJ0aWVzIGFyZSB6ZXJvLWJhc2VkLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNvdXJjZUxvY2F0aW9uIHtcbiAgc3RhcnQ6IHtsaW5lOiBudW1iZXIsIGNvbHVtbjogbnVtYmVyfTtcbiAgZW5kOiB7bGluZTogbnVtYmVyLCBjb2x1bW46IG51bWJlcn07XG4gIGZpbGU6IEFic29sdXRlRnNQYXRoTG9jYWxpemVDb3B5O1xuICB0ZXh0Pzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEFkZGl0aW9uYWwgaW5mb3JtYXRpb24gdGhhdCBjYW4gYmUgYXNzb2NpYXRlZCB3aXRoIGEgbWVzc2FnZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNZXNzYWdlTWV0YWRhdGEge1xuICAvKipcbiAgICogQSBodW1hbiByZWFkYWJsZSByZW5kZXJpbmcgb2YgdGhlIG1lc3NhZ2VcbiAgICovXG4gIHRleHQ6IHN0cmluZztcbiAgLyoqXG4gICAqIExlZ2FjeSBtZXNzYWdlIGlkcywgaWYgcHJvdmlkZWQuXG4gICAqXG4gICAqIEluIGxlZ2FjeSBtZXNzYWdlIGZvcm1hdHMgdGhlIG1lc3NhZ2UgaWQgY2FuIG9ubHkgYmUgY29tcHV0ZWQgZGlyZWN0bHkgZnJvbSB0aGUgb3JpZ2luYWxcbiAgICogdGVtcGxhdGUgc291cmNlLlxuICAgKlxuICAgKiBTaW5jZSB0aGlzIGluZm9ybWF0aW9uIGlzIG5vdCBhdmFpbGFibGUgaW4gYCRsb2NhbGl6ZWAgY2FsbHMsIHRoZSBsZWdhY3kgbWVzc2FnZSBpZHMgbWF5IGJlXG4gICAqIGF0dGFjaGVkIGJ5IHRoZSBjb21waWxlciB0byB0aGUgYCRsb2NhbGl6ZWAgbWV0YWJsb2NrIHNvIGl0IGNhbiBiZSB1c2VkIGlmIG5lZWRlZCBhdCB0aGUgcG9pbnRcbiAgICogb2YgdHJhbnNsYXRpb24gaWYgdGhlIHRyYW5zbGF0aW9ucyBhcmUgZW5jb2RlZCB1c2luZyB0aGUgbGVnYWN5IG1lc3NhZ2UgaWQuXG4gICAqL1xuICBsZWdhY3lJZHM/OiBzdHJpbmdbXTtcbiAgLyoqXG4gICAqIFRoZSBpZCBvZiB0aGUgYG1lc3NhZ2VgIGlmIGEgY3VzdG9tIG9uZSB3YXMgc3BlY2lmaWVkIGV4cGxpY2l0bHkuXG4gICAqXG4gICAqIFRoaXMgaWQgb3ZlcnJpZGVzIGFueSBjb21wdXRlZCBvciBsZWdhY3kgaWRzLlxuICAgKi9cbiAgY3VzdG9tSWQ/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgbWVhbmluZyBvZiB0aGUgYG1lc3NhZ2VgLCB1c2VkIHRvIGRpc3Rpbmd1aXNoIGlkZW50aWNhbCBgbWVzc2FnZVN0cmluZ2BzLlxuICAgKi9cbiAgbWVhbmluZz86IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgYG1lc3NhZ2VgLCB1c2VkIHRvIGFpZCB0cmFuc2xhdGlvbi5cbiAgICovXG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIGxvY2F0aW9uIG9mIHRoZSBtZXNzYWdlIGluIHRoZSBzb3VyY2UuXG4gICAqL1xuICBsb2NhdGlvbj86IFNvdXJjZUxvY2F0aW9uO1xufVxuXG4vKipcbiAqIEluZm9ybWF0aW9uIHBhcnNlZCBmcm9tIGEgYCRsb2NhbGl6ZWAgdGFnZ2VkIHN0cmluZyB0aGF0IGlzIHVzZWQgdG8gdHJhbnNsYXRlIGl0LlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYFxuICogY29uc3QgbmFtZSA9ICdKbyBCbG9nZ3MnO1xuICogJGxvY2FsaXplYEhlbGxvICR7bmFtZX06dGl0bGVAQElEOiFgO1xuICogYGBgXG4gKlxuICogTWF5IGJlIHBhcnNlZCBpbnRvOlxuICpcbiAqIGBgYFxuICoge1xuICogICBpZDogJzY5OTgxOTQ1MDc1OTc3MzA1OTEnLFxuICogICBzdWJzdGl0dXRpb25zOiB7IHRpdGxlOiAnSm8gQmxvZ2dzJyB9LFxuICogICBtZXNzYWdlU3RyaW5nOiAnSGVsbG8geyR0aXRsZX0hJyxcbiAqICAgcGxhY2Vob2xkZXJOYW1lczogWyd0aXRsZSddLFxuICogICBhc3NvY2lhdGVkTWVzc2FnZUlkczogeyB0aXRsZTogJ0lEJyB9LFxuICogfVxuICogYGBgXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUGFyc2VkTWVzc2FnZSBleHRlbmRzIE1lc3NhZ2VNZXRhZGF0YSB7XG4gIC8qKlxuICAgKiBUaGUga2V5IHVzZWQgdG8gbG9vayB1cCB0aGUgYXBwcm9wcmlhdGUgdHJhbnNsYXRpb24gdGFyZ2V0LlxuICAgKi9cbiAgaWQ6IE1lc3NhZ2VJZDtcbiAgLyoqXG4gICAqIEEgbWFwcGluZyBvZiBwbGFjZWhvbGRlciBuYW1lcyB0byBzdWJzdGl0dXRpb24gdmFsdWVzLlxuICAgKi9cbiAgc3Vic3RpdHV0aW9uczogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgLyoqXG4gICAqIEFuIG9wdGlvbmFsIG1hcHBpbmcgb2YgcGxhY2Vob2xkZXIgbmFtZXMgdG8gYXNzb2NpYXRlZCBNZXNzYWdlSWRzLlxuICAgKiBUaGlzIGNhbiBiZSB1c2VkIHRvIG1hdGNoIElDVSBwbGFjZWhvbGRlcnMgdG8gdGhlIG1lc3NhZ2UgdGhhdCBjb250YWlucyB0aGUgSUNVLlxuICAgKi9cbiAgYXNzb2NpYXRlZE1lc3NhZ2VJZHM/OiBSZWNvcmQ8c3RyaW5nLCBNZXNzYWdlSWQ+O1xuICAvKipcbiAgICogQW4gb3B0aW9uYWwgbWFwcGluZyBvZiBwbGFjZWhvbGRlciBuYW1lcyB0byBzb3VyY2UgbG9jYXRpb25zXG4gICAqL1xuICBzdWJzdGl0dXRpb25Mb2NhdGlvbnM/OiBSZWNvcmQ8c3RyaW5nLCBTb3VyY2VMb2NhdGlvbnx1bmRlZmluZWQ+O1xuICAvKipcbiAgICogVGhlIHN0YXRpYyBwYXJ0cyBvZiB0aGUgbWVzc2FnZS5cbiAgICovXG4gIG1lc3NhZ2VQYXJ0czogc3RyaW5nW107XG4gIC8qKlxuICAgKiBBbiBvcHRpb25hbCBtYXBwaW5nIG9mIG1lc3NhZ2UgcGFydHMgdG8gc291cmNlIGxvY2F0aW9uc1xuICAgKi9cbiAgbWVzc2FnZVBhcnRMb2NhdGlvbnM/OiAoU291cmNlTG9jYXRpb258dW5kZWZpbmVkKVtdO1xuICAvKipcbiAgICogVGhlIG5hbWVzIG9mIHRoZSBwbGFjZWhvbGRlcnMgdGhhdCB3aWxsIGJlIHJlcGxhY2VkIHdpdGggc3Vic3RpdHV0aW9ucy5cbiAgICovXG4gIHBsYWNlaG9sZGVyTmFtZXM6IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIFBhcnNlIGEgYCRsb2NhbGl6ZWAgdGFnZ2VkIHN0cmluZyBpbnRvIGEgc3RydWN0dXJlIHRoYXQgY2FuIGJlIHVzZWQgZm9yIHRyYW5zbGF0aW9uIG9yXG4gKiBleHRyYWN0aW9uLlxuICpcbiAqIFNlZSBgUGFyc2VkTWVzc2FnZWAgZm9yIGFuIGV4YW1wbGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZU1lc3NhZ2UoXG4gICAgbWVzc2FnZVBhcnRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgZXhwcmVzc2lvbnM/OiByZWFkb25seSBhbnlbXSwgbG9jYXRpb24/OiBTb3VyY2VMb2NhdGlvbixcbiAgICBtZXNzYWdlUGFydExvY2F0aW9ucz86IChTb3VyY2VMb2NhdGlvbnx1bmRlZmluZWQpW10sXG4gICAgZXhwcmVzc2lvbkxvY2F0aW9uczogKFNvdXJjZUxvY2F0aW9ufHVuZGVmaW5lZClbXSA9IFtdKTogUGFyc2VkTWVzc2FnZSB7XG4gIGNvbnN0IHN1YnN0aXR1dGlvbnM6IHtbcGxhY2Vob2xkZXJOYW1lOiBzdHJpbmddOiBhbnl9ID0ge307XG4gIGNvbnN0IHN1YnN0aXR1dGlvbkxvY2F0aW9uczoge1twbGFjZWhvbGRlck5hbWU6IHN0cmluZ106IFNvdXJjZUxvY2F0aW9ufHVuZGVmaW5lZH0gPSB7fTtcbiAgY29uc3QgYXNzb2NpYXRlZE1lc3NhZ2VJZHM6IHtbcGxhY2Vob2xkZXJOYW1lOiBzdHJpbmddOiBNZXNzYWdlSWR9ID0ge307XG4gIGNvbnN0IG1ldGFkYXRhID0gcGFyc2VNZXRhZGF0YShtZXNzYWdlUGFydHNbMF0sIG1lc3NhZ2VQYXJ0cy5yYXdbMF0pO1xuICBjb25zdCBjbGVhbmVkTWVzc2FnZVBhcnRzOiBzdHJpbmdbXSA9IFttZXRhZGF0YS50ZXh0XTtcbiAgY29uc3QgcGxhY2Vob2xkZXJOYW1lczogc3RyaW5nW10gPSBbXTtcbiAgbGV0IG1lc3NhZ2VTdHJpbmcgPSBtZXRhZGF0YS50ZXh0O1xuICBmb3IgKGxldCBpID0gMTsgaSA8IG1lc3NhZ2VQYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHttZXNzYWdlUGFydCwgcGxhY2Vob2xkZXJOYW1lID0gY29tcHV0ZVBsYWNlaG9sZGVyTmFtZShpKSwgYXNzb2NpYXRlZE1lc3NhZ2VJZH0gPVxuICAgICAgICBwYXJzZVBsYWNlaG9sZGVyKG1lc3NhZ2VQYXJ0c1tpXSwgbWVzc2FnZVBhcnRzLnJhd1tpXSk7XG4gICAgbWVzc2FnZVN0cmluZyArPSBgeyQke3BsYWNlaG9sZGVyTmFtZX19JHttZXNzYWdlUGFydH1gO1xuICAgIGlmIChleHByZXNzaW9ucyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBzdWJzdGl0dXRpb25zW3BsYWNlaG9sZGVyTmFtZV0gPSBleHByZXNzaW9uc1tpIC0gMV07XG4gICAgICBzdWJzdGl0dXRpb25Mb2NhdGlvbnNbcGxhY2Vob2xkZXJOYW1lXSA9IGV4cHJlc3Npb25Mb2NhdGlvbnNbaSAtIDFdO1xuICAgIH1cbiAgICBwbGFjZWhvbGRlck5hbWVzLnB1c2gocGxhY2Vob2xkZXJOYW1lKTtcbiAgICBpZiAoYXNzb2NpYXRlZE1lc3NhZ2VJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhc3NvY2lhdGVkTWVzc2FnZUlkc1twbGFjZWhvbGRlck5hbWVdID0gYXNzb2NpYXRlZE1lc3NhZ2VJZDtcbiAgICB9XG4gICAgY2xlYW5lZE1lc3NhZ2VQYXJ0cy5wdXNoKG1lc3NhZ2VQYXJ0KTtcbiAgfVxuICBjb25zdCBtZXNzYWdlSWQgPSBtZXRhZGF0YS5jdXN0b21JZCB8fCBjb21wdXRlTXNnSWQobWVzc2FnZVN0cmluZywgbWV0YWRhdGEubWVhbmluZyB8fCAnJyk7XG4gIGNvbnN0IGxlZ2FjeUlkcyA9IG1ldGFkYXRhLmxlZ2FjeUlkcyA/IG1ldGFkYXRhLmxlZ2FjeUlkcy5maWx0ZXIoaWQgPT4gaWQgIT09IG1lc3NhZ2VJZCkgOiBbXTtcbiAgcmV0dXJuIHtcbiAgICBpZDogbWVzc2FnZUlkLFxuICAgIGxlZ2FjeUlkcyxcbiAgICBzdWJzdGl0dXRpb25zLFxuICAgIHN1YnN0aXR1dGlvbkxvY2F0aW9ucyxcbiAgICB0ZXh0OiBtZXNzYWdlU3RyaW5nLFxuICAgIGN1c3RvbUlkOiBtZXRhZGF0YS5jdXN0b21JZCxcbiAgICBtZWFuaW5nOiBtZXRhZGF0YS5tZWFuaW5nIHx8ICcnLFxuICAgIGRlc2NyaXB0aW9uOiBtZXRhZGF0YS5kZXNjcmlwdGlvbiB8fCAnJyxcbiAgICBtZXNzYWdlUGFydHM6IGNsZWFuZWRNZXNzYWdlUGFydHMsXG4gICAgbWVzc2FnZVBhcnRMb2NhdGlvbnMsXG4gICAgcGxhY2Vob2xkZXJOYW1lcyxcbiAgICBhc3NvY2lhdGVkTWVzc2FnZUlkcyxcbiAgICBsb2NhdGlvbixcbiAgfTtcbn1cblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gbWVzc2FnZSBwYXJ0IChgY29va2VkYCArIGByYXdgKSB0byBleHRyYWN0IHRoZSBtZXNzYWdlIG1ldGFkYXRhIGZyb20gdGhlIHRleHQuXG4gKlxuICogSWYgdGhlIG1lc3NhZ2UgcGFydCBoYXMgYSBtZXRhZGF0YSBibG9jayB0aGlzIGZ1bmN0aW9uIHdpbGwgZXh0cmFjdCB0aGUgYG1lYW5pbmdgLFxuICogYGRlc2NyaXB0aW9uYCwgYGN1c3RvbUlkYCBhbmQgYGxlZ2FjeUlkYCAoaWYgcHJvdmlkZWQpIGZyb20gdGhlIGJsb2NrLiBUaGVzZSBtZXRhZGF0YSBwcm9wZXJ0aWVzXG4gKiBhcmUgc2VyaWFsaXplZCBpbiB0aGUgc3RyaW5nIGRlbGltaXRlZCBieSBgfGAsIGBAQGAgYW5kIGDikJ9gIHJlc3BlY3RpdmVseS5cbiAqXG4gKiAoTm90ZSB0aGF0IGDikJ9gIGlzIHRoZSBgTEVHQUNZX0lEX0lORElDQVRPUmAgLSBzZWUgYGNvbnN0YW50cy50c2AuKVxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYHRzXG4gKiBgOm1lYW5pbmd8ZGVzY3JpcHRpb25AQGN1c3RvbS1pZDpgXG4gKiBgOm1lYW5pbmd8QEBjdXN0b20taWQ6YFxuICogYDptZWFuaW5nfGRlc2NyaXB0aW9uOmBcbiAqIGA6ZGVzY3JpcHRpb25AQGN1c3RvbS1pZDpgXG4gKiBgOm1lYW5pbmd8OmBcbiAqIGA6ZGVzY3JpcHRpb246YFxuICogYDpAQGN1c3RvbS1pZDpgXG4gKiBgOm1lYW5pbmd8ZGVzY3JpcHRpb25AQGN1c3RvbS1pZOKQn2xlZ2FjeS1pZC0x4pCfbGVnYWN5LWlkLTI6YFxuICogYGBgXG4gKlxuICogQHBhcmFtIGNvb2tlZCBUaGUgY29va2VkIHZlcnNpb24gb2YgdGhlIG1lc3NhZ2UgcGFydCB0byBwYXJzZS5cbiAqIEBwYXJhbSByYXcgVGhlIHJhdyB2ZXJzaW9uIG9mIHRoZSBtZXNzYWdlIHBhcnQgdG8gcGFyc2UuXG4gKiBAcmV0dXJucyBBIG9iamVjdCBjb250YWluaW5nIGFueSBtZXRhZGF0YSB0aGF0IHdhcyBwYXJzZWQgZnJvbSB0aGUgbWVzc2FnZSBwYXJ0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VNZXRhZGF0YShjb29rZWQ6IHN0cmluZywgcmF3OiBzdHJpbmcpOiBNZXNzYWdlTWV0YWRhdGEge1xuICBjb25zdCB7dGV4dDogbWVzc2FnZVN0cmluZywgYmxvY2t9ID0gc3BsaXRCbG9jayhjb29rZWQsIHJhdyk7XG4gIGlmIChibG9jayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHt0ZXh0OiBtZXNzYWdlU3RyaW5nfTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBbbWVhbmluZ0Rlc2NBbmRJZCwgLi4ubGVnYWN5SWRzXSA9IGJsb2NrLnNwbGl0KExFR0FDWV9JRF9JTkRJQ0FUT1IpO1xuICAgIGNvbnN0IFttZWFuaW5nQW5kRGVzYywgY3VzdG9tSWRdID0gbWVhbmluZ0Rlc2NBbmRJZC5zcGxpdChJRF9TRVBBUkFUT1IsIDIpO1xuICAgIGxldCBbbWVhbmluZywgZGVzY3JpcHRpb25dOiAoc3RyaW5nfHVuZGVmaW5lZClbXSA9IG1lYW5pbmdBbmREZXNjLnNwbGl0KE1FQU5JTkdfU0VQQVJBVE9SLCAyKTtcbiAgICBpZiAoZGVzY3JpcHRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgZGVzY3JpcHRpb24gPSBtZWFuaW5nO1xuICAgICAgbWVhbmluZyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKGRlc2NyaXB0aW9uID09PSAnJykge1xuICAgICAgZGVzY3JpcHRpb24gPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB7dGV4dDogbWVzc2FnZVN0cmluZywgbWVhbmluZywgZGVzY3JpcHRpb24sIGN1c3RvbUlkLCBsZWdhY3lJZHN9O1xuICB9XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIG1lc3NhZ2UgcGFydCAoYGNvb2tlZGAgKyBgcmF3YCkgdG8gZXh0cmFjdCBhbnkgcGxhY2Vob2xkZXIgbWV0YWRhdGEgZnJvbSB0aGVcbiAqIHRleHQuXG4gKlxuICogSWYgdGhlIG1lc3NhZ2UgcGFydCBoYXMgYSBtZXRhZGF0YSBibG9jayB0aGlzIGZ1bmN0aW9uIHdpbGwgZXh0cmFjdCB0aGUgYHBsYWNlaG9sZGVyTmFtZWAgYW5kXG4gKiBgYXNzb2NpYXRlZE1lc3NhZ2VJZGAgKGlmIHByb3ZpZGVkKSBmcm9tIHRoZSBibG9jay5cbiAqXG4gKiBUaGVzZSBtZXRhZGF0YSBwcm9wZXJ0aWVzIGFyZSBzZXJpYWxpemVkIGluIHRoZSBzdHJpbmcgZGVsaW1pdGVkIGJ5IGBAQGAuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogYGBgdHNcbiAqIGA6cGxhY2Vob2xkZXItbmFtZUBAYXNzb2NpYXRlZC1pZDpgXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gY29va2VkIFRoZSBjb29rZWQgdmVyc2lvbiBvZiB0aGUgbWVzc2FnZSBwYXJ0IHRvIHBhcnNlLlxuICogQHBhcmFtIHJhdyBUaGUgcmF3IHZlcnNpb24gb2YgdGhlIG1lc3NhZ2UgcGFydCB0byBwYXJzZS5cbiAqIEByZXR1cm5zIEEgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG1ldGFkYXRhIChgcGxhY2Vob2xkZXJOYW1lYCBhbmQgYGFzc29jaWF0ZWRNZXNzYWdlSWRgKSBvZiB0aGVcbiAqICAgICBwcmVjZWRpbmcgcGxhY2Vob2xkZXIsIGFsb25nIHdpdGggdGhlIHN0YXRpYyB0ZXh0IHRoYXQgZm9sbG93cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUGxhY2Vob2xkZXIoY29va2VkOiBzdHJpbmcsIHJhdzogc3RyaW5nKTpcbiAgICB7bWVzc2FnZVBhcnQ6IHN0cmluZzsgcGxhY2Vob2xkZXJOYW1lPzogc3RyaW5nOyBhc3NvY2lhdGVkTWVzc2FnZUlkPzogc3RyaW5nO30ge1xuICBjb25zdCB7dGV4dDogbWVzc2FnZVBhcnQsIGJsb2NrfSA9IHNwbGl0QmxvY2soY29va2VkLCByYXcpO1xuICBpZiAoYmxvY2sgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB7bWVzc2FnZVBhcnR9O1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IFtwbGFjZWhvbGRlck5hbWUsIGFzc29jaWF0ZWRNZXNzYWdlSWRdID0gYmxvY2suc3BsaXQoSURfU0VQQVJBVE9SKTtcbiAgICByZXR1cm4ge21lc3NhZ2VQYXJ0LCBwbGFjZWhvbGRlck5hbWUsIGFzc29jaWF0ZWRNZXNzYWdlSWR9O1xuICB9XG59XG5cbi8qKlxuICogU3BsaXQgYSBtZXNzYWdlIHBhcnQgKGBjb29rZWRgICsgYHJhd2ApIGludG8gYW4gb3B0aW9uYWwgZGVsaW1pdGVkIFwiYmxvY2tcIiBvZmYgdGhlIGZyb250IGFuZCB0aGVcbiAqIHJlc3Qgb2YgdGhlIHRleHQgb2YgdGhlIG1lc3NhZ2UgcGFydC5cbiAqXG4gKiBCbG9ja3MgYXBwZWFyIGF0IHRoZSBzdGFydCBvZiBtZXNzYWdlIHBhcnRzLiBUaGV5IGFyZSBkZWxpbWl0ZWQgYnkgYSBjb2xvbiBgOmAgY2hhcmFjdGVyIGF0IHRoZVxuICogc3RhcnQgYW5kIGVuZCBvZiB0aGUgYmxvY2suXG4gKlxuICogSWYgdGhlIGJsb2NrIGlzIGluIHRoZSBmaXJzdCBtZXNzYWdlIHBhcnQgdGhlbiBpdCB3aWxsIGJlIG1ldGFkYXRhIGFib3V0IHRoZSB3aG9sZSBtZXNzYWdlOlxuICogbWVhbmluZywgZGVzY3JpcHRpb24sIGlkLiAgT3RoZXJ3aXNlIGl0IHdpbGwgYmUgbWV0YWRhdGEgYWJvdXQgdGhlIGltbWVkaWF0ZWx5IHByZWNlZGluZ1xuICogc3Vic3RpdHV0aW9uOiBwbGFjZWhvbGRlciBuYW1lLlxuICpcbiAqIFNpbmNlIGJsb2NrcyBhcmUgb3B0aW9uYWwsIGl0IGlzIHBvc3NpYmxlIHRoYXQgdGhlIGNvbnRlbnQgb2YgYSBtZXNzYWdlIGJsb2NrIGFjdHVhbGx5IHN0YXJ0c1xuICogd2l0aCBhIGJsb2NrIG1hcmtlci4gSW4gdGhpcyBjYXNlIHRoZSBtYXJrZXIgbXVzdCBiZSBlc2NhcGVkIGBcXDpgLlxuICpcbiAqIEBwYXJhbSBjb29rZWQgVGhlIGNvb2tlZCB2ZXJzaW9uIG9mIHRoZSBtZXNzYWdlIHBhcnQgdG8gcGFyc2UuXG4gKiBAcGFyYW0gcmF3IFRoZSByYXcgdmVyc2lvbiBvZiB0aGUgbWVzc2FnZSBwYXJ0IHRvIHBhcnNlLlxuICogQHJldHVybnMgQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGB0ZXh0YCBvZiB0aGUgbWVzc2FnZSBwYXJ0IGFuZCB0aGUgdGV4dCBvZiB0aGUgYGJsb2NrYCwgaWYgaXRcbiAqIGV4aXN0cy5cbiAqIEB0aHJvd3MgYW4gZXJyb3IgaWYgdGhlIGBibG9ja2AgaXMgdW50ZXJtaW5hdGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzcGxpdEJsb2NrKGNvb2tlZDogc3RyaW5nLCByYXc6IHN0cmluZyk6IHt0ZXh0OiBzdHJpbmcsIGJsb2NrPzogc3RyaW5nfSB7XG4gIGlmIChyYXcuY2hhckF0KDApICE9PSBCTE9DS19NQVJLRVIpIHtcbiAgICByZXR1cm4ge3RleHQ6IGNvb2tlZH07XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgZW5kT2ZCbG9jayA9IGZpbmRFbmRPZkJsb2NrKGNvb2tlZCwgcmF3KTtcbiAgICByZXR1cm4ge1xuICAgICAgYmxvY2s6IGNvb2tlZC5zdWJzdHJpbmcoMSwgZW5kT2ZCbG9jayksXG4gICAgICB0ZXh0OiBjb29rZWQuc3Vic3RyaW5nKGVuZE9mQmxvY2sgKyAxKSxcbiAgICB9O1xuICB9XG59XG5cblxuZnVuY3Rpb24gY29tcHV0ZVBsYWNlaG9sZGVyTmFtZShpbmRleDogbnVtYmVyKSB7XG4gIHJldHVybiBpbmRleCA9PT0gMSA/ICdQSCcgOiBgUEhfJHtpbmRleCAtIDF9YDtcbn1cblxuLyoqXG4gKiBGaW5kIHRoZSBlbmQgb2YgYSBcIm1hcmtlZCBibG9ja1wiIGluZGljYXRlZCBieSB0aGUgZmlyc3Qgbm9uLWVzY2FwZWQgY29sb24uXG4gKlxuICogQHBhcmFtIGNvb2tlZCBUaGUgY29va2VkIHN0cmluZyAod2hlcmUgZXNjYXBlZCBjaGFycyBoYXZlIGJlZW4gcHJvY2Vzc2VkKVxuICogQHBhcmFtIHJhdyBUaGUgcmF3IHN0cmluZyAod2hlcmUgZXNjYXBlIHNlcXVlbmNlcyBhcmUgc3RpbGwgaW4gcGxhY2UpXG4gKlxuICogQHJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBlbmQgb2YgYmxvY2sgbWFya2VyXG4gKiBAdGhyb3dzIGFuIGVycm9yIGlmIHRoZSBibG9jayBpcyB1bnRlcm1pbmF0ZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRFbmRPZkJsb2NrKGNvb2tlZDogc3RyaW5nLCByYXc6IHN0cmluZyk6IG51bWJlciB7XG4gIGZvciAobGV0IGNvb2tlZEluZGV4ID0gMSwgcmF3SW5kZXggPSAxOyBjb29rZWRJbmRleCA8IGNvb2tlZC5sZW5ndGg7IGNvb2tlZEluZGV4KyssIHJhd0luZGV4KyspIHtcbiAgICBpZiAocmF3W3Jhd0luZGV4XSA9PT0gJ1xcXFwnKSB7XG4gICAgICByYXdJbmRleCsrO1xuICAgIH0gZWxzZSBpZiAoY29va2VkW2Nvb2tlZEluZGV4XSA9PT0gQkxPQ0tfTUFSS0VSKSB7XG4gICAgICByZXR1cm4gY29va2VkSW5kZXg7XG4gICAgfVxuICB9XG4gIHRocm93IG5ldyBFcnJvcihgVW50ZXJtaW5hdGVkICRsb2NhbGl6ZSBtZXRhZGF0YSBibG9jayBpbiBcIiR7cmF3fVwiLmApO1xufVxuIl19
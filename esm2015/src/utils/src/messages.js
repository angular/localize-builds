/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { computeMsgId } from '@angular/compiler';
import { BLOCK_MARKER, ID_SEPARATOR, LEGACY_ID_INDICATOR, MEANING_SEPARATOR } from './constants';
/**
 * Re-export this helper function so that users of `@angular/localize` don't need to actively import
 * from `@angular/compiler`.
 */
export { computeMsgId } from '@angular/compiler';
/**
 * Parse a `$localize` tagged string into a structure that can be used for translation.
 *
 * See `ParsedMessage` for an example.
 */
export function parseMessage(messageParts, expressions, location) {
    const substitutions = {};
    const metadata = parseMetadata(messageParts[0], messageParts.raw[0]);
    const cleanedMessageParts = [metadata.text];
    const placeholderNames = [];
    let messageString = metadata.text;
    for (let i = 1; i < messageParts.length; i++) {
        const { text: messagePart, block: placeholderName = computePlaceholderName(i) } = splitBlock(messageParts[i], messageParts.raw[i]);
        messageString += `{$${placeholderName}}${messagePart}`;
        if (expressions !== undefined) {
            substitutions[placeholderName] = expressions[i - 1];
        }
        placeholderNames.push(placeholderName);
        cleanedMessageParts.push(messagePart);
    }
    const messageId = metadata.id || computeMsgId(messageString, metadata.meaning || '');
    const legacyIds = metadata.legacyIds ? metadata.legacyIds.filter(id => id !== messageId) : [];
    return {
        id: messageId,
        legacyIds,
        substitutions,
        text: messageString,
        meaning: metadata.meaning || '',
        description: metadata.description || '',
        messageParts: cleanedMessageParts,
        placeholderNames,
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
 * `:meaning|description@@custom-id`
 * `:meaning|@@custom-id`
 * `:meaning|description`
 * `description@@custom-id`
 * `meaning|`
 * `description`
 * `@@custom-id`
 * `:meaning|description@@custom-id␟legacy-id-1␟legacy-id-2`
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
        const [meaningAndDesc, id] = meaningDescAndId.split(ID_SEPARATOR, 2);
        let [meaning, description] = meaningAndDesc.split(MEANING_SEPARATOR, 2);
        if (description === undefined) {
            description = meaning;
            meaning = undefined;
        }
        if (description === '') {
            description = undefined;
        }
        return { text: messageString, meaning, description, id, legacyIds };
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
    /************************************************************************************************
     * This function is repeated in `src/localize/src/localize.ts` and the two should be kept in sync.
     * (See that file for more explanation of why.)
     ************************************************************************************************/
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdXRpbHMvc3JjL21lc3NhZ2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUcvQyxPQUFPLEVBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxtQkFBbUIsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUvRjs7O0dBR0c7QUFDSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFrSC9DOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsWUFBWSxDQUN4QixZQUFrQyxFQUFFLFdBQTRCLEVBQ2hFLFFBQXlCO0lBQzNCLE1BQU0sYUFBYSxHQUFxQyxFQUFFLENBQUM7SUFDM0QsTUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckUsTUFBTSxtQkFBbUIsR0FBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0RCxNQUFNLGdCQUFnQixHQUFhLEVBQUUsQ0FBQztJQUN0QyxJQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ2xDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzVDLE1BQU0sRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxlQUFlLEdBQUcsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLEVBQUMsR0FDekUsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FB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QUFVLEdBQUcsQ0FBQyxDQUFDO1NBQ3ZDLENBQUM7S0FDSDtBQUNILENBQUM7QUFHRCxTQUFTLHNCQUFzQixDQUFDLEtBQWE7SUFDM0MsT0FBTyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDO0FBQ2hELENBQUM7QUFFRDs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sVUFBVSxjQUFjLENBQUMsTUFBYyxFQUFFLEdBQVc7SUFDeEQ7OztzR0FHa0c7SUFDbEcsS0FBSyxJQUFJLFdBQVcsR0FBRyxDQUFDLEVBQUUsUUFBUSxHQUFHLENBQUMsRUFBRSxXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRTtRQUM5RixJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDMUIsUUFBUSxFQUFFLENBQUM7U0FDWjthQUFNLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLFlBQVksRUFBRTtZQUMvQyxPQUFPLFdBQVcsQ0FBQztTQUNwQjtLQUNGO0lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUN4RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge2NvbXB1dGVNc2dJZH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5cbmltcG9ydCB7QkxPQ0tfTUFSS0VSLCBJRF9TRVBBUkFUT1IsIExFR0FDWV9JRF9JTkRJQ0FUT1IsIE1FQU5JTkdfU0VQQVJBVE9SfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbi8qKlxuICogUmUtZXhwb3J0IHRoaXMgaGVscGVyIGZ1bmN0aW9uIHNvIHRoYXQgdXNlcnMgb2YgYEBhbmd1bGFyL2xvY2FsaXplYCBkb24ndCBuZWVkIHRvIGFjdGl2ZWx5IGltcG9ydFxuICogZnJvbSBgQGFuZ3VsYXIvY29tcGlsZXJgLlxuICovXG5leHBvcnQge2NvbXB1dGVNc2dJZH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuXG4vKipcbiAqIEEgc3RyaW5nIGNvbnRhaW5pbmcgYSB0cmFuc2xhdGlvbiBzb3VyY2UgbWVzc2FnZS5cbiAqXG4gKiBJLkUuIHRoZSBtZXNzYWdlIHRoYXQgaW5kaWNhdGVzIHdoYXQgd2lsbCBiZSB0cmFuc2xhdGVkIGZyb20uXG4gKlxuICogVXNlcyBgeyRwbGFjZWhvbGRlci1uYW1lfWAgdG8gaW5kaWNhdGUgYSBwbGFjZWhvbGRlci5cbiAqL1xuZXhwb3J0IHR5cGUgU291cmNlTWVzc2FnZSA9IHN0cmluZztcblxuLyoqXG4gKiBBIHN0cmluZyBjb250YWluaW5nIGEgdHJhbnNsYXRpb24gdGFyZ2V0IG1lc3NhZ2UuXG4gKlxuICogSS5FLiB0aGUgbWVzc2FnZSB0aGF0IGluZGljYXRlcyB3aGF0IHdpbGwgYmUgdHJhbnNsYXRlZCB0by5cbiAqXG4gKiBVc2VzIGB7JHBsYWNlaG9sZGVyLW5hbWV9YCB0byBpbmRpY2F0ZSBhIHBsYWNlaG9sZGVyLlxuICovXG5leHBvcnQgdHlwZSBUYXJnZXRNZXNzYWdlID0gc3RyaW5nO1xuXG4vKipcbiAqIEEgc3RyaW5nIHRoYXQgdW5pcXVlbHkgaWRlbnRpZmllcyBhIG1lc3NhZ2UsIHRvIGJlIHVzZWQgZm9yIG1hdGNoaW5nIHRyYW5zbGF0aW9ucy5cbiAqL1xuZXhwb3J0IHR5cGUgTWVzc2FnZUlkID0gc3RyaW5nO1xuXG4vKipcbiAqIFRoZSBsb2NhdGlvbiBvZiB0aGUgbWVzc2FnZSBpbiB0aGUgc291cmNlIGZpbGUuXG4gKlxuICogVGhlIGBsaW5lYCBhbmQgYGNvbHVtbmAgdmFsdWVzIGZvciB0aGUgYHN0YXJ0YCBhbmQgYGVuZGAgcHJvcGVydGllcyBhcmUgemVyby1iYXNlZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTb3VyY2VMb2NhdGlvbiB7XG4gIHN0YXJ0OiB7bGluZTogbnVtYmVyLCBjb2x1bW46IG51bWJlcn07XG4gIGVuZDoge2xpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXJ9O1xuICBmaWxlOiBBYnNvbHV0ZUZzUGF0aDtcbn1cblxuLyoqXG4gKiBBZGRpdGlvbmFsIGluZm9ybWF0aW9uIHRoYXQgY2FuIGJlIGFzc29jaWF0ZWQgd2l0aCBhIG1lc3NhZ2UuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWVzc2FnZU1ldGFkYXRhIHtcbiAgLyoqXG4gICAqIEEgaHVtYW4gcmVhZGFibGUgcmVuZGVyaW5nIG9mIHRoZSBtZXNzYWdlXG4gICAqL1xuICB0ZXh0OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBBIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGlzIG1lc3NhZ2UuXG4gICAqL1xuICBpZD86IE1lc3NhZ2VJZDtcbiAgLyoqXG4gICAqIExlZ2FjeSBtZXNzYWdlIGlkcywgaWYgcHJvdmlkZWQuXG4gICAqXG4gICAqIEluIGxlZ2FjeSBtZXNzYWdlIGZvcm1hdHMgdGhlIG1lc3NhZ2UgaWQgY2FuIG9ubHkgYmUgY29tcHV0ZWQgZGlyZWN0bHkgZnJvbSB0aGUgb3JpZ2luYWxcbiAgICogdGVtcGxhdGUgc291cmNlLlxuICAgKlxuICAgKiBTaW5jZSB0aGlzIGluZm9ybWF0aW9uIGlzIG5vdCBhdmFpbGFibGUgaW4gYCRsb2NhbGl6ZWAgY2FsbHMsIHRoZSBsZWdhY3kgbWVzc2FnZSBpZHMgbWF5IGJlXG4gICAqIGF0dGFjaGVkIGJ5IHRoZSBjb21waWxlciB0byB0aGUgYCRsb2NhbGl6ZWAgbWV0YWJsb2NrIHNvIGl0IGNhbiBiZSB1c2VkIGlmIG5lZWRlZCBhdCB0aGUgcG9pbnRcbiAgICogb2YgdHJhbnNsYXRpb24gaWYgdGhlIHRyYW5zbGF0aW9ucyBhcmUgZW5jb2RlZCB1c2luZyB0aGUgbGVnYWN5IG1lc3NhZ2UgaWQuXG4gICAqL1xuICBsZWdhY3lJZHM/OiBzdHJpbmdbXTtcbiAgLyoqXG4gICAqIFRoZSBtZWFuaW5nIG9mIHRoZSBgbWVzc2FnZWAsIHVzZWQgdG8gZGlzdGluZ3Vpc2ggaWRlbnRpY2FsIGBtZXNzYWdlU3RyaW5nYHMuXG4gICAqL1xuICBtZWFuaW5nPzogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBgbWVzc2FnZWAsIHVzZWQgdG8gYWlkIHRyYW5zbGF0aW9uLlxuICAgKi9cbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgbG9jYXRpb24gb2YgdGhlIG1lc3NhZ2UgaW4gdGhlIHNvdXJjZS5cbiAgICovXG4gIGxvY2F0aW9uPzogU291cmNlTG9jYXRpb247XG59XG5cbi8qKlxuICogSW5mb3JtYXRpb24gcGFyc2VkIGZyb20gYSBgJGxvY2FsaXplYCB0YWdnZWQgc3RyaW5nIHRoYXQgaXMgdXNlZCB0byB0cmFuc2xhdGUgaXQuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogYGBgXG4gKiBjb25zdCBuYW1lID0gJ0pvIEJsb2dncyc7XG4gKiAkbG9jYWxpemVgSGVsbG8gJHtuYW1lfTp0aXRsZSFgO1xuICogYGBgXG4gKlxuICogTWF5IGJlIHBhcnNlZCBpbnRvOlxuICpcbiAqIGBgYFxuICoge1xuICogICBpZDogJzY5OTgxOTQ1MDc1OTc3MzA1OTEnLFxuICogICBzdWJzdGl0dXRpb25zOiB7IHRpdGxlOiAnSm8gQmxvZ2dzJyB9LFxuICogICBtZXNzYWdlU3RyaW5nOiAnSGVsbG8geyR0aXRsZX0hJyxcbiAqIH1cbiAqIGBgYFxuICovXG5leHBvcnQgaW50ZXJmYWNlIFBhcnNlZE1lc3NhZ2UgZXh0ZW5kcyBNZXNzYWdlTWV0YWRhdGEge1xuICAvKipcbiAgICogVGhlIGtleSB1c2VkIHRvIGxvb2sgdXAgdGhlIGFwcHJvcHJpYXRlIHRyYW5zbGF0aW9uIHRhcmdldC5cbiAgICpcbiAgICogSW4gYFBhcnNlZE1lc3NhZ2VgIHRoaXMgaXMgYSByZXF1aXJlZCBmaWVsZCwgd2hlcmVhcyBpdCBpcyBvcHRpb25hbCBpbiBgTWVzc2FnZU1ldGFkYXRhYC5cbiAgICovXG4gIGlkOiBNZXNzYWdlSWQ7XG4gIC8qKlxuICAgKiBBIG1hcHBpbmcgb2YgcGxhY2Vob2xkZXIgbmFtZXMgdG8gc3Vic3RpdHV0aW9uIHZhbHVlcy5cbiAgICovXG4gIHN1YnN0aXR1dGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gIC8qKlxuICAgKiBUaGUgc3RhdGljIHBhcnRzIG9mIHRoZSBtZXNzYWdlLlxuICAgKi9cbiAgbWVzc2FnZVBhcnRzOiBzdHJpbmdbXTtcbiAgLyoqXG4gICAqIFRoZSBuYW1lcyBvZiB0aGUgcGxhY2Vob2xkZXJzIHRoYXQgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHN1YnN0aXR1dGlvbnMuXG4gICAqL1xuICBwbGFjZWhvbGRlck5hbWVzOiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBQYXJzZSBhIGAkbG9jYWxpemVgIHRhZ2dlZCBzdHJpbmcgaW50byBhIHN0cnVjdHVyZSB0aGF0IGNhbiBiZSB1c2VkIGZvciB0cmFuc2xhdGlvbi5cbiAqXG4gKiBTZWUgYFBhcnNlZE1lc3NhZ2VgIGZvciBhbiBleGFtcGxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VNZXNzYWdlKFxuICAgIG1lc3NhZ2VQYXJ0czogVGVtcGxhdGVTdHJpbmdzQXJyYXksIGV4cHJlc3Npb25zPzogcmVhZG9ubHkgYW55W10sXG4gICAgbG9jYXRpb24/OiBTb3VyY2VMb2NhdGlvbik6IFBhcnNlZE1lc3NhZ2Uge1xuICBjb25zdCBzdWJzdGl0dXRpb25zOiB7W3BsYWNlaG9sZGVyTmFtZTogc3RyaW5nXTogYW55fSA9IHt9O1xuICBjb25zdCBtZXRhZGF0YSA9IHBhcnNlTWV0YWRhdGEobWVzc2FnZVBhcnRzWzBdLCBtZXNzYWdlUGFydHMucmF3WzBdKTtcbiAgY29uc3QgY2xlYW5lZE1lc3NhZ2VQYXJ0czogc3RyaW5nW10gPSBbbWV0YWRhdGEudGV4dF07XG4gIGNvbnN0IHBsYWNlaG9sZGVyTmFtZXM6IHN0cmluZ1tdID0gW107XG4gIGxldCBtZXNzYWdlU3RyaW5nID0gbWV0YWRhdGEudGV4dDtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBtZXNzYWdlUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCB7dGV4dDogbWVzc2FnZVBhcnQsIGJsb2NrOiBwbGFjZWhvbGRlck5hbWUgPSBjb21wdXRlUGxhY2Vob2xkZXJOYW1lKGkpfSA9XG4gICAgICAgIHNwbGl0QmxvY2sobWVzc2FnZVBhcnRzW2ldLCBtZXNzYWdlUGFydHMucmF3W2ldKTtcbiAgICBtZXNzYWdlU3RyaW5nICs9IGB7JCR7cGxhY2Vob2xkZXJOYW1lfX0ke21lc3NhZ2VQYXJ0fWA7XG4gICAgaWYgKGV4cHJlc3Npb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHN1YnN0aXR1dGlvbnNbcGxhY2Vob2xkZXJOYW1lXSA9IGV4cHJlc3Npb25zW2kgLSAxXTtcbiAgICB9XG4gICAgcGxhY2Vob2xkZXJOYW1lcy5wdXNoKHBsYWNlaG9sZGVyTmFtZSk7XG4gICAgY2xlYW5lZE1lc3NhZ2VQYXJ0cy5wdXNoKG1lc3NhZ2VQYXJ0KTtcbiAgfVxuICBjb25zdCBtZXNzYWdlSWQgPSBtZXRhZGF0YS5pZCB8fCBjb21wdXRlTXNnSWQobWVzc2FnZVN0cmluZywgbWV0YWRhdGEubWVhbmluZyB8fCAnJyk7XG4gIGNvbnN0IGxlZ2FjeUlkcyA9IG1ldGFkYXRhLmxlZ2FjeUlkcyA/IG1ldGFkYXRhLmxlZ2FjeUlkcy5maWx0ZXIoaWQgPT4gaWQgIT09IG1lc3NhZ2VJZCkgOiBbXTtcbiAgcmV0dXJuIHtcbiAgICBpZDogbWVzc2FnZUlkLFxuICAgIGxlZ2FjeUlkcyxcbiAgICBzdWJzdGl0dXRpb25zLFxuICAgIHRleHQ6IG1lc3NhZ2VTdHJpbmcsXG4gICAgbWVhbmluZzogbWV0YWRhdGEubWVhbmluZyB8fCAnJyxcbiAgICBkZXNjcmlwdGlvbjogbWV0YWRhdGEuZGVzY3JpcHRpb24gfHwgJycsXG4gICAgbWVzc2FnZVBhcnRzOiBjbGVhbmVkTWVzc2FnZVBhcnRzLFxuICAgIHBsYWNlaG9sZGVyTmFtZXMsXG4gICAgbG9jYXRpb24sXG4gIH07XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIG1lc3NhZ2UgcGFydCAoYGNvb2tlZGAgKyBgcmF3YCkgdG8gZXh0cmFjdCB0aGUgbWVzc2FnZSBtZXRhZGF0YSBmcm9tIHRoZSB0ZXh0LlxuICpcbiAqIElmIHRoZSBtZXNzYWdlIHBhcnQgaGFzIGEgbWV0YWRhdGEgYmxvY2sgdGhpcyBmdW5jdGlvbiB3aWxsIGV4dHJhY3QgdGhlIGBtZWFuaW5nYCxcbiAqIGBkZXNjcmlwdGlvbmAsIGBjdXN0b21JZGAgYW5kIGBsZWdhY3lJZGAgKGlmIHByb3ZpZGVkKSBmcm9tIHRoZSBibG9jay4gVGhlc2UgbWV0YWRhdGEgcHJvcGVydGllc1xuICogYXJlIHNlcmlhbGl6ZWQgaW4gdGhlIHN0cmluZyBkZWxpbWl0ZWQgYnkgYHxgLCBgQEBgIGFuZCBg4pCfYCByZXNwZWN0aXZlbHkuXG4gKlxuICogKE5vdGUgdGhhdCBg4pCfYCBpcyB0aGUgYExFR0FDWV9JRF9JTkRJQ0FUT1JgIC0gc2VlIGBjb25zdGFudHMudHNgLilcbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogYDptZWFuaW5nfGRlc2NyaXB0aW9uQEBjdXN0b20taWRgXG4gKiBgOm1lYW5pbmd8QEBjdXN0b20taWRgXG4gKiBgOm1lYW5pbmd8ZGVzY3JpcHRpb25gXG4gKiBgZGVzY3JpcHRpb25AQGN1c3RvbS1pZGBcbiAqIGBtZWFuaW5nfGBcbiAqIGBkZXNjcmlwdGlvbmBcbiAqIGBAQGN1c3RvbS1pZGBcbiAqIGA6bWVhbmluZ3xkZXNjcmlwdGlvbkBAY3VzdG9tLWlk4pCfbGVnYWN5LWlkLTHikJ9sZWdhY3ktaWQtMmBcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBjb29rZWQgVGhlIGNvb2tlZCB2ZXJzaW9uIG9mIHRoZSBtZXNzYWdlIHBhcnQgdG8gcGFyc2UuXG4gKiBAcGFyYW0gcmF3IFRoZSByYXcgdmVyc2lvbiBvZiB0aGUgbWVzc2FnZSBwYXJ0IHRvIHBhcnNlLlxuICogQHJldHVybnMgQSBvYmplY3QgY29udGFpbmluZyBhbnkgbWV0YWRhdGEgdGhhdCB3YXMgcGFyc2VkIGZyb20gdGhlIG1lc3NhZ2UgcGFydC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTWV0YWRhdGEoY29va2VkOiBzdHJpbmcsIHJhdzogc3RyaW5nKTogTWVzc2FnZU1ldGFkYXRhIHtcbiAgY29uc3Qge3RleHQ6IG1lc3NhZ2VTdHJpbmcsIGJsb2NrfSA9IHNwbGl0QmxvY2soY29va2VkLCByYXcpO1xuICBpZiAoYmxvY2sgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB7dGV4dDogbWVzc2FnZVN0cmluZ307XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgW21lYW5pbmdEZXNjQW5kSWQsIC4uLmxlZ2FjeUlkc10gPSBibG9jay5zcGxpdChMRUdBQ1lfSURfSU5ESUNBVE9SKTtcbiAgICBjb25zdCBbbWVhbmluZ0FuZERlc2MsIGlkXSA9IG1lYW5pbmdEZXNjQW5kSWQuc3BsaXQoSURfU0VQQVJBVE9SLCAyKTtcbiAgICBsZXQgW21lYW5pbmcsIGRlc2NyaXB0aW9uXTogKHN0cmluZ3x1bmRlZmluZWQpW10gPSBtZWFuaW5nQW5kRGVzYy5zcGxpdChNRUFOSU5HX1NFUEFSQVRPUiwgMik7XG4gICAgaWYgKGRlc2NyaXB0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGRlc2NyaXB0aW9uID0gbWVhbmluZztcbiAgICAgIG1lYW5pbmcgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmIChkZXNjcmlwdGlvbiA9PT0gJycpIHtcbiAgICAgIGRlc2NyaXB0aW9uID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4ge3RleHQ6IG1lc3NhZ2VTdHJpbmcsIG1lYW5pbmcsIGRlc2NyaXB0aW9uLCBpZCwgbGVnYWN5SWRzfTtcbiAgfVxufVxuXG4vKipcbiAqIFNwbGl0IGEgbWVzc2FnZSBwYXJ0IChgY29va2VkYCArIGByYXdgKSBpbnRvIGFuIG9wdGlvbmFsIGRlbGltaXRlZCBcImJsb2NrXCIgb2ZmIHRoZSBmcm9udCBhbmQgdGhlXG4gKiByZXN0IG9mIHRoZSB0ZXh0IG9mIHRoZSBtZXNzYWdlIHBhcnQuXG4gKlxuICogQmxvY2tzIGFwcGVhciBhdCB0aGUgc3RhcnQgb2YgbWVzc2FnZSBwYXJ0cy4gVGhleSBhcmUgZGVsaW1pdGVkIGJ5IGEgY29sb24gYDpgIGNoYXJhY3RlciBhdCB0aGVcbiAqIHN0YXJ0IGFuZCBlbmQgb2YgdGhlIGJsb2NrLlxuICpcbiAqIElmIHRoZSBibG9jayBpcyBpbiB0aGUgZmlyc3QgbWVzc2FnZSBwYXJ0IHRoZW4gaXQgd2lsbCBiZSBtZXRhZGF0YSBhYm91dCB0aGUgd2hvbGUgbWVzc2FnZTpcbiAqIG1lYW5pbmcsIGRlc2NyaXB0aW9uLCBpZC4gIE90aGVyd2lzZSBpdCB3aWxsIGJlIG1ldGFkYXRhIGFib3V0IHRoZSBpbW1lZGlhdGVseSBwcmVjZWRpbmdcbiAqIHN1YnN0aXR1dGlvbjogcGxhY2Vob2xkZXIgbmFtZS5cbiAqXG4gKiBTaW5jZSBibG9ja3MgYXJlIG9wdGlvbmFsLCBpdCBpcyBwb3NzaWJsZSB0aGF0IHRoZSBjb250ZW50IG9mIGEgbWVzc2FnZSBibG9jayBhY3R1YWxseSBzdGFydHNcbiAqIHdpdGggYSBibG9jayBtYXJrZXIuIEluIHRoaXMgY2FzZSB0aGUgbWFya2VyIG11c3QgYmUgZXNjYXBlZCBgXFw6YC5cbiAqXG4gKiBAcGFyYW0gY29va2VkIFRoZSBjb29rZWQgdmVyc2lvbiBvZiB0aGUgbWVzc2FnZSBwYXJ0IHRvIHBhcnNlLlxuICogQHBhcmFtIHJhdyBUaGUgcmF3IHZlcnNpb24gb2YgdGhlIG1lc3NhZ2UgcGFydCB0byBwYXJzZS5cbiAqIEByZXR1cm5zIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBgdGV4dGAgb2YgdGhlIG1lc3NhZ2UgcGFydCBhbmQgdGhlIHRleHQgb2YgdGhlIGBibG9ja2AsIGlmIGl0XG4gKiBleGlzdHMuXG4gKiBAdGhyb3dzIGFuIGVycm9yIGlmIHRoZSBgYmxvY2tgIGlzIHVudGVybWluYXRlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gc3BsaXRCbG9jayhjb29rZWQ6IHN0cmluZywgcmF3OiBzdHJpbmcpOiB7dGV4dDogc3RyaW5nLCBibG9jaz86IHN0cmluZ30ge1xuICBpZiAocmF3LmNoYXJBdCgwKSAhPT0gQkxPQ0tfTUFSS0VSKSB7XG4gICAgcmV0dXJuIHt0ZXh0OiBjb29rZWR9O1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGVuZE9mQmxvY2sgPSBmaW5kRW5kT2ZCbG9jayhjb29rZWQsIHJhdyk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGJsb2NrOiBjb29rZWQuc3Vic3RyaW5nKDEsIGVuZE9mQmxvY2spLFxuICAgICAgdGV4dDogY29va2VkLnN1YnN0cmluZyhlbmRPZkJsb2NrICsgMSksXG4gICAgfTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGNvbXB1dGVQbGFjZWhvbGRlck5hbWUoaW5kZXg6IG51bWJlcikge1xuICByZXR1cm4gaW5kZXggPT09IDEgPyAnUEgnIDogYFBIXyR7aW5kZXggLSAxfWA7XG59XG5cbi8qKlxuICogRmluZCB0aGUgZW5kIG9mIGEgXCJtYXJrZWQgYmxvY2tcIiBpbmRpY2F0ZWQgYnkgdGhlIGZpcnN0IG5vbi1lc2NhcGVkIGNvbG9uLlxuICpcbiAqIEBwYXJhbSBjb29rZWQgVGhlIGNvb2tlZCBzdHJpbmcgKHdoZXJlIGVzY2FwZWQgY2hhcnMgaGF2ZSBiZWVuIHByb2Nlc3NlZClcbiAqIEBwYXJhbSByYXcgVGhlIHJhdyBzdHJpbmcgKHdoZXJlIGVzY2FwZSBzZXF1ZW5jZXMgYXJlIHN0aWxsIGluIHBsYWNlKVxuICpcbiAqIEByZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgZW5kIG9mIGJsb2NrIG1hcmtlclxuICogQHRocm93cyBhbiBlcnJvciBpZiB0aGUgYmxvY2sgaXMgdW50ZXJtaW5hdGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kRW5kT2ZCbG9jayhjb29rZWQ6IHN0cmluZywgcmF3OiBzdHJpbmcpOiBudW1iZXIge1xuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgcmVwZWF0ZWQgaW4gYHNyYy9sb2NhbGl6ZS9zcmMvbG9jYWxpemUudHNgIGFuZCB0aGUgdHdvIHNob3VsZCBiZSBrZXB0IGluIHN5bmMuXG4gICAqIChTZWUgdGhhdCBmaWxlIGZvciBtb3JlIGV4cGxhbmF0aW9uIG9mIHdoeS4pXG4gICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gIGZvciAobGV0IGNvb2tlZEluZGV4ID0gMSwgcmF3SW5kZXggPSAxOyBjb29rZWRJbmRleCA8IGNvb2tlZC5sZW5ndGg7IGNvb2tlZEluZGV4KyssIHJhd0luZGV4KyspIHtcbiAgICBpZiAocmF3W3Jhd0luZGV4XSA9PT0gJ1xcXFwnKSB7XG4gICAgICByYXdJbmRleCsrO1xuICAgIH0gZWxzZSBpZiAoY29va2VkW2Nvb2tlZEluZGV4XSA9PT0gQkxPQ0tfTUFSS0VSKSB7XG4gICAgICByZXR1cm4gY29va2VkSW5kZXg7XG4gICAgfVxuICB9XG4gIHRocm93IG5ldyBFcnJvcihgVW50ZXJtaW5hdGVkICRsb2NhbGl6ZSBtZXRhZGF0YSBibG9jayBpbiBcIiR7cmF3fVwiLmApO1xufVxuIl19
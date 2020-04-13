import { __read } from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
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
export function parseMessage(messageParts, expressions) {
    var substitutions = {};
    var metadata = parseMetadata(messageParts[0], messageParts.raw[0]);
    var cleanedMessageParts = [metadata.text];
    var placeholderNames = [];
    var messageString = metadata.text;
    for (var i = 1; i < messageParts.length; i++) {
        var _a = splitBlock(messageParts[i], messageParts.raw[i]), messagePart = _a.text, _b = _a.block, placeholderName = _b === void 0 ? computePlaceholderName(i) : _b;
        messageString += "{$" + placeholderName + "}" + messagePart;
        if (expressions !== undefined) {
            substitutions[placeholderName] = expressions[i - 1];
        }
        placeholderNames.push(placeholderName);
        cleanedMessageParts.push(messagePart);
    }
    var messageId = metadata.id || computeMsgId(messageString, metadata.meaning || '');
    var legacyIds = metadata.legacyIds.filter(function (id) { return id !== messageId; });
    return {
        messageId: messageId,
        legacyIds: legacyIds,
        substitutions: substitutions,
        messageString: messageString,
        meaning: metadata.meaning || '',
        description: metadata.description || '',
        messageParts: cleanedMessageParts,
        placeholderNames: placeholderNames,
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
    var _a = splitBlock(cooked, raw), text = _a.text, block = _a.block;
    if (block === undefined) {
        return { text: text, meaning: undefined, description: undefined, id: undefined, legacyIds: [] };
    }
    else {
        var _b = __read(block.split(LEGACY_ID_INDICATOR)), meaningDescAndId = _b[0], legacyIds = _b.slice(1);
        var _c = __read(meaningDescAndId.split(ID_SEPARATOR, 2), 2), meaningAndDesc = _c[0], id = _c[1];
        var _d = __read(meaningAndDesc.split(MEANING_SEPARATOR, 2), 2), meaning = _d[0], description = _d[1];
        if (description === undefined) {
            description = meaning;
            meaning = undefined;
        }
        if (description === '') {
            description = undefined;
        }
        return { text: text, meaning: meaning, description: description, id: id, legacyIds: legacyIds };
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
        var endOfBlock = findEndOfBlock(cooked, raw);
        return {
            block: cooked.substring(1, endOfBlock),
            text: cooked.substring(endOfBlock + 1),
        };
    }
}
function computePlaceholderName(index) {
    return index === 1 ? 'PH' : "PH_" + (index - 1);
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
    for (var cookedIndex = 1, rawIndex = 1; cookedIndex < cooked.length; cookedIndex++, rawIndex++) {
        if (raw[rawIndex] === '\\') {
            rawIndex++;
        }
        else if (cooked[cookedIndex] === BLOCK_MARKER) {
            return cookedIndex;
        }
    }
    throw new Error("Unterminated $localize metadata block in \"" + raw + "\".");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdXRpbHMvc3JjL21lc3NhZ2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFL0MsT0FBTyxFQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsbUJBQW1CLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFL0Y7OztHQUdHO0FBQ0gsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBdUYvQzs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FDeEIsWUFBa0MsRUFBRSxXQUE0QjtJQUNsRSxJQUFNLGFBQWEsR0FBcUMsRUFBRSxDQUFDO0lBQzNELElBQU0sUUFBUSxHQUFHLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLElBQU0sbUJBQW1CLEdBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEQsSUFBTSxnQkFBZ0IsR0FBYSxFQUFFLENBQUM7SUFDdEMsSUFBSSxhQUFhLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNsQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN0QyxJQUFBLHFEQUM4QyxFQUQ3QyxxQkFBaUIsRUFBRSxhQUFrRCxFQUFsRCxnRUFDMEIsQ0FBQztRQUNyRCxhQUFhLElBQUksT0FBSyxlQUFlLFNBQUksV0FBYSxDQUFDO1FBQ3ZELElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTtZQUM3QixhQUFhLENBQUMs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LEVBQUUsR0FBVztJQUN4RDs7O3NHQUdrRztJQUNsRyxLQUFLLElBQUksV0FBVyxHQUFHLENBQUMsRUFBRSxRQUFRLEdBQUcsQ0FBQyxFQUFFLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFO1FBQzlGLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUMxQixRQUFRLEVBQUUsQ0FBQztTQUNaO2FBQU0sSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssWUFBWSxFQUFFO1lBQy9DLE9BQU8sV0FBVyxDQUFDO1NBQ3BCO0tBQ0Y7SUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLGdEQUE2QyxHQUFHLFFBQUksQ0FBQyxDQUFDO0FBQ3hFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge2NvbXB1dGVNc2dJZH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuXG5pbXBvcnQge0JMT0NLX01BUktFUiwgSURfU0VQQVJBVE9SLCBMRUdBQ1lfSURfSU5ESUNBVE9SLCBNRUFOSU5HX1NFUEFSQVRPUn0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG4vKipcbiAqIFJlLWV4cG9ydCB0aGlzIGhlbHBlciBmdW5jdGlvbiBzbyB0aGF0IHVzZXJzIG9mIGBAYW5ndWxhci9sb2NhbGl6ZWAgZG9uJ3QgbmVlZCB0byBhY3RpdmVseSBpbXBvcnRcbiAqIGZyb20gYEBhbmd1bGFyL2NvbXBpbGVyYC5cbiAqL1xuZXhwb3J0IHtjb21wdXRlTXNnSWR9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcblxuLyoqXG4gKiBBIHN0cmluZyBjb250YWluaW5nIGEgdHJhbnNsYXRpb24gc291cmNlIG1lc3NhZ2UuXG4gKlxuICogSS5FLiB0aGUgbWVzc2FnZSB0aGF0IGluZGljYXRlcyB3aGF0IHdpbGwgYmUgdHJhbnNsYXRlZCBmcm9tLlxuICpcbiAqIFVzZXMgYHskcGxhY2Vob2xkZXItbmFtZX1gIHRvIGluZGljYXRlIGEgcGxhY2Vob2xkZXIuXG4gKi9cbmV4cG9ydCB0eXBlIFNvdXJjZU1lc3NhZ2UgPSBzdHJpbmc7XG5cbi8qKlxuICogQSBzdHJpbmcgY29udGFpbmluZyBhIHRyYW5zbGF0aW9uIHRhcmdldCBtZXNzYWdlLlxuICpcbiAqIEkuRS4gdGhlIG1lc3NhZ2UgdGhhdCBpbmRpY2F0ZXMgd2hhdCB3aWxsIGJlIHRyYW5zbGF0ZWQgdG8uXG4gKlxuICogVXNlcyBgeyRwbGFjZWhvbGRlci1uYW1lfWAgdG8gaW5kaWNhdGUgYSBwbGFjZWhvbGRlci5cbiAqL1xuZXhwb3J0IHR5cGUgVGFyZ2V0TWVzc2FnZSA9IHN0cmluZztcblxuLyoqXG4gKiBBIHN0cmluZyB0aGF0IHVuaXF1ZWx5IGlkZW50aWZpZXMgYSBtZXNzYWdlLCB0byBiZSB1c2VkIGZvciBtYXRjaGluZyB0cmFuc2xhdGlvbnMuXG4gKi9cbmV4cG9ydCB0eXBlIE1lc3NhZ2VJZCA9IHN0cmluZztcblxuLyoqXG4gKiBJbmZvcm1hdGlvbiBwYXJzZWQgZnJvbSBhIGAkbG9jYWxpemVgIHRhZ2dlZCBzdHJpbmcgdGhhdCBpcyB1c2VkIHRvIHRyYW5zbGF0ZSBpdC5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGBcbiAqIGNvbnN0IG5hbWUgPSAnSm8gQmxvZ2dzJztcbiAqICRsb2NhbGl6ZWBIZWxsbyAke25hbWV9OnRpdGxlIWA7XG4gKiBgYGBcbiAqXG4gKiBNYXkgYmUgcGFyc2VkIGludG86XG4gKlxuICogYGBgXG4gKiB7XG4gKiAgIG1lc3NhZ2VJZDogJzY5OTgxOTQ1MDc1OTc3MzA1OTEnLFxuICogICBzdWJzdGl0dXRpb25zOiB7IHRpdGxlOiAnSm8gQmxvZ2dzJyB9LFxuICogICBtZXNzYWdlU3RyaW5nOiAnSGVsbG8geyR0aXRsZX0hJyxcbiAqIH1cbiAqIGBgYFxuICovXG5leHBvcnQgaW50ZXJmYWNlIFBhcnNlZE1lc3NhZ2Uge1xuICAvKipcbiAgICogVGhlIGtleSB1c2VkIHRvIGxvb2sgdXAgdGhlIGFwcHJvcHJpYXRlIHRyYW5zbGF0aW9uIHRhcmdldC5cbiAgICovXG4gIG1lc3NhZ2VJZDogTWVzc2FnZUlkO1xuICAvKipcbiAgICogTGVnYWN5IG1lc3NhZ2UgaWRzLCBpZiBwcm92aWRlZC5cbiAgICpcbiAgICogSW4gbGVnYWN5IG1lc3NhZ2UgZm9ybWF0cyB0aGUgbWVzc2FnZSBpZCBjYW4gb25seSBiZSBjb21wdXRlZCBkaXJlY3RseSBmcm9tIHRoZSBvcmlnaW5hbFxuICAgKiB0ZW1wbGF0ZSBzb3VyY2UuXG4gICAqXG4gICAqIFNpbmNlIHRoaXMgaW5mb3JtYXRpb24gaXMgbm90IGF2YWlsYWJsZSBpbiBgJGxvY2FsaXplYCBjYWxscywgdGhlIGxlZ2FjeSBtZXNzYWdlIGlkcyBtYXkgYmVcbiAgICogYXR0YWNoZWQgYnkgdGhlIGNvbXBpbGVyIHRvIHRoZSBgJGxvY2FsaXplYCBtZXRhYmxvY2sgc28gaXQgY2FuIGJlIHVzZWQgaWYgbmVlZGVkIGF0IHRoZSBwb2ludFxuICAgKiBvZiB0cmFuc2xhdGlvbiBpZiB0aGUgdHJhbnNsYXRpb25zIGFyZSBlbmNvZGVkIHVzaW5nIHRoZSBsZWdhY3kgbWVzc2FnZSBpZC5cbiAgICovXG4gIGxlZ2FjeUlkczogTWVzc2FnZUlkW107XG4gIC8qKlxuICAgKiBBIG1hcHBpbmcgb2YgcGxhY2Vob2xkZXIgbmFtZXMgdG8gc3Vic3RpdHV0aW9uIHZhbHVlcy5cbiAgICovXG4gIHN1YnN0aXR1dGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gIC8qKlxuICAgKiBBIGh1bWFuIHJlYWRhYmxlIHJlbmRlcmluZyBvZiB0aGUgbWVzc2FnZVxuICAgKi9cbiAgbWVzc2FnZVN0cmluZzogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIG1lYW5pbmcgb2YgdGhlIGBtZXNzYWdlYCwgdXNlZCB0byBkaXN0aW5ndWlzaCBpZGVudGljYWwgYG1lc3NhZ2VTdHJpbmdgcy5cbiAgICovXG4gIG1lYW5pbmc6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgYG1lc3NhZ2VgLCB1c2VkIHRvIGFpZCB0cmFuc2xhdGlvbi5cbiAgICovXG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgc3RhdGljIHBhcnRzIG9mIHRoZSBtZXNzYWdlLlxuICAgKi9cbiAgbWVzc2FnZVBhcnRzOiBzdHJpbmdbXTtcbiAgLyoqXG4gICAqIFRoZSBuYW1lcyBvZiB0aGUgcGxhY2Vob2xkZXJzIHRoYXQgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHN1YnN0aXR1dGlvbnMuXG4gICAqL1xuICBwbGFjZWhvbGRlck5hbWVzOiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBQYXJzZSBhIGAkbG9jYWxpemVgIHRhZ2dlZCBzdHJpbmcgaW50byBhIHN0cnVjdHVyZSB0aGF0IGNhbiBiZSB1c2VkIGZvciB0cmFuc2xhdGlvbi5cbiAqXG4gKiBTZWUgYFBhcnNlZE1lc3NhZ2VgIGZvciBhbiBleGFtcGxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VNZXNzYWdlKFxuICAgIG1lc3NhZ2VQYXJ0czogVGVtcGxhdGVTdHJpbmdzQXJyYXksIGV4cHJlc3Npb25zPzogcmVhZG9ubHkgYW55W10pOiBQYXJzZWRNZXNzYWdlIHtcbiAgY29uc3Qgc3Vic3RpdHV0aW9uczoge1twbGFjZWhvbGRlck5hbWU6IHN0cmluZ106IGFueX0gPSB7fTtcbiAgY29uc3QgbWV0YWRhdGEgPSBwYXJzZU1ldGFkYXRhKG1lc3NhZ2VQYXJ0c1swXSwgbWVzc2FnZVBhcnRzLnJhd1swXSk7XG4gIGNvbnN0IGNsZWFuZWRNZXNzYWdlUGFydHM6IHN0cmluZ1tdID0gW21ldGFkYXRhLnRleHRdO1xuICBjb25zdCBwbGFjZWhvbGRlck5hbWVzOiBzdHJpbmdbXSA9IFtdO1xuICBsZXQgbWVzc2FnZVN0cmluZyA9IG1ldGFkYXRhLnRleHQ7XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgbWVzc2FnZVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qge3RleHQ6IG1lc3NhZ2VQYXJ0LCBibG9jazogcGxhY2Vob2xkZXJOYW1lID0gY29tcHV0ZVBsYWNlaG9sZGVyTmFtZShpKX0gPVxuICAgICAgICBzcGxpdEJsb2NrKG1lc3NhZ2VQYXJ0c1tpXSwgbWVzc2FnZVBhcnRzLnJhd1tpXSk7XG4gICAgbWVzc2FnZVN0cmluZyArPSBgeyQke3BsYWNlaG9sZGVyTmFtZX19JHttZXNzYWdlUGFydH1gO1xuICAgIGlmIChleHByZXNzaW9ucyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBzdWJzdGl0dXRpb25zW3BsYWNlaG9sZGVyTmFtZV0gPSBleHByZXNzaW9uc1tpIC0gMV07XG4gICAgfVxuICAgIHBsYWNlaG9sZGVyTmFtZXMucHVzaChwbGFjZWhvbGRlck5hbWUpO1xuICAgIGNsZWFuZWRNZXNzYWdlUGFydHMucHVzaChtZXNzYWdlUGFydCk7XG4gIH1cbiAgY29uc3QgbWVzc2FnZUlkID0gbWV0YWRhdGEuaWQgfHwgY29tcHV0ZU1zZ0lkKG1lc3NhZ2VTdHJpbmcsIG1ldGFkYXRhLm1lYW5pbmcgfHwgJycpO1xuICBjb25zdCBsZWdhY3lJZHMgPSBtZXRhZGF0YS5sZWdhY3lJZHMuZmlsdGVyKGlkID0+IGlkICE9PSBtZXNzYWdlSWQpO1xuICByZXR1cm4ge1xuICAgIG1lc3NhZ2VJZCxcbiAgICBsZWdhY3lJZHMsXG4gICAgc3Vic3RpdHV0aW9ucyxcbiAgICBtZXNzYWdlU3RyaW5nLFxuICAgIG1lYW5pbmc6IG1ldGFkYXRhLm1lYW5pbmcgfHwgJycsXG4gICAgZGVzY3JpcHRpb246IG1ldGFkYXRhLmRlc2NyaXB0aW9uIHx8ICcnLFxuICAgIG1lc3NhZ2VQYXJ0czogY2xlYW5lZE1lc3NhZ2VQYXJ0cyxcbiAgICBwbGFjZWhvbGRlck5hbWVzLFxuICB9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1lc3NhZ2VNZXRhZGF0YSB7XG4gIHRleHQ6IHN0cmluZztcbiAgbWVhbmluZzogc3RyaW5nfHVuZGVmaW5lZDtcbiAgZGVzY3JpcHRpb246IHN0cmluZ3x1bmRlZmluZWQ7XG4gIGlkOiBzdHJpbmd8dW5kZWZpbmVkO1xuICBsZWdhY3lJZHM6IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBtZXNzYWdlIHBhcnQgKGBjb29rZWRgICsgYHJhd2ApIHRvIGV4dHJhY3QgdGhlIG1lc3NhZ2UgbWV0YWRhdGEgZnJvbSB0aGUgdGV4dC5cbiAqXG4gKiBJZiB0aGUgbWVzc2FnZSBwYXJ0IGhhcyBhIG1ldGFkYXRhIGJsb2NrIHRoaXMgZnVuY3Rpb24gd2lsbCBleHRyYWN0IHRoZSBgbWVhbmluZ2AsXG4gKiBgZGVzY3JpcHRpb25gLCBgY3VzdG9tSWRgIGFuZCBgbGVnYWN5SWRgIChpZiBwcm92aWRlZCkgZnJvbSB0aGUgYmxvY2suIFRoZXNlIG1ldGFkYXRhIHByb3BlcnRpZXNcbiAqIGFyZSBzZXJpYWxpemVkIGluIHRoZSBzdHJpbmcgZGVsaW1pdGVkIGJ5IGB8YCwgYEBAYCBhbmQgYOKQn2AgcmVzcGVjdGl2ZWx5LlxuICpcbiAqIChOb3RlIHRoYXQgYOKQn2AgaXMgdGhlIGBMRUdBQ1lfSURfSU5ESUNBVE9SYCAtIHNlZSBgY29uc3RhbnRzLnRzYC4pXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogYGBgdHNcbiAqIGA6bWVhbmluZ3xkZXNjcmlwdGlvbkBAY3VzdG9tLWlkYFxuICogYDptZWFuaW5nfEBAY3VzdG9tLWlkYFxuICogYDptZWFuaW5nfGRlc2NyaXB0aW9uYFxuICogYGRlc2NyaXB0aW9uQEBjdXN0b20taWRgXG4gKiBgbWVhbmluZ3xgXG4gKiBgZGVzY3JpcHRpb25gXG4gKiBgQEBjdXN0b20taWRgXG4gKiBgOm1lYW5pbmd8ZGVzY3JpcHRpb25AQGN1c3RvbS1pZOKQn2xlZ2FjeS1pZC0x4pCfbGVnYWN5LWlkLTJgXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gY29va2VkIFRoZSBjb29rZWQgdmVyc2lvbiBvZiB0aGUgbWVzc2FnZSBwYXJ0IHRvIHBhcnNlLlxuICogQHBhcmFtIHJhdyBUaGUgcmF3IHZlcnNpb24gb2YgdGhlIG1lc3NhZ2UgcGFydCB0byBwYXJzZS5cbiAqIEByZXR1cm5zIEEgb2JqZWN0IGNvbnRhaW5pbmcgYW55IG1ldGFkYXRhIHRoYXQgd2FzIHBhcnNlZCBmcm9tIHRoZSBtZXNzYWdlIHBhcnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZU1ldGFkYXRhKGNvb2tlZDogc3RyaW5nLCByYXc6IHN0cmluZyk6IE1lc3NhZ2VNZXRhZGF0YSB7XG4gIGNvbnN0IHt0ZXh0LCBibG9ja30gPSBzcGxpdEJsb2NrKGNvb2tlZCwgcmF3KTtcbiAgaWYgKGJsb2NrID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4ge3RleHQsIG1lYW5pbmc6IHVuZGVmaW5lZCwgZGVzY3JpcHRpb246IHVuZGVmaW5lZCwgaWQ6IHVuZGVmaW5lZCwgbGVnYWN5SWRzOiBbXX07XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgW21lYW5pbmdEZXNjQW5kSWQsIC4uLmxlZ2FjeUlkc10gPSBibG9jay5zcGxpdChMRUdBQ1lfSURfSU5ESUNBVE9SKTtcbiAgICBjb25zdCBbbWVhbmluZ0FuZERlc2MsIGlkXSA9IG1lYW5pbmdEZXNjQW5kSWQuc3BsaXQoSURfU0VQQVJBVE9SLCAyKTtcbiAgICBsZXQgW21lYW5pbmcsIGRlc2NyaXB0aW9uXTogKHN0cmluZ3x1bmRlZmluZWQpW10gPSBtZWFuaW5nQW5kRGVzYy5zcGxpdChNRUFOSU5HX1NFUEFSQVRPUiwgMik7XG4gICAgaWYgKGRlc2NyaXB0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGRlc2NyaXB0aW9uID0gbWVhbmluZztcbiAgICAgIG1lYW5pbmcgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmIChkZXNjcmlwdGlvbiA9PT0gJycpIHtcbiAgICAgIGRlc2NyaXB0aW9uID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4ge3RleHQsIG1lYW5pbmcsIGRlc2NyaXB0aW9uLCBpZCwgbGVnYWN5SWRzfTtcbiAgfVxufVxuXG4vKipcbiAqIFNwbGl0IGEgbWVzc2FnZSBwYXJ0IChgY29va2VkYCArIGByYXdgKSBpbnRvIGFuIG9wdGlvbmFsIGRlbGltaXRlZCBcImJsb2NrXCIgb2ZmIHRoZSBmcm9udCBhbmQgdGhlXG4gKiByZXN0IG9mIHRoZSB0ZXh0IG9mIHRoZSBtZXNzYWdlIHBhcnQuXG4gKlxuICogQmxvY2tzIGFwcGVhciBhdCB0aGUgc3RhcnQgb2YgbWVzc2FnZSBwYXJ0cy4gVGhleSBhcmUgZGVsaW1pdGVkIGJ5IGEgY29sb24gYDpgIGNoYXJhY3RlciBhdCB0aGVcbiAqIHN0YXJ0IGFuZCBlbmQgb2YgdGhlIGJsb2NrLlxuICpcbiAqIElmIHRoZSBibG9jayBpcyBpbiB0aGUgZmlyc3QgbWVzc2FnZSBwYXJ0IHRoZW4gaXQgd2lsbCBiZSBtZXRhZGF0YSBhYm91dCB0aGUgd2hvbGUgbWVzc2FnZTpcbiAqIG1lYW5pbmcsIGRlc2NyaXB0aW9uLCBpZC4gIE90aGVyd2lzZSBpdCB3aWxsIGJlIG1ldGFkYXRhIGFib3V0IHRoZSBpbW1lZGlhdGVseSBwcmVjZWRpbmdcbiAqIHN1YnN0aXR1dGlvbjogcGxhY2Vob2xkZXIgbmFtZS5cbiAqXG4gKiBTaW5jZSBibG9ja3MgYXJlIG9wdGlvbmFsLCBpdCBpcyBwb3NzaWJsZSB0aGF0IHRoZSBjb250ZW50IG9mIGEgbWVzc2FnZSBibG9jayBhY3R1YWxseSBzdGFydHNcbiAqIHdpdGggYSBibG9jayBtYXJrZXIuIEluIHRoaXMgY2FzZSB0aGUgbWFya2VyIG11c3QgYmUgZXNjYXBlZCBgXFw6YC5cbiAqXG4gKiBAcGFyYW0gY29va2VkIFRoZSBjb29rZWQgdmVyc2lvbiBvZiB0aGUgbWVzc2FnZSBwYXJ0IHRvIHBhcnNlLlxuICogQHBhcmFtIHJhdyBUaGUgcmF3IHZlcnNpb24gb2YgdGhlIG1lc3NhZ2UgcGFydCB0byBwYXJzZS5cbiAqIEByZXR1cm5zIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBgdGV4dGAgb2YgdGhlIG1lc3NhZ2UgcGFydCBhbmQgdGhlIHRleHQgb2YgdGhlIGBibG9ja2AsIGlmIGl0XG4gKiBleGlzdHMuXG4gKiBAdGhyb3dzIGFuIGVycm9yIGlmIHRoZSBgYmxvY2tgIGlzIHVudGVybWluYXRlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gc3BsaXRCbG9jayhjb29rZWQ6IHN0cmluZywgcmF3OiBzdHJpbmcpOiB7dGV4dDogc3RyaW5nLCBibG9jaz86IHN0cmluZ30ge1xuICBpZiAocmF3LmNoYXJBdCgwKSAhPT0gQkxPQ0tfTUFSS0VSKSB7XG4gICAgcmV0dXJuIHt0ZXh0OiBjb29rZWR9O1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGVuZE9mQmxvY2sgPSBmaW5kRW5kT2ZCbG9jayhjb29rZWQsIHJhdyk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGJsb2NrOiBjb29rZWQuc3Vic3RyaW5nKDEsIGVuZE9mQmxvY2spLFxuICAgICAgdGV4dDogY29va2VkLnN1YnN0cmluZyhlbmRPZkJsb2NrICsgMSksXG4gICAgfTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGNvbXB1dGVQbGFjZWhvbGRlck5hbWUoaW5kZXg6IG51bWJlcikge1xuICByZXR1cm4gaW5kZXggPT09IDEgPyAnUEgnIDogYFBIXyR7aW5kZXggLSAxfWA7XG59XG5cbi8qKlxuICogRmluZCB0aGUgZW5kIG9mIGEgXCJtYXJrZWQgYmxvY2tcIiBpbmRpY2F0ZWQgYnkgdGhlIGZpcnN0IG5vbi1lc2NhcGVkIGNvbG9uLlxuICpcbiAqIEBwYXJhbSBjb29rZWQgVGhlIGNvb2tlZCBzdHJpbmcgKHdoZXJlIGVzY2FwZWQgY2hhcnMgaGF2ZSBiZWVuIHByb2Nlc3NlZClcbiAqIEBwYXJhbSByYXcgVGhlIHJhdyBzdHJpbmcgKHdoZXJlIGVzY2FwZSBzZXF1ZW5jZXMgYXJlIHN0aWxsIGluIHBsYWNlKVxuICpcbiAqIEByZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgZW5kIG9mIGJsb2NrIG1hcmtlclxuICogQHRocm93cyBhbiBlcnJvciBpZiB0aGUgYmxvY2sgaXMgdW50ZXJtaW5hdGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kRW5kT2ZCbG9jayhjb29rZWQ6IHN0cmluZywgcmF3OiBzdHJpbmcpOiBudW1iZXIge1xuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgcmVwZWF0ZWQgaW4gYHNyYy9sb2NhbGl6ZS9zcmMvbG9jYWxpemUudHNgIGFuZCB0aGUgdHdvIHNob3VsZCBiZSBrZXB0IGluIHN5bmMuXG4gICAqIChTZWUgdGhhdCBmaWxlIGZvciBtb3JlIGV4cGxhbmF0aW9uIG9mIHdoeS4pXG4gICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gIGZvciAobGV0IGNvb2tlZEluZGV4ID0gMSwgcmF3SW5kZXggPSAxOyBjb29rZWRJbmRleCA8IGNvb2tlZC5sZW5ndGg7IGNvb2tlZEluZGV4KyssIHJhd0luZGV4KyspIHtcbiAgICBpZiAocmF3W3Jhd0luZGV4XSA9PT0gJ1xcXFwnKSB7XG4gICAgICByYXdJbmRleCsrO1xuICAgIH0gZWxzZSBpZiAoY29va2VkW2Nvb2tlZEluZGV4XSA9PT0gQkxPQ0tfTUFSS0VSKSB7XG4gICAgICByZXR1cm4gY29va2VkSW5kZXg7XG4gICAgfVxuICB9XG4gIHRocm93IG5ldyBFcnJvcihgVW50ZXJtaW5hdGVkICRsb2NhbGl6ZSBtZXRhZGF0YSBibG9jayBpbiBcIiR7cmF3fVwiLmApO1xufSJdfQ==
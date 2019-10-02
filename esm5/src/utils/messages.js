import * as tslib_1 from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { computeMsgId } from '@angular/compiler';
import { BLOCK_MARKER, ID_SEPARATOR, MEANING_SEPARATOR } from './constants';
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
    var messageString = metadata.text;
    for (var i = 1; i < messageParts.length; i++) {
        var _a = splitBlock(messageParts[i], messageParts.raw[i]), messagePart = _a.text, _b = _a.block, placeholderName = _b === void 0 ? computePlaceholderName(i) : _b;
        messageString += "{$" + placeholderName + "}" + messagePart;
        if (expressions !== undefined) {
            substitutions[placeholderName] = expressions[i - 1];
        }
    }
    return {
        messageId: metadata.id || computeMsgId(messageString, metadata.meaning || ''),
        substitutions: substitutions,
        messageString: messageString,
        meaning: metadata.meaning || '',
    };
}
/**
 * Parse the given message part (`cooked` + `raw`) to extract the message metadata from the text.
 *
 * If the message part has a metadata block this function will extract the `meaning`,
 * `description` and `id` (if provided) from the block. These metadata properties are serialized in
 * the string delimited by `|` and `@@` respectively.
 *
 * For example:
 *
 * ```ts
 * `:meaning|description@@id`
 * `:meaning|@@id`
 * `:meaning|description`
 * `description@@id`
 * `meaning|`
 * `description`
 * `@@id`
 * ```
 *
 * @param cooked The cooked version of the message part to parse.
 * @param raw The raw version of the message part to parse.
 * @returns A object containing any metadata that was parsed from the message part.
 */
export function parseMetadata(cooked, raw) {
    var _a = splitBlock(cooked, raw), text = _a.text, block = _a.block;
    if (block === undefined) {
        return { text: text, meaning: undefined, description: undefined, id: undefined };
    }
    else {
        var _b = tslib_1.__read(block.split(ID_SEPARATOR, 2), 2), meaningAndDesc = _b[0], id = _b[1];
        var _c = tslib_1.__read(meaningAndDesc.split(MEANING_SEPARATOR, 2), 2), meaning = _c[0], description = _c[1];
        if (description === undefined) {
            description = meaning;
            meaning = undefined;
        }
        if (description === '') {
            description = undefined;
        }
        return { text: text, meaning: meaning, description: description, id: id };
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
 * output is ES2015 and the code is downlevelled by a separate tool as happens in the Angular CLI.
 *
 * @param cooked The cooked version of the message part to parse.
 * @param raw The raw version of the message part to parse.
 * @returns An object containing the `text` of the message part and the text of the `block`, if it
 * exists.
 * @throws an error if the `block` is unterminated
 */
export function splitBlock(cooked, raw) {
    raw = raw || cooked;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdXRpbHMvbWVzc2FnZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUxRTs7O0dBR0c7QUFDSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFnRS9DOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsWUFBWSxDQUN4QixZQUFrQyxFQUFFLFdBQTRCO0lBQ2xFLElBQU0sYUFBYSxHQUFxQyxFQUFFLENBQUM7SUFDM0QsSUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckUsSUFBSSxhQUFhLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNsQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN0QyxJQUFBLHFEQUM4QyxFQUQ3QyxxQkFBaUIsRUFBRSxhQUFrRCxFQUFsRCxnRUFDMEIsQ0FBQztRQUNyRCxhQUFhLElBQUksT0FBSyxlQUFlLFNBQUksV0FBYSxDQUFDO1FBQ3ZELElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTtZQUM3QixhQUFhLENBQUMsZUFBZSxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNyRDtLQUNGO0lBQ0QsT0FBTztRQUNMLFNBQVMsRUFBRSxRQUFRLENBQUMsRUFBRSxJQUFJLFlBQVksQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFDN0UsYUFBYSxlQUFBO1FBQ2IsYUFBYSxlQUFBO1FBQ2IsT0FBTyxFQUFFLFFBQVEsQ0FBQyxPQUFPLElBQUksRUFBRTtLQUNoQyxDQUFDO0FBQ0osQ0FBQztBQVNEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0JHO0FBQ0gsTUFBTSxVQUFVLGFBQWEsQ0FBQyxNQUFjLEVBQUUsR0FBVztJQUNqRCxJQUFBLDRCQUF1QyxFQUF0QyxjQUFJLEVBQUUsZ0JBQWdDLENBQUM7SUFDOUMsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1FBQ3ZCLE9BQU8sRUFBQyxJQUFJLE1BQUEsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBQyxDQUFDO0tBQzFFO1NBQU07UUFDQyxJQUFBLG9EQUFtRCxFQUFsRCxzQkFBYyxFQUFFLFVBQWtDLENBQUM7UUFDdEQsSUFBQSxrRUFBMkYsRUFBMUYsZUFBTyxFQUFFLG1CQUFpRixDQUFDO1FBQ2hHLElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTtZQUM3QixXQUFXLEdBQUcsT0FBTyxDQUFDO1lBQ3RCLE9BQU8sR0FBRyxTQUFTLENBQUM7U0FDckI7UUFDRCxJQUFJLFdBQVcsS0FBSyxFQUFFLEVBQUU7WUFDdEIsV0FBVyxHQUFHLFNBQVMsQ0FBQztTQUN6QjtRQUNELE9BQU8sRUFBQyxJQUFJLE1BQUEsRUFBRSxPQUFPLFNBQUEsRUFBRSxXQUFXLGFBQUEsRUFBRSxFQUFFLElBQUEsRUFBQyxDQUFDO0tBQ3pDO0FBQ0gsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBK0JHO0FBQ0gsTUFBTSxVQUFVLFVBQVUsQ0FBQyxNQUFjLEVBQUUsR0FBVztJQUNwRCxHQUFHLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQztJQUNwQixJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssWUFBWSxFQUFFO1FBQ2xDLE9BQU8sRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUM7S0FDdkI7U0FBTTtRQUNMLElBQU0sVUFBVSxHQUFHLGNBQWMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDL0MsT0FBTztZQUNMLEtBQUssRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUM7WUFDdEMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztTQUN2QyxDQUFDO0tBQ0g7QUFDSCxDQUFDO0FBR0QsU0FBUyxzQkFBc0IsQ0FBQyxLQUFhO0lBQzNDLE9BQU8sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFNLEtBQUssR0FBRyxDQUFDLENBQUUsQ0FBQztBQUNoRCxDQUFDO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLFVBQVUsY0FBYyxDQUFDLE1BQWMsRUFBRSxHQUFXO0lBQ3hEOzs7cUdBR2lHO0lBQ2pHLEtBQUssSUFBSSxXQUFXLEdBQUcsQ0FBQyxFQUFFLFFBQVEsR0FBRyxDQUFDLEVBQUUsV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUU7UUFDOUYsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQzFCLFFBQVEsRUFBRSxDQUFDO1NBQ1o7YUFBTSxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxZQUFZLEVBQUU7WUFDL0MsT0FBTyxXQUFXLENBQUM7U0FDcEI7S0FDRjtJQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsZ0RBQTZDLEdBQUcsUUFBSSxDQUFDLENBQUM7QUFDeEUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7Y29tcHV0ZU1zZ0lkfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5pbXBvcnQge0JMT0NLX01BUktFUiwgSURfU0VQQVJBVE9SLCBNRUFOSU5HX1NFUEFSQVRPUn0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG4vKipcbiAqIFJlLWV4cG9ydCB0aGlzIGhlbHBlciBmdW5jdGlvbiBzbyB0aGF0IHVzZXJzIG9mIGBAYW5ndWxhci9sb2NhbGl6ZWAgZG9uJ3QgbmVlZCB0byBhY3RpdmVseSBpbXBvcnRcbiAqIGZyb20gYEBhbmd1bGFyL2NvbXBpbGVyYC5cbiAqL1xuZXhwb3J0IHtjb21wdXRlTXNnSWR9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcblxuLyoqXG4gKiBBIHN0cmluZyBjb250YWluaW5nIGEgdHJhbnNsYXRpb24gc291cmNlIG1lc3NhZ2UuXG4gKlxuICogSS5FLiB0aGUgbWVzc2FnZSB0aGF0IGluZGljYXRlcyB3aGF0IHdpbGwgYmUgdHJhbnNsYXRlZCBmcm9tLlxuICpcbiAqIFVzZXMgYHskcGxhY2Vob2xkZXItbmFtZX1gIHRvIGluZGljYXRlIGEgcGxhY2Vob2xkZXIuXG4gKi9cbmV4cG9ydCB0eXBlIFNvdXJjZU1lc3NhZ2UgPSBzdHJpbmc7XG5cbi8qKlxuICogQSBzdHJpbmcgY29udGFpbmluZyBhIHRyYW5zbGF0aW9uIHRhcmdldCBtZXNzYWdlLlxuICpcbiAqIEkuRS4gdGhlIG1lc3NhZ2UgdGhhdCBpbmRpY2F0ZXMgd2hhdCB3aWxsIGJlIHRyYW5zbGF0ZWQgdG8uXG4gKlxuICogVXNlcyBgeyRwbGFjZWhvbGRlci1uYW1lfWAgdG8gaW5kaWNhdGUgYSBwbGFjZWhvbGRlci5cbiAqL1xuZXhwb3J0IHR5cGUgVGFyZ2V0TWVzc2FnZSA9IHN0cmluZztcblxuLyoqXG4gKiBBIHN0cmluZyB0aGF0IHVuaXF1ZWx5IGlkZW50aWZpZXMgYSBtZXNzYWdlLCB0byBiZSB1c2VkIGZvciBtYXRjaGluZyB0cmFuc2xhdGlvbnMuXG4gKi9cbmV4cG9ydCB0eXBlIE1lc3NhZ2VJZCA9IHN0cmluZztcblxuLyoqXG4gKiBJbmZvcm1hdGlvbiBwYXJzZWQgZnJvbSBhIGAkbG9jYWxpemVgIHRhZ2dlZCBzdHJpbmcgdGhhdCBpcyB1c2VkIHRvIHRyYW5zbGF0ZSBpdC5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGBcbiAqIGNvbnN0IG5hbWUgPSAnSm8gQmxvZ2dzJztcbiAqICRsb2NhbGl6ZWBIZWxsbyAke25hbWV9OnRpdGxlIWA7XG4gKiBgYGBcbiAqXG4gKiBNYXkgYmUgcGFyc2VkIGludG86XG4gKlxuICogYGBgXG4gKiB7XG4gKiAgIG1lc3NhZ2VJZDogJzY5OTgxOTQ1MDc1OTc3MzA1OTEnLFxuICogICBzdWJzdGl0dXRpb25zOiB7IHRpdGxlOiAnSm8gQmxvZ2dzJyB9LFxuICogICBtZXNzYWdlU3RyaW5nOiAnSGVsbG8geyR0aXRsZX0hJyxcbiAqIH1cbiAqIGBgYFxuICovXG5leHBvcnQgaW50ZXJmYWNlIFBhcnNlZE1lc3NhZ2Uge1xuICAvKipcbiAgICogVGhlIGtleSB1c2VkIHRvIGxvb2sgdXAgdGhlIGFwcHJvcHJpYXRlIHRyYW5zbGF0aW9uIHRhcmdldC5cbiAgICovXG4gIG1lc3NhZ2VJZDogTWVzc2FnZUlkO1xuICAvKipcbiAgICogQSBtYXBwaW5nIG9mIHBsYWNlaG9sZGVyIG5hbWVzIHRvIHN1YnN0aXR1dGlvbiB2YWx1ZXMuXG4gICAqL1xuICBzdWJzdGl0dXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICAvKipcbiAgICogQSBodW1hbiByZWFkYWJsZSByZW5kZXJpbmcgb2YgdGhlIG1lc3NhZ2VcbiAgICovXG4gIG1lc3NhZ2VTdHJpbmc6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBtZWFuaW5nIG9mIHRoZSBgbWVzc2FnZWAsIHVzZWQgdG8gZGlzdGluZ3Vpc2ggaWRlbnRpY2FsIGBtZXNzYWdlU3RyaW5nYHMuXG4gICAqL1xuICBtZWFuaW5nOiBzdHJpbmc7XG59XG5cbi8qKlxuICogUGFyc2UgYSBgJGxvY2FsaXplYCB0YWdnZWQgc3RyaW5nIGludG8gYSBzdHJ1Y3R1cmUgdGhhdCBjYW4gYmUgdXNlZCBmb3IgdHJhbnNsYXRpb24uXG4gKlxuICogU2VlIGBQYXJzZWRNZXNzYWdlYCBmb3IgYW4gZXhhbXBsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTWVzc2FnZShcbiAgICBtZXNzYWdlUGFydHM6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCBleHByZXNzaW9ucz86IHJlYWRvbmx5IGFueVtdKTogUGFyc2VkTWVzc2FnZSB7XG4gIGNvbnN0IHN1YnN0aXR1dGlvbnM6IHtbcGxhY2Vob2xkZXJOYW1lOiBzdHJpbmddOiBhbnl9ID0ge307XG4gIGNvbnN0IG1ldGFkYXRhID0gcGFyc2VNZXRhZGF0YShtZXNzYWdlUGFydHNbMF0sIG1lc3NhZ2VQYXJ0cy5yYXdbMF0pO1xuICBsZXQgbWVzc2FnZVN0cmluZyA9IG1ldGFkYXRhLnRleHQ7XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgbWVzc2FnZVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qge3RleHQ6IG1lc3NhZ2VQYXJ0LCBibG9jazogcGxhY2Vob2xkZXJOYW1lID0gY29tcHV0ZVBsYWNlaG9sZGVyTmFtZShpKX0gPVxuICAgICAgICBzcGxpdEJsb2NrKG1lc3NhZ2VQYXJ0c1tpXSwgbWVzc2FnZVBhcnRzLnJhd1tpXSk7XG4gICAgbWVzc2FnZVN0cmluZyArPSBgeyQke3BsYWNlaG9sZGVyTmFtZX19JHttZXNzYWdlUGFydH1gO1xuICAgIGlmIChleHByZXNzaW9ucyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBzdWJzdGl0dXRpb25zW3BsYWNlaG9sZGVyTmFtZV0gPSBleHByZXNzaW9uc1tpIC0gMV07XG4gICAgfVxuICB9XG4gIHJldHVybiB7XG4gICAgbWVzc2FnZUlkOiBtZXRhZGF0YS5pZCB8fCBjb21wdXRlTXNnSWQobWVzc2FnZVN0cmluZywgbWV0YWRhdGEubWVhbmluZyB8fCAnJyksXG4gICAgc3Vic3RpdHV0aW9ucyxcbiAgICBtZXNzYWdlU3RyaW5nLFxuICAgIG1lYW5pbmc6IG1ldGFkYXRhLm1lYW5pbmcgfHwgJycsXG4gIH07XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWVzc2FnZU1ldGFkYXRhIHtcbiAgdGV4dDogc3RyaW5nO1xuICBtZWFuaW5nOiBzdHJpbmd8dW5kZWZpbmVkO1xuICBkZXNjcmlwdGlvbjogc3RyaW5nfHVuZGVmaW5lZDtcbiAgaWQ6IHN0cmluZ3x1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIG1lc3NhZ2UgcGFydCAoYGNvb2tlZGAgKyBgcmF3YCkgdG8gZXh0cmFjdCB0aGUgbWVzc2FnZSBtZXRhZGF0YSBmcm9tIHRoZSB0ZXh0LlxuICpcbiAqIElmIHRoZSBtZXNzYWdlIHBhcnQgaGFzIGEgbWV0YWRhdGEgYmxvY2sgdGhpcyBmdW5jdGlvbiB3aWxsIGV4dHJhY3QgdGhlIGBtZWFuaW5nYCxcbiAqIGBkZXNjcmlwdGlvbmAgYW5kIGBpZGAgKGlmIHByb3ZpZGVkKSBmcm9tIHRoZSBibG9jay4gVGhlc2UgbWV0YWRhdGEgcHJvcGVydGllcyBhcmUgc2VyaWFsaXplZCBpblxuICogdGhlIHN0cmluZyBkZWxpbWl0ZWQgYnkgYHxgIGFuZCBgQEBgIHJlc3BlY3RpdmVseS5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogYDptZWFuaW5nfGRlc2NyaXB0aW9uQEBpZGBcbiAqIGA6bWVhbmluZ3xAQGlkYFxuICogYDptZWFuaW5nfGRlc2NyaXB0aW9uYFxuICogYGRlc2NyaXB0aW9uQEBpZGBcbiAqIGBtZWFuaW5nfGBcbiAqIGBkZXNjcmlwdGlvbmBcbiAqIGBAQGlkYFxuICogYGBgXG4gKlxuICogQHBhcmFtIGNvb2tlZCBUaGUgY29va2VkIHZlcnNpb24gb2YgdGhlIG1lc3NhZ2UgcGFydCB0byBwYXJzZS5cbiAqIEBwYXJhbSByYXcgVGhlIHJhdyB2ZXJzaW9uIG9mIHRoZSBtZXNzYWdlIHBhcnQgdG8gcGFyc2UuXG4gKiBAcmV0dXJucyBBIG9iamVjdCBjb250YWluaW5nIGFueSBtZXRhZGF0YSB0aGF0IHdhcyBwYXJzZWQgZnJvbSB0aGUgbWVzc2FnZSBwYXJ0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VNZXRhZGF0YShjb29rZWQ6IHN0cmluZywgcmF3OiBzdHJpbmcpOiBNZXNzYWdlTWV0YWRhdGEge1xuICBjb25zdCB7dGV4dCwgYmxvY2t9ID0gc3BsaXRCbG9jayhjb29rZWQsIHJhdyk7XG4gIGlmIChibG9jayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHt0ZXh0LCBtZWFuaW5nOiB1bmRlZmluZWQsIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsIGlkOiB1bmRlZmluZWR9O1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IFttZWFuaW5nQW5kRGVzYywgaWRdID0gYmxvY2suc3BsaXQoSURfU0VQQVJBVE9SLCAyKTtcbiAgICBsZXQgW21lYW5pbmcsIGRlc2NyaXB0aW9uXTogKHN0cmluZyB8IHVuZGVmaW5lZClbXSA9IG1lYW5pbmdBbmREZXNjLnNwbGl0KE1FQU5JTkdfU0VQQVJBVE9SLCAyKTtcbiAgICBpZiAoZGVzY3JpcHRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgZGVzY3JpcHRpb24gPSBtZWFuaW5nO1xuICAgICAgbWVhbmluZyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKGRlc2NyaXB0aW9uID09PSAnJykge1xuICAgICAgZGVzY3JpcHRpb24gPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB7dGV4dCwgbWVhbmluZywgZGVzY3JpcHRpb24sIGlkfTtcbiAgfVxufVxuXG4vKipcbiAqIFNwbGl0IGEgbWVzc2FnZSBwYXJ0IChgY29va2VkYCArIGByYXdgKSBpbnRvIGFuIG9wdGlvbmFsIGRlbGltaXRlZCBcImJsb2NrXCIgb2ZmIHRoZSBmcm9udCBhbmQgdGhlXG4gKiByZXN0IG9mIHRoZSB0ZXh0IG9mIHRoZSBtZXNzYWdlIHBhcnQuXG4gKlxuICogQmxvY2tzIGFwcGVhciBhdCB0aGUgc3RhcnQgb2YgbWVzc2FnZSBwYXJ0cy4gVGhleSBhcmUgZGVsaW1pdGVkIGJ5IGEgY29sb24gYDpgIGNoYXJhY3RlciBhdCB0aGVcbiAqIHN0YXJ0IGFuZCBlbmQgb2YgdGhlIGJsb2NrLlxuICpcbiAqIElmIHRoZSBibG9jayBpcyBpbiB0aGUgZmlyc3QgbWVzc2FnZSBwYXJ0IHRoZW4gaXQgd2lsbCBiZSBtZXRhZGF0YSBhYm91dCB0aGUgd2hvbGUgbWVzc2FnZTpcbiAqIG1lYW5pbmcsIGRlc2NyaXB0aW9uLCBpZC4gIE90aGVyd2lzZSBpdCB3aWxsIGJlIG1ldGFkYXRhIGFib3V0IHRoZSBpbW1lZGlhdGVseSBwcmVjZWRpbmdcbiAqIHN1YnN0aXR1dGlvbjogcGxhY2Vob2xkZXIgbmFtZS5cbiAqXG4gKiBTaW5jZSBibG9ja3MgYXJlIG9wdGlvbmFsLCBpdCBpcyBwb3NzaWJsZSB0aGF0IHRoZSBjb250ZW50IG9mIGEgbWVzc2FnZSBibG9jayBhY3R1YWxseSBzdGFydHNcbiAqIHdpdGggYSBibG9jayBtYXJrZXIuIEluIHRoaXMgY2FzZSB0aGUgbWFya2VyIG11c3QgYmUgZXNjYXBlZCBgXFw6YC5cbiAqXG4gKiAtLS1cbiAqXG4gKiBJZiB0aGUgdGVtcGxhdGUgbGl0ZXJhbCB3YXMgc3ludGhlc2l6ZWQgYW5kIGRvd25sZXZlbGVkIGJ5IFR5cGVTY3JpcHQgdG8gRVM1IHRoZW4gaXRzXG4gKiByYXcgYXJyYXkgd2lsbCBvbmx5IGNvbnRhaW4gZW1wdHkgc3RyaW5ncy4gVGhpcyBpcyBiZWNhdXNlIHRoZSBjdXJyZW50IFR5cGVTY3JpcHQgY29tcGlsZXIgdXNlc1xuICogdGhlIG9yaWdpbmFsIHNvdXJjZSBjb2RlIHRvIGZpbmQgdGhlIHJhdyB0ZXh0IGFuZCBpbiB0aGUgY2FzZSBvZiBzeW50aGVzaXplZCBBU1Qgbm9kZXMsIHRoZXJlIGlzXG4gKiBubyBzb3VyY2UgY29kZSB0byBkcmF3IHVwb24uXG4gKlxuICogVGhlIHdvcmthcm91bmQgaW4gdGhpcyBmdW5jdGlvbiBpcyB0byBhc3N1bWUgdGhhdCB0aGUgdGVtcGxhdGUgbGl0ZXJhbCBkaWQgbm90IGNvbnRhaW4gYW4gZXNjYXBlZFxuICogcGxhY2Vob2xkZXIgbmFtZSwgYW5kIGZhbGwgYmFjayBvbiBjaGVja2luZyB0aGUgY29va2VkIGFycmF5IGluc3RlYWQuXG4gKiBUaGlzIGlzIGEgbGltaXRhdGlvbiBpZiBjb21waWxpbmcgdG8gRVM1IGluIFR5cGVTY3JpcHQgYnV0IGlzIG5vdCBhIHByb2JsZW0gaWYgdGhlIFR5cGVTY3JpcHRcbiAqIG91dHB1dCBpcyBFUzIwMTUgYW5kIHRoZSBjb2RlIGlzIGRvd25sZXZlbGxlZCBieSBhIHNlcGFyYXRlIHRvb2wgYXMgaGFwcGVucyBpbiB0aGUgQW5ndWxhciBDTEkuXG4gKlxuICogQHBhcmFtIGNvb2tlZCBUaGUgY29va2VkIHZlcnNpb24gb2YgdGhlIG1lc3NhZ2UgcGFydCB0byBwYXJzZS5cbiAqIEBwYXJhbSByYXcgVGhlIHJhdyB2ZXJzaW9uIG9mIHRoZSBtZXNzYWdlIHBhcnQgdG8gcGFyc2UuXG4gKiBAcmV0dXJucyBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgYHRleHRgIG9mIHRoZSBtZXNzYWdlIHBhcnQgYW5kIHRoZSB0ZXh0IG9mIHRoZSBgYmxvY2tgLCBpZiBpdFxuICogZXhpc3RzLlxuICogQHRocm93cyBhbiBlcnJvciBpZiB0aGUgYGJsb2NrYCBpcyB1bnRlcm1pbmF0ZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNwbGl0QmxvY2soY29va2VkOiBzdHJpbmcsIHJhdzogc3RyaW5nKToge3RleHQ6IHN0cmluZywgYmxvY2s/OiBzdHJpbmd9IHtcbiAgcmF3ID0gcmF3IHx8IGNvb2tlZDtcbiAgaWYgKHJhdy5jaGFyQXQoMCkgIT09IEJMT0NLX01BUktFUikge1xuICAgIHJldHVybiB7dGV4dDogY29va2VkfTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBlbmRPZkJsb2NrID0gZmluZEVuZE9mQmxvY2soY29va2VkLCByYXcpO1xuICAgIHJldHVybiB7XG4gICAgICBibG9jazogY29va2VkLnN1YnN0cmluZygxLCBlbmRPZkJsb2NrKSxcbiAgICAgIHRleHQ6IGNvb2tlZC5zdWJzdHJpbmcoZW5kT2ZCbG9jayArIDEpLFxuICAgIH07XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBjb21wdXRlUGxhY2Vob2xkZXJOYW1lKGluZGV4OiBudW1iZXIpIHtcbiAgcmV0dXJuIGluZGV4ID09PSAxID8gJ1BIJyA6IGBQSF8ke2luZGV4IC0gMX1gO1xufVxuXG4vKipcbiAqIEZpbmQgdGhlIGVuZCBvZiBhIFwibWFya2VkIGJsb2NrXCIgaW5kaWNhdGVkIGJ5IHRoZSBmaXJzdCBub24tZXNjYXBlZCBjb2xvbi5cbiAqXG4gKiBAcGFyYW0gY29va2VkIFRoZSBjb29rZWQgc3RyaW5nICh3aGVyZSBlc2NhcGVkIGNoYXJzIGhhdmUgYmVlbiBwcm9jZXNzZWQpXG4gKiBAcGFyYW0gcmF3IFRoZSByYXcgc3RyaW5nICh3aGVyZSBlc2NhcGUgc2VxdWVuY2VzIGFyZSBzdGlsbCBpbiBwbGFjZSlcbiAqXG4gKiBAcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGVuZCBvZiBibG9jayBtYXJrZXJcbiAqIEB0aHJvd3MgYW4gZXJyb3IgaWYgdGhlIGJsb2NrIGlzIHVudGVybWluYXRlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZEVuZE9mQmxvY2soY29va2VkOiBzdHJpbmcsIHJhdzogc3RyaW5nKTogbnVtYmVyIHtcbiAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAqIFRoaXMgZnVuY3Rpb24gaXMgcmVwZWF0ZWQgaW4gYHNyYy9sb2NhbGl6ZS9zcmMvbG9jYWxpemUudHNgIGFuZCB0aGUgdHdvIHNob3VsZCBiZSBrZXB0IGluIHN5bmMuXG4gICogKFNlZSB0aGF0IGZpbGUgZm9yIG1vcmUgZXhwbGFuYXRpb24gb2Ygd2h5LilcbiAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICBmb3IgKGxldCBjb29rZWRJbmRleCA9IDEsIHJhd0luZGV4ID0gMTsgY29va2VkSW5kZXggPCBjb29rZWQubGVuZ3RoOyBjb29rZWRJbmRleCsrLCByYXdJbmRleCsrKSB7XG4gICAgaWYgKHJhd1tyYXdJbmRleF0gPT09ICdcXFxcJykge1xuICAgICAgcmF3SW5kZXgrKztcbiAgICB9IGVsc2UgaWYgKGNvb2tlZFtjb29rZWRJbmRleF0gPT09IEJMT0NLX01BUktFUikge1xuICAgICAgcmV0dXJuIGNvb2tlZEluZGV4O1xuICAgIH1cbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoYFVudGVybWluYXRlZCAkbG9jYWxpemUgbWV0YWRhdGEgYmxvY2sgaW4gXCIke3Jhd31cIi5gKTtcbn0iXX0=
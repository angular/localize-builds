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
 * @param cooked The cooked version of the message part to parse.
 * @param raw The raw version of the message part to parse.
 * @returns An object containing the `text` of the message part and the text of the `block`, if it
 * exists.
 */
export function splitBlock(cooked, raw) {
    // Synthesizing AST nodes that represent template literals using the TypeScript API is problematic
    // because it doesn't allow for the raw value of messageParts to be programmatically set.
    // The result is that synthesized AST nodes have empty `raw` values.
    // Normally we rely upon checking the `raw` value to check whether the `BLOCK_MARKER` was escaped
    // in the original source. If the `raw` value is missing then we cannot do this.
    // In such a case we fall back on the `cooked` version and assume that the `BLOCK_MARKER` was not
    // escaped.
    // This should be OK because synthesized nodes only come from the Angular template compiler, which
    // always provides full id and placeholder name information so it will never escape `BLOCK_MARKER`
    // characters.
    if ((raw || cooked).charAt(0) !== BLOCK_MARKER) {
        return { text: cooked };
    }
    else {
        var endOfBlock = cooked.indexOf(BLOCK_MARKER, 1);
        return {
            block: cooked.substring(1, endOfBlock),
            text: cooked.substring(endOfBlock + 1),
        };
    }
}
function computePlaceholderName(index) {
    return index === 1 ? 'PH' : "PH_" + (index - 1);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdXRpbHMvbWVzc2FnZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUxRTs7O0dBR0c7QUFDSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUEyRC9DOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsWUFBWSxDQUN4QixZQUFrQyxFQUFFLFdBQTRCO0lBQ2xFLElBQU0sYUFBYSxHQUFxQyxFQUFFLENBQUM7SUFDM0QsSUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckUsSUFBSSxhQUFhLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNsQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN0QyxJQUFBLHFEQUM4QyxFQUQ3QyxxQkFBaUIsRUFBRSxhQUFrRCxFQUFsRCxnRUFDMEIsQ0FBQztRQUNyRCxhQUFhLElBQUksT0FBSyxlQUFlLFNBQUksV0FBYSxDQUFDO1FBQ3ZELElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTtZQUM3QixhQUFhLENBQUMsZUFBZSxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNyRDtLQUNGO0lBQ0QsT0FBTztRQUNMLFNBQVMsRUFBRSxRQUFRLENBQUMsRUFBRSxJQUFJLFlBQVksQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFDN0UsYUFBYSxlQUFBO1FBQ2IsYUFBYSxlQUFBO0tBQ2QsQ0FBQztBQUNKLENBQUM7QUFTRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNCRztBQUNILE1BQU0sVUFBVSxhQUFhLENBQUMsTUFBYyxFQUFFLEdBQVc7SUFDakQsSUFBQSw0QkFBdUMsRUFBdEMsY0FBSSxFQUFFLGdCQUFnQyxDQUFDO0lBQzlDLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtRQUN2QixPQUFPLEVBQUMsSUFBSSxNQUFBLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUMsQ0FBQztLQUMxRTtTQUFNO1FBQ0MsSUFBQSxvREFBbUQsRUFBbEQsc0JBQWMsRUFBRSxVQUFrQyxDQUFDO1FBQ3RELElBQUEsa0VBQTJGLEVBQTFGLGVBQU8sRUFBRSxtQkFBaUYsQ0FBQztRQUNoRyxJQUFJLFdBQVcsS0FBSyxTQUFTLEVBQUU7WUFDN0IsV0FBVyxHQUFHLE9BQU8sQ0FBQztZQUN0QixPQUFPLEdBQUcsU0FBUyxDQUFDO1NBQ3JCO1FBQ0QsSUFBSSxXQUFXLEtBQUssRUFBRSxFQUFFO1lBQ3RCLFdBQVcsR0FBRyxTQUFTLENBQUM7U0FDekI7UUFDRCxPQUFPLEVBQUMsSUFBSSxNQUFBLEVBQUUsT0FBTyxTQUFBLEVBQUUsV0FBVyxhQUFBLEVBQUUsRUFBRSxJQUFBLEVBQUMsQ0FBQztLQUN6QztBQUNILENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0JHO0FBQ0gsTUFBTSxVQUFVLFVBQVUsQ0FBQyxNQUFjLEVBQUUsR0FBVztJQUNwRCxrR0FBa0c7SUFDbEcseUZBQXlGO0lBQ3pGLG9FQUFvRTtJQUVwRSxpR0FBaUc7SUFDakcsZ0ZBQWdGO0lBQ2hGLGlHQUFpRztJQUNqRyxXQUFXO0lBRVgsa0dBQWtHO0lBQ2xHLGtHQUFrRztJQUNsRyxjQUFjO0lBQ2QsSUFBSSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssWUFBWSxFQUFFO1FBQzlDLE9BQU8sRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUM7S0FDdkI7U0FBTTtRQUNMLElBQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ25ELE9BQU87WUFDTCxLQUFLLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDO1lBQ3RDLElBQUksRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7U0FDdkMsQ0FBQztLQUNIO0FBQ0gsQ0FBQztBQUVELFNBQVMsc0JBQXNCLENBQUMsS0FBYTtJQUMzQyxPQUFPLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBTSxLQUFLLEdBQUcsQ0FBQyxDQUFFLENBQUM7QUFDaEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7Y29tcHV0ZU1zZ0lkfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5pbXBvcnQge0JMT0NLX01BUktFUiwgSURfU0VQQVJBVE9SLCBNRUFOSU5HX1NFUEFSQVRPUn0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG4vKipcbiAqIFJlLWV4cG9ydCB0aGlzIGhlbHBlciBmdW5jdGlvbiBzbyB0aGF0IHVzZXJzIG9mIGBAYW5ndWxhci9sb2NhbGl6ZWAgZG9uJ3QgbmVlZCB0byBhY3RpdmVseSBpbXBvcnRcbiAqIGZyb20gYEBhbmd1bGFyL2NvbXBpbGVyYC5cbiAqL1xuZXhwb3J0IHtjb21wdXRlTXNnSWR9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcblxuLyoqXG4gKiBBIHN0cmluZyBjb250YWluaW5nIGEgdHJhbnNsYXRpb24gc291cmNlIG1lc3NhZ2UuXG4gKlxuICogSS5FLiB0aGUgbWVzc2FnZSB0aGF0IGluZGljYXRlcyB3aGF0IHdpbGwgYmUgdHJhbnNsYXRlZCBmcm9tLlxuICpcbiAqIFVzZXMgYHskcGxhY2Vob2xkZXItbmFtZX1gIHRvIGluZGljYXRlIGEgcGxhY2Vob2xkZXIuXG4gKi9cbmV4cG9ydCB0eXBlIFNvdXJjZU1lc3NhZ2UgPSBzdHJpbmc7XG5cbi8qKlxuICogQSBzdHJpbmcgY29udGFpbmluZyBhIHRyYW5zbGF0aW9uIHRhcmdldCBtZXNzYWdlLlxuICpcbiAqIEkuRS4gdGhlIG1lc3NhZ2UgdGhhdCBpbmRpY2F0ZXMgd2hhdCB3aWxsIGJlIHRyYW5zbGF0ZWQgdG8uXG4gKlxuICogVXNlcyBgeyRwbGFjZWhvbGRlci1uYW1lfWAgdG8gaW5kaWNhdGUgYSBwbGFjZWhvbGRlci5cbiAqL1xuZXhwb3J0IHR5cGUgVGFyZ2V0TWVzc2FnZSA9IHN0cmluZztcblxuLyoqXG4gKiBBIHN0cmluZyB0aGF0IHVuaXF1ZWx5IGlkZW50aWZpZXMgYSBtZXNzYWdlLCB0byBiZSB1c2VkIGZvciBtYXRjaGluZyB0cmFuc2xhdGlvbnMuXG4gKi9cbmV4cG9ydCB0eXBlIE1lc3NhZ2VJZCA9IHN0cmluZztcblxuLyoqXG4gKiBJbmZvcm1hdGlvbiBwYXJzZWQgZnJvbSBhIGAkbG9jYWxpemVgIHRhZ2dlZCBzdHJpbmcgdGhhdCBpcyB1c2VkIHRvIHRyYW5zbGF0ZSBpdC5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGBcbiAqIGNvbnN0IG5hbWUgPSAnSm8gQmxvZ2dzJztcbiAqICRsb2NhbGl6ZWBIZWxsbyAke25hbWV9OnRpdGxlIWA7XG4gKiBgYGBcbiAqXG4gKiBNYXkgYmUgcGFyc2VkIGludG86XG4gKlxuICogYGBgXG4gKiB7XG4gKiAgIG1lc3NhZ2VJZDogJzY5OTgxOTQ1MDc1OTc3MzA1OTEnLFxuICogICBzdWJzdGl0dXRpb25zOiB7IHRpdGxlOiAnSm8gQmxvZ2dzJyB9LFxuICogfVxuICogYGBgXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUGFyc2VkTWVzc2FnZSB7XG4gIC8qKlxuICAgKiBUaGUga2V5IHVzZWQgdG8gbG9vayB1cCB0aGUgYXBwcm9wcmlhdGUgdHJhbnNsYXRpb24gdGFyZ2V0LlxuICAgKi9cbiAgbWVzc2FnZUlkOiBNZXNzYWdlSWQ7XG4gIC8qKlxuICAgKiBBIG1hcHBpbmcgb2YgcGxhY2Vob2xkZXIgbmFtZXMgdG8gc3Vic3RpdHV0aW9uIHZhbHVlcy5cbiAgICovXG4gIHN1YnN0aXR1dGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gIC8qKlxuICAgKiBBIGh1bWFuIHJlYWRhYmxlIHJlbmRlcmluZyBvZiB0aGUgbWVzc2FnZVxuICAgKi9cbiAgbWVzc2FnZVN0cmluZzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFBhcnNlIGEgYCRsb2NhbGl6ZWAgdGFnZ2VkIHN0cmluZyBpbnRvIGEgc3RydWN0dXJlIHRoYXQgY2FuIGJlIHVzZWQgZm9yIHRyYW5zbGF0aW9uLlxuICpcbiAqIFNlZSBgUGFyc2VkTWVzc2FnZWAgZm9yIGFuIGV4YW1wbGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZU1lc3NhZ2UoXG4gICAgbWVzc2FnZVBhcnRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgZXhwcmVzc2lvbnM/OiByZWFkb25seSBhbnlbXSk6IFBhcnNlZE1lc3NhZ2Uge1xuICBjb25zdCBzdWJzdGl0dXRpb25zOiB7W3BsYWNlaG9sZGVyTmFtZTogc3RyaW5nXTogYW55fSA9IHt9O1xuICBjb25zdCBtZXRhZGF0YSA9IHBhcnNlTWV0YWRhdGEobWVzc2FnZVBhcnRzWzBdLCBtZXNzYWdlUGFydHMucmF3WzBdKTtcbiAgbGV0IG1lc3NhZ2VTdHJpbmcgPSBtZXRhZGF0YS50ZXh0O1xuICBmb3IgKGxldCBpID0gMTsgaSA8IG1lc3NhZ2VQYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHt0ZXh0OiBtZXNzYWdlUGFydCwgYmxvY2s6IHBsYWNlaG9sZGVyTmFtZSA9IGNvbXB1dGVQbGFjZWhvbGRlck5hbWUoaSl9ID1cbiAgICAgICAgc3BsaXRCbG9jayhtZXNzYWdlUGFydHNbaV0sIG1lc3NhZ2VQYXJ0cy5yYXdbaV0pO1xuICAgIG1lc3NhZ2VTdHJpbmcgKz0gYHskJHtwbGFjZWhvbGRlck5hbWV9fSR7bWVzc2FnZVBhcnR9YDtcbiAgICBpZiAoZXhwcmVzc2lvbnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgc3Vic3RpdHV0aW9uc1twbGFjZWhvbGRlck5hbWVdID0gZXhwcmVzc2lvbnNbaSAtIDFdO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIG1lc3NhZ2VJZDogbWV0YWRhdGEuaWQgfHwgY29tcHV0ZU1zZ0lkKG1lc3NhZ2VTdHJpbmcsIG1ldGFkYXRhLm1lYW5pbmcgfHwgJycpLFxuICAgIHN1YnN0aXR1dGlvbnMsXG4gICAgbWVzc2FnZVN0cmluZyxcbiAgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNZXNzYWdlTWV0YWRhdGEge1xuICB0ZXh0OiBzdHJpbmc7XG4gIG1lYW5pbmc6IHN0cmluZ3x1bmRlZmluZWQ7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmd8dW5kZWZpbmVkO1xuICBpZDogc3RyaW5nfHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gbWVzc2FnZSBwYXJ0IChgY29va2VkYCArIGByYXdgKSB0byBleHRyYWN0IHRoZSBtZXNzYWdlIG1ldGFkYXRhIGZyb20gdGhlIHRleHQuXG4gKlxuICogSWYgdGhlIG1lc3NhZ2UgcGFydCBoYXMgYSBtZXRhZGF0YSBibG9jayB0aGlzIGZ1bmN0aW9uIHdpbGwgZXh0cmFjdCB0aGUgYG1lYW5pbmdgLFxuICogYGRlc2NyaXB0aW9uYCBhbmQgYGlkYCAoaWYgcHJvdmlkZWQpIGZyb20gdGhlIGJsb2NrLiBUaGVzZSBtZXRhZGF0YSBwcm9wZXJ0aWVzIGFyZSBzZXJpYWxpemVkIGluXG4gKiB0aGUgc3RyaW5nIGRlbGltaXRlZCBieSBgfGAgYW5kIGBAQGAgcmVzcGVjdGl2ZWx5LlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYHRzXG4gKiBgOm1lYW5pbmd8ZGVzY3JpcHRpb25AQGlkYFxuICogYDptZWFuaW5nfEBAaWRgXG4gKiBgOm1lYW5pbmd8ZGVzY3JpcHRpb25gXG4gKiBgZGVzY3JpcHRpb25AQGlkYFxuICogYG1lYW5pbmd8YFxuICogYGRlc2NyaXB0aW9uYFxuICogYEBAaWRgXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gY29va2VkIFRoZSBjb29rZWQgdmVyc2lvbiBvZiB0aGUgbWVzc2FnZSBwYXJ0IHRvIHBhcnNlLlxuICogQHBhcmFtIHJhdyBUaGUgcmF3IHZlcnNpb24gb2YgdGhlIG1lc3NhZ2UgcGFydCB0byBwYXJzZS5cbiAqIEByZXR1cm5zIEEgb2JqZWN0IGNvbnRhaW5pbmcgYW55IG1ldGFkYXRhIHRoYXQgd2FzIHBhcnNlZCBmcm9tIHRoZSBtZXNzYWdlIHBhcnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZU1ldGFkYXRhKGNvb2tlZDogc3RyaW5nLCByYXc6IHN0cmluZyk6IE1lc3NhZ2VNZXRhZGF0YSB7XG4gIGNvbnN0IHt0ZXh0LCBibG9ja30gPSBzcGxpdEJsb2NrKGNvb2tlZCwgcmF3KTtcbiAgaWYgKGJsb2NrID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4ge3RleHQsIG1lYW5pbmc6IHVuZGVmaW5lZCwgZGVzY3JpcHRpb246IHVuZGVmaW5lZCwgaWQ6IHVuZGVmaW5lZH07XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgW21lYW5pbmdBbmREZXNjLCBpZF0gPSBibG9jay5zcGxpdChJRF9TRVBBUkFUT1IsIDIpO1xuICAgIGxldCBbbWVhbmluZywgZGVzY3JpcHRpb25dOiAoc3RyaW5nIHwgdW5kZWZpbmVkKVtdID0gbWVhbmluZ0FuZERlc2Muc3BsaXQoTUVBTklOR19TRVBBUkFUT1IsIDIpO1xuICAgIGlmIChkZXNjcmlwdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZXNjcmlwdGlvbiA9IG1lYW5pbmc7XG4gICAgICBtZWFuaW5nID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAoZGVzY3JpcHRpb24gPT09ICcnKSB7XG4gICAgICBkZXNjcmlwdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHt0ZXh0LCBtZWFuaW5nLCBkZXNjcmlwdGlvbiwgaWR9O1xuICB9XG59XG5cbi8qKlxuICogU3BsaXQgYSBtZXNzYWdlIHBhcnQgKGBjb29rZWRgICsgYHJhd2ApIGludG8gYW4gb3B0aW9uYWwgZGVsaW1pdGVkIFwiYmxvY2tcIiBvZmYgdGhlIGZyb250IGFuZCB0aGVcbiAqIHJlc3Qgb2YgdGhlIHRleHQgb2YgdGhlIG1lc3NhZ2UgcGFydC5cbiAqXG4gKiBCbG9ja3MgYXBwZWFyIGF0IHRoZSBzdGFydCBvZiBtZXNzYWdlIHBhcnRzLiBUaGV5IGFyZSBkZWxpbWl0ZWQgYnkgYSBjb2xvbiBgOmAgY2hhcmFjdGVyIGF0IHRoZVxuICogc3RhcnQgYW5kIGVuZCBvZiB0aGUgYmxvY2suXG4gKlxuICogSWYgdGhlIGJsb2NrIGlzIGluIHRoZSBmaXJzdCBtZXNzYWdlIHBhcnQgdGhlbiBpdCB3aWxsIGJlIG1ldGFkYXRhIGFib3V0IHRoZSB3aG9sZSBtZXNzYWdlOlxuICogbWVhbmluZywgZGVzY3JpcHRpb24sIGlkLiAgT3RoZXJ3aXNlIGl0IHdpbGwgYmUgbWV0YWRhdGEgYWJvdXQgdGhlIGltbWVkaWF0ZWx5IHByZWNlZGluZ1xuICogc3Vic3RpdHV0aW9uOiBwbGFjZWhvbGRlciBuYW1lLlxuICpcbiAqIFNpbmNlIGJsb2NrcyBhcmUgb3B0aW9uYWwsIGl0IGlzIHBvc3NpYmxlIHRoYXQgdGhlIGNvbnRlbnQgb2YgYSBtZXNzYWdlIGJsb2NrIGFjdHVhbGx5IHN0YXJ0c1xuICogd2l0aCBhIGJsb2NrIG1hcmtlci4gSW4gdGhpcyBjYXNlIHRoZSBtYXJrZXIgbXVzdCBiZSBlc2NhcGVkIGBcXDpgLlxuICpcbiAqIEBwYXJhbSBjb29rZWQgVGhlIGNvb2tlZCB2ZXJzaW9uIG9mIHRoZSBtZXNzYWdlIHBhcnQgdG8gcGFyc2UuXG4gKiBAcGFyYW0gcmF3IFRoZSByYXcgdmVyc2lvbiBvZiB0aGUgbWVzc2FnZSBwYXJ0IHRvIHBhcnNlLlxuICogQHJldHVybnMgQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGB0ZXh0YCBvZiB0aGUgbWVzc2FnZSBwYXJ0IGFuZCB0aGUgdGV4dCBvZiB0aGUgYGJsb2NrYCwgaWYgaXRcbiAqIGV4aXN0cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNwbGl0QmxvY2soY29va2VkOiBzdHJpbmcsIHJhdzogc3RyaW5nKToge3RleHQ6IHN0cmluZywgYmxvY2s/OiBzdHJpbmd9IHtcbiAgLy8gU3ludGhlc2l6aW5nIEFTVCBub2RlcyB0aGF0IHJlcHJlc2VudCB0ZW1wbGF0ZSBsaXRlcmFscyB1c2luZyB0aGUgVHlwZVNjcmlwdCBBUEkgaXMgcHJvYmxlbWF0aWNcbiAgLy8gYmVjYXVzZSBpdCBkb2Vzbid0IGFsbG93IGZvciB0aGUgcmF3IHZhbHVlIG9mIG1lc3NhZ2VQYXJ0cyB0byBiZSBwcm9ncmFtbWF0aWNhbGx5IHNldC5cbiAgLy8gVGhlIHJlc3VsdCBpcyB0aGF0IHN5bnRoZXNpemVkIEFTVCBub2RlcyBoYXZlIGVtcHR5IGByYXdgIHZhbHVlcy5cblxuICAvLyBOb3JtYWxseSB3ZSByZWx5IHVwb24gY2hlY2tpbmcgdGhlIGByYXdgIHZhbHVlIHRvIGNoZWNrIHdoZXRoZXIgdGhlIGBCTE9DS19NQVJLRVJgIHdhcyBlc2NhcGVkXG4gIC8vIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UuIElmIHRoZSBgcmF3YCB2YWx1ZSBpcyBtaXNzaW5nIHRoZW4gd2UgY2Fubm90IGRvIHRoaXMuXG4gIC8vIEluIHN1Y2ggYSBjYXNlIHdlIGZhbGwgYmFjayBvbiB0aGUgYGNvb2tlZGAgdmVyc2lvbiBhbmQgYXNzdW1lIHRoYXQgdGhlIGBCTE9DS19NQVJLRVJgIHdhcyBub3RcbiAgLy8gZXNjYXBlZC5cblxuICAvLyBUaGlzIHNob3VsZCBiZSBPSyBiZWNhdXNlIHN5bnRoZXNpemVkIG5vZGVzIG9ubHkgY29tZSBmcm9tIHRoZSBBbmd1bGFyIHRlbXBsYXRlIGNvbXBpbGVyLCB3aGljaFxuICAvLyBhbHdheXMgcHJvdmlkZXMgZnVsbCBpZCBhbmQgcGxhY2Vob2xkZXIgbmFtZSBpbmZvcm1hdGlvbiBzbyBpdCB3aWxsIG5ldmVyIGVzY2FwZSBgQkxPQ0tfTUFSS0VSYFxuICAvLyBjaGFyYWN0ZXJzLlxuICBpZiAoKHJhdyB8fCBjb29rZWQpLmNoYXJBdCgwKSAhPT0gQkxPQ0tfTUFSS0VSKSB7XG4gICAgcmV0dXJuIHt0ZXh0OiBjb29rZWR9O1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGVuZE9mQmxvY2sgPSBjb29rZWQuaW5kZXhPZihCTE9DS19NQVJLRVIsIDEpO1xuICAgIHJldHVybiB7XG4gICAgICBibG9jazogY29va2VkLnN1YnN0cmluZygxLCBlbmRPZkJsb2NrKSxcbiAgICAgIHRleHQ6IGNvb2tlZC5zdWJzdHJpbmcoZW5kT2ZCbG9jayArIDEpLFxuICAgIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gY29tcHV0ZVBsYWNlaG9sZGVyTmFtZShpbmRleDogbnVtYmVyKSB7XG4gIHJldHVybiBpbmRleCA9PT0gMSA/ICdQSCcgOiBgUEhfJHtpbmRleCAtIDF9YDtcbn1cbiJdfQ==
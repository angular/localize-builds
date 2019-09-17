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
        var _a = splitBlock(messageParts[i], messageParts.raw[i]), messagePart = _a.text, _b = _a.block, placeholderName = _b === void 0 ? "ph_" + i : _b;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdXRpbHMvbWVzc2FnZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUxRTs7O0dBR0c7QUFDSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUEyRC9DOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsWUFBWSxDQUN4QixZQUFrQyxFQUFFLFdBQTRCO0lBQ2xFLElBQU0sYUFBYSxHQUFxQyxFQUFFLENBQUM7SUFDM0QsSUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckUsSUFBSSxhQUFhLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNsQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN0QyxJQUFBLHFEQUM4QyxFQUQ3QyxxQkFBaUIsRUFBRSxhQUFrQyxFQUFsQyxnREFDMEIsQ0FBQztRQUNyRCxhQUFhLElBQUksT0FBSyxlQUFlLFNBQUksV0FBYSxDQUFDO1FBQ3ZELElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTtZQUM3QixhQUFhLENBQUMsZUFBZSxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNyRDtLQUNGO0lBQ0QsT0FBTztRQUNMLFNBQVMsRUFBRSxRQUFRLENBQUMsRUFBRSxJQUFJLFlBQVksQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFDN0UsYUFBYSxlQUFBO1FBQ2IsYUFBYSxlQUFBO0tBQ2QsQ0FBQztBQUNKLENBQUM7QUFTRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNCRztBQUNILE1BQU0sVUFBVSxhQUFhLENBQUMsTUFBYyxFQUFFLEdBQVc7SUFDakQsSUFBQSw0QkFBdUMsRUFBdEMsY0FBSSxFQUFFLGdCQUFnQyxDQUFDO0lBQzlDLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtRQUN2QixPQUFPLEVBQUMsSUFBSSxNQUFBLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUMsQ0FBQztLQUMxRTtTQUFNO1FBQ0MsSUFBQSxvREFBbUQsRUFBbEQsc0JBQWMsRUFBRSxVQUFrQyxDQUFDO1FBQ3RELElBQUEsa0VBQTJGLEVBQTFGLGVBQU8sRUFBRSxtQkFBaUYsQ0FBQztRQUNoRyxJQUFJLFdBQVcsS0FBSyxTQUFTLEVBQUU7WUFDN0IsV0FBVyxHQUFHLE9BQU8sQ0FBQztZQUN0QixPQUFPLEdBQUcsU0FBUyxDQUFDO1NBQ3JCO1FBQ0QsSUFBSSxXQUFXLEtBQUssRUFBRSxFQUFFO1lBQ3RCLFdBQVcsR0FBRyxTQUFTLENBQUM7U0FDekI7UUFDRCxPQUFPLEVBQUMsSUFBSSxNQUFBLEVBQUUsT0FBTyxTQUFBLEVBQUUsV0FBVyxhQUFBLEVBQUUsRUFBRSxJQUFBLEVBQUMsQ0FBQztLQUN6QztBQUNILENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0JHO0FBQ0gsTUFBTSxVQUFVLFVBQVUsQ0FBQyxNQUFjLEVBQUUsR0FBVztJQUNwRCxrR0FBa0c7SUFDbEcseUZBQXlGO0lBQ3pGLG9FQUFvRTtJQUVwRSxpR0FBaUc7SUFDakcsZ0ZBQWdGO0lBQ2hGLGlHQUFpRztJQUNqRyxXQUFXO0lBRVgsa0dBQWtHO0lBQ2xHLGtHQUFrRztJQUNsRyxjQUFjO0lBQ2QsSUFBSSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssWUFBWSxFQUFFO1FBQzlDLE9BQU8sRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUM7S0FDdkI7U0FBTTtRQUNMLElBQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ25ELE9BQU87WUFDTCxLQUFLLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDO1lBQ3RDLElBQUksRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7U0FDdkMsQ0FBQztLQUNIO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7Y29tcHV0ZU1zZ0lkfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5pbXBvcnQge0JMT0NLX01BUktFUiwgSURfU0VQQVJBVE9SLCBNRUFOSU5HX1NFUEFSQVRPUn0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG4vKipcbiAqIFJlLWV4cG9ydCB0aGlzIGhlbHBlciBmdW5jdGlvbiBzbyB0aGF0IHVzZXJzIG9mIGBAYW5ndWxhci9sb2NhbGl6ZWAgZG9uJ3QgbmVlZCB0byBhY3RpdmVseSBpbXBvcnRcbiAqIGZyb20gYEBhbmd1bGFyL2NvbXBpbGVyYC5cbiAqL1xuZXhwb3J0IHtjb21wdXRlTXNnSWR9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcblxuLyoqXG4gKiBBIHN0cmluZyBjb250YWluaW5nIGEgdHJhbnNsYXRpb24gc291cmNlIG1lc3NhZ2UuXG4gKlxuICogSS5FLiB0aGUgbWVzc2FnZSB0aGF0IGluZGljYXRlcyB3aGF0IHdpbGwgYmUgdHJhbnNsYXRlZCBmcm9tLlxuICpcbiAqIFVzZXMgYHskcGxhY2Vob2xkZXItbmFtZX1gIHRvIGluZGljYXRlIGEgcGxhY2Vob2xkZXIuXG4gKi9cbmV4cG9ydCB0eXBlIFNvdXJjZU1lc3NhZ2UgPSBzdHJpbmc7XG5cbi8qKlxuICogQSBzdHJpbmcgY29udGFpbmluZyBhIHRyYW5zbGF0aW9uIHRhcmdldCBtZXNzYWdlLlxuICpcbiAqIEkuRS4gdGhlIG1lc3NhZ2UgdGhhdCBpbmRpY2F0ZXMgd2hhdCB3aWxsIGJlIHRyYW5zbGF0ZWQgdG8uXG4gKlxuICogVXNlcyBgeyRwbGFjZWhvbGRlci1uYW1lfWAgdG8gaW5kaWNhdGUgYSBwbGFjZWhvbGRlci5cbiAqL1xuZXhwb3J0IHR5cGUgVGFyZ2V0TWVzc2FnZSA9IHN0cmluZztcblxuLyoqXG4gKiBBIHN0cmluZyB0aGF0IHVuaXF1ZWx5IGlkZW50aWZpZXMgYSBtZXNzYWdlLCB0byBiZSB1c2VkIGZvciBtYXRjaGluZyB0cmFuc2xhdGlvbnMuXG4gKi9cbmV4cG9ydCB0eXBlIE1lc3NhZ2VJZCA9IHN0cmluZztcblxuLyoqXG4gKiBJbmZvcm1hdGlvbiBwYXJzZWQgZnJvbSBhIGAkbG9jYWxpemVgIHRhZ2dlZCBzdHJpbmcgdGhhdCBpcyB1c2VkIHRvIHRyYW5zbGF0ZSBpdC5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGBcbiAqIGNvbnN0IG5hbWUgPSAnSm8gQmxvZ2dzJztcbiAqICRsb2NhbGl6ZWBIZWxsbyAke25hbWV9OnRpdGxlIWA7XG4gKiBgYGBcbiAqXG4gKiBNYXkgYmUgcGFyc2VkIGludG86XG4gKlxuICogYGBgXG4gKiB7XG4gKiAgIG1lc3NhZ2VJZDogJzY5OTgxOTQ1MDc1OTc3MzA1OTEnLFxuICogICBzdWJzdGl0dXRpb25zOiB7IHRpdGxlOiAnSm8gQmxvZ2dzJyB9LFxuICogfVxuICogYGBgXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUGFyc2VkTWVzc2FnZSB7XG4gIC8qKlxuICAgKiBUaGUga2V5IHVzZWQgdG8gbG9vayB1cCB0aGUgYXBwcm9wcmlhdGUgdHJhbnNsYXRpb24gdGFyZ2V0LlxuICAgKi9cbiAgbWVzc2FnZUlkOiBNZXNzYWdlSWQ7XG4gIC8qKlxuICAgKiBBIG1hcHBpbmcgb2YgcGxhY2Vob2xkZXIgbmFtZXMgdG8gc3Vic3RpdHV0aW9uIHZhbHVlcy5cbiAgICovXG4gIHN1YnN0aXR1dGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gIC8qKlxuICAgKiBBIGh1bWFuIHJlYWRhYmxlIHJlbmRlcmluZyBvZiB0aGUgbWVzc2FnZVxuICAgKi9cbiAgbWVzc2FnZVN0cmluZzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFBhcnNlIGEgYCRsb2NhbGl6ZWAgdGFnZ2VkIHN0cmluZyBpbnRvIGEgc3RydWN0dXJlIHRoYXQgY2FuIGJlIHVzZWQgZm9yIHRyYW5zbGF0aW9uLlxuICpcbiAqIFNlZSBgUGFyc2VkTWVzc2FnZWAgZm9yIGFuIGV4YW1wbGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZU1lc3NhZ2UoXG4gICAgbWVzc2FnZVBhcnRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgZXhwcmVzc2lvbnM/OiByZWFkb25seSBhbnlbXSk6IFBhcnNlZE1lc3NhZ2Uge1xuICBjb25zdCBzdWJzdGl0dXRpb25zOiB7W3BsYWNlaG9sZGVyTmFtZTogc3RyaW5nXTogYW55fSA9IHt9O1xuICBjb25zdCBtZXRhZGF0YSA9IHBhcnNlTWV0YWRhdGEobWVzc2FnZVBhcnRzWzBdLCBtZXNzYWdlUGFydHMucmF3WzBdKTtcbiAgbGV0IG1lc3NhZ2VTdHJpbmcgPSBtZXRhZGF0YS50ZXh0O1xuICBmb3IgKGxldCBpID0gMTsgaSA8IG1lc3NhZ2VQYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHt0ZXh0OiBtZXNzYWdlUGFydCwgYmxvY2s6IHBsYWNlaG9sZGVyTmFtZSA9IGBwaF8ke2l9YH0gPVxuICAgICAgICBzcGxpdEJsb2NrKG1lc3NhZ2VQYXJ0c1tpXSwgbWVzc2FnZVBhcnRzLnJhd1tpXSk7XG4gICAgbWVzc2FnZVN0cmluZyArPSBgeyQke3BsYWNlaG9sZGVyTmFtZX19JHttZXNzYWdlUGFydH1gO1xuICAgIGlmIChleHByZXNzaW9ucyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBzdWJzdGl0dXRpb25zW3BsYWNlaG9sZGVyTmFtZV0gPSBleHByZXNzaW9uc1tpIC0gMV07XG4gICAgfVxuICB9XG4gIHJldHVybiB7XG4gICAgbWVzc2FnZUlkOiBtZXRhZGF0YS5pZCB8fCBjb21wdXRlTXNnSWQobWVzc2FnZVN0cmluZywgbWV0YWRhdGEubWVhbmluZyB8fCAnJyksXG4gICAgc3Vic3RpdHV0aW9ucyxcbiAgICBtZXNzYWdlU3RyaW5nLFxuICB9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1lc3NhZ2VNZXRhZGF0YSB7XG4gIHRleHQ6IHN0cmluZztcbiAgbWVhbmluZzogc3RyaW5nfHVuZGVmaW5lZDtcbiAgZGVzY3JpcHRpb246IHN0cmluZ3x1bmRlZmluZWQ7XG4gIGlkOiBzdHJpbmd8dW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBtZXNzYWdlIHBhcnQgKGBjb29rZWRgICsgYHJhd2ApIHRvIGV4dHJhY3QgdGhlIG1lc3NhZ2UgbWV0YWRhdGEgZnJvbSB0aGUgdGV4dC5cbiAqXG4gKiBJZiB0aGUgbWVzc2FnZSBwYXJ0IGhhcyBhIG1ldGFkYXRhIGJsb2NrIHRoaXMgZnVuY3Rpb24gd2lsbCBleHRyYWN0IHRoZSBgbWVhbmluZ2AsXG4gKiBgZGVzY3JpcHRpb25gIGFuZCBgaWRgIChpZiBwcm92aWRlZCkgZnJvbSB0aGUgYmxvY2suIFRoZXNlIG1ldGFkYXRhIHByb3BlcnRpZXMgYXJlIHNlcmlhbGl6ZWQgaW5cbiAqIHRoZSBzdHJpbmcgZGVsaW1pdGVkIGJ5IGB8YCBhbmQgYEBAYCByZXNwZWN0aXZlbHkuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogYGBgdHNcbiAqIGA6bWVhbmluZ3xkZXNjcmlwdGlvbkBAaWRgXG4gKiBgOm1lYW5pbmd8QEBpZGBcbiAqIGA6bWVhbmluZ3xkZXNjcmlwdGlvbmBcbiAqIGBkZXNjcmlwdGlvbkBAaWRgXG4gKiBgbWVhbmluZ3xgXG4gKiBgZGVzY3JpcHRpb25gXG4gKiBgQEBpZGBcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBjb29rZWQgVGhlIGNvb2tlZCB2ZXJzaW9uIG9mIHRoZSBtZXNzYWdlIHBhcnQgdG8gcGFyc2UuXG4gKiBAcGFyYW0gcmF3IFRoZSByYXcgdmVyc2lvbiBvZiB0aGUgbWVzc2FnZSBwYXJ0IHRvIHBhcnNlLlxuICogQHJldHVybnMgQSBvYmplY3QgY29udGFpbmluZyBhbnkgbWV0YWRhdGEgdGhhdCB3YXMgcGFyc2VkIGZyb20gdGhlIG1lc3NhZ2UgcGFydC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTWV0YWRhdGEoY29va2VkOiBzdHJpbmcsIHJhdzogc3RyaW5nKTogTWVzc2FnZU1ldGFkYXRhIHtcbiAgY29uc3Qge3RleHQsIGJsb2NrfSA9IHNwbGl0QmxvY2soY29va2VkLCByYXcpO1xuICBpZiAoYmxvY2sgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB7dGV4dCwgbWVhbmluZzogdW5kZWZpbmVkLCBkZXNjcmlwdGlvbjogdW5kZWZpbmVkLCBpZDogdW5kZWZpbmVkfTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBbbWVhbmluZ0FuZERlc2MsIGlkXSA9IGJsb2NrLnNwbGl0KElEX1NFUEFSQVRPUiwgMik7XG4gICAgbGV0IFttZWFuaW5nLCBkZXNjcmlwdGlvbl06IChzdHJpbmcgfCB1bmRlZmluZWQpW10gPSBtZWFuaW5nQW5kRGVzYy5zcGxpdChNRUFOSU5HX1NFUEFSQVRPUiwgMik7XG4gICAgaWYgKGRlc2NyaXB0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGRlc2NyaXB0aW9uID0gbWVhbmluZztcbiAgICAgIG1lYW5pbmcgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmIChkZXNjcmlwdGlvbiA9PT0gJycpIHtcbiAgICAgIGRlc2NyaXB0aW9uID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4ge3RleHQsIG1lYW5pbmcsIGRlc2NyaXB0aW9uLCBpZH07XG4gIH1cbn1cblxuLyoqXG4gKiBTcGxpdCBhIG1lc3NhZ2UgcGFydCAoYGNvb2tlZGAgKyBgcmF3YCkgaW50byBhbiBvcHRpb25hbCBkZWxpbWl0ZWQgXCJibG9ja1wiIG9mZiB0aGUgZnJvbnQgYW5kIHRoZVxuICogcmVzdCBvZiB0aGUgdGV4dCBvZiB0aGUgbWVzc2FnZSBwYXJ0LlxuICpcbiAqIEJsb2NrcyBhcHBlYXIgYXQgdGhlIHN0YXJ0IG9mIG1lc3NhZ2UgcGFydHMuIFRoZXkgYXJlIGRlbGltaXRlZCBieSBhIGNvbG9uIGA6YCBjaGFyYWN0ZXIgYXQgdGhlXG4gKiBzdGFydCBhbmQgZW5kIG9mIHRoZSBibG9jay5cbiAqXG4gKiBJZiB0aGUgYmxvY2sgaXMgaW4gdGhlIGZpcnN0IG1lc3NhZ2UgcGFydCB0aGVuIGl0IHdpbGwgYmUgbWV0YWRhdGEgYWJvdXQgdGhlIHdob2xlIG1lc3NhZ2U6XG4gKiBtZWFuaW5nLCBkZXNjcmlwdGlvbiwgaWQuICBPdGhlcndpc2UgaXQgd2lsbCBiZSBtZXRhZGF0YSBhYm91dCB0aGUgaW1tZWRpYXRlbHkgcHJlY2VkaW5nXG4gKiBzdWJzdGl0dXRpb246IHBsYWNlaG9sZGVyIG5hbWUuXG4gKlxuICogU2luY2UgYmxvY2tzIGFyZSBvcHRpb25hbCwgaXQgaXMgcG9zc2libGUgdGhhdCB0aGUgY29udGVudCBvZiBhIG1lc3NhZ2UgYmxvY2sgYWN0dWFsbHkgc3RhcnRzXG4gKiB3aXRoIGEgYmxvY2sgbWFya2VyLiBJbiB0aGlzIGNhc2UgdGhlIG1hcmtlciBtdXN0IGJlIGVzY2FwZWQgYFxcOmAuXG4gKlxuICogQHBhcmFtIGNvb2tlZCBUaGUgY29va2VkIHZlcnNpb24gb2YgdGhlIG1lc3NhZ2UgcGFydCB0byBwYXJzZS5cbiAqIEBwYXJhbSByYXcgVGhlIHJhdyB2ZXJzaW9uIG9mIHRoZSBtZXNzYWdlIHBhcnQgdG8gcGFyc2UuXG4gKiBAcmV0dXJucyBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgYHRleHRgIG9mIHRoZSBtZXNzYWdlIHBhcnQgYW5kIHRoZSB0ZXh0IG9mIHRoZSBgYmxvY2tgLCBpZiBpdFxuICogZXhpc3RzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3BsaXRCbG9jayhjb29rZWQ6IHN0cmluZywgcmF3OiBzdHJpbmcpOiB7dGV4dDogc3RyaW5nLCBibG9jaz86IHN0cmluZ30ge1xuICAvLyBTeW50aGVzaXppbmcgQVNUIG5vZGVzIHRoYXQgcmVwcmVzZW50IHRlbXBsYXRlIGxpdGVyYWxzIHVzaW5nIHRoZSBUeXBlU2NyaXB0IEFQSSBpcyBwcm9ibGVtYXRpY1xuICAvLyBiZWNhdXNlIGl0IGRvZXNuJ3QgYWxsb3cgZm9yIHRoZSByYXcgdmFsdWUgb2YgbWVzc2FnZVBhcnRzIHRvIGJlIHByb2dyYW1tYXRpY2FsbHkgc2V0LlxuICAvLyBUaGUgcmVzdWx0IGlzIHRoYXQgc3ludGhlc2l6ZWQgQVNUIG5vZGVzIGhhdmUgZW1wdHkgYHJhd2AgdmFsdWVzLlxuXG4gIC8vIE5vcm1hbGx5IHdlIHJlbHkgdXBvbiBjaGVja2luZyB0aGUgYHJhd2AgdmFsdWUgdG8gY2hlY2sgd2hldGhlciB0aGUgYEJMT0NLX01BUktFUmAgd2FzIGVzY2FwZWRcbiAgLy8gaW4gdGhlIG9yaWdpbmFsIHNvdXJjZS4gSWYgdGhlIGByYXdgIHZhbHVlIGlzIG1pc3NpbmcgdGhlbiB3ZSBjYW5ub3QgZG8gdGhpcy5cbiAgLy8gSW4gc3VjaCBhIGNhc2Ugd2UgZmFsbCBiYWNrIG9uIHRoZSBgY29va2VkYCB2ZXJzaW9uIGFuZCBhc3N1bWUgdGhhdCB0aGUgYEJMT0NLX01BUktFUmAgd2FzIG5vdFxuICAvLyBlc2NhcGVkLlxuXG4gIC8vIFRoaXMgc2hvdWxkIGJlIE9LIGJlY2F1c2Ugc3ludGhlc2l6ZWQgbm9kZXMgb25seSBjb21lIGZyb20gdGhlIEFuZ3VsYXIgdGVtcGxhdGUgY29tcGlsZXIsIHdoaWNoXG4gIC8vIGFsd2F5cyBwcm92aWRlcyBmdWxsIGlkIGFuZCBwbGFjZWhvbGRlciBuYW1lIGluZm9ybWF0aW9uIHNvIGl0IHdpbGwgbmV2ZXIgZXNjYXBlIGBCTE9DS19NQVJLRVJgXG4gIC8vIGNoYXJhY3RlcnMuXG4gIGlmICgocmF3IHx8IGNvb2tlZCkuY2hhckF0KDApICE9PSBCTE9DS19NQVJLRVIpIHtcbiAgICByZXR1cm4ge3RleHQ6IGNvb2tlZH07XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgZW5kT2ZCbG9jayA9IGNvb2tlZC5pbmRleE9mKEJMT0NLX01BUktFUiwgMSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGJsb2NrOiBjb29rZWQuc3Vic3RyaW5nKDEsIGVuZE9mQmxvY2spLFxuICAgICAgdGV4dDogY29va2VkLnN1YnN0cmluZyhlbmRPZkJsb2NrICsgMSksXG4gICAgfTtcbiAgfVxufVxuIl19
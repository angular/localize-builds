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
    return {
        messageId: metadata.id || computeMsgId(messageString, metadata.meaning || ''),
        substitutions,
        messageString,
        meaning: metadata.meaning || '',
        description: metadata.description || '',
        messageParts: cleanedMessageParts, placeholderNames,
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
    const { text, block } = splitBlock(cooked, raw);
    if (block === undefined) {
        return { text, meaning: undefined, description: undefined, id: undefined };
    }
    else {
        const [meaningAndDesc, id] = block.split(ID_SEPARATOR, 2);
        let [meaning, description] = meaningAndDesc.split(MEANING_SEPARATOR, 2);
        if (description === undefined) {
            description = meaning;
            meaning = undefined;
        }
        if (description === '') {
            description = undefined;
        }
        return { text, meaning, description, id };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdXRpbHMvc3JjL21lc3NhZ2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUxRTs7O0dBR0c7QUFDSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUE0RS9DOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsWUFBWSxDQUN4QixZQUFrQyxFQUFFLFdBQTRCO0lBQ2xFLE1BQU0sYUFBYSxHQUFxQyxFQUFFLENBQUM7SUFDM0QsTUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckUsTUFBTSxtQkFBbUIsR0FBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0RCxNQUFNLGdCQUFnQixHQUFhLEVBQUUsQ0FBQztJQUN0QyxJQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ2xDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzVDLE1BQU0sRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxlQUFlLEdBQUcsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLEVBQUMsR0FDekUsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckQsYUFBYSxJ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QUssSUFBSSxXQUFXLEdBQUcsQ0FBQyxFQUFFLFFBQVEsR0FBRyxDQUFDLEVBQUUsV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUU7UUFDOUYsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQzFCLFFBQVEsRUFBRSxDQUFDO1NBQ1o7YUFBTSxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxZQUFZLEVBQUU7WUFDL0MsT0FBTyxXQUFXLENBQUM7U0FDcEI7S0FDRjtJQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsNkNBQTZDLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDeEUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7Y29tcHV0ZU1zZ0lkfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5pbXBvcnQge0JMT0NLX01BUktFUiwgSURfU0VQQVJBVE9SLCBNRUFOSU5HX1NFUEFSQVRPUn0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG4vKipcbiAqIFJlLWV4cG9ydCB0aGlzIGhlbHBlciBmdW5jdGlvbiBzbyB0aGF0IHVzZXJzIG9mIGBAYW5ndWxhci9sb2NhbGl6ZWAgZG9uJ3QgbmVlZCB0byBhY3RpdmVseSBpbXBvcnRcbiAqIGZyb20gYEBhbmd1bGFyL2NvbXBpbGVyYC5cbiAqL1xuZXhwb3J0IHtjb21wdXRlTXNnSWR9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcblxuLyoqXG4gKiBBIHN0cmluZyBjb250YWluaW5nIGEgdHJhbnNsYXRpb24gc291cmNlIG1lc3NhZ2UuXG4gKlxuICogSS5FLiB0aGUgbWVzc2FnZSB0aGF0IGluZGljYXRlcyB3aGF0IHdpbGwgYmUgdHJhbnNsYXRlZCBmcm9tLlxuICpcbiAqIFVzZXMgYHskcGxhY2Vob2xkZXItbmFtZX1gIHRvIGluZGljYXRlIGEgcGxhY2Vob2xkZXIuXG4gKi9cbmV4cG9ydCB0eXBlIFNvdXJjZU1lc3NhZ2UgPSBzdHJpbmc7XG5cbi8qKlxuICogQSBzdHJpbmcgY29udGFpbmluZyBhIHRyYW5zbGF0aW9uIHRhcmdldCBtZXNzYWdlLlxuICpcbiAqIEkuRS4gdGhlIG1lc3NhZ2UgdGhhdCBpbmRpY2F0ZXMgd2hhdCB3aWxsIGJlIHRyYW5zbGF0ZWQgdG8uXG4gKlxuICogVXNlcyBgeyRwbGFjZWhvbGRlci1uYW1lfWAgdG8gaW5kaWNhdGUgYSBwbGFjZWhvbGRlci5cbiAqL1xuZXhwb3J0IHR5cGUgVGFyZ2V0TWVzc2FnZSA9IHN0cmluZztcblxuLyoqXG4gKiBBIHN0cmluZyB0aGF0IHVuaXF1ZWx5IGlkZW50aWZpZXMgYSBtZXNzYWdlLCB0byBiZSB1c2VkIGZvciBtYXRjaGluZyB0cmFuc2xhdGlvbnMuXG4gKi9cbmV4cG9ydCB0eXBlIE1lc3NhZ2VJZCA9IHN0cmluZztcblxuLyoqXG4gKiBJbmZvcm1hdGlvbiBwYXJzZWQgZnJvbSBhIGAkbG9jYWxpemVgIHRhZ2dlZCBzdHJpbmcgdGhhdCBpcyB1c2VkIHRvIHRyYW5zbGF0ZSBpdC5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGBcbiAqIGNvbnN0IG5hbWUgPSAnSm8gQmxvZ2dzJztcbiAqICRsb2NhbGl6ZWBIZWxsbyAke25hbWV9OnRpdGxlIWA7XG4gKiBgYGBcbiAqXG4gKiBNYXkgYmUgcGFyc2VkIGludG86XG4gKlxuICogYGBgXG4gKiB7XG4gKiAgIG1lc3NhZ2VJZDogJzY5OTgxOTQ1MDc1OTc3MzA1OTEnLFxuICogICBzdWJzdGl0dXRpb25zOiB7IHRpdGxlOiAnSm8gQmxvZ2dzJyB9LFxuICogICBtZXNzYWdlU3RyaW5nOiAnSGVsbG8geyR0aXRsZX0hJyxcbiAqIH1cbiAqIGBgYFxuICovXG5leHBvcnQgaW50ZXJmYWNlIFBhcnNlZE1lc3NhZ2Uge1xuICAvKipcbiAgICogVGhlIGtleSB1c2VkIHRvIGxvb2sgdXAgdGhlIGFwcHJvcHJpYXRlIHRyYW5zbGF0aW9uIHRhcmdldC5cbiAgICovXG4gIG1lc3NhZ2VJZDogTWVzc2FnZUlkO1xuICAvKipcbiAgICogQSBtYXBwaW5nIG9mIHBsYWNlaG9sZGVyIG5hbWVzIHRvIHN1YnN0aXR1dGlvbiB2YWx1ZXMuXG4gICAqL1xuICBzdWJzdGl0dXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICAvKipcbiAgICogQSBodW1hbiByZWFkYWJsZSByZW5kZXJpbmcgb2YgdGhlIG1lc3NhZ2VcbiAgICovXG4gIG1lc3NhZ2VTdHJpbmc6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBtZWFuaW5nIG9mIHRoZSBgbWVzc2FnZWAsIHVzZWQgdG8gZGlzdGluZ3Vpc2ggaWRlbnRpY2FsIGBtZXNzYWdlU3RyaW5nYHMuXG4gICAqL1xuICBtZWFuaW5nOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgZGVzY3JpcHRpb24gb2YgdGhlIGBtZXNzYWdlYCwgdXNlZCB0byBhaWQgdHJhbnNsYXRpb24uXG4gICAqL1xuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIHN0YXRpYyBwYXJ0cyBvZiB0aGUgbWVzc2FnZS5cbiAgICovXG4gIG1lc3NhZ2VQYXJ0czogc3RyaW5nW107XG4gIC8qKlxuICAgKiBUaGUgbmFtZXMgb2YgdGhlIHBsYWNlaG9sZGVycyB0aGF0IHdpbGwgYmUgcmVwbGFjZWQgd2l0aCBzdWJzdGl0dXRpb25zLlxuICAgKi9cbiAgcGxhY2Vob2xkZXJOYW1lczogc3RyaW5nW107XG59XG5cbi8qKlxuICogUGFyc2UgYSBgJGxvY2FsaXplYCB0YWdnZWQgc3RyaW5nIGludG8gYSBzdHJ1Y3R1cmUgdGhhdCBjYW4gYmUgdXNlZCBmb3IgdHJhbnNsYXRpb24uXG4gKlxuICogU2VlIGBQYXJzZWRNZXNzYWdlYCBmb3IgYW4gZXhhbXBsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTWVzc2FnZShcbiAgICBtZXNzYWdlUGFydHM6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCBleHByZXNzaW9ucz86IHJlYWRvbmx5IGFueVtdKTogUGFyc2VkTWVzc2FnZSB7XG4gIGNvbnN0IHN1YnN0aXR1dGlvbnM6IHtbcGxhY2Vob2xkZXJOYW1lOiBzdHJpbmddOiBhbnl9ID0ge307XG4gIGNvbnN0IG1ldGFkYXRhID0gcGFyc2VNZXRhZGF0YShtZXNzYWdlUGFydHNbMF0sIG1lc3NhZ2VQYXJ0cy5yYXdbMF0pO1xuICBjb25zdCBjbGVhbmVkTWVzc2FnZVBhcnRzOiBzdHJpbmdbXSA9IFttZXRhZGF0YS50ZXh0XTtcbiAgY29uc3QgcGxhY2Vob2xkZXJOYW1lczogc3RyaW5nW10gPSBbXTtcbiAgbGV0IG1lc3NhZ2VTdHJpbmcgPSBtZXRhZGF0YS50ZXh0O1xuICBmb3IgKGxldCBpID0gMTsgaSA8IG1lc3NhZ2VQYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHt0ZXh0OiBtZXNzYWdlUGFydCwgYmxvY2s6IHBsYWNlaG9sZGVyTmFtZSA9IGNvbXB1dGVQbGFjZWhvbGRlck5hbWUoaSl9ID1cbiAgICAgICAgc3BsaXRCbG9jayhtZXNzYWdlUGFydHNbaV0sIG1lc3NhZ2VQYXJ0cy5yYXdbaV0pO1xuICAgIG1lc3NhZ2VTdHJpbmcgKz0gYHskJHtwbGFjZWhvbGRlck5hbWV9fSR7bWVzc2FnZVBhcnR9YDtcbiAgICBpZiAoZXhwcmVzc2lvbnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgc3Vic3RpdHV0aW9uc1twbGFjZWhvbGRlck5hbWVdID0gZXhwcmVzc2lvbnNbaSAtIDFdO1xuICAgIH1cbiAgICBwbGFjZWhvbGRlck5hbWVzLnB1c2gocGxhY2Vob2xkZXJOYW1lKTtcbiAgICBjbGVhbmVkTWVzc2FnZVBhcnRzLnB1c2gobWVzc2FnZVBhcnQpO1xuICB9XG4gIHJldHVybiB7XG4gICAgbWVzc2FnZUlkOiBtZXRhZGF0YS5pZCB8fCBjb21wdXRlTXNnSWQobWVzc2FnZVN0cmluZywgbWV0YWRhdGEubWVhbmluZyB8fCAnJyksXG4gICAgc3Vic3RpdHV0aW9ucyxcbiAgICBtZXNzYWdlU3RyaW5nLFxuICAgIG1lYW5pbmc6IG1ldGFkYXRhLm1lYW5pbmcgfHwgJycsXG4gICAgZGVzY3JpcHRpb246IG1ldGFkYXRhLmRlc2NyaXB0aW9uIHx8ICcnLFxuICAgIG1lc3NhZ2VQYXJ0czogY2xlYW5lZE1lc3NhZ2VQYXJ0cywgcGxhY2Vob2xkZXJOYW1lcyxcbiAgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNZXNzYWdlTWV0YWRhdGEge1xuICB0ZXh0OiBzdHJpbmc7XG4gIG1lYW5pbmc6IHN0cmluZ3x1bmRlZmluZWQ7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmd8dW5kZWZpbmVkO1xuICBpZDogc3RyaW5nfHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gbWVzc2FnZSBwYXJ0IChgY29va2VkYCArIGByYXdgKSB0byBleHRyYWN0IHRoZSBtZXNzYWdlIG1ldGFkYXRhIGZyb20gdGhlIHRleHQuXG4gKlxuICogSWYgdGhlIG1lc3NhZ2UgcGFydCBoYXMgYSBtZXRhZGF0YSBibG9jayB0aGlzIGZ1bmN0aW9uIHdpbGwgZXh0cmFjdCB0aGUgYG1lYW5pbmdgLFxuICogYGRlc2NyaXB0aW9uYCBhbmQgYGlkYCAoaWYgcHJvdmlkZWQpIGZyb20gdGhlIGJsb2NrLiBUaGVzZSBtZXRhZGF0YSBwcm9wZXJ0aWVzIGFyZSBzZXJpYWxpemVkIGluXG4gKiB0aGUgc3RyaW5nIGRlbGltaXRlZCBieSBgfGAgYW5kIGBAQGAgcmVzcGVjdGl2ZWx5LlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYHRzXG4gKiBgOm1lYW5pbmd8ZGVzY3JpcHRpb25AQGlkYFxuICogYDptZWFuaW5nfEBAaWRgXG4gKiBgOm1lYW5pbmd8ZGVzY3JpcHRpb25gXG4gKiBgZGVzY3JpcHRpb25AQGlkYFxuICogYG1lYW5pbmd8YFxuICogYGRlc2NyaXB0aW9uYFxuICogYEBAaWRgXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gY29va2VkIFRoZSBjb29rZWQgdmVyc2lvbiBvZiB0aGUgbWVzc2FnZSBwYXJ0IHRvIHBhcnNlLlxuICogQHBhcmFtIHJhdyBUaGUgcmF3IHZlcnNpb24gb2YgdGhlIG1lc3NhZ2UgcGFydCB0byBwYXJzZS5cbiAqIEByZXR1cm5zIEEgb2JqZWN0IGNvbnRhaW5pbmcgYW55IG1ldGFkYXRhIHRoYXQgd2FzIHBhcnNlZCBmcm9tIHRoZSBtZXNzYWdlIHBhcnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZU1ldGFkYXRhKGNvb2tlZDogc3RyaW5nLCByYXc6IHN0cmluZyk6IE1lc3NhZ2VNZXRhZGF0YSB7XG4gIGNvbnN0IHt0ZXh0LCBibG9ja30gPSBzcGxpdEJsb2NrKGNvb2tlZCwgcmF3KTtcbiAgaWYgKGJsb2NrID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4ge3RleHQsIG1lYW5pbmc6IHVuZGVmaW5lZCwgZGVzY3JpcHRpb246IHVuZGVmaW5lZCwgaWQ6IHVuZGVmaW5lZH07XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgW21lYW5pbmdBbmREZXNjLCBpZF0gPSBibG9jay5zcGxpdChJRF9TRVBBUkFUT1IsIDIpO1xuICAgIGxldCBbbWVhbmluZywgZGVzY3JpcHRpb25dOiAoc3RyaW5nIHwgdW5kZWZpbmVkKVtdID0gbWVhbmluZ0FuZERlc2Muc3BsaXQoTUVBTklOR19TRVBBUkFUT1IsIDIpO1xuICAgIGlmIChkZXNjcmlwdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZXNjcmlwdGlvbiA9IG1lYW5pbmc7XG4gICAgICBtZWFuaW5nID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAoZGVzY3JpcHRpb24gPT09ICcnKSB7XG4gICAgICBkZXNjcmlwdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHt0ZXh0LCBtZWFuaW5nLCBkZXNjcmlwdGlvbiwgaWR9O1xuICB9XG59XG5cbi8qKlxuICogU3BsaXQgYSBtZXNzYWdlIHBhcnQgKGBjb29rZWRgICsgYHJhd2ApIGludG8gYW4gb3B0aW9uYWwgZGVsaW1pdGVkIFwiYmxvY2tcIiBvZmYgdGhlIGZyb250IGFuZCB0aGVcbiAqIHJlc3Qgb2YgdGhlIHRleHQgb2YgdGhlIG1lc3NhZ2UgcGFydC5cbiAqXG4gKiBCbG9ja3MgYXBwZWFyIGF0IHRoZSBzdGFydCBvZiBtZXNzYWdlIHBhcnRzLiBUaGV5IGFyZSBkZWxpbWl0ZWQgYnkgYSBjb2xvbiBgOmAgY2hhcmFjdGVyIGF0IHRoZVxuICogc3RhcnQgYW5kIGVuZCBvZiB0aGUgYmxvY2suXG4gKlxuICogSWYgdGhlIGJsb2NrIGlzIGluIHRoZSBmaXJzdCBtZXNzYWdlIHBhcnQgdGhlbiBpdCB3aWxsIGJlIG1ldGFkYXRhIGFib3V0IHRoZSB3aG9sZSBtZXNzYWdlOlxuICogbWVhbmluZywgZGVzY3JpcHRpb24sIGlkLiAgT3RoZXJ3aXNlIGl0IHdpbGwgYmUgbWV0YWRhdGEgYWJvdXQgdGhlIGltbWVkaWF0ZWx5IHByZWNlZGluZ1xuICogc3Vic3RpdHV0aW9uOiBwbGFjZWhvbGRlciBuYW1lLlxuICpcbiAqIFNpbmNlIGJsb2NrcyBhcmUgb3B0aW9uYWwsIGl0IGlzIHBvc3NpYmxlIHRoYXQgdGhlIGNvbnRlbnQgb2YgYSBtZXNzYWdlIGJsb2NrIGFjdHVhbGx5IHN0YXJ0c1xuICogd2l0aCBhIGJsb2NrIG1hcmtlci4gSW4gdGhpcyBjYXNlIHRoZSBtYXJrZXIgbXVzdCBiZSBlc2NhcGVkIGBcXDpgLlxuICpcbiAqIC0tLVxuICpcbiAqIElmIHRoZSB0ZW1wbGF0ZSBsaXRlcmFsIHdhcyBzeW50aGVzaXplZCBhbmQgZG93bmxldmVsZWQgYnkgVHlwZVNjcmlwdCB0byBFUzUgdGhlbiBpdHNcbiAqIHJhdyBhcnJheSB3aWxsIG9ubHkgY29udGFpbiBlbXB0eSBzdHJpbmdzLiBUaGlzIGlzIGJlY2F1c2UgdGhlIGN1cnJlbnQgVHlwZVNjcmlwdCBjb21waWxlciB1c2VzXG4gKiB0aGUgb3JpZ2luYWwgc291cmNlIGNvZGUgdG8gZmluZCB0aGUgcmF3IHRleHQgYW5kIGluIHRoZSBjYXNlIG9mIHN5bnRoZXNpemVkIEFTVCBub2RlcywgdGhlcmUgaXNcbiAqIG5vIHNvdXJjZSBjb2RlIHRvIGRyYXcgdXBvbi5cbiAqXG4gKiBUaGUgd29ya2Fyb3VuZCBpbiB0aGlzIGZ1bmN0aW9uIGlzIHRvIGFzc3VtZSB0aGF0IHRoZSB0ZW1wbGF0ZSBsaXRlcmFsIGRpZCBub3QgY29udGFpbiBhbiBlc2NhcGVkXG4gKiBwbGFjZWhvbGRlciBuYW1lLCBhbmQgZmFsbCBiYWNrIG9uIGNoZWNraW5nIHRoZSBjb29rZWQgYXJyYXkgaW5zdGVhZC5cbiAqIFRoaXMgaXMgYSBsaW1pdGF0aW9uIGlmIGNvbXBpbGluZyB0byBFUzUgaW4gVHlwZVNjcmlwdCBidXQgaXMgbm90IGEgcHJvYmxlbSBpZiB0aGUgVHlwZVNjcmlwdFxuICogb3V0cHV0IGlzIEVTMjAxNSBhbmQgdGhlIGNvZGUgaXMgZG93bmxldmVsbGVkIGJ5IGEgc2VwYXJhdGUgdG9vbCBhcyBoYXBwZW5zIGluIHRoZSBBbmd1bGFyIENMSS5cbiAqXG4gKiBAcGFyYW0gY29va2VkIFRoZSBjb29rZWQgdmVyc2lvbiBvZiB0aGUgbWVzc2FnZSBwYXJ0IHRvIHBhcnNlLlxuICogQHBhcmFtIHJhdyBUaGUgcmF3IHZlcnNpb24gb2YgdGhlIG1lc3NhZ2UgcGFydCB0byBwYXJzZS5cbiAqIEByZXR1cm5zIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBgdGV4dGAgb2YgdGhlIG1lc3NhZ2UgcGFydCBhbmQgdGhlIHRleHQgb2YgdGhlIGBibG9ja2AsIGlmIGl0XG4gKiBleGlzdHMuXG4gKiBAdGhyb3dzIGFuIGVycm9yIGlmIHRoZSBgYmxvY2tgIGlzIHVudGVybWluYXRlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gc3BsaXRCbG9jayhjb29rZWQ6IHN0cmluZywgcmF3OiBzdHJpbmcpOiB7dGV4dDogc3RyaW5nLCBibG9jaz86IHN0cmluZ30ge1xuICByYXcgPSByYXcgfHwgY29va2VkO1xuICBpZiAocmF3LmNoYXJBdCgwKSAhPT0gQkxPQ0tfTUFSS0VSKSB7XG4gICAgcmV0dXJuIHt0ZXh0OiBjb29rZWR9O1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGVuZE9mQmxvY2sgPSBmaW5kRW5kT2ZCbG9jayhjb29rZWQsIHJhdyk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGJsb2NrOiBjb29rZWQuc3Vic3RyaW5nKDEsIGVuZE9mQmxvY2spLFxuICAgICAgdGV4dDogY29va2VkLnN1YnN0cmluZyhlbmRPZkJsb2NrICsgMSksXG4gICAgfTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGNvbXB1dGVQbGFjZWhvbGRlck5hbWUoaW5kZXg6IG51bWJlcikge1xuICByZXR1cm4gaW5kZXggPT09IDEgPyAnUEgnIDogYFBIXyR7aW5kZXggLSAxfWA7XG59XG5cbi8qKlxuICogRmluZCB0aGUgZW5kIG9mIGEgXCJtYXJrZWQgYmxvY2tcIiBpbmRpY2F0ZWQgYnkgdGhlIGZpcnN0IG5vbi1lc2NhcGVkIGNvbG9uLlxuICpcbiAqIEBwYXJhbSBjb29rZWQgVGhlIGNvb2tlZCBzdHJpbmcgKHdoZXJlIGVzY2FwZWQgY2hhcnMgaGF2ZSBiZWVuIHByb2Nlc3NlZClcbiAqIEBwYXJhbSByYXcgVGhlIHJhdyBzdHJpbmcgKHdoZXJlIGVzY2FwZSBzZXF1ZW5jZXMgYXJlIHN0aWxsIGluIHBsYWNlKVxuICpcbiAqIEByZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgZW5kIG9mIGJsb2NrIG1hcmtlclxuICogQHRocm93cyBhbiBlcnJvciBpZiB0aGUgYmxvY2sgaXMgdW50ZXJtaW5hdGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kRW5kT2ZCbG9jayhjb29rZWQ6IHN0cmluZywgcmF3OiBzdHJpbmcpOiBudW1iZXIge1xuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICogVGhpcyBmdW5jdGlvbiBpcyByZXBlYXRlZCBpbiBgc3JjL2xvY2FsaXplL3NyYy9sb2NhbGl6ZS50c2AgYW5kIHRoZSB0d28gc2hvdWxkIGJlIGtlcHQgaW4gc3luYy5cbiAgKiAoU2VlIHRoYXQgZmlsZSBmb3IgbW9yZSBleHBsYW5hdGlvbiBvZiB3aHkuKVxuICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gIGZvciAobGV0IGNvb2tlZEluZGV4ID0gMSwgcmF3SW5kZXggPSAxOyBjb29rZWRJbmRleCA8IGNvb2tlZC5sZW5ndGg7IGNvb2tlZEluZGV4KyssIHJhd0luZGV4KyspIHtcbiAgICBpZiAocmF3W3Jhd0luZGV4XSA9PT0gJ1xcXFwnKSB7XG4gICAgICByYXdJbmRleCsrO1xuICAgIH0gZWxzZSBpZiAoY29va2VkW2Nvb2tlZEluZGV4XSA9PT0gQkxPQ0tfTUFSS0VSKSB7XG4gICAgICByZXR1cm4gY29va2VkSW5kZXg7XG4gICAgfVxuICB9XG4gIHRocm93IG5ldyBFcnJvcihgVW50ZXJtaW5hdGVkICRsb2NhbGl6ZSBtZXRhZGF0YSBibG9jayBpbiBcIiR7cmF3fVwiLmApO1xufSJdfQ==
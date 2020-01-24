/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BLOCK_MARKER } from './constants';
import { parseMessage } from './messages';
export class MissingTranslationError extends Error {
    constructor(parsedMessage) {
        super(`No translation found for ${describeMessage(parsedMessage)}.`);
        this.parsedMessage = parsedMessage;
        this.type = 'MissingTranslationError';
    }
}
export function isMissingTranslationError(e) {
    return e.type === 'MissingTranslationError';
}
/**
 * Translate the text of the `$localize` tagged-string (i.e. `messageParts` and
 * `substitutions`) using the given `translations`.
 *
 * The tagged-string is parsed to extract its `messageId` which is used to find an appropriate
 * `ParsedTranslation`. If this doesn't match and there are legacy ids then try matching a
 * translation using those.
 *
 * If one is found then it is used to translate the message into a new set of `messageParts` and
 * `substitutions`.
 * The translation may reorder (or remove) substitutions as appropriate.
 *
 * If there is no translation with a matching message id then an error is thrown.
 * If a translation contains a placeholder that is not found in the message being translated then an
 * error is thrown.
 */
export function translate(translations, messageParts, substitutions) {
    const message = parseMessage(messageParts, substitutions);
    // Look up the translation using the messageId, and then the legacyId if available.
    let translation = translations[message.messageId];
    // If the messageId did not match a translation, try matching the legacy ids instead
    for (let i = 0; i < message.legacyIds.length && translation === undefined; i++) {
        translation = translations[message.legacyIds[i]];
    }
    if (translation === undefined) {
        throw new MissingTranslationError(message);
    }
    return [
        translation.messageParts, translation.placeholderNames.map(placeholder => {
            if (message.substitutions.hasOwnProperty(placeholder)) {
                return message.substitutions[placeholder];
            }
            else {
                throw new Error(`No placeholder found with name ${placeholder} in message ${describeMessage(message)}.`);
            }
        })
    ];
}
/**
 * Parse the `messageParts` and `placeholderNames` out of a target `message`.
 *
 * Used by `loadTranslations()` to convert target message strings into a structure that is more
 * appropriate for doing translation.
 *
 * @param message the message to be parsed.
 */
export function parseTranslation(message) {
    const parts = message.split(/{\$([^}]*)}/);
    const messageParts = [parts[0]];
    const placeholderNames = [];
    for (let i = 1; i < parts.length - 1; i += 2) {
        placeholderNames.push(parts[i]);
        messageParts.push(`${parts[i + 1]}`);
    }
    const rawMessageParts = messageParts.map(part => part.charAt(0) === BLOCK_MARKER ? '\\' + part : part);
    return { messageParts: makeTemplateObject(messageParts, rawMessageParts), placeholderNames };
}
/**
 * Create a `ParsedTranslation` from a set of `messageParts` and `placeholderNames`.
 *
 * @param messageParts The message parts to appear in the ParsedTranslation.
 * @param placeholderNames The names of the placeholders to intersperse between the `messageParts`.
 */
export function makeParsedTranslation(messageParts, placeholderNames = []) {
    return { messageParts: makeTemplateObject(messageParts, messageParts), placeholderNames };
}
/**
 * Create the specialized array that is passed to tagged-string tag functions.
 *
 * @param cooked The message parts with their escape codes processed.
 * @param raw The message parts with their escaped codes as-is.
 */
export function makeTemplateObject(cooked, raw) {
    Object.defineProperty(cooked, 'raw', { value: raw });
    return cooked;
}
function describeMessage(message) {
    const meaningString = message.meaning && ` - "${message.meaning}"`;
    return `"${message.messageId}" ("${message.messageString}"${meaningString})`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3V0aWxzL3NyYy90cmFuc2xhdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN6QyxPQUFPLEVBQTBDLFlBQVksRUFBQyxNQUFNLFlBQVksQ0FBQztBQWdCakYsTUFBTSxPQUFPLHVCQUF3QixTQUFRLEtBQUs7SUFFaEQsWUFBcUIsYUFBNEI7UUFDL0MsS0FBSyxDQUFDLDRCQUE0QixlQUFlLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRGxELGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBRGhDLFNBQUksR0FBRyx5QkFBeUIsQ0FBQztJQUdsRCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLFVBQVUseUJBQXlCLENBQUMsQ0FBTTtJQUM5QyxPQUFPLENBQUMsQ0FBQyxJQUFJLEtBQUsseUJBQXlCLENBQUM7QUFDOUMsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE1BQU0sVUFBVSxTQUFTLENBQ3JCLFlBQStDLEVBQUUsWUFBa0MsRUFDbkYsYUFBNkI7SUFDL0IsTUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUMsQ0FBQztJQUMxRCxtRkFBbUY7SUFDbkYsSUFBSSxXQUFXLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNsRCxvRkFBb0Y7SUFDcEYsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLFdBQVcsS0FBSyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDOUUsV0FBVyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEQ7SUFDRCxJQUFJLFdBQVcsS0FBSyxTQUFTLEVBQUU7UUFDN0IsTUFBTSxJQUFJLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzVDO0lBQ0QsT0FBTztRQUNMLFdBQVcsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUN2RSxJQUFJLE9BQU8sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxFQUFFO2dCQUNyRCxPQUFPLE9BQU8sQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDM0M7aUJBQU07Z0JBQ0wsTUFBTSxJQUFJLEtBQUssQ0FDWCxrQ0FBa0MsV0FBVyxlQUFlLGVBQWUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDOUY7UUFDSCxDQUFDLENBQUM7S0FDSCxDQUFDO0FBQ0osQ0FBQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLFVBQVUsZ0JBQWdCLENBQUMsT0FBc0I7SUFDckQsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUMzQyxNQUFNLFlBQVksR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLE1BQU0sZ0JBQWdCLEdBQWEsRUFBRSxDQUFDO0lBQ3RDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQzVDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDdEM7SUFDRCxNQUFNLGVBQWUsR0FDakIsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuRixPQUFPLEVBQUMsWUFBWSxFQUFFLGtCQUFrQixDQUFDLFlBQVksRUFBRSxlQUFlLENBQUMsRUFBRSxnQkFBZ0IsRUFBQyxDQUFDO0FBQzdGLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxxQkFBcUIsQ0FDakMsWUFBc0IsRUFBRSxtQkFBNkIsRUFBRTtJQUN6RCxPQUFPLEVBQUMsWUFBWSxFQUFFLGtCQUFrQixDQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsRUFBRSxnQkFBZ0IsRUFBQyxDQUFDO0FBQzFGLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxrQkFBa0IsQ0FBQyxNQUFnQixFQUFFLEdBQWE7SUFDaEUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUM7SUFDbkQsT0FBTyxNQUFhLENBQUM7QUFDdkIsQ0FBQztBQUdELFNBQVMsZUFBZSxDQUFDLE9BQXNCO0lBQzdDLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksT0FBTyxPQUFPLENBQUMsT0FBTyxHQUFHLENBQUM7SUFDbkUsT0FBTyxJQUFJLE9BQU8sQ0FBQyxTQUFTLE9BQU8sT0FBTyxDQUFDLGFBQWEsSUFBSSxhQUFhLEdBQUcsQ0FBQztBQUMvRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtCTE9DS19NQVJLRVJ9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7TWVzc2FnZUlkLCBQYXJzZWRNZXNzYWdlLCBUYXJnZXRNZXNzYWdlLCBwYXJzZU1lc3NhZ2V9IGZyb20gJy4vbWVzc2FnZXMnO1xuXG5cbi8qKlxuICogQSB0cmFuc2xhdGlvbiBtZXNzYWdlIHRoYXQgaGFzIGJlZW4gcHJvY2Vzc2VkIHRvIGV4dHJhY3QgdGhlIG1lc3NhZ2UgcGFydHMgYW5kIHBsYWNlaG9sZGVycy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQYXJzZWRUcmFuc2xhdGlvbiB7XG4gIG1lc3NhZ2VQYXJ0czogVGVtcGxhdGVTdHJpbmdzQXJyYXk7XG4gIHBsYWNlaG9sZGVyTmFtZXM6IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIFRoZSBpbnRlcm5hbCBzdHJ1Y3R1cmUgdXNlZCBieSB0aGUgcnVudGltZSBsb2NhbGl6YXRpb24gdG8gdHJhbnNsYXRlIG1lc3NhZ2VzLlxuICovXG5leHBvcnQgdHlwZSBQYXJzZWRUcmFuc2xhdGlvbnMgPSBSZWNvcmQ8TWVzc2FnZUlkLCBQYXJzZWRUcmFuc2xhdGlvbj47XG5cbmV4cG9ydCBjbGFzcyBNaXNzaW5nVHJhbnNsYXRpb25FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgcHJpdmF0ZSByZWFkb25seSB0eXBlID0gJ01pc3NpbmdUcmFuc2xhdGlvbkVycm9yJztcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgcGFyc2VkTWVzc2FnZTogUGFyc2VkTWVzc2FnZSkge1xuICAgIHN1cGVyKGBObyB0cmFuc2xhdGlvbiBmb3VuZCBmb3IgJHtkZXNjcmliZU1lc3NhZ2UocGFyc2VkTWVzc2FnZSl9LmApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc01pc3NpbmdUcmFuc2xhdGlvbkVycm9yKGU6IGFueSk6IGUgaXMgTWlzc2luZ1RyYW5zbGF0aW9uRXJyb3Ige1xuICByZXR1cm4gZS50eXBlID09PSAnTWlzc2luZ1RyYW5zbGF0aW9uRXJyb3InO1xufVxuXG4vKipcbiAqIFRyYW5zbGF0ZSB0aGUgdGV4dCBvZiB0aGUgYCRsb2NhbGl6ZWAgdGFnZ2VkLXN0cmluZyAoaS5lLiBgbWVzc2FnZVBhcnRzYCBhbmRcbiAqIGBzdWJzdGl0dXRpb25zYCkgdXNpbmcgdGhlIGdpdmVuIGB0cmFuc2xhdGlvbnNgLlxuICpcbiAqIFRoZSB0YWdnZWQtc3RyaW5nIGlzIHBhcnNlZCB0byBleHRyYWN0IGl0cyBgbWVzc2FnZUlkYCB3aGljaCBpcyB1c2VkIHRvIGZpbmQgYW4gYXBwcm9wcmlhdGVcbiAqIGBQYXJzZWRUcmFuc2xhdGlvbmAuIElmIHRoaXMgZG9lc24ndCBtYXRjaCBhbmQgdGhlcmUgYXJlIGxlZ2FjeSBpZHMgdGhlbiB0cnkgbWF0Y2hpbmcgYVxuICogdHJhbnNsYXRpb24gdXNpbmcgdGhvc2UuXG4gKlxuICogSWYgb25lIGlzIGZvdW5kIHRoZW4gaXQgaXMgdXNlZCB0byB0cmFuc2xhdGUgdGhlIG1lc3NhZ2UgaW50byBhIG5ldyBzZXQgb2YgYG1lc3NhZ2VQYXJ0c2AgYW5kXG4gKiBgc3Vic3RpdHV0aW9uc2AuXG4gKiBUaGUgdHJhbnNsYXRpb24gbWF5IHJlb3JkZXIgKG9yIHJlbW92ZSkgc3Vic3RpdHV0aW9ucyBhcyBhcHByb3ByaWF0ZS5cbiAqXG4gKiBJZiB0aGVyZSBpcyBubyB0cmFuc2xhdGlvbiB3aXRoIGEgbWF0Y2hpbmcgbWVzc2FnZSBpZCB0aGVuIGFuIGVycm9yIGlzIHRocm93bi5cbiAqIElmIGEgdHJhbnNsYXRpb24gY29udGFpbnMgYSBwbGFjZWhvbGRlciB0aGF0IGlzIG5vdCBmb3VuZCBpbiB0aGUgbWVzc2FnZSBiZWluZyB0cmFuc2xhdGVkIHRoZW4gYW5cbiAqIGVycm9yIGlzIHRocm93bi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zbGF0ZShcbiAgICB0cmFuc2xhdGlvbnM6IFJlY29yZDxzdHJpbmcsIFBhcnNlZFRyYW5zbGF0aW9uPiwgbWVzc2FnZVBhcnRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSxcbiAgICBzdWJzdGl0dXRpb25zOiByZWFkb25seSBhbnlbXSk6IFtUZW1wbGF0ZVN0cmluZ3NBcnJheSwgcmVhZG9ubHkgYW55W11dIHtcbiAgY29uc3QgbWVzc2FnZSA9IHBhcnNlTWVzc2FnZShtZXNzYWdlUGFydHMsIHN1YnN0aXR1dGlvbnMpO1xuICAvLyBMb29rIHVwIHRoZSB0cmFuc2xhdGlvbiB1c2luZyB0aGUgbWVzc2FnZUlkLCBhbmQgdGhlbiB0aGUgbGVnYWN5SWQgaWYgYXZhaWxhYmxlLlxuICBsZXQgdHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvbnNbbWVzc2FnZS5tZXNzYWdlSWRdO1xuICAvLyBJZiB0aGUgbWVzc2FnZUlkIGRpZCBub3QgbWF0Y2ggYSB0cmFuc2xhdGlvbiwgdHJ5IG1hdGNoaW5nIHRoZSBsZWdhY3kgaWRzIGluc3RlYWRcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZXNzYWdlLmxlZ2FjeUlkcy5sZW5ndGggJiYgdHJhbnNsYXRpb24gPT09IHVuZGVmaW5lZDsgaSsrKSB7XG4gICAgdHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvbnNbbWVzc2FnZS5sZWdhY3lJZHNbaV1dO1xuICB9XG4gIGlmICh0cmFuc2xhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IE1pc3NpbmdUcmFuc2xhdGlvbkVycm9yKG1lc3NhZ2UpO1xuICB9XG4gIHJldHVybiBbXG4gICAgdHJhbnNsYXRpb24ubWVzc2FnZVBhcnRzLCB0cmFuc2xhdGlvbi5wbGFjZWhvbGRlck5hbWVzLm1hcChwbGFjZWhvbGRlciA9PiB7XG4gICAgICBpZiAobWVzc2FnZS5zdWJzdGl0dXRpb25zLmhhc093blByb3BlcnR5KHBsYWNlaG9sZGVyKSkge1xuICAgICAgICByZXR1cm4gbWVzc2FnZS5zdWJzdGl0dXRpb25zW3BsYWNlaG9sZGVyXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBObyBwbGFjZWhvbGRlciBmb3VuZCB3aXRoIG5hbWUgJHtwbGFjZWhvbGRlcn0gaW4gbWVzc2FnZSAke2Rlc2NyaWJlTWVzc2FnZShtZXNzYWdlKX0uYCk7XG4gICAgICB9XG4gICAgfSlcbiAgXTtcbn1cblxuLyoqXG4gKiBQYXJzZSB0aGUgYG1lc3NhZ2VQYXJ0c2AgYW5kIGBwbGFjZWhvbGRlck5hbWVzYCBvdXQgb2YgYSB0YXJnZXQgYG1lc3NhZ2VgLlxuICpcbiAqIFVzZWQgYnkgYGxvYWRUcmFuc2xhdGlvbnMoKWAgdG8gY29udmVydCB0YXJnZXQgbWVzc2FnZSBzdHJpbmdzIGludG8gYSBzdHJ1Y3R1cmUgdGhhdCBpcyBtb3JlXG4gKiBhcHByb3ByaWF0ZSBmb3IgZG9pbmcgdHJhbnNsYXRpb24uXG4gKlxuICogQHBhcmFtIG1lc3NhZ2UgdGhlIG1lc3NhZ2UgdG8gYmUgcGFyc2VkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VUcmFuc2xhdGlvbihtZXNzYWdlOiBUYXJnZXRNZXNzYWdlKTogUGFyc2VkVHJhbnNsYXRpb24ge1xuICBjb25zdCBwYXJ0cyA9IG1lc3NhZ2Uuc3BsaXQoL3tcXCQoW159XSopfS8pO1xuICBjb25zdCBtZXNzYWdlUGFydHMgPSBbcGFydHNbMF1dO1xuICBjb25zdCBwbGFjZWhvbGRlck5hbWVzOiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGxldCBpID0gMTsgaSA8IHBhcnRzLmxlbmd0aCAtIDE7IGkgKz0gMikge1xuICAgIHBsYWNlaG9sZGVyTmFtZXMucHVzaChwYXJ0c1tpXSk7XG4gICAgbWVzc2FnZVBhcnRzLnB1c2goYCR7cGFydHNbaSArIDFdfWApO1xuICB9XG4gIGNvbnN0IHJhd01lc3NhZ2VQYXJ0cyA9XG4gICAgICBtZXNzYWdlUGFydHMubWFwKHBhcnQgPT4gcGFydC5jaGFyQXQoMCkgPT09IEJMT0NLX01BUktFUiA/ICdcXFxcJyArIHBhcnQgOiBwYXJ0KTtcbiAgcmV0dXJuIHttZXNzYWdlUGFydHM6IG1ha2VUZW1wbGF0ZU9iamVjdChtZXNzYWdlUGFydHMsIHJhd01lc3NhZ2VQYXJ0cyksIHBsYWNlaG9sZGVyTmFtZXN9O1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIGBQYXJzZWRUcmFuc2xhdGlvbmAgZnJvbSBhIHNldCBvZiBgbWVzc2FnZVBhcnRzYCBhbmQgYHBsYWNlaG9sZGVyTmFtZXNgLlxuICpcbiAqIEBwYXJhbSBtZXNzYWdlUGFydHMgVGhlIG1lc3NhZ2UgcGFydHMgdG8gYXBwZWFyIGluIHRoZSBQYXJzZWRUcmFuc2xhdGlvbi5cbiAqIEBwYXJhbSBwbGFjZWhvbGRlck5hbWVzIFRoZSBuYW1lcyBvZiB0aGUgcGxhY2Vob2xkZXJzIHRvIGludGVyc3BlcnNlIGJldHdlZW4gdGhlIGBtZXNzYWdlUGFydHNgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFrZVBhcnNlZFRyYW5zbGF0aW9uKFxuICAgIG1lc3NhZ2VQYXJ0czogc3RyaW5nW10sIHBsYWNlaG9sZGVyTmFtZXM6IHN0cmluZ1tdID0gW10pOiBQYXJzZWRUcmFuc2xhdGlvbiB7XG4gIHJldHVybiB7bWVzc2FnZVBhcnRzOiBtYWtlVGVtcGxhdGVPYmplY3QobWVzc2FnZVBhcnRzLCBtZXNzYWdlUGFydHMpLCBwbGFjZWhvbGRlck5hbWVzfTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgdGhlIHNwZWNpYWxpemVkIGFycmF5IHRoYXQgaXMgcGFzc2VkIHRvIHRhZ2dlZC1zdHJpbmcgdGFnIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcGFyYW0gY29va2VkIFRoZSBtZXNzYWdlIHBhcnRzIHdpdGggdGhlaXIgZXNjYXBlIGNvZGVzIHByb2Nlc3NlZC5cbiAqIEBwYXJhbSByYXcgVGhlIG1lc3NhZ2UgcGFydHMgd2l0aCB0aGVpciBlc2NhcGVkIGNvZGVzIGFzLWlzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZDogc3RyaW5nW10sIHJhdzogc3RyaW5nW10pOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsICdyYXcnLCB7dmFsdWU6IHJhd30pO1xuICByZXR1cm4gY29va2VkIGFzIGFueTtcbn1cblxuXG5mdW5jdGlvbiBkZXNjcmliZU1lc3NhZ2UobWVzc2FnZTogUGFyc2VkTWVzc2FnZSk6IHN0cmluZyB7XG4gIGNvbnN0IG1lYW5pbmdTdHJpbmcgPSBtZXNzYWdlLm1lYW5pbmcgJiYgYCAtIFwiJHttZXNzYWdlLm1lYW5pbmd9XCJgO1xuICByZXR1cm4gYFwiJHttZXNzYWdlLm1lc3NhZ2VJZH1cIiAoXCIke21lc3NhZ2UubWVzc2FnZVN0cmluZ31cIiR7bWVhbmluZ1N0cmluZ30pYDtcbn0iXX0=
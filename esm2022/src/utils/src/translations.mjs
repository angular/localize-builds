/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
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
    let translation = translations[message.id];
    // If the messageId did not match a translation, try matching the legacy ids instead
    if (message.legacyIds !== undefined) {
        for (let i = 0; i < message.legacyIds.length && translation === undefined; i++) {
            translation = translations[message.legacyIds[i]];
        }
    }
    if (translation === undefined) {
        throw new MissingTranslationError(message);
    }
    return [
        translation.messageParts,
        translation.placeholderNames.map((placeholder) => {
            if (message.substitutions.hasOwnProperty(placeholder)) {
                return message.substitutions[placeholder];
            }
            else {
                throw new Error(`There is a placeholder name mismatch with the translation provided for the message ${describeMessage(message)}.\n` +
                    `The translation contains a placeholder with name ${placeholder}, which does not exist in the message.`);
            }
        }),
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
export function parseTranslation(messageString) {
    const parts = messageString.split(/{\$([^}]*)}/);
    const messageParts = [parts[0]];
    const placeholderNames = [];
    for (let i = 1; i < parts.length - 1; i += 2) {
        placeholderNames.push(parts[i]);
        messageParts.push(`${parts[i + 1]}`);
    }
    const rawMessageParts = messageParts.map((part) => part.charAt(0) === BLOCK_MARKER ? '\\' + part : part);
    return {
        text: messageString,
        messageParts: makeTemplateObject(messageParts, rawMessageParts),
        placeholderNames,
    };
}
/**
 * Create a `ParsedTranslation` from a set of `messageParts` and `placeholderNames`.
 *
 * @param messageParts The message parts to appear in the ParsedTranslation.
 * @param placeholderNames The names of the placeholders to intersperse between the `messageParts`.
 */
export function makeParsedTranslation(messageParts, placeholderNames = []) {
    let messageString = messageParts[0];
    for (let i = 0; i < placeholderNames.length; i++) {
        messageString += `{$${placeholderNames[i]}}${messageParts[i + 1]}`;
    }
    return {
        text: messageString,
        messageParts: makeTemplateObject(messageParts, messageParts),
        placeholderNames,
    };
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
    const legacy = message.legacyIds && message.legacyIds.length > 0
        ? ` [${message.legacyIds.map((l) => `"${l}"`).join(', ')}]`
        : '';
    return `"${message.id}"${legacy} ("${message.text}"${meaningString})`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3V0aWxzL3NyYy90cmFuc2xhdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN6QyxPQUFPLEVBQTRDLFlBQVksRUFBZ0IsTUFBTSxZQUFZLENBQUM7QUFlbEcsTUFBTSxPQUFPLHVCQUF3QixTQUFRLEtBQUs7SUFFaEQsWUFBcUIsYUFBNEI7UUFDL0MsS0FBSyxDQUFDLDRCQUE0QixlQUFlLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRGxELGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBRGhDLFNBQUksR0FBRyx5QkFBeUIsQ0FBQztJQUdsRCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLFVBQVUseUJBQXlCLENBQUMsQ0FBTTtJQUM5QyxPQUFPLENBQUMsQ0FBQyxJQUFJLEtBQUsseUJBQXlCLENBQUM7QUFDOUMsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE1BQU0sVUFBVSxTQUFTLENBQ3ZCLFlBQStDLEVBQy9DLFlBQWtDLEVBQ2xDLGFBQTZCO0lBRTdCLE1BQU0sT0FBTyxHQUFHLFlBQVksQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDMUQsbUZBQW1GO0lBQ25GLElBQUksV0FBVyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDM0Msb0ZBQW9GO0lBQ3BGLElBQUksT0FBTyxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUUsQ0FBQztRQUNwQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFB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QUFDLENBQUM7SUFDbkQsT0FBTyxNQUFhLENBQUM7QUFDdkIsQ0FBQztBQUVELFNBQVMsZUFBZSxDQUFDLE9BQXNCO0lBQzdDLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksT0FBTyxPQUFPLENBQUMsT0FBTyxHQUFHLENBQUM7SUFDbkUsTUFBTSxNQUFNLEdBQ1YsT0FBTyxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHO1FBQzNELENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDVCxPQUFPLElBQUksT0FBTyxDQUFDLEVBQUUsSUFBSSxNQUFNLE1BQU0sT0FBTyxDQUFDLElBQUksSUFBSSxhQUFhLEdBQUcsQ0FBQztBQUN4RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuZGV2L2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtCTE9DS19NQVJLRVJ9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7TWVzc2FnZUlkLCBNZXNzYWdlTWV0YWRhdGEsIFBhcnNlZE1lc3NhZ2UsIHBhcnNlTWVzc2FnZSwgVGFyZ2V0TWVzc2FnZX0gZnJvbSAnLi9tZXNzYWdlcyc7XG5cbi8qKlxuICogQSB0cmFuc2xhdGlvbiBtZXNzYWdlIHRoYXQgaGFzIGJlZW4gcHJvY2Vzc2VkIHRvIGV4dHJhY3QgdGhlIG1lc3NhZ2UgcGFydHMgYW5kIHBsYWNlaG9sZGVycy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQYXJzZWRUcmFuc2xhdGlvbiBleHRlbmRzIE1lc3NhZ2VNZXRhZGF0YSB7XG4gIG1lc3NhZ2VQYXJ0czogVGVtcGxhdGVTdHJpbmdzQXJyYXk7XG4gIHBsYWNlaG9sZGVyTmFtZXM6IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIFRoZSBpbnRlcm5hbCBzdHJ1Y3R1cmUgdXNlZCBieSB0aGUgcnVudGltZSBsb2NhbGl6YXRpb24gdG8gdHJhbnNsYXRlIG1lc3NhZ2VzLlxuICovXG5leHBvcnQgdHlwZSBQYXJzZWRUcmFuc2xhdGlvbnMgPSBSZWNvcmQ8TWVzc2FnZUlkLCBQYXJzZWRUcmFuc2xhdGlvbj47XG5cbmV4cG9ydCBjbGFzcyBNaXNzaW5nVHJhbnNsYXRpb25FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgcHJpdmF0ZSByZWFkb25seSB0eXBlID0gJ01pc3NpbmdUcmFuc2xhdGlvbkVycm9yJztcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgcGFyc2VkTWVzc2FnZTogUGFyc2VkTWVzc2FnZSkge1xuICAgIHN1cGVyKGBObyB0cmFuc2xhdGlvbiBmb3VuZCBmb3IgJHtkZXNjcmliZU1lc3NhZ2UocGFyc2VkTWVzc2FnZSl9LmApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc01pc3NpbmdUcmFuc2xhdGlvbkVycm9yKGU6IGFueSk6IGUgaXMgTWlzc2luZ1RyYW5zbGF0aW9uRXJyb3Ige1xuICByZXR1cm4gZS50eXBlID09PSAnTWlzc2luZ1RyYW5zbGF0aW9uRXJyb3InO1xufVxuXG4vKipcbiAqIFRyYW5zbGF0ZSB0aGUgdGV4dCBvZiB0aGUgYCRsb2NhbGl6ZWAgdGFnZ2VkLXN0cmluZyAoaS5lLiBgbWVzc2FnZVBhcnRzYCBhbmRcbiAqIGBzdWJzdGl0dXRpb25zYCkgdXNpbmcgdGhlIGdpdmVuIGB0cmFuc2xhdGlvbnNgLlxuICpcbiAqIFRoZSB0YWdnZWQtc3RyaW5nIGlzIHBhcnNlZCB0byBleHRyYWN0IGl0cyBgbWVzc2FnZUlkYCB3aGljaCBpcyB1c2VkIHRvIGZpbmQgYW4gYXBwcm9wcmlhdGVcbiAqIGBQYXJzZWRUcmFuc2xhdGlvbmAuIElmIHRoaXMgZG9lc24ndCBtYXRjaCBhbmQgdGhlcmUgYXJlIGxlZ2FjeSBpZHMgdGhlbiB0cnkgbWF0Y2hpbmcgYVxuICogdHJhbnNsYXRpb24gdXNpbmcgdGhvc2UuXG4gKlxuICogSWYgb25lIGlzIGZvdW5kIHRoZW4gaXQgaXMgdXNlZCB0byB0cmFuc2xhdGUgdGhlIG1lc3NhZ2UgaW50byBhIG5ldyBzZXQgb2YgYG1lc3NhZ2VQYXJ0c2AgYW5kXG4gKiBgc3Vic3RpdHV0aW9uc2AuXG4gKiBUaGUgdHJhbnNsYXRpb24gbWF5IHJlb3JkZXIgKG9yIHJlbW92ZSkgc3Vic3RpdHV0aW9ucyBhcyBhcHByb3ByaWF0ZS5cbiAqXG4gKiBJZiB0aGVyZSBpcyBubyB0cmFuc2xhdGlvbiB3aXRoIGEgbWF0Y2hpbmcgbWVzc2FnZSBpZCB0aGVuIGFuIGVycm9yIGlzIHRocm93bi5cbiAqIElmIGEgdHJhbnNsYXRpb24gY29udGFpbnMgYSBwbGFjZWhvbGRlciB0aGF0IGlzIG5vdCBmb3VuZCBpbiB0aGUgbWVzc2FnZSBiZWluZyB0cmFuc2xhdGVkIHRoZW4gYW5cbiAqIGVycm9yIGlzIHRocm93bi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zbGF0ZShcbiAgdHJhbnNsYXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBQYXJzZWRUcmFuc2xhdGlvbj4sXG4gIG1lc3NhZ2VQYXJ0czogVGVtcGxhdGVTdHJpbmdzQXJyYXksXG4gIHN1YnN0aXR1dGlvbnM6IHJlYWRvbmx5IGFueVtdLFxuKTogW1RlbXBsYXRlU3RyaW5nc0FycmF5LCByZWFkb25seSBhbnlbXV0ge1xuICBjb25zdCBtZXNzYWdlID0gcGFyc2VNZXNzYWdlKG1lc3NhZ2VQYXJ0cywgc3Vic3RpdHV0aW9ucyk7XG4gIC8vIExvb2sgdXAgdGhlIHRyYW5zbGF0aW9uIHVzaW5nIHRoZSBtZXNzYWdlSWQsIGFuZCB0aGVuIHRoZSBsZWdhY3lJZCBpZiBhdmFpbGFibGUuXG4gIGxldCB0cmFuc2xhdGlvbiA9IHRyYW5zbGF0aW9uc1ttZXNzYWdlLmlkXTtcbiAgLy8gSWYgdGhlIG1lc3NhZ2VJZCBkaWQgbm90IG1hdGNoIGEgdHJhbnNsYXRpb24sIHRyeSBtYXRjaGluZyB0aGUgbGVnYWN5IGlkcyBpbnN0ZWFkXG4gIGlmIChtZXNzYWdlLmxlZ2FjeUlkcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZXNzYWdlLmxlZ2FjeUlkcy5sZW5ndGggJiYgdHJhbnNsYXRpb24gPT09IHVuZGVmaW5lZDsgaSsrKSB7XG4gICAgICB0cmFuc2xhdGlvbiA9IHRyYW5zbGF0aW9uc1ttZXNzYWdlLmxlZ2FjeUlkc1tpXV07XG4gICAgfVxuICB9XG4gIGlmICh0cmFuc2xhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IE1pc3NpbmdUcmFuc2xhdGlvbkVycm9yKG1lc3NhZ2UpO1xuICB9XG4gIHJldHVybiBbXG4gICAgdHJhbnNsYXRpb24ubWVzc2FnZVBhcnRzLFxuICAgIHRyYW5zbGF0aW9uLnBsYWNlaG9sZGVyTmFtZXMubWFwKChwbGFjZWhvbGRlcikgPT4ge1xuICAgICAgaWYgKG1lc3NhZ2Uuc3Vic3RpdHV0aW9ucy5oYXNPd25Qcm9wZXJ0eShwbGFjZWhvbGRlcikpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2Uuc3Vic3RpdHV0aW9uc1twbGFjZWhvbGRlcl07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYFRoZXJlIGlzIGEgcGxhY2Vob2xkZXIgbmFtZSBtaXNtYXRjaCB3aXRoIHRoZSB0cmFuc2xhdGlvbiBwcm92aWRlZCBmb3IgdGhlIG1lc3NhZ2UgJHtkZXNjcmliZU1lc3NhZ2UoXG4gICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICl9LlxcbmAgK1xuICAgICAgICAgICAgYFRoZSB0cmFuc2xhdGlvbiBjb250YWlucyBhIHBsYWNlaG9sZGVyIHdpdGggbmFtZSAke3BsYWNlaG9sZGVyfSwgd2hpY2ggZG9lcyBub3QgZXhpc3QgaW4gdGhlIG1lc3NhZ2UuYCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KSxcbiAgXTtcbn1cblxuLyoqXG4gKiBQYXJzZSB0aGUgYG1lc3NhZ2VQYXJ0c2AgYW5kIGBwbGFjZWhvbGRlck5hbWVzYCBvdXQgb2YgYSB0YXJnZXQgYG1lc3NhZ2VgLlxuICpcbiAqIFVzZWQgYnkgYGxvYWRUcmFuc2xhdGlvbnMoKWAgdG8gY29udmVydCB0YXJnZXQgbWVzc2FnZSBzdHJpbmdzIGludG8gYSBzdHJ1Y3R1cmUgdGhhdCBpcyBtb3JlXG4gKiBhcHByb3ByaWF0ZSBmb3IgZG9pbmcgdHJhbnNsYXRpb24uXG4gKlxuICogQHBhcmFtIG1lc3NhZ2UgdGhlIG1lc3NhZ2UgdG8gYmUgcGFyc2VkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VUcmFuc2xhdGlvbihtZXNzYWdlU3RyaW5nOiBUYXJnZXRNZXNzYWdlKTogUGFyc2VkVHJhbnNsYXRpb24ge1xuICBjb25zdCBwYXJ0cyA9IG1lc3NhZ2VTdHJpbmcuc3BsaXQoL3tcXCQoW159XSopfS8pO1xuICBjb25zdCBtZXNzYWdlUGFydHMgPSBbcGFydHNbMF1dO1xuICBjb25zdCBwbGFjZWhvbGRlck5hbWVzOiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGxldCBpID0gMTsgaSA8IHBhcnRzLmxlbmd0aCAtIDE7IGkgKz0gMikge1xuICAgIHBsYWNlaG9sZGVyTmFtZXMucHVzaChwYXJ0c1tpXSk7XG4gICAgbWVzc2FnZVBhcnRzLnB1c2goYCR7cGFydHNbaSArIDFdfWApO1xuICB9XG4gIGNvbnN0IHJhd01lc3NhZ2VQYXJ0cyA9IG1lc3NhZ2VQYXJ0cy5tYXAoKHBhcnQpID0+XG4gICAgcGFydC5jaGFyQXQoMCkgPT09IEJMT0NLX01BUktFUiA/ICdcXFxcJyArIHBhcnQgOiBwYXJ0LFxuICApO1xuICByZXR1cm4ge1xuICAgIHRleHQ6IG1lc3NhZ2VTdHJpbmcsXG4gICAgbWVzc2FnZVBhcnRzOiBtYWtlVGVtcGxhdGVPYmplY3QobWVzc2FnZVBhcnRzLCByYXdNZXNzYWdlUGFydHMpLFxuICAgIHBsYWNlaG9sZGVyTmFtZXMsXG4gIH07XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgYFBhcnNlZFRyYW5zbGF0aW9uYCBmcm9tIGEgc2V0IG9mIGBtZXNzYWdlUGFydHNgIGFuZCBgcGxhY2Vob2xkZXJOYW1lc2AuXG4gKlxuICogQHBhcmFtIG1lc3NhZ2VQYXJ0cyBUaGUgbWVzc2FnZSBwYXJ0cyB0byBhcHBlYXIgaW4gdGhlIFBhcnNlZFRyYW5zbGF0aW9uLlxuICogQHBhcmFtIHBsYWNlaG9sZGVyTmFtZXMgVGhlIG5hbWVzIG9mIHRoZSBwbGFjZWhvbGRlcnMgdG8gaW50ZXJzcGVyc2UgYmV0d2VlbiB0aGUgYG1lc3NhZ2VQYXJ0c2AuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYWtlUGFyc2VkVHJhbnNsYXRpb24oXG4gIG1lc3NhZ2VQYXJ0czogc3RyaW5nW10sXG4gIHBsYWNlaG9sZGVyTmFtZXM6IHN0cmluZ1tdID0gW10sXG4pOiBQYXJzZWRUcmFuc2xhdGlvbiB7XG4gIGxldCBtZXNzYWdlU3RyaW5nID0gbWVzc2FnZVBhcnRzWzBdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYWNlaG9sZGVyTmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICBtZXNzYWdlU3RyaW5nICs9IGB7JCR7cGxhY2Vob2xkZXJOYW1lc1tpXX19JHttZXNzYWdlUGFydHNbaSArIDFdfWA7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICB0ZXh0OiBtZXNzYWdlU3RyaW5nLFxuICAgIG1lc3NhZ2VQYXJ0czogbWFrZVRlbXBsYXRlT2JqZWN0KG1lc3NhZ2VQYXJ0cywgbWVzc2FnZVBhcnRzKSxcbiAgICBwbGFjZWhvbGRlck5hbWVzLFxuICB9O1xufVxuXG4vKipcbiAqIENyZWF0ZSB0aGUgc3BlY2lhbGl6ZWQgYXJyYXkgdGhhdCBpcyBwYXNzZWQgdG8gdGFnZ2VkLXN0cmluZyB0YWcgZnVuY3Rpb25zLlxuICpcbiAqIEBwYXJhbSBjb29rZWQgVGhlIG1lc3NhZ2UgcGFydHMgd2l0aCB0aGVpciBlc2NhcGUgY29kZXMgcHJvY2Vzc2VkLlxuICogQHBhcmFtIHJhdyBUaGUgbWVzc2FnZSBwYXJ0cyB3aXRoIHRoZWlyIGVzY2FwZWQgY29kZXMgYXMtaXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYWtlVGVtcGxhdGVPYmplY3QoY29va2VkOiBzdHJpbmdbXSwgcmF3OiBzdHJpbmdbXSk6IFRlbXBsYXRlU3RyaW5nc0FycmF5IHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgJ3JhdycsIHt2YWx1ZTogcmF3fSk7XG4gIHJldHVybiBjb29rZWQgYXMgYW55O1xufVxuXG5mdW5jdGlvbiBkZXNjcmliZU1lc3NhZ2UobWVzc2FnZTogUGFyc2VkTWVzc2FnZSk6IHN0cmluZyB7XG4gIGNvbnN0IG1lYW5pbmdTdHJpbmcgPSBtZXNzYWdlLm1lYW5pbmcgJiYgYCAtIFwiJHttZXNzYWdlLm1lYW5pbmd9XCJgO1xuICBjb25zdCBsZWdhY3kgPVxuICAgIG1lc3NhZ2UubGVnYWN5SWRzICYmIG1lc3NhZ2UubGVnYWN5SWRzLmxlbmd0aCA+IDBcbiAgICAgID8gYCBbJHttZXNzYWdlLmxlZ2FjeUlkcy5tYXAoKGwpID0+IGBcIiR7bH1cImApLmpvaW4oJywgJyl9XWBcbiAgICAgIDogJyc7XG4gIHJldHVybiBgXCIke21lc3NhZ2UuaWR9XCIke2xlZ2FjeX0gKFwiJHttZXNzYWdlLnRleHR9XCIke21lYW5pbmdTdHJpbmd9KWA7XG59XG4iXX0=
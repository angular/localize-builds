import { __extends } from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BLOCK_MARKER } from './constants';
import { parseMessage } from './messages';
var MissingTranslationError = /** @class */ (function (_super) {
    __extends(MissingTranslationError, _super);
    function MissingTranslationError(parsedMessage) {
        var _this = _super.call(this, "No translation found for " + describeMessage(parsedMessage) + ".") || this;
        _this.parsedMessage = parsedMessage;
        _this.type = 'MissingTranslationError';
        return _this;
    }
    return MissingTranslationError;
}(Error));
export { MissingTranslationError };
export function isMissingTranslationError(e) {
    return e.type === 'MissingTranslationError';
}
/**
 * Translate the text of the `$localize` tagged-string (i.e. `messageParts` and
 * `substitutions`) using the given `translations`.
 *
 * The tagged-string is parsed to extract its `messageId` which is used to find an appropriate
 * `ParsedTranslation`.
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
    var message = parseMessage(messageParts, substitutions);
    var translation = translations[message.messageId];
    if (translation === undefined) {
        throw new MissingTranslationError(message);
    }
    return [
        translation.messageParts, translation.placeholderNames.map(function (placeholder) {
            if (message.substitutions.hasOwnProperty(placeholder)) {
                return message.substitutions[placeholder];
            }
            else {
                throw new Error("No placeholder found with name " + placeholder + " in message " + describeMessage(message) + ".");
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
    var parts = message.split(/{\$([^}]*)}/);
    var messageParts = [parts[0]];
    var placeholderNames = [];
    for (var i = 1; i < parts.length - 1; i += 2) {
        placeholderNames.push(parts[i]);
        messageParts.push("" + parts[i + 1]);
    }
    var rawMessageParts = messageParts.map(function (part) { return part.charAt(0) === BLOCK_MARKER ? '\\' + part : part; });
    return { messageParts: makeTemplateObject(messageParts, rawMessageParts), placeholderNames: placeholderNames };
}
/**
 * Create a `ParsedTranslation` from a set of `messageParts` and `placeholderNames`.
 *
 * @param messageParts The message parts to appear in the ParsedTranslation.
 * @param placeholderNames The names of the placeholders to intersperse between the `messageParts`.
 */
export function makeParsedTranslation(messageParts, placeholderNames) {
    if (placeholderNames === void 0) { placeholderNames = []; }
    return { messageParts: makeTemplateObject(messageParts, messageParts), placeholderNames: placeholderNames };
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
    var meaningString = message.meaning && " - \"" + message.meaning + "\"";
    return "\"" + message.messageId + "\" (\"" + message.messageString + "\"" + meaningString + ")";
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3V0aWxzL3NyYy90cmFuc2xhdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDekMsT0FBTyxFQUEwQyxZQUFZLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFnQmpGO0lBQTZDLDJDQUFLO0lBRWhELGlDQUFxQixhQUE0QjtRQUFqRCxZQUNFLGtCQUFNLDhCQUE0QixlQUFlLENBQUMsYUFBYSxDQUFDLE1BQUcsQ0FBQyxTQUNyRTtRQUZvQixtQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQURoQyxVQUFJLEdBQUcseUJBQXlCLENBQUM7O0lBR2xELENBQUM7SUFDSCw4QkFBQztBQUFELENBQUMsQUFMRCxDQUE2QyxLQUFLLEdBS2pEOztBQUVELE1BQU0sVUFBVSx5QkFBeUIsQ0FBQyxDQUFNO0lBQzlDLE9BQU8sQ0FBQyxDQUFDLElBQUksS0FBSyx5QkFBeUIsQ0FBQztBQUM5QyxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxNQUFNLFVBQVUsU0FBUyxDQUNyQixZQUErQyxFQUFFLFlBQWtDLEVBQ25GLGFBQTZCO0lBQy9CLElBQU0sT0FBTyxHQUFHLFlBQVksQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDMUQsSUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNwRCxJQUFJLFdBQVcsS0FBSyxTQUFTLEVBQUU7UUFDN0IsTUFBTSxJQUFJLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzVDO0lBQ0QsT0FBTztRQUNMLFdBQVcsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxVQUFBLFdBQVc7WUFDcEUsSUFBSSxPQUFPLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFDckQsT0FBTyxPQUFPLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQzNDO2lCQUFNO2dCQUNMLE1BQU0sSUFBSSxLQUFLLENBQ1gsb0NBQWtDLFdBQVcsb0JBQWUsZUFBZSxDQUFDLE9BQU8sQ0FBQyxNQUFHLENBQUMsQ0FBQzthQUM5RjtRQUNILENBQUMsQ0FBQztLQUNILENBQUM7QUFDSixDQUFDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNILE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxPQUFzQjtJQUNyRCxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzNDLElBQU0sWUFBWSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsSUFBTSxnQkFBZ0IsR0FBYSxFQUFFLENBQUM7SUFDdEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDNUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBRyxDQUFDLENBQUM7S0FDdEM7SUFDRCxJQUFNLGVBQWUsR0FDakIsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQXBELENBQW9ELENBQUMsQ0FBQztJQUNuRixPQUFPLEVBQUMsWUFBWSxFQUFFLGtCQUFrQixDQUFDLFlBQVksRUFBRSxlQUFlLENBQUMsRUFBRSxnQkFBZ0Isa0JBQUEsRUFBQyxDQUFDO0FBQzdGLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxxQkFBcUIsQ0FDakMsWUFBc0IsRUFBRSxnQkFBK0I7SUFBL0IsaUNBQUEsRUFBQSxxQkFBK0I7SUFDekQsT0FBTyxFQUFDLFlBQVksRUFBRSxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLEVBQUUsZ0JBQWdCLGtCQUFBLEVBQUMsQ0FBQztBQUMxRixDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsa0JBQWtCLENBQUMsTUFBZ0IsRUFBRSxHQUFhO0lBQ2hFLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDO0lBQ25ELE9BQU8sTUFBYSxDQUFDO0FBQ3ZCLENBQUM7QUFHRCxTQUFTLGVBQWUsQ0FBQyxPQUFzQjtJQUM3QyxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLFVBQU8sT0FBTyxDQUFDLE9BQU8sT0FBRyxDQUFDO0lBQ25FLE9BQU8sT0FBSSxPQUFPLENBQUMsU0FBUyxjQUFPLE9BQU8sQ0FBQyxhQUFhLFVBQUksYUFBYSxNQUFHLENBQUM7QUFDL0UsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QkxPQ0tfTUFSS0VSfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQge01lc3NhZ2VJZCwgUGFyc2VkTWVzc2FnZSwgVGFyZ2V0TWVzc2FnZSwgcGFyc2VNZXNzYWdlfSBmcm9tICcuL21lc3NhZ2VzJztcblxuXG4vKipcbiAqIEEgdHJhbnNsYXRpb24gbWVzc2FnZSB0aGF0IGhhcyBiZWVuIHByb2Nlc3NlZCB0byBleHRyYWN0IHRoZSBtZXNzYWdlIHBhcnRzIGFuZCBwbGFjZWhvbGRlcnMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUGFyc2VkVHJhbnNsYXRpb24ge1xuICBtZXNzYWdlUGFydHM6IFRlbXBsYXRlU3RyaW5nc0FycmF5O1xuICBwbGFjZWhvbGRlck5hbWVzOiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBUaGUgaW50ZXJuYWwgc3RydWN0dXJlIHVzZWQgYnkgdGhlIHJ1bnRpbWUgbG9jYWxpemF0aW9uIHRvIHRyYW5zbGF0ZSBtZXNzYWdlcy5cbiAqL1xuZXhwb3J0IHR5cGUgUGFyc2VkVHJhbnNsYXRpb25zID0gUmVjb3JkPE1lc3NhZ2VJZCwgUGFyc2VkVHJhbnNsYXRpb24+O1xuXG5leHBvcnQgY2xhc3MgTWlzc2luZ1RyYW5zbGF0aW9uRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIHByaXZhdGUgcmVhZG9ubHkgdHlwZSA9ICdNaXNzaW5nVHJhbnNsYXRpb25FcnJvcic7XG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHBhcnNlZE1lc3NhZ2U6IFBhcnNlZE1lc3NhZ2UpIHtcbiAgICBzdXBlcihgTm8gdHJhbnNsYXRpb24gZm91bmQgZm9yICR7ZGVzY3JpYmVNZXNzYWdlKHBhcnNlZE1lc3NhZ2UpfS5gKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNNaXNzaW5nVHJhbnNsYXRpb25FcnJvcihlOiBhbnkpOiBlIGlzIE1pc3NpbmdUcmFuc2xhdGlvbkVycm9yIHtcbiAgcmV0dXJuIGUudHlwZSA9PT0gJ01pc3NpbmdUcmFuc2xhdGlvbkVycm9yJztcbn1cblxuLyoqXG4gKiBUcmFuc2xhdGUgdGhlIHRleHQgb2YgdGhlIGAkbG9jYWxpemVgIHRhZ2dlZC1zdHJpbmcgKGkuZS4gYG1lc3NhZ2VQYXJ0c2AgYW5kXG4gKiBgc3Vic3RpdHV0aW9uc2ApIHVzaW5nIHRoZSBnaXZlbiBgdHJhbnNsYXRpb25zYC5cbiAqXG4gKiBUaGUgdGFnZ2VkLXN0cmluZyBpcyBwYXJzZWQgdG8gZXh0cmFjdCBpdHMgYG1lc3NhZ2VJZGAgd2hpY2ggaXMgdXNlZCB0byBmaW5kIGFuIGFwcHJvcHJpYXRlXG4gKiBgUGFyc2VkVHJhbnNsYXRpb25gLlxuICpcbiAqIElmIG9uZSBpcyBmb3VuZCB0aGVuIGl0IGlzIHVzZWQgdG8gdHJhbnNsYXRlIHRoZSBtZXNzYWdlIGludG8gYSBuZXcgc2V0IG9mIGBtZXNzYWdlUGFydHNgIGFuZFxuICogYHN1YnN0aXR1dGlvbnNgLlxuICogVGhlIHRyYW5zbGF0aW9uIG1heSByZW9yZGVyIChvciByZW1vdmUpIHN1YnN0aXR1dGlvbnMgYXMgYXBwcm9wcmlhdGUuXG4gKlxuICogSWYgdGhlcmUgaXMgbm8gdHJhbnNsYXRpb24gd2l0aCBhIG1hdGNoaW5nIG1lc3NhZ2UgaWQgdGhlbiBhbiBlcnJvciBpcyB0aHJvd24uXG4gKiBJZiBhIHRyYW5zbGF0aW9uIGNvbnRhaW5zIGEgcGxhY2Vob2xkZXIgdGhhdCBpcyBub3QgZm91bmQgaW4gdGhlIG1lc3NhZ2UgYmVpbmcgdHJhbnNsYXRlZCB0aGVuIGFuXG4gKiBlcnJvciBpcyB0aHJvd24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2xhdGUoXG4gICAgdHJhbnNsYXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBQYXJzZWRUcmFuc2xhdGlvbj4sIG1lc3NhZ2VQYXJ0czogVGVtcGxhdGVTdHJpbmdzQXJyYXksXG4gICAgc3Vic3RpdHV0aW9uczogcmVhZG9ubHkgYW55W10pOiBbVGVtcGxhdGVTdHJpbmdzQXJyYXksIHJlYWRvbmx5IGFueVtdXSB7XG4gIGNvbnN0IG1lc3NhZ2UgPSBwYXJzZU1lc3NhZ2UobWVzc2FnZVBhcnRzLCBzdWJzdGl0dXRpb25zKTtcbiAgY29uc3QgdHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvbnNbbWVzc2FnZS5tZXNzYWdlSWRdO1xuICBpZiAodHJhbnNsYXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBNaXNzaW5nVHJhbnNsYXRpb25FcnJvcihtZXNzYWdlKTtcbiAgfVxuICByZXR1cm4gW1xuICAgIHRyYW5zbGF0aW9uLm1lc3NhZ2VQYXJ0cywgdHJhbnNsYXRpb24ucGxhY2Vob2xkZXJOYW1lcy5tYXAocGxhY2Vob2xkZXIgPT4ge1xuICAgICAgaWYgKG1lc3NhZ2Uuc3Vic3RpdHV0aW9ucy5oYXNPd25Qcm9wZXJ0eShwbGFjZWhvbGRlcikpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2Uuc3Vic3RpdHV0aW9uc1twbGFjZWhvbGRlcl07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgTm8gcGxhY2Vob2xkZXIgZm91bmQgd2l0aCBuYW1lICR7cGxhY2Vob2xkZXJ9IGluIG1lc3NhZ2UgJHtkZXNjcmliZU1lc3NhZ2UobWVzc2FnZSl9LmApO1xuICAgICAgfVxuICAgIH0pXG4gIF07XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIGBtZXNzYWdlUGFydHNgIGFuZCBgcGxhY2Vob2xkZXJOYW1lc2Agb3V0IG9mIGEgdGFyZ2V0IGBtZXNzYWdlYC5cbiAqXG4gKiBVc2VkIGJ5IGBsb2FkVHJhbnNsYXRpb25zKClgIHRvIGNvbnZlcnQgdGFyZ2V0IG1lc3NhZ2Ugc3RyaW5ncyBpbnRvIGEgc3RydWN0dXJlIHRoYXQgaXMgbW9yZVxuICogYXBwcm9wcmlhdGUgZm9yIGRvaW5nIHRyYW5zbGF0aW9uLlxuICpcbiAqIEBwYXJhbSBtZXNzYWdlIHRoZSBtZXNzYWdlIHRvIGJlIHBhcnNlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVHJhbnNsYXRpb24obWVzc2FnZTogVGFyZ2V0TWVzc2FnZSk6IFBhcnNlZFRyYW5zbGF0aW9uIHtcbiAgY29uc3QgcGFydHMgPSBtZXNzYWdlLnNwbGl0KC97XFwkKFtefV0qKX0vKTtcbiAgY29uc3QgbWVzc2FnZVBhcnRzID0gW3BhcnRzWzBdXTtcbiAgY29uc3QgcGxhY2Vob2xkZXJOYW1lczogc3RyaW5nW10gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBwYXJ0cy5sZW5ndGggLSAxOyBpICs9IDIpIHtcbiAgICBwbGFjZWhvbGRlck5hbWVzLnB1c2gocGFydHNbaV0pO1xuICAgIG1lc3NhZ2VQYXJ0cy5wdXNoKGAke3BhcnRzW2kgKyAxXX1gKTtcbiAgfVxuICBjb25zdCByYXdNZXNzYWdlUGFydHMgPVxuICAgICAgbWVzc2FnZVBhcnRzLm1hcChwYXJ0ID0+IHBhcnQuY2hhckF0KDApID09PSBCTE9DS19NQVJLRVIgPyAnXFxcXCcgKyBwYXJ0IDogcGFydCk7XG4gIHJldHVybiB7bWVzc2FnZVBhcnRzOiBtYWtlVGVtcGxhdGVPYmplY3QobWVzc2FnZVBhcnRzLCByYXdNZXNzYWdlUGFydHMpLCBwbGFjZWhvbGRlck5hbWVzfTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBgUGFyc2VkVHJhbnNsYXRpb25gIGZyb20gYSBzZXQgb2YgYG1lc3NhZ2VQYXJ0c2AgYW5kIGBwbGFjZWhvbGRlck5hbWVzYC5cbiAqXG4gKiBAcGFyYW0gbWVzc2FnZVBhcnRzIFRoZSBtZXNzYWdlIHBhcnRzIHRvIGFwcGVhciBpbiB0aGUgUGFyc2VkVHJhbnNsYXRpb24uXG4gKiBAcGFyYW0gcGxhY2Vob2xkZXJOYW1lcyBUaGUgbmFtZXMgb2YgdGhlIHBsYWNlaG9sZGVycyB0byBpbnRlcnNwZXJzZSBiZXR3ZWVuIHRoZSBgbWVzc2FnZVBhcnRzYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1ha2VQYXJzZWRUcmFuc2xhdGlvbihcbiAgICBtZXNzYWdlUGFydHM6IHN0cmluZ1tdLCBwbGFjZWhvbGRlck5hbWVzOiBzdHJpbmdbXSA9IFtdKTogUGFyc2VkVHJhbnNsYXRpb24ge1xuICByZXR1cm4ge21lc3NhZ2VQYXJ0czogbWFrZVRlbXBsYXRlT2JqZWN0KG1lc3NhZ2VQYXJ0cywgbWVzc2FnZVBhcnRzKSwgcGxhY2Vob2xkZXJOYW1lc307XG59XG5cbi8qKlxuICogQ3JlYXRlIHRoZSBzcGVjaWFsaXplZCBhcnJheSB0aGF0IGlzIHBhc3NlZCB0byB0YWdnZWQtc3RyaW5nIHRhZyBmdW5jdGlvbnMuXG4gKlxuICogQHBhcmFtIGNvb2tlZCBUaGUgbWVzc2FnZSBwYXJ0cyB3aXRoIHRoZWlyIGVzY2FwZSBjb2RlcyBwcm9jZXNzZWQuXG4gKiBAcGFyYW0gcmF3IFRoZSBtZXNzYWdlIHBhcnRzIHdpdGggdGhlaXIgZXNjYXBlZCBjb2RlcyBhcy1pcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQ6IHN0cmluZ1tdLCByYXc6IHN0cmluZ1tdKTogVGVtcGxhdGVTdHJpbmdzQXJyYXkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCAncmF3Jywge3ZhbHVlOiByYXd9KTtcbiAgcmV0dXJuIGNvb2tlZCBhcyBhbnk7XG59XG5cblxuZnVuY3Rpb24gZGVzY3JpYmVNZXNzYWdlKG1lc3NhZ2U6IFBhcnNlZE1lc3NhZ2UpOiBzdHJpbmcge1xuICBjb25zdCBtZWFuaW5nU3RyaW5nID0gbWVzc2FnZS5tZWFuaW5nICYmIGAgLSBcIiR7bWVzc2FnZS5tZWFuaW5nfVwiYDtcbiAgcmV0dXJuIGBcIiR7bWVzc2FnZS5tZXNzYWdlSWR9XCIgKFwiJHttZXNzYWdlLm1lc3NhZ2VTdHJpbmd9XCIke21lYW5pbmdTdHJpbmd9KWA7XG59Il19
/**
 * @license Angular v9.0.0-next.6+65.sha-894c4b5.with-local-changes
 * (c) 2010-2019 Google LLC. https://angular.io/
 * License: MIT
 */

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * The character used to mark the start and end of a placeholder name in a `$localize` tagged
 * string.
 *
 * For example:
 *
 * ```
 * $localize`Hello, ${title}:title:!`;
 * ```
 */
var PLACEHOLDER_NAME_MARKER = ':';

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Parse a `$localize` tagged string into a structure that can be used for translation.
 *
 * See `ParsedMessage` for an example.
 */
function parseMessage(messageParts, expressions) {
    var replacements = {};
    var translationKey = messageParts[0];
    for (var i = 1; i < messageParts.length; i++) {
        var messagePart = messageParts[i];
        var expression = expressions[i - 1];
        // There is a problem with synthesizing template literals in TS.
        // It is not possible to provide raw values for the `messageParts` and TS is not able to compute
        // them since this requires access to the string in its original (non-existent) source code.
        // Therefore we fall back on the non-raw version if the raw string is empty.
        // This should be OK because synthesized nodes only come from the template compiler and they
        // will always contain placeholder name information.
        // So there will be no escaped placeholder marker character (`:`) directly after a substitution.
        if ((messageParts.raw[i] || messagePart).charAt(0) === PLACEHOLDER_NAME_MARKER) {
            var endOfPlaceholderName = messagePart.indexOf(PLACEHOLDER_NAME_MARKER, 1);
            var placeholderName = messagePart.substring(1, endOfPlaceholderName);
            translationKey += "{$" + placeholderName + "}" + messagePart.substring(endOfPlaceholderName + 1);
            replacements[placeholderName] = expression;
        }
        else {
            var placeholderName = "ph_" + i;
            translationKey += "{$" + placeholderName + "}" + messagePart;
            replacements[placeholderName] = expression;
        }
    }
    return { translationKey: translationKey, substitutions: replacements };
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Translate the text of the `$localize` tagged-string (i.e. `messageParts` and
 * `substitutions`) using the given `translations`.
 *
 * The tagged-string is parsed to extract its `translationKey` which is used to find an appropriate
 * `ParsedTranslation`.
 *
 * If one is found then it is used to translate the message into a new set of `messageParts` and
 * `substitutions`.
 * The translation may reorder (or remove) substitutions as appropriate.
 *
 * If no translation matches then the original `messageParts` and `substitutions` are returned
 */
function translate(translations, messageParts, substitutions) {
    var message = parseMessage(messageParts, substitutions);
    var translation = translations[message.translationKey];
    if (translation !== undefined) {
        return [
            translation.messageParts,
            translation.placeholderNames.map(function (placeholder) { return message.substitutions[placeholder]; })
        ];
    }
    else {
        return [messageParts, substitutions];
    }
}
/**
 * Parse the `messageParts` and `placeholderNames` out of a target `message`.
 *
 * Used by `loadTranslations()` to convert target message strings into a structure that is more
 * appropriate for doing translation.
 *
 * @param message the message to be parsed.
 */
function parseTranslation(message) {
    var parts = message.split(/{\$([^}]*)}/);
    var messageParts = [parts[0]];
    var placeholderNames = [];
    for (var i = 1; i < parts.length - 1; i += 2) {
        placeholderNames.push(parts[i]);
        messageParts.push("" + parts[i + 1]);
    }
    var rawMessageParts = messageParts.map(function (part) { return part.charAt(0) === PLACEHOLDER_NAME_MARKER ? '\\' + part : part; });
    return { messageParts: makeTemplateObject(messageParts, rawMessageParts), placeholderNames: placeholderNames };
}
/**
 * Create the specialized array that is passed to tagged-string tag functions.
 *
 * @param cooked The message parts with their escape codes processed.
 * @param raw The message parts with their escaped codes as-is.
 */
function makeTemplateObject(cooked, raw) {
    Object.defineProperty(cooked, 'raw', { value: raw });
    return cooked;
}

/**
 * Load translations for `$localize`.
 *
 * The given `translations` are processed and added to a lookup based on their translation key.
 * A new translation will overwrite a previous translation if it has the same key.
 *
 * @publicApi
 */
function loadTranslations(translations) {
    // Ensure the translate function exists
    if (!$localize.translate) {
        $localize.translate = translate$1;
    }
    if (!$localize.TRANSLATIONS) {
        $localize.TRANSLATIONS = {};
    }
    Object.keys(translations).forEach(function (key) {
        $localize.TRANSLATIONS[key] = parseTranslation(translations[key]);
    });
}
/**
 * Remove all translations for `$localize`.
 *
 * @publicApi
 */
function clearTranslations() {
    $localize.TRANSLATIONS = {};
}
/**
 * Translate the text of the given message, using the loaded translations.
 *
 * This function may reorder (or remove) substitutions as indicated in the matching translation.
 */
function translate$1(messageParts, substitutions) {
    return translate($localize.TRANSLATIONS, messageParts, substitutions);
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export { clearTranslations, loadTranslations };
//# sourceMappingURL=localize.js.map

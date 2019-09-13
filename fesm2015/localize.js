/**
 * @license Angular v9.0.0-next.6+43.sha-c7ea326.with-local-changes
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
const PLACEHOLDER_NAME_MARKER = ':';

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
    const replacements = {};
    let translationKey = messageParts[0];
    for (let i = 1; i < messageParts.length; i++) {
        const messagePart = messageParts[i];
        const expression = expressions[i - 1];
        // There is a problem with synthesizing template literals in TS.
        // It is not possible to provide raw values for the `messageParts` and TS is not able to compute
        // them since this requires access to the string in its original (non-existent) source code.
        // Therefore we fall back on the non-raw version if the raw string is empty.
        // This should be OK because synthesized nodes only come from the template compiler and they
        // will always contain placeholder name information.
        // So there will be no escaped placeholder marker character (`:`) directly after a substitution.
        if ((messageParts.raw[i] || messagePart).charAt(0) === PLACEHOLDER_NAME_MARKER) {
            const endOfPlaceholderName = messagePart.indexOf(PLACEHOLDER_NAME_MARKER, 1);
            const placeholderName = messagePart.substring(1, endOfPlaceholderName);
            translationKey += `{$${placeholderName}}${messagePart.substring(endOfPlaceholderName + 1)}`;
            replacements[placeholderName] = expression;
        }
        else {
            const placeholderName = `ph_${i}`;
            translationKey += `{$${placeholderName}}${messagePart}`;
            replacements[placeholderName] = expression;
        }
    }
    return { translationKey, substitutions: replacements };
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
    const message = parseMessage(messageParts, substitutions);
    const translation = translations[message.translationKey];
    if (translation !== undefined) {
        return [
            translation.messageParts,
            translation.placeholderNames.map(placeholder => message.substitutions[placeholder])
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
    const parts = message.split(/{\$([^}]*)}/);
    const messageParts = [parts[0]];
    const placeholderNames = [];
    for (let i = 1; i < parts.length - 1; i += 2) {
        placeholderNames.push(parts[i]);
        messageParts.push(`${parts[i + 1]}`);
    }
    const rawMessageParts = messageParts.map(part => part.charAt(0) === PLACEHOLDER_NAME_MARKER ? '\\' + part : part);
    return { messageParts: makeTemplateObject(messageParts, rawMessageParts), placeholderNames };
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
    Object.keys(translations).forEach(key => {
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

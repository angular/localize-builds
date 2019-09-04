/**
 * @license Angular v9.0.0-next.4+81.sha-cfa09b8.with-local-changes
 * (c) 2010-2019 Google LLC. https://angular.io/
 * License: MIT
 */

/**
 * The character used to mark the start and end of a placeholder name.
 */
const PLACEHOLDER_NAME_MARKER = ':';
/**
 * Load translations for `$localize`.
 *
 * The given `translations` are processed and added to a lookup based on their translation key.
 * A new translation will overwrite a previous translation if it has the same key.
 */
function loadTranslations(translations) {
    // Ensure the translate function exists
    if (!$localize.translate) {
        $localize.translate = translate;
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
 */
function clearTranslations() {
    $localize.TRANSLATIONS = {};
}
/**
 * Translate the text of the given message, using the loaded translations.
 *
 * This function may reorder (or remove) substitutions as indicated in the matching translation.
 */
function translate(messageParts, substitutions) {
    const message = parseMessage(messageParts, substitutions);
    const translation = $localize.TRANSLATIONS[message.translationKey];
    const result = (translation === undefined ? [messageParts, substitutions] : [
        translation.messageParts,
        translation.placeholderNames.map(placeholder => message.substitutions[placeholder])
    ]);
    return result;
}
/////////////
// Helpers
/**
 * Parse the `messageParts` and `placeholderNames` out of a translation key.
 *
 * @param translationKey the message to be parsed.
 */
function parseTranslation(translationKey) {
    const parts = translationKey.split(/{\$([^}]*)}/);
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
 * Process the `messageParts` and `substitutions` that were passed to the `$localize` tag in order
 * to match it to a translation.
 *
 * Specifically this function computes:
 * * the `translationKey` for looking up an appropriate translation for this message.
 * * a map of placeholder names to substitutions values.
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
 * Make an array of `cooked` strings that also holds the `raw` strings in an additional property.
 *
 * @param cooked The actual values of the `messagePart` strings.
 * @param raw The original raw values of the `messagePart` strings, before escape characters are
 * processed.
 */
function makeTemplateObject(cooked, raw) {
    Object.defineProperty(cooked, 'raw', { value: raw });
    return cooked;
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export { clearTranslations, loadTranslations };
//# sourceMappingURL=run_time.js.map

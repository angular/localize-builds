/**
 * @license Angular v9.0.0-next.8+34.sha-98feee7.with-local-changes
 * (c) 2010-2019 Google LLC. https://angular.io/
 * License: MIT
 */

import { __read } from 'tslib';
import { computeMsgId } from '@angular/compiler';

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * The character used to mark the start and end of a "block" in a `$localize` tagged string.
 * A block can indicate metadata about the message or specify a name of a placeholder for a
 * substitution expressions.
 *
 * For example:
 *
 * ```ts
 * $localize`Hello, ${title}:title:!`;
 * $localize`:meaning|description@@id:source message text`;
 * ```
 */
var BLOCK_MARKER = ':';
/**
 * The marker used to separate a message's "meaning" from its "description" in a metadata block.
 *
 * For example:
 *
 * ```ts
 * $localize `:correct|Indicates that the user got the answer correct: Right!`;
 * $localize `:movement|Button label for moving to the right: Right!`;
 * ```
 */
var MEANING_SEPARATOR = '|';
/**
 * The marker used to separate a message's custom "id" from its "description" in a metadata block.
 *
 * For example:
 *
 * ```ts
 * $localize `:A welcome message on the home page@@myApp-homepage-welcome: Welcome!`;
 * ```
 */
var ID_SEPARATOR = '@@';

/**
 * Parse a `$localize` tagged string into a structure that can be used for translation.
 *
 * See `ParsedMessage` for an example.
 */
function parseMessage(messageParts, expressions) {
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
function parseMetadata(cooked, raw) {
    var _a = splitBlock(cooked, raw), text = _a.text, block = _a.block;
    if (block === undefined) {
        return { text: text, meaning: undefined, description: undefined, id: undefined };
    }
    else {
        var _b = __read(block.split(ID_SEPARATOR, 2), 2), meaningAndDesc = _b[0], id = _b[1];
        var _c = __read(meaningAndDesc.split(MEANING_SEPARATOR, 2), 2), meaning = _c[0], description = _c[1];
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
function splitBlock(cooked, raw) {
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
 * The tagged-string is parsed to extract its `messageId` which is used to find an appropriate
 * `ParsedTranslation`.
 *
 * If one is found then it is used to translate the message into a new set of `messageParts` and
 * `substitutions`.
 * The translation may reorder (or remove) substitutions as appropriate.
 *
 * If no translation matches then an error is thrown.
 */
function translate(translations, messageParts, substitutions) {
    var message = parseMessage(messageParts, substitutions);
    var translation = translations[message.messageId];
    if (translation !== undefined) {
        return [
            translation.messageParts,
            translation.placeholderNames.map(function (placeholder) { return message.substitutions[placeholder]; })
        ];
    }
    else {
        throw new Error("No translation found for \"" + message.messageId + "\" (\"" + message.messageString + "\").");
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
    var rawMessageParts = messageParts.map(function (part) { return part.charAt(0) === BLOCK_MARKER ? '\\' + part : part; });
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
 * The given `translations` are processed and added to a lookup based on their `MessageId`.
 * A new translation will overwrite a previous translation if it has the same `MessageId`.
 *
 * * If a message is generated by the Angular compiler from an `i18n` marker in a template, the
 *   `MessageId` is passed through to the `$localize` call as a custom `MessageId`. The `MessageId`
 *   will match what is extracted into translation files.
 *
 * * If the translation is from a call to `$localize` in application code, and no custom `MessageId`
 *   is provided, then the `MessageId` can be generated by passing the tagged string message-parts
 *   to the `parseMessage()` function (not currently public API).
 *
 * @publicApi
 *
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
    try {
        return translate($localize.TRANSLATIONS, messageParts, substitutions);
    }
    catch (e) {
        console.warn(e.message);
        return [messageParts, substitutions];
    }
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

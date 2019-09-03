/**
 * A map of translations.
 *
 * The key is the original translation message, the value is the translated message.
 *
 * The format of these translation message strings uses `{$marker}` to indicate a placeholder.
 */
export interface Translations {
    [translationKey: string]: string;
}
/**
 * A translation message that has been processed to extract the message parts and placeholders.
 *
 * This is the format used by the runtime inlining to translate messages.
 */
export interface ParsedTranslation {
    messageParts: TemplateStringsArray;
    placeholderNames: string[];
}
/**
 * A localized message that has been processed to compute the translation key for looking up the
 * appropriate translation.
 */
export interface ParsedMessage {
    translationKey: string;
    substitutions: {
        [placeholderName: string]: any;
    };
}
/**
 * Load translations for `$localize`.
 *
 * The given `translations` are processed and added to a lookup based on their translation key.
 * A new translation will overwrite a previous translation if it has the same key.
 */
export declare function loadTranslations(translations: Translations): void;
/**
 * Remove all translations for `$localize`.
 */
export declare function clearTranslations(): void;
/**
 * Translate the text of the given message, using the loaded translations.
 *
 * This function may reorder (or remove) substitutions as indicated in the matching translation.
 */
export declare function translate(messageParts: TemplateStringsArray, substitutions: readonly any[]): [TemplateStringsArray, readonly any[]];
/**
 * Parse the `messageParts` and `placeholderNames` out of a translation key.
 *
 * @param translationKey the message to be parsed.
 */
export declare function parseTranslation(translationKey: string): ParsedTranslation;
/**
 * Process the `messageParts` and `substitutions` that were passed to the `$localize` tag in order
 * to match it to a translation.
 *
 * Specifically this function computes:
 * * the `translationKey` for looking up an appropriate translation for this message.
 * * a map of placeholder names to substitutions values.
 */
export declare function parseMessage(messageParts: TemplateStringsArray, expressions: readonly any[]): ParsedMessage;

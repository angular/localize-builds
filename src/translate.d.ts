import { TargetMessage, TranslationKey } from './utils/translations';
/**
 * Load translations for `$localize`.
 *
 * The given `translations` are processed and added to a lookup based on their translation key.
 * A new translation will overwrite a previous translation if it has the same key.
 *
 * @publicApi
 */
export declare function loadTranslations(translations: Record<TranslationKey, TargetMessage>): void;
/**
 * Remove all translations for `$localize`.
 *
 * @publicApi
 */
export declare function clearTranslations(): void;
/**
 * Translate the text of the given message, using the loaded translations.
 *
 * This function may reorder (or remove) substitutions as indicated in the matching translation.
 */
export declare function translate(messageParts: TemplateStringsArray, substitutions: readonly any[]): [TemplateStringsArray, readonly any[]];

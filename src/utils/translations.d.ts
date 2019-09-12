import { SourceMessage } from './messages';
/**
 * A key used to lookup a `TargetMessage` in a hash map.
 */
export declare type TranslationKey = SourceMessage;
/**
 * A string containing a translation target message.
 *
 * I.E. the message that indicates what will be translated to.
 *
 * Uses `{$placeholder-name}` to indicate a placeholder.
 */
export declare type TargetMessage = string;
/**
 * A translation message that has been processed to extract the message parts and placeholders.
 */
export interface ParsedTranslation {
    messageParts: TemplateStringsArray;
    placeholderNames: string[];
}
/**
 * The internal structure used by the runtime localization to translate messages.
 */
export declare type ParsedTranslations = Record<TranslationKey, ParsedTranslation>;
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
export declare function translate(translations: Record<string, ParsedTranslation>, messageParts: TemplateStringsArray, substitutions: readonly any[]): [TemplateStringsArray, readonly any[]];
/**
 * Parse the `messageParts` and `placeholderNames` out of a target `message`.
 *
 * Used by `loadTranslations()` to convert target message strings into a structure that is more
 * appropriate for doing translation.
 *
 * @param message the message to be parsed.
 */
export declare function parseTranslation(message: TargetMessage): ParsedTranslation;
/**
 * Create the specialized array that is passed to tagged-string tag functions.
 *
 * @param cooked The message parts with their escape codes processed.
 * @param raw The message parts with their escaped codes as-is.
 */
export declare function makeTemplateObject(cooked: string[], raw: string[]): TemplateStringsArray;

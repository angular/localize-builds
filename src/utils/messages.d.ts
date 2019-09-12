import { TranslationKey } from './translations';
/**
 * A string containing a translation source message.
 *
 * I.E. the message that indicates what will be translated from.
 *
 * Uses `{$placeholder-name}` to indicate a placeholder.
 */
export declare type SourceMessage = string;
/**
 * Information parsed from a `$localize` tagged string that is used to translate it.
 *
 * For example:
 *
 * ```
 * const name = 'Jo Bloggs';
 * $localize`Hello ${name}:title!`;
 * ```
 *
 * May be parsed into:
 *
 * ```
 * {
 *   translationKey: 'Hello {$title}!',
 *   substitutions: { title: 'Jo Bloggs' },
 * }
 * ```
 */
export interface ParsedMessage {
    /**
     * The key used to look up the appropriate translation target.
     */
    translationKey: TranslationKey;
    /**
     * A mapping of placeholder names to substitution values.
     */
    substitutions: Record<string, any>;
}
/**
 * Parse a `$localize` tagged string into a structure that can be used for translation.
 *
 * See `ParsedMessage` for an example.
 */
export declare function parseMessage(messageParts: TemplateStringsArray, expressions: readonly any[]): ParsedMessage;

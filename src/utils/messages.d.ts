/**
 * Re-export this helper function so that users of `@angular/localize` don't need to actively import
 * from `@angular/compiler`.
 */
export { computeMsgId } from '@angular/compiler';
/**
 * A string containing a translation source message.
 *
 * I.E. the message that indicates what will be translated from.
 *
 * Uses `{$placeholder-name}` to indicate a placeholder.
 */
export declare type SourceMessage = string;
/**
 * A string containing a translation target message.
 *
 * I.E. the message that indicates what will be translated to.
 *
 * Uses `{$placeholder-name}` to indicate a placeholder.
 */
export declare type TargetMessage = string;
/**
 * A string that uniquely identifies a message, to be used for matching translations.
 */
export declare type MessageId = string;
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
 *   messageId: '6998194507597730591',
 *   substitutions: { title: 'Jo Bloggs' },
 * }
 * ```
 */
export interface ParsedMessage {
    /**
     * The key used to look up the appropriate translation target.
     */
    messageId: MessageId;
    /**
     * A mapping of placeholder names to substitution values.
     */
    substitutions: Record<string, any>;
    /**
     * A human readable rendering of the message
     */
    messageString: string;
}
/**
 * Parse a `$localize` tagged string into a structure that can be used for translation.
 *
 * See `ParsedMessage` for an example.
 */
export declare function parseMessage(messageParts: TemplateStringsArray, expressions?: readonly any[]): ParsedMessage;
export interface MessageMetadata {
    text: string;
    meaning: string | undefined;
    description: string | undefined;
    id: string | undefined;
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
export declare function parseMetadata(cooked: string, raw: string): MessageMetadata;
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
export declare function splitBlock(cooked: string, raw: string): {
    text: string;
    block?: string;
};

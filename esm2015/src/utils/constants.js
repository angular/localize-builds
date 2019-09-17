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
export const BLOCK_MARKER = ':';
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
export const MEANING_SEPARATOR = '|';
/**
 * The marker used to separate a message's custom "id" from its "description" in a metadata block.
 *
 * For example:
 *
 * ```ts
 * $localize `:A welcome message on the home page@@myApp-homepage-welcome: Welcome!`;
 * ```
 */
export const ID_SEPARATOR = '@@';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3V0aWxzL2NvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSDs7Ozs7Ozs7Ozs7R0FXRztBQUNILE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRyxHQUFHLENBQUM7QUFFaEM7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsR0FBRyxDQUFDO0FBRXJDOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqXG4gKiBUaGUgY2hhcmFjdGVyIHVzZWQgdG8gbWFyayB0aGUgc3RhcnQgYW5kIGVuZCBvZiBhIFwiYmxvY2tcIiBpbiBhIGAkbG9jYWxpemVgIHRhZ2dlZCBzdHJpbmcuXG4gKiBBIGJsb2NrIGNhbiBpbmRpY2F0ZSBtZXRhZGF0YSBhYm91dCB0aGUgbWVzc2FnZSBvciBzcGVjaWZ5IGEgbmFtZSBvZiBhIHBsYWNlaG9sZGVyIGZvciBhXG4gKiBzdWJzdGl0dXRpb24gZXhwcmVzc2lvbnMuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogYGBgdHNcbiAqICRsb2NhbGl6ZWBIZWxsbywgJHt0aXRsZX06dGl0bGU6IWA7XG4gKiAkbG9jYWxpemVgOm1lYW5pbmd8ZGVzY3JpcHRpb25AQGlkOnNvdXJjZSBtZXNzYWdlIHRleHRgO1xuICogYGBgXG4gKi9cbmV4cG9ydCBjb25zdCBCTE9DS19NQVJLRVIgPSAnOic7XG5cbi8qKlxuICogVGhlIG1hcmtlciB1c2VkIHRvIHNlcGFyYXRlIGEgbWVzc2FnZSdzIFwibWVhbmluZ1wiIGZyb20gaXRzIFwiZGVzY3JpcHRpb25cIiBpbiBhIG1ldGFkYXRhIGJsb2NrLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYHRzXG4gKiAkbG9jYWxpemUgYDpjb3JyZWN0fEluZGljYXRlcyB0aGF0IHRoZSB1c2VyIGdvdCB0aGUgYW5zd2VyIGNvcnJlY3Q6IFJpZ2h0IWA7XG4gKiAkbG9jYWxpemUgYDptb3ZlbWVudHxCdXR0b24gbGFiZWwgZm9yIG1vdmluZyB0byB0aGUgcmlnaHQ6IFJpZ2h0IWA7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNvbnN0IE1FQU5JTkdfU0VQQVJBVE9SID0gJ3wnO1xuXG4vKipcbiAqIFRoZSBtYXJrZXIgdXNlZCB0byBzZXBhcmF0ZSBhIG1lc3NhZ2UncyBjdXN0b20gXCJpZFwiIGZyb20gaXRzIFwiZGVzY3JpcHRpb25cIiBpbiBhIG1ldGFkYXRhIGJsb2NrLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYHRzXG4gKiAkbG9jYWxpemUgYDpBIHdlbGNvbWUgbWVzc2FnZSBvbiB0aGUgaG9tZSBwYWdlQEBteUFwcC1ob21lcGFnZS13ZWxjb21lOiBXZWxjb21lIWA7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNvbnN0IElEX1NFUEFSQVRPUiA9ICdAQCc7XG4iXX0=
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3V0aWxzL3NyYy9jb25zdGFudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUg7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDO0FBRWhDOzs7Ozs7Ozs7R0FTRztBQUNILE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHLEdBQUcsQ0FBQztBQUVyQzs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKlxuICogVGhlIGNoYXJhY3RlciB1c2VkIHRvIG1hcmsgdGhlIHN0YXJ0IGFuZCBlbmQgb2YgYSBcImJsb2NrXCIgaW4gYSBgJGxvY2FsaXplYCB0YWdnZWQgc3RyaW5nLlxuICogQSBibG9jayBjYW4gaW5kaWNhdGUgbWV0YWRhdGEgYWJvdXQgdGhlIG1lc3NhZ2Ugb3Igc3BlY2lmeSBhIG5hbWUgb2YgYSBwbGFjZWhvbGRlciBmb3IgYVxuICogc3Vic3RpdHV0aW9uIGV4cHJlc3Npb25zLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYHRzXG4gKiAkbG9jYWxpemVgSGVsbG8sICR7dGl0bGV9OnRpdGxlOiFgO1xuICogJGxvY2FsaXplYDptZWFuaW5nfGRlc2NyaXB0aW9uQEBpZDpzb3VyY2UgbWVzc2FnZSB0ZXh0YDtcbiAqIGBgYFxuICovXG5leHBvcnQgY29uc3QgQkxPQ0tfTUFSS0VSID0gJzonO1xuXG4vKipcbiAqIFRoZSBtYXJrZXIgdXNlZCB0byBzZXBhcmF0ZSBhIG1lc3NhZ2UncyBcIm1lYW5pbmdcIiBmcm9tIGl0cyBcImRlc2NyaXB0aW9uXCIgaW4gYSBtZXRhZGF0YSBibG9jay5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogJGxvY2FsaXplIGA6Y29ycmVjdHxJbmRpY2F0ZXMgdGhhdCB0aGUgdXNlciBnb3QgdGhlIGFuc3dlciBjb3JyZWN0OiBSaWdodCFgO1xuICogJGxvY2FsaXplIGA6bW92ZW1lbnR8QnV0dG9uIGxhYmVsIGZvciBtb3ZpbmcgdG8gdGhlIHJpZ2h0OiBSaWdodCFgO1xuICogYGBgXG4gKi9cbmV4cG9ydCBjb25zdCBNRUFOSU5HX1NFUEFSQVRPUiA9ICd8JztcblxuLyoqXG4gKiBUaGUgbWFya2VyIHVzZWQgdG8gc2VwYXJhdGUgYSBtZXNzYWdlJ3MgY3VzdG9tIFwiaWRcIiBmcm9tIGl0cyBcImRlc2NyaXB0aW9uXCIgaW4gYSBtZXRhZGF0YSBibG9jay5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogJGxvY2FsaXplIGA6QSB3ZWxjb21lIG1lc3NhZ2Ugb24gdGhlIGhvbWUgcGFnZUBAbXlBcHAtaG9tZXBhZ2Utd2VsY29tZTogV2VsY29tZSFgO1xuICogYGBgXG4gKi9cbmV4cG9ydCBjb25zdCBJRF9TRVBBUkFUT1IgPSAnQEAnO1xuIl19
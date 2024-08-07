import { parseTranslation, translate as _translate, } from './utils';
/**
 * Load translations for use by `$localize`, if doing runtime translation.
 *
 * If the `$localize` tagged strings are not going to be replaced at compiled time, it is possible
 * to load a set of translations that will be applied to the `$localize` tagged strings at runtime,
 * in the browser.
 *
 * Loading a new translation will overwrite a previous translation if it has the same `MessageId`.
 *
 * Note that `$localize` messages are only processed once, when the tagged string is first
 * encountered, and does not provide dynamic language changing without refreshing the browser.
 * Loading new translations later in the application life-cycle will not change the translated text
 * of messages that have already been translated.
 *
 * The message IDs and translations are in the same format as that rendered to "simple JSON"
 * translation files when extracting messages. In particular, placeholders in messages are rendered
 * using the `{$PLACEHOLDER_NAME}` syntax. For example the message from the following template:
 *
 * ```html
 * <div i18n>pre<span>inner-pre<b>bold</b>inner-post</span>post</div>
 * ```
 *
 * would have the following form in the `translations` map:
 *
 * ```ts
 * {
 *   "2932901491976224757":
 *      "pre{$START_TAG_SPAN}inner-pre{$START_BOLD_TEXT}bold{$CLOSE_BOLD_TEXT}inner-post{$CLOSE_TAG_SPAN}post"
 * }
 * ```
 *
 * @param translations A map from message ID to translated message.
 *
 * These messages are processed and added to a lookup based on their `MessageId`.
 *
 * @see {@link clearTranslations} for removing translations loaded using this function.
 * @see {@link $localize} for tagging messages as needing to be translated.
 * @publicApi
 */
export function loadTranslations(translations) {
    // Ensure the translate function exists
    if (!$localize.translate) {
        $localize.translate = translate;
    }
    if (!$localize.TRANSLATIONS) {
        $localize.TRANSLATIONS = {};
    }
    Object.keys(translations).forEach((key) => {
        $localize.TRANSLATIONS[key] = parseTranslation(translations[key]);
    });
}
/**
 * Remove all translations for `$localize`, if doing runtime translation.
 *
 * All translations that had been loading into memory using `loadTranslations()` will be removed.
 *
 * @see {@link loadTranslations} for loading translations at runtime.
 * @see {@link $localize} for tagging messages as needing to be translated.
 *
 * @publicApi
 */
export function clearTranslations() {
    $localize.translate = undefined;
    $localize.TRANSLATIONS = {};
}
/**
 * Translate the text of the given message, using the loaded translations.
 *
 * This function may reorder (or remove) substitutions as indicated in the matching translation.
 */
export function translate(messageParts, substitutions) {
    try {
        return _translate($localize.TRANSLATIONS, messageParts, substitutions);
    }
    catch (e) {
        console.warn(e.message);
        return [messageParts, substitutions];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3RyYW5zbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxPQUFPLEVBR0wsZ0JBQWdCLEVBRWhCLFNBQVMsSUFBSSxVQUFVLEdBQ3hCLE1BQU0sU0FBUyxDQUFDO0FBVWpCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNDRztBQUNILE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxZQUE4QztJQUM3RSx1Q0FBdUM7SUFDdkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN6QixTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUNsQyxDQUFDO0lBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUM1QixTQUFTLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUN4QyxTQUFTLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVEOzs7Ozs7Ozs7R0FTRztBQUNILE1BQU0sVUFBVSxpQkFBaUI7SUFDL0IsU0FBUyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDaEMsU0FBUyxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7QUFDOUIsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsU0FBUyxDQUN2QixZQUFrQyxFQUNsQyxhQUE2QjtJQUU3QixJQUFJLENBQUM7UUFDSCxPQUFPLFVBQVUsQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxhQUFhLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUNYLE9BQU8sQ0FBQyxJQUFJLENBQUUsQ0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25DLE9BQU8sQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDdkMsQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7TG9jYWxpemVGbn0gZnJvbSAnLi9sb2NhbGl6ZSc7XG5pbXBvcnQge1xuICBNZXNzYWdlSWQsXG4gIFBhcnNlZFRyYW5zbGF0aW9uLFxuICBwYXJzZVRyYW5zbGF0aW9uLFxuICBUYXJnZXRNZXNzYWdlLFxuICB0cmFuc2xhdGUgYXMgX3RyYW5zbGF0ZSxcbn0gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogV2UgYXVnbWVudCB0aGUgYCRsb2NhbGl6ZWAgb2JqZWN0IHRvIGFsc28gc3RvcmUgdGhlIHRyYW5zbGF0aW9ucy5cbiAqXG4gKiBOb3RlIHRoYXQgYmVjYXVzZSB0aGUgVFJBTlNMQVRJT05TIGFyZSBhdHRhY2hlZCB0byBhIGdsb2JhbCBvYmplY3QsIHRoZXkgd2lsbCBiZSBzaGFyZWQgYmV0d2VlblxuICogYWxsIGFwcGxpY2F0aW9ucyB0aGF0IGFyZSBydW5uaW5nIGluIGEgc2luZ2xlIHBhZ2Ugb2YgdGhlIGJyb3dzZXIuXG4gKi9cbmRlY2xhcmUgY29uc3QgJGxvY2FsaXplOiBMb2NhbGl6ZUZuICYge1RSQU5TTEFUSU9OUzogUmVjb3JkPE1lc3NhZ2VJZCwgUGFyc2VkVHJhbnNsYXRpb24+fTtcblxuLyoqXG4gKiBMb2FkIHRyYW5zbGF0aW9ucyBmb3IgdXNlIGJ5IGAkbG9jYWxpemVgLCBpZiBkb2luZyBydW50aW1lIHRyYW5zbGF0aW9uLlxuICpcbiAqIElmIHRoZSBgJGxvY2FsaXplYCB0YWdnZWQgc3RyaW5ncyBhcmUgbm90IGdvaW5nIHRvIGJlIHJlcGxhY2VkIGF0IGNvbXBpbGVkIHRpbWUsIGl0IGlzIHBvc3NpYmxlXG4gKiB0byBsb2FkIGEgc2V0IG9mIHRyYW5zbGF0aW9ucyB0aGF0IHdpbGwgYmUgYXBwbGllZCB0byB0aGUgYCRsb2NhbGl6ZWAgdGFnZ2VkIHN0cmluZ3MgYXQgcnVudGltZSxcbiAqIGluIHRoZSBicm93c2VyLlxuICpcbiAqIExvYWRpbmcgYSBuZXcgdHJhbnNsYXRpb24gd2lsbCBvdmVyd3JpdGUgYSBwcmV2aW91cyB0cmFuc2xhdGlvbiBpZiBpdCBoYXMgdGhlIHNhbWUgYE1lc3NhZ2VJZGAuXG4gKlxuICogTm90ZSB0aGF0IGAkbG9jYWxpemVgIG1lc3NhZ2VzIGFyZSBvbmx5IHByb2Nlc3NlZCBvbmNlLCB3aGVuIHRoZSB0YWdnZWQgc3RyaW5nIGlzIGZpcnN0XG4gKiBlbmNvdW50ZXJlZCwgYW5kIGRvZXMgbm90IHByb3ZpZGUgZHluYW1pYyBsYW5ndWFnZSBjaGFuZ2luZyB3aXRob3V0IHJlZnJlc2hpbmcgdGhlIGJyb3dzZXIuXG4gKiBMb2FkaW5nIG5ldyB0cmFuc2xhdGlvbnMgbGF0ZXIgaW4gdGhlIGFwcGxpY2F0aW9uIGxpZmUtY3ljbGUgd2lsbCBub3QgY2hhbmdlIHRoZSB0cmFuc2xhdGVkIHRleHRcbiAqIG9mIG1lc3NhZ2VzIHRoYXQgaGF2ZSBhbHJlYWR5IGJlZW4gdHJhbnNsYXRlZC5cbiAqXG4gKiBUaGUgbWVzc2FnZSBJRHMgYW5kIHRyYW5zbGF0aW9ucyBhcmUgaW4gdGhlIHNhbWUgZm9ybWF0IGFzIHRoYXQgcmVuZGVyZWQgdG8gXCJzaW1wbGUgSlNPTlwiXG4gKiB0cmFuc2xhdGlvbiBmaWxlcyB3aGVuIGV4dHJhY3RpbmcgbWVzc2FnZXMuIEluIHBhcnRpY3VsYXIsIHBsYWNlaG9sZGVycyBpbiBtZXNzYWdlcyBhcmUgcmVuZGVyZWRcbiAqIHVzaW5nIHRoZSBgeyRQTEFDRUhPTERFUl9OQU1FfWAgc3ludGF4LiBGb3IgZXhhbXBsZSB0aGUgbWVzc2FnZSBmcm9tIHRoZSBmb2xsb3dpbmcgdGVtcGxhdGU6XG4gKlxuICogYGBgaHRtbFxuICogPGRpdiBpMThuPnByZTxzcGFuPmlubmVyLXByZTxiPmJvbGQ8L2I+aW5uZXItcG9zdDwvc3Bhbj5wb3N0PC9kaXY+XG4gKiBgYGBcbiAqXG4gKiB3b3VsZCBoYXZlIHRoZSBmb2xsb3dpbmcgZm9ybSBpbiB0aGUgYHRyYW5zbGF0aW9uc2AgbWFwOlxuICpcbiAqIGBgYHRzXG4gKiB7XG4gKiAgIFwiMjkzMjkwMTQ5MTk3NjIyNDc1N1wiOlxuICogICAgICBcInByZXskU1RBUlRfVEFHX1NQQU59aW5uZXItcHJleyRTVEFSVF9CT0xEX1RFWFR9Ym9sZHskQ0xPU0VfQk9MRF9URVhUfWlubmVyLXBvc3R7JENMT1NFX1RBR19TUEFOfXBvc3RcIlxuICogfVxuICogYGBgXG4gKlxuICogQHBhcmFtIHRyYW5zbGF0aW9ucyBBIG1hcCBmcm9tIG1lc3NhZ2UgSUQgdG8gdHJhbnNsYXRlZCBtZXNzYWdlLlxuICpcbiAqIFRoZXNlIG1lc3NhZ2VzIGFyZSBwcm9jZXNzZWQgYW5kIGFkZGVkIHRvIGEgbG9va3VwIGJhc2VkIG9uIHRoZWlyIGBNZXNzYWdlSWRgLlxuICpcbiAqIEBzZWUge0BsaW5rIGNsZWFyVHJhbnNsYXRpb25zfSBmb3IgcmVtb3ZpbmcgdHJhbnNsYXRpb25zIGxvYWRlZCB1c2luZyB0aGlzIGZ1bmN0aW9uLlxuICogQHNlZSB7QGxpbmsgJGxvY2FsaXplfSBmb3IgdGFnZ2luZyBtZXNzYWdlcyBhcyBuZWVkaW5nIHRvIGJlIHRyYW5zbGF0ZWQuXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2FkVHJhbnNsYXRpb25zKHRyYW5zbGF0aW9uczogUmVjb3JkPE1lc3NhZ2VJZCwgVGFyZ2V0TWVzc2FnZT4pIHtcbiAgLy8gRW5zdXJlIHRoZSB0cmFuc2xhdGUgZnVuY3Rpb24gZXhpc3RzXG4gIGlmICghJGxvY2FsaXplLnRyYW5zbGF0ZSkge1xuICAgICRsb2NhbGl6ZS50cmFuc2xhdGUgPSB0cmFuc2xhdGU7XG4gIH1cbiAgaWYgKCEkbG9jYWxpemUuVFJBTlNMQVRJT05TKSB7XG4gICAgJGxvY2FsaXplLlRSQU5TTEFUSU9OUyA9IHt9O1xuICB9XG4gIE9iamVjdC5rZXlzKHRyYW5zbGF0aW9ucykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgJGxvY2FsaXplLlRSQU5TTEFUSU9OU1trZXldID0gcGFyc2VUcmFuc2xhdGlvbih0cmFuc2xhdGlvbnNba2V5XSk7XG4gIH0pO1xufVxuXG4vKipcbiAqIFJlbW92ZSBhbGwgdHJhbnNsYXRpb25zIGZvciBgJGxvY2FsaXplYCwgaWYgZG9pbmcgcnVudGltZSB0cmFuc2xhdGlvbi5cbiAqXG4gKiBBbGwgdHJhbnNsYXRpb25zIHRoYXQgaGFkIGJlZW4gbG9hZGluZyBpbnRvIG1lbW9yeSB1c2luZyBgbG9hZFRyYW5zbGF0aW9ucygpYCB3aWxsIGJlIHJlbW92ZWQuXG4gKlxuICogQHNlZSB7QGxpbmsgbG9hZFRyYW5zbGF0aW9uc30gZm9yIGxvYWRpbmcgdHJhbnNsYXRpb25zIGF0IHJ1bnRpbWUuXG4gKiBAc2VlIHtAbGluayAkbG9jYWxpemV9IGZvciB0YWdnaW5nIG1lc3NhZ2VzIGFzIG5lZWRpbmcgdG8gYmUgdHJhbnNsYXRlZC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhclRyYW5zbGF0aW9ucygpIHtcbiAgJGxvY2FsaXplLnRyYW5zbGF0ZSA9IHVuZGVmaW5lZDtcbiAgJGxvY2FsaXplLlRSQU5TTEFUSU9OUyA9IHt9O1xufVxuXG4vKipcbiAqIFRyYW5zbGF0ZSB0aGUgdGV4dCBvZiB0aGUgZ2l2ZW4gbWVzc2FnZSwgdXNpbmcgdGhlIGxvYWRlZCB0cmFuc2xhdGlvbnMuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBtYXkgcmVvcmRlciAob3IgcmVtb3ZlKSBzdWJzdGl0dXRpb25zIGFzIGluZGljYXRlZCBpbiB0aGUgbWF0Y2hpbmcgdHJhbnNsYXRpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2xhdGUoXG4gIG1lc3NhZ2VQYXJ0czogVGVtcGxhdGVTdHJpbmdzQXJyYXksXG4gIHN1YnN0aXR1dGlvbnM6IHJlYWRvbmx5IGFueVtdLFxuKTogW1RlbXBsYXRlU3RyaW5nc0FycmF5LCByZWFkb25seSBhbnlbXV0ge1xuICB0cnkge1xuICAgIHJldHVybiBfdHJhbnNsYXRlKCRsb2NhbGl6ZS5UUkFOU0xBVElPTlMsIG1lc3NhZ2VQYXJ0cywgc3Vic3RpdHV0aW9ucyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oKGUgYXMgRXJyb3IpLm1lc3NhZ2UpO1xuICAgIHJldHVybiBbbWVzc2FnZVBhcnRzLCBzdWJzdGl0dXRpb25zXTtcbiAgfVxufVxuIl19
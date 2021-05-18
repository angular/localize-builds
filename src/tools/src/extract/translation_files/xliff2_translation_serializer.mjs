/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { getFileSystem } from '@angular/compiler-cli/src/ngtsc/file_system';
import { validateOptions } from './format_options';
import { extractIcuPlaceholders } from './icu_parsing';
import { consolidateMessages, hasLocation } from './utils';
import { XmlFile } from './xml_file';
/** This is the maximum number of characters that can appear in a legacy XLIFF 2.0 message id. */
const MAX_LEGACY_XLIFF_2_MESSAGE_LENGTH = 20;
/**
 * A translation serializer that can write translations in XLIFF 2 format.
 *
 * https://docs.oasis-open.org/xliff/xliff-core/v2.0/os/xliff-core-v2.0-os.html
 *
 * @see Xliff2TranslationParser
 * @publicApi used by CLI
 */
export class Xliff2TranslationSerializer {
    constructor(sourceLocale, basePath, useLegacyIds, formatOptions = {}, fs = getFileSystem()) {
        this.sourceLocale = sourceLocale;
        this.basePath = basePath;
        this.useLegacyIds = useLegacyIds;
        this.formatOptions = formatOptions;
        this.fs = fs;
        this.currentPlaceholderId = 0;
        validateOptions('Xliff1TranslationSerializer', [['xml:space', ['preserve']]], formatOptions);
    }
    serialize(messages) {
        const messageGroups = consolidateMessages(messages, message => this.getMessageId(message));
        const xml = new XmlFile();
        xml.startTag('xliff', {
            'version': '2.0',
            'xmlns': 'urn:oasis:names:tc:xliff:document:2.0',
            'srcLang': this.sourceLocale
        });
        // NOTE: the `original` property is set to the legacy `ng.template` value for backward
        // compatibility.
        // We could compute the file from the `message.location` property, but there could
        // be multiple values for this in the collection of `messages`. In that case we would probably
        // need to change the serializer to output a new `<file>` element for each collection of
        // messages that come from a particular original file, and the translation file parsers may
        // not
        xml.startTag('file', Object.assign({ 'id': 'ngi18n', 'original': 'ng.template' }, this.formatOptions));
        for (const duplicateMessages of messageGroups) {
            const message = duplicateMessages[0];
            const id = this.getMessageId(message);
            xml.startTag('unit', { id });
            const messagesWithLocations = duplicateMessages.filter(hasLocation);
            if (message.meaning || message.description || messagesWithLocations.length) {
                xml.startTag('notes');
                // Write all the locations
                for (const { location: { file, start, end } } of messagesWithLocations) {
                    const endLineString = end !== undefined && end.line !== start.line ? `,${end.line + 1}` : '';
                    this.serializeNote(xml, 'location', `${this.fs.relative(this.basePath, file)}:${start.line + 1}${endLineString}`);
                }
                if (message.description) {
                    this.serializeNote(xml, 'description', message.description);
                }
                if (message.meaning) {
                    this.serializeNote(xml, 'meaning', message.meaning);
                }
                xml.endTag('notes');
            }
            xml.startTag('segment');
            xml.startTag('source', {}, { preserveWhitespace: true });
            this.serializeMessage(xml, message);
            xml.endTag('source', { preserveWhitespace: false });
            xml.endTag('segment');
            xml.endTag('unit');
        }
        xml.endTag('file');
        xml.endTag('xliff');
        return xml.toString();
    }
    serializeMessage(xml, message) {
        this.currentPlaceholderId = 0;
        const length = message.messageParts.length - 1;
        for (let i = 0; i < length; i++) {
            this.serializeTextPart(xml, message.messageParts[i]);
            this.serializePlaceholder(xml, message.placeholderNames[i], message.substitutionLocations);
        }
        this.serializeTextPart(xml, message.messageParts[length]);
    }
    serializeTextPart(xml, text) {
        const pieces = extractIcuPlaceholders(text);
        const length = pieces.length - 1;
        for (let i = 0; i < length; i += 2) {
            xml.text(pieces[i]);
            this.serializePlaceholder(xml, pieces[i + 1], undefined);
        }
        xml.text(pieces[length]);
    }
    serializePlaceholder(xml, placeholderName, substitutionLocations) {
        var _a, _b;
        const text = (_a = substitutionLocations === null || substitutionLocations === void 0 ? void 0 : substitutionLocations[placeholderName]) === null || _a === void 0 ? void 0 : _a.text;
        if (placeholderName.startsWith('START_')) {
            // Replace the `START` with `CLOSE` and strip off any `_1` ids from the end.
            const closingPlaceholderName = placeholderName.replace(/^START/, 'CLOSE').replace(/_\d+$/, '');
            const closingText = (_b = substitutionLocations === null || substitutionLocations === void 0 ? void 0 : substitutionLocations[closingPlaceholderName]) === null || _b === void 0 ? void 0 : _b.text;
            const attrs = {
                id: `${this.currentPlaceholderId++}`,
                equivStart: placeholderName,
                equivEnd: closingPlaceholderName,
            };
            const type = getTypeForPlaceholder(placeholderName);
            if (type !== null) {
                attrs.type = type;
            }
            if (text !== undefined) {
                attrs.dispStart = text;
            }
            if (closingText !== undefined) {
                attrs.dispEnd = closingText;
            }
            xml.startTag('pc', attrs);
        }
        else if (placeholderName.startsWith('CLOSE_')) {
            xml.endTag('pc');
        }
        else {
            const attrs = {
                id: `${this.currentPlaceholderId++}`,
                equiv: placeholderName,
            };
            const type = getTypeForPlaceholder(placeholderName);
            if (type !== null) {
                attrs.type = type;
            }
            if (text !== undefined) {
                attrs.disp = text;
            }
            xml.startTag('ph', attrs, { selfClosing: true });
        }
    }
    serializeNote(xml, name, value) {
        xml.startTag('note', { category: name }, { preserveWhitespace: true });
        xml.text(value);
        xml.endTag('note', { preserveWhitespace: false });
    }
    /**
     * Get the id for the given `message`.
     *
     * If there was a custom id provided, use that.
     *
     * If we have requested legacy message ids, then try to return the appropriate id
     * from the list of legacy ids that were extracted.
     *
     * Otherwise return the canonical message id.
     *
     * An Xliff 2.0 legacy message id is a 64 bit number encoded as a decimal string, which will have
     * at most 20 digits, since 2^65-1 = 36,893,488,147,419,103,231. This digest is based on:
     * https://github.com/google/closure-compiler/blob/master/src/com/google/javascript/jscomp/GoogleJsMessageIdGenerator.java
     */
    getMessageId(message) {
        return message.customId ||
            this.useLegacyIds && message.legacyIds !== undefined &&
                message.legacyIds.find(id => id.length <= MAX_LEGACY_XLIFF_2_MESSAGE_LENGTH && !/[^0-9]/.test(id)) ||
            message.id;
    }
}
/**
 * Compute the value of the `type` attribute from the `placeholder` name.
 *
 * If the tag is not known but starts with `TAG_`, `START_TAG_` or `CLOSE_TAG_` then the type is
 * `other`. Certain formatting tags (e.g. bold, italic, etc) have type `fmt`. Line-breaks, images
 * and links are special cases.
 */
function getTypeForPlaceholder(placeholder) {
    const tag = placeholder.replace(/^(START_|CLOSE_)/, '').replace(/_\d+$/, '');
    switch (tag) {
        case 'BOLD_TEXT':
        case 'EMPHASISED_TEXT':
        case 'ITALIC_TEXT':
        case 'LINE_BREAK':
        case 'STRIKETHROUGH_TEXT':
        case 'UNDERLINED_TEXT':
            return 'fmt';
        case 'TAG_IMG':
            return 'image';
        case 'LINK':
            return 'link';
        default:
            return /^(START_|CLOSE_)/.test(placeholder) ? 'other' : null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYyX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2V4dHJhY3QvdHJhbnNsYXRpb25fZmlsZXMveGxpZmYyX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFpQixhQUFhLEVBQW1CLE1BQU0sNkNBQTZDLENBQUM7QUFHNUcsT0FBTyxFQUFnQixlQUFlLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNoRSxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFckQsT0FBTyxFQUFDLG1CQUFtQixFQUFFLFdBQVcsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUN6RCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRW5DLGlHQUFpRztBQUNqRyxNQUFNLGlDQUFpQyxHQUFHLEVBQUUsQ0FBQztBQUU3Qzs7Ozs7OztHQU9HO0FBQ0gsTUFBTSxPQUFPLDJCQUEyQjtJQUV0QyxZQUNZLFlBQW9CLEVBQVUsUUFBd0IsRUFBVSxZQUFxQixFQUNyRixnQkFBK0IsRUFBRSxFQUFVLEtBQXVCLGFBQWEsRUFBRTtRQURqRixpQkFBWSxHQUFaLFlBQVksQ0FBUTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQWdCO1FBQVUsaUJBQVksR0FBWixZQUFZLENBQVM7UUFDckYsa0JBQWEsR0FBYixhQUFhLENBQW9CO1FBQVUsT0FBRSxHQUFGLEVBQUUsQ0FBb0M7UUFIckYseUJBQW9CLEdBQUcsQ0FBQyxDQUFDO1FBSS9CLGVBQWUsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQy9GLENBQUM7SUFF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Q0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRDs7Ozs7Ozs7Ozs7OztPQWFHO0lBQ0ssWUFBWSxDQUFDLE9BQXVCO1FBQzFDLE9BQU8sT0FBTyxDQUFDLFFBQVE7WUFDbkIsSUFBSSxDQUFDLFlBQVksSUFBSSxPQUFPLENBQUMsU0FBUyxLQUFLLFNBQVM7Z0JBQ3BELE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUNsQixFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQUksaUNBQWlDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQy9FLE9BQU8sQ0FBQyxFQUFFLENBQUM7SUFDakIsQ0FBQztDQUNGO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsU0FBUyxxQkFBcUIsQ0FBQyxXQUFtQjtJQUNoRCxNQUFNLEdBQUcsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDN0UsUUFBUSxHQUFHLEVBQUU7UUFDWCxLQUFLLFdBQVcsQ0FBQztRQUNqQixLQUFLLGlCQUFpQixDQUFDO1FBQ3ZCLEtBQUssYUFBYSxDQUFDO1FBQ25CLEtBQUssWUFBWSxDQUFDO1FBQ2xCLEtBQUssb0JBQW9CLENBQUM7UUFDMUIsS0FBSyxpQkFBaUI7WUFDcEIsT0FBTyxLQUFLLENBQUM7UUFDZixLQUFLLFNBQVM7WUFDWixPQUFPLE9BQU8sQ0FBQztRQUNqQixLQUFLLE1BQU07WUFDVCxPQUFPLE1BQU0sQ0FBQztRQUNoQjtZQUNFLE9BQU8sa0JBQWtCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztLQUNoRTtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGgsIGdldEZpbGVTeXN0ZW0sIFBhdGhNYW5pcHVsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHvJtVBhcnNlZE1lc3NhZ2UsIMm1U291cmNlTG9jYXRpb259IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcblxuaW1wb3J0IHtGb3JtYXRPcHRpb25zLCB2YWxpZGF0ZU9wdGlvbnN9IGZyb20gJy4vZm9ybWF0X29wdGlvbnMnO1xuaW1wb3J0IHtleHRyYWN0SWN1UGxhY2Vob2xkZXJzfSBmcm9tICcuL2ljdV9wYXJzaW5nJztcbmltcG9ydCB7VHJhbnNsYXRpb25TZXJpYWxpemVyfSBmcm9tICcuL3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtjb25zb2xpZGF0ZU1lc3NhZ2VzLCBoYXNMb2NhdGlvbn0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge1htbEZpbGV9IGZyb20gJy4veG1sX2ZpbGUnO1xuXG4vKiogVGhpcyBpcyB0aGUgbWF4aW11bSBudW1iZXIgb2YgY2hhcmFjdGVycyB0aGF0IGNhbiBhcHBlYXIgaW4gYSBsZWdhY3kgWExJRkYgMi4wIG1lc3NhZ2UgaWQuICovXG5jb25zdCBNQVhfTEVHQUNZX1hMSUZGXzJfTUVTU0FHRV9MRU5HVEggPSAyMDtcblxuLyoqXG4gKiBBIHRyYW5zbGF0aW9uIHNlcmlhbGl6ZXIgdGhhdCBjYW4gd3JpdGUgdHJhbnNsYXRpb25zIGluIFhMSUZGIDIgZm9ybWF0LlxuICpcbiAqIGh0dHBzOi8vZG9jcy5vYXNpcy1vcGVuLm9yZy94bGlmZi94bGlmZi1jb3JlL3YyLjAvb3MveGxpZmYtY29yZS12Mi4wLW9zLmh0bWxcbiAqXG4gKiBAc2VlIFhsaWZmMlRyYW5zbGF0aW9uUGFyc2VyXG4gKiBAcHVibGljQXBpIHVzZWQgYnkgQ0xJXG4gKi9cbmV4cG9ydCBjbGFzcyBYbGlmZjJUcmFuc2xhdGlvblNlcmlhbGl6ZXIgaW1wbGVtZW50cyBUcmFuc2xhdGlvblNlcmlhbGl6ZXIge1xuICBwcml2YXRlIGN1cnJlbnRQbGFjZWhvbGRlcklkID0gMDtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHNvdXJjZUxvY2FsZTogc3RyaW5nLCBwcml2YXRlIGJhc2VQYXRoOiBBYnNvbHV0ZUZzUGF0aCwgcHJpdmF0ZSB1c2VMZWdhY3lJZHM6IGJvb2xlYW4sXG4gICAgICBwcml2YXRlIGZvcm1hdE9wdGlvbnM6IEZvcm1hdE9wdGlvbnMgPSB7fSwgcHJpdmF0ZSBmczogUGF0aE1hbmlwdWxhdGlvbiA9IGdldEZpbGVTeXN0ZW0oKSkge1xuICAgIHZhbGlkYXRlT3B0aW9ucygnWGxpZmYxVHJhbnNsYXRpb25TZXJpYWxpemVyJywgW1sneG1sOnNwYWNlJywgWydwcmVzZXJ2ZSddXV0sIGZvcm1hdE9wdGlvbnMpO1xuICB9XG5cbiAgc2VyaWFsaXplKG1lc3NhZ2VzOiDJtVBhcnNlZE1lc3NhZ2VbXSk6IHN0cmluZyB7XG4gICAgY29uc3QgbWVzc2FnZUdyb3VwcyA9IGNvbnNvbGlkYXRlTWVzc2FnZXMobWVzc2FnZXMsIG1lc3NhZ2UgPT4gdGhpcy5nZXRNZXNzYWdlSWQobWVzc2FnZSkpO1xuICAgIGNvbnN0IHhtbCA9IG5ldyBYbWxGaWxlKCk7XG4gICAgeG1sLnN0YXJ0VGFnKCd4bGlmZicsIHtcbiAgICAgICd2ZXJzaW9uJzogJzIuMCcsXG4gICAgICAneG1sbnMnOiAndXJuOm9hc2lzOm5hbWVzOnRjOnhsaWZmOmRvY3VtZW50OjIuMCcsXG4gICAgICAnc3JjTGFuZyc6IHRoaXMuc291cmNlTG9jYWxlXG4gICAgfSk7XG4gICAgLy8gTk9URTogdGhlIGBvcmlnaW5hbGAgcHJvcGVydHkgaXMgc2V0IHRvIHRoZSBsZWdhY3kgYG5nLnRlbXBsYXRlYCB2YWx1ZSBmb3IgYmFja3dhcmRcbiAgICAvLyBjb21wYXRpYmlsaXR5LlxuICAgIC8vIFdlIGNvdWxkIGNvbXB1dGUgdGhlIGZpbGUgZnJvbSB0aGUgYG1lc3NhZ2UubG9jYXRpb25gIHByb3BlcnR5LCBidXQgdGhlcmUgY291bGRcbiAgICAvLyBiZSBtdWx0aXBsZSB2YWx1ZXMgZm9yIHRoaXMgaW4gdGhlIGNvbGxlY3Rpb24gb2YgYG1lc3NhZ2VzYC4gSW4gdGhhdCBjYXNlIHdlIHdvdWxkIHByb2JhYmx5XG4gICAgLy8gbmVlZCB0byBjaGFuZ2UgdGhlIHNlcmlhbGl6ZXIgdG8gb3V0cHV0IGEgbmV3IGA8ZmlsZT5gIGVsZW1lbnQgZm9yIGVhY2ggY29sbGVjdGlvbiBvZlxuICAgIC8vIG1lc3NhZ2VzIHRoYXQgY29tZSBmcm9tIGEgcGFydGljdWxhciBvcmlnaW5hbCBmaWxlLCBhbmQgdGhlIHRyYW5zbGF0aW9uIGZpbGUgcGFyc2VycyBtYXlcbiAgICAvLyBub3RcbiAgICB4bWwuc3RhcnRUYWcoJ2ZpbGUnLCB7J2lkJzogJ25naTE4bicsICdvcmlnaW5hbCc6ICduZy50ZW1wbGF0ZScsIC4uLnRoaXMuZm9ybWF0T3B0aW9uc30pO1xuICAgIGZvciAoY29uc3QgZHVwbGljYXRlTWVzc2FnZXMgb2YgbWVzc2FnZUdyb3Vwcykge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGR1cGxpY2F0ZU1lc3NhZ2VzWzBdO1xuICAgICAgY29uc3QgaWQgPSB0aGlzLmdldE1lc3NhZ2VJZChtZXNzYWdlKTtcblxuICAgICAgeG1sLnN0YXJ0VGFnKCd1bml0Jywge2lkfSk7XG4gICAgICBjb25zdCBtZXNzYWdlc1dpdGhMb2NhdGlvbnMgPSBkdXBsaWNhdGVNZXNzYWdlcy5maWx0ZXIoaGFzTG9jYXRpb24pO1xuICAgICAgaWYgKG1lc3NhZ2UubWVhbmluZyB8fCBtZXNzYWdlLmRlc2NyaXB0aW9uIHx8IG1lc3NhZ2VzV2l0aExvY2F0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgeG1sLnN0YXJ0VGFnKCdub3RlcycpO1xuXG4gICAgICAgIC8vIFdyaXRlIGFsbCB0aGUgbG9jYXRpb25zXG4gICAgICAgIGZvciAoY29uc3Qge2xvY2F0aW9uOiB7ZmlsZSwgc3RhcnQsIGVuZH19IG9mIG1lc3NhZ2VzV2l0aExvY2F0aW9ucykge1xuICAgICAgICAgIGNvbnN0IGVuZExpbmVTdHJpbmcgPVxuICAgICAgICAgICAgICBlbmQgIT09IHVuZGVmaW5lZCAmJiBlbmQubGluZSAhPT0gc3RhcnQubGluZSA/IGAsJHtlbmQubGluZSArIDF9YCA6ICcnO1xuICAgICAgICAgIHRoaXMuc2VyaWFsaXplTm90ZShcbiAgICAgICAgICAgICAgeG1sLCAnbG9jYXRpb24nLFxuICAgICAgICAgICAgICBgJHt0aGlzLmZzLnJlbGF0aXZlKHRoaXMuYmFzZVBhdGgsIGZpbGUpfToke3N0YXJ0LmxpbmUgKyAxfSR7ZW5kTGluZVN0cmluZ31gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZXNzYWdlLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgdGhpcy5zZXJpYWxpemVOb3RlKHhtbCwgJ2Rlc2NyaXB0aW9uJywgbWVzc2FnZS5kZXNjcmlwdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1lc3NhZ2UubWVhbmluZykge1xuICAgICAgICAgIHRoaXMuc2VyaWFsaXplTm90ZSh4bWwsICdtZWFuaW5nJywgbWVzc2FnZS5tZWFuaW5nKTtcbiAgICAgICAgfVxuICAgICAgICB4bWwuZW5kVGFnKCdub3RlcycpO1xuICAgICAgfVxuICAgICAgeG1sLnN0YXJ0VGFnKCdzZWdtZW50Jyk7XG4gICAgICB4bWwuc3RhcnRUYWcoJ3NvdXJjZScsIHt9LCB7cHJlc2VydmVXaGl0ZXNwYWNlOiB0cnVlfSk7XG4gICAgICB0aGlzLnNlcmlhbGl6ZU1lc3NhZ2UoeG1sLCBtZXNzYWdlKTtcbiAgICAgIHhtbC5lbmRUYWcoJ3NvdXJjZScsIHtwcmVzZXJ2ZVdoaXRlc3BhY2U6IGZhbHNlfSk7XG4gICAgICB4bWwuZW5kVGFnKCdzZWdtZW50Jyk7XG4gICAgICB4bWwuZW5kVGFnKCd1bml0Jyk7XG4gICAgfVxuICAgIHhtbC5lbmRUYWcoJ2ZpbGUnKTtcbiAgICB4bWwuZW5kVGFnKCd4bGlmZicpO1xuICAgIHJldHVybiB4bWwudG9TdHJpbmcoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplTWVzc2FnZSh4bWw6IFhtbEZpbGUsIG1lc3NhZ2U6IMm1UGFyc2VkTWVzc2FnZSk6IHZvaWQge1xuICAgIHRoaXMuY3VycmVudFBsYWNlaG9sZGVySWQgPSAwO1xuICAgIGNvbnN0IGxlbmd0aCA9IG1lc3NhZ2UubWVzc2FnZVBhcnRzLmxlbmd0aCAtIDE7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5zZXJpYWxpemVUZXh0UGFydCh4bWwsIG1lc3NhZ2UubWVzc2FnZVBhcnRzW2ldKTtcbiAgICAgIHRoaXMuc2VyaWFsaXplUGxhY2Vob2xkZXIoeG1sLCBtZXNzYWdlLnBsYWNlaG9sZGVyTmFtZXNbaV0sIG1lc3NhZ2Uuc3Vic3RpdHV0aW9uTG9jYXRpb25zKTtcbiAgICB9XG4gICAgdGhpcy5zZXJpYWxpemVUZXh0UGFydCh4bWwsIG1lc3NhZ2UubWVzc2FnZVBhcnRzW2xlbmd0aF0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVUZXh0UGFydCh4bWw6IFhtbEZpbGUsIHRleHQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHBpZWNlcyA9IGV4dHJhY3RJY3VQbGFjZWhvbGRlcnModGV4dCk7XG4gICAgY29uc3QgbGVuZ3RoID0gcGllY2VzLmxlbmd0aCAtIDE7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMikge1xuICAgICAgeG1sLnRleHQocGllY2VzW2ldKTtcbiAgICAgIHRoaXMuc2VyaWFsaXplUGxhY2Vob2xkZXIoeG1sLCBwaWVjZXNbaSArIDFdLCB1bmRlZmluZWQpO1xuICAgIH1cbiAgICB4bWwudGV4dChwaWVjZXNbbGVuZ3RoXSk7XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZVBsYWNlaG9sZGVyKFxuICAgICAgeG1sOiBYbWxGaWxlLCBwbGFjZWhvbGRlck5hbWU6IHN0cmluZyxcbiAgICAgIHN1YnN0aXR1dGlvbkxvY2F0aW9uczogUmVjb3JkPHN0cmluZywgybVTb3VyY2VMb2NhdGlvbnx1bmRlZmluZWQ+fHVuZGVmaW5lZCk6IHZvaWQge1xuICAgIGNvbnN0IHRleHQgPSBzdWJzdGl0dXRpb25Mb2NhdGlvbnM/LltwbGFjZWhvbGRlck5hbWVdPy50ZXh0O1xuXG4gICAgaWYgKHBsYWNlaG9sZGVyTmFtZS5zdGFydHNXaXRoKCdTVEFSVF8nKSkge1xuICAgICAgLy8gUmVwbGFjZSB0aGUgYFNUQVJUYCB3aXRoIGBDTE9TRWAgYW5kIHN0cmlwIG9mZiBhbnkgYF8xYCBpZHMgZnJvbSB0aGUgZW5kLlxuICAgICAgY29uc3QgY2xvc2luZ1BsYWNlaG9sZGVyTmFtZSA9XG4gICAgICAgICAgcGxhY2Vob2xkZXJOYW1lLnJlcGxhY2UoL15TVEFSVC8sICdDTE9TRScpLnJlcGxhY2UoL19cXGQrJC8sICcnKTtcbiAgICAgIGNvbnN0IGNsb3NpbmdUZXh0ID0gc3Vic3RpdHV0aW9uTG9jYXRpb25zPy5bY2xvc2luZ1BsYWNlaG9sZGVyTmFtZV0/LnRleHQ7XG4gICAgICBjb25zdCBhdHRyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAgICAgaWQ6IGAke3RoaXMuY3VycmVudFBsYWNlaG9sZGVySWQrK31gLFxuICAgICAgICBlcXVpdlN0YXJ0OiBwbGFjZWhvbGRlck5hbWUsXG4gICAgICAgIGVxdWl2RW5kOiBjbG9zaW5nUGxhY2Vob2xkZXJOYW1lLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IHR5cGUgPSBnZXRUeXBlRm9yUGxhY2Vob2xkZXIocGxhY2Vob2xkZXJOYW1lKTtcbiAgICAgIGlmICh0eXBlICE9PSBudWxsKSB7XG4gICAgICAgIGF0dHJzLnR5cGUgPSB0eXBlO1xuICAgICAgfVxuICAgICAgaWYgKHRleHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBhdHRycy5kaXNwU3RhcnQgPSB0ZXh0O1xuICAgICAgfVxuICAgICAgaWYgKGNsb3NpbmdUZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYXR0cnMuZGlzcEVuZCA9IGNsb3NpbmdUZXh0O1xuICAgICAgfVxuICAgICAgeG1sLnN0YXJ0VGFnKCdwYycsIGF0dHJzKTtcbiAgICB9IGVsc2UgaWYgKHBsYWNlaG9sZGVyTmFtZS5zdGFydHNXaXRoKCdDTE9TRV8nKSkge1xuICAgICAgeG1sLmVuZFRhZygncGMnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYXR0cnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgICAgIGlkOiBgJHt0aGlzLmN1cnJlbnRQbGFjZWhvbGRlcklkKyt9YCxcbiAgICAgICAgZXF1aXY6IHBsYWNlaG9sZGVyTmFtZSxcbiAgICAgIH07XG4gICAgICBjb25zdCB0eXBlID0gZ2V0VHlwZUZvclBsYWNlaG9sZGVyKHBsYWNlaG9sZGVyTmFtZSk7XG4gICAgICBpZiAodHlwZSAhPT0gbnVsbCkge1xuICAgICAgICBhdHRycy50eXBlID0gdHlwZTtcbiAgICAgIH1cbiAgICAgIGlmICh0ZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYXR0cnMuZGlzcCA9IHRleHQ7XG4gICAgICB9XG4gICAgICB4bWwuc3RhcnRUYWcoJ3BoJywgYXR0cnMsIHtzZWxmQ2xvc2luZzogdHJ1ZX0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplTm90ZSh4bWw6IFhtbEZpbGUsIG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIHhtbC5zdGFydFRhZygnbm90ZScsIHtjYXRlZ29yeTogbmFtZX0sIHtwcmVzZXJ2ZVdoaXRlc3BhY2U6IHRydWV9KTtcbiAgICB4bWwudGV4dCh2YWx1ZSk7XG4gICAgeG1sLmVuZFRhZygnbm90ZScsIHtwcmVzZXJ2ZVdoaXRlc3BhY2U6IGZhbHNlfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBpZCBmb3IgdGhlIGdpdmVuIGBtZXNzYWdlYC5cbiAgICpcbiAgICogSWYgdGhlcmUgd2FzIGEgY3VzdG9tIGlkIHByb3ZpZGVkLCB1c2UgdGhhdC5cbiAgICpcbiAgICogSWYgd2UgaGF2ZSByZXF1ZXN0ZWQgbGVnYWN5IG1lc3NhZ2UgaWRzLCB0aGVuIHRyeSB0byByZXR1cm4gdGhlIGFwcHJvcHJpYXRlIGlkXG4gICAqIGZyb20gdGhlIGxpc3Qgb2YgbGVnYWN5IGlkcyB0aGF0IHdlcmUgZXh0cmFjdGVkLlxuICAgKlxuICAgKiBPdGhlcndpc2UgcmV0dXJuIHRoZSBjYW5vbmljYWwgbWVzc2FnZSBpZC5cbiAgICpcbiAgICogQW4gWGxpZmYgMi4wIGxlZ2FjeSBtZXNzYWdlIGlkIGlzIGEgNjQgYml0IG51bWJlciBlbmNvZGVkIGFzIGEgZGVjaW1hbCBzdHJpbmcsIHdoaWNoIHdpbGwgaGF2ZVxuICAgKiBhdCBtb3N0IDIwIGRpZ2l0cywgc2luY2UgMl42NS0xID0gMzYsODkzLDQ4OCwxNDcsNDE5LDEwMywyMzEuIFRoaXMgZGlnZXN0IGlzIGJhc2VkIG9uOlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2Nsb3N1cmUtY29tcGlsZXIvYmxvYi9tYXN0ZXIvc3JjL2NvbS9nb29nbGUvamF2YXNjcmlwdC9qc2NvbXAvR29vZ2xlSnNNZXNzYWdlSWRHZW5lcmF0b3IuamF2YVxuICAgKi9cbiAgcHJpdmF0ZSBnZXRNZXNzYWdlSWQobWVzc2FnZTogybVQYXJzZWRNZXNzYWdlKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbWVzc2FnZS5jdXN0b21JZCB8fFxuICAgICAgICB0aGlzLnVzZUxlZ2FjeUlkcyAmJiBtZXNzYWdlLmxlZ2FjeUlkcyAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIG1lc3NhZ2UubGVnYWN5SWRzLmZpbmQoXG4gICAgICAgICAgICBpZCA9PiBpZC5sZW5ndGggPD0gTUFYX0xFR0FDWV9YTElGRl8yX01FU1NBR0VfTEVOR1RIICYmICEvW14wLTldLy50ZXN0KGlkKSkgfHxcbiAgICAgICAgbWVzc2FnZS5pZDtcbiAgfVxufVxuXG4vKipcbiAqIENvbXB1dGUgdGhlIHZhbHVlIG9mIHRoZSBgdHlwZWAgYXR0cmlidXRlIGZyb20gdGhlIGBwbGFjZWhvbGRlcmAgbmFtZS5cbiAqXG4gKiBJZiB0aGUgdGFnIGlzIG5vdCBrbm93biBidXQgc3RhcnRzIHdpdGggYFRBR19gLCBgU1RBUlRfVEFHX2Agb3IgYENMT1NFX1RBR19gIHRoZW4gdGhlIHR5cGUgaXNcbiAqIGBvdGhlcmAuIENlcnRhaW4gZm9ybWF0dGluZyB0YWdzIChlLmcuIGJvbGQsIGl0YWxpYywgZXRjKSBoYXZlIHR5cGUgYGZtdGAuIExpbmUtYnJlYWtzLCBpbWFnZXNcbiAqIGFuZCBsaW5rcyBhcmUgc3BlY2lhbCBjYXNlcy5cbiAqL1xuZnVuY3Rpb24gZ2V0VHlwZUZvclBsYWNlaG9sZGVyKHBsYWNlaG9sZGVyOiBzdHJpbmcpOiBzdHJpbmd8bnVsbCB7XG4gIGNvbnN0IHRhZyA9IHBsYWNlaG9sZGVyLnJlcGxhY2UoL14oU1RBUlRffENMT1NFXykvLCAnJykucmVwbGFjZSgvX1xcZCskLywgJycpO1xuICBzd2l0Y2ggKHRhZykge1xuICAgIGNhc2UgJ0JPTERfVEVYVCc6XG4gICAgY2FzZSAnRU1QSEFTSVNFRF9URVhUJzpcbiAgICBjYXNlICdJVEFMSUNfVEVYVCc6XG4gICAgY2FzZSAnTElORV9CUkVBSyc6XG4gICAgY2FzZSAnU1RSSUtFVEhST1VHSF9URVhUJzpcbiAgICBjYXNlICdVTkRFUkxJTkVEX1RFWFQnOlxuICAgICAgcmV0dXJuICdmbXQnO1xuICAgIGNhc2UgJ1RBR19JTUcnOlxuICAgICAgcmV0dXJuICdpbWFnZSc7XG4gICAgY2FzZSAnTElOSyc6XG4gICAgICByZXR1cm4gJ2xpbmsnO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gL14oU1RBUlRffENMT1NFXykvLnRlc3QocGxhY2Vob2xkZXIpID8gJ290aGVyJyA6IG51bGw7XG4gIH1cbn1cbiJdfQ==
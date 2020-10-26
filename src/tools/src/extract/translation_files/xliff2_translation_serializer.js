(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/extract/translation_files/xliff2_translation_serializer", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/localize/src/tools/src/extract/translation_files/format_options", "@angular/localize/src/tools/src/extract/translation_files/icu_parsing", "@angular/localize/src/tools/src/extract/translation_files/xml_file"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Xliff2TranslationSerializer = void 0;
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var format_options_1 = require("@angular/localize/src/tools/src/extract/translation_files/format_options");
    var icu_parsing_1 = require("@angular/localize/src/tools/src/extract/translation_files/icu_parsing");
    var xml_file_1 = require("@angular/localize/src/tools/src/extract/translation_files/xml_file");
    /** This is the maximum number of characters that can appear in a legacy XLIFF 2.0 message id. */
    var MAX_LEGACY_XLIFF_2_MESSAGE_LENGTH = 20;
    /**
     * A translation serializer that can write translations in XLIFF 2 format.
     *
     * http://docs.oasis-open.org/xliff/xliff-core/v2.0/os/xliff-core-v2.0-os.html
     *
     * @see Xliff2TranslationParser
     * @publicApi used by CLI
     */
    var Xliff2TranslationSerializer = /** @class */ (function () {
        function Xliff2TranslationSerializer(sourceLocale, basePath, useLegacyIds, formatOptions, fs) {
            if (formatOptions === void 0) { formatOptions = {}; }
            if (fs === void 0) { fs = file_system_1.getFileSystem(); }
            this.sourceLocale = sourceLocale;
            this.basePath = basePath;
            this.useLegacyIds = useLegacyIds;
            this.formatOptions = formatOptions;
            this.fs = fs;
            this.currentPlaceholderId = 0;
            format_options_1.validateOptions('Xliff1TranslationSerializer', [['xml:space', ['preserve']]], formatOptions);
        }
        Xliff2TranslationSerializer.prototype.serialize = function (messages) {
            var e_1, _a;
            var ids = new Set();
            var xml = new xml_file_1.XmlFile();
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
            xml.startTag('file', tslib_1.__assign({ 'id': 'ngi18n', 'original': 'ng.template' }, this.formatOptions));
            try {
                for (var messages_1 = tslib_1.__values(messages), messages_1_1 = messages_1.next(); !messages_1_1.done; messages_1_1 = messages_1.next()) {
                    var message = messages_1_1.value;
                    var id = this.getMessageId(message);
                    if (ids.has(id)) {
                        // Do not render the same message more than once
                        continue;
                    }
                    ids.add(id);
                    xml.startTag('unit', { id: id });
                    if (message.meaning || message.description || message.location) {
                        xml.startTag('notes');
                        if (message.location) {
                            var _b = message.location, file = _b.file, start = _b.start, end = _b.end;
                            var endLineString = end !== undefined && end.line !== start.line ? "," + (end.line + 1) : '';
                            this.serializeNote(xml, 'location', this.fs.relative(this.basePath, file) + ":" + (start.line + 1) + endLineString);
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
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (messages_1_1 && !messages_1_1.done && (_a = messages_1.return)) _a.call(messages_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            xml.endTag('file');
            xml.endTag('xliff');
            return xml.toString();
        };
        Xliff2TranslationSerializer.prototype.serializeMessage = function (xml, message) {
            this.currentPlaceholderId = 0;
            var length = message.messageParts.length - 1;
            for (var i = 0; i < length; i++) {
                this.serializeTextPart(xml, message.messageParts[i]);
                this.serializePlaceholder(xml, message.placeholderNames[i], message.substitutionLocations);
            }
            this.serializeTextPart(xml, message.messageParts[length]);
        };
        Xliff2TranslationSerializer.prototype.serializeTextPart = function (xml, text) {
            var pieces = icu_parsing_1.extractIcuPlaceholders(text);
            var length = pieces.length - 1;
            for (var i = 0; i < length; i += 2) {
                xml.text(pieces[i]);
                this.serializePlaceholder(xml, pieces[i + 1], undefined);
            }
            xml.text(pieces[length]);
        };
        Xliff2TranslationSerializer.prototype.serializePlaceholder = function (xml, placeholderName, substitutionLocations) {
            var _a, _b;
            var text = (_a = substitutionLocations === null || substitutionLocations === void 0 ? void 0 : substitutionLocations[placeholderName]) === null || _a === void 0 ? void 0 : _a.text;
            if (placeholderName.startsWith('START_')) {
                var closingPlaceholderName = placeholderName.replace(/^START/, 'CLOSE');
                var closingText = (_b = substitutionLocations === null || substitutionLocations === void 0 ? void 0 : substitutionLocations[closingPlaceholderName]) === null || _b === void 0 ? void 0 : _b.text;
                var attrs = {
                    id: "" + this.currentPlaceholderId++,
                    equivStart: placeholderName,
                    equivEnd: closingPlaceholderName,
                };
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
                var attrs = { id: "" + this.currentPlaceholderId++, equiv: placeholderName };
                if (text !== undefined) {
                    attrs.disp = text;
                }
                xml.startTag('ph', attrs, { selfClosing: true });
            }
        };
        Xliff2TranslationSerializer.prototype.serializeNote = function (xml, name, value) {
            xml.startTag('note', { category: name }, { preserveWhitespace: true });
            xml.text(value);
            xml.endTag('note', { preserveWhitespace: false });
        };
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
        Xliff2TranslationSerializer.prototype.getMessageId = function (message) {
            return message.customId ||
                this.useLegacyIds && message.legacyIds !== undefined &&
                    message.legacyIds.find(function (id) { return id.length <= MAX_LEGACY_XLIFF_2_MESSAGE_LENGTH && !/[^0-9]/.test(id); }) ||
                message.id;
        };
        return Xliff2TranslationSerializer;
    }());
    exports.Xliff2TranslationSerializer = Xliff2TranslationSerializer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYyX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2V4dHJhY3QvdHJhbnNsYXRpb25fZmlsZXMveGxpZmYyX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDJFQUFzRztJQUd0RywyR0FBZ0U7SUFDaEUscUdBQXFEO0lBRXJELCtGQUFtQztJQUVuQyxpR0FBaUc7SUFDakcsSUFBTSxpQ0FBaUMsR0FBRyxFQUFFLENBQUM7SUFFN0M7Ozs7Ozs7T0FPRztJQUNIO1FBRUUscUNBQ1ksWUFBb0IsRUFBVSxRQUF3QixFQUFVLFlBQXFCLEVBQ3JGLGFBQWlDLEVBQVUsRUFBZ0M7WUFBM0UsOEJBQUEsRUFBQSxrQkFBaUM7WUFBVSxtQkFBQSxFQUFBLEtBQWlCLDJCQUFhLEVBQUU7WUFEM0UsaUJBQVksR0FBWixZQUFZLENBQVE7WUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFnQjtZQUFVLGlCQUFZLEdBQVosWUFBWSxDQUFTO1lBQ3JGLGtCQUFhLEdBQWIsYUFBYSxDQUFvQjtZQUFVLE9BQUUsR0FBRixFQUFFLENBQThCO1lBSC9FLHlCQUFvQixHQUFHLENBQUMsQ0FBQztZQUkvQixnQ0FBZSxDQUFDLDZCQUE2QixFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDL0YsQ0FBQztRQUVELCtDQUFTLEdBQVQsVUFBVSxRQUEwQjs7WUFDbEMsSUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztZQUM5QixJQUFNLEdBQUcsR0FBRyxJQUFJLGtCQUFPLEVBQUUsQ0FBQztZQUMxQixHQUFHLENBQUMsUUFBUSxDQUFDLE9B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OlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0Fic29sdXRlRnNQYXRoLCBGaWxlU3lzdGVtLCBnZXRGaWxlU3lzdGVtfSBmcm9tICdAYW5ndWxhci9jb21waWxlci1jbGkvc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7ybVQYXJzZWRNZXNzYWdlLCDJtVNvdXJjZUxvY2F0aW9ufSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5cbmltcG9ydCB7Rm9ybWF0T3B0aW9ucywgdmFsaWRhdGVPcHRpb25zfSBmcm9tICcuL2Zvcm1hdF9vcHRpb25zJztcbmltcG9ydCB7ZXh0cmFjdEljdVBsYWNlaG9sZGVyc30gZnJvbSAnLi9pY3VfcGFyc2luZyc7XG5pbXBvcnQge1RyYW5zbGF0aW9uU2VyaWFsaXplcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9zZXJpYWxpemVyJztcbmltcG9ydCB7WG1sRmlsZX0gZnJvbSAnLi94bWxfZmlsZSc7XG5cbi8qKiBUaGlzIGlzIHRoZSBtYXhpbXVtIG51bWJlciBvZiBjaGFyYWN0ZXJzIHRoYXQgY2FuIGFwcGVhciBpbiBhIGxlZ2FjeSBYTElGRiAyLjAgbWVzc2FnZSBpZC4gKi9cbmNvbnN0IE1BWF9MRUdBQ1lfWExJRkZfMl9NRVNTQUdFX0xFTkdUSCA9IDIwO1xuXG4vKipcbiAqIEEgdHJhbnNsYXRpb24gc2VyaWFsaXplciB0aGF0IGNhbiB3cml0ZSB0cmFuc2xhdGlvbnMgaW4gWExJRkYgMiBmb3JtYXQuXG4gKlxuICogaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcveGxpZmYveGxpZmYtY29yZS92Mi4wL29zL3hsaWZmLWNvcmUtdjIuMC1vcy5odG1sXG4gKlxuICogQHNlZSBYbGlmZjJUcmFuc2xhdGlvblBhcnNlclxuICogQHB1YmxpY0FwaSB1c2VkIGJ5IENMSVxuICovXG5leHBvcnQgY2xhc3MgWGxpZmYyVHJhbnNsYXRpb25TZXJpYWxpemVyIGltcGxlbWVudHMgVHJhbnNsYXRpb25TZXJpYWxpemVyIHtcbiAgcHJpdmF0ZSBjdXJyZW50UGxhY2Vob2xkZXJJZCA9IDA7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBzb3VyY2VMb2NhbGU6IHN0cmluZywgcHJpdmF0ZSBiYXNlUGF0aDogQWJzb2x1dGVGc1BhdGgsIHByaXZhdGUgdXNlTGVnYWN5SWRzOiBib29sZWFuLFxuICAgICAgcHJpdmF0ZSBmb3JtYXRPcHRpb25zOiBGb3JtYXRPcHRpb25zID0ge30sIHByaXZhdGUgZnM6IEZpbGVTeXN0ZW0gPSBnZXRGaWxlU3lzdGVtKCkpIHtcbiAgICB2YWxpZGF0ZU9wdGlvbnMoJ1hsaWZmMVRyYW5zbGF0aW9uU2VyaWFsaXplcicsIFtbJ3htbDpzcGFjZScsIFsncHJlc2VydmUnXV1dLCBmb3JtYXRPcHRpb25zKTtcbiAgfVxuXG4gIHNlcmlhbGl6ZShtZXNzYWdlczogybVQYXJzZWRNZXNzYWdlW10pOiBzdHJpbmcge1xuICAgIGNvbnN0IGlkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IHhtbCA9IG5ldyBYbWxGaWxlKCk7XG4gICAgeG1sLnN0YXJ0VGFnKCd4bGlmZicsIHtcbiAgICAgICd2ZXJzaW9uJzogJzIuMCcsXG4gICAgICAneG1sbnMnOiAndXJuOm9hc2lzOm5hbWVzOnRjOnhsaWZmOmRvY3VtZW50OjIuMCcsXG4gICAgICAnc3JjTGFuZyc6IHRoaXMuc291cmNlTG9jYWxlXG4gICAgfSk7XG4gICAgLy8gTk9URTogdGhlIGBvcmlnaW5hbGAgcHJvcGVydHkgaXMgc2V0IHRvIHRoZSBsZWdhY3kgYG5nLnRlbXBsYXRlYCB2YWx1ZSBmb3IgYmFja3dhcmRcbiAgICAvLyBjb21wYXRpYmlsaXR5LlxuICAgIC8vIFdlIGNvdWxkIGNvbXB1dGUgdGhlIGZpbGUgZnJvbSB0aGUgYG1lc3NhZ2UubG9jYXRpb25gIHByb3BlcnR5LCBidXQgdGhlcmUgY291bGRcbiAgICAvLyBiZSBtdWx0aXBsZSB2YWx1ZXMgZm9yIHRoaXMgaW4gdGhlIGNvbGxlY3Rpb24gb2YgYG1lc3NhZ2VzYC4gSW4gdGhhdCBjYXNlIHdlIHdvdWxkIHByb2JhYmx5XG4gICAgLy8gbmVlZCB0byBjaGFuZ2UgdGhlIHNlcmlhbGl6ZXIgdG8gb3V0cHV0IGEgbmV3IGA8ZmlsZT5gIGVsZW1lbnQgZm9yIGVhY2ggY29sbGVjdGlvbiBvZlxuICAgIC8vIG1lc3NhZ2VzIHRoYXQgY29tZSBmcm9tIGEgcGFydGljdWxhciBvcmlnaW5hbCBmaWxlLCBhbmQgdGhlIHRyYW5zbGF0aW9uIGZpbGUgcGFyc2VycyBtYXlcbiAgICAvLyBub3RcbiAgICB4bWwuc3RhcnRUYWcoJ2ZpbGUnLCB7J2lkJzogJ25naTE4bicsICdvcmlnaW5hbCc6ICduZy50ZW1wbGF0ZScsIC4uLnRoaXMuZm9ybWF0T3B0aW9uc30pO1xuICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiBtZXNzYWdlcykge1xuICAgICAgY29uc3QgaWQgPSB0aGlzLmdldE1lc3NhZ2VJZChtZXNzYWdlKTtcbiAgICAgIGlmIChpZHMuaGFzKGlkKSkge1xuICAgICAgICAvLyBEbyBub3QgcmVuZGVyIHRoZSBzYW1lIG1lc3NhZ2UgbW9yZSB0aGFuIG9uY2VcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZHMuYWRkKGlkKTtcbiAgICAgIHhtbC5zdGFydFRhZygndW5pdCcsIHtpZH0pO1xuICAgICAgaWYgKG1lc3NhZ2UubWVhbmluZyB8fCBtZXNzYWdlLmRlc2NyaXB0aW9uIHx8IG1lc3NhZ2UubG9jYXRpb24pIHtcbiAgICAgICAgeG1sLnN0YXJ0VGFnKCdub3RlcycpO1xuICAgICAgICBpZiAobWVzc2FnZS5sb2NhdGlvbikge1xuICAgICAgICAgIGNvbnN0IHtmaWxlLCBzdGFydCwgZW5kfSA9IG1lc3NhZ2UubG9jYXRpb247XG4gICAgICAgICAgY29uc3QgZW5kTGluZVN0cmluZyA9XG4gICAgICAgICAgICAgIGVuZCAhPT0gdW5kZWZpbmVkICYmIGVuZC5saW5lICE9PSBzdGFydC5saW5lID8gYCwke2VuZC5saW5lICsgMX1gIDogJyc7XG4gICAgICAgICAgdGhpcy5zZXJpYWxpemVOb3RlKFxuICAgICAgICAgICAgICB4bWwsICdsb2NhdGlvbicsXG4gICAgICAgICAgICAgIGAke3RoaXMuZnMucmVsYXRpdmUodGhpcy5iYXNlUGF0aCwgZmlsZSl9OiR7c3RhcnQubGluZSArIDF9JHtlbmRMaW5lU3RyaW5nfWApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtZXNzYWdlLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgdGhpcy5zZXJpYWxpemVOb3RlKHhtbCwgJ2Rlc2NyaXB0aW9uJywgbWVzc2FnZS5kZXNjcmlwdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1lc3NhZ2UubWVhbmluZykge1xuICAgICAgICAgIHRoaXMuc2VyaWFsaXplTm90ZSh4bWwsICdtZWFuaW5nJywgbWVzc2FnZS5tZWFuaW5nKTtcbiAgICAgICAgfVxuICAgICAgICB4bWwuZW5kVGFnKCdub3RlcycpO1xuICAgICAgfVxuICAgICAgeG1sLnN0YXJ0VGFnKCdzZWdtZW50Jyk7XG4gICAgICB4bWwuc3RhcnRUYWcoJ3NvdXJjZScsIHt9LCB7cHJlc2VydmVXaGl0ZXNwYWNlOiB0cnVlfSk7XG4gICAgICB0aGlzLnNlcmlhbGl6ZU1lc3NhZ2UoeG1sLCBtZXNzYWdlKTtcbiAgICAgIHhtbC5lbmRUYWcoJ3NvdXJjZScsIHtwcmVzZXJ2ZVdoaXRlc3BhY2U6IGZhbHNlfSk7XG4gICAgICB4bWwuZW5kVGFnKCdzZWdtZW50Jyk7XG4gICAgICB4bWwuZW5kVGFnKCd1bml0Jyk7XG4gICAgfVxuICAgIHhtbC5lbmRUYWcoJ2ZpbGUnKTtcbiAgICB4bWwuZW5kVGFnKCd4bGlmZicpO1xuICAgIHJldHVybiB4bWwudG9TdHJpbmcoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplTWVzc2FnZSh4bWw6IFhtbEZpbGUsIG1lc3NhZ2U6IMm1UGFyc2VkTWVzc2FnZSk6IHZvaWQge1xuICAgIHRoaXMuY3VycmVudFBsYWNlaG9sZGVySWQgPSAwO1xuICAgIGNvbnN0IGxlbmd0aCA9IG1lc3NhZ2UubWVzc2FnZVBhcnRzLmxlbmd0aCAtIDE7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5zZXJpYWxpemVUZXh0UGFydCh4bWwsIG1lc3NhZ2UubWVzc2FnZVBhcnRzW2ldKTtcbiAgICAgIHRoaXMuc2VyaWFsaXplUGxhY2Vob2xkZXIoeG1sLCBtZXNzYWdlLnBsYWNlaG9sZGVyTmFtZXNbaV0sIG1lc3NhZ2Uuc3Vic3RpdHV0aW9uTG9jYXRpb25zKTtcbiAgICB9XG4gICAgdGhpcy5zZXJpYWxpemVUZXh0UGFydCh4bWwsIG1lc3NhZ2UubWVzc2FnZVBhcnRzW2xlbmd0aF0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVUZXh0UGFydCh4bWw6IFhtbEZpbGUsIHRleHQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHBpZWNlcyA9IGV4dHJhY3RJY3VQbGFjZWhvbGRlcnModGV4dCk7XG4gICAgY29uc3QgbGVuZ3RoID0gcGllY2VzLmxlbmd0aCAtIDE7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMikge1xuICAgICAgeG1sLnRleHQocGllY2VzW2ldKTtcbiAgICAgIHRoaXMuc2VyaWFsaXplUGxhY2Vob2xkZXIoeG1sLCBwaWVjZXNbaSArIDFdLCB1bmRlZmluZWQpO1xuICAgIH1cbiAgICB4bWwudGV4dChwaWVjZXNbbGVuZ3RoXSk7XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZVBsYWNlaG9sZGVyKFxuICAgICAgeG1sOiBYbWxGaWxlLCBwbGFjZWhvbGRlck5hbWU6IHN0cmluZyxcbiAgICAgIHN1YnN0aXR1dGlvbkxvY2F0aW9uczogUmVjb3JkPHN0cmluZywgybVTb3VyY2VMb2NhdGlvbnx1bmRlZmluZWQ+fHVuZGVmaW5lZCk6IHZvaWQge1xuICAgIGNvbnN0IHRleHQgPSBzdWJzdGl0dXRpb25Mb2NhdGlvbnM/LltwbGFjZWhvbGRlck5hbWVdPy50ZXh0O1xuXG4gICAgaWYgKHBsYWNlaG9sZGVyTmFtZS5zdGFydHNXaXRoKCdTVEFSVF8nKSkge1xuICAgICAgY29uc3QgY2xvc2luZ1BsYWNlaG9sZGVyTmFtZSA9IHBsYWNlaG9sZGVyTmFtZS5yZXBsYWNlKC9eU1RBUlQvLCAnQ0xPU0UnKTtcbiAgICAgIGNvbnN0IGNsb3NpbmdUZXh0ID0gc3Vic3RpdHV0aW9uTG9jYXRpb25zPy5bY2xvc2luZ1BsYWNlaG9sZGVyTmFtZV0/LnRleHQ7XG4gICAgICBjb25zdCBhdHRyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAgICAgaWQ6IGAke3RoaXMuY3VycmVudFBsYWNlaG9sZGVySWQrK31gLFxuICAgICAgICBlcXVpdlN0YXJ0OiBwbGFjZWhvbGRlck5hbWUsXG4gICAgICAgIGVxdWl2RW5kOiBjbG9zaW5nUGxhY2Vob2xkZXJOYW1lLFxuICAgICAgfTtcbiAgICAgIGlmICh0ZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYXR0cnMuZGlzcFN0YXJ0ID0gdGV4dDtcbiAgICAgIH1cbiAgICAgIGlmIChjbG9zaW5nVGV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGF0dHJzLmRpc3BFbmQgPSBjbG9zaW5nVGV4dDtcbiAgICAgIH1cbiAgICAgIHhtbC5zdGFydFRhZygncGMnLCBhdHRycyk7XG4gICAgfSBlbHNlIGlmIChwbGFjZWhvbGRlck5hbWUuc3RhcnRzV2l0aCgnQ0xPU0VfJykpIHtcbiAgICAgIHhtbC5lbmRUYWcoJ3BjJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGF0dHJzOlxuICAgICAgICAgIFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7aWQ6IGAke3RoaXMuY3VycmVudFBsYWNlaG9sZGVySWQrK31gLCBlcXVpdjogcGxhY2Vob2xkZXJOYW1lfTtcbiAgICAgIGlmICh0ZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYXR0cnMuZGlzcCA9IHRleHQ7XG4gICAgICB9XG4gICAgICB4bWwuc3RhcnRUYWcoJ3BoJywgYXR0cnMsIHtzZWxmQ2xvc2luZzogdHJ1ZX0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplTm90ZSh4bWw6IFhtbEZpbGUsIG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIHhtbC5zdGFydFRhZygnbm90ZScsIHtjYXRlZ29yeTogbmFtZX0sIHtwcmVzZXJ2ZVdoaXRlc3BhY2U6IHRydWV9KTtcbiAgICB4bWwudGV4dCh2YWx1ZSk7XG4gICAgeG1sLmVuZFRhZygnbm90ZScsIHtwcmVzZXJ2ZVdoaXRlc3BhY2U6IGZhbHNlfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBpZCBmb3IgdGhlIGdpdmVuIGBtZXNzYWdlYC5cbiAgICpcbiAgICogSWYgdGhlcmUgd2FzIGEgY3VzdG9tIGlkIHByb3ZpZGVkLCB1c2UgdGhhdC5cbiAgICpcbiAgICogSWYgd2UgaGF2ZSByZXF1ZXN0ZWQgbGVnYWN5IG1lc3NhZ2UgaWRzLCB0aGVuIHRyeSB0byByZXR1cm4gdGhlIGFwcHJvcHJpYXRlIGlkXG4gICAqIGZyb20gdGhlIGxpc3Qgb2YgbGVnYWN5IGlkcyB0aGF0IHdlcmUgZXh0cmFjdGVkLlxuICAgKlxuICAgKiBPdGhlcndpc2UgcmV0dXJuIHRoZSBjYW5vbmljYWwgbWVzc2FnZSBpZC5cbiAgICpcbiAgICogQW4gWGxpZmYgMi4wIGxlZ2FjeSBtZXNzYWdlIGlkIGlzIGEgNjQgYml0IG51bWJlciBlbmNvZGVkIGFzIGEgZGVjaW1hbCBzdHJpbmcsIHdoaWNoIHdpbGwgaGF2ZVxuICAgKiBhdCBtb3N0IDIwIGRpZ2l0cywgc2luY2UgMl42NS0xID0gMzYsODkzLDQ4OCwxNDcsNDE5LDEwMywyMzEuIFRoaXMgZGlnZXN0IGlzIGJhc2VkIG9uOlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2Nsb3N1cmUtY29tcGlsZXIvYmxvYi9tYXN0ZXIvc3JjL2NvbS9nb29nbGUvamF2YXNjcmlwdC9qc2NvbXAvR29vZ2xlSnNNZXNzYWdlSWRHZW5lcmF0b3IuamF2YVxuICAgKi9cbiAgcHJpdmF0ZSBnZXRNZXNzYWdlSWQobWVzc2FnZTogybVQYXJzZWRNZXNzYWdlKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbWVzc2FnZS5jdXN0b21JZCB8fFxuICAgICAgICB0aGlzLnVzZUxlZ2FjeUlkcyAmJiBtZXNzYWdlLmxlZ2FjeUlkcyAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIG1lc3NhZ2UubGVnYWN5SWRzLmZpbmQoXG4gICAgICAgICAgICBpZCA9PiBpZC5sZW5ndGggPD0gTUFYX0xFR0FDWV9YTElGRl8yX01FU1NBR0VfTEVOR1RIICYmICEvW14wLTldLy50ZXN0KGlkKSkgfHxcbiAgICAgICAgbWVzc2FnZS5pZDtcbiAgfVxufVxuIl19
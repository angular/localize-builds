(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/extract/translation_files/xliff2_translation_serializer", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/localize/src/tools/src/extract/translation_files/format_options", "@angular/localize/src/tools/src/extract/translation_files/icu_parsing", "@angular/localize/src/tools/src/extract/translation_files/utils", "@angular/localize/src/tools/src/extract/translation_files/xml_file"], factory);
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
    var utils_1 = require("@angular/localize/src/tools/src/extract/translation_files/utils");
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
            var e_1, _a, e_2, _b;
            var _this = this;
            var messageMap = utils_1.consolidateMessages(messages, function (message) { return _this.getMessageId(message); });
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
                for (var _c = tslib_1.__values(messageMap.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var _e = tslib_1.__read(_d.value, 2), id = _e[0], duplicateMessages = _e[1];
                    var message = duplicateMessages[0];
                    xml.startTag('unit', { id: id });
                    var messagesWithLocations = duplicateMessages.filter(utils_1.hasLocation);
                    if (message.meaning || message.description || messagesWithLocations.length) {
                        xml.startTag('notes');
                        try {
                            // Write all the locations
                            for (var messagesWithLocations_1 = (e_2 = void 0, tslib_1.__values(messagesWithLocations)), messagesWithLocations_1_1 = messagesWithLocations_1.next(); !messagesWithLocations_1_1.done; messagesWithLocations_1_1 = messagesWithLocations_1.next()) {
                                var _f = messagesWithLocations_1_1.value.location, file = _f.file, start = _f.start, end = _f.end;
                                var endLineString = end !== undefined && end.line !== start.line ? "," + (end.line + 1) : '';
                                this.serializeNote(xml, 'location', this.fs.relative(this.basePath, file) + ":" + (start.line + 1) + endLineString);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (messagesWithLocations_1_1 && !messagesWithLocations_1_1.done && (_b = messagesWithLocations_1.return)) _b.call(messagesWithLocations_1);
                            }
                            finally { if (e_2) throw e_2.error; }
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
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYyX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2V4dHJhY3QvdHJhbnNsYXRpb25fZmlsZXMveGxpZmYyX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDJFQUFzRztJQUd0RywyR0FBZ0U7SUFDaEUscUdBQXFEO0lBRXJELHlGQUF5RDtJQUN6RCwrRkFBbUM7SUFFbkMsaUdBQWlHO0lBQ2pHLElBQU0saUNBQWlDLEdBQUcsRUFBRSxDQUFDO0lBRTdDOzs7Ozs7O09BT0c7SUFDSDtRQUVFLHFDQUNZLFlBQW9CLEVBQVUsUUFBd0IsRUFBVSxZQUFxQixFQUNyRixhQUFpQyxFQUFVLEVBQWdDO1lBQTNFLDhCQUFBLEVBQUEsa0JBQWlDO1lBQVUsbUJBQUEsRUFBQSxLQUFpQiwyQkFBYSxFQUFFO1lBRDNFLGlCQUFZLEdBQVosWUFBWSxDQUFRO1lBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBZ0I7WUFBVSxpQkFBWSxHQUFaLFlBQVksQ0FBUztZQUNyRixrQkFBYSxHQUFiLGFBQWEsQ0FBb0I7WUFBVSxPQUFFLEdBQUYsRUFBRSxDQUE4QjtZQUgvRSx5QkFBb0IsR0FBRyxDQUFDLENBQUM7WUFJL0IsZ0NBQWUsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQy9GLENBQUM7UUFFRCwrQ0FBUyxHQUFULFVBQVUsUUFBMEI7O1lBQXBDLGlCQW1EQztZQWxEQyxJQUFNLFVBQVUsR0FBRywyQkFBbUIsQ0FBQyxRQUFRLEVBQUUsVUFBQSxPQUFPLElBQUksT0FBQSxLQUFJLENBQUMsWUFBWSxDQUFDLE9B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RUFBcEUsQ0FBb0UsQ0FBQztnQkFDL0UsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUNqQixDQUFDO1FBQ0gsa0NBQUM7SUFBRCxDQUFDLEFBNUlELElBNElDO0lBNUlZLGtFQUEyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aCwgRmlsZVN5c3RlbSwgZ2V0RmlsZVN5c3RlbX0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQge8m1UGFyc2VkTWVzc2FnZSwgybVTb3VyY2VMb2NhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuXG5pbXBvcnQge0Zvcm1hdE9wdGlvbnMsIHZhbGlkYXRlT3B0aW9uc30gZnJvbSAnLi9mb3JtYXRfb3B0aW9ucyc7XG5pbXBvcnQge2V4dHJhY3RJY3VQbGFjZWhvbGRlcnN9IGZyb20gJy4vaWN1X3BhcnNpbmcnO1xuaW1wb3J0IHtUcmFuc2xhdGlvblNlcmlhbGl6ZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fc2VyaWFsaXplcic7XG5pbXBvcnQge2NvbnNvbGlkYXRlTWVzc2FnZXMsIGhhc0xvY2F0aW9ufSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7WG1sRmlsZX0gZnJvbSAnLi94bWxfZmlsZSc7XG5cbi8qKiBUaGlzIGlzIHRoZSBtYXhpbXVtIG51bWJlciBvZiBjaGFyYWN0ZXJzIHRoYXQgY2FuIGFwcGVhciBpbiBhIGxlZ2FjeSBYTElGRiAyLjAgbWVzc2FnZSBpZC4gKi9cbmNvbnN0IE1BWF9MRUdBQ1lfWExJRkZfMl9NRVNTQUdFX0xFTkdUSCA9IDIwO1xuXG4vKipcbiAqIEEgdHJhbnNsYXRpb24gc2VyaWFsaXplciB0aGF0IGNhbiB3cml0ZSB0cmFuc2xhdGlvbnMgaW4gWExJRkYgMiBmb3JtYXQuXG4gKlxuICogaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcveGxpZmYveGxpZmYtY29yZS92Mi4wL29zL3hsaWZmLWNvcmUtdjIuMC1vcy5odG1sXG4gKlxuICogQHNlZSBYbGlmZjJUcmFuc2xhdGlvblBhcnNlclxuICogQHB1YmxpY0FwaSB1c2VkIGJ5IENMSVxuICovXG5leHBvcnQgY2xhc3MgWGxpZmYyVHJhbnNsYXRpb25TZXJpYWxpemVyIGltcGxlbWVudHMgVHJhbnNsYXRpb25TZXJpYWxpemVyIHtcbiAgcHJpdmF0ZSBjdXJyZW50UGxhY2Vob2xkZXJJZCA9IDA7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBzb3VyY2VMb2NhbGU6IHN0cmluZywgcHJpdmF0ZSBiYXNlUGF0aDogQWJzb2x1dGVGc1BhdGgsIHByaXZhdGUgdXNlTGVnYWN5SWRzOiBib29sZWFuLFxuICAgICAgcHJpdmF0ZSBmb3JtYXRPcHRpb25zOiBGb3JtYXRPcHRpb25zID0ge30sIHByaXZhdGUgZnM6IEZpbGVTeXN0ZW0gPSBnZXRGaWxlU3lzdGVtKCkpIHtcbiAgICB2YWxpZGF0ZU9wdGlvbnMoJ1hsaWZmMVRyYW5zbGF0aW9uU2VyaWFsaXplcicsIFtbJ3htbDpzcGFjZScsIFsncHJlc2VydmUnXV1dLCBmb3JtYXRPcHRpb25zKTtcbiAgfVxuXG4gIHNlcmlhbGl6ZShtZXNzYWdlczogybVQYXJzZWRNZXNzYWdlW10pOiBzdHJpbmcge1xuICAgIGNvbnN0IG1lc3NhZ2VNYXAgPSBjb25zb2xpZGF0ZU1lc3NhZ2VzKG1lc3NhZ2VzLCBtZXNzYWdlID0+IHRoaXMuZ2V0TWVzc2FnZUlkKG1lc3NhZ2UpKTtcbiAgICBjb25zdCB4bWwgPSBuZXcgWG1sRmlsZSgpO1xuICAgIHhtbC5zdGFydFRhZygneGxpZmYnLCB7XG4gICAgICAndmVyc2lvbic6ICcyLjAnLFxuICAgICAgJ3htbG5zJzogJ3VybjpvYXNpczpuYW1lczp0Yzp4bGlmZjpkb2N1bWVudDoyLjAnLFxuICAgICAgJ3NyY0xhbmcnOiB0aGlzLnNvdXJjZUxvY2FsZVxuICAgIH0pO1xuICAgIC8vIE5PVEU6IHRoZSBgb3JpZ2luYWxgIHByb3BlcnR5IGlzIHNldCB0byB0aGUgbGVnYWN5IGBuZy50ZW1wbGF0ZWAgdmFsdWUgZm9yIGJhY2t3YXJkXG4gICAgLy8gY29tcGF0aWJpbGl0eS5cbiAgICAvLyBXZSBjb3VsZCBjb21wdXRlIHRoZSBmaWxlIGZyb20gdGhlIGBtZXNzYWdlLmxvY2F0aW9uYCBwcm9wZXJ0eSwgYnV0IHRoZXJlIGNvdWxkXG4gICAgLy8gYmUgbXVsdGlwbGUgdmFsdWVzIGZvciB0aGlzIGluIHRoZSBjb2xsZWN0aW9uIG9mIGBtZXNzYWdlc2AuIEluIHRoYXQgY2FzZSB3ZSB3b3VsZCBwcm9iYWJseVxuICAgIC8vIG5lZWQgdG8gY2hhbmdlIHRoZSBzZXJpYWxpemVyIHRvIG91dHB1dCBhIG5ldyBgPGZpbGU+YCBlbGVtZW50IGZvciBlYWNoIGNvbGxlY3Rpb24gb2ZcbiAgICAvLyBtZXNzYWdlcyB0aGF0IGNvbWUgZnJvbSBhIHBhcnRpY3VsYXIgb3JpZ2luYWwgZmlsZSwgYW5kIHRoZSB0cmFuc2xhdGlvbiBmaWxlIHBhcnNlcnMgbWF5XG4gICAgLy8gbm90XG4gICAgeG1sLnN0YXJ0VGFnKCdmaWxlJywgeydpZCc6ICduZ2kxOG4nLCAnb3JpZ2luYWwnOiAnbmcudGVtcGxhdGUnLCAuLi50aGlzLmZvcm1hdE9wdGlvbnN9KTtcbiAgICBmb3IgKGNvbnN0IFtpZCwgZHVwbGljYXRlTWVzc2FnZXNdIG9mIG1lc3NhZ2VNYXAuZW50cmllcygpKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gZHVwbGljYXRlTWVzc2FnZXNbMF07XG5cbiAgICAgIHhtbC5zdGFydFRhZygndW5pdCcsIHtpZH0pO1xuICAgICAgY29uc3QgbWVzc2FnZXNXaXRoTG9jYXRpb25zID0gZHVwbGljYXRlTWVzc2FnZXMuZmlsdGVyKGhhc0xvY2F0aW9uKTtcbiAgICAgIGlmIChtZXNzYWdlLm1lYW5pbmcgfHwgbWVzc2FnZS5kZXNjcmlwdGlvbiB8fCBtZXNzYWdlc1dpdGhMb2NhdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIHhtbC5zdGFydFRhZygnbm90ZXMnKTtcblxuICAgICAgICAvLyBXcml0ZSBhbGwgdGhlIGxvY2F0aW9uc1xuICAgICAgICBmb3IgKGNvbnN0IHtsb2NhdGlvbjoge2ZpbGUsIHN0YXJ0LCBlbmR9fSBvZiBtZXNzYWdlc1dpdGhMb2NhdGlvbnMpIHtcbiAgICAgICAgICBjb25zdCBlbmRMaW5lU3RyaW5nID1cbiAgICAgICAgICAgICAgZW5kICE9PSB1bmRlZmluZWQgJiYgZW5kLmxpbmUgIT09IHN0YXJ0LmxpbmUgPyBgLCR7ZW5kLmxpbmUgKyAxfWAgOiAnJztcbiAgICAgICAgICB0aGlzLnNlcmlhbGl6ZU5vdGUoXG4gICAgICAgICAgICAgIHhtbCwgJ2xvY2F0aW9uJyxcbiAgICAgICAgICAgICAgYCR7dGhpcy5mcy5yZWxhdGl2ZSh0aGlzLmJhc2VQYXRoLCBmaWxlKX06JHtzdGFydC5saW5lICsgMX0ke2VuZExpbmVTdHJpbmd9YCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWVzc2FnZS5kZXNjcmlwdGlvbikge1xuICAgICAgICAgIHRoaXMuc2VyaWFsaXplTm90ZSh4bWwsICdkZXNjcmlwdGlvbicsIG1lc3NhZ2UuZGVzY3JpcHRpb24pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtZXNzYWdlLm1lYW5pbmcpIHtcbiAgICAgICAgICB0aGlzLnNlcmlhbGl6ZU5vdGUoeG1sLCAnbWVhbmluZycsIG1lc3NhZ2UubWVhbmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgeG1sLmVuZFRhZygnbm90ZXMnKTtcbiAgICAgIH1cbiAgICAgIHhtbC5zdGFydFRhZygnc2VnbWVudCcpO1xuICAgICAgeG1sLnN0YXJ0VGFnKCdzb3VyY2UnLCB7fSwge3ByZXNlcnZlV2hpdGVzcGFjZTogdHJ1ZX0pO1xuICAgICAgdGhpcy5zZXJpYWxpemVNZXNzYWdlKHhtbCwgbWVzc2FnZSk7XG4gICAgICB4bWwuZW5kVGFnKCdzb3VyY2UnLCB7cHJlc2VydmVXaGl0ZXNwYWNlOiBmYWxzZX0pO1xuICAgICAgeG1sLmVuZFRhZygnc2VnbWVudCcpO1xuICAgICAgeG1sLmVuZFRhZygndW5pdCcpO1xuICAgIH1cbiAgICB4bWwuZW5kVGFnKCdmaWxlJyk7XG4gICAgeG1sLmVuZFRhZygneGxpZmYnKTtcbiAgICByZXR1cm4geG1sLnRvU3RyaW5nKCk7XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZU1lc3NhZ2UoeG1sOiBYbWxGaWxlLCBtZXNzYWdlOiDJtVBhcnNlZE1lc3NhZ2UpOiB2b2lkIHtcbiAgICB0aGlzLmN1cnJlbnRQbGFjZWhvbGRlcklkID0gMDtcbiAgICBjb25zdCBsZW5ndGggPSBtZXNzYWdlLm1lc3NhZ2VQYXJ0cy5sZW5ndGggLSAxO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuc2VyaWFsaXplVGV4dFBhcnQoeG1sLCBtZXNzYWdlLm1lc3NhZ2VQYXJ0c1tpXSk7XG4gICAgICB0aGlzLnNlcmlhbGl6ZVBsYWNlaG9sZGVyKHhtbCwgbWVzc2FnZS5wbGFjZWhvbGRlck5hbWVzW2ldLCBtZXNzYWdlLnN1YnN0aXR1dGlvbkxvY2F0aW9ucyk7XG4gICAgfVxuICAgIHRoaXMuc2VyaWFsaXplVGV4dFBhcnQoeG1sLCBtZXNzYWdlLm1lc3NhZ2VQYXJ0c1tsZW5ndGhdKTtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplVGV4dFBhcnQoeG1sOiBYbWxGaWxlLCB0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBwaWVjZXMgPSBleHRyYWN0SWN1UGxhY2Vob2xkZXJzKHRleHQpO1xuICAgIGNvbnN0IGxlbmd0aCA9IHBpZWNlcy5sZW5ndGggLSAxO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIHhtbC50ZXh0KHBpZWNlc1tpXSk7XG4gICAgICB0aGlzLnNlcmlhbGl6ZVBsYWNlaG9sZGVyKHhtbCwgcGllY2VzW2kgKyAxXSwgdW5kZWZpbmVkKTtcbiAgICB9XG4gICAgeG1sLnRleHQocGllY2VzW2xlbmd0aF0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVQbGFjZWhvbGRlcihcbiAgICAgIHhtbDogWG1sRmlsZSwgcGxhY2Vob2xkZXJOYW1lOiBzdHJpbmcsXG4gICAgICBzdWJzdGl0dXRpb25Mb2NhdGlvbnM6IFJlY29yZDxzdHJpbmcsIMm1U291cmNlTG9jYXRpb258dW5kZWZpbmVkPnx1bmRlZmluZWQpOiB2b2lkIHtcbiAgICBjb25zdCB0ZXh0ID0gc3Vic3RpdHV0aW9uTG9jYXRpb25zPy5bcGxhY2Vob2xkZXJOYW1lXT8udGV4dDtcblxuICAgIGlmIChwbGFjZWhvbGRlck5hbWUuc3RhcnRzV2l0aCgnU1RBUlRfJykpIHtcbiAgICAgIGNvbnN0IGNsb3NpbmdQbGFjZWhvbGRlck5hbWUgPSBwbGFjZWhvbGRlck5hbWUucmVwbGFjZSgvXlNUQVJULywgJ0NMT1NFJyk7XG4gICAgICBjb25zdCBjbG9zaW5nVGV4dCA9IHN1YnN0aXR1dGlvbkxvY2F0aW9ucz8uW2Nsb3NpbmdQbGFjZWhvbGRlck5hbWVdPy50ZXh0O1xuICAgICAgY29uc3QgYXR0cnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgICAgIGlkOiBgJHt0aGlzLmN1cnJlbnRQbGFjZWhvbGRlcklkKyt9YCxcbiAgICAgICAgZXF1aXZTdGFydDogcGxhY2Vob2xkZXJOYW1lLFxuICAgICAgICBlcXVpdkVuZDogY2xvc2luZ1BsYWNlaG9sZGVyTmFtZSxcbiAgICAgIH07XG4gICAgICBpZiAodGV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGF0dHJzLmRpc3BTdGFydCA9IHRleHQ7XG4gICAgICB9XG4gICAgICBpZiAoY2xvc2luZ1RleHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBhdHRycy5kaXNwRW5kID0gY2xvc2luZ1RleHQ7XG4gICAgICB9XG4gICAgICB4bWwuc3RhcnRUYWcoJ3BjJywgYXR0cnMpO1xuICAgIH0gZWxzZSBpZiAocGxhY2Vob2xkZXJOYW1lLnN0YXJ0c1dpdGgoJ0NMT1NFXycpKSB7XG4gICAgICB4bWwuZW5kVGFnKCdwYycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBhdHRyczpcbiAgICAgICAgICBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge2lkOiBgJHt0aGlzLmN1cnJlbnRQbGFjZWhvbGRlcklkKyt9YCwgZXF1aXY6IHBsYWNlaG9sZGVyTmFtZX07XG4gICAgICBpZiAodGV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGF0dHJzLmRpc3AgPSB0ZXh0O1xuICAgICAgfVxuICAgICAgeG1sLnN0YXJ0VGFnKCdwaCcsIGF0dHJzLCB7c2VsZkNsb3Npbmc6IHRydWV9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZU5vdGUoeG1sOiBYbWxGaWxlLCBuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICB4bWwuc3RhcnRUYWcoJ25vdGUnLCB7Y2F0ZWdvcnk6IG5hbWV9LCB7cHJlc2VydmVXaGl0ZXNwYWNlOiB0cnVlfSk7XG4gICAgeG1sLnRleHQodmFsdWUpO1xuICAgIHhtbC5lbmRUYWcoJ25vdGUnLCB7cHJlc2VydmVXaGl0ZXNwYWNlOiBmYWxzZX0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgaWQgZm9yIHRoZSBnaXZlbiBgbWVzc2FnZWAuXG4gICAqXG4gICAqIElmIHRoZXJlIHdhcyBhIGN1c3RvbSBpZCBwcm92aWRlZCwgdXNlIHRoYXQuXG4gICAqXG4gICAqIElmIHdlIGhhdmUgcmVxdWVzdGVkIGxlZ2FjeSBtZXNzYWdlIGlkcywgdGhlbiB0cnkgdG8gcmV0dXJuIHRoZSBhcHByb3ByaWF0ZSBpZFxuICAgKiBmcm9tIHRoZSBsaXN0IG9mIGxlZ2FjeSBpZHMgdGhhdCB3ZXJlIGV4dHJhY3RlZC5cbiAgICpcbiAgICogT3RoZXJ3aXNlIHJldHVybiB0aGUgY2Fub25pY2FsIG1lc3NhZ2UgaWQuXG4gICAqXG4gICAqIEFuIFhsaWZmIDIuMCBsZWdhY3kgbWVzc2FnZSBpZCBpcyBhIDY0IGJpdCBudW1iZXIgZW5jb2RlZCBhcyBhIGRlY2ltYWwgc3RyaW5nLCB3aGljaCB3aWxsIGhhdmVcbiAgICogYXQgbW9zdCAyMCBkaWdpdHMsIHNpbmNlIDJeNjUtMSA9IDM2LDg5Myw0ODgsMTQ3LDQxOSwxMDMsMjMxLiBUaGlzIGRpZ2VzdCBpcyBiYXNlZCBvbjpcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS9jbG9zdXJlLWNvbXBpbGVyL2Jsb2IvbWFzdGVyL3NyYy9jb20vZ29vZ2xlL2phdmFzY3JpcHQvanNjb21wL0dvb2dsZUpzTWVzc2FnZUlkR2VuZXJhdG9yLmphdmFcbiAgICovXG4gIHByaXZhdGUgZ2V0TWVzc2FnZUlkKG1lc3NhZ2U6IMm1UGFyc2VkTWVzc2FnZSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG1lc3NhZ2UuY3VzdG9tSWQgfHxcbiAgICAgICAgdGhpcy51c2VMZWdhY3lJZHMgJiYgbWVzc2FnZS5sZWdhY3lJZHMgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICBtZXNzYWdlLmxlZ2FjeUlkcy5maW5kKFxuICAgICAgICAgICAgaWQgPT4gaWQubGVuZ3RoIDw9IE1BWF9MRUdBQ1lfWExJRkZfMl9NRVNTQUdFX0xFTkdUSCAmJiAhL1teMC05XS8udGVzdChpZCkpIHx8XG4gICAgICAgIG1lc3NhZ2UuaWQ7XG4gIH1cbn1cbiJdfQ==
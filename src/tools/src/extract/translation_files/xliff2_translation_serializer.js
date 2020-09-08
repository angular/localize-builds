(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/extract/translation_files/xliff2_translation_serializer", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/localize/src/tools/src/extract/translation_files/icu_parsing", "@angular/localize/src/tools/src/extract/translation_files/xml_file"], factory);
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
     */
    var Xliff2TranslationSerializer = /** @class */ (function () {
        function Xliff2TranslationSerializer(sourceLocale, basePath, useLegacyIds) {
            this.sourceLocale = sourceLocale;
            this.basePath = basePath;
            this.useLegacyIds = useLegacyIds;
            this.currentPlaceholderId = 0;
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
            // messages that come from a particular original file, and the translation file parsers may not
            xml.startTag('file', { 'id': 'ngi18n', 'original': 'ng.template' });
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
                            this.serializeNote(xml, 'location', file_system_1.relative(this.basePath, file) + ":" + (start.line + 1) + endLineString);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYyX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2V4dHJhY3QvdHJhbnNsYXRpb25fZmlsZXMveGxpZmYyX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDJFQUFxRjtJQUdyRixxR0FBcUQ7SUFFckQsK0ZBQW1DO0lBRW5DLGlHQUFpRztJQUNqRyxJQUFNLGlDQUFpQyxHQUFHLEVBQUUsQ0FBQztJQUU3Qzs7Ozs7O09BTUc7SUFDSDtRQUVFLHFDQUNZLFlBQW9CLEVBQVUsUUFBd0IsRUFDdEQsWUFBcUI7WUFEckIsaUJBQVksR0FBWixZQUFZLENBQVE7WUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFnQjtZQUN0RCxpQkFBWSxHQUFaLFlBQVksQ0FBUztZQUh6Qix5QkFBb0IsR0FBRyxDQUFDLENBQUM7UUFHRyxDQUFDO1FBRXJDLCtDQUFTLEdBQVQsVUFBVSxRQUEwQjs7WUFDbEMsSUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztZQUM5QixJQUFNLEdBQUcsR0FBRyxJQUFJLGtCQUFPLEVBQUUsQ0FBQztZQUMxQixHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtnQkFDcEIsU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLE9BQU8sRUFBRSx1Q0FBdUM7Z0JBQ2hELFNBQVMsRUFBRSxJQUFJLENBQUMsWUFBWTthQUM3QixDQUFDLENBQUM7WUFDSCxzRkFBc0Y7WUFDdEYsaUJBQWlCO1lBQ2pCLGtGQUFrRjtZQUNsRiw4RkFBOEY7WUFDOUYsd0ZBQXdGO1lBQ3hGLCtGQUErRjtZQUMvRixHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUUs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RUFBRSxJQUFZLEVBQUUsS0FBYTtZQUM3RCxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsRUFBRSxFQUFDLGtCQUFrQixFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7WUFDbkUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFDLGtCQUFrQixFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUVEOzs7Ozs7Ozs7Ozs7O1dBYUc7UUFDSyxrREFBWSxHQUFwQixVQUFxQixPQUF1QjtZQUMxQyxPQUFPLE9BQU8sQ0FBQyxRQUFRO2dCQUNuQixJQUFJLENBQUMsWUFBWSxJQUFJLE9BQU8sQ0FBQyxTQUFTLEtBQUssU0FBUztvQkFDcEQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQ2xCLFVBQUEsRUFBRSxJQUFJLE9BQUEsRUFBRSxDQUFDLE1BQU0sSUFBSSxpQ0FBaUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQXBFLENBQW9FLENBQUM7Z0JBQy9FLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDakIsQ0FBQztRQUNILGtDQUFDO0lBQUQsQ0FBQyxBQTFJRCxJQTBJQztJQTFJWSxrRUFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGgsIHJlbGF0aXZlfSBmcm9tICdAYW5ndWxhci9jb21waWxlci1jbGkvc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7ybVQYXJzZWRNZXNzYWdlLCDJtVNvdXJjZUxvY2F0aW9ufSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5cbmltcG9ydCB7ZXh0cmFjdEljdVBsYWNlaG9sZGVyc30gZnJvbSAnLi9pY3VfcGFyc2luZyc7XG5pbXBvcnQge1RyYW5zbGF0aW9uU2VyaWFsaXplcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9zZXJpYWxpemVyJztcbmltcG9ydCB7WG1sRmlsZX0gZnJvbSAnLi94bWxfZmlsZSc7XG5cbi8qKiBUaGlzIGlzIHRoZSBtYXhpbXVtIG51bWJlciBvZiBjaGFyYWN0ZXJzIHRoYXQgY2FuIGFwcGVhciBpbiBhIGxlZ2FjeSBYTElGRiAyLjAgbWVzc2FnZSBpZC4gKi9cbmNvbnN0IE1BWF9MRUdBQ1lfWExJRkZfMl9NRVNTQUdFX0xFTkdUSCA9IDIwO1xuXG4vKipcbiAqIEEgdHJhbnNsYXRpb24gc2VyaWFsaXplciB0aGF0IGNhbiB3cml0ZSB0cmFuc2xhdGlvbnMgaW4gWExJRkYgMiBmb3JtYXQuXG4gKlxuICogaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcveGxpZmYveGxpZmYtY29yZS92Mi4wL29zL3hsaWZmLWNvcmUtdjIuMC1vcy5odG1sXG4gKlxuICogQHNlZSBYbGlmZjJUcmFuc2xhdGlvblBhcnNlclxuICovXG5leHBvcnQgY2xhc3MgWGxpZmYyVHJhbnNsYXRpb25TZXJpYWxpemVyIGltcGxlbWVudHMgVHJhbnNsYXRpb25TZXJpYWxpemVyIHtcbiAgcHJpdmF0ZSBjdXJyZW50UGxhY2Vob2xkZXJJZCA9IDA7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBzb3VyY2VMb2NhbGU6IHN0cmluZywgcHJpdmF0ZSBiYXNlUGF0aDogQWJzb2x1dGVGc1BhdGgsXG4gICAgICBwcml2YXRlIHVzZUxlZ2FjeUlkczogYm9vbGVhbikge31cblxuICBzZXJpYWxpemUobWVzc2FnZXM6IMm1UGFyc2VkTWVzc2FnZVtdKTogc3RyaW5nIHtcbiAgICBjb25zdCBpZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBjb25zdCB4bWwgPSBuZXcgWG1sRmlsZSgpO1xuICAgIHhtbC5zdGFydFRhZygneGxpZmYnLCB7XG4gICAgICAndmVyc2lvbic6ICcyLjAnLFxuICAgICAgJ3htbG5zJzogJ3VybjpvYXNpczpuYW1lczp0Yzp4bGlmZjpkb2N1bWVudDoyLjAnLFxuICAgICAgJ3NyY0xhbmcnOiB0aGlzLnNvdXJjZUxvY2FsZVxuICAgIH0pO1xuICAgIC8vIE5PVEU6IHRoZSBgb3JpZ2luYWxgIHByb3BlcnR5IGlzIHNldCB0byB0aGUgbGVnYWN5IGBuZy50ZW1wbGF0ZWAgdmFsdWUgZm9yIGJhY2t3YXJkXG4gICAgLy8gY29tcGF0aWJpbGl0eS5cbiAgICAvLyBXZSBjb3VsZCBjb21wdXRlIHRoZSBmaWxlIGZyb20gdGhlIGBtZXNzYWdlLmxvY2F0aW9uYCBwcm9wZXJ0eSwgYnV0IHRoZXJlIGNvdWxkXG4gICAgLy8gYmUgbXVsdGlwbGUgdmFsdWVzIGZvciB0aGlzIGluIHRoZSBjb2xsZWN0aW9uIG9mIGBtZXNzYWdlc2AuIEluIHRoYXQgY2FzZSB3ZSB3b3VsZCBwcm9iYWJseVxuICAgIC8vIG5lZWQgdG8gY2hhbmdlIHRoZSBzZXJpYWxpemVyIHRvIG91dHB1dCBhIG5ldyBgPGZpbGU+YCBlbGVtZW50IGZvciBlYWNoIGNvbGxlY3Rpb24gb2ZcbiAgICAvLyBtZXNzYWdlcyB0aGF0IGNvbWUgZnJvbSBhIHBhcnRpY3VsYXIgb3JpZ2luYWwgZmlsZSwgYW5kIHRoZSB0cmFuc2xhdGlvbiBmaWxlIHBhcnNlcnMgbWF5IG5vdFxuICAgIHhtbC5zdGFydFRhZygnZmlsZScsIHsnaWQnOiAnbmdpMThuJywgJ29yaWdpbmFsJzogJ25nLnRlbXBsYXRlJ30pO1xuICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiBtZXNzYWdlcykge1xuICAgICAgY29uc3QgaWQgPSB0aGlzLmdldE1lc3NhZ2VJZChtZXNzYWdlKTtcbiAgICAgIGlmIChpZHMuaGFzKGlkKSkge1xuICAgICAgICAvLyBEbyBub3QgcmVuZGVyIHRoZSBzYW1lIG1lc3NhZ2UgbW9yZSB0aGFuIG9uY2VcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZHMuYWRkKGlkKTtcbiAgICAgIHhtbC5zdGFydFRhZygndW5pdCcsIHtpZH0pO1xuICAgICAgaWYgKG1lc3NhZ2UubWVhbmluZyB8fCBtZXNzYWdlLmRlc2NyaXB0aW9uIHx8IG1lc3NhZ2UubG9jYXRpb24pIHtcbiAgICAgICAgeG1sLnN0YXJ0VGFnKCdub3RlcycpO1xuICAgICAgICBpZiAobWVzc2FnZS5sb2NhdGlvbikge1xuICAgICAgICAgIGNvbnN0IHtmaWxlLCBzdGFydCwgZW5kfSA9IG1lc3NhZ2UubG9jYXRpb247XG4gICAgICAgICAgY29uc3QgZW5kTGluZVN0cmluZyA9XG4gICAgICAgICAgICAgIGVuZCAhPT0gdW5kZWZpbmVkICYmIGVuZC5saW5lICE9PSBzdGFydC5saW5lID8gYCwke2VuZC5saW5lICsgMX1gIDogJyc7XG4gICAgICAgICAgdGhpcy5zZXJpYWxpemVOb3RlKFxuICAgICAgICAgICAgICB4bWwsICdsb2NhdGlvbicsXG4gICAgICAgICAgICAgIGAke3JlbGF0aXZlKHRoaXMuYmFzZVBhdGgsIGZpbGUpfToke3N0YXJ0LmxpbmUgKyAxfSR7ZW5kTGluZVN0cmluZ31gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWVzc2FnZS5kZXNjcmlwdGlvbikge1xuICAgICAgICAgIHRoaXMuc2VyaWFsaXplTm90ZSh4bWwsICdkZXNjcmlwdGlvbicsIG1lc3NhZ2UuZGVzY3JpcHRpb24pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtZXNzYWdlLm1lYW5pbmcpIHtcbiAgICAgICAgICB0aGlzLnNlcmlhbGl6ZU5vdGUoeG1sLCAnbWVhbmluZycsIG1lc3NhZ2UubWVhbmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgeG1sLmVuZFRhZygnbm90ZXMnKTtcbiAgICAgIH1cbiAgICAgIHhtbC5zdGFydFRhZygnc2VnbWVudCcpO1xuICAgICAgeG1sLnN0YXJ0VGFnKCdzb3VyY2UnLCB7fSwge3ByZXNlcnZlV2hpdGVzcGFjZTogdHJ1ZX0pO1xuICAgICAgdGhpcy5zZXJpYWxpemVNZXNzYWdlKHhtbCwgbWVzc2FnZSk7XG4gICAgICB4bWwuZW5kVGFnKCdzb3VyY2UnLCB7cHJlc2VydmVXaGl0ZXNwYWNlOiBmYWxzZX0pO1xuICAgICAgeG1sLmVuZFRhZygnc2VnbWVudCcpO1xuICAgICAgeG1sLmVuZFRhZygndW5pdCcpO1xuICAgIH1cbiAgICB4bWwuZW5kVGFnKCdmaWxlJyk7XG4gICAgeG1sLmVuZFRhZygneGxpZmYnKTtcbiAgICByZXR1cm4geG1sLnRvU3RyaW5nKCk7XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZU1lc3NhZ2UoeG1sOiBYbWxGaWxlLCBtZXNzYWdlOiDJtVBhcnNlZE1lc3NhZ2UpOiB2b2lkIHtcbiAgICB0aGlzLmN1cnJlbnRQbGFjZWhvbGRlcklkID0gMDtcbiAgICBjb25zdCBsZW5ndGggPSBtZXNzYWdlLm1lc3NhZ2VQYXJ0cy5sZW5ndGggLSAxO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuc2VyaWFsaXplVGV4dFBhcnQoeG1sLCBtZXNzYWdlLm1lc3NhZ2VQYXJ0c1tpXSk7XG4gICAgICB0aGlzLnNlcmlhbGl6ZVBsYWNlaG9sZGVyKHhtbCwgbWVzc2FnZS5wbGFjZWhvbGRlck5hbWVzW2ldLCBtZXNzYWdlLnN1YnN0aXR1dGlvbkxvY2F0aW9ucyk7XG4gICAgfVxuICAgIHRoaXMuc2VyaWFsaXplVGV4dFBhcnQoeG1sLCBtZXNzYWdlLm1lc3NhZ2VQYXJ0c1tsZW5ndGhdKTtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplVGV4dFBhcnQoeG1sOiBYbWxGaWxlLCB0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBwaWVjZXMgPSBleHRyYWN0SWN1UGxhY2Vob2xkZXJzKHRleHQpO1xuICAgIGNvbnN0IGxlbmd0aCA9IHBpZWNlcy5sZW5ndGggLSAxO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIHhtbC50ZXh0KHBpZWNlc1tpXSk7XG4gICAgICB0aGlzLnNlcmlhbGl6ZVBsYWNlaG9sZGVyKHhtbCwgcGllY2VzW2kgKyAxXSwgdW5kZWZpbmVkKTtcbiAgICB9XG4gICAgeG1sLnRleHQocGllY2VzW2xlbmd0aF0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVQbGFjZWhvbGRlcihcbiAgICAgIHhtbDogWG1sRmlsZSwgcGxhY2Vob2xkZXJOYW1lOiBzdHJpbmcsXG4gICAgICBzdWJzdGl0dXRpb25Mb2NhdGlvbnM6IFJlY29yZDxzdHJpbmcsIMm1U291cmNlTG9jYXRpb258dW5kZWZpbmVkPnx1bmRlZmluZWQpOiB2b2lkIHtcbiAgICBjb25zdCB0ZXh0ID0gc3Vic3RpdHV0aW9uTG9jYXRpb25zPy5bcGxhY2Vob2xkZXJOYW1lXT8udGV4dDtcblxuICAgIGlmIChwbGFjZWhvbGRlck5hbWUuc3RhcnRzV2l0aCgnU1RBUlRfJykpIHtcbiAgICAgIGNvbnN0IGNsb3NpbmdQbGFjZWhvbGRlck5hbWUgPSBwbGFjZWhvbGRlck5hbWUucmVwbGFjZSgvXlNUQVJULywgJ0NMT1NFJyk7XG4gICAgICBjb25zdCBjbG9zaW5nVGV4dCA9IHN1YnN0aXR1dGlvbkxvY2F0aW9ucz8uW2Nsb3NpbmdQbGFjZWhvbGRlck5hbWVdPy50ZXh0O1xuICAgICAgY29uc3QgYXR0cnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgICAgIGlkOiBgJHt0aGlzLmN1cnJlbnRQbGFjZWhvbGRlcklkKyt9YCxcbiAgICAgICAgZXF1aXZTdGFydDogcGxhY2Vob2xkZXJOYW1lLFxuICAgICAgICBlcXVpdkVuZDogY2xvc2luZ1BsYWNlaG9sZGVyTmFtZSxcbiAgICAgIH07XG4gICAgICBpZiAodGV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGF0dHJzLmRpc3BTdGFydCA9IHRleHQ7XG4gICAgICB9XG4gICAgICBpZiAoY2xvc2luZ1RleHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBhdHRycy5kaXNwRW5kID0gY2xvc2luZ1RleHQ7XG4gICAgICB9XG4gICAgICB4bWwuc3RhcnRUYWcoJ3BjJywgYXR0cnMpO1xuICAgIH0gZWxzZSBpZiAocGxhY2Vob2xkZXJOYW1lLnN0YXJ0c1dpdGgoJ0NMT1NFXycpKSB7XG4gICAgICB4bWwuZW5kVGFnKCdwYycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBhdHRyczpcbiAgICAgICAgICBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge2lkOiBgJHt0aGlzLmN1cnJlbnRQbGFjZWhvbGRlcklkKyt9YCwgZXF1aXY6IHBsYWNlaG9sZGVyTmFtZX07XG4gICAgICBpZiAodGV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGF0dHJzLmRpc3AgPSB0ZXh0O1xuICAgICAgfVxuICAgICAgeG1sLnN0YXJ0VGFnKCdwaCcsIGF0dHJzLCB7c2VsZkNsb3Npbmc6IHRydWV9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZU5vdGUoeG1sOiBYbWxGaWxlLCBuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICB4bWwuc3RhcnRUYWcoJ25vdGUnLCB7Y2F0ZWdvcnk6IG5hbWV9LCB7cHJlc2VydmVXaGl0ZXNwYWNlOiB0cnVlfSk7XG4gICAgeG1sLnRleHQodmFsdWUpO1xuICAgIHhtbC5lbmRUYWcoJ25vdGUnLCB7cHJlc2VydmVXaGl0ZXNwYWNlOiBmYWxzZX0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgaWQgZm9yIHRoZSBnaXZlbiBgbWVzc2FnZWAuXG4gICAqXG4gICAqIElmIHRoZXJlIHdhcyBhIGN1c3RvbSBpZCBwcm92aWRlZCwgdXNlIHRoYXQuXG4gICAqXG4gICAqIElmIHdlIGhhdmUgcmVxdWVzdGVkIGxlZ2FjeSBtZXNzYWdlIGlkcywgdGhlbiB0cnkgdG8gcmV0dXJuIHRoZSBhcHByb3ByaWF0ZSBpZFxuICAgKiBmcm9tIHRoZSBsaXN0IG9mIGxlZ2FjeSBpZHMgdGhhdCB3ZXJlIGV4dHJhY3RlZC5cbiAgICpcbiAgICogT3RoZXJ3aXNlIHJldHVybiB0aGUgY2Fub25pY2FsIG1lc3NhZ2UgaWQuXG4gICAqXG4gICAqIEFuIFhsaWZmIDIuMCBsZWdhY3kgbWVzc2FnZSBpZCBpcyBhIDY0IGJpdCBudW1iZXIgZW5jb2RlZCBhcyBhIGRlY2ltYWwgc3RyaW5nLCB3aGljaCB3aWxsIGhhdmVcbiAgICogYXQgbW9zdCAyMCBkaWdpdHMsIHNpbmNlIDJeNjUtMSA9IDM2LDg5Myw0ODgsMTQ3LDQxOSwxMDMsMjMxLiBUaGlzIGRpZ2VzdCBpcyBiYXNlZCBvbjpcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS9jbG9zdXJlLWNvbXBpbGVyL2Jsb2IvbWFzdGVyL3NyYy9jb20vZ29vZ2xlL2phdmFzY3JpcHQvanNjb21wL0dvb2dsZUpzTWVzc2FnZUlkR2VuZXJhdG9yLmphdmFcbiAgICovXG4gIHByaXZhdGUgZ2V0TWVzc2FnZUlkKG1lc3NhZ2U6IMm1UGFyc2VkTWVzc2FnZSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG1lc3NhZ2UuY3VzdG9tSWQgfHxcbiAgICAgICAgdGhpcy51c2VMZWdhY3lJZHMgJiYgbWVzc2FnZS5sZWdhY3lJZHMgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICBtZXNzYWdlLmxlZ2FjeUlkcy5maW5kKFxuICAgICAgICAgICAgaWQgPT4gaWQubGVuZ3RoIDw9IE1BWF9MRUdBQ1lfWExJRkZfMl9NRVNTQUdFX0xFTkdUSCAmJiAhL1teMC05XS8udGVzdChpZCkpIHx8XG4gICAgICAgIG1lc3NhZ2UuaWQ7XG4gIH1cbn1cbiJdfQ==
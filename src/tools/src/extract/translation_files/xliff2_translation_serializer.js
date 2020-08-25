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
            xml.startTag('file');
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
                    if (message.meaning || message.description) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYyX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2V4dHJhY3QvdHJhbnNsYXRpb25fZmlsZXMveGxpZmYyX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDJFQUFxRjtJQUdyRixxR0FBcUQ7SUFFckQsK0ZBQW1DO0lBRW5DLGlHQUFpRztJQUNqRyxJQUFNLGlDQUFpQyxHQUFHLEVBQUUsQ0FBQztJQUU3Qzs7Ozs7O09BTUc7SUFDSDtRQUVFLHFDQUNZLFlBQW9CLEVBQVUsUUFBd0IsRUFDdEQsWUFBcUI7WUFEckIsaUJBQVksR0FBWixZQUFZLENBQVE7WUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFnQjtZQUN0RCxpQkFBWSxHQUFaLFlBQVksQ0FBUztZQUh6Qix5QkFBb0IsR0FBRyxDQUFDLENBQUM7UUFHRyxDQUFDO1FBRXJDLCtDQUFTLEdBQVQsVUFBVSxRQUEwQjs7WUFDbEMsSUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztZQUM5QixJQUFNLEdBQUcsR0FBRyxJQUFJLGtCQUFPLEVBQUUsQ0FBQztZQUMxQixHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtnQkFDcEIsU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLE9BQU8sRUFBRSx1Q0FBdUM7Z0JBQ2hELFNBQVMsRUFBRSxJQUFJLENBQUMsWUFBWTthQUM3QixDQUFDLENBQUM7WUFDSCxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztnQkFDckIsS0FBc0IsSUFBQSxhQUFBLGlCQUFBLFFBQVEsQ0FBQSxrQ0FBQSx3REFBRTtvQkFBM0IsSUFBTSxPQUFPLHFCQUFBO29CQUNoQixJQUFNLEVBQUUsR0FBRyxJ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LEtBQUssQ0FBQyxDQUFDO1lBQ2hCLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUMsa0JBQWtCLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUNsRCxDQUFDO1FBRUQ7Ozs7Ozs7Ozs7Ozs7V0FhRztRQUNLLGtEQUFZLEdBQXBCLFVBQXFCLE9BQXVCO1lBQzFDLE9BQU8sT0FBTyxDQUFDLFFBQVE7Z0JBQ25CLElBQUksQ0FBQyxZQUFZLElBQUksT0FBTyxDQUFDLFNBQVMsS0FBSyxTQUFTO29CQUNwRCxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FDbEIsVUFBQSxFQUFFLElBQUksT0FBQSxFQUFFLENBQUMsTUFBTSxJQUFJLGlDQUFpQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBcEUsQ0FBb0UsQ0FBQztnQkFDL0UsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUNqQixDQUFDO1FBQ0gsa0NBQUM7SUFBRCxDQUFDLEFBcElELElBb0lDO0lBcElZLGtFQUEyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aCwgcmVsYXRpdmV9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHvJtVBhcnNlZE1lc3NhZ2UsIMm1U291cmNlTG9jYXRpb259IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcblxuaW1wb3J0IHtleHRyYWN0SWN1UGxhY2Vob2xkZXJzfSBmcm9tICcuL2ljdV9wYXJzaW5nJztcbmltcG9ydCB7VHJhbnNsYXRpb25TZXJpYWxpemVyfSBmcm9tICcuL3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtYbWxGaWxlfSBmcm9tICcuL3htbF9maWxlJztcblxuLyoqIFRoaXMgaXMgdGhlIG1heGltdW0gbnVtYmVyIG9mIGNoYXJhY3RlcnMgdGhhdCBjYW4gYXBwZWFyIGluIGEgbGVnYWN5IFhMSUZGIDIuMCBtZXNzYWdlIGlkLiAqL1xuY29uc3QgTUFYX0xFR0FDWV9YTElGRl8yX01FU1NBR0VfTEVOR1RIID0gMjA7XG5cbi8qKlxuICogQSB0cmFuc2xhdGlvbiBzZXJpYWxpemVyIHRoYXQgY2FuIHdyaXRlIHRyYW5zbGF0aW9ucyBpbiBYTElGRiAyIGZvcm1hdC5cbiAqXG4gKiBodHRwOi8vZG9jcy5vYXNpcy1vcGVuLm9yZy94bGlmZi94bGlmZi1jb3JlL3YyLjAvb3MveGxpZmYtY29yZS12Mi4wLW9zLmh0bWxcbiAqXG4gKiBAc2VlIFhsaWZmMlRyYW5zbGF0aW9uUGFyc2VyXG4gKi9cbmV4cG9ydCBjbGFzcyBYbGlmZjJUcmFuc2xhdGlvblNlcmlhbGl6ZXIgaW1wbGVtZW50cyBUcmFuc2xhdGlvblNlcmlhbGl6ZXIge1xuICBwcml2YXRlIGN1cnJlbnRQbGFjZWhvbGRlcklkID0gMDtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHNvdXJjZUxvY2FsZTogc3RyaW5nLCBwcml2YXRlIGJhc2VQYXRoOiBBYnNvbHV0ZUZzUGF0aCxcbiAgICAgIHByaXZhdGUgdXNlTGVnYWN5SWRzOiBib29sZWFuKSB7fVxuXG4gIHNlcmlhbGl6ZShtZXNzYWdlczogybVQYXJzZWRNZXNzYWdlW10pOiBzdHJpbmcge1xuICAgIGNvbnN0IGlkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IHhtbCA9IG5ldyBYbWxGaWxlKCk7XG4gICAgeG1sLnN0YXJ0VGFnKCd4bGlmZicsIHtcbiAgICAgICd2ZXJzaW9uJzogJzIuMCcsXG4gICAgICAneG1sbnMnOiAndXJuOm9hc2lzOm5hbWVzOnRjOnhsaWZmOmRvY3VtZW50OjIuMCcsXG4gICAgICAnc3JjTGFuZyc6IHRoaXMuc291cmNlTG9jYWxlXG4gICAgfSk7XG4gICAgeG1sLnN0YXJ0VGFnKCdmaWxlJyk7XG4gICAgZm9yIChjb25zdCBtZXNzYWdlIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBjb25zdCBpZCA9IHRoaXMuZ2V0TWVzc2FnZUlkKG1lc3NhZ2UpO1xuICAgICAgaWYgKGlkcy5oYXMoaWQpKSB7XG4gICAgICAgIC8vIERvIG5vdCByZW5kZXIgdGhlIHNhbWUgbWVzc2FnZSBtb3JlIHRoYW4gb25jZVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlkcy5hZGQoaWQpO1xuICAgICAgeG1sLnN0YXJ0VGFnKCd1bml0Jywge2lkfSk7XG4gICAgICBpZiAobWVzc2FnZS5tZWFuaW5nIHx8IG1lc3NhZ2UuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgeG1sLnN0YXJ0VGFnKCdub3RlcycpO1xuICAgICAgICBpZiAobWVzc2FnZS5sb2NhdGlvbikge1xuICAgICAgICAgIGNvbnN0IHtmaWxlLCBzdGFydCwgZW5kfSA9IG1lc3NhZ2UubG9jYXRpb247XG4gICAgICAgICAgY29uc3QgZW5kTGluZVN0cmluZyA9XG4gICAgICAgICAgICAgIGVuZCAhPT0gdW5kZWZpbmVkICYmIGVuZC5saW5lICE9PSBzdGFydC5saW5lID8gYCwke2VuZC5saW5lICsgMX1gIDogJyc7XG4gICAgICAgICAgdGhpcy5zZXJpYWxpemVOb3RlKFxuICAgICAgICAgICAgICB4bWwsICdsb2NhdGlvbicsXG4gICAgICAgICAgICAgIGAke3JlbGF0aXZlKHRoaXMuYmFzZVBhdGgsIGZpbGUpfToke3N0YXJ0LmxpbmUgKyAxfSR7ZW5kTGluZVN0cmluZ31gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWVzc2FnZS5kZXNjcmlwdGlvbikge1xuICAgICAgICAgIHRoaXMuc2VyaWFsaXplTm90ZSh4bWwsICdkZXNjcmlwdGlvbicsIG1lc3NhZ2UuZGVzY3JpcHRpb24pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtZXNzYWdlLm1lYW5pbmcpIHtcbiAgICAgICAgICB0aGlzLnNlcmlhbGl6ZU5vdGUoeG1sLCAnbWVhbmluZycsIG1lc3NhZ2UubWVhbmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgeG1sLmVuZFRhZygnbm90ZXMnKTtcbiAgICAgIH1cbiAgICAgIHhtbC5zdGFydFRhZygnc2VnbWVudCcpO1xuICAgICAgeG1sLnN0YXJ0VGFnKCdzb3VyY2UnLCB7fSwge3ByZXNlcnZlV2hpdGVzcGFjZTogdHJ1ZX0pO1xuICAgICAgdGhpcy5zZXJpYWxpemVNZXNzYWdlKHhtbCwgbWVzc2FnZSk7XG4gICAgICB4bWwuZW5kVGFnKCdzb3VyY2UnLCB7cHJlc2VydmVXaGl0ZXNwYWNlOiBmYWxzZX0pO1xuICAgICAgeG1sLmVuZFRhZygnc2VnbWVudCcpO1xuICAgICAgeG1sLmVuZFRhZygndW5pdCcpO1xuICAgIH1cbiAgICB4bWwuZW5kVGFnKCdmaWxlJyk7XG4gICAgeG1sLmVuZFRhZygneGxpZmYnKTtcbiAgICByZXR1cm4geG1sLnRvU3RyaW5nKCk7XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZU1lc3NhZ2UoeG1sOiBYbWxGaWxlLCBtZXNzYWdlOiDJtVBhcnNlZE1lc3NhZ2UpOiB2b2lkIHtcbiAgICB0aGlzLmN1cnJlbnRQbGFjZWhvbGRlcklkID0gMDtcbiAgICBjb25zdCBsZW5ndGggPSBtZXNzYWdlLm1lc3NhZ2VQYXJ0cy5sZW5ndGggLSAxO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuc2VyaWFsaXplVGV4dFBhcnQoeG1sLCBtZXNzYWdlLm1lc3NhZ2VQYXJ0c1tpXSk7XG4gICAgICB0aGlzLnNlcmlhbGl6ZVBsYWNlaG9sZGVyKHhtbCwgbWVzc2FnZS5wbGFjZWhvbGRlck5hbWVzW2ldLCBtZXNzYWdlLnN1YnN0aXR1dGlvbkxvY2F0aW9ucyk7XG4gICAgfVxuICAgIHRoaXMuc2VyaWFsaXplVGV4dFBhcnQoeG1sLCBtZXNzYWdlLm1lc3NhZ2VQYXJ0c1tsZW5ndGhdKTtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplVGV4dFBhcnQoeG1sOiBYbWxGaWxlLCB0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBwaWVjZXMgPSBleHRyYWN0SWN1UGxhY2Vob2xkZXJzKHRleHQpO1xuICAgIGNvbnN0IGxlbmd0aCA9IHBpZWNlcy5sZW5ndGggLSAxO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIHhtbC50ZXh0KHBpZWNlc1tpXSk7XG4gICAgICB0aGlzLnNlcmlhbGl6ZVBsYWNlaG9sZGVyKHhtbCwgcGllY2VzW2kgKyAxXSwgdW5kZWZpbmVkKTtcbiAgICB9XG4gICAgeG1sLnRleHQocGllY2VzW2xlbmd0aF0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVQbGFjZWhvbGRlcihcbiAgICAgIHhtbDogWG1sRmlsZSwgcGxhY2Vob2xkZXJOYW1lOiBzdHJpbmcsXG4gICAgICBzdWJzdGl0dXRpb25Mb2NhdGlvbnM6IFJlY29yZDxzdHJpbmcsIMm1U291cmNlTG9jYXRpb258dW5kZWZpbmVkPnx1bmRlZmluZWQpOiB2b2lkIHtcbiAgICBjb25zdCB0ZXh0ID0gc3Vic3RpdHV0aW9uTG9jYXRpb25zPy5bcGxhY2Vob2xkZXJOYW1lXT8udGV4dDtcblxuICAgIGlmIChwbGFjZWhvbGRlck5hbWUuc3RhcnRzV2l0aCgnU1RBUlRfJykpIHtcbiAgICAgIGNvbnN0IGNsb3NpbmdQbGFjZWhvbGRlck5hbWUgPSBwbGFjZWhvbGRlck5hbWUucmVwbGFjZSgvXlNUQVJULywgJ0NMT1NFJyk7XG4gICAgICBjb25zdCBjbG9zaW5nVGV4dCA9IHN1YnN0aXR1dGlvbkxvY2F0aW9ucz8uW2Nsb3NpbmdQbGFjZWhvbGRlck5hbWVdPy50ZXh0O1xuICAgICAgY29uc3QgYXR0cnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgICAgIGlkOiBgJHt0aGlzLmN1cnJlbnRQbGFjZWhvbGRlcklkKyt9YCxcbiAgICAgICAgZXF1aXZTdGFydDogcGxhY2Vob2xkZXJOYW1lLFxuICAgICAgICBlcXVpdkVuZDogY2xvc2luZ1BsYWNlaG9sZGVyTmFtZSxcbiAgICAgIH07XG4gICAgICBpZiAodGV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGF0dHJzLmRpc3BTdGFydCA9IHRleHQ7XG4gICAgICB9XG4gICAgICBpZiAoY2xvc2luZ1RleHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBhdHRycy5kaXNwRW5kID0gY2xvc2luZ1RleHQ7XG4gICAgICB9XG4gICAgICB4bWwuc3RhcnRUYWcoJ3BjJywgYXR0cnMpO1xuICAgIH0gZWxzZSBpZiAocGxhY2Vob2xkZXJOYW1lLnN0YXJ0c1dpdGgoJ0NMT1NFXycpKSB7XG4gICAgICB4bWwuZW5kVGFnKCdwYycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBhdHRyczpcbiAgICAgICAgICBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge2lkOiBgJHt0aGlzLmN1cnJlbnRQbGFjZWhvbGRlcklkKyt9YCwgZXF1aXY6IHBsYWNlaG9sZGVyTmFtZX07XG4gICAgICBpZiAodGV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGF0dHJzLmRpc3AgPSB0ZXh0O1xuICAgICAgfVxuICAgICAgeG1sLnN0YXJ0VGFnKCdwaCcsIGF0dHJzLCB7c2VsZkNsb3Npbmc6IHRydWV9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZU5vdGUoeG1sOiBYbWxGaWxlLCBuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICB4bWwuc3RhcnRUYWcoJ25vdGUnLCB7Y2F0ZWdvcnk6IG5hbWV9LCB7cHJlc2VydmVXaGl0ZXNwYWNlOiB0cnVlfSk7XG4gICAgeG1sLnRleHQodmFsdWUpO1xuICAgIHhtbC5lbmRUYWcoJ25vdGUnLCB7cHJlc2VydmVXaGl0ZXNwYWNlOiBmYWxzZX0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgaWQgZm9yIHRoZSBnaXZlbiBgbWVzc2FnZWAuXG4gICAqXG4gICAqIElmIHRoZXJlIHdhcyBhIGN1c3RvbSBpZCBwcm92aWRlZCwgdXNlIHRoYXQuXG4gICAqXG4gICAqIElmIHdlIGhhdmUgcmVxdWVzdGVkIGxlZ2FjeSBtZXNzYWdlIGlkcywgdGhlbiB0cnkgdG8gcmV0dXJuIHRoZSBhcHByb3ByaWF0ZSBpZFxuICAgKiBmcm9tIHRoZSBsaXN0IG9mIGxlZ2FjeSBpZHMgdGhhdCB3ZXJlIGV4dHJhY3RlZC5cbiAgICpcbiAgICogT3RoZXJ3aXNlIHJldHVybiB0aGUgY2Fub25pY2FsIG1lc3NhZ2UgaWQuXG4gICAqXG4gICAqIEFuIFhsaWZmIDIuMCBsZWdhY3kgbWVzc2FnZSBpZCBpcyBhIDY0IGJpdCBudW1iZXIgZW5jb2RlZCBhcyBhIGRlY2ltYWwgc3RyaW5nLCB3aGljaCB3aWxsIGhhdmVcbiAgICogYXQgbW9zdCAyMCBkaWdpdHMsIHNpbmNlIDJeNjUtMSA9IDM2LDg5Myw0ODgsMTQ3LDQxOSwxMDMsMjMxLiBUaGlzIGRpZ2VzdCBpcyBiYXNlZCBvbjpcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS9jbG9zdXJlLWNvbXBpbGVyL2Jsb2IvbWFzdGVyL3NyYy9jb20vZ29vZ2xlL2phdmFzY3JpcHQvanNjb21wL0dvb2dsZUpzTWVzc2FnZUlkR2VuZXJhdG9yLmphdmFcbiAgICovXG4gIHByaXZhdGUgZ2V0TWVzc2FnZUlkKG1lc3NhZ2U6IMm1UGFyc2VkTWVzc2FnZSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG1lc3NhZ2UuY3VzdG9tSWQgfHxcbiAgICAgICAgdGhpcy51c2VMZWdhY3lJZHMgJiYgbWVzc2FnZS5sZWdhY3lJZHMgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICBtZXNzYWdlLmxlZ2FjeUlkcy5maW5kKFxuICAgICAgICAgICAgaWQgPT4gaWQubGVuZ3RoIDw9IE1BWF9MRUdBQ1lfWExJRkZfMl9NRVNTQUdFX0xFTkdUSCAmJiAhL1teMC05XS8udGVzdChpZCkpIHx8XG4gICAgICAgIG1lc3NhZ2UuaWQ7XG4gIH1cbn1cbiJdfQ==
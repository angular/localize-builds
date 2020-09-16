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
     */
    var Xliff2TranslationSerializer = /** @class */ (function () {
        function Xliff2TranslationSerializer(sourceLocale, basePath, useLegacyIds, formatOptions) {
            if (formatOptions === void 0) { formatOptions = {}; }
            this.sourceLocale = sourceLocale;
            this.basePath = basePath;
            this.useLegacyIds = useLegacyIds;
            this.formatOptions = formatOptions;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYyX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2V4dHJhY3QvdHJhbnNsYXRpb25fZmlsZXMveGxpZmYyX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDJFQUFxRjtJQUdyRiwyR0FBZ0U7SUFDaEUscUdBQXFEO0lBRXJELCtGQUFtQztJQUVuQyxpR0FBaUc7SUFDakcsSUFBTSxpQ0FBaUMsR0FBRyxFQUFFLENBQUM7SUFFN0M7Ozs7OztPQU1HO0lBQ0g7UUFFRSxxQ0FDWSxZQUFvQixFQUFVLFFBQXdCLEVBQVUsWUFBcUIsRUFDckYsYUFBaUM7WUFBakMsOEJBQUEsRUFBQSxrQkFBaUM7WUFEakMsaUJBQVksR0FBWixZQUFZLENBQVE7WUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFnQjtZQUFVLGlCQUFZLEdBQVosWUFBWSxDQUFTO1lBQ3JGLGtCQUFhLEdBQWIsYUFBYSxDQUFvQjtZQUhyQyx5QkFBb0IsR0FBRyxDQUFDLENBQUM7WUFJL0IsZ0NBQWUsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQy9GLENBQUM7UUFFRCwrQ0FBUyxHQUFULFVBQVUsUUFBMEI7O1lBQ2xDLElBQU0sR0FBRyxHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7WUFDOUIsSUFBTSxHQUFHLEdBQUcsSUFBSSxrQkFBTyxFQUFFLENBQUM7WUFDMUIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3BCLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixPQUFPLEVBQUUsdUNBQXVDO2dCQUNoRCxTQUFTLEVBQUUs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LElBQUksS0FBSyxTQUFTLEVBQUU7b0JBQ3RCLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2lCQUNuQjtnQkFDRCxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQzthQUNoRDtRQUNILENBQUM7UUFFTyxtREFBYSxHQUFyQixVQUFzQixHQUFZLEVBQUUsSUFBWSxFQUFFLEtBQWE7WUFDN0QsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLEVBQUUsRUFBQyxrQkFBa0IsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1lBQ25FLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBQyxrQkFBa0IsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBQ2xELENBQUM7UUFFRDs7Ozs7Ozs7Ozs7OztXQWFHO1FBQ0ssa0RBQVksR0FBcEIsVUFBcUIsT0FBdUI7WUFDMUMsT0FBTyxPQUFPLENBQUMsUUFBUTtnQkFDbkIsSUFBSSxDQUFDLFlBQVksSUFBSSxPQUFPLENBQUMsU0FBUyxLQUFLLFNBQVM7b0JBQ3BELE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUNsQixVQUFBLEVBQUUsSUFBSSxPQUFBLEVBQUUsQ0FBQyxNQUFNLElBQUksaUNBQWlDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFwRSxDQUFvRSxDQUFDO2dCQUMvRSxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQ2pCLENBQUM7UUFDSCxrQ0FBQztJQUFELENBQUMsQUE3SUQsSUE2SUM7SUE3SVksa0VBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0Fic29sdXRlRnNQYXRoLCByZWxhdGl2ZX0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQge8m1UGFyc2VkTWVzc2FnZSwgybVTb3VyY2VMb2NhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuXG5pbXBvcnQge0Zvcm1hdE9wdGlvbnMsIHZhbGlkYXRlT3B0aW9uc30gZnJvbSAnLi9mb3JtYXRfb3B0aW9ucyc7XG5pbXBvcnQge2V4dHJhY3RJY3VQbGFjZWhvbGRlcnN9IGZyb20gJy4vaWN1X3BhcnNpbmcnO1xuaW1wb3J0IHtUcmFuc2xhdGlvblNlcmlhbGl6ZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fc2VyaWFsaXplcic7XG5pbXBvcnQge1htbEZpbGV9IGZyb20gJy4veG1sX2ZpbGUnO1xuXG4vKiogVGhpcyBpcyB0aGUgbWF4aW11bSBudW1iZXIgb2YgY2hhcmFjdGVycyB0aGF0IGNhbiBhcHBlYXIgaW4gYSBsZWdhY3kgWExJRkYgMi4wIG1lc3NhZ2UgaWQuICovXG5jb25zdCBNQVhfTEVHQUNZX1hMSUZGXzJfTUVTU0FHRV9MRU5HVEggPSAyMDtcblxuLyoqXG4gKiBBIHRyYW5zbGF0aW9uIHNlcmlhbGl6ZXIgdGhhdCBjYW4gd3JpdGUgdHJhbnNsYXRpb25zIGluIFhMSUZGIDIgZm9ybWF0LlxuICpcbiAqIGh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL3hsaWZmL3hsaWZmLWNvcmUvdjIuMC9vcy94bGlmZi1jb3JlLXYyLjAtb3MuaHRtbFxuICpcbiAqIEBzZWUgWGxpZmYyVHJhbnNsYXRpb25QYXJzZXJcbiAqL1xuZXhwb3J0IGNsYXNzIFhsaWZmMlRyYW5zbGF0aW9uU2VyaWFsaXplciBpbXBsZW1lbnRzIFRyYW5zbGF0aW9uU2VyaWFsaXplciB7XG4gIHByaXZhdGUgY3VycmVudFBsYWNlaG9sZGVySWQgPSAwO1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgc291cmNlTG9jYWxlOiBzdHJpbmcsIHByaXZhdGUgYmFzZVBhdGg6IEFic29sdXRlRnNQYXRoLCBwcml2YXRlIHVzZUxlZ2FjeUlkczogYm9vbGVhbixcbiAgICAgIHByaXZhdGUgZm9ybWF0T3B0aW9uczogRm9ybWF0T3B0aW9ucyA9IHt9KSB7XG4gICAgdmFsaWRhdGVPcHRpb25zKCdYbGlmZjFUcmFuc2xhdGlvblNlcmlhbGl6ZXInLCBbWyd4bWw6c3BhY2UnLCBbJ3ByZXNlcnZlJ11dXSwgZm9ybWF0T3B0aW9ucyk7XG4gIH1cblxuICBzZXJpYWxpemUobWVzc2FnZXM6IMm1UGFyc2VkTWVzc2FnZVtdKTogc3RyaW5nIHtcbiAgICBjb25zdCBpZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBjb25zdCB4bWwgPSBuZXcgWG1sRmlsZSgpO1xuICAgIHhtbC5zdGFydFRhZygneGxpZmYnLCB7XG4gICAgICAndmVyc2lvbic6ICcyLjAnLFxuICAgICAgJ3htbG5zJzogJ3VybjpvYXNpczpuYW1lczp0Yzp4bGlmZjpkb2N1bWVudDoyLjAnLFxuICAgICAgJ3NyY0xhbmcnOiB0aGlzLnNvdXJjZUxvY2FsZVxuICAgIH0pO1xuICAgIC8vIE5PVEU6IHRoZSBgb3JpZ2luYWxgIHByb3BlcnR5IGlzIHNldCB0byB0aGUgbGVnYWN5IGBuZy50ZW1wbGF0ZWAgdmFsdWUgZm9yIGJhY2t3YXJkXG4gICAgLy8gY29tcGF0aWJpbGl0eS5cbiAgICAvLyBXZSBjb3VsZCBjb21wdXRlIHRoZSBmaWxlIGZyb20gdGhlIGBtZXNzYWdlLmxvY2F0aW9uYCBwcm9wZXJ0eSwgYnV0IHRoZXJlIGNvdWxkXG4gICAgLy8gYmUgbXVsdGlwbGUgdmFsdWVzIGZvciB0aGlzIGluIHRoZSBjb2xsZWN0aW9uIG9mIGBtZXNzYWdlc2AuIEluIHRoYXQgY2FzZSB3ZSB3b3VsZCBwcm9iYWJseVxuICAgIC8vIG5lZWQgdG8gY2hhbmdlIHRoZSBzZXJpYWxpemVyIHRvIG91dHB1dCBhIG5ldyBgPGZpbGU+YCBlbGVtZW50IGZvciBlYWNoIGNvbGxlY3Rpb24gb2ZcbiAgICAvLyBtZXNzYWdlcyB0aGF0IGNvbWUgZnJvbSBhIHBhcnRpY3VsYXIgb3JpZ2luYWwgZmlsZSwgYW5kIHRoZSB0cmFuc2xhdGlvbiBmaWxlIHBhcnNlcnMgbWF5XG4gICAgLy8gbm90XG4gICAgeG1sLnN0YXJ0VGFnKCdmaWxlJywgeydpZCc6ICduZ2kxOG4nLCAnb3JpZ2luYWwnOiAnbmcudGVtcGxhdGUnLCAuLi50aGlzLmZvcm1hdE9wdGlvbnN9KTtcbiAgICBmb3IgKGNvbnN0IG1lc3NhZ2Ugb2YgbWVzc2FnZXMpIHtcbiAgICAgIGNvbnN0IGlkID0gdGhpcy5nZXRNZXNzYWdlSWQobWVzc2FnZSk7XG4gICAgICBpZiAoaWRzLmhhcyhpZCkpIHtcbiAgICAgICAgLy8gRG8gbm90IHJlbmRlciB0aGUgc2FtZSBtZXNzYWdlIG1vcmUgdGhhbiBvbmNlXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWRzLmFkZChpZCk7XG4gICAgICB4bWwuc3RhcnRUYWcoJ3VuaXQnLCB7aWR9KTtcbiAgICAgIGlmIChtZXNzYWdlLm1lYW5pbmcgfHwgbWVzc2FnZS5kZXNjcmlwdGlvbiB8fCBtZXNzYWdlLmxvY2F0aW9uKSB7XG4gICAgICAgIHhtbC5zdGFydFRhZygnbm90ZXMnKTtcbiAgICAgICAgaWYgKG1lc3NhZ2UubG9jYXRpb24pIHtcbiAgICAgICAgICBjb25zdCB7ZmlsZSwgc3RhcnQsIGVuZH0gPSBtZXNzYWdlLmxvY2F0aW9uO1xuICAgICAgICAgIGNvbnN0IGVuZExpbmVTdHJpbmcgPVxuICAgICAgICAgICAgICBlbmQgIT09IHVuZGVmaW5lZCAmJiBlbmQubGluZSAhPT0gc3RhcnQubGluZSA/IGAsJHtlbmQubGluZSArIDF9YCA6ICcnO1xuICAgICAgICAgIHRoaXMuc2VyaWFsaXplTm90ZShcbiAgICAgICAgICAgICAgeG1sLCAnbG9jYXRpb24nLFxuICAgICAgICAgICAgICBgJHtyZWxhdGl2ZSh0aGlzLmJhc2VQYXRoLCBmaWxlKX06JHtzdGFydC5saW5lICsgMX0ke2VuZExpbmVTdHJpbmd9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1lc3NhZ2UuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICB0aGlzLnNlcmlhbGl6ZU5vdGUoeG1sLCAnZGVzY3JpcHRpb24nLCBtZXNzYWdlLmRlc2NyaXB0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWVzc2FnZS5tZWFuaW5nKSB7XG4gICAgICAgICAgdGhpcy5zZXJpYWxpemVOb3RlKHhtbCwgJ21lYW5pbmcnLCBtZXNzYWdlLm1lYW5pbmcpO1xuICAgICAgICB9XG4gICAgICAgIHhtbC5lbmRUYWcoJ25vdGVzJyk7XG4gICAgICB9XG4gICAgICB4bWwuc3RhcnRUYWcoJ3NlZ21lbnQnKTtcbiAgICAgIHhtbC5zdGFydFRhZygnc291cmNlJywge30sIHtwcmVzZXJ2ZVdoaXRlc3BhY2U6IHRydWV9KTtcbiAgICAgIHRoaXMuc2VyaWFsaXplTWVzc2FnZSh4bWwsIG1lc3NhZ2UpO1xuICAgICAgeG1sLmVuZFRhZygnc291cmNlJywge3ByZXNlcnZlV2hpdGVzcGFjZTogZmFsc2V9KTtcbiAgICAgIHhtbC5lbmRUYWcoJ3NlZ21lbnQnKTtcbiAgICAgIHhtbC5lbmRUYWcoJ3VuaXQnKTtcbiAgICB9XG4gICAgeG1sLmVuZFRhZygnZmlsZScpO1xuICAgIHhtbC5lbmRUYWcoJ3hsaWZmJyk7XG4gICAgcmV0dXJuIHhtbC50b1N0cmluZygpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVNZXNzYWdlKHhtbDogWG1sRmlsZSwgbWVzc2FnZTogybVQYXJzZWRNZXNzYWdlKTogdm9pZCB7XG4gICAgdGhpcy5jdXJyZW50UGxhY2Vob2xkZXJJZCA9IDA7XG4gICAgY29uc3QgbGVuZ3RoID0gbWVzc2FnZS5tZXNzYWdlUGFydHMubGVuZ3RoIC0gMTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLnNlcmlhbGl6ZVRleHRQYXJ0KHhtbCwgbWVzc2FnZS5tZXNzYWdlUGFydHNbaV0pO1xuICAgICAgdGhpcy5zZXJpYWxpemVQbGFjZWhvbGRlcih4bWwsIG1lc3NhZ2UucGxhY2Vob2xkZXJOYW1lc1tpXSwgbWVzc2FnZS5zdWJzdGl0dXRpb25Mb2NhdGlvbnMpO1xuICAgIH1cbiAgICB0aGlzLnNlcmlhbGl6ZVRleHRQYXJ0KHhtbCwgbWVzc2FnZS5tZXNzYWdlUGFydHNbbGVuZ3RoXSk7XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZVRleHRQYXJ0KHhtbDogWG1sRmlsZSwgdGV4dDogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgcGllY2VzID0gZXh0cmFjdEljdVBsYWNlaG9sZGVycyh0ZXh0KTtcbiAgICBjb25zdCBsZW5ndGggPSBwaWVjZXMubGVuZ3RoIC0gMTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAyKSB7XG4gICAgICB4bWwudGV4dChwaWVjZXNbaV0pO1xuICAgICAgdGhpcy5zZXJpYWxpemVQbGFjZWhvbGRlcih4bWwsIHBpZWNlc1tpICsgMV0sIHVuZGVmaW5lZCk7XG4gICAgfVxuICAgIHhtbC50ZXh0KHBpZWNlc1tsZW5ndGhdKTtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplUGxhY2Vob2xkZXIoXG4gICAgICB4bWw6IFhtbEZpbGUsIHBsYWNlaG9sZGVyTmFtZTogc3RyaW5nLFxuICAgICAgc3Vic3RpdHV0aW9uTG9jYXRpb25zOiBSZWNvcmQ8c3RyaW5nLCDJtVNvdXJjZUxvY2F0aW9ufHVuZGVmaW5lZD58dW5kZWZpbmVkKTogdm9pZCB7XG4gICAgY29uc3QgdGV4dCA9IHN1YnN0aXR1dGlvbkxvY2F0aW9ucz8uW3BsYWNlaG9sZGVyTmFtZV0/LnRleHQ7XG5cbiAgICBpZiAocGxhY2Vob2xkZXJOYW1lLnN0YXJ0c1dpdGgoJ1NUQVJUXycpKSB7XG4gICAgICBjb25zdCBjbG9zaW5nUGxhY2Vob2xkZXJOYW1lID0gcGxhY2Vob2xkZXJOYW1lLnJlcGxhY2UoL15TVEFSVC8sICdDTE9TRScpO1xuICAgICAgY29uc3QgY2xvc2luZ1RleHQgPSBzdWJzdGl0dXRpb25Mb2NhdGlvbnM/LltjbG9zaW5nUGxhY2Vob2xkZXJOYW1lXT8udGV4dDtcbiAgICAgIGNvbnN0IGF0dHJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgICAgICBpZDogYCR7dGhpcy5jdXJyZW50UGxhY2Vob2xkZXJJZCsrfWAsXG4gICAgICAgIGVxdWl2U3RhcnQ6IHBsYWNlaG9sZGVyTmFtZSxcbiAgICAgICAgZXF1aXZFbmQ6IGNsb3NpbmdQbGFjZWhvbGRlck5hbWUsXG4gICAgICB9O1xuICAgICAgaWYgKHRleHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBhdHRycy5kaXNwU3RhcnQgPSB0ZXh0O1xuICAgICAgfVxuICAgICAgaWYgKGNsb3NpbmdUZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYXR0cnMuZGlzcEVuZCA9IGNsb3NpbmdUZXh0O1xuICAgICAgfVxuICAgICAgeG1sLnN0YXJ0VGFnKCdwYycsIGF0dHJzKTtcbiAgICB9IGVsc2UgaWYgKHBsYWNlaG9sZGVyTmFtZS5zdGFydHNXaXRoKCdDTE9TRV8nKSkge1xuICAgICAgeG1sLmVuZFRhZygncGMnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYXR0cnM6XG4gICAgICAgICAgUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtpZDogYCR7dGhpcy5jdXJyZW50UGxhY2Vob2xkZXJJZCsrfWAsIGVxdWl2OiBwbGFjZWhvbGRlck5hbWV9O1xuICAgICAgaWYgKHRleHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBhdHRycy5kaXNwID0gdGV4dDtcbiAgICAgIH1cbiAgICAgIHhtbC5zdGFydFRhZygncGgnLCBhdHRycywge3NlbGZDbG9zaW5nOiB0cnVlfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVOb3RlKHhtbDogWG1sRmlsZSwgbmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgeG1sLnN0YXJ0VGFnKCdub3RlJywge2NhdGVnb3J5OiBuYW1lfSwge3ByZXNlcnZlV2hpdGVzcGFjZTogdHJ1ZX0pO1xuICAgIHhtbC50ZXh0KHZhbHVlKTtcbiAgICB4bWwuZW5kVGFnKCdub3RlJywge3ByZXNlcnZlV2hpdGVzcGFjZTogZmFsc2V9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGlkIGZvciB0aGUgZ2l2ZW4gYG1lc3NhZ2VgLlxuICAgKlxuICAgKiBJZiB0aGVyZSB3YXMgYSBjdXN0b20gaWQgcHJvdmlkZWQsIHVzZSB0aGF0LlxuICAgKlxuICAgKiBJZiB3ZSBoYXZlIHJlcXVlc3RlZCBsZWdhY3kgbWVzc2FnZSBpZHMsIHRoZW4gdHJ5IHRvIHJldHVybiB0aGUgYXBwcm9wcmlhdGUgaWRcbiAgICogZnJvbSB0aGUgbGlzdCBvZiBsZWdhY3kgaWRzIHRoYXQgd2VyZSBleHRyYWN0ZWQuXG4gICAqXG4gICAqIE90aGVyd2lzZSByZXR1cm4gdGhlIGNhbm9uaWNhbCBtZXNzYWdlIGlkLlxuICAgKlxuICAgKiBBbiBYbGlmZiAyLjAgbGVnYWN5IG1lc3NhZ2UgaWQgaXMgYSA2NCBiaXQgbnVtYmVyIGVuY29kZWQgYXMgYSBkZWNpbWFsIHN0cmluZywgd2hpY2ggd2lsbCBoYXZlXG4gICAqIGF0IG1vc3QgMjAgZGlnaXRzLCBzaW5jZSAyXjY1LTEgPSAzNiw4OTMsNDg4LDE0Nyw0MTksMTAzLDIzMS4gVGhpcyBkaWdlc3QgaXMgYmFzZWQgb246XG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGUvY2xvc3VyZS1jb21waWxlci9ibG9iL21hc3Rlci9zcmMvY29tL2dvb2dsZS9qYXZhc2NyaXB0L2pzY29tcC9Hb29nbGVKc01lc3NhZ2VJZEdlbmVyYXRvci5qYXZhXG4gICAqL1xuICBwcml2YXRlIGdldE1lc3NhZ2VJZChtZXNzYWdlOiDJtVBhcnNlZE1lc3NhZ2UpOiBzdHJpbmcge1xuICAgIHJldHVybiBtZXNzYWdlLmN1c3RvbUlkIHx8XG4gICAgICAgIHRoaXMudXNlTGVnYWN5SWRzICYmIG1lc3NhZ2UubGVnYWN5SWRzICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgbWVzc2FnZS5sZWdhY3lJZHMuZmluZChcbiAgICAgICAgICAgIGlkID0+IGlkLmxlbmd0aCA8PSBNQVhfTEVHQUNZX1hMSUZGXzJfTUVTU0FHRV9MRU5HVEggJiYgIS9bXjAtOV0vLnRlc3QoaWQpKSB8fFxuICAgICAgICBtZXNzYWdlLmlkO1xuICB9XG59XG4iXX0=
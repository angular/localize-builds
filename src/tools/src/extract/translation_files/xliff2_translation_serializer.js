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
                this.serializePlaceholder(xml, message.placeholderNames[i]);
            }
            this.serializeTextPart(xml, message.messageParts[length]);
        };
        Xliff2TranslationSerializer.prototype.serializeTextPart = function (xml, text) {
            var pieces = icu_parsing_1.extractIcuPlaceholders(text);
            var length = pieces.length - 1;
            for (var i = 0; i < length; i += 2) {
                xml.text(pieces[i]);
                this.serializePlaceholder(xml, pieces[i + 1]);
            }
            xml.text(pieces[length]);
        };
        Xliff2TranslationSerializer.prototype.serializePlaceholder = function (xml, placeholderName) {
            if (placeholderName.startsWith('START_')) {
                xml.startTag('pc', {
                    id: "" + this.currentPlaceholderId++,
                    equivStart: placeholderName,
                    equivEnd: placeholderName.replace(/^START/, 'CLOSE')
                });
            }
            else if (placeholderName.startsWith('CLOSE_')) {
                xml.endTag('pc');
            }
            else {
                xml.startTag('ph', { id: "" + this.currentPlaceholderId++, equiv: placeholderName }, { selfClosing: true });
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
            return this.useLegacyIds && message.legacyIds !== undefined &&
                message.legacyIds.find(function (id) { return id.length <= MAX_LEGACY_XLIFF_2_MESSAGE_LENGTH && !/[^0-9]/.test(id); }) ||
                message.id;
        };
        return Xliff2TranslationSerializer;
    }());
    exports.Xliff2TranslationSerializer = Xliff2TranslationSerializer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYyX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2V4dHJhY3QvdHJhbnNsYXRpb25fZmlsZXMveGxpZmYyX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDJFQUFxRjtJQUdyRixxR0FBcUQ7SUFFckQsK0ZBQW1DO0lBRW5DLGlHQUFpRztJQUNqRyxJQUFNLGlDQUFpQyxHQUFHLEVBQUUsQ0FBQztJQUU3Qzs7Ozs7O09BTUc7SUFDSDtRQUVFLHFDQUNZLFlBQW9CLEVBQVUsUUFBd0IsRUFDdEQsWUFBcUI7WUFEckIsaUJBQVksR0FBWixZQUFZLENBQVE7WUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFnQjtZQUN0RCxpQkFBWSxHQUFaLFlBQVksQ0FBUztZQUh6Qix5QkFBb0IsR0FBRyxDQUFDLENBQUM7UUFHRyxDQUFDO1FBRXJDLCtDQUFTLEdBQVQsVUFBVSxRQUEwQjs7WUFDbEMsSUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztZQUM5QixJQUFNLEdBQUcsR0FBRyxJQUFJLGtCQUFPLEVBQUUsQ0FBQztZQUMxQixHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtnQkFDcEIsU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLE9BQU8sRUFBRSx1Q0FBdUM7Z0JBQ2hELFNBQVMsRUFBRSxJQUFJLENBQUMsWUFBWTthQUM3QixDQUFDLENBQUM7WUFDSCxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztnQkFDckIsS0FBc0IsSUFBQSxhQUFBLGlCQUFBLFFBQVEsQ0FBQSxrQ0FBQSx3REFBRTtvQkFBM0IsSUFBTSxPQUFPLHFCQUFBO29CQUNoQixJQUFNLEVBQUUsR0FBRyxJ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LElBQUksQ0FBQyxDQUFDO2FBQ2xCO2lCQUFNO2dCQUNMLEdBQUcsQ0FBQyxRQUFRLENBQ1IsSUFBSSxFQUFFLEVBQUMsRUFBRSxFQUFFLEtBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFJLEVBQUUsS0FBSyxFQUFFLGVBQWUsRUFBQyxFQUNwRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO2FBQzFCO1FBQ0gsQ0FBQztRQUVPLG1EQUFhLEdBQXJCLFVBQXNCLEdBQVksRUFBRSxJQUFZLEVBQUUsS0FBYTtZQUM3RCxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsRUFBRSxFQUFDLGtCQUFrQixFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7WUFDbkUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFDLGtCQUFrQixFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUVEOzs7Ozs7Ozs7OztXQVdHO1FBQ0ssa0RBQVksR0FBcEIsVUFBcUIsT0FBdUI7WUFDMUMsT0FBTyxJQUFJLENBQUMsWUFBWSxJQUFJLE9BQU8sQ0FBQyxTQUFTLEtBQUssU0FBUztnQkFDdkQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQ2xCLFVBQUEsRUFBRSxJQUFJLE9BQUEsRUFBRSxDQUFDLE1BQU0sSUFBSSxpQ0FBaUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQXBFLENBQW9FLENBQUM7Z0JBQy9FLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDakIsQ0FBQztRQUNILGtDQUFDO0lBQUQsQ0FBQyxBQWpIRCxJQWlIQztJQWpIWSxrRUFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGgsIHJlbGF0aXZlfSBmcm9tICdAYW5ndWxhci9jb21waWxlci1jbGkvc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7ybVQYXJzZWRNZXNzYWdlfSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5cbmltcG9ydCB7ZXh0cmFjdEljdVBsYWNlaG9sZGVyc30gZnJvbSAnLi9pY3VfcGFyc2luZyc7XG5pbXBvcnQge1RyYW5zbGF0aW9uU2VyaWFsaXplcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9zZXJpYWxpemVyJztcbmltcG9ydCB7WG1sRmlsZX0gZnJvbSAnLi94bWxfZmlsZSc7XG5cbi8qKiBUaGlzIGlzIHRoZSBtYXhpbXVtIG51bWJlciBvZiBjaGFyYWN0ZXJzIHRoYXQgY2FuIGFwcGVhciBpbiBhIGxlZ2FjeSBYTElGRiAyLjAgbWVzc2FnZSBpZC4gKi9cbmNvbnN0IE1BWF9MRUdBQ1lfWExJRkZfMl9NRVNTQUdFX0xFTkdUSCA9IDIwO1xuXG4vKipcbiAqIEEgdHJhbnNsYXRpb24gc2VyaWFsaXplciB0aGF0IGNhbiB3cml0ZSB0cmFuc2xhdGlvbnMgaW4gWExJRkYgMiBmb3JtYXQuXG4gKlxuICogaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcveGxpZmYveGxpZmYtY29yZS92Mi4wL29zL3hsaWZmLWNvcmUtdjIuMC1vcy5odG1sXG4gKlxuICogQHNlZSBYbGlmZjJUcmFuc2xhdGlvblBhcnNlclxuICovXG5leHBvcnQgY2xhc3MgWGxpZmYyVHJhbnNsYXRpb25TZXJpYWxpemVyIGltcGxlbWVudHMgVHJhbnNsYXRpb25TZXJpYWxpemVyIHtcbiAgcHJpdmF0ZSBjdXJyZW50UGxhY2Vob2xkZXJJZCA9IDA7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBzb3VyY2VMb2NhbGU6IHN0cmluZywgcHJpdmF0ZSBiYXNlUGF0aDogQWJzb2x1dGVGc1BhdGgsXG4gICAgICBwcml2YXRlIHVzZUxlZ2FjeUlkczogYm9vbGVhbikge31cblxuICBzZXJpYWxpemUobWVzc2FnZXM6IMm1UGFyc2VkTWVzc2FnZVtdKTogc3RyaW5nIHtcbiAgICBjb25zdCBpZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBjb25zdCB4bWwgPSBuZXcgWG1sRmlsZSgpO1xuICAgIHhtbC5zdGFydFRhZygneGxpZmYnLCB7XG4gICAgICAndmVyc2lvbic6ICcyLjAnLFxuICAgICAgJ3htbG5zJzogJ3VybjpvYXNpczpuYW1lczp0Yzp4bGlmZjpkb2N1bWVudDoyLjAnLFxuICAgICAgJ3NyY0xhbmcnOiB0aGlzLnNvdXJjZUxvY2FsZVxuICAgIH0pO1xuICAgIHhtbC5zdGFydFRhZygnZmlsZScpO1xuICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiBtZXNzYWdlcykge1xuICAgICAgY29uc3QgaWQgPSB0aGlzLmdldE1lc3NhZ2VJZChtZXNzYWdlKTtcbiAgICAgIGlmIChpZHMuaGFzKGlkKSkge1xuICAgICAgICAvLyBEbyBub3QgcmVuZGVyIHRoZSBzYW1lIG1lc3NhZ2UgbW9yZSB0aGFuIG9uY2VcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZHMuYWRkKGlkKTtcbiAgICAgIHhtbC5zdGFydFRhZygndW5pdCcsIHtpZH0pO1xuICAgICAgaWYgKG1lc3NhZ2UubWVhbmluZyB8fCBtZXNzYWdlLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHhtbC5zdGFydFRhZygnbm90ZXMnKTtcbiAgICAgICAgaWYgKG1lc3NhZ2UubG9jYXRpb24pIHtcbiAgICAgICAgICBjb25zdCB7ZmlsZSwgc3RhcnQsIGVuZH0gPSBtZXNzYWdlLmxvY2F0aW9uO1xuICAgICAgICAgIGNvbnN0IGVuZExpbmVTdHJpbmcgPVxuICAgICAgICAgICAgICBlbmQgIT09IHVuZGVmaW5lZCAmJiBlbmQubGluZSAhPT0gc3RhcnQubGluZSA/IGAsJHtlbmQubGluZSArIDF9YCA6ICcnO1xuICAgICAgICAgIHRoaXMuc2VyaWFsaXplTm90ZShcbiAgICAgICAgICAgICAgeG1sLCAnbG9jYXRpb24nLFxuICAgICAgICAgICAgICBgJHtyZWxhdGl2ZSh0aGlzLmJhc2VQYXRoLCBmaWxlKX06JHtzdGFydC5saW5lICsgMX0ke2VuZExpbmVTdHJpbmd9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1lc3NhZ2UuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICB0aGlzLnNlcmlhbGl6ZU5vdGUoeG1sLCAnZGVzY3JpcHRpb24nLCBtZXNzYWdlLmRlc2NyaXB0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWVzc2FnZS5tZWFuaW5nKSB7XG4gICAgICAgICAgdGhpcy5zZXJpYWxpemVOb3RlKHhtbCwgJ21lYW5pbmcnLCBtZXNzYWdlLm1lYW5pbmcpO1xuICAgICAgICB9XG4gICAgICAgIHhtbC5lbmRUYWcoJ25vdGVzJyk7XG4gICAgICB9XG4gICAgICB4bWwuc3RhcnRUYWcoJ3NlZ21lbnQnKTtcbiAgICAgIHhtbC5zdGFydFRhZygnc291cmNlJywge30sIHtwcmVzZXJ2ZVdoaXRlc3BhY2U6IHRydWV9KTtcbiAgICAgIHRoaXMuc2VyaWFsaXplTWVzc2FnZSh4bWwsIG1lc3NhZ2UpO1xuICAgICAgeG1sLmVuZFRhZygnc291cmNlJywge3ByZXNlcnZlV2hpdGVzcGFjZTogZmFsc2V9KTtcbiAgICAgIHhtbC5lbmRUYWcoJ3NlZ21lbnQnKTtcbiAgICAgIHhtbC5lbmRUYWcoJ3VuaXQnKTtcbiAgICB9XG4gICAgeG1sLmVuZFRhZygnZmlsZScpO1xuICAgIHhtbC5lbmRUYWcoJ3hsaWZmJyk7XG4gICAgcmV0dXJuIHhtbC50b1N0cmluZygpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVNZXNzYWdlKHhtbDogWG1sRmlsZSwgbWVzc2FnZTogybVQYXJzZWRNZXNzYWdlKTogdm9pZCB7XG4gICAgdGhpcy5jdXJyZW50UGxhY2Vob2xkZXJJZCA9IDA7XG4gICAgY29uc3QgbGVuZ3RoID0gbWVzc2FnZS5tZXNzYWdlUGFydHMubGVuZ3RoIC0gMTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLnNlcmlhbGl6ZVRleHRQYXJ0KHhtbCwgbWVzc2FnZS5tZXNzYWdlUGFydHNbaV0pO1xuICAgICAgdGhpcy5zZXJpYWxpemVQbGFjZWhvbGRlcih4bWwsIG1lc3NhZ2UucGxhY2Vob2xkZXJOYW1lc1tpXSk7XG4gICAgfVxuICAgIHRoaXMuc2VyaWFsaXplVGV4dFBhcnQoeG1sLCBtZXNzYWdlLm1lc3NhZ2VQYXJ0c1tsZW5ndGhdKTtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplVGV4dFBhcnQoeG1sOiBYbWxGaWxlLCB0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBwaWVjZXMgPSBleHRyYWN0SWN1UGxhY2Vob2xkZXJzKHRleHQpO1xuICAgIGNvbnN0IGxlbmd0aCA9IHBpZWNlcy5sZW5ndGggLSAxO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIHhtbC50ZXh0KHBpZWNlc1tpXSk7XG4gICAgICB0aGlzLnNlcmlhbGl6ZVBsYWNlaG9sZGVyKHhtbCwgcGllY2VzW2kgKyAxXSk7XG4gICAgfVxuICAgIHhtbC50ZXh0KHBpZWNlc1tsZW5ndGhdKTtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplUGxhY2Vob2xkZXIoeG1sOiBYbWxGaWxlLCBwbGFjZWhvbGRlck5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmIChwbGFjZWhvbGRlck5hbWUuc3RhcnRzV2l0aCgnU1RBUlRfJykpIHtcbiAgICAgIHhtbC5zdGFydFRhZygncGMnLCB7XG4gICAgICAgIGlkOiBgJHt0aGlzLmN1cnJlbnRQbGFjZWhvbGRlcklkKyt9YCxcbiAgICAgICAgZXF1aXZTdGFydDogcGxhY2Vob2xkZXJOYW1lLFxuICAgICAgICBlcXVpdkVuZDogcGxhY2Vob2xkZXJOYW1lLnJlcGxhY2UoL15TVEFSVC8sICdDTE9TRScpXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHBsYWNlaG9sZGVyTmFtZS5zdGFydHNXaXRoKCdDTE9TRV8nKSkge1xuICAgICAgeG1sLmVuZFRhZygncGMnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgeG1sLnN0YXJ0VGFnKFxuICAgICAgICAgICdwaCcsIHtpZDogYCR7dGhpcy5jdXJyZW50UGxhY2Vob2xkZXJJZCsrfWAsIGVxdWl2OiBwbGFjZWhvbGRlck5hbWV9LFxuICAgICAgICAgIHtzZWxmQ2xvc2luZzogdHJ1ZX0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplTm90ZSh4bWw6IFhtbEZpbGUsIG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIHhtbC5zdGFydFRhZygnbm90ZScsIHtjYXRlZ29yeTogbmFtZX0sIHtwcmVzZXJ2ZVdoaXRlc3BhY2U6IHRydWV9KTtcbiAgICB4bWwudGV4dCh2YWx1ZSk7XG4gICAgeG1sLmVuZFRhZygnbm90ZScsIHtwcmVzZXJ2ZVdoaXRlc3BhY2U6IGZhbHNlfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBpZCBmb3IgdGhlIGdpdmVuIGBtZXNzYWdlYC5cbiAgICpcbiAgICogSWYgd2UgaGF2ZSByZXF1ZXN0ZWQgbGVnYWN5IG1lc3NhZ2UgaWRzLCB0aGVuIHRyeSB0byByZXR1cm4gdGhlIGFwcHJvcHJpYXRlIGlkXG4gICAqIGZyb20gdGhlIGxpc3Qgb2YgbGVnYWN5IGlkcyB0aGF0IHdlcmUgZXh0cmFjdGVkLlxuICAgKlxuICAgKiBPdGhlcndpc2UgcmV0dXJuIHRoZSBjYW5vbmljYWwgbWVzc2FnZSBpZC5cbiAgICpcbiAgICogQW4gWGxpZmYgMi4wIGxlZ2FjeSBtZXNzYWdlIGlkIGlzIGEgNjQgYml0IG51bWJlciBlbmNvZGVkIGFzIGEgZGVjaW1hbCBzdHJpbmcsIHdoaWNoIHdpbGwgaGF2ZVxuICAgKiBhdCBtb3N0IDIwIGRpZ2l0cywgc2luY2UgMl42NS0xID0gMzYsODkzLDQ4OCwxNDcsNDE5LDEwMywyMzEuIFRoaXMgZGlnZXN0IGlzIGJhc2VkIG9uOlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2Nsb3N1cmUtY29tcGlsZXIvYmxvYi9tYXN0ZXIvc3JjL2NvbS9nb29nbGUvamF2YXNjcmlwdC9qc2NvbXAvR29vZ2xlSnNNZXNzYWdlSWRHZW5lcmF0b3IuamF2YVxuICAgKi9cbiAgcHJpdmF0ZSBnZXRNZXNzYWdlSWQobWVzc2FnZTogybVQYXJzZWRNZXNzYWdlKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy51c2VMZWdhY3lJZHMgJiYgbWVzc2FnZS5sZWdhY3lJZHMgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICBtZXNzYWdlLmxlZ2FjeUlkcy5maW5kKFxuICAgICAgICAgICAgaWQgPT4gaWQubGVuZ3RoIDw9IE1BWF9MRUdBQ1lfWExJRkZfMl9NRVNTQUdFX0xFTkdUSCAmJiAhL1teMC05XS8udGVzdChpZCkpIHx8XG4gICAgICAgIG1lc3NhZ2UuaWQ7XG4gIH1cbn1cbiJdfQ==
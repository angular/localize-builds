(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/extract/translation_files/xliff1_translation_serializer", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/localize/src/tools/src/extract/translation_files/format_options", "@angular/localize/src/tools/src/extract/translation_files/icu_parsing", "@angular/localize/src/tools/src/extract/translation_files/xml_file"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Xliff1TranslationSerializer = void 0;
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
    /** This is the number of characters that a legacy Xliff 1.2 message id has. */
    var LEGACY_XLIFF_MESSAGE_LENGTH = 40;
    /**
     * A translation serializer that can write XLIFF 1.2 formatted files.
     *
     * http://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html
     * http://docs.oasis-open.org/xliff/v1.2/xliff-profile-html/xliff-profile-html-1.2.html
     *
     * @see Xliff1TranslationParser
     */
    var Xliff1TranslationSerializer = /** @class */ (function () {
        function Xliff1TranslationSerializer(sourceLocale, basePath, useLegacyIds, formatOptions) {
            if (formatOptions === void 0) { formatOptions = {}; }
            this.sourceLocale = sourceLocale;
            this.basePath = basePath;
            this.useLegacyIds = useLegacyIds;
            this.formatOptions = formatOptions;
            format_options_1.validateOptions('Xliff1TranslationSerializer', [['xml:space', ['preserve']]], formatOptions);
        }
        Xliff1TranslationSerializer.prototype.serialize = function (messages) {
            var e_1, _a;
            var ids = new Set();
            var xml = new xml_file_1.XmlFile();
            xml.startTag('xliff', { 'version': '1.2', 'xmlns': 'urn:oasis:names:tc:xliff:document:1.2' });
            // NOTE: the `original` property is set to the legacy `ng2.template` value for backward
            // compatibility.
            // We could compute the file from the `message.location` property, but there could
            // be multiple values for this in the collection of `messages`. In that case we would probably
            // need to change the serializer to output a new `<file>` element for each collection of
            // messages that come from a particular original file, and the translation file parsers may not
            // be able to cope with this.
            xml.startTag('file', tslib_1.__assign({ 'source-language': this.sourceLocale, 'datatype': 'plaintext', 'original': 'ng2.template' }, this.formatOptions));
            xml.startTag('body');
            try {
                for (var messages_1 = tslib_1.__values(messages), messages_1_1 = messages_1.next(); !messages_1_1.done; messages_1_1 = messages_1.next()) {
                    var message = messages_1_1.value;
                    var id = this.getMessageId(message);
                    if (ids.has(id)) {
                        // Do not render the same message more than once
                        continue;
                    }
                    ids.add(id);
                    xml.startTag('trans-unit', { id: id, datatype: 'html' });
                    xml.startTag('source', {}, { preserveWhitespace: true });
                    this.serializeMessage(xml, message);
                    xml.endTag('source', { preserveWhitespace: false });
                    if (message.location) {
                        this.serializeLocation(xml, message.location);
                    }
                    if (message.description) {
                        this.serializeNote(xml, 'description', message.description);
                    }
                    if (message.meaning) {
                        this.serializeNote(xml, 'meaning', message.meaning);
                    }
                    xml.endTag('trans-unit');
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (messages_1_1 && !messages_1_1.done && (_a = messages_1.return)) _a.call(messages_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            xml.endTag('body');
            xml.endTag('file');
            xml.endTag('xliff');
            return xml.toString();
        };
        Xliff1TranslationSerializer.prototype.serializeMessage = function (xml, message) {
            var _a;
            var length = message.messageParts.length - 1;
            for (var i = 0; i < length; i++) {
                this.serializeTextPart(xml, message.messageParts[i]);
                var location = (_a = message.substitutionLocations) === null || _a === void 0 ? void 0 : _a[message.placeholderNames[i]];
                this.serializePlaceholder(xml, message.placeholderNames[i], location === null || location === void 0 ? void 0 : location.text);
            }
            this.serializeTextPart(xml, message.messageParts[length]);
        };
        Xliff1TranslationSerializer.prototype.serializeTextPart = function (xml, text) {
            var pieces = icu_parsing_1.extractIcuPlaceholders(text);
            var length = pieces.length - 1;
            for (var i = 0; i < length; i += 2) {
                xml.text(pieces[i]);
                this.serializePlaceholder(xml, pieces[i + 1], undefined);
            }
            xml.text(pieces[length]);
        };
        Xliff1TranslationSerializer.prototype.serializePlaceholder = function (xml, id, text) {
            var attrs = { id: id };
            if (text !== undefined) {
                attrs['equiv-text'] = text;
            }
            xml.startTag('x', attrs, { selfClosing: true });
        };
        Xliff1TranslationSerializer.prototype.serializeNote = function (xml, name, value) {
            xml.startTag('note', { priority: '1', from: name }, { preserveWhitespace: true });
            xml.text(value);
            xml.endTag('note', { preserveWhitespace: false });
        };
        Xliff1TranslationSerializer.prototype.serializeLocation = function (xml, location) {
            xml.startTag('context-group', { purpose: 'location' });
            this.renderContext(xml, 'sourcefile', file_system_1.relative(this.basePath, location.file));
            var endLineString = location.end !== undefined && location.end.line !== location.start.line ?
                "," + (location.end.line + 1) :
                '';
            this.renderContext(xml, 'linenumber', "" + (location.start.line + 1) + endLineString);
            xml.endTag('context-group');
        };
        Xliff1TranslationSerializer.prototype.renderContext = function (xml, type, value) {
            xml.startTag('context', { 'context-type': type }, { preserveWhitespace: true });
            xml.text(value);
            xml.endTag('context', { preserveWhitespace: false });
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
         * An Xliff 1.2 legacy message id is a hex encoded SHA-1 string, which is 40 characters long. See
         * https://csrc.nist.gov/csrc/media/publications/fips/180/4/final/documents/fips180-4-draft-aug2014.pdf
         */
        Xliff1TranslationSerializer.prototype.getMessageId = function (message) {
            return message.customId ||
                this.useLegacyIds && message.legacyIds !== undefined &&
                    message.legacyIds.find(function (id) { return id.length === LEGACY_XLIFF_MESSAGE_LENGTH; }) ||
                message.id;
        };
        return Xliff1TranslationSerializer;
    }());
    exports.Xliff1TranslationSerializer = Xliff1TranslationSerializer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYxX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2V4dHJhY3QvdHJhbnNsYXRpb25fZmlsZXMveGxpZmYxX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDJFQUFxRjtJQUdyRiwyR0FBZ0U7SUFDaEUscUdBQXFEO0lBRXJELCtGQUFtQztJQUVuQywrRUFBK0U7SUFDL0UsSUFBTSwyQkFBMkIsR0FBRyxFQUFFLENBQUM7SUFFdkM7Ozs7Ozs7T0FPRztJQUNIO1FBQ0UscUNBQ1ksWUFBb0IsRUFBVSxRQUF3QixFQUFVLFlBQXFCLEVBQ3JGLGFBQWlDO1lBQWpDLDhCQUFBLEVBQUEsa0JBQWlDO1lBRGpDLGlCQUFZLEdBQVosWUFBWSxDQUFRO1lBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBZ0I7WUFBVSxpQkFBWSxHQUFaLFlBQVksQ0FBUztZQUNyRixrQkFBYSxHQUFiLGFBQWEsQ0FBb0I7WUFDM0MsZ0NBQWUsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQy9GLENBQUM7UUFFRCwrQ0FBUyxHQUFULFVBQVUsUUFBMEI7O1lBQ2xDLElBQU0sR0FBRyxHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7WUFDOUIsSUFBTSxHQUFHLEdBQUcsSUFBSSxrQkFBTyxFQUFFLENBQUM7WUFDMUIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSx1Q0FBdUMsRUFBQyxDQUFDLENBQUM7WUFDNUYsdUZBQXVGO1lBQ3ZGLGlCQUFpQjtZQUNqQixr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Q0FBQztZQUM1RSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hCLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEVBQUMsa0JBQWtCLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUNyRCxDQUFDO1FBRUQ7Ozs7Ozs7Ozs7OztXQVlHO1FBQ0ssa0RBQVksR0FBcEIsVUFBcUIsT0FBdUI7WUFDMUMsT0FBTyxPQUFPLENBQUMsUUFBUTtnQkFDbkIsSUFBSSxDQUFDLFlBQVksSUFBSSxPQUFPLENBQUMsU0FBUyxLQUFLLFNBQVM7b0JBQ3BELE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsRUFBRSxDQUFDLE1BQU0sS0FBSywyQkFBMkIsRUFBekMsQ0FBeUMsQ0FBQztnQkFDdkUsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUNqQixDQUFDO1FBQ0gsa0NBQUM7SUFBRCxDQUFDLEFBM0hELElBMkhDO0lBM0hZLGtFQUEyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aCwgcmVsYXRpdmV9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHvJtVBhcnNlZE1lc3NhZ2UsIMm1U291cmNlTG9jYXRpb259IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcblxuaW1wb3J0IHtGb3JtYXRPcHRpb25zLCB2YWxpZGF0ZU9wdGlvbnN9IGZyb20gJy4vZm9ybWF0X29wdGlvbnMnO1xuaW1wb3J0IHtleHRyYWN0SWN1UGxhY2Vob2xkZXJzfSBmcm9tICcuL2ljdV9wYXJzaW5nJztcbmltcG9ydCB7VHJhbnNsYXRpb25TZXJpYWxpemVyfSBmcm9tICcuL3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtYbWxGaWxlfSBmcm9tICcuL3htbF9maWxlJztcblxuLyoqIFRoaXMgaXMgdGhlIG51bWJlciBvZiBjaGFyYWN0ZXJzIHRoYXQgYSBsZWdhY3kgWGxpZmYgMS4yIG1lc3NhZ2UgaWQgaGFzLiAqL1xuY29uc3QgTEVHQUNZX1hMSUZGX01FU1NBR0VfTEVOR1RIID0gNDA7XG5cbi8qKlxuICogQSB0cmFuc2xhdGlvbiBzZXJpYWxpemVyIHRoYXQgY2FuIHdyaXRlIFhMSUZGIDEuMiBmb3JtYXR0ZWQgZmlsZXMuXG4gKlxuICogaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcveGxpZmYvdjEuMi9vcy94bGlmZi1jb3JlLmh0bWxcbiAqIGh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL3hsaWZmL3YxLjIveGxpZmYtcHJvZmlsZS1odG1sL3hsaWZmLXByb2ZpbGUtaHRtbC0xLjIuaHRtbFxuICpcbiAqIEBzZWUgWGxpZmYxVHJhbnNsYXRpb25QYXJzZXJcbiAqL1xuZXhwb3J0IGNsYXNzIFhsaWZmMVRyYW5zbGF0aW9uU2VyaWFsaXplciBpbXBsZW1lbnRzIFRyYW5zbGF0aW9uU2VyaWFsaXplciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBzb3VyY2VMb2NhbGU6IHN0cmluZywgcHJpdmF0ZSBiYXNlUGF0aDogQWJzb2x1dGVGc1BhdGgsIHByaXZhdGUgdXNlTGVnYWN5SWRzOiBib29sZWFuLFxuICAgICAgcHJpdmF0ZSBmb3JtYXRPcHRpb25zOiBGb3JtYXRPcHRpb25zID0ge30pIHtcbiAgICB2YWxpZGF0ZU9wdGlvbnMoJ1hsaWZmMVRyYW5zbGF0aW9uU2VyaWFsaXplcicsIFtbJ3htbDpzcGFjZScsIFsncHJlc2VydmUnXV1dLCBmb3JtYXRPcHRpb25zKTtcbiAgfVxuXG4gIHNlcmlhbGl6ZShtZXNzYWdlczogybVQYXJzZWRNZXNzYWdlW10pOiBzdHJpbmcge1xuICAgIGNvbnN0IGlkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IHhtbCA9IG5ldyBYbWxGaWxlKCk7XG4gICAgeG1sLnN0YXJ0VGFnKCd4bGlmZicsIHsndmVyc2lvbic6ICcxLjInLCAneG1sbnMnOiAndXJuOm9hc2lzOm5hbWVzOnRjOnhsaWZmOmRvY3VtZW50OjEuMid9KTtcbiAgICAvLyBOT1RFOiB0aGUgYG9yaWdpbmFsYCBwcm9wZXJ0eSBpcyBzZXQgdG8gdGhlIGxlZ2FjeSBgbmcyLnRlbXBsYXRlYCB2YWx1ZSBmb3IgYmFja3dhcmRcbiAgICAvLyBjb21wYXRpYmlsaXR5LlxuICAgIC8vIFdlIGNvdWxkIGNvbXB1dGUgdGhlIGZpbGUgZnJvbSB0aGUgYG1lc3NhZ2UubG9jYXRpb25gIHByb3BlcnR5LCBidXQgdGhlcmUgY291bGRcbiAgICAvLyBiZSBtdWx0aXBsZSB2YWx1ZXMgZm9yIHRoaXMgaW4gdGhlIGNvbGxlY3Rpb24gb2YgYG1lc3NhZ2VzYC4gSW4gdGhhdCBjYXNlIHdlIHdvdWxkIHByb2JhYmx5XG4gICAgLy8gbmVlZCB0byBjaGFuZ2UgdGhlIHNlcmlhbGl6ZXIgdG8gb3V0cHV0IGEgbmV3IGA8ZmlsZT5gIGVsZW1lbnQgZm9yIGVhY2ggY29sbGVjdGlvbiBvZlxuICAgIC8vIG1lc3NhZ2VzIHRoYXQgY29tZSBmcm9tIGEgcGFydGljdWxhciBvcmlnaW5hbCBmaWxlLCBhbmQgdGhlIHRyYW5zbGF0aW9uIGZpbGUgcGFyc2VycyBtYXkgbm90XG4gICAgLy8gYmUgYWJsZSB0byBjb3BlIHdpdGggdGhpcy5cbiAgICB4bWwuc3RhcnRUYWcoJ2ZpbGUnLCB7XG4gICAgICAnc291cmNlLWxhbmd1YWdlJzogdGhpcy5zb3VyY2VMb2NhbGUsXG4gICAgICAnZGF0YXR5cGUnOiAncGxhaW50ZXh0JyxcbiAgICAgICdvcmlnaW5hbCc6ICduZzIudGVtcGxhdGUnLFxuICAgICAgLi4udGhpcy5mb3JtYXRPcHRpb25zLFxuICAgIH0pO1xuICAgIHhtbC5zdGFydFRhZygnYm9keScpO1xuICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiBtZXNzYWdlcykge1xuICAgICAgY29uc3QgaWQgPSB0aGlzLmdldE1lc3NhZ2VJZChtZXNzYWdlKTtcbiAgICAgIGlmIChpZHMuaGFzKGlkKSkge1xuICAgICAgICAvLyBEbyBub3QgcmVuZGVyIHRoZSBzYW1lIG1lc3NhZ2UgbW9yZSB0aGFuIG9uY2VcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZHMuYWRkKGlkKTtcblxuICAgICAgeG1sLnN0YXJ0VGFnKCd0cmFucy11bml0Jywge2lkLCBkYXRhdHlwZTogJ2h0bWwnfSk7XG4gICAgICB4bWwuc3RhcnRUYWcoJ3NvdXJjZScsIHt9LCB7cHJlc2VydmVXaGl0ZXNwYWNlOiB0cnVlfSk7XG4gICAgICB0aGlzLnNlcmlhbGl6ZU1lc3NhZ2UoeG1sLCBtZXNzYWdlKTtcbiAgICAgIHhtbC5lbmRUYWcoJ3NvdXJjZScsIHtwcmVzZXJ2ZVdoaXRlc3BhY2U6IGZhbHNlfSk7XG4gICAgICBpZiAobWVzc2FnZS5sb2NhdGlvbikge1xuICAgICAgICB0aGlzLnNlcmlhbGl6ZUxvY2F0aW9uKHhtbCwgbWVzc2FnZS5sb2NhdGlvbik7XG4gICAgICB9XG4gICAgICBpZiAobWVzc2FnZS5kZXNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLnNlcmlhbGl6ZU5vdGUoeG1sLCAnZGVzY3JpcHRpb24nLCBtZXNzYWdlLmRlc2NyaXB0aW9uKTtcbiAgICAgIH1cbiAgICAgIGlmIChtZXNzYWdlLm1lYW5pbmcpIHtcbiAgICAgICAgdGhpcy5zZXJpYWxpemVOb3RlKHhtbCwgJ21lYW5pbmcnLCBtZXNzYWdlLm1lYW5pbmcpO1xuICAgICAgfVxuICAgICAgeG1sLmVuZFRhZygndHJhbnMtdW5pdCcpO1xuICAgIH1cbiAgICB4bWwuZW5kVGFnKCdib2R5Jyk7XG4gICAgeG1sLmVuZFRhZygnZmlsZScpO1xuICAgIHhtbC5lbmRUYWcoJ3hsaWZmJyk7XG4gICAgcmV0dXJuIHhtbC50b1N0cmluZygpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVNZXNzYWdlKHhtbDogWG1sRmlsZSwgbWVzc2FnZTogybVQYXJzZWRNZXNzYWdlKTogdm9pZCB7XG4gICAgY29uc3QgbGVuZ3RoID0gbWVzc2FnZS5tZXNzYWdlUGFydHMubGVuZ3RoIC0gMTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLnNlcmlhbGl6ZVRleHRQYXJ0KHhtbCwgbWVzc2FnZS5tZXNzYWdlUGFydHNbaV0pO1xuICAgICAgY29uc3QgbG9jYXRpb24gPSBtZXNzYWdlLnN1YnN0aXR1dGlvbkxvY2F0aW9ucz8uW21lc3NhZ2UucGxhY2Vob2xkZXJOYW1lc1tpXV07XG4gICAgICB0aGlzLnNlcmlhbGl6ZVBsYWNlaG9sZGVyKHhtbCwgbWVzc2FnZS5wbGFjZWhvbGRlck5hbWVzW2ldLCBsb2NhdGlvbj8udGV4dCk7XG4gICAgfVxuICAgIHRoaXMuc2VyaWFsaXplVGV4dFBhcnQoeG1sLCBtZXNzYWdlLm1lc3NhZ2VQYXJ0c1tsZW5ndGhdKTtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplVGV4dFBhcnQoeG1sOiBYbWxGaWxlLCB0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBwaWVjZXMgPSBleHRyYWN0SWN1UGxhY2Vob2xkZXJzKHRleHQpO1xuICAgIGNvbnN0IGxlbmd0aCA9IHBpZWNlcy5sZW5ndGggLSAxO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIHhtbC50ZXh0KHBpZWNlc1tpXSk7XG4gICAgICB0aGlzLnNlcmlhbGl6ZVBsYWNlaG9sZGVyKHhtbCwgcGllY2VzW2kgKyAxXSwgdW5kZWZpbmVkKTtcbiAgICB9XG4gICAgeG1sLnRleHQocGllY2VzW2xlbmd0aF0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVQbGFjZWhvbGRlcih4bWw6IFhtbEZpbGUsIGlkOiBzdHJpbmcsIHRleHQ6IHN0cmluZ3x1bmRlZmluZWQpOiB2b2lkIHtcbiAgICBjb25zdCBhdHRyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtpZH07XG4gICAgaWYgKHRleHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgYXR0cnNbJ2VxdWl2LXRleHQnXSA9IHRleHQ7XG4gICAgfVxuICAgIHhtbC5zdGFydFRhZygneCcsIGF0dHJzLCB7c2VsZkNsb3Npbmc6IHRydWV9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplTm90ZSh4bWw6IFhtbEZpbGUsIG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIHhtbC5zdGFydFRhZygnbm90ZScsIHtwcmlvcml0eTogJzEnLCBmcm9tOiBuYW1lfSwge3ByZXNlcnZlV2hpdGVzcGFjZTogdHJ1ZX0pO1xuICAgIHhtbC50ZXh0KHZhbHVlKTtcbiAgICB4bWwuZW5kVGFnKCdub3RlJywge3ByZXNlcnZlV2hpdGVzcGFjZTogZmFsc2V9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplTG9jYXRpb24oeG1sOiBYbWxGaWxlLCBsb2NhdGlvbjogybVTb3VyY2VMb2NhdGlvbik6IHZvaWQge1xuICAgIHhtbC5zdGFydFRhZygnY29udGV4dC1ncm91cCcsIHtwdXJwb3NlOiAnbG9jYXRpb24nfSk7XG4gICAgdGhpcy5yZW5kZXJDb250ZXh0KHhtbCwgJ3NvdXJjZWZpbGUnLCByZWxhdGl2ZSh0aGlzLmJhc2VQYXRoLCBsb2NhdGlvbi5maWxlKSk7XG4gICAgY29uc3QgZW5kTGluZVN0cmluZyA9IGxvY2F0aW9uLmVuZCAhPT0gdW5kZWZpbmVkICYmIGxvY2F0aW9uLmVuZC5saW5lICE9PSBsb2NhdGlvbi5zdGFydC5saW5lID9cbiAgICAgICAgYCwke2xvY2F0aW9uLmVuZC5saW5lICsgMX1gIDpcbiAgICAgICAgJyc7XG4gICAgdGhpcy5yZW5kZXJDb250ZXh0KHhtbCwgJ2xpbmVudW1iZXInLCBgJHtsb2NhdGlvbi5zdGFydC5saW5lICsgMX0ke2VuZExpbmVTdHJpbmd9YCk7XG4gICAgeG1sLmVuZFRhZygnY29udGV4dC1ncm91cCcpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJDb250ZXh0KHhtbDogWG1sRmlsZSwgdHlwZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgeG1sLnN0YXJ0VGFnKCdjb250ZXh0Jywgeydjb250ZXh0LXR5cGUnOiB0eXBlfSwge3ByZXNlcnZlV2hpdGVzcGFjZTogdHJ1ZX0pO1xuICAgIHhtbC50ZXh0KHZhbHVlKTtcbiAgICB4bWwuZW5kVGFnKCdjb250ZXh0Jywge3ByZXNlcnZlV2hpdGVzcGFjZTogZmFsc2V9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGlkIGZvciB0aGUgZ2l2ZW4gYG1lc3NhZ2VgLlxuICAgKlxuICAgKiBJZiB0aGVyZSB3YXMgYSBjdXN0b20gaWQgcHJvdmlkZWQsIHVzZSB0aGF0LlxuICAgKlxuICAgKiBJZiB3ZSBoYXZlIHJlcXVlc3RlZCBsZWdhY3kgbWVzc2FnZSBpZHMsIHRoZW4gdHJ5IHRvIHJldHVybiB0aGUgYXBwcm9wcmlhdGUgaWRcbiAgICogZnJvbSB0aGUgbGlzdCBvZiBsZWdhY3kgaWRzIHRoYXQgd2VyZSBleHRyYWN0ZWQuXG4gICAqXG4gICAqIE90aGVyd2lzZSByZXR1cm4gdGhlIGNhbm9uaWNhbCBtZXNzYWdlIGlkLlxuICAgKlxuICAgKiBBbiBYbGlmZiAxLjIgbGVnYWN5IG1lc3NhZ2UgaWQgaXMgYSBoZXggZW5jb2RlZCBTSEEtMSBzdHJpbmcsIHdoaWNoIGlzIDQwIGNoYXJhY3RlcnMgbG9uZy4gU2VlXG4gICAqIGh0dHBzOi8vY3NyYy5uaXN0Lmdvdi9jc3JjL21lZGlhL3B1YmxpY2F0aW9ucy9maXBzLzE4MC80L2ZpbmFsL2RvY3VtZW50cy9maXBzMTgwLTQtZHJhZnQtYXVnMjAxNC5wZGZcbiAgICovXG4gIHByaXZhdGUgZ2V0TWVzc2FnZUlkKG1lc3NhZ2U6IMm1UGFyc2VkTWVzc2FnZSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG1lc3NhZ2UuY3VzdG9tSWQgfHxcbiAgICAgICAgdGhpcy51c2VMZWdhY3lJZHMgJiYgbWVzc2FnZS5sZWdhY3lJZHMgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICBtZXNzYWdlLmxlZ2FjeUlkcy5maW5kKGlkID0+IGlkLmxlbmd0aCA9PT0gTEVHQUNZX1hMSUZGX01FU1NBR0VfTEVOR1RIKSB8fFxuICAgICAgICBtZXNzYWdlLmlkO1xuICB9XG59XG4iXX0=
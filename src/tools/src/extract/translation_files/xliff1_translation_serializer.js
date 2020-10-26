(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/extract/translation_files/xliff1_translation_serializer", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/localize/src/tools/src/extract/translation_files/format_options", "@angular/localize/src/tools/src/extract/translation_files/icu_parsing", "@angular/localize/src/tools/src/extract/translation_files/utils", "@angular/localize/src/tools/src/extract/translation_files/xml_file"], factory);
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
    var utils_1 = require("@angular/localize/src/tools/src/extract/translation_files/utils");
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
     * @publicApi used by CLI
     */
    var Xliff1TranslationSerializer = /** @class */ (function () {
        function Xliff1TranslationSerializer(sourceLocale, basePath, useLegacyIds, formatOptions, fs) {
            if (formatOptions === void 0) { formatOptions = {}; }
            if (fs === void 0) { fs = file_system_1.getFileSystem(); }
            this.sourceLocale = sourceLocale;
            this.basePath = basePath;
            this.useLegacyIds = useLegacyIds;
            this.formatOptions = formatOptions;
            this.fs = fs;
            format_options_1.validateOptions('Xliff1TranslationSerializer', [['xml:space', ['preserve']]], formatOptions);
        }
        Xliff1TranslationSerializer.prototype.serialize = function (messages) {
            var e_1, _a, e_2, _b;
            var _this = this;
            var messageMap = utils_1.consolidateMessages(messages, function (message) { return _this.getMessageId(message); });
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
                for (var _c = tslib_1.__values(messageMap.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var _e = tslib_1.__read(_d.value, 2), id = _e[0], duplicateMessages = _e[1];
                    var message = duplicateMessages[0];
                    xml.startTag('trans-unit', { id: id, datatype: 'html' });
                    xml.startTag('source', {}, { preserveWhitespace: true });
                    this.serializeMessage(xml, message);
                    xml.endTag('source', { preserveWhitespace: false });
                    try {
                        // Write all the locations
                        for (var _f = (e_2 = void 0, tslib_1.__values(duplicateMessages.filter(utils_1.hasLocation))), _g = _f.next(); !_g.done; _g = _f.next()) {
                            var location = _g.value.location;
                            this.serializeLocation(xml, location);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                        }
                        finally { if (e_2) throw e_2.error; }
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
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
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
            this.renderContext(xml, 'sourcefile', this.fs.relative(this.basePath, location.file));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYxX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2V4dHJhY3QvdHJhbnNsYXRpb25fZmlsZXMveGxpZmYxX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDJFQUFzRztJQUd0RywyR0FBZ0U7SUFDaEUscUdBQXFEO0lBRXJELHlGQUF5RDtJQUN6RCwrRkFBbUM7SUFFbkMsK0VBQStFO0lBQy9FLElBQU0sMkJBQTJCLEdBQUcsRUFBRSxDQUFDO0lBRXZDOzs7Ozs7OztPQVFHO0lBQ0g7UUFDRSxxQ0FDWSxZQUFvQixFQUFVLFFBQXdCLEVBQVUsWUFBcUIsRUFDckYsYUFBaUMsRUFBVSxFQUFnQztZQUEzRSw4QkFBQSxFQUFBLGtCQUFpQztZQUFVLG1CQUFBLEVBQUEsS0FBaUIsMkJBQWEsRUFBRTtZQUQzRSxpQkFBWSxHQUFaLFlBQVksQ0FBUTtZQUFVLGFBQVEsR0FBUixRQUFRLENBQWdCO1lBQVUsaUJBQVksR0FBWixZQUFZLENBQVM7WUFDckYsa0JBQWEsR0FBYixhQUFhLENBQW9CO1lBQVUsT0FBRSxHQUFGLEVBQUUsQ0FBOEI7WUFDckYsZ0NBQWUsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQy9GLENBQUM7UUFFRCwrQ0FBUyxHQUFULFVBQVUsUUFBMEI7O1lBQXBDLGlCQTJDQztZQTFDQyxJQUFNLFVBQVUsR0FBRywyQkFBbUIsQ0FBQyxRQUFRLEVBQUUsVUFBQSxPQUFPLElBQUksT0FBQSxLQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUExQixDQUEwQixDQUFDLENB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QUFDO1lBQ3BGLEdBQUcsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQUVPLG1EQUFhLEdBQXJCLFVBQXNCLEdBQVksRUFBRSxJQUFZLEVBQUUsS0FBYTtZQUM3RCxHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxFQUFDLGNBQWMsRUFBRSxJQUFJLEVBQUMsRUFBRSxFQUFDLGtCQUFrQixFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7WUFDNUUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQixHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxFQUFDLGtCQUFrQixFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDckQsQ0FBQztRQUVEOzs7Ozs7Ozs7Ozs7V0FZRztRQUNLLGtEQUFZLEdBQXBCLFVBQXFCLE9BQXVCO1lBQzFDLE9BQU8sT0FBTyxDQUFDLFFBQVE7Z0JBQ25CLElBQUksQ0FBQyxZQUFZLElBQUksT0FBTyxDQUFDLFNBQVMsS0FBSyxTQUFTO29CQUNwRCxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLEVBQUUsQ0FBQyxNQUFNLEtBQUssMkJBQTJCLEVBQXpDLENBQXlDLENBQUM7Z0JBQ3ZFLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDakIsQ0FBQztRQUNILGtDQUFDO0lBQUQsQ0FBQyxBQXpIRCxJQXlIQztJQXpIWSxrRUFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGgsIEZpbGVTeXN0ZW0sIGdldEZpbGVTeXN0ZW19IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHvJtVBhcnNlZE1lc3NhZ2UsIMm1U291cmNlTG9jYXRpb259IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcblxuaW1wb3J0IHtGb3JtYXRPcHRpb25zLCB2YWxpZGF0ZU9wdGlvbnN9IGZyb20gJy4vZm9ybWF0X29wdGlvbnMnO1xuaW1wb3J0IHtleHRyYWN0SWN1UGxhY2Vob2xkZXJzfSBmcm9tICcuL2ljdV9wYXJzaW5nJztcbmltcG9ydCB7VHJhbnNsYXRpb25TZXJpYWxpemVyfSBmcm9tICcuL3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtjb25zb2xpZGF0ZU1lc3NhZ2VzLCBoYXNMb2NhdGlvbn0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge1htbEZpbGV9IGZyb20gJy4veG1sX2ZpbGUnO1xuXG4vKiogVGhpcyBpcyB0aGUgbnVtYmVyIG9mIGNoYXJhY3RlcnMgdGhhdCBhIGxlZ2FjeSBYbGlmZiAxLjIgbWVzc2FnZSBpZCBoYXMuICovXG5jb25zdCBMRUdBQ1lfWExJRkZfTUVTU0FHRV9MRU5HVEggPSA0MDtcblxuLyoqXG4gKiBBIHRyYW5zbGF0aW9uIHNlcmlhbGl6ZXIgdGhhdCBjYW4gd3JpdGUgWExJRkYgMS4yIGZvcm1hdHRlZCBmaWxlcy5cbiAqXG4gKiBodHRwOi8vZG9jcy5vYXNpcy1vcGVuLm9yZy94bGlmZi92MS4yL29zL3hsaWZmLWNvcmUuaHRtbFxuICogaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcveGxpZmYvdjEuMi94bGlmZi1wcm9maWxlLWh0bWwveGxpZmYtcHJvZmlsZS1odG1sLTEuMi5odG1sXG4gKlxuICogQHNlZSBYbGlmZjFUcmFuc2xhdGlvblBhcnNlclxuICogQHB1YmxpY0FwaSB1c2VkIGJ5IENMSVxuICovXG5leHBvcnQgY2xhc3MgWGxpZmYxVHJhbnNsYXRpb25TZXJpYWxpemVyIGltcGxlbWVudHMgVHJhbnNsYXRpb25TZXJpYWxpemVyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHNvdXJjZUxvY2FsZTogc3RyaW5nLCBwcml2YXRlIGJhc2VQYXRoOiBBYnNvbHV0ZUZzUGF0aCwgcHJpdmF0ZSB1c2VMZWdhY3lJZHM6IGJvb2xlYW4sXG4gICAgICBwcml2YXRlIGZvcm1hdE9wdGlvbnM6IEZvcm1hdE9wdGlvbnMgPSB7fSwgcHJpdmF0ZSBmczogRmlsZVN5c3RlbSA9IGdldEZpbGVTeXN0ZW0oKSkge1xuICAgIHZhbGlkYXRlT3B0aW9ucygnWGxpZmYxVHJhbnNsYXRpb25TZXJpYWxpemVyJywgW1sneG1sOnNwYWNlJywgWydwcmVzZXJ2ZSddXV0sIGZvcm1hdE9wdGlvbnMpO1xuICB9XG5cbiAgc2VyaWFsaXplKG1lc3NhZ2VzOiDJtVBhcnNlZE1lc3NhZ2VbXSk6IHN0cmluZyB7XG4gICAgY29uc3QgbWVzc2FnZU1hcCA9IGNvbnNvbGlkYXRlTWVzc2FnZXMobWVzc2FnZXMsIG1lc3NhZ2UgPT4gdGhpcy5nZXRNZXNzYWdlSWQobWVzc2FnZSkpO1xuICAgIGNvbnN0IHhtbCA9IG5ldyBYbWxGaWxlKCk7XG4gICAgeG1sLnN0YXJ0VGFnKCd4bGlmZicsIHsndmVyc2lvbic6ICcxLjInLCAneG1sbnMnOiAndXJuOm9hc2lzOm5hbWVzOnRjOnhsaWZmOmRvY3VtZW50OjEuMid9KTtcbiAgICAvLyBOT1RFOiB0aGUgYG9yaWdpbmFsYCBwcm9wZXJ0eSBpcyBzZXQgdG8gdGhlIGxlZ2FjeSBgbmcyLnRlbXBsYXRlYCB2YWx1ZSBmb3IgYmFja3dhcmRcbiAgICAvLyBjb21wYXRpYmlsaXR5LlxuICAgIC8vIFdlIGNvdWxkIGNvbXB1dGUgdGhlIGZpbGUgZnJvbSB0aGUgYG1lc3NhZ2UubG9jYXRpb25gIHByb3BlcnR5LCBidXQgdGhlcmUgY291bGRcbiAgICAvLyBiZSBtdWx0aXBsZSB2YWx1ZXMgZm9yIHRoaXMgaW4gdGhlIGNvbGxlY3Rpb24gb2YgYG1lc3NhZ2VzYC4gSW4gdGhhdCBjYXNlIHdlIHdvdWxkIHByb2JhYmx5XG4gICAgLy8gbmVlZCB0byBjaGFuZ2UgdGhlIHNlcmlhbGl6ZXIgdG8gb3V0cHV0IGEgbmV3IGA8ZmlsZT5gIGVsZW1lbnQgZm9yIGVhY2ggY29sbGVjdGlvbiBvZlxuICAgIC8vIG1lc3NhZ2VzIHRoYXQgY29tZSBmcm9tIGEgcGFydGljdWxhciBvcmlnaW5hbCBmaWxlLCBhbmQgdGhlIHRyYW5zbGF0aW9uIGZpbGUgcGFyc2VycyBtYXkgbm90XG4gICAgLy8gYmUgYWJsZSB0byBjb3BlIHdpdGggdGhpcy5cbiAgICB4bWwuc3RhcnRUYWcoJ2ZpbGUnLCB7XG4gICAgICAnc291cmNlLWxhbmd1YWdlJzogdGhpcy5zb3VyY2VMb2NhbGUsXG4gICAgICAnZGF0YXR5cGUnOiAncGxhaW50ZXh0JyxcbiAgICAgICdvcmlnaW5hbCc6ICduZzIudGVtcGxhdGUnLFxuICAgICAgLi4udGhpcy5mb3JtYXRPcHRpb25zLFxuICAgIH0pO1xuICAgIHhtbC5zdGFydFRhZygnYm9keScpO1xuICAgIGZvciAoY29uc3QgW2lkLCBkdXBsaWNhdGVNZXNzYWdlc10gb2YgbWVzc2FnZU1hcC5lbnRyaWVzKCkpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBkdXBsaWNhdGVNZXNzYWdlc1swXTtcblxuICAgICAgeG1sLnN0YXJ0VGFnKCd0cmFucy11bml0Jywge2lkLCBkYXRhdHlwZTogJ2h0bWwnfSk7XG4gICAgICB4bWwuc3RhcnRUYWcoJ3NvdXJjZScsIHt9LCB7cHJlc2VydmVXaGl0ZXNwYWNlOiB0cnVlfSk7XG4gICAgICB0aGlzLnNlcmlhbGl6ZU1lc3NhZ2UoeG1sLCBtZXNzYWdlKTtcbiAgICAgIHhtbC5lbmRUYWcoJ3NvdXJjZScsIHtwcmVzZXJ2ZVdoaXRlc3BhY2U6IGZhbHNlfSk7XG5cbiAgICAgIC8vIFdyaXRlIGFsbCB0aGUgbG9jYXRpb25zXG4gICAgICBmb3IgKGNvbnN0IHtsb2NhdGlvbn0gb2YgZHVwbGljYXRlTWVzc2FnZXMuZmlsdGVyKGhhc0xvY2F0aW9uKSkge1xuICAgICAgICB0aGlzLnNlcmlhbGl6ZUxvY2F0aW9uKHhtbCwgbG9jYXRpb24pO1xuICAgICAgfVxuXG4gICAgICBpZiAobWVzc2FnZS5kZXNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLnNlcmlhbGl6ZU5vdGUoeG1sLCAnZGVzY3JpcHRpb24nLCBtZXNzYWdlLmRlc2NyaXB0aW9uKTtcbiAgICAgIH1cbiAgICAgIGlmIChtZXNzYWdlLm1lYW5pbmcpIHtcbiAgICAgICAgdGhpcy5zZXJpYWxpemVOb3RlKHhtbCwgJ21lYW5pbmcnLCBtZXNzYWdlLm1lYW5pbmcpO1xuICAgICAgfVxuICAgICAgeG1sLmVuZFRhZygndHJhbnMtdW5pdCcpO1xuICAgIH1cbiAgICB4bWwuZW5kVGFnKCdib2R5Jyk7XG4gICAgeG1sLmVuZFRhZygnZmlsZScpO1xuICAgIHhtbC5lbmRUYWcoJ3hsaWZmJyk7XG4gICAgcmV0dXJuIHhtbC50b1N0cmluZygpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVNZXNzYWdlKHhtbDogWG1sRmlsZSwgbWVzc2FnZTogybVQYXJzZWRNZXNzYWdlKTogdm9pZCB7XG4gICAgY29uc3QgbGVuZ3RoID0gbWVzc2FnZS5tZXNzYWdlUGFydHMubGVuZ3RoIC0gMTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLnNlcmlhbGl6ZVRleHRQYXJ0KHhtbCwgbWVzc2FnZS5tZXNzYWdlUGFydHNbaV0pO1xuICAgICAgY29uc3QgbG9jYXRpb24gPSBtZXNzYWdlLnN1YnN0aXR1dGlvbkxvY2F0aW9ucz8uW21lc3NhZ2UucGxhY2Vob2xkZXJOYW1lc1tpXV07XG4gICAgICB0aGlzLnNlcmlhbGl6ZVBsYWNlaG9sZGVyKHhtbCwgbWVzc2FnZS5wbGFjZWhvbGRlck5hbWVzW2ldLCBsb2NhdGlvbj8udGV4dCk7XG4gICAgfVxuICAgIHRoaXMuc2VyaWFsaXplVGV4dFBhcnQoeG1sLCBtZXNzYWdlLm1lc3NhZ2VQYXJ0c1tsZW5ndGhdKTtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplVGV4dFBhcnQoeG1sOiBYbWxGaWxlLCB0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBwaWVjZXMgPSBleHRyYWN0SWN1UGxhY2Vob2xkZXJzKHRleHQpO1xuICAgIGNvbnN0IGxlbmd0aCA9IHBpZWNlcy5sZW5ndGggLSAxO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIHhtbC50ZXh0KHBpZWNlc1tpXSk7XG4gICAgICB0aGlzLnNlcmlhbGl6ZVBsYWNlaG9sZGVyKHhtbCwgcGllY2VzW2kgKyAxXSwgdW5kZWZpbmVkKTtcbiAgICB9XG4gICAgeG1sLnRleHQocGllY2VzW2xlbmd0aF0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVQbGFjZWhvbGRlcih4bWw6IFhtbEZpbGUsIGlkOiBzdHJpbmcsIHRleHQ6IHN0cmluZ3x1bmRlZmluZWQpOiB2b2lkIHtcbiAgICBjb25zdCBhdHRyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtpZH07XG4gICAgaWYgKHRleHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgYXR0cnNbJ2VxdWl2LXRleHQnXSA9IHRleHQ7XG4gICAgfVxuICAgIHhtbC5zdGFydFRhZygneCcsIGF0dHJzLCB7c2VsZkNsb3Npbmc6IHRydWV9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplTm90ZSh4bWw6IFhtbEZpbGUsIG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIHhtbC5zdGFydFRhZygnbm90ZScsIHtwcmlvcml0eTogJzEnLCBmcm9tOiBuYW1lfSwge3ByZXNlcnZlV2hpdGVzcGFjZTogdHJ1ZX0pO1xuICAgIHhtbC50ZXh0KHZhbHVlKTtcbiAgICB4bWwuZW5kVGFnKCdub3RlJywge3ByZXNlcnZlV2hpdGVzcGFjZTogZmFsc2V9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplTG9jYXRpb24oeG1sOiBYbWxGaWxlLCBsb2NhdGlvbjogybVTb3VyY2VMb2NhdGlvbik6IHZvaWQge1xuICAgIHhtbC5zdGFydFRhZygnY29udGV4dC1ncm91cCcsIHtwdXJwb3NlOiAnbG9jYXRpb24nfSk7XG4gICAgdGhpcy5yZW5kZXJDb250ZXh0KHhtbCwgJ3NvdXJjZWZpbGUnLCB0aGlzLmZzLnJlbGF0aXZlKHRoaXMuYmFzZVBhdGgsIGxvY2F0aW9uLmZpbGUpKTtcbiAgICBjb25zdCBlbmRMaW5lU3RyaW5nID0gbG9jYXRpb24uZW5kICE9PSB1bmRlZmluZWQgJiYgbG9jYXRpb24uZW5kLmxpbmUgIT09IGxvY2F0aW9uLnN0YXJ0LmxpbmUgP1xuICAgICAgICBgLCR7bG9jYXRpb24uZW5kLmxpbmUgKyAxfWAgOlxuICAgICAgICAnJztcbiAgICB0aGlzLnJlbmRlckNvbnRleHQoeG1sLCAnbGluZW51bWJlcicsIGAke2xvY2F0aW9uLnN0YXJ0LmxpbmUgKyAxfSR7ZW5kTGluZVN0cmluZ31gKTtcbiAgICB4bWwuZW5kVGFnKCdjb250ZXh0LWdyb3VwJyk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckNvbnRleHQoeG1sOiBYbWxGaWxlLCB0eXBlOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB4bWwuc3RhcnRUYWcoJ2NvbnRleHQnLCB7J2NvbnRleHQtdHlwZSc6IHR5cGV9LCB7cHJlc2VydmVXaGl0ZXNwYWNlOiB0cnVlfSk7XG4gICAgeG1sLnRleHQodmFsdWUpO1xuICAgIHhtbC5lbmRUYWcoJ2NvbnRleHQnLCB7cHJlc2VydmVXaGl0ZXNwYWNlOiBmYWxzZX0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgaWQgZm9yIHRoZSBnaXZlbiBgbWVzc2FnZWAuXG4gICAqXG4gICAqIElmIHRoZXJlIHdhcyBhIGN1c3RvbSBpZCBwcm92aWRlZCwgdXNlIHRoYXQuXG4gICAqXG4gICAqIElmIHdlIGhhdmUgcmVxdWVzdGVkIGxlZ2FjeSBtZXNzYWdlIGlkcywgdGhlbiB0cnkgdG8gcmV0dXJuIHRoZSBhcHByb3ByaWF0ZSBpZFxuICAgKiBmcm9tIHRoZSBsaXN0IG9mIGxlZ2FjeSBpZHMgdGhhdCB3ZXJlIGV4dHJhY3RlZC5cbiAgICpcbiAgICogT3RoZXJ3aXNlIHJldHVybiB0aGUgY2Fub25pY2FsIG1lc3NhZ2UgaWQuXG4gICAqXG4gICAqIEFuIFhsaWZmIDEuMiBsZWdhY3kgbWVzc2FnZSBpZCBpcyBhIGhleCBlbmNvZGVkIFNIQS0xIHN0cmluZywgd2hpY2ggaXMgNDAgY2hhcmFjdGVycyBsb25nLiBTZWVcbiAgICogaHR0cHM6Ly9jc3JjLm5pc3QuZ292L2NzcmMvbWVkaWEvcHVibGljYXRpb25zL2ZpcHMvMTgwLzQvZmluYWwvZG9jdW1lbnRzL2ZpcHMxODAtNC1kcmFmdC1hdWcyMDE0LnBkZlxuICAgKi9cbiAgcHJpdmF0ZSBnZXRNZXNzYWdlSWQobWVzc2FnZTogybVQYXJzZWRNZXNzYWdlKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbWVzc2FnZS5jdXN0b21JZCB8fFxuICAgICAgICB0aGlzLnVzZUxlZ2FjeUlkcyAmJiBtZXNzYWdlLmxlZ2FjeUlkcyAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIG1lc3NhZ2UubGVnYWN5SWRzLmZpbmQoaWQgPT4gaWQubGVuZ3RoID09PSBMRUdBQ1lfWExJRkZfTUVTU0FHRV9MRU5HVEgpIHx8XG4gICAgICAgIG1lc3NhZ2UuaWQ7XG4gIH1cbn1cbiJdfQ==
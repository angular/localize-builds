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
     * https://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html
     * https://docs.oasis-open.org/xliff/v1.2/xliff-profile-html/xliff-profile-html-1.2.html
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
            var ctype = getCtypeForPlaceholder(id);
            if (ctype !== null) {
                attrs.ctype = ctype;
            }
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
    /**
     * Compute the value of the `ctype` attribute from the `placeholder` name.
     *
     * The placeholder can take the following forms:
     *
     * - `START_BOLD_TEXT`/`END_BOLD_TEXT`
     * - `TAG_<ELEMENT_NAME>`
     * - `START_TAG_<ELEMENT_NAME>`
     * - `CLOSE_TAG_<ELEMENT_NAME>`
     *
     * In these cases the element name of the tag is extracted from the placeholder name and returned as
     * `x-<element_name>`.
     *
     * Line breaks and images are special cases.
     */
    function getCtypeForPlaceholder(placeholder) {
        var tag = placeholder.replace(/^(START_|CLOSE_)/, '');
        switch (tag) {
            case 'LINE_BREAK':
                return 'lb';
            case 'TAG_IMG':
                return 'image';
            default:
                var element = tag.startsWith('TAG_') ?
                    tag.replace(/^TAG_(.+)/, function (_, tagName) { return tagName.toLowerCase(); }) :
                    TAG_MAP[tag];
                if (element === undefined) {
                    return null;
                }
                return "x-" + element;
        }
    }
    var TAG_MAP = {
        'LINK': 'a',
        'BOLD_TEXT': 'b',
        'EMPHASISED_TEXT': 'em',
        'HEADING_LEVEL1': 'h1',
        'HEADING_LEVEL2': 'h2',
        'HEADING_LEVEL3': 'h3',
        'HEADING_LEVEL4': 'h4',
        'HEADING_LEVEL5': 'h5',
        'HEADING_LEVEL6': 'h6',
        'HORIZONTAL_RULE': 'hr',
        'ITALIC_TEXT': 'i',
        'LIST_ITEM': 'li',
        'MEDIA_LINK': 'link',
        'ORDERED_LIST': 'ol',
        'PARAGRAPH': 'p',
        'QUOTATION': 'q',
        'STRIKETHROUGH_TEXT': 's',
        'SMALL_TEXT': 'small',
        'SUBSTRIPT': 'sub',
        'SUPERSCRIPT': 'sup',
        'TABLE_BODY': 'tbody',
        'TABLE_CELL': 'td',
        'TABLE_FOOTER': 'tfoot',
        'TABLE_HEADER_CELL': 'th',
        'TABLE_HEADER': 'thead',
        'TABLE_ROW': 'tr',
        'MONOSPACED_TEXT': 'tt',
        'UNDERLINED_TEXT': 'u',
        'UNORDERED_LIST': 'ul',
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYxX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2V4dHJhY3QvdHJhbnNsYXRpb25fZmlsZXMveGxpZmYxX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDJFQUFzRztJQUd0RywyR0FBZ0U7SUFDaEUscUdBQXFEO0lBRXJELHlGQUF5RDtJQUN6RCwrRkFBbUM7SUFFbkMsK0VBQStFO0lBQy9FLElBQU0sMkJBQTJCLEdBQUcsRUFBRSxDQUFDO0lBRXZDOzs7Ozs7OztPQVFHO0lBQ0g7UUFDRSxxQ0FDWSxZQUFvQixFQUFVLFFBQXdCLEVBQVUsWUFBcUIsRUFDckYsYUFBaUMsRUFBVSxFQUFnQztZQUEzRSw4QkFBQSxFQUFBLGtCQUFpQztZQUFVLG1CQUFBLEVBQUEsS0FBaUIsMkJBQWEsRUFBRTtZQUQzRSxpQkFBWSxHQUFaLFlBQVksQ0FBUTtZQUFVLGFBQVEsR0FBUixRQUFRLENBQWdCO1lBQVUsaUJBQVksR0FBWixZQUFZLENBQVM7WUFDckYsa0JBQWEsR0FBYixhQUFhLENBQW9CO1lBQVUsT0FBRSxHQUFGLEVBQUUsQ0FBOEI7WUFDckYsZ0NBQWUsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQy9GLENBQUM7UUFFRCwrQ0FBUyxHQUFULFVBQVUsUUFBMEI7O1lBQXBDLGlCQTJDQztZQTFDQyxJQUFNLFVBQVUsR0FBRywyQkFBbUIsQ0FBQyxRQUFRLEVBQUUsVUFBQSxPQUFPLElBQUksT0FBQSxLQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUExQixDQUEwQixDQUFDLENB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LGNBQWMsRUFBRSxPQUFPO1FBQ3ZCLG1CQUFtQixFQUFFLElBQUk7UUFDekIsY0FBYyxFQUFFLE9BQU87UUFDdkIsV0FBVyxFQUFFLElBQUk7UUFDakIsaUJBQWlCLEVBQUUsSUFBSTtRQUN2QixpQkFBaUIsRUFBRSxHQUFHO1FBQ3RCLGdCQUFnQixFQUFFLElBQUk7S0FDdkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aCwgRmlsZVN5c3RlbSwgZ2V0RmlsZVN5c3RlbX0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQge8m1UGFyc2VkTWVzc2FnZSwgybVTb3VyY2VMb2NhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuXG5pbXBvcnQge0Zvcm1hdE9wdGlvbnMsIHZhbGlkYXRlT3B0aW9uc30gZnJvbSAnLi9mb3JtYXRfb3B0aW9ucyc7XG5pbXBvcnQge2V4dHJhY3RJY3VQbGFjZWhvbGRlcnN9IGZyb20gJy4vaWN1X3BhcnNpbmcnO1xuaW1wb3J0IHtUcmFuc2xhdGlvblNlcmlhbGl6ZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fc2VyaWFsaXplcic7XG5pbXBvcnQge2NvbnNvbGlkYXRlTWVzc2FnZXMsIGhhc0xvY2F0aW9ufSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7WG1sRmlsZX0gZnJvbSAnLi94bWxfZmlsZSc7XG5cbi8qKiBUaGlzIGlzIHRoZSBudW1iZXIgb2YgY2hhcmFjdGVycyB0aGF0IGEgbGVnYWN5IFhsaWZmIDEuMiBtZXNzYWdlIGlkIGhhcy4gKi9cbmNvbnN0IExFR0FDWV9YTElGRl9NRVNTQUdFX0xFTkdUSCA9IDQwO1xuXG4vKipcbiAqIEEgdHJhbnNsYXRpb24gc2VyaWFsaXplciB0aGF0IGNhbiB3cml0ZSBYTElGRiAxLjIgZm9ybWF0dGVkIGZpbGVzLlxuICpcbiAqIGh0dHBzOi8vZG9jcy5vYXNpcy1vcGVuLm9yZy94bGlmZi92MS4yL29zL3hsaWZmLWNvcmUuaHRtbFxuICogaHR0cHM6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL3hsaWZmL3YxLjIveGxpZmYtcHJvZmlsZS1odG1sL3hsaWZmLXByb2ZpbGUtaHRtbC0xLjIuaHRtbFxuICpcbiAqIEBzZWUgWGxpZmYxVHJhbnNsYXRpb25QYXJzZXJcbiAqIEBwdWJsaWNBcGkgdXNlZCBieSBDTElcbiAqL1xuZXhwb3J0IGNsYXNzIFhsaWZmMVRyYW5zbGF0aW9uU2VyaWFsaXplciBpbXBsZW1lbnRzIFRyYW5zbGF0aW9uU2VyaWFsaXplciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBzb3VyY2VMb2NhbGU6IHN0cmluZywgcHJpdmF0ZSBiYXNlUGF0aDogQWJzb2x1dGVGc1BhdGgsIHByaXZhdGUgdXNlTGVnYWN5SWRzOiBib29sZWFuLFxuICAgICAgcHJpdmF0ZSBmb3JtYXRPcHRpb25zOiBGb3JtYXRPcHRpb25zID0ge30sIHByaXZhdGUgZnM6IEZpbGVTeXN0ZW0gPSBnZXRGaWxlU3lzdGVtKCkpIHtcbiAgICB2YWxpZGF0ZU9wdGlvbnMoJ1hsaWZmMVRyYW5zbGF0aW9uU2VyaWFsaXplcicsIFtbJ3htbDpzcGFjZScsIFsncHJlc2VydmUnXV1dLCBmb3JtYXRPcHRpb25zKTtcbiAgfVxuXG4gIHNlcmlhbGl6ZShtZXNzYWdlczogybVQYXJzZWRNZXNzYWdlW10pOiBzdHJpbmcge1xuICAgIGNvbnN0IG1lc3NhZ2VNYXAgPSBjb25zb2xpZGF0ZU1lc3NhZ2VzKG1lc3NhZ2VzLCBtZXNzYWdlID0+IHRoaXMuZ2V0TWVzc2FnZUlkKG1lc3NhZ2UpKTtcbiAgICBjb25zdCB4bWwgPSBuZXcgWG1sRmlsZSgpO1xuICAgIHhtbC5zdGFydFRhZygneGxpZmYnLCB7J3ZlcnNpb24nOiAnMS4yJywgJ3htbG5zJzogJ3VybjpvYXNpczpuYW1lczp0Yzp4bGlmZjpkb2N1bWVudDoxLjInfSk7XG4gICAgLy8gTk9URTogdGhlIGBvcmlnaW5hbGAgcHJvcGVydHkgaXMgc2V0IHRvIHRoZSBsZWdhY3kgYG5nMi50ZW1wbGF0ZWAgdmFsdWUgZm9yIGJhY2t3YXJkXG4gICAgLy8gY29tcGF0aWJpbGl0eS5cbiAgICAvLyBXZSBjb3VsZCBjb21wdXRlIHRoZSBmaWxlIGZyb20gdGhlIGBtZXNzYWdlLmxvY2F0aW9uYCBwcm9wZXJ0eSwgYnV0IHRoZXJlIGNvdWxkXG4gICAgLy8gYmUgbXVsdGlwbGUgdmFsdWVzIGZvciB0aGlzIGluIHRoZSBjb2xsZWN0aW9uIG9mIGBtZXNzYWdlc2AuIEluIHRoYXQgY2FzZSB3ZSB3b3VsZCBwcm9iYWJseVxuICAgIC8vIG5lZWQgdG8gY2hhbmdlIHRoZSBzZXJpYWxpemVyIHRvIG91dHB1dCBhIG5ldyBgPGZpbGU+YCBlbGVtZW50IGZvciBlYWNoIGNvbGxlY3Rpb24gb2ZcbiAgICAvLyBtZXNzYWdlcyB0aGF0IGNvbWUgZnJvbSBhIHBhcnRpY3VsYXIgb3JpZ2luYWwgZmlsZSwgYW5kIHRoZSB0cmFuc2xhdGlvbiBmaWxlIHBhcnNlcnMgbWF5IG5vdFxuICAgIC8vIGJlIGFibGUgdG8gY29wZSB3aXRoIHRoaXMuXG4gICAgeG1sLnN0YXJ0VGFnKCdmaWxlJywge1xuICAgICAgJ3NvdXJjZS1sYW5ndWFnZSc6IHRoaXMuc291cmNlTG9jYWxlLFxuICAgICAgJ2RhdGF0eXBlJzogJ3BsYWludGV4dCcsXG4gICAgICAnb3JpZ2luYWwnOiAnbmcyLnRlbXBsYXRlJyxcbiAgICAgIC4uLnRoaXMuZm9ybWF0T3B0aW9ucyxcbiAgICB9KTtcbiAgICB4bWwuc3RhcnRUYWcoJ2JvZHknKTtcbiAgICBmb3IgKGNvbnN0IFtpZCwgZHVwbGljYXRlTWVzc2FnZXNdIG9mIG1lc3NhZ2VNYXAuZW50cmllcygpKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gZHVwbGljYXRlTWVzc2FnZXNbMF07XG5cbiAgICAgIHhtbC5zdGFydFRhZygndHJhbnMtdW5pdCcsIHtpZCwgZGF0YXR5cGU6ICdodG1sJ30pO1xuICAgICAgeG1sLnN0YXJ0VGFnKCdzb3VyY2UnLCB7fSwge3ByZXNlcnZlV2hpdGVzcGFjZTogdHJ1ZX0pO1xuICAgICAgdGhpcy5zZXJpYWxpemVNZXNzYWdlKHhtbCwgbWVzc2FnZSk7XG4gICAgICB4bWwuZW5kVGFnKCdzb3VyY2UnLCB7cHJlc2VydmVXaGl0ZXNwYWNlOiBmYWxzZX0pO1xuXG4gICAgICAvLyBXcml0ZSBhbGwgdGhlIGxvY2F0aW9uc1xuICAgICAgZm9yIChjb25zdCB7bG9jYXRpb259IG9mIGR1cGxpY2F0ZU1lc3NhZ2VzLmZpbHRlcihoYXNMb2NhdGlvbikpIHtcbiAgICAgICAgdGhpcy5zZXJpYWxpemVMb2NhdGlvbih4bWwsIGxvY2F0aW9uKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1lc3NhZ2UuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgdGhpcy5zZXJpYWxpemVOb3RlKHhtbCwgJ2Rlc2NyaXB0aW9uJywgbWVzc2FnZS5kZXNjcmlwdGlvbik7XG4gICAgICB9XG4gICAgICBpZiAobWVzc2FnZS5tZWFuaW5nKSB7XG4gICAgICAgIHRoaXMuc2VyaWFsaXplTm90ZSh4bWwsICdtZWFuaW5nJywgbWVzc2FnZS5tZWFuaW5nKTtcbiAgICAgIH1cbiAgICAgIHhtbC5lbmRUYWcoJ3RyYW5zLXVuaXQnKTtcbiAgICB9XG4gICAgeG1sLmVuZFRhZygnYm9keScpO1xuICAgIHhtbC5lbmRUYWcoJ2ZpbGUnKTtcbiAgICB4bWwuZW5kVGFnKCd4bGlmZicpO1xuICAgIHJldHVybiB4bWwudG9TdHJpbmcoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplTWVzc2FnZSh4bWw6IFhtbEZpbGUsIG1lc3NhZ2U6IMm1UGFyc2VkTWVzc2FnZSk6IHZvaWQge1xuICAgIGNvbnN0IGxlbmd0aCA9IG1lc3NhZ2UubWVzc2FnZVBhcnRzLmxlbmd0aCAtIDE7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5zZXJpYWxpemVUZXh0UGFydCh4bWwsIG1lc3NhZ2UubWVzc2FnZVBhcnRzW2ldKTtcbiAgICAgIGNvbnN0IGxvY2F0aW9uID0gbWVzc2FnZS5zdWJzdGl0dXRpb25Mb2NhdGlvbnM/LlttZXNzYWdlLnBsYWNlaG9sZGVyTmFtZXNbaV1dO1xuICAgICAgdGhpcy5zZXJpYWxpemVQbGFjZWhvbGRlcih4bWwsIG1lc3NhZ2UucGxhY2Vob2xkZXJOYW1lc1tpXSwgbG9jYXRpb24/LnRleHQpO1xuICAgIH1cbiAgICB0aGlzLnNlcmlhbGl6ZVRleHRQYXJ0KHhtbCwgbWVzc2FnZS5tZXNzYWdlUGFydHNbbGVuZ3RoXSk7XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZVRleHRQYXJ0KHhtbDogWG1sRmlsZSwgdGV4dDogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgcGllY2VzID0gZXh0cmFjdEljdVBsYWNlaG9sZGVycyh0ZXh0KTtcbiAgICBjb25zdCBsZW5ndGggPSBwaWVjZXMubGVuZ3RoIC0gMTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAyKSB7XG4gICAgICB4bWwudGV4dChwaWVjZXNbaV0pO1xuICAgICAgdGhpcy5zZXJpYWxpemVQbGFjZWhvbGRlcih4bWwsIHBpZWNlc1tpICsgMV0sIHVuZGVmaW5lZCk7XG4gICAgfVxuICAgIHhtbC50ZXh0KHBpZWNlc1tsZW5ndGhdKTtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplUGxhY2Vob2xkZXIoeG1sOiBYbWxGaWxlLCBpZDogc3RyaW5nLCB0ZXh0OiBzdHJpbmd8dW5kZWZpbmVkKTogdm9pZCB7XG4gICAgY29uc3QgYXR0cnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7aWR9O1xuICAgIGNvbnN0IGN0eXBlID0gZ2V0Q3R5cGVGb3JQbGFjZWhvbGRlcihpZCk7XG4gICAgaWYgKGN0eXBlICE9PSBudWxsKSB7XG4gICAgICBhdHRycy5jdHlwZSA9IGN0eXBlO1xuICAgIH1cbiAgICBpZiAodGV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhdHRyc1snZXF1aXYtdGV4dCddID0gdGV4dDtcbiAgICB9XG4gICAgeG1sLnN0YXJ0VGFnKCd4JywgYXR0cnMsIHtzZWxmQ2xvc2luZzogdHJ1ZX0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVOb3RlKHhtbDogWG1sRmlsZSwgbmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgeG1sLnN0YXJ0VGFnKCdub3RlJywge3ByaW9yaXR5OiAnMScsIGZyb206IG5hbWV9LCB7cHJlc2VydmVXaGl0ZXNwYWNlOiB0cnVlfSk7XG4gICAgeG1sLnRleHQodmFsdWUpO1xuICAgIHhtbC5lbmRUYWcoJ25vdGUnLCB7cHJlc2VydmVXaGl0ZXNwYWNlOiBmYWxzZX0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVMb2NhdGlvbih4bWw6IFhtbEZpbGUsIGxvY2F0aW9uOiDJtVNvdXJjZUxvY2F0aW9uKTogdm9pZCB7XG4gICAgeG1sLnN0YXJ0VGFnKCdjb250ZXh0LWdyb3VwJywge3B1cnBvc2U6ICdsb2NhdGlvbid9KTtcbiAgICB0aGlzLnJlbmRlckNvbnRleHQoeG1sLCAnc291cmNlZmlsZScsIHRoaXMuZnMucmVsYXRpdmUodGhpcy5iYXNlUGF0aCwgbG9jYXRpb24uZmlsZSkpO1xuICAgIGNvbnN0IGVuZExpbmVTdHJpbmcgPSBsb2NhdGlvbi5lbmQgIT09IHVuZGVmaW5lZCAmJiBsb2NhdGlvbi5lbmQubGluZSAhPT0gbG9jYXRpb24uc3RhcnQubGluZSA/XG4gICAgICAgIGAsJHtsb2NhdGlvbi5lbmQubGluZSArIDF9YCA6XG4gICAgICAgICcnO1xuICAgIHRoaXMucmVuZGVyQ29udGV4dCh4bWwsICdsaW5lbnVtYmVyJywgYCR7bG9jYXRpb24uc3RhcnQubGluZSArIDF9JHtlbmRMaW5lU3RyaW5nfWApO1xuICAgIHhtbC5lbmRUYWcoJ2NvbnRleHQtZ3JvdXAnKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyQ29udGV4dCh4bWw6IFhtbEZpbGUsIHR5cGU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIHhtbC5zdGFydFRhZygnY29udGV4dCcsIHsnY29udGV4dC10eXBlJzogdHlwZX0sIHtwcmVzZXJ2ZVdoaXRlc3BhY2U6IHRydWV9KTtcbiAgICB4bWwudGV4dCh2YWx1ZSk7XG4gICAgeG1sLmVuZFRhZygnY29udGV4dCcsIHtwcmVzZXJ2ZVdoaXRlc3BhY2U6IGZhbHNlfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBpZCBmb3IgdGhlIGdpdmVuIGBtZXNzYWdlYC5cbiAgICpcbiAgICogSWYgdGhlcmUgd2FzIGEgY3VzdG9tIGlkIHByb3ZpZGVkLCB1c2UgdGhhdC5cbiAgICpcbiAgICogSWYgd2UgaGF2ZSByZXF1ZXN0ZWQgbGVnYWN5IG1lc3NhZ2UgaWRzLCB0aGVuIHRyeSB0byByZXR1cm4gdGhlIGFwcHJvcHJpYXRlIGlkXG4gICAqIGZyb20gdGhlIGxpc3Qgb2YgbGVnYWN5IGlkcyB0aGF0IHdlcmUgZXh0cmFjdGVkLlxuICAgKlxuICAgKiBPdGhlcndpc2UgcmV0dXJuIHRoZSBjYW5vbmljYWwgbWVzc2FnZSBpZC5cbiAgICpcbiAgICogQW4gWGxpZmYgMS4yIGxlZ2FjeSBtZXNzYWdlIGlkIGlzIGEgaGV4IGVuY29kZWQgU0hBLTEgc3RyaW5nLCB3aGljaCBpcyA0MCBjaGFyYWN0ZXJzIGxvbmcuIFNlZVxuICAgKiBodHRwczovL2NzcmMubmlzdC5nb3YvY3NyYy9tZWRpYS9wdWJsaWNhdGlvbnMvZmlwcy8xODAvNC9maW5hbC9kb2N1bWVudHMvZmlwczE4MC00LWRyYWZ0LWF1ZzIwMTQucGRmXG4gICAqL1xuICBwcml2YXRlIGdldE1lc3NhZ2VJZChtZXNzYWdlOiDJtVBhcnNlZE1lc3NhZ2UpOiBzdHJpbmcge1xuICAgIHJldHVybiBtZXNzYWdlLmN1c3RvbUlkIHx8XG4gICAgICAgIHRoaXMudXNlTGVnYWN5SWRzICYmIG1lc3NhZ2UubGVnYWN5SWRzICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgbWVzc2FnZS5sZWdhY3lJZHMuZmluZChpZCA9PiBpZC5sZW5ndGggPT09IExFR0FDWV9YTElGRl9NRVNTQUdFX0xFTkdUSCkgfHxcbiAgICAgICAgbWVzc2FnZS5pZDtcbiAgfVxufVxuXG4vKipcbiAqIENvbXB1dGUgdGhlIHZhbHVlIG9mIHRoZSBgY3R5cGVgIGF0dHJpYnV0ZSBmcm9tIHRoZSBgcGxhY2Vob2xkZXJgIG5hbWUuXG4gKlxuICogVGhlIHBsYWNlaG9sZGVyIGNhbiB0YWtlIHRoZSBmb2xsb3dpbmcgZm9ybXM6XG4gKlxuICogLSBgU1RBUlRfQk9MRF9URVhUYC9gRU5EX0JPTERfVEVYVGBcbiAqIC0gYFRBR188RUxFTUVOVF9OQU1FPmBcbiAqIC0gYFNUQVJUX1RBR188RUxFTUVOVF9OQU1FPmBcbiAqIC0gYENMT1NFX1RBR188RUxFTUVOVF9OQU1FPmBcbiAqXG4gKiBJbiB0aGVzZSBjYXNlcyB0aGUgZWxlbWVudCBuYW1lIG9mIHRoZSB0YWcgaXMgZXh0cmFjdGVkIGZyb20gdGhlIHBsYWNlaG9sZGVyIG5hbWUgYW5kIHJldHVybmVkIGFzXG4gKiBgeC08ZWxlbWVudF9uYW1lPmAuXG4gKlxuICogTGluZSBicmVha3MgYW5kIGltYWdlcyBhcmUgc3BlY2lhbCBjYXNlcy5cbiAqL1xuZnVuY3Rpb24gZ2V0Q3R5cGVGb3JQbGFjZWhvbGRlcihwbGFjZWhvbGRlcjogc3RyaW5nKTogc3RyaW5nfG51bGwge1xuICBjb25zdCB0YWcgPSBwbGFjZWhvbGRlci5yZXBsYWNlKC9eKFNUQVJUX3xDTE9TRV8pLywgJycpO1xuICBzd2l0Y2ggKHRhZykge1xuICAgIGNhc2UgJ0xJTkVfQlJFQUsnOlxuICAgICAgcmV0dXJuICdsYic7XG4gICAgY2FzZSAnVEFHX0lNRyc6XG4gICAgICByZXR1cm4gJ2ltYWdlJztcbiAgICBkZWZhdWx0OlxuICAgICAgY29uc3QgZWxlbWVudCA9IHRhZy5zdGFydHNXaXRoKCdUQUdfJykgP1xuICAgICAgICAgIHRhZy5yZXBsYWNlKC9eVEFHXyguKykvLCAoXywgdGFnTmFtZTogc3RyaW5nKSA9PiB0YWdOYW1lLnRvTG93ZXJDYXNlKCkpIDpcbiAgICAgICAgICBUQUdfTUFQW3RhZ107XG4gICAgICBpZiAoZWxlbWVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGB4LSR7ZWxlbWVudH1gO1xuICB9XG59XG5cbmNvbnN0IFRBR19NQVA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICdMSU5LJzogJ2EnLFxuICAnQk9MRF9URVhUJzogJ2InLFxuICAnRU1QSEFTSVNFRF9URVhUJzogJ2VtJyxcbiAgJ0hFQURJTkdfTEVWRUwxJzogJ2gxJyxcbiAgJ0hFQURJTkdfTEVWRUwyJzogJ2gyJyxcbiAgJ0hFQURJTkdfTEVWRUwzJzogJ2gzJyxcbiAgJ0hFQURJTkdfTEVWRUw0JzogJ2g0JyxcbiAgJ0hFQURJTkdfTEVWRUw1JzogJ2g1JyxcbiAgJ0hFQURJTkdfTEVWRUw2JzogJ2g2JyxcbiAgJ0hPUklaT05UQUxfUlVMRSc6ICdocicsXG4gICdJVEFMSUNfVEVYVCc6ICdpJyxcbiAgJ0xJU1RfSVRFTSc6ICdsaScsXG4gICdNRURJQV9MSU5LJzogJ2xpbmsnLFxuICAnT1JERVJFRF9MSVNUJzogJ29sJyxcbiAgJ1BBUkFHUkFQSCc6ICdwJyxcbiAgJ1FVT1RBVElPTic6ICdxJyxcbiAgJ1NUUklLRVRIUk9VR0hfVEVYVCc6ICdzJyxcbiAgJ1NNQUxMX1RFWFQnOiAnc21hbGwnLFxuICAnU1VCU1RSSVBUJzogJ3N1YicsXG4gICdTVVBFUlNDUklQVCc6ICdzdXAnLFxuICAnVEFCTEVfQk9EWSc6ICd0Ym9keScsXG4gICdUQUJMRV9DRUxMJzogJ3RkJyxcbiAgJ1RBQkxFX0ZPT1RFUic6ICd0Zm9vdCcsXG4gICdUQUJMRV9IRUFERVJfQ0VMTCc6ICd0aCcsXG4gICdUQUJMRV9IRUFERVInOiAndGhlYWQnLFxuICAnVEFCTEVfUk9XJzogJ3RyJyxcbiAgJ01PTk9TUEFDRURfVEVYVCc6ICd0dCcsXG4gICdVTkRFUkxJTkVEX1RFWFQnOiAndScsXG4gICdVTk9SREVSRURfTElTVCc6ICd1bCcsXG59O1xuIl19
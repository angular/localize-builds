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
     * https://docs.oasis-open.org/xliff/xliff-core/v2.0/os/xliff-core-v2.0-os.html
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
                var type = getTypeForPlaceholder(placeholderName);
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
                var attrs = {
                    id: "" + this.currentPlaceholderId++,
                    equiv: placeholderName,
                };
                var type = getTypeForPlaceholder(placeholderName);
                if (type !== null) {
                    attrs.type = type;
                }
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
    /**
     * Compute the value of the `type` attribute from the `placeholder` name.
     *
     * If the tag is not known but starts with `TAG_`, `START_TAG_` or `CLOSE_TAG_` then the type is
     * `other`. Certain formatting tags (e.g. bold, italic, etc) have type `fmt`. Line-breaks, images
     * and links are special cases.
     */
    function getTypeForPlaceholder(placeholder) {
        var tag = placeholder.replace(/^(START_|CLOSE_)/, '');
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYyX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2V4dHJhY3QvdHJhbnNsYXRpb25fZmlsZXMveGxpZmYyX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDJFQUE0RztJQUc1RywyR0FBZ0U7SUFDaEUscUdBQXFEO0lBRXJELHlGQUF5RDtJQUN6RCwrRkFBbUM7SUFFbkMsaUdBQWlHO0lBQ2pHLElBQU0saUNBQWlDLEdBQUcsRUFBRSxDQUFDO0lBRTdDOzs7Ozs7O09BT0c7SUFDSDtRQUVFLHFDQUNZLFlBQW9CLEVBQVUsUUFBd0IsRUFBVSxZQUFxQixFQUNyRixhQUFpQyxFQUFVLEVBQXNDO1lBQWpGLDhCQUFBLEVBQUEsa0JBQWlDO1lBQVUsbUJBQUEsRUFBQSxLQUF1QiwyQkFBYSxFQUFFO1lBRGpGLGlCQUFZLEdBQVosWUFBWSxDQUFRO1lBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBZ0I7WUFBVSxpQkFBWSxHQUFaLFlBQVksQ0FBUztZQUNyRixrQkFBYSxHQUFiLGFBQWEsQ0FBb0I7WUFBVSxPQUFFLEdBQUYsRUFBRSxDQUFvQztZQUhyRix5QkFBb0IsR0FBRyxDQUFDLENBQUM7WUFJL0IsZ0NBQWUsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQy9GLENBQUM7UUFFRCwrQ0FBUyxHQUFULFVBQVUsUUFBMEI7O1lBQXBDLGlCQW1EQztZQWxEQyxJQUFNLFVBQVUsR0FBRywyQkFBbUIsQ0FBQyxRQUFRLEVBQUUsVUFBQSxPQUFPLElBQUksT0FBQSxLQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUExQixDQUEwQixDQUFDLENBQUM7WUFDeEYsSUFBTSxHQUFHLEdBQUcsSUFBSSxrQkFBTyxFQUFFLENBQUM7WUFDMUIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3BCLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixPQUFPLEVBQUUsdUNBQXVDO2dCQUNoRCxTQUFTLEVBQUUsSUFBSSxDQUFDLFlBQVk7YUFDN0IsQ0FBQyxDQUFDO1lBQ0gsc0ZBQXNGO1lBQ3RGLGlCQUFpQjtZQUNqQixrRkFBa0Y7WUFDbEYsOEZBQThGO1lBQzlGLHdGQUF3RjtZQUN4RiwyRkFBMkY7WUFDM0YsTUFBTTtZQUNOLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxxQkFBRyxJQUFJLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxhQUFhLElBQUssSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDOztnQkFDekYsS0FBc0MsSUFBQSxLQUFBLGlCQUFBLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQSxnQkFBQSw0QkFBRTtvQkFBakQsSUFBQSxLQUFBLDJCQUF1QixFQUF0QixFQUFFLFFBQUEsRUFBRSxpQkFBaUIsUUFBQTtvQkFDL0IsSUFBTSxPQUFPLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRXJDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUMsRUFBRSxJQUFBLEVBQUMsQ0FBQyxDQUFDO29CQUMzQixJQUFNLHFCQUFxQixHQUFHLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxtQkFBVyxDQUFDLENBQUM7b0JBQ3BFLElBQUksT0FBTyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsV0FBVyxJQUFJLHFCQUFxQixDQUFDLE1BQU0sRUFBRTt3QkFDMUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7NEJBRXRCLDBCQUEwQjs0QkFDMUIsS0FBNkMsSUFBQSx5Q0FBQSxpQkFBQSxxQkFBcUIsQ0FBQSxDQUFBLDREQUFBLCtGQUFFO2dDQUF4RCxJQUFBLDZDQUE0QixFQUFqQixJQUFJLFVBQUEsRUFBRSxLQUFLLFdBQUEsRUFBRSxHQUFHLFNBQUE7Z0NBQ3JDLElBQU0sYUFBYSxHQUNmLEdBQUcsS0FBSyxTQUFTLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFJLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQ0FDM0UsSUFBSSxDQUFDLGFBQWEsQ0FDZCxHQUFHLEVBQUUsVUFBVSxFQUNaLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQUksS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUcsYUFBZSxDQUFDLENBQUM7NkJBQ25GOzs7Ozs7Ozs7d0JBRUQsSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFOzRCQUN2QixJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxhQUFhLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO3lCQUM3RDt3QkFDRCxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7NEJBQ25CLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7eUJBQ3JEO3dCQUNELEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7cUJBQ3JCO29CQUNELEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ3hCLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFDLGtCQUFrQixFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7b0JBQ3ZELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7b0JBQ3BDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUMsa0JBQWtCLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztvQkFDbEQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDdEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDcEI7Ozs7Ozs7OztZQUNELEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbkIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwQixPQUFPLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN4QixDQUFDO1FBRU8sc0RBQWdCLEdBQXhCLFVBQXlCLEdBQVksRUFBRSxPQUF1QjtZQUM1RCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxDQUFDO1lBQzlCLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUMvQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUMvQixJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckQsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7YUFDNUY7WUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM1RCxDQUFDO1FBRU8sdURBQWlCLEdBQXpCLFVBQTBCLEdBQVksRUFBRSxJQUFZO1lBQ2xELElBQU0sTUFBTSxHQUFHLG9DQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVDLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ2pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDbEMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEIsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQzFEO1lBQ0QsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMzQixDQUFDO1FBRU8sMERBQW9CLEdBQTVCLFVBQ0ksR0FBWSxFQUFFLGVBQXVCLEVBQ3JDLHFCQUEwRTs7WUFDNUUsSUFBTSxJQUFJLFNBQUcscUJBQXFCLGFBQXJCLHFCQUFxQix1QkFBckIscUJBQXFCLENBQUcsZUFBZSwyQ0FBRyxJQUFJLENBQUM7WUFFNUQsSUFBSSxlQUFlLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUN4QyxJQUFNLHNCQUFzQixHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUMxRSxJQUFNLFdBQVcsU0FBRyxxQkFBcUIsYUFBckIscUJBQXFCLHVCQUFyQixxQkFBcUIsQ0FBRyxzQkFBc0IsMkNBQUcsSUFBSSxDQUFDO2dCQUMxRSxJQUFNLEtBQUssR0FBMkI7b0JBQ3BDLEVBQUUsRUFBRSxLQUFHLElBQUksQ0FBQyxvQkFBb0IsRUFBSTtvQkFDcEMsVUFBVSxFQUFFLGVBQWU7b0JBQzNCLFFBQVEsRUFBRSxzQkFBc0I7aUJBQ2pDLENBQUM7Z0JBQ0YsSUFBTSxJQUFJLEdBQUcscUJBQXFCLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQ3BELElBQUksSUFBSSxLQUFLLElBQUksRUFBRTtvQkFDakIsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7aUJBQ25CO2dCQUNELElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtvQkFDdEIsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7aUJBQ3hCO2dCQUNELElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTtvQkFDN0IsS0FBSyxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUM7aUJBQzdCO2dCQUNELEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQzNCO2lCQUFNLElBQUksZUFBZSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDL0MsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNsQjtpQkFBTTtnQkFDTCxJQUFNLEtBQUssR0FBMkI7b0JBQ3BDLEVBQUUsRUFBRSxLQUFHLElBQUksQ0FBQyxvQkFBb0IsRUFBSTtvQkFDcEMsS0FBSyxFQUFFLGVBQWU7aUJBQ3ZCLENBQUM7Z0JBQ0YsSUFBTSxJQUFJLEdBQUcscUJBQXFCLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQ3BELElBQUksSUFBSSxLQUFLLElBQUksRUFBRTtvQkFDakIsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7aUJBQ25CO2dCQUNELElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtvQkFDdEIsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7aUJBQ25CO2dCQUNELEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO2FBQ2hEO1FBQ0gsQ0FBQztRQUVPLG1EQUFhLEdBQXJCLFVBQXNCLEdBQVksRUFBRSxJQUFZLEVBQUUsS0FBYTtZQUM3RCxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsRUFBRSxFQUFDLGtCQUFrQixFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7WUFDbkUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFDLGtCQUFrQixFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUVEOzs7Ozs7Ozs7Ozs7O1dBYUc7UUFDSyxrREFBWSxHQUFwQixVQUFxQixPQUF1QjtZQUMxQyxPQUFPLE9BQU8sQ0FBQyxRQUFRO2dCQUNuQixJQUFJLENBQUMsWUFBWSxJQUFJLE9BQU8sQ0FBQyxTQUFTLEtBQUssU0FBUztvQkFDcEQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQ2xCLFVBQUEsRUFBRSxJQUFJLE9BQUEsRUFBRSxDQUFDLE1BQU0sSUFBSSxpQ0FBaUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQXBFLENBQW9FLENBQUM7Z0JBQy9FLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDakIsQ0FBQztRQUNILGtDQUFDO0lBQUQsQ0FBQyxBQXRKRCxJQXNKQztJQXRKWSxrRUFBMkI7SUF3SnhDOzs7Ozs7T0FNRztJQUNILFNBQVMscUJBQXFCLENBQUMsV0FBbUI7UUFDaEQsSUFBTSxHQUFHLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN4RCxRQUFRLEdBQUcsRUFBRTtZQUNYLEtBQUssV0FBVyxDQUFDO1lBQ2pCLEtBQUssaUJBQWlCLENBQUM7WUFDdkIsS0FBSyxhQUFhLENBQUM7WUFDbkIsS0FBSyxZQUFZLENBQUM7WUFDbEIsS0FBSyxvQkFBb0IsQ0FBQztZQUMxQixLQUFLLGlCQUFpQjtnQkFDcEIsT0FBTyxLQUFLLENBQUM7WUFDZixLQUFLLFNBQVM7Z0JBQ1osT0FBTyxPQUFPLENBQUM7WUFDakIsS0FBSyxNQUFNO2dCQUNULE9BQU8sTUFBTSxDQUFDO1lBQ2hCO2dCQUNFLE9BQU8sa0JBQWtCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztTQUNoRTtJQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGgsIGdldEZpbGVTeXN0ZW0sIFBhdGhNYW5pcHVsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHvJtVBhcnNlZE1lc3NhZ2UsIMm1U291cmNlTG9jYXRpb259IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcblxuaW1wb3J0IHtGb3JtYXRPcHRpb25zLCB2YWxpZGF0ZU9wdGlvbnN9IGZyb20gJy4vZm9ybWF0X29wdGlvbnMnO1xuaW1wb3J0IHtleHRyYWN0SWN1UGxhY2Vob2xkZXJzfSBmcm9tICcuL2ljdV9wYXJzaW5nJztcbmltcG9ydCB7VHJhbnNsYXRpb25TZXJpYWxpemVyfSBmcm9tICcuL3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtjb25zb2xpZGF0ZU1lc3NhZ2VzLCBoYXNMb2NhdGlvbn0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge1htbEZpbGV9IGZyb20gJy4veG1sX2ZpbGUnO1xuXG4vKiogVGhpcyBpcyB0aGUgbWF4aW11bSBudW1iZXIgb2YgY2hhcmFjdGVycyB0aGF0IGNhbiBhcHBlYXIgaW4gYSBsZWdhY3kgWExJRkYgMi4wIG1lc3NhZ2UgaWQuICovXG5jb25zdCBNQVhfTEVHQUNZX1hMSUZGXzJfTUVTU0FHRV9MRU5HVEggPSAyMDtcblxuLyoqXG4gKiBBIHRyYW5zbGF0aW9uIHNlcmlhbGl6ZXIgdGhhdCBjYW4gd3JpdGUgdHJhbnNsYXRpb25zIGluIFhMSUZGIDIgZm9ybWF0LlxuICpcbiAqIGh0dHBzOi8vZG9jcy5vYXNpcy1vcGVuLm9yZy94bGlmZi94bGlmZi1jb3JlL3YyLjAvb3MveGxpZmYtY29yZS12Mi4wLW9zLmh0bWxcbiAqXG4gKiBAc2VlIFhsaWZmMlRyYW5zbGF0aW9uUGFyc2VyXG4gKiBAcHVibGljQXBpIHVzZWQgYnkgQ0xJXG4gKi9cbmV4cG9ydCBjbGFzcyBYbGlmZjJUcmFuc2xhdGlvblNlcmlhbGl6ZXIgaW1wbGVtZW50cyBUcmFuc2xhdGlvblNlcmlhbGl6ZXIge1xuICBwcml2YXRlIGN1cnJlbnRQbGFjZWhvbGRlcklkID0gMDtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHNvdXJjZUxvY2FsZTogc3RyaW5nLCBwcml2YXRlIGJhc2VQYXRoOiBBYnNvbHV0ZUZzUGF0aCwgcHJpdmF0ZSB1c2VMZWdhY3lJZHM6IGJvb2xlYW4sXG4gICAgICBwcml2YXRlIGZvcm1hdE9wdGlvbnM6IEZvcm1hdE9wdGlvbnMgPSB7fSwgcHJpdmF0ZSBmczogUGF0aE1hbmlwdWxhdGlvbiA9IGdldEZpbGVTeXN0ZW0oKSkge1xuICAgIHZhbGlkYXRlT3B0aW9ucygnWGxpZmYxVHJhbnNsYXRpb25TZXJpYWxpemVyJywgW1sneG1sOnNwYWNlJywgWydwcmVzZXJ2ZSddXV0sIGZvcm1hdE9wdGlvbnMpO1xuICB9XG5cbiAgc2VyaWFsaXplKG1lc3NhZ2VzOiDJtVBhcnNlZE1lc3NhZ2VbXSk6IHN0cmluZyB7XG4gICAgY29uc3QgbWVzc2FnZU1hcCA9IGNvbnNvbGlkYXRlTWVzc2FnZXMobWVzc2FnZXMsIG1lc3NhZ2UgPT4gdGhpcy5nZXRNZXNzYWdlSWQobWVzc2FnZSkpO1xuICAgIGNvbnN0IHhtbCA9IG5ldyBYbWxGaWxlKCk7XG4gICAgeG1sLnN0YXJ0VGFnKCd4bGlmZicsIHtcbiAgICAgICd2ZXJzaW9uJzogJzIuMCcsXG4gICAgICAneG1sbnMnOiAndXJuOm9hc2lzOm5hbWVzOnRjOnhsaWZmOmRvY3VtZW50OjIuMCcsXG4gICAgICAnc3JjTGFuZyc6IHRoaXMuc291cmNlTG9jYWxlXG4gICAgfSk7XG4gICAgLy8gTk9URTogdGhlIGBvcmlnaW5hbGAgcHJvcGVydHkgaXMgc2V0IHRvIHRoZSBsZWdhY3kgYG5nLnRlbXBsYXRlYCB2YWx1ZSBmb3IgYmFja3dhcmRcbiAgICAvLyBjb21wYXRpYmlsaXR5LlxuICAgIC8vIFdlIGNvdWxkIGNvbXB1dGUgdGhlIGZpbGUgZnJvbSB0aGUgYG1lc3NhZ2UubG9jYXRpb25gIHByb3BlcnR5LCBidXQgdGhlcmUgY291bGRcbiAgICAvLyBiZSBtdWx0aXBsZSB2YWx1ZXMgZm9yIHRoaXMgaW4gdGhlIGNvbGxlY3Rpb24gb2YgYG1lc3NhZ2VzYC4gSW4gdGhhdCBjYXNlIHdlIHdvdWxkIHByb2JhYmx5XG4gICAgLy8gbmVlZCB0byBjaGFuZ2UgdGhlIHNlcmlhbGl6ZXIgdG8gb3V0cHV0IGEgbmV3IGA8ZmlsZT5gIGVsZW1lbnQgZm9yIGVhY2ggY29sbGVjdGlvbiBvZlxuICAgIC8vIG1lc3NhZ2VzIHRoYXQgY29tZSBmcm9tIGEgcGFydGljdWxhciBvcmlnaW5hbCBmaWxlLCBhbmQgdGhlIHRyYW5zbGF0aW9uIGZpbGUgcGFyc2VycyBtYXlcbiAgICAvLyBub3RcbiAgICB4bWwuc3RhcnRUYWcoJ2ZpbGUnLCB7J2lkJzogJ25naTE4bicsICdvcmlnaW5hbCc6ICduZy50ZW1wbGF0ZScsIC4uLnRoaXMuZm9ybWF0T3B0aW9uc30pO1xuICAgIGZvciAoY29uc3QgW2lkLCBkdXBsaWNhdGVNZXNzYWdlc10gb2YgbWVzc2FnZU1hcC5lbnRyaWVzKCkpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBkdXBsaWNhdGVNZXNzYWdlc1swXTtcblxuICAgICAgeG1sLnN0YXJ0VGFnKCd1bml0Jywge2lkfSk7XG4gICAgICBjb25zdCBtZXNzYWdlc1dpdGhMb2NhdGlvbnMgPSBkdXBsaWNhdGVNZXNzYWdlcy5maWx0ZXIoaGFzTG9jYXRpb24pO1xuICAgICAgaWYgKG1lc3NhZ2UubWVhbmluZyB8fCBtZXNzYWdlLmRlc2NyaXB0aW9uIHx8IG1lc3NhZ2VzV2l0aExvY2F0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgeG1sLnN0YXJ0VGFnKCdub3RlcycpO1xuXG4gICAgICAgIC8vIFdyaXRlIGFsbCB0aGUgbG9jYXRpb25zXG4gICAgICAgIGZvciAoY29uc3Qge2xvY2F0aW9uOiB7ZmlsZSwgc3RhcnQsIGVuZH19IG9mIG1lc3NhZ2VzV2l0aExvY2F0aW9ucykge1xuICAgICAgICAgIGNvbnN0IGVuZExpbmVTdHJpbmcgPVxuICAgICAgICAgICAgICBlbmQgIT09IHVuZGVmaW5lZCAmJiBlbmQubGluZSAhPT0gc3RhcnQubGluZSA/IGAsJHtlbmQubGluZSArIDF9YCA6ICcnO1xuICAgICAgICAgIHRoaXMuc2VyaWFsaXplTm90ZShcbiAgICAgICAgICAgICAgeG1sLCAnbG9jYXRpb24nLFxuICAgICAgICAgICAgICBgJHt0aGlzLmZzLnJlbGF0aXZlKHRoaXMuYmFzZVBhdGgsIGZpbGUpfToke3N0YXJ0LmxpbmUgKyAxfSR7ZW5kTGluZVN0cmluZ31gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZXNzYWdlLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgdGhpcy5zZXJpYWxpemVOb3RlKHhtbCwgJ2Rlc2NyaXB0aW9uJywgbWVzc2FnZS5kZXNjcmlwdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1lc3NhZ2UubWVhbmluZykge1xuICAgICAgICAgIHRoaXMuc2VyaWFsaXplTm90ZSh4bWwsICdtZWFuaW5nJywgbWVzc2FnZS5tZWFuaW5nKTtcbiAgICAgICAgfVxuICAgICAgICB4bWwuZW5kVGFnKCdub3RlcycpO1xuICAgICAgfVxuICAgICAgeG1sLnN0YXJ0VGFnKCdzZWdtZW50Jyk7XG4gICAgICB4bWwuc3RhcnRUYWcoJ3NvdXJjZScsIHt9LCB7cHJlc2VydmVXaGl0ZXNwYWNlOiB0cnVlfSk7XG4gICAgICB0aGlzLnNlcmlhbGl6ZU1lc3NhZ2UoeG1sLCBtZXNzYWdlKTtcbiAgICAgIHhtbC5lbmRUYWcoJ3NvdXJjZScsIHtwcmVzZXJ2ZVdoaXRlc3BhY2U6IGZhbHNlfSk7XG4gICAgICB4bWwuZW5kVGFnKCdzZWdtZW50Jyk7XG4gICAgICB4bWwuZW5kVGFnKCd1bml0Jyk7XG4gICAgfVxuICAgIHhtbC5lbmRUYWcoJ2ZpbGUnKTtcbiAgICB4bWwuZW5kVGFnKCd4bGlmZicpO1xuICAgIHJldHVybiB4bWwudG9TdHJpbmcoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplTWVzc2FnZSh4bWw6IFhtbEZpbGUsIG1lc3NhZ2U6IMm1UGFyc2VkTWVzc2FnZSk6IHZvaWQge1xuICAgIHRoaXMuY3VycmVudFBsYWNlaG9sZGVySWQgPSAwO1xuICAgIGNvbnN0IGxlbmd0aCA9IG1lc3NhZ2UubWVzc2FnZVBhcnRzLmxlbmd0aCAtIDE7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5zZXJpYWxpemVUZXh0UGFydCh4bWwsIG1lc3NhZ2UubWVzc2FnZVBhcnRzW2ldKTtcbiAgICAgIHRoaXMuc2VyaWFsaXplUGxhY2Vob2xkZXIoeG1sLCBtZXNzYWdlLnBsYWNlaG9sZGVyTmFtZXNbaV0sIG1lc3NhZ2Uuc3Vic3RpdHV0aW9uTG9jYXRpb25zKTtcbiAgICB9XG4gICAgdGhpcy5zZXJpYWxpemVUZXh0UGFydCh4bWwsIG1lc3NhZ2UubWVzc2FnZVBhcnRzW2xlbmd0aF0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVUZXh0UGFydCh4bWw6IFhtbEZpbGUsIHRleHQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHBpZWNlcyA9IGV4dHJhY3RJY3VQbGFjZWhvbGRlcnModGV4dCk7XG4gICAgY29uc3QgbGVuZ3RoID0gcGllY2VzLmxlbmd0aCAtIDE7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMikge1xuICAgICAgeG1sLnRleHQocGllY2VzW2ldKTtcbiAgICAgIHRoaXMuc2VyaWFsaXplUGxhY2Vob2xkZXIoeG1sLCBwaWVjZXNbaSArIDFdLCB1bmRlZmluZWQpO1xuICAgIH1cbiAgICB4bWwudGV4dChwaWVjZXNbbGVuZ3RoXSk7XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZVBsYWNlaG9sZGVyKFxuICAgICAgeG1sOiBYbWxGaWxlLCBwbGFjZWhvbGRlck5hbWU6IHN0cmluZyxcbiAgICAgIHN1YnN0aXR1dGlvbkxvY2F0aW9uczogUmVjb3JkPHN0cmluZywgybVTb3VyY2VMb2NhdGlvbnx1bmRlZmluZWQ+fHVuZGVmaW5lZCk6IHZvaWQge1xuICAgIGNvbnN0IHRleHQgPSBzdWJzdGl0dXRpb25Mb2NhdGlvbnM/LltwbGFjZWhvbGRlck5hbWVdPy50ZXh0O1xuXG4gICAgaWYgKHBsYWNlaG9sZGVyTmFtZS5zdGFydHNXaXRoKCdTVEFSVF8nKSkge1xuICAgICAgY29uc3QgY2xvc2luZ1BsYWNlaG9sZGVyTmFtZSA9IHBsYWNlaG9sZGVyTmFtZS5yZXBsYWNlKC9eU1RBUlQvLCAnQ0xPU0UnKTtcbiAgICAgIGNvbnN0IGNsb3NpbmdUZXh0ID0gc3Vic3RpdHV0aW9uTG9jYXRpb25zPy5bY2xvc2luZ1BsYWNlaG9sZGVyTmFtZV0/LnRleHQ7XG4gICAgICBjb25zdCBhdHRyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAgICAgaWQ6IGAke3RoaXMuY3VycmVudFBsYWNlaG9sZGVySWQrK31gLFxuICAgICAgICBlcXVpdlN0YXJ0OiBwbGFjZWhvbGRlck5hbWUsXG4gICAgICAgIGVxdWl2RW5kOiBjbG9zaW5nUGxhY2Vob2xkZXJOYW1lLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IHR5cGUgPSBnZXRUeXBlRm9yUGxhY2Vob2xkZXIocGxhY2Vob2xkZXJOYW1lKTtcbiAgICAgIGlmICh0eXBlICE9PSBudWxsKSB7XG4gICAgICAgIGF0dHJzLnR5cGUgPSB0eXBlO1xuICAgICAgfVxuICAgICAgaWYgKHRleHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBhdHRycy5kaXNwU3RhcnQgPSB0ZXh0O1xuICAgICAgfVxuICAgICAgaWYgKGNsb3NpbmdUZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYXR0cnMuZGlzcEVuZCA9IGNsb3NpbmdUZXh0O1xuICAgICAgfVxuICAgICAgeG1sLnN0YXJ0VGFnKCdwYycsIGF0dHJzKTtcbiAgICB9IGVsc2UgaWYgKHBsYWNlaG9sZGVyTmFtZS5zdGFydHNXaXRoKCdDTE9TRV8nKSkge1xuICAgICAgeG1sLmVuZFRhZygncGMnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYXR0cnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgICAgIGlkOiBgJHt0aGlzLmN1cnJlbnRQbGFjZWhvbGRlcklkKyt9YCxcbiAgICAgICAgZXF1aXY6IHBsYWNlaG9sZGVyTmFtZSxcbiAgICAgIH07XG4gICAgICBjb25zdCB0eXBlID0gZ2V0VHlwZUZvclBsYWNlaG9sZGVyKHBsYWNlaG9sZGVyTmFtZSk7XG4gICAgICBpZiAodHlwZSAhPT0gbnVsbCkge1xuICAgICAgICBhdHRycy50eXBlID0gdHlwZTtcbiAgICAgIH1cbiAgICAgIGlmICh0ZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYXR0cnMuZGlzcCA9IHRleHQ7XG4gICAgICB9XG4gICAgICB4bWwuc3RhcnRUYWcoJ3BoJywgYXR0cnMsIHtzZWxmQ2xvc2luZzogdHJ1ZX0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplTm90ZSh4bWw6IFhtbEZpbGUsIG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIHhtbC5zdGFydFRhZygnbm90ZScsIHtjYXRlZ29yeTogbmFtZX0sIHtwcmVzZXJ2ZVdoaXRlc3BhY2U6IHRydWV9KTtcbiAgICB4bWwudGV4dCh2YWx1ZSk7XG4gICAgeG1sLmVuZFRhZygnbm90ZScsIHtwcmVzZXJ2ZVdoaXRlc3BhY2U6IGZhbHNlfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBpZCBmb3IgdGhlIGdpdmVuIGBtZXNzYWdlYC5cbiAgICpcbiAgICogSWYgdGhlcmUgd2FzIGEgY3VzdG9tIGlkIHByb3ZpZGVkLCB1c2UgdGhhdC5cbiAgICpcbiAgICogSWYgd2UgaGF2ZSByZXF1ZXN0ZWQgbGVnYWN5IG1lc3NhZ2UgaWRzLCB0aGVuIHRyeSB0byByZXR1cm4gdGhlIGFwcHJvcHJpYXRlIGlkXG4gICAqIGZyb20gdGhlIGxpc3Qgb2YgbGVnYWN5IGlkcyB0aGF0IHdlcmUgZXh0cmFjdGVkLlxuICAgKlxuICAgKiBPdGhlcndpc2UgcmV0dXJuIHRoZSBjYW5vbmljYWwgbWVzc2FnZSBpZC5cbiAgICpcbiAgICogQW4gWGxpZmYgMi4wIGxlZ2FjeSBtZXNzYWdlIGlkIGlzIGEgNjQgYml0IG51bWJlciBlbmNvZGVkIGFzIGEgZGVjaW1hbCBzdHJpbmcsIHdoaWNoIHdpbGwgaGF2ZVxuICAgKiBhdCBtb3N0IDIwIGRpZ2l0cywgc2luY2UgMl42NS0xID0gMzYsODkzLDQ4OCwxNDcsNDE5LDEwMywyMzEuIFRoaXMgZGlnZXN0IGlzIGJhc2VkIG9uOlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2Nsb3N1cmUtY29tcGlsZXIvYmxvYi9tYXN0ZXIvc3JjL2NvbS9nb29nbGUvamF2YXNjcmlwdC9qc2NvbXAvR29vZ2xlSnNNZXNzYWdlSWRHZW5lcmF0b3IuamF2YVxuICAgKi9cbiAgcHJpdmF0ZSBnZXRNZXNzYWdlSWQobWVzc2FnZTogybVQYXJzZWRNZXNzYWdlKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbWVzc2FnZS5jdXN0b21JZCB8fFxuICAgICAgICB0aGlzLnVzZUxlZ2FjeUlkcyAmJiBtZXNzYWdlLmxlZ2FjeUlkcyAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIG1lc3NhZ2UubGVnYWN5SWRzLmZpbmQoXG4gICAgICAgICAgICBpZCA9PiBpZC5sZW5ndGggPD0gTUFYX0xFR0FDWV9YTElGRl8yX01FU1NBR0VfTEVOR1RIICYmICEvW14wLTldLy50ZXN0KGlkKSkgfHxcbiAgICAgICAgbWVzc2FnZS5pZDtcbiAgfVxufVxuXG4vKipcbiAqIENvbXB1dGUgdGhlIHZhbHVlIG9mIHRoZSBgdHlwZWAgYXR0cmlidXRlIGZyb20gdGhlIGBwbGFjZWhvbGRlcmAgbmFtZS5cbiAqXG4gKiBJZiB0aGUgdGFnIGlzIG5vdCBrbm93biBidXQgc3RhcnRzIHdpdGggYFRBR19gLCBgU1RBUlRfVEFHX2Agb3IgYENMT1NFX1RBR19gIHRoZW4gdGhlIHR5cGUgaXNcbiAqIGBvdGhlcmAuIENlcnRhaW4gZm9ybWF0dGluZyB0YWdzIChlLmcuIGJvbGQsIGl0YWxpYywgZXRjKSBoYXZlIHR5cGUgYGZtdGAuIExpbmUtYnJlYWtzLCBpbWFnZXNcbiAqIGFuZCBsaW5rcyBhcmUgc3BlY2lhbCBjYXNlcy5cbiAqL1xuZnVuY3Rpb24gZ2V0VHlwZUZvclBsYWNlaG9sZGVyKHBsYWNlaG9sZGVyOiBzdHJpbmcpOiBzdHJpbmd8bnVsbCB7XG4gIGNvbnN0IHRhZyA9IHBsYWNlaG9sZGVyLnJlcGxhY2UoL14oU1RBUlRffENMT1NFXykvLCAnJyk7XG4gIHN3aXRjaCAodGFnKSB7XG4gICAgY2FzZSAnQk9MRF9URVhUJzpcbiAgICBjYXNlICdFTVBIQVNJU0VEX1RFWFQnOlxuICAgIGNhc2UgJ0lUQUxJQ19URVhUJzpcbiAgICBjYXNlICdMSU5FX0JSRUFLJzpcbiAgICBjYXNlICdTVFJJS0VUSFJPVUdIX1RFWFQnOlxuICAgIGNhc2UgJ1VOREVSTElORURfVEVYVCc6XG4gICAgICByZXR1cm4gJ2ZtdCc7XG4gICAgY2FzZSAnVEFHX0lNRyc6XG4gICAgICByZXR1cm4gJ2ltYWdlJztcbiAgICBjYXNlICdMSU5LJzpcbiAgICAgIHJldHVybiAnbGluayc7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAvXihTVEFSVF98Q0xPU0VfKS8udGVzdChwbGFjZWhvbGRlcikgPyAnb3RoZXInIDogbnVsbDtcbiAgfVxufVxuIl19
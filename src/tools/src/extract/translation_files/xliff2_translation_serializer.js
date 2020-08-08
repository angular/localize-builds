(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/extract/translation_files/xliff2_translation_serializer", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/localize/src/tools/src/extract/translation_files/xml_file"], factory);
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
            xml.text(message.messageParts[0]);
            for (var i = 1; i < message.messageParts.length; i++) {
                var placeholderName = message.placeholderNames[i - 1];
                if (placeholderName.startsWith('START_')) {
                    xml.startTag('pc', {
                        id: "" + i,
                        equivStart: placeholderName,
                        equivEnd: placeholderName.replace(/^START/, 'CLOSE')
                    });
                }
                else if (placeholderName.startsWith('CLOSE_')) {
                    xml.endTag('pc');
                }
                else {
                    xml.startTag('ph', { id: "" + i, equiv: placeholderName }, { selfClosing: true });
                }
                xml.text(message.messageParts[i]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYyX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2V4dHJhY3QvdHJhbnNsYXRpb25fZmlsZXMveGxpZmYyX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDJFQUFxRjtJQUlyRiwrRkFBbUM7SUFFbkMsaUdBQWlHO0lBQ2pHLElBQU0saUNBQWlDLEdBQUcsRUFBRSxDQUFDO0lBRTdDOzs7Ozs7T0FNRztJQUNIO1FBQ0UscUNBQ1ksWUFBb0IsRUFBVSxRQUF3QixFQUN0RCxZQUFxQjtZQURyQixpQkFBWSxHQUFaLFlBQVksQ0FBUTtZQUFVLGFBQVEsR0FBUixRQUFRLENBQWdCO1lBQ3RELGlCQUFZLEdBQVosWUFBWSxDQUFTO1FBQUcsQ0FBQztRQUVyQywrQ0FBUyxHQUFULFVBQVUsUUFBMEI7O1lBQ2xDLElBQU0sR0FBRyxHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7WUFDOUIsSUFBTSxHQUFHLEdBQUcsSUFBSSxrQkFBTyxFQUFFLENBQUM7WUFDMUIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3BCLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixPQUFPLEVBQUUsdUNBQXVDO2dCQUNoRCxTQUFTLEVBQUUsSUFBSSxDQUFDLFlBQVk7YUFDN0IsQ0FBQyxDQUFDO1lBQ0gsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7Z0JBQ3JCLEtBQXNCLElBQUEsYUFBQSxpQkFBQSxRQUFRLENBQUEsa0NBQUEsd0RBQUU7b0JBQTNCLElBQU0sT0FBTyxxQkFBQTtvQkFDaEIsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDdEMs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QUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBcEUsQ0FBb0UsQ0FBQztnQkFDL0UsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUNqQixDQUFDO1FBQ0gsa0NBQUM7SUFBRCxDQUFDLEFBL0ZELElBK0ZDO0lBL0ZZLGtFQUEyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aCwgcmVsYXRpdmV9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHvJtVBhcnNlZE1lc3NhZ2V9IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcblxuaW1wb3J0IHtUcmFuc2xhdGlvblNlcmlhbGl6ZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fc2VyaWFsaXplcic7XG5pbXBvcnQge1htbEZpbGV9IGZyb20gJy4veG1sX2ZpbGUnO1xuXG4vKiogVGhpcyBpcyB0aGUgbWF4aW11bSBudW1iZXIgb2YgY2hhcmFjdGVycyB0aGF0IGNhbiBhcHBlYXIgaW4gYSBsZWdhY3kgWExJRkYgMi4wIG1lc3NhZ2UgaWQuICovXG5jb25zdCBNQVhfTEVHQUNZX1hMSUZGXzJfTUVTU0FHRV9MRU5HVEggPSAyMDtcblxuLyoqXG4gKiBBIHRyYW5zbGF0aW9uIHNlcmlhbGl6ZXIgdGhhdCBjYW4gd3JpdGUgdHJhbnNsYXRpb25zIGluIFhMSUZGIDIgZm9ybWF0LlxuICpcbiAqIGh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL3hsaWZmL3hsaWZmLWNvcmUvdjIuMC9vcy94bGlmZi1jb3JlLXYyLjAtb3MuaHRtbFxuICpcbiAqIEBzZWUgWGxpZmYyVHJhbnNsYXRpb25QYXJzZXJcbiAqL1xuZXhwb3J0IGNsYXNzIFhsaWZmMlRyYW5zbGF0aW9uU2VyaWFsaXplciBpbXBsZW1lbnRzIFRyYW5zbGF0aW9uU2VyaWFsaXplciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBzb3VyY2VMb2NhbGU6IHN0cmluZywgcHJpdmF0ZSBiYXNlUGF0aDogQWJzb2x1dGVGc1BhdGgsXG4gICAgICBwcml2YXRlIHVzZUxlZ2FjeUlkczogYm9vbGVhbikge31cblxuICBzZXJpYWxpemUobWVzc2FnZXM6IMm1UGFyc2VkTWVzc2FnZVtdKTogc3RyaW5nIHtcbiAgICBjb25zdCBpZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBjb25zdCB4bWwgPSBuZXcgWG1sRmlsZSgpO1xuICAgIHhtbC5zdGFydFRhZygneGxpZmYnLCB7XG4gICAgICAndmVyc2lvbic6ICcyLjAnLFxuICAgICAgJ3htbG5zJzogJ3VybjpvYXNpczpuYW1lczp0Yzp4bGlmZjpkb2N1bWVudDoyLjAnLFxuICAgICAgJ3NyY0xhbmcnOiB0aGlzLnNvdXJjZUxvY2FsZVxuICAgIH0pO1xuICAgIHhtbC5zdGFydFRhZygnZmlsZScpO1xuICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiBtZXNzYWdlcykge1xuICAgICAgY29uc3QgaWQgPSB0aGlzLmdldE1lc3NhZ2VJZChtZXNzYWdlKTtcbiAgICAgIGlmIChpZHMuaGFzKGlkKSkge1xuICAgICAgICAvLyBEbyBub3QgcmVuZGVyIHRoZSBzYW1lIG1lc3NhZ2UgbW9yZSB0aGFuIG9uY2VcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZHMuYWRkKGlkKTtcbiAgICAgIHhtbC5zdGFydFRhZygndW5pdCcsIHtpZH0pO1xuICAgICAgaWYgKG1lc3NhZ2UubWVhbmluZyB8fCBtZXNzYWdlLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHhtbC5zdGFydFRhZygnbm90ZXMnKTtcbiAgICAgICAgaWYgKG1lc3NhZ2UubG9jYXRpb24pIHtcbiAgICAgICAgICBjb25zdCB7ZmlsZSwgc3RhcnQsIGVuZH0gPSBtZXNzYWdlLmxvY2F0aW9uO1xuICAgICAgICAgIGNvbnN0IGVuZExpbmVTdHJpbmcgPVxuICAgICAgICAgICAgICBlbmQgIT09IHVuZGVmaW5lZCAmJiBlbmQubGluZSAhPT0gc3RhcnQubGluZSA/IGAsJHtlbmQubGluZSArIDF9YCA6ICcnO1xuICAgICAgICAgIHRoaXMuc2VyaWFsaXplTm90ZShcbiAgICAgICAgICAgICAgeG1sLCAnbG9jYXRpb24nLFxuICAgICAgICAgICAgICBgJHtyZWxhdGl2ZSh0aGlzLmJhc2VQYXRoLCBmaWxlKX06JHtzdGFydC5saW5lICsgMX0ke2VuZExpbmVTdHJpbmd9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1lc3NhZ2UuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICB0aGlzLnNlcmlhbGl6ZU5vdGUoeG1sLCAnZGVzY3JpcHRpb24nLCBtZXNzYWdlLmRlc2NyaXB0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWVzc2FnZS5tZWFuaW5nKSB7XG4gICAgICAgICAgdGhpcy5zZXJpYWxpemVOb3RlKHhtbCwgJ21lYW5pbmcnLCBtZXNzYWdlLm1lYW5pbmcpO1xuICAgICAgICB9XG4gICAgICAgIHhtbC5lbmRUYWcoJ25vdGVzJyk7XG4gICAgICB9XG4gICAgICB4bWwuc3RhcnRUYWcoJ3NlZ21lbnQnKTtcbiAgICAgIHhtbC5zdGFydFRhZygnc291cmNlJywge30sIHtwcmVzZXJ2ZVdoaXRlc3BhY2U6IHRydWV9KTtcbiAgICAgIHRoaXMuc2VyaWFsaXplTWVzc2FnZSh4bWwsIG1lc3NhZ2UpO1xuICAgICAgeG1sLmVuZFRhZygnc291cmNlJywge3ByZXNlcnZlV2hpdGVzcGFjZTogZmFsc2V9KTtcbiAgICAgIHhtbC5lbmRUYWcoJ3NlZ21lbnQnKTtcbiAgICAgIHhtbC5lbmRUYWcoJ3VuaXQnKTtcbiAgICB9XG4gICAgeG1sLmVuZFRhZygnZmlsZScpO1xuICAgIHhtbC5lbmRUYWcoJ3hsaWZmJyk7XG4gICAgcmV0dXJuIHhtbC50b1N0cmluZygpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVNZXNzYWdlKHhtbDogWG1sRmlsZSwgbWVzc2FnZTogybVQYXJzZWRNZXNzYWdlKTogdm9pZCB7XG4gICAgeG1sLnRleHQobWVzc2FnZS5tZXNzYWdlUGFydHNbMF0pO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbWVzc2FnZS5tZXNzYWdlUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHBsYWNlaG9sZGVyTmFtZSA9IG1lc3NhZ2UucGxhY2Vob2xkZXJOYW1lc1tpIC0gMV07XG4gICAgICBpZiAocGxhY2Vob2xkZXJOYW1lLnN0YXJ0c1dpdGgoJ1NUQVJUXycpKSB7XG4gICAgICAgIHhtbC5zdGFydFRhZygncGMnLCB7XG4gICAgICAgICAgaWQ6IGAke2l9YCxcbiAgICAgICAgICBlcXVpdlN0YXJ0OiBwbGFjZWhvbGRlck5hbWUsXG4gICAgICAgICAgZXF1aXZFbmQ6IHBsYWNlaG9sZGVyTmFtZS5yZXBsYWNlKC9eU1RBUlQvLCAnQ0xPU0UnKVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAocGxhY2Vob2xkZXJOYW1lLnN0YXJ0c1dpdGgoJ0NMT1NFXycpKSB7XG4gICAgICAgIHhtbC5lbmRUYWcoJ3BjJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB4bWwuc3RhcnRUYWcoJ3BoJywge2lkOiBgJHtpfWAsIGVxdWl2OiBwbGFjZWhvbGRlck5hbWV9LCB7c2VsZkNsb3Npbmc6IHRydWV9KTtcbiAgICAgIH1cbiAgICAgIHhtbC50ZXh0KG1lc3NhZ2UubWVzc2FnZVBhcnRzW2ldKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZU5vdGUoeG1sOiBYbWxGaWxlLCBuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICB4bWwuc3RhcnRUYWcoJ25vdGUnLCB7Y2F0ZWdvcnk6IG5hbWV9LCB7cHJlc2VydmVXaGl0ZXNwYWNlOiB0cnVlfSk7XG4gICAgeG1sLnRleHQodmFsdWUpO1xuICAgIHhtbC5lbmRUYWcoJ25vdGUnLCB7cHJlc2VydmVXaGl0ZXNwYWNlOiBmYWxzZX0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgaWQgZm9yIHRoZSBnaXZlbiBgbWVzc2FnZWAuXG4gICAqXG4gICAqIElmIHdlIGhhdmUgcmVxdWVzdGVkIGxlZ2FjeSBtZXNzYWdlIGlkcywgdGhlbiB0cnkgdG8gcmV0dXJuIHRoZSBhcHByb3ByaWF0ZSBpZFxuICAgKiBmcm9tIHRoZSBsaXN0IG9mIGxlZ2FjeSBpZHMgdGhhdCB3ZXJlIGV4dHJhY3RlZC5cbiAgICpcbiAgICogT3RoZXJ3aXNlIHJldHVybiB0aGUgY2Fub25pY2FsIG1lc3NhZ2UgaWQuXG4gICAqXG4gICAqIEFuIFhsaWZmIDIuMCBsZWdhY3kgbWVzc2FnZSBpZCBpcyBhIDY0IGJpdCBudW1iZXIgZW5jb2RlZCBhcyBhIGRlY2ltYWwgc3RyaW5nLCB3aGljaCB3aWxsIGhhdmVcbiAgICogYXQgbW9zdCAyMCBkaWdpdHMsIHNpbmNlIDJeNjUtMSA9IDM2LDg5Myw0ODgsMTQ3LDQxOSwxMDMsMjMxLiBUaGlzIGRpZ2VzdCBpcyBiYXNlZCBvbjpcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS9jbG9zdXJlLWNvbXBpbGVyL2Jsb2IvbWFzdGVyL3NyYy9jb20vZ29vZ2xlL2phdmFzY3JpcHQvanNjb21wL0dvb2dsZUpzTWVzc2FnZUlkR2VuZXJhdG9yLmphdmFcbiAgICovXG4gIHByaXZhdGUgZ2V0TWVzc2FnZUlkKG1lc3NhZ2U6IMm1UGFyc2VkTWVzc2FnZSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudXNlTGVnYWN5SWRzICYmIG1lc3NhZ2UubGVnYWN5SWRzICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgbWVzc2FnZS5sZWdhY3lJZHMuZmluZChcbiAgICAgICAgICAgIGlkID0+IGlkLmxlbmd0aCA8PSBNQVhfTEVHQUNZX1hMSUZGXzJfTUVTU0FHRV9MRU5HVEggJiYgIS9bXjAtOV0vLnRlc3QoaWQpKSB8fFxuICAgICAgICBtZXNzYWdlLmlkO1xuICB9XG59XG4iXX0=
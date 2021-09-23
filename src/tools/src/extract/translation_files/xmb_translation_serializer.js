(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/extract/translation_files/xmb_translation_serializer", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/localize/src/tools/src/extract/translation_files/icu_parsing", "@angular/localize/src/tools/src/extract/translation_files/utils", "@angular/localize/src/tools/src/extract/translation_files/xml_file"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XmbTranslationSerializer = void 0;
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
    var utils_1 = require("@angular/localize/src/tools/src/extract/translation_files/utils");
    var xml_file_1 = require("@angular/localize/src/tools/src/extract/translation_files/xml_file");
    /**
     * A translation serializer that can write files in XMB format.
     *
     * http://cldr.unicode.org/development/development-process/design-proposals/xmb
     *
     * @see XmbTranslationParser
     * @publicApi used by CLI
     */
    var XmbTranslationSerializer = /** @class */ (function () {
        function XmbTranslationSerializer(basePath, useLegacyIds, fs) {
            if (fs === void 0) { fs = (0, file_system_1.getFileSystem)(); }
            this.basePath = basePath;
            this.useLegacyIds = useLegacyIds;
            this.fs = fs;
        }
        XmbTranslationSerializer.prototype.serialize = function (messages) {
            var e_1, _a;
            var _this = this;
            var messageGroups = (0, utils_1.consolidateMessages)(messages, function (message) { return _this.getMessageId(message); });
            var xml = new xml_file_1.XmlFile();
            xml.rawText("<!DOCTYPE messagebundle [\n" +
                "<!ELEMENT messagebundle (msg)*>\n" +
                "<!ATTLIST messagebundle class CDATA #IMPLIED>\n" +
                "\n" +
                "<!ELEMENT msg (#PCDATA|ph|source)*>\n" +
                "<!ATTLIST msg id CDATA #IMPLIED>\n" +
                "<!ATTLIST msg seq CDATA #IMPLIED>\n" +
                "<!ATTLIST msg name CDATA #IMPLIED>\n" +
                "<!ATTLIST msg desc CDATA #IMPLIED>\n" +
                "<!ATTLIST msg meaning CDATA #IMPLIED>\n" +
                "<!ATTLIST msg obsolete (obsolete) #IMPLIED>\n" +
                "<!ATTLIST msg xml:space (default|preserve) \"default\">\n" +
                "<!ATTLIST msg is_hidden CDATA #IMPLIED>\n" +
                "\n" +
                "<!ELEMENT source (#PCDATA)>\n" +
                "\n" +
                "<!ELEMENT ph (#PCDATA|ex)*>\n" +
                "<!ATTLIST ph name CDATA #REQUIRED>\n" +
                "\n" +
                "<!ELEMENT ex (#PCDATA)>\n" +
                "]>\n");
            xml.startTag('messagebundle');
            try {
                for (var messageGroups_1 = (0, tslib_1.__values)(messageGroups), messageGroups_1_1 = messageGroups_1.next(); !messageGroups_1_1.done; messageGroups_1_1 = messageGroups_1.next()) {
                    var duplicateMessages = messageGroups_1_1.value;
                    var message = duplicateMessages[0];
                    var id = this.getMessageId(message);
                    xml.startTag('msg', { id: id, desc: message.description, meaning: message.meaning }, { preserveWhitespace: true });
                    if (message.location) {
                        this.serializeLocation(xml, message.location);
                    }
                    this.serializeMessage(xml, message);
                    xml.endTag('msg', { preserveWhitespace: false });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (messageGroups_1_1 && !messageGroups_1_1.done && (_a = messageGroups_1.return)) _a.call(messageGroups_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            xml.endTag('messagebundle');
            return xml.toString();
        };
        XmbTranslationSerializer.prototype.serializeLocation = function (xml, location) {
            xml.startTag('source');
            var endLineString = location.end !== undefined && location.end.line !== location.start.line ?
                "," + (location.end.line + 1) :
                '';
            xml.text(this.fs.relative(this.basePath, location.file) + ":" + location.start.line + endLineString);
            xml.endTag('source');
        };
        XmbTranslationSerializer.prototype.serializeMessage = function (xml, message) {
            var length = message.messageParts.length - 1;
            for (var i = 0; i < length; i++) {
                this.serializeTextPart(xml, message.messageParts[i]);
                xml.startTag('ph', { name: message.placeholderNames[i] }, { selfClosing: true });
            }
            this.serializeTextPart(xml, message.messageParts[length]);
        };
        XmbTranslationSerializer.prototype.serializeTextPart = function (xml, text) {
            var pieces = (0, icu_parsing_1.extractIcuPlaceholders)(text);
            var length = pieces.length - 1;
            for (var i = 0; i < length; i += 2) {
                xml.text(pieces[i]);
                xml.startTag('ph', { name: pieces[i + 1] }, { selfClosing: true });
            }
            xml.text(pieces[length]);
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
         * An XMB legacy message id is a 64 bit number encoded as a decimal string, which will have
         * at most 20 digits, since 2^65-1 = 36,893,488,147,419,103,231. This digest is based on:
         * https://github.com/google/closure-compiler/blob/master/src/com/google/javascript/jscomp/GoogleJsMessageIdGenerator.java
         */
        XmbTranslationSerializer.prototype.getMessageId = function (message) {
            return message.customId ||
                this.useLegacyIds && message.legacyIds !== undefined &&
                    message.legacyIds.find(function (id) { return id.length <= 20 && !/[^0-9]/.test(id); }) ||
                message.id;
        };
        return XmbTranslationSerializer;
    }());
    exports.XmbTranslationSerializer = XmbTranslationSerializer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1iX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2V4dHJhY3QvdHJhbnNsYXRpb25fZmlsZXMveG1iX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDJFQUE0RztJQUc1RyxxR0FBcUQ7SUFFckQseUZBQTRDO0lBQzVDLCtGQUFtQztJQUVuQzs7Ozs7OztPQU9HO0lBQ0g7UUFDRSxrQ0FDWSxRQUF3QixFQUFVLFlBQXFCLEVBQ3ZELEVBQXNDO1lBQXRDLG1CQUFBLEVBQUEsU0FBdUIsMkJBQWEsR0FBRTtZQUR0QyxhQUFRLEdBQVIsUUFBUSxDQUFnQjtZQUFVLGlCQUFZLEdBQVosWUFBWSxDQUFTO1lBQ3ZELE9BQUUsR0FBRixFQUFFLENBQW9DO1FBQUcsQ0FBQztRQUV0RCw0Q0FBUyxHQUFULFVBQVUsUUFBMEI7O1lBQXBDLGlCQXdDQztZQXZDQyxJQUFNLGFBQWEsR0FBRyxJQUFBLDJCQUFtQixFQUFDLFFBQVEsRUFBRSxVQUFBLE9BQU8sSUFBSSxPQUFBLEtBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEVBQTFCLENBQTBCLENBQUMsQ0FBQztZQUMzRixJQUFNLEdBQUcsR0FBRyxJQUFJLGtCQUFPLEVBQUUsQ0FBQztZQUMxQixHQUFHLENBQUMsT0FBTyxDQUNQLDZCQUE2QjtnQkFDN0IsbUNBQW1DO2dCQUNuQyxpREFBaUQ7Z0JBQ2pELElBQUk7Z0JBQ0osdUNBQXVDO2dCQUN2QyxvQ0FBb0M7Z0JBQ3BDLHFDQUFxQztnQkFDckMsc0NBQXNDO2dCQUN0QyxzQ0FBc0M7Z0JBQ3RDLHlDQUF5QztnQkFDekMsK0NBQStDO2dCQUMvQywyREFBeUQ7Z0JBQ3pELDJDQUEyQztnQkFDM0MsSUFB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QVk7WUFDbEQsSUFBTSxNQUFNLEdBQUcsSUFBQSxvQ0FBc0IsRUFBQyxJQUFJLENBQUMsQ0FBQztZQUM1QyxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNqQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2xDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO2FBQ2hFO1lBQ0QsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMzQixDQUFDO1FBRUQ7Ozs7Ozs7Ozs7Ozs7V0FhRztRQUNLLCtDQUFZLEdBQXBCLFVBQXFCLE9BQXVCO1lBQzFDLE9BQU8sT0FBTyxDQUFDLFFBQVE7Z0JBQ25CLElBQUksQ0FBQyxZQUFZLElBQUksT0FBTyxDQUFDLFNBQVMsS0FBSyxTQUFTO29CQUNwRCxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLEVBQUUsQ0FBQyxNQUFNLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBckMsQ0FBcUMsQ0FBQztnQkFDbkUsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUNqQixDQUFDO1FBQ0gsK0JBQUM7SUFBRCxDQUFDLEFBaEdELElBZ0dDO0lBaEdZLDREQUF3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aCwgZ2V0RmlsZVN5c3RlbSwgUGF0aE1hbmlwdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQge8m1UGFyc2VkTWVzc2FnZSwgybVTb3VyY2VMb2NhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuXG5pbXBvcnQge2V4dHJhY3RJY3VQbGFjZWhvbGRlcnN9IGZyb20gJy4vaWN1X3BhcnNpbmcnO1xuaW1wb3J0IHtUcmFuc2xhdGlvblNlcmlhbGl6ZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fc2VyaWFsaXplcic7XG5pbXBvcnQge2NvbnNvbGlkYXRlTWVzc2FnZXN9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtYbWxGaWxlfSBmcm9tICcuL3htbF9maWxlJztcblxuLyoqXG4gKiBBIHRyYW5zbGF0aW9uIHNlcmlhbGl6ZXIgdGhhdCBjYW4gd3JpdGUgZmlsZXMgaW4gWE1CIGZvcm1hdC5cbiAqXG4gKiBodHRwOi8vY2xkci51bmljb2RlLm9yZy9kZXZlbG9wbWVudC9kZXZlbG9wbWVudC1wcm9jZXNzL2Rlc2lnbi1wcm9wb3NhbHMveG1iXG4gKlxuICogQHNlZSBYbWJUcmFuc2xhdGlvblBhcnNlclxuICogQHB1YmxpY0FwaSB1c2VkIGJ5IENMSVxuICovXG5leHBvcnQgY2xhc3MgWG1iVHJhbnNsYXRpb25TZXJpYWxpemVyIGltcGxlbWVudHMgVHJhbnNsYXRpb25TZXJpYWxpemVyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIGJhc2VQYXRoOiBBYnNvbHV0ZUZzUGF0aCwgcHJpdmF0ZSB1c2VMZWdhY3lJZHM6IGJvb2xlYW4sXG4gICAgICBwcml2YXRlIGZzOiBQYXRoTWFuaXB1bGF0aW9uID0gZ2V0RmlsZVN5c3RlbSgpKSB7fVxuXG4gIHNlcmlhbGl6ZShtZXNzYWdlczogybVQYXJzZWRNZXNzYWdlW10pOiBzdHJpbmcge1xuICAgIGNvbnN0IG1lc3NhZ2VHcm91cHMgPSBjb25zb2xpZGF0ZU1lc3NhZ2VzKG1lc3NhZ2VzLCBtZXNzYWdlID0+IHRoaXMuZ2V0TWVzc2FnZUlkKG1lc3NhZ2UpKTtcbiAgICBjb25zdCB4bWwgPSBuZXcgWG1sRmlsZSgpO1xuICAgIHhtbC5yYXdUZXh0KFxuICAgICAgICBgPCFET0NUWVBFIG1lc3NhZ2VidW5kbGUgW1xcbmAgK1xuICAgICAgICBgPCFFTEVNRU5UIG1lc3NhZ2VidW5kbGUgKG1zZykqPlxcbmAgK1xuICAgICAgICBgPCFBVFRMSVNUIG1lc3NhZ2VidW5kbGUgY2xhc3MgQ0RBVEEgI0lNUExJRUQ+XFxuYCArXG4gICAgICAgIGBcXG5gICtcbiAgICAgICAgYDwhRUxFTUVOVCBtc2cgKCNQQ0RBVEF8cGh8c291cmNlKSo+XFxuYCArXG4gICAgICAgIGA8IUFUVExJU1QgbXNnIGlkIENEQVRBICNJTVBMSUVEPlxcbmAgK1xuICAgICAgICBgPCFBVFRMSVNUIG1zZyBzZXEgQ0RBVEEgI0lNUExJRUQ+XFxuYCArXG4gICAgICAgIGA8IUFUVExJU1QgbXNnIG5hbWUgQ0RBVEEgI0lNUExJRUQ+XFxuYCArXG4gICAgICAgIGA8IUFUVExJU1QgbXNnIGRlc2MgQ0RBVEEgI0lNUExJRUQ+XFxuYCArXG4gICAgICAgIGA8IUFUVExJU1QgbXNnIG1lYW5pbmcgQ0RBVEEgI0lNUExJRUQ+XFxuYCArXG4gICAgICAgIGA8IUFUVExJU1QgbXNnIG9ic29sZXRlIChvYnNvbGV0ZSkgI0lNUExJRUQ+XFxuYCArXG4gICAgICAgIGA8IUFUVExJU1QgbXNnIHhtbDpzcGFjZSAoZGVmYXVsdHxwcmVzZXJ2ZSkgXCJkZWZhdWx0XCI+XFxuYCArXG4gICAgICAgIGA8IUFUVExJU1QgbXNnIGlzX2hpZGRlbiBDREFUQSAjSU1QTElFRD5cXG5gICtcbiAgICAgICAgYFxcbmAgK1xuICAgICAgICBgPCFFTEVNRU5UIHNvdXJjZSAoI1BDREFUQSk+XFxuYCArXG4gICAgICAgIGBcXG5gICtcbiAgICAgICAgYDwhRUxFTUVOVCBwaCAoI1BDREFUQXxleCkqPlxcbmAgK1xuICAgICAgICBgPCFBVFRMSVNUIHBoIG5hbWUgQ0RBVEEgI1JFUVVJUkVEPlxcbmAgK1xuICAgICAgICBgXFxuYCArXG4gICAgICAgIGA8IUVMRU1FTlQgZXggKCNQQ0RBVEEpPlxcbmAgK1xuICAgICAgICBgXT5cXG5gKTtcbiAgICB4bWwuc3RhcnRUYWcoJ21lc3NhZ2VidW5kbGUnKTtcbiAgICBmb3IgKGNvbnN0IGR1cGxpY2F0ZU1lc3NhZ2VzIG9mIG1lc3NhZ2VHcm91cHMpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBkdXBsaWNhdGVNZXNzYWdlc1swXTtcbiAgICAgIGNvbnN0IGlkID0gdGhpcy5nZXRNZXNzYWdlSWQobWVzc2FnZSk7XG4gICAgICB4bWwuc3RhcnRUYWcoXG4gICAgICAgICAgJ21zZycsIHtpZCwgZGVzYzogbWVzc2FnZS5kZXNjcmlwdGlvbiwgbWVhbmluZzogbWVzc2FnZS5tZWFuaW5nfSxcbiAgICAgICAgICB7cHJlc2VydmVXaGl0ZXNwYWNlOiB0cnVlfSk7XG4gICAgICBpZiAobWVzc2FnZS5sb2NhdGlvbikge1xuICAgICAgICB0aGlzLnNlcmlhbGl6ZUxvY2F0aW9uKHhtbCwgbWVzc2FnZS5sb2NhdGlvbik7XG4gICAgICB9XG4gICAgICB0aGlzLnNlcmlhbGl6ZU1lc3NhZ2UoeG1sLCBtZXNzYWdlKTtcbiAgICAgIHhtbC5lbmRUYWcoJ21zZycsIHtwcmVzZXJ2ZVdoaXRlc3BhY2U6IGZhbHNlfSk7XG4gICAgfVxuICAgIHhtbC5lbmRUYWcoJ21lc3NhZ2VidW5kbGUnKTtcbiAgICByZXR1cm4geG1sLnRvU3RyaW5nKCk7XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZUxvY2F0aW9uKHhtbDogWG1sRmlsZSwgbG9jYXRpb246IMm1U291cmNlTG9jYXRpb24pOiB2b2lkIHtcbiAgICB4bWwuc3RhcnRUYWcoJ3NvdXJjZScpO1xuICAgIGNvbnN0IGVuZExpbmVTdHJpbmcgPSBsb2NhdGlvbi5lbmQgIT09IHVuZGVmaW5lZCAmJiBsb2NhdGlvbi5lbmQubGluZSAhPT0gbG9jYXRpb24uc3RhcnQubGluZSA/XG4gICAgICAgIGAsJHtsb2NhdGlvbi5lbmQubGluZSArIDF9YCA6XG4gICAgICAgICcnO1xuICAgIHhtbC50ZXh0KFxuICAgICAgICBgJHt0aGlzLmZzLnJlbGF0aXZlKHRoaXMuYmFzZVBhdGgsIGxvY2F0aW9uLmZpbGUpfToke2xvY2F0aW9uLnN0YXJ0LmxpbmV9JHtlbmRMaW5lU3RyaW5nfWApO1xuICAgIHhtbC5lbmRUYWcoJ3NvdXJjZScpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVNZXNzYWdlKHhtbDogWG1sRmlsZSwgbWVzc2FnZTogybVQYXJzZWRNZXNzYWdlKTogdm9pZCB7XG4gICAgY29uc3QgbGVuZ3RoID0gbWVzc2FnZS5tZXNzYWdlUGFydHMubGVuZ3RoIC0gMTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLnNlcmlhbGl6ZVRleHRQYXJ0KHhtbCwgbWVzc2FnZS5tZXNzYWdlUGFydHNbaV0pO1xuICAgICAgeG1sLnN0YXJ0VGFnKCdwaCcsIHtuYW1lOiBtZXNzYWdlLnBsYWNlaG9sZGVyTmFtZXNbaV19LCB7c2VsZkNsb3Npbmc6IHRydWV9KTtcbiAgICB9XG4gICAgdGhpcy5zZXJpYWxpemVUZXh0UGFydCh4bWwsIG1lc3NhZ2UubWVzc2FnZVBhcnRzW2xlbmd0aF0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVUZXh0UGFydCh4bWw6IFhtbEZpbGUsIHRleHQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHBpZWNlcyA9IGV4dHJhY3RJY3VQbGFjZWhvbGRlcnModGV4dCk7XG4gICAgY29uc3QgbGVuZ3RoID0gcGllY2VzLmxlbmd0aCAtIDE7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMikge1xuICAgICAgeG1sLnRleHQocGllY2VzW2ldKTtcbiAgICAgIHhtbC5zdGFydFRhZygncGgnLCB7bmFtZTogcGllY2VzW2kgKyAxXX0sIHtzZWxmQ2xvc2luZzogdHJ1ZX0pO1xuICAgIH1cbiAgICB4bWwudGV4dChwaWVjZXNbbGVuZ3RoXSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBpZCBmb3IgdGhlIGdpdmVuIGBtZXNzYWdlYC5cbiAgICpcbiAgICogSWYgdGhlcmUgd2FzIGEgY3VzdG9tIGlkIHByb3ZpZGVkLCB1c2UgdGhhdC5cbiAgICpcbiAgICogSWYgd2UgaGF2ZSByZXF1ZXN0ZWQgbGVnYWN5IG1lc3NhZ2UgaWRzLCB0aGVuIHRyeSB0byByZXR1cm4gdGhlIGFwcHJvcHJpYXRlIGlkXG4gICAqIGZyb20gdGhlIGxpc3Qgb2YgbGVnYWN5IGlkcyB0aGF0IHdlcmUgZXh0cmFjdGVkLlxuICAgKlxuICAgKiBPdGhlcndpc2UgcmV0dXJuIHRoZSBjYW5vbmljYWwgbWVzc2FnZSBpZC5cbiAgICpcbiAgICogQW4gWE1CIGxlZ2FjeSBtZXNzYWdlIGlkIGlzIGEgNjQgYml0IG51bWJlciBlbmNvZGVkIGFzIGEgZGVjaW1hbCBzdHJpbmcsIHdoaWNoIHdpbGwgaGF2ZVxuICAgKiBhdCBtb3N0IDIwIGRpZ2l0cywgc2luY2UgMl42NS0xID0gMzYsODkzLDQ4OCwxNDcsNDE5LDEwMywyMzEuIFRoaXMgZGlnZXN0IGlzIGJhc2VkIG9uOlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2Nsb3N1cmUtY29tcGlsZXIvYmxvYi9tYXN0ZXIvc3JjL2NvbS9nb29nbGUvamF2YXNjcmlwdC9qc2NvbXAvR29vZ2xlSnNNZXNzYWdlSWRHZW5lcmF0b3IuamF2YVxuICAgKi9cbiAgcHJpdmF0ZSBnZXRNZXNzYWdlSWQobWVzc2FnZTogybVQYXJzZWRNZXNzYWdlKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbWVzc2FnZS5jdXN0b21JZCB8fFxuICAgICAgICB0aGlzLnVzZUxlZ2FjeUlkcyAmJiBtZXNzYWdlLmxlZ2FjeUlkcyAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIG1lc3NhZ2UubGVnYWN5SWRzLmZpbmQoaWQgPT4gaWQubGVuZ3RoIDw9IDIwICYmICEvW14wLTldLy50ZXN0KGlkKSkgfHxcbiAgICAgICAgbWVzc2FnZS5pZDtcbiAgfVxufVxuIl19
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/extract/translation_files/xmb_translation_serializer", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/localize/src/tools/src/extract/translation_files/icu_parsing", "@angular/localize/src/tools/src/extract/translation_files/xml_file"], factory);
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
    var xml_file_1 = require("@angular/localize/src/tools/src/extract/translation_files/xml_file");
    /**
     * A translation serializer that can write files in XMB format.
     *
     * http://cldr.unicode.org/development/development-process/design-proposals/xmb
     *
     * @see XmbTranslationParser
     */
    var XmbTranslationSerializer = /** @class */ (function () {
        function XmbTranslationSerializer(basePath, useLegacyIds) {
            this.basePath = basePath;
            this.useLegacyIds = useLegacyIds;
        }
        XmbTranslationSerializer.prototype.serialize = function (messages) {
            var e_1, _a;
            var ids = new Set();
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
                for (var messages_1 = tslib_1.__values(messages), messages_1_1 = messages_1.next(); !messages_1_1.done; messages_1_1 = messages_1.next()) {
                    var message = messages_1_1.value;
                    var id = this.getMessageId(message);
                    if (ids.has(id)) {
                        // Do not render the same message more than once
                        continue;
                    }
                    ids.add(id);
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
                    if (messages_1_1 && !messages_1_1.done && (_a = messages_1.return)) _a.call(messages_1);
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
            xml.text(file_system_1.relative(this.basePath, location.file) + ":" + location.start.line + endLineString);
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
            var pieces = icu_parsing_1.extractIcuPlaceholders(text);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1iX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2V4dHJhY3QvdHJhbnNsYXRpb25fZmlsZXMveG1iX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDJFQUFxRjtJQUdyRixxR0FBcUQ7SUFFckQsK0ZBQW1DO0lBRW5DOzs7Ozs7T0FNRztJQUNIO1FBQ0Usa0NBQW9CLFFBQXdCLEVBQVUsWUFBcUI7WUFBdkQsYUFBUSxHQUFSLFFBQVEsQ0FBZ0I7WUFBVSxpQkFBWSxHQUFaLFlBQVksQ0FBUztRQUFHLENBQUM7UUFFL0UsNENBQVMsR0FBVCxVQUFVLFFBQTBCOztZQUNsQyxJQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO1lBQzlCLElBQU0sR0FBRyxHQUFHLElBQUksa0JBQU8sRUFBRSxDQUFDO1lBQzFCLEdBQUcsQ0FBQyxPQUFPLENBQ1AsNkJBQTZCO2dCQUM3QixtQ0FBbUM7Z0JBQ25DLGlEQUFpRDtnQkFDakQsSUFBSTtnQkFDSix1Q0FBdUM7Z0JBQ3ZDLG9DQUFvQztnQkFDcEMscUNBQXFDO2dCQUNyQyxzQ0FBc0M7Z0JBQ3RDLHNDQUFzQztnQkFDdEMseUNBQXlDO2dCQUN6QywrQ0FBK0M7Z0JBQy9DLDJEQUF5RDtnQkFDekQsMkNBQTJDO2dCQUMzQyxJQUFJO2dCQUNKLCtCQUErQjtnQkFDL0IsSUFBSTtnQkFDSiwrQkFBK0I7Z0JBQy9CLHNDQUFzQztnQkFDdEMsSUFBSTtnQkFDSiwyQkFBMkI7Z0JBQzNCLE1BQU0sQ0FBQyxDQUFDO1lBQ1osR0FBRyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQzs7Z0JBQzlCLEtBQXNCLElBQUEsYUFBQSxpQkFBQSxRQUFRLENBQUEsa0NBQUEsd0RBQUU7b0JBQTNCLElBQU0sT0FBTyxxQkFBQTtvQkFDaEIsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDdEMsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO3dCQUNmLGdEQUFnRDt3QkFDaEQsU0FBUztxQkFDVjtvQkFDRCxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNaLEdBQUcsQ0FBQyxRQUFRLENBQ1IsS0FBSyxFQUFFLEVBQUMsRUFBRSxJQUFBLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUMsRUFDaEUsRUFBQyxrQkFBa0IsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO29CQUNoQyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUU7d0JBQ3BCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3FCQUMvQztvQkFDRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUNwQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFDLGtCQUFrQixFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7aUJBQ2hEOzs7Ozs7Ozs7WUFDRCxHQUFHLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzVCLE9BQU8sR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3hCLENBQUM7UUFFTyxvREFBaUIsR0FBekIsVUFBMEIsR0FBWSxFQUFFLFFBQXlCO1lBQy9ELEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdkIsSUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLEdBQUcsS0FBSyxTQUFTLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDM0YsT0FBSSxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUUsQ0FBQyxDQUFDO2dCQUM3QixFQUFFLENBQUM7WUFDUCxHQUFHLENBQUMsSUFBSSxDQUFJLHNCQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsYUFBZSxDQUFDLENBQUM7WUFDN0YsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2QixDQUFDO1FBRU8sbURBQWdCLEdBQXhCLFVBQXlCLEdBQVksRUFBRSxPQUF1QjtZQUM1RCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDL0MsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDL0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JELEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsRUFBQyxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7YUFDOUU7WUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM1RCxDQUFDO1FBRU8sb0RBQWlCLEdBQXpCLFVBQTBCLEdBQVksRUFBRSxJQUFZO1lBQ2xELElBQU0sTUFBTSxHQUFHLG9DQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVDLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ2pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDbEMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7YUFDaEU7WUFDRCxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzNCLENBQUM7UUFFRDs7Ozs7Ozs7Ozs7OztXQWFHO1FBQ0ssK0NBQVksR0FBcEIsVUFBcUIsT0FBdUI7WUFDMUMsT0FBTyxPQUFPLENBQUMsUUFBUTtnQkFDbkIsSUFBSSxDQUFDLFlBQVksSUFBSSxPQUFPLENBQUMsU0FBUyxLQUFLLFNBQVM7b0JBQ3BELE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsRUFBRSxDQUFDLE1BQU0sSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFyQyxDQUFxQyxDQUFDO2dCQUNuRSxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQ2pCLENBQUM7UUFDSCwrQkFBQztJQUFELENBQUMsQUFqR0QsSUFpR0M7SUFqR1ksNERBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0Fic29sdXRlRnNQYXRoLCByZWxhdGl2ZX0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQge8m1UGFyc2VkTWVzc2FnZSwgybVTb3VyY2VMb2NhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuXG5pbXBvcnQge2V4dHJhY3RJY3VQbGFjZWhvbGRlcnN9IGZyb20gJy4vaWN1X3BhcnNpbmcnO1xuaW1wb3J0IHtUcmFuc2xhdGlvblNlcmlhbGl6ZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fc2VyaWFsaXplcic7XG5pbXBvcnQge1htbEZpbGV9IGZyb20gJy4veG1sX2ZpbGUnO1xuXG4vKipcbiAqIEEgdHJhbnNsYXRpb24gc2VyaWFsaXplciB0aGF0IGNhbiB3cml0ZSBmaWxlcyBpbiBYTUIgZm9ybWF0LlxuICpcbiAqIGh0dHA6Ly9jbGRyLnVuaWNvZGUub3JnL2RldmVsb3BtZW50L2RldmVsb3BtZW50LXByb2Nlc3MvZGVzaWduLXByb3Bvc2Fscy94bWJcbiAqXG4gKiBAc2VlIFhtYlRyYW5zbGF0aW9uUGFyc2VyXG4gKi9cbmV4cG9ydCBjbGFzcyBYbWJUcmFuc2xhdGlvblNlcmlhbGl6ZXIgaW1wbGVtZW50cyBUcmFuc2xhdGlvblNlcmlhbGl6ZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGJhc2VQYXRoOiBBYnNvbHV0ZUZzUGF0aCwgcHJpdmF0ZSB1c2VMZWdhY3lJZHM6IGJvb2xlYW4pIHt9XG5cbiAgc2VyaWFsaXplKG1lc3NhZ2VzOiDJtVBhcnNlZE1lc3NhZ2VbXSk6IHN0cmluZyB7XG4gICAgY29uc3QgaWRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgY29uc3QgeG1sID0gbmV3IFhtbEZpbGUoKTtcbiAgICB4bWwucmF3VGV4dChcbiAgICAgICAgYDwhRE9DVFlQRSBtZXNzYWdlYnVuZGxlIFtcXG5gICtcbiAgICAgICAgYDwhRUxFTUVOVCBtZXNzYWdlYnVuZGxlIChtc2cpKj5cXG5gICtcbiAgICAgICAgYDwhQVRUTElTVCBtZXNzYWdlYnVuZGxlIGNsYXNzIENEQVRBICNJTVBMSUVEPlxcbmAgK1xuICAgICAgICBgXFxuYCArXG4gICAgICAgIGA8IUVMRU1FTlQgbXNnICgjUENEQVRBfHBofHNvdXJjZSkqPlxcbmAgK1xuICAgICAgICBgPCFBVFRMSVNUIG1zZyBpZCBDREFUQSAjSU1QTElFRD5cXG5gICtcbiAgICAgICAgYDwhQVRUTElTVCBtc2cgc2VxIENEQVRBICNJTVBMSUVEPlxcbmAgK1xuICAgICAgICBgPCFBVFRMSVNUIG1zZyBuYW1lIENEQVRBICNJTVBMSUVEPlxcbmAgK1xuICAgICAgICBgPCFBVFRMSVNUIG1zZyBkZXNjIENEQVRBICNJTVBMSUVEPlxcbmAgK1xuICAgICAgICBgPCFBVFRMSVNUIG1zZyBtZWFuaW5nIENEQVRBICNJTVBMSUVEPlxcbmAgK1xuICAgICAgICBgPCFBVFRMSVNUIG1zZyBvYnNvbGV0ZSAob2Jzb2xldGUpICNJTVBMSUVEPlxcbmAgK1xuICAgICAgICBgPCFBVFRMSVNUIG1zZyB4bWw6c3BhY2UgKGRlZmF1bHR8cHJlc2VydmUpIFwiZGVmYXVsdFwiPlxcbmAgK1xuICAgICAgICBgPCFBVFRMSVNUIG1zZyBpc19oaWRkZW4gQ0RBVEEgI0lNUExJRUQ+XFxuYCArXG4gICAgICAgIGBcXG5gICtcbiAgICAgICAgYDwhRUxFTUVOVCBzb3VyY2UgKCNQQ0RBVEEpPlxcbmAgK1xuICAgICAgICBgXFxuYCArXG4gICAgICAgIGA8IUVMRU1FTlQgcGggKCNQQ0RBVEF8ZXgpKj5cXG5gICtcbiAgICAgICAgYDwhQVRUTElTVCBwaCBuYW1lIENEQVRBICNSRVFVSVJFRD5cXG5gICtcbiAgICAgICAgYFxcbmAgK1xuICAgICAgICBgPCFFTEVNRU5UIGV4ICgjUENEQVRBKT5cXG5gICtcbiAgICAgICAgYF0+XFxuYCk7XG4gICAgeG1sLnN0YXJ0VGFnKCdtZXNzYWdlYnVuZGxlJyk7XG4gICAgZm9yIChjb25zdCBtZXNzYWdlIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBjb25zdCBpZCA9IHRoaXMuZ2V0TWVzc2FnZUlkKG1lc3NhZ2UpO1xuICAgICAgaWYgKGlkcy5oYXMoaWQpKSB7XG4gICAgICAgIC8vIERvIG5vdCByZW5kZXIgdGhlIHNhbWUgbWVzc2FnZSBtb3JlIHRoYW4gb25jZVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlkcy5hZGQoaWQpO1xuICAgICAgeG1sLnN0YXJ0VGFnKFxuICAgICAgICAgICdtc2cnLCB7aWQsIGRlc2M6IG1lc3NhZ2UuZGVzY3JpcHRpb24sIG1lYW5pbmc6IG1lc3NhZ2UubWVhbmluZ30sXG4gICAgICAgICAge3ByZXNlcnZlV2hpdGVzcGFjZTogdHJ1ZX0pO1xuICAgICAgaWYgKG1lc3NhZ2UubG9jYXRpb24pIHtcbiAgICAgICAgdGhpcy5zZXJpYWxpemVMb2NhdGlvbih4bWwsIG1lc3NhZ2UubG9jYXRpb24pO1xuICAgICAgfVxuICAgICAgdGhpcy5zZXJpYWxpemVNZXNzYWdlKHhtbCwgbWVzc2FnZSk7XG4gICAgICB4bWwuZW5kVGFnKCdtc2cnLCB7cHJlc2VydmVXaGl0ZXNwYWNlOiBmYWxzZX0pO1xuICAgIH1cbiAgICB4bWwuZW5kVGFnKCdtZXNzYWdlYnVuZGxlJyk7XG4gICAgcmV0dXJuIHhtbC50b1N0cmluZygpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVMb2NhdGlvbih4bWw6IFhtbEZpbGUsIGxvY2F0aW9uOiDJtVNvdXJjZUxvY2F0aW9uKTogdm9pZCB7XG4gICAgeG1sLnN0YXJ0VGFnKCdzb3VyY2UnKTtcbiAgICBjb25zdCBlbmRMaW5lU3RyaW5nID0gbG9jYXRpb24uZW5kICE9PSB1bmRlZmluZWQgJiYgbG9jYXRpb24uZW5kLmxpbmUgIT09IGxvY2F0aW9uLnN0YXJ0LmxpbmUgP1xuICAgICAgICBgLCR7bG9jYXRpb24uZW5kLmxpbmUgKyAxfWAgOlxuICAgICAgICAnJztcbiAgICB4bWwudGV4dChgJHtyZWxhdGl2ZSh0aGlzLmJhc2VQYXRoLCBsb2NhdGlvbi5maWxlKX06JHtsb2NhdGlvbi5zdGFydC5saW5lfSR7ZW5kTGluZVN0cmluZ31gKTtcbiAgICB4bWwuZW5kVGFnKCdzb3VyY2UnKTtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplTWVzc2FnZSh4bWw6IFhtbEZpbGUsIG1lc3NhZ2U6IMm1UGFyc2VkTWVzc2FnZSk6IHZvaWQge1xuICAgIGNvbnN0IGxlbmd0aCA9IG1lc3NhZ2UubWVzc2FnZVBhcnRzLmxlbmd0aCAtIDE7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5zZXJpYWxpemVUZXh0UGFydCh4bWwsIG1lc3NhZ2UubWVzc2FnZVBhcnRzW2ldKTtcbiAgICAgIHhtbC5zdGFydFRhZygncGgnLCB7bmFtZTogbWVzc2FnZS5wbGFjZWhvbGRlck5hbWVzW2ldfSwge3NlbGZDbG9zaW5nOiB0cnVlfSk7XG4gICAgfVxuICAgIHRoaXMuc2VyaWFsaXplVGV4dFBhcnQoeG1sLCBtZXNzYWdlLm1lc3NhZ2VQYXJ0c1tsZW5ndGhdKTtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplVGV4dFBhcnQoeG1sOiBYbWxGaWxlLCB0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBwaWVjZXMgPSBleHRyYWN0SWN1UGxhY2Vob2xkZXJzKHRleHQpO1xuICAgIGNvbnN0IGxlbmd0aCA9IHBpZWNlcy5sZW5ndGggLSAxO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIHhtbC50ZXh0KHBpZWNlc1tpXSk7XG4gICAgICB4bWwuc3RhcnRUYWcoJ3BoJywge25hbWU6IHBpZWNlc1tpICsgMV19LCB7c2VsZkNsb3Npbmc6IHRydWV9KTtcbiAgICB9XG4gICAgeG1sLnRleHQocGllY2VzW2xlbmd0aF0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgaWQgZm9yIHRoZSBnaXZlbiBgbWVzc2FnZWAuXG4gICAqXG4gICAqIElmIHRoZXJlIHdhcyBhIGN1c3RvbSBpZCBwcm92aWRlZCwgdXNlIHRoYXQuXG4gICAqXG4gICAqIElmIHdlIGhhdmUgcmVxdWVzdGVkIGxlZ2FjeSBtZXNzYWdlIGlkcywgdGhlbiB0cnkgdG8gcmV0dXJuIHRoZSBhcHByb3ByaWF0ZSBpZFxuICAgKiBmcm9tIHRoZSBsaXN0IG9mIGxlZ2FjeSBpZHMgdGhhdCB3ZXJlIGV4dHJhY3RlZC5cbiAgICpcbiAgICogT3RoZXJ3aXNlIHJldHVybiB0aGUgY2Fub25pY2FsIG1lc3NhZ2UgaWQuXG4gICAqXG4gICAqIEFuIFhNQiBsZWdhY3kgbWVzc2FnZSBpZCBpcyBhIDY0IGJpdCBudW1iZXIgZW5jb2RlZCBhcyBhIGRlY2ltYWwgc3RyaW5nLCB3aGljaCB3aWxsIGhhdmVcbiAgICogYXQgbW9zdCAyMCBkaWdpdHMsIHNpbmNlIDJeNjUtMSA9IDM2LDg5Myw0ODgsMTQ3LDQxOSwxMDMsMjMxLiBUaGlzIGRpZ2VzdCBpcyBiYXNlZCBvbjpcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS9jbG9zdXJlLWNvbXBpbGVyL2Jsb2IvbWFzdGVyL3NyYy9jb20vZ29vZ2xlL2phdmFzY3JpcHQvanNjb21wL0dvb2dsZUpzTWVzc2FnZUlkR2VuZXJhdG9yLmphdmFcbiAgICovXG4gIHByaXZhdGUgZ2V0TWVzc2FnZUlkKG1lc3NhZ2U6IMm1UGFyc2VkTWVzc2FnZSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG1lc3NhZ2UuY3VzdG9tSWQgfHxcbiAgICAgICAgdGhpcy51c2VMZWdhY3lJZHMgJiYgbWVzc2FnZS5sZWdhY3lJZHMgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICBtZXNzYWdlLmxlZ2FjeUlkcy5maW5kKGlkID0+IGlkLmxlbmd0aCA8PSAyMCAmJiAhL1teMC05XS8udGVzdChpZCkpIHx8XG4gICAgICAgIG1lc3NhZ2UuaWQ7XG4gIH1cbn1cbiJdfQ==
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/extract/translation_files/xmb_translation_serializer", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/localize/src/tools/src/extract/translation_files/xml_file"], factory);
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
            xml.text(message.messageParts[0]);
            for (var i = 1; i < message.messageParts.length; i++) {
                xml.startTag('ph', { name: message.placeholderNames[i - 1] }, { selfClosing: true });
                xml.text(message.messageParts[i]);
            }
        };
        /**
         * Get the id for the given `message`.
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
            return this.useLegacyIds && message.legacyIds !== undefined &&
                message.legacyIds.find(function (id) { return id.length <= 20 && !/[^0-9]/.test(id); }) ||
                message.id;
        };
        return XmbTranslationSerializer;
    }());
    exports.XmbTranslationSerializer = XmbTranslationSerializer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1iX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2V4dHJhY3QvdHJhbnNsYXRpb25fZmlsZXMveG1iX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDJFQUFxRjtJQUlyRiwrRkFBbUM7SUFFbkM7Ozs7OztPQU1HO0lBQ0g7UUFDRSxrQ0FBb0IsUUFBd0IsRUFBVSxZQUFxQjtZQUF2RCxhQUFRLEdBQVIsUUFBUSxDQUFnQjtZQUFVLGlCQUFZLEdBQVosWUFBWSxDQUFTO1FBQUcsQ0FBQztRQUUvRSw0Q0FBUyxHQUFULFVBQVUsUUFBMEI7O1lBQ2xDLElBQU0sR0FBRyxHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7WUFDOUIsSUFBTSxHQUFHLEdBQUcsSUFBSSxrQkFBTyxFQUFFLENBQUM7WUFDMUIsR0FBRyxDQUFDLE9BQU8sQ0FDUCw2QkFBNkI7Z0JBQzdCLG1DQUFtQztnQkFDbkMsaURBQWlEO2dCQUNqRCxJQUFJO2dCQUNKLHVDQUF1QztnQkFDdkMsb0NBQW9DO2dCQUNwQyxxQ0FBcUM7Z0JBQ3JDLHNDQUFzQztnQkFDdEMsc0NBQXNDO2dCQUN0Qyx5Q0FBeUM7Z0JBQ3pDLCtDQUErQztnQkFDL0MsMkRBQXlEO2dCQUN6RCwyQ0FBMkM7Z0JBQzNDLElBQUk7Z0JBQ0osK0JBQStCO2dCQUMvQixJQUFJO2dCQUNKLCtCQUErQjtnQkFDL0Isc0NBQXNDO2dCQUN0QyxJQUFJO2dCQUNKLDJCQUEyQjtnQkFDM0IsTUFBTSxDQUFDLENBQUM7WUFDWixHQUFHLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDOztnQkFDOUIsS0FBc0IsSUFBQSxhQUFBLGlCQUFBLFFBQVEsQ0FBQSxrQ0FBQSx3REFB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QXFDLENBQUM7Z0JBQ25FLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDakIsQ0FBQztRQUNILCtCQUFDO0lBQUQsQ0FBQyxBQW5GRCxJQW1GQztJQW5GWSw0REFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGgsIHJlbGF0aXZlfSBmcm9tICdAYW5ndWxhci9jb21waWxlci1jbGkvc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7ybVQYXJzZWRNZXNzYWdlLCDJtVNvdXJjZUxvY2F0aW9ufSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5cbmltcG9ydCB7VHJhbnNsYXRpb25TZXJpYWxpemVyfSBmcm9tICcuL3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtYbWxGaWxlfSBmcm9tICcuL3htbF9maWxlJztcblxuLyoqXG4gKiBBIHRyYW5zbGF0aW9uIHNlcmlhbGl6ZXIgdGhhdCBjYW4gd3JpdGUgZmlsZXMgaW4gWE1CIGZvcm1hdC5cbiAqXG4gKiBodHRwOi8vY2xkci51bmljb2RlLm9yZy9kZXZlbG9wbWVudC9kZXZlbG9wbWVudC1wcm9jZXNzL2Rlc2lnbi1wcm9wb3NhbHMveG1iXG4gKlxuICogQHNlZSBYbWJUcmFuc2xhdGlvblBhcnNlclxuICovXG5leHBvcnQgY2xhc3MgWG1iVHJhbnNsYXRpb25TZXJpYWxpemVyIGltcGxlbWVudHMgVHJhbnNsYXRpb25TZXJpYWxpemVyIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBiYXNlUGF0aDogQWJzb2x1dGVGc1BhdGgsIHByaXZhdGUgdXNlTGVnYWN5SWRzOiBib29sZWFuKSB7fVxuXG4gIHNlcmlhbGl6ZShtZXNzYWdlczogybVQYXJzZWRNZXNzYWdlW10pOiBzdHJpbmcge1xuICAgIGNvbnN0IGlkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IHhtbCA9IG5ldyBYbWxGaWxlKCk7XG4gICAgeG1sLnJhd1RleHQoXG4gICAgICAgIGA8IURPQ1RZUEUgbWVzc2FnZWJ1bmRsZSBbXFxuYCArXG4gICAgICAgIGA8IUVMRU1FTlQgbWVzc2FnZWJ1bmRsZSAobXNnKSo+XFxuYCArXG4gICAgICAgIGA8IUFUVExJU1QgbWVzc2FnZWJ1bmRsZSBjbGFzcyBDREFUQSAjSU1QTElFRD5cXG5gICtcbiAgICAgICAgYFxcbmAgK1xuICAgICAgICBgPCFFTEVNRU5UIG1zZyAoI1BDREFUQXxwaHxzb3VyY2UpKj5cXG5gICtcbiAgICAgICAgYDwhQVRUTElTVCBtc2cgaWQgQ0RBVEEgI0lNUExJRUQ+XFxuYCArXG4gICAgICAgIGA8IUFUVExJU1QgbXNnIHNlcSBDREFUQSAjSU1QTElFRD5cXG5gICtcbiAgICAgICAgYDwhQVRUTElTVCBtc2cgbmFtZSBDREFUQSAjSU1QTElFRD5cXG5gICtcbiAgICAgICAgYDwhQVRUTElTVCBtc2cgZGVzYyBDREFUQSAjSU1QTElFRD5cXG5gICtcbiAgICAgICAgYDwhQVRUTElTVCBtc2cgbWVhbmluZyBDREFUQSAjSU1QTElFRD5cXG5gICtcbiAgICAgICAgYDwhQVRUTElTVCBtc2cgb2Jzb2xldGUgKG9ic29sZXRlKSAjSU1QTElFRD5cXG5gICtcbiAgICAgICAgYDwhQVRUTElTVCBtc2cgeG1sOnNwYWNlIChkZWZhdWx0fHByZXNlcnZlKSBcImRlZmF1bHRcIj5cXG5gICtcbiAgICAgICAgYDwhQVRUTElTVCBtc2cgaXNfaGlkZGVuIENEQVRBICNJTVBMSUVEPlxcbmAgK1xuICAgICAgICBgXFxuYCArXG4gICAgICAgIGA8IUVMRU1FTlQgc291cmNlICgjUENEQVRBKT5cXG5gICtcbiAgICAgICAgYFxcbmAgK1xuICAgICAgICBgPCFFTEVNRU5UIHBoICgjUENEQVRBfGV4KSo+XFxuYCArXG4gICAgICAgIGA8IUFUVExJU1QgcGggbmFtZSBDREFUQSAjUkVRVUlSRUQ+XFxuYCArXG4gICAgICAgIGBcXG5gICtcbiAgICAgICAgYDwhRUxFTUVOVCBleCAoI1BDREFUQSk+XFxuYCArXG4gICAgICAgIGBdPlxcbmApO1xuICAgIHhtbC5zdGFydFRhZygnbWVzc2FnZWJ1bmRsZScpO1xuICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiBtZXNzYWdlcykge1xuICAgICAgY29uc3QgaWQgPSB0aGlzLmdldE1lc3NhZ2VJZChtZXNzYWdlKTtcbiAgICAgIGlmIChpZHMuaGFzKGlkKSkge1xuICAgICAgICAvLyBEbyBub3QgcmVuZGVyIHRoZSBzYW1lIG1lc3NhZ2UgbW9yZSB0aGFuIG9uY2VcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZHMuYWRkKGlkKTtcbiAgICAgIHhtbC5zdGFydFRhZyhcbiAgICAgICAgICAnbXNnJywge2lkLCBkZXNjOiBtZXNzYWdlLmRlc2NyaXB0aW9uLCBtZWFuaW5nOiBtZXNzYWdlLm1lYW5pbmd9LFxuICAgICAgICAgIHtwcmVzZXJ2ZVdoaXRlc3BhY2U6IHRydWV9KTtcbiAgICAgIGlmIChtZXNzYWdlLmxvY2F0aW9uKSB7XG4gICAgICAgIHRoaXMuc2VyaWFsaXplTG9jYXRpb24oeG1sLCBtZXNzYWdlLmxvY2F0aW9uKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2VyaWFsaXplTWVzc2FnZSh4bWwsIG1lc3NhZ2UpO1xuICAgICAgeG1sLmVuZFRhZygnbXNnJywge3ByZXNlcnZlV2hpdGVzcGFjZTogZmFsc2V9KTtcbiAgICB9XG4gICAgeG1sLmVuZFRhZygnbWVzc2FnZWJ1bmRsZScpO1xuICAgIHJldHVybiB4bWwudG9TdHJpbmcoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplTG9jYXRpb24oeG1sOiBYbWxGaWxlLCBsb2NhdGlvbjogybVTb3VyY2VMb2NhdGlvbik6IHZvaWQge1xuICAgIHhtbC5zdGFydFRhZygnc291cmNlJyk7XG4gICAgY29uc3QgZW5kTGluZVN0cmluZyA9IGxvY2F0aW9uLmVuZCAhPT0gdW5kZWZpbmVkICYmIGxvY2F0aW9uLmVuZC5saW5lICE9PSBsb2NhdGlvbi5zdGFydC5saW5lID9cbiAgICAgICAgYCwke2xvY2F0aW9uLmVuZC5saW5lICsgMX1gIDpcbiAgICAgICAgJyc7XG4gICAgeG1sLnRleHQoYCR7cmVsYXRpdmUodGhpcy5iYXNlUGF0aCwgbG9jYXRpb24uZmlsZSl9OiR7bG9jYXRpb24uc3RhcnQubGluZX0ke2VuZExpbmVTdHJpbmd9YCk7XG4gICAgeG1sLmVuZFRhZygnc291cmNlJyk7XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZU1lc3NhZ2UoeG1sOiBYbWxGaWxlLCBtZXNzYWdlOiDJtVBhcnNlZE1lc3NhZ2UpOiB2b2lkIHtcbiAgICB4bWwudGV4dChtZXNzYWdlLm1lc3NhZ2VQYXJ0c1swXSk7XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBtZXNzYWdlLm1lc3NhZ2VQYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgeG1sLnN0YXJ0VGFnKCdwaCcsIHtuYW1lOiBtZXNzYWdlLnBsYWNlaG9sZGVyTmFtZXNbaSAtIDFdfSwge3NlbGZDbG9zaW5nOiB0cnVlfSk7XG4gICAgICB4bWwudGV4dChtZXNzYWdlLm1lc3NhZ2VQYXJ0c1tpXSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgaWQgZm9yIHRoZSBnaXZlbiBgbWVzc2FnZWAuXG4gICAqXG4gICAqIElmIHdlIGhhdmUgcmVxdWVzdGVkIGxlZ2FjeSBtZXNzYWdlIGlkcywgdGhlbiB0cnkgdG8gcmV0dXJuIHRoZSBhcHByb3ByaWF0ZSBpZFxuICAgKiBmcm9tIHRoZSBsaXN0IG9mIGxlZ2FjeSBpZHMgdGhhdCB3ZXJlIGV4dHJhY3RlZC5cbiAgICpcbiAgICogT3RoZXJ3aXNlIHJldHVybiB0aGUgY2Fub25pY2FsIG1lc3NhZ2UgaWQuXG4gICAqXG4gICAqIEFuIFhNQiBsZWdhY3kgbWVzc2FnZSBpZCBpcyBhIDY0IGJpdCBudW1iZXIgZW5jb2RlZCBhcyBhIGRlY2ltYWwgc3RyaW5nLCB3aGljaCB3aWxsIGhhdmVcbiAgICogYXQgbW9zdCAyMCBkaWdpdHMsIHNpbmNlIDJeNjUtMSA9IDM2LDg5Myw0ODgsMTQ3LDQxOSwxMDMsMjMxLiBUaGlzIGRpZ2VzdCBpcyBiYXNlZCBvbjpcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS9jbG9zdXJlLWNvbXBpbGVyL2Jsb2IvbWFzdGVyL3NyYy9jb20vZ29vZ2xlL2phdmFzY3JpcHQvanNjb21wL0dvb2dsZUpzTWVzc2FnZUlkR2VuZXJhdG9yLmphdmFcbiAgICovXG4gIHByaXZhdGUgZ2V0TWVzc2FnZUlkKG1lc3NhZ2U6IMm1UGFyc2VkTWVzc2FnZSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudXNlTGVnYWN5SWRzICYmIG1lc3NhZ2UubGVnYWN5SWRzICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgbWVzc2FnZS5sZWdhY3lJZHMuZmluZChpZCA9PiBpZC5sZW5ndGggPD0gMjAgJiYgIS9bXjAtOV0vLnRlc3QoaWQpKSB8fFxuICAgICAgICBtZXNzYWdlLmlkO1xuICB9XG59XG4iXX0=
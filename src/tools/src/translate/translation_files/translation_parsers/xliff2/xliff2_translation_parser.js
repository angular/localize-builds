(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff2/xliff2_translation_parser", ["require", "exports", "tslib", "@angular/compiler", "path", "@angular/localize/src/tools/src/translate/message_renderers/target_message_renderer", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/base_visitor", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_parse_error", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff2/xliff2_message_serializer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var compiler_1 = require("@angular/compiler");
    var path_1 = require("path");
    var target_message_renderer_1 = require("@angular/localize/src/tools/src/translate/message_renderers/target_message_renderer");
    var base_visitor_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/base_visitor");
    var translation_parse_error_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_parse_error");
    var translation_utils_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils");
    var xliff2_message_serializer_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff2/xliff2_message_serializer");
    var XLIFF_2_0_NS_REGEX = /xmlns="urn:oasis:names:tc:xliff:document:2.0"/;
    /**
     * A translation parser that can load translations from XLIFF 2 files.
     *
     * http://docs.oasis-open.org/xliff/xliff-core/v2.0/os/xliff-core-v2.0-os.html
     *
     */
    var Xliff2TranslationParser = /** @class */ (function () {
        function Xliff2TranslationParser() {
        }
        Xliff2TranslationParser.prototype.canParse = function (filePath, contents) {
            return (path_1.extname(filePath) === '.xlf') && XLIFF_2_0_NS_REGEX.test(contents);
        };
        Xliff2TranslationParser.prototype.parse = function (filePath, contents) {
            var xmlParser = new compiler_1.XmlParser();
            var xml = xmlParser.parse(contents, filePath);
            var bundle = Xliff2TranslationBundleVisitor.extractBundle(xml.rootNodes);
            if (bundle === undefined) {
                throw new Error("Unable to parse \"" + filePath + "\" as XLIFF 2.0 format.");
            }
            return bundle;
        };
        return Xliff2TranslationParser;
    }());
    exports.Xliff2TranslationParser = Xliff2TranslationParser;
    var Xliff2TranslationBundleVisitor = /** @class */ (function (_super) {
        tslib_1.__extends(Xliff2TranslationBundleVisitor, _super);
        function Xliff2TranslationBundleVisitor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Xliff2TranslationBundleVisitor.extractBundle = function (xliff) {
            var visitor = new this();
            compiler_1.visitAll(visitor, xliff, {});
            return visitor.bundle;
        };
        Xliff2TranslationBundleVisitor.prototype.visitElement = function (element, _a) {
            var parsedLocale = _a.parsedLocale;
            if (element.name === 'xliff') {
                parsedLocale = translation_utils_1.getAttribute(element, 'trgLang');
                return compiler_1.visitAll(this, element.children, { parsedLocale: parsedLocale });
            }
            else if (element.name === 'file') {
                this.bundle = {
                    locale: parsedLocale,
                    translations: Xliff2TranslationVisitor.extractTranslations(element)
                };
            }
            else {
                return compiler_1.visitAll(this, element.children, { parsedLocale: parsedLocale });
            }
        };
        return Xliff2TranslationBundleVisitor;
    }(base_visitor_1.BaseVisitor));
    var Xliff2TranslationVisitor = /** @class */ (function (_super) {
        tslib_1.__extends(Xliff2TranslationVisitor, _super);
        function Xliff2TranslationVisitor() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.translations = {};
            return _this;
        }
        Xliff2TranslationVisitor.extractTranslations = function (file) {
            var visitor = new this();
            compiler_1.visitAll(visitor, file.children);
            return visitor.translations;
        };
        Xliff2TranslationVisitor.prototype.visitElement = function (element, context) {
            if (element.name === 'unit') {
                var externalId = translation_utils_1.getAttrOrThrow(element, 'id');
                if (this.translations[externalId] !== undefined) {
                    throw new translation_parse_error_1.TranslationParseError(element.sourceSpan, "Duplicated translations for message \"" + externalId + "\"");
                }
                compiler_1.visitAll(this, element.children, { unit: externalId });
            }
            else if (element.name === 'segment') {
                assertTranslationUnit(element, context);
                var targetMessage = element.children.find(isTargetElement);
                if (targetMessage === undefined) {
                    throw new translation_parse_error_1.TranslationParseError(element.sourceSpan, 'Missing required <target> element');
                }
                this.translations[context.unit] = serializeTargetMessage(targetMessage);
            }
            else {
                return compiler_1.visitAll(this, element.children);
            }
        };
        return Xliff2TranslationVisitor;
    }(base_visitor_1.BaseVisitor));
    function assertTranslationUnit(segment, context) {
        if (context === undefined || context.unit === undefined) {
            throw new translation_parse_error_1.TranslationParseError(segment.sourceSpan, 'Invalid <segment> element: should be a child of a <unit> element.');
        }
    }
    function serializeTargetMessage(source) {
        var serializer = new xliff2_message_serializer_1.Xliff2MessageSerializer(new target_message_renderer_1.TargetMessageRenderer());
        return serializer.serialize(translation_utils_1.parseInnerRange(source));
    }
    function isTargetElement(node) {
        return node instanceof compiler_1.Element && node.name === 'target';
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYyX3RyYW5zbGF0aW9uX3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMveGxpZmYyL3hsaWZmMl90cmFuc2xhdGlvbl9wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOENBQXFFO0lBRXJFLDZCQUE2QjtJQUM3QiwrSEFBeUY7SUFDekYsNkhBQTRDO0lBQzVDLG1KQUFpRTtJQUVqRSx1SUFBbUY7SUFDbkYsOEpBQW9FO0lBRXBFLElBQU0sa0JBQWtCLEdBQUcsK0NBQStDLENBQUM7SUFFM0U7Ozs7O09BS0c7SUFDSDtRQUFBO1FBY0EsQ0FBQztRQWJDLDBDQUFRLEdBQVIsVUFBUyxRQUFnQixFQUFFLFFBQWdCO1lBQ3pDLE9BQU8sQ0FBQyxjQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssTUFBTSxDQUFDLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdFLENBQUM7UUFFRCx1Q0FBSyxHQUFMLFVBQU0sUUFBZ0IsRUFBRSxRQUFnQjtZQUN0QyxJQUFNLFNBQVMsR0FBRyxJQUFJLG9CQUFTLEVBQUUsQ0FBQztZQUNsQyxJQUFNLEdBQUcsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNoRCxJQUFNLE1BQU0sR0FBRyw4QkFBOEIsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzNFLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtnQkFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBb0IsUUFBUSw0QkFBd0IsQ0FBQyxDQUFDO2FBQ3ZFO1lBQ0QsT0FB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QUMsUUFBUSxDQUFDLENBQUM7YUFDekM7UUFDSCxDQUFDO1FBQ0gsK0JBQUM7SUFBRCxDQUFDLEFBNUJELENBQXVDLDBCQUFXLEdBNEJqRDtJQUVELFNBQVMscUJBQXFCLENBQUMsT0FBZ0IsRUFBRSxPQUFZO1FBQzNELElBQUksT0FBTyxLQUFLLFNBQVMsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtZQUN2RCxNQUFNLElBQUksK0NBQXFCLENBQzNCLE9BQU8sQ0FBQyxVQUFVLEVBQUUsbUVBQW1FLENBQUMsQ0FBQztTQUM5RjtJQUNILENBQUM7SUFFRCxTQUFTLHNCQUFzQixDQUFDLE1BQWU7UUFDN0MsSUFBTSxVQUFVLEdBQUcsSUFBSSxtREFBdUIsQ0FBQyxJQUFJLCtDQUFxQixFQUFFLENBQUMsQ0FBQztRQUM1RSxPQUFPLFVBQVUsQ0FBQyxTQUFTLENBQUMsbUNBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxTQUFTLGVBQWUsQ0FBQyxJQUFVO1FBQ2pDLE9BQU8sSUFBSSxZQUFZLGtCQUFPLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxRQUFRLENBQUM7SUFDM0QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RWxlbWVudCwgTm9kZSwgWG1sUGFyc2VyLCB2aXNpdEFsbH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0IHvJtU1lc3NhZ2VJZCwgybVQYXJzZWRUcmFuc2xhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuaW1wb3J0IHtleHRuYW1lfSBmcm9tICdwYXRoJztcbmltcG9ydCB7VGFyZ2V0TWVzc2FnZVJlbmRlcmVyfSBmcm9tICcuLi8uLi8uLi9tZXNzYWdlX3JlbmRlcmVycy90YXJnZXRfbWVzc2FnZV9yZW5kZXJlcic7XG5pbXBvcnQge0Jhc2VWaXNpdG9yfSBmcm9tICcuLi9iYXNlX3Zpc2l0b3InO1xuaW1wb3J0IHtUcmFuc2xhdGlvblBhcnNlRXJyb3J9IGZyb20gJy4uL3RyYW5zbGF0aW9uX3BhcnNlX2Vycm9yJztcbmltcG9ydCB7UGFyc2VkVHJhbnNsYXRpb25CdW5kbGUsIFRyYW5zbGF0aW9uUGFyc2VyfSBmcm9tICcuLi90cmFuc2xhdGlvbl9wYXJzZXInO1xuaW1wb3J0IHtnZXRBdHRyT3JUaHJvdywgZ2V0QXR0cmlidXRlLCBwYXJzZUlubmVyUmFuZ2V9IGZyb20gJy4uL3RyYW5zbGF0aW9uX3V0aWxzJztcbmltcG9ydCB7WGxpZmYyTWVzc2FnZVNlcmlhbGl6ZXJ9IGZyb20gJy4veGxpZmYyX21lc3NhZ2Vfc2VyaWFsaXplcic7XG5cbmNvbnN0IFhMSUZGXzJfMF9OU19SRUdFWCA9IC94bWxucz1cInVybjpvYXNpczpuYW1lczp0Yzp4bGlmZjpkb2N1bWVudDoyLjBcIi87XG5cbi8qKlxuICogQSB0cmFuc2xhdGlvbiBwYXJzZXIgdGhhdCBjYW4gbG9hZCB0cmFuc2xhdGlvbnMgZnJvbSBYTElGRiAyIGZpbGVzLlxuICpcbiAqIGh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL3hsaWZmL3hsaWZmLWNvcmUvdjIuMC9vcy94bGlmZi1jb3JlLXYyLjAtb3MuaHRtbFxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIFhsaWZmMlRyYW5zbGF0aW9uUGFyc2VyIGltcGxlbWVudHMgVHJhbnNsYXRpb25QYXJzZXIge1xuICBjYW5QYXJzZShmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChleHRuYW1lKGZpbGVQYXRoKSA9PT0gJy54bGYnKSAmJiBYTElGRl8yXzBfTlNfUkVHRVgudGVzdChjb250ZW50cyk7XG4gIH1cblxuICBwYXJzZShmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nKTogUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUge1xuICAgIGNvbnN0IHhtbFBhcnNlciA9IG5ldyBYbWxQYXJzZXIoKTtcbiAgICBjb25zdCB4bWwgPSB4bWxQYXJzZXIucGFyc2UoY29udGVudHMsIGZpbGVQYXRoKTtcbiAgICBjb25zdCBidW5kbGUgPSBYbGlmZjJUcmFuc2xhdGlvbkJ1bmRsZVZpc2l0b3IuZXh0cmFjdEJ1bmRsZSh4bWwucm9vdE5vZGVzKTtcbiAgICBpZiAoYnVuZGxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIHBhcnNlIFwiJHtmaWxlUGF0aH1cIiBhcyBYTElGRiAyLjAgZm9ybWF0LmApO1xuICAgIH1cbiAgICByZXR1cm4gYnVuZGxlO1xuICB9XG59XG5cbmludGVyZmFjZSBCdW5kbGVWaXNpdG9yQ29udGV4dCB7XG4gIHBhcnNlZExvY2FsZT86IHN0cmluZztcbn1cblxuY2xhc3MgWGxpZmYyVHJhbnNsYXRpb25CdW5kbGVWaXNpdG9yIGV4dGVuZHMgQmFzZVZpc2l0b3Ige1xuICBwcml2YXRlIGJ1bmRsZTogUGFyc2VkVHJhbnNsYXRpb25CdW5kbGV8dW5kZWZpbmVkO1xuXG4gIHN0YXRpYyBleHRyYWN0QnVuZGxlKHhsaWZmOiBOb2RlW10pOiBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZXx1bmRlZmluZWQge1xuICAgIGNvbnN0IHZpc2l0b3IgPSBuZXcgdGhpcygpO1xuICAgIHZpc2l0QWxsKHZpc2l0b3IsIHhsaWZmLCB7fSk7XG4gICAgcmV0dXJuIHZpc2l0b3IuYnVuZGxlO1xuICB9XG5cbiAgdmlzaXRFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQsIHtwYXJzZWRMb2NhbGV9OiBCdW5kbGVWaXNpdG9yQ29udGV4dCk6IGFueSB7XG4gICAgaWYgKGVsZW1lbnQubmFtZSA9PT0gJ3hsaWZmJykge1xuICAgICAgcGFyc2VkTG9jYWxlID0gZ2V0QXR0cmlidXRlKGVsZW1lbnQsICd0cmdMYW5nJyk7XG4gICAgICByZXR1cm4gdmlzaXRBbGwodGhpcywgZWxlbWVudC5jaGlsZHJlbiwge3BhcnNlZExvY2FsZX0pO1xuICAgIH0gZWxzZSBpZiAoZWxlbWVudC5uYW1lID09PSAnZmlsZScpIHtcbiAgICAgIHRoaXMuYnVuZGxlID0ge1xuICAgICAgICBsb2NhbGU6IHBhcnNlZExvY2FsZSxcbiAgICAgICAgdHJhbnNsYXRpb25zOiBYbGlmZjJUcmFuc2xhdGlvblZpc2l0b3IuZXh0cmFjdFRyYW5zbGF0aW9ucyhlbGVtZW50KVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZpc2l0QWxsKHRoaXMsIGVsZW1lbnQuY2hpbGRyZW4sIHtwYXJzZWRMb2NhbGV9KTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgWGxpZmYyVHJhbnNsYXRpb25WaXNpdG9yIGV4dGVuZHMgQmFzZVZpc2l0b3Ige1xuICBwcml2YXRlIHRyYW5zbGF0aW9uczogUmVjb3JkPMm1TWVzc2FnZUlkLCDJtVBhcnNlZFRyYW5zbGF0aW9uPiA9IHt9O1xuXG4gIHN0YXRpYyBleHRyYWN0VHJhbnNsYXRpb25zKGZpbGU6IEVsZW1lbnQpOiBSZWNvcmQ8c3RyaW5nLCDJtVBhcnNlZFRyYW5zbGF0aW9uPiB7XG4gICAgY29uc3QgdmlzaXRvciA9IG5ldyB0aGlzKCk7XG4gICAgdmlzaXRBbGwodmlzaXRvciwgZmlsZS5jaGlsZHJlbik7XG4gICAgcmV0dXJuIHZpc2l0b3IudHJhbnNsYXRpb25zO1xuICB9XG5cbiAgdmlzaXRFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgaWYgKGVsZW1lbnQubmFtZSA9PT0gJ3VuaXQnKSB7XG4gICAgICBjb25zdCBleHRlcm5hbElkID0gZ2V0QXR0ck9yVGhyb3coZWxlbWVudCwgJ2lkJyk7XG4gICAgICBpZiAodGhpcy50cmFuc2xhdGlvbnNbZXh0ZXJuYWxJZF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgVHJhbnNsYXRpb25QYXJzZUVycm9yKFxuICAgICAgICAgICAgZWxlbWVudC5zb3VyY2VTcGFuLCBgRHVwbGljYXRlZCB0cmFuc2xhdGlvbnMgZm9yIG1lc3NhZ2UgXCIke2V4dGVybmFsSWR9XCJgKTtcbiAgICAgIH1cbiAgICAgIHZpc2l0QWxsKHRoaXMsIGVsZW1lbnQuY2hpbGRyZW4sIHt1bml0OiBleHRlcm5hbElkfSk7XG4gICAgfSBlbHNlIGlmIChlbGVtZW50Lm5hbWUgPT09ICdzZWdtZW50Jykge1xuICAgICAgYXNzZXJ0VHJhbnNsYXRpb25Vbml0KGVsZW1lbnQsIGNvbnRleHQpO1xuICAgICAgY29uc3QgdGFyZ2V0TWVzc2FnZSA9IGVsZW1lbnQuY2hpbGRyZW4uZmluZChpc1RhcmdldEVsZW1lbnQpO1xuICAgICAgaWYgKHRhcmdldE1lc3NhZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgVHJhbnNsYXRpb25QYXJzZUVycm9yKGVsZW1lbnQuc291cmNlU3BhbiwgJ01pc3NpbmcgcmVxdWlyZWQgPHRhcmdldD4gZWxlbWVudCcpO1xuICAgICAgfVxuICAgICAgdGhpcy50cmFuc2xhdGlvbnNbY29udGV4dC51bml0XSA9IHNlcmlhbGl6ZVRhcmdldE1lc3NhZ2UodGFyZ2V0TWVzc2FnZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2aXNpdEFsbCh0aGlzLCBlbGVtZW50LmNoaWxkcmVuKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gYXNzZXJ0VHJhbnNsYXRpb25Vbml0KHNlZ21lbnQ6IEVsZW1lbnQsIGNvbnRleHQ6IGFueSkge1xuICBpZiAoY29udGV4dCA9PT0gdW5kZWZpbmVkIHx8IGNvbnRleHQudW5pdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IFRyYW5zbGF0aW9uUGFyc2VFcnJvcihcbiAgICAgICAgc2VnbWVudC5zb3VyY2VTcGFuLCAnSW52YWxpZCA8c2VnbWVudD4gZWxlbWVudDogc2hvdWxkIGJlIGEgY2hpbGQgb2YgYSA8dW5pdD4gZWxlbWVudC4nKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVUYXJnZXRNZXNzYWdlKHNvdXJjZTogRWxlbWVudCk6IMm1UGFyc2VkVHJhbnNsYXRpb24ge1xuICBjb25zdCBzZXJpYWxpemVyID0gbmV3IFhsaWZmMk1lc3NhZ2VTZXJpYWxpemVyKG5ldyBUYXJnZXRNZXNzYWdlUmVuZGVyZXIoKSk7XG4gIHJldHVybiBzZXJpYWxpemVyLnNlcmlhbGl6ZShwYXJzZUlubmVyUmFuZ2Uoc291cmNlKSk7XG59XG5cbmZ1bmN0aW9uIGlzVGFyZ2V0RWxlbWVudChub2RlOiBOb2RlKTogbm9kZSBpcyBFbGVtZW50IHtcbiAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBFbGVtZW50ICYmIG5vZGUubmFtZSA9PT0gJ3RhcmdldCc7XG59XG4iXX0=
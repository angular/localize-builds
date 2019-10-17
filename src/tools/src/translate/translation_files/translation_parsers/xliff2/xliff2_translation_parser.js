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
            compiler_1.visitAll(visitor, xliff);
            return visitor.bundle;
        };
        Xliff2TranslationBundleVisitor.prototype.visitElement = function (element) {
            if (element.name === 'xliff') {
                this.locale = translation_utils_1.getAttrOrThrow(element, 'trgLang');
                return compiler_1.visitAll(this, element.children);
            }
            else if (element.name === 'file') {
                this.bundle = {
                    locale: this.locale,
                    translations: Xliff2TranslationVisitor.extractTranslations(element)
                };
            }
            else {
                return compiler_1.visitAll(this, element.children);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYyX3RyYW5zbGF0aW9uX3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMveGxpZmYyL3hsaWZmMl90cmFuc2xhdGlvbl9wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOENBQXFFO0lBRXJFLDZCQUE2QjtJQUM3QiwrSEFBeUY7SUFFekYsNkhBQTRDO0lBQzVDLG1KQUFpRTtJQUVqRSx1SUFBcUU7SUFDckUsOEpBQW9FO0lBRXBFLElBQU0sa0JBQWtCLEdBQUcsK0NBQStDLENBQUM7SUFFM0U7Ozs7O09BS0c7SUFDSDtRQUFBO1FBY0EsQ0FBQztRQWJDLDBDQUFRLEdBQVIsVUFBUyxRQUFnQixFQUFFLFFBQWdCO1lBQ3pDLE9BQU8sQ0FBQyxjQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssTUFBTSxDQUFDLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdFLENBQUM7UUFFRCx1Q0FBSyxHQUFMLFVBQU0sUUFBZ0IsRUFBRSxRQUFnQjtZQUN0QyxJQUFNLFNBQVMsR0FBRyxJQUFJLG9CQUFTLEVBQUUsQ0FBQztZQUNsQyxJQUFNLEdBQUcsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNoRCxJQUFNLE1BQU0sR0FBRyw4QkFBOEIsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzNFLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtnQkFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBb0IsUUFBUSw0QkFBd0IsQ0FBQyxDQUFDO2FBQ3ZFO1lBQ0QsT0FB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dUMsMEJBQVcsR0E0QmpEO0lBRUQsU0FBUyxxQkFBcUIsQ0FBQyxPQUFnQixFQUFFLE9BQVk7UUFDM0QsSUFBSSxPQUFPLEtBQUssU0FBUyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFO1lBQ3ZELE1BQU0sSUFBSSwrQ0FBcUIsQ0FDM0IsT0FBTyxDQUFDLFVBQVUsRUFBRSxtRUFBbUUsQ0FBQyxDQUFDO1NBQzlGO0lBQ0gsQ0FBQztJQUVELFNBQVMsc0JBQXNCLENBQUMsTUFBZTtRQUM3QyxJQUFNLFVBQVUsR0FBRyxJQUFJLG1EQUF1QixDQUFDLElBQUksK0NBQXFCLEVBQUUsQ0FBQyxDQUFDO1FBQzVFLE9BQU8sVUFBVSxDQUFDLFNBQVMsQ0FBQyxtQ0FBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELFNBQVMsZUFBZSxDQUFDLElBQVU7UUFDakMsT0FBTyxJQUFJLFlBQVksa0JBQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQztJQUMzRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtFbGVtZW50LCBOb2RlLCBYbWxQYXJzZXIsIHZpc2l0QWxsfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5pbXBvcnQge8m1TWVzc2FnZUlkLCDJtVBhcnNlZFRyYW5zbGF0aW9ufSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5pbXBvcnQge2V4dG5hbWV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtUYXJnZXRNZXNzYWdlUmVuZGVyZXJ9IGZyb20gJy4uLy4uLy4uL21lc3NhZ2VfcmVuZGVyZXJzL3RhcmdldF9tZXNzYWdlX3JlbmRlcmVyJztcbmltcG9ydCB7VHJhbnNsYXRpb25CdW5kbGV9IGZyb20gJy4uLy4uLy4uL3RyYW5zbGF0b3InO1xuaW1wb3J0IHtCYXNlVmlzaXRvcn0gZnJvbSAnLi4vYmFzZV92aXNpdG9yJztcbmltcG9ydCB7VHJhbnNsYXRpb25QYXJzZUVycm9yfSBmcm9tICcuLi90cmFuc2xhdGlvbl9wYXJzZV9lcnJvcic7XG5pbXBvcnQge1RyYW5zbGF0aW9uUGFyc2VyfSBmcm9tICcuLi90cmFuc2xhdGlvbl9wYXJzZXInO1xuaW1wb3J0IHtnZXRBdHRyT3JUaHJvdywgcGFyc2VJbm5lclJhbmdlfSBmcm9tICcuLi90cmFuc2xhdGlvbl91dGlscyc7XG5pbXBvcnQge1hsaWZmMk1lc3NhZ2VTZXJpYWxpemVyfSBmcm9tICcuL3hsaWZmMl9tZXNzYWdlX3NlcmlhbGl6ZXInO1xuXG5jb25zdCBYTElGRl8yXzBfTlNfUkVHRVggPSAveG1sbnM9XCJ1cm46b2FzaXM6bmFtZXM6dGM6eGxpZmY6ZG9jdW1lbnQ6Mi4wXCIvO1xuXG4vKipcbiAqIEEgdHJhbnNsYXRpb24gcGFyc2VyIHRoYXQgY2FuIGxvYWQgdHJhbnNsYXRpb25zIGZyb20gWExJRkYgMiBmaWxlcy5cbiAqXG4gKiBodHRwOi8vZG9jcy5vYXNpcy1vcGVuLm9yZy94bGlmZi94bGlmZi1jb3JlL3YyLjAvb3MveGxpZmYtY29yZS12Mi4wLW9zLmh0bWxcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBYbGlmZjJUcmFuc2xhdGlvblBhcnNlciBpbXBsZW1lbnRzIFRyYW5zbGF0aW9uUGFyc2VyIHtcbiAgY2FuUGFyc2UoZmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoZXh0bmFtZShmaWxlUGF0aCkgPT09ICcueGxmJykgJiYgWExJRkZfMl8wX05TX1JFR0VYLnRlc3QoY29udGVudHMpO1xuICB9XG5cbiAgcGFyc2UoZmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZyk6IFRyYW5zbGF0aW9uQnVuZGxlIHtcbiAgICBjb25zdCB4bWxQYXJzZXIgPSBuZXcgWG1sUGFyc2VyKCk7XG4gICAgY29uc3QgeG1sID0geG1sUGFyc2VyLnBhcnNlKGNvbnRlbnRzLCBmaWxlUGF0aCk7XG4gICAgY29uc3QgYnVuZGxlID0gWGxpZmYyVHJhbnNsYXRpb25CdW5kbGVWaXNpdG9yLmV4dHJhY3RCdW5kbGUoeG1sLnJvb3ROb2Rlcyk7XG4gICAgaWYgKGJ1bmRsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBwYXJzZSBcIiR7ZmlsZVBhdGh9XCIgYXMgWExJRkYgMi4wIGZvcm1hdC5gKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ1bmRsZTtcbiAgfVxufVxuXG5jbGFzcyBYbGlmZjJUcmFuc2xhdGlvbkJ1bmRsZVZpc2l0b3IgZXh0ZW5kcyBCYXNlVmlzaXRvciB7XG4gIHByaXZhdGUgbG9jYWxlOiBzdHJpbmd8dW5kZWZpbmVkO1xuICBwcml2YXRlIGJ1bmRsZTogVHJhbnNsYXRpb25CdW5kbGV8dW5kZWZpbmVkO1xuXG4gIHN0YXRpYyBleHRyYWN0QnVuZGxlKHhsaWZmOiBOb2RlW10pOiBUcmFuc2xhdGlvbkJ1bmRsZXx1bmRlZmluZWQge1xuICAgIGNvbnN0IHZpc2l0b3IgPSBuZXcgdGhpcygpO1xuICAgIHZpc2l0QWxsKHZpc2l0b3IsIHhsaWZmKTtcbiAgICByZXR1cm4gdmlzaXRvci5idW5kbGU7XG4gIH1cblxuICB2aXNpdEVsZW1lbnQoZWxlbWVudDogRWxlbWVudCk6IGFueSB7XG4gICAgaWYgKGVsZW1lbnQubmFtZSA9PT0gJ3hsaWZmJykge1xuICAgICAgdGhpcy5sb2NhbGUgPSBnZXRBdHRyT3JUaHJvdyhlbGVtZW50LCAndHJnTGFuZycpO1xuICAgICAgcmV0dXJuIHZpc2l0QWxsKHRoaXMsIGVsZW1lbnQuY2hpbGRyZW4pO1xuICAgIH0gZWxzZSBpZiAoZWxlbWVudC5uYW1lID09PSAnZmlsZScpIHtcbiAgICAgIHRoaXMuYnVuZGxlID0ge1xuICAgICAgICBsb2NhbGU6IHRoaXMubG9jYWxlICEsXG4gICAgICAgIHRyYW5zbGF0aW9uczogWGxpZmYyVHJhbnNsYXRpb25WaXNpdG9yLmV4dHJhY3RUcmFuc2xhdGlvbnMoZWxlbWVudClcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2aXNpdEFsbCh0aGlzLCBlbGVtZW50LmNoaWxkcmVuKTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgWGxpZmYyVHJhbnNsYXRpb25WaXNpdG9yIGV4dGVuZHMgQmFzZVZpc2l0b3Ige1xuICBwcml2YXRlIHRyYW5zbGF0aW9uczogUmVjb3JkPMm1TWVzc2FnZUlkLCDJtVBhcnNlZFRyYW5zbGF0aW9uPiA9IHt9O1xuXG4gIHN0YXRpYyBleHRyYWN0VHJhbnNsYXRpb25zKGZpbGU6IEVsZW1lbnQpOiBSZWNvcmQ8c3RyaW5nLCDJtVBhcnNlZFRyYW5zbGF0aW9uPiB7XG4gICAgY29uc3QgdmlzaXRvciA9IG5ldyB0aGlzKCk7XG4gICAgdmlzaXRBbGwodmlzaXRvciwgZmlsZS5jaGlsZHJlbik7XG4gICAgcmV0dXJuIHZpc2l0b3IudHJhbnNsYXRpb25zO1xuICB9XG5cbiAgdmlzaXRFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgaWYgKGVsZW1lbnQubmFtZSA9PT0gJ3VuaXQnKSB7XG4gICAgICBjb25zdCBleHRlcm5hbElkID0gZ2V0QXR0ck9yVGhyb3coZWxlbWVudCwgJ2lkJyk7XG4gICAgICBpZiAodGhpcy50cmFuc2xhdGlvbnNbZXh0ZXJuYWxJZF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgVHJhbnNsYXRpb25QYXJzZUVycm9yKFxuICAgICAgICAgICAgZWxlbWVudC5zb3VyY2VTcGFuLCBgRHVwbGljYXRlZCB0cmFuc2xhdGlvbnMgZm9yIG1lc3NhZ2UgXCIke2V4dGVybmFsSWR9XCJgKTtcbiAgICAgIH1cbiAgICAgIHZpc2l0QWxsKHRoaXMsIGVsZW1lbnQuY2hpbGRyZW4sIHt1bml0OiBleHRlcm5hbElkfSk7XG4gICAgfSBlbHNlIGlmIChlbGVtZW50Lm5hbWUgPT09ICdzZWdtZW50Jykge1xuICAgICAgYXNzZXJ0VHJhbnNsYXRpb25Vbml0KGVsZW1lbnQsIGNvbnRleHQpO1xuICAgICAgY29uc3QgdGFyZ2V0TWVzc2FnZSA9IGVsZW1lbnQuY2hpbGRyZW4uZmluZChpc1RhcmdldEVsZW1lbnQpO1xuICAgICAgaWYgKHRhcmdldE1lc3NhZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgVHJhbnNsYXRpb25QYXJzZUVycm9yKGVsZW1lbnQuc291cmNlU3BhbiwgJ01pc3NpbmcgcmVxdWlyZWQgPHRhcmdldD4gZWxlbWVudCcpO1xuICAgICAgfVxuICAgICAgdGhpcy50cmFuc2xhdGlvbnNbY29udGV4dC51bml0XSA9IHNlcmlhbGl6ZVRhcmdldE1lc3NhZ2UodGFyZ2V0TWVzc2FnZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2aXNpdEFsbCh0aGlzLCBlbGVtZW50LmNoaWxkcmVuKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gYXNzZXJ0VHJhbnNsYXRpb25Vbml0KHNlZ21lbnQ6IEVsZW1lbnQsIGNvbnRleHQ6IGFueSkge1xuICBpZiAoY29udGV4dCA9PT0gdW5kZWZpbmVkIHx8IGNvbnRleHQudW5pdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IFRyYW5zbGF0aW9uUGFyc2VFcnJvcihcbiAgICAgICAgc2VnbWVudC5zb3VyY2VTcGFuLCAnSW52YWxpZCA8c2VnbWVudD4gZWxlbWVudDogc2hvdWxkIGJlIGEgY2hpbGQgb2YgYSA8dW5pdD4gZWxlbWVudC4nKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVUYXJnZXRNZXNzYWdlKHNvdXJjZTogRWxlbWVudCk6IMm1UGFyc2VkVHJhbnNsYXRpb24ge1xuICBjb25zdCBzZXJpYWxpemVyID0gbmV3IFhsaWZmMk1lc3NhZ2VTZXJpYWxpemVyKG5ldyBUYXJnZXRNZXNzYWdlUmVuZGVyZXIoKSk7XG4gIHJldHVybiBzZXJpYWxpemVyLnNlcmlhbGl6ZShwYXJzZUlubmVyUmFuZ2Uoc291cmNlKSk7XG59XG5cbmZ1bmN0aW9uIGlzVGFyZ2V0RWxlbWVudChub2RlOiBOb2RlKTogbm9kZSBpcyBFbGVtZW50IHtcbiAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBFbGVtZW50ICYmIG5vZGUubmFtZSA9PT0gJ3RhcmdldCc7XG59XG4iXX0=
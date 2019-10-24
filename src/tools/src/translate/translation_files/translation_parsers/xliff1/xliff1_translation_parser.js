(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff1/xliff1_translation_parser", ["require", "exports", "tslib", "@angular/compiler", "path", "@angular/localize/src/tools/src/translate/message_renderers/target_message_renderer", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/base_visitor", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_parse_error", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff1/xliff1_message_serializer"], factory);
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
    var xliff1_message_serializer_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff1/xliff1_message_serializer");
    var XLIFF_1_2_NS_REGEX = /xmlns="urn:oasis:names:tc:xliff:document:1.2"/;
    /**
     * A translation parser that can load XLIFF 1.2 files.
     *
     * http://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html
     * http://docs.oasis-open.org/xliff/v1.2/xliff-profile-html/xliff-profile-html-1.2.html
     *
     */
    var Xliff1TranslationParser = /** @class */ (function () {
        function Xliff1TranslationParser() {
        }
        Xliff1TranslationParser.prototype.canParse = function (filePath, contents) {
            return (path_1.extname(filePath) === '.xlf') && XLIFF_1_2_NS_REGEX.test(contents);
        };
        Xliff1TranslationParser.prototype.parse = function (filePath, contents) {
            var xmlParser = new compiler_1.XmlParser();
            var xml = xmlParser.parse(contents, filePath);
            var bundle = XliffFileElementVisitor.extractBundle(xml.rootNodes);
            if (bundle === undefined) {
                throw new Error("Unable to parse \"" + filePath + "\" as XLIFF 1.2 format.");
            }
            return bundle;
        };
        return Xliff1TranslationParser;
    }());
    exports.Xliff1TranslationParser = Xliff1TranslationParser;
    var XliffFileElementVisitor = /** @class */ (function (_super) {
        tslib_1.__extends(XliffFileElementVisitor, _super);
        function XliffFileElementVisitor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        XliffFileElementVisitor.extractBundle = function (xliff) {
            var visitor = new this();
            compiler_1.visitAll(visitor, xliff);
            return visitor.bundle;
        };
        XliffFileElementVisitor.prototype.visitElement = function (element) {
            if (element.name === 'file') {
                this.bundle = {
                    locale: translation_utils_1.getAttrOrThrow(element, 'target-language'),
                    translations: XliffTranslationVisitor.extractTranslations(element)
                };
            }
            else {
                return compiler_1.visitAll(this, element.children);
            }
        };
        return XliffFileElementVisitor;
    }(base_visitor_1.BaseVisitor));
    var XliffTranslationVisitor = /** @class */ (function (_super) {
        tslib_1.__extends(XliffTranslationVisitor, _super);
        function XliffTranslationVisitor() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.translations = {};
            return _this;
        }
        XliffTranslationVisitor.extractTranslations = function (file) {
            var visitor = new this();
            compiler_1.visitAll(visitor, file.children);
            return visitor.translations;
        };
        XliffTranslationVisitor.prototype.visitElement = function (element) {
            if (element.name === 'trans-unit') {
                var id = translation_utils_1.getAttrOrThrow(element, 'id');
                if (this.translations[id] !== undefined) {
                    throw new translation_parse_error_1.TranslationParseError(element.sourceSpan, "Duplicated translations for message \"" + id + "\"");
                }
                var targetMessage = element.children.find(isTargetElement);
                if (targetMessage === undefined) {
                    throw new translation_parse_error_1.TranslationParseError(element.sourceSpan, 'Missing required <target> element');
                }
                this.translations[id] = serializeTargetMessage(targetMessage);
            }
            else {
                return compiler_1.visitAll(this, element.children);
            }
        };
        return XliffTranslationVisitor;
    }(base_visitor_1.BaseVisitor));
    function serializeTargetMessage(source) {
        var serializer = new xliff1_message_serializer_1.Xliff1MessageSerializer(new target_message_renderer_1.TargetMessageRenderer());
        return serializer.serialize(translation_utils_1.parseInnerRange(source));
    }
    function isTargetElement(node) {
        return node instanceof compiler_1.Element && node.name === 'target';
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYxX3RyYW5zbGF0aW9uX3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMveGxpZmYxL3hsaWZmMV90cmFuc2xhdGlvbl9wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOENBQXFFO0lBRXJFLDZCQUE2QjtJQUM3QiwrSEFBeUY7SUFFekYsNkhBQTRDO0lBQzVDLG1KQUFpRTtJQUVqRSx1SUFBcUU7SUFDckUsOEpBQW9FO0lBRXBFLElBQU0sa0JBQWtCLEdBQUcsK0NBQStDLENBQUM7SUFFM0U7Ozs7OztPQU1HO0lBQ0g7UUFBQTtRQWNBLENBQUM7UUFiQywwQ0FBUSxHQUFSLFVBQVMsUUFBZ0IsRUFBRSxRQUFnQjtZQUN6QyxPQUFPLENBQUMsY0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM3RSxDQUFDO1FBRUQsdUNBQUssR0FBTCxVQUFNLFFBQWdCLEVBQUUsUUFBZ0I7WUFDdEMsSUFBTSxTQUFTLEdBQUcsSUFBSSxvQkFBUyxFQUFFLENBQUM7WUFDbEMsSUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDaEQsSUFBTSxNQUFNLEdBQUcsdUJBQXVCLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNwRSxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7Z0JBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQW9CLFFBQVEsNEJBQXdCLENBQUMsQ0FBQzthQUN2RTtZQUNELE9BQU8sTUFBTSxDQUFDO1FBQ2hCLENBQUM7UUFDSCw4QkFBQztJQUFELENBQUMsQUFkRCxJQWNDO0lBZFksMERBQXVCO0lBZ0JwQztRQUFzQyxtREFBVztRQUFqRDs7UUFtQkEsQ0FBQztRQWhCUSxxQ0FBYSxHQUFwQixVQUFxQixLQUFhO1lBQ2hDLElBQU0sT0FBTyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7WUFDM0IsbUJBQVEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDekIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQ3hCLENBQUM7UUFFRCw4Q0FBWSxHQUFaLFVBQWEsT0FBZ0I7WUFDM0IsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtnQkFDM0IsSUFBSSxDQUFDLE1BQU0sR0FBRztvQkFDWixNQUFNLEVBQUUsa0NBQWMsQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLENBQUM7b0JBQ2xELFlBQVksRUFBRSx1QkFBdUIsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUM7aUJBQ25FLENBQUM7YUFDSDtpQkFBTTtnQkFDTCxPQUFPLG1CQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUN6QztRQUNILENBQUM7UUFDSCw4QkFBQztJQUFELENBQUMsQUFuQkQsQ0FBc0MsMEJBQVcsR0FtQmhEO0lBRUQ7UUFBc0MsbURBQVc7UUFBakQ7WUFBQSxxRUEwQkM7WUF6QlMsa0JBQVksR0FBMkMsRUFBRSxDQUFDOztRQXlCcEUsQ0FBQztRQXZCUSwyQ0FBbUIsR0FBMUIsVUFBMkIsSUFBYTtZQUN0QyxJQUFNLE9BQU8sR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQzNCLG1CQUFRLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNqQyxPQUFPLE9BQU8sQ0FBQyxZQUFZLENBQUM7UUFDOUIsQ0FBQztRQUVELDhDQUFZLEdBQVosVUFBYSxPQUFnQjtZQUMzQixJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssWUFBWSxFQUFFO2dCQUNqQyxJQUFNLEVBQUUsR0FBRyxrQ0FBYyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDekMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxLQUFLLFNBQVMsRUFBRTtvQkFDdkMsTUFBTSxJQUFJLCtDQUFxQixDQUMzQixPQUFPLENBQUMsVUFBVSxFQUFFLDJDQUF3QyxFQUFFLE9BQUcsQ0FBQyxDQUFDO2lCQUN4RTtnQkFFRCxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDN0QsSUFBSSxhQUFhLEtBQUssU0FBUyxFQUFFO29CQUMvQixNQUFNLElBQUksK0NBQXFCLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxtQ0FBbUMsQ0FBQyxDQUFDO2lCQUMxRjtnQkFDRCxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxHQUFHLHNCQUFzQixDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQy9EO2lCQUFNO2dCQUNMLE9BQU8sbUJBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ3pDO1FBQ0gsQ0FBQztRQUNILDhCQUFDO0lBQUQsQ0FBQyxBQTFCRCxDQUFzQywwQkFBVyxHQTBCaEQ7SUFFRCxTQUFTLHNCQUFzQixDQUFDLE1BQWU7UUFDN0MsSUFBTSxVQUFVLEdBQUcsSUFBSSxtREFBdUIsQ0FBQyxJQUFJLCtDQUFxQixFQUFFLENBQUMsQ0FBQztRQUM1RSxPQUFPLFVBQVUsQ0FBQyxTQUFTLENBQUMsbUNBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxTQUFTLGVBQWUsQ0FBQyxJQUFVO1FBQ2pDLE9BQU8sSUFBSSxZQUFZLGtCQUFPLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxRQUFRLENBQUM7SUFDM0QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RWxlbWVudCwgTm9kZSwgWG1sUGFyc2VyLCB2aXNpdEFsbH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0IHvJtU1lc3NhZ2VJZCwgybVQYXJzZWRUcmFuc2xhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuaW1wb3J0IHtleHRuYW1lfSBmcm9tICdwYXRoJztcbmltcG9ydCB7VGFyZ2V0TWVzc2FnZVJlbmRlcmVyfSBmcm9tICcuLi8uLi8uLi9tZXNzYWdlX3JlbmRlcmVycy90YXJnZXRfbWVzc2FnZV9yZW5kZXJlcic7XG5pbXBvcnQge1RyYW5zbGF0aW9uQnVuZGxlfSBmcm9tICcuLi8uLi8uLi90cmFuc2xhdG9yJztcbmltcG9ydCB7QmFzZVZpc2l0b3J9IGZyb20gJy4uL2Jhc2VfdmlzaXRvcic7XG5pbXBvcnQge1RyYW5zbGF0aW9uUGFyc2VFcnJvcn0gZnJvbSAnLi4vdHJhbnNsYXRpb25fcGFyc2VfZXJyb3InO1xuaW1wb3J0IHtUcmFuc2xhdGlvblBhcnNlcn0gZnJvbSAnLi4vdHJhbnNsYXRpb25fcGFyc2VyJztcbmltcG9ydCB7Z2V0QXR0ck9yVGhyb3csIHBhcnNlSW5uZXJSYW5nZX0gZnJvbSAnLi4vdHJhbnNsYXRpb25fdXRpbHMnO1xuaW1wb3J0IHtYbGlmZjFNZXNzYWdlU2VyaWFsaXplcn0gZnJvbSAnLi94bGlmZjFfbWVzc2FnZV9zZXJpYWxpemVyJztcblxuY29uc3QgWExJRkZfMV8yX05TX1JFR0VYID0gL3htbG5zPVwidXJuOm9hc2lzOm5hbWVzOnRjOnhsaWZmOmRvY3VtZW50OjEuMlwiLztcblxuLyoqXG4gKiBBIHRyYW5zbGF0aW9uIHBhcnNlciB0aGF0IGNhbiBsb2FkIFhMSUZGIDEuMiBmaWxlcy5cbiAqXG4gKiBodHRwOi8vZG9jcy5vYXNpcy1vcGVuLm9yZy94bGlmZi92MS4yL29zL3hsaWZmLWNvcmUuaHRtbFxuICogaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcveGxpZmYvdjEuMi94bGlmZi1wcm9maWxlLWh0bWwveGxpZmYtcHJvZmlsZS1odG1sLTEuMi5odG1sXG4gKlxuICovXG5leHBvcnQgY2xhc3MgWGxpZmYxVHJhbnNsYXRpb25QYXJzZXIgaW1wbGVtZW50cyBUcmFuc2xhdGlvblBhcnNlciB7XG4gIGNhblBhcnNlKGZpbGVQYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKGV4dG5hbWUoZmlsZVBhdGgpID09PSAnLnhsZicpICYmIFhMSUZGXzFfMl9OU19SRUdFWC50ZXN0KGNvbnRlbnRzKTtcbiAgfVxuXG4gIHBhcnNlKGZpbGVQYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcpOiBUcmFuc2xhdGlvbkJ1bmRsZSB7XG4gICAgY29uc3QgeG1sUGFyc2VyID0gbmV3IFhtbFBhcnNlcigpO1xuICAgIGNvbnN0IHhtbCA9IHhtbFBhcnNlci5wYXJzZShjb250ZW50cywgZmlsZVBhdGgpO1xuICAgIGNvbnN0IGJ1bmRsZSA9IFhsaWZmRmlsZUVsZW1lbnRWaXNpdG9yLmV4dHJhY3RCdW5kbGUoeG1sLnJvb3ROb2Rlcyk7XG4gICAgaWYgKGJ1bmRsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBwYXJzZSBcIiR7ZmlsZVBhdGh9XCIgYXMgWExJRkYgMS4yIGZvcm1hdC5gKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ1bmRsZTtcbiAgfVxufVxuXG5jbGFzcyBYbGlmZkZpbGVFbGVtZW50VmlzaXRvciBleHRlbmRzIEJhc2VWaXNpdG9yIHtcbiAgcHJpdmF0ZSBidW5kbGU6IFRyYW5zbGF0aW9uQnVuZGxlfHVuZGVmaW5lZDtcblxuICBzdGF0aWMgZXh0cmFjdEJ1bmRsZSh4bGlmZjogTm9kZVtdKTogVHJhbnNsYXRpb25CdW5kbGV8dW5kZWZpbmVkIHtcbiAgICBjb25zdCB2aXNpdG9yID0gbmV3IHRoaXMoKTtcbiAgICB2aXNpdEFsbCh2aXNpdG9yLCB4bGlmZik7XG4gICAgcmV0dXJuIHZpc2l0b3IuYnVuZGxlO1xuICB9XG5cbiAgdmlzaXRFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQpOiBhbnkge1xuICAgIGlmIChlbGVtZW50Lm5hbWUgPT09ICdmaWxlJykge1xuICAgICAgdGhpcy5idW5kbGUgPSB7XG4gICAgICAgIGxvY2FsZTogZ2V0QXR0ck9yVGhyb3coZWxlbWVudCwgJ3RhcmdldC1sYW5ndWFnZScpLFxuICAgICAgICB0cmFuc2xhdGlvbnM6IFhsaWZmVHJhbnNsYXRpb25WaXNpdG9yLmV4dHJhY3RUcmFuc2xhdGlvbnMoZWxlbWVudClcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2aXNpdEFsbCh0aGlzLCBlbGVtZW50LmNoaWxkcmVuKTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgWGxpZmZUcmFuc2xhdGlvblZpc2l0b3IgZXh0ZW5kcyBCYXNlVmlzaXRvciB7XG4gIHByaXZhdGUgdHJhbnNsYXRpb25zOiBSZWNvcmQ8ybVNZXNzYWdlSWQsIMm1UGFyc2VkVHJhbnNsYXRpb24+ID0ge307XG5cbiAgc3RhdGljIGV4dHJhY3RUcmFuc2xhdGlvbnMoZmlsZTogRWxlbWVudCk6IFJlY29yZDxzdHJpbmcsIMm1UGFyc2VkVHJhbnNsYXRpb24+IHtcbiAgICBjb25zdCB2aXNpdG9yID0gbmV3IHRoaXMoKTtcbiAgICB2aXNpdEFsbCh2aXNpdG9yLCBmaWxlLmNoaWxkcmVuKTtcbiAgICByZXR1cm4gdmlzaXRvci50cmFuc2xhdGlvbnM7XG4gIH1cblxuICB2aXNpdEVsZW1lbnQoZWxlbWVudDogRWxlbWVudCk6IGFueSB7XG4gICAgaWYgKGVsZW1lbnQubmFtZSA9PT0gJ3RyYW5zLXVuaXQnKSB7XG4gICAgICBjb25zdCBpZCA9IGdldEF0dHJPclRocm93KGVsZW1lbnQsICdpZCcpO1xuICAgICAgaWYgKHRoaXMudHJhbnNsYXRpb25zW2lkXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBUcmFuc2xhdGlvblBhcnNlRXJyb3IoXG4gICAgICAgICAgICBlbGVtZW50LnNvdXJjZVNwYW4sIGBEdXBsaWNhdGVkIHRyYW5zbGF0aW9ucyBmb3IgbWVzc2FnZSBcIiR7aWR9XCJgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdGFyZ2V0TWVzc2FnZSA9IGVsZW1lbnQuY2hpbGRyZW4uZmluZChpc1RhcmdldEVsZW1lbnQpO1xuICAgICAgaWYgKHRhcmdldE1lc3NhZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgVHJhbnNsYXRpb25QYXJzZUVycm9yKGVsZW1lbnQuc291cmNlU3BhbiwgJ01pc3NpbmcgcmVxdWlyZWQgPHRhcmdldD4gZWxlbWVudCcpO1xuICAgICAgfVxuICAgICAgdGhpcy50cmFuc2xhdGlvbnNbaWRdID0gc2VyaWFsaXplVGFyZ2V0TWVzc2FnZSh0YXJnZXRNZXNzYWdlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZpc2l0QWxsKHRoaXMsIGVsZW1lbnQuY2hpbGRyZW4pO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVUYXJnZXRNZXNzYWdlKHNvdXJjZTogRWxlbWVudCk6IMm1UGFyc2VkVHJhbnNsYXRpb24ge1xuICBjb25zdCBzZXJpYWxpemVyID0gbmV3IFhsaWZmMU1lc3NhZ2VTZXJpYWxpemVyKG5ldyBUYXJnZXRNZXNzYWdlUmVuZGVyZXIoKSk7XG4gIHJldHVybiBzZXJpYWxpemVyLnNlcmlhbGl6ZShwYXJzZUlubmVyUmFuZ2Uoc291cmNlKSk7XG59XG5cbmZ1bmN0aW9uIGlzVGFyZ2V0RWxlbWVudChub2RlOiBOb2RlKTogbm9kZSBpcyBFbGVtZW50IHtcbiAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBFbGVtZW50ICYmIG5vZGUubmFtZSA9PT0gJ3RhcmdldCc7XG59XG4iXX0=
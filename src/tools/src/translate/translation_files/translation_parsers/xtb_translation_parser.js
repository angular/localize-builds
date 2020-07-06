(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xtb_translation_parser", ["require", "exports", "tslib", "@angular/compiler", "path", "@angular/localize/src/tools/src/diagnostics", "@angular/localize/src/tools/src/translate/translation_files/base_visitor", "@angular/localize/src/tools/src/translate/translation_files/message_serialization/message_serializer", "@angular/localize/src/tools/src/translate/translation_files/message_serialization/target_message_renderer", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XtbTranslationParser = void 0;
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var compiler_1 = require("@angular/compiler");
    var path_1 = require("path");
    var diagnostics_1 = require("@angular/localize/src/tools/src/diagnostics");
    var base_visitor_1 = require("@angular/localize/src/tools/src/translate/translation_files/base_visitor");
    var message_serializer_1 = require("@angular/localize/src/tools/src/translate/translation_files/message_serialization/message_serializer");
    var target_message_renderer_1 = require("@angular/localize/src/tools/src/translate/translation_files/message_serialization/target_message_renderer");
    var translation_utils_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils");
    /**
     * A translation parser that can load XTB files.
     *
     * http://cldr.unicode.org/development/development-process/design-proposals/xmb
     *
     * @see XmbTranslationSerializer
     */
    var XtbTranslationParser = /** @class */ (function () {
        function XtbTranslationParser() {
        }
        /**
         * @deprecated
         */
        XtbTranslationParser.prototype.canParse = function (filePath, contents) {
            var result = this.analyze(filePath, contents);
            return result.canParse && result.hint;
        };
        XtbTranslationParser.prototype.analyze = function (filePath, contents) {
            var extension = path_1.extname(filePath);
            if (extension !== '.xtb' && extension !== '.xmb') {
                var diagnostics = new diagnostics_1.Diagnostics();
                diagnostics.warn('Must have xtb or xmb extension.');
                return { canParse: false, diagnostics: diagnostics };
            }
            return translation_utils_1.canParseXml(filePath, contents, 'translationbundle', {});
        };
        XtbTranslationParser.prototype.parse = function (filePath, contents, hint) {
            if (hint) {
                return this.extractBundle(hint);
            }
            else {
                return this.extractBundleDeprecated(filePath, contents);
            }
        };
        XtbTranslationParser.prototype.extractBundle = function (_a) {
            var element = _a.element, errors = _a.errors;
            var langAttr = element.attrs.find(function (attr) { return attr.name === 'lang'; });
            var bundle = {
                locale: langAttr && langAttr.value,
                translations: {},
                diagnostics: new diagnostics_1.Diagnostics()
            };
            errors.forEach(function (e) { return translation_utils_1.addParseError(bundle.diagnostics, e); });
            var bundleVisitor = new XtbVisitor();
            compiler_1.visitAll(bundleVisitor, element.children, bundle);
            return bundle;
        };
        XtbTranslationParser.prototype.extractBundleDeprecated = function (filePath, contents) {
            var hint = this.canParse(filePath, contents);
            if (!hint) {
                throw new Error("Unable to parse \"" + filePath + "\" as XMB/XTB format.");
            }
            var bundle = this.extractBundle(hint);
            if (bundle.diagnostics.hasErrors) {
                var message = bundle.diagnostics.formatDiagnostics("Failed to parse \"" + filePath + "\" as XMB/XTB format");
                throw new Error(message);
            }
            return bundle;
        };
        return XtbTranslationParser;
    }());
    exports.XtbTranslationParser = XtbTranslationParser;
    var XtbVisitor = /** @class */ (function (_super) {
        tslib_1.__extends(XtbVisitor, _super);
        function XtbVisitor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        XtbVisitor.prototype.visitElement = function (element, bundle) {
            switch (element.name) {
                case 'translation':
                    // Error if no `id` attribute
                    var id = translation_utils_1.getAttribute(element, 'id');
                    if (id === undefined) {
                        translation_utils_1.addParseDiagnostic(bundle.diagnostics, element.sourceSpan, "Missing required \"id\" attribute on <translation> element.", compiler_1.ParseErrorLevel.ERROR);
                        return;
                    }
                    // Error if there is already a translation with the same id
                    if (bundle.translations[id] !== undefined) {
                        translation_utils_1.addParseDiagnostic(bundle.diagnostics, element.sourceSpan, "Duplicated translations for message \"" + id + "\"", compiler_1.ParseErrorLevel.ERROR);
                        return;
                    }
                    try {
                        bundle.translations[id] = serializeTargetMessage(element);
                    }
                    catch (error) {
                        if (typeof error === 'string') {
                            bundle.diagnostics.warn("Could not parse message with id \"" + id + "\" - perhaps it has an unrecognised ICU format?\n" +
                                error);
                        }
                        else if (error.span && error.msg && error.level) {
                            translation_utils_1.addParseDiagnostic(bundle.diagnostics, error.span, error.msg, error.level);
                        }
                        else {
                            throw error;
                        }
                    }
                    break;
                default:
                    translation_utils_1.addParseDiagnostic(bundle.diagnostics, element.sourceSpan, "Unexpected <" + element.name + "> tag.", compiler_1.ParseErrorLevel.ERROR);
            }
        };
        return XtbVisitor;
    }(base_visitor_1.BaseVisitor));
    function serializeTargetMessage(source) {
        var serializer = new message_serializer_1.MessageSerializer(new target_message_renderer_1.TargetMessageRenderer(), { inlineElements: [], placeholder: { elementName: 'ph', nameAttribute: 'name' } });
        return serializer.serialize(translation_utils_1.parseInnerRange(source));
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieHRiX3RyYW5zbGF0aW9uX3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMveHRiX3RyYW5zbGF0aW9uX3BhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOENBQXFFO0lBRXJFLDZCQUE2QjtJQUU3QiwyRUFBaUQ7SUFDakQseUdBQTRDO0lBQzVDLDJJQUE4RTtJQUM5RSxxSkFBdUY7SUFHdkYsdUlBQTRJO0lBRzVJOzs7Ozs7T0FNRztJQUNIO1FBQUE7UUF1REEsQ0FBQztRQXREQzs7V0FFRztRQUNILHVDQUFRLEdBQVIsVUFBUyxRQUFnQixFQUFFLFFBQWdCO1lBQ3pDLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2hELE9BQU8sTUFBTSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ3hDLENBQUM7UUFFRCxzQ0FBTyxHQUFQLFVBQVEsUUFBZ0IsRUFBRSxRQUFnQjtZQUN4QyxJQUFNLFNBQVMsR0FBRyxjQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEMsSUFBSSxTQUFTLEtBQUssTUFBTSxJQUFJLFNBQVMsS0FBSyxNQUFNLEVBQUU7Z0JBQ2hELElBQU0sV0FBVyxHQUFHLElBQUkseUJBQVcsRUFBRSxDQUFDO2dCQUN0QyxXQUFXLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7Z0JBQ3BELE9BQU8sRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLFdBQVcsYUFBQSxFQUFDLENBQUM7YUFDdkM7WUFDRCxPQUFPLCtCQUFXLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxt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QU0sQ0FBQyxDQUFDLENBQUM7SUFDdkQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtFbGVtZW50LCBQYXJzZUVycm9yTGV2ZWwsIHZpc2l0QWxsfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5pbXBvcnQge8m1UGFyc2VkVHJhbnNsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcbmltcG9ydCB7ZXh0bmFtZX0gZnJvbSAncGF0aCc7XG5cbmltcG9ydCB7RGlhZ25vc3RpY3N9IGZyb20gJy4uLy4uLy4uL2RpYWdub3N0aWNzJztcbmltcG9ydCB7QmFzZVZpc2l0b3J9IGZyb20gJy4uL2Jhc2VfdmlzaXRvcic7XG5pbXBvcnQge01lc3NhZ2VTZXJpYWxpemVyfSBmcm9tICcuLi9tZXNzYWdlX3NlcmlhbGl6YXRpb24vbWVzc2FnZV9zZXJpYWxpemVyJztcbmltcG9ydCB7VGFyZ2V0TWVzc2FnZVJlbmRlcmVyfSBmcm9tICcuLi9tZXNzYWdlX3NlcmlhbGl6YXRpb24vdGFyZ2V0X21lc3NhZ2VfcmVuZGVyZXInO1xuXG5pbXBvcnQge1BhcnNlQW5hbHlzaXMsIFBhcnNlZFRyYW5zbGF0aW9uQnVuZGxlLCBUcmFuc2xhdGlvblBhcnNlcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9wYXJzZXInO1xuaW1wb3J0IHthZGRQYXJzZURpYWdub3N0aWMsIGFkZFBhcnNlRXJyb3IsIGNhblBhcnNlWG1sLCBnZXRBdHRyaWJ1dGUsIHBhcnNlSW5uZXJSYW5nZSwgWG1sVHJhbnNsYXRpb25QYXJzZXJIaW50fSBmcm9tICcuL3RyYW5zbGF0aW9uX3V0aWxzJztcblxuXG4vKipcbiAqIEEgdHJhbnNsYXRpb24gcGFyc2VyIHRoYXQgY2FuIGxvYWQgWFRCIGZpbGVzLlxuICpcbiAqIGh0dHA6Ly9jbGRyLnVuaWNvZGUub3JnL2RldmVsb3BtZW50L2RldmVsb3BtZW50LXByb2Nlc3MvZGVzaWduLXByb3Bvc2Fscy94bWJcbiAqXG4gKiBAc2VlIFhtYlRyYW5zbGF0aW9uU2VyaWFsaXplclxuICovXG5leHBvcnQgY2xhc3MgWHRiVHJhbnNsYXRpb25QYXJzZXIgaW1wbGVtZW50cyBUcmFuc2xhdGlvblBhcnNlcjxYbWxUcmFuc2xhdGlvblBhcnNlckhpbnQ+IHtcbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICBjYW5QYXJzZShmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nKTogWG1sVHJhbnNsYXRpb25QYXJzZXJIaW50fGZhbHNlIHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLmFuYWx5emUoZmlsZVBhdGgsIGNvbnRlbnRzKTtcbiAgICByZXR1cm4gcmVzdWx0LmNhblBhcnNlICYmIHJlc3VsdC5oaW50O1xuICB9XG5cbiAgYW5hbHl6ZShmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nKTogUGFyc2VBbmFseXNpczxYbWxUcmFuc2xhdGlvblBhcnNlckhpbnQ+IHtcbiAgICBjb25zdCBleHRlbnNpb24gPSBleHRuYW1lKGZpbGVQYXRoKTtcbiAgICBpZiAoZXh0ZW5zaW9uICE9PSAnLnh0YicgJiYgZXh0ZW5zaW9uICE9PSAnLnhtYicpIHtcbiAgICAgIGNvbnN0IGRpYWdub3N0aWNzID0gbmV3IERpYWdub3N0aWNzKCk7XG4gICAgICBkaWFnbm9zdGljcy53YXJuKCdNdXN0IGhhdmUgeHRiIG9yIHhtYiBleHRlbnNpb24uJyk7XG4gICAgICByZXR1cm4ge2NhblBhcnNlOiBmYWxzZSwgZGlhZ25vc3RpY3N9O1xuICAgIH1cbiAgICByZXR1cm4gY2FuUGFyc2VYbWwoZmlsZVBhdGgsIGNvbnRlbnRzLCAndHJhbnNsYXRpb25idW5kbGUnLCB7fSk7XG4gIH1cblxuICBwYXJzZShmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nLCBoaW50PzogWG1sVHJhbnNsYXRpb25QYXJzZXJIaW50KTpcbiAgICAgIFBhcnNlZFRyYW5zbGF0aW9uQnVuZGxlIHtcbiAgICBpZiAoaGludCkge1xuICAgICAgcmV0dXJuIHRoaXMuZXh0cmFjdEJ1bmRsZShoaW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZXh0cmFjdEJ1bmRsZURlcHJlY2F0ZWQoZmlsZVBhdGgsIGNvbnRlbnRzKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGV4dHJhY3RCdW5kbGUoe2VsZW1lbnQsIGVycm9yc306IFhtbFRyYW5zbGF0aW9uUGFyc2VySGludCk6IFBhcnNlZFRyYW5zbGF0aW9uQnVuZGxlIHtcbiAgICBjb25zdCBsYW5nQXR0ciA9IGVsZW1lbnQuYXR0cnMuZmluZCgoYXR0cikgPT4gYXR0ci5uYW1lID09PSAnbGFuZycpO1xuICAgIGNvbnN0IGJ1bmRsZTogUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUgPSB7XG4gICAgICBsb2NhbGU6IGxhbmdBdHRyICYmIGxhbmdBdHRyLnZhbHVlLFxuICAgICAgdHJhbnNsYXRpb25zOiB7fSxcbiAgICAgIGRpYWdub3N0aWNzOiBuZXcgRGlhZ25vc3RpY3MoKVxuICAgIH07XG4gICAgZXJyb3JzLmZvckVhY2goZSA9PiBhZGRQYXJzZUVycm9yKGJ1bmRsZS5kaWFnbm9zdGljcywgZSkpO1xuXG4gICAgY29uc3QgYnVuZGxlVmlzaXRvciA9IG5ldyBYdGJWaXNpdG9yKCk7XG4gICAgdmlzaXRBbGwoYnVuZGxlVmlzaXRvciwgZWxlbWVudC5jaGlsZHJlbiwgYnVuZGxlKTtcbiAgICByZXR1cm4gYnVuZGxlO1xuICB9XG5cbiAgcHJpdmF0ZSBleHRyYWN0QnVuZGxlRGVwcmVjYXRlZChmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nKSB7XG4gICAgY29uc3QgaGludCA9IHRoaXMuY2FuUGFyc2UoZmlsZVBhdGgsIGNvbnRlbnRzKTtcbiAgICBpZiAoIWhpbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIHBhcnNlIFwiJHtmaWxlUGF0aH1cIiBhcyBYTUIvWFRCIGZvcm1hdC5gKTtcbiAgICB9XG4gICAgY29uc3QgYnVuZGxlID0gdGhpcy5leHRyYWN0QnVuZGxlKGhpbnQpO1xuICAgIGlmIChidW5kbGUuZGlhZ25vc3RpY3MuaGFzRXJyb3JzKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID1cbiAgICAgICAgICBidW5kbGUuZGlhZ25vc3RpY3MuZm9ybWF0RGlhZ25vc3RpY3MoYEZhaWxlZCB0byBwYXJzZSBcIiR7ZmlsZVBhdGh9XCIgYXMgWE1CL1hUQiBmb3JtYXRgKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ1bmRsZTtcbiAgfVxufVxuXG5jbGFzcyBYdGJWaXNpdG9yIGV4dGVuZHMgQmFzZVZpc2l0b3Ige1xuICB2aXNpdEVsZW1lbnQoZWxlbWVudDogRWxlbWVudCwgYnVuZGxlOiBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSk6IGFueSB7XG4gICAgc3dpdGNoIChlbGVtZW50Lm5hbWUpIHtcbiAgICAgIGNhc2UgJ3RyYW5zbGF0aW9uJzpcbiAgICAgICAgLy8gRXJyb3IgaWYgbm8gYGlkYCBhdHRyaWJ1dGVcbiAgICAgICAgY29uc3QgaWQgPSBnZXRBdHRyaWJ1dGUoZWxlbWVudCwgJ2lkJyk7XG4gICAgICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgYWRkUGFyc2VEaWFnbm9zdGljKFxuICAgICAgICAgICAgICBidW5kbGUuZGlhZ25vc3RpY3MsIGVsZW1lbnQuc291cmNlU3BhbixcbiAgICAgICAgICAgICAgYE1pc3NpbmcgcmVxdWlyZWQgXCJpZFwiIGF0dHJpYnV0ZSBvbiA8dHJhbnNsYXRpb24+IGVsZW1lbnQuYCwgUGFyc2VFcnJvckxldmVsLkVSUk9SKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBFcnJvciBpZiB0aGVyZSBpcyBhbHJlYWR5IGEgdHJhbnNsYXRpb24gd2l0aCB0aGUgc2FtZSBpZFxuICAgICAgICBpZiAoYnVuZGxlLnRyYW5zbGF0aW9uc1tpZF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGFkZFBhcnNlRGlhZ25vc3RpYyhcbiAgICAgICAgICAgICAgYnVuZGxlLmRpYWdub3N0aWNzLCBlbGVtZW50LnNvdXJjZVNwYW4sIGBEdXBsaWNhdGVkIHRyYW5zbGF0aW9ucyBmb3IgbWVzc2FnZSBcIiR7aWR9XCJgLFxuICAgICAgICAgICAgICBQYXJzZUVycm9yTGV2ZWwuRVJST1IpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYnVuZGxlLnRyYW5zbGF0aW9uc1tpZF0gPSBzZXJpYWxpemVUYXJnZXRNZXNzYWdlKGVsZW1lbnQpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGlmICh0eXBlb2YgZXJyb3IgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBidW5kbGUuZGlhZ25vc3RpY3Mud2FybihcbiAgICAgICAgICAgICAgICBgQ291bGQgbm90IHBhcnNlIG1lc3NhZ2Ugd2l0aCBpZCBcIiR7XG4gICAgICAgICAgICAgICAgICAgIGlkfVwiIC0gcGVyaGFwcyBpdCBoYXMgYW4gdW5yZWNvZ25pc2VkIElDVSBmb3JtYXQ/XFxuYCArXG4gICAgICAgICAgICAgICAgZXJyb3IpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3Iuc3BhbiAmJiBlcnJvci5tc2cgJiYgZXJyb3IubGV2ZWwpIHtcbiAgICAgICAgICAgIGFkZFBhcnNlRGlhZ25vc3RpYyhidW5kbGUuZGlhZ25vc3RpY3MsIGVycm9yLnNwYW4sIGVycm9yLm1zZywgZXJyb3IubGV2ZWwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFkZFBhcnNlRGlhZ25vc3RpYyhcbiAgICAgICAgICAgIGJ1bmRsZS5kaWFnbm9zdGljcywgZWxlbWVudC5zb3VyY2VTcGFuLCBgVW5leHBlY3RlZCA8JHtlbGVtZW50Lm5hbWV9PiB0YWcuYCxcbiAgICAgICAgICAgIFBhcnNlRXJyb3JMZXZlbC5FUlJPUik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZVRhcmdldE1lc3NhZ2Uoc291cmNlOiBFbGVtZW50KTogybVQYXJzZWRUcmFuc2xhdGlvbiB7XG4gIGNvbnN0IHNlcmlhbGl6ZXIgPSBuZXcgTWVzc2FnZVNlcmlhbGl6ZXIoXG4gICAgICBuZXcgVGFyZ2V0TWVzc2FnZVJlbmRlcmVyKCksXG4gICAgICB7aW5saW5lRWxlbWVudHM6IFtdLCBwbGFjZWhvbGRlcjoge2VsZW1lbnROYW1lOiAncGgnLCBuYW1lQXR0cmlidXRlOiAnbmFtZSd9fSk7XG4gIHJldHVybiBzZXJpYWxpemVyLnNlcmlhbGl6ZShwYXJzZUlubmVyUmFuZ2Uoc291cmNlKSk7XG59XG4iXX0=
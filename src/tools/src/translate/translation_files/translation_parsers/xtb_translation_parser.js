(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xtb_translation_parser", ["require", "exports", "tslib", "@angular/compiler", "path", "@angular/localize/src/tools/src/diagnostics", "@angular/localize/src/tools/src/translate/translation_files/base_visitor", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/serialize_translation_message", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils"], factory);
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
    var serialize_translation_message_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/serialize_translation_message");
    var translation_utils_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils");
    /**
     * A translation parser that can load XTB files.
     *
     * http://cldr.unicode.org/development/development-process/design-proposals/xmb
     *
     * @see XmbTranslationSerializer
     * @publicApi used by CLI
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
            var extension = (0, path_1.extname)(filePath);
            if (extension !== '.xtb' && extension !== '.xmb') {
                var diagnostics = new diagnostics_1.Diagnostics();
                diagnostics.warn('Must have xtb or xmb extension.');
                return { canParse: false, diagnostics: diagnostics };
            }
            return (0, translation_utils_1.canParseXml)(filePath, contents, 'translationbundle', {});
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
            errors.forEach(function (e) { return (0, translation_utils_1.addParseError)(bundle.diagnostics, e); });
            var bundleVisitor = new XtbVisitor();
            (0, compiler_1.visitAll)(bundleVisitor, element.children, bundle);
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
        (0, tslib_1.__extends)(XtbVisitor, _super);
        function XtbVisitor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        XtbVisitor.prototype.visitElement = function (element, bundle) {
            switch (element.name) {
                case 'translation':
                    // Error if no `id` attribute
                    var id = (0, translation_utils_1.getAttribute)(element, 'id');
                    if (id === undefined) {
                        (0, translation_utils_1.addParseDiagnostic)(bundle.diagnostics, element.sourceSpan, "Missing required \"id\" attribute on <translation> element.", compiler_1.ParseErrorLevel.ERROR);
                        return;
                    }
                    // Error if there is already a translation with the same id
                    if (bundle.translations[id] !== undefined) {
                        (0, translation_utils_1.addParseDiagnostic)(bundle.diagnostics, element.sourceSpan, "Duplicated translations for message \"" + id + "\"", compiler_1.ParseErrorLevel.ERROR);
                        return;
                    }
                    var _a = (0, serialize_translation_message_1.serializeTranslationMessage)(element, { inlineElements: [], placeholder: { elementName: 'ph', nameAttribute: 'name' } }), translation = _a.translation, parseErrors = _a.parseErrors, serializeErrors = _a.serializeErrors;
                    if (parseErrors.length) {
                        // We only want to warn (not error) if there were problems parsing the translation for
                        // XTB formatted files. See https://github.com/angular/angular/issues/14046.
                        bundle.diagnostics.warn(computeParseWarning(id, parseErrors));
                    }
                    else if (translation !== null) {
                        // Only store the translation if there were no parse errors
                        bundle.translations[id] = translation;
                    }
                    (0, translation_utils_1.addErrorsToBundle)(bundle, serializeErrors);
                    break;
                default:
                    (0, translation_utils_1.addParseDiagnostic)(bundle.diagnostics, element.sourceSpan, "Unexpected <" + element.name + "> tag.", compiler_1.ParseErrorLevel.ERROR);
            }
        };
        return XtbVisitor;
    }(base_visitor_1.BaseVisitor));
    function computeParseWarning(id, errors) {
        var msg = errors.map(function (e) { return e.toString(); }).join('\n');
        return "Could not parse message with id \"" + id + "\" - perhaps it has an unrecognised ICU format?\n" +
            msg;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieHRiX3RyYW5zbGF0aW9uX3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMveHRiX3RyYW5zbGF0aW9uX3BhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOENBQWlGO0lBQ2pGLDZCQUE2QjtJQUU3QiwyRUFBaUQ7SUFDakQseUdBQTRDO0lBRTVDLCtKQUE0RTtJQUU1RSx1SUFBOEk7SUFHOUk7Ozs7Ozs7T0FPRztJQUNIO1FBQUE7UUF1REEsQ0FBQztRQXREQzs7V0FFRztRQUNILHVDQUFRLEdBQVIsVUFBUyxRQUFnQixFQUFFLFFBQWdCO1lBQ3pDLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2hELE9BQU8sTUFBTSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ3hDLENBQUM7UUFFRCxzQ0FBTyxHQUFQLFVBQVEsUUFBZ0IsRUFBRSxRQUFnQjtZQUN4QyxJQUFNLFNBQVMsR0FBRyxJQUFBLGNBQU8sRUFBQyxRQUFRLENBQUMsQ0FBQztZQUNwQyxJQUFJLFNBQVMsS0FBSyxNQUFNLElBQUksU0FBUyxLQUFLLE1BQU0sRUFBRTtnQkFDaEQsSUFBTSxXQUFXLEdBQUcsSUFBSSx5QkFBVyxFQUFFLENBQUM7Z0JBQ3RDLFdBQVcsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQztnQkFDcEQsT0FBTyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsV0FBVyxhQUFBLEVBQUMsQ0FBQzthQUN2QztZQUNELE9BQU8sSUFBQSwrQkFBVyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsbUJB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QyxDQUFDO1FBQ3JELE9BQU8sdUNBQW9DLEVBQUUsc0RBQWtEO1lBQzNGLEdBQUcsQ0FBQztJQUNWLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RWxlbWVudCwgUGFyc2VFcnJvciwgUGFyc2VFcnJvckxldmVsLCB2aXNpdEFsbH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0IHtleHRuYW1lfSBmcm9tICdwYXRoJztcblxuaW1wb3J0IHtEaWFnbm9zdGljc30gZnJvbSAnLi4vLi4vLi4vZGlhZ25vc3RpY3MnO1xuaW1wb3J0IHtCYXNlVmlzaXRvcn0gZnJvbSAnLi4vYmFzZV92aXNpdG9yJztcblxuaW1wb3J0IHtzZXJpYWxpemVUcmFuc2xhdGlvbk1lc3NhZ2V9IGZyb20gJy4vc2VyaWFsaXplX3RyYW5zbGF0aW9uX21lc3NhZ2UnO1xuaW1wb3J0IHtQYXJzZUFuYWx5c2lzLCBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSwgVHJhbnNsYXRpb25QYXJzZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fcGFyc2VyJztcbmltcG9ydCB7YWRkRXJyb3JzVG9CdW5kbGUsIGFkZFBhcnNlRGlhZ25vc3RpYywgYWRkUGFyc2VFcnJvciwgY2FuUGFyc2VYbWwsIGdldEF0dHJpYnV0ZSwgWG1sVHJhbnNsYXRpb25QYXJzZXJIaW50fSBmcm9tICcuL3RyYW5zbGF0aW9uX3V0aWxzJztcblxuXG4vKipcbiAqIEEgdHJhbnNsYXRpb24gcGFyc2VyIHRoYXQgY2FuIGxvYWQgWFRCIGZpbGVzLlxuICpcbiAqIGh0dHA6Ly9jbGRyLnVuaWNvZGUub3JnL2RldmVsb3BtZW50L2RldmVsb3BtZW50LXByb2Nlc3MvZGVzaWduLXByb3Bvc2Fscy94bWJcbiAqXG4gKiBAc2VlIFhtYlRyYW5zbGF0aW9uU2VyaWFsaXplclxuICogQHB1YmxpY0FwaSB1c2VkIGJ5IENMSVxuICovXG5leHBvcnQgY2xhc3MgWHRiVHJhbnNsYXRpb25QYXJzZXIgaW1wbGVtZW50cyBUcmFuc2xhdGlvblBhcnNlcjxYbWxUcmFuc2xhdGlvblBhcnNlckhpbnQ+IHtcbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICBjYW5QYXJzZShmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nKTogWG1sVHJhbnNsYXRpb25QYXJzZXJIaW50fGZhbHNlIHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLmFuYWx5emUoZmlsZVBhdGgsIGNvbnRlbnRzKTtcbiAgICByZXR1cm4gcmVzdWx0LmNhblBhcnNlICYmIHJlc3VsdC5oaW50O1xuICB9XG5cbiAgYW5hbHl6ZShmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nKTogUGFyc2VBbmFseXNpczxYbWxUcmFuc2xhdGlvblBhcnNlckhpbnQ+IHtcbiAgICBjb25zdCBleHRlbnNpb24gPSBleHRuYW1lKGZpbGVQYXRoKTtcbiAgICBpZiAoZXh0ZW5zaW9uICE9PSAnLnh0YicgJiYgZXh0ZW5zaW9uICE9PSAnLnhtYicpIHtcbiAgICAgIGNvbnN0IGRpYWdub3N0aWNzID0gbmV3IERpYWdub3N0aWNzKCk7XG4gICAgICBkaWFnbm9zdGljcy53YXJuKCdNdXN0IGhhdmUgeHRiIG9yIHhtYiBleHRlbnNpb24uJyk7XG4gICAgICByZXR1cm4ge2NhblBhcnNlOiBmYWxzZSwgZGlhZ25vc3RpY3N9O1xuICAgIH1cbiAgICByZXR1cm4gY2FuUGFyc2VYbWwoZmlsZVBhdGgsIGNvbnRlbnRzLCAndHJhbnNsYXRpb25idW5kbGUnLCB7fSk7XG4gIH1cblxuICBwYXJzZShmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nLCBoaW50PzogWG1sVHJhbnNsYXRpb25QYXJzZXJIaW50KTpcbiAgICAgIFBhcnNlZFRyYW5zbGF0aW9uQnVuZGxlIHtcbiAgICBpZiAoaGludCkge1xuICAgICAgcmV0dXJuIHRoaXMuZXh0cmFjdEJ1bmRsZShoaW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZXh0cmFjdEJ1bmRsZURlcHJlY2F0ZWQoZmlsZVBhdGgsIGNvbnRlbnRzKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGV4dHJhY3RCdW5kbGUoe2VsZW1lbnQsIGVycm9yc306IFhtbFRyYW5zbGF0aW9uUGFyc2VySGludCk6IFBhcnNlZFRyYW5zbGF0aW9uQnVuZGxlIHtcbiAgICBjb25zdCBsYW5nQXR0ciA9IGVsZW1lbnQuYXR0cnMuZmluZCgoYXR0cikgPT4gYXR0ci5uYW1lID09PSAnbGFuZycpO1xuICAgIGNvbnN0IGJ1bmRsZTogUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUgPSB7XG4gICAgICBsb2NhbGU6IGxhbmdBdHRyICYmIGxhbmdBdHRyLnZhbHVlLFxuICAgICAgdHJhbnNsYXRpb25zOiB7fSxcbiAgICAgIGRpYWdub3N0aWNzOiBuZXcgRGlhZ25vc3RpY3MoKVxuICAgIH07XG4gICAgZXJyb3JzLmZvckVhY2goZSA9PiBhZGRQYXJzZUVycm9yKGJ1bmRsZS5kaWFnbm9zdGljcywgZSkpO1xuXG4gICAgY29uc3QgYnVuZGxlVmlzaXRvciA9IG5ldyBYdGJWaXNpdG9yKCk7XG4gICAgdmlzaXRBbGwoYnVuZGxlVmlzaXRvciwgZWxlbWVudC5jaGlsZHJlbiwgYnVuZGxlKTtcbiAgICByZXR1cm4gYnVuZGxlO1xuICB9XG5cbiAgcHJpdmF0ZSBleHRyYWN0QnVuZGxlRGVwcmVjYXRlZChmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nKSB7XG4gICAgY29uc3QgaGludCA9IHRoaXMuY2FuUGFyc2UoZmlsZVBhdGgsIGNvbnRlbnRzKTtcbiAgICBpZiAoIWhpbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIHBhcnNlIFwiJHtmaWxlUGF0aH1cIiBhcyBYTUIvWFRCIGZvcm1hdC5gKTtcbiAgICB9XG4gICAgY29uc3QgYnVuZGxlID0gdGhpcy5leHRyYWN0QnVuZGxlKGhpbnQpO1xuICAgIGlmIChidW5kbGUuZGlhZ25vc3RpY3MuaGFzRXJyb3JzKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID1cbiAgICAgICAgICBidW5kbGUuZGlhZ25vc3RpY3MuZm9ybWF0RGlhZ25vc3RpY3MoYEZhaWxlZCB0byBwYXJzZSBcIiR7ZmlsZVBhdGh9XCIgYXMgWE1CL1hUQiBmb3JtYXRgKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ1bmRsZTtcbiAgfVxufVxuXG5jbGFzcyBYdGJWaXNpdG9yIGV4dGVuZHMgQmFzZVZpc2l0b3Ige1xuICBvdmVycmlkZSB2aXNpdEVsZW1lbnQoZWxlbWVudDogRWxlbWVudCwgYnVuZGxlOiBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSk6IGFueSB7XG4gICAgc3dpdGNoIChlbGVtZW50Lm5hbWUpIHtcbiAgICAgIGNhc2UgJ3RyYW5zbGF0aW9uJzpcbiAgICAgICAgLy8gRXJyb3IgaWYgbm8gYGlkYCBhdHRyaWJ1dGVcbiAgICAgICAgY29uc3QgaWQgPSBnZXRBdHRyaWJ1dGUoZWxlbWVudCwgJ2lkJyk7XG4gICAgICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgYWRkUGFyc2VEaWFnbm9zdGljKFxuICAgICAgICAgICAgICBidW5kbGUuZGlhZ25vc3RpY3MsIGVsZW1lbnQuc291cmNlU3BhbixcbiAgICAgICAgICAgICAgYE1pc3NpbmcgcmVxdWlyZWQgXCJpZFwiIGF0dHJpYnV0ZSBvbiA8dHJhbnNsYXRpb24+IGVsZW1lbnQuYCwgUGFyc2VFcnJvckxldmVsLkVSUk9SKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBFcnJvciBpZiB0aGVyZSBpcyBhbHJlYWR5IGEgdHJhbnNsYXRpb24gd2l0aCB0aGUgc2FtZSBpZFxuICAgICAgICBpZiAoYnVuZGxlLnRyYW5zbGF0aW9uc1tpZF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGFkZFBhcnNlRGlhZ25vc3RpYyhcbiAgICAgICAgICAgICAgYnVuZGxlLmRpYWdub3N0aWNzLCBlbGVtZW50LnNvdXJjZVNwYW4sIGBEdXBsaWNhdGVkIHRyYW5zbGF0aW9ucyBmb3IgbWVzc2FnZSBcIiR7aWR9XCJgLFxuICAgICAgICAgICAgICBQYXJzZUVycm9yTGV2ZWwuRVJST1IpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHt0cmFuc2xhdGlvbiwgcGFyc2VFcnJvcnMsIHNlcmlhbGl6ZUVycm9yc30gPSBzZXJpYWxpemVUcmFuc2xhdGlvbk1lc3NhZ2UoXG4gICAgICAgICAgICBlbGVtZW50LCB7aW5saW5lRWxlbWVudHM6IFtdLCBwbGFjZWhvbGRlcjoge2VsZW1lbnROYW1lOiAncGgnLCBuYW1lQXR0cmlidXRlOiAnbmFtZSd9fSk7XG4gICAgICAgIGlmIChwYXJzZUVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAvLyBXZSBvbmx5IHdhbnQgdG8gd2FybiAobm90IGVycm9yKSBpZiB0aGVyZSB3ZXJlIHByb2JsZW1zIHBhcnNpbmcgdGhlIHRyYW5zbGF0aW9uIGZvclxuICAgICAgICAgIC8vIFhUQiBmb3JtYXR0ZWQgZmlsZXMuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8xNDA0Ni5cbiAgICAgICAgICBidW5kbGUuZGlhZ25vc3RpY3Mud2Fybihjb21wdXRlUGFyc2VXYXJuaW5nKGlkLCBwYXJzZUVycm9ycykpO1xuICAgICAgICB9IGVsc2UgaWYgKHRyYW5zbGF0aW9uICE9PSBudWxsKSB7XG4gICAgICAgICAgLy8gT25seSBzdG9yZSB0aGUgdHJhbnNsYXRpb24gaWYgdGhlcmUgd2VyZSBubyBwYXJzZSBlcnJvcnNcbiAgICAgICAgICBidW5kbGUudHJhbnNsYXRpb25zW2lkXSA9IHRyYW5zbGF0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGFkZEVycm9yc1RvQnVuZGxlKGJ1bmRsZSwgc2VyaWFsaXplRXJyb3JzKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFkZFBhcnNlRGlhZ25vc3RpYyhcbiAgICAgICAgICAgIGJ1bmRsZS5kaWFnbm9zdGljcywgZWxlbWVudC5zb3VyY2VTcGFuLCBgVW5leHBlY3RlZCA8JHtlbGVtZW50Lm5hbWV9PiB0YWcuYCxcbiAgICAgICAgICAgIFBhcnNlRXJyb3JMZXZlbC5FUlJPUik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVQYXJzZVdhcm5pbmcoaWQ6IHN0cmluZywgZXJyb3JzOiBQYXJzZUVycm9yW10pOiBzdHJpbmcge1xuICBjb25zdCBtc2cgPSBlcnJvcnMubWFwKGUgPT4gZS50b1N0cmluZygpKS5qb2luKCdcXG4nKTtcbiAgcmV0dXJuIGBDb3VsZCBub3QgcGFyc2UgbWVzc2FnZSB3aXRoIGlkIFwiJHtpZH1cIiAtIHBlcmhhcHMgaXQgaGFzIGFuIHVucmVjb2duaXNlZCBJQ1UgZm9ybWF0P1xcbmAgK1xuICAgICAgbXNnO1xufVxuIl19
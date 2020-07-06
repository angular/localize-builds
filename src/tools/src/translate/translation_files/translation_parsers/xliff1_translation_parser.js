(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff1_translation_parser", ["require", "exports", "tslib", "@angular/compiler", "@angular/localize/src/tools/src/diagnostics", "@angular/localize/src/tools/src/translate/translation_files/base_visitor", "@angular/localize/src/tools/src/translate/translation_files/message_serialization/message_serializer", "@angular/localize/src/tools/src/translate/translation_files/message_serialization/target_message_renderer", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Xliff1TranslationParser = void 0;
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var compiler_1 = require("@angular/compiler");
    var diagnostics_1 = require("@angular/localize/src/tools/src/diagnostics");
    var base_visitor_1 = require("@angular/localize/src/tools/src/translate/translation_files/base_visitor");
    var message_serializer_1 = require("@angular/localize/src/tools/src/translate/translation_files/message_serialization/message_serializer");
    var target_message_renderer_1 = require("@angular/localize/src/tools/src/translate/translation_files/message_serialization/target_message_renderer");
    var translation_utils_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils");
    /**
     * A translation parser that can load XLIFF 1.2 files.
     *
     * http://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html
     * http://docs.oasis-open.org/xliff/v1.2/xliff-profile-html/xliff-profile-html-1.2.html
     *
     * @see Xliff1TranslationSerializer
     */
    var Xliff1TranslationParser = /** @class */ (function () {
        function Xliff1TranslationParser() {
        }
        /**
         * @deprecated
         */
        Xliff1TranslationParser.prototype.canParse = function (filePath, contents) {
            var result = this.analyze(filePath, contents);
            return result.canParse && result.hint;
        };
        Xliff1TranslationParser.prototype.analyze = function (filePath, contents) {
            return translation_utils_1.canParseXml(filePath, contents, 'xliff', { version: '1.2' });
        };
        Xliff1TranslationParser.prototype.parse = function (filePath, contents, hint) {
            if (hint) {
                return this.extractBundle(hint);
            }
            else {
                return this.extractBundleDeprecated(filePath, contents);
            }
        };
        Xliff1TranslationParser.prototype.extractBundle = function (_a) {
            var e_1, _b;
            var element = _a.element, errors = _a.errors;
            var diagnostics = new diagnostics_1.Diagnostics();
            errors.forEach(function (e) { return translation_utils_1.addParseError(diagnostics, e); });
            if (element.children.length === 0) {
                translation_utils_1.addParseDiagnostic(diagnostics, element.sourceSpan, 'Missing expected <file> element', compiler_1.ParseErrorLevel.WARNING);
                return { locale: undefined, translations: {}, diagnostics: diagnostics };
            }
            var files = element.children.filter(translation_utils_1.isNamedElement('file'));
            if (files.length === 0) {
                translation_utils_1.addParseDiagnostic(diagnostics, element.sourceSpan, 'No <file> elements found in <xliff>', compiler_1.ParseErrorLevel.WARNING);
            }
            else if (files.length > 1) {
                translation_utils_1.addParseDiagnostic(diagnostics, files[1].sourceSpan, 'More than one <file> element found in <xliff>', compiler_1.ParseErrorLevel.WARNING);
            }
            var bundle = { locale: undefined, translations: {}, diagnostics: diagnostics };
            var translationVisitor = new XliffTranslationVisitor();
            var localesFound = new Set();
            try {
                for (var files_1 = tslib_1.__values(files), files_1_1 = files_1.next(); !files_1_1.done; files_1_1 = files_1.next()) {
                    var file = files_1_1.value;
                    var locale = translation_utils_1.getAttribute(file, 'target-language');
                    if (locale !== undefined) {
                        localesFound.add(locale);
                        bundle.locale = locale;
                    }
                    compiler_1.visitAll(translationVisitor, file.children, bundle);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (files_1_1 && !files_1_1.done && (_b = files_1.return)) _b.call(files_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (localesFound.size > 1) {
                translation_utils_1.addParseDiagnostic(diagnostics, element.sourceSpan, "More than one locale found in translation file: " + JSON.stringify(Array.from(localesFound)) + ". Using \"" + bundle.locale + "\"", compiler_1.ParseErrorLevel.WARNING);
            }
            return bundle;
        };
        Xliff1TranslationParser.prototype.extractBundleDeprecated = function (filePath, contents) {
            var hint = this.canParse(filePath, contents);
            if (!hint) {
                throw new Error("Unable to parse \"" + filePath + "\" as XLIFF 1.2 format.");
            }
            var bundle = this.extractBundle(hint);
            if (bundle.diagnostics.hasErrors) {
                var message = bundle.diagnostics.formatDiagnostics("Failed to parse \"" + filePath + "\" as XLIFF 1.2 format");
                throw new Error(message);
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
        XliffFileElementVisitor.prototype.visitElement = function (fileElement) {
            if (fileElement.name === 'file') {
                return { fileElement: fileElement, locale: translation_utils_1.getAttribute(fileElement, 'target-language') };
            }
        };
        return XliffFileElementVisitor;
    }(base_visitor_1.BaseVisitor));
    var XliffTranslationVisitor = /** @class */ (function (_super) {
        tslib_1.__extends(XliffTranslationVisitor, _super);
        function XliffTranslationVisitor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        XliffTranslationVisitor.prototype.visitElement = function (element, bundle) {
            if (element.name === 'trans-unit') {
                this.visitTransUnitElement(element, bundle);
            }
            else {
                compiler_1.visitAll(this, element.children, bundle);
            }
        };
        XliffTranslationVisitor.prototype.visitTransUnitElement = function (element, bundle) {
            // Error if no `id` attribute
            var id = translation_utils_1.getAttribute(element, 'id');
            if (id === undefined) {
                translation_utils_1.addParseDiagnostic(bundle.diagnostics, element.sourceSpan, "Missing required \"id\" attribute on <trans-unit> element.", compiler_1.ParseErrorLevel.ERROR);
                return;
            }
            // Error if there is already a translation with the same id
            if (bundle.translations[id] !== undefined) {
                translation_utils_1.addParseDiagnostic(bundle.diagnostics, element.sourceSpan, "Duplicated translations for message \"" + id + "\"", compiler_1.ParseErrorLevel.ERROR);
                return;
            }
            // Error if there is no `<target>` child element
            var targetMessage = element.children.find(translation_utils_1.isNamedElement('target'));
            if (targetMessage === undefined) {
                translation_utils_1.addParseDiagnostic(bundle.diagnostics, element.sourceSpan, 'Missing required <target> element', compiler_1.ParseErrorLevel.ERROR);
                return;
            }
            try {
                bundle.translations[id] = serializeTargetMessage(targetMessage);
            }
            catch (e) {
                // Capture any errors from serialize the target message
                if (e.span && e.msg && e.level) {
                    translation_utils_1.addParseDiagnostic(bundle.diagnostics, e.span, e.msg, e.level);
                }
                else {
                    throw e;
                }
            }
        };
        return XliffTranslationVisitor;
    }(base_visitor_1.BaseVisitor));
    function serializeTargetMessage(source) {
        var serializer = new message_serializer_1.MessageSerializer(new target_message_renderer_1.TargetMessageRenderer(), {
            inlineElements: ['g', 'bx', 'ex', 'bpt', 'ept', 'ph', 'it', 'mrk'],
            placeholder: { elementName: 'x', nameAttribute: 'id' }
        });
        return serializer.serialize(translation_utils_1.parseInnerRange(source));
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYxX3RyYW5zbGF0aW9uX3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMveGxpZmYxX3RyYW5zbGF0aW9uX3BhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOENBQXFFO0lBR3JFLDJFQUFpRDtJQUNqRCx5R0FBNEM7SUFDNUMsMklBQThFO0lBQzlFLHFKQUF1RjtJQUd2Rix1SUFBNEo7SUFFNUo7Ozs7Ozs7T0FPRztJQUNIO1FBQUE7UUFnRkEsQ0FBQztRQS9FQzs7V0FFRztRQUNILDBDQUFRLEdBQVIsVUFBUyxRQUFnQixFQUFFLFFBQWdCO1lBQ3pDLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2hELE9BQU8sTUFBTSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ3hDLENBQUM7UUFFRCx5Q0FBTyxHQUFQLFVBQVEsUUFBZ0IsRUFBRSxRQUFnQjtZQUN4QyxPQUFPLCtCQUFXLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUNwRSxDQUFDO1FBRUQsdUNBQUssR0FBTCxVQUFNLFFBQWdCLEVBQUUsUUFBZ0IsRUFBRSxJQUErQjtZQUV2RSxJQUFJLElBQUksRUFBRTtnQkFDUixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDakM7aUJBQU07Z0JBQ0wsT0FBTyxJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQ3pEO1FBQ0gs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SUFBRCxDQUFDLEFBL0NELENBQXNDLDBCQUFXLEdBK0NoRDtJQUVELFNBQVMsc0JBQXNCLENBQUMsTUFBZTtRQUM3QyxJQUFNLFVBQVUsR0FBRyxJQUFJLHNDQUFpQixDQUFDLElBQUksK0NBQXFCLEVBQUUsRUFBRTtZQUNwRSxjQUFjLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDO1lBQ2xFLFdBQVcsRUFBRSxFQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBQztTQUNyRCxDQUFDLENBQUM7UUFDSCxPQUFPLFVBQVUsQ0FBQyxTQUFTLENBQUMsbUNBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RWxlbWVudCwgUGFyc2VFcnJvckxldmVsLCB2aXNpdEFsbH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0IHvJtVBhcnNlZFRyYW5zbGF0aW9ufSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5cbmltcG9ydCB7RGlhZ25vc3RpY3N9IGZyb20gJy4uLy4uLy4uL2RpYWdub3N0aWNzJztcbmltcG9ydCB7QmFzZVZpc2l0b3J9IGZyb20gJy4uL2Jhc2VfdmlzaXRvcic7XG5pbXBvcnQge01lc3NhZ2VTZXJpYWxpemVyfSBmcm9tICcuLi9tZXNzYWdlX3NlcmlhbGl6YXRpb24vbWVzc2FnZV9zZXJpYWxpemVyJztcbmltcG9ydCB7VGFyZ2V0TWVzc2FnZVJlbmRlcmVyfSBmcm9tICcuLi9tZXNzYWdlX3NlcmlhbGl6YXRpb24vdGFyZ2V0X21lc3NhZ2VfcmVuZGVyZXInO1xuXG5pbXBvcnQge1BhcnNlQW5hbHlzaXMsIFBhcnNlZFRyYW5zbGF0aW9uQnVuZGxlLCBUcmFuc2xhdGlvblBhcnNlcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9wYXJzZXInO1xuaW1wb3J0IHthZGRQYXJzZURpYWdub3N0aWMsIGFkZFBhcnNlRXJyb3IsIGNhblBhcnNlWG1sLCBnZXRBdHRyaWJ1dGUsIGlzTmFtZWRFbGVtZW50LCBwYXJzZUlubmVyUmFuZ2UsIFhtbFRyYW5zbGF0aW9uUGFyc2VySGludH0gZnJvbSAnLi90cmFuc2xhdGlvbl91dGlscyc7XG5cbi8qKlxuICogQSB0cmFuc2xhdGlvbiBwYXJzZXIgdGhhdCBjYW4gbG9hZCBYTElGRiAxLjIgZmlsZXMuXG4gKlxuICogaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcveGxpZmYvdjEuMi9vcy94bGlmZi1jb3JlLmh0bWxcbiAqIGh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL3hsaWZmL3YxLjIveGxpZmYtcHJvZmlsZS1odG1sL3hsaWZmLXByb2ZpbGUtaHRtbC0xLjIuaHRtbFxuICpcbiAqIEBzZWUgWGxpZmYxVHJhbnNsYXRpb25TZXJpYWxpemVyXG4gKi9cbmV4cG9ydCBjbGFzcyBYbGlmZjFUcmFuc2xhdGlvblBhcnNlciBpbXBsZW1lbnRzIFRyYW5zbGF0aW9uUGFyc2VyPFhtbFRyYW5zbGF0aW9uUGFyc2VySGludD4ge1xuICAvKipcbiAgICogQGRlcHJlY2F0ZWRcbiAgICovXG4gIGNhblBhcnNlKGZpbGVQYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcpOiBYbWxUcmFuc2xhdGlvblBhcnNlckhpbnR8ZmFsc2Uge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuYW5hbHl6ZShmaWxlUGF0aCwgY29udGVudHMpO1xuICAgIHJldHVybiByZXN1bHQuY2FuUGFyc2UgJiYgcmVzdWx0LmhpbnQ7XG4gIH1cblxuICBhbmFseXplKGZpbGVQYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcpOiBQYXJzZUFuYWx5c2lzPFhtbFRyYW5zbGF0aW9uUGFyc2VySGludD4ge1xuICAgIHJldHVybiBjYW5QYXJzZVhtbChmaWxlUGF0aCwgY29udGVudHMsICd4bGlmZicsIHt2ZXJzaW9uOiAnMS4yJ30pO1xuICB9XG5cbiAgcGFyc2UoZmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZywgaGludD86IFhtbFRyYW5zbGF0aW9uUGFyc2VySGludCk6XG4gICAgICBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSB7XG4gICAgaWYgKGhpbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLmV4dHJhY3RCdW5kbGUoaGludCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmV4dHJhY3RCdW5kbGVEZXByZWNhdGVkKGZpbGVQYXRoLCBjb250ZW50cyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBleHRyYWN0QnVuZGxlKHtlbGVtZW50LCBlcnJvcnN9OiBYbWxUcmFuc2xhdGlvblBhcnNlckhpbnQpOiBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSB7XG4gICAgY29uc3QgZGlhZ25vc3RpY3MgPSBuZXcgRGlhZ25vc3RpY3MoKTtcbiAgICBlcnJvcnMuZm9yRWFjaChlID0+IGFkZFBhcnNlRXJyb3IoZGlhZ25vc3RpY3MsIGUpKTtcblxuICAgIGlmIChlbGVtZW50LmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYWRkUGFyc2VEaWFnbm9zdGljKFxuICAgICAgICAgIGRpYWdub3N0aWNzLCBlbGVtZW50LnNvdXJjZVNwYW4sICdNaXNzaW5nIGV4cGVjdGVkIDxmaWxlPiBlbGVtZW50JyxcbiAgICAgICAgICBQYXJzZUVycm9yTGV2ZWwuV0FSTklORyk7XG4gICAgICByZXR1cm4ge2xvY2FsZTogdW5kZWZpbmVkLCB0cmFuc2xhdGlvbnM6IHt9LCBkaWFnbm9zdGljc307XG4gICAgfVxuXG4gICAgY29uc3QgZmlsZXMgPSBlbGVtZW50LmNoaWxkcmVuLmZpbHRlcihpc05hbWVkRWxlbWVudCgnZmlsZScpKTtcbiAgICBpZiAoZmlsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBhZGRQYXJzZURpYWdub3N0aWMoXG4gICAgICAgICAgZGlhZ25vc3RpY3MsIGVsZW1lbnQuc291cmNlU3BhbiwgJ05vIDxmaWxlPiBlbGVtZW50cyBmb3VuZCBpbiA8eGxpZmY+JyxcbiAgICAgICAgICBQYXJzZUVycm9yTGV2ZWwuV0FSTklORyk7XG4gICAgfSBlbHNlIGlmIChmaWxlcy5sZW5ndGggPiAxKSB7XG4gICAgICBhZGRQYXJzZURpYWdub3N0aWMoXG4gICAgICAgICAgZGlhZ25vc3RpY3MsIGZpbGVzWzFdLnNvdXJjZVNwYW4sICdNb3JlIHRoYW4gb25lIDxmaWxlPiBlbGVtZW50IGZvdW5kIGluIDx4bGlmZj4nLFxuICAgICAgICAgIFBhcnNlRXJyb3JMZXZlbC5XQVJOSU5HKTtcbiAgICB9XG5cbiAgICBjb25zdCBidW5kbGU6IFBhcnNlZFRyYW5zbGF0aW9uQnVuZGxlID0ge2xvY2FsZTogdW5kZWZpbmVkLCB0cmFuc2xhdGlvbnM6IHt9LCBkaWFnbm9zdGljc307XG4gICAgY29uc3QgdHJhbnNsYXRpb25WaXNpdG9yID0gbmV3IFhsaWZmVHJhbnNsYXRpb25WaXNpdG9yKCk7XG4gICAgY29uc3QgbG9jYWxlc0ZvdW5kID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICBjb25zdCBsb2NhbGUgPSBnZXRBdHRyaWJ1dGUoZmlsZSwgJ3RhcmdldC1sYW5ndWFnZScpO1xuICAgICAgaWYgKGxvY2FsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxvY2FsZXNGb3VuZC5hZGQobG9jYWxlKTtcbiAgICAgICAgYnVuZGxlLmxvY2FsZSA9IGxvY2FsZTtcbiAgICAgIH1cbiAgICAgIHZpc2l0QWxsKHRyYW5zbGF0aW9uVmlzaXRvciwgZmlsZS5jaGlsZHJlbiwgYnVuZGxlKTtcbiAgICB9XG5cbiAgICBpZiAobG9jYWxlc0ZvdW5kLnNpemUgPiAxKSB7XG4gICAgICBhZGRQYXJzZURpYWdub3N0aWMoXG4gICAgICAgICAgZGlhZ25vc3RpY3MsIGVsZW1lbnQuc291cmNlU3BhbixcbiAgICAgICAgICBgTW9yZSB0aGFuIG9uZSBsb2NhbGUgZm91bmQgaW4gdHJhbnNsYXRpb24gZmlsZTogJHtcbiAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoQXJyYXkuZnJvbShsb2NhbGVzRm91bmQpKX0uIFVzaW5nIFwiJHtidW5kbGUubG9jYWxlfVwiYCxcbiAgICAgICAgICBQYXJzZUVycm9yTGV2ZWwuV0FSTklORyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1bmRsZTtcbiAgfVxuXG4gIHByaXZhdGUgZXh0cmFjdEJ1bmRsZURlcHJlY2F0ZWQoZmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZykge1xuICAgIGNvbnN0IGhpbnQgPSB0aGlzLmNhblBhcnNlKGZpbGVQYXRoLCBjb250ZW50cyk7XG4gICAgaWYgKCFoaW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBwYXJzZSBcIiR7ZmlsZVBhdGh9XCIgYXMgWExJRkYgMS4yIGZvcm1hdC5gKTtcbiAgICB9XG4gICAgY29uc3QgYnVuZGxlID0gdGhpcy5leHRyYWN0QnVuZGxlKGhpbnQpO1xuICAgIGlmIChidW5kbGUuZGlhZ25vc3RpY3MuaGFzRXJyb3JzKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID1cbiAgICAgICAgICBidW5kbGUuZGlhZ25vc3RpY3MuZm9ybWF0RGlhZ25vc3RpY3MoYEZhaWxlZCB0byBwYXJzZSBcIiR7ZmlsZVBhdGh9XCIgYXMgWExJRkYgMS4yIGZvcm1hdGApO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH1cbiAgICByZXR1cm4gYnVuZGxlO1xuICB9XG59XG5cbmNsYXNzIFhsaWZmRmlsZUVsZW1lbnRWaXNpdG9yIGV4dGVuZHMgQmFzZVZpc2l0b3Ige1xuICB2aXNpdEVsZW1lbnQoZmlsZUVsZW1lbnQ6IEVsZW1lbnQpOiBhbnkge1xuICAgIGlmIChmaWxlRWxlbWVudC5uYW1lID09PSAnZmlsZScpIHtcbiAgICAgIHJldHVybiB7ZmlsZUVsZW1lbnQsIGxvY2FsZTogZ2V0QXR0cmlidXRlKGZpbGVFbGVtZW50LCAndGFyZ2V0LWxhbmd1YWdlJyl9O1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBYbGlmZlRyYW5zbGF0aW9uVmlzaXRvciBleHRlbmRzIEJhc2VWaXNpdG9yIHtcbiAgdmlzaXRFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQsIGJ1bmRsZTogUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUpOiB2b2lkIHtcbiAgICBpZiAoZWxlbWVudC5uYW1lID09PSAndHJhbnMtdW5pdCcpIHtcbiAgICAgIHRoaXMudmlzaXRUcmFuc1VuaXRFbGVtZW50KGVsZW1lbnQsIGJ1bmRsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZpc2l0QWxsKHRoaXMsIGVsZW1lbnQuY2hpbGRyZW4sIGJ1bmRsZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB2aXNpdFRyYW5zVW5pdEVsZW1lbnQoZWxlbWVudDogRWxlbWVudCwgYnVuZGxlOiBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSk6IHZvaWQge1xuICAgIC8vIEVycm9yIGlmIG5vIGBpZGAgYXR0cmlidXRlXG4gICAgY29uc3QgaWQgPSBnZXRBdHRyaWJ1dGUoZWxlbWVudCwgJ2lkJyk7XG4gICAgaWYgKGlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGFkZFBhcnNlRGlhZ25vc3RpYyhcbiAgICAgICAgICBidW5kbGUuZGlhZ25vc3RpY3MsIGVsZW1lbnQuc291cmNlU3BhbixcbiAgICAgICAgICBgTWlzc2luZyByZXF1aXJlZCBcImlkXCIgYXR0cmlidXRlIG9uIDx0cmFucy11bml0PiBlbGVtZW50LmAsIFBhcnNlRXJyb3JMZXZlbC5FUlJPUik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRXJyb3IgaWYgdGhlcmUgaXMgYWxyZWFkeSBhIHRyYW5zbGF0aW9uIHdpdGggdGhlIHNhbWUgaWRcbiAgICBpZiAoYnVuZGxlLnRyYW5zbGF0aW9uc1tpZF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgYWRkUGFyc2VEaWFnbm9zdGljKFxuICAgICAgICAgIGJ1bmRsZS5kaWFnbm9zdGljcywgZWxlbWVudC5zb3VyY2VTcGFuLCBgRHVwbGljYXRlZCB0cmFuc2xhdGlvbnMgZm9yIG1lc3NhZ2UgXCIke2lkfVwiYCxcbiAgICAgICAgICBQYXJzZUVycm9yTGV2ZWwuRVJST1IpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEVycm9yIGlmIHRoZXJlIGlzIG5vIGA8dGFyZ2V0PmAgY2hpbGQgZWxlbWVudFxuICAgIGNvbnN0IHRhcmdldE1lc3NhZ2UgPSBlbGVtZW50LmNoaWxkcmVuLmZpbmQoaXNOYW1lZEVsZW1lbnQoJ3RhcmdldCcpKTtcbiAgICBpZiAodGFyZ2V0TWVzc2FnZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBhZGRQYXJzZURpYWdub3N0aWMoXG4gICAgICAgICAgYnVuZGxlLmRpYWdub3N0aWNzLCBlbGVtZW50LnNvdXJjZVNwYW4sICdNaXNzaW5nIHJlcXVpcmVkIDx0YXJnZXQ+IGVsZW1lbnQnLFxuICAgICAgICAgIFBhcnNlRXJyb3JMZXZlbC5FUlJPUik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGJ1bmRsZS50cmFuc2xhdGlvbnNbaWRdID0gc2VyaWFsaXplVGFyZ2V0TWVzc2FnZSh0YXJnZXRNZXNzYWdlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBDYXB0dXJlIGFueSBlcnJvcnMgZnJvbSBzZXJpYWxpemUgdGhlIHRhcmdldCBtZXNzYWdlXG4gICAgICBpZiAoZS5zcGFuICYmIGUubXNnICYmIGUubGV2ZWwpIHtcbiAgICAgICAgYWRkUGFyc2VEaWFnbm9zdGljKGJ1bmRsZS5kaWFnbm9zdGljcywgZS5zcGFuLCBlLm1zZywgZS5sZXZlbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVUYXJnZXRNZXNzYWdlKHNvdXJjZTogRWxlbWVudCk6IMm1UGFyc2VkVHJhbnNsYXRpb24ge1xuICBjb25zdCBzZXJpYWxpemVyID0gbmV3IE1lc3NhZ2VTZXJpYWxpemVyKG5ldyBUYXJnZXRNZXNzYWdlUmVuZGVyZXIoKSwge1xuICAgIGlubGluZUVsZW1lbnRzOiBbJ2cnLCAnYngnLCAnZXgnLCAnYnB0JywgJ2VwdCcsICdwaCcsICdpdCcsICdtcmsnXSxcbiAgICBwbGFjZWhvbGRlcjoge2VsZW1lbnROYW1lOiAneCcsIG5hbWVBdHRyaWJ1dGU6ICdpZCd9XG4gIH0pO1xuICByZXR1cm4gc2VyaWFsaXplci5zZXJpYWxpemUocGFyc2VJbm5lclJhbmdlKHNvdXJjZSkpO1xufVxuIl19
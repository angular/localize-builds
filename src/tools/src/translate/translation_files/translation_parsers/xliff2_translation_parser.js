(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff2_translation_parser", ["require", "exports", "tslib", "@angular/compiler", "@angular/localize/src/tools/src/diagnostics", "@angular/localize/src/tools/src/translate/translation_files/base_visitor", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/serialize_translation_message", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Xliff2TranslationParser = void 0;
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
    var serialize_translation_message_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/serialize_translation_message");
    var translation_utils_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils");
    /**
     * A translation parser that can load translations from XLIFF 2 files.
     *
     * https://docs.oasis-open.org/xliff/xliff-core/v2.0/os/xliff-core-v2.0-os.html
     *
     * @see Xliff2TranslationSerializer
     * @publicApi used by CLI
     */
    var Xliff2TranslationParser = /** @class */ (function () {
        function Xliff2TranslationParser() {
        }
        /**
         * @deprecated
         */
        Xliff2TranslationParser.prototype.canParse = function (filePath, contents) {
            var result = this.analyze(filePath, contents);
            return result.canParse && result.hint;
        };
        Xliff2TranslationParser.prototype.analyze = function (filePath, contents) {
            return (0, translation_utils_1.canParseXml)(filePath, contents, 'xliff', { version: '2.0' });
        };
        Xliff2TranslationParser.prototype.parse = function (filePath, contents, hint) {
            if (hint) {
                return this.extractBundle(hint);
            }
            else {
                return this.extractBundleDeprecated(filePath, contents);
            }
        };
        Xliff2TranslationParser.prototype.extractBundle = function (_a) {
            var e_1, _b;
            var element = _a.element, errors = _a.errors;
            var diagnostics = new diagnostics_1.Diagnostics();
            errors.forEach(function (e) { return (0, translation_utils_1.addParseError)(diagnostics, e); });
            var locale = (0, translation_utils_1.getAttribute)(element, 'trgLang');
            var files = element.children.filter(isFileElement);
            if (files.length === 0) {
                (0, translation_utils_1.addParseDiagnostic)(diagnostics, element.sourceSpan, 'No <file> elements found in <xliff>', compiler_1.ParseErrorLevel.WARNING);
            }
            else if (files.length > 1) {
                (0, translation_utils_1.addParseDiagnostic)(diagnostics, files[1].sourceSpan, 'More than one <file> element found in <xliff>', compiler_1.ParseErrorLevel.WARNING);
            }
            var bundle = { locale: locale, translations: {}, diagnostics: diagnostics };
            var translationVisitor = new Xliff2TranslationVisitor();
            try {
                for (var files_1 = (0, tslib_1.__values)(files), files_1_1 = files_1.next(); !files_1_1.done; files_1_1 = files_1.next()) {
                    var file = files_1_1.value;
                    (0, compiler_1.visitAll)(translationVisitor, file.children, { bundle: bundle });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (files_1_1 && !files_1_1.done && (_b = files_1.return)) _b.call(files_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return bundle;
        };
        Xliff2TranslationParser.prototype.extractBundleDeprecated = function (filePath, contents) {
            var hint = this.canParse(filePath, contents);
            if (!hint) {
                throw new Error("Unable to parse \"" + filePath + "\" as XLIFF 2.0 format.");
            }
            var bundle = this.extractBundle(hint);
            if (bundle.diagnostics.hasErrors) {
                var message = bundle.diagnostics.formatDiagnostics("Failed to parse \"" + filePath + "\" as XLIFF 2.0 format");
                throw new Error(message);
            }
            return bundle;
        };
        return Xliff2TranslationParser;
    }());
    exports.Xliff2TranslationParser = Xliff2TranslationParser;
    var Xliff2TranslationVisitor = /** @class */ (function (_super) {
        (0, tslib_1.__extends)(Xliff2TranslationVisitor, _super);
        function Xliff2TranslationVisitor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Xliff2TranslationVisitor.prototype.visitElement = function (element, _a) {
            var bundle = _a.bundle, unit = _a.unit;
            if (element.name === 'unit') {
                this.visitUnitElement(element, bundle);
            }
            else if (element.name === 'segment') {
                this.visitSegmentElement(element, bundle, unit);
            }
            else {
                (0, compiler_1.visitAll)(this, element.children, { bundle: bundle, unit: unit });
            }
        };
        Xliff2TranslationVisitor.prototype.visitUnitElement = function (element, bundle) {
            // Error if no `id` attribute
            var externalId = (0, translation_utils_1.getAttribute)(element, 'id');
            if (externalId === undefined) {
                (0, translation_utils_1.addParseDiagnostic)(bundle.diagnostics, element.sourceSpan, "Missing required \"id\" attribute on <trans-unit> element.", compiler_1.ParseErrorLevel.ERROR);
                return;
            }
            // Error if there is already a translation with the same id
            if (bundle.translations[externalId] !== undefined) {
                (0, translation_utils_1.addParseDiagnostic)(bundle.diagnostics, element.sourceSpan, "Duplicated translations for message \"" + externalId + "\"", compiler_1.ParseErrorLevel.ERROR);
                return;
            }
            (0, compiler_1.visitAll)(this, element.children, { bundle: bundle, unit: externalId });
        };
        Xliff2TranslationVisitor.prototype.visitSegmentElement = function (element, bundle, unit) {
            // A `<segment>` element must be below a `<unit>` element
            if (unit === undefined) {
                (0, translation_utils_1.addParseDiagnostic)(bundle.diagnostics, element.sourceSpan, 'Invalid <segment> element: should be a child of a <unit> element.', compiler_1.ParseErrorLevel.ERROR);
                return;
            }
            var targetMessage = element.children.find((0, translation_utils_1.isNamedElement)('target'));
            if (targetMessage === undefined) {
                // Warn if there is no `<target>` child element
                (0, translation_utils_1.addParseDiagnostic)(bundle.diagnostics, element.sourceSpan, 'Missing <target> element', compiler_1.ParseErrorLevel.WARNING);
                // Fallback to the `<source>` element if available.
                targetMessage = element.children.find((0, translation_utils_1.isNamedElement)('source'));
                if (targetMessage === undefined) {
                    // Error if there is neither `<target>` nor `<source>`.
                    (0, translation_utils_1.addParseDiagnostic)(bundle.diagnostics, element.sourceSpan, 'Missing required element: one of <target> or <source> is required', compiler_1.ParseErrorLevel.ERROR);
                    return;
                }
            }
            var _a = (0, serialize_translation_message_1.serializeTranslationMessage)(targetMessage, {
                inlineElements: ['cp', 'sc', 'ec', 'mrk', 'sm', 'em'],
                placeholder: { elementName: 'ph', nameAttribute: 'equiv', bodyAttribute: 'disp' },
                placeholderContainer: { elementName: 'pc', startAttribute: 'equivStart', endAttribute: 'equivEnd' }
            }), translation = _a.translation, parseErrors = _a.parseErrors, serializeErrors = _a.serializeErrors;
            if (translation !== null) {
                bundle.translations[unit] = translation;
            }
            (0, translation_utils_1.addErrorsToBundle)(bundle, parseErrors);
            (0, translation_utils_1.addErrorsToBundle)(bundle, serializeErrors);
        };
        return Xliff2TranslationVisitor;
    }(base_visitor_1.BaseVisitor));
    function isFileElement(node) {
        return node instanceof compiler_1.Element && node.name === 'file';
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYyX3RyYW5zbGF0aW9uX3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMveGxpZmYyX3RyYW5zbGF0aW9uX3BhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOENBQTJFO0lBRTNFLDJFQUFpRDtJQUNqRCx5R0FBNEM7SUFFNUMsK0pBQTRFO0lBRTVFLHVJQUE4SjtJQUU5Sjs7Ozs7OztPQU9HO0lBQ0g7UUFBQTtRQTJEQSxDQUFDO1FBMURDOztXQUVHO1FBQ0gsMENBQVEsR0FBUixVQUFTLFFBQWdCLEVBQUUsUUFBZ0I7WUFDekMsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDaEQsT0FBTyxNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDeEMsQ0FBQztRQUVELHlDQUFPLEdBQVAsVUFBUSxRQUFnQixFQUFFLFFBQWdCO1lBQ3hDLE9BQU8sSUFBQSwrQkFBVyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDcEUsQ0FBQztRQUVELHVDQUFLLEdBQUwsVUFBTSxRQUFnQixFQUFFLFFBQWdCLEVBQUUsSUFBK0I7WUFFdkUsSUFBSSxJQUFJLEVBQUU7Z0JBQ1IsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2pDO2lCQUFNO2dCQUNMLE9BQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUN6RDtRQUNILENBQUM7UUFF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QVksQ0FBQyxJQUFJLENBQUMsR0FBRyxXQUFXLENBQUM7YUFDekM7WUFDRCxJQUFBLHFDQUFpQixFQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztZQUN2QyxJQUFBLHFDQUFpQixFQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBQ0gsK0JBQUM7SUFBRCxDQUFDLEFBMUVELENBQXVDLDBCQUFXLEdBMEVqRDtJQUVELFNBQVMsYUFBYSxDQUFDLElBQVU7UUFDL0IsT0FBTyxJQUFJLFlBQVksa0JBQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQztJQUN6RCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0VsZW1lbnQsIE5vZGUsIFBhcnNlRXJyb3JMZXZlbCwgdmlzaXRBbGx9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcblxuaW1wb3J0IHtEaWFnbm9zdGljc30gZnJvbSAnLi4vLi4vLi4vZGlhZ25vc3RpY3MnO1xuaW1wb3J0IHtCYXNlVmlzaXRvcn0gZnJvbSAnLi4vYmFzZV92aXNpdG9yJztcblxuaW1wb3J0IHtzZXJpYWxpemVUcmFuc2xhdGlvbk1lc3NhZ2V9IGZyb20gJy4vc2VyaWFsaXplX3RyYW5zbGF0aW9uX21lc3NhZ2UnO1xuaW1wb3J0IHtQYXJzZUFuYWx5c2lzLCBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSwgVHJhbnNsYXRpb25QYXJzZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fcGFyc2VyJztcbmltcG9ydCB7YWRkRXJyb3JzVG9CdW5kbGUsIGFkZFBhcnNlRGlhZ25vc3RpYywgYWRkUGFyc2VFcnJvciwgY2FuUGFyc2VYbWwsIGdldEF0dHJpYnV0ZSwgaXNOYW1lZEVsZW1lbnQsIFhtbFRyYW5zbGF0aW9uUGFyc2VySGludH0gZnJvbSAnLi90cmFuc2xhdGlvbl91dGlscyc7XG5cbi8qKlxuICogQSB0cmFuc2xhdGlvbiBwYXJzZXIgdGhhdCBjYW4gbG9hZCB0cmFuc2xhdGlvbnMgZnJvbSBYTElGRiAyIGZpbGVzLlxuICpcbiAqIGh0dHBzOi8vZG9jcy5vYXNpcy1vcGVuLm9yZy94bGlmZi94bGlmZi1jb3JlL3YyLjAvb3MveGxpZmYtY29yZS12Mi4wLW9zLmh0bWxcbiAqXG4gKiBAc2VlIFhsaWZmMlRyYW5zbGF0aW9uU2VyaWFsaXplclxuICogQHB1YmxpY0FwaSB1c2VkIGJ5IENMSVxuICovXG5leHBvcnQgY2xhc3MgWGxpZmYyVHJhbnNsYXRpb25QYXJzZXIgaW1wbGVtZW50cyBUcmFuc2xhdGlvblBhcnNlcjxYbWxUcmFuc2xhdGlvblBhcnNlckhpbnQ+IHtcbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICBjYW5QYXJzZShmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nKTogWG1sVHJhbnNsYXRpb25QYXJzZXJIaW50fGZhbHNlIHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLmFuYWx5emUoZmlsZVBhdGgsIGNvbnRlbnRzKTtcbiAgICByZXR1cm4gcmVzdWx0LmNhblBhcnNlICYmIHJlc3VsdC5oaW50O1xuICB9XG5cbiAgYW5hbHl6ZShmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nKTogUGFyc2VBbmFseXNpczxYbWxUcmFuc2xhdGlvblBhcnNlckhpbnQ+IHtcbiAgICByZXR1cm4gY2FuUGFyc2VYbWwoZmlsZVBhdGgsIGNvbnRlbnRzLCAneGxpZmYnLCB7dmVyc2lvbjogJzIuMCd9KTtcbiAgfVxuXG4gIHBhcnNlKGZpbGVQYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcsIGhpbnQ/OiBYbWxUcmFuc2xhdGlvblBhcnNlckhpbnQpOlxuICAgICAgUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUge1xuICAgIGlmIChoaW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5leHRyYWN0QnVuZGxlKGhpbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5leHRyYWN0QnVuZGxlRGVwcmVjYXRlZChmaWxlUGF0aCwgY29udGVudHMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZXh0cmFjdEJ1bmRsZSh7ZWxlbWVudCwgZXJyb3JzfTogWG1sVHJhbnNsYXRpb25QYXJzZXJIaW50KTogUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUge1xuICAgIGNvbnN0IGRpYWdub3N0aWNzID0gbmV3IERpYWdub3N0aWNzKCk7XG4gICAgZXJyb3JzLmZvckVhY2goZSA9PiBhZGRQYXJzZUVycm9yKGRpYWdub3N0aWNzLCBlKSk7XG5cbiAgICBjb25zdCBsb2NhbGUgPSBnZXRBdHRyaWJ1dGUoZWxlbWVudCwgJ3RyZ0xhbmcnKTtcbiAgICBjb25zdCBmaWxlcyA9IGVsZW1lbnQuY2hpbGRyZW4uZmlsdGVyKGlzRmlsZUVsZW1lbnQpO1xuICAgIGlmIChmaWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGFkZFBhcnNlRGlhZ25vc3RpYyhcbiAgICAgICAgICBkaWFnbm9zdGljcywgZWxlbWVudC5zb3VyY2VTcGFuLCAnTm8gPGZpbGU+IGVsZW1lbnRzIGZvdW5kIGluIDx4bGlmZj4nLFxuICAgICAgICAgIFBhcnNlRXJyb3JMZXZlbC5XQVJOSU5HKTtcbiAgICB9IGVsc2UgaWYgKGZpbGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgIGFkZFBhcnNlRGlhZ25vc3RpYyhcbiAgICAgICAgICBkaWFnbm9zdGljcywgZmlsZXNbMV0uc291cmNlU3BhbiwgJ01vcmUgdGhhbiBvbmUgPGZpbGU+IGVsZW1lbnQgZm91bmQgaW4gPHhsaWZmPicsXG4gICAgICAgICAgUGFyc2VFcnJvckxldmVsLldBUk5JTkcpO1xuICAgIH1cblxuICAgIGNvbnN0IGJ1bmRsZSA9IHtsb2NhbGUsIHRyYW5zbGF0aW9uczoge30sIGRpYWdub3N0aWNzfTtcbiAgICBjb25zdCB0cmFuc2xhdGlvblZpc2l0b3IgPSBuZXcgWGxpZmYyVHJhbnNsYXRpb25WaXNpdG9yKCk7XG4gICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICB2aXNpdEFsbCh0cmFuc2xhdGlvblZpc2l0b3IsIGZpbGUuY2hpbGRyZW4sIHtidW5kbGV9KTtcbiAgICB9XG4gICAgcmV0dXJuIGJ1bmRsZTtcbiAgfVxuXG4gIHByaXZhdGUgZXh0cmFjdEJ1bmRsZURlcHJlY2F0ZWQoZmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZykge1xuICAgIGNvbnN0IGhpbnQgPSB0aGlzLmNhblBhcnNlKGZpbGVQYXRoLCBjb250ZW50cyk7XG4gICAgaWYgKCFoaW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBwYXJzZSBcIiR7ZmlsZVBhdGh9XCIgYXMgWExJRkYgMi4wIGZvcm1hdC5gKTtcbiAgICB9XG4gICAgY29uc3QgYnVuZGxlID0gdGhpcy5leHRyYWN0QnVuZGxlKGhpbnQpO1xuICAgIGlmIChidW5kbGUuZGlhZ25vc3RpY3MuaGFzRXJyb3JzKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID1cbiAgICAgICAgICBidW5kbGUuZGlhZ25vc3RpY3MuZm9ybWF0RGlhZ25vc3RpY3MoYEZhaWxlZCB0byBwYXJzZSBcIiR7ZmlsZVBhdGh9XCIgYXMgWExJRkYgMi4wIGZvcm1hdGApO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH1cbiAgICByZXR1cm4gYnVuZGxlO1xuICB9XG59XG5cblxuaW50ZXJmYWNlIFRyYW5zbGF0aW9uVmlzaXRvckNvbnRleHQge1xuICB1bml0Pzogc3RyaW5nO1xuICBidW5kbGU6IFBhcnNlZFRyYW5zbGF0aW9uQnVuZGxlO1xufVxuXG5jbGFzcyBYbGlmZjJUcmFuc2xhdGlvblZpc2l0b3IgZXh0ZW5kcyBCYXNlVmlzaXRvciB7XG4gIG92ZXJyaWRlIHZpc2l0RWxlbWVudChlbGVtZW50OiBFbGVtZW50LCB7YnVuZGxlLCB1bml0fTogVHJhbnNsYXRpb25WaXNpdG9yQ29udGV4dCk6IGFueSB7XG4gICAgaWYgKGVsZW1lbnQubmFtZSA9PT0gJ3VuaXQnKSB7XG4gICAgICB0aGlzLnZpc2l0VW5pdEVsZW1lbnQoZWxlbWVudCwgYnVuZGxlKTtcbiAgICB9IGVsc2UgaWYgKGVsZW1lbnQubmFtZSA9PT0gJ3NlZ21lbnQnKSB7XG4gICAgICB0aGlzLnZpc2l0U2VnbWVudEVsZW1lbnQoZWxlbWVudCwgYnVuZGxlLCB1bml0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmlzaXRBbGwodGhpcywgZWxlbWVudC5jaGlsZHJlbiwge2J1bmRsZSwgdW5pdH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdmlzaXRVbml0RWxlbWVudChlbGVtZW50OiBFbGVtZW50LCBidW5kbGU6IFBhcnNlZFRyYW5zbGF0aW9uQnVuZGxlKTogdm9pZCB7XG4gICAgLy8gRXJyb3IgaWYgbm8gYGlkYCBhdHRyaWJ1dGVcbiAgICBjb25zdCBleHRlcm5hbElkID0gZ2V0QXR0cmlidXRlKGVsZW1lbnQsICdpZCcpO1xuICAgIGlmIChleHRlcm5hbElkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGFkZFBhcnNlRGlhZ25vc3RpYyhcbiAgICAgICAgICBidW5kbGUuZGlhZ25vc3RpY3MsIGVsZW1lbnQuc291cmNlU3BhbixcbiAgICAgICAgICBgTWlzc2luZyByZXF1aXJlZCBcImlkXCIgYXR0cmlidXRlIG9uIDx0cmFucy11bml0PiBlbGVtZW50LmAsIFBhcnNlRXJyb3JMZXZlbC5FUlJPUik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRXJyb3IgaWYgdGhlcmUgaXMgYWxyZWFkeSBhIHRyYW5zbGF0aW9uIHdpdGggdGhlIHNhbWUgaWRcbiAgICBpZiAoYnVuZGxlLnRyYW5zbGF0aW9uc1tleHRlcm5hbElkXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhZGRQYXJzZURpYWdub3N0aWMoXG4gICAgICAgICAgYnVuZGxlLmRpYWdub3N0aWNzLCBlbGVtZW50LnNvdXJjZVNwYW4sXG4gICAgICAgICAgYER1cGxpY2F0ZWQgdHJhbnNsYXRpb25zIGZvciBtZXNzYWdlIFwiJHtleHRlcm5hbElkfVwiYCwgUGFyc2VFcnJvckxldmVsLkVSUk9SKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2aXNpdEFsbCh0aGlzLCBlbGVtZW50LmNoaWxkcmVuLCB7YnVuZGxlLCB1bml0OiBleHRlcm5hbElkfSk7XG4gIH1cblxuICBwcml2YXRlIHZpc2l0U2VnbWVudEVsZW1lbnQoXG4gICAgICBlbGVtZW50OiBFbGVtZW50LCBidW5kbGU6IFBhcnNlZFRyYW5zbGF0aW9uQnVuZGxlLCB1bml0OiBzdHJpbmd8dW5kZWZpbmVkKTogdm9pZCB7XG4gICAgLy8gQSBgPHNlZ21lbnQ+YCBlbGVtZW50IG11c3QgYmUgYmVsb3cgYSBgPHVuaXQ+YCBlbGVtZW50XG4gICAgaWYgKHVuaXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgYWRkUGFyc2VEaWFnbm9zdGljKFxuICAgICAgICAgIGJ1bmRsZS5kaWFnbm9zdGljcywgZWxlbWVudC5zb3VyY2VTcGFuLFxuICAgICAgICAgICdJbnZhbGlkIDxzZWdtZW50PiBlbGVtZW50OiBzaG91bGQgYmUgYSBjaGlsZCBvZiBhIDx1bml0PiBlbGVtZW50LicsXG4gICAgICAgICAgUGFyc2VFcnJvckxldmVsLkVSUk9SKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgdGFyZ2V0TWVzc2FnZSA9IGVsZW1lbnQuY2hpbGRyZW4uZmluZChpc05hbWVkRWxlbWVudCgndGFyZ2V0JykpO1xuICAgIGlmICh0YXJnZXRNZXNzYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIFdhcm4gaWYgdGhlcmUgaXMgbm8gYDx0YXJnZXQ+YCBjaGlsZCBlbGVtZW50XG4gICAgICBhZGRQYXJzZURpYWdub3N0aWMoXG4gICAgICAgICAgYnVuZGxlLmRpYWdub3N0aWNzLCBlbGVtZW50LnNvdXJjZVNwYW4sICdNaXNzaW5nIDx0YXJnZXQ+IGVsZW1lbnQnLFxuICAgICAgICAgIFBhcnNlRXJyb3JMZXZlbC5XQVJOSU5HKTtcblxuICAgICAgLy8gRmFsbGJhY2sgdG8gdGhlIGA8c291cmNlPmAgZWxlbWVudCBpZiBhdmFpbGFibGUuXG4gICAgICB0YXJnZXRNZXNzYWdlID0gZWxlbWVudC5jaGlsZHJlbi5maW5kKGlzTmFtZWRFbGVtZW50KCdzb3VyY2UnKSk7XG4gICAgICBpZiAodGFyZ2V0TWVzc2FnZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIEVycm9yIGlmIHRoZXJlIGlzIG5laXRoZXIgYDx0YXJnZXQ+YCBub3IgYDxzb3VyY2U+YC5cbiAgICAgICAgYWRkUGFyc2VEaWFnbm9zdGljKFxuICAgICAgICAgICAgYnVuZGxlLmRpYWdub3N0aWNzLCBlbGVtZW50LnNvdXJjZVNwYW4sXG4gICAgICAgICAgICAnTWlzc2luZyByZXF1aXJlZCBlbGVtZW50OiBvbmUgb2YgPHRhcmdldD4gb3IgPHNvdXJjZT4gaXMgcmVxdWlyZWQnLFxuICAgICAgICAgICAgUGFyc2VFcnJvckxldmVsLkVSUk9SKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHt0cmFuc2xhdGlvbiwgcGFyc2VFcnJvcnMsIHNlcmlhbGl6ZUVycm9yc30gPSBzZXJpYWxpemVUcmFuc2xhdGlvbk1lc3NhZ2UodGFyZ2V0TWVzc2FnZSwge1xuICAgICAgaW5saW5lRWxlbWVudHM6IFsnY3AnLCAnc2MnLCAnZWMnLCAnbXJrJywgJ3NtJywgJ2VtJ10sXG4gICAgICBwbGFjZWhvbGRlcjoge2VsZW1lbnROYW1lOiAncGgnLCBuYW1lQXR0cmlidXRlOiAnZXF1aXYnLCBib2R5QXR0cmlidXRlOiAnZGlzcCd9LFxuICAgICAgcGxhY2Vob2xkZXJDb250YWluZXI6XG4gICAgICAgICAge2VsZW1lbnROYW1lOiAncGMnLCBzdGFydEF0dHJpYnV0ZTogJ2VxdWl2U3RhcnQnLCBlbmRBdHRyaWJ1dGU6ICdlcXVpdkVuZCd9XG4gICAgfSk7XG4gICAgaWYgKHRyYW5zbGF0aW9uICE9PSBudWxsKSB7XG4gICAgICBidW5kbGUudHJhbnNsYXRpb25zW3VuaXRdID0gdHJhbnNsYXRpb247XG4gICAgfVxuICAgIGFkZEVycm9yc1RvQnVuZGxlKGJ1bmRsZSwgcGFyc2VFcnJvcnMpO1xuICAgIGFkZEVycm9yc1RvQnVuZGxlKGJ1bmRsZSwgc2VyaWFsaXplRXJyb3JzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0ZpbGVFbGVtZW50KG5vZGU6IE5vZGUpOiBub2RlIGlzIEVsZW1lbnQge1xuICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIEVsZW1lbnQgJiYgbm9kZS5uYW1lID09PSAnZmlsZSc7XG59XG4iXX0=
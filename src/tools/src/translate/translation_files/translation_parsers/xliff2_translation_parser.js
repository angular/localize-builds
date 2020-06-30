(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff2_translation_parser", ["require", "exports", "tslib", "@angular/compiler", "@angular/localize/src/tools/src/diagnostics", "@angular/localize/src/tools/src/translate/translation_files/base_visitor", "@angular/localize/src/tools/src/translate/translation_files/message_serialization/message_serializer", "@angular/localize/src/tools/src/translate/translation_files/message_serialization/target_message_renderer", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils"], factory);
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
    var message_serializer_1 = require("@angular/localize/src/tools/src/translate/translation_files/message_serialization/message_serializer");
    var target_message_renderer_1 = require("@angular/localize/src/tools/src/translate/translation_files/message_serialization/target_message_renderer");
    var translation_utils_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils");
    /**
     * A translation parser that can load translations from XLIFF 2 files.
     *
     * http://docs.oasis-open.org/xliff/xliff-core/v2.0/os/xliff-core-v2.0-os.html
     *
     * @see Xliff2TranslationSerializer
     */
    var Xliff2TranslationParser = /** @class */ (function () {
        function Xliff2TranslationParser() {
        }
        Xliff2TranslationParser.prototype.canParse = function (filePath, contents) {
            return translation_utils_1.canParseXml(filePath, contents, 'xliff', { version: '2.0' });
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
            errors.forEach(function (e) { return translation_utils_1.addParseError(diagnostics, e); });
            var locale = translation_utils_1.getAttribute(element, 'trgLang');
            var files = element.children.filter(isFileElement);
            if (files.length === 0) {
                translation_utils_1.addParseDiagnostic(diagnostics, element.sourceSpan, 'No <file> elements found in <xliff>', compiler_1.ParseErrorLevel.WARNING);
            }
            else if (files.length > 1) {
                translation_utils_1.addParseDiagnostic(diagnostics, files[1].sourceSpan, 'More than one <file> element found in <xliff>', compiler_1.ParseErrorLevel.WARNING);
            }
            var bundle = { locale: locale, translations: {}, diagnostics: diagnostics };
            var translationVisitor = new Xliff2TranslationVisitor();
            try {
                for (var files_1 = tslib_1.__values(files), files_1_1 = files_1.next(); !files_1_1.done; files_1_1 = files_1.next()) {
                    var file = files_1_1.value;
                    compiler_1.visitAll(translationVisitor, file.children, { bundle: bundle });
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
        tslib_1.__extends(Xliff2TranslationVisitor, _super);
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
                compiler_1.visitAll(this, element.children, { bundle: bundle, unit: unit });
            }
        };
        Xliff2TranslationVisitor.prototype.visitUnitElement = function (element, bundle) {
            // Error if no `id` attribute
            var externalId = translation_utils_1.getAttribute(element, 'id');
            if (externalId === undefined) {
                translation_utils_1.addParseDiagnostic(bundle.diagnostics, element.sourceSpan, "Missing required \"id\" attribute on <trans-unit> element.", compiler_1.ParseErrorLevel.ERROR);
                return;
            }
            // Error if there is already a translation with the same id
            if (bundle.translations[externalId] !== undefined) {
                translation_utils_1.addParseDiagnostic(bundle.diagnostics, element.sourceSpan, "Duplicated translations for message \"" + externalId + "\"", compiler_1.ParseErrorLevel.ERROR);
                return;
            }
            compiler_1.visitAll(this, element.children, { bundle: bundle, unit: externalId });
        };
        Xliff2TranslationVisitor.prototype.visitSegmentElement = function (element, bundle, unit) {
            // A `<segment>` element must be below a `<unit>` element
            if (unit === undefined) {
                translation_utils_1.addParseDiagnostic(bundle.diagnostics, element.sourceSpan, 'Invalid <segment> element: should be a child of a <unit> element.', compiler_1.ParseErrorLevel.ERROR);
                return;
            }
            var targetMessage = element.children.find(translation_utils_1.isNamedElement('target'));
            if (targetMessage === undefined) {
                translation_utils_1.addParseDiagnostic(bundle.diagnostics, element.sourceSpan, 'Missing required <target> element', compiler_1.ParseErrorLevel.ERROR);
                return;
            }
            try {
                bundle.translations[unit] = serializeTargetMessage(targetMessage);
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
        return Xliff2TranslationVisitor;
    }(base_visitor_1.BaseVisitor));
    function serializeTargetMessage(source) {
        var serializer = new message_serializer_1.MessageSerializer(new target_message_renderer_1.TargetMessageRenderer(), {
            inlineElements: ['cp', 'sc', 'ec', 'mrk', 'sm', 'em'],
            placeholder: { elementName: 'ph', nameAttribute: 'equiv', bodyAttribute: 'disp' },
            placeholderContainer: { elementName: 'pc', startAttribute: 'equivStart', endAttribute: 'equivEnd' }
        });
        return serializer.serialize(translation_utils_1.parseInnerRange(source));
    }
    function isFileElement(node) {
        return node instanceof compiler_1.Element && node.name === 'file';
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYyX3RyYW5zbGF0aW9uX3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMveGxpZmYyX3RyYW5zbGF0aW9uX3BhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOENBQTJFO0lBRzNFLDJFQUFpRDtJQUNqRCx5R0FBNEM7SUFDNUMsMklBQThFO0lBQzlFLHFKQUF1RjtJQUd2Rix1SUFBNEo7SUFFNUo7Ozs7OztPQU1HO0lBQ0g7UUFBQTtRQW1EQSxDQUFDO1FBbERDLDBDQUFRLEdBQVIsVUFBUyxRQUFnQixFQUFFLFFBQWdCO1lBQ3pDLE9BQU8sK0JBQVcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBQ3BFLENBQUM7UUFFRCx1Q0FBSyxHQUFMLFVBQU0sUUFBZ0IsRUFBRSxRQUFnQixFQUFFLElBQStCO1lBRXZFLElBQUksSUFBSSxFQUFFO2dCQUNSLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNqQztpQkFBTTtnQkFDTCxPQUFPLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDekQ7UUFDSCxDQUFDO1FBRU8sK0NBQWEsR0FBckIsVUFBc0IsRUFBMkM7O2dCQUExQyxPQUFPLGFBQUEsRUFBRSxNQUFNLFlBQUE7WUFDcEMsSUFBTSxXQUFXLEdBQUcsSUFBSSx5QkFBVyxFQUFFLENBQUM7WUFDdEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLGlDQUFhLENBQUMsV0FBVyxFQUFFLENB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QUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RWxlbWVudCwgTm9kZSwgUGFyc2VFcnJvckxldmVsLCB2aXNpdEFsbH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0IHvJtVBhcnNlZFRyYW5zbGF0aW9ufSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5cbmltcG9ydCB7RGlhZ25vc3RpY3N9IGZyb20gJy4uLy4uLy4uL2RpYWdub3N0aWNzJztcbmltcG9ydCB7QmFzZVZpc2l0b3J9IGZyb20gJy4uL2Jhc2VfdmlzaXRvcic7XG5pbXBvcnQge01lc3NhZ2VTZXJpYWxpemVyfSBmcm9tICcuLi9tZXNzYWdlX3NlcmlhbGl6YXRpb24vbWVzc2FnZV9zZXJpYWxpemVyJztcbmltcG9ydCB7VGFyZ2V0TWVzc2FnZVJlbmRlcmVyfSBmcm9tICcuLi9tZXNzYWdlX3NlcmlhbGl6YXRpb24vdGFyZ2V0X21lc3NhZ2VfcmVuZGVyZXInO1xuXG5pbXBvcnQge1BhcnNlZFRyYW5zbGF0aW9uQnVuZGxlLCBUcmFuc2xhdGlvblBhcnNlcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9wYXJzZXInO1xuaW1wb3J0IHthZGRQYXJzZURpYWdub3N0aWMsIGFkZFBhcnNlRXJyb3IsIGNhblBhcnNlWG1sLCBnZXRBdHRyaWJ1dGUsIGlzTmFtZWRFbGVtZW50LCBwYXJzZUlubmVyUmFuZ2UsIFhtbFRyYW5zbGF0aW9uUGFyc2VySGludH0gZnJvbSAnLi90cmFuc2xhdGlvbl91dGlscyc7XG5cbi8qKlxuICogQSB0cmFuc2xhdGlvbiBwYXJzZXIgdGhhdCBjYW4gbG9hZCB0cmFuc2xhdGlvbnMgZnJvbSBYTElGRiAyIGZpbGVzLlxuICpcbiAqIGh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL3hsaWZmL3hsaWZmLWNvcmUvdjIuMC9vcy94bGlmZi1jb3JlLXYyLjAtb3MuaHRtbFxuICpcbiAqIEBzZWUgWGxpZmYyVHJhbnNsYXRpb25TZXJpYWxpemVyXG4gKi9cbmV4cG9ydCBjbGFzcyBYbGlmZjJUcmFuc2xhdGlvblBhcnNlciBpbXBsZW1lbnRzIFRyYW5zbGF0aW9uUGFyc2VyPFhtbFRyYW5zbGF0aW9uUGFyc2VySGludD4ge1xuICBjYW5QYXJzZShmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nKTogWG1sVHJhbnNsYXRpb25QYXJzZXJIaW50fGZhbHNlIHtcbiAgICByZXR1cm4gY2FuUGFyc2VYbWwoZmlsZVBhdGgsIGNvbnRlbnRzLCAneGxpZmYnLCB7dmVyc2lvbjogJzIuMCd9KTtcbiAgfVxuXG4gIHBhcnNlKGZpbGVQYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcsIGhpbnQ/OiBYbWxUcmFuc2xhdGlvblBhcnNlckhpbnQpOlxuICAgICAgUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUge1xuICAgIGlmIChoaW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5leHRyYWN0QnVuZGxlKGhpbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5leHRyYWN0QnVuZGxlRGVwcmVjYXRlZChmaWxlUGF0aCwgY29udGVudHMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZXh0cmFjdEJ1bmRsZSh7ZWxlbWVudCwgZXJyb3JzfTogWG1sVHJhbnNsYXRpb25QYXJzZXJIaW50KTogUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUge1xuICAgIGNvbnN0IGRpYWdub3N0aWNzID0gbmV3IERpYWdub3N0aWNzKCk7XG4gICAgZXJyb3JzLmZvckVhY2goZSA9PiBhZGRQYXJzZUVycm9yKGRpYWdub3N0aWNzLCBlKSk7XG5cbiAgICBjb25zdCBsb2NhbGUgPSBnZXRBdHRyaWJ1dGUoZWxlbWVudCwgJ3RyZ0xhbmcnKTtcbiAgICBjb25zdCBmaWxlcyA9IGVsZW1lbnQuY2hpbGRyZW4uZmlsdGVyKGlzRmlsZUVsZW1lbnQpO1xuICAgIGlmIChmaWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGFkZFBhcnNlRGlhZ25vc3RpYyhcbiAgICAgICAgICBkaWFnbm9zdGljcywgZWxlbWVudC5zb3VyY2VTcGFuLCAnTm8gPGZpbGU+IGVsZW1lbnRzIGZvdW5kIGluIDx4bGlmZj4nLFxuICAgICAgICAgIFBhcnNlRXJyb3JMZXZlbC5XQVJOSU5HKTtcbiAgICB9IGVsc2UgaWYgKGZpbGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgIGFkZFBhcnNlRGlhZ25vc3RpYyhcbiAgICAgICAgICBkaWFnbm9zdGljcywgZmlsZXNbMV0uc291cmNlU3BhbiwgJ01vcmUgdGhhbiBvbmUgPGZpbGU+IGVsZW1lbnQgZm91bmQgaW4gPHhsaWZmPicsXG4gICAgICAgICAgUGFyc2VFcnJvckxldmVsLldBUk5JTkcpO1xuICAgIH1cblxuICAgIGNvbnN0IGJ1bmRsZSA9IHtsb2NhbGUsIHRyYW5zbGF0aW9uczoge30sIGRpYWdub3N0aWNzfTtcbiAgICBjb25zdCB0cmFuc2xhdGlvblZpc2l0b3IgPSBuZXcgWGxpZmYyVHJhbnNsYXRpb25WaXNpdG9yKCk7XG4gICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICB2aXNpdEFsbCh0cmFuc2xhdGlvblZpc2l0b3IsIGZpbGUuY2hpbGRyZW4sIHtidW5kbGV9KTtcbiAgICB9XG4gICAgcmV0dXJuIGJ1bmRsZTtcbiAgfVxuXG4gIHByaXZhdGUgZXh0cmFjdEJ1bmRsZURlcHJlY2F0ZWQoZmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZykge1xuICAgIGNvbnN0IGhpbnQgPSB0aGlzLmNhblBhcnNlKGZpbGVQYXRoLCBjb250ZW50cyk7XG4gICAgaWYgKCFoaW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBwYXJzZSBcIiR7ZmlsZVBhdGh9XCIgYXMgWExJRkYgMi4wIGZvcm1hdC5gKTtcbiAgICB9XG4gICAgY29uc3QgYnVuZGxlID0gdGhpcy5leHRyYWN0QnVuZGxlKGhpbnQpO1xuICAgIGlmIChidW5kbGUuZGlhZ25vc3RpY3MuaGFzRXJyb3JzKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID1cbiAgICAgICAgICBidW5kbGUuZGlhZ25vc3RpY3MuZm9ybWF0RGlhZ25vc3RpY3MoYEZhaWxlZCB0byBwYXJzZSBcIiR7ZmlsZVBhdGh9XCIgYXMgWExJRkYgMi4wIGZvcm1hdGApO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH1cbiAgICByZXR1cm4gYnVuZGxlO1xuICB9XG59XG5cblxuaW50ZXJmYWNlIFRyYW5zbGF0aW9uVmlzaXRvckNvbnRleHQge1xuICB1bml0Pzogc3RyaW5nO1xuICBidW5kbGU6IFBhcnNlZFRyYW5zbGF0aW9uQnVuZGxlO1xufVxuXG5jbGFzcyBYbGlmZjJUcmFuc2xhdGlvblZpc2l0b3IgZXh0ZW5kcyBCYXNlVmlzaXRvciB7XG4gIHZpc2l0RWxlbWVudChlbGVtZW50OiBFbGVtZW50LCB7YnVuZGxlLCB1bml0fTogVHJhbnNsYXRpb25WaXNpdG9yQ29udGV4dCk6IGFueSB7XG4gICAgaWYgKGVsZW1lbnQubmFtZSA9PT0gJ3VuaXQnKSB7XG4gICAgICB0aGlzLnZpc2l0VW5pdEVsZW1lbnQoZWxlbWVudCwgYnVuZGxlKTtcbiAgICB9IGVsc2UgaWYgKGVsZW1lbnQubmFtZSA9PT0gJ3NlZ21lbnQnKSB7XG4gICAgICB0aGlzLnZpc2l0U2VnbWVudEVsZW1lbnQoZWxlbWVudCwgYnVuZGxlLCB1bml0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmlzaXRBbGwodGhpcywgZWxlbWVudC5jaGlsZHJlbiwge2J1bmRsZSwgdW5pdH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdmlzaXRVbml0RWxlbWVudChlbGVtZW50OiBFbGVtZW50LCBidW5kbGU6IFBhcnNlZFRyYW5zbGF0aW9uQnVuZGxlKTogdm9pZCB7XG4gICAgLy8gRXJyb3IgaWYgbm8gYGlkYCBhdHRyaWJ1dGVcbiAgICBjb25zdCBleHRlcm5hbElkID0gZ2V0QXR0cmlidXRlKGVsZW1lbnQsICdpZCcpO1xuICAgIGlmIChleHRlcm5hbElkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGFkZFBhcnNlRGlhZ25vc3RpYyhcbiAgICAgICAgICBidW5kbGUuZGlhZ25vc3RpY3MsIGVsZW1lbnQuc291cmNlU3BhbixcbiAgICAgICAgICBgTWlzc2luZyByZXF1aXJlZCBcImlkXCIgYXR0cmlidXRlIG9uIDx0cmFucy11bml0PiBlbGVtZW50LmAsIFBhcnNlRXJyb3JMZXZlbC5FUlJPUik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRXJyb3IgaWYgdGhlcmUgaXMgYWxyZWFkeSBhIHRyYW5zbGF0aW9uIHdpdGggdGhlIHNhbWUgaWRcbiAgICBpZiAoYnVuZGxlLnRyYW5zbGF0aW9uc1tleHRlcm5hbElkXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhZGRQYXJzZURpYWdub3N0aWMoXG4gICAgICAgICAgYnVuZGxlLmRpYWdub3N0aWNzLCBlbGVtZW50LnNvdXJjZVNwYW4sXG4gICAgICAgICAgYER1cGxpY2F0ZWQgdHJhbnNsYXRpb25zIGZvciBtZXNzYWdlIFwiJHtleHRlcm5hbElkfVwiYCwgUGFyc2VFcnJvckxldmVsLkVSUk9SKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2aXNpdEFsbCh0aGlzLCBlbGVtZW50LmNoaWxkcmVuLCB7YnVuZGxlLCB1bml0OiBleHRlcm5hbElkfSk7XG4gIH1cblxuICBwcml2YXRlIHZpc2l0U2VnbWVudEVsZW1lbnQoXG4gICAgICBlbGVtZW50OiBFbGVtZW50LCBidW5kbGU6IFBhcnNlZFRyYW5zbGF0aW9uQnVuZGxlLCB1bml0OiBzdHJpbmd8dW5kZWZpbmVkKTogdm9pZCB7XG4gICAgLy8gQSBgPHNlZ21lbnQ+YCBlbGVtZW50IG11c3QgYmUgYmVsb3cgYSBgPHVuaXQ+YCBlbGVtZW50XG4gICAgaWYgKHVuaXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgYWRkUGFyc2VEaWFnbm9zdGljKFxuICAgICAgICAgIGJ1bmRsZS5kaWFnbm9zdGljcywgZWxlbWVudC5zb3VyY2VTcGFuLFxuICAgICAgICAgICdJbnZhbGlkIDxzZWdtZW50PiBlbGVtZW50OiBzaG91bGQgYmUgYSBjaGlsZCBvZiBhIDx1bml0PiBlbGVtZW50LicsXG4gICAgICAgICAgUGFyc2VFcnJvckxldmVsLkVSUk9SKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0YXJnZXRNZXNzYWdlID0gZWxlbWVudC5jaGlsZHJlbi5maW5kKGlzTmFtZWRFbGVtZW50KCd0YXJnZXQnKSk7XG4gICAgaWYgKHRhcmdldE1lc3NhZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgYWRkUGFyc2VEaWFnbm9zdGljKFxuICAgICAgICAgIGJ1bmRsZS5kaWFnbm9zdGljcywgZWxlbWVudC5zb3VyY2VTcGFuLCAnTWlzc2luZyByZXF1aXJlZCA8dGFyZ2V0PiBlbGVtZW50JyxcbiAgICAgICAgICBQYXJzZUVycm9yTGV2ZWwuRVJST1IpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBidW5kbGUudHJhbnNsYXRpb25zW3VuaXRdID0gc2VyaWFsaXplVGFyZ2V0TWVzc2FnZSh0YXJnZXRNZXNzYWdlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBDYXB0dXJlIGFueSBlcnJvcnMgZnJvbSBzZXJpYWxpemUgdGhlIHRhcmdldCBtZXNzYWdlXG4gICAgICBpZiAoZS5zcGFuICYmIGUubXNnICYmIGUubGV2ZWwpIHtcbiAgICAgICAgYWRkUGFyc2VEaWFnbm9zdGljKGJ1bmRsZS5kaWFnbm9zdGljcywgZS5zcGFuLCBlLm1zZywgZS5sZXZlbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVUYXJnZXRNZXNzYWdlKHNvdXJjZTogRWxlbWVudCk6IMm1UGFyc2VkVHJhbnNsYXRpb24ge1xuICBjb25zdCBzZXJpYWxpemVyID0gbmV3IE1lc3NhZ2VTZXJpYWxpemVyKG5ldyBUYXJnZXRNZXNzYWdlUmVuZGVyZXIoKSwge1xuICAgIGlubGluZUVsZW1lbnRzOiBbJ2NwJywgJ3NjJywgJ2VjJywgJ21yaycsICdzbScsICdlbSddLFxuICAgIHBsYWNlaG9sZGVyOiB7ZWxlbWVudE5hbWU6ICdwaCcsIG5hbWVBdHRyaWJ1dGU6ICdlcXVpdicsIGJvZHlBdHRyaWJ1dGU6ICdkaXNwJ30sXG4gICAgcGxhY2Vob2xkZXJDb250YWluZXI6XG4gICAgICAgIHtlbGVtZW50TmFtZTogJ3BjJywgc3RhcnRBdHRyaWJ1dGU6ICdlcXVpdlN0YXJ0JywgZW5kQXR0cmlidXRlOiAnZXF1aXZFbmQnfVxuICB9KTtcbiAgcmV0dXJuIHNlcmlhbGl6ZXIuc2VyaWFsaXplKHBhcnNlSW5uZXJSYW5nZShzb3VyY2UpKTtcbn1cblxuZnVuY3Rpb24gaXNGaWxlRWxlbWVudChub2RlOiBOb2RlKTogbm9kZSBpcyBFbGVtZW50IHtcbiAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBFbGVtZW50ICYmIG5vZGUubmFtZSA9PT0gJ2ZpbGUnO1xufVxuIl19
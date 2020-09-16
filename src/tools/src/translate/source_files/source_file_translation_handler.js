(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/source_files/source_file_translation_handler", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@babel/core", "@angular/localize/src/tools/src/translate/source_files/es2015_translate_plugin", "@angular/localize/src/tools/src/translate/source_files/es5_translate_plugin", "@angular/localize/src/tools/src/translate/source_files/locale_plugin"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SourceFileTranslationHandler = void 0;
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var core_1 = require("@babel/core");
    var es2015_translate_plugin_1 = require("@angular/localize/src/tools/src/translate/source_files/es2015_translate_plugin");
    var es5_translate_plugin_1 = require("@angular/localize/src/tools/src/translate/source_files/es5_translate_plugin");
    var locale_plugin_1 = require("@angular/localize/src/tools/src/translate/source_files/locale_plugin");
    /**
     * Translate a file by inlining all messages tagged by `$localize` with the appropriate translated
     * message.
     */
    var SourceFileTranslationHandler = /** @class */ (function () {
        function SourceFileTranslationHandler(fs, translationOptions) {
            if (translationOptions === void 0) { translationOptions = {}; }
            this.fs = fs;
            this.translationOptions = translationOptions;
            this.sourceLocaleOptions = tslib_1.__assign(tslib_1.__assign({}, this.translationOptions), { missingTranslation: 'ignore' });
        }
        SourceFileTranslationHandler.prototype.canTranslate = function (relativeFilePath, _contents) {
            return this.fs.extname(relativeFilePath) === '.js';
        };
        SourceFileTranslationHandler.prototype.translate = function (diagnostics, sourceRoot, relativeFilePath, contents, outputPathFn, translations, sourceLocale) {
            var e_1, _a, e_2, _b;
            var sourceCode = Buffer.from(contents).toString('utf8');
            // A short-circuit check to avoid parsing the file into an AST if it does not contain any
            // `$localize` identifiers.
            if (!sourceCode.includes('$localize')) {
                try {
                    for (var translations_1 = tslib_1.__values(translations), translations_1_1 = translations_1.next(); !translations_1_1.done; translations_1_1 = translations_1.next()) {
                        var translation = translations_1_1.value;
                        this.writeSourceFile(diagnostics, outputPathFn, translation.locale, relativeFilePath, contents);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (translations_1_1 && !translations_1_1.done && (_a = translations_1.return)) _a.call(translations_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                if (sourceLocale !== undefined) {
                    this.writeSourceFile(diagnostics, outputPathFn, sourceLocale, relativeFilePath, contents);
                }
            }
            else {
                var ast = core_1.parseSync(sourceCode, { sourceRoot: sourceRoot, filename: relativeFilePath });
                if (!ast) {
                    diagnostics.error("Unable to parse source file: " + this.fs.join(sourceRoot, relativeFilePath));
                    return;
                }
                try {
                    // Output a translated copy of the file for each locale.
                    for (var translations_2 = tslib_1.__values(translations), translations_2_1 = translations_2.next(); !translations_2_1.done; translations_2_1 = translations_2.next()) {
                        var translationBundle = translations_2_1.value;
                        this.translateFile(diagnostics, ast, translationBundle, sourceRoot, relativeFilePath, outputPathFn, this.translationOptions);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (translations_2_1 && !translations_2_1.done && (_b = translations_2.return)) _b.call(translations_2);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                if (sourceLocale !== undefined) {
                    // Also output a copy of the file for the source locale.
                    // There will be no translations - by definition - so we "ignore" `missingTranslations`.
                    this.translateFile(diagnostics, ast, { locale: sourceLocale, translations: {} }, sourceRoot, relativeFilePath, outputPathFn, this.sourceLocaleOptions);
                }
            }
        };
        SourceFileTranslationHandler.prototype.translateFile = function (diagnostics, ast, translationBundle, sourceRoot, filename, outputPathFn, options) {
            var translated = core_1.transformFromAstSync(ast, undefined, {
                compact: true,
                generatorOpts: { minified: true },
                plugins: [
                    locale_plugin_1.makeLocalePlugin(translationBundle.locale),
                    es2015_translate_plugin_1.makeEs2015TranslatePlugin(diagnostics, translationBundle.translations, options),
                    es5_translate_plugin_1.makeEs5TranslatePlugin(diagnostics, translationBundle.translations, options),
                ],
                filename: filename,
            });
            if (translated && translated.code) {
                this.writeSourceFile(diagnostics, outputPathFn, translationBundle.locale, filename, translated.code);
                var outputPath = file_system_1.absoluteFrom(outputPathFn(translationBundle.locale, filename));
                this.fs.ensureDir(this.fs.dirname(outputPath));
                this.fs.writeFile(outputPath, translated.code);
            }
            else {
                diagnostics.error("Unable to translate source file: " + this.fs.join(sourceRoot, filename));
                return;
            }
        };
        SourceFileTranslationHandler.prototype.writeSourceFile = function (diagnostics, outputPathFn, locale, relativeFilePath, contents) {
            try {
                var outputPath = file_system_1.absoluteFrom(outputPathFn(locale, relativeFilePath));
                this.fs.ensureDir(this.fs.dirname(outputPath));
                this.fs.writeFile(outputPath, contents);
            }
            catch (e) {
                diagnostics.error(e.message);
            }
        };
        return SourceFileTranslationHandler;
    }());
    exports.SourceFileTranslationHandler = SourceFileTranslationHandler;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX2ZpbGVfdHJhbnNsYXRpb25faGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3NvdXJjZV9maWxlcy9zb3VyY2VfZmlsZV90cmFuc2xhdGlvbl9oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCwyRUFBa0g7SUFDbEgsb0NBQTREO0lBUTVELDBIQUFvRTtJQUNwRSxvSEFBOEQ7SUFDOUQsc0dBQWlEO0lBRWpEOzs7T0FHRztJQUNIO1FBR0Usc0NBQW9CLEVBQWMsRUFBVSxrQkFBK0M7WUFBL0MsbUNBQUEsRUFBQSx1QkFBK0M7WUFBdkUsT0FBRSxHQUFGLEVBQUUsQ0FBWTtZQUFVLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBNkI7WUFGbkYsd0JBQW1CLHlDQUNNLElBQUksQ0FBQyxrQkFBa0IsS0FBRSxrQkFBa0IsRUFBRSxRQUFRLElBQUU7UUFDTSxDQUFDO1FBRS9GLG1EQUFZLEdBQVosVUFBYSxnQkFBNEMsRUFBRSxTQUFxQjtZQUM5RSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEtBQUssS0FBSyxDQUFDO1FBQ3JELENBQUM7UUFFRCxnREFBUyxHQUFULFVBQ0ksV0FBd0IsRUFBRSxVQUEwQixFQUFFLGdCQUE2QixFQUNuRixRQUFvQixFQUFFLFlBQTBCLEVBQUUsWUFBaUMsRUFDbkYsWUFBcUI7O1lBQ3ZCLElBQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFELHlGQUF5RjtZQUN6RiwyQkFBMkI7WUFDM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUU7O29C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VSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNoRDtpQkFBTTtnQkFDTCxXQUFXLENBQUMsS0FBSyxDQUFDLHNDQUFvQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFHLENBQUMsQ0FBQztnQkFDNUYsT0FBTzthQUNSO1FBQ0gsQ0FBQztRQUVPLHNEQUFlLEdBQXZCLFVBQ0ksV0FBd0IsRUFBRSxZQUEwQixFQUFFLE1BQWMsRUFDcEUsZ0JBQTZCLEVBQUUsUUFBMkI7WUFDNUQsSUFBSTtnQkFDRixJQUFNLFVBQVUsR0FBRywwQkFBWSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO2dCQUN4RSxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDekM7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDVixXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUM5QjtRQUNILENBQUM7UUFDSCxtQ0FBQztJQUFELENBQUMsQUFwRkQsSUFvRkM7SUFwRlksb0VBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge2Fic29sdXRlRnJvbSwgQWJzb2x1dGVGc1BhdGgsIEZpbGVTeXN0ZW0sIFBhdGhTZWdtZW50fSBmcm9tICdAYW5ndWxhci9jb21waWxlci1jbGkvc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7cGFyc2VTeW5jLCB0cmFuc2Zvcm1Gcm9tQXN0U3luY30gZnJvbSAnQGJhYmVsL2NvcmUnO1xuaW1wb3J0IHtGaWxlLCBQcm9ncmFtfSBmcm9tICdAYmFiZWwvdHlwZXMnO1xuXG5pbXBvcnQge0RpYWdub3N0aWNzfSBmcm9tICcuLi8uLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge1RyYW5zbGF0ZVBsdWdpbk9wdGlvbnN9IGZyb20gJy4uLy4uL3NvdXJjZV9maWxlX3V0aWxzJztcbmltcG9ydCB7T3V0cHV0UGF0aEZufSBmcm9tICcuLi9vdXRwdXRfcGF0aCc7XG5pbXBvcnQge1RyYW5zbGF0aW9uQnVuZGxlLCBUcmFuc2xhdGlvbkhhbmRsZXJ9IGZyb20gJy4uL3RyYW5zbGF0b3InO1xuXG5pbXBvcnQge21ha2VFczIwMTVUcmFuc2xhdGVQbHVnaW59IGZyb20gJy4vZXMyMDE1X3RyYW5zbGF0ZV9wbHVnaW4nO1xuaW1wb3J0IHttYWtlRXM1VHJhbnNsYXRlUGx1Z2lufSBmcm9tICcuL2VzNV90cmFuc2xhdGVfcGx1Z2luJztcbmltcG9ydCB7bWFrZUxvY2FsZVBsdWdpbn0gZnJvbSAnLi9sb2NhbGVfcGx1Z2luJztcblxuLyoqXG4gKiBUcmFuc2xhdGUgYSBmaWxlIGJ5IGlubGluaW5nIGFsbCBtZXNzYWdlcyB0YWdnZWQgYnkgYCRsb2NhbGl6ZWAgd2l0aCB0aGUgYXBwcm9wcmlhdGUgdHJhbnNsYXRlZFxuICogbWVzc2FnZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFNvdXJjZUZpbGVUcmFuc2xhdGlvbkhhbmRsZXIgaW1wbGVtZW50cyBUcmFuc2xhdGlvbkhhbmRsZXIge1xuICBwcml2YXRlIHNvdXJjZUxvY2FsZU9wdGlvbnM6XG4gICAgICBUcmFuc2xhdGVQbHVnaW5PcHRpb25zID0gey4uLnRoaXMudHJhbnNsYXRpb25PcHRpb25zLCBtaXNzaW5nVHJhbnNsYXRpb246ICdpZ25vcmUnfTtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBmczogRmlsZVN5c3RlbSwgcHJpdmF0ZSB0cmFuc2xhdGlvbk9wdGlvbnM6IFRyYW5zbGF0ZVBsdWdpbk9wdGlvbnMgPSB7fSkge31cblxuICBjYW5UcmFuc2xhdGUocmVsYXRpdmVGaWxlUGF0aDogUGF0aFNlZ21lbnR8QWJzb2x1dGVGc1BhdGgsIF9jb250ZW50czogVWludDhBcnJheSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmZzLmV4dG5hbWUocmVsYXRpdmVGaWxlUGF0aCkgPT09ICcuanMnO1xuICB9XG5cbiAgdHJhbnNsYXRlKFxuICAgICAgZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzLCBzb3VyY2VSb290OiBBYnNvbHV0ZUZzUGF0aCwgcmVsYXRpdmVGaWxlUGF0aDogUGF0aFNlZ21lbnQsXG4gICAgICBjb250ZW50czogVWludDhBcnJheSwgb3V0cHV0UGF0aEZuOiBPdXRwdXRQYXRoRm4sIHRyYW5zbGF0aW9uczogVHJhbnNsYXRpb25CdW5kbGVbXSxcbiAgICAgIHNvdXJjZUxvY2FsZT86IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHNvdXJjZUNvZGUgPSBCdWZmZXIuZnJvbShjb250ZW50cykudG9TdHJpbmcoJ3V0ZjgnKTtcbiAgICAvLyBBIHNob3J0LWNpcmN1aXQgY2hlY2sgdG8gYXZvaWQgcGFyc2luZyB0aGUgZmlsZSBpbnRvIGFuIEFTVCBpZiBpdCBkb2VzIG5vdCBjb250YWluIGFueVxuICAgIC8vIGAkbG9jYWxpemVgIGlkZW50aWZpZXJzLlxuICAgIGlmICghc291cmNlQ29kZS5pbmNsdWRlcygnJGxvY2FsaXplJykpIHtcbiAgICAgIGZvciAoY29uc3QgdHJhbnNsYXRpb24gb2YgdHJhbnNsYXRpb25zKSB7XG4gICAgICAgIHRoaXMud3JpdGVTb3VyY2VGaWxlKFxuICAgICAgICAgICAgZGlhZ25vc3RpY3MsIG91dHB1dFBhdGhGbiwgdHJhbnNsYXRpb24ubG9jYWxlLCByZWxhdGl2ZUZpbGVQYXRoLCBjb250ZW50cyk7XG4gICAgICB9XG4gICAgICBpZiAoc291cmNlTG9jYWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy53cml0ZVNvdXJjZUZpbGUoZGlhZ25vc3RpY3MsIG91dHB1dFBhdGhGbiwgc291cmNlTG9jYWxlLCByZWxhdGl2ZUZpbGVQYXRoLCBjb250ZW50cyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGFzdCA9IHBhcnNlU3luYyhzb3VyY2VDb2RlLCB7c291cmNlUm9vdCwgZmlsZW5hbWU6IHJlbGF0aXZlRmlsZVBhdGh9KTtcbiAgICAgIGlmICghYXN0KSB7XG4gICAgICAgIGRpYWdub3N0aWNzLmVycm9yKFxuICAgICAgICAgICAgYFVuYWJsZSB0byBwYXJzZSBzb3VyY2UgZmlsZTogJHt0aGlzLmZzLmpvaW4oc291cmNlUm9vdCwgcmVsYXRpdmVGaWxlUGF0aCl9YCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIE91dHB1dCBhIHRyYW5zbGF0ZWQgY29weSBvZiB0aGUgZmlsZSBmb3IgZWFjaCBsb2NhbGUuXG4gICAgICBmb3IgKGNvbnN0IHRyYW5zbGF0aW9uQnVuZGxlIG9mIHRyYW5zbGF0aW9ucykge1xuICAgICAgICB0aGlzLnRyYW5zbGF0ZUZpbGUoXG4gICAgICAgICAgICBkaWFnbm9zdGljcywgYXN0LCB0cmFuc2xhdGlvbkJ1bmRsZSwgc291cmNlUm9vdCwgcmVsYXRpdmVGaWxlUGF0aCwgb3V0cHV0UGF0aEZuLFxuICAgICAgICAgICAgdGhpcy50cmFuc2xhdGlvbk9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgaWYgKHNvdXJjZUxvY2FsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIEFsc28gb3V0cHV0IGEgY29weSBvZiB0aGUgZmlsZSBmb3IgdGhlIHNvdXJjZSBsb2NhbGUuXG4gICAgICAgIC8vIFRoZXJlIHdpbGwgYmUgbm8gdHJhbnNsYXRpb25zIC0gYnkgZGVmaW5pdGlvbiAtIHNvIHdlIFwiaWdub3JlXCIgYG1pc3NpbmdUcmFuc2xhdGlvbnNgLlxuICAgICAgICB0aGlzLnRyYW5zbGF0ZUZpbGUoXG4gICAgICAgICAgICBkaWFnbm9zdGljcywgYXN0LCB7bG9jYWxlOiBzb3VyY2VMb2NhbGUsIHRyYW5zbGF0aW9uczoge319LCBzb3VyY2VSb290LFxuICAgICAgICAgICAgcmVsYXRpdmVGaWxlUGF0aCwgb3V0cHV0UGF0aEZuLCB0aGlzLnNvdXJjZUxvY2FsZU9wdGlvbnMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdHJhbnNsYXRlRmlsZShcbiAgICAgIGRpYWdub3N0aWNzOiBEaWFnbm9zdGljcywgYXN0OiBGaWxlfFByb2dyYW0sIHRyYW5zbGF0aW9uQnVuZGxlOiBUcmFuc2xhdGlvbkJ1bmRsZSxcbiAgICAgIHNvdXJjZVJvb3Q6IEFic29sdXRlRnNQYXRoLCBmaWxlbmFtZTogUGF0aFNlZ21lbnQsIG91dHB1dFBhdGhGbjogT3V0cHV0UGF0aEZuLFxuICAgICAgb3B0aW9uczogVHJhbnNsYXRlUGx1Z2luT3B0aW9ucykge1xuICAgIGNvbnN0IHRyYW5zbGF0ZWQgPSB0cmFuc2Zvcm1Gcm9tQXN0U3luYyhhc3QsIHVuZGVmaW5lZCwge1xuICAgICAgY29tcGFjdDogdHJ1ZSxcbiAgICAgIGdlbmVyYXRvck9wdHM6IHttaW5pZmllZDogdHJ1ZX0sXG4gICAgICBwbHVnaW5zOiBbXG4gICAgICAgIG1ha2VMb2NhbGVQbHVnaW4odHJhbnNsYXRpb25CdW5kbGUubG9jYWxlKSxcbiAgICAgICAgbWFrZUVzMjAxNVRyYW5zbGF0ZVBsdWdpbihkaWFnbm9zdGljcywgdHJhbnNsYXRpb25CdW5kbGUudHJhbnNsYXRpb25zLCBvcHRpb25zKSxcbiAgICAgICAgbWFrZUVzNVRyYW5zbGF0ZVBsdWdpbihkaWFnbm9zdGljcywgdHJhbnNsYXRpb25CdW5kbGUudHJhbnNsYXRpb25zLCBvcHRpb25zKSxcbiAgICAgIF0sXG4gICAgICBmaWxlbmFtZSxcbiAgICB9KTtcbiAgICBpZiAodHJhbnNsYXRlZCAmJiB0cmFuc2xhdGVkLmNvZGUpIHtcbiAgICAgIHRoaXMud3JpdGVTb3VyY2VGaWxlKFxuICAgICAgICAgIGRpYWdub3N0aWNzLCBvdXRwdXRQYXRoRm4sIHRyYW5zbGF0aW9uQnVuZGxlLmxvY2FsZSwgZmlsZW5hbWUsIHRyYW5zbGF0ZWQuY29kZSk7XG4gICAgICBjb25zdCBvdXRwdXRQYXRoID0gYWJzb2x1dGVGcm9tKG91dHB1dFBhdGhGbih0cmFuc2xhdGlvbkJ1bmRsZS5sb2NhbGUsIGZpbGVuYW1lKSk7XG4gICAgICB0aGlzLmZzLmVuc3VyZURpcih0aGlzLmZzLmRpcm5hbWUob3V0cHV0UGF0aCkpO1xuICAgICAgdGhpcy5mcy53cml0ZUZpbGUob3V0cHV0UGF0aCwgdHJhbnNsYXRlZC5jb2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGlhZ25vc3RpY3MuZXJyb3IoYFVuYWJsZSB0byB0cmFuc2xhdGUgc291cmNlIGZpbGU6ICR7dGhpcy5mcy5qb2luKHNvdXJjZVJvb3QsIGZpbGVuYW1lKX1gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHdyaXRlU291cmNlRmlsZShcbiAgICAgIGRpYWdub3N0aWNzOiBEaWFnbm9zdGljcywgb3V0cHV0UGF0aEZuOiBPdXRwdXRQYXRoRm4sIGxvY2FsZTogc3RyaW5nLFxuICAgICAgcmVsYXRpdmVGaWxlUGF0aDogUGF0aFNlZ21lbnQsIGNvbnRlbnRzOiBzdHJpbmd8VWludDhBcnJheSk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBvdXRwdXRQYXRoID0gYWJzb2x1dGVGcm9tKG91dHB1dFBhdGhGbihsb2NhbGUsIHJlbGF0aXZlRmlsZVBhdGgpKTtcbiAgICAgIHRoaXMuZnMuZW5zdXJlRGlyKHRoaXMuZnMuZGlybmFtZShvdXRwdXRQYXRoKSk7XG4gICAgICB0aGlzLmZzLndyaXRlRmlsZShvdXRwdXRQYXRoLCBjb250ZW50cyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZGlhZ25vc3RpY3MuZXJyb3IoZS5tZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
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
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
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
            return this.fs.extname(file_system_1.relativeFrom(relativeFilePath)) === '.js';
        };
        SourceFileTranslationHandler.prototype.translate = function (diagnostics, sourceRoot, relativeFilePath, contents, outputPathFn, translations, sourceLocale) {
            var e_1, _a, e_2, _b;
            var sourceCode = contents.toString('utf8');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX2ZpbGVfdHJhbnNsYXRpb25faGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3NvdXJjZV9maWxlcy9zb3VyY2VfZmlsZV90cmFuc2xhdGlvbl9oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDJFQUFnSTtJQUNoSSxvQ0FBNEQ7SUFRNUQsMEhBQW9FO0lBQ3BFLG9IQUE4RDtJQUM5RCxzR0FBaUQ7SUFFakQ7OztPQUdHO0lBQ0g7UUFHRSxzQ0FBb0IsRUFBYyxFQUFVLGtCQUErQztZQUEvQyxtQ0FBQSxFQUFBLHVCQUErQztZQUF2RSxPQUFFLEdBQUYsRUFBRSxDQUFZO1lBQVUsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUE2QjtZQUZuRix3QkFBbUIseUNBQ00sSUFBSSxDQUFDLGtCQUFrQixLQUFFLGtCQUFrQixFQUFFLFFBQVEsSUFBRTtRQUNNLENBQUM7UUFFL0YsbURBQVksR0FBWixVQUFhLGdCQUE2QixFQUFFLFNBQWlCO1lBQzNELE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsMEJBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDO1FBQ25FLENBQUM7UUFFRCxnREFBUyxHQUFULFVBQ0ksV0FBd0IsRUFBRSxVQUEwQixFQUFFLGdCQUE2QixFQUNuRixRQUFnQixFQUFFLFlBQTBCLEVBQUUsWUFBaUMsRUFDL0UsWUFBcUI7O1lBQ3ZCLElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0MseUZBQXlGO1lBQ3pGLDJCQUEyQjtZQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRTs7b0JBQ3JDLEtBQTBC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VSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2hEO2lCQUFNO2dCQUNMLFdBQVcsQ0FBQyxLQUFLLENBQUMsc0NBQW9DLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUcsQ0FBQyxDQUFDO2dCQUM1RixPQUFPO2FBQ1I7UUFDSCxDQUFDO1FBRU8sc0RBQWUsR0FBdkIsVUFDSSxXQUF3QixFQUFFLFlBQTBCLEVBQUUsTUFBYyxFQUNwRSxnQkFBNkIsRUFBRSxRQUF1QjtZQUN4RCxJQUFJO2dCQUNGLElBQU0sVUFBVSxHQUFHLDBCQUFZLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hFLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUN6QztZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzlCO1FBQ0gsQ0FBQztRQUNILG1DQUFDO0lBQUQsQ0FBQyxBQXBGRCxJQW9GQztJQXBGWSxvRUFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge2Fic29sdXRlRnJvbSwgQWJzb2x1dGVGc1BhdGgsIEZpbGVTeXN0ZW0sIFBhdGhTZWdtZW50LCByZWxhdGl2ZUZyb219IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtwYXJzZVN5bmMsIHRyYW5zZm9ybUZyb21Bc3RTeW5jfSBmcm9tICdAYmFiZWwvY29yZSc7XG5pbXBvcnQge0ZpbGUsIFByb2dyYW19IGZyb20gJ0BiYWJlbC90eXBlcyc7XG5cbmltcG9ydCB7RGlhZ25vc3RpY3N9IGZyb20gJy4uLy4uL2RpYWdub3N0aWNzJztcbmltcG9ydCB7VHJhbnNsYXRlUGx1Z2luT3B0aW9uc30gZnJvbSAnLi4vLi4vc291cmNlX2ZpbGVfdXRpbHMnO1xuaW1wb3J0IHtPdXRwdXRQYXRoRm59IGZyb20gJy4uL291dHB1dF9wYXRoJztcbmltcG9ydCB7VHJhbnNsYXRpb25CdW5kbGUsIFRyYW5zbGF0aW9uSGFuZGxlcn0gZnJvbSAnLi4vdHJhbnNsYXRvcic7XG5cbmltcG9ydCB7bWFrZUVzMjAxNVRyYW5zbGF0ZVBsdWdpbn0gZnJvbSAnLi9lczIwMTVfdHJhbnNsYXRlX3BsdWdpbic7XG5pbXBvcnQge21ha2VFczVUcmFuc2xhdGVQbHVnaW59IGZyb20gJy4vZXM1X3RyYW5zbGF0ZV9wbHVnaW4nO1xuaW1wb3J0IHttYWtlTG9jYWxlUGx1Z2lufSBmcm9tICcuL2xvY2FsZV9wbHVnaW4nO1xuXG4vKipcbiAqIFRyYW5zbGF0ZSBhIGZpbGUgYnkgaW5saW5pbmcgYWxsIG1lc3NhZ2VzIHRhZ2dlZCBieSBgJGxvY2FsaXplYCB3aXRoIHRoZSBhcHByb3ByaWF0ZSB0cmFuc2xhdGVkXG4gKiBtZXNzYWdlLlxuICovXG5leHBvcnQgY2xhc3MgU291cmNlRmlsZVRyYW5zbGF0aW9uSGFuZGxlciBpbXBsZW1lbnRzIFRyYW5zbGF0aW9uSGFuZGxlciB7XG4gIHByaXZhdGUgc291cmNlTG9jYWxlT3B0aW9uczpcbiAgICAgIFRyYW5zbGF0ZVBsdWdpbk9wdGlvbnMgPSB7Li4udGhpcy50cmFuc2xhdGlvbk9wdGlvbnMsIG1pc3NpbmdUcmFuc2xhdGlvbjogJ2lnbm9yZSd9O1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZzOiBGaWxlU3lzdGVtLCBwcml2YXRlIHRyYW5zbGF0aW9uT3B0aW9uczogVHJhbnNsYXRlUGx1Z2luT3B0aW9ucyA9IHt9KSB7fVxuXG4gIGNhblRyYW5zbGF0ZShyZWxhdGl2ZUZpbGVQYXRoOiBQYXRoU2VnbWVudCwgX2NvbnRlbnRzOiBCdWZmZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5mcy5leHRuYW1lKHJlbGF0aXZlRnJvbShyZWxhdGl2ZUZpbGVQYXRoKSkgPT09ICcuanMnO1xuICB9XG5cbiAgdHJhbnNsYXRlKFxuICAgICAgZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzLCBzb3VyY2VSb290OiBBYnNvbHV0ZUZzUGF0aCwgcmVsYXRpdmVGaWxlUGF0aDogUGF0aFNlZ21lbnQsXG4gICAgICBjb250ZW50czogQnVmZmVyLCBvdXRwdXRQYXRoRm46IE91dHB1dFBhdGhGbiwgdHJhbnNsYXRpb25zOiBUcmFuc2xhdGlvbkJ1bmRsZVtdLFxuICAgICAgc291cmNlTG9jYWxlPzogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3Qgc291cmNlQ29kZSA9IGNvbnRlbnRzLnRvU3RyaW5nKCd1dGY4Jyk7XG4gICAgLy8gQSBzaG9ydC1jaXJjdWl0IGNoZWNrIHRvIGF2b2lkIHBhcnNpbmcgdGhlIGZpbGUgaW50byBhbiBBU1QgaWYgaXQgZG9lcyBub3QgY29udGFpbiBhbnlcbiAgICAvLyBgJGxvY2FsaXplYCBpZGVudGlmaWVycy5cbiAgICBpZiAoIXNvdXJjZUNvZGUuaW5jbHVkZXMoJyRsb2NhbGl6ZScpKSB7XG4gICAgICBmb3IgKGNvbnN0IHRyYW5zbGF0aW9uIG9mIHRyYW5zbGF0aW9ucykge1xuICAgICAgICB0aGlzLndyaXRlU291cmNlRmlsZShcbiAgICAgICAgICAgIGRpYWdub3N0aWNzLCBvdXRwdXRQYXRoRm4sIHRyYW5zbGF0aW9uLmxvY2FsZSwgcmVsYXRpdmVGaWxlUGF0aCwgY29udGVudHMpO1xuICAgICAgfVxuICAgICAgaWYgKHNvdXJjZUxvY2FsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMud3JpdGVTb3VyY2VGaWxlKGRpYWdub3N0aWNzLCBvdXRwdXRQYXRoRm4sIHNvdXJjZUxvY2FsZSwgcmVsYXRpdmVGaWxlUGF0aCwgY29udGVudHMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBhc3QgPSBwYXJzZVN5bmMoc291cmNlQ29kZSwge3NvdXJjZVJvb3QsIGZpbGVuYW1lOiByZWxhdGl2ZUZpbGVQYXRofSk7XG4gICAgICBpZiAoIWFzdCkge1xuICAgICAgICBkaWFnbm9zdGljcy5lcnJvcihcbiAgICAgICAgICAgIGBVbmFibGUgdG8gcGFyc2Ugc291cmNlIGZpbGU6ICR7dGhpcy5mcy5qb2luKHNvdXJjZVJvb3QsIHJlbGF0aXZlRmlsZVBhdGgpfWApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBPdXRwdXQgYSB0cmFuc2xhdGVkIGNvcHkgb2YgdGhlIGZpbGUgZm9yIGVhY2ggbG9jYWxlLlxuICAgICAgZm9yIChjb25zdCB0cmFuc2xhdGlvbkJ1bmRsZSBvZiB0cmFuc2xhdGlvbnMpIHtcbiAgICAgICAgdGhpcy50cmFuc2xhdGVGaWxlKFxuICAgICAgICAgICAgZGlhZ25vc3RpY3MsIGFzdCwgdHJhbnNsYXRpb25CdW5kbGUsIHNvdXJjZVJvb3QsIHJlbGF0aXZlRmlsZVBhdGgsIG91dHB1dFBhdGhGbixcbiAgICAgICAgICAgIHRoaXMudHJhbnNsYXRpb25PcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIGlmIChzb3VyY2VMb2NhbGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBBbHNvIG91dHB1dCBhIGNvcHkgb2YgdGhlIGZpbGUgZm9yIHRoZSBzb3VyY2UgbG9jYWxlLlxuICAgICAgICAvLyBUaGVyZSB3aWxsIGJlIG5vIHRyYW5zbGF0aW9ucyAtIGJ5IGRlZmluaXRpb24gLSBzbyB3ZSBcImlnbm9yZVwiIGBtaXNzaW5nVHJhbnNsYXRpb25zYC5cbiAgICAgICAgdGhpcy50cmFuc2xhdGVGaWxlKFxuICAgICAgICAgICAgZGlhZ25vc3RpY3MsIGFzdCwge2xvY2FsZTogc291cmNlTG9jYWxlLCB0cmFuc2xhdGlvbnM6IHt9fSwgc291cmNlUm9vdCxcbiAgICAgICAgICAgIHJlbGF0aXZlRmlsZVBhdGgsIG91dHB1dFBhdGhGbiwgdGhpcy5zb3VyY2VMb2NhbGVPcHRpb25zKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHRyYW5zbGF0ZUZpbGUoXG4gICAgICBkaWFnbm9zdGljczogRGlhZ25vc3RpY3MsIGFzdDogRmlsZXxQcm9ncmFtLCB0cmFuc2xhdGlvbkJ1bmRsZTogVHJhbnNsYXRpb25CdW5kbGUsXG4gICAgICBzb3VyY2VSb290OiBBYnNvbHV0ZUZzUGF0aCwgZmlsZW5hbWU6IFBhdGhTZWdtZW50LCBvdXRwdXRQYXRoRm46IE91dHB1dFBhdGhGbixcbiAgICAgIG9wdGlvbnM6IFRyYW5zbGF0ZVBsdWdpbk9wdGlvbnMpIHtcbiAgICBjb25zdCB0cmFuc2xhdGVkID0gdHJhbnNmb3JtRnJvbUFzdFN5bmMoYXN0LCB1bmRlZmluZWQsIHtcbiAgICAgIGNvbXBhY3Q6IHRydWUsXG4gICAgICBnZW5lcmF0b3JPcHRzOiB7bWluaWZpZWQ6IHRydWV9LFxuICAgICAgcGx1Z2luczogW1xuICAgICAgICBtYWtlTG9jYWxlUGx1Z2luKHRyYW5zbGF0aW9uQnVuZGxlLmxvY2FsZSksXG4gICAgICAgIG1ha2VFczIwMTVUcmFuc2xhdGVQbHVnaW4oZGlhZ25vc3RpY3MsIHRyYW5zbGF0aW9uQnVuZGxlLnRyYW5zbGF0aW9ucywgb3B0aW9ucyksXG4gICAgICAgIG1ha2VFczVUcmFuc2xhdGVQbHVnaW4oZGlhZ25vc3RpY3MsIHRyYW5zbGF0aW9uQnVuZGxlLnRyYW5zbGF0aW9ucywgb3B0aW9ucyksXG4gICAgICBdLFxuICAgICAgZmlsZW5hbWUsXG4gICAgfSk7XG4gICAgaWYgKHRyYW5zbGF0ZWQgJiYgdHJhbnNsYXRlZC5jb2RlKSB7XG4gICAgICB0aGlzLndyaXRlU291cmNlRmlsZShcbiAgICAgICAgICBkaWFnbm9zdGljcywgb3V0cHV0UGF0aEZuLCB0cmFuc2xhdGlvbkJ1bmRsZS5sb2NhbGUsIGZpbGVuYW1lLCB0cmFuc2xhdGVkLmNvZGUpO1xuICAgICAgY29uc3Qgb3V0cHV0UGF0aCA9IGFic29sdXRlRnJvbShvdXRwdXRQYXRoRm4odHJhbnNsYXRpb25CdW5kbGUubG9jYWxlLCBmaWxlbmFtZSkpO1xuICAgICAgdGhpcy5mcy5lbnN1cmVEaXIodGhpcy5mcy5kaXJuYW1lKG91dHB1dFBhdGgpKTtcbiAgICAgIHRoaXMuZnMud3JpdGVGaWxlKG91dHB1dFBhdGgsIHRyYW5zbGF0ZWQuY29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpYWdub3N0aWNzLmVycm9yKGBVbmFibGUgdG8gdHJhbnNsYXRlIHNvdXJjZSBmaWxlOiAke3RoaXMuZnMuam9pbihzb3VyY2VSb290LCBmaWxlbmFtZSl9YCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB3cml0ZVNvdXJjZUZpbGUoXG4gICAgICBkaWFnbm9zdGljczogRGlhZ25vc3RpY3MsIG91dHB1dFBhdGhGbjogT3V0cHV0UGF0aEZuLCBsb2NhbGU6IHN0cmluZyxcbiAgICAgIHJlbGF0aXZlRmlsZVBhdGg6IFBhdGhTZWdtZW50LCBjb250ZW50czogc3RyaW5nfEJ1ZmZlcik6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBvdXRwdXRQYXRoID0gYWJzb2x1dGVGcm9tKG91dHB1dFBhdGhGbihsb2NhbGUsIHJlbGF0aXZlRmlsZVBhdGgpKTtcbiAgICAgIHRoaXMuZnMuZW5zdXJlRGlyKHRoaXMuZnMuZGlybmFtZShvdXRwdXRQYXRoKSk7XG4gICAgICB0aGlzLmZzLndyaXRlRmlsZShvdXRwdXRQYXRoLCBjb250ZW50cyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZGlhZ25vc3RpY3MuZXJyb3IoZS5tZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX2ZpbGVfdHJhbnNsYXRpb25faGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3NvdXJjZV9maWxlcy9zb3VyY2VfZmlsZV90cmFuc2xhdGlvbl9oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCwyRUFBZ0k7SUFDaEksb0NBQTREO0lBUTVELDBIQUFvRTtJQUNwRSxvSEFBOEQ7SUFDOUQsc0dBQWlEO0lBRWpEOzs7T0FHRztJQUNIO1FBR0Usc0NBQW9CLEVBQWMsRUFBVSxrQkFBK0M7WUFBL0MsbUNBQUEsRUFBQSx1QkFBK0M7WUFBdkUsT0FBRSxHQUFGLEVBQUUsQ0FBWTtZQUFVLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBNkI7WUFGbkYsd0JBQW1CLHlDQUNNLElBQUksQ0FBQyxrQkFBa0IsS0FBRSxrQkFBa0IsRUFBRSxRQUFRLElBQUU7UUFDTSxDQUFDO1FBRS9GLG1EQUFZLEdBQVosVUFBYSxnQkFBNkIsRUFBRSxTQUFpQjtZQUMzRCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLDBCQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQztRQUNuRSxDQUFDO1FBRUQsZ0RBQVMsR0FBVCxVQUNJLFdBQXdCLEVBQUUsVUFBMEIsRUFBRSxnQkFBNkIsRUFDbkYsUUFBZ0IsRUFBRSxZQUEwQixFQUFFLFlBQWlDLEVBQy9FLFlBQXFCOztZQUN2QixJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdDLHlGQUF5RjtZQUN6RiwyQkFBMkI7WUFDM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUU7O29CQUNyQyxLQUEwQixJQUFBLGlCQUFBLGlCQUFBLFlBQVksQ0FBQSwwQ0FBQSxvRUFBRTt3QkFBbkMsSUFBTSxXQUFXLHlCQUFBO3dCQUNwQixJQUFJLENBQUMsZUFBZSxDQUNoQixXQUFXLEVBQUUsWUFBWSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLENBQUM7cUJBQ2hGOzs7Ozs7Ozs7Z0JBQ0QsSUFBSSxZQUFZLEtBQUssU0FBUyxFQUFFO29CQUM5QixJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxDQUFDO2lCQUMzRjthQUNGO2lCQUFNO2dCQUNMLElBQU0sR0FBRyxHQUFHLGdCQUFTLENBQUMsVUFBVSxFQUFFLEVBQUMsVUFBVSxZQUFBLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUFDLENBQUMsQ0FBQztnQkFDNUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtvQkFDUixXQUFXLENBQUMsS0FBSyxDQUNiLGtDQUFnQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUcsQ0FBQyxDQUFDO29CQUNsRixPQUFPO2lCQUNSOztvQkFDRCx3REFBd0Q7b0JBQ3hELEtBQWdDLElBQUEsaUJBQUEsaUJBQUEsWUFBWSxDQUFBLDBDQUFBLG9FQUFFO3dCQUF6QyxJQUFNLGlCQUFpQix5QkFBQTt3QkFDMUIsSUFBSSxDQUFDLGFBQWEsQ0FDZCxXQUFXLEVBQUUsR0FBRyxFQUFFLGlCQUFpQixFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxZQUFZLEVBQy9FLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO3FCQUM5Qjs7Ozs7Ozs7O2dCQUNELElBQUksWUFBWSxLQUFLLFNBQVMsRUFBRTtvQkFDOUIsd0RBQXdEO29CQUN4RCx3RkFBd0Y7b0JBQ3hGLElBQUksQ0FBQyxhQUFhLENBQ2QsV0FBVyxFQUFFLEdBQUcsRUFBRSxFQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBQyxFQUFFLFVBQVUsRUFDdEUsZ0JBQWdCLEVBQUUsWUFBWSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2lCQUMvRDthQUNGO1FBQ0gsQ0FBQztRQUVPLG9EQUFhLEdBQXJCLFVBQ0ksV0FBd0IsRUFBRSxHQUFpQixFQUFFLGlCQUFvQyxFQUNqRixVQUEwQixFQUFFLFFBQXFCLEVBQUUsWUFBMEIsRUFDN0UsT0FBK0I7WUFDakMsSUFBTSxVQUFVLEdBQUcsMkJBQW9CLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRTtnQkFDdEQsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsYUFBYSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQztnQkFDL0IsT0FBTyxFQUFFO29CQUNQLGdDQUFnQixDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQztvQkFDMUMsbURBQXlCLENBQUMsV0FBVyxFQUFFLGlCQUFpQixDQUFDLFlBQVksRUFBRSxPQUFPLENBQUM7b0JBQy9FLDZDQUFzQixDQUFDLFdBQVcsRUFBRSxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDO2lCQUM3RTtnQkFDRCxRQUFRLFVBQUE7YUFDVCxDQUFDLENBQUM7WUFDSCxJQUFJLFVBQVUsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFO2dCQUNqQyxJQUFJLENBQUMsZUFBZSxDQUNoQixXQUFXLEVBQUUsWUFBWSxFQUFFLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNwRixJQUFNLFVBQVUsR0FBRywwQkFBWSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDbEYsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDL0MsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNoRDtpQkFBTTtnQkFDTCxXQUFXLENBQUMsS0FBSyxDQUFDLHNDQUFvQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFHLENBQUMsQ0FBQztnQkFDNUYsT0FBTzthQUNSO1FBQ0gsQ0FBQztRQUVPLHNEQUFlLEdBQXZCLFVBQ0ksV0FBd0IsRUFBRSxZQUEwQixFQUFFLE1BQWMsRUFDcEUsZ0JBQTZCLEVBQUUsUUFBdUI7WUFDeEQsSUFBSTtnQkFDRixJQUFNLFVBQVUsR0FBRywwQkFBWSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO2dCQUN4RSxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDekM7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDVixXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUM5QjtRQUNILENBQUM7UUFDSCxtQ0FBQztJQUFELENBQUMsQUFwRkQsSUFvRkM7SUFwRlksb0VBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge2Fic29sdXRlRnJvbSwgQWJzb2x1dGVGc1BhdGgsIEZpbGVTeXN0ZW0sIFBhdGhTZWdtZW50LCByZWxhdGl2ZUZyb219IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtwYXJzZVN5bmMsIHRyYW5zZm9ybUZyb21Bc3RTeW5jfSBmcm9tICdAYmFiZWwvY29yZSc7XG5pbXBvcnQge0ZpbGUsIFByb2dyYW19IGZyb20gJ0BiYWJlbC90eXBlcyc7XG5cbmltcG9ydCB7RGlhZ25vc3RpY3N9IGZyb20gJy4uLy4uL2RpYWdub3N0aWNzJztcbmltcG9ydCB7VHJhbnNsYXRlUGx1Z2luT3B0aW9uc30gZnJvbSAnLi4vLi4vc291cmNlX2ZpbGVfdXRpbHMnO1xuaW1wb3J0IHtPdXRwdXRQYXRoRm59IGZyb20gJy4uL291dHB1dF9wYXRoJztcbmltcG9ydCB7VHJhbnNsYXRpb25CdW5kbGUsIFRyYW5zbGF0aW9uSGFuZGxlcn0gZnJvbSAnLi4vdHJhbnNsYXRvcic7XG5cbmltcG9ydCB7bWFrZUVzMjAxNVRyYW5zbGF0ZVBsdWdpbn0gZnJvbSAnLi9lczIwMTVfdHJhbnNsYXRlX3BsdWdpbic7XG5pbXBvcnQge21ha2VFczVUcmFuc2xhdGVQbHVnaW59IGZyb20gJy4vZXM1X3RyYW5zbGF0ZV9wbHVnaW4nO1xuaW1wb3J0IHttYWtlTG9jYWxlUGx1Z2lufSBmcm9tICcuL2xvY2FsZV9wbHVnaW4nO1xuXG4vKipcbiAqIFRyYW5zbGF0ZSBhIGZpbGUgYnkgaW5saW5pbmcgYWxsIG1lc3NhZ2VzIHRhZ2dlZCBieSBgJGxvY2FsaXplYCB3aXRoIHRoZSBhcHByb3ByaWF0ZSB0cmFuc2xhdGVkXG4gKiBtZXNzYWdlLlxuICovXG5leHBvcnQgY2xhc3MgU291cmNlRmlsZVRyYW5zbGF0aW9uSGFuZGxlciBpbXBsZW1lbnRzIFRyYW5zbGF0aW9uSGFuZGxlciB7XG4gIHByaXZhdGUgc291cmNlTG9jYWxlT3B0aW9uczpcbiAgICAgIFRyYW5zbGF0ZVBsdWdpbk9wdGlvbnMgPSB7Li4udGhpcy50cmFuc2xhdGlvbk9wdGlvbnMsIG1pc3NpbmdUcmFuc2xhdGlvbjogJ2lnbm9yZSd9O1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZzOiBGaWxlU3lzdGVtLCBwcml2YXRlIHRyYW5zbGF0aW9uT3B0aW9uczogVHJhbnNsYXRlUGx1Z2luT3B0aW9ucyA9IHt9KSB7fVxuXG4gIGNhblRyYW5zbGF0ZShyZWxhdGl2ZUZpbGVQYXRoOiBQYXRoU2VnbWVudCwgX2NvbnRlbnRzOiBCdWZmZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5mcy5leHRuYW1lKHJlbGF0aXZlRnJvbShyZWxhdGl2ZUZpbGVQYXRoKSkgPT09ICcuanMnO1xuICB9XG5cbiAgdHJhbnNsYXRlKFxuICAgICAgZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzLCBzb3VyY2VSb290OiBBYnNvbHV0ZUZzUGF0aCwgcmVsYXRpdmVGaWxlUGF0aDogUGF0aFNlZ21lbnQsXG4gICAgICBjb250ZW50czogQnVmZmVyLCBvdXRwdXRQYXRoRm46IE91dHB1dFBhdGhGbiwgdHJhbnNsYXRpb25zOiBUcmFuc2xhdGlvbkJ1bmRsZVtdLFxuICAgICAgc291cmNlTG9jYWxlPzogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3Qgc291cmNlQ29kZSA9IGNvbnRlbnRzLnRvU3RyaW5nKCd1dGY4Jyk7XG4gICAgLy8gQSBzaG9ydC1jaXJjdWl0IGNoZWNrIHRvIGF2b2lkIHBhcnNpbmcgdGhlIGZpbGUgaW50byBhbiBBU1QgaWYgaXQgZG9lcyBub3QgY29udGFpbiBhbnlcbiAgICAvLyBgJGxvY2FsaXplYCBpZGVudGlmaWVycy5cbiAgICBpZiAoIXNvdXJjZUNvZGUuaW5jbHVkZXMoJyRsb2NhbGl6ZScpKSB7XG4gICAgICBmb3IgKGNvbnN0IHRyYW5zbGF0aW9uIG9mIHRyYW5zbGF0aW9ucykge1xuICAgICAgICB0aGlzLndyaXRlU291cmNlRmlsZShcbiAgICAgICAgICAgIGRpYWdub3N0aWNzLCBvdXRwdXRQYXRoRm4sIHRyYW5zbGF0aW9uLmxvY2FsZSwgcmVsYXRpdmVGaWxlUGF0aCwgY29udGVudHMpO1xuICAgICAgfVxuICAgICAgaWYgKHNvdXJjZUxvY2FsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMud3JpdGVTb3VyY2VGaWxlKGRpYWdub3N0aWNzLCBvdXRwdXRQYXRoRm4sIHNvdXJjZUxvY2FsZSwgcmVsYXRpdmVGaWxlUGF0aCwgY29udGVudHMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBhc3QgPSBwYXJzZVN5bmMoc291cmNlQ29kZSwge3NvdXJjZVJvb3QsIGZpbGVuYW1lOiByZWxhdGl2ZUZpbGVQYXRofSk7XG4gICAgICBpZiAoIWFzdCkge1xuICAgICAgICBkaWFnbm9zdGljcy5lcnJvcihcbiAgICAgICAgICAgIGBVbmFibGUgdG8gcGFyc2Ugc291cmNlIGZpbGU6ICR7dGhpcy5mcy5qb2luKHNvdXJjZVJvb3QsIHJlbGF0aXZlRmlsZVBhdGgpfWApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBPdXRwdXQgYSB0cmFuc2xhdGVkIGNvcHkgb2YgdGhlIGZpbGUgZm9yIGVhY2ggbG9jYWxlLlxuICAgICAgZm9yIChjb25zdCB0cmFuc2xhdGlvbkJ1bmRsZSBvZiB0cmFuc2xhdGlvbnMpIHtcbiAgICAgICAgdGhpcy50cmFuc2xhdGVGaWxlKFxuICAgICAgICAgICAgZGlhZ25vc3RpY3MsIGFzdCwgdHJhbnNsYXRpb25CdW5kbGUsIHNvdXJjZVJvb3QsIHJlbGF0aXZlRmlsZVBhdGgsIG91dHB1dFBhdGhGbixcbiAgICAgICAgICAgIHRoaXMudHJhbnNsYXRpb25PcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIGlmIChzb3VyY2VMb2NhbGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBBbHNvIG91dHB1dCBhIGNvcHkgb2YgdGhlIGZpbGUgZm9yIHRoZSBzb3VyY2UgbG9jYWxlLlxuICAgICAgICAvLyBUaGVyZSB3aWxsIGJlIG5vIHRyYW5zbGF0aW9ucyAtIGJ5IGRlZmluaXRpb24gLSBzbyB3ZSBcImlnbm9yZVwiIGBtaXNzaW5nVHJhbnNsYXRpb25zYC5cbiAgICAgICAgdGhpcy50cmFuc2xhdGVGaWxlKFxuICAgICAgICAgICAgZGlhZ25vc3RpY3MsIGFzdCwge2xvY2FsZTogc291cmNlTG9jYWxlLCB0cmFuc2xhdGlvbnM6IHt9fSwgc291cmNlUm9vdCxcbiAgICAgICAgICAgIHJlbGF0aXZlRmlsZVBhdGgsIG91dHB1dFBhdGhGbiwgdGhpcy5zb3VyY2VMb2NhbGVPcHRpb25zKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHRyYW5zbGF0ZUZpbGUoXG4gICAgICBkaWFnbm9zdGljczogRGlhZ25vc3RpY3MsIGFzdDogRmlsZXxQcm9ncmFtLCB0cmFuc2xhdGlvbkJ1bmRsZTogVHJhbnNsYXRpb25CdW5kbGUsXG4gICAgICBzb3VyY2VSb290OiBBYnNvbHV0ZUZzUGF0aCwgZmlsZW5hbWU6IFBhdGhTZWdtZW50LCBvdXRwdXRQYXRoRm46IE91dHB1dFBhdGhGbixcbiAgICAgIG9wdGlvbnM6IFRyYW5zbGF0ZVBsdWdpbk9wdGlvbnMpIHtcbiAgICBjb25zdCB0cmFuc2xhdGVkID0gdHJhbnNmb3JtRnJvbUFzdFN5bmMoYXN0LCB1bmRlZmluZWQsIHtcbiAgICAgIGNvbXBhY3Q6IHRydWUsXG4gICAgICBnZW5lcmF0b3JPcHRzOiB7bWluaWZpZWQ6IHRydWV9LFxuICAgICAgcGx1Z2luczogW1xuICAgICAgICBtYWtlTG9jYWxlUGx1Z2luKHRyYW5zbGF0aW9uQnVuZGxlLmxvY2FsZSksXG4gICAgICAgIG1ha2VFczIwMTVUcmFuc2xhdGVQbHVnaW4oZGlhZ25vc3RpY3MsIHRyYW5zbGF0aW9uQnVuZGxlLnRyYW5zbGF0aW9ucywgb3B0aW9ucyksXG4gICAgICAgIG1ha2VFczVUcmFuc2xhdGVQbHVnaW4oZGlhZ25vc3RpY3MsIHRyYW5zbGF0aW9uQnVuZGxlLnRyYW5zbGF0aW9ucywgb3B0aW9ucyksXG4gICAgICBdLFxuICAgICAgZmlsZW5hbWUsXG4gICAgfSk7XG4gICAgaWYgKHRyYW5zbGF0ZWQgJiYgdHJhbnNsYXRlZC5jb2RlKSB7XG4gICAgICB0aGlzLndyaXRlU291cmNlRmlsZShcbiAgICAgICAgICBkaWFnbm9zdGljcywgb3V0cHV0UGF0aEZuLCB0cmFuc2xhdGlvbkJ1bmRsZS5sb2NhbGUsIGZpbGVuYW1lLCB0cmFuc2xhdGVkLmNvZGUpO1xuICAgICAgY29uc3Qgb3V0cHV0UGF0aCA9IGFic29sdXRlRnJvbShvdXRwdXRQYXRoRm4odHJhbnNsYXRpb25CdW5kbGUubG9jYWxlLCBmaWxlbmFtZSkpO1xuICAgICAgdGhpcy5mcy5lbnN1cmVEaXIodGhpcy5mcy5kaXJuYW1lKG91dHB1dFBhdGgpKTtcbiAgICAgIHRoaXMuZnMud3JpdGVGaWxlKG91dHB1dFBhdGgsIHRyYW5zbGF0ZWQuY29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpYWdub3N0aWNzLmVycm9yKGBVbmFibGUgdG8gdHJhbnNsYXRlIHNvdXJjZSBmaWxlOiAke3RoaXMuZnMuam9pbihzb3VyY2VSb290LCBmaWxlbmFtZSl9YCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB3cml0ZVNvdXJjZUZpbGUoXG4gICAgICBkaWFnbm9zdGljczogRGlhZ25vc3RpY3MsIG91dHB1dFBhdGhGbjogT3V0cHV0UGF0aEZuLCBsb2NhbGU6IHN0cmluZyxcbiAgICAgIHJlbGF0aXZlRmlsZVBhdGg6IFBhdGhTZWdtZW50LCBjb250ZW50czogc3RyaW5nfEJ1ZmZlcik6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBvdXRwdXRQYXRoID0gYWJzb2x1dGVGcm9tKG91dHB1dFBhdGhGbihsb2NhbGUsIHJlbGF0aXZlRmlsZVBhdGgpKTtcbiAgICAgIHRoaXMuZnMuZW5zdXJlRGlyKHRoaXMuZnMuZGlybmFtZShvdXRwdXRQYXRoKSk7XG4gICAgICB0aGlzLmZzLndyaXRlRmlsZShvdXRwdXRQYXRoLCBjb250ZW50cyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZGlhZ25vc3RpY3MuZXJyb3IoZS5tZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
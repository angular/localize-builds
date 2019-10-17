(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/source_files/source_file_translation_handler", ["require", "exports", "tslib", "@babel/core", "path", "@angular/localize/src/tools/src/file_utils", "@angular/localize/src/tools/src/translate/source_files/es2015_translate_plugin", "@angular/localize/src/tools/src/translate/source_files/es5_translate_plugin"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var core_1 = require("@babel/core");
    var path_1 = require("path");
    var file_utils_1 = require("@angular/localize/src/tools/src/file_utils");
    var es2015_translate_plugin_1 = require("@angular/localize/src/tools/src/translate/source_files/es2015_translate_plugin");
    var es5_translate_plugin_1 = require("@angular/localize/src/tools/src/translate/source_files/es5_translate_plugin");
    /**
     * Translate a file by inlining all messages tagged by `$localize` with the appropriate translated
     * message.
     */
    var SourceFileTranslationHandler = /** @class */ (function () {
        function SourceFileTranslationHandler(translationOptions) {
            if (translationOptions === void 0) { translationOptions = {}; }
            this.translationOptions = translationOptions;
            this.sourceLocaleOptions = tslib_1.__assign({}, this.translationOptions, { missingTranslation: 'ignore' });
        }
        SourceFileTranslationHandler.prototype.canTranslate = function (relativeFilePath, _contents) {
            return path_1.extname(relativeFilePath) === '.js';
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
                        file_utils_1.FileUtils.writeFile(outputPathFn(translation.locale, relativeFilePath), contents);
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
                    file_utils_1.FileUtils.writeFile(outputPathFn(sourceLocale, relativeFilePath), contents);
                }
            }
            else {
                var ast = core_1.parseSync(sourceCode, { sourceRoot: sourceRoot, filename: relativeFilePath });
                if (!ast) {
                    diagnostics.error("Unable to parse source file: " + path_1.join(sourceRoot, relativeFilePath));
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
                    es2015_translate_plugin_1.makeEs2015TranslatePlugin(diagnostics, translationBundle.translations, options),
                    es5_translate_plugin_1.makeEs5TranslatePlugin(diagnostics, translationBundle.translations, options),
                ],
                filename: filename,
            });
            if (translated && translated.code) {
                file_utils_1.FileUtils.writeFile(outputPathFn(translationBundle.locale, filename), translated.code);
            }
            else {
                diagnostics.error("Unable to translate source file: " + path_1.join(sourceRoot, filename));
                return;
            }
        };
        return SourceFileTranslationHandler;
    }());
    exports.SourceFileTranslationHandler = SourceFileTranslationHandler;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX2ZpbGVfdHJhbnNsYXRpb25faGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3NvdXJjZV9maWxlcy9zb3VyY2VfZmlsZV90cmFuc2xhdGlvbl9oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQVFBLG9DQUE0RDtJQUU1RCw2QkFBbUM7SUFHbkMseUVBQTJDO0lBSTNDLDBIQUFvRTtJQUNwRSxvSEFBOEQ7SUFJOUQ7OztPQUdHO0lBQ0g7UUFHRSxzQ0FBb0Isa0JBQStDO1lBQS9DLG1DQUFBLEVBQUEsdUJBQStDO1lBQS9DLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBNkI7WUFGM0Qsd0JBQW1CLHdCQUNNLElBQUksQ0FBQyxrQkFBa0IsSUFBRSxrQkFBa0IsRUFBRSxRQUFRLElBQUU7UUFDbEIsQ0FBQztRQUV2RSxtREFBWSxHQUFaLFVBQWEsZ0JBQXdCLEVBQUUsU0FBaUI7WUFDdEQsT0FBTyxjQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxLQUFLLENBQUM7UUFDN0MsQ0FBQztRQUVELGdEQUFTLEdBQVQsVUFDSSxXQUF3QixFQUFFLFVBQWtCLEVBQUUsZ0JBQXdCLEVBQUUsUUFBZ0IsRUFDeEYsWUFBMEIsRUFBRSxZQUFpQyxFQUFFLFlBQXFCOztZQUN0RixJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdDLHlGQUF5RjtZQUN6RiwyQkFBMkI7WUFDM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUU7O29CQUNyQyxLQUEwQixJQUFBLGlCQUFBLGlCQUFBLFlBQVksQ0FBQSwwQ0FBQSxvRUFBRTt3QkFBbkMsSUFBTSxXQUFXLHlCQUFBO3dCQUNwQixzQkFBUyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO3FCQUNuRjs7Ozs7Ozs7O2dCQUNELElBQUksWUFBWSxLQUFLLFNBQVMsRUFBRTtvQkFDOUIsc0JBQVMsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2lCQUM3RTthQUNGO2lCQUFNO2dCQUNMLElBQU0sR0FBRyxHQUFHLGdCQUFTLENBQUMsVUFBVSxFQUFFLEVBQUMsVUFBVSxZQUFBLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUFDLENBQUMsQ0FBQztnQkFDNUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtvQkFDUixXQUFXLENBQUMsS0FBSyxDQUFDLGtDQUFnQyxXQUFJLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFHLENBQUMsQ0FBQztvQkFDeEYsT0FBTztpQkFDUjs7b0JBQ0Qsd0RBQXdEO29CQUN4RCxLQUFnQyxJQUFBLGlCQUFBLGlCQUFBLFlBQVksQ0FBQSwwQ0FBQSxvRUFBRTt3QkFBekMsSUFBTSxpQkFBaUIseUJBQUE7d0JBQzFCLElBQUksQ0FBQyxhQUFhLENBQ2QsV0FBVyxFQUFFLEdBQUcsRUFBRSxpQkFBaUIsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsWUFBWSxFQUMvRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztxQkFDOUI7Ozs7Ozs7OztnQkFDRCxJQUFJLFlBQVksS0FBSyxTQUFTLEVBQUU7b0JBQzlCLHdEQUF3RDtvQkFDeEQsd0ZBQXdGO29CQUN4RixJQUFJLENBQUMsYUFBYSxDQUNkLFdBQVcsRUFBRSxHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUMsRUFBRSxVQUFVLEVBQ3RFLGdCQUFnQixFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztpQkFDL0Q7YUFDRjtRQUNILENBQUM7UUFFTyxvREFBYSxHQUFyQixVQUNJLFdBQXdCLEVBQUUsR0FBaUIsRUFBRSxpQkFBb0MsRUFDakYsVUFBa0IsRUFBRSxRQUFnQixFQUFFLFlBQTBCLEVBQ2hFLE9BQStCO1lBQ2pDLElBQU0sVUFBVSxHQUFHLDJCQUFvQixDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUU7Z0JBQ3RELE9BQU8sRUFBRSxJQUFJO2dCQUNiLGFBQWEsRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUM7Z0JBQy9CLE9BQU8sRUFBRTtvQkFDUCxtREFBeUIsQ0FBQyxXQUFXLEVBQUUsaUJBQWlCLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQztvQkFDL0UsNkNBQXNCLENBQUMsV0FBVyxFQUFFLGlCQUFpQixDQUFDLFlBQVksRUFBRSxPQUFPLENBQUM7aUJBQzdFO2dCQUNELFFBQVEsVUFBQTthQUNULENBQUMsQ0FBQztZQUNILElBQUksVUFBVSxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUU7Z0JBQ2pDLHNCQUFTLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3hGO2lCQUFNO2dCQUNMLFdBQVcsQ0FBQyxLQUFLLENBQUMsc0NBQW9DLFdBQUksQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFHLENBQUMsQ0FBQztnQkFDcEYsT0FBTzthQUNSO1FBQ0gsQ0FBQztRQUNILG1DQUFDO0lBQUQsQ0FBQyxBQWhFRCxJQWdFQztJQWhFWSxvRUFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge8m1TWVzc2FnZUlkLCDJtVBhcnNlZFRyYW5zbGF0aW9ufSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZS9wcml2YXRlJztcbmltcG9ydCB7cGFyc2VTeW5jLCB0cmFuc2Zvcm1Gcm9tQXN0U3luY30gZnJvbSAnQGJhYmVsL2NvcmUnO1xuaW1wb3J0IHtGaWxlLCBQcm9ncmFtfSBmcm9tICdAYmFiZWwvdHlwZXMnO1xuaW1wb3J0IHtleHRuYW1lLCBqb2lufSBmcm9tICdwYXRoJztcblxuaW1wb3J0IHtEaWFnbm9zdGljc30gZnJvbSAnLi4vLi4vZGlhZ25vc3RpY3MnO1xuaW1wb3J0IHtGaWxlVXRpbHN9IGZyb20gJy4uLy4uL2ZpbGVfdXRpbHMnO1xuaW1wb3J0IHtPdXRwdXRQYXRoRm59IGZyb20gJy4uL291dHB1dF9wYXRoJztcbmltcG9ydCB7VHJhbnNsYXRpb25CdW5kbGUsIFRyYW5zbGF0aW9uSGFuZGxlcn0gZnJvbSAnLi4vdHJhbnNsYXRvcic7XG5cbmltcG9ydCB7bWFrZUVzMjAxNVRyYW5zbGF0ZVBsdWdpbn0gZnJvbSAnLi9lczIwMTVfdHJhbnNsYXRlX3BsdWdpbic7XG5pbXBvcnQge21ha2VFczVUcmFuc2xhdGVQbHVnaW59IGZyb20gJy4vZXM1X3RyYW5zbGF0ZV9wbHVnaW4nO1xuaW1wb3J0IHtUcmFuc2xhdGVQbHVnaW5PcHRpb25zfSBmcm9tICcuL3NvdXJjZV9maWxlX3V0aWxzJztcblxuXG4vKipcbiAqIFRyYW5zbGF0ZSBhIGZpbGUgYnkgaW5saW5pbmcgYWxsIG1lc3NhZ2VzIHRhZ2dlZCBieSBgJGxvY2FsaXplYCB3aXRoIHRoZSBhcHByb3ByaWF0ZSB0cmFuc2xhdGVkXG4gKiBtZXNzYWdlLlxuICovXG5leHBvcnQgY2xhc3MgU291cmNlRmlsZVRyYW5zbGF0aW9uSGFuZGxlciBpbXBsZW1lbnRzIFRyYW5zbGF0aW9uSGFuZGxlciB7XG4gIHByaXZhdGUgc291cmNlTG9jYWxlT3B0aW9uczpcbiAgICAgIFRyYW5zbGF0ZVBsdWdpbk9wdGlvbnMgPSB7Li4udGhpcy50cmFuc2xhdGlvbk9wdGlvbnMsIG1pc3NpbmdUcmFuc2xhdGlvbjogJ2lnbm9yZSd9O1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHRyYW5zbGF0aW9uT3B0aW9uczogVHJhbnNsYXRlUGx1Z2luT3B0aW9ucyA9IHt9KSB7fVxuXG4gIGNhblRyYW5zbGF0ZShyZWxhdGl2ZUZpbGVQYXRoOiBzdHJpbmcsIF9jb250ZW50czogQnVmZmVyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGV4dG5hbWUocmVsYXRpdmVGaWxlUGF0aCkgPT09ICcuanMnO1xuICB9XG5cbiAgdHJhbnNsYXRlKFxuICAgICAgZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzLCBzb3VyY2VSb290OiBzdHJpbmcsIHJlbGF0aXZlRmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IEJ1ZmZlcixcbiAgICAgIG91dHB1dFBhdGhGbjogT3V0cHV0UGF0aEZuLCB0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9uQnVuZGxlW10sIHNvdXJjZUxvY2FsZT86IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHNvdXJjZUNvZGUgPSBjb250ZW50cy50b1N0cmluZygndXRmOCcpO1xuICAgIC8vIEEgc2hvcnQtY2lyY3VpdCBjaGVjayB0byBhdm9pZCBwYXJzaW5nIHRoZSBmaWxlIGludG8gYW4gQVNUIGlmIGl0IGRvZXMgbm90IGNvbnRhaW4gYW55XG4gICAgLy8gYCRsb2NhbGl6ZWAgaWRlbnRpZmllcnMuXG4gICAgaWYgKCFzb3VyY2VDb2RlLmluY2x1ZGVzKCckbG9jYWxpemUnKSkge1xuICAgICAgZm9yIChjb25zdCB0cmFuc2xhdGlvbiBvZiB0cmFuc2xhdGlvbnMpIHtcbiAgICAgICAgRmlsZVV0aWxzLndyaXRlRmlsZShvdXRwdXRQYXRoRm4odHJhbnNsYXRpb24ubG9jYWxlLCByZWxhdGl2ZUZpbGVQYXRoKSwgY29udGVudHMpO1xuICAgICAgfVxuICAgICAgaWYgKHNvdXJjZUxvY2FsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIEZpbGVVdGlscy53cml0ZUZpbGUob3V0cHV0UGF0aEZuKHNvdXJjZUxvY2FsZSwgcmVsYXRpdmVGaWxlUGF0aCksIGNvbnRlbnRzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYXN0ID0gcGFyc2VTeW5jKHNvdXJjZUNvZGUsIHtzb3VyY2VSb290LCBmaWxlbmFtZTogcmVsYXRpdmVGaWxlUGF0aH0pO1xuICAgICAgaWYgKCFhc3QpIHtcbiAgICAgICAgZGlhZ25vc3RpY3MuZXJyb3IoYFVuYWJsZSB0byBwYXJzZSBzb3VyY2UgZmlsZTogJHtqb2luKHNvdXJjZVJvb3QsIHJlbGF0aXZlRmlsZVBhdGgpfWApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBPdXRwdXQgYSB0cmFuc2xhdGVkIGNvcHkgb2YgdGhlIGZpbGUgZm9yIGVhY2ggbG9jYWxlLlxuICAgICAgZm9yIChjb25zdCB0cmFuc2xhdGlvbkJ1bmRsZSBvZiB0cmFuc2xhdGlvbnMpIHtcbiAgICAgICAgdGhpcy50cmFuc2xhdGVGaWxlKFxuICAgICAgICAgICAgZGlhZ25vc3RpY3MsIGFzdCwgdHJhbnNsYXRpb25CdW5kbGUsIHNvdXJjZVJvb3QsIHJlbGF0aXZlRmlsZVBhdGgsIG91dHB1dFBhdGhGbixcbiAgICAgICAgICAgIHRoaXMudHJhbnNsYXRpb25PcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIGlmIChzb3VyY2VMb2NhbGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBBbHNvIG91dHB1dCBhIGNvcHkgb2YgdGhlIGZpbGUgZm9yIHRoZSBzb3VyY2UgbG9jYWxlLlxuICAgICAgICAvLyBUaGVyZSB3aWxsIGJlIG5vIHRyYW5zbGF0aW9ucyAtIGJ5IGRlZmluaXRpb24gLSBzbyB3ZSBcImlnbm9yZVwiIGBtaXNzaW5nVHJhbnNsYXRpb25zYC5cbiAgICAgICAgdGhpcy50cmFuc2xhdGVGaWxlKFxuICAgICAgICAgICAgZGlhZ25vc3RpY3MsIGFzdCwge2xvY2FsZTogc291cmNlTG9jYWxlLCB0cmFuc2xhdGlvbnM6IHt9fSwgc291cmNlUm9vdCxcbiAgICAgICAgICAgIHJlbGF0aXZlRmlsZVBhdGgsIG91dHB1dFBhdGhGbiwgdGhpcy5zb3VyY2VMb2NhbGVPcHRpb25zKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHRyYW5zbGF0ZUZpbGUoXG4gICAgICBkaWFnbm9zdGljczogRGlhZ25vc3RpY3MsIGFzdDogRmlsZXxQcm9ncmFtLCB0cmFuc2xhdGlvbkJ1bmRsZTogVHJhbnNsYXRpb25CdW5kbGUsXG4gICAgICBzb3VyY2VSb290OiBzdHJpbmcsIGZpbGVuYW1lOiBzdHJpbmcsIG91dHB1dFBhdGhGbjogT3V0cHV0UGF0aEZuLFxuICAgICAgb3B0aW9uczogVHJhbnNsYXRlUGx1Z2luT3B0aW9ucykge1xuICAgIGNvbnN0IHRyYW5zbGF0ZWQgPSB0cmFuc2Zvcm1Gcm9tQXN0U3luYyhhc3QsIHVuZGVmaW5lZCwge1xuICAgICAgY29tcGFjdDogdHJ1ZSxcbiAgICAgIGdlbmVyYXRvck9wdHM6IHttaW5pZmllZDogdHJ1ZX0sXG4gICAgICBwbHVnaW5zOiBbXG4gICAgICAgIG1ha2VFczIwMTVUcmFuc2xhdGVQbHVnaW4oZGlhZ25vc3RpY3MsIHRyYW5zbGF0aW9uQnVuZGxlLnRyYW5zbGF0aW9ucywgb3B0aW9ucyksXG4gICAgICAgIG1ha2VFczVUcmFuc2xhdGVQbHVnaW4oZGlhZ25vc3RpY3MsIHRyYW5zbGF0aW9uQnVuZGxlLnRyYW5zbGF0aW9ucywgb3B0aW9ucyksXG4gICAgICBdLFxuICAgICAgZmlsZW5hbWUsXG4gICAgfSk7XG4gICAgaWYgKHRyYW5zbGF0ZWQgJiYgdHJhbnNsYXRlZC5jb2RlKSB7XG4gICAgICBGaWxlVXRpbHMud3JpdGVGaWxlKG91dHB1dFBhdGhGbih0cmFuc2xhdGlvbkJ1bmRsZS5sb2NhbGUsIGZpbGVuYW1lKSwgdHJhbnNsYXRlZC5jb2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGlhZ25vc3RpY3MuZXJyb3IoYFVuYWJsZSB0byB0cmFuc2xhdGUgc291cmNlIGZpbGU6ICR7am9pbihzb3VyY2VSb290LCBmaWxlbmFtZSl9YCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG59XG4iXX0=
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/source_files/source_file_translation_handler", ["require", "exports", "tslib", "@babel/core", "path", "@angular/localize/src/tools/src/file_utils", "@angular/localize/src/tools/src/translate/source_files/es2015_translate_plugin", "@angular/localize/src/tools/src/translate/source_files/es5_translate_plugin", "@angular/localize/src/tools/src/translate/source_files/locale_plugin"], factory);
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
    var locale_plugin_1 = require("@angular/localize/src/tools/src/translate/source_files/locale_plugin");
    /**
     * Translate a file by inlining all messages tagged by `$localize` with the appropriate translated
     * message.
     */
    var SourceFileTranslationHandler = /** @class */ (function () {
        function SourceFileTranslationHandler(translationOptions) {
            if (translationOptions === void 0) { translationOptions = {}; }
            this.translationOptions = translationOptions;
            this.sourceLocaleOptions = tslib_1.__assign(tslib_1.__assign({}, this.translationOptions), { missingTranslation: 'ignore' });
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
                    locale_plugin_1.makeLocalePlugin(translationBundle.locale),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX2ZpbGVfdHJhbnNsYXRpb25faGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3NvdXJjZV9maWxlcy9zb3VyY2VfZmlsZV90cmFuc2xhdGlvbl9oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQVFBLG9DQUE0RDtJQUU1RCw2QkFBbUM7SUFHbkMseUVBQTJDO0lBSTNDLDBIQUFvRTtJQUNwRSxvSEFBOEQ7SUFDOUQsc0dBQWlEO0lBS2pEOzs7T0FHRztJQUNIO1FBR0Usc0NBQW9CLGtCQUErQztZQUEvQyxtQ0FBQSxFQUFBLHVCQUErQztZQUEvQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQTZCO1lBRjNELHdCQUFtQix5Q0FDTSxJQUFJLENBQUMsa0JBQWtCLEtBQUUsa0JBQWtCLEVBQUUsUUFBUSxJQUFFO1FBQ2xCLENBQUM7UUFFdkUsbURBQVksR0FBWixVQUFhLGdCQUF3QixFQUFFLFNBQWlCO1lBQ3RELE9BQU8sY0FBTyxDQUFDLGdCQUFnQixDQUFDLEtBQUssS0FBSyxDQUFDO1FBQzdDLENBQUM7UUFFRCxnREFBUyxHQUFULFVBQ0ksV0FBd0IsRUFBRSxVQUFrQixFQUFFLGdCQUF3QixFQUFFLFFBQWdCLEVBQ3hGLFlBQTBCLEVBQUUsWUFBaUMsRUFBRSxZQUFxQjs7WUFDdEYsSUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM3Qyx5RkFBeUY7WUFDekYsMkJBQTJCO1lBQzNCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFOztvQkFDckMsS0FBMEIsSUFBQSxpQkFBQSxpQkFBQSxZQUFZLENBQUEsMENBQUEsb0VBQUU7d0JBQW5DLElBQU0sV0FBVyx5QkFBQTt3QkFDcEIsc0JBQVMsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztxQkFDbkY7Ozs7Ozs7OztnQkFDRCxJQUFJLFlBQVksS0FBSyxTQUFTLEVBQUU7b0JBQzlCLHNCQUFTLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztpQkFDN0U7YUFDRjtpQkFBTTtnQkFDTCxJQUFNLEdBQUcsR0FBRyxnQkFBUyxDQUFDLFVBQVUsRUFBRSxFQUFDLFVBQVUsWUFBQSxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBQyxDQUFDLENBQUM7Z0JBQzVFLElBQUksQ0FBQyxHQUFHLEVBQUU7b0JBQ1IsV0FBVyxDQUFDLEtBQUssQ0FBQyxrQ0FBZ0MsV0FBSSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBRyxDQUFDLENBQUM7b0JBQ3hGLE9BQU87aUJBQ1I7O29CQUNELHdEQUF3RDtvQkFDeEQsS0FBZ0MsSUFBQSxpQkFBQSxpQkFBQSxZQUFZLENBQUEsMENBQUEsb0VBQUU7d0JBQXpDLElBQU0saUJBQWlCLHlCQUFBO3dCQUMxQixJQUFJLENBQUMsYUFBYSxDQUNkLFdBQVcsRUFBRSxHQUFHLEVBQUUsaUJBQWlCLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLFlBQVksRUFDL0UsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7cUJBQzlCOzs7Ozs7Ozs7Z0JBQ0QsSUFBSSxZQUFZLEtBQUssU0FBUyxFQUFFO29CQUM5Qix3REFBd0Q7b0JBQ3hELHdGQUF3RjtvQkFDeEYsSUFBSSxDQUFDLGFBQWEsQ0FDZCxXQUFXLEVBQUUsR0FBRyxFQUFFLEVBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFDLEVBQUUsVUFBVSxFQUN0RSxnQkFBZ0IsRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7aUJBQy9EO2FBQ0Y7UUFDSCxDQUFDO1FBRU8sb0RBQWEsR0FBckIsVUFDSSxXQUF3QixFQUFFLEdBQWlCLEVBQUUsaUJBQW9DLEVBQ2pGLFVBQWtCLEVBQUUsUUFBZ0IsRUFBRSxZQUEwQixFQUNoRSxPQUErQjtZQUNqQyxJQUFNLFVBQVUsR0FBRywyQkFBb0IsQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFO2dCQUN0RCxPQUFPLEVBQUUsSUFBSTtnQkFDYixhQUFhLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDO2dCQUMvQixPQUFPLEVBQUU7b0JBQ1AsZ0NBQWdCLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDO29CQUMxQyxtREFBeUIsQ0FBQyxXQUFXLEVBQUUsaUJBQWlCLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQztvQkFDL0UsNkNBQXNCLENBQUMsV0FBVyxFQUFFLGlCQUFpQixDQUFDLFlBQVksRUFBRSxPQUFPLENBQUM7aUJBQzdFO2dCQUNELFFBQVEsVUFBQTthQUNULENBQUMsQ0FBQztZQUNILElBQUksVUFBVSxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUU7Z0JBQ2pDLHNCQUFTLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3hGO2lCQUFNO2dCQUNMLFdBQVcsQ0FBQyxLQUFLLENBQUMsc0NBQW9DLFdBQUksQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFHLENBQUMsQ0FBQztnQkFDcEYsT0FBTzthQUNSO1FBQ0gsQ0FBQztRQUNILG1DQUFDO0lBQUQsQ0FBQyxBQWpFRCxJQWlFQztJQWpFWSxvRUFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge8m1TWVzc2FnZUlkLCDJtVBhcnNlZFRyYW5zbGF0aW9ufSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZS9wcml2YXRlJztcbmltcG9ydCB7cGFyc2VTeW5jLCB0cmFuc2Zvcm1Gcm9tQXN0U3luY30gZnJvbSAnQGJhYmVsL2NvcmUnO1xuaW1wb3J0IHtGaWxlLCBQcm9ncmFtfSBmcm9tICdAYmFiZWwvdHlwZXMnO1xuaW1wb3J0IHtleHRuYW1lLCBqb2lufSBmcm9tICdwYXRoJztcblxuaW1wb3J0IHtEaWFnbm9zdGljc30gZnJvbSAnLi4vLi4vZGlhZ25vc3RpY3MnO1xuaW1wb3J0IHtGaWxlVXRpbHN9IGZyb20gJy4uLy4uL2ZpbGVfdXRpbHMnO1xuaW1wb3J0IHtPdXRwdXRQYXRoRm59IGZyb20gJy4uL291dHB1dF9wYXRoJztcbmltcG9ydCB7VHJhbnNsYXRpb25CdW5kbGUsIFRyYW5zbGF0aW9uSGFuZGxlcn0gZnJvbSAnLi4vdHJhbnNsYXRvcic7XG5cbmltcG9ydCB7bWFrZUVzMjAxNVRyYW5zbGF0ZVBsdWdpbn0gZnJvbSAnLi9lczIwMTVfdHJhbnNsYXRlX3BsdWdpbic7XG5pbXBvcnQge21ha2VFczVUcmFuc2xhdGVQbHVnaW59IGZyb20gJy4vZXM1X3RyYW5zbGF0ZV9wbHVnaW4nO1xuaW1wb3J0IHttYWtlTG9jYWxlUGx1Z2lufSBmcm9tICcuL2xvY2FsZV9wbHVnaW4nO1xuaW1wb3J0IHtUcmFuc2xhdGVQbHVnaW5PcHRpb25zfSBmcm9tICcuL3NvdXJjZV9maWxlX3V0aWxzJztcblxuXG5cbi8qKlxuICogVHJhbnNsYXRlIGEgZmlsZSBieSBpbmxpbmluZyBhbGwgbWVzc2FnZXMgdGFnZ2VkIGJ5IGAkbG9jYWxpemVgIHdpdGggdGhlIGFwcHJvcHJpYXRlIHRyYW5zbGF0ZWRcbiAqIG1lc3NhZ2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBTb3VyY2VGaWxlVHJhbnNsYXRpb25IYW5kbGVyIGltcGxlbWVudHMgVHJhbnNsYXRpb25IYW5kbGVyIHtcbiAgcHJpdmF0ZSBzb3VyY2VMb2NhbGVPcHRpb25zOlxuICAgICAgVHJhbnNsYXRlUGx1Z2luT3B0aW9ucyA9IHsuLi50aGlzLnRyYW5zbGF0aW9uT3B0aW9ucywgbWlzc2luZ1RyYW5zbGF0aW9uOiAnaWdub3JlJ307XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgdHJhbnNsYXRpb25PcHRpb25zOiBUcmFuc2xhdGVQbHVnaW5PcHRpb25zID0ge30pIHt9XG5cbiAgY2FuVHJhbnNsYXRlKHJlbGF0aXZlRmlsZVBhdGg6IHN0cmluZywgX2NvbnRlbnRzOiBCdWZmZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZXh0bmFtZShyZWxhdGl2ZUZpbGVQYXRoKSA9PT0gJy5qcyc7XG4gIH1cblxuICB0cmFuc2xhdGUoXG4gICAgICBkaWFnbm9zdGljczogRGlhZ25vc3RpY3MsIHNvdXJjZVJvb3Q6IHN0cmluZywgcmVsYXRpdmVGaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogQnVmZmVyLFxuICAgICAgb3V0cHV0UGF0aEZuOiBPdXRwdXRQYXRoRm4sIHRyYW5zbGF0aW9uczogVHJhbnNsYXRpb25CdW5kbGVbXSwgc291cmNlTG9jYWxlPzogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3Qgc291cmNlQ29kZSA9IGNvbnRlbnRzLnRvU3RyaW5nKCd1dGY4Jyk7XG4gICAgLy8gQSBzaG9ydC1jaXJjdWl0IGNoZWNrIHRvIGF2b2lkIHBhcnNpbmcgdGhlIGZpbGUgaW50byBhbiBBU1QgaWYgaXQgZG9lcyBub3QgY29udGFpbiBhbnlcbiAgICAvLyBgJGxvY2FsaXplYCBpZGVudGlmaWVycy5cbiAgICBpZiAoIXNvdXJjZUNvZGUuaW5jbHVkZXMoJyRsb2NhbGl6ZScpKSB7XG4gICAgICBmb3IgKGNvbnN0IHRyYW5zbGF0aW9uIG9mIHRyYW5zbGF0aW9ucykge1xuICAgICAgICBGaWxlVXRpbHMud3JpdGVGaWxlKG91dHB1dFBhdGhGbih0cmFuc2xhdGlvbi5sb2NhbGUsIHJlbGF0aXZlRmlsZVBhdGgpLCBjb250ZW50cyk7XG4gICAgICB9XG4gICAgICBpZiAoc291cmNlTG9jYWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgRmlsZVV0aWxzLndyaXRlRmlsZShvdXRwdXRQYXRoRm4oc291cmNlTG9jYWxlLCByZWxhdGl2ZUZpbGVQYXRoKSwgY29udGVudHMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBhc3QgPSBwYXJzZVN5bmMoc291cmNlQ29kZSwge3NvdXJjZVJvb3QsIGZpbGVuYW1lOiByZWxhdGl2ZUZpbGVQYXRofSk7XG4gICAgICBpZiAoIWFzdCkge1xuICAgICAgICBkaWFnbm9zdGljcy5lcnJvcihgVW5hYmxlIHRvIHBhcnNlIHNvdXJjZSBmaWxlOiAke2pvaW4oc291cmNlUm9vdCwgcmVsYXRpdmVGaWxlUGF0aCl9YCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIE91dHB1dCBhIHRyYW5zbGF0ZWQgY29weSBvZiB0aGUgZmlsZSBmb3IgZWFjaCBsb2NhbGUuXG4gICAgICBmb3IgKGNvbnN0IHRyYW5zbGF0aW9uQnVuZGxlIG9mIHRyYW5zbGF0aW9ucykge1xuICAgICAgICB0aGlzLnRyYW5zbGF0ZUZpbGUoXG4gICAgICAgICAgICBkaWFnbm9zdGljcywgYXN0LCB0cmFuc2xhdGlvbkJ1bmRsZSwgc291cmNlUm9vdCwgcmVsYXRpdmVGaWxlUGF0aCwgb3V0cHV0UGF0aEZuLFxuICAgICAgICAgICAgdGhpcy50cmFuc2xhdGlvbk9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgaWYgKHNvdXJjZUxvY2FsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIEFsc28gb3V0cHV0IGEgY29weSBvZiB0aGUgZmlsZSBmb3IgdGhlIHNvdXJjZSBsb2NhbGUuXG4gICAgICAgIC8vIFRoZXJlIHdpbGwgYmUgbm8gdHJhbnNsYXRpb25zIC0gYnkgZGVmaW5pdGlvbiAtIHNvIHdlIFwiaWdub3JlXCIgYG1pc3NpbmdUcmFuc2xhdGlvbnNgLlxuICAgICAgICB0aGlzLnRyYW5zbGF0ZUZpbGUoXG4gICAgICAgICAgICBkaWFnbm9zdGljcywgYXN0LCB7bG9jYWxlOiBzb3VyY2VMb2NhbGUsIHRyYW5zbGF0aW9uczoge319LCBzb3VyY2VSb290LFxuICAgICAgICAgICAgcmVsYXRpdmVGaWxlUGF0aCwgb3V0cHV0UGF0aEZuLCB0aGlzLnNvdXJjZUxvY2FsZU9wdGlvbnMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdHJhbnNsYXRlRmlsZShcbiAgICAgIGRpYWdub3N0aWNzOiBEaWFnbm9zdGljcywgYXN0OiBGaWxlfFByb2dyYW0sIHRyYW5zbGF0aW9uQnVuZGxlOiBUcmFuc2xhdGlvbkJ1bmRsZSxcbiAgICAgIHNvdXJjZVJvb3Q6IHN0cmluZywgZmlsZW5hbWU6IHN0cmluZywgb3V0cHV0UGF0aEZuOiBPdXRwdXRQYXRoRm4sXG4gICAgICBvcHRpb25zOiBUcmFuc2xhdGVQbHVnaW5PcHRpb25zKSB7XG4gICAgY29uc3QgdHJhbnNsYXRlZCA9IHRyYW5zZm9ybUZyb21Bc3RTeW5jKGFzdCwgdW5kZWZpbmVkLCB7XG4gICAgICBjb21wYWN0OiB0cnVlLFxuICAgICAgZ2VuZXJhdG9yT3B0czoge21pbmlmaWVkOiB0cnVlfSxcbiAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgbWFrZUxvY2FsZVBsdWdpbih0cmFuc2xhdGlvbkJ1bmRsZS5sb2NhbGUpLFxuICAgICAgICBtYWtlRXMyMDE1VHJhbnNsYXRlUGx1Z2luKGRpYWdub3N0aWNzLCB0cmFuc2xhdGlvbkJ1bmRsZS50cmFuc2xhdGlvbnMsIG9wdGlvbnMpLFxuICAgICAgICBtYWtlRXM1VHJhbnNsYXRlUGx1Z2luKGRpYWdub3N0aWNzLCB0cmFuc2xhdGlvbkJ1bmRsZS50cmFuc2xhdGlvbnMsIG9wdGlvbnMpLFxuICAgICAgXSxcbiAgICAgIGZpbGVuYW1lLFxuICAgIH0pO1xuICAgIGlmICh0cmFuc2xhdGVkICYmIHRyYW5zbGF0ZWQuY29kZSkge1xuICAgICAgRmlsZVV0aWxzLndyaXRlRmlsZShvdXRwdXRQYXRoRm4odHJhbnNsYXRpb25CdW5kbGUubG9jYWxlLCBmaWxlbmFtZSksIHRyYW5zbGF0ZWQuY29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpYWdub3N0aWNzLmVycm9yKGBVbmFibGUgdG8gdHJhbnNsYXRlIHNvdXJjZSBmaWxlOiAke2pvaW4oc291cmNlUm9vdCwgZmlsZW5hbWUpfWApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxufVxuIl19
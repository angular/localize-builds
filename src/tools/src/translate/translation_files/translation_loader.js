(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_loader", ["require", "exports", "tslib", "@angular/localize/src/tools/src/file_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var file_utils_1 = require("@angular/localize/src/tools/src/file_utils");
    /**
     * Use this class to load a collection of translation files from disk.
     */
    var TranslationLoader = /** @class */ (function () {
        function TranslationLoader(translationParsers, duplicateTranslation, 
        /** @deprecated */ diagnostics) {
            this.translationParsers = translationParsers;
            this.duplicateTranslation = duplicateTranslation;
            this.diagnostics = diagnostics;
        }
        /**
         * Load and parse the translation files into a collection of `TranslationBundles`.
         *
         * @param translationFilePaths An array, per locale, of absolute paths to translation files.
         *
         * For each locale to be translated, there is an element in `translationFilePaths`. Each element
         * is an array of absolute paths to translation files for that locale.
         * If the array contains more than one translation file, then the translations are merged.
         * If allowed by the `duplicateTranslation` property, when more than one translation has the same
         * message id, the message from the earlier translation file in the array is used.
         * For example, if the files are `[app.xlf, lib-1.xlf, lib-2.xlif]` then a message that appears in
         * `app.xlf` will override the same message in `lib-1.xlf` or `lib-2.xlf`.
         *
         * @param translationFileLocales An array of locales for each of the translation files.
         *
         * If there is a locale provided in `translationFileLocales` then this is used rather than a
         * locale extracted from the file itself.
         * If there is neither a provided locale nor a locale parsed from the file, then an error is
         * thrown.
         * If there are both a provided locale and a locale parsed from the file, and they are not the
         * same, then a warning is reported.
         */
        TranslationLoader.prototype.loadBundles = function (translationFilePaths, translationFileLocales) {
            var _this = this;
            return translationFilePaths.map(function (filePaths, index) {
                var providedLocale = translationFileLocales[index];
                return _this.mergeBundles(filePaths, providedLocale);
            });
        };
        /**
         * Load all the translations from the file at the given `filePath`.
         */
        TranslationLoader.prototype.loadBundle = function (filePath, providedLocale) {
            var e_1, _a;
            var fileContents = file_utils_1.FileUtils.readFile(filePath);
            try {
                for (var _b = tslib_1.__values(this.translationParsers), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var translationParser = _c.value;
                    var result = translationParser.canParse(filePath, fileContents);
                    if (!result) {
                        continue;
                    }
                    var _d = translationParser.parse(filePath, fileContents, result), parsedLocale = _d.locale, translations = _d.translations, diagnostics = _d.diagnostics;
                    if (diagnostics.hasErrors) {
                        throw new Error(diagnostics.formatDiagnostics("The translation file \"" + filePath + "\" could not be parsed."));
                    }
                    var locale = providedLocale || parsedLocale;
                    if (locale === undefined) {
                        throw new Error("The translation file \"" + filePath + "\" does not contain a target locale and no explicit locale was provided for this file.");
                    }
                    if (parsedLocale !== undefined && providedLocale !== undefined &&
                        parsedLocale !== providedLocale) {
                        diagnostics.warn("The provided locale \"" + providedLocale + "\" does not match the target locale \"" + parsedLocale + "\" found in the translation file \"" + filePath + "\".");
                    }
                    // If we were passed a diagnostics object then copy the messages over to it.
                    if (this.diagnostics) {
                        this.diagnostics.merge(diagnostics);
                    }
                    return { locale: locale, translations: translations, diagnostics: diagnostics };
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            throw new Error("There is no \"TranslationParser\" that can parse this translation file: " + filePath + ".");
        };
        /**
         * There is more than one `filePath` for this locale, so load each as a bundle and then merge them
         * all together.
         */
        TranslationLoader.prototype.mergeBundles = function (filePaths, providedLocale) {
            var _this = this;
            var bundles = filePaths.map(function (filePath) { return _this.loadBundle(filePath, providedLocale); });
            var bundle = bundles[0];
            var _loop_1 = function (i) {
                var nextBundle = bundles[i];
                if (nextBundle.locale !== bundle.locale) {
                    if (this_1.diagnostics) {
                        var previousFiles = filePaths.slice(0, i).map(function (f) { return "\"" + f + "\""; }).join(', ');
                        this_1.diagnostics.warn("When merging multiple translation files, the target locale \"" + nextBundle.locale + "\" found in \"" + filePaths[i] + "\" does not match the target locale \"" + bundle.locale + "\" found in earlier files [" + previousFiles + "].");
                    }
                }
                Object.keys(nextBundle.translations).forEach(function (messageId) {
                    var _a;
                    if (bundle.translations[messageId] !== undefined) {
                        (_a = _this.diagnostics) === null || _a === void 0 ? void 0 : _a.add(_this.duplicateTranslation, "Duplicate translations for message \"" + messageId + "\" when merging \"" + filePaths[i] + "\".");
                    }
                    else {
                        bundle.translations[messageId] = nextBundle.translations[messageId];
                    }
                });
            };
            var this_1 = this;
            for (var i = 1; i < bundles.length; i++) {
                _loop_1(i);
            }
            return bundle;
        };
        return TranslationLoader;
    }());
    exports.TranslationLoader = TranslationLoader;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRpb25fbG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3Rvb2xzL3NyYy90cmFuc2xhdGUvdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fbG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQVFBLHlFQUEyQztJQUszQzs7T0FFRztJQUNIO1FBQ0UsMkJBQ1ksa0JBQTRDLEVBQzVDLG9CQUFnRDtRQUN4RCxrQkFBa0IsQ0FBUyxXQUF5QjtZQUY1Qyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQTBCO1lBQzVDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBNEI7WUFDN0IsZ0JBQVcsR0FBWCxXQUFXLENBQWM7UUFBRyxDQUFDO1FBRTVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7V0FxQkc7UUFDSCx1Q0FBVyxHQUFYLFVBQVksb0JBQWdDLEVBQUUsc0JBQTRDO1lBQTFGLGlCQU1DO1lBSkMsT0FBTyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsVUFBQyxTQUFTLEVBQUUsS0FBSztnQkFDL0MsSUFBTSxjQUFjLEdBQUcsc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3JELE9BQU8sS0FBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDdEQsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQ7O1dBRUc7UUFDSyxzQ0FBVSxHQUFsQixVQUFtQixRQUFnQixFQUFFLGNBQWdDOztZQUNuRSxJQUFNLFlBQVksR0FBRyxzQkFBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7Z0JBQ2xELEtBQWdDLElBQUEsS0FBQSxpQkFBQSxJQUFJLENBQUMsa0JBQWtCLENBQUEsZ0JBQUEsNEJBQUU7b0JBQXBELElBQU0saUJBQWlCLFdBQUE7b0JBQzFCLElBQU0sTUFBTSxHQUFHLGlC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LFNBQVMsQ0FBQyxDQUFDO3FCQUNyRTtnQkFDSCxDQUFDLENBQUMsQ0FBQzs7O1lBbEJMLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTt3QkFBOUIsQ0FBQzthQW1CVDtZQUNELE9BQU8sTUFBTSxDQUFDO1FBQ2hCLENBQUM7UUFDSCx3QkFBQztJQUFELENBQUMsQUEzR0QsSUEyR0M7SUEzR1ksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtEaWFnbm9zdGljSGFuZGxpbmdTdHJhdGVneSwgRGlhZ25vc3RpY3N9IGZyb20gJy4uLy4uL2RpYWdub3N0aWNzJztcbmltcG9ydCB7RmlsZVV0aWxzfSBmcm9tICcuLi8uLi9maWxlX3V0aWxzJztcbmltcG9ydCB7VHJhbnNsYXRpb25CdW5kbGV9IGZyb20gJy4uL3RyYW5zbGF0b3InO1xuXG5pbXBvcnQge1RyYW5zbGF0aW9uUGFyc2VyfSBmcm9tICcuL3RyYW5zbGF0aW9uX3BhcnNlcnMvdHJhbnNsYXRpb25fcGFyc2VyJztcblxuLyoqXG4gKiBVc2UgdGhpcyBjbGFzcyB0byBsb2FkIGEgY29sbGVjdGlvbiBvZiB0cmFuc2xhdGlvbiBmaWxlcyBmcm9tIGRpc2suXG4gKi9cbmV4cG9ydCBjbGFzcyBUcmFuc2xhdGlvbkxvYWRlciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSB0cmFuc2xhdGlvblBhcnNlcnM6IFRyYW5zbGF0aW9uUGFyc2VyPGFueT5bXSxcbiAgICAgIHByaXZhdGUgZHVwbGljYXRlVHJhbnNsYXRpb246IERpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5LFxuICAgICAgLyoqIEBkZXByZWNhdGVkICovIHByaXZhdGUgZGlhZ25vc3RpY3M/OiBEaWFnbm9zdGljcykge31cblxuICAvKipcbiAgICogTG9hZCBhbmQgcGFyc2UgdGhlIHRyYW5zbGF0aW9uIGZpbGVzIGludG8gYSBjb2xsZWN0aW9uIG9mIGBUcmFuc2xhdGlvbkJ1bmRsZXNgLlxuICAgKlxuICAgKiBAcGFyYW0gdHJhbnNsYXRpb25GaWxlUGF0aHMgQW4gYXJyYXksIHBlciBsb2NhbGUsIG9mIGFic29sdXRlIHBhdGhzIHRvIHRyYW5zbGF0aW9uIGZpbGVzLlxuICAgKlxuICAgKiBGb3IgZWFjaCBsb2NhbGUgdG8gYmUgdHJhbnNsYXRlZCwgdGhlcmUgaXMgYW4gZWxlbWVudCBpbiBgdHJhbnNsYXRpb25GaWxlUGF0aHNgLiBFYWNoIGVsZW1lbnRcbiAgICogaXMgYW4gYXJyYXkgb2YgYWJzb2x1dGUgcGF0aHMgdG8gdHJhbnNsYXRpb24gZmlsZXMgZm9yIHRoYXQgbG9jYWxlLlxuICAgKiBJZiB0aGUgYXJyYXkgY29udGFpbnMgbW9yZSB0aGFuIG9uZSB0cmFuc2xhdGlvbiBmaWxlLCB0aGVuIHRoZSB0cmFuc2xhdGlvbnMgYXJlIG1lcmdlZC5cbiAgICogSWYgYWxsb3dlZCBieSB0aGUgYGR1cGxpY2F0ZVRyYW5zbGF0aW9uYCBwcm9wZXJ0eSwgd2hlbiBtb3JlIHRoYW4gb25lIHRyYW5zbGF0aW9uIGhhcyB0aGUgc2FtZVxuICAgKiBtZXNzYWdlIGlkLCB0aGUgbWVzc2FnZSBmcm9tIHRoZSBlYXJsaWVyIHRyYW5zbGF0aW9uIGZpbGUgaW4gdGhlIGFycmF5IGlzIHVzZWQuXG4gICAqIEZvciBleGFtcGxlLCBpZiB0aGUgZmlsZXMgYXJlIGBbYXBwLnhsZiwgbGliLTEueGxmLCBsaWItMi54bGlmXWAgdGhlbiBhIG1lc3NhZ2UgdGhhdCBhcHBlYXJzIGluXG4gICAqIGBhcHAueGxmYCB3aWxsIG92ZXJyaWRlIHRoZSBzYW1lIG1lc3NhZ2UgaW4gYGxpYi0xLnhsZmAgb3IgYGxpYi0yLnhsZmAuXG4gICAqXG4gICAqIEBwYXJhbSB0cmFuc2xhdGlvbkZpbGVMb2NhbGVzIEFuIGFycmF5IG9mIGxvY2FsZXMgZm9yIGVhY2ggb2YgdGhlIHRyYW5zbGF0aW9uIGZpbGVzLlxuICAgKlxuICAgKiBJZiB0aGVyZSBpcyBhIGxvY2FsZSBwcm92aWRlZCBpbiBgdHJhbnNsYXRpb25GaWxlTG9jYWxlc2AgdGhlbiB0aGlzIGlzIHVzZWQgcmF0aGVyIHRoYW4gYVxuICAgKiBsb2NhbGUgZXh0cmFjdGVkIGZyb20gdGhlIGZpbGUgaXRzZWxmLlxuICAgKiBJZiB0aGVyZSBpcyBuZWl0aGVyIGEgcHJvdmlkZWQgbG9jYWxlIG5vciBhIGxvY2FsZSBwYXJzZWQgZnJvbSB0aGUgZmlsZSwgdGhlbiBhbiBlcnJvciBpc1xuICAgKiB0aHJvd24uXG4gICAqIElmIHRoZXJlIGFyZSBib3RoIGEgcHJvdmlkZWQgbG9jYWxlIGFuZCBhIGxvY2FsZSBwYXJzZWQgZnJvbSB0aGUgZmlsZSwgYW5kIHRoZXkgYXJlIG5vdCB0aGVcbiAgICogc2FtZSwgdGhlbiBhIHdhcm5pbmcgaXMgcmVwb3J0ZWQuXG4gICAqL1xuICBsb2FkQnVuZGxlcyh0cmFuc2xhdGlvbkZpbGVQYXRoczogc3RyaW5nW11bXSwgdHJhbnNsYXRpb25GaWxlTG9jYWxlczogKHN0cmluZ3x1bmRlZmluZWQpW10pOlxuICAgICAgVHJhbnNsYXRpb25CdW5kbGVbXSB7XG4gICAgcmV0dXJuIHRyYW5zbGF0aW9uRmlsZVBhdGhzLm1hcCgoZmlsZVBhdGhzLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgcHJvdmlkZWRMb2NhbGUgPSB0cmFuc2xhdGlvbkZpbGVMb2NhbGVzW2luZGV4XTtcbiAgICAgIHJldHVybiB0aGlzLm1lcmdlQnVuZGxlcyhmaWxlUGF0aHMsIHByb3ZpZGVkTG9jYWxlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIGFsbCB0aGUgdHJhbnNsYXRpb25zIGZyb20gdGhlIGZpbGUgYXQgdGhlIGdpdmVuIGBmaWxlUGF0aGAuXG4gICAqL1xuICBwcml2YXRlIGxvYWRCdW5kbGUoZmlsZVBhdGg6IHN0cmluZywgcHJvdmlkZWRMb2NhbGU6IHN0cmluZ3x1bmRlZmluZWQpOiBUcmFuc2xhdGlvbkJ1bmRsZSB7XG4gICAgY29uc3QgZmlsZUNvbnRlbnRzID0gRmlsZVV0aWxzLnJlYWRGaWxlKGZpbGVQYXRoKTtcbiAgICBmb3IgKGNvbnN0IHRyYW5zbGF0aW9uUGFyc2VyIG9mIHRoaXMudHJhbnNsYXRpb25QYXJzZXJzKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSB0cmFuc2xhdGlvblBhcnNlci5jYW5QYXJzZShmaWxlUGF0aCwgZmlsZUNvbnRlbnRzKTtcbiAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7bG9jYWxlOiBwYXJzZWRMb2NhbGUsIHRyYW5zbGF0aW9ucywgZGlhZ25vc3RpY3N9ID1cbiAgICAgICAgICB0cmFuc2xhdGlvblBhcnNlci5wYXJzZShmaWxlUGF0aCwgZmlsZUNvbnRlbnRzLCByZXN1bHQpO1xuICAgICAgaWYgKGRpYWdub3N0aWNzLmhhc0Vycm9ycykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZGlhZ25vc3RpY3MuZm9ybWF0RGlhZ25vc3RpY3MoXG4gICAgICAgICAgICBgVGhlIHRyYW5zbGF0aW9uIGZpbGUgXCIke2ZpbGVQYXRofVwiIGNvdWxkIG5vdCBiZSBwYXJzZWQuYCkpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBsb2NhbGUgPSBwcm92aWRlZExvY2FsZSB8fCBwYXJzZWRMb2NhbGU7XG4gICAgICBpZiAobG9jYWxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgdHJhbnNsYXRpb24gZmlsZSBcIiR7XG4gICAgICAgICAgICBmaWxlUGF0aH1cIiBkb2VzIG5vdCBjb250YWluIGEgdGFyZ2V0IGxvY2FsZSBhbmQgbm8gZXhwbGljaXQgbG9jYWxlIHdhcyBwcm92aWRlZCBmb3IgdGhpcyBmaWxlLmApO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFyc2VkTG9jYWxlICE9PSB1bmRlZmluZWQgJiYgcHJvdmlkZWRMb2NhbGUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgIHBhcnNlZExvY2FsZSAhPT0gcHJvdmlkZWRMb2NhbGUpIHtcbiAgICAgICAgZGlhZ25vc3RpY3Mud2FybihcbiAgICAgICAgICAgIGBUaGUgcHJvdmlkZWQgbG9jYWxlIFwiJHtwcm92aWRlZExvY2FsZX1cIiBkb2VzIG5vdCBtYXRjaCB0aGUgdGFyZ2V0IGxvY2FsZSBcIiR7XG4gICAgICAgICAgICAgICAgcGFyc2VkTG9jYWxlfVwiIGZvdW5kIGluIHRoZSB0cmFuc2xhdGlvbiBmaWxlIFwiJHtmaWxlUGF0aH1cIi5gKTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgd2Ugd2VyZSBwYXNzZWQgYSBkaWFnbm9zdGljcyBvYmplY3QgdGhlbiBjb3B5IHRoZSBtZXNzYWdlcyBvdmVyIHRvIGl0LlxuICAgICAgaWYgKHRoaXMuZGlhZ25vc3RpY3MpIHtcbiAgICAgICAgdGhpcy5kaWFnbm9zdGljcy5tZXJnZShkaWFnbm9zdGljcyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7bG9jYWxlLCB0cmFuc2xhdGlvbnMsIGRpYWdub3N0aWNzfTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgVGhlcmUgaXMgbm8gXCJUcmFuc2xhdGlvblBhcnNlclwiIHRoYXQgY2FuIHBhcnNlIHRoaXMgdHJhbnNsYXRpb24gZmlsZTogJHtmaWxlUGF0aH0uYCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlcmUgaXMgbW9yZSB0aGFuIG9uZSBgZmlsZVBhdGhgIGZvciB0aGlzIGxvY2FsZSwgc28gbG9hZCBlYWNoIGFzIGEgYnVuZGxlIGFuZCB0aGVuIG1lcmdlIHRoZW1cbiAgICogYWxsIHRvZ2V0aGVyLlxuICAgKi9cbiAgcHJpdmF0ZSBtZXJnZUJ1bmRsZXMoZmlsZVBhdGhzOiBzdHJpbmdbXSwgcHJvdmlkZWRMb2NhbGU6IHN0cmluZ3x1bmRlZmluZWQpOiBUcmFuc2xhdGlvbkJ1bmRsZSB7XG4gICAgY29uc3QgYnVuZGxlcyA9IGZpbGVQYXRocy5tYXAoZmlsZVBhdGggPT4gdGhpcy5sb2FkQnVuZGxlKGZpbGVQYXRoLCBwcm92aWRlZExvY2FsZSkpO1xuICAgIGNvbnN0IGJ1bmRsZSA9IGJ1bmRsZXNbMF07XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBidW5kbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBuZXh0QnVuZGxlID0gYnVuZGxlc1tpXTtcbiAgICAgIGlmIChuZXh0QnVuZGxlLmxvY2FsZSAhPT0gYnVuZGxlLmxvY2FsZSkge1xuICAgICAgICBpZiAodGhpcy5kaWFnbm9zdGljcykge1xuICAgICAgICAgIGNvbnN0IHByZXZpb3VzRmlsZXMgPSBmaWxlUGF0aHMuc2xpY2UoMCwgaSkubWFwKGYgPT4gYFwiJHtmfVwiYCkuam9pbignLCAnKTtcbiAgICAgICAgICB0aGlzLmRpYWdub3N0aWNzLndhcm4oYFdoZW4gbWVyZ2luZyBtdWx0aXBsZSB0cmFuc2xhdGlvbiBmaWxlcywgdGhlIHRhcmdldCBsb2NhbGUgXCIke1xuICAgICAgICAgICAgICBuZXh0QnVuZGxlLmxvY2FsZX1cIiBmb3VuZCBpbiBcIiR7ZmlsZVBhdGhzW2ldfVwiIGRvZXMgbm90IG1hdGNoIHRoZSB0YXJnZXQgbG9jYWxlIFwiJHtcbiAgICAgICAgICAgICAgYnVuZGxlLmxvY2FsZX1cIiBmb3VuZCBpbiBlYXJsaWVyIGZpbGVzIFske3ByZXZpb3VzRmlsZXN9XS5gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgT2JqZWN0LmtleXMobmV4dEJ1bmRsZS50cmFuc2xhdGlvbnMpLmZvckVhY2gobWVzc2FnZUlkID0+IHtcbiAgICAgICAgaWYgKGJ1bmRsZS50cmFuc2xhdGlvbnNbbWVzc2FnZUlkXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhpcy5kaWFnbm9zdGljcz8uYWRkKFxuICAgICAgICAgICAgICB0aGlzLmR1cGxpY2F0ZVRyYW5zbGF0aW9uLFxuICAgICAgICAgICAgICBgRHVwbGljYXRlIHRyYW5zbGF0aW9ucyBmb3IgbWVzc2FnZSBcIiR7bWVzc2FnZUlkfVwiIHdoZW4gbWVyZ2luZyBcIiR7ZmlsZVBhdGhzW2ldfVwiLmApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJ1bmRsZS50cmFuc2xhdGlvbnNbbWVzc2FnZUlkXSA9IG5leHRCdW5kbGUudHJhbnNsYXRpb25zW21lc3NhZ2VJZF07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gYnVuZGxlO1xuICB9XG59XG4iXX0=
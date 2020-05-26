(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_loader", ["require", "exports", "tslib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TranslationLoader = void 0;
    var tslib_1 = require("tslib");
    /**
     * Use this class to load a collection of translation files from disk.
     */
    var TranslationLoader = /** @class */ (function () {
        function TranslationLoader(fs, translationParsers, duplicateTranslation, 
        /** @deprecated */ diagnostics) {
            this.fs = fs;
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
            var fileContents = this.fs.readFile(filePath);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRpb25fbG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3Rvb2xzL3NyYy90cmFuc2xhdGUvdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fbG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFhQTs7T0FFRztJQUNIO1FBQ0UsMkJBQ1ksRUFBYyxFQUFVLGtCQUE0QyxFQUNwRSxvQkFBZ0Q7UUFDeEQsa0JBQWtCLENBQVMsV0FBeUI7WUFGNUMsT0FBRSxHQUFGLEVBQUUsQ0FBWTtZQUFVLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBMEI7WUFDcEUseUJBQW9CLEdBQXBCLG9CQUFvQixDQUE0QjtZQUM3QixnQkFBVyxHQUFYLFdBQVcsQ0FBYztRQUFHLENBQUM7UUFFNUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztXQXFCRztRQUNILHVDQUFXLEdBQVgsVUFDSSxvQkFBd0MsRUFDeEMsc0JBQTRDO1lBRmhELGlCQU9DO1lBSkMsT0FBTyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsVUFBQyxTQUFTLEVBQUUsS0FBSztnQkFDL0MsSUFBTSxjQUFjLEdBQUcsc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3JELE9BQU8sS0FBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDdEQsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQ7O1dBRUc7UUFDSyxzQ0FBVSxHQUFsQixVQUFtQixRQUF3QixFQUFFLGNBQWdDOztZQUUzRSxJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7Z0JBQ2hELEtBQWdDLElBQUEsS0FBQSxpQkFBQSxJQUFJLENBQUMsa0JBQWtCLENBQUEsZ0JBQUEsNEJBQUU7b0JBQXBELElBQU0saUJB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QyxDQUFDLENBQUMsUUFBSSxFQUFFO3FCQUMxRjt5QkFBTTt3QkFDTCxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7cUJBQ3JFO2dCQUNILENBQUMsQ0FBQyxDQUFDOzs7WUFsQkwsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFO3dCQUE5QixDQUFDO2FBbUJUO1lBQ0QsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQztRQUNILHdCQUFDO0lBQUQsQ0FBQyxBQTlHRCxJQThHQztJQTlHWSw4Q0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0Fic29sdXRlRnNQYXRoLCBGaWxlU3lzdGVtfSBmcm9tICdAYW5ndWxhci9jb21waWxlci1jbGkvc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7RGlhZ25vc3RpY0hhbmRsaW5nU3RyYXRlZ3ksIERpYWdub3N0aWNzfSBmcm9tICcuLi8uLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge1RyYW5zbGF0aW9uQnVuZGxlfSBmcm9tICcuLi90cmFuc2xhdG9yJztcblxuaW1wb3J0IHtUcmFuc2xhdGlvblBhcnNlcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9wYXJzZXJzL3RyYW5zbGF0aW9uX3BhcnNlcic7XG5cbi8qKlxuICogVXNlIHRoaXMgY2xhc3MgdG8gbG9hZCBhIGNvbGxlY3Rpb24gb2YgdHJhbnNsYXRpb24gZmlsZXMgZnJvbSBkaXNrLlxuICovXG5leHBvcnQgY2xhc3MgVHJhbnNsYXRpb25Mb2FkZXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgZnM6IEZpbGVTeXN0ZW0sIHByaXZhdGUgdHJhbnNsYXRpb25QYXJzZXJzOiBUcmFuc2xhdGlvblBhcnNlcjxhbnk+W10sXG4gICAgICBwcml2YXRlIGR1cGxpY2F0ZVRyYW5zbGF0aW9uOiBEaWFnbm9zdGljSGFuZGxpbmdTdHJhdGVneSxcbiAgICAgIC8qKiBAZGVwcmVjYXRlZCAqLyBwcml2YXRlIGRpYWdub3N0aWNzPzogRGlhZ25vc3RpY3MpIHt9XG5cbiAgLyoqXG4gICAqIExvYWQgYW5kIHBhcnNlIHRoZSB0cmFuc2xhdGlvbiBmaWxlcyBpbnRvIGEgY29sbGVjdGlvbiBvZiBgVHJhbnNsYXRpb25CdW5kbGVzYC5cbiAgICpcbiAgICogQHBhcmFtIHRyYW5zbGF0aW9uRmlsZVBhdGhzIEFuIGFycmF5LCBwZXIgbG9jYWxlLCBvZiBhYnNvbHV0ZSBwYXRocyB0byB0cmFuc2xhdGlvbiBmaWxlcy5cbiAgICpcbiAgICogRm9yIGVhY2ggbG9jYWxlIHRvIGJlIHRyYW5zbGF0ZWQsIHRoZXJlIGlzIGFuIGVsZW1lbnQgaW4gYHRyYW5zbGF0aW9uRmlsZVBhdGhzYC4gRWFjaCBlbGVtZW50XG4gICAqIGlzIGFuIGFycmF5IG9mIGFic29sdXRlIHBhdGhzIHRvIHRyYW5zbGF0aW9uIGZpbGVzIGZvciB0aGF0IGxvY2FsZS5cbiAgICogSWYgdGhlIGFycmF5IGNvbnRhaW5zIG1vcmUgdGhhbiBvbmUgdHJhbnNsYXRpb24gZmlsZSwgdGhlbiB0aGUgdHJhbnNsYXRpb25zIGFyZSBtZXJnZWQuXG4gICAqIElmIGFsbG93ZWQgYnkgdGhlIGBkdXBsaWNhdGVUcmFuc2xhdGlvbmAgcHJvcGVydHksIHdoZW4gbW9yZSB0aGFuIG9uZSB0cmFuc2xhdGlvbiBoYXMgdGhlIHNhbWVcbiAgICogbWVzc2FnZSBpZCwgdGhlIG1lc3NhZ2UgZnJvbSB0aGUgZWFybGllciB0cmFuc2xhdGlvbiBmaWxlIGluIHRoZSBhcnJheSBpcyB1c2VkLlxuICAgKiBGb3IgZXhhbXBsZSwgaWYgdGhlIGZpbGVzIGFyZSBgW2FwcC54bGYsIGxpYi0xLnhsZiwgbGliLTIueGxpZl1gIHRoZW4gYSBtZXNzYWdlIHRoYXQgYXBwZWFycyBpblxuICAgKiBgYXBwLnhsZmAgd2lsbCBvdmVycmlkZSB0aGUgc2FtZSBtZXNzYWdlIGluIGBsaWItMS54bGZgIG9yIGBsaWItMi54bGZgLlxuICAgKlxuICAgKiBAcGFyYW0gdHJhbnNsYXRpb25GaWxlTG9jYWxlcyBBbiBhcnJheSBvZiBsb2NhbGVzIGZvciBlYWNoIG9mIHRoZSB0cmFuc2xhdGlvbiBmaWxlcy5cbiAgICpcbiAgICogSWYgdGhlcmUgaXMgYSBsb2NhbGUgcHJvdmlkZWQgaW4gYHRyYW5zbGF0aW9uRmlsZUxvY2FsZXNgIHRoZW4gdGhpcyBpcyB1c2VkIHJhdGhlciB0aGFuIGFcbiAgICogbG9jYWxlIGV4dHJhY3RlZCBmcm9tIHRoZSBmaWxlIGl0c2VsZi5cbiAgICogSWYgdGhlcmUgaXMgbmVpdGhlciBhIHByb3ZpZGVkIGxvY2FsZSBub3IgYSBsb2NhbGUgcGFyc2VkIGZyb20gdGhlIGZpbGUsIHRoZW4gYW4gZXJyb3IgaXNcbiAgICogdGhyb3duLlxuICAgKiBJZiB0aGVyZSBhcmUgYm90aCBhIHByb3ZpZGVkIGxvY2FsZSBhbmQgYSBsb2NhbGUgcGFyc2VkIGZyb20gdGhlIGZpbGUsIGFuZCB0aGV5IGFyZSBub3QgdGhlXG4gICAqIHNhbWUsIHRoZW4gYSB3YXJuaW5nIGlzIHJlcG9ydGVkLlxuICAgKi9cbiAgbG9hZEJ1bmRsZXMoXG4gICAgICB0cmFuc2xhdGlvbkZpbGVQYXRoczogQWJzb2x1dGVGc1BhdGhbXVtdLFxuICAgICAgdHJhbnNsYXRpb25GaWxlTG9jYWxlczogKHN0cmluZ3x1bmRlZmluZWQpW10pOiBUcmFuc2xhdGlvbkJ1bmRsZVtdIHtcbiAgICByZXR1cm4gdHJhbnNsYXRpb25GaWxlUGF0aHMubWFwKChmaWxlUGF0aHMsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBwcm92aWRlZExvY2FsZSA9IHRyYW5zbGF0aW9uRmlsZUxvY2FsZXNbaW5kZXhdO1xuICAgICAgcmV0dXJuIHRoaXMubWVyZ2VCdW5kbGVzKGZpbGVQYXRocywgcHJvdmlkZWRMb2NhbGUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgYWxsIHRoZSB0cmFuc2xhdGlvbnMgZnJvbSB0aGUgZmlsZSBhdCB0aGUgZ2l2ZW4gYGZpbGVQYXRoYC5cbiAgICovXG4gIHByaXZhdGUgbG9hZEJ1bmRsZShmaWxlUGF0aDogQWJzb2x1dGVGc1BhdGgsIHByb3ZpZGVkTG9jYWxlOiBzdHJpbmd8dW5kZWZpbmVkKTpcbiAgICAgIFRyYW5zbGF0aW9uQnVuZGxlIHtcbiAgICBjb25zdCBmaWxlQ29udGVudHMgPSB0aGlzLmZzLnJlYWRGaWxlKGZpbGVQYXRoKTtcbiAgICBmb3IgKGNvbnN0IHRyYW5zbGF0aW9uUGFyc2VyIG9mIHRoaXMudHJhbnNsYXRpb25QYXJzZXJzKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSB0cmFuc2xhdGlvblBhcnNlci5jYW5QYXJzZShmaWxlUGF0aCwgZmlsZUNvbnRlbnRzKTtcbiAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7bG9jYWxlOiBwYXJzZWRMb2NhbGUsIHRyYW5zbGF0aW9ucywgZGlhZ25vc3RpY3N9ID1cbiAgICAgICAgICB0cmFuc2xhdGlvblBhcnNlci5wYXJzZShmaWxlUGF0aCwgZmlsZUNvbnRlbnRzLCByZXN1bHQpO1xuICAgICAgaWYgKGRpYWdub3N0aWNzLmhhc0Vycm9ycykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZGlhZ25vc3RpY3MuZm9ybWF0RGlhZ25vc3RpY3MoXG4gICAgICAgICAgICBgVGhlIHRyYW5zbGF0aW9uIGZpbGUgXCIke2ZpbGVQYXRofVwiIGNvdWxkIG5vdCBiZSBwYXJzZWQuYCkpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBsb2NhbGUgPSBwcm92aWRlZExvY2FsZSB8fCBwYXJzZWRMb2NhbGU7XG4gICAgICBpZiAobG9jYWxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgdHJhbnNsYXRpb24gZmlsZSBcIiR7XG4gICAgICAgICAgICBmaWxlUGF0aH1cIiBkb2VzIG5vdCBjb250YWluIGEgdGFyZ2V0IGxvY2FsZSBhbmQgbm8gZXhwbGljaXQgbG9jYWxlIHdhcyBwcm92aWRlZCBmb3IgdGhpcyBmaWxlLmApO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFyc2VkTG9jYWxlICE9PSB1bmRlZmluZWQgJiYgcHJvdmlkZWRMb2NhbGUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgIHBhcnNlZExvY2FsZSAhPT0gcHJvdmlkZWRMb2NhbGUpIHtcbiAgICAgICAgZGlhZ25vc3RpY3Mud2FybihcbiAgICAgICAgICAgIGBUaGUgcHJvdmlkZWQgbG9jYWxlIFwiJHtwcm92aWRlZExvY2FsZX1cIiBkb2VzIG5vdCBtYXRjaCB0aGUgdGFyZ2V0IGxvY2FsZSBcIiR7XG4gICAgICAgICAgICAgICAgcGFyc2VkTG9jYWxlfVwiIGZvdW5kIGluIHRoZSB0cmFuc2xhdGlvbiBmaWxlIFwiJHtmaWxlUGF0aH1cIi5gKTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgd2Ugd2VyZSBwYXNzZWQgYSBkaWFnbm9zdGljcyBvYmplY3QgdGhlbiBjb3B5IHRoZSBtZXNzYWdlcyBvdmVyIHRvIGl0LlxuICAgICAgaWYgKHRoaXMuZGlhZ25vc3RpY3MpIHtcbiAgICAgICAgdGhpcy5kaWFnbm9zdGljcy5tZXJnZShkaWFnbm9zdGljcyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7bG9jYWxlLCB0cmFuc2xhdGlvbnMsIGRpYWdub3N0aWNzfTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgVGhlcmUgaXMgbm8gXCJUcmFuc2xhdGlvblBhcnNlclwiIHRoYXQgY2FuIHBhcnNlIHRoaXMgdHJhbnNsYXRpb24gZmlsZTogJHtmaWxlUGF0aH0uYCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlcmUgaXMgbW9yZSB0aGFuIG9uZSBgZmlsZVBhdGhgIGZvciB0aGlzIGxvY2FsZSwgc28gbG9hZCBlYWNoIGFzIGEgYnVuZGxlIGFuZCB0aGVuIG1lcmdlIHRoZW1cbiAgICogYWxsIHRvZ2V0aGVyLlxuICAgKi9cbiAgcHJpdmF0ZSBtZXJnZUJ1bmRsZXMoZmlsZVBhdGhzOiBBYnNvbHV0ZUZzUGF0aFtdLCBwcm92aWRlZExvY2FsZTogc3RyaW5nfHVuZGVmaW5lZCk6XG4gICAgICBUcmFuc2xhdGlvbkJ1bmRsZSB7XG4gICAgY29uc3QgYnVuZGxlcyA9IGZpbGVQYXRocy5tYXAoZmlsZVBhdGggPT4gdGhpcy5sb2FkQnVuZGxlKGZpbGVQYXRoLCBwcm92aWRlZExvY2FsZSkpO1xuICAgIGNvbnN0IGJ1bmRsZSA9IGJ1bmRsZXNbMF07XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBidW5kbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBuZXh0QnVuZGxlID0gYnVuZGxlc1tpXTtcbiAgICAgIGlmIChuZXh0QnVuZGxlLmxvY2FsZSAhPT0gYnVuZGxlLmxvY2FsZSkge1xuICAgICAgICBpZiAodGhpcy5kaWFnbm9zdGljcykge1xuICAgICAgICAgIGNvbnN0IHByZXZpb3VzRmlsZXMgPSBmaWxlUGF0aHMuc2xpY2UoMCwgaSkubWFwKGYgPT4gYFwiJHtmfVwiYCkuam9pbignLCAnKTtcbiAgICAgICAgICB0aGlzLmRpYWdub3N0aWNzLndhcm4oYFdoZW4gbWVyZ2luZyBtdWx0aXBsZSB0cmFuc2xhdGlvbiBmaWxlcywgdGhlIHRhcmdldCBsb2NhbGUgXCIke1xuICAgICAgICAgICAgICBuZXh0QnVuZGxlLmxvY2FsZX1cIiBmb3VuZCBpbiBcIiR7ZmlsZVBhdGhzW2ldfVwiIGRvZXMgbm90IG1hdGNoIHRoZSB0YXJnZXQgbG9jYWxlIFwiJHtcbiAgICAgICAgICAgICAgYnVuZGxlLmxvY2FsZX1cIiBmb3VuZCBpbiBlYXJsaWVyIGZpbGVzIFske3ByZXZpb3VzRmlsZXN9XS5gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgT2JqZWN0LmtleXMobmV4dEJ1bmRsZS50cmFuc2xhdGlvbnMpLmZvckVhY2gobWVzc2FnZUlkID0+IHtcbiAgICAgICAgaWYgKGJ1bmRsZS50cmFuc2xhdGlvbnNbbWVzc2FnZUlkXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhpcy5kaWFnbm9zdGljcz8uYWRkKFxuICAgICAgICAgICAgICB0aGlzLmR1cGxpY2F0ZVRyYW5zbGF0aW9uLFxuICAgICAgICAgICAgICBgRHVwbGljYXRlIHRyYW5zbGF0aW9ucyBmb3IgbWVzc2FnZSBcIiR7bWVzc2FnZUlkfVwiIHdoZW4gbWVyZ2luZyBcIiR7ZmlsZVBhdGhzW2ldfVwiLmApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJ1bmRsZS50cmFuc2xhdGlvbnNbbWVzc2FnZUlkXSA9IG5leHRCdW5kbGUudHJhbnNsYXRpb25zW21lc3NhZ2VJZF07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gYnVuZGxlO1xuICB9XG59XG4iXX0=
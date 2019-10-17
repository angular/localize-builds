(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_file_loader", ["require", "exports", "tslib", "@angular/localize/src/tools/src/file_utils"], factory);
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
    var file_utils_1 = require("@angular/localize/src/tools/src/file_utils");
    /**
     * Use this class to load a collection of translation files from disk.
     */
    var TranslationLoader = /** @class */ (function () {
        function TranslationLoader(translationParsers) {
            this.translationParsers = translationParsers;
        }
        /**
         * Load and parse the translation files into a collection of `TranslationBundles`.
         *
         * @param translationFilePaths A collection of absolute paths to the translation files.
         */
        TranslationLoader.prototype.loadBundles = function (translationFilePaths) {
            var _this = this;
            return translationFilePaths.map(function (filePath) {
                var e_1, _a;
                var fileContents = file_utils_1.FileUtils.readFile(filePath);
                try {
                    for (var _b = tslib_1.__values(_this.translationParsers), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var translationParser = _c.value;
                        if (translationParser.canParse(filePath, fileContents)) {
                            return translationParser.parse(filePath, fileContents);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                throw new Error("Unable to parse translation file: " + filePath);
            });
        };
        return TranslationLoader;
    }());
    exports.TranslationLoader = TranslationLoader;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRpb25fZmlsZV9sb2FkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9maWxlX2xvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCx5RUFBMkM7SUFJM0M7O09BRUc7SUFDSDtRQUNFLDJCQUFvQixrQkFBdUM7WUFBdkMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFxQjtRQUFHLENBQUM7UUFFL0Q7Ozs7V0FJRztRQUNILHVDQUFXLEdBQVgsVUFBWSxvQkFBOEI7WUFBMUMsaUJBVUM7WUFUQyxPQUFPLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxVQUFBLFFBQVE7O2dCQUN0QyxJQUFNLFlBQVksR0FBRyxzQkFBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7b0JBQ2xELEtBQWdDLElBQUEsS0FBQSxpQkFBQSxLQUFJLENBQUMsa0JBQWtCLENBQUEsZ0JBQUEsNEJBQUU7d0JBQXBELElBQU0saUJBQWlCLFdBQUE7d0JBQzFCLElBQUksaUJBQWlCLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsRUFBRTs0QkFDdEQsT0FBTyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO3lCQUN4RDtxQkFDRjs7Ozs7Ozs7O2dCQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXFDLFFBQVUsQ0FBQyxDQUFDO1lBQ25FLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUNILHdCQUFDO0lBQUQsQ0FBQyxBQW5CRCxJQW1CQztJQW5CWSw4Q0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0ZpbGVVdGlsc30gZnJvbSAnLi4vLi4vZmlsZV91dGlscyc7XG5pbXBvcnQge1RyYW5zbGF0aW9uQnVuZGxlfSBmcm9tICcuLi90cmFuc2xhdG9yJztcbmltcG9ydCB7VHJhbnNsYXRpb25QYXJzZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fcGFyc2Vycy90cmFuc2xhdGlvbl9wYXJzZXInO1xuXG4vKipcbiAqIFVzZSB0aGlzIGNsYXNzIHRvIGxvYWQgYSBjb2xsZWN0aW9uIG9mIHRyYW5zbGF0aW9uIGZpbGVzIGZyb20gZGlzay5cbiAqL1xuZXhwb3J0IGNsYXNzIFRyYW5zbGF0aW9uTG9hZGVyIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSB0cmFuc2xhdGlvblBhcnNlcnM6IFRyYW5zbGF0aW9uUGFyc2VyW10pIHt9XG5cbiAgLyoqXG4gICAqIExvYWQgYW5kIHBhcnNlIHRoZSB0cmFuc2xhdGlvbiBmaWxlcyBpbnRvIGEgY29sbGVjdGlvbiBvZiBgVHJhbnNsYXRpb25CdW5kbGVzYC5cbiAgICpcbiAgICogQHBhcmFtIHRyYW5zbGF0aW9uRmlsZVBhdGhzIEEgY29sbGVjdGlvbiBvZiBhYnNvbHV0ZSBwYXRocyB0byB0aGUgdHJhbnNsYXRpb24gZmlsZXMuXG4gICAqL1xuICBsb2FkQnVuZGxlcyh0cmFuc2xhdGlvbkZpbGVQYXRoczogc3RyaW5nW10pOiBUcmFuc2xhdGlvbkJ1bmRsZVtdIHtcbiAgICByZXR1cm4gdHJhbnNsYXRpb25GaWxlUGF0aHMubWFwKGZpbGVQYXRoID0+IHtcbiAgICAgIGNvbnN0IGZpbGVDb250ZW50cyA9IEZpbGVVdGlscy5yZWFkRmlsZShmaWxlUGF0aCk7XG4gICAgICBmb3IgKGNvbnN0IHRyYW5zbGF0aW9uUGFyc2VyIG9mIHRoaXMudHJhbnNsYXRpb25QYXJzZXJzKSB7XG4gICAgICAgIGlmICh0cmFuc2xhdGlvblBhcnNlci5jYW5QYXJzZShmaWxlUGF0aCwgZmlsZUNvbnRlbnRzKSkge1xuICAgICAgICAgIHJldHVybiB0cmFuc2xhdGlvblBhcnNlci5wYXJzZShmaWxlUGF0aCwgZmlsZUNvbnRlbnRzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gcGFyc2UgdHJhbnNsYXRpb24gZmlsZTogJHtmaWxlUGF0aH1gKTtcbiAgICB9KTtcbiAgfVxufVxuIl19
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/asset_files/asset_translation_handler", ["require", "exports", "tslib", "@angular/localize/src/tools/src/file_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var file_utils_1 = require("@angular/localize/src/tools/src/file_utils");
    /**
     * Translate an asset file by simply copying it to the appropriate translation output paths.
     */
    var AssetTranslationHandler = /** @class */ (function () {
        function AssetTranslationHandler() {
        }
        AssetTranslationHandler.prototype.canTranslate = function (_relativeFilePath, _contents) { return true; };
        AssetTranslationHandler.prototype.translate = function (diagnostics, _sourceRoot, relativeFilePath, contents, outputPathFn, translations) {
            var e_1, _a;
            try {
                for (var translations_1 = tslib_1.__values(translations), translations_1_1 = translations_1.next(); !translations_1_1.done; translations_1_1 = translations_1.next()) {
                    var translation = translations_1_1.value;
                    try {
                        file_utils_1.FileUtils.writeFile(outputPathFn(translation.locale, relativeFilePath), contents);
                    }
                    catch (e) {
                        diagnostics.error(e.message);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (translations_1_1 && !translations_1_1.done && (_a = translations_1.return)) _a.call(translations_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        return AssetTranslationHandler;
    }());
    exports.AssetTranslationHandler = AssetTranslationHandler;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXRfdHJhbnNsYXRpb25faGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL2Fzc2V0X2ZpbGVzL2Fzc2V0X3RyYW5zbGF0aW9uX2hhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBUUEseUVBQTJDO0lBTTNDOztPQUVHO0lBQ0g7UUFBQTtRQWFBLENBQUM7UUFaQyw4Q0FBWSxHQUFaLFVBQWEsaUJBQXlCLEVBQUUsU0FBaUIsSUFBYSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDcEYsMkNBQVMsR0FBVCxVQUNJLFdBQXdCLEVBQUUsV0FBbUIsRUFBRSxnQkFBd0IsRUFBRSxRQUFnQixFQUN6RixZQUEwQixFQUFFLFlBQWlDOzs7Z0JBQy9ELEtBQTBCLElBQUEsaUJBQUEsaUJBQUEsWUFBWSxDQUFBLDBDQUFBLG9FQUFFO29CQUFuQyxJQUFNLFdBQVcseUJBQUE7b0JBQ3BCLElBQUk7d0JBQ0Ysc0JBQVMsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztxQkFDbkY7b0JBQUMsT0FBTyxDQUFDLEVBQUU7d0JBQ1YsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7cUJBQzlCO2lCQUNGOzs7Ozs7Ozs7UUFDSCxDQUFDO1FBQ0gsOEJBQUM7SUFBRCxDQUFDLEFBYkQsSUFhQztJQWJZLDBEQUF1QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RGlhZ25vc3RpY3N9IGZyb20gJy4uLy4uL2RpYWdub3N0aWNzJztcbmltcG9ydCB7RmlsZVV0aWxzfSBmcm9tICcuLi8uLi9maWxlX3V0aWxzJztcbmltcG9ydCB7T3V0cHV0UGF0aEZufSBmcm9tICcuLi9vdXRwdXRfcGF0aCc7XG5pbXBvcnQge1RyYW5zbGF0aW9uQnVuZGxlLCBUcmFuc2xhdGlvbkhhbmRsZXJ9IGZyb20gJy4uL3RyYW5zbGF0b3InO1xuXG5cblxuLyoqXG4gKiBUcmFuc2xhdGUgYW4gYXNzZXQgZmlsZSBieSBzaW1wbHkgY29weWluZyBpdCB0byB0aGUgYXBwcm9wcmlhdGUgdHJhbnNsYXRpb24gb3V0cHV0IHBhdGhzLlxuICovXG5leHBvcnQgY2xhc3MgQXNzZXRUcmFuc2xhdGlvbkhhbmRsZXIgaW1wbGVtZW50cyBUcmFuc2xhdGlvbkhhbmRsZXIge1xuICBjYW5UcmFuc2xhdGUoX3JlbGF0aXZlRmlsZVBhdGg6IHN0cmluZywgX2NvbnRlbnRzOiBCdWZmZXIpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH1cbiAgdHJhbnNsYXRlKFxuICAgICAgZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzLCBfc291cmNlUm9vdDogc3RyaW5nLCByZWxhdGl2ZUZpbGVQYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBCdWZmZXIsXG4gICAgICBvdXRwdXRQYXRoRm46IE91dHB1dFBhdGhGbiwgdHJhbnNsYXRpb25zOiBUcmFuc2xhdGlvbkJ1bmRsZVtdKTogdm9pZCB7XG4gICAgZm9yIChjb25zdCB0cmFuc2xhdGlvbiBvZiB0cmFuc2xhdGlvbnMpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIEZpbGVVdGlscy53cml0ZUZpbGUob3V0cHV0UGF0aEZuKHRyYW5zbGF0aW9uLmxvY2FsZSwgcmVsYXRpdmVGaWxlUGF0aCksIGNvbnRlbnRzKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZGlhZ25vc3RpY3MuZXJyb3IoZS5tZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==
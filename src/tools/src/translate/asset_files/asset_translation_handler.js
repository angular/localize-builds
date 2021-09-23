(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/asset_files/asset_translation_handler", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AssetTranslationHandler = void 0;
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    /**
     * Translate an asset file by simply copying it to the appropriate translation output paths.
     */
    var AssetTranslationHandler = /** @class */ (function () {
        function AssetTranslationHandler(fs) {
            this.fs = fs;
        }
        AssetTranslationHandler.prototype.canTranslate = function (_relativeFilePath, _contents) {
            return true;
        };
        AssetTranslationHandler.prototype.translate = function (diagnostics, _sourceRoot, relativeFilePath, contents, outputPathFn, translations, sourceLocale) {
            var e_1, _a;
            try {
                for (var translations_1 = (0, tslib_1.__values)(translations), translations_1_1 = translations_1.next(); !translations_1_1.done; translations_1_1 = translations_1.next()) {
                    var translation = translations_1_1.value;
                    this.writeAssetFile(diagnostics, outputPathFn, translation.locale, relativeFilePath, contents);
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
                this.writeAssetFile(diagnostics, outputPathFn, sourceLocale, relativeFilePath, contents);
            }
        };
        AssetTranslationHandler.prototype.writeAssetFile = function (diagnostics, outputPathFn, locale, relativeFilePath, contents) {
            try {
                var outputPath = (0, file_system_1.absoluteFrom)(outputPathFn(locale, relativeFilePath));
                this.fs.ensureDir(this.fs.dirname(outputPath));
                this.fs.writeFile(outputPath, contents);
            }
            catch (e) {
                diagnostics.error(e.message);
            }
        };
        return AssetTranslationHandler;
    }());
    exports.AssetTranslationHandler = AssetTranslationHandler;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXRfdHJhbnNsYXRpb25faGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL2Fzc2V0X2ZpbGVzL2Fzc2V0X3RyYW5zbGF0aW9uX2hhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDJFQUFrSDtJQU1sSDs7T0FFRztJQUNIO1FBQ0UsaUNBQW9CLEVBQWM7WUFBZCxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQUcsQ0FBQztRQUV0Qyw4Q0FBWSxHQUFaLFVBQWEsaUJBQTZDLEVBQUUsU0FBcUI7WUFDL0UsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQsMkNBQVMsR0FBVCxVQUNJLFdBQXdCLEVBQUUsV0FBMkIsRUFDckQsZ0JBQTRDLEVBQUUsUUFBb0IsRUFDbEUsWUFBMEIsRUFBRSxZQUFpQyxFQUFFLFlBQXFCOzs7Z0JBQ3RGLEtBQTBCLElBQUEsaUJBQUEsc0JBQUEsWUFBWSxDQUFBLDBDQUFBLG9FQUFFO29CQUFuQyxJQUFNLFdBQVcseUJBQUE7b0JBQ3BCLElBQUksQ0FBQyxjQUFjLENBQ2YsV0FBVyxFQUFFLFlBQVksRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxDQUFDO2lCQUNoRjs7Ozs7Ozs7O1lBQ0QsSUFBSSxZQUFZLEtBQUssU0FBUyxFQUFFO2dCQUM5QixJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQzFGO1FBQ0gsQ0FBQztRQUVPLGdEQUFjLEdBQXRCLFVBQ0ksV0FBd0IsRUFBRSxZQUEwQixFQUFFLE1BQWMsRUFDcEUsZ0JBQTRDLEVBQUUsUUFBb0I7WUFDcEUsSUFBSTtnQkFDRixJQUFNLFVBQVUsR0FBRyxJQUFBLDBCQUFZLEVBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hFLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUN6QztZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzlCO1FBQ0gsQ0FBQztRQUNILDhCQUFDO0lBQUQsQ0FBQyxBQS9CRCxJQStCQztJQS9CWSwwREFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7YWJzb2x1dGVGcm9tLCBBYnNvbHV0ZUZzUGF0aCwgRmlsZVN5c3RlbSwgUGF0aFNlZ21lbnR9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuXG5pbXBvcnQge0RpYWdub3N0aWNzfSBmcm9tICcuLi8uLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge091dHB1dFBhdGhGbn0gZnJvbSAnLi4vb3V0cHV0X3BhdGgnO1xuaW1wb3J0IHtUcmFuc2xhdGlvbkJ1bmRsZSwgVHJhbnNsYXRpb25IYW5kbGVyfSBmcm9tICcuLi90cmFuc2xhdG9yJztcblxuLyoqXG4gKiBUcmFuc2xhdGUgYW4gYXNzZXQgZmlsZSBieSBzaW1wbHkgY29weWluZyBpdCB0byB0aGUgYXBwcm9wcmlhdGUgdHJhbnNsYXRpb24gb3V0cHV0IHBhdGhzLlxuICovXG5leHBvcnQgY2xhc3MgQXNzZXRUcmFuc2xhdGlvbkhhbmRsZXIgaW1wbGVtZW50cyBUcmFuc2xhdGlvbkhhbmRsZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZzOiBGaWxlU3lzdGVtKSB7fVxuXG4gIGNhblRyYW5zbGF0ZShfcmVsYXRpdmVGaWxlUGF0aDogUGF0aFNlZ21lbnR8QWJzb2x1dGVGc1BhdGgsIF9jb250ZW50czogVWludDhBcnJheSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdHJhbnNsYXRlKFxuICAgICAgZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzLCBfc291cmNlUm9vdDogQWJzb2x1dGVGc1BhdGgsXG4gICAgICByZWxhdGl2ZUZpbGVQYXRoOiBQYXRoU2VnbWVudHxBYnNvbHV0ZUZzUGF0aCwgY29udGVudHM6IFVpbnQ4QXJyYXksXG4gICAgICBvdXRwdXRQYXRoRm46IE91dHB1dFBhdGhGbiwgdHJhbnNsYXRpb25zOiBUcmFuc2xhdGlvbkJ1bmRsZVtdLCBzb3VyY2VMb2NhbGU/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBmb3IgKGNvbnN0IHRyYW5zbGF0aW9uIG9mIHRyYW5zbGF0aW9ucykge1xuICAgICAgdGhpcy53cml0ZUFzc2V0RmlsZShcbiAgICAgICAgICBkaWFnbm9zdGljcywgb3V0cHV0UGF0aEZuLCB0cmFuc2xhdGlvbi5sb2NhbGUsIHJlbGF0aXZlRmlsZVBhdGgsIGNvbnRlbnRzKTtcbiAgICB9XG4gICAgaWYgKHNvdXJjZUxvY2FsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLndyaXRlQXNzZXRGaWxlKGRpYWdub3N0aWNzLCBvdXRwdXRQYXRoRm4sIHNvdXJjZUxvY2FsZSwgcmVsYXRpdmVGaWxlUGF0aCwgY29udGVudHMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgd3JpdGVBc3NldEZpbGUoXG4gICAgICBkaWFnbm9zdGljczogRGlhZ25vc3RpY3MsIG91dHB1dFBhdGhGbjogT3V0cHV0UGF0aEZuLCBsb2NhbGU6IHN0cmluZyxcbiAgICAgIHJlbGF0aXZlRmlsZVBhdGg6IFBhdGhTZWdtZW50fEFic29sdXRlRnNQYXRoLCBjb250ZW50czogVWludDhBcnJheSk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBvdXRwdXRQYXRoID0gYWJzb2x1dGVGcm9tKG91dHB1dFBhdGhGbihsb2NhbGUsIHJlbGF0aXZlRmlsZVBhdGgpKTtcbiAgICAgIHRoaXMuZnMuZW5zdXJlRGlyKHRoaXMuZnMuZGlybmFtZShvdXRwdXRQYXRoKSk7XG4gICAgICB0aGlzLmZzLndyaXRlRmlsZShvdXRwdXRQYXRoLCBjb250ZW50cyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZGlhZ25vc3RpY3MuZXJyb3IoZS5tZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translator", ["require", "exports", "tslib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Translator = void 0;
    var tslib_1 = require("tslib");
    /**
     * Translate each file (e.g. source file or static asset) using the given `TranslationHandler`s.
     * The file will be translated by the first handler that returns true for `canTranslate()`.
     */
    var Translator = /** @class */ (function () {
        function Translator(fs, resourceHandlers, diagnostics) {
            this.fs = fs;
            this.resourceHandlers = resourceHandlers;
            this.diagnostics = diagnostics;
        }
        Translator.prototype.translateFiles = function (inputPaths, rootPath, outputPathFn, translations, sourceLocale) {
            var _this = this;
            inputPaths.forEach(function (inputPath) {
                var e_1, _a;
                var absInputPath = _this.fs.resolve(rootPath, inputPath);
                var contents = _this.fs.readFileBuffer(absInputPath);
                var relativePath = _this.fs.relative(rootPath, absInputPath);
                try {
                    for (var _b = tslib_1.__values(_this.resourceHandlers), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var resourceHandler = _c.value;
                        if (resourceHandler.canTranslate(relativePath, contents)) {
                            return resourceHandler.translate(_this.diagnostics, rootPath, relativePath, contents, outputPathFn, translations, sourceLocale);
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
                _this.diagnostics.error("Unable to handle resource file: " + inputPath);
            });
        };
        return Translator;
    }());
    exports.Translator = Translator;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3RyYW5zbGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQTREQTs7O09BR0c7SUFDSDtRQUNFLG9CQUNZLEVBQWMsRUFBVSxnQkFBc0MsRUFDOUQsV0FBd0I7WUFEeEIsT0FBRSxHQUFGLEVBQUUsQ0FBWTtZQUFVLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBc0I7WUFDOUQsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFBRyxDQUFDO1FBRXhDLG1DQUFjLEdBQWQsVUFDSSxVQUF5QixFQUFFLFFBQXdCLEVBQUUsWUFBMEIsRUFDL0UsWUFBaUMsRUFBRSxZQUFxQjtZQUY1RCxpQkFnQkM7WUFiQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUEsU0FBUzs7Z0JBQzFCLElBQU0sWUFBWSxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDMUQsSUFBTSxRQUFRLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ3RELElBQU0sWUFBWSxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQzs7b0JBQzlELEtBQThCLElBQUEsS0FBQSxpQkFBQSxLQUFJLENBQUMsZ0JBQWdCLENBQUEsZ0JBQUEsNEJBQUU7d0JBQWhELElBQU0sZUFBZSxXQUFBO3dCQUN4QixJQUFJLGVBQWUsQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxFQUFFOzRCQUN4RCxPQUFPLGVBQWUsQ0FBQyxTQUFTLENBQzVCLEtBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFDOUUsWUFBWSxDQUFDLENBQUM7eUJBQ25CO3FCQUNGOzs7Ozs7Ozs7Z0JBQ0QsS0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMscUNBQW1DLFNBQVcsQ0FBQyxDQUFDO1lBQ3pFLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUNILGlCQUFDO0lBQUQsQ0FBQyxBQXRCRCxJQXNCQztJQXRCWSxnQ0FBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGgsIEZpbGVTeXN0ZW0sIFBhdGhTZWdtZW50fSBmcm9tICdAYW5ndWxhci9jb21waWxlci1jbGkvc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7ybVNZXNzYWdlSWQsIMm1UGFyc2VkVHJhbnNsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcblxuaW1wb3J0IHtEaWFnbm9zdGljc30gZnJvbSAnLi4vZGlhZ25vc3RpY3MnO1xuXG5pbXBvcnQge091dHB1dFBhdGhGbn0gZnJvbSAnLi9vdXRwdXRfcGF0aCc7XG5cbi8qKlxuICogQW4gb2JqZWN0IHRoYXQgaG9sZHMgaW5mb3JtYXRpb24gdG8gYmUgdXNlZCB0byB0cmFuc2xhdGUgZmlsZXMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVHJhbnNsYXRpb25CdW5kbGUge1xuICBsb2NhbGU6IHN0cmluZztcbiAgdHJhbnNsYXRpb25zOiBSZWNvcmQ8ybVNZXNzYWdlSWQsIMm1UGFyc2VkVHJhbnNsYXRpb24+O1xuICBkaWFnbm9zdGljcz86IERpYWdub3N0aWNzO1xufVxuXG4vKipcbiAqIEltcGxlbWVudCB0aGlzIGludGVyZmFjZSB0byBwcm92aWRlIGEgY2xhc3MgdGhhdCBjYW4gaGFuZGxlIHRyYW5zbGF0aW9uIGZvciB0aGUgZ2l2ZW4gcmVzb3VyY2UgaW5cbiAqIGFuIGFwcHJvcHJpYXRlIG1hbm5lci5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgc291cmNlIGNvZGUgZmlsZXMgd2lsbCBuZWVkIHRvIGJlIHRyYW5zZm9ybWVkIGlmIHRoZXkgY29udGFpbiBgJGxvY2FsaXplYCB0YWdnZWRcbiAqIHRlbXBsYXRlIHN0cmluZ3MsIHdoaWxlIG1vc3Qgc3RhdGljIGFzc2V0cyB3aWxsIGp1c3QgbmVlZCB0byBiZSBjb3BpZWQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVHJhbnNsYXRpb25IYW5kbGVyIHtcbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gZmlsZSBjYW4gYmUgdHJhbnNsYXRlZCBieSB0aGlzIGhhbmRsZXIuXG4gICAqXG4gICAqIEBwYXJhbSByZWxhdGl2ZUZpbGVQYXRoIEEgcmVsYXRpdmUgcGF0aCBmcm9tIHRoZSBzb3VyY2VSb290IHRvIHRoZSByZXNvdXJjZSBmaWxlIHRvIGhhbmRsZS5cbiAgICogQHBhcmFtIGNvbnRlbnRzIFRoZSBjb250ZW50cyBvZiB0aGUgZmlsZSB0byBoYW5kbGUuXG4gICAqL1xuICBjYW5UcmFuc2xhdGUocmVsYXRpdmVGaWxlUGF0aDogUGF0aFNlZ21lbnQsIGNvbnRlbnRzOiBCdWZmZXIpOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUcmFuc2xhdGUgdGhlIGZpbGUgYXQgYHJlbGF0aXZlRmlsZVBhdGhgIGNvbnRhaW5pbmcgYGNvbnRlbnRzYCwgdXNpbmcgdGhlIGdpdmVuIGB0cmFuc2xhdGlvbnNgLFxuICAgKiBhbmQgd3JpdGUgdGhlIHRyYW5zbGF0ZWQgY29udGVudCB0byB0aGUgcGF0aCBjb21wdXRlZCBieSBjYWxsaW5nIGBvdXRwdXRQYXRoRm4oKWAuXG4gICAqXG4gICAqIEBwYXJhbSBkaWFnbm9zdGljcyBBbiBvYmplY3QgZm9yIGNvbGxlY3RpbmcgdHJhbnNsYXRpb24gZGlhZ25vc3RpYyBtZXNzYWdlcy5cbiAgICogQHBhcmFtIHNvdXJjZVJvb3QgQW4gYWJzb2x1dGUgcGF0aCB0byB0aGUgcm9vdCBvZiB0aGUgZmlsZXMgYmVpbmcgdHJhbnNsYXRlZC5cbiAgICogQHBhcmFtIHJlbGF0aXZlRmlsZVBhdGggQSByZWxhdGl2ZSBwYXRoIGZyb20gdGhlIHNvdXJjZVJvb3QgdG8gdGhlIGZpbGUgdG8gdHJhbnNsYXRlLlxuICAgKiBAcGFyYW0gY29udGVudHMgVGhlIGNvbnRlbnRzIG9mIHRoZSBmaWxlIHRvIHRyYW5zbGF0ZS5cbiAgICogQHBhcmFtIG91dHB1dFBhdGhGbiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBhYnNvbHV0ZSBwYXRoIHdoZXJlIHRoZSBvdXRwdXQgZmlsZSBzaG91bGQgYmVcbiAgICogd3JpdHRlbi5cbiAgICogQHBhcmFtIHRyYW5zbGF0aW9ucyBBIGNvbGxlY3Rpb24gb2YgdHJhbnNsYXRpb25zIHRvIGFwcGx5IHRvIHRoaXMgZmlsZS5cbiAgICogQHBhcmFtIHNvdXJjZUxvY2FsZSBUaGUgbG9jYWxlIG9mIHRoZSBvcmlnaW5hbCBhcHBsaWNhdGlvbiBzb3VyY2UuIElmIHByb3ZpZGVkIHRoZW4gYW5cbiAgICogYWRkaXRpb25hbCBjb3B5IG9mIHRoZSBhcHBsaWNhdGlvbiBpcyBjcmVhdGVkIHVuZGVyIHRoaXMgbG9jYWxlIGp1c3Qgd2l0aCB0aGUgYCRsb2NhbGl6ZWAgY2FsbHNcbiAgICogc3RyaXBwZWQgb3V0LlxuICAgKi9cbiAgdHJhbnNsYXRlKFxuICAgICAgZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzLCBzb3VyY2VSb290OiBBYnNvbHV0ZUZzUGF0aCwgcmVsYXRpdmVGaWxlUGF0aDogUGF0aFNlZ21lbnQsXG4gICAgICBjb250ZW50czogQnVmZmVyLCBvdXRwdXRQYXRoRm46IE91dHB1dFBhdGhGbiwgdHJhbnNsYXRpb25zOiBUcmFuc2xhdGlvbkJ1bmRsZVtdLFxuICAgICAgc291cmNlTG9jYWxlPzogc3RyaW5nKTogdm9pZDtcbn1cblxuLyoqXG4gKiBUcmFuc2xhdGUgZWFjaCBmaWxlIChlLmcuIHNvdXJjZSBmaWxlIG9yIHN0YXRpYyBhc3NldCkgdXNpbmcgdGhlIGdpdmVuIGBUcmFuc2xhdGlvbkhhbmRsZXJgcy5cbiAqIFRoZSBmaWxlIHdpbGwgYmUgdHJhbnNsYXRlZCBieSB0aGUgZmlyc3QgaGFuZGxlciB0aGF0IHJldHVybnMgdHJ1ZSBmb3IgYGNhblRyYW5zbGF0ZSgpYC5cbiAqL1xuZXhwb3J0IGNsYXNzIFRyYW5zbGF0b3Ige1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgZnM6IEZpbGVTeXN0ZW0sIHByaXZhdGUgcmVzb3VyY2VIYW5kbGVyczogVHJhbnNsYXRpb25IYW5kbGVyW10sXG4gICAgICBwcml2YXRlIGRpYWdub3N0aWNzOiBEaWFnbm9zdGljcykge31cblxuICB0cmFuc2xhdGVGaWxlcyhcbiAgICAgIGlucHV0UGF0aHM6IFBhdGhTZWdtZW50W10sIHJvb3RQYXRoOiBBYnNvbHV0ZUZzUGF0aCwgb3V0cHV0UGF0aEZuOiBPdXRwdXRQYXRoRm4sXG4gICAgICB0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9uQnVuZGxlW10sIHNvdXJjZUxvY2FsZT86IHN0cmluZyk6IHZvaWQge1xuICAgIGlucHV0UGF0aHMuZm9yRWFjaChpbnB1dFBhdGggPT4ge1xuICAgICAgY29uc3QgYWJzSW5wdXRQYXRoID0gdGhpcy5mcy5yZXNvbHZlKHJvb3RQYXRoLCBpbnB1dFBhdGgpO1xuICAgICAgY29uc3QgY29udGVudHMgPSB0aGlzLmZzLnJlYWRGaWxlQnVmZmVyKGFic0lucHV0UGF0aCk7XG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSB0aGlzLmZzLnJlbGF0aXZlKHJvb3RQYXRoLCBhYnNJbnB1dFBhdGgpO1xuICAgICAgZm9yIChjb25zdCByZXNvdXJjZUhhbmRsZXIgb2YgdGhpcy5yZXNvdXJjZUhhbmRsZXJzKSB7XG4gICAgICAgIGlmIChyZXNvdXJjZUhhbmRsZXIuY2FuVHJhbnNsYXRlKHJlbGF0aXZlUGF0aCwgY29udGVudHMpKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc291cmNlSGFuZGxlci50cmFuc2xhdGUoXG4gICAgICAgICAgICAgIHRoaXMuZGlhZ25vc3RpY3MsIHJvb3RQYXRoLCByZWxhdGl2ZVBhdGgsIGNvbnRlbnRzLCBvdXRwdXRQYXRoRm4sIHRyYW5zbGF0aW9ucyxcbiAgICAgICAgICAgICAgc291cmNlTG9jYWxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5kaWFnbm9zdGljcy5lcnJvcihgVW5hYmxlIHRvIGhhbmRsZSByZXNvdXJjZSBmaWxlOiAke2lucHV0UGF0aH1gKTtcbiAgICB9KTtcbiAgfVxufVxuIl19
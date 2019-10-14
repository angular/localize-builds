(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translator", ["require", "exports", "tslib", "path", "@angular/localize/src/tools/src/file_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var path_1 = require("path");
    var file_utils_1 = require("@angular/localize/src/tools/src/file_utils");
    /**
     * Translate each file (e.g. source file or static asset) using the given `TranslationHandler`s.
     * The file will be translated by the first handler that returns true for `canTranslate()`.
     */
    var Translator = /** @class */ (function () {
        function Translator(resourceHandlers, diagnostics) {
            this.resourceHandlers = resourceHandlers;
            this.diagnostics = diagnostics;
        }
        Translator.prototype.translateFiles = function (inputPaths, rootPath, outputPathFn, translations, sourceLocale) {
            var _this = this;
            inputPaths.forEach(function (inputPath) {
                var e_1, _a;
                var contents = file_utils_1.FileUtils.readFileBuffer(inputPath);
                var relativePath = path_1.relative(rootPath, inputPath);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3RyYW5zbGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBUUEsNkJBQThCO0lBRzlCLHlFQUF3QztJQW1EeEM7OztPQUdHO0lBQ0g7UUFDRSxvQkFBb0IsZ0JBQXNDLEVBQVUsV0FBd0I7WUFBeEUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFzQjtZQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQUcsQ0FBQztRQUVoRyxtQ0FBYyxHQUFkLFVBQ0ksVUFBb0IsRUFBRSxRQUFnQixFQUFFLFlBQTBCLEVBQ2xFLFlBQWlDLEVBQUUsWUFBcUI7WUFGNUQsaUJBZUM7WUFaQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUEsU0FBUzs7Z0JBQzFCLElBQU0sUUFBUSxHQUFHLHNCQUFTLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNyRCxJQUFNLFlBQVksR0FBRyxlQUFRLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDOztvQkFDbkQsS0FBOEIsSUFBQSxLQUFBLGlCQUFBLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQSxnQkFBQSw0QkFBRTt3QkFBaEQsSUFBTSxlQUFlLFdBQUE7d0JBQ3hCLElBQUksZUFBZSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLEVBQUU7NEJBQ3hELE9BQU8sZUFBZSxDQUFDLFNBQVMsQ0FDNUIsS0FBSSxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUM5RSxZQUFZLENBQUMsQ0FBQzt5QkFDbkI7cUJBQ0Y7Ozs7Ozs7OztnQkFDRCxLQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxxQ0FBbUMsU0FBVyxDQUFDLENBQUM7WUFDekUsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQ0gsaUJBQUM7SUFBRCxDQUFDLEFBbkJELElBbUJDO0lBbkJZLGdDQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHvJtU1lc3NhZ2VJZCwgybVQYXJzZWRUcmFuc2xhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuaW1wb3J0IHtyZWxhdGl2ZX0gZnJvbSAncGF0aCc7XG5cbmltcG9ydCB7RGlhZ25vc3RpY3N9IGZyb20gJy4uL2RpYWdub3N0aWNzJztcbmltcG9ydCB7RmlsZVV0aWxzfSBmcm9tICcuLi9maWxlX3V0aWxzJztcblxuaW1wb3J0IHtPdXRwdXRQYXRoRm59IGZyb20gJy4vb3V0cHV0X3BhdGgnO1xuXG5cblxuLyoqXG4gKiBBbiBvYmplY3QgdGhhdCBob2xkcyB0cmFuc2xhdGlvbnMgdGhhdCBoYXZlIGJlZW4gbG9hZGVkXG4gKiBmcm9tIGEgdHJhbnNsYXRpb24gZmlsZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUcmFuc2xhdGlvbkJ1bmRsZSB7XG4gIGxvY2FsZTogc3RyaW5nO1xuICB0cmFuc2xhdGlvbnM6IFJlY29yZDzJtU1lc3NhZ2VJZCwgybVQYXJzZWRUcmFuc2xhdGlvbj47XG59XG5cbi8qKlxuICogSW1wbGVtZW50IHRoaXMgaW50ZXJmYWNlIHRvIHByb3ZpZGUgYSBjbGFzcyB0aGF0IGNhbiBoYW5kbGUgdHJhbnNsYXRpb24gZm9yIHRoZSBnaXZlbiByZXNvdXJjZSBpblxuICogYW4gYXBwcm9wcmlhdGUgbWFubmVyLlxuICpcbiAqIEZvciBleGFtcGxlLCBzb3VyY2UgY29kZSBmaWxlcyB3aWxsIG5lZWQgdG8gYmUgdHJhbnNmb3JtZWQgaWYgdGhleSBjb250YWluIGAkbG9jYWxpemVgIHRhZ2dlZFxuICogdGVtcGxhdGUgc3RyaW5ncywgd2hpbGUgbW9zdCBzdGF0aWMgYXNzZXRzIHdpbGwganVzdCBuZWVkIHRvIGJlIGNvcGllZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUcmFuc2xhdGlvbkhhbmRsZXIge1xuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBmaWxlIGNhbiBiZSB0cmFuc2xhdGVkIGJ5IHRoaXMgaGFuZGxlci5cbiAgICpcbiAgICogQHBhcmFtIHJlbGF0aXZlRmlsZVBhdGggQSByZWxhdGl2ZSBwYXRoIGZyb20gdGhlIHNvdXJjZVJvb3QgdG8gdGhlIHJlc291cmNlIGZpbGUgdG8gaGFuZGxlLlxuICAgKiBAcGFyYW0gY29udGVudHMgVGhlIGNvbnRlbnRzIG9mIHRoZSBmaWxlIHRvIGhhbmRsZS5cbiAgICovXG4gIGNhblRyYW5zbGF0ZShyZWxhdGl2ZUZpbGVQYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBCdWZmZXIpOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUcmFuc2xhdGUgdGhlIGZpbGUgYXQgYHJlbGF0aXZlRmlsZVBhdGhgIGNvbnRhaW5pbmcgYGNvbnRlbnRzYCwgdXNpbmcgdGhlIGdpdmVuIGB0cmFuc2xhdGlvbnNgLFxuICAgKiBhbmQgd3JpdGUgdGhlIHRyYW5zbGF0ZWQgY29udGVudCB0byB0aGUgcGF0aCBjb21wdXRlZCBieSBjYWxsaW5nIGBvdXRwdXRQYXRoRm4oKWAuXG4gICAqXG4gICAqIEBwYXJhbSBkaWFnbm9zdGljcyBBbiBvYmplY3QgZm9yIGNvbGxlY3RpbmcgdHJhbnNsYXRpb24gZGlhZ25vc3RpYyBtZXNzYWdlcy5cbiAgICogQHBhcmFtIHNvdXJjZVJvb3QgQW4gYWJzb2x1dGUgcGF0aCB0byB0aGUgcm9vdCBvZiB0aGUgZmlsZXMgYmVpbmcgdHJhbnNsYXRlZC5cbiAgICogQHBhcmFtIHJlbGF0aXZlRmlsZVBhdGggQSByZWxhdGl2ZSBwYXRoIGZyb20gdGhlIHNvdXJjZVJvb3QgdG8gdGhlIGZpbGUgdG8gdHJhbnNsYXRlLlxuICAgKiBAcGFyYW0gY29udGVudHMgVGhlIGNvbnRlbnRzIG9mIHRoZSBmaWxlIHRvIHRyYW5zbGF0ZS5cbiAgICogQHBhcmFtIG91dHB1dFBhdGhGbiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBhYnNvbHV0ZSBwYXRoIHdoZXJlIHRoZSBvdXRwdXQgZmlsZSBzaG91bGQgYmVcbiAgICogd3JpdHRlbi5cbiAgICogQHBhcmFtIHRyYW5zbGF0aW9ucyBBIGNvbGxlY3Rpb24gb2YgdHJhbnNsYXRpb25zIHRvIGFwcGx5IHRvIHRoaXMgZmlsZS5cbiAgICogQHBhcmFtIHNvdXJjZUxvY2FsZSBUaGUgbG9jYWxlIG9mIHRoZSBvcmlnaW5hbCBhcHBsaWNhdGlvbiBzb3VyY2UuIElmIHByb3ZpZGVkIHRoZW4gYW5cbiAgICogYWRkaXRpb25hbCBjb3B5IG9mIHRoZSBhcHBsaWNhdGlvbiBpcyBjcmVhdGVkIHVuZGVyIHRoaXMgbG9jYWxlIGp1c3Qgd2l0aCB0aGUgYCRsb2NhbGl6ZWAgY2FsbHNcbiAgICogc3RyaXBwZWQgb3V0LlxuICAgKi9cbiAgdHJhbnNsYXRlKFxuICAgICAgZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzLCBzb3VyY2VSb290OiBzdHJpbmcsIHJlbGF0aXZlRmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IEJ1ZmZlcixcbiAgICAgIG91dHB1dFBhdGhGbjogT3V0cHV0UGF0aEZuLCB0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9uQnVuZGxlW10sIHNvdXJjZUxvY2FsZT86IHN0cmluZyk6IHZvaWQ7XG59XG5cbi8qKlxuICogVHJhbnNsYXRlIGVhY2ggZmlsZSAoZS5nLiBzb3VyY2UgZmlsZSBvciBzdGF0aWMgYXNzZXQpIHVzaW5nIHRoZSBnaXZlbiBgVHJhbnNsYXRpb25IYW5kbGVyYHMuXG4gKiBUaGUgZmlsZSB3aWxsIGJlIHRyYW5zbGF0ZWQgYnkgdGhlIGZpcnN0IGhhbmRsZXIgdGhhdCByZXR1cm5zIHRydWUgZm9yIGBjYW5UcmFuc2xhdGUoKWAuXG4gKi9cbmV4cG9ydCBjbGFzcyBUcmFuc2xhdG9yIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZXNvdXJjZUhhbmRsZXJzOiBUcmFuc2xhdGlvbkhhbmRsZXJbXSwgcHJpdmF0ZSBkaWFnbm9zdGljczogRGlhZ25vc3RpY3MpIHt9XG5cbiAgdHJhbnNsYXRlRmlsZXMoXG4gICAgICBpbnB1dFBhdGhzOiBzdHJpbmdbXSwgcm9vdFBhdGg6IHN0cmluZywgb3V0cHV0UGF0aEZuOiBPdXRwdXRQYXRoRm4sXG4gICAgICB0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9uQnVuZGxlW10sIHNvdXJjZUxvY2FsZT86IHN0cmluZyk6IHZvaWQge1xuICAgIGlucHV0UGF0aHMuZm9yRWFjaChpbnB1dFBhdGggPT4ge1xuICAgICAgY29uc3QgY29udGVudHMgPSBGaWxlVXRpbHMucmVhZEZpbGVCdWZmZXIoaW5wdXRQYXRoKTtcbiAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlKHJvb3RQYXRoLCBpbnB1dFBhdGgpO1xuICAgICAgZm9yIChjb25zdCByZXNvdXJjZUhhbmRsZXIgb2YgdGhpcy5yZXNvdXJjZUhhbmRsZXJzKSB7XG4gICAgICAgIGlmIChyZXNvdXJjZUhhbmRsZXIuY2FuVHJhbnNsYXRlKHJlbGF0aXZlUGF0aCwgY29udGVudHMpKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc291cmNlSGFuZGxlci50cmFuc2xhdGUoXG4gICAgICAgICAgICAgIHRoaXMuZGlhZ25vc3RpY3MsIHJvb3RQYXRoLCByZWxhdGl2ZVBhdGgsIGNvbnRlbnRzLCBvdXRwdXRQYXRoRm4sIHRyYW5zbGF0aW9ucyxcbiAgICAgICAgICAgICAgc291cmNlTG9jYWxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5kaWFnbm9zdGljcy5lcnJvcihgVW5hYmxlIHRvIGhhbmRsZSByZXNvdXJjZSBmaWxlOiAke2lucHV0UGF0aH1gKTtcbiAgICB9KTtcbiAgfVxufVxuIl19
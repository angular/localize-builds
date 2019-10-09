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
        Translator.prototype.translateFiles = function (inputPaths, rootPath, outputPathFn, translations) {
            var _this = this;
            inputPaths.forEach(function (inputPath) {
                var e_1, _a;
                var contents = file_utils_1.FileUtils.readFileBuffer(inputPath);
                var relativePath = path_1.relative(rootPath, inputPath);
                try {
                    for (var _b = tslib_1.__values(_this.resourceHandlers), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var resourceHandler = _c.value;
                        if (resourceHandler.canTranslate(relativePath, contents)) {
                            return resourceHandler.translate(_this.diagnostics, rootPath, relativePath, contents, outputPathFn, translations);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3RyYW5zbGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBUUEsNkJBQThCO0lBRzlCLHlFQUF3QztJQWdEeEM7OztPQUdHO0lBQ0g7UUFDRSxvQkFBb0IsZ0JBQXNDLEVBQVUsV0FBd0I7WUFBeEUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFzQjtZQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQUcsQ0FBQztRQUVoRyxtQ0FBYyxHQUFkLFVBQ0ksVUFBb0IsRUFBRSxRQUFnQixFQUFFLFlBQTBCLEVBQ2xFLFlBQWlDO1lBRnJDLGlCQWNDO1lBWEMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFBLFNBQVM7O2dCQUMxQixJQUFNLFFBQVEsR0FBRyxzQkFBUyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDckQsSUFBTSxZQUFZLEdBQUcsZUFBUSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQzs7b0JBQ25ELEtBQThCLElBQUEsS0FBQSxpQkFBQSxLQUFJLENBQUMsZ0JBQWdCLENBQUEsZ0JBQUEsNEJBQUU7d0JBQWhELElBQU0sZUFBZSxXQUFBO3dCQUN4QixJQUFJLGVBQWUsQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxFQUFFOzRCQUN4RCxPQUFPLGVBQWUsQ0FBQyxTQUFTLENBQzVCLEtBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDO3lCQUNyRjtxQkFDRjs7Ozs7Ozs7O2dCQUNELEtBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLHFDQUFtQyxTQUFXLENBQUMsQ0FBQztZQUN6RSxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFDSCxpQkFBQztJQUFELENBQUMsQUFsQkQsSUFrQkM7SUFsQlksZ0NBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge8m1TWVzc2FnZUlkLCDJtVBhcnNlZFRyYW5zbGF0aW9ufSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5pbXBvcnQge3JlbGF0aXZlfSBmcm9tICdwYXRoJztcblxuaW1wb3J0IHtEaWFnbm9zdGljc30gZnJvbSAnLi4vZGlhZ25vc3RpY3MnO1xuaW1wb3J0IHtGaWxlVXRpbHN9IGZyb20gJy4uL2ZpbGVfdXRpbHMnO1xuXG5pbXBvcnQge091dHB1dFBhdGhGbn0gZnJvbSAnLi9vdXRwdXRfcGF0aCc7XG5cblxuXG4vKipcbiAqIEFuIG9iamVjdCB0aGF0IGhvbGRzIHRyYW5zbGF0aW9ucyB0aGF0IGhhdmUgYmVlbiBsb2FkZWRcbiAqIGZyb20gYSB0cmFuc2xhdGlvbiBmaWxlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zbGF0aW9uQnVuZGxlIHtcbiAgbG9jYWxlOiBzdHJpbmc7XG4gIHRyYW5zbGF0aW9uczogUmVjb3JkPMm1TWVzc2FnZUlkLCDJtVBhcnNlZFRyYW5zbGF0aW9uPjtcbn1cblxuLyoqXG4gKiBJbXBsZW1lbnQgdGhpcyBpbnRlcmZhY2UgdG8gcHJvdmlkZSBhIGNsYXNzIHRoYXQgY2FuIGhhbmRsZSB0cmFuc2xhdGlvbiBmb3IgdGhlIGdpdmVuIHJlc291cmNlIGluXG4gKiBhbiBhcHByb3ByaWF0ZSBtYW5uZXIuXG4gKlxuICogRm9yIGV4YW1wbGUsIHNvdXJjZSBjb2RlIGZpbGVzIHdpbGwgbmVlZCB0byBiZSB0cmFuc2Zvcm1lZCBpZiB0aGV5IGNvbnRhaW4gYCRsb2NhbGl6ZWAgdGFnZ2VkXG4gKiB0ZW1wbGF0ZSBzdHJpbmdzLCB3aGlsZSBtb3N0IHN0YXRpYyBhc3NldHMgd2lsbCBqdXN0IG5lZWQgdG8gYmUgY29waWVkLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zbGF0aW9uSGFuZGxlciB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIGZpbGUgY2FuIGJlIHRyYW5zbGF0ZWQgYnkgdGhpcyBoYW5kbGVyLlxuICAgKlxuICAgKiBAcGFyYW0gcmVsYXRpdmVGaWxlUGF0aCBBIHJlbGF0aXZlIHBhdGggZnJvbSB0aGUgc291cmNlUm9vdCB0byB0aGUgcmVzb3VyY2UgZmlsZSB0byBoYW5kbGUuXG4gICAqIEBwYXJhbSBjb250ZW50cyBUaGUgY29udGVudHMgb2YgdGhlIGZpbGUgdG8gaGFuZGxlLlxuICAgKi9cbiAgY2FuVHJhbnNsYXRlKHJlbGF0aXZlRmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IEJ1ZmZlcik6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRyYW5zbGF0ZSB0aGUgZmlsZSBhdCBgcmVsYXRpdmVGaWxlUGF0aGAgY29udGFpbmluZyBgY29udGVudHNgLCB1c2luZyB0aGUgZ2l2ZW4gYHRyYW5zbGF0aW9uc2AsXG4gICAqIGFuZCB3cml0ZSB0aGUgdHJhbnNsYXRlZCBjb250ZW50IHRvIHRoZSBwYXRoIGNvbXB1dGVkIGJ5IGNhbGxpbmcgYG91dHB1dFBhdGhGbigpYC5cbiAgICpcbiAgICogQHBhcmFtIGRpYWdub3N0aWNzIEFuIG9iamVjdCBmb3IgY29sbGVjdGluZyB0cmFuc2xhdGlvbiBkaWFnbm9zdGljIG1lc3NhZ2VzLlxuICAgKiBAcGFyYW0gc291cmNlUm9vdCBBbiBhYnNvbHV0ZSBwYXRoIHRvIHRoZSByb290IG9mIHRoZSBmaWxlcyBiZWluZyB0cmFuc2xhdGVkLlxuICAgKiBAcGFyYW0gcmVsYXRpdmVGaWxlUGF0aCBBIHJlbGF0aXZlIHBhdGggZnJvbSB0aGUgc291cmNlUm9vdCB0byB0aGUgZmlsZSB0byB0cmFuc2xhdGUuXG4gICAqIEBwYXJhbSBjb250ZW50cyBUaGUgY29udGVudHMgb2YgdGhlIGZpbGUgdG8gdHJhbnNsYXRlLlxuICAgKiBAcGFyYW0gb3V0cHV0UGF0aEZuIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGFic29sdXRlIHBhdGggd2hlcmUgdGhlIG91dHB1dCBmaWxlIHNob3VsZCBiZVxuICAgKiB3cml0dGVuLlxuICAgKiBAcGFyYW0gdHJhbnNsYXRpb25zIEEgY29sbGVjdGlvbiBvZiB0cmFuc2xhdGlvbnMgdG8gYXBwbHkgdG8gdGhpcyBmaWxlLlxuICAgKi9cbiAgdHJhbnNsYXRlKFxuICAgICAgZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzLCBzb3VyY2VSb290OiBzdHJpbmcsIHJlbGF0aXZlRmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IEJ1ZmZlcixcbiAgICAgIG91dHB1dFBhdGhGbjogT3V0cHV0UGF0aEZuLCB0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9uQnVuZGxlW10pOiB2b2lkO1xufVxuXG4vKipcbiAqIFRyYW5zbGF0ZSBlYWNoIGZpbGUgKGUuZy4gc291cmNlIGZpbGUgb3Igc3RhdGljIGFzc2V0KSB1c2luZyB0aGUgZ2l2ZW4gYFRyYW5zbGF0aW9uSGFuZGxlcmBzLlxuICogVGhlIGZpbGUgd2lsbCBiZSB0cmFuc2xhdGVkIGJ5IHRoZSBmaXJzdCBoYW5kbGVyIHRoYXQgcmV0dXJucyB0cnVlIGZvciBgY2FuVHJhbnNsYXRlKClgLlxuICovXG5leHBvcnQgY2xhc3MgVHJhbnNsYXRvciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVzb3VyY2VIYW5kbGVyczogVHJhbnNsYXRpb25IYW5kbGVyW10sIHByaXZhdGUgZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzKSB7fVxuXG4gIHRyYW5zbGF0ZUZpbGVzKFxuICAgICAgaW5wdXRQYXRoczogc3RyaW5nW10sIHJvb3RQYXRoOiBzdHJpbmcsIG91dHB1dFBhdGhGbjogT3V0cHV0UGF0aEZuLFxuICAgICAgdHJhbnNsYXRpb25zOiBUcmFuc2xhdGlvbkJ1bmRsZVtdKTogdm9pZCB7XG4gICAgaW5wdXRQYXRocy5mb3JFYWNoKGlucHV0UGF0aCA9PiB7XG4gICAgICBjb25zdCBjb250ZW50cyA9IEZpbGVVdGlscy5yZWFkRmlsZUJ1ZmZlcihpbnB1dFBhdGgpO1xuICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gcmVsYXRpdmUocm9vdFBhdGgsIGlucHV0UGF0aCk7XG4gICAgICBmb3IgKGNvbnN0IHJlc291cmNlSGFuZGxlciBvZiB0aGlzLnJlc291cmNlSGFuZGxlcnMpIHtcbiAgICAgICAgaWYgKHJlc291cmNlSGFuZGxlci5jYW5UcmFuc2xhdGUocmVsYXRpdmVQYXRoLCBjb250ZW50cykpIHtcbiAgICAgICAgICByZXR1cm4gcmVzb3VyY2VIYW5kbGVyLnRyYW5zbGF0ZShcbiAgICAgICAgICAgICAgdGhpcy5kaWFnbm9zdGljcywgcm9vdFBhdGgsIHJlbGF0aXZlUGF0aCwgY29udGVudHMsIG91dHB1dFBhdGhGbiwgdHJhbnNsYXRpb25zKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5kaWFnbm9zdGljcy5lcnJvcihgVW5hYmxlIHRvIGhhbmRsZSByZXNvdXJjZSBmaWxlOiAke2lucHV0UGF0aH1gKTtcbiAgICB9KTtcbiAgfVxufVxuIl19
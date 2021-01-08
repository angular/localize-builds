(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/source_files/es5_translate_plugin", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/localize/src/tools/src/source_file_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeEs5TranslatePlugin = void 0;
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var source_file_utils_1 = require("@angular/localize/src/tools/src/source_file_utils");
    /**
     * Create a Babel plugin that can be used to do compile-time translation of `$localize` tagged
     * messages.
     *
     * @publicApi used by CLI
     */
    function makeEs5TranslatePlugin(diagnostics, translations, _a, fs) {
        var _b = _a === void 0 ? {} : _a, _c = _b.missingTranslation, missingTranslation = _c === void 0 ? 'error' : _c, _d = _b.localizeName, localizeName = _d === void 0 ? '$localize' : _d;
        if (fs === void 0) { fs = file_system_1.getFileSystem(); }
        return {
            visitor: {
                CallExpression: function (callPath) {
                    try {
                        var calleePath = callPath.get('callee');
                        if (source_file_utils_1.isLocalize(calleePath, localizeName)) {
                            var _a = tslib_1.__read(source_file_utils_1.unwrapMessagePartsFromLocalizeCall(callPath, fs), 1), messageParts = _a[0];
                            var _b = tslib_1.__read(source_file_utils_1.unwrapSubstitutionsFromLocalizeCall(callPath, fs), 1), expressions = _b[0];
                            var translated = source_file_utils_1.translate(diagnostics, translations, messageParts, expressions, missingTranslation);
                            callPath.replaceWith(source_file_utils_1.buildLocalizeReplacement(translated[0], translated[1]));
                        }
                    }
                    catch (e) {
                        if (source_file_utils_1.isBabelParseError(e)) {
                            diagnostics.error(source_file_utils_1.buildCodeFrameError(callPath, e));
                        }
                        else {
                            throw e;
                        }
                    }
                }
            }
        };
    }
    exports.makeEs5TranslatePlugin = makeEs5TranslatePlugin;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXM1X3RyYW5zbGF0ZV9wbHVnaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS9zb3VyY2VfZmlsZXMvZXM1X3RyYW5zbGF0ZV9wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDJFQUE0RjtJQU01Rix1RkFBaU87SUFFak87Ozs7O09BS0c7SUFDSCxTQUFnQixzQkFBc0IsQ0FDbEMsV0FBd0IsRUFBRSxZQUFnRCxFQUMxRSxFQUF1RixFQUN2RixFQUFzQztZQUR0QyxxQkFBcUYsRUFBRSxLQUFBLEVBQXRGLDBCQUE0QixFQUE1QixrQkFBa0IsbUJBQUcsT0FBTyxLQUFBLEVBQUUsb0JBQTBCLEVBQTFCLFlBQVksbUJBQUcsV0FBVyxLQUFBO1FBQ3pELG1CQUFBLEVBQUEsS0FBdUIsMkJBQWEsRUFBRTtRQUN4QyxPQUFPO1lBQ0wsT0FBTyxFQUFFO2dCQUNQLGNBQWMsRUFBZCxVQUFlLFFBQWtDO29CQUMvQyxJQUFJO3dCQUNGLElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQzFDLElBQUksOEJBQVUsQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLEVBQUU7NEJBQ2xDLElBQUEsS0FBQSxlQUFpQixzREFBa0MsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLElBQUEsRUFBaEUsWUFBWSxRQUFvRCxDQUFDOzRCQUNsRSxJQUFBLEtBQUEsZUFBZ0IsdURBQW1DLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxJQUFBLEVBQWhFLFdBQVcsUUFBcUQsQ0FBQzs0QkFDeEUsSUFBTSxVQUFVLEdBQ1osNkJBQVMsQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsa0JBQWtCLENBQUMsQ0FBQzs0QkFDeEYsUUFBUSxDQUFDLFdBQVcsQ0FBQyw0Q0FBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDOUU7cUJBQ0Y7b0JBQUMsT0FBTyxDQUFDLEVBQUU7d0JBQ1YsSUFBSSxxQ0FBaUIsQ0FBQyxDQUFDLENBQUMsRUFBRTs0QkFDeEIsV0FBVyxDQUFDLEtBQUssQ0FBQyx1Q0FBbUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDckQ7NkJBQU07NEJBQ0wsTUFBTSxDQUFDLENBQUM7eUJBQ1Q7cUJBQ0Y7Z0JBQ0gsQ0FBQzthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUExQkQsd0RBMEJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge2dldEZpbGVTeXN0ZW0sIFBhdGhNYW5pcHVsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHvJtVBhcnNlZFRyYW5zbGF0aW9ufSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5pbXBvcnQge05vZGVQYXRoLCBQbHVnaW5PYmp9IGZyb20gJ0BiYWJlbC9jb3JlJztcbmltcG9ydCB7Q2FsbEV4cHJlc3Npb259IGZyb20gJ0BiYWJlbC90eXBlcyc7XG5cbmltcG9ydCB7RGlhZ25vc3RpY3N9IGZyb20gJy4uLy4uL2RpYWdub3N0aWNzJztcbmltcG9ydCB7YnVpbGRDb2RlRnJhbWVFcnJvciwgYnVpbGRMb2NhbGl6ZVJlcGxhY2VtZW50LCBpc0JhYmVsUGFyc2VFcnJvciwgaXNMb2NhbGl6ZSwgdHJhbnNsYXRlLCBUcmFuc2xhdGVQbHVnaW5PcHRpb25zLCB1bndyYXBNZXNzYWdlUGFydHNGcm9tTG9jYWxpemVDYWxsLCB1bndyYXBTdWJzdGl0dXRpb25zRnJvbUxvY2FsaXplQ2FsbH0gZnJvbSAnLi4vLi4vc291cmNlX2ZpbGVfdXRpbHMnO1xuXG4vKipcbiAqIENyZWF0ZSBhIEJhYmVsIHBsdWdpbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGRvIGNvbXBpbGUtdGltZSB0cmFuc2xhdGlvbiBvZiBgJGxvY2FsaXplYCB0YWdnZWRcbiAqIG1lc3NhZ2VzLlxuICpcbiAqIEBwdWJsaWNBcGkgdXNlZCBieSBDTElcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1ha2VFczVUcmFuc2xhdGVQbHVnaW4oXG4gICAgZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzLCB0cmFuc2xhdGlvbnM6IFJlY29yZDxzdHJpbmcsIMm1UGFyc2VkVHJhbnNsYXRpb24+LFxuICAgIHttaXNzaW5nVHJhbnNsYXRpb24gPSAnZXJyb3InLCBsb2NhbGl6ZU5hbWUgPSAnJGxvY2FsaXplJ306IFRyYW5zbGF0ZVBsdWdpbk9wdGlvbnMgPSB7fSxcbiAgICBmczogUGF0aE1hbmlwdWxhdGlvbiA9IGdldEZpbGVTeXN0ZW0oKSk6IFBsdWdpbk9iaiB7XG4gIHJldHVybiB7XG4gICAgdmlzaXRvcjoge1xuICAgICAgQ2FsbEV4cHJlc3Npb24oY2FsbFBhdGg6IE5vZGVQYXRoPENhbGxFeHByZXNzaW9uPikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGNhbGxlZVBhdGggPSBjYWxsUGF0aC5nZXQoJ2NhbGxlZScpO1xuICAgICAgICAgIGlmIChpc0xvY2FsaXplKGNhbGxlZVBhdGgsIGxvY2FsaXplTmFtZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IFttZXNzYWdlUGFydHNdID0gdW53cmFwTWVzc2FnZVBhcnRzRnJvbUxvY2FsaXplQ2FsbChjYWxsUGF0aCwgZnMpO1xuICAgICAgICAgICAgY29uc3QgW2V4cHJlc3Npb25zXSA9IHVud3JhcFN1YnN0aXR1dGlvbnNGcm9tTG9jYWxpemVDYWxsKGNhbGxQYXRoLCBmcyk7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2xhdGVkID1cbiAgICAgICAgICAgICAgICB0cmFuc2xhdGUoZGlhZ25vc3RpY3MsIHRyYW5zbGF0aW9ucywgbWVzc2FnZVBhcnRzLCBleHByZXNzaW9ucywgbWlzc2luZ1RyYW5zbGF0aW9uKTtcbiAgICAgICAgICAgIGNhbGxQYXRoLnJlcGxhY2VXaXRoKGJ1aWxkTG9jYWxpemVSZXBsYWNlbWVudCh0cmFuc2xhdGVkWzBdLCB0cmFuc2xhdGVkWzFdKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgaWYgKGlzQmFiZWxQYXJzZUVycm9yKGUpKSB7XG4gICAgICAgICAgICBkaWFnbm9zdGljcy5lcnJvcihidWlsZENvZGVGcmFtZUVycm9yKGNhbGxQYXRoLCBlKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuIl19
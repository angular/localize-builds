(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/source_files/es5_translate_plugin", ["require", "exports", "tslib", "@angular/localize/src/tools/src/source_file_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeEs5TranslatePlugin = void 0;
    var tslib_1 = require("tslib");
    var source_file_utils_1 = require("@angular/localize/src/tools/src/source_file_utils");
    function makeEs5TranslatePlugin(diagnostics, translations, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.missingTranslation, missingTranslation = _c === void 0 ? 'error' : _c, _d = _b.localizeName, localizeName = _d === void 0 ? '$localize' : _d;
        return {
            visitor: {
                CallExpression: function (callPath) {
                    try {
                        var calleePath = callPath.get('callee');
                        if (source_file_utils_1.isLocalize(calleePath, localizeName)) {
                            var _a = tslib_1.__read(source_file_utils_1.unwrapMessagePartsFromLocalizeCall(callPath), 1), messageParts = _a[0];
                            var _b = tslib_1.__read(source_file_utils_1.unwrapSubstitutionsFromLocalizeCall(callPath), 1), expressions = _b[0];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXM1X3RyYW5zbGF0ZV9wbHVnaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS9zb3VyY2VfZmlsZXMvZXM1X3RyYW5zbGF0ZV9wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQWFBLHVGQUFpTztJQUVqTyxTQUFnQixzQkFBc0IsQ0FDbEMsV0FBd0IsRUFBRSxZQUFnRCxFQUMxRSxFQUF1RjtZQUF2RixxQkFBcUYsRUFBRSxLQUFBLEVBQXRGLDBCQUE0QixFQUE1QixrQkFBa0IsbUJBQUcsT0FBTyxLQUFBLEVBQUUsb0JBQTBCLEVBQTFCLFlBQVksbUJBQUcsV0FBVyxLQUFBO1FBRTNELE9BQU87WUFDTCxPQUFPLEVBQUU7Z0JBQ1AsY0FBYyxFQUFkLFVBQWUsUUFBa0M7b0JBQy9DLElBQUk7d0JBQ0YsSUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDMUMsSUFBSSw4QkFBVSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsRUFBRTs0QkFDbEMsSUFBQSxLQUFBLGVBQWlCLHNEQUFrQyxDQUFDLFFBQVEsQ0FBQyxJQUFBLEVBQTVELFlBQVksUUFBZ0QsQ0FBQzs0QkFDOUQsSUFBQSxLQUFBLGVBQWdCLHVEQUFtQyxDQUFDLFFBQVEsQ0FBQyxJQUFBLEVBQTVELFdBQVcsUUFBaUQsQ0FBQzs0QkFDcEUsSUFBTSxVQUFVLEdBQ1osNkJBQVMsQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsa0JBQWtCLENBQUMsQ0FBQzs0QkFDeEYsUUFBUSxDQUFDLFdBQVcsQ0FBQyw0Q0FBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDOUU7cUJBQ0Y7b0JBQUMsT0FBTyxDQUFDLEVBQUU7d0JBQ1YsSUFBSSxxQ0FBaUIsQ0FBQyxDQUFDLENBQUMsRUFBRTs0QkFDeEIsV0FBVyxDQUFDLEtBQUssQ0FBQyx1Q0FBbUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDckQ7NkJBQU07NEJBQ0wsTUFBTSxDQUFDLENBQUM7eUJBQ1Q7cUJBQ0Y7Z0JBQ0gsQ0FBQzthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUExQkQsd0RBMEJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge8m1UGFyc2VkVHJhbnNsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcbmltcG9ydCB7Tm9kZVBhdGgsIFBsdWdpbk9ian0gZnJvbSAnQGJhYmVsL2NvcmUnO1xuaW1wb3J0IHtDYWxsRXhwcmVzc2lvbn0gZnJvbSAnQGJhYmVsL3R5cGVzJztcblxuaW1wb3J0IHtEaWFnbm9zdGljc30gZnJvbSAnLi4vLi4vZGlhZ25vc3RpY3MnO1xuXG5pbXBvcnQge2J1aWxkQ29kZUZyYW1lRXJyb3IsIGJ1aWxkTG9jYWxpemVSZXBsYWNlbWVudCwgaXNCYWJlbFBhcnNlRXJyb3IsIGlzTG9jYWxpemUsIHRyYW5zbGF0ZSwgVHJhbnNsYXRlUGx1Z2luT3B0aW9ucywgdW53cmFwTWVzc2FnZVBhcnRzRnJvbUxvY2FsaXplQ2FsbCwgdW53cmFwU3Vic3RpdHV0aW9uc0Zyb21Mb2NhbGl6ZUNhbGx9IGZyb20gJy4uLy4uL3NvdXJjZV9maWxlX3V0aWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VFczVUcmFuc2xhdGVQbHVnaW4oXG4gICAgZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzLCB0cmFuc2xhdGlvbnM6IFJlY29yZDxzdHJpbmcsIMm1UGFyc2VkVHJhbnNsYXRpb24+LFxuICAgIHttaXNzaW5nVHJhbnNsYXRpb24gPSAnZXJyb3InLCBsb2NhbGl6ZU5hbWUgPSAnJGxvY2FsaXplJ306IFRyYW5zbGF0ZVBsdWdpbk9wdGlvbnMgPSB7fSk6XG4gICAgUGx1Z2luT2JqIHtcbiAgcmV0dXJuIHtcbiAgICB2aXNpdG9yOiB7XG4gICAgICBDYWxsRXhwcmVzc2lvbihjYWxsUGF0aDogTm9kZVBhdGg8Q2FsbEV4cHJlc3Npb24+KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgY2FsbGVlUGF0aCA9IGNhbGxQYXRoLmdldCgnY2FsbGVlJyk7XG4gICAgICAgICAgaWYgKGlzTG9jYWxpemUoY2FsbGVlUGF0aCwgbG9jYWxpemVOYW1lKSkge1xuICAgICAgICAgICAgY29uc3QgW21lc3NhZ2VQYXJ0c10gPSB1bndyYXBNZXNzYWdlUGFydHNGcm9tTG9jYWxpemVDYWxsKGNhbGxQYXRoKTtcbiAgICAgICAgICAgIGNvbnN0IFtleHByZXNzaW9uc10gPSB1bndyYXBTdWJzdGl0dXRpb25zRnJvbUxvY2FsaXplQ2FsbChjYWxsUGF0aCk7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2xhdGVkID1cbiAgICAgICAgICAgICAgICB0cmFuc2xhdGUoZGlhZ25vc3RpY3MsIHRyYW5zbGF0aW9ucywgbWVzc2FnZVBhcnRzLCBleHByZXNzaW9ucywgbWlzc2luZ1RyYW5zbGF0aW9uKTtcbiAgICAgICAgICAgIGNhbGxQYXRoLnJlcGxhY2VXaXRoKGJ1aWxkTG9jYWxpemVSZXBsYWNlbWVudCh0cmFuc2xhdGVkWzBdLCB0cmFuc2xhdGVkWzFdKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgaWYgKGlzQmFiZWxQYXJzZUVycm9yKGUpKSB7XG4gICAgICAgICAgICBkaWFnbm9zdGljcy5lcnJvcihidWlsZENvZGVGcmFtZUVycm9yKGNhbGxQYXRoLCBlKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuIl19
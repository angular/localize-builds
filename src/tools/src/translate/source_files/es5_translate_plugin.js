(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/source_files/es5_translate_plugin", ["require", "exports", "@angular/localize/src/tools/src/source_file_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeEs5TranslatePlugin = void 0;
    var source_file_utils_1 = require("@angular/localize/src/tools/src/source_file_utils");
    function makeEs5TranslatePlugin(diagnostics, translations, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.missingTranslation, missingTranslation = _c === void 0 ? 'error' : _c, _d = _b.localizeName, localizeName = _d === void 0 ? '$localize' : _d;
        return {
            visitor: {
                CallExpression: function (callPath) {
                    try {
                        var calleePath = callPath.get('callee');
                        if (source_file_utils_1.isLocalize(calleePath, localizeName)) {
                            var messageParts = source_file_utils_1.unwrapMessagePartsFromLocalizeCall(callPath);
                            var expressions = source_file_utils_1.unwrapSubstitutionsFromLocalizeCall(callPath.node);
                            var translated = source_file_utils_1.translate(diagnostics, translations, messageParts, expressions, missingTranslation);
                            callPath.replaceWith(source_file_utils_1.buildLocalizeReplacement(translated[0], translated[1]));
                        }
                    }
                    catch (e) {
                        if (source_file_utils_1.isBabelParseError(e)) {
                            diagnostics.error(source_file_utils_1.buildCodeFrameError(callPath, e));
                        }
                    }
                }
            }
        };
    }
    exports.makeEs5TranslatePlugin = makeEs5TranslatePlugin;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXM1X3RyYW5zbGF0ZV9wbHVnaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS9zb3VyY2VfZmlsZXMvZXM1X3RyYW5zbGF0ZV9wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBYUEsdUZBQWlPO0lBRWpPLFNBQWdCLHNCQUFzQixDQUNsQyxXQUF3QixFQUFFLFlBQWdELEVBQzFFLEVBQXVGO1lBQXZGLHFCQUFxRixFQUFFLEtBQUEsRUFBdEYsMEJBQTRCLEVBQTVCLGtCQUFrQixtQkFBRyxPQUFPLEtBQUEsRUFBRSxvQkFBMEIsRUFBMUIsWUFBWSxtQkFBRyxXQUFXLEtBQUE7UUFFM0QsT0FBTztZQUNMLE9BQU8sRUFBRTtnQkFDUCxjQUFjLEVBQWQsVUFBZSxRQUFrQztvQkFDL0MsSUFBSTt3QkFDRixJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUMxQyxJQUFJLDhCQUFVLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxFQUFFOzRCQUN4QyxJQUFNLFlBQVksR0FBRyxzREFBa0MsQ0FBQyxRQUFRLENBQUMsQ0FBQzs0QkFDbEUsSUFBTSxXQUFXLEdBQUcsdURBQW1DLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUN2RSxJQUFNLFVBQVUsR0FDWiw2QkFBUyxDQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDOzRCQUN4RixRQUFRLENBQUMsV0FBVyxDQUFDLDRDQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUM5RTtxQkFDRjtvQkFBQyxPQUFPLENBQUMsRUFBRTt3QkFDVixJQUFJLHFDQUFpQixDQUFDLENBQUMsQ0FBQyxFQUFFOzRCQUN4QixXQUFXLENBQUMsS0FBSyxDQUFDLHVDQUFtQixDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUNyRDtxQkFDRjtnQkFDSCxDQUFDO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQztJQXhCRCx3REF3QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge8m1UGFyc2VkVHJhbnNsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcbmltcG9ydCB7Tm9kZVBhdGgsIFBsdWdpbk9ian0gZnJvbSAnQGJhYmVsL2NvcmUnO1xuaW1wb3J0IHtDYWxsRXhwcmVzc2lvbn0gZnJvbSAnQGJhYmVsL3R5cGVzJztcblxuaW1wb3J0IHtEaWFnbm9zdGljc30gZnJvbSAnLi4vLi4vZGlhZ25vc3RpY3MnO1xuXG5pbXBvcnQge2J1aWxkQ29kZUZyYW1lRXJyb3IsIGJ1aWxkTG9jYWxpemVSZXBsYWNlbWVudCwgaXNCYWJlbFBhcnNlRXJyb3IsIGlzTG9jYWxpemUsIHRyYW5zbGF0ZSwgVHJhbnNsYXRlUGx1Z2luT3B0aW9ucywgdW53cmFwTWVzc2FnZVBhcnRzRnJvbUxvY2FsaXplQ2FsbCwgdW53cmFwU3Vic3RpdHV0aW9uc0Zyb21Mb2NhbGl6ZUNhbGx9IGZyb20gJy4uLy4uL3NvdXJjZV9maWxlX3V0aWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VFczVUcmFuc2xhdGVQbHVnaW4oXG4gICAgZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzLCB0cmFuc2xhdGlvbnM6IFJlY29yZDxzdHJpbmcsIMm1UGFyc2VkVHJhbnNsYXRpb24+LFxuICAgIHttaXNzaW5nVHJhbnNsYXRpb24gPSAnZXJyb3InLCBsb2NhbGl6ZU5hbWUgPSAnJGxvY2FsaXplJ306IFRyYW5zbGF0ZVBsdWdpbk9wdGlvbnMgPSB7fSk6XG4gICAgUGx1Z2luT2JqIHtcbiAgcmV0dXJuIHtcbiAgICB2aXNpdG9yOiB7XG4gICAgICBDYWxsRXhwcmVzc2lvbihjYWxsUGF0aDogTm9kZVBhdGg8Q2FsbEV4cHJlc3Npb24+KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgY2FsbGVlUGF0aCA9IGNhbGxQYXRoLmdldCgnY2FsbGVlJyk7XG4gICAgICAgICAgaWYgKGlzTG9jYWxpemUoY2FsbGVlUGF0aCwgbG9jYWxpemVOYW1lKSkge1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZVBhcnRzID0gdW53cmFwTWVzc2FnZVBhcnRzRnJvbUxvY2FsaXplQ2FsbChjYWxsUGF0aCk7XG4gICAgICAgICAgICBjb25zdCBleHByZXNzaW9ucyA9IHVud3JhcFN1YnN0aXR1dGlvbnNGcm9tTG9jYWxpemVDYWxsKGNhbGxQYXRoLm5vZGUpO1xuICAgICAgICAgICAgY29uc3QgdHJhbnNsYXRlZCA9XG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKGRpYWdub3N0aWNzLCB0cmFuc2xhdGlvbnMsIG1lc3NhZ2VQYXJ0cywgZXhwcmVzc2lvbnMsIG1pc3NpbmdUcmFuc2xhdGlvbik7XG4gICAgICAgICAgICBjYWxsUGF0aC5yZXBsYWNlV2l0aChidWlsZExvY2FsaXplUmVwbGFjZW1lbnQodHJhbnNsYXRlZFswXSwgdHJhbnNsYXRlZFsxXSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGlmIChpc0JhYmVsUGFyc2VFcnJvcihlKSkge1xuICAgICAgICAgICAgZGlhZ25vc3RpY3MuZXJyb3IoYnVpbGRDb2RlRnJhbWVFcnJvcihjYWxsUGF0aCwgZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cbiJdfQ==
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/source_files/es2015_translate_plugin", ["require", "exports", "@angular/localize/src/tools/src/source_file_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var source_file_utils_1 = require("@angular/localize/src/tools/src/source_file_utils");
    function makeEs2015TranslatePlugin(diagnostics, translations, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.missingTranslation, missingTranslation = _c === void 0 ? 'error' : _c, _d = _b.localizeName, localizeName = _d === void 0 ? '$localize' : _d;
        return {
            visitor: {
                TaggedTemplateExpression: function (path) {
                    try {
                        var tag = path.get('tag');
                        if (source_file_utils_1.isLocalize(tag, localizeName)) {
                            var messageParts = source_file_utils_1.unwrapMessagePartsFromTemplateLiteral(path.node.quasi.quasis);
                            var translated = source_file_utils_1.translate(diagnostics, translations, messageParts, path.node.quasi.expressions, missingTranslation);
                            path.replaceWith(source_file_utils_1.buildLocalizeReplacement(translated[0], translated[1]));
                        }
                    }
                    catch (e) {
                        if (source_file_utils_1.isBabelParseError(e)) {
                            // If we get a BabelParseError here then something went wrong with Babel itself
                            // since there must be something wrong with the structure of the AST generated
                            // by Babel parsing a TaggedTemplateExpression.
                            throw source_file_utils_1.buildCodeFrameError(path, e);
                        }
                    }
                }
            }
        };
    }
    exports.makeEs2015TranslatePlugin = makeEs2015TranslatePlugin;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXMyMDE1X3RyYW5zbGF0ZV9wbHVnaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS9zb3VyY2VfZmlsZXMvZXMyMDE1X3RyYW5zbGF0ZV9wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFhQSx1RkFBK0w7SUFFL0wsU0FBZ0IseUJBQXlCLENBQ3JDLFdBQXdCLEVBQUUsWUFBZ0QsRUFDMUUsRUFBdUY7WUFBdkYsNEJBQXVGLEVBQXRGLDBCQUE0QixFQUE1QixpREFBNEIsRUFBRSxvQkFBMEIsRUFBMUIsK0NBQTBCO1FBRTNELE9BQU87WUFDTCxPQUFPLEVBQUU7Z0JBQ1Asd0JBQXdCLEVBQXhCLFVBQXlCLElBQXdDO29CQUMvRCxJQUFJO3dCQUNGLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQzVCLElBQUksOEJBQVUsQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLEVBQUU7NEJBQ2pDLElBQU0sWUFBWSxHQUFHLHlEQUFxQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUNuRixJQUFNLFVBQVUsR0FBRyw2QkFBUyxDQUN4QixXQUFXLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQ3BFLGtCQUFrQixDQUFDLENBQUM7NEJBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsNENBQXdCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQzFFO3FCQUNGO29CQUFDLE9BQU8sQ0FBQyxFQUFFO3dCQUNWLElBQUkscUNBQWlCLENBQUMsQ0FBQyxDQUFDLEVBQUU7NEJBQ3hCLCtFQUErRTs0QkFDL0UsOEVBQThFOzRCQUM5RSwrQ0FBK0M7NEJBQy9DLE1BQU0sdUNBQW1CLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO3lCQUNwQztxQkFDRjtnQkFDSCxDQUFDO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQztJQTNCRCw4REEyQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge8m1UGFyc2VkVHJhbnNsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcbmltcG9ydCB7Tm9kZVBhdGgsIFBsdWdpbk9ian0gZnJvbSAnQGJhYmVsL2NvcmUnO1xuaW1wb3J0IHtUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb259IGZyb20gJ0BiYWJlbC90eXBlcyc7XG5cbmltcG9ydCB7RGlhZ25vc3RpY3N9IGZyb20gJy4uLy4uL2RpYWdub3N0aWNzJztcblxuaW1wb3J0IHtidWlsZENvZGVGcmFtZUVycm9yLCBidWlsZExvY2FsaXplUmVwbGFjZW1lbnQsIGlzQmFiZWxQYXJzZUVycm9yLCBpc0xvY2FsaXplLCB0cmFuc2xhdGUsIFRyYW5zbGF0ZVBsdWdpbk9wdGlvbnMsIHVud3JhcE1lc3NhZ2VQYXJ0c0Zyb21UZW1wbGF0ZUxpdGVyYWx9IGZyb20gJy4uLy4uL3NvdXJjZV9maWxlX3V0aWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VFczIwMTVUcmFuc2xhdGVQbHVnaW4oXG4gICAgZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzLCB0cmFuc2xhdGlvbnM6IFJlY29yZDxzdHJpbmcsIMm1UGFyc2VkVHJhbnNsYXRpb24+LFxuICAgIHttaXNzaW5nVHJhbnNsYXRpb24gPSAnZXJyb3InLCBsb2NhbGl6ZU5hbWUgPSAnJGxvY2FsaXplJ306IFRyYW5zbGF0ZVBsdWdpbk9wdGlvbnMgPSB7fSk6XG4gICAgUGx1Z2luT2JqIHtcbiAgcmV0dXJuIHtcbiAgICB2aXNpdG9yOiB7XG4gICAgICBUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb24ocGF0aDogTm9kZVBhdGg8VGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9uPikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHRhZyA9IHBhdGguZ2V0KCd0YWcnKTtcbiAgICAgICAgICBpZiAoaXNMb2NhbGl6ZSh0YWcsIGxvY2FsaXplTmFtZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2VQYXJ0cyA9IHVud3JhcE1lc3NhZ2VQYXJ0c0Zyb21UZW1wbGF0ZUxpdGVyYWwocGF0aC5ub2RlLnF1YXNpLnF1YXNpcyk7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2xhdGVkID0gdHJhbnNsYXRlKFxuICAgICAgICAgICAgICAgIGRpYWdub3N0aWNzLCB0cmFuc2xhdGlvbnMsIG1lc3NhZ2VQYXJ0cywgcGF0aC5ub2RlLnF1YXNpLmV4cHJlc3Npb25zLFxuICAgICAgICAgICAgICAgIG1pc3NpbmdUcmFuc2xhdGlvbik7XG4gICAgICAgICAgICBwYXRoLnJlcGxhY2VXaXRoKGJ1aWxkTG9jYWxpemVSZXBsYWNlbWVudCh0cmFuc2xhdGVkWzBdLCB0cmFuc2xhdGVkWzFdKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgaWYgKGlzQmFiZWxQYXJzZUVycm9yKGUpKSB7XG4gICAgICAgICAgICAvLyBJZiB3ZSBnZXQgYSBCYWJlbFBhcnNlRXJyb3IgaGVyZSB0aGVuIHNvbWV0aGluZyB3ZW50IHdyb25nIHdpdGggQmFiZWwgaXRzZWxmXG4gICAgICAgICAgICAvLyBzaW5jZSB0aGVyZSBtdXN0IGJlIHNvbWV0aGluZyB3cm9uZyB3aXRoIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIEFTVCBnZW5lcmF0ZWRcbiAgICAgICAgICAgIC8vIGJ5IEJhYmVsIHBhcnNpbmcgYSBUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb24uXG4gICAgICAgICAgICB0aHJvdyBidWlsZENvZGVGcmFtZUVycm9yKHBhdGgsIGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cbiJdfQ==
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/source_files/es2015_translate_plugin", ["require", "exports", "tslib", "@angular/localize/src/tools/src/source_file_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeEs2015TranslatePlugin = void 0;
    var tslib_1 = require("tslib");
    var source_file_utils_1 = require("@angular/localize/src/tools/src/source_file_utils");
    function makeEs2015TranslatePlugin(diagnostics, translations, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.missingTranslation, missingTranslation = _c === void 0 ? 'error' : _c, _d = _b.localizeName, localizeName = _d === void 0 ? '$localize' : _d;
        return {
            visitor: {
                TaggedTemplateExpression: function (path) {
                    try {
                        var tag = path.get('tag');
                        if (source_file_utils_1.isLocalize(tag, localizeName)) {
                            var _a = tslib_1.__read(source_file_utils_1.unwrapMessagePartsFromTemplateLiteral(path.get('quasi').get('quasis')), 1), messageParts = _a[0];
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
                        else {
                            throw e;
                        }
                    }
                }
            }
        };
    }
    exports.makeEs2015TranslatePlugin = makeEs2015TranslatePlugin;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXMyMDE1X3RyYW5zbGF0ZV9wbHVnaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS9zb3VyY2VfZmlsZXMvZXMyMDE1X3RyYW5zbGF0ZV9wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQWFBLHVGQUErTDtJQUUvTCxTQUFnQix5QkFBeUIsQ0FDckMsV0FBd0IsRUFBRSxZQUFnRCxFQUMxRSxFQUF1RjtZQUF2RixxQkFBcUYsRUFBRSxLQUFBLEVBQXRGLDBCQUE0QixFQUE1QixrQkFBa0IsbUJBQUcsT0FBTyxLQUFBLEVBQUUsb0JBQTBCLEVBQTFCLFlBQVksbUJBQUcsV0FBVyxLQUFBO1FBRTNELE9BQU87WUFDTCxPQUFPLEVBQUU7Z0JBQ1Asd0JBQXdCLEVBQXhCLFVBQXlCLElBQXdDO29CQUMvRCxJQUFJO3dCQUNGLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQzVCLElBQUksOEJBQVUsQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLEVBQUU7NEJBQzNCLElBQUEsS0FBQSxlQUNGLHlEQUFxQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUEsRUFEbkUsWUFBWSxRQUN1RCxDQUFDOzRCQUMzRSxJQUFNLFVBQVUsR0FBRyw2QkFBUyxDQUN4QixXQUFXLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQ3BFLGtCQUFrQixDQUFDLENBQUM7NEJBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsNENBQXdCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQzFFO3FCQUNGO29CQUFDLE9BQU8sQ0FBQyxFQUFFO3dCQUNWLElBQUkscUNBQWlCLENBQUMsQ0FBQyxDQUFDLEVBQUU7NEJBQ3hCLCtFQUErRTs0QkFDL0UsOEVBQThFOzRCQUM5RSwrQ0FBK0M7NEJBQy9DLE1BQU0sdUNBQW1CLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO3lCQUNwQzs2QkFBTTs0QkFDTCxNQUFNLENBQUMsQ0FBQzt5QkFDVDtxQkFDRjtnQkFDSCxDQUFDO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQztJQTlCRCw4REE4QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7ybVQYXJzZWRUcmFuc2xhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuaW1wb3J0IHtOb2RlUGF0aCwgUGx1Z2luT2JqfSBmcm9tICdAYmFiZWwvY29yZSc7XG5pbXBvcnQge1RhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbn0gZnJvbSAnQGJhYmVsL3R5cGVzJztcblxuaW1wb3J0IHtEaWFnbm9zdGljc30gZnJvbSAnLi4vLi4vZGlhZ25vc3RpY3MnO1xuXG5pbXBvcnQge2J1aWxkQ29kZUZyYW1lRXJyb3IsIGJ1aWxkTG9jYWxpemVSZXBsYWNlbWVudCwgaXNCYWJlbFBhcnNlRXJyb3IsIGlzTG9jYWxpemUsIHRyYW5zbGF0ZSwgVHJhbnNsYXRlUGx1Z2luT3B0aW9ucywgdW53cmFwTWVzc2FnZVBhcnRzRnJvbVRlbXBsYXRlTGl0ZXJhbH0gZnJvbSAnLi4vLi4vc291cmNlX2ZpbGVfdXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gbWFrZUVzMjAxNVRyYW5zbGF0ZVBsdWdpbihcbiAgICBkaWFnbm9zdGljczogRGlhZ25vc3RpY3MsIHRyYW5zbGF0aW9uczogUmVjb3JkPHN0cmluZywgybVQYXJzZWRUcmFuc2xhdGlvbj4sXG4gICAge21pc3NpbmdUcmFuc2xhdGlvbiA9ICdlcnJvcicsIGxvY2FsaXplTmFtZSA9ICckbG9jYWxpemUnfTogVHJhbnNsYXRlUGx1Z2luT3B0aW9ucyA9IHt9KTpcbiAgICBQbHVnaW5PYmoge1xuICByZXR1cm4ge1xuICAgIHZpc2l0b3I6IHtcbiAgICAgIFRhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbihwYXRoOiBOb2RlUGF0aDxUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb24+KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgdGFnID0gcGF0aC5nZXQoJ3RhZycpO1xuICAgICAgICAgIGlmIChpc0xvY2FsaXplKHRhZywgbG9jYWxpemVOYW1lKSkge1xuICAgICAgICAgICAgY29uc3QgW21lc3NhZ2VQYXJ0c10gPVxuICAgICAgICAgICAgICAgIHVud3JhcE1lc3NhZ2VQYXJ0c0Zyb21UZW1wbGF0ZUxpdGVyYWwocGF0aC5nZXQoJ3F1YXNpJykuZ2V0KCdxdWFzaXMnKSk7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2xhdGVkID0gdHJhbnNsYXRlKFxuICAgICAgICAgICAgICAgIGRpYWdub3N0aWNzLCB0cmFuc2xhdGlvbnMsIG1lc3NhZ2VQYXJ0cywgcGF0aC5ub2RlLnF1YXNpLmV4cHJlc3Npb25zLFxuICAgICAgICAgICAgICAgIG1pc3NpbmdUcmFuc2xhdGlvbik7XG4gICAgICAgICAgICBwYXRoLnJlcGxhY2VXaXRoKGJ1aWxkTG9jYWxpemVSZXBsYWNlbWVudCh0cmFuc2xhdGVkWzBdLCB0cmFuc2xhdGVkWzFdKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgaWYgKGlzQmFiZWxQYXJzZUVycm9yKGUpKSB7XG4gICAgICAgICAgICAvLyBJZiB3ZSBnZXQgYSBCYWJlbFBhcnNlRXJyb3IgaGVyZSB0aGVuIHNvbWV0aGluZyB3ZW50IHdyb25nIHdpdGggQmFiZWwgaXRzZWxmXG4gICAgICAgICAgICAvLyBzaW5jZSB0aGVyZSBtdXN0IGJlIHNvbWV0aGluZyB3cm9uZyB3aXRoIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIEFTVCBnZW5lcmF0ZWRcbiAgICAgICAgICAgIC8vIGJ5IEJhYmVsIHBhcnNpbmcgYSBUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb24uXG4gICAgICAgICAgICB0aHJvdyBidWlsZENvZGVGcmFtZUVycm9yKHBhdGgsIGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cbiJdfQ==
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/source_files/es2015_translate_plugin", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/localize/src/tools/src/source_file_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeEs2015TranslatePlugin = void 0;
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
    function makeEs2015TranslatePlugin(diagnostics, translations, _a, fs) {
        var _b = _a === void 0 ? {} : _a, _c = _b.missingTranslation, missingTranslation = _c === void 0 ? 'error' : _c, _d = _b.localizeName, localizeName = _d === void 0 ? '$localize' : _d;
        if (fs === void 0) { fs = file_system_1.getFileSystem(); }
        return {
            visitor: {
                TaggedTemplateExpression: function (path) {
                    try {
                        var tag = path.get('tag');
                        if (source_file_utils_1.isLocalize(tag, localizeName)) {
                            var _a = tslib_1.__read(source_file_utils_1.unwrapMessagePartsFromTemplateLiteral(path.get('quasi').get('quasis'), fs), 1), messageParts = _a[0];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXMyMDE1X3RyYW5zbGF0ZV9wbHVnaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS9zb3VyY2VfZmlsZXMvZXMyMDE1X3RyYW5zbGF0ZV9wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDJFQUE0RjtJQU01Rix1RkFBK0w7SUFFL0w7Ozs7O09BS0c7SUFDSCxTQUFnQix5QkFBeUIsQ0FDckMsV0FBd0IsRUFBRSxZQUFnRCxFQUMxRSxFQUF1RixFQUN2RixFQUFzQztZQUR0QyxxQkFBcUYsRUFBRSxLQUFBLEVBQXRGLDBCQUE0QixFQUE1QixrQkFBa0IsbUJBQUcsT0FBTyxLQUFBLEVBQUUsb0JBQTBCLEVBQTFCLFlBQVksbUJBQUcsV0FBVyxLQUFBO1FBQ3pELG1CQUFBLEVBQUEsS0FBdUIsMkJBQWEsRUFBRTtRQUN4QyxPQUFPO1lBQ0wsT0FBTyxFQUFFO2dCQUNQLHdCQUF3QixFQUF4QixVQUF5QixJQUF3QztvQkFDL0QsSUFBSTt3QkFDRixJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUM1QixJQUFJLDhCQUFVLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxFQUFFOzRCQUMzQixJQUFBLEtBQUEsZUFDRix5REFBcUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBQSxFQUR2RSxZQUFZLFFBQzJELENBQUM7NEJBQy9FLElBQU0sVUFBVSxHQUFHLDZCQUFTLENBQ3hCLFdBQVcsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFDcEUsa0JBQWtCLENBQUMsQ0FBQzs0QkFDeEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyw0Q0FBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDMUU7cUJBQ0Y7b0JBQUMsT0FBTyxDQUFDLEVBQUU7d0JBQ1YsSUFBSSxxQ0FBaUIsQ0FBQyxDQUFDLENBQUMsRUFBRTs0QkFDeEIsK0VBQStFOzRCQUMvRSw4RUFBOEU7NEJBQzlFLCtDQUErQzs0QkFDL0MsTUFBTSx1Q0FBbUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7eUJBQ3BDOzZCQUFNOzRCQUNMLE1BQU0sQ0FBQyxDQUFDO3lCQUNUO3FCQUNGO2dCQUNILENBQUM7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDO0lBOUJELDhEQThCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtnZXRGaWxlU3lzdGVtLCBQYXRoTWFuaXB1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb21waWxlci1jbGkvc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7ybVQYXJzZWRUcmFuc2xhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuaW1wb3J0IHtOb2RlUGF0aCwgUGx1Z2luT2JqfSBmcm9tICdAYmFiZWwvY29yZSc7XG5pbXBvcnQge1RhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbn0gZnJvbSAnQGJhYmVsL3R5cGVzJztcblxuaW1wb3J0IHtEaWFnbm9zdGljc30gZnJvbSAnLi4vLi4vZGlhZ25vc3RpY3MnO1xuaW1wb3J0IHtidWlsZENvZGVGcmFtZUVycm9yLCBidWlsZExvY2FsaXplUmVwbGFjZW1lbnQsIGlzQmFiZWxQYXJzZUVycm9yLCBpc0xvY2FsaXplLCB0cmFuc2xhdGUsIFRyYW5zbGF0ZVBsdWdpbk9wdGlvbnMsIHVud3JhcE1lc3NhZ2VQYXJ0c0Zyb21UZW1wbGF0ZUxpdGVyYWx9IGZyb20gJy4uLy4uL3NvdXJjZV9maWxlX3V0aWxzJztcblxuLyoqXG4gKiBDcmVhdGUgYSBCYWJlbCBwbHVnaW4gdGhhdCBjYW4gYmUgdXNlZCB0byBkbyBjb21waWxlLXRpbWUgdHJhbnNsYXRpb24gb2YgYCRsb2NhbGl6ZWAgdGFnZ2VkXG4gKiBtZXNzYWdlcy5cbiAqXG4gKiBAcHVibGljQXBpIHVzZWQgYnkgQ0xJXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYWtlRXMyMDE1VHJhbnNsYXRlUGx1Z2luKFxuICAgIGRpYWdub3N0aWNzOiBEaWFnbm9zdGljcywgdHJhbnNsYXRpb25zOiBSZWNvcmQ8c3RyaW5nLCDJtVBhcnNlZFRyYW5zbGF0aW9uPixcbiAgICB7bWlzc2luZ1RyYW5zbGF0aW9uID0gJ2Vycm9yJywgbG9jYWxpemVOYW1lID0gJyRsb2NhbGl6ZSd9OiBUcmFuc2xhdGVQbHVnaW5PcHRpb25zID0ge30sXG4gICAgZnM6IFBhdGhNYW5pcHVsYXRpb24gPSBnZXRGaWxlU3lzdGVtKCkpOiBQbHVnaW5PYmoge1xuICByZXR1cm4ge1xuICAgIHZpc2l0b3I6IHtcbiAgICAgIFRhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbihwYXRoOiBOb2RlUGF0aDxUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb24+KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgdGFnID0gcGF0aC5nZXQoJ3RhZycpO1xuICAgICAgICAgIGlmIChpc0xvY2FsaXplKHRhZywgbG9jYWxpemVOYW1lKSkge1xuICAgICAgICAgICAgY29uc3QgW21lc3NhZ2VQYXJ0c10gPVxuICAgICAgICAgICAgICAgIHVud3JhcE1lc3NhZ2VQYXJ0c0Zyb21UZW1wbGF0ZUxpdGVyYWwocGF0aC5nZXQoJ3F1YXNpJykuZ2V0KCdxdWFzaXMnKSwgZnMpO1xuICAgICAgICAgICAgY29uc3QgdHJhbnNsYXRlZCA9IHRyYW5zbGF0ZShcbiAgICAgICAgICAgICAgICBkaWFnbm9zdGljcywgdHJhbnNsYXRpb25zLCBtZXNzYWdlUGFydHMsIHBhdGgubm9kZS5xdWFzaS5leHByZXNzaW9ucyxcbiAgICAgICAgICAgICAgICBtaXNzaW5nVHJhbnNsYXRpb24pO1xuICAgICAgICAgICAgcGF0aC5yZXBsYWNlV2l0aChidWlsZExvY2FsaXplUmVwbGFjZW1lbnQodHJhbnNsYXRlZFswXSwgdHJhbnNsYXRlZFsxXSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGlmIChpc0JhYmVsUGFyc2VFcnJvcihlKSkge1xuICAgICAgICAgICAgLy8gSWYgd2UgZ2V0IGEgQmFiZWxQYXJzZUVycm9yIGhlcmUgdGhlbiBzb21ldGhpbmcgd2VudCB3cm9uZyB3aXRoIEJhYmVsIGl0c2VsZlxuICAgICAgICAgICAgLy8gc2luY2UgdGhlcmUgbXVzdCBiZSBzb21ldGhpbmcgd3Jvbmcgd2l0aCB0aGUgc3RydWN0dXJlIG9mIHRoZSBBU1QgZ2VuZXJhdGVkXG4gICAgICAgICAgICAvLyBieSBCYWJlbCBwYXJzaW5nIGEgVGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9uLlxuICAgICAgICAgICAgdGhyb3cgYnVpbGRDb2RlRnJhbWVFcnJvcihwYXRoLCBlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG4iXX0=
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/source_files/source_file_translation_handler", ["require", "exports", "tslib", "@babel/core", "path", "@angular/localize/src/tools/src/file_utils", "@angular/localize/src/tools/src/translate/source_files/es2015_translate_plugin", "@angular/localize/src/tools/src/translate/source_files/es5_translate_plugin"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var core_1 = require("@babel/core");
    var path_1 = require("path");
    var file_utils_1 = require("@angular/localize/src/tools/src/file_utils");
    var es2015_translate_plugin_1 = require("@angular/localize/src/tools/src/translate/source_files/es2015_translate_plugin");
    var es5_translate_plugin_1 = require("@angular/localize/src/tools/src/translate/source_files/es5_translate_plugin");
    /**
     * Translate a file by inlining all messages tagged by `$localize` with the appropriate translated
     * message.
     */
    var SourceFileTranslationHandler = /** @class */ (function () {
        function SourceFileTranslationHandler(translationOptions) {
            if (translationOptions === void 0) { translationOptions = {}; }
            this.translationOptions = translationOptions;
        }
        SourceFileTranslationHandler.prototype.canTranslate = function (relativeFilePath, contents) {
            return path_1.extname(relativeFilePath) === '.js';
        };
        SourceFileTranslationHandler.prototype.translate = function (diagnostics, sourceRoot, relativeFilePath, contents, outputPathFn, translations) {
            var e_1, _a, e_2, _b;
            var sourceCode = contents.toString('utf8');
            // A short-circuit check to avoid parsing the file into an AST if it does not contain any
            // `$localize` identifiers.
            if (!sourceCode.includes('$localize')) {
                try {
                    for (var translations_1 = tslib_1.__values(translations), translations_1_1 = translations_1.next(); !translations_1_1.done; translations_1_1 = translations_1.next()) {
                        var translation = translations_1_1.value;
                        file_utils_1.FileUtils.writeFile(outputPathFn(translation.locale, relativeFilePath), contents);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (translations_1_1 && !translations_1_1.done && (_a = translations_1.return)) _a.call(translations_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            else {
                var ast = core_1.parseSync(sourceCode, { sourceRoot: sourceRoot, filename: relativeFilePath });
                if (!ast) {
                    diagnostics.error("Unable to parse source file: " + path_1.join(sourceRoot, relativeFilePath));
                    return;
                }
                try {
                    for (var translations_2 = tslib_1.__values(translations), translations_2_1 = translations_2.next(); !translations_2_1.done; translations_2_1 = translations_2.next()) {
                        var translationBundle = translations_2_1.value;
                        var translated = core_1.transformFromAstSync(ast, sourceCode, {
                            compact: true,
                            generatorOpts: { minified: true },
                            plugins: [
                                es2015_translate_plugin_1.makeEs2015TranslatePlugin(diagnostics, translationBundle.translations, this.translationOptions),
                                es5_translate_plugin_1.makeEs5TranslatePlugin(diagnostics, translationBundle.translations, this.translationOptions),
                            ],
                            filename: relativeFilePath,
                        });
                        if (translated && translated.code) {
                            file_utils_1.FileUtils.writeFile(outputPathFn(translationBundle.locale, relativeFilePath), translated.code);
                        }
                        else {
                            diagnostics.error("Unable to translate source file: " + path_1.join(sourceRoot, relativeFilePath));
                            return;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (translations_2_1 && !translations_2_1.done && (_b = translations_2.return)) _b.call(translations_2);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        };
        return SourceFileTranslationHandler;
    }());
    exports.SourceFileTranslationHandler = SourceFileTranslationHandler;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX2ZpbGVfdHJhbnNsYXRpb25faGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3NvdXJjZV9maWxlcy9zb3VyY2VfZmlsZV90cmFuc2xhdGlvbl9oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILG9DQUE0RDtJQUM1RCw2QkFBbUM7SUFHbkMseUVBQTJDO0lBSTNDLDBIQUFvRTtJQUNwRSxvSEFBOEQ7SUFHOUQ7OztPQUdHO0lBQ0g7UUFDRSxzQ0FBb0Isa0JBQStDO1lBQS9DLG1DQUFBLEVBQUEsdUJBQStDO1lBQS9DLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBNkI7UUFBRyxDQUFDO1FBRXZFLG1EQUFZLEdBQVosVUFBYSxnQkFBd0IsRUFBRSxRQUFnQjtZQUNyRCxPQUFPLGNBQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEtBQUssQ0FBQztRQUM3QyxDQUFDO1FBRUQsZ0RBQVMsR0FBVCxVQUNJLFdBQXdCLEVBQUUsVUFBa0IsRUFBRSxnQkFBd0IsRUFBRSxRQUFnQixFQUN4RixZQUEwQixFQUFFLFlBQWlDOztZQUMvRCxJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdDLHlGQUF5RjtZQUN6RiwyQkFBMkI7WUFDM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUU7O29CQUNyQyxLQUEwQixJQUFBLGlCQUFBLGlCQUFBLFlBQVksQ0FBQSwwQ0FBQSxvRUFBRTt3QkFBbkMsSUFBTSxXQUFXLHlCQUFBO3dCQUNwQixzQkFBUyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO3FCQUNuRjs7Ozs7Ozs7O2FBQ0Y7aUJBQU07Z0JBQ0wsSUFBTSxHQUFHLEdBQUcsZ0JBQVMsQ0FBQyxVQUFVLEVBQUUsRUFBQyxVQUFVLFlBQUEsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQyxDQUFDO2dCQUM1RSxJQUFJLENBQUMsR0FBRyxFQUFFO29CQUNSLFdBQVcsQ0FBQyxLQUFLLENBQUMsa0NBQWdDLFdBQUksQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUcsQ0FBQyxDQUFDO29CQUN4RixPQUFPO2lCQUNSOztvQkFDRCxLQUFnQyxJQUFBLGlCQUFBLGlCQUFBLFlBQVksQ0FBQSwwQ0FBQSxvRUFBRTt3QkFBekMsSUFBTSxpQkFBaUIseUJBQUE7d0JBQzFCLElBQU0sVUFBVSxHQUFHLDJCQUFvQixDQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUU7NEJBQ3ZELE9BQU8sRUFBRSxJQUFJOzRCQUNiLGFBQWEsRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUM7NEJBQy9CLE9BQU8sRUFBRTtnQ0FDUCxtREFBeUIsQ0FDckIsV0FBVyxFQUFFLGlCQUFpQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUM7Z0NBQ3pFLDZDQUFzQixDQUNsQixXQUFXLEVBQUUsaUJBQWlCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQzs2QkFDMUU7NEJBQ0QsUUFBUSxFQUFFLGdCQUFnQjt5QkFDM0IsQ0FBQyxDQUFDO3dCQUNILElBQUksVUFBVSxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUU7NEJBQ2pDLHNCQUFTLENBQUMsU0FBUyxDQUNmLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7eUJBQ2hGOzZCQUFNOzRCQUNMLFdBQVcsQ0FBQyxLQUFLLENBQ2Isc0NBQW9DLFdBQUksQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUcsQ0FBQyxDQUFDOzRCQUM5RSxPQUFPO3lCQUNSO3FCQUNGOzs7Ozs7Ozs7YUFDRjtRQUNILENBQUM7UUFDSCxtQ0FBQztJQUFELENBQUMsQUE5Q0QsSUE4Q0M7SUE5Q1ksb0VBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtwYXJzZVN5bmMsIHRyYW5zZm9ybUZyb21Bc3RTeW5jfSBmcm9tICdAYmFiZWwvY29yZSc7XG5pbXBvcnQge2V4dG5hbWUsIGpvaW59IGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQge0RpYWdub3N0aWNzfSBmcm9tICcuLi8uLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge0ZpbGVVdGlsc30gZnJvbSAnLi4vLi4vZmlsZV91dGlscyc7XG5pbXBvcnQge091dHB1dFBhdGhGbn0gZnJvbSAnLi4vb3V0cHV0X3BhdGgnO1xuaW1wb3J0IHtUcmFuc2xhdGlvbkJ1bmRsZSwgVHJhbnNsYXRpb25IYW5kbGVyfSBmcm9tICcuLi90cmFuc2xhdG9yJztcblxuaW1wb3J0IHttYWtlRXMyMDE1VHJhbnNsYXRlUGx1Z2lufSBmcm9tICcuL2VzMjAxNV90cmFuc2xhdGVfcGx1Z2luJztcbmltcG9ydCB7bWFrZUVzNVRyYW5zbGF0ZVBsdWdpbn0gZnJvbSAnLi9lczVfdHJhbnNsYXRlX3BsdWdpbic7XG5pbXBvcnQge1RyYW5zbGF0ZVBsdWdpbk9wdGlvbnN9IGZyb20gJy4vc291cmNlX2ZpbGVfdXRpbHMnO1xuXG4vKipcbiAqIFRyYW5zbGF0ZSBhIGZpbGUgYnkgaW5saW5pbmcgYWxsIG1lc3NhZ2VzIHRhZ2dlZCBieSBgJGxvY2FsaXplYCB3aXRoIHRoZSBhcHByb3ByaWF0ZSB0cmFuc2xhdGVkXG4gKiBtZXNzYWdlLlxuICovXG5leHBvcnQgY2xhc3MgU291cmNlRmlsZVRyYW5zbGF0aW9uSGFuZGxlciBpbXBsZW1lbnRzIFRyYW5zbGF0aW9uSGFuZGxlciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgdHJhbnNsYXRpb25PcHRpb25zOiBUcmFuc2xhdGVQbHVnaW5PcHRpb25zID0ge30pIHt9XG5cbiAgY2FuVHJhbnNsYXRlKHJlbGF0aXZlRmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IEJ1ZmZlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBleHRuYW1lKHJlbGF0aXZlRmlsZVBhdGgpID09PSAnLmpzJztcbiAgfVxuXG4gIHRyYW5zbGF0ZShcbiAgICAgIGRpYWdub3N0aWNzOiBEaWFnbm9zdGljcywgc291cmNlUm9vdDogc3RyaW5nLCByZWxhdGl2ZUZpbGVQYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBCdWZmZXIsXG4gICAgICBvdXRwdXRQYXRoRm46IE91dHB1dFBhdGhGbiwgdHJhbnNsYXRpb25zOiBUcmFuc2xhdGlvbkJ1bmRsZVtdKTogdm9pZCB7XG4gICAgY29uc3Qgc291cmNlQ29kZSA9IGNvbnRlbnRzLnRvU3RyaW5nKCd1dGY4Jyk7XG4gICAgLy8gQSBzaG9ydC1jaXJjdWl0IGNoZWNrIHRvIGF2b2lkIHBhcnNpbmcgdGhlIGZpbGUgaW50byBhbiBBU1QgaWYgaXQgZG9lcyBub3QgY29udGFpbiBhbnlcbiAgICAvLyBgJGxvY2FsaXplYCBpZGVudGlmaWVycy5cbiAgICBpZiAoIXNvdXJjZUNvZGUuaW5jbHVkZXMoJyRsb2NhbGl6ZScpKSB7XG4gICAgICBmb3IgKGNvbnN0IHRyYW5zbGF0aW9uIG9mIHRyYW5zbGF0aW9ucykge1xuICAgICAgICBGaWxlVXRpbHMud3JpdGVGaWxlKG91dHB1dFBhdGhGbih0cmFuc2xhdGlvbi5sb2NhbGUsIHJlbGF0aXZlRmlsZVBhdGgpLCBjb250ZW50cyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGFzdCA9IHBhcnNlU3luYyhzb3VyY2VDb2RlLCB7c291cmNlUm9vdCwgZmlsZW5hbWU6IHJlbGF0aXZlRmlsZVBhdGh9KTtcbiAgICAgIGlmICghYXN0KSB7XG4gICAgICAgIGRpYWdub3N0aWNzLmVycm9yKGBVbmFibGUgdG8gcGFyc2Ugc291cmNlIGZpbGU6ICR7am9pbihzb3VyY2VSb290LCByZWxhdGl2ZUZpbGVQYXRoKX1gKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZm9yIChjb25zdCB0cmFuc2xhdGlvbkJ1bmRsZSBvZiB0cmFuc2xhdGlvbnMpIHtcbiAgICAgICAgY29uc3QgdHJhbnNsYXRlZCA9IHRyYW5zZm9ybUZyb21Bc3RTeW5jKGFzdCwgc291cmNlQ29kZSwge1xuICAgICAgICAgIGNvbXBhY3Q6IHRydWUsXG4gICAgICAgICAgZ2VuZXJhdG9yT3B0czoge21pbmlmaWVkOiB0cnVlfSxcbiAgICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgICBtYWtlRXMyMDE1VHJhbnNsYXRlUGx1Z2luKFxuICAgICAgICAgICAgICAgIGRpYWdub3N0aWNzLCB0cmFuc2xhdGlvbkJ1bmRsZS50cmFuc2xhdGlvbnMsIHRoaXMudHJhbnNsYXRpb25PcHRpb25zKSxcbiAgICAgICAgICAgIG1ha2VFczVUcmFuc2xhdGVQbHVnaW4oXG4gICAgICAgICAgICAgICAgZGlhZ25vc3RpY3MsIHRyYW5zbGF0aW9uQnVuZGxlLnRyYW5zbGF0aW9ucywgdGhpcy50cmFuc2xhdGlvbk9wdGlvbnMpLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgZmlsZW5hbWU6IHJlbGF0aXZlRmlsZVBhdGgsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodHJhbnNsYXRlZCAmJiB0cmFuc2xhdGVkLmNvZGUpIHtcbiAgICAgICAgICBGaWxlVXRpbHMud3JpdGVGaWxlKFxuICAgICAgICAgICAgICBvdXRwdXRQYXRoRm4odHJhbnNsYXRpb25CdW5kbGUubG9jYWxlLCByZWxhdGl2ZUZpbGVQYXRoKSwgdHJhbnNsYXRlZC5jb2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkaWFnbm9zdGljcy5lcnJvcihcbiAgICAgICAgICAgICAgYFVuYWJsZSB0byB0cmFuc2xhdGUgc291cmNlIGZpbGU6ICR7am9pbihzb3VyY2VSb290LCByZWxhdGl2ZUZpbGVQYXRoKX1gKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==
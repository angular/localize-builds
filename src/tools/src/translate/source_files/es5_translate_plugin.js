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
        if (fs === void 0) { fs = (0, file_system_1.getFileSystem)(); }
        return {
            visitor: {
                CallExpression: function (callPath) {
                    try {
                        var calleePath = callPath.get('callee');
                        if ((0, source_file_utils_1.isLocalize)(calleePath, localizeName)) {
                            var _a = (0, tslib_1.__read)((0, source_file_utils_1.unwrapMessagePartsFromLocalizeCall)(callPath, fs), 1), messageParts = _a[0];
                            var _b = (0, tslib_1.__read)((0, source_file_utils_1.unwrapSubstitutionsFromLocalizeCall)(callPath, fs), 1), expressions = _b[0];
                            var translated = (0, source_file_utils_1.translate)(diagnostics, translations, messageParts, expressions, missingTranslation);
                            callPath.replaceWith((0, source_file_utils_1.buildLocalizeReplacement)(translated[0], translated[1]));
                        }
                    }
                    catch (e) {
                        if ((0, source_file_utils_1.isBabelParseError)(e)) {
                            diagnostics.error((0, source_file_utils_1.buildCodeFrameError)(fs, callPath, e));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXM1X3RyYW5zbGF0ZV9wbHVnaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS9zb3VyY2VfZmlsZXMvZXM1X3RyYW5zbGF0ZV9wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDJFQUE0RjtJQU01Rix1RkFBaU87SUFFak87Ozs7O09BS0c7SUFDSCxTQUFnQixzQkFBc0IsQ0FDbEMsV0FBd0IsRUFBRSxZQUFnRCxFQUMxRSxFQUF1RixFQUN2RixFQUFzQztZQUR0QyxxQkFBcUYsRUFBRSxLQUFBLEVBQXRGLDBCQUE0QixFQUE1QixrQkFBa0IsbUJBQUcsT0FBTyxLQUFBLEVBQUUsb0JBQTBCLEVBQTFCLFlBQVksbUJBQUcsV0FBVyxLQUFBO1FBQ3pELG1CQUFBLEVBQUEsU0FBdUIsMkJBQWEsR0FBRTtRQUN4QyxPQUFPO1lBQ0wsT0FBTyxFQUFFO2dCQUNQLGNBQWMsRUFBZCxVQUFlLFFBQWtDO29CQUMvQyxJQUFJO3dCQUNGLElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQzFDLElBQUksSUFBQSw4QkFBVSxFQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsRUFBRTs0QkFDbEMsSUFBQSxLQUFBLG9CQUFpQixJQUFBLHNEQUFrQyxFQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsSUFBQSxFQUFoRSxZQUFZLFFBQW9ELENBQUM7NEJBQ2xFLElBQUEsS0FBQSxvQkFBZ0IsSUFBQSx1REFBbUMsRUFBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLElBQUEsRUFBaEUsV0FBVyxRQUFxRCxDQUFDOzRCQUN4RSxJQUFNLFVBQVUsR0FDWixJQUFBLDZCQUFTLEVBQUMsV0FBVyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixDQUFDLENBQUM7NEJBQ3hGLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBQSw0Q0FBd0IsRUFBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDOUU7cUJBQ0Y7b0JBQUMsT0FBTyxDQUFDLEVBQUU7d0JBQ1YsSUFBSSxJQUFBLHFDQUFpQixFQUFDLENBQUMsQ0FBQyxFQUFFOzRCQUN4QixXQUFXLENBQUMsS0FBSyxDQUFDLElBQUEsdUNBQW1CLEVBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUN6RDs2QkFBTTs0QkFDTCxNQUFNLENBQUMsQ0FBQzt5QkFDVDtxQkFDRjtnQkFDSCxDQUFDO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQztJQTFCRCx3REEwQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7Z2V0RmlsZVN5c3RlbSwgUGF0aE1hbmlwdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQge8m1UGFyc2VkVHJhbnNsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcbmltcG9ydCB7Tm9kZVBhdGgsIFBsdWdpbk9ian0gZnJvbSAnQGJhYmVsL2NvcmUnO1xuaW1wb3J0IHtDYWxsRXhwcmVzc2lvbn0gZnJvbSAnQGJhYmVsL3R5cGVzJztcblxuaW1wb3J0IHtEaWFnbm9zdGljc30gZnJvbSAnLi4vLi4vZGlhZ25vc3RpY3MnO1xuaW1wb3J0IHtidWlsZENvZGVGcmFtZUVycm9yLCBidWlsZExvY2FsaXplUmVwbGFjZW1lbnQsIGlzQmFiZWxQYXJzZUVycm9yLCBpc0xvY2FsaXplLCB0cmFuc2xhdGUsIFRyYW5zbGF0ZVBsdWdpbk9wdGlvbnMsIHVud3JhcE1lc3NhZ2VQYXJ0c0Zyb21Mb2NhbGl6ZUNhbGwsIHVud3JhcFN1YnN0aXR1dGlvbnNGcm9tTG9jYWxpemVDYWxsfSBmcm9tICcuLi8uLi9zb3VyY2VfZmlsZV91dGlscyc7XG5cbi8qKlxuICogQ3JlYXRlIGEgQmFiZWwgcGx1Z2luIHRoYXQgY2FuIGJlIHVzZWQgdG8gZG8gY29tcGlsZS10aW1lIHRyYW5zbGF0aW9uIG9mIGAkbG9jYWxpemVgIHRhZ2dlZFxuICogbWVzc2FnZXMuXG4gKlxuICogQHB1YmxpY0FwaSB1c2VkIGJ5IENMSVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFrZUVzNVRyYW5zbGF0ZVBsdWdpbihcbiAgICBkaWFnbm9zdGljczogRGlhZ25vc3RpY3MsIHRyYW5zbGF0aW9uczogUmVjb3JkPHN0cmluZywgybVQYXJzZWRUcmFuc2xhdGlvbj4sXG4gICAge21pc3NpbmdUcmFuc2xhdGlvbiA9ICdlcnJvcicsIGxvY2FsaXplTmFtZSA9ICckbG9jYWxpemUnfTogVHJhbnNsYXRlUGx1Z2luT3B0aW9ucyA9IHt9LFxuICAgIGZzOiBQYXRoTWFuaXB1bGF0aW9uID0gZ2V0RmlsZVN5c3RlbSgpKTogUGx1Z2luT2JqIHtcbiAgcmV0dXJuIHtcbiAgICB2aXNpdG9yOiB7XG4gICAgICBDYWxsRXhwcmVzc2lvbihjYWxsUGF0aDogTm9kZVBhdGg8Q2FsbEV4cHJlc3Npb24+KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgY2FsbGVlUGF0aCA9IGNhbGxQYXRoLmdldCgnY2FsbGVlJyk7XG4gICAgICAgICAgaWYgKGlzTG9jYWxpemUoY2FsbGVlUGF0aCwgbG9jYWxpemVOYW1lKSkge1xuICAgICAgICAgICAgY29uc3QgW21lc3NhZ2VQYXJ0c10gPSB1bndyYXBNZXNzYWdlUGFydHNGcm9tTG9jYWxpemVDYWxsKGNhbGxQYXRoLCBmcyk7XG4gICAgICAgICAgICBjb25zdCBbZXhwcmVzc2lvbnNdID0gdW53cmFwU3Vic3RpdHV0aW9uc0Zyb21Mb2NhbGl6ZUNhbGwoY2FsbFBhdGgsIGZzKTtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zbGF0ZWQgPVxuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZShkaWFnbm9zdGljcywgdHJhbnNsYXRpb25zLCBtZXNzYWdlUGFydHMsIGV4cHJlc3Npb25zLCBtaXNzaW5nVHJhbnNsYXRpb24pO1xuICAgICAgICAgICAgY2FsbFBhdGgucmVwbGFjZVdpdGgoYnVpbGRMb2NhbGl6ZVJlcGxhY2VtZW50KHRyYW5zbGF0ZWRbMF0sIHRyYW5zbGF0ZWRbMV0pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBpZiAoaXNCYWJlbFBhcnNlRXJyb3IoZSkpIHtcbiAgICAgICAgICAgIGRpYWdub3N0aWNzLmVycm9yKGJ1aWxkQ29kZUZyYW1lRXJyb3IoZnMsIGNhbGxQYXRoLCBlKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuIl19
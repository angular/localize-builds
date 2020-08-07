(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/extract/source_files/es2015_extract_plugin", ["require", "exports", "@angular/localize", "@angular/localize/src/tools/src/source_file_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeEs2015ExtractPlugin = void 0;
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var localize_1 = require("@angular/localize");
    var source_file_utils_1 = require("@angular/localize/src/tools/src/source_file_utils");
    function makeEs2015ExtractPlugin(messages, localizeName) {
        if (localizeName === void 0) { localizeName = '$localize'; }
        return {
            visitor: {
                TaggedTemplateExpression: function (path) {
                    var tag = path.get('tag');
                    if (source_file_utils_1.isNamedIdentifier(tag, localizeName) && source_file_utils_1.isGlobalIdentifier(tag)) {
                        var messageParts = source_file_utils_1.unwrapMessagePartsFromTemplateLiteral(path.node.quasi.quasis);
                        var location = source_file_utils_1.getLocation(path.get('quasi'));
                        var message = localize_1.ɵparseMessage(messageParts, path.node.quasi.expressions, location);
                        messages.push(message);
                    }
                }
            }
        };
    }
    exports.makeEs2015ExtractPlugin = makeEs2015ExtractPlugin;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXMyMDE1X2V4dHJhY3RfcGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3Rvb2xzL3NyYy9leHRyYWN0L3NvdXJjZV9maWxlcy9lczIwMTVfZXh0cmFjdF9wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOENBQWdFO0lBSWhFLHVGQUFrSTtJQUVsSSxTQUFnQix1QkFBdUIsQ0FDbkMsUUFBMEIsRUFBRSxZQUEwQjtRQUExQiw2QkFBQSxFQUFBLDBCQUEwQjtRQUN4RCxPQUFPO1lBQ0wsT0FBTyxFQUFFO2dCQUNQLHdCQUF3QixFQUF4QixVQUF5QixJQUF3QztvQkFDL0QsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDNUIsSUFBSSxxQ0FBaUIsQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLElBQUksc0NBQWtCLENBQUMsR0FBRyxDQUFDLEVBQUU7d0JBQ25FLElBQU0sWUFBWSxHQUFHLHlEQUFxQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUNuRixJQUFNLFFBQVEsR0FBRywrQkFBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzt3QkFDaEQsSUFBTSxPQUFPLEdBQUcsd0JBQWEsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO3dCQUNuRixRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3FCQUN4QjtnQkFDSCxDQUFDO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQztJQWZELDBEQWVDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge8m1UGFyc2VkTWVzc2FnZSwgybVwYXJzZU1lc3NhZ2V9IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcbmltcG9ydCB7Tm9kZVBhdGgsIFBsdWdpbk9ian0gZnJvbSAnQGJhYmVsL2NvcmUnO1xuaW1wb3J0IHtUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb259IGZyb20gJ0BiYWJlbC90eXBlcyc7XG5cbmltcG9ydCB7Z2V0TG9jYXRpb24sIGlzR2xvYmFsSWRlbnRpZmllciwgaXNOYW1lZElkZW50aWZpZXIsIHVud3JhcE1lc3NhZ2VQYXJ0c0Zyb21UZW1wbGF0ZUxpdGVyYWx9IGZyb20gJy4uLy4uL3NvdXJjZV9maWxlX3V0aWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VFczIwMTVFeHRyYWN0UGx1Z2luKFxuICAgIG1lc3NhZ2VzOiDJtVBhcnNlZE1lc3NhZ2VbXSwgbG9jYWxpemVOYW1lID0gJyRsb2NhbGl6ZScpOiBQbHVnaW5PYmoge1xuICByZXR1cm4ge1xuICAgIHZpc2l0b3I6IHtcbiAgICAgIFRhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbihwYXRoOiBOb2RlUGF0aDxUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb24+KSB7XG4gICAgICAgIGNvbnN0IHRhZyA9IHBhdGguZ2V0KCd0YWcnKTtcbiAgICAgICAgaWYgKGlzTmFtZWRJZGVudGlmaWVyKHRhZywgbG9jYWxpemVOYW1lKSAmJiBpc0dsb2JhbElkZW50aWZpZXIodGFnKSkge1xuICAgICAgICAgIGNvbnN0IG1lc3NhZ2VQYXJ0cyA9IHVud3JhcE1lc3NhZ2VQYXJ0c0Zyb21UZW1wbGF0ZUxpdGVyYWwocGF0aC5ub2RlLnF1YXNpLnF1YXNpcyk7XG4gICAgICAgICAgY29uc3QgbG9jYXRpb24gPSBnZXRMb2NhdGlvbihwYXRoLmdldCgncXVhc2knKSk7XG4gICAgICAgICAgY29uc3QgbWVzc2FnZSA9IMm1cGFyc2VNZXNzYWdlKG1lc3NhZ2VQYXJ0cywgcGF0aC5ub2RlLnF1YXNpLmV4cHJlc3Npb25zLCBsb2NhdGlvbik7XG4gICAgICAgICAgbWVzc2FnZXMucHVzaChtZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cbiJdfQ==
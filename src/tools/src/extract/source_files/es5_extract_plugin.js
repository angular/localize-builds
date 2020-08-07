(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/extract/source_files/es5_extract_plugin", ["require", "exports", "@angular/localize", "@angular/localize/src/tools/src/source_file_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeEs5ExtractPlugin = void 0;
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var localize_1 = require("@angular/localize");
    var source_file_utils_1 = require("@angular/localize/src/tools/src/source_file_utils");
    function makeEs5ExtractPlugin(messages, localizeName) {
        if (localizeName === void 0) { localizeName = '$localize'; }
        return {
            visitor: {
                CallExpression: function (callPath) {
                    var calleePath = callPath.get('callee');
                    if (source_file_utils_1.isNamedIdentifier(calleePath, localizeName) && source_file_utils_1.isGlobalIdentifier(calleePath)) {
                        var messageParts = source_file_utils_1.unwrapMessagePartsFromLocalizeCall(callPath);
                        var expressions = source_file_utils_1.unwrapSubstitutionsFromLocalizeCall(callPath.node);
                        var location = source_file_utils_1.getLocation(callPath);
                        var message = localize_1.ɵparseMessage(messageParts, expressions, location);
                        messages.push(message);
                    }
                }
            }
        };
    }
    exports.makeEs5ExtractPlugin = makeEs5ExtractPlugin;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXM1X2V4dHJhY3RfcGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3Rvb2xzL3NyYy9leHRyYWN0L3NvdXJjZV9maWxlcy9lczVfZXh0cmFjdF9wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOENBQWdFO0lBSWhFLHVGQUFvSztJQUVwSyxTQUFnQixvQkFBb0IsQ0FDaEMsUUFBMEIsRUFBRSxZQUEwQjtRQUExQiw2QkFBQSxFQUFBLDBCQUEwQjtRQUN4RCxPQUFPO1lBQ0wsT0FBTyxFQUFFO2dCQUNQLGNBQWMsRUFBZCxVQUFlLFFBQWtDO29CQUMvQyxJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUMxQyxJQUFJLHFDQUFpQixDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsSUFBSSxzQ0FBa0IsQ0FBQyxVQUFVLENBQUMsRUFBRTt3QkFDakYsSUFBTSxZQUFZLEdBQUcsc0RBQWtDLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQ2xFLElBQU0sV0FBVyxHQUFHLHVEQUFtQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDdkUsSUFBTSxRQUFRLEdBQUcsK0JBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDdkMsSUFBTSxPQUFPLEdBQUcsd0JBQWEsQ0FBQyxZQUFZLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO3dCQUNuRSxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3FCQUN4QjtnQkFDSCxDQUFDO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQztJQWhCRCxvREFnQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7ybVQYXJzZWRNZXNzYWdlLCDJtXBhcnNlTWVzc2FnZX0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuaW1wb3J0IHtOb2RlUGF0aCwgUGx1Z2luT2JqfSBmcm9tICdAYmFiZWwvY29yZSc7XG5pbXBvcnQge0NhbGxFeHByZXNzaW9ufSBmcm9tICdAYmFiZWwvdHlwZXMnO1xuXG5pbXBvcnQge2dldExvY2F0aW9uLCBpc0dsb2JhbElkZW50aWZpZXIsIGlzTmFtZWRJZGVudGlmaWVyLCB1bndyYXBNZXNzYWdlUGFydHNGcm9tTG9jYWxpemVDYWxsLCB1bndyYXBTdWJzdGl0dXRpb25zRnJvbUxvY2FsaXplQ2FsbH0gZnJvbSAnLi4vLi4vc291cmNlX2ZpbGVfdXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gbWFrZUVzNUV4dHJhY3RQbHVnaW4oXG4gICAgbWVzc2FnZXM6IMm1UGFyc2VkTWVzc2FnZVtdLCBsb2NhbGl6ZU5hbWUgPSAnJGxvY2FsaXplJyk6IFBsdWdpbk9iaiB7XG4gIHJldHVybiB7XG4gICAgdmlzaXRvcjoge1xuICAgICAgQ2FsbEV4cHJlc3Npb24oY2FsbFBhdGg6IE5vZGVQYXRoPENhbGxFeHByZXNzaW9uPikge1xuICAgICAgICBjb25zdCBjYWxsZWVQYXRoID0gY2FsbFBhdGguZ2V0KCdjYWxsZWUnKTtcbiAgICAgICAgaWYgKGlzTmFtZWRJZGVudGlmaWVyKGNhbGxlZVBhdGgsIGxvY2FsaXplTmFtZSkgJiYgaXNHbG9iYWxJZGVudGlmaWVyKGNhbGxlZVBhdGgpKSB7XG4gICAgICAgICAgY29uc3QgbWVzc2FnZVBhcnRzID0gdW53cmFwTWVzc2FnZVBhcnRzRnJvbUxvY2FsaXplQ2FsbChjYWxsUGF0aCk7XG4gICAgICAgICAgY29uc3QgZXhwcmVzc2lvbnMgPSB1bndyYXBTdWJzdGl0dXRpb25zRnJvbUxvY2FsaXplQ2FsbChjYWxsUGF0aC5ub2RlKTtcbiAgICAgICAgICBjb25zdCBsb2NhdGlvbiA9IGdldExvY2F0aW9uKGNhbGxQYXRoKTtcbiAgICAgICAgICBjb25zdCBtZXNzYWdlID0gybVwYXJzZU1lc3NhZ2UobWVzc2FnZVBhcnRzLCBleHByZXNzaW9ucywgbG9jYXRpb24pO1xuICAgICAgICAgIG1lc3NhZ2VzLnB1c2gobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG4iXX0=
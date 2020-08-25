(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/extract/source_files/es5_extract_plugin", ["require", "exports", "tslib", "@angular/localize", "@angular/localize/src/tools/src/source_file_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeEs5ExtractPlugin = void 0;
    var tslib_1 = require("tslib");
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
                        var _a = tslib_1.__read(source_file_utils_1.unwrapMessagePartsFromLocalizeCall(callPath), 2), messageParts = _a[0], messagePartLocations = _a[1];
                        var _b = tslib_1.__read(source_file_utils_1.unwrapSubstitutionsFromLocalizeCall(callPath), 2), expressions = _b[0], expressionLocations = _b[1];
                        var _c = tslib_1.__read(callPath.get('arguments'), 2), messagePartsArg = _c[0], expressionsArg = _c[1];
                        var location = source_file_utils_1.getLocation(messagePartsArg, expressionsArg);
                        var message = localize_1.ɵparseMessage(messageParts, expressions, location, messagePartLocations, expressionLocations);
                        messages.push(message);
                    }
                }
            }
        };
    }
    exports.makeEs5ExtractPlugin = makeEs5ExtractPlugin;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXM1X2V4dHJhY3RfcGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3Rvb2xzL3NyYy9leHRyYWN0L3NvdXJjZV9maWxlcy9lczVfZXh0cmFjdF9wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDhDQUFnRTtJQUloRSx1RkFBb0s7SUFFcEssU0FBZ0Isb0JBQW9CLENBQ2hDLFFBQTBCLEVBQUUsWUFBMEI7UUFBMUIsNkJBQUEsRUFBQSwwQkFBMEI7UUFDeEQsT0FBTztZQUNMLE9BQU8sRUFBRTtnQkFDUCxjQUFjLEVBQWQsVUFBZSxRQUFrQztvQkFDL0MsSUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDMUMsSUFBSSxxQ0FBaUIsQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLElBQUksc0NBQWtCLENBQUMsVUFBVSxDQUFDLEVBQUU7d0JBQzNFLElBQUEsS0FBQSxlQUF1QyxzREFBa0MsQ0FBQyxRQUFRLENBQUMsSUFBQSxFQUFsRixZQUFZLFFBQUEsRUFBRSxvQkFBb0IsUUFBZ0QsQ0FBQzt3QkFDcEYsSUFBQSxLQUFBLGVBQXFDLHVEQUFtQyxDQUFDLFFBQVEsQ0FBQyxJQUFBLEVBQWpGLFdBQVcsUUFBQSxFQUFFLG1CQUFtQixRQUFpRCxDQUFDO3dCQUNuRixJQUFBLEtBQUEsZUFBb0MsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBQSxFQUE1RCxlQUFlLFFBQUEsRUFBRSxjQUFjLFFBQTZCLENBQUM7d0JBQ3BFLElBQU0sUUFBUSxHQUFHLCtCQUFXLENBQUMsZUFBZSxFQUFFLGNBQWMsQ0FBQyxDQUFDO3dCQUM5RCxJQUFNLE9BQU8sR0FBRyx3QkFBYSxDQUN6QixZQUFZLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxvQkFBb0IsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO3dCQUNwRixRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3FCQUN4QjtnQkFDSCxDQUFDO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQztJQWxCRCxvREFrQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7ybVQYXJzZWRNZXNzYWdlLCDJtXBhcnNlTWVzc2FnZX0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuaW1wb3J0IHtOb2RlUGF0aCwgUGx1Z2luT2JqfSBmcm9tICdAYmFiZWwvY29yZSc7XG5pbXBvcnQge0NhbGxFeHByZXNzaW9ufSBmcm9tICdAYmFiZWwvdHlwZXMnO1xuXG5pbXBvcnQge2dldExvY2F0aW9uLCBpc0dsb2JhbElkZW50aWZpZXIsIGlzTmFtZWRJZGVudGlmaWVyLCB1bndyYXBNZXNzYWdlUGFydHNGcm9tTG9jYWxpemVDYWxsLCB1bndyYXBTdWJzdGl0dXRpb25zRnJvbUxvY2FsaXplQ2FsbH0gZnJvbSAnLi4vLi4vc291cmNlX2ZpbGVfdXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gbWFrZUVzNUV4dHJhY3RQbHVnaW4oXG4gICAgbWVzc2FnZXM6IMm1UGFyc2VkTWVzc2FnZVtdLCBsb2NhbGl6ZU5hbWUgPSAnJGxvY2FsaXplJyk6IFBsdWdpbk9iaiB7XG4gIHJldHVybiB7XG4gICAgdmlzaXRvcjoge1xuICAgICAgQ2FsbEV4cHJlc3Npb24oY2FsbFBhdGg6IE5vZGVQYXRoPENhbGxFeHByZXNzaW9uPikge1xuICAgICAgICBjb25zdCBjYWxsZWVQYXRoID0gY2FsbFBhdGguZ2V0KCdjYWxsZWUnKTtcbiAgICAgICAgaWYgKGlzTmFtZWRJZGVudGlmaWVyKGNhbGxlZVBhdGgsIGxvY2FsaXplTmFtZSkgJiYgaXNHbG9iYWxJZGVudGlmaWVyKGNhbGxlZVBhdGgpKSB7XG4gICAgICAgICAgY29uc3QgW21lc3NhZ2VQYXJ0cywgbWVzc2FnZVBhcnRMb2NhdGlvbnNdID0gdW53cmFwTWVzc2FnZVBhcnRzRnJvbUxvY2FsaXplQ2FsbChjYWxsUGF0aCk7XG4gICAgICAgICAgY29uc3QgW2V4cHJlc3Npb25zLCBleHByZXNzaW9uTG9jYXRpb25zXSA9IHVud3JhcFN1YnN0aXR1dGlvbnNGcm9tTG9jYWxpemVDYWxsKGNhbGxQYXRoKTtcbiAgICAgICAgICBjb25zdCBbbWVzc2FnZVBhcnRzQXJnLCBleHByZXNzaW9uc0FyZ10gPSBjYWxsUGF0aC5nZXQoJ2FyZ3VtZW50cycpO1xuICAgICAgICAgIGNvbnN0IGxvY2F0aW9uID0gZ2V0TG9jYXRpb24obWVzc2FnZVBhcnRzQXJnLCBleHByZXNzaW9uc0FyZyk7XG4gICAgICAgICAgY29uc3QgbWVzc2FnZSA9IMm1cGFyc2VNZXNzYWdlKFxuICAgICAgICAgICAgICBtZXNzYWdlUGFydHMsIGV4cHJlc3Npb25zLCBsb2NhdGlvbiwgbWVzc2FnZVBhcnRMb2NhdGlvbnMsIGV4cHJlc3Npb25Mb2NhdGlvbnMpO1xuICAgICAgICAgIG1lc3NhZ2VzLnB1c2gobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG4iXX0=
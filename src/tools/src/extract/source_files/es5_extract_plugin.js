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
    var localize_1 = require("@angular/localize");
    var source_file_utils_1 = require("@angular/localize/src/tools/src/source_file_utils");
    function makeEs5ExtractPlugin(fs, messages, localizeName) {
        if (localizeName === void 0) { localizeName = '$localize'; }
        return {
            visitor: {
                CallExpression: function (callPath) {
                    var calleePath = callPath.get('callee');
                    if (source_file_utils_1.isNamedIdentifier(calleePath, localizeName) && source_file_utils_1.isGlobalIdentifier(calleePath)) {
                        var _a = tslib_1.__read(source_file_utils_1.unwrapMessagePartsFromLocalizeCall(callPath, fs), 2), messageParts = _a[0], messagePartLocations = _a[1];
                        var _b = tslib_1.__read(source_file_utils_1.unwrapSubstitutionsFromLocalizeCall(callPath, fs), 2), expressions = _b[0], expressionLocations = _b[1];
                        var _c = tslib_1.__read(callPath.get('arguments'), 2), messagePartsArg = _c[0], expressionsArg = _c[1];
                        var location = source_file_utils_1.getLocation(fs, messagePartsArg, expressionsArg);
                        var message = localize_1.ɵparseMessage(messageParts, expressions, location, messagePartLocations, expressionLocations);
                        messages.push(message);
                    }
                }
            }
        };
    }
    exports.makeEs5ExtractPlugin = makeEs5ExtractPlugin;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXM1X2V4dHJhY3RfcGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3Rvb2xzL3NyYy9leHRyYWN0L3NvdXJjZV9maWxlcy9lczVfZXh0cmFjdF9wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQVFBLDhDQUFnRTtJQUloRSx1RkFBb0s7SUFFcEssU0FBZ0Isb0JBQW9CLENBQ2hDLEVBQW9CLEVBQUUsUUFBMEIsRUFBRSxZQUEwQjtRQUExQiw2QkFBQSxFQUFBLDBCQUEwQjtRQUM5RSxPQUFPO1lBQ0wsT0FBTyxFQUFFO2dCQUNQLGNBQWMsRUFBZCxVQUFlLFFBQWtDO29CQUMvQyxJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUMxQyxJQUFJLHFDQUFpQixDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsSUFBSSxzQ0FBa0IsQ0FBQyxVQUFVLENBQUMsRUFBRTt3QkFDM0UsSUFBQSxLQUFBLGVBQ0Ysc0RBQWtDLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxJQUFBLEVBRDdDLFlBQVksUUFBQSxFQUFFLG9CQUFvQixRQUNXLENBQUM7d0JBQy9DLElBQUEsS0FBQSxlQUNGLHVEQUFtQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsSUFBQSxFQUQ5QyxXQUFXLFFBQUEsRUFBRSxtQkFBbUIsUUFDYyxDQUFDO3dCQUNoRCxJQUFBLEtBQUEsZUFBb0MsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBQSxFQUE1RCxlQUFlLFFBQUEsRUFBRSxjQUFjLFFBQTZCLENBQUM7d0JBQ3BFLElBQU0sUUFBUSxHQUFHLCtCQUFXLENBQUMsRUFBRSxFQUFFLGVBQWUsRUFBRSxjQUFjLENBQUMsQ0FBQzt3QkFDbEUsSUFBTSxPQUFPLEdBQUcsd0JBQWEsQ0FDekIsWUFBWSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsb0JBQW9CLEVBQUUsbUJBQW1CLENBQUMsQ0FBQzt3QkFDcEYsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztxQkFDeEI7Z0JBQ0gsQ0FBQzthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFwQkQsb0RBb0JDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge1BhdGhNYW5pcHVsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHvJtVBhcnNlZE1lc3NhZ2UsIMm1cGFyc2VNZXNzYWdlfSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5pbXBvcnQge05vZGVQYXRoLCBQbHVnaW5PYmp9IGZyb20gJ0BiYWJlbC9jb3JlJztcbmltcG9ydCB7Q2FsbEV4cHJlc3Npb259IGZyb20gJ0BiYWJlbC90eXBlcyc7XG5cbmltcG9ydCB7Z2V0TG9jYXRpb24sIGlzR2xvYmFsSWRlbnRpZmllciwgaXNOYW1lZElkZW50aWZpZXIsIHVud3JhcE1lc3NhZ2VQYXJ0c0Zyb21Mb2NhbGl6ZUNhbGwsIHVud3JhcFN1YnN0aXR1dGlvbnNGcm9tTG9jYWxpemVDYWxsfSBmcm9tICcuLi8uLi9zb3VyY2VfZmlsZV91dGlscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlRXM1RXh0cmFjdFBsdWdpbihcbiAgICBmczogUGF0aE1hbmlwdWxhdGlvbiwgbWVzc2FnZXM6IMm1UGFyc2VkTWVzc2FnZVtdLCBsb2NhbGl6ZU5hbWUgPSAnJGxvY2FsaXplJyk6IFBsdWdpbk9iaiB7XG4gIHJldHVybiB7XG4gICAgdmlzaXRvcjoge1xuICAgICAgQ2FsbEV4cHJlc3Npb24oY2FsbFBhdGg6IE5vZGVQYXRoPENhbGxFeHByZXNzaW9uPikge1xuICAgICAgICBjb25zdCBjYWxsZWVQYXRoID0gY2FsbFBhdGguZ2V0KCdjYWxsZWUnKTtcbiAgICAgICAgaWYgKGlzTmFtZWRJZGVudGlmaWVyKGNhbGxlZVBhdGgsIGxvY2FsaXplTmFtZSkgJiYgaXNHbG9iYWxJZGVudGlmaWVyKGNhbGxlZVBhdGgpKSB7XG4gICAgICAgICAgY29uc3QgW21lc3NhZ2VQYXJ0cywgbWVzc2FnZVBhcnRMb2NhdGlvbnNdID1cbiAgICAgICAgICAgICAgdW53cmFwTWVzc2FnZVBhcnRzRnJvbUxvY2FsaXplQ2FsbChjYWxsUGF0aCwgZnMpO1xuICAgICAgICAgIGNvbnN0IFtleHByZXNzaW9ucywgZXhwcmVzc2lvbkxvY2F0aW9uc10gPVxuICAgICAgICAgICAgICB1bndyYXBTdWJzdGl0dXRpb25zRnJvbUxvY2FsaXplQ2FsbChjYWxsUGF0aCwgZnMpO1xuICAgICAgICAgIGNvbnN0IFttZXNzYWdlUGFydHNBcmcsIGV4cHJlc3Npb25zQXJnXSA9IGNhbGxQYXRoLmdldCgnYXJndW1lbnRzJyk7XG4gICAgICAgICAgY29uc3QgbG9jYXRpb24gPSBnZXRMb2NhdGlvbihmcywgbWVzc2FnZVBhcnRzQXJnLCBleHByZXNzaW9uc0FyZyk7XG4gICAgICAgICAgY29uc3QgbWVzc2FnZSA9IMm1cGFyc2VNZXNzYWdlKFxuICAgICAgICAgICAgICBtZXNzYWdlUGFydHMsIGV4cHJlc3Npb25zLCBsb2NhdGlvbiwgbWVzc2FnZVBhcnRMb2NhdGlvbnMsIGV4cHJlc3Npb25Mb2NhdGlvbnMpO1xuICAgICAgICAgIG1lc3NhZ2VzLnB1c2gobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG4iXX0=
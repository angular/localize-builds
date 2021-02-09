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
                    try {
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
                    catch (e) {
                        if (source_file_utils_1.isBabelParseError(e)) {
                            // If we get a BabelParseError here then something went wrong with Babel itself
                            // since there must be something wrong with the structure of the AST generated
                            // by Babel parsing a TaggedTemplateExpression.
                            throw source_file_utils_1.buildCodeFrameError(callPath, e);
                        }
                        else {
                            throw e;
                        }
                    }
                }
            }
        };
    }
    exports.makeEs5ExtractPlugin = makeEs5ExtractPlugin;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXM1X2V4dHJhY3RfcGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3Rvb2xzL3NyYy9leHRyYWN0L3NvdXJjZV9maWxlcy9lczVfZXh0cmFjdF9wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQVFBLDhDQUFnRTtJQUloRSx1RkFBNE07SUFFNU0sU0FBZ0Isb0JBQW9CLENBQ2hDLEVBQW9CLEVBQUUsUUFBMEIsRUFBRSxZQUEwQjtRQUExQiw2QkFBQSxFQUFBLDBCQUEwQjtRQUM5RSxPQUFPO1lBQ0wsT0FBTyxFQUFFO2dCQUNQLGNBQWMsRUFBZCxVQUFlLFFBQWtDO29CQUMvQyxJQUFJO3dCQUNGLElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQzFDLElBQUkscUNBQWlCLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxJQUFJLHNDQUFrQixDQUFDLFVBQVUsQ0FBQyxFQUFFOzRCQUMzRSxJQUFBLEtBQUEsZUFDRixzREFBa0MsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLElBQUEsRUFEN0MsWUFBWSxRQUFBLEVBQUUsb0JBQW9CLFFBQ1csQ0FBQzs0QkFDL0MsSUFBQSxLQUFBLGVBQ0YsdURBQW1DLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxJQUFBLEVBRDlDLFdBQVcsUUFBQSxFQUFFLG1CQUFtQixRQUNjLENBQUM7NEJBQ2hELElBQUEsS0FBQSxlQUFvQyxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFBLEVBQTVELGVBQWUsUUFBQSxFQUFFLGNBQWMsUUFBNkIsQ0FBQzs0QkFDcEUsSUFBTSxRQUFRLEdBQUcsK0JBQVcsQ0FBQyxFQUFFLEVBQUUsZUFBZSxFQUFFLGNBQWMsQ0FBQyxDQUFDOzRCQUNsRSxJQUFNLE9BQU8sR0FBRyx3QkFBYSxDQUN6QixZQUFZLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxvQkFBb0IsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDOzRCQUNwRixRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3lCQUN4QjtxQkFDRjtvQkFBQyxPQUFPLENBQUMsRUFBRTt3QkFDVixJQUFJLHFDQUFpQixDQUFDLENBQUMsQ0FBQyxFQUFFOzRCQUN4QiwrRUFBK0U7NEJBQy9FLDhFQUE4RTs0QkFDOUUsK0NBQStDOzRCQUMvQyxNQUFNLHVDQUFtQixDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQzt5QkFDeEM7NkJBQU07NEJBQ0wsTUFBTSxDQUFDLENBQUM7eUJBQ1Q7cUJBQ0Y7Z0JBQ0gsQ0FBQzthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUEvQkQsb0RBK0JDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge1BhdGhNYW5pcHVsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHvJtVBhcnNlZE1lc3NhZ2UsIMm1cGFyc2VNZXNzYWdlfSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5pbXBvcnQge05vZGVQYXRoLCBQbHVnaW5PYmp9IGZyb20gJ0BiYWJlbC9jb3JlJztcbmltcG9ydCB7Q2FsbEV4cHJlc3Npb259IGZyb20gJ0BiYWJlbC90eXBlcyc7XG5cbmltcG9ydCB7YnVpbGRDb2RlRnJhbWVFcnJvciwgZ2V0TG9jYXRpb24sIGlzQmFiZWxQYXJzZUVycm9yLCBpc0dsb2JhbElkZW50aWZpZXIsIGlzTmFtZWRJZGVudGlmaWVyLCB1bndyYXBNZXNzYWdlUGFydHNGcm9tTG9jYWxpemVDYWxsLCB1bndyYXBTdWJzdGl0dXRpb25zRnJvbUxvY2FsaXplQ2FsbH0gZnJvbSAnLi4vLi4vc291cmNlX2ZpbGVfdXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gbWFrZUVzNUV4dHJhY3RQbHVnaW4oXG4gICAgZnM6IFBhdGhNYW5pcHVsYXRpb24sIG1lc3NhZ2VzOiDJtVBhcnNlZE1lc3NhZ2VbXSwgbG9jYWxpemVOYW1lID0gJyRsb2NhbGl6ZScpOiBQbHVnaW5PYmoge1xuICByZXR1cm4ge1xuICAgIHZpc2l0b3I6IHtcbiAgICAgIENhbGxFeHByZXNzaW9uKGNhbGxQYXRoOiBOb2RlUGF0aDxDYWxsRXhwcmVzc2lvbj4pIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBjYWxsZWVQYXRoID0gY2FsbFBhdGguZ2V0KCdjYWxsZWUnKTtcbiAgICAgICAgICBpZiAoaXNOYW1lZElkZW50aWZpZXIoY2FsbGVlUGF0aCwgbG9jYWxpemVOYW1lKSAmJiBpc0dsb2JhbElkZW50aWZpZXIoY2FsbGVlUGF0aCkpIHtcbiAgICAgICAgICAgIGNvbnN0IFttZXNzYWdlUGFydHMsIG1lc3NhZ2VQYXJ0TG9jYXRpb25zXSA9XG4gICAgICAgICAgICAgICAgdW53cmFwTWVzc2FnZVBhcnRzRnJvbUxvY2FsaXplQ2FsbChjYWxsUGF0aCwgZnMpO1xuICAgICAgICAgICAgY29uc3QgW2V4cHJlc3Npb25zLCBleHByZXNzaW9uTG9jYXRpb25zXSA9XG4gICAgICAgICAgICAgICAgdW53cmFwU3Vic3RpdHV0aW9uc0Zyb21Mb2NhbGl6ZUNhbGwoY2FsbFBhdGgsIGZzKTtcbiAgICAgICAgICAgIGNvbnN0IFttZXNzYWdlUGFydHNBcmcsIGV4cHJlc3Npb25zQXJnXSA9IGNhbGxQYXRoLmdldCgnYXJndW1lbnRzJyk7XG4gICAgICAgICAgICBjb25zdCBsb2NhdGlvbiA9IGdldExvY2F0aW9uKGZzLCBtZXNzYWdlUGFydHNBcmcsIGV4cHJlc3Npb25zQXJnKTtcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSDJtXBhcnNlTWVzc2FnZShcbiAgICAgICAgICAgICAgICBtZXNzYWdlUGFydHMsIGV4cHJlc3Npb25zLCBsb2NhdGlvbiwgbWVzc2FnZVBhcnRMb2NhdGlvbnMsIGV4cHJlc3Npb25Mb2NhdGlvbnMpO1xuICAgICAgICAgICAgbWVzc2FnZXMucHVzaChtZXNzYWdlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBpZiAoaXNCYWJlbFBhcnNlRXJyb3IoZSkpIHtcbiAgICAgICAgICAgIC8vIElmIHdlIGdldCBhIEJhYmVsUGFyc2VFcnJvciBoZXJlIHRoZW4gc29tZXRoaW5nIHdlbnQgd3Jvbmcgd2l0aCBCYWJlbCBpdHNlbGZcbiAgICAgICAgICAgIC8vIHNpbmNlIHRoZXJlIG11c3QgYmUgc29tZXRoaW5nIHdyb25nIHdpdGggdGhlIHN0cnVjdHVyZSBvZiB0aGUgQVNUIGdlbmVyYXRlZFxuICAgICAgICAgICAgLy8gYnkgQmFiZWwgcGFyc2luZyBhIFRhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbi5cbiAgICAgICAgICAgIHRocm93IGJ1aWxkQ29kZUZyYW1lRXJyb3IoY2FsbFBhdGgsIGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cbiJdfQ==
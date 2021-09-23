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
                        if ((0, source_file_utils_1.isNamedIdentifier)(calleePath, localizeName) && (0, source_file_utils_1.isGlobalIdentifier)(calleePath)) {
                            var _a = (0, tslib_1.__read)((0, source_file_utils_1.unwrapMessagePartsFromLocalizeCall)(callPath, fs), 2), messageParts = _a[0], messagePartLocations = _a[1];
                            var _b = (0, tslib_1.__read)((0, source_file_utils_1.unwrapSubstitutionsFromLocalizeCall)(callPath, fs), 2), expressions = _b[0], expressionLocations = _b[1];
                            var _c = (0, tslib_1.__read)(callPath.get('arguments'), 2), messagePartsArg = _c[0], expressionsArg = _c[1];
                            var location = (0, source_file_utils_1.getLocation)(fs, messagePartsArg, expressionsArg);
                            var message = (0, localize_1.ɵparseMessage)(messageParts, expressions, location, messagePartLocations, expressionLocations);
                            messages.push(message);
                        }
                    }
                    catch (e) {
                        if ((0, source_file_utils_1.isBabelParseError)(e)) {
                            // If we get a BabelParseError here then something went wrong with Babel itself
                            // since there must be something wrong with the structure of the AST generated
                            // by Babel parsing a TaggedTemplateExpression.
                            throw (0, source_file_utils_1.buildCodeFrameError)(fs, callPath, e);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXM1X2V4dHJhY3RfcGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3Rvb2xzL3NyYy9leHRyYWN0L3NvdXJjZV9maWxlcy9lczVfZXh0cmFjdF9wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQVFBLDhDQUFnRTtJQUloRSx1RkFBNE07SUFFNU0sU0FBZ0Isb0JBQW9CLENBQ2hDLEVBQW9CLEVBQUUsUUFBMEIsRUFBRSxZQUEwQjtRQUExQiw2QkFBQSxFQUFBLDBCQUEwQjtRQUM5RSxPQUFPO1lBQ0wsT0FBTyxFQUFFO2dCQUNQLGNBQWMsRUFBZCxVQUFlLFFBQWtDO29CQUMvQyxJQUFJO3dCQUNGLElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQzFDLElBQUksSUFBQSxxQ0FBaUIsRUFBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLElBQUksSUFBQSxzQ0FBa0IsRUFBQyxVQUFVLENBQUMsRUFBRTs0QkFDM0UsSUFBQSxLQUFBLG9CQUNGLElBQUEsc0RBQWtDLEVBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxJQUFBLEVBRDdDLFlBQVksUUFBQSxFQUFFLG9CQUFvQixRQUNXLENBQUM7NEJBQy9DLElBQUEsS0FBQSxvQkFDRixJQUFBLHVEQUFtQyxFQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsSUFBQSxFQUQ5QyxXQUFXLFFBQUEsRUFBRSxtQkFBbUIsUUFDYyxDQUFDOzRCQUNoRCxJQUFBLEtBQUEsb0JBQW9DLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUEsRUFBNUQsZUFBZSxRQUFBLEVBQUUsY0FBYyxRQUE2QixDQUFDOzRCQUNwRSxJQUFNLFFBQVEsR0FBRyxJQUFBLCtCQUFXLEVBQUMsRUFBRSxFQUFFLGVBQWUsRUFBRSxjQUFjLENBQUMsQ0FBQzs0QkFDbEUsSUFBTSxPQUFPLEdBQUcsSUFBQSx3QkFBYSxFQUN6QixZQUFZLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxvQkFBb0IsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDOzRCQUNwRixRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3lCQUN4QjtxQkFDRjtvQkFBQyxPQUFPLENBQUMsRUFBRTt3QkFDVixJQUFJLElBQUEscUNBQWlCLEVBQUMsQ0FBQyxDQUFDLEVBQUU7NEJBQ3hCLCtFQUErRTs0QkFDL0UsOEVBQThFOzRCQUM5RSwrQ0FBK0M7NEJBQy9DLE1BQU0sSUFBQSx1Q0FBbUIsRUFBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO3lCQUM1Qzs2QkFBTTs0QkFDTCxNQUFNLENBQUMsQ0FBQzt5QkFDVDtxQkFDRjtnQkFDSCxDQUFDO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQztJQS9CRCxvREErQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7UGF0aE1hbmlwdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQge8m1UGFyc2VkTWVzc2FnZSwgybVwYXJzZU1lc3NhZ2V9IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcbmltcG9ydCB7Tm9kZVBhdGgsIFBsdWdpbk9ian0gZnJvbSAnQGJhYmVsL2NvcmUnO1xuaW1wb3J0IHtDYWxsRXhwcmVzc2lvbn0gZnJvbSAnQGJhYmVsL3R5cGVzJztcblxuaW1wb3J0IHtidWlsZENvZGVGcmFtZUVycm9yLCBnZXRMb2NhdGlvbiwgaXNCYWJlbFBhcnNlRXJyb3IsIGlzR2xvYmFsSWRlbnRpZmllciwgaXNOYW1lZElkZW50aWZpZXIsIHVud3JhcE1lc3NhZ2VQYXJ0c0Zyb21Mb2NhbGl6ZUNhbGwsIHVud3JhcFN1YnN0aXR1dGlvbnNGcm9tTG9jYWxpemVDYWxsfSBmcm9tICcuLi8uLi9zb3VyY2VfZmlsZV91dGlscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlRXM1RXh0cmFjdFBsdWdpbihcbiAgICBmczogUGF0aE1hbmlwdWxhdGlvbiwgbWVzc2FnZXM6IMm1UGFyc2VkTWVzc2FnZVtdLCBsb2NhbGl6ZU5hbWUgPSAnJGxvY2FsaXplJyk6IFBsdWdpbk9iaiB7XG4gIHJldHVybiB7XG4gICAgdmlzaXRvcjoge1xuICAgICAgQ2FsbEV4cHJlc3Npb24oY2FsbFBhdGg6IE5vZGVQYXRoPENhbGxFeHByZXNzaW9uPikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGNhbGxlZVBhdGggPSBjYWxsUGF0aC5nZXQoJ2NhbGxlZScpO1xuICAgICAgICAgIGlmIChpc05hbWVkSWRlbnRpZmllcihjYWxsZWVQYXRoLCBsb2NhbGl6ZU5hbWUpICYmIGlzR2xvYmFsSWRlbnRpZmllcihjYWxsZWVQYXRoKSkge1xuICAgICAgICAgICAgY29uc3QgW21lc3NhZ2VQYXJ0cywgbWVzc2FnZVBhcnRMb2NhdGlvbnNdID1cbiAgICAgICAgICAgICAgICB1bndyYXBNZXNzYWdlUGFydHNGcm9tTG9jYWxpemVDYWxsKGNhbGxQYXRoLCBmcyk7XG4gICAgICAgICAgICBjb25zdCBbZXhwcmVzc2lvbnMsIGV4cHJlc3Npb25Mb2NhdGlvbnNdID1cbiAgICAgICAgICAgICAgICB1bndyYXBTdWJzdGl0dXRpb25zRnJvbUxvY2FsaXplQ2FsbChjYWxsUGF0aCwgZnMpO1xuICAgICAgICAgICAgY29uc3QgW21lc3NhZ2VQYXJ0c0FyZywgZXhwcmVzc2lvbnNBcmddID0gY2FsbFBhdGguZ2V0KCdhcmd1bWVudHMnKTtcbiAgICAgICAgICAgIGNvbnN0IGxvY2F0aW9uID0gZ2V0TG9jYXRpb24oZnMsIG1lc3NhZ2VQYXJ0c0FyZywgZXhwcmVzc2lvbnNBcmcpO1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IMm1cGFyc2VNZXNzYWdlKFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VQYXJ0cywgZXhwcmVzc2lvbnMsIGxvY2F0aW9uLCBtZXNzYWdlUGFydExvY2F0aW9ucywgZXhwcmVzc2lvbkxvY2F0aW9ucyk7XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG1lc3NhZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGlmIChpc0JhYmVsUGFyc2VFcnJvcihlKSkge1xuICAgICAgICAgICAgLy8gSWYgd2UgZ2V0IGEgQmFiZWxQYXJzZUVycm9yIGhlcmUgdGhlbiBzb21ldGhpbmcgd2VudCB3cm9uZyB3aXRoIEJhYmVsIGl0c2VsZlxuICAgICAgICAgICAgLy8gc2luY2UgdGhlcmUgbXVzdCBiZSBzb21ldGhpbmcgd3Jvbmcgd2l0aCB0aGUgc3RydWN0dXJlIG9mIHRoZSBBU1QgZ2VuZXJhdGVkXG4gICAgICAgICAgICAvLyBieSBCYWJlbCBwYXJzaW5nIGEgVGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9uLlxuICAgICAgICAgICAgdGhyb3cgYnVpbGRDb2RlRnJhbWVFcnJvcihmcywgY2FsbFBhdGgsIGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cbiJdfQ==
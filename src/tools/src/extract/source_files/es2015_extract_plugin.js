(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/extract/source_files/es2015_extract_plugin", ["require", "exports", "tslib", "@angular/localize", "@angular/localize/src/tools/src/source_file_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeEs2015ExtractPlugin = void 0;
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
    function makeEs2015ExtractPlugin(messages, localizeName) {
        if (localizeName === void 0) { localizeName = '$localize'; }
        return {
            visitor: {
                TaggedTemplateExpression: function (path) {
                    var tag = path.get('tag');
                    if (source_file_utils_1.isNamedIdentifier(tag, localizeName) && source_file_utils_1.isGlobalIdentifier(tag)) {
                        var quasiPath = path.get('quasi');
                        var _a = tslib_1.__read(source_file_utils_1.unwrapMessagePartsFromTemplateLiteral(quasiPath.get('quasis')), 2), messageParts = _a[0], messagePartLocations = _a[1];
                        var _b = tslib_1.__read(source_file_utils_1.unwrapExpressionsFromTemplateLiteral(quasiPath), 2), expressions = _b[0], expressionLocations = _b[1];
                        var location = source_file_utils_1.getLocation(quasiPath);
                        var message = localize_1.ɵparseMessage(messageParts, expressions, location, messagePartLocations, expressionLocations);
                        messages.push(message);
                    }
                }
            }
        };
    }
    exports.makeEs2015ExtractPlugin = makeEs2015ExtractPlugin;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXMyMDE1X2V4dHJhY3RfcGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3Rvb2xzL3NyYy9leHRyYWN0L3NvdXJjZV9maWxlcy9lczIwMTVfZXh0cmFjdF9wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDhDQUFnRTtJQUloRSx1RkFBd0s7SUFFeEssU0FBZ0IsdUJBQXVCLENBQ25DLFFBQTBCLEVBQUUsWUFBMEI7UUFBMUIsNkJBQUEsRUFBQSwwQkFBMEI7UUFDeEQsT0FBTztZQUNMLE9BQU8sRUFBRTtnQkFDUCx3QkFBd0IsRUFBeEIsVUFBeUIsSUFBd0M7b0JBQy9ELElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzVCLElBQUkscUNBQWlCLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxJQUFJLHNDQUFrQixDQUFDLEdBQUcsQ0FBQyxFQUFFO3dCQUNuRSxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUM5QixJQUFBLEtBQUEsZUFDRix5REFBcUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUEsRUFEM0QsWUFBWSxRQUFBLEVBQUUsb0JBQW9CLFFBQ3lCLENBQUM7d0JBQzdELElBQUEsS0FBQSxlQUNGLHdEQUFvQyxDQUFDLFNBQVMsQ0FBQyxJQUFBLEVBRDVDLFdBQVcsUUFBQSxFQUFFLG1CQUFtQixRQUNZLENBQUM7d0JBQ3BELElBQU0sUUFBUSxHQUFHLCtCQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQ3hDLElBQU0sT0FBTyxHQUFHLHdCQUFhLENBQ3pCLFlBQVksRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLG9CQUFvQixFQUFFLG1CQUFtQixDQUFDLENBQUM7d0JBQ3BGLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7cUJBQ3hCO2dCQUNILENBQUM7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDO0lBcEJELDBEQW9CQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHvJtVBhcnNlZE1lc3NhZ2UsIMm1cGFyc2VNZXNzYWdlfSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5pbXBvcnQge05vZGVQYXRoLCBQbHVnaW5PYmp9IGZyb20gJ0BiYWJlbC9jb3JlJztcbmltcG9ydCB7VGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9ufSBmcm9tICdAYmFiZWwvdHlwZXMnO1xuXG5pbXBvcnQge2dldExvY2F0aW9uLCBpc0dsb2JhbElkZW50aWZpZXIsIGlzTmFtZWRJZGVudGlmaWVyLCB1bndyYXBFeHByZXNzaW9uc0Zyb21UZW1wbGF0ZUxpdGVyYWwsIHVud3JhcE1lc3NhZ2VQYXJ0c0Zyb21UZW1wbGF0ZUxpdGVyYWx9IGZyb20gJy4uLy4uL3NvdXJjZV9maWxlX3V0aWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VFczIwMTVFeHRyYWN0UGx1Z2luKFxuICAgIG1lc3NhZ2VzOiDJtVBhcnNlZE1lc3NhZ2VbXSwgbG9jYWxpemVOYW1lID0gJyRsb2NhbGl6ZScpOiBQbHVnaW5PYmoge1xuICByZXR1cm4ge1xuICAgIHZpc2l0b3I6IHtcbiAgICAgIFRhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbihwYXRoOiBOb2RlUGF0aDxUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb24+KSB7XG4gICAgICAgIGNvbnN0IHRhZyA9IHBhdGguZ2V0KCd0YWcnKTtcbiAgICAgICAgaWYgKGlzTmFtZWRJZGVudGlmaWVyKHRhZywgbG9jYWxpemVOYW1lKSAmJiBpc0dsb2JhbElkZW50aWZpZXIodGFnKSkge1xuICAgICAgICAgIGNvbnN0IHF1YXNpUGF0aCA9IHBhdGguZ2V0KCdxdWFzaScpO1xuICAgICAgICAgIGNvbnN0IFttZXNzYWdlUGFydHMsIG1lc3NhZ2VQYXJ0TG9jYXRpb25zXSA9XG4gICAgICAgICAgICAgIHVud3JhcE1lc3NhZ2VQYXJ0c0Zyb21UZW1wbGF0ZUxpdGVyYWwocXVhc2lQYXRoLmdldCgncXVhc2lzJykpO1xuICAgICAgICAgIGNvbnN0IFtleHByZXNzaW9ucywgZXhwcmVzc2lvbkxvY2F0aW9uc10gPVxuICAgICAgICAgICAgICB1bndyYXBFeHByZXNzaW9uc0Zyb21UZW1wbGF0ZUxpdGVyYWwocXVhc2lQYXRoKTtcbiAgICAgICAgICBjb25zdCBsb2NhdGlvbiA9IGdldExvY2F0aW9uKHF1YXNpUGF0aCk7XG4gICAgICAgICAgY29uc3QgbWVzc2FnZSA9IMm1cGFyc2VNZXNzYWdlKFxuICAgICAgICAgICAgICBtZXNzYWdlUGFydHMsIGV4cHJlc3Npb25zLCBsb2NhdGlvbiwgbWVzc2FnZVBhcnRMb2NhdGlvbnMsIGV4cHJlc3Npb25Mb2NhdGlvbnMpO1xuICAgICAgICAgIG1lc3NhZ2VzLnB1c2gobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG4iXX0=
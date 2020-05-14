(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_parse_error", ["require", "exports", "tslib", "@angular/compiler"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TranslationParseError = void 0;
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var compiler_1 = require("@angular/compiler");
    /**
     * This error is thrown when there is a problem parsing a translation file.
     */
    var TranslationParseError = /** @class */ (function (_super) {
        tslib_1.__extends(TranslationParseError, _super);
        function TranslationParseError(span, msg, level) {
            if (level === void 0) { level = compiler_1.ParseErrorLevel.ERROR; }
            var _this = _super.call(this, msg) || this;
            _this.span = span;
            _this.msg = msg;
            _this.level = level;
            return _this;
        }
        TranslationParseError.prototype.contextualMessage = function () {
            var ctx = this.span.start.getContext(100, 3);
            return ctx ? this.msg + " (\"" + ctx.before + "[" + compiler_1.ParseErrorLevel[this.level] + " ->]" + ctx.after + "\")" :
                this.msg;
        };
        TranslationParseError.prototype.toString = function () {
            var details = this.span.details ? ", " + this.span.details : '';
            return this.contextualMessage() + ": " + this.span.start + details;
        };
        return TranslationParseError;
    }(Error));
    exports.TranslationParseError = TranslationParseError;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRpb25fcGFyc2VfZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9wYXJzZXJzL3RyYW5zbGF0aW9uX3BhcnNlX2Vycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCw4Q0FBbUU7SUFFbkU7O09BRUc7SUFDSDtRQUEyQyxpREFBSztRQUM5QywrQkFDVyxJQUFxQixFQUFTLEdBQVcsRUFDekMsS0FBOEM7WUFBOUMsc0JBQUEsRUFBQSxRQUF5QiwwQkFBZSxDQUFDLEtBQUs7WUFGekQsWUFHRSxrQkFBTSxHQUFHLENBQUMsU0FDWDtZQUhVLFVBQUksR0FBSixJQUFJLENBQWlCO1lBQVMsU0FBRyxHQUFILEdBQUcsQ0FBUTtZQUN6QyxXQUFLLEdBQUwsS0FBSyxDQUF5Qzs7UUFFekQsQ0FBQztRQUVELGlEQUFpQixHQUFqQjtZQUNFLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDL0MsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFJLElBQUksQ0FBQyxHQUFHLFlBQU0sR0FBRyxDQUFDLE1BQU0sU0FBSSwwQkFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBTyxHQUFHLENBQUMsS0FBSyxRQUFJLENBQUMsQ0FBQztnQkFDaEYsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUN4QixDQUFDO1FBRUQsd0NBQVEsR0FBUjtZQUNFLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDbEUsT0FBVSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsVUFBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFTLENBQUM7UUFDckUsQ0FBQztRQUNILDRCQUFDO0lBQUQsQ0FBQyxBQWpCRCxDQUEyQyxLQUFLLEdBaUIvQztJQWpCWSxzREFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge1BhcnNlRXJyb3JMZXZlbCwgUGFyc2VTb3VyY2VTcGFufSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5cbi8qKlxuICogVGhpcyBlcnJvciBpcyB0aHJvd24gd2hlbiB0aGVyZSBpcyBhIHByb2JsZW0gcGFyc2luZyBhIHRyYW5zbGF0aW9uIGZpbGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBUcmFuc2xhdGlvblBhcnNlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIHNwYW46IFBhcnNlU291cmNlU3BhbiwgcHVibGljIG1zZzogc3RyaW5nLFxuICAgICAgcHVibGljIGxldmVsOiBQYXJzZUVycm9yTGV2ZWwgPSBQYXJzZUVycm9yTGV2ZWwuRVJST1IpIHtcbiAgICBzdXBlcihtc2cpO1xuICB9XG5cbiAgY29udGV4dHVhbE1lc3NhZ2UoKTogc3RyaW5nIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLnNwYW4uc3RhcnQuZ2V0Q29udGV4dCgxMDAsIDMpO1xuICAgIHJldHVybiBjdHggPyBgJHt0aGlzLm1zZ30gKFwiJHtjdHguYmVmb3JlfVske1BhcnNlRXJyb3JMZXZlbFt0aGlzLmxldmVsXX0gLT5dJHtjdHguYWZ0ZXJ9XCIpYCA6XG4gICAgICAgICAgICAgICAgIHRoaXMubXNnO1xuICB9XG5cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICBjb25zdCBkZXRhaWxzID0gdGhpcy5zcGFuLmRldGFpbHMgPyBgLCAke3RoaXMuc3Bhbi5kZXRhaWxzfWAgOiAnJztcbiAgICByZXR1cm4gYCR7dGhpcy5jb250ZXh0dWFsTWVzc2FnZSgpfTogJHt0aGlzLnNwYW4uc3RhcnR9JHtkZXRhaWxzfWA7XG4gIH1cbn1cbiJdfQ==
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/diagnostics", ["require", "exports", "tslib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Diagnostics = void 0;
    var tslib_1 = require("tslib");
    /**
     * This class is used to collect and then report warnings and errors that occur during the execution
     * of the tools.
     */
    var Diagnostics = /** @class */ (function () {
        function Diagnostics() {
            this.messages = [];
        }
        Object.defineProperty(Diagnostics.prototype, "hasErrors", {
            get: function () {
                return this.messages.some(function (m) { return m.type === 'error'; });
            },
            enumerable: false,
            configurable: true
        });
        Diagnostics.prototype.add = function (type, message) {
            if (type !== 'ignore') {
                this.messages.push({ type: type, message: message });
            }
        };
        Diagnostics.prototype.warn = function (message) {
            this.messages.push({ type: 'warning', message: message });
        };
        Diagnostics.prototype.error = function (message) {
            this.messages.push({ type: 'error', message: message });
        };
        Diagnostics.prototype.merge = function (other) {
            var _a;
            (_a = this.messages).push.apply(_a, tslib_1.__spread(other.messages));
        };
        Diagnostics.prototype.formatDiagnostics = function (message) {
            var errors = this.messages.filter(function (d) { return d.type === 'error'; }).map(function (d) { return ' - ' + d.message; });
            var warnings = this.messages.filter(function (d) { return d.type === 'warning'; }).map(function (d) { return ' - ' + d.message; });
            if (errors.length) {
                message += '\nERRORS:\n' + errors.join('\n');
            }
            if (warnings.length) {
                message += '\nWARNINGS:\n' + warnings.join('\n');
            }
            return message;
        };
        return Diagnostics;
    }());
    exports.Diagnostics = Diagnostics;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhZ25vc3RpY3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2RpYWdub3N0aWNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7SUFPSDs7O09BR0c7SUFDSDtRQUFBO1lBQ1csYUFBUSxHQUFpRCxFQUFFLENBQUM7UUE2QnZFLENBQUM7UUE1QkMsc0JBQUksa0NBQVM7aUJBQWI7Z0JBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFsQixDQUFrQixDQUFDLENBQUM7WUFDckQsQ0FBQzs7O1dBQUE7UUFDRCx5QkFBRyxHQUFILFVBQUksSUFBZ0MsRUFBRSxPQUFlO1lBQ25ELElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRTtnQkFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLE1BQUEsRUFBRSxPQUFPLFNBQUEsRUFBQyxDQUFDLENBQUM7YUFDckM7UUFDSCxDQUFDO1FBQ0QsMEJBQUksR0FBSixVQUFLLE9BQWU7WUFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sU0FBQSxFQUFDLENBQUMsQ0FBQztRQUNqRCxDQUFDO1FBQ0QsMkJBQUssR0FBTCxVQUFNLE9BQWU7WUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sU0FBQSxFQUFDLENBQUMsQ0FBQztRQUMvQyxDQUFDO1FBQ0QsMkJBQUssR0FBTCxVQUFNLEtBQWtCOztZQUN0QixDQUFBLEtBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQSxDQUFDLElBQUksNEJBQUksS0FBSyxDQUFDLFFBQVEsR0FBRTtRQUN4QyxDQUFDO1FBQ0QsdUNBQWlCLEdBQWpCLFVBQWtCLE9BQWU7WUFDL0IsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVMsQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBbEIsQ0FBa0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFqQixDQUFpQixDQUFDLENBQUM7WUFDMUYsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVMsQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFqQixDQUFpQixDQUFDLENBQUM7WUFDOUYsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO2dCQUNqQixPQUFPLElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDOUM7WUFDRCxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7Z0JBQ25CLE9BQU8sSUFBSSxlQUFlLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNsRDtZQUNELE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFDSCxrQkFBQztJQUFELENBQUMsQUE5QkQsSUE4QkM7SUE5Qlksa0NBQVciLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKlxuICogSG93IHRvIGhhbmRsZSBwb3RlbnRpYWwgZGlhZ25vc3RpY3MuXG4gKi9cbmV4cG9ydCB0eXBlIERpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5ID0gJ2Vycm9yJ3wnd2FybmluZyd8J2lnbm9yZSc7XG5cbi8qKlxuICogVGhpcyBjbGFzcyBpcyB1c2VkIHRvIGNvbGxlY3QgYW5kIHRoZW4gcmVwb3J0IHdhcm5pbmdzIGFuZCBlcnJvcnMgdGhhdCBvY2N1ciBkdXJpbmcgdGhlIGV4ZWN1dGlvblxuICogb2YgdGhlIHRvb2xzLlxuICovXG5leHBvcnQgY2xhc3MgRGlhZ25vc3RpY3Mge1xuICByZWFkb25seSBtZXNzYWdlczoge3R5cGU6ICd3YXJuaW5nJ3wnZXJyb3InLCBtZXNzYWdlOiBzdHJpbmd9W10gPSBbXTtcbiAgZ2V0IGhhc0Vycm9ycygpIHtcbiAgICByZXR1cm4gdGhpcy5tZXNzYWdlcy5zb21lKG0gPT4gbS50eXBlID09PSAnZXJyb3InKTtcbiAgfVxuICBhZGQodHlwZTogRGlhZ25vc3RpY0hhbmRsaW5nU3RyYXRlZ3ksIG1lc3NhZ2U6IHN0cmluZykge1xuICAgIGlmICh0eXBlICE9PSAnaWdub3JlJykge1xuICAgICAgdGhpcy5tZXNzYWdlcy5wdXNoKHt0eXBlLCBtZXNzYWdlfSk7XG4gICAgfVxuICB9XG4gIHdhcm4obWVzc2FnZTogc3RyaW5nKSB7XG4gICAgdGhpcy5tZXNzYWdlcy5wdXNoKHt0eXBlOiAnd2FybmluZycsIG1lc3NhZ2V9KTtcbiAgfVxuICBlcnJvcihtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICB0aGlzLm1lc3NhZ2VzLnB1c2goe3R5cGU6ICdlcnJvcicsIG1lc3NhZ2V9KTtcbiAgfVxuICBtZXJnZShvdGhlcjogRGlhZ25vc3RpY3MpIHtcbiAgICB0aGlzLm1lc3NhZ2VzLnB1c2goLi4ub3RoZXIubWVzc2FnZXMpO1xuICB9XG4gIGZvcm1hdERpYWdub3N0aWNzKG1lc3NhZ2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgZXJyb3JzID0gdGhpcy5tZXNzYWdlcyEuZmlsdGVyKGQgPT4gZC50eXBlID09PSAnZXJyb3InKS5tYXAoZCA9PiAnIC0gJyArIGQubWVzc2FnZSk7XG4gICAgY29uc3Qgd2FybmluZ3MgPSB0aGlzLm1lc3NhZ2VzIS5maWx0ZXIoZCA9PiBkLnR5cGUgPT09ICd3YXJuaW5nJykubWFwKGQgPT4gJyAtICcgKyBkLm1lc3NhZ2UpO1xuICAgIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgICBtZXNzYWdlICs9ICdcXG5FUlJPUlM6XFxuJyArIGVycm9ycy5qb2luKCdcXG4nKTtcbiAgICB9XG4gICAgaWYgKHdhcm5pbmdzLmxlbmd0aCkge1xuICAgICAgbWVzc2FnZSArPSAnXFxuV0FSTklOR1M6XFxuJyArIHdhcm5pbmdzLmpvaW4oJ1xcbicpO1xuICAgIH1cbiAgICByZXR1cm4gbWVzc2FnZTtcbiAgfVxufVxuIl19
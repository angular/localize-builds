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
            enumerable: true,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhZ25vc3RpY3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2RpYWdub3N0aWNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQU9IOzs7T0FHRztJQUNIO1FBQUE7WUFDVyxhQUFRLEdBQWlELEVBQUUsQ0FBQztRQTZCdkUsQ0FBQztRQTVCQyxzQkFBSSxrQ0FBUztpQkFBYjtnQkFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyxPQUFPLEVBQWxCLENBQWtCLENBQUMsQ0FBQztZQUNyRCxDQUFDOzs7V0FBQTtRQUNELHlCQUFHLEdBQUgsVUFBSSxJQUFnQyxFQUFFLE9BQWU7WUFDbkQsSUFBSSxJQUFJLEtBQUssUUFBUSxFQUFFO2dCQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksTUFBQSxFQUFFLE9BQU8sU0FBQSxFQUFDLENBQUMsQ0FBQzthQUNyQztRQUNILENBQUM7UUFDRCwwQkFBSSxHQUFKLFVBQUssT0FBZTtZQUNsQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxTQUFBLEVBQUMsQ0FBQyxDQUFDO1FBQ2pELENBQUM7UUFDRCwyQkFBSyxHQUFMLFVBQU0sT0FBZTtZQUNuQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxTQUFBLEVBQUMsQ0FBQyxDQUFDO1FBQy9DLENBQUM7UUFDRCwyQkFBSyxHQUFMLFVBQU0sS0FBa0I7O1lBQ3RCLENBQUEsS0FBQSxJQUFJLENBQUMsUUFBUSxDQUFBLENBQUMsSUFBSSw0QkFBSSxLQUFLLENBQUMsUUFBUSxHQUFFO1FBQ3hDLENBQUM7UUFDRCx1Q0FBaUIsR0FBakIsVUFBa0IsT0FBZTtZQUMvQixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUyxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFsQixDQUFrQixDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQWpCLENBQWlCLENBQUMsQ0FBQztZQUMxRixJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUyxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFwQixDQUFvQixDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQWpCLENBQWlCLENBQUMsQ0FBQztZQUM5RixJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7Z0JBQ2pCLE9BQU8sSUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM5QztZQUNELElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtnQkFDbkIsT0FBTyxJQUFJLGVBQWUsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2xEO1lBQ0QsT0FBTyxPQUFPLENBQUM7UUFDakIsQ0FBQztRQUNILGtCQUFDO0lBQUQsQ0FBQyxBQTlCRCxJQThCQztJQTlCWSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqXG4gKiBIb3cgdG8gaGFuZGxlIHBvdGVudGlhbCBkaWFnbm9zdGljcy5cbiAqL1xuZXhwb3J0IHR5cGUgRGlhZ25vc3RpY0hhbmRsaW5nU3RyYXRlZ3kgPSAnZXJyb3InfCd3YXJuaW5nJ3wnaWdub3JlJztcblxuLyoqXG4gKiBUaGlzIGNsYXNzIGlzIHVzZWQgdG8gY29sbGVjdCBhbmQgdGhlbiByZXBvcnQgd2FybmluZ3MgYW5kIGVycm9ycyB0aGF0IG9jY3VyIGR1cmluZyB0aGUgZXhlY3V0aW9uXG4gKiBvZiB0aGUgdG9vbHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBEaWFnbm9zdGljcyB7XG4gIHJlYWRvbmx5IG1lc3NhZ2VzOiB7dHlwZTogJ3dhcm5pbmcnfCdlcnJvcicsIG1lc3NhZ2U6IHN0cmluZ31bXSA9IFtdO1xuICBnZXQgaGFzRXJyb3JzKCkge1xuICAgIHJldHVybiB0aGlzLm1lc3NhZ2VzLnNvbWUobSA9PiBtLnR5cGUgPT09ICdlcnJvcicpO1xuICB9XG4gIGFkZCh0eXBlOiBEaWFnbm9zdGljSGFuZGxpbmdTdHJhdGVneSwgbWVzc2FnZTogc3RyaW5nKSB7XG4gICAgaWYgKHR5cGUgIT09ICdpZ25vcmUnKSB7XG4gICAgICB0aGlzLm1lc3NhZ2VzLnB1c2goe3R5cGUsIG1lc3NhZ2V9KTtcbiAgICB9XG4gIH1cbiAgd2FybihtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICB0aGlzLm1lc3NhZ2VzLnB1c2goe3R5cGU6ICd3YXJuaW5nJywgbWVzc2FnZX0pO1xuICB9XG4gIGVycm9yKG1lc3NhZ2U6IHN0cmluZykge1xuICAgIHRoaXMubWVzc2FnZXMucHVzaCh7dHlwZTogJ2Vycm9yJywgbWVzc2FnZX0pO1xuICB9XG4gIG1lcmdlKG90aGVyOiBEaWFnbm9zdGljcykge1xuICAgIHRoaXMubWVzc2FnZXMucHVzaCguLi5vdGhlci5tZXNzYWdlcyk7XG4gIH1cbiAgZm9ybWF0RGlhZ25vc3RpY3MobWVzc2FnZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBlcnJvcnMgPSB0aGlzLm1lc3NhZ2VzIS5maWx0ZXIoZCA9PiBkLnR5cGUgPT09ICdlcnJvcicpLm1hcChkID0+ICcgLSAnICsgZC5tZXNzYWdlKTtcbiAgICBjb25zdCB3YXJuaW5ncyA9IHRoaXMubWVzc2FnZXMhLmZpbHRlcihkID0+IGQudHlwZSA9PT0gJ3dhcm5pbmcnKS5tYXAoZCA9PiAnIC0gJyArIGQubWVzc2FnZSk7XG4gICAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICAgIG1lc3NhZ2UgKz0gJ1xcbkVSUk9SUzpcXG4nICsgZXJyb3JzLmpvaW4oJ1xcbicpO1xuICAgIH1cbiAgICBpZiAod2FybmluZ3MubGVuZ3RoKSB7XG4gICAgICBtZXNzYWdlICs9ICdcXG5XQVJOSU5HUzpcXG4nICsgd2FybmluZ3Muam9pbignXFxuJyk7XG4gICAgfVxuICAgIHJldHVybiBtZXNzYWdlO1xuICB9XG59XG4iXX0=
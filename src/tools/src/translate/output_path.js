(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/output_path", ["require", "exports", "tslib", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getOutputPathFn = void 0;
    var tslib_1 = require("tslib");
    var path_1 = require("path");
    /**
     * Create a function that will compute the absolute path to where a translated file should be
     * written.
     *
     * The special `{{LOCALE}}` marker will be replaced with the locale code of the current translation.
     * @param outputFolder An absolute path to the folder containing this set of translations.
     */
    function getOutputPathFn(outputFolder) {
        var _a = tslib_1.__read(outputFolder.split('{{LOCALE}}'), 2), pre = _a[0], post = _a[1];
        return post === undefined ? function (_locale, relativePath) { return path_1.join(pre, relativePath); } :
            function (locale, relativePath) { return path_1.join(pre + locale + post, relativePath); };
    }
    exports.getOutputPathFn = getOutputPathFn;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0X3BhdGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS9vdXRwdXRfcGF0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBUUEsNkJBQTBCO0lBVTFCOzs7Ozs7T0FNRztJQUNILFNBQWdCLGVBQWUsQ0FBQyxZQUE0QjtRQUNwRCxJQUFBLEtBQUEsZUFBYyxZQUFZLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFBLEVBQTdDLEdBQUcsUUFBQSxFQUFFLElBQUksUUFBb0MsQ0FBQztRQUNyRCxPQUFPLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFVBQUMsT0FBTyxFQUFFLFlBQVksSUFBSyxPQUFBLFdBQUksQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLEVBQXZCLENBQXVCLENBQUMsQ0FBQztZQUNwRCxVQUFDLE1BQU0sRUFBRSxZQUFZLElBQUssT0FBQSxXQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sR0FBRyxJQUFJLEVBQUUsWUFBWSxDQUFDLEVBQXZDLENBQXVDLENBQUM7SUFDaEcsQ0FBQztJQUpELDBDQUlDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQge2pvaW59IGZyb20gJ3BhdGgnO1xuXG4vKipcbiAqIEEgZnVuY3Rpb24gdGhhdCB3aWxsIHJldHVybiBhbiBhYnNvbHV0ZSBwYXRoIHRvIHdoZXJlIGEgZmlsZSBpcyB0byBiZSB3cml0dGVuLCBnaXZlbiBhIGxvY2FsZSBhbmRcbiAqIGEgcmVsYXRpdmUgcGF0aC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBPdXRwdXRQYXRoRm4ge1xuICAobG9jYWxlOiBzdHJpbmcsIHJlbGF0aXZlUGF0aDogc3RyaW5nKTogc3RyaW5nO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBjb21wdXRlIHRoZSBhYnNvbHV0ZSBwYXRoIHRvIHdoZXJlIGEgdHJhbnNsYXRlZCBmaWxlIHNob3VsZCBiZVxuICogd3JpdHRlbi5cbiAqXG4gKiBUaGUgc3BlY2lhbCBge3tMT0NBTEV9fWAgbWFya2VyIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgbG9jYWxlIGNvZGUgb2YgdGhlIGN1cnJlbnQgdHJhbnNsYXRpb24uXG4gKiBAcGFyYW0gb3V0cHV0Rm9sZGVyIEFuIGFic29sdXRlIHBhdGggdG8gdGhlIGZvbGRlciBjb250YWluaW5nIHRoaXMgc2V0IG9mIHRyYW5zbGF0aW9ucy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE91dHB1dFBhdGhGbihvdXRwdXRGb2xkZXI6IEFic29sdXRlRnNQYXRoKTogT3V0cHV0UGF0aEZuIHtcbiAgY29uc3QgW3ByZSwgcG9zdF0gPSBvdXRwdXRGb2xkZXIuc3BsaXQoJ3t7TE9DQUxFfX0nKTtcbiAgcmV0dXJuIHBvc3QgPT09IHVuZGVmaW5lZCA/IChfbG9jYWxlLCByZWxhdGl2ZVBhdGgpID0+IGpvaW4ocHJlLCByZWxhdGl2ZVBhdGgpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChsb2NhbGUsIHJlbGF0aXZlUGF0aCkgPT4gam9pbihwcmUgKyBsb2NhbGUgKyBwb3N0LCByZWxhdGl2ZVBhdGgpO1xufVxuIl19
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/output_path", ["require", "exports", "tslib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getOutputPathFn = void 0;
    var tslib_1 = require("tslib");
    /**
     * Create a function that will compute the absolute path to where a translated file should be
     * written.
     *
     * The special `{{LOCALE}}` marker will be replaced with the locale code of the current translation.
     * @param outputFolder An absolute path to the folder containing this set of translations.
     */
    function getOutputPathFn(fs, outputFolder) {
        var _a = (0, tslib_1.__read)(outputFolder.split('{{LOCALE}}'), 2), pre = _a[0], post = _a[1];
        return post === undefined ? function (_locale, relativePath) { return fs.join(pre, relativePath); } :
            function (locale, relativePath) { return fs.join(pre + locale + post, relativePath); };
    }
    exports.getOutputPathFn = getOutputPathFn;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0X3BhdGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS9vdXRwdXRfcGF0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBaUJBOzs7Ozs7T0FNRztJQUNILFNBQWdCLGVBQWUsQ0FBQyxFQUFvQixFQUFFLFlBQTRCO1FBQzFFLElBQUEsS0FBQSxvQkFBYyxZQUFZLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFBLEVBQTdDLEdBQUcsUUFBQSxFQUFFLElBQUksUUFBb0MsQ0FBQztRQUNyRCxPQUFPLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFVBQUMsT0FBTyxFQUFFLFlBQVksSUFBSyxPQUFBLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxFQUExQixDQUEwQixDQUFDLENBQUM7WUFDdkQsVUFBQyxNQUFNLEVBQUUsWUFBWSxJQUFLLE9BQUEsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxHQUFHLElBQUksRUFBRSxZQUFZLENBQUMsRUFBMUMsQ0FBMEMsQ0FBQztJQUNuRyxDQUFDO0lBSkQsMENBSUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGgsIFBhdGhNYW5pcHVsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuXG4vKipcbiAqIEEgZnVuY3Rpb24gdGhhdCB3aWxsIHJldHVybiBhbiBhYnNvbHV0ZSBwYXRoIHRvIHdoZXJlIGEgZmlsZSBpcyB0byBiZSB3cml0dGVuLCBnaXZlbiBhIGxvY2FsZSBhbmRcbiAqIGEgcmVsYXRpdmUgcGF0aC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBPdXRwdXRQYXRoRm4ge1xuICAobG9jYWxlOiBzdHJpbmcsIHJlbGF0aXZlUGF0aDogc3RyaW5nKTogc3RyaW5nO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBjb21wdXRlIHRoZSBhYnNvbHV0ZSBwYXRoIHRvIHdoZXJlIGEgdHJhbnNsYXRlZCBmaWxlIHNob3VsZCBiZVxuICogd3JpdHRlbi5cbiAqXG4gKiBUaGUgc3BlY2lhbCBge3tMT0NBTEV9fWAgbWFya2VyIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgbG9jYWxlIGNvZGUgb2YgdGhlIGN1cnJlbnQgdHJhbnNsYXRpb24uXG4gKiBAcGFyYW0gb3V0cHV0Rm9sZGVyIEFuIGFic29sdXRlIHBhdGggdG8gdGhlIGZvbGRlciBjb250YWluaW5nIHRoaXMgc2V0IG9mIHRyYW5zbGF0aW9ucy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE91dHB1dFBhdGhGbihmczogUGF0aE1hbmlwdWxhdGlvbiwgb3V0cHV0Rm9sZGVyOiBBYnNvbHV0ZUZzUGF0aCk6IE91dHB1dFBhdGhGbiB7XG4gIGNvbnN0IFtwcmUsIHBvc3RdID0gb3V0cHV0Rm9sZGVyLnNwbGl0KCd7e0xPQ0FMRX19Jyk7XG4gIHJldHVybiBwb3N0ID09PSB1bmRlZmluZWQgPyAoX2xvY2FsZSwgcmVsYXRpdmVQYXRoKSA9PiBmcy5qb2luKHByZSwgcmVsYXRpdmVQYXRoKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobG9jYWxlLCByZWxhdGl2ZVBhdGgpID0+IGZzLmpvaW4ocHJlICsgbG9jYWxlICsgcG9zdCwgcmVsYXRpdmVQYXRoKTtcbn1cbiJdfQ==
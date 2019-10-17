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
        define("@angular/localize/src/tools/src/translate/message_renderers/message_renderer", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function stripInterpolationMarkers(interpolation) {
        return interpolation.replace(/^\{\{/, '').replace(/}}$/, '');
    }
    exports.stripInterpolationMarkers = stripInterpolationMarkers;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZV9yZW5kZXJlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL21lc3NhZ2VfcmVuZGVyZXJzL21lc3NhZ2VfcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFnQkgsU0FBZ0IseUJBQXlCLENBQUMsYUFBcUI7UUFDN0QsT0FBTyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFGRCw4REFFQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuZXhwb3J0IGludGVyZmFjZSBNZXNzYWdlUmVuZGVyZXI8VD4ge1xuICBtZXNzYWdlOiBUO1xuICBzdGFydFJlbmRlcigpOiB2b2lkO1xuICBlbmRSZW5kZXIoKTogdm9pZDtcbiAgdGV4dCh0ZXh0OiBzdHJpbmcpOiB2b2lkO1xuICBwbGFjZWhvbGRlcihuYW1lOiBzdHJpbmcsIGJvZHk6IHN0cmluZ3x1bmRlZmluZWQpOiB2b2lkO1xuICBzdGFydFBsYWNlaG9sZGVyKG5hbWU6IHN0cmluZyk6IHZvaWQ7XG4gIGNsb3NlUGxhY2Vob2xkZXIobmFtZTogc3RyaW5nKTogdm9pZDtcbiAgc3RhcnRDb250YWluZXIoKTogdm9pZDtcbiAgY2xvc2VDb250YWluZXIoKTogdm9pZDtcbiAgc3RhcnRJY3UoKTogdm9pZDtcbiAgZW5kSWN1KCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdHJpcEludGVycG9sYXRpb25NYXJrZXJzKGludGVycG9sYXRpb246IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBpbnRlcnBvbGF0aW9uLnJlcGxhY2UoL15cXHtcXHsvLCAnJykucmVwbGFjZSgvfX0kLywgJycpO1xufVxuIl19
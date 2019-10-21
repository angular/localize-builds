(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/base_visitor", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A simple base class for the  `Visitor` interface, which is a noop for every method.
     *
     * Sub-classes only need to override the methods that they care about.
     */
    var BaseVisitor = /** @class */ (function () {
        function BaseVisitor() {
        }
        BaseVisitor.prototype.visitElement = function (_element, _context) { };
        BaseVisitor.prototype.visitAttribute = function (_attribute, _context) { };
        BaseVisitor.prototype.visitText = function (_text, _context) { };
        BaseVisitor.prototype.visitComment = function (_comment, _context) { };
        BaseVisitor.prototype.visitExpansion = function (_expansion, _context) { };
        BaseVisitor.prototype.visitExpansionCase = function (_expansionCase, _context) { };
        return BaseVisitor;
    }());
    exports.BaseVisitor = BaseVisitor;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZV92aXNpdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3Rvb2xzL3NyYy90cmFuc2xhdGUvdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fcGFyc2Vycy9iYXNlX3Zpc2l0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFTQTs7OztPQUlHO0lBQ0g7UUFBQTtRQU9BLENBQUM7UUFOQyxrQ0FBWSxHQUFaLFVBQWEsUUFBaUIsRUFBRSxRQUFhLElBQVEsQ0FBQztRQUN0RCxvQ0FBYyxHQUFkLFVBQWUsVUFBcUIsRUFBRSxRQUFhLElBQVEsQ0FBQztRQUM1RCwrQkFBUyxHQUFULFVBQVUsS0FBVyxFQUFFLFFBQWEsSUFBUSxDQUFDO1FBQzdDLGtDQUFZLEdBQVosVUFBYSxRQUFpQixFQUFFLFFBQWEsSUFBUSxDQUFDO1FBQ3RELG9DQUFjLEdBQWQsVUFBZSxVQUFxQixFQUFFLFFBQWEsSUFBUSxDQUFDO1FBQzVELHdDQUFrQixHQUFsQixVQUFtQixjQUE2QixFQUFFLFFBQWEsSUFBUSxDQUFDO1FBQzFFLGtCQUFDO0lBQUQsQ0FBQyxBQVBELElBT0M7SUFQWSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QXR0cmlidXRlLCBDb21tZW50LCBFbGVtZW50LCBFeHBhbnNpb24sIEV4cGFuc2lvbkNhc2UsIFRleHQsIFZpc2l0b3J9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcblxuLyoqXG4gKiBBIHNpbXBsZSBiYXNlIGNsYXNzIGZvciB0aGUgIGBWaXNpdG9yYCBpbnRlcmZhY2UsIHdoaWNoIGlzIGEgbm9vcCBmb3IgZXZlcnkgbWV0aG9kLlxuICpcbiAqIFN1Yi1jbGFzc2VzIG9ubHkgbmVlZCB0byBvdmVycmlkZSB0aGUgbWV0aG9kcyB0aGF0IHRoZXkgY2FyZSBhYm91dC5cbiAqL1xuZXhwb3J0IGNsYXNzIEJhc2VWaXNpdG9yIGltcGxlbWVudHMgVmlzaXRvciB7XG4gIHZpc2l0RWxlbWVudChfZWxlbWVudDogRWxlbWVudCwgX2NvbnRleHQ6IGFueSk6IGFueSB7fVxuICB2aXNpdEF0dHJpYnV0ZShfYXR0cmlidXRlOiBBdHRyaWJ1dGUsIF9jb250ZXh0OiBhbnkpOiBhbnkge31cbiAgdmlzaXRUZXh0KF90ZXh0OiBUZXh0LCBfY29udGV4dDogYW55KTogYW55IHt9XG4gIHZpc2l0Q29tbWVudChfY29tbWVudDogQ29tbWVudCwgX2NvbnRleHQ6IGFueSk6IGFueSB7fVxuICB2aXNpdEV4cGFuc2lvbihfZXhwYW5zaW9uOiBFeHBhbnNpb24sIF9jb250ZXh0OiBhbnkpOiBhbnkge31cbiAgdmlzaXRFeHBhbnNpb25DYXNlKF9leHBhbnNpb25DYXNlOiBFeHBhbnNpb25DYXNlLCBfY29udGV4dDogYW55KTogYW55IHt9XG59XG4iXX0=
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/base_visitor", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseVisitor = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZV92aXNpdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3Rvb2xzL3NyYy90cmFuc2xhdGUvdHJhbnNsYXRpb25fZmlsZXMvYmFzZV92aXNpdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQVNBOzs7O09BSUc7SUFDSDtRQUFBO1FBT0EsQ0FBQztRQU5DLGtDQUFZLEdBQVosVUFBYSxRQUFpQixFQUFFLFFBQWEsSUFBUSxDQUFDO1FBQ3RELG9DQUFjLEdBQWQsVUFBZSxVQUFxQixFQUFFLFFBQWEsSUFBUSxDQUFDO1FBQzVELCtCQUFTLEdBQVQsVUFBVSxLQUFXLEVBQUUsUUFBYSxJQUFRLENBQUM7UUFDN0Msa0NBQVksR0FBWixVQUFhLFFBQWlCLEVBQUUsUUFBYSxJQUFRLENBQUM7UUFDdEQsb0NBQWMsR0FBZCxVQUFlLFVBQXFCLEVBQUUsUUFBYSxJQUFRLENBQUM7UUFDNUQsd0NBQWtCLEdBQWxCLFVBQW1CLGNBQTZCLEVBQUUsUUFBYSxJQUFRLENBQUM7UUFDMUUsa0JBQUM7SUFBRCxDQUFDLEFBUEQsSUFPQztJQVBZLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBdHRyaWJ1dGUsIENvbW1lbnQsIEVsZW1lbnQsIEV4cGFuc2lvbiwgRXhwYW5zaW9uQ2FzZSwgVGV4dCwgVmlzaXRvcn0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuXG4vKipcbiAqIEEgc2ltcGxlIGJhc2UgY2xhc3MgZm9yIHRoZSAgYFZpc2l0b3JgIGludGVyZmFjZSwgd2hpY2ggaXMgYSBub29wIGZvciBldmVyeSBtZXRob2QuXG4gKlxuICogU3ViLWNsYXNzZXMgb25seSBuZWVkIHRvIG92ZXJyaWRlIHRoZSBtZXRob2RzIHRoYXQgdGhleSBjYXJlIGFib3V0LlxuICovXG5leHBvcnQgY2xhc3MgQmFzZVZpc2l0b3IgaW1wbGVtZW50cyBWaXNpdG9yIHtcbiAgdmlzaXRFbGVtZW50KF9lbGVtZW50OiBFbGVtZW50LCBfY29udGV4dDogYW55KTogYW55IHt9XG4gIHZpc2l0QXR0cmlidXRlKF9hdHRyaWJ1dGU6IEF0dHJpYnV0ZSwgX2NvbnRleHQ6IGFueSk6IGFueSB7fVxuICB2aXNpdFRleHQoX3RleHQ6IFRleHQsIF9jb250ZXh0OiBhbnkpOiBhbnkge31cbiAgdmlzaXRDb21tZW50KF9jb21tZW50OiBDb21tZW50LCBfY29udGV4dDogYW55KTogYW55IHt9XG4gIHZpc2l0RXhwYW5zaW9uKF9leHBhbnNpb246IEV4cGFuc2lvbiwgX2NvbnRleHQ6IGFueSk6IGFueSB7fVxuICB2aXNpdEV4cGFuc2lvbkNhc2UoX2V4cGFuc2lvbkNhc2U6IEV4cGFuc2lvbkNhc2UsIF9jb250ZXh0OiBhbnkpOiBhbnkge31cbn1cbiJdfQ==
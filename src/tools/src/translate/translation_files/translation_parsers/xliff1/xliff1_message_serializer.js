(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff1/xliff1_message_serializer", ["require", "exports", "tslib", "@angular/compiler", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/base_visitor", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_parse_error", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var compiler_1 = require("@angular/compiler");
    var base_visitor_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/base_visitor");
    var translation_parse_error_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_parse_error");
    var translation_utils_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils");
    var INLINE_ELEMENTS = ['g', 'bx', 'ex', 'bpt', 'ept', 'ph', 'it', 'mrk'];
    var Xliff1MessageSerializer = /** @class */ (function (_super) {
        tslib_1.__extends(Xliff1MessageSerializer, _super);
        function Xliff1MessageSerializer(renderer) {
            var _this = _super.call(this) || this;
            _this.renderer = renderer;
            return _this;
        }
        Xliff1MessageSerializer.prototype.serialize = function (nodes) {
            this.renderer.startRender();
            compiler_1.visitAll(this, nodes);
            this.renderer.endRender();
            return this.renderer.message;
        };
        Xliff1MessageSerializer.prototype.visitElement = function (element) {
            if (element.name === 'x') {
                this.visitPlaceholder(translation_utils_1.getAttrOrThrow(element, 'id'), '');
            }
            else if (INLINE_ELEMENTS.indexOf(element.name) !== -1) {
                compiler_1.visitAll(this, element.children);
            }
            else {
                throw new translation_parse_error_1.TranslationParseError(element.sourceSpan, "Invalid element found in message.");
            }
        };
        Xliff1MessageSerializer.prototype.visitText = function (text) { this.renderer.text(text.value); };
        Xliff1MessageSerializer.prototype.visitExpansion = function (expansion) {
            this.renderer.startIcu();
            this.renderer.text(expansion.switchValue + ", " + expansion.type + ",");
            compiler_1.visitAll(this, expansion.cases);
            this.renderer.endIcu();
        };
        Xliff1MessageSerializer.prototype.visitExpansionCase = function (expansionCase) {
            this.renderer.text(" " + expansionCase.value + " {");
            this.renderer.startContainer();
            compiler_1.visitAll(this, expansionCase.expression);
            this.renderer.closeContainer();
            this.renderer.text("}");
        };
        Xliff1MessageSerializer.prototype.visitPlaceholder = function (name, body) {
            this.renderer.placeholder(name, body);
        };
        return Xliff1MessageSerializer;
    }(base_visitor_1.BaseVisitor));
    exports.Xliff1MessageSerializer = Xliff1MessageSerializer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYxX21lc3NhZ2Vfc2VyaWFsaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMveGxpZmYxL3hsaWZmMV9tZXNzYWdlX3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOENBQTBGO0lBRTFGLDZIQUE0QztJQUM1QyxtSkFBaUU7SUFDakUsdUlBQW9EO0lBRXBELElBQU0sZUFBZSxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRTNFO1FBQWdELG1EQUFXO1FBQ3pELGlDQUFvQixRQUE0QjtZQUFoRCxZQUFvRCxpQkFBTyxTQUFHO1lBQTFDLGNBQVEsR0FBUixRQUFRLENBQW9COztRQUFhLENBQUM7UUFFOUQsMkNBQVMsR0FBVCxVQUFVLEtBQWE7WUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUM1QixtQkFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQzFCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7UUFDL0IsQ0FBQztRQUVELDhDQUFZLEdBQVosVUFBYSxPQUFnQjtZQUMzQixJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssR0FBRyxFQUFFO2dCQUN4QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsa0NBQWMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDMUQ7aUJBQU0sSUFBSSxlQUFlLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDdkQsbUJBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ2xDO2lCQUFNO2dCQUNMLE1BQU0sSUFBSSwrQ0FBcUIsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLG1DQUFtQyxDQUFDLENBQUM7YUFDMUY7UUFDSCxDQUFDO1FBRUQsMkNBQVMsR0FBVCxVQUFVLElBQVUsSUFBVSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRS9ELGdEQUFjLEdBQWQsVUFBZSxTQUFvQjtZQUNqQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFJLFNBQVMsQ0FBQyxXQUFXLFVBQUssU0FBUyxDQUFDLElBQUksTUFBRyxDQUFDLENBQUM7WUFDbkUsbUJBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDekIsQ0FBQztRQUVELG9EQUFrQixHQUFsQixVQUFtQixhQUE0QjtZQUM3QyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFJLGFBQWEsQ0FBQyxLQUFLLE9BQUksQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDL0IsbUJBQVEsQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUIsQ0FBQztRQUVELGtEQUFnQixHQUFoQixVQUFpQixJQUFZLEVBQUUsSUFBc0I7WUFDbkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFDSCw4QkFBQztJQUFELENBQUMsQUF4Q0QsQ0FBZ0QsMEJBQVcsR0F3QzFEO0lBeENZLDBEQUF1QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RWxlbWVudCwgRXhwYW5zaW9uLCBFeHBhbnNpb25DYXNlLCBOb2RlLCBUZXh0LCB2aXNpdEFsbH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0IHtNZXNzYWdlUmVuZGVyZXJ9IGZyb20gJy4uLy4uLy4uL21lc3NhZ2VfcmVuZGVyZXJzL21lc3NhZ2VfcmVuZGVyZXInO1xuaW1wb3J0IHtCYXNlVmlzaXRvcn0gZnJvbSAnLi4vYmFzZV92aXNpdG9yJztcbmltcG9ydCB7VHJhbnNsYXRpb25QYXJzZUVycm9yfSBmcm9tICcuLi90cmFuc2xhdGlvbl9wYXJzZV9lcnJvcic7XG5pbXBvcnQge2dldEF0dHJPclRocm93fSBmcm9tICcuLi90cmFuc2xhdGlvbl91dGlscyc7XG5cbmNvbnN0IElOTElORV9FTEVNRU5UUyA9IFsnZycsICdieCcsICdleCcsICdicHQnLCAnZXB0JywgJ3BoJywgJ2l0JywgJ21yayddO1xuXG5leHBvcnQgY2xhc3MgWGxpZmYxTWVzc2FnZVNlcmlhbGl6ZXI8VD4gZXh0ZW5kcyBCYXNlVmlzaXRvciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IE1lc3NhZ2VSZW5kZXJlcjxUPikgeyBzdXBlcigpOyB9XG5cbiAgc2VyaWFsaXplKG5vZGVzOiBOb2RlW10pOiBUIHtcbiAgICB0aGlzLnJlbmRlcmVyLnN0YXJ0UmVuZGVyKCk7XG4gICAgdmlzaXRBbGwodGhpcywgbm9kZXMpO1xuICAgIHRoaXMucmVuZGVyZXIuZW5kUmVuZGVyKCk7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyZXIubWVzc2FnZTtcbiAgfVxuXG4gIHZpc2l0RWxlbWVudChlbGVtZW50OiBFbGVtZW50KTogdm9pZCB7XG4gICAgaWYgKGVsZW1lbnQubmFtZSA9PT0gJ3gnKSB7XG4gICAgICB0aGlzLnZpc2l0UGxhY2Vob2xkZXIoZ2V0QXR0ck9yVGhyb3coZWxlbWVudCwgJ2lkJyksICcnKTtcbiAgICB9IGVsc2UgaWYgKElOTElORV9FTEVNRU5UUy5pbmRleE9mKGVsZW1lbnQubmFtZSkgIT09IC0xKSB7XG4gICAgICB2aXNpdEFsbCh0aGlzLCBlbGVtZW50LmNoaWxkcmVuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFRyYW5zbGF0aW9uUGFyc2VFcnJvcihlbGVtZW50LnNvdXJjZVNwYW4sIGBJbnZhbGlkIGVsZW1lbnQgZm91bmQgaW4gbWVzc2FnZS5gKTtcbiAgICB9XG4gIH1cblxuICB2aXNpdFRleHQodGV4dDogVGV4dCk6IHZvaWQgeyB0aGlzLnJlbmRlcmVyLnRleHQodGV4dC52YWx1ZSk7IH1cblxuICB2aXNpdEV4cGFuc2lvbihleHBhbnNpb246IEV4cGFuc2lvbik6IHZvaWQge1xuICAgIHRoaXMucmVuZGVyZXIuc3RhcnRJY3UoKTtcbiAgICB0aGlzLnJlbmRlcmVyLnRleHQoYCR7ZXhwYW5zaW9uLnN3aXRjaFZhbHVlfSwgJHtleHBhbnNpb24udHlwZX0sYCk7XG4gICAgdmlzaXRBbGwodGhpcywgZXhwYW5zaW9uLmNhc2VzKTtcbiAgICB0aGlzLnJlbmRlcmVyLmVuZEljdSgpO1xuICB9XG5cbiAgdmlzaXRFeHBhbnNpb25DYXNlKGV4cGFuc2lvbkNhc2U6IEV4cGFuc2lvbkNhc2UpOiB2b2lkIHtcbiAgICB0aGlzLnJlbmRlcmVyLnRleHQoYCAke2V4cGFuc2lvbkNhc2UudmFsdWV9IHtgKTtcbiAgICB0aGlzLnJlbmRlcmVyLnN0YXJ0Q29udGFpbmVyKCk7XG4gICAgdmlzaXRBbGwodGhpcywgZXhwYW5zaW9uQ2FzZS5leHByZXNzaW9uKTtcbiAgICB0aGlzLnJlbmRlcmVyLmNsb3NlQ29udGFpbmVyKCk7XG4gICAgdGhpcy5yZW5kZXJlci50ZXh0KGB9YCk7XG4gIH1cblxuICB2aXNpdFBsYWNlaG9sZGVyKG5hbWU6IHN0cmluZywgYm9keTogc3RyaW5nfHVuZGVmaW5lZCk6IHZvaWQge1xuICAgIHRoaXMucmVuZGVyZXIucGxhY2Vob2xkZXIobmFtZSwgYm9keSk7XG4gIH1cbn1cbiJdfQ==
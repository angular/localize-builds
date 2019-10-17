(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff2/xliff2_message_serializer", ["require", "exports", "tslib", "@angular/compiler", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/base_visitor", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_parse_error", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils"], factory);
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
    var INLINE_ELEMENTS = ['cp', 'sc', 'ec', 'mrk', 'sm', 'em'];
    var Xliff2MessageSerializer = /** @class */ (function (_super) {
        tslib_1.__extends(Xliff2MessageSerializer, _super);
        function Xliff2MessageSerializer(renderer) {
            var _this = _super.call(this) || this;
            _this.renderer = renderer;
            return _this;
        }
        Xliff2MessageSerializer.prototype.serialize = function (nodes) {
            this.renderer.startRender();
            compiler_1.visitAll(this, nodes);
            this.renderer.endRender();
            return this.renderer.message;
        };
        Xliff2MessageSerializer.prototype.visitElement = function (element) {
            if (element.name === 'ph') {
                this.visitPlaceholder(translation_utils_1.getAttrOrThrow(element, 'equiv'), translation_utils_1.getAttribute(element, 'disp'));
            }
            else if (element.name === 'pc') {
                this.visitPlaceholderContainer(translation_utils_1.getAttrOrThrow(element, 'equivStart'), element.children, translation_utils_1.getAttrOrThrow(element, 'equivEnd'));
            }
            else if (INLINE_ELEMENTS.indexOf(element.name) !== -1) {
                compiler_1.visitAll(this, element.children);
            }
            else {
                throw new translation_parse_error_1.TranslationParseError(element.sourceSpan, "Invalid element found in message.");
            }
        };
        Xliff2MessageSerializer.prototype.visitText = function (text) { this.renderer.text(text.value); };
        Xliff2MessageSerializer.prototype.visitExpansion = function (expansion) {
            this.renderer.startIcu();
            this.renderer.text(expansion.switchValue + ", " + expansion.type + ",");
            compiler_1.visitAll(this, expansion.cases);
            this.renderer.endIcu();
        };
        Xliff2MessageSerializer.prototype.visitExpansionCase = function (expansionCase) {
            this.renderer.text(" " + expansionCase.value + " {");
            this.renderer.startContainer();
            compiler_1.visitAll(this, expansionCase.expression);
            this.renderer.closeContainer();
            this.renderer.text("}");
        };
        Xliff2MessageSerializer.prototype.visitContainedNodes = function (nodes) {
            var length = nodes.length;
            var index = 0;
            while (index < length) {
                if (!isPlaceholderContainer(nodes[index])) {
                    var startOfContainedNodes = index;
                    while (index < length - 1) {
                        index++;
                        if (isPlaceholderContainer(nodes[index])) {
                            break;
                        }
                    }
                    if (index - startOfContainedNodes > 1) {
                        // Only create a container if there are two or more contained Nodes in a row
                        this.renderer.startContainer();
                        compiler_1.visitAll(this, nodes.slice(startOfContainedNodes, index - 1));
                        this.renderer.closeContainer();
                    }
                }
                if (index < length) {
                    nodes[index].visit(this, undefined);
                }
                index++;
            }
        };
        Xliff2MessageSerializer.prototype.visitPlaceholder = function (name, body) {
            this.renderer.placeholder(name, body);
        };
        Xliff2MessageSerializer.prototype.visitPlaceholderContainer = function (startName, children, closeName) {
            this.renderer.startPlaceholder(startName);
            this.visitContainedNodes(children);
            this.renderer.closePlaceholder(closeName);
        };
        return Xliff2MessageSerializer;
    }(base_visitor_1.BaseVisitor));
    exports.Xliff2MessageSerializer = Xliff2MessageSerializer;
    function isPlaceholderContainer(node) {
        return node instanceof compiler_1.Element && node.name === 'pc';
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYyX21lc3NhZ2Vfc2VyaWFsaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMveGxpZmYyL3hsaWZmMl9tZXNzYWdlX3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOENBQTBGO0lBRTFGLDZIQUE0QztJQUM1QyxtSkFBaUU7SUFDakUsdUlBQWtFO0lBRWxFLElBQU0sZUFBZSxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUU5RDtRQUFnRCxtREFBVztRQUN6RCxpQ0FBb0IsUUFBNEI7WUFBaEQsWUFBb0QsaUJBQU8sU0FBRztZQUExQyxjQUFRLEdBQVIsUUFBUSxDQUFvQjs7UUFBYSxDQUFDO1FBRTlELDJDQUFTLEdBQVQsVUFBVSxLQUFhO1lBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDNUIsbUJBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUMxQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO1FBQy9CLENBQUM7UUFFRCw4Q0FBWSxHQUFaLFVBQWEsT0FBZ0I7WUFDM0IsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtnQkFDekIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGtDQUFjLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUFFLGdDQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7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UUFFRCxrREFBZ0IsR0FBaEIsVUFBaUIsSUFBWSxFQUFFLElBQXNCO1lBQ25ELElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QyxDQUFDO1FBRUQsMkRBQXlCLEdBQXpCLFVBQTBCLFNBQWlCLEVBQUUsUUFBZ0IsRUFBRSxTQUFpQjtZQUM5RSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNuQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVDLENBQUM7UUFDSCw4QkFBQztJQUFELENBQUMsQUE1RUQsQ0FBZ0QsMEJBQVcsR0E0RTFEO0lBNUVZLDBEQUF1QjtJQThFcEMsU0FBUyxzQkFBc0IsQ0FBQyxJQUFVO1FBQ3hDLE9BQU8sSUFBSSxZQUFZLGtCQUFPLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUM7SUFDdkQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RWxlbWVudCwgRXhwYW5zaW9uLCBFeHBhbnNpb25DYXNlLCBOb2RlLCBUZXh0LCB2aXNpdEFsbH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0IHtNZXNzYWdlUmVuZGVyZXJ9IGZyb20gJy4uLy4uLy4uL21lc3NhZ2VfcmVuZGVyZXJzL21lc3NhZ2VfcmVuZGVyZXInO1xuaW1wb3J0IHtCYXNlVmlzaXRvcn0gZnJvbSAnLi4vYmFzZV92aXNpdG9yJztcbmltcG9ydCB7VHJhbnNsYXRpb25QYXJzZUVycm9yfSBmcm9tICcuLi90cmFuc2xhdGlvbl9wYXJzZV9lcnJvcic7XG5pbXBvcnQge2dldEF0dHJPclRocm93LCBnZXRBdHRyaWJ1dGV9IGZyb20gJy4uL3RyYW5zbGF0aW9uX3V0aWxzJztcblxuY29uc3QgSU5MSU5FX0VMRU1FTlRTID0gWydjcCcsICdzYycsICdlYycsICdtcmsnLCAnc20nLCAnZW0nXTtcblxuZXhwb3J0IGNsYXNzIFhsaWZmMk1lc3NhZ2VTZXJpYWxpemVyPFQ+IGV4dGVuZHMgQmFzZVZpc2l0b3Ige1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBNZXNzYWdlUmVuZGVyZXI8VD4pIHsgc3VwZXIoKTsgfVxuXG4gIHNlcmlhbGl6ZShub2RlczogTm9kZVtdKTogVCB7XG4gICAgdGhpcy5yZW5kZXJlci5zdGFydFJlbmRlcigpO1xuICAgIHZpc2l0QWxsKHRoaXMsIG5vZGVzKTtcbiAgICB0aGlzLnJlbmRlcmVyLmVuZFJlbmRlcigpO1xuICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLm1lc3NhZ2U7XG4gIH1cblxuICB2aXNpdEVsZW1lbnQoZWxlbWVudDogRWxlbWVudCk6IHZvaWQge1xuICAgIGlmIChlbGVtZW50Lm5hbWUgPT09ICdwaCcpIHtcbiAgICAgIHRoaXMudmlzaXRQbGFjZWhvbGRlcihnZXRBdHRyT3JUaHJvdyhlbGVtZW50LCAnZXF1aXYnKSwgZ2V0QXR0cmlidXRlKGVsZW1lbnQsICdkaXNwJykpO1xuICAgIH0gZWxzZSBpZiAoZWxlbWVudC5uYW1lID09PSAncGMnKSB7XG4gICAgICB0aGlzLnZpc2l0UGxhY2Vob2xkZXJDb250YWluZXIoXG4gICAgICAgICAgZ2V0QXR0ck9yVGhyb3coZWxlbWVudCwgJ2VxdWl2U3RhcnQnKSwgZWxlbWVudC5jaGlsZHJlbixcbiAgICAgICAgICBnZXRBdHRyT3JUaHJvdyhlbGVtZW50LCAnZXF1aXZFbmQnKSk7XG4gICAgfSBlbHNlIGlmIChJTkxJTkVfRUxFTUVOVFMuaW5kZXhPZihlbGVtZW50Lm5hbWUpICE9PSAtMSkge1xuICAgICAgdmlzaXRBbGwodGhpcywgZWxlbWVudC5jaGlsZHJlbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBUcmFuc2xhdGlvblBhcnNlRXJyb3IoZWxlbWVudC5zb3VyY2VTcGFuLCBgSW52YWxpZCBlbGVtZW50IGZvdW5kIGluIG1lc3NhZ2UuYCk7XG4gICAgfVxuICB9XG5cbiAgdmlzaXRUZXh0KHRleHQ6IFRleHQpOiB2b2lkIHsgdGhpcy5yZW5kZXJlci50ZXh0KHRleHQudmFsdWUpOyB9XG5cbiAgdmlzaXRFeHBhbnNpb24oZXhwYW5zaW9uOiBFeHBhbnNpb24pOiB2b2lkIHtcbiAgICB0aGlzLnJlbmRlcmVyLnN0YXJ0SWN1KCk7XG4gICAgdGhpcy5yZW5kZXJlci50ZXh0KGAke2V4cGFuc2lvbi5zd2l0Y2hWYWx1ZX0sICR7ZXhwYW5zaW9uLnR5cGV9LGApO1xuICAgIHZpc2l0QWxsKHRoaXMsIGV4cGFuc2lvbi5jYXNlcyk7XG4gICAgdGhpcy5yZW5kZXJlci5lbmRJY3UoKTtcbiAgfVxuXG4gIHZpc2l0RXhwYW5zaW9uQ2FzZShleHBhbnNpb25DYXNlOiBFeHBhbnNpb25DYXNlKTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXJlci50ZXh0KGAgJHtleHBhbnNpb25DYXNlLnZhbHVlfSB7YCk7XG4gICAgdGhpcy5yZW5kZXJlci5zdGFydENvbnRhaW5lcigpO1xuICAgIHZpc2l0QWxsKHRoaXMsIGV4cGFuc2lvbkNhc2UuZXhwcmVzc2lvbik7XG4gICAgdGhpcy5yZW5kZXJlci5jbG9zZUNvbnRhaW5lcigpO1xuICAgIHRoaXMucmVuZGVyZXIudGV4dChgfWApO1xuICB9XG5cbiAgdmlzaXRDb250YWluZWROb2Rlcyhub2RlczogTm9kZVtdKTogdm9pZCB7XG4gICAgY29uc3QgbGVuZ3RoID0gbm9kZXMubGVuZ3RoO1xuICAgIGxldCBpbmRleCA9IDA7XG4gICAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICBpZiAoIWlzUGxhY2Vob2xkZXJDb250YWluZXIobm9kZXNbaW5kZXhdKSkge1xuICAgICAgICBjb25zdCBzdGFydE9mQ29udGFpbmVkTm9kZXMgPSBpbmRleDtcbiAgICAgICAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgaWYgKGlzUGxhY2Vob2xkZXJDb250YWluZXIobm9kZXNbaW5kZXhdKSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpbmRleCAtIHN0YXJ0T2ZDb250YWluZWROb2RlcyA+IDEpIHtcbiAgICAgICAgICAvLyBPbmx5IGNyZWF0ZSBhIGNvbnRhaW5lciBpZiB0aGVyZSBhcmUgdHdvIG9yIG1vcmUgY29udGFpbmVkIE5vZGVzIGluIGEgcm93XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zdGFydENvbnRhaW5lcigpO1xuICAgICAgICAgIHZpc2l0QWxsKHRoaXMsIG5vZGVzLnNsaWNlKHN0YXJ0T2ZDb250YWluZWROb2RlcywgaW5kZXggLSAxKSk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5jbG9zZUNvbnRhaW5lcigpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgbm9kZXNbaW5kZXhdLnZpc2l0KHRoaXMsIHVuZGVmaW5lZCk7XG4gICAgICB9XG4gICAgICBpbmRleCsrO1xuICAgIH1cbiAgfVxuXG4gIHZpc2l0UGxhY2Vob2xkZXIobmFtZTogc3RyaW5nLCBib2R5OiBzdHJpbmd8dW5kZWZpbmVkKTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXJlci5wbGFjZWhvbGRlcihuYW1lLCBib2R5KTtcbiAgfVxuXG4gIHZpc2l0UGxhY2Vob2xkZXJDb250YWluZXIoc3RhcnROYW1lOiBzdHJpbmcsIGNoaWxkcmVuOiBOb2RlW10sIGNsb3NlTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXJlci5zdGFydFBsYWNlaG9sZGVyKHN0YXJ0TmFtZSk7XG4gICAgdGhpcy52aXNpdENvbnRhaW5lZE5vZGVzKGNoaWxkcmVuKTtcbiAgICB0aGlzLnJlbmRlcmVyLmNsb3NlUGxhY2Vob2xkZXIoY2xvc2VOYW1lKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc1BsYWNlaG9sZGVyQ29udGFpbmVyKG5vZGU6IE5vZGUpOiBib29sZWFuIHtcbiAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBFbGVtZW50ICYmIG5vZGUubmFtZSA9PT0gJ3BjJztcbn1cbiJdfQ==
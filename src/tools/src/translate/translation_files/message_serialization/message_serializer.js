(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/message_serialization/message_serializer", ["require", "exports", "tslib", "@angular/compiler", "@angular/localize/src/tools/src/translate/translation_files/base_visitor", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_parse_error", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MessageSerializer = void 0;
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var compiler_1 = require("@angular/compiler");
    var base_visitor_1 = require("@angular/localize/src/tools/src/translate/translation_files/base_visitor");
    var translation_parse_error_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_parse_error");
    var translation_utils_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils");
    /**
     * This visitor will walk over a set of XML nodes, which represent an i18n message, and serialize
     * them into a message object of type `T`.
     * The type of the serialized message is controlled by the
     */
    var MessageSerializer = /** @class */ (function (_super) {
        tslib_1.__extends(MessageSerializer, _super);
        function MessageSerializer(renderer, config) {
            var _this = _super.call(this) || this;
            _this.renderer = renderer;
            _this.config = config;
            return _this;
        }
        MessageSerializer.prototype.serialize = function (nodes) {
            this.renderer.startRender();
            compiler_1.visitAll(this, nodes);
            this.renderer.endRender();
            return this.renderer.message;
        };
        MessageSerializer.prototype.visitElement = function (element) {
            if (this.config.placeholder && element.name === this.config.placeholder.elementName) {
                var name = translation_utils_1.getAttrOrThrow(element, this.config.placeholder.nameAttribute);
                var body = this.config.placeholder.bodyAttribute &&
                    translation_utils_1.getAttribute(element, this.config.placeholder.bodyAttribute);
                this.visitPlaceholder(name, body);
            }
            else if (this.config.placeholderContainer &&
                element.name === this.config.placeholderContainer.elementName) {
                var start = translation_utils_1.getAttrOrThrow(element, this.config.placeholderContainer.startAttribute);
                var end = translation_utils_1.getAttrOrThrow(element, this.config.placeholderContainer.endAttribute);
                this.visitPlaceholderContainer(start, element.children, end);
            }
            else if (this.config.inlineElements.indexOf(element.name) !== -1) {
                compiler_1.visitAll(this, element.children);
            }
            else {
                throw new translation_parse_error_1.TranslationParseError(element.sourceSpan, "Invalid element found in message.");
            }
        };
        MessageSerializer.prototype.visitText = function (text) {
            this.renderer.text(text.value);
        };
        MessageSerializer.prototype.visitExpansion = function (expansion) {
            this.renderer.startIcu();
            this.renderer.text(expansion.switchValue + ", " + expansion.type + ",");
            compiler_1.visitAll(this, expansion.cases);
            this.renderer.endIcu();
        };
        MessageSerializer.prototype.visitExpansionCase = function (expansionCase) {
            this.renderer.text(" " + expansionCase.value + " {");
            this.renderer.startContainer();
            compiler_1.visitAll(this, expansionCase.expression);
            this.renderer.closeContainer();
            this.renderer.text("}");
        };
        MessageSerializer.prototype.visitContainedNodes = function (nodes) {
            var length = nodes.length;
            var index = 0;
            while (index < length) {
                if (!this.isPlaceholderContainer(nodes[index])) {
                    var startOfContainedNodes = index;
                    while (index < length - 1) {
                        index++;
                        if (this.isPlaceholderContainer(nodes[index])) {
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
        MessageSerializer.prototype.visitPlaceholder = function (name, body) {
            this.renderer.placeholder(name, body);
        };
        MessageSerializer.prototype.visitPlaceholderContainer = function (startName, children, closeName) {
            this.renderer.startPlaceholder(startName);
            this.visitContainedNodes(children);
            this.renderer.closePlaceholder(closeName);
        };
        MessageSerializer.prototype.isPlaceholderContainer = function (node) {
            return node instanceof compiler_1.Element && node.name === this.config.placeholderContainer.elementName;
        };
        return MessageSerializer;
    }(base_visitor_1.BaseVisitor));
    exports.MessageSerializer = MessageSerializer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZV9zZXJpYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3Rvb2xzL3NyYy90cmFuc2xhdGUvdHJhbnNsYXRpb25fZmlsZXMvbWVzc2FnZV9zZXJpYWxpemF0aW9uL21lc3NhZ2Vfc2VyaWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOENBQTBGO0lBRTFGLHlHQUE0QztJQUM1QyxtSkFBcUY7SUFDckYsdUlBQXNGO0lBVXRGOzs7O09BSUc7SUFDSDtRQUEwQyw2Q0FBVztRQUNuRCwyQkFBb0IsUUFBNEIsRUFBVSxNQUErQjtZQUF6RixZQUNFLGlCQUFPLFNBQ1I7WUFGbUIsY0FBUSxHQUFSLFFBQVEsQ0FBb0I7WUFBVSxZQUFNLEdBQU4sTUFBTSxDQUF5Qjs7UUFFekYsQ0FBQztRQUVELHFDQUFTLEdBQVQsVUFBVSxLQUFhO1lBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDNUIsbUJBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUMxQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO1FBQy9CLENBQUM7UUFFRCx3Q0FBWSxHQUFaLFVBQWEsT0FBZ0I7WUFDM0IsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRTtnQkFDbkYsSUFBTSxJQUFJLEdBQUcsa0NBQWMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQzVFLElBQU0sSUFBSSxHQUFH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SUF6RlksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtFbGVtZW50LCBFeHBhbnNpb24sIEV4cGFuc2lvbkNhc2UsIE5vZGUsIFRleHQsIHZpc2l0QWxsfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5cbmltcG9ydCB7QmFzZVZpc2l0b3J9IGZyb20gJy4uL2Jhc2VfdmlzaXRvcic7XG5pbXBvcnQge1RyYW5zbGF0aW9uUGFyc2VFcnJvcn0gZnJvbSAnLi4vdHJhbnNsYXRpb25fcGFyc2Vycy90cmFuc2xhdGlvbl9wYXJzZV9lcnJvcic7XG5pbXBvcnQge2dldEF0dHJpYnV0ZSwgZ2V0QXR0ck9yVGhyb3d9IGZyb20gJy4uL3RyYW5zbGF0aW9uX3BhcnNlcnMvdHJhbnNsYXRpb25fdXRpbHMnO1xuXG5pbXBvcnQge01lc3NhZ2VSZW5kZXJlcn0gZnJvbSAnLi9tZXNzYWdlX3JlbmRlcmVyJztcblxuaW50ZXJmYWNlIE1lc3NhZ2VTZXJpYWxpemVyQ29uZmlnIHtcbiAgaW5saW5lRWxlbWVudHM6IHN0cmluZ1tdO1xuICBwbGFjZWhvbGRlcj86IHtlbGVtZW50TmFtZTogc3RyaW5nOyBuYW1lQXR0cmlidXRlOiBzdHJpbmc7IGJvZHlBdHRyaWJ1dGU/OiBzdHJpbmc7fTtcbiAgcGxhY2Vob2xkZXJDb250YWluZXI/OiB7ZWxlbWVudE5hbWU6IHN0cmluZzsgc3RhcnRBdHRyaWJ1dGU6IHN0cmluZzsgZW5kQXR0cmlidXRlOiBzdHJpbmc7fTtcbn1cblxuLyoqXG4gKiBUaGlzIHZpc2l0b3Igd2lsbCB3YWxrIG92ZXIgYSBzZXQgb2YgWE1MIG5vZGVzLCB3aGljaCByZXByZXNlbnQgYW4gaTE4biBtZXNzYWdlLCBhbmQgc2VyaWFsaXplXG4gKiB0aGVtIGludG8gYSBtZXNzYWdlIG9iamVjdCBvZiB0eXBlIGBUYC5cbiAqIFRoZSB0eXBlIG9mIHRoZSBzZXJpYWxpemVkIG1lc3NhZ2UgaXMgY29udHJvbGxlZCBieSB0aGVcbiAqL1xuZXhwb3J0IGNsYXNzIE1lc3NhZ2VTZXJpYWxpemVyPFQ+IGV4dGVuZHMgQmFzZVZpc2l0b3Ige1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBNZXNzYWdlUmVuZGVyZXI8VD4sIHByaXZhdGUgY29uZmlnOiBNZXNzYWdlU2VyaWFsaXplckNvbmZpZykge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBzZXJpYWxpemUobm9kZXM6IE5vZGVbXSk6IFQge1xuICAgIHRoaXMucmVuZGVyZXIuc3RhcnRSZW5kZXIoKTtcbiAgICB2aXNpdEFsbCh0aGlzLCBub2Rlcyk7XG4gICAgdGhpcy5yZW5kZXJlci5lbmRSZW5kZXIoKTtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5tZXNzYWdlO1xuICB9XG5cbiAgdmlzaXRFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jb25maWcucGxhY2Vob2xkZXIgJiYgZWxlbWVudC5uYW1lID09PSB0aGlzLmNvbmZpZy5wbGFjZWhvbGRlci5lbGVtZW50TmFtZSkge1xuICAgICAgY29uc3QgbmFtZSA9IGdldEF0dHJPclRocm93KGVsZW1lbnQsIHRoaXMuY29uZmlnLnBsYWNlaG9sZGVyLm5hbWVBdHRyaWJ1dGUpO1xuICAgICAgY29uc3QgYm9keSA9IHRoaXMuY29uZmlnLnBsYWNlaG9sZGVyLmJvZHlBdHRyaWJ1dGUgJiZcbiAgICAgICAgICBnZXRBdHRyaWJ1dGUoZWxlbWVudCwgdGhpcy5jb25maWcucGxhY2Vob2xkZXIuYm9keUF0dHJpYnV0ZSk7XG4gICAgICB0aGlzLnZpc2l0UGxhY2Vob2xkZXIobmFtZSwgYm9keSk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgICAgdGhpcy5jb25maWcucGxhY2Vob2xkZXJDb250YWluZXIgJiZcbiAgICAgICAgZWxlbWVudC5uYW1lID09PSB0aGlzLmNvbmZpZy5wbGFjZWhvbGRlckNvbnRhaW5lci5lbGVtZW50TmFtZSkge1xuICAgICAgY29uc3Qgc3RhcnQgPSBnZXRBdHRyT3JUaHJvdyhlbGVtZW50LCB0aGlzLmNvbmZpZy5wbGFjZWhvbGRlckNvbnRhaW5lci5zdGFydEF0dHJpYnV0ZSk7XG4gICAgICBjb25zdCBlbmQgPSBnZXRBdHRyT3JUaHJvdyhlbGVtZW50LCB0aGlzLmNvbmZpZy5wbGFjZWhvbGRlckNvbnRhaW5lci5lbmRBdHRyaWJ1dGUpO1xuICAgICAgdGhpcy52aXNpdFBsYWNlaG9sZGVyQ29udGFpbmVyKHN0YXJ0LCBlbGVtZW50LmNoaWxkcmVuLCBlbmQpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jb25maWcuaW5saW5lRWxlbWVudHMuaW5kZXhPZihlbGVtZW50Lm5hbWUpICE9PSAtMSkge1xuICAgICAgdmlzaXRBbGwodGhpcywgZWxlbWVudC5jaGlsZHJlbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBUcmFuc2xhdGlvblBhcnNlRXJyb3IoZWxlbWVudC5zb3VyY2VTcGFuLCBgSW52YWxpZCBlbGVtZW50IGZvdW5kIGluIG1lc3NhZ2UuYCk7XG4gICAgfVxuICB9XG5cbiAgdmlzaXRUZXh0KHRleHQ6IFRleHQpOiB2b2lkIHtcbiAgICB0aGlzLnJlbmRlcmVyLnRleHQodGV4dC52YWx1ZSk7XG4gIH1cblxuICB2aXNpdEV4cGFuc2lvbihleHBhbnNpb246IEV4cGFuc2lvbik6IHZvaWQge1xuICAgIHRoaXMucmVuZGVyZXIuc3RhcnRJY3UoKTtcbiAgICB0aGlzLnJlbmRlcmVyLnRleHQoYCR7ZXhwYW5zaW9uLnN3aXRjaFZhbHVlfSwgJHtleHBhbnNpb24udHlwZX0sYCk7XG4gICAgdmlzaXRBbGwodGhpcywgZXhwYW5zaW9uLmNhc2VzKTtcbiAgICB0aGlzLnJlbmRlcmVyLmVuZEljdSgpO1xuICB9XG5cbiAgdmlzaXRFeHBhbnNpb25DYXNlKGV4cGFuc2lvbkNhc2U6IEV4cGFuc2lvbkNhc2UpOiB2b2lkIHtcbiAgICB0aGlzLnJlbmRlcmVyLnRleHQoYCAke2V4cGFuc2lvbkNhc2UudmFsdWV9IHtgKTtcbiAgICB0aGlzLnJlbmRlcmVyLnN0YXJ0Q29udGFpbmVyKCk7XG4gICAgdmlzaXRBbGwodGhpcywgZXhwYW5zaW9uQ2FzZS5leHByZXNzaW9uKTtcbiAgICB0aGlzLnJlbmRlcmVyLmNsb3NlQ29udGFpbmVyKCk7XG4gICAgdGhpcy5yZW5kZXJlci50ZXh0KGB9YCk7XG4gIH1cblxuICB2aXNpdENvbnRhaW5lZE5vZGVzKG5vZGVzOiBOb2RlW10pOiB2b2lkIHtcbiAgICBjb25zdCBsZW5ndGggPSBub2Rlcy5sZW5ndGg7XG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGlmICghdGhpcy5pc1BsYWNlaG9sZGVyQ29udGFpbmVyKG5vZGVzW2luZGV4XSkpIHtcbiAgICAgICAgY29uc3Qgc3RhcnRPZkNvbnRhaW5lZE5vZGVzID0gaW5kZXg7XG4gICAgICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgIGlmICh0aGlzLmlzUGxhY2Vob2xkZXJDb250YWluZXIobm9kZXNbaW5kZXhdKSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpbmRleCAtIHN0YXJ0T2ZDb250YWluZWROb2RlcyA+IDEpIHtcbiAgICAgICAgICAvLyBPbmx5IGNyZWF0ZSBhIGNvbnRhaW5lciBpZiB0aGVyZSBhcmUgdHdvIG9yIG1vcmUgY29udGFpbmVkIE5vZGVzIGluIGEgcm93XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zdGFydENvbnRhaW5lcigpO1xuICAgICAgICAgIHZpc2l0QWxsKHRoaXMsIG5vZGVzLnNsaWNlKHN0YXJ0T2ZDb250YWluZWROb2RlcywgaW5kZXggLSAxKSk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5jbG9zZUNvbnRhaW5lcigpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgbm9kZXNbaW5kZXhdLnZpc2l0KHRoaXMsIHVuZGVmaW5lZCk7XG4gICAgICB9XG4gICAgICBpbmRleCsrO1xuICAgIH1cbiAgfVxuXG4gIHZpc2l0UGxhY2Vob2xkZXIobmFtZTogc3RyaW5nLCBib2R5OiBzdHJpbmd8dW5kZWZpbmVkKTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXJlci5wbGFjZWhvbGRlcihuYW1lLCBib2R5KTtcbiAgfVxuXG4gIHZpc2l0UGxhY2Vob2xkZXJDb250YWluZXIoc3RhcnROYW1lOiBzdHJpbmcsIGNoaWxkcmVuOiBOb2RlW10sIGNsb3NlTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXJlci5zdGFydFBsYWNlaG9sZGVyKHN0YXJ0TmFtZSk7XG4gICAgdGhpcy52aXNpdENvbnRhaW5lZE5vZGVzKGNoaWxkcmVuKTtcbiAgICB0aGlzLnJlbmRlcmVyLmNsb3NlUGxhY2Vob2xkZXIoY2xvc2VOYW1lKTtcbiAgfVxuXG4gIHByaXZhdGUgaXNQbGFjZWhvbGRlckNvbnRhaW5lcihub2RlOiBOb2RlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBFbGVtZW50ICYmIG5vZGUubmFtZSA9PT0gdGhpcy5jb25maWcucGxhY2Vob2xkZXJDb250YWluZXIhLmVsZW1lbnROYW1lO1xuICB9XG59XG4iXX0=
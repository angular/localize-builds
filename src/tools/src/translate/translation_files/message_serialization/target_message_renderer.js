(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/message_serialization/target_message_renderer", ["require", "exports", "@angular/localize"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var localize_1 = require("@angular/localize");
    /**
     * A message renderer that outputs `ɵParsedTranslation` objects.
     */
    var TargetMessageRenderer = /** @class */ (function () {
        function TargetMessageRenderer() {
            this.current = { messageParts: [], placeholderNames: [], text: '' };
            this.icuDepth = 0;
        }
        Object.defineProperty(TargetMessageRenderer.prototype, "message", {
            get: function () {
                var _a = this.current, messageParts = _a.messageParts, placeholderNames = _a.placeholderNames;
                return localize_1.ɵmakeParsedTranslation(messageParts, placeholderNames);
            },
            enumerable: true,
            configurable: true
        });
        TargetMessageRenderer.prototype.startRender = function () { };
        TargetMessageRenderer.prototype.endRender = function () { this.storeMessagePart(); };
        TargetMessageRenderer.prototype.text = function (text) { this.current.text += text; };
        TargetMessageRenderer.prototype.placeholder = function (name, body) { this.renderPlaceholder(name); };
        TargetMessageRenderer.prototype.startPlaceholder = function (name) { this.renderPlaceholder(name); };
        TargetMessageRenderer.prototype.closePlaceholder = function (name) { this.renderPlaceholder(name); };
        TargetMessageRenderer.prototype.startContainer = function () { };
        TargetMessageRenderer.prototype.closeContainer = function () { };
        TargetMessageRenderer.prototype.startIcu = function () {
            this.icuDepth++;
            this.text('{');
        };
        TargetMessageRenderer.prototype.endIcu = function () {
            this.icuDepth--;
            this.text('}');
        };
        TargetMessageRenderer.prototype.renderPlaceholder = function (name) {
            if (this.icuDepth > 0) {
                this.text("{" + name + "}");
            }
            else {
                this.storeMessagePart();
                this.current.placeholderNames.push(name);
            }
        };
        TargetMessageRenderer.prototype.storeMessagePart = function () {
            this.current.messageParts.push(this.current.text);
            this.current.text = '';
        };
        return TargetMessageRenderer;
    }());
    exports.TargetMessageRenderer = TargetMessageRenderer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyZ2V0X21lc3NhZ2VfcmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS90cmFuc2xhdGlvbl9maWxlcy9tZXNzYWdlX3NlcmlhbGl6YXRpb24vdGFyZ2V0X21lc3NhZ2VfcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCw4Q0FBNkU7SUFHN0U7O09BRUc7SUFDSDtRQUFBO1lBQ1UsWUFBTyxHQUFnQixFQUFDLFlBQVksRUFBRSxFQUFFLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUMsQ0FBQztZQUMxRSxhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBa0N2QixDQUFDO1FBaENDLHNCQUFJLDBDQUFPO2lCQUFYO2dCQUNRLElBQUEsaUJBQStDLEVBQTlDLDhCQUFZLEVBQUUsc0NBQWdDLENBQUM7Z0JBQ3RELE9BQU8saUNBQXNCLENBQUMsWUFBWSxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDaEUsQ0FBQzs7O1dBQUE7UUFDRCwyQ0FBVyxHQUFYLGNBQXFCLENBQUM7UUFDdEIseUNBQVMsR0FBVCxjQUFvQixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDOUMsb0NBQUksR0FBSixVQUFLLElBQVksSUFBVSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELDJDQUFXLEdBQVgsVUFBWSxJQUFZLEVBQUUsSUFBc0IsSUFBVSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pGLGdEQUFnQixHQUFoQixVQUFpQixJQUFZLElBQVUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RSxnREFBZ0IsR0FBaEIsVUFBaUIsSUFBWSxJQUFVLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEUsOENBQWMsR0FBZCxjQUF3QixDQUFDO1FBQ3pCLDhDQUFjLEdBQWQsY0FBd0IsQ0FBQztRQUN6Qix3Q0FBUSxHQUFSO1lBQ0UsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsQ0FBQztRQUNELHNDQUFNLEdBQU47WUFDRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixDQUFDO1FBQ08saURBQWlCLEdBQXpCLFVBQTBCLElBQVk7WUFDcEMsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRTtnQkFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFJLElBQUksTUFBRyxDQUFDLENBQUM7YUFDeEI7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzFDO1FBQ0gsQ0FBQztRQUNPLGdEQUFnQixHQUF4QjtZQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUN6QixDQUFDO1FBQ0gsNEJBQUM7SUFBRCxDQUFDLEFBcENELElBb0NDO0lBcENZLHNEQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7ybVQYXJzZWRUcmFuc2xhdGlvbiwgybVtYWtlUGFyc2VkVHJhbnNsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcbmltcG9ydCB7TWVzc2FnZVJlbmRlcmVyfSBmcm9tICcuL21lc3NhZ2VfcmVuZGVyZXInO1xuXG4vKipcbiAqIEEgbWVzc2FnZSByZW5kZXJlciB0aGF0IG91dHB1dHMgYMm1UGFyc2VkVHJhbnNsYXRpb25gIG9iamVjdHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBUYXJnZXRNZXNzYWdlUmVuZGVyZXIgaW1wbGVtZW50cyBNZXNzYWdlUmVuZGVyZXI8ybVQYXJzZWRUcmFuc2xhdGlvbj4ge1xuICBwcml2YXRlIGN1cnJlbnQ6IE1lc3NhZ2VJbmZvID0ge21lc3NhZ2VQYXJ0czogW10sIHBsYWNlaG9sZGVyTmFtZXM6IFtdLCB0ZXh0OiAnJ307XG4gIHByaXZhdGUgaWN1RGVwdGggPSAwO1xuXG4gIGdldCBtZXNzYWdlKCk6IMm1UGFyc2VkVHJhbnNsYXRpb24ge1xuICAgIGNvbnN0IHttZXNzYWdlUGFydHMsIHBsYWNlaG9sZGVyTmFtZXN9ID0gdGhpcy5jdXJyZW50O1xuICAgIHJldHVybiDJtW1ha2VQYXJzZWRUcmFuc2xhdGlvbihtZXNzYWdlUGFydHMsIHBsYWNlaG9sZGVyTmFtZXMpO1xuICB9XG4gIHN0YXJ0UmVuZGVyKCk6IHZvaWQge31cbiAgZW5kUmVuZGVyKCk6IHZvaWQgeyB0aGlzLnN0b3JlTWVzc2FnZVBhcnQoKTsgfVxuICB0ZXh0KHRleHQ6IHN0cmluZyk6IHZvaWQgeyB0aGlzLmN1cnJlbnQudGV4dCArPSB0ZXh0OyB9XG4gIHBsYWNlaG9sZGVyKG5hbWU6IHN0cmluZywgYm9keTogc3RyaW5nfHVuZGVmaW5lZCk6IHZvaWQgeyB0aGlzLnJlbmRlclBsYWNlaG9sZGVyKG5hbWUpOyB9XG4gIHN0YXJ0UGxhY2Vob2xkZXIobmFtZTogc3RyaW5nKTogdm9pZCB7IHRoaXMucmVuZGVyUGxhY2Vob2xkZXIobmFtZSk7IH1cbiAgY2xvc2VQbGFjZWhvbGRlcihuYW1lOiBzdHJpbmcpOiB2b2lkIHsgdGhpcy5yZW5kZXJQbGFjZWhvbGRlcihuYW1lKTsgfVxuICBzdGFydENvbnRhaW5lcigpOiB2b2lkIHt9XG4gIGNsb3NlQ29udGFpbmVyKCk6IHZvaWQge31cbiAgc3RhcnRJY3UoKTogdm9pZCB7XG4gICAgdGhpcy5pY3VEZXB0aCsrO1xuICAgIHRoaXMudGV4dCgneycpO1xuICB9XG4gIGVuZEljdSgpOiB2b2lkIHtcbiAgICB0aGlzLmljdURlcHRoLS07XG4gICAgdGhpcy50ZXh0KCd9Jyk7XG4gIH1cbiAgcHJpdmF0ZSByZW5kZXJQbGFjZWhvbGRlcihuYW1lOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5pY3VEZXB0aCA+IDApIHtcbiAgICAgIHRoaXMudGV4dChgeyR7bmFtZX19YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RvcmVNZXNzYWdlUGFydCgpO1xuICAgICAgdGhpcy5jdXJyZW50LnBsYWNlaG9sZGVyTmFtZXMucHVzaChuYW1lKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBzdG9yZU1lc3NhZ2VQYXJ0KCkge1xuICAgIHRoaXMuY3VycmVudC5tZXNzYWdlUGFydHMucHVzaCh0aGlzLmN1cnJlbnQudGV4dCk7XG4gICAgdGhpcy5jdXJyZW50LnRleHQgPSAnJztcbiAgfVxufVxuXG5pbnRlcmZhY2UgTWVzc2FnZUluZm8ge1xuICBtZXNzYWdlUGFydHM6IHN0cmluZ1tdO1xuICBwbGFjZWhvbGRlck5hbWVzOiBzdHJpbmdbXTtcbiAgdGV4dDogc3RyaW5nO1xufSJdfQ==
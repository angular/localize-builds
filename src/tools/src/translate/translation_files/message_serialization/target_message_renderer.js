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
    exports.TargetMessageRenderer = void 0;
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
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
                return (0, localize_1.ɵmakeParsedTranslation)(messageParts, placeholderNames);
            },
            enumerable: false,
            configurable: true
        });
        TargetMessageRenderer.prototype.startRender = function () { };
        TargetMessageRenderer.prototype.endRender = function () {
            this.storeMessagePart();
        };
        TargetMessageRenderer.prototype.text = function (text) {
            this.current.text += text;
        };
        TargetMessageRenderer.prototype.placeholder = function (name, body) {
            this.renderPlaceholder(name);
        };
        TargetMessageRenderer.prototype.startPlaceholder = function (name) {
            this.renderPlaceholder(name);
        };
        TargetMessageRenderer.prototype.closePlaceholder = function (name) {
            this.renderPlaceholder(name);
        };
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
        TargetMessageRenderer.prototype.normalizePlaceholderName = function (name) {
            return name.replace(/-/g, '_');
        };
        TargetMessageRenderer.prototype.renderPlaceholder = function (name) {
            name = this.normalizePlaceholderName(name);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyZ2V0X21lc3NhZ2VfcmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS90cmFuc2xhdGlvbl9maWxlcy9tZXNzYWdlX3NlcmlhbGl6YXRpb24vdGFyZ2V0X21lc3NhZ2VfcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOENBQTZFO0lBSTdFOztPQUVHO0lBQ0g7UUFBQTtZQUNVLFlBQU8sR0FBZ0IsRUFBQyxZQUFZLEVBQUUsRUFBRSxFQUFFLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFDLENBQUM7WUFDMUUsYUFBUSxHQUFHLENBQUMsQ0FBQztRQWdEdkIsQ0FBQztRQTlDQyxzQkFBSSwwQ0FBTztpQkFBWDtnQkFDUSxJQUFBLEtBQW1DLElBQUksQ0FBQyxPQUFPLEVBQTlDLFlBQVksa0JBQUEsRUFBRSxnQkFBZ0Isc0JBQWdCLENBQUM7Z0JBQ3RELE9BQU8sSUFBQSxpQ0FBc0IsRUFBQyxZQUFZLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUNoRSxDQUFDOzs7V0FBQTtRQUNELDJDQUFXLEdBQVgsY0FBcUIsQ0FBQztRQUN0Qix5Q0FBUyxHQUFUO1lBQ0UsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDMUIsQ0FBQztRQUNELG9DQUFJLEdBQUosVUFBSyxJQUFZO1lBQ2YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDO1FBQzVCLENBQUM7UUFDRCwyQ0FBVyxHQUFYLFVBQVksSUFBWSxFQUFFLElBQXNCO1lBQzlDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQixDQUFDO1FBQ0QsZ0RBQWdCLEdBQWhCLFVBQWlCLElBQVk7WUFDM0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFDRCxnREFBZ0IsR0FBaEIsVUFBaUIsSUFBWTtZQUMzQixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsQ0FBQztRQUNELDhDQUFjLEdBQWQsY0FBd0IsQ0FBQztRQUN6Qiw4Q0FBYyxHQUFkLGNBQXdCLENBQUM7UUFDekIsd0NBQVEsR0FBUjtZQUNFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxzQ0FBTSxHQUFOO1lBQ0UsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsQ0FBQztRQUNPLHdEQUF3QixHQUFoQyxVQUFpQyxJQUFZO1lBQzNDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDakMsQ0FBQztRQUNPLGlEQUFpQixHQUF6QixVQUEwQixJQUFZO1lBQ3BDLElBQUksR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0MsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRTtnQkFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFJLElBQUksTUFBRyxDQUFDLENBQUM7YUFDeEI7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzFDO1FBQ0gsQ0FBQztRQUNPLGdEQUFnQixHQUF4QjtZQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUN6QixDQUFDO1FBQ0gsNEJBQUM7SUFBRCxDQUFDLEFBbERELElBa0RDO0lBbERZLHNEQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHvJtW1ha2VQYXJzZWRUcmFuc2xhdGlvbiwgybVQYXJzZWRUcmFuc2xhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuXG5pbXBvcnQge01lc3NhZ2VSZW5kZXJlcn0gZnJvbSAnLi9tZXNzYWdlX3JlbmRlcmVyJztcblxuLyoqXG4gKiBBIG1lc3NhZ2UgcmVuZGVyZXIgdGhhdCBvdXRwdXRzIGDJtVBhcnNlZFRyYW5zbGF0aW9uYCBvYmplY3RzLlxuICovXG5leHBvcnQgY2xhc3MgVGFyZ2V0TWVzc2FnZVJlbmRlcmVyIGltcGxlbWVudHMgTWVzc2FnZVJlbmRlcmVyPMm1UGFyc2VkVHJhbnNsYXRpb24+IHtcbiAgcHJpdmF0ZSBjdXJyZW50OiBNZXNzYWdlSW5mbyA9IHttZXNzYWdlUGFydHM6IFtdLCBwbGFjZWhvbGRlck5hbWVzOiBbXSwgdGV4dDogJyd9O1xuICBwcml2YXRlIGljdURlcHRoID0gMDtcblxuICBnZXQgbWVzc2FnZSgpOiDJtVBhcnNlZFRyYW5zbGF0aW9uIHtcbiAgICBjb25zdCB7bWVzc2FnZVBhcnRzLCBwbGFjZWhvbGRlck5hbWVzfSA9IHRoaXMuY3VycmVudDtcbiAgICByZXR1cm4gybVtYWtlUGFyc2VkVHJhbnNsYXRpb24obWVzc2FnZVBhcnRzLCBwbGFjZWhvbGRlck5hbWVzKTtcbiAgfVxuICBzdGFydFJlbmRlcigpOiB2b2lkIHt9XG4gIGVuZFJlbmRlcigpOiB2b2lkIHtcbiAgICB0aGlzLnN0b3JlTWVzc2FnZVBhcnQoKTtcbiAgfVxuICB0ZXh0KHRleHQ6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuY3VycmVudC50ZXh0ICs9IHRleHQ7XG4gIH1cbiAgcGxhY2Vob2xkZXIobmFtZTogc3RyaW5nLCBib2R5OiBzdHJpbmd8dW5kZWZpbmVkKTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXJQbGFjZWhvbGRlcihuYW1lKTtcbiAgfVxuICBzdGFydFBsYWNlaG9sZGVyKG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMucmVuZGVyUGxhY2Vob2xkZXIobmFtZSk7XG4gIH1cbiAgY2xvc2VQbGFjZWhvbGRlcihuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnJlbmRlclBsYWNlaG9sZGVyKG5hbWUpO1xuICB9XG4gIHN0YXJ0Q29udGFpbmVyKCk6IHZvaWQge31cbiAgY2xvc2VDb250YWluZXIoKTogdm9pZCB7fVxuICBzdGFydEljdSgpOiB2b2lkIHtcbiAgICB0aGlzLmljdURlcHRoKys7XG4gICAgdGhpcy50ZXh0KCd7Jyk7XG4gIH1cbiAgZW5kSWN1KCk6IHZvaWQge1xuICAgIHRoaXMuaWN1RGVwdGgtLTtcbiAgICB0aGlzLnRleHQoJ30nKTtcbiAgfVxuICBwcml2YXRlIG5vcm1hbGl6ZVBsYWNlaG9sZGVyTmFtZShuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmFtZS5yZXBsYWNlKC8tL2csICdfJyk7XG4gIH1cbiAgcHJpdmF0ZSByZW5kZXJQbGFjZWhvbGRlcihuYW1lOiBzdHJpbmcpIHtcbiAgICBuYW1lID0gdGhpcy5ub3JtYWxpemVQbGFjZWhvbGRlck5hbWUobmFtZSk7XG4gICAgaWYgKHRoaXMuaWN1RGVwdGggPiAwKSB7XG4gICAgICB0aGlzLnRleHQoYHske25hbWV9fWApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0b3JlTWVzc2FnZVBhcnQoKTtcbiAgICAgIHRoaXMuY3VycmVudC5wbGFjZWhvbGRlck5hbWVzLnB1c2gobmFtZSk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgc3RvcmVNZXNzYWdlUGFydCgpIHtcbiAgICB0aGlzLmN1cnJlbnQubWVzc2FnZVBhcnRzLnB1c2godGhpcy5jdXJyZW50LnRleHQpO1xuICAgIHRoaXMuY3VycmVudC50ZXh0ID0gJyc7XG4gIH1cbn1cblxuaW50ZXJmYWNlIE1lc3NhZ2VJbmZvIHtcbiAgbWVzc2FnZVBhcnRzOiBzdHJpbmdbXTtcbiAgcGxhY2Vob2xkZXJOYW1lczogc3RyaW5nW107XG4gIHRleHQ6IHN0cmluZztcbn1cbiJdfQ==
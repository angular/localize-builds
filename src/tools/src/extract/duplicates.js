(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/extract/duplicates", ["require", "exports", "tslib", "@angular/localize/src/tools/src/diagnostics", "@angular/localize/src/tools/src/source_file_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.checkDuplicateMessages = void 0;
    var tslib_1 = require("tslib");
    var diagnostics_1 = require("@angular/localize/src/tools/src/diagnostics");
    var source_file_utils_1 = require("@angular/localize/src/tools/src/source_file_utils");
    /**
     * Check each of the given `messages` to find those that have the same id but different message
     * text. Add diagnostics messages for each of these duplicate messages to the given `diagnostics`
     * object (as necessary).
     */
    function checkDuplicateMessages(fs, messages, duplicateMessageHandling, basePath) {
        var e_1, _a, e_2, _b;
        var diagnostics = new diagnostics_1.Diagnostics();
        if (duplicateMessageHandling === 'ignore')
            return diagnostics;
        var messageMap = new Map();
        try {
            for (var messages_1 = (0, tslib_1.__values)(messages), messages_1_1 = messages_1.next(); !messages_1_1.done; messages_1_1 = messages_1.next()) {
                var message = messages_1_1.value;
                if (messageMap.has(message.id)) {
                    messageMap.get(message.id).push(message);
                }
                else {
                    messageMap.set(message.id, [message]);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (messages_1_1 && !messages_1_1.done && (_a = messages_1.return)) _a.call(messages_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var _loop_1 = function (duplicates) {
            if (duplicates.length <= 1)
                return "continue";
            if (duplicates.every(function (message) { return message.text === duplicates[0].text; }))
                return "continue";
            var diagnosticMessage = "Duplicate messages with id \"" + duplicates[0].id + "\":\n" +
                duplicates.map(function (message) { return serializeMessage(fs, basePath, message); }).join('\n');
            diagnostics.add(duplicateMessageHandling, diagnosticMessage);
        };
        try {
            for (var _c = (0, tslib_1.__values)(messageMap.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var duplicates = _d.value;
                _loop_1(duplicates);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return diagnostics;
    }
    exports.checkDuplicateMessages = checkDuplicateMessages;
    /**
     * Serialize the given `message` object into a string.
     */
    function serializeMessage(fs, basePath, message) {
        if (message.location === undefined) {
            return "   - \"" + message.text + "\"";
        }
        else {
            var locationFile = fs.relative(basePath, message.location.file);
            var locationPosition = (0, source_file_utils_1.serializeLocationPosition)(message.location);
            return "   - \"" + message.text + "\" : " + locationFile + ":" + locationPosition;
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVwbGljYXRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvZXh0cmFjdC9kdXBsaWNhdGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFVQSwyRUFBdUU7SUFDdkUsdUZBQStEO0lBRS9EOzs7O09BSUc7SUFDSCxTQUFnQixzQkFBc0IsQ0FDbEMsRUFBb0IsRUFBRSxRQUEwQixFQUNoRCx3QkFBb0QsRUFBRSxRQUF3Qjs7UUFDaEYsSUFBTSxXQUFXLEdBQUcsSUFBSSx5QkFBVyxFQUFFLENBQUM7UUFDdEMsSUFBSSx3QkFBd0IsS0FBSyxRQUFRO1lBQUUsT0FBTyxXQUFXLENBQUM7UUFFOUQsSUFBTSxVQUFVLEdBQUcsSUFBSSxHQUFHLEVBQWdDLENBQUM7O1lBQzNELEtBQXNCLElBQUEsYUFBQSxzQkFBQSxRQUFRLENBQUEsa0NBQUEsd0RBQUU7Z0JBQTNCLElBQU0sT0FBTyxxQkFBQTtnQkFDaEIsSUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRTtvQkFDOUIsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUMzQztxQkFBTTtvQkFDTCxVQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2lCQUN2QzthQUNGOzs7Ozs7Ozs7Z0NBRVUsVUFBVTtZQUNuQixJQUFJLFVBQVUsQ0FBQyxNQUFNLElBQUksQ0FBQztrQ0FBVztZQUNyQyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBQSxPQUFPLElBQUksT0FBQSxPQUFPLENBQUMsSUFBSSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQW5DLENBQW1DLENBQUM7a0NBQVc7WUFFL0UsSUFBTSxpQkFBaUIsR0FBRyxrQ0FBK0IsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBTTtnQkFDM0UsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFBLE9BQU8sSUFBSSxPQUFBLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQXZDLENBQXVDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEYsV0FBVyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDOzs7WUFOL0QsS0FBeUIsSUFBQSxLQUFBLHNCQUFBLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQSxnQkFBQTtnQkFBdkMsSUFBTSxVQUFVLFdBQUE7d0JBQVYsVUFBVTthQU9wQjs7Ozs7Ozs7O1FBRUQsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQztJQXpCRCx3REF5QkM7SUFFRDs7T0FFRztJQUNILFNBQVMsZ0JBQWdCLENBQ3JCLEVBQW9CLEVBQUUsUUFBd0IsRUFBRSxPQUF1QjtRQUN6RSxJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssU0FBUyxFQUFFO1lBQ2xDLE9BQU8sWUFBUyxPQUFPLENBQUMsSUFBSSxPQUFHLENBQUM7U0FDakM7YUFBTTtZQUNMLElBQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEUsSUFBTSxnQkFBZ0IsR0FBRyxJQUFBLDZDQUF5QixFQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNyRSxPQUFPLFlBQVMsT0FBTyxDQUFDLElBQUksYUFBTyxZQUFZLFNBQUksZ0JBQWtCLENBQUM7U0FDdkU7SUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0Fic29sdXRlRnNQYXRoLCBQYXRoTWFuaXB1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb21waWxlci1jbGkvc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7ybVNZXNzYWdlSWQsIMm1UGFyc2VkTWVzc2FnZX0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuXG5pbXBvcnQge0RpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5LCBEaWFnbm9zdGljc30gZnJvbSAnLi4vZGlhZ25vc3RpY3MnO1xuaW1wb3J0IHtzZXJpYWxpemVMb2NhdGlvblBvc2l0aW9ufSBmcm9tICcuLi9zb3VyY2VfZmlsZV91dGlscyc7XG5cbi8qKlxuICogQ2hlY2sgZWFjaCBvZiB0aGUgZ2l2ZW4gYG1lc3NhZ2VzYCB0byBmaW5kIHRob3NlIHRoYXQgaGF2ZSB0aGUgc2FtZSBpZCBidXQgZGlmZmVyZW50IG1lc3NhZ2VcbiAqIHRleHQuIEFkZCBkaWFnbm9zdGljcyBtZXNzYWdlcyBmb3IgZWFjaCBvZiB0aGVzZSBkdXBsaWNhdGUgbWVzc2FnZXMgdG8gdGhlIGdpdmVuIGBkaWFnbm9zdGljc2BcbiAqIG9iamVjdCAoYXMgbmVjZXNzYXJ5KS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrRHVwbGljYXRlTWVzc2FnZXMoXG4gICAgZnM6IFBhdGhNYW5pcHVsYXRpb24sIG1lc3NhZ2VzOiDJtVBhcnNlZE1lc3NhZ2VbXSxcbiAgICBkdXBsaWNhdGVNZXNzYWdlSGFuZGxpbmc6IERpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5LCBiYXNlUGF0aDogQWJzb2x1dGVGc1BhdGgpOiBEaWFnbm9zdGljcyB7XG4gIGNvbnN0IGRpYWdub3N0aWNzID0gbmV3IERpYWdub3N0aWNzKCk7XG4gIGlmIChkdXBsaWNhdGVNZXNzYWdlSGFuZGxpbmcgPT09ICdpZ25vcmUnKSByZXR1cm4gZGlhZ25vc3RpY3M7XG5cbiAgY29uc3QgbWVzc2FnZU1hcCA9IG5ldyBNYXA8ybVNZXNzYWdlSWQsIMm1UGFyc2VkTWVzc2FnZVtdPigpO1xuICBmb3IgKGNvbnN0IG1lc3NhZ2Ugb2YgbWVzc2FnZXMpIHtcbiAgICBpZiAobWVzc2FnZU1hcC5oYXMobWVzc2FnZS5pZCkpIHtcbiAgICAgIG1lc3NhZ2VNYXAuZ2V0KG1lc3NhZ2UuaWQpIS5wdXNoKG1lc3NhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXNzYWdlTWFwLnNldChtZXNzYWdlLmlkLCBbbWVzc2FnZV0pO1xuICAgIH1cbiAgfVxuXG4gIGZvciAoY29uc3QgZHVwbGljYXRlcyBvZiBtZXNzYWdlTWFwLnZhbHVlcygpKSB7XG4gICAgaWYgKGR1cGxpY2F0ZXMubGVuZ3RoIDw9IDEpIGNvbnRpbnVlO1xuICAgIGlmIChkdXBsaWNhdGVzLmV2ZXJ5KG1lc3NhZ2UgPT4gbWVzc2FnZS50ZXh0ID09PSBkdXBsaWNhdGVzWzBdLnRleHQpKSBjb250aW51ZTtcblxuICAgIGNvbnN0IGRpYWdub3N0aWNNZXNzYWdlID0gYER1cGxpY2F0ZSBtZXNzYWdlcyB3aXRoIGlkIFwiJHtkdXBsaWNhdGVzWzBdLmlkfVwiOlxcbmAgK1xuICAgICAgICBkdXBsaWNhdGVzLm1hcChtZXNzYWdlID0+IHNlcmlhbGl6ZU1lc3NhZ2UoZnMsIGJhc2VQYXRoLCBtZXNzYWdlKSkuam9pbignXFxuJyk7XG4gICAgZGlhZ25vc3RpY3MuYWRkKGR1cGxpY2F0ZU1lc3NhZ2VIYW5kbGluZywgZGlhZ25vc3RpY01lc3NhZ2UpO1xuICB9XG5cbiAgcmV0dXJuIGRpYWdub3N0aWNzO1xufVxuXG4vKipcbiAqIFNlcmlhbGl6ZSB0aGUgZ2l2ZW4gYG1lc3NhZ2VgIG9iamVjdCBpbnRvIGEgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBzZXJpYWxpemVNZXNzYWdlKFxuICAgIGZzOiBQYXRoTWFuaXB1bGF0aW9uLCBiYXNlUGF0aDogQWJzb2x1dGVGc1BhdGgsIG1lc3NhZ2U6IMm1UGFyc2VkTWVzc2FnZSk6IHN0cmluZyB7XG4gIGlmIChtZXNzYWdlLmxvY2F0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gYCAgIC0gXCIke21lc3NhZ2UudGV4dH1cImA7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgbG9jYXRpb25GaWxlID0gZnMucmVsYXRpdmUoYmFzZVBhdGgsIG1lc3NhZ2UubG9jYXRpb24uZmlsZSk7XG4gICAgY29uc3QgbG9jYXRpb25Qb3NpdGlvbiA9IHNlcmlhbGl6ZUxvY2F0aW9uUG9zaXRpb24obWVzc2FnZS5sb2NhdGlvbik7XG4gICAgcmV0dXJuIGAgICAtIFwiJHttZXNzYWdlLnRleHR9XCIgOiAke2xvY2F0aW9uRmlsZX06JHtsb2NhdGlvblBvc2l0aW9ufWA7XG4gIH1cbn1cbiJdfQ==
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/extract/translation_files/arb_translation_serializer", ["require", "exports", "tslib", "@angular/localize/src/tools/src/extract/translation_files/utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ArbTranslationSerializer = void 0;
    var tslib_1 = require("tslib");
    var utils_1 = require("@angular/localize/src/tools/src/extract/translation_files/utils");
    /**
     * A translation serializer that can render JSON formatted as an Application Resource Bundle (ARB).
     *
     * See https://github.com/google/app-resource-bundle/wiki/ApplicationResourceBundleSpecification
     *
     * ```
     * {
     *   "@@locale": "en-US",
     *   "message-id": "Target message string",
     *   "@message-id": {
     *     "type": "text",
     *     "description": "Some description text",
     *     "x-locations": [
     *       {
     *         "start": {"line": 23, "column": 145},
     *         "end": {"line": 24, "column": 53},
     *         "file": "some/file.ts"
     *       },
     *       ...
     *     ]
     *   },
     *   ...
     * }
     * ```
     */
    /**
     * This is a semi-public bespoke serialization format that is used for testing and sometimes as a
     * format for storing translations that will be inlined at runtime.
     *
     * @see ArbTranslationParser
     */
    var ArbTranslationSerializer = /** @class */ (function () {
        function ArbTranslationSerializer(sourceLocale, basePath, fs) {
            this.sourceLocale = sourceLocale;
            this.basePath = basePath;
            this.fs = fs;
        }
        ArbTranslationSerializer.prototype.serialize = function (messages) {
            var e_1, _a;
            var messageGroups = utils_1.consolidateMessages(messages, function (message) { return getMessageId(message); });
            var output = "{\n  \"@@locale\": " + JSON.stringify(this.sourceLocale);
            try {
                for (var messageGroups_1 = tslib_1.__values(messageGroups), messageGroups_1_1 = messageGroups_1.next(); !messageGroups_1_1.done; messageGroups_1_1 = messageGroups_1.next()) {
                    var duplicateMessages = messageGroups_1_1.value;
                    var message = duplicateMessages[0];
                    var id = getMessageId(message);
                    output += this.serializeMessage(id, message);
                    output += this.serializeMeta(id, message.description, duplicateMessages.filter(utils_1.hasLocation).map(function (m) { return m.location; }));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (messageGroups_1_1 && !messageGroups_1_1.done && (_a = messageGroups_1.return)) _a.call(messageGroups_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            output += '\n}';
            return output;
        };
        ArbTranslationSerializer.prototype.serializeMessage = function (id, message) {
            return ",\n  " + JSON.stringify(id) + ": " + JSON.stringify(message.text);
        };
        ArbTranslationSerializer.prototype.serializeMeta = function (id, description, locations) {
            var meta = [];
            if (description) {
                meta.push("\n    \"description\": " + JSON.stringify(description));
            }
            if (locations.length > 0) {
                var locationStr = "\n    \"x-locations\": [";
                for (var i = 0; i < locations.length; i++) {
                    locationStr += (i > 0 ? ',\n' : '\n') + this.serializeLocation(locations[i]);
                }
                locationStr += '\n    ]';
                meta.push(locationStr);
            }
            return meta.length > 0 ? ",\n  " + JSON.stringify('@' + id) + ": {" + meta.join(',') + "\n  }" : '';
        };
        ArbTranslationSerializer.prototype.serializeLocation = function (_a) {
            var file = _a.file, start = _a.start, end = _a.end;
            return [
                "      {",
                "        \"file\": " + JSON.stringify(this.fs.relative(this.basePath, file)) + ",",
                "        \"start\": { \"line\": \"" + start.line + "\", \"column\": \"" + start.column + "\" },",
                "        \"end\": { \"line\": \"" + end.line + "\", \"column\": \"" + end.column + "\" }",
                "      }",
            ].join('\n');
        };
        return ArbTranslationSerializer;
    }());
    exports.ArbTranslationSerializer = ArbTranslationSerializer;
    function getMessageId(message) {
        return message.customId || message.id;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJiX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2V4dHJhY3QvdHJhbnNsYXRpb25fZmlsZXMvYXJiX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQVVBLHlGQUF5RDtJQUV6RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Bd0JHO0lBRUg7Ozs7O09BS0c7SUFDSDtRQUNFLGtDQUNZLFlBQW9CLEVBQVUsUUFBd0IsRUFDdEQsRUFBb0I7WUFEcEIsaUJBQVksR0FBWixZQUFZLENBQVE7WUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFnQjtZQUN0RCxPQUFFLEdBQUYsRUFBRSxDQUFrQjtRQUFHLENBQUM7UUFFcEMsNENBQVMsR0FBVCxVQUFVLFFBQTBCOztZQUNsQyxJQUFNLGFBQWEsR0FBRywyQkFBbUIsQ0FBQyxRQUFRLEVBQUUsVUFBQSxPQUFPLElBQUksT0FBQSxZQUFZLENBQUMsT0FBTyxDQUFDLEVBQXJCLENBQXFCLENBQUMsQ0FBQztZQUV0RixJQUFJLE1BQU0sR0FBRyx3QkFBb0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFHLENBQUM7O2dCQUVyRSxLQUFnQyxJQUFBLGtCQUFBLGlCQUFBLGFBQWEsQ0FBQSw0Q0FBQSx1RUFBRTtvQkFBMUMsSUFBTSxpQkFBaUIsMEJBQUE7b0JBQzFCLElBQU0sT0FBTyxHQUFHLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNyQyxJQUFNLEVBQUUsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ2pDLE1BQU0sSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUM3QyxNQUFNLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FDeEIsRUFBRSxFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQUUsaUJBQWlCLENBQUMsTUFBTSxDQUFDLG1CQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsUUFBUSxFQUFWLENBQVUsQ0FBQyxDQUFDLENBQUM7aUJBQzFGOzs7Ozs7Ozs7WUFFRCxNQUFNLElBQUksS0FBSyxDQUFDO1lBRWhCLE9BQU8sTUFBTSxDQUFDO1FBQ2hCLENBQUM7UUFFTyxtREFBZ0IsR0FBeEIsVUFBeUIsRUFBVSxFQUFFLE9BQXVCO1lBQzFELE9BQU8sVUFBUSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxVQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBRyxDQUFDO1FBQ3ZFLENBQUM7UUFFTyxnREFBYSxHQUFyQixVQUFzQixFQUFVLEVBQUUsV0FBNkIsRUFBRSxTQUE0QjtZQUUzRixJQUFNLElBQUksR0FBYSxFQUFFLENBQUM7WUFFMUIsSUFBSSxXQUFXLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLElBQUksQ0FBQyw0QkFBd0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUcsQ0FBQyxDQUFDO2FBQ2xFO1lBRUQsSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDeEIsSUFBSSxXQUFXLEdBQUcsMEJBQXdCLENBQUM7Z0JBQzNDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN6QyxXQUFXLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDOUU7Z0JBQ0QsV0FBVyxJQUFJLFNBQVMsQ0FBQztnQkFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUN4QjtZQUVELE9BQU8sSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLFdBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDNUYsQ0FBQztRQUVPLG9EQUFpQixHQUF6QixVQUEwQixFQUFtQztnQkFBbEMsSUFBSSxVQUFBLEVBQUUsS0FBSyxXQUFBLEVBQUUsR0FBRyxTQUFBO1lBQ3pDLE9BQU87Z0JBQ0wsU0FBUztnQkFDVCx1QkFBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLE1BQUc7Z0JBQzNFLHNDQUErQixLQUFLLENBQUMsSUFBSSwwQkFBaUIsS0FBSyxDQUFDLE1BQU0sVUFBTTtnQkFDNUUsb0NBQTZCLEdBQUcsQ0FBQyxJQUFJLDBCQUFpQixHQUFHLENBQUMsTUFBTSxTQUFLO2dCQUNyRSxTQUFTO2FBQ1YsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDZixDQUFDO1FBQ0gsK0JBQUM7SUFBRCxDQUFDLEFBeERELElBd0RDO0lBeERZLDREQUF3QjtJQTBEckMsU0FBUyxZQUFZLENBQUMsT0FBdUI7UUFDM0MsT0FBTyxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUM7SUFDeEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aCwgUGF0aE1hbmlwdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQge8m1UGFyc2VkTWVzc2FnZSwgybVTb3VyY2VMb2NhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuaW1wb3J0IHtUcmFuc2xhdGlvblNlcmlhbGl6ZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fc2VyaWFsaXplcic7XG5pbXBvcnQge2NvbnNvbGlkYXRlTWVzc2FnZXMsIGhhc0xvY2F0aW9ufSBmcm9tICcuL3V0aWxzJztcblxuLyoqXG4gKiBBIHRyYW5zbGF0aW9uIHNlcmlhbGl6ZXIgdGhhdCBjYW4gcmVuZGVyIEpTT04gZm9ybWF0dGVkIGFzIGFuIEFwcGxpY2F0aW9uIFJlc291cmNlIEJ1bmRsZSAoQVJCKS5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS9hcHAtcmVzb3VyY2UtYnVuZGxlL3dpa2kvQXBwbGljYXRpb25SZXNvdXJjZUJ1bmRsZVNwZWNpZmljYXRpb25cbiAqXG4gKiBgYGBcbiAqIHtcbiAqICAgXCJAQGxvY2FsZVwiOiBcImVuLVVTXCIsXG4gKiAgIFwibWVzc2FnZS1pZFwiOiBcIlRhcmdldCBtZXNzYWdlIHN0cmluZ1wiLFxuICogICBcIkBtZXNzYWdlLWlkXCI6IHtcbiAqICAgICBcInR5cGVcIjogXCJ0ZXh0XCIsXG4gKiAgICAgXCJkZXNjcmlwdGlvblwiOiBcIlNvbWUgZGVzY3JpcHRpb24gdGV4dFwiLFxuICogICAgIFwieC1sb2NhdGlvbnNcIjogW1xuICogICAgICAge1xuICogICAgICAgICBcInN0YXJ0XCI6IHtcImxpbmVcIjogMjMsIFwiY29sdW1uXCI6IDE0NX0sXG4gKiAgICAgICAgIFwiZW5kXCI6IHtcImxpbmVcIjogMjQsIFwiY29sdW1uXCI6IDUzfSxcbiAqICAgICAgICAgXCJmaWxlXCI6IFwic29tZS9maWxlLnRzXCJcbiAqICAgICAgIH0sXG4gKiAgICAgICAuLi5cbiAqICAgICBdXG4gKiAgIH0sXG4gKiAgIC4uLlxuICogfVxuICogYGBgXG4gKi9cblxuLyoqXG4gKiBUaGlzIGlzIGEgc2VtaS1wdWJsaWMgYmVzcG9rZSBzZXJpYWxpemF0aW9uIGZvcm1hdCB0aGF0IGlzIHVzZWQgZm9yIHRlc3RpbmcgYW5kIHNvbWV0aW1lcyBhcyBhXG4gKiBmb3JtYXQgZm9yIHN0b3JpbmcgdHJhbnNsYXRpb25zIHRoYXQgd2lsbCBiZSBpbmxpbmVkIGF0IHJ1bnRpbWUuXG4gKlxuICogQHNlZSBBcmJUcmFuc2xhdGlvblBhcnNlclxuICovXG5leHBvcnQgY2xhc3MgQXJiVHJhbnNsYXRpb25TZXJpYWxpemVyIGltcGxlbWVudHMgVHJhbnNsYXRpb25TZXJpYWxpemVyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHNvdXJjZUxvY2FsZTogc3RyaW5nLCBwcml2YXRlIGJhc2VQYXRoOiBBYnNvbHV0ZUZzUGF0aCxcbiAgICAgIHByaXZhdGUgZnM6IFBhdGhNYW5pcHVsYXRpb24pIHt9XG5cbiAgc2VyaWFsaXplKG1lc3NhZ2VzOiDJtVBhcnNlZE1lc3NhZ2VbXSk6IHN0cmluZyB7XG4gICAgY29uc3QgbWVzc2FnZUdyb3VwcyA9IGNvbnNvbGlkYXRlTWVzc2FnZXMobWVzc2FnZXMsIG1lc3NhZ2UgPT4gZ2V0TWVzc2FnZUlkKG1lc3NhZ2UpKTtcblxuICAgIGxldCBvdXRwdXQgPSBge1xcbiAgXCJAQGxvY2FsZVwiOiAke0pTT04uc3RyaW5naWZ5KHRoaXMuc291cmNlTG9jYWxlKX1gO1xuXG4gICAgZm9yIChjb25zdCBkdXBsaWNhdGVNZXNzYWdlcyBvZiBtZXNzYWdlR3JvdXBzKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gZHVwbGljYXRlTWVzc2FnZXNbMF07XG4gICAgICBjb25zdCBpZCA9IGdldE1lc3NhZ2VJZChtZXNzYWdlKTtcbiAgICAgIG91dHB1dCArPSB0aGlzLnNlcmlhbGl6ZU1lc3NhZ2UoaWQsIG1lc3NhZ2UpO1xuICAgICAgb3V0cHV0ICs9IHRoaXMuc2VyaWFsaXplTWV0YShcbiAgICAgICAgICBpZCwgbWVzc2FnZS5kZXNjcmlwdGlvbiwgZHVwbGljYXRlTWVzc2FnZXMuZmlsdGVyKGhhc0xvY2F0aW9uKS5tYXAobSA9PiBtLmxvY2F0aW9uKSk7XG4gICAgfVxuXG4gICAgb3V0cHV0ICs9ICdcXG59JztcblxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZU1lc3NhZ2UoaWQ6IHN0cmluZywgbWVzc2FnZTogybVQYXJzZWRNZXNzYWdlKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCxcXG4gICR7SlNPTi5zdHJpbmdpZnkoaWQpfTogJHtKU09OLnN0cmluZ2lmeShtZXNzYWdlLnRleHQpfWA7XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZU1ldGEoaWQ6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZ3x1bmRlZmluZWQsIGxvY2F0aW9uczogybVTb3VyY2VMb2NhdGlvbltdKTpcbiAgICAgIHN0cmluZyB7XG4gICAgY29uc3QgbWV0YTogc3RyaW5nW10gPSBbXTtcblxuICAgIGlmIChkZXNjcmlwdGlvbikge1xuICAgICAgbWV0YS5wdXNoKGBcXG4gICAgXCJkZXNjcmlwdGlvblwiOiAke0pTT04uc3RyaW5naWZ5KGRlc2NyaXB0aW9uKX1gKTtcbiAgICB9XG5cbiAgICBpZiAobG9jYXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBsb2NhdGlvblN0ciA9IGBcXG4gICAgXCJ4LWxvY2F0aW9uc1wiOiBbYDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbG9jYXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxvY2F0aW9uU3RyICs9IChpID4gMCA/ICcsXFxuJyA6ICdcXG4nKSArIHRoaXMuc2VyaWFsaXplTG9jYXRpb24obG9jYXRpb25zW2ldKTtcbiAgICAgIH1cbiAgICAgIGxvY2F0aW9uU3RyICs9ICdcXG4gICAgXSc7XG4gICAgICBtZXRhLnB1c2gobG9jYXRpb25TdHIpO1xuICAgIH1cblxuICAgIHJldHVybiBtZXRhLmxlbmd0aCA+IDAgPyBgLFxcbiAgJHtKU09OLnN0cmluZ2lmeSgnQCcgKyBpZCl9OiB7JHttZXRhLmpvaW4oJywnKX1cXG4gIH1gIDogJyc7XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZUxvY2F0aW9uKHtmaWxlLCBzdGFydCwgZW5kfTogybVTb3VyY2VMb2NhdGlvbik6IHN0cmluZyB7XG4gICAgcmV0dXJuIFtcbiAgICAgIGAgICAgICB7YCxcbiAgICAgIGAgICAgICAgIFwiZmlsZVwiOiAke0pTT04uc3RyaW5naWZ5KHRoaXMuZnMucmVsYXRpdmUodGhpcy5iYXNlUGF0aCwgZmlsZSkpfSxgLFxuICAgICAgYCAgICAgICAgXCJzdGFydFwiOiB7IFwibGluZVwiOiBcIiR7c3RhcnQubGluZX1cIiwgXCJjb2x1bW5cIjogXCIke3N0YXJ0LmNvbHVtbn1cIiB9LGAsXG4gICAgICBgICAgICAgICBcImVuZFwiOiB7IFwibGluZVwiOiBcIiR7ZW5kLmxpbmV9XCIsIFwiY29sdW1uXCI6IFwiJHtlbmQuY29sdW1ufVwiIH1gLFxuICAgICAgYCAgICAgIH1gLFxuICAgIF0uam9pbignXFxuJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0TWVzc2FnZUlkKG1lc3NhZ2U6IMm1UGFyc2VkTWVzc2FnZSk6IHN0cmluZyB7XG4gIHJldHVybiBtZXNzYWdlLmN1c3RvbUlkIHx8IG1lc3NhZ2UuaWQ7XG59XG4iXX0=
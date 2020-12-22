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
            var messageMap = utils_1.consolidateMessages(messages, function (message) { return message.customId || message.id; });
            var output = "{\n  \"@@locale\": " + JSON.stringify(this.sourceLocale);
            try {
                for (var _b = tslib_1.__values(messageMap.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = tslib_1.__read(_c.value, 2), id = _d[0], duplicateMessages = _d[1];
                    var message = duplicateMessages[0];
                    output += this.serializeMessage(id, message);
                    output += this.serializeMeta(id, message.description, duplicateMessages.filter(utils_1.hasLocation).map(function (m) { return m.location; }));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJiX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2V4dHJhY3QvdHJhbnNsYXRpb25fZmlsZXMvYXJiX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQVdBLHlGQUF5RDtJQUV6RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Bd0JHO0lBRUg7Ozs7O09BS0c7SUFDSDtRQUNFLGtDQUNZLFlBQW9CLEVBQVUsUUFBd0IsRUFBVSxFQUFjO1lBQTlFLGlCQUFZLEdBQVosWUFBWSxDQUFRO1lBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBZ0I7WUFBVSxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQUcsQ0FBQztRQUU5Riw0Q0FBUyxHQUFULFVBQVUsUUFBMEI7O1lBQ2xDLElBQU0sVUFBVSxHQUFHLDJCQUFtQixDQUFDLFFBQVEsRUFBRSxVQUFBLE9BQU8sSUFBSSxPQUFBLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLEVBQUUsRUFBOUIsQ0FBOEIsQ0FBQyxDQUFDO1lBRTVGLElBQUksTUFBTSxHQUFHLHdCQUFvQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUcsQ0FBQzs7Z0JBRXJFLEtBQXNDLElBQUEsS0FBQSxpQkFBQSxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUEsZ0JBQUEsNEJBQUU7b0JBQWpELElBQUEsS0FBQSwyQkFBdUIsRUFBdEIsRUFBRSxRQUFBLEVBQUUsaUJBQWlCLFFBQUE7b0JBQy9CLElBQU0sT0FBTyxHQUFHLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNyQyxNQUFNLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztvQkFDN0MsTUFBTSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQ3hCLEVBQUUsRUFBRSxPQUFPLENBQUMsV0FBVyxFQUFFLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxtQkFBVyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFFBQVEsRUFBVixDQUFVLENBQUMsQ0FBQyxDQUFDO2lCQUMxRjs7Ozs7Ozs7O1lBRUQsTUFBTSxJQUFJLEtBQUssQ0FBQztZQUVoQixPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDO1FBRU8sbURBQWdCLEdBQXhCLFVBQXlCLEVBQVUsRUFBRSxPQUF1QjtZQUMxRCxPQUFPLFVBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsVUFBSyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUcsQ0FBQztRQUN2RSxDQUFDO1FBRU8sZ0RBQWEsR0FBckIsVUFBc0IsRUFBVSxFQUFFLFdBQTZCLEVBQUUsU0FBNEI7WUFFM0YsSUFBTSxJQUFJLEdBQWEsRUFBRSxDQUFDO1lBRTFCLElBQUksV0FBVyxFQUFFO2dCQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsNEJBQXdCLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFHLENBQUMsQ0FBQzthQUNsRTtZQUVELElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3hCLElBQUksV0FBVyxHQUFHLDBCQUF3QixDQUFDO2dCQUMzQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDekMsV0FBVyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzlFO2dCQUNELFdBQVcsSUFBSSxTQUFTLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDeEI7WUFFRCxPQUFPLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxXQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzVGLENBQUM7UUFFTyxvREFBaUIsR0FBekIsVUFBMEIsRUFBbUM7Z0JBQWxDLElBQUksVUFBQSxFQUFFLEtBQUssV0FBQSxFQUFFLEdBQUcsU0FBQTtZQUN6QyxPQUFPO2dCQUNMLFNBQVM7Z0JBQ1QsdUJBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxNQUFHO2dCQUMzRSxzQ0FBK0IsS0FBSyxDQUFDLElBQUksMEJBQWlCLEtBQUssQ0FBQyxNQUFNLFVBQU07Z0JBQzVFLG9DQUE2QixHQUFHLENBQUMsSUFBSSwwQkFBaUIsR0FBRyxDQUFDLE1BQU0sU0FBSztnQkFDckUsU0FBUzthQUNWLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2YsQ0FBQztRQUNILCtCQUFDO0lBQUQsQ0FBQyxBQXRERCxJQXNEQztJQXREWSw0REFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGgsIEZpbGVTeXN0ZW19IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHvJtVBhcnNlZE1lc3NhZ2UsIMm1U291cmNlTG9jYXRpb259IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcbmltcG9ydCB7QXJiSnNvbk9iamVjdCwgQXJiTG9jYXRpb24sIEFyYk1ldGFkYXRhfSBmcm9tICcuLi8uLi90cmFuc2xhdGUvdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fcGFyc2Vycy9hcmJfdHJhbnNsYXRpb25fcGFyc2VyJztcbmltcG9ydCB7VHJhbnNsYXRpb25TZXJpYWxpemVyfSBmcm9tICcuL3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtjb25zb2xpZGF0ZU1lc3NhZ2VzLCBoYXNMb2NhdGlvbn0gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogQSB0cmFuc2xhdGlvbiBzZXJpYWxpemVyIHRoYXQgY2FuIHJlbmRlciBKU09OIGZvcm1hdHRlZCBhcyBhbiBBcHBsaWNhdGlvbiBSZXNvdXJjZSBCdW5kbGUgKEFSQikuXG4gKlxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGUvYXBwLXJlc291cmNlLWJ1bmRsZS93aWtpL0FwcGxpY2F0aW9uUmVzb3VyY2VCdW5kbGVTcGVjaWZpY2F0aW9uXG4gKlxuICogYGBgXG4gKiB7XG4gKiAgIFwiQEBsb2NhbGVcIjogXCJlbi1VU1wiLFxuICogICBcIm1lc3NhZ2UtaWRcIjogXCJUYXJnZXQgbWVzc2FnZSBzdHJpbmdcIixcbiAqICAgXCJAbWVzc2FnZS1pZFwiOiB7XG4gKiAgICAgXCJ0eXBlXCI6IFwidGV4dFwiLFxuICogICAgIFwiZGVzY3JpcHRpb25cIjogXCJTb21lIGRlc2NyaXB0aW9uIHRleHRcIixcbiAqICAgICBcIngtbG9jYXRpb25zXCI6IFtcbiAqICAgICAgIHtcbiAqICAgICAgICAgXCJzdGFydFwiOiB7XCJsaW5lXCI6IDIzLCBcImNvbHVtblwiOiAxNDV9LFxuICogICAgICAgICBcImVuZFwiOiB7XCJsaW5lXCI6IDI0LCBcImNvbHVtblwiOiA1M30sXG4gKiAgICAgICAgIFwiZmlsZVwiOiBcInNvbWUvZmlsZS50c1wiXG4gKiAgICAgICB9LFxuICogICAgICAgLi4uXG4gKiAgICAgXVxuICogICB9LFxuICogICAuLi5cbiAqIH1cbiAqIGBgYFxuICovXG5cbi8qKlxuICogVGhpcyBpcyBhIHNlbWktcHVibGljIGJlc3Bva2Ugc2VyaWFsaXphdGlvbiBmb3JtYXQgdGhhdCBpcyB1c2VkIGZvciB0ZXN0aW5nIGFuZCBzb21ldGltZXMgYXMgYVxuICogZm9ybWF0IGZvciBzdG9yaW5nIHRyYW5zbGF0aW9ucyB0aGF0IHdpbGwgYmUgaW5saW5lZCBhdCBydW50aW1lLlxuICpcbiAqIEBzZWUgQXJiVHJhbnNsYXRpb25QYXJzZXJcbiAqL1xuZXhwb3J0IGNsYXNzIEFyYlRyYW5zbGF0aW9uU2VyaWFsaXplciBpbXBsZW1lbnRzIFRyYW5zbGF0aW9uU2VyaWFsaXplciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBzb3VyY2VMb2NhbGU6IHN0cmluZywgcHJpdmF0ZSBiYXNlUGF0aDogQWJzb2x1dGVGc1BhdGgsIHByaXZhdGUgZnM6IEZpbGVTeXN0ZW0pIHt9XG5cbiAgc2VyaWFsaXplKG1lc3NhZ2VzOiDJtVBhcnNlZE1lc3NhZ2VbXSk6IHN0cmluZyB7XG4gICAgY29uc3QgbWVzc2FnZU1hcCA9IGNvbnNvbGlkYXRlTWVzc2FnZXMobWVzc2FnZXMsIG1lc3NhZ2UgPT4gbWVzc2FnZS5jdXN0b21JZCB8fCBtZXNzYWdlLmlkKTtcblxuICAgIGxldCBvdXRwdXQgPSBge1xcbiAgXCJAQGxvY2FsZVwiOiAke0pTT04uc3RyaW5naWZ5KHRoaXMuc291cmNlTG9jYWxlKX1gO1xuXG4gICAgZm9yIChjb25zdCBbaWQsIGR1cGxpY2F0ZU1lc3NhZ2VzXSBvZiBtZXNzYWdlTWFwLmVudHJpZXMoKSkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGR1cGxpY2F0ZU1lc3NhZ2VzWzBdO1xuICAgICAgb3V0cHV0ICs9IHRoaXMuc2VyaWFsaXplTWVzc2FnZShpZCwgbWVzc2FnZSk7XG4gICAgICBvdXRwdXQgKz0gdGhpcy5zZXJpYWxpemVNZXRhKFxuICAgICAgICAgIGlkLCBtZXNzYWdlLmRlc2NyaXB0aW9uLCBkdXBsaWNhdGVNZXNzYWdlcy5maWx0ZXIoaGFzTG9jYXRpb24pLm1hcChtID0+IG0ubG9jYXRpb24pKTtcbiAgICB9XG5cbiAgICBvdXRwdXQgKz0gJ1xcbn0nO1xuXG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplTWVzc2FnZShpZDogc3RyaW5nLCBtZXNzYWdlOiDJtVBhcnNlZE1lc3NhZ2UpOiBzdHJpbmcge1xuICAgIHJldHVybiBgLFxcbiAgJHtKU09OLnN0cmluZ2lmeShpZCl9OiAke0pTT04uc3RyaW5naWZ5KG1lc3NhZ2UudGV4dCl9YDtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplTWV0YShpZDogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nfHVuZGVmaW5lZCwgbG9jYXRpb25zOiDJtVNvdXJjZUxvY2F0aW9uW10pOlxuICAgICAgc3RyaW5nIHtcbiAgICBjb25zdCBtZXRhOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgICBtZXRhLnB1c2goYFxcbiAgICBcImRlc2NyaXB0aW9uXCI6ICR7SlNPTi5zdHJpbmdpZnkoZGVzY3JpcHRpb24pfWApO1xuICAgIH1cblxuICAgIGlmIChsb2NhdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IGxvY2F0aW9uU3RyID0gYFxcbiAgICBcIngtbG9jYXRpb25zXCI6IFtgO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb2NhdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbG9jYXRpb25TdHIgKz0gKGkgPiAwID8gJyxcXG4nIDogJ1xcbicpICsgdGhpcy5zZXJpYWxpemVMb2NhdGlvbihsb2NhdGlvbnNbaV0pO1xuICAgICAgfVxuICAgICAgbG9jYXRpb25TdHIgKz0gJ1xcbiAgICBdJztcbiAgICAgIG1ldGEucHVzaChsb2NhdGlvblN0cik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1ldGEubGVuZ3RoID4gMCA/IGAsXFxuICAke0pTT04uc3RyaW5naWZ5KCdAJyArIGlkKX06IHske21ldGEuam9pbignLCcpfVxcbiAgfWAgOiAnJztcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplTG9jYXRpb24oe2ZpbGUsIHN0YXJ0LCBlbmR9OiDJtVNvdXJjZUxvY2F0aW9uKTogc3RyaW5nIHtcbiAgICByZXR1cm4gW1xuICAgICAgYCAgICAgIHtgLFxuICAgICAgYCAgICAgICAgXCJmaWxlXCI6ICR7SlNPTi5zdHJpbmdpZnkodGhpcy5mcy5yZWxhdGl2ZSh0aGlzLmJhc2VQYXRoLCBmaWxlKSl9LGAsXG4gICAgICBgICAgICAgICBcInN0YXJ0XCI6IHsgXCJsaW5lXCI6IFwiJHtzdGFydC5saW5lfVwiLCBcImNvbHVtblwiOiBcIiR7c3RhcnQuY29sdW1ufVwiIH0sYCxcbiAgICAgIGAgICAgICAgIFwiZW5kXCI6IHsgXCJsaW5lXCI6IFwiJHtlbmQubGluZX1cIiwgXCJjb2x1bW5cIjogXCIke2VuZC5jb2x1bW59XCIgfWAsXG4gICAgICBgICAgICAgfWAsXG4gICAgXS5qb2luKCdcXG4nKTtcbiAgfVxufVxuIl19
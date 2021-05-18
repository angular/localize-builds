import { consolidateMessages, hasLocation } from './utils';
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
export class ArbTranslationSerializer {
    constructor(sourceLocale, basePath, fs) {
        this.sourceLocale = sourceLocale;
        this.basePath = basePath;
        this.fs = fs;
    }
    serialize(messages) {
        const messageGroups = consolidateMessages(messages, message => getMessageId(message));
        let output = `{\n  "@@locale": ${JSON.stringify(this.sourceLocale)}`;
        for (const duplicateMessages of messageGroups) {
            const message = duplicateMessages[0];
            const id = getMessageId(message);
            output += this.serializeMessage(id, message);
            output += this.serializeMeta(id, message.description, message.meaning, duplicateMessages.filter(hasLocation).map(m => m.location));
        }
        output += '\n}';
        return output;
    }
    serializeMessage(id, message) {
        return `,\n  ${JSON.stringify(id)}: ${JSON.stringify(message.text)}`;
    }
    serializeMeta(id, description, meaning, locations) {
        const meta = [];
        if (description) {
            meta.push(`\n    "description": ${JSON.stringify(description)}`);
        }
        if (meaning) {
            meta.push(`\n    "x-meaning": ${JSON.stringify(meaning)}`);
        }
        if (locations.length > 0) {
            let locationStr = `\n    "x-locations": [`;
            for (let i = 0; i < locations.length; i++) {
                locationStr += (i > 0 ? ',\n' : '\n') + this.serializeLocation(locations[i]);
            }
            locationStr += '\n    ]';
            meta.push(locationStr);
        }
        return meta.length > 0 ? `,\n  ${JSON.stringify('@' + id)}: {${meta.join(',')}\n  }` : '';
    }
    serializeLocation({ file, start, end }) {
        return [
            `      {`,
            `        "file": ${JSON.stringify(this.fs.relative(this.basePath, file))},`,
            `        "start": { "line": "${start.line}", "column": "${start.column}" },`,
            `        "end": { "line": "${end.line}", "column": "${end.column}" }`,
            `      }`,
        ].join('\n');
    }
}
function getMessageId(message) {
    return message.customId || message.id;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJiX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2V4dHJhY3QvdHJhbnNsYXRpb25fZmlsZXMvYXJiX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBVUEsT0FBTyxFQUFDLG1CQUFtQixFQUFFLFdBQVcsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUV6RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBQ0gsTUFBTSxPQUFPLHdCQUF3QjtJQUNuQyxZQUNZLFlBQW9CLEVBQVUsUUFBd0IsRUFDdEQsRUFBb0I7UUFEcEIsaUJBQVksR0FBWixZQUFZLENBQVE7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFnQjtRQUN0RCxPQUFFLEdBQUYsRUFBRSxDQUFrQjtJQUFHLENBQUM7SUFFcEMsU0FBUyxDQUFDLFFBQTBCO1FBQ2xDLE1BQU0sYUFBYSxHQUFHLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBRXRGLElBQUksTUFBTSxHQUFHLG9CQUFvQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDO1FBRXJFLEtBQUssTUFBTSxpQkFBaUIsSUFBSSxhQUFhLEVBQUU7WUFDN0MsTUFBTSxPQUFPLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckMsTUFBTSxFQUFFLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzdDLE1BQU0sSUFBSSxJQUFJLENBQUMsYUFBYSxDQUN4QixFQUFFLEVBQUUsT0FBTyxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUN4QyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7U0FDakU7UUFFRCxNQUFNLElBQUksS0FBSyxDQUFDO1FBRWhCLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFTyxnQkFBZ0IsQ0FBQyxFQUFVLEVBQUUsT0FBdUI7UUFDMUQsT0FBTyxRQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUN2RSxDQUFDO0lBRU8sYUFBYSxDQUNqQixFQUFVLEVBQUUsV0FBNkIsRUFBRSxPQUF5QixFQUNwRSxTQUE0QjtRQUM5QixNQUFNLElBQUksR0FBYSxFQUFFLENBQUM7UUFFMUIsSUFBSSxXQUFXLEVBQUU7WUFDZixJQUFJLENBQUMsSUFBSSxDQUFDLHdCQUF3QixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNsRTtRQUVELElBQUksT0FBTyxFQUFFO1lBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDNUQ7UUFFRCxJQUFJLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3hCLElBQUksV0FBVyxHQUFHLHdCQUF3QixDQUFDO1lBQzNDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN6QyxXQUFXLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUM5RTtZQUNELFdBQVcsSUFBSSxTQUFTLENBQUM7WUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUN4QjtRQUVELE9BQU8sSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDNUYsQ0FBQztJQUVPLGlCQUFpQixDQUFDLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQWtCO1FBQzNELE9BQU87WUFDTCxTQUFTO1lBQ1QsbUJBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHO1lBQzNFLCtCQUErQixLQUFLLENBQUMsSUFBSSxpQkFBaUIsS0FBSyxDQUFDLE1BQU0sTUFBTTtZQUM1RSw2QkFBNkIsR0FBRyxDQUFDLElBQUksaUJBQWlCLEdBQUcsQ0FBQyxNQUFNLEtBQUs7WUFDckUsU0FBUztTQUNWLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2YsQ0FBQztDQUNGO0FBRUQsU0FBUyxZQUFZLENBQUMsT0FBdUI7SUFDM0MsT0FBTyxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUM7QUFDeEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aCwgUGF0aE1hbmlwdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQge8m1UGFyc2VkTWVzc2FnZSwgybVTb3VyY2VMb2NhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuaW1wb3J0IHtUcmFuc2xhdGlvblNlcmlhbGl6ZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fc2VyaWFsaXplcic7XG5pbXBvcnQge2NvbnNvbGlkYXRlTWVzc2FnZXMsIGhhc0xvY2F0aW9ufSBmcm9tICcuL3V0aWxzJztcblxuLyoqXG4gKiBBIHRyYW5zbGF0aW9uIHNlcmlhbGl6ZXIgdGhhdCBjYW4gcmVuZGVyIEpTT04gZm9ybWF0dGVkIGFzIGFuIEFwcGxpY2F0aW9uIFJlc291cmNlIEJ1bmRsZSAoQVJCKS5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS9hcHAtcmVzb3VyY2UtYnVuZGxlL3dpa2kvQXBwbGljYXRpb25SZXNvdXJjZUJ1bmRsZVNwZWNpZmljYXRpb25cbiAqXG4gKiBgYGBcbiAqIHtcbiAqICAgXCJAQGxvY2FsZVwiOiBcImVuLVVTXCIsXG4gKiAgIFwibWVzc2FnZS1pZFwiOiBcIlRhcmdldCBtZXNzYWdlIHN0cmluZ1wiLFxuICogICBcIkBtZXNzYWdlLWlkXCI6IHtcbiAqICAgICBcInR5cGVcIjogXCJ0ZXh0XCIsXG4gKiAgICAgXCJkZXNjcmlwdGlvblwiOiBcIlNvbWUgZGVzY3JpcHRpb24gdGV4dFwiLFxuICogICAgIFwieC1sb2NhdGlvbnNcIjogW1xuICogICAgICAge1xuICogICAgICAgICBcInN0YXJ0XCI6IHtcImxpbmVcIjogMjMsIFwiY29sdW1uXCI6IDE0NX0sXG4gKiAgICAgICAgIFwiZW5kXCI6IHtcImxpbmVcIjogMjQsIFwiY29sdW1uXCI6IDUzfSxcbiAqICAgICAgICAgXCJmaWxlXCI6IFwic29tZS9maWxlLnRzXCJcbiAqICAgICAgIH0sXG4gKiAgICAgICAuLi5cbiAqICAgICBdXG4gKiAgIH0sXG4gKiAgIC4uLlxuICogfVxuICogYGBgXG4gKi9cbmV4cG9ydCBjbGFzcyBBcmJUcmFuc2xhdGlvblNlcmlhbGl6ZXIgaW1wbGVtZW50cyBUcmFuc2xhdGlvblNlcmlhbGl6ZXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgc291cmNlTG9jYWxlOiBzdHJpbmcsIHByaXZhdGUgYmFzZVBhdGg6IEFic29sdXRlRnNQYXRoLFxuICAgICAgcHJpdmF0ZSBmczogUGF0aE1hbmlwdWxhdGlvbikge31cblxuICBzZXJpYWxpemUobWVzc2FnZXM6IMm1UGFyc2VkTWVzc2FnZVtdKTogc3RyaW5nIHtcbiAgICBjb25zdCBtZXNzYWdlR3JvdXBzID0gY29uc29saWRhdGVNZXNzYWdlcyhtZXNzYWdlcywgbWVzc2FnZSA9PiBnZXRNZXNzYWdlSWQobWVzc2FnZSkpO1xuXG4gICAgbGV0IG91dHB1dCA9IGB7XFxuICBcIkBAbG9jYWxlXCI6ICR7SlNPTi5zdHJpbmdpZnkodGhpcy5zb3VyY2VMb2NhbGUpfWA7XG5cbiAgICBmb3IgKGNvbnN0IGR1cGxpY2F0ZU1lc3NhZ2VzIG9mIG1lc3NhZ2VHcm91cHMpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBkdXBsaWNhdGVNZXNzYWdlc1swXTtcbiAgICAgIGNvbnN0IGlkID0gZ2V0TWVzc2FnZUlkKG1lc3NhZ2UpO1xuICAgICAgb3V0cHV0ICs9IHRoaXMuc2VyaWFsaXplTWVzc2FnZShpZCwgbWVzc2FnZSk7XG4gICAgICBvdXRwdXQgKz0gdGhpcy5zZXJpYWxpemVNZXRhKFxuICAgICAgICAgIGlkLCBtZXNzYWdlLmRlc2NyaXB0aW9uLCBtZXNzYWdlLm1lYW5pbmcsXG4gICAgICAgICAgZHVwbGljYXRlTWVzc2FnZXMuZmlsdGVyKGhhc0xvY2F0aW9uKS5tYXAobSA9PiBtLmxvY2F0aW9uKSk7XG4gICAgfVxuXG4gICAgb3V0cHV0ICs9ICdcXG59JztcblxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZU1lc3NhZ2UoaWQ6IHN0cmluZywgbWVzc2FnZTogybVQYXJzZWRNZXNzYWdlKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCxcXG4gICR7SlNPTi5zdHJpbmdpZnkoaWQpfTogJHtKU09OLnN0cmluZ2lmeShtZXNzYWdlLnRleHQpfWA7XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZU1ldGEoXG4gICAgICBpZDogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nfHVuZGVmaW5lZCwgbWVhbmluZzogc3RyaW5nfHVuZGVmaW5lZCxcbiAgICAgIGxvY2F0aW9uczogybVTb3VyY2VMb2NhdGlvbltdKTogc3RyaW5nIHtcbiAgICBjb25zdCBtZXRhOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgICBtZXRhLnB1c2goYFxcbiAgICBcImRlc2NyaXB0aW9uXCI6ICR7SlNPTi5zdHJpbmdpZnkoZGVzY3JpcHRpb24pfWApO1xuICAgIH1cblxuICAgIGlmIChtZWFuaW5nKSB7XG4gICAgICBtZXRhLnB1c2goYFxcbiAgICBcIngtbWVhbmluZ1wiOiAke0pTT04uc3RyaW5naWZ5KG1lYW5pbmcpfWApO1xuICAgIH1cblxuICAgIGlmIChsb2NhdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IGxvY2F0aW9uU3RyID0gYFxcbiAgICBcIngtbG9jYXRpb25zXCI6IFtgO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb2NhdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbG9jYXRpb25TdHIgKz0gKGkgPiAwID8gJyxcXG4nIDogJ1xcbicpICsgdGhpcy5zZXJpYWxpemVMb2NhdGlvbihsb2NhdGlvbnNbaV0pO1xuICAgICAgfVxuICAgICAgbG9jYXRpb25TdHIgKz0gJ1xcbiAgICBdJztcbiAgICAgIG1ldGEucHVzaChsb2NhdGlvblN0cik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1ldGEubGVuZ3RoID4gMCA/IGAsXFxuICAke0pTT04uc3RyaW5naWZ5KCdAJyArIGlkKX06IHske21ldGEuam9pbignLCcpfVxcbiAgfWAgOiAnJztcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplTG9jYXRpb24oe2ZpbGUsIHN0YXJ0LCBlbmR9OiDJtVNvdXJjZUxvY2F0aW9uKTogc3RyaW5nIHtcbiAgICByZXR1cm4gW1xuICAgICAgYCAgICAgIHtgLFxuICAgICAgYCAgICAgICAgXCJmaWxlXCI6ICR7SlNPTi5zdHJpbmdpZnkodGhpcy5mcy5yZWxhdGl2ZSh0aGlzLmJhc2VQYXRoLCBmaWxlKSl9LGAsXG4gICAgICBgICAgICAgICBcInN0YXJ0XCI6IHsgXCJsaW5lXCI6IFwiJHtzdGFydC5saW5lfVwiLCBcImNvbHVtblwiOiBcIiR7c3RhcnQuY29sdW1ufVwiIH0sYCxcbiAgICAgIGAgICAgICAgIFwiZW5kXCI6IHsgXCJsaW5lXCI6IFwiJHtlbmQubGluZX1cIiwgXCJjb2x1bW5cIjogXCIke2VuZC5jb2x1bW59XCIgfWAsXG4gICAgICBgICAgICAgfWAsXG4gICAgXS5qb2luKCdcXG4nKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRNZXNzYWdlSWQobWVzc2FnZTogybVQYXJzZWRNZXNzYWdlKTogc3RyaW5nIHtcbiAgcmV0dXJuIG1lc3NhZ2UuY3VzdG9tSWQgfHwgbWVzc2FnZS5pZDtcbn1cbiJdfQ==
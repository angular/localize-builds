/**
 * Use this class to load a collection of translation files from disk.
 */
export class TranslationLoader {
    constructor(fs, translationParsers, duplicateTranslation, 
    /** @deprecated */ diagnostics) {
        this.fs = fs;
        this.translationParsers = translationParsers;
        this.duplicateTranslation = duplicateTranslation;
        this.diagnostics = diagnostics;
    }
    /**
     * Load and parse the translation files into a collection of `TranslationBundles`.
     *
     * @param translationFilePaths An array, per locale, of absolute paths to translation files.
     *
     * For each locale to be translated, there is an element in `translationFilePaths`. Each element
     * is an array of absolute paths to translation files for that locale.
     * If the array contains more than one translation file, then the translations are merged.
     * If allowed by the `duplicateTranslation` property, when more than one translation has the same
     * message id, the message from the earlier translation file in the array is used.
     * For example, if the files are `[app.xlf, lib-1.xlf, lib-2.xlif]` then a message that appears in
     * `app.xlf` will override the same message in `lib-1.xlf` or `lib-2.xlf`.
     *
     * @param translationFileLocales An array of locales for each of the translation files.
     *
     * If there is a locale provided in `translationFileLocales` then this is used rather than a
     * locale extracted from the file itself.
     * If there is neither a provided locale nor a locale parsed from the file, then an error is
     * thrown.
     * If there are both a provided locale and a locale parsed from the file, and they are not the
     * same, then a warning is reported.
     */
    loadBundles(translationFilePaths, translationFileLocales) {
        return translationFilePaths.map((filePaths, index) => {
            const providedLocale = translationFileLocales[index];
            return this.mergeBundles(filePaths, providedLocale);
        });
    }
    /**
     * Load all the translations from the file at the given `filePath`.
     */
    loadBundle(filePath, providedLocale) {
        const fileContents = this.fs.readFile(filePath);
        const unusedParsers = new Map();
        for (const translationParser of this.translationParsers) {
            const result = translationParser.analyze(filePath, fileContents);
            if (!result.canParse) {
                unusedParsers.set(translationParser, result);
                continue;
            }
            const { locale: parsedLocale, translations, diagnostics } = translationParser.parse(filePath, fileContents, result.hint);
            if (diagnostics.hasErrors) {
                throw new Error(diagnostics.formatDiagnostics(`The translation file "${filePath}" could not be parsed.`));
            }
            const locale = providedLocale || parsedLocale;
            if (locale === undefined) {
                throw new Error(`The translation file "${filePath}" does not contain a target locale and no explicit locale was provided for this file.`);
            }
            if (parsedLocale !== undefined && providedLocale !== undefined &&
                parsedLocale !== providedLocale) {
                diagnostics.warn(`The provided locale "${providedLocale}" does not match the target locale "${parsedLocale}" found in the translation file "${filePath}".`);
            }
            // If we were passed a diagnostics object then copy the messages over to it.
            if (this.diagnostics) {
                this.diagnostics.merge(diagnostics);
            }
            return { locale, translations, diagnostics };
        }
        const diagnosticsMessages = [];
        for (const [parser, result] of unusedParsers.entries()) {
            diagnosticsMessages.push(result.diagnostics.formatDiagnostics(`\n${parser.constructor.name} cannot parse translation file.`));
        }
        throw new Error(`There is no "TranslationParser" that can parse this translation file: ${filePath}.` +
            diagnosticsMessages.join('\n'));
    }
    /**
     * There is more than one `filePath` for this locale, so load each as a bundle and then merge
     * them all together.
     */
    mergeBundles(filePaths, providedLocale) {
        const bundles = filePaths.map(filePath => this.loadBundle(filePath, providedLocale));
        const bundle = bundles[0];
        for (let i = 1; i < bundles.length; i++) {
            const nextBundle = bundles[i];
            if (nextBundle.locale !== bundle.locale) {
                if (this.diagnostics) {
                    const previousFiles = filePaths.slice(0, i).map(f => `"${f}"`).join(', ');
                    this.diagnostics.warn(`When merging multiple translation files, the target locale "${nextBundle.locale}" found in "${filePaths[i]}" does not match the target locale "${bundle.locale}" found in earlier files [${previousFiles}].`);
                }
            }
            Object.keys(nextBundle.translations).forEach(messageId => {
                var _a;
                if (bundle.translations[messageId] !== undefined) {
                    (_a = this.diagnostics) === null || _a === void 0 ? void 0 : _a.add(this.duplicateTranslation, `Duplicate translations for message "${messageId}" when merging "${filePaths[i]}".`);
                }
                else {
                    bundle.translations[messageId] = nextBundle.translations[messageId];
                }
            });
        }
        return bundle;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRpb25fbG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3Rvb2xzL3NyYy90cmFuc2xhdGUvdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fbG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWFBOztHQUVHO0FBQ0gsTUFBTSxPQUFPLGlCQUFpQjtJQUM1QixZQUNZLEVBQXNCLEVBQVUsa0JBQTRDLEVBQzVFLG9CQUFnRDtJQUN4RCxrQkFBa0IsQ0FBUyxXQUF5QjtRQUY1QyxPQUFFLEdBQUYsRUFBRSxDQUFvQjtRQUFVLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBMEI7UUFDNUUseUJBQW9CLEdBQXBCLG9CQUFvQixDQUE0QjtRQUM3QixnQkFBVyxHQUFYLFdBQVcsQ0FBYztJQUFHLENBQUM7SUFFNUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXFCRztJQUNILFdBQVcsQ0FDUCxvQkFBd0MsRUFDeEMsc0JBQTRDO1FBQzlDLE9BQU8sb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ25ELE1BQU0sY0FBYyxHQUFHLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDdEQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7O09BRUc7SUFDSyxVQUFVLENBQUMsUUFBd0IsRUFBRSxjQUFnQztRQUUzRSxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoRCxNQUFNLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBOEMsQ0FBQztRQUM1RSxLQUFLLE1BQU0saUJBQWlCLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFF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Q0FBQyxNQUFNLGVBQWUsU0FBUyxDQUFDLENBQUMsQ0FBQyx1Q0FDNUMsTUFBTSxDQUFDLE1BQU0sNkJBQTZCLGFBQWEsSUFBSSxDQUFDLENBQUM7aUJBQ2xFO2FBQ0Y7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7O2dCQUN2RCxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssU0FBUyxFQUFFO29CQUNoRCxNQUFBLElBQUksQ0FBQyxXQUFXLDBDQUFFLEdBQUcsQ0FDakIsSUFBSSxDQUFDLG9CQUFvQixFQUN6Qix1Q0FBdUMsU0FBUyxtQkFBbUIsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDMUY7cUJBQU07b0JBQ0wsTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2lCQUNyRTtZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGgsIFJlYWRvbmx5RmlsZVN5c3RlbX0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQge0RpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5LCBEaWFnbm9zdGljc30gZnJvbSAnLi4vLi4vZGlhZ25vc3RpY3MnO1xuaW1wb3J0IHtUcmFuc2xhdGlvbkJ1bmRsZX0gZnJvbSAnLi4vdHJhbnNsYXRvcic7XG5cbmltcG9ydCB7UGFyc2VBbmFseXNpcywgVHJhbnNsYXRpb25QYXJzZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fcGFyc2Vycy90cmFuc2xhdGlvbl9wYXJzZXInO1xuXG4vKipcbiAqIFVzZSB0aGlzIGNsYXNzIHRvIGxvYWQgYSBjb2xsZWN0aW9uIG9mIHRyYW5zbGF0aW9uIGZpbGVzIGZyb20gZGlzay5cbiAqL1xuZXhwb3J0IGNsYXNzIFRyYW5zbGF0aW9uTG9hZGVyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIGZzOiBSZWFkb25seUZpbGVTeXN0ZW0sIHByaXZhdGUgdHJhbnNsYXRpb25QYXJzZXJzOiBUcmFuc2xhdGlvblBhcnNlcjxhbnk+W10sXG4gICAgICBwcml2YXRlIGR1cGxpY2F0ZVRyYW5zbGF0aW9uOiBEaWFnbm9zdGljSGFuZGxpbmdTdHJhdGVneSxcbiAgICAgIC8qKiBAZGVwcmVjYXRlZCAqLyBwcml2YXRlIGRpYWdub3N0aWNzPzogRGlhZ25vc3RpY3MpIHt9XG5cbiAgLyoqXG4gICAqIExvYWQgYW5kIHBhcnNlIHRoZSB0cmFuc2xhdGlvbiBmaWxlcyBpbnRvIGEgY29sbGVjdGlvbiBvZiBgVHJhbnNsYXRpb25CdW5kbGVzYC5cbiAgICpcbiAgICogQHBhcmFtIHRyYW5zbGF0aW9uRmlsZVBhdGhzIEFuIGFycmF5LCBwZXIgbG9jYWxlLCBvZiBhYnNvbHV0ZSBwYXRocyB0byB0cmFuc2xhdGlvbiBmaWxlcy5cbiAgICpcbiAgICogRm9yIGVhY2ggbG9jYWxlIHRvIGJlIHRyYW5zbGF0ZWQsIHRoZXJlIGlzIGFuIGVsZW1lbnQgaW4gYHRyYW5zbGF0aW9uRmlsZVBhdGhzYC4gRWFjaCBlbGVtZW50XG4gICAqIGlzIGFuIGFycmF5IG9mIGFic29sdXRlIHBhdGhzIHRvIHRyYW5zbGF0aW9uIGZpbGVzIGZvciB0aGF0IGxvY2FsZS5cbiAgICogSWYgdGhlIGFycmF5IGNvbnRhaW5zIG1vcmUgdGhhbiBvbmUgdHJhbnNsYXRpb24gZmlsZSwgdGhlbiB0aGUgdHJhbnNsYXRpb25zIGFyZSBtZXJnZWQuXG4gICAqIElmIGFsbG93ZWQgYnkgdGhlIGBkdXBsaWNhdGVUcmFuc2xhdGlvbmAgcHJvcGVydHksIHdoZW4gbW9yZSB0aGFuIG9uZSB0cmFuc2xhdGlvbiBoYXMgdGhlIHNhbWVcbiAgICogbWVzc2FnZSBpZCwgdGhlIG1lc3NhZ2UgZnJvbSB0aGUgZWFybGllciB0cmFuc2xhdGlvbiBmaWxlIGluIHRoZSBhcnJheSBpcyB1c2VkLlxuICAgKiBGb3IgZXhhbXBsZSwgaWYgdGhlIGZpbGVzIGFyZSBgW2FwcC54bGYsIGxpYi0xLnhsZiwgbGliLTIueGxpZl1gIHRoZW4gYSBtZXNzYWdlIHRoYXQgYXBwZWFycyBpblxuICAgKiBgYXBwLnhsZmAgd2lsbCBvdmVycmlkZSB0aGUgc2FtZSBtZXNzYWdlIGluIGBsaWItMS54bGZgIG9yIGBsaWItMi54bGZgLlxuICAgKlxuICAgKiBAcGFyYW0gdHJhbnNsYXRpb25GaWxlTG9jYWxlcyBBbiBhcnJheSBvZiBsb2NhbGVzIGZvciBlYWNoIG9mIHRoZSB0cmFuc2xhdGlvbiBmaWxlcy5cbiAgICpcbiAgICogSWYgdGhlcmUgaXMgYSBsb2NhbGUgcHJvdmlkZWQgaW4gYHRyYW5zbGF0aW9uRmlsZUxvY2FsZXNgIHRoZW4gdGhpcyBpcyB1c2VkIHJhdGhlciB0aGFuIGFcbiAgICogbG9jYWxlIGV4dHJhY3RlZCBmcm9tIHRoZSBmaWxlIGl0c2VsZi5cbiAgICogSWYgdGhlcmUgaXMgbmVpdGhlciBhIHByb3ZpZGVkIGxvY2FsZSBub3IgYSBsb2NhbGUgcGFyc2VkIGZyb20gdGhlIGZpbGUsIHRoZW4gYW4gZXJyb3IgaXNcbiAgICogdGhyb3duLlxuICAgKiBJZiB0aGVyZSBhcmUgYm90aCBhIHByb3ZpZGVkIGxvY2FsZSBhbmQgYSBsb2NhbGUgcGFyc2VkIGZyb20gdGhlIGZpbGUsIGFuZCB0aGV5IGFyZSBub3QgdGhlXG4gICAqIHNhbWUsIHRoZW4gYSB3YXJuaW5nIGlzIHJlcG9ydGVkLlxuICAgKi9cbiAgbG9hZEJ1bmRsZXMoXG4gICAgICB0cmFuc2xhdGlvbkZpbGVQYXRoczogQWJzb2x1dGVGc1BhdGhbXVtdLFxuICAgICAgdHJhbnNsYXRpb25GaWxlTG9jYWxlczogKHN0cmluZ3x1bmRlZmluZWQpW10pOiBUcmFuc2xhdGlvbkJ1bmRsZVtdIHtcbiAgICByZXR1cm4gdHJhbnNsYXRpb25GaWxlUGF0aHMubWFwKChmaWxlUGF0aHMsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBwcm92aWRlZExvY2FsZSA9IHRyYW5zbGF0aW9uRmlsZUxvY2FsZXNbaW5kZXhdO1xuICAgICAgcmV0dXJuIHRoaXMubWVyZ2VCdW5kbGVzKGZpbGVQYXRocywgcHJvdmlkZWRMb2NhbGUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgYWxsIHRoZSB0cmFuc2xhdGlvbnMgZnJvbSB0aGUgZmlsZSBhdCB0aGUgZ2l2ZW4gYGZpbGVQYXRoYC5cbiAgICovXG4gIHByaXZhdGUgbG9hZEJ1bmRsZShmaWxlUGF0aDogQWJzb2x1dGVGc1BhdGgsIHByb3ZpZGVkTG9jYWxlOiBzdHJpbmd8dW5kZWZpbmVkKTpcbiAgICAgIFRyYW5zbGF0aW9uQnVuZGxlIHtcbiAgICBjb25zdCBmaWxlQ29udGVudHMgPSB0aGlzLmZzLnJlYWRGaWxlKGZpbGVQYXRoKTtcbiAgICBjb25zdCB1bnVzZWRQYXJzZXJzID0gbmV3IE1hcDxUcmFuc2xhdGlvblBhcnNlcjxhbnk+LCBQYXJzZUFuYWx5c2lzPGFueT4+KCk7XG4gICAgZm9yIChjb25zdCB0cmFuc2xhdGlvblBhcnNlciBvZiB0aGlzLnRyYW5zbGF0aW9uUGFyc2Vycykge1xuICAgICAgY29uc3QgcmVzdWx0ID0gdHJhbnNsYXRpb25QYXJzZXIuYW5hbHl6ZShmaWxlUGF0aCwgZmlsZUNvbnRlbnRzKTtcbiAgICAgIGlmICghcmVzdWx0LmNhblBhcnNlKSB7XG4gICAgICAgIHVudXNlZFBhcnNlcnMuc2V0KHRyYW5zbGF0aW9uUGFyc2VyLCByZXN1bHQpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qge2xvY2FsZTogcGFyc2VkTG9jYWxlLCB0cmFuc2xhdGlvbnMsIGRpYWdub3N0aWNzfSA9XG4gICAgICAgICAgdHJhbnNsYXRpb25QYXJzZXIucGFyc2UoZmlsZVBhdGgsIGZpbGVDb250ZW50cywgcmVzdWx0LmhpbnQpO1xuICAgICAgaWYgKGRpYWdub3N0aWNzLmhhc0Vycm9ycykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZGlhZ25vc3RpY3MuZm9ybWF0RGlhZ25vc3RpY3MoXG4gICAgICAgICAgICBgVGhlIHRyYW5zbGF0aW9uIGZpbGUgXCIke2ZpbGVQYXRofVwiIGNvdWxkIG5vdCBiZSBwYXJzZWQuYCkpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBsb2NhbGUgPSBwcm92aWRlZExvY2FsZSB8fCBwYXJzZWRMb2NhbGU7XG4gICAgICBpZiAobG9jYWxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgdHJhbnNsYXRpb24gZmlsZSBcIiR7XG4gICAgICAgICAgICBmaWxlUGF0aH1cIiBkb2VzIG5vdCBjb250YWluIGEgdGFyZ2V0IGxvY2FsZSBhbmQgbm8gZXhwbGljaXQgbG9jYWxlIHdhcyBwcm92aWRlZCBmb3IgdGhpcyBmaWxlLmApO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFyc2VkTG9jYWxlICE9PSB1bmRlZmluZWQgJiYgcHJvdmlkZWRMb2NhbGUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgIHBhcnNlZExvY2FsZSAhPT0gcHJvdmlkZWRMb2NhbGUpIHtcbiAgICAgICAgZGlhZ25vc3RpY3Mud2FybihcbiAgICAgICAgICAgIGBUaGUgcHJvdmlkZWQgbG9jYWxlIFwiJHtwcm92aWRlZExvY2FsZX1cIiBkb2VzIG5vdCBtYXRjaCB0aGUgdGFyZ2V0IGxvY2FsZSBcIiR7XG4gICAgICAgICAgICAgICAgcGFyc2VkTG9jYWxlfVwiIGZvdW5kIGluIHRoZSB0cmFuc2xhdGlvbiBmaWxlIFwiJHtmaWxlUGF0aH1cIi5gKTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgd2Ugd2VyZSBwYXNzZWQgYSBkaWFnbm9zdGljcyBvYmplY3QgdGhlbiBjb3B5IHRoZSBtZXNzYWdlcyBvdmVyIHRvIGl0LlxuICAgICAgaWYgKHRoaXMuZGlhZ25vc3RpY3MpIHtcbiAgICAgICAgdGhpcy5kaWFnbm9zdGljcy5tZXJnZShkaWFnbm9zdGljcyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7bG9jYWxlLCB0cmFuc2xhdGlvbnMsIGRpYWdub3N0aWNzfTtcbiAgICB9XG5cbiAgICBjb25zdCBkaWFnbm9zdGljc01lc3NhZ2VzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgW3BhcnNlciwgcmVzdWx0XSBvZiB1bnVzZWRQYXJzZXJzLmVudHJpZXMoKSkge1xuICAgICAgZGlhZ25vc3RpY3NNZXNzYWdlcy5wdXNoKHJlc3VsdC5kaWFnbm9zdGljcy5mb3JtYXREaWFnbm9zdGljcyhcbiAgICAgICAgICBgXFxuJHtwYXJzZXIuY29uc3RydWN0b3IubmFtZX0gY2Fubm90IHBhcnNlIHRyYW5zbGF0aW9uIGZpbGUuYCkpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBUaGVyZSBpcyBubyBcIlRyYW5zbGF0aW9uUGFyc2VyXCIgdGhhdCBjYW4gcGFyc2UgdGhpcyB0cmFuc2xhdGlvbiBmaWxlOiAke2ZpbGVQYXRofS5gICtcbiAgICAgICAgZGlhZ25vc3RpY3NNZXNzYWdlcy5qb2luKCdcXG4nKSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlcmUgaXMgbW9yZSB0aGFuIG9uZSBgZmlsZVBhdGhgIGZvciB0aGlzIGxvY2FsZSwgc28gbG9hZCBlYWNoIGFzIGEgYnVuZGxlIGFuZCB0aGVuIG1lcmdlXG4gICAqIHRoZW0gYWxsIHRvZ2V0aGVyLlxuICAgKi9cbiAgcHJpdmF0ZSBtZXJnZUJ1bmRsZXMoZmlsZVBhdGhzOiBBYnNvbHV0ZUZzUGF0aFtdLCBwcm92aWRlZExvY2FsZTogc3RyaW5nfHVuZGVmaW5lZCk6XG4gICAgICBUcmFuc2xhdGlvbkJ1bmRsZSB7XG4gICAgY29uc3QgYnVuZGxlcyA9IGZpbGVQYXRocy5tYXAoZmlsZVBhdGggPT4gdGhpcy5sb2FkQnVuZGxlKGZpbGVQYXRoLCBwcm92aWRlZExvY2FsZSkpO1xuICAgIGNvbnN0IGJ1bmRsZSA9IGJ1bmRsZXNbMF07XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBidW5kbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBuZXh0QnVuZGxlID0gYnVuZGxlc1tpXTtcbiAgICAgIGlmIChuZXh0QnVuZGxlLmxvY2FsZSAhPT0gYnVuZGxlLmxvY2FsZSkge1xuICAgICAgICBpZiAodGhpcy5kaWFnbm9zdGljcykge1xuICAgICAgICAgIGNvbnN0IHByZXZpb3VzRmlsZXMgPSBmaWxlUGF0aHMuc2xpY2UoMCwgaSkubWFwKGYgPT4gYFwiJHtmfVwiYCkuam9pbignLCAnKTtcbiAgICAgICAgICB0aGlzLmRpYWdub3N0aWNzLndhcm4oYFdoZW4gbWVyZ2luZyBtdWx0aXBsZSB0cmFuc2xhdGlvbiBmaWxlcywgdGhlIHRhcmdldCBsb2NhbGUgXCIke1xuICAgICAgICAgICAgICBuZXh0QnVuZGxlLmxvY2FsZX1cIiBmb3VuZCBpbiBcIiR7ZmlsZVBhdGhzW2ldfVwiIGRvZXMgbm90IG1hdGNoIHRoZSB0YXJnZXQgbG9jYWxlIFwiJHtcbiAgICAgICAgICAgICAgYnVuZGxlLmxvY2FsZX1cIiBmb3VuZCBpbiBlYXJsaWVyIGZpbGVzIFske3ByZXZpb3VzRmlsZXN9XS5gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgT2JqZWN0LmtleXMobmV4dEJ1bmRsZS50cmFuc2xhdGlvbnMpLmZvckVhY2gobWVzc2FnZUlkID0+IHtcbiAgICAgICAgaWYgKGJ1bmRsZS50cmFuc2xhdGlvbnNbbWVzc2FnZUlkXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhpcy5kaWFnbm9zdGljcz8uYWRkKFxuICAgICAgICAgICAgICB0aGlzLmR1cGxpY2F0ZVRyYW5zbGF0aW9uLFxuICAgICAgICAgICAgICBgRHVwbGljYXRlIHRyYW5zbGF0aW9ucyBmb3IgbWVzc2FnZSBcIiR7bWVzc2FnZUlkfVwiIHdoZW4gbWVyZ2luZyBcIiR7ZmlsZVBhdGhzW2ldfVwiLmApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJ1bmRsZS50cmFuc2xhdGlvbnNbbWVzc2FnZUlkXSA9IG5leHRCdW5kbGUudHJhbnNsYXRpb25zW21lc3NhZ2VJZF07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gYnVuZGxlO1xuICB9XG59XG4iXX0=
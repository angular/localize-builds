/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { $localize, _global } from '../src/localize';
// Attach $localize to the global context, as a side-effect of this module.
_global.$localize = $localize;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9pbml0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyxTQUFTLEVBQWMsT0FBTyxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFJL0QsMkVBQTJFO0FBQzNFLE9BQU8sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHskbG9jYWxpemUsIExvY2FsaXplRm4sIF9nbG9iYWx9IGZyb20gJy4uL3NyYy9sb2NhbGl6ZSc7XG5cbmV4cG9ydCB7TG9jYWxpemVGbiwgVHJhbnNsYXRlRm59IGZyb20gJy4uL3NyYy9sb2NhbGl6ZSc7XG5cbi8vIEF0dGFjaCAkbG9jYWxpemUgdG8gdGhlIGdsb2JhbCBjb250ZXh0LCBhcyBhIHNpZGUtZWZmZWN0IG9mIHRoaXMgbW9kdWxlLlxuX2dsb2JhbC4kbG9jYWxpemUgPSAkbG9jYWxpemU7XG5cbi8vIGBkZWNsYXJlIGdsb2JhbGAgYWxsb3dzIHVzIHRvIGVzY2FwZSB0aGUgY3VycmVudCBtb2R1bGUgYW5kIHBsYWNlIHR5cGVzIG9uIHRoZSBnbG9iYWwgbmFtZXNwYWNlXG5kZWNsYXJlIGdsb2JhbCB7XG4gIC8qKlxuICAgKiBUYWcgYSB0ZW1wbGF0ZSBsaXRlcmFsIHN0cmluZyBmb3IgbG9jYWxpemF0aW9uLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogYGBgdHNcbiAgICogJGxvY2FsaXplIGBzb21lIHN0cmluZyB0byBsb2NhbGl6ZWBcbiAgICogYGBgXG4gICAqXG4gICAqICoqUHJvdmlkaW5nIG1lYW5pbmcsIGRlc2NyaXB0aW9uIGFuZCBpZCoqXG4gICAqXG4gICAqIFlvdSBjYW4gb3B0aW9uYWxseSBzcGVjaWZ5IG9uZSBvciBtb3JlIG9mIGBtZWFuaW5nYCwgYGRlc2NyaXB0aW9uYCBhbmQgYGlkYCBmb3IgYSBsb2NhbGl6ZWRcbiAgICogc3RyaW5nIGJ5IHByZS1wZW5kaW5nIGl0IHdpdGggYSBjb2xvbiBkZWxpbWl0ZWQgYmxvY2sgb2YgdGhlIGZvcm06XG4gICAqXG4gICAqIGBgYHRzXG4gICAqICRsb2NhbGl6ZWA6bWVhbmluZ3xkZXNjcmlwdGlvbkBAaWQ6c291cmNlIG1lc3NhZ2UgdGV4dGA7XG4gICAqXG4gICAqICRsb2NhbGl6ZWA6bWVhbmluZ3w6c291cmNlIG1lc3NhZ2UgdGV4dGA7XG4gICAqICRsb2NhbGl6ZWA6ZGVzY3JpcHRpb246c291cmNlIG1lc3NhZ2UgdGV4dGA7XG4gICAqICRsb2NhbGl6ZWA6QEBpZDpzb3VyY2UgbWVzc2FnZSB0ZXh0YDtcbiAgICogYGBgXG4gICAqXG4gICAqIFRoaXMgZm9ybWF0IGlzIHRoZSBzYW1lIGFzIHRoYXQgdXNlZCBmb3IgYGkxOG5gIG1hcmtlcnMgaW4gQW5ndWxhciB0ZW1wbGF0ZXMuIFNlZSB0aGVcbiAgICogW0FuZ3VsYXIgMThuIGd1aWRlXShndWlkZS9pMThuI3RlbXBsYXRlLXRyYW5zbGF0aW9ucykuXG4gICAqXG4gICAqICoqTmFtaW5nIHBsYWNlaG9sZGVycyoqXG4gICAqXG4gICAqIElmIHRoZSB0ZW1wbGF0ZSBsaXRlcmFsIHN0cmluZyBjb250YWlucyBleHByZXNzaW9ucywgdGhlbiB0aGUgZXhwcmVzc2lvbnMgd2lsbCBiZSBhdXRvbWF0aWNhbGx5XG4gICAqIGFzc29jaWF0ZWQgd2l0aCBwbGFjZWhvbGRlciBuYW1lcyBmb3IgeW91LlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogYGBgdHNcbiAgICogJGxvY2FsaXplIGBIaSAke25hbWV9ISBUaGVyZSBhcmUgJHtpdGVtcy5sZW5ndGh9IGl0ZW1zLmA7XG4gICAqIGBgYFxuICAgKlxuICAgKiB3aWxsIGdlbmVyYXRlIGEgbWVzc2FnZS1zb3VyY2Ugb2YgYEhpIHskUEh9ISBUaGVyZSBhcmUgeyRQSF8xfSBpdGVtc2AuXG4gICAqXG4gICAqIFRoZSByZWNvbW1lbmRlZCBwcmFjdGljZSBpcyB0byBuYW1lIHRoZSBwbGFjZWhvbGRlciBhc3NvY2lhdGVkIHdpdGggZWFjaCBleHByZXNzaW9uIHRob3VnaC5cbiAgICpcbiAgICogRG8gdGhpcyBieSBwcm92aWRpbmcgdGhlIHBsYWNlaG9sZGVyIG5hbWUgd3JhcHBlZCBpbiBgOmAgY2hhcmFjdGVycyBkaXJlY3RseSBhZnRlciB0aGVcbiAgICogZXhwcmVzc2lvbi4gVGhlc2UgcGxhY2Vob2xkZXIgbmFtZXMgYXJlIHN0cmlwcGVkIG91dCBvZiB0aGUgcmVuZGVyZWQgbG9jYWxpemVkIHN0cmluZy5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIHRvIG5hbWUgdGhlIGBpdGVtcy5sZW5ndGhgIGV4cHJlc3Npb24gcGxhY2Vob2xkZXIgYGl0ZW1Db3VudGAgeW91IHdyaXRlOlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiAkbG9jYWxpemUgYFRoZXJlIGFyZSAke2l0ZW1zLmxlbmd0aH06aXRlbUNvdW50OiBpdGVtc2A7XG4gICAqIGBgYFxuICAgKlxuICAgKiAqKkVzY2FwaW5nIGNvbG9uIG1hcmtlcnMqKlxuICAgKlxuICAgKiBJZiB5b3UgbmVlZCB0byB1c2UgYSBgOmAgY2hhcmFjdGVyIGRpcmVjdGx5IGF0IHRoZSBzdGFydCBvZiBhIHRhZ2dlZCBzdHJpbmcgdGhhdCBoYXMgbm9cbiAgICogbWV0YWRhdGEgYmxvY2ssIG9yIGRpcmVjdGx5IGFmdGVyIGEgc3Vic3RpdHV0aW9uIGV4cHJlc3Npb24gdGhhdCBoYXMgbm8gbmFtZSB5b3UgbXVzdCBlc2NhcGVcbiAgICogdGhlIGA6YCBieSBwcmVjZWRpbmcgaXQgd2l0aCBhIGJhY2tzbGFzaDpcbiAgICpcbiAgICogRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIC8vIG1lc3NhZ2UgaGFzIGEgbWV0YWRhdGEgYmxvY2sgc28gbm8gbmVlZCB0byBlc2NhcGUgY29sb25cbiAgICogJGxvY2FsaXplIGA6c29tZSBkZXNjcmlwdGlvbjo6dGhpcyBtZXNzYWdlIHN0YXJ0cyB3aXRoIGEgY29sb24gKDopYDtcbiAgICogLy8gbm8gbWV0YWRhdGEgYmxvY2sgc28gdGhlIGNvbG9uIG11c3QgYmUgZXNjYXBlZFxuICAgKiAkbG9jYWxpemUgYFxcOnRoaXMgbWVzc2FnZSBzdGFydHMgd2l0aCBhIGNvbG9uICg6KWA7XG4gICAqIGBgYFxuICAgKlxuICAgKiBgYGB0c1xuICAgKiAvLyBuYW1lZCBzdWJzdGl0dXRpb24gc28gbm8gbmVlZCB0byBlc2NhcGUgY29sb25cbiAgICogJGxvY2FsaXplIGAke2xhYmVsfTpsYWJlbDo6ICR7fWBcbiAgICogLy8gYW5vbnltb3VzIHN1YnN0aXR1dGlvbiBzbyBjb2xvbiBtdXN0IGJlIGVzY2FwZWRcbiAgICogJGxvY2FsaXplIGAke2xhYmVsfVxcOiAke31gXG4gICAqIGBgYFxuICAgKlxuICAgKiAqKlByb2Nlc3NpbmcgbG9jYWxpemVkIHN0cmluZ3M6KipcbiAgICpcbiAgICogVGhlcmUgYXJlIHRocmVlIHNjZW5hcmlvczpcbiAgICpcbiAgICogKiAqKmNvbXBpbGUtdGltZSBpbmxpbmluZyoqOiB0aGUgYCRsb2NhbGl6ZWAgdGFnIGlzIHRyYW5zZm9ybWVkIGF0IGNvbXBpbGUgdGltZSBieSBhXG4gICAqIHRyYW5zcGlsZXIsIHJlbW92aW5nIHRoZSB0YWcgYW5kIHJlcGxhY2luZyB0aGUgdGVtcGxhdGUgbGl0ZXJhbCBzdHJpbmcgd2l0aCBhIHRyYW5zbGF0ZWRcbiAgICogbGl0ZXJhbCBzdHJpbmcgZnJvbSBhIGNvbGxlY3Rpb24gb2YgdHJhbnNsYXRpb25zIHByb3ZpZGVkIHRvIHRoZSB0cmFuc3BpbGF0aW9uIHRvb2wuXG4gICAqXG4gICAqICogKipydW4tdGltZSBldmFsdWF0aW9uKio6IHRoZSBgJGxvY2FsaXplYCB0YWcgaXMgYSBydW4tdGltZSBmdW5jdGlvbiB0aGF0IHJlcGxhY2VzIGFuZFxuICAgKiByZW9yZGVycyB0aGUgcGFydHMgKHN0YXRpYyBzdHJpbmdzIGFuZCBleHByZXNzaW9ucykgb2YgdGhlIHRlbXBsYXRlIGxpdGVyYWwgc3RyaW5nIHdpdGggc3RyaW5nc1xuICAgKiBmcm9tIGEgY29sbGVjdGlvbiBvZiB0cmFuc2xhdGlvbnMgbG9hZGVkIGF0IHJ1bi10aW1lLlxuICAgKlxuICAgKiAqICoqcGFzcy10aHJvdWdoIGV2YWx1YXRpb24qKjogdGhlIGAkbG9jYWxpemVgIHRhZyBpcyBhIHJ1bi10aW1lIGZ1bmN0aW9uIHRoYXQgc2ltcGx5IGV2YWx1YXRlc1xuICAgKiB0aGUgb3JpZ2luYWwgdGVtcGxhdGUgbGl0ZXJhbCBzdHJpbmcgd2l0aG91dCBhcHBseWluZyBhbnkgdHJhbnNsYXRpb25zIHRvIHRoZSBwYXJ0cy4gVGhpc1xuICAgKiB2ZXJzaW9uIGlzIHVzZWQgZHVyaW5nIGRldmVsb3BtZW50IG9yIHdoZXJlIHRoZXJlIGlzIG5vIG5lZWQgdG8gdHJhbnNsYXRlIHRoZSBsb2NhbGl6ZWRcbiAgICogdGVtcGxhdGUgbGl0ZXJhbHMuXG4gICAqXG4gICAqIEBwYXJhbSBtZXNzYWdlUGFydHMgYSBjb2xsZWN0aW9uIG9mIHRoZSBzdGF0aWMgcGFydHMgb2YgdGhlIHRlbXBsYXRlIHN0cmluZy5cbiAgICogQHBhcmFtIGV4cHJlc3Npb25zIGEgY29sbGVjdGlvbiBvZiB0aGUgdmFsdWVzIG9mIGVhY2ggcGxhY2Vob2xkZXIgaW4gdGhlIHRlbXBsYXRlIHN0cmluZy5cbiAgICogQHJldHVybnMgdGhlIHRyYW5zbGF0ZWQgc3RyaW5nLCB3aXRoIHRoZSBgbWVzc2FnZVBhcnRzYCBhbmQgYGV4cHJlc3Npb25zYCBpbnRlcmxlYXZlZCB0b2dldGhlci5cbiAgICovXG4gIGNvbnN0ICRsb2NhbGl6ZTogTG9jYWxpemVGbjtcbn1cbiJdfQ==
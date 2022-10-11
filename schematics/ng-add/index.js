/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 *
 * @fileoverview Schematics for ng-new project that builds with Bazel.
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/schematics/ng-add", ["require", "exports", "tslib", "@angular-devkit/core", "@angular-devkit/schematics", "@angular-devkit/schematics/tasks", "@schematics/angular/utility/dependencies", "@schematics/angular/utility/workspace", "@schematics/angular/utility/workspace-models"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.localizePolyfill = void 0;
    const tslib_1 = require("tslib");
    const core_1 = require("@angular-devkit/core");
    const schematics_1 = require("@angular-devkit/schematics");
    const tasks_1 = require("@angular-devkit/schematics/tasks");
    const dependencies_1 = require("@schematics/angular/utility/dependencies");
    const workspace_1 = require("@schematics/angular/utility/workspace");
    const workspace_models_1 = require("@schematics/angular/utility/workspace-models");
    exports.localizePolyfill = `@angular/localize/init`;
    function prependToMainFiles(projectName) {
        return (host) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const workspace = yield (0, workspace_1.getWorkspace)(host);
            const project = workspace.projects.get(projectName);
            if (!project) {
                throw new schematics_1.SchematicsException(`Invalid project name (${projectName})`);
            }
            const fileList = new Set();
            for (const target of project.targets.values()) {
                if (target.builder !== workspace_models_1.Builders.Server) {
                    continue;
                }
                for (const [, options] of (0, workspace_1.allTargetOptions)(target)) {
                    const value = options['main'];
                    if (typeof value === 'string') {
                        fileList.add(value);
                    }
                }
            }
            for (const path of fileList) {
                const content = host.readText(path);
                if (content.includes(exports.localizePolyfill)) {
                    // If the file already contains the polyfill (or variations), ignore it too.
                    continue;
                }
                // Add string at the start of the file.
                const recorder = host.beginUpdate(path);
                const localizeStr = core_1.tags.stripIndents `/***************************************************************************************************
     * Load \`$localize\` onto the global scope - used if i18n tags appear in Angular templates.
     */
     import '${exports.localizePolyfill}';
    `;
                recorder.insertLeft(0, localizeStr);
                host.commitUpdate(recorder);
            }
        });
    }
    function addToPolyfillsOption(projectName) {
        return (0, workspace_1.updateWorkspace)((workspace) => {
            var _a, _b;
            var _c;
            const project = workspace.projects.get(projectName);
            if (!project) {
                throw new schematics_1.SchematicsException(`Invalid project name (${projectName})`);
            }
            for (const target of project.targets.values()) {
                if (target.builder !== workspace_models_1.Builders.Browser && target.builder !== workspace_models_1.Builders.Karma) {
                    continue;
                }
                (_a = target.options) !== null && _a !== void 0 ? _a : (target.options = {});
                (_b = (_c = target.options)['polyfills']) !== null && _b !== void 0 ? _b : (_c['polyfills'] = [exports.localizePolyfill]);
                for (const [, options] of (0, workspace_1.allTargetOptions)(target)) {
                    // Convert polyfills option to array.
                    const polyfillsValue = typeof options['polyfills'] === 'string' ? [options['polyfills']] :
                        options['polyfills'];
                    if (Array.isArray(polyfillsValue) && !polyfillsValue.includes(exports.localizePolyfill)) {
                        options['polyfills'] = [...polyfillsValue, exports.localizePolyfill];
                    }
                }
            }
        });
    }
    function moveToDependencies(host, context) {
        if (host.exists('package.json')) {
            // Remove the previous dependency and add in a new one under the desired type.
            (0, dependencies_1.removePackageJsonDependency)(host, '@angular/localize');
            (0, dependencies_1.addPackageJsonDependency)(host, {
                name: '@angular/localize',
                type: dependencies_1.NodeDependencyType.Default,
                version: `~15.0.0-next.5+sha-23c06ee`,
            });
            // Add a task to run the package manager. This is necessary because we updated
            // "package.json" and we want lock files to reflect this.
            context.addTask(new tasks_1.NodePackageInstallTask());
        }
    }
    function default_1(options) {
        return () => {
            var _a;
            // We favor the name option because the project option has a
            // smart default which can be populated even when unspecified by the user.
            const projectName = (_a = options.name) !== null && _a !== void 0 ? _a : options.project;
            if (!projectName) {
                throw new schematics_1.SchematicsException('Option "project" is required.');
            }
            return (0, schematics_1.chain)([
                prependToMainFiles(projectName),
                addToPolyfillsOption(projectName),
                // If `$localize` will be used at runtime then must install `@angular/localize`
                // into `dependencies`, rather than the default of `devDependencies`.
                options.useAtRuntime ? moveToDependencies : (0, schematics_1.noop)(),
            ]);
        };
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zY2hlbWF0aWNzL25nLWFkZC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7R0FRRzs7Ozs7Ozs7Ozs7Ozs7SUFFSCwrQ0FBMEM7SUFDMUMsMkRBQTJHO0lBQzNHLDREQUF3RTtJQUN4RSwyRUFBb0k7SUFDcEkscUVBQXVHO0lBQ3ZHLG1GQUFzRTtJQUl6RCxRQUFBLGdCQUFnQixHQUFHLHdCQUF3QixDQUFDO0lBRXpELFNBQVMsa0JBQWtCLENBQUMsV0FBbUI7UUFDN0MsT0FBTyxDQUFPLElBQVUsRUFBRSxFQUFFO1lBQzFCLE1BQU0sU0FBUyxHQUFHLE1BQU0sSUFBQSx3QkFBWSxFQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNDLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ1osTUFBTSxJQUFJLGdDQUFtQixDQUFDLHlCQUF5QixXQUFXLEdBQUcsQ0FBQyxDQUFDO2FBQ3hFO1lBRUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztZQUNuQyxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQzdDLElBQUksTUFBTSxDQUFDLE9BQU8sS0FBSywyQkFBUSxDQUFDLE1BQU0sRUFBRTtvQkFDdEMsU0FBUztpQkFDVjtnQkFFRCxLQUFLLE1BQU0sQ0FBQyxFQUFFLE9BQU8sQ0FBQyxJQUFJLElBQUEsNEJBQWdCLEVBQUMsTUFBTSxDQUFDLEVBQUU7b0JBQ2xELE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDOUIsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7d0JBQzdCLFFB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LDhCQUFzQixFQUFFLENBQUMsQ0FBQztTQUMvQztJQUNILENBQUM7SUFFRCxtQkFBd0IsT0FBZTtRQUNyQyxPQUFPLEdBQUcsRUFBRTs7WUFDViw0REFBNEQ7WUFDNUQsMEVBQTBFO1lBQzFFLE1BQU0sV0FBVyxHQUFHLE1BQUEsT0FBTyxDQUFDLElBQUksbUNBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQztZQUVwRCxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNoQixNQUFNLElBQUksZ0NBQW1CLENBQUMsK0JBQStCLENBQUMsQ0FBQzthQUNoRTtZQUVELE9BQU8sSUFBQSxrQkFBSyxFQUFDO2dCQUNYLGtCQUFrQixDQUFDLFdBQVcsQ0FBQztnQkFDL0Isb0JBQW9CLENBQUMsV0FBVyxDQUFDO2dCQUNqQywrRUFBK0U7Z0JBQy9FLHFFQUFxRTtnQkFDckUsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLElBQUEsaUJBQUksR0FBRTthQUNuRCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUM7SUFDSixDQUFDO0lBbEJELDRCQWtCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqXG4gKiBAZmlsZW92ZXJ2aWV3IFNjaGVtYXRpY3MgZm9yIG5nLW5ldyBwcm9qZWN0IHRoYXQgYnVpbGRzIHdpdGggQmF6ZWwuXG4gKi9cblxuaW1wb3J0IHt0YWdzfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQge2NoYWluLCBub29wLCBSdWxlLCBTY2hlbWF0aWNDb250ZXh0LCBTY2hlbWF0aWNzRXhjZXB0aW9uLCBUcmVlLH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtOb2RlUGFja2FnZUluc3RhbGxUYXNrfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcy90YXNrcyc7XG5pbXBvcnQge2FkZFBhY2thZ2VKc29uRGVwZW5kZW5jeSwgTm9kZURlcGVuZGVuY3lUeXBlLCByZW1vdmVQYWNrYWdlSnNvbkRlcGVuZGVuY3ksfSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvZGVwZW5kZW5jaWVzJztcbmltcG9ydCB7YWxsVGFyZ2V0T3B0aW9ucywgZ2V0V29ya3NwYWNlLCB1cGRhdGVXb3Jrc3BhY2UsfSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvd29ya3NwYWNlJztcbmltcG9ydCB7QnVpbGRlcnN9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS93b3Jrc3BhY2UtbW9kZWxzJztcblxuaW1wb3J0IHtTY2hlbWF9IGZyb20gJy4vc2NoZW1hJztcblxuZXhwb3J0IGNvbnN0IGxvY2FsaXplUG9seWZpbGwgPSBgQGFuZ3VsYXIvbG9jYWxpemUvaW5pdGA7XG5cbmZ1bmN0aW9uIHByZXBlbmRUb01haW5GaWxlcyhwcm9qZWN0TmFtZTogc3RyaW5nKTogUnVsZSB7XG4gIHJldHVybiBhc3luYyAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGF3YWl0IGdldFdvcmtzcGFjZShob3N0KTtcbiAgICBjb25zdCBwcm9qZWN0ID0gd29ya3NwYWNlLnByb2plY3RzLmdldChwcm9qZWN0TmFtZSk7XG4gICAgaWYgKCFwcm9qZWN0KSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihgSW52YWxpZCBwcm9qZWN0IG5hbWUgKCR7cHJvamVjdE5hbWV9KWApO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGVMaXN0ID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCB0YXJnZXQgb2YgcHJvamVjdC50YXJnZXRzLnZhbHVlcygpKSB7XG4gICAgICBpZiAodGFyZ2V0LmJ1aWxkZXIgIT09IEJ1aWxkZXJzLlNlcnZlcikge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgZm9yIChjb25zdCBbLCBvcHRpb25zXSBvZiBhbGxUYXJnZXRPcHRpb25zKHRhcmdldCkpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBvcHRpb25zWydtYWluJ107XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgZmlsZUxpc3QuYWRkKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgcGF0aCBvZiBmaWxlTGlzdCkge1xuICAgICAgY29uc3QgY29udGVudCA9IGhvc3QucmVhZFRleHQocGF0aCk7XG4gICAgICBpZiAoY29udGVudC5pbmNsdWRlcyhsb2NhbGl6ZVBvbHlmaWxsKSkge1xuICAgICAgICAvLyBJZiB0aGUgZmlsZSBhbHJlYWR5IGNvbnRhaW5zIHRoZSBwb2x5ZmlsbCAob3IgdmFyaWF0aW9ucyksIGlnbm9yZSBpdCB0b28uXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgc3RyaW5nIGF0IHRoZSBzdGFydCBvZiB0aGUgZmlsZS5cbiAgICAgIGNvbnN0IHJlY29yZGVyID0gaG9zdC5iZWdpblVwZGF0ZShwYXRoKTtcblxuICAgICAgY29uc3QgbG9jYWxpemVTdHIgPVxuICAgICAgICAgIHRhZ3Muc3RyaXBJbmRlbnRzYC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBMb2FkIFxcYCRsb2NhbGl6ZVxcYCBvbnRvIHRoZSBnbG9iYWwgc2NvcGUgLSB1c2VkIGlmIGkxOG4gdGFncyBhcHBlYXIgaW4gQW5ndWxhciB0ZW1wbGF0ZXMuXG4gICAgICovXG4gICAgIGltcG9ydCAnJHtsb2NhbGl6ZVBvbHlmaWxsfSc7XG4gICAgYDtcbiAgICAgIHJlY29yZGVyLmluc2VydExlZnQoMCwgbG9jYWxpemVTdHIpO1xuICAgICAgaG9zdC5jb21taXRVcGRhdGUocmVjb3JkZXIpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gYWRkVG9Qb2x5ZmlsbHNPcHRpb24ocHJvamVjdE5hbWU6IHN0cmluZyk6IFJ1bGUge1xuICByZXR1cm4gdXBkYXRlV29ya3NwYWNlKCh3b3Jrc3BhY2UpID0+IHtcbiAgICBjb25zdCBwcm9qZWN0ID0gd29ya3NwYWNlLnByb2plY3RzLmdldChwcm9qZWN0TmFtZSk7XG4gICAgaWYgKCFwcm9qZWN0KSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihgSW52YWxpZCBwcm9qZWN0IG5hbWUgKCR7cHJvamVjdE5hbWV9KWApO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgdGFyZ2V0IG9mIHByb2plY3QudGFyZ2V0cy52YWx1ZXMoKSkge1xuICAgICAgaWYgKHRhcmdldC5idWlsZGVyICE9PSBCdWlsZGVycy5Ccm93c2VyICYmIHRhcmdldC5idWlsZGVyICE9PSBCdWlsZGVycy5LYXJtYSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdGFyZ2V0Lm9wdGlvbnMgPz89IHt9O1xuICAgICAgdGFyZ2V0Lm9wdGlvbnNbJ3BvbHlmaWxscyddID8/PSBbbG9jYWxpemVQb2x5ZmlsbF07XG5cbiAgICAgIGZvciAoY29uc3QgWywgb3B0aW9uc10gb2YgYWxsVGFyZ2V0T3B0aW9ucyh0YXJnZXQpKSB7XG4gICAgICAgIC8vIENvbnZlcnQgcG9seWZpbGxzIG9wdGlvbiB0byBhcnJheS5cbiAgICAgICAgY29uc3QgcG9seWZpbGxzVmFsdWUgPSB0eXBlb2Ygb3B0aW9uc1sncG9seWZpbGxzJ10gPT09ICdzdHJpbmcnID8gW29wdGlvbnNbJ3BvbHlmaWxscyddXSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbJ3BvbHlmaWxscyddO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShwb2x5ZmlsbHNWYWx1ZSkgJiYgIXBvbHlmaWxsc1ZhbHVlLmluY2x1ZGVzKGxvY2FsaXplUG9seWZpbGwpKSB7XG4gICAgICAgICAgb3B0aW9uc1sncG9seWZpbGxzJ10gPSBbLi4ucG9seWZpbGxzVmFsdWUsIGxvY2FsaXplUG9seWZpbGxdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gbW92ZVRvRGVwZW5kZW5jaWVzKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpOiB2b2lkIHtcbiAgaWYgKGhvc3QuZXhpc3RzKCdwYWNrYWdlLmpzb24nKSkge1xuICAgIC8vIFJlbW92ZSB0aGUgcHJldmlvdXMgZGVwZW5kZW5jeSBhbmQgYWRkIGluIGEgbmV3IG9uZSB1bmRlciB0aGUgZGVzaXJlZCB0eXBlLlxuICAgIHJlbW92ZVBhY2thZ2VKc29uRGVwZW5kZW5jeShob3N0LCAnQGFuZ3VsYXIvbG9jYWxpemUnKTtcbiAgICBhZGRQYWNrYWdlSnNvbkRlcGVuZGVuY3koaG9zdCwge1xuICAgICAgbmFtZTogJ0Bhbmd1bGFyL2xvY2FsaXplJyxcbiAgICAgIHR5cGU6IE5vZGVEZXBlbmRlbmN5VHlwZS5EZWZhdWx0LFxuICAgICAgdmVyc2lvbjogYH4wLjAuMC1QTEFDRUhPTERFUmAsXG4gICAgfSk7XG5cbiAgICAvLyBBZGQgYSB0YXNrIHRvIHJ1biB0aGUgcGFja2FnZSBtYW5hZ2VyLiBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIHdlIHVwZGF0ZWRcbiAgICAvLyBcInBhY2thZ2UuanNvblwiIGFuZCB3ZSB3YW50IGxvY2sgZmlsZXMgdG8gcmVmbGVjdCB0aGlzLlxuICAgIGNvbnRleHQuYWRkVGFzayhuZXcgTm9kZVBhY2thZ2VJbnN0YWxsVGFzaygpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvcHRpb25zOiBTY2hlbWEpOiBSdWxlIHtcbiAgcmV0dXJuICgpID0+IHtcbiAgICAvLyBXZSBmYXZvciB0aGUgbmFtZSBvcHRpb24gYmVjYXVzZSB0aGUgcHJvamVjdCBvcHRpb24gaGFzIGFcbiAgICAvLyBzbWFydCBkZWZhdWx0IHdoaWNoIGNhbiBiZSBwb3B1bGF0ZWQgZXZlbiB3aGVuIHVuc3BlY2lmaWVkIGJ5IHRoZSB1c2VyLlxuICAgIGNvbnN0IHByb2plY3ROYW1lID0gb3B0aW9ucy5uYW1lID8/IG9wdGlvbnMucHJvamVjdDtcblxuICAgIGlmICghcHJvamVjdE5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKCdPcHRpb24gXCJwcm9qZWN0XCIgaXMgcmVxdWlyZWQuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoYWluKFtcbiAgICAgIHByZXBlbmRUb01haW5GaWxlcyhwcm9qZWN0TmFtZSksXG4gICAgICBhZGRUb1BvbHlmaWxsc09wdGlvbihwcm9qZWN0TmFtZSksXG4gICAgICAvLyBJZiBgJGxvY2FsaXplYCB3aWxsIGJlIHVzZWQgYXQgcnVudGltZSB0aGVuIG11c3QgaW5zdGFsbCBgQGFuZ3VsYXIvbG9jYWxpemVgXG4gICAgICAvLyBpbnRvIGBkZXBlbmRlbmNpZXNgLCByYXRoZXIgdGhhbiB0aGUgZGVmYXVsdCBvZiBgZGV2RGVwZW5kZW5jaWVzYC5cbiAgICAgIG9wdGlvbnMudXNlQXRSdW50aW1lID8gbW92ZVRvRGVwZW5kZW5jaWVzIDogbm9vcCgpLFxuICAgIF0pO1xuICB9O1xufVxuIl19
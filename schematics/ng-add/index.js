/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 *
 * @fileoverview Schematics for `ng add @angular/localize` schematic.
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/schematics/ng-add", ["require", "exports", "tslib", "@angular-devkit/schematics", "@angular-devkit/schematics/tasks", "@schematics/angular/utility/dependencies", "@schematics/angular/utility/json-file", "@schematics/angular/utility/workspace", "@schematics/angular/utility/workspace-models"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const schematics_1 = require("@angular-devkit/schematics");
    const tasks_1 = require("@angular-devkit/schematics/tasks");
    const dependencies_1 = require("@schematics/angular/utility/dependencies");
    const json_file_1 = require("@schematics/angular/utility/json-file");
    const workspace_1 = require("@schematics/angular/utility/workspace");
    const workspace_models_1 = require("@schematics/angular/utility/workspace-models");
    const localizeType = `@angular/localize`;
    function addTypeScriptConfigTypes(projectName) {
        return (host) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const workspace = yield (0, workspace_1.getWorkspace)(host);
            const project = workspace.projects.get(projectName);
            if (!project) {
                throw new schematics_1.SchematicsException(`Invalid project name '${projectName}'.`);
            }
            // We add the root workspace tsconfig for better IDE support.
            const tsConfigFiles = new Set(['tsconfig.json']);
            for (const target of project.targets.values()) {
                switch (target.builder) {
                    case workspace_models_1.Builders.Karma:
                    case workspace_models_1.Builders.Server:
                    case workspace_models_1.Builders.Browser:
                        const value = (_a = target.options) === null || _a === void 0 ? void 0 : _a['tsConfig'];
                        if (typeof value === 'string') {
                            tsConfigFiles.add(value);
                        }
                        break;
                }
            }
            const typesJsonPath = ['compilerOptions', 'types'];
            for (const path of tsConfigFiles) {
                if (!host.exists(path)) {
                    continue;
                }
                const json = new json_file_1.JSONFile(host, path);
                const types = (_b = json.get(typesJsonPath)) !== null && _b !== void 0 ? _b : [];
                if (!Array.isArray(types)) {
                    throw new schematics_1.SchematicsException(`TypeScript configuration file '${path}' has an invalid 'types' property. It must be an array.`);
                }
                const hasLocalizeType = types.some((t) => t === localizeType || t === '@angular/localize/init');
                if (hasLocalizeType) {
                    // Skip has already localize type.
                    continue;
                }
                json.modify(typesJsonPath, [...types, localizeType]);
            }
        });
    }
    function moveToDependencies(host, context) {
        if (!host.exists('package.json')) {
            return;
        }
        // Remove the previous dependency and add in a new one under the desired type.
        (0, dependencies_1.removePackageJsonDependency)(host, '@angular/localize');
        (0, dependencies_1.addPackageJsonDependency)(host, {
            name: '@angular/localize',
            type: dependencies_1.NodeDependencyType.Default,
            version: `~15.1.0-next.0+sha-80e3c28`,
        });
        // Add a task to run the package manager. This is necessary because we updated
        // "package.json" and we want lock files to reflect this.
        context.addTask(new tasks_1.NodePackageInstallTask());
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
                addTypeScriptConfigTypes(projectName),
                // If `$localize` will be used at runtime then must install `@angular/localize`
                // into `dependencies`, rather than the default of `devDependencies`.
                options.useAtRuntime ? moveToDependencies : (0, schematics_1.noop)(),
            ]);
        };
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zY2hlbWF0aWNzL25nLWFkZC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7R0FRRzs7Ozs7Ozs7Ozs7OztJQUVILDJEQUEyRztJQUMzRyw0REFBd0U7SUFDeEUsMkVBQW9JO0lBQ3BJLHFFQUF5RTtJQUN6RSxxRUFBbUU7SUFDbkUsbUZBQXNFO0lBSXRFLE1BQU0sWUFBWSxHQUFHLG1CQUFtQixDQUFDO0lBRXpDLFNBQVMsd0JBQXdCLENBQUMsV0FBbUI7UUFDbkQsT0FBTyxDQUFPLElBQVUsRUFBRSxFQUFFOztZQUMxQixNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUEsd0JBQVksRUFBQyxJQUFJLENBQUMsQ0FBQztZQUMzQyxNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNaLE1BQU0sSUFBSSxnQ0FBbUIsQ0FBQyx5QkFBeUIsV0FBVyxJQUFJLENBQUMsQ0FBQzthQUN6RTtZQUVELDZEQUE2RDtZQUM3RCxNQUFNLGFBQWEsR0FBRyxJQUFJLEdBQUcsQ0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDekQsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUM3QyxRQUFRLE1BQU0sQ0FBQyxPQUFPLEVBQUU7b0JBQ3RCLEtBQUssMkJBQVEsQ0FBQyxLQUFLLENBQUM7b0JBQ3BCLEtBQUssMkJBQVEsQ0FBQyxNQUFNLENBQUM7b0JBQ3JCLEtBQUssMkJBQVEsQ0FBQyxPQUFPO3dCQUNuQixNQUFNLEtBQUssR0FBRyxNQUFBLE1BQU0sQ0FBQyxPQUFPLDBDQUFHLFVBQVUsQ0FBQyxDQUFDO3dCQUMzQyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTs0QkFDN0IsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzt5QkFDMUI7d0JBRUQsTUFBTTtpQkFDVDthQUNGO1lBRUQsTUFBTSxhQUFhLEdBQWEsQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM3RCxLQUFLLE1BQU0sSUFBSSxJQUFJLGFBQWEsRUFBRTtnQkFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ3RCLFNBQVM7aUJBQ1Y7Z0JBRUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxvQkFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdEMsTUFBTSxLQUFLLEdBQUcsTUFBQSxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxtQ0FBSSxFQUFFLENBQUM7Z0JBQzVDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUN6QixNQUFNLElBQUksZ0NBQW1CLENBQUMsa0NBQzFCLElBQUkseURBQXlELENBQUMsQ0FBQztpQkFDcEU7Z0JBRUQsTUFBTSxlQUFlLEdBQ2pCLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxZQUFZLElBQUksQ0FBQyxLQUFLLHdCQUF3QixDQUFDLENBQUM7Z0JBQzVFLElBQUksZUFBZSxFQUFFO29CQUNuQixrQ0FBa0M7b0JBQ2xDLFNBQVM7aUJBQ1Y7Z0JBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO2FBQ3REO1FBQ0gsQ0FBQyxDQUFBLENBQUM7SUFDSixDQUFDO0lBRUQsU0FBUyxrQkFBa0IsQ0FBQyxJQUFVLEVBQUUsT0FBeUI7UUFDL0QsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDaEMsT0FBTztTQUNSO1FBRUQsOEVBQThFO1FBQzlFLElBQUEsMENBQTJCLEVBQUMsSUFBSSxFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFDdkQsSUFBQSx1Q0FBd0IsRUFBQyxJQUFJLEVBQUU7WUFDN0IsSUFBSSxFQUFFLG1CQUFtQjtZQUN6QixJQUFJLEVBQUUsaUNBQWtCLENBQUMsT0FBTztZQUNoQyxPQUFPLEVBQUUsb0JBQW9CO1NBQzlCLENBQUMsQ0FBQztRQUVILDhFQUE4RTtRQUM5RSx5REFBeUQ7UUFDekQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLDhCQUFzQixFQUFFLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsbUJBQXdCLE9BQWU7UUFDckMsT0FBTyxHQUFHLEVBQUU7O1lBQ1YsNERBQTREO1lBQzVELDBFQUEwRTtZQUMxRSxNQUFNLFdBQVcsR0FBRyxNQUFBLE9BQU8sQ0FBQyxJQUFJLG1DQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFFcEQsSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDaEIsTUFBTSxJQUFJLGdDQUFtQixDQUFDLCtCQUErQixDQUFDLENBQUM7YUFDaEU7WUFFRCxPQUFPLElBQUEsa0JBQUssRUFBQztnQkFDWCx3QkFBd0IsQ0FBQyxXQUFXLENBQUM7Z0JBQ3JDLCtFQUErRTtnQkFDL0UscUVBQXFFO2dCQUNyRSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsSUFBQSxpQkFBSSxHQUFFO2FBQ25ELENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztJQUNKLENBQUM7SUFqQkQsNEJBaUJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICpcbiAqIEBmaWxlb3ZlcnZpZXcgU2NoZW1hdGljcyBmb3IgYG5nIGFkZCBAYW5ndWxhci9sb2NhbGl6ZWAgc2NoZW1hdGljLlxuICovXG5cbmltcG9ydCB7Y2hhaW4sIG5vb3AsIFJ1bGUsIFNjaGVtYXRpY0NvbnRleHQsIFNjaGVtYXRpY3NFeGNlcHRpb24sIFRyZWUsfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge05vZGVQYWNrYWdlSW5zdGFsbFRhc2t9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzL3Rhc2tzJztcbmltcG9ydCB7YWRkUGFja2FnZUpzb25EZXBlbmRlbmN5LCBOb2RlRGVwZW5kZW5jeVR5cGUsIHJlbW92ZVBhY2thZ2VKc29uRGVwZW5kZW5jeSx9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9kZXBlbmRlbmNpZXMnO1xuaW1wb3J0IHtKU09ORmlsZSwgSlNPTlBhdGh9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9qc29uLWZpbGUnO1xuaW1wb3J0IHtnZXRXb3Jrc3BhY2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS93b3Jrc3BhY2UnO1xuaW1wb3J0IHtCdWlsZGVyc30gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L3dvcmtzcGFjZS1tb2RlbHMnO1xuXG5pbXBvcnQge1NjaGVtYX0gZnJvbSAnLi9zY2hlbWEnO1xuXG5jb25zdCBsb2NhbGl6ZVR5cGUgPSBgQGFuZ3VsYXIvbG9jYWxpemVgO1xuXG5mdW5jdGlvbiBhZGRUeXBlU2NyaXB0Q29uZmlnVHlwZXMocHJvamVjdE5hbWU6IHN0cmluZyk6IFJ1bGUge1xuICByZXR1cm4gYXN5bmMgKGhvc3Q6IFRyZWUpID0+IHtcbiAgICBjb25zdCB3b3Jrc3BhY2UgPSBhd2FpdCBnZXRXb3Jrc3BhY2UoaG9zdCk7XG4gICAgY29uc3QgcHJvamVjdCA9IHdvcmtzcGFjZS5wcm9qZWN0cy5nZXQocHJvamVjdE5hbWUpO1xuICAgIGlmICghcHJvamVjdCkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYEludmFsaWQgcHJvamVjdCBuYW1lICcke3Byb2plY3ROYW1lfScuYCk7XG4gICAgfVxuXG4gICAgLy8gV2UgYWRkIHRoZSByb290IHdvcmtzcGFjZSB0c2NvbmZpZyBmb3IgYmV0dGVyIElERSBzdXBwb3J0LlxuICAgIGNvbnN0IHRzQ29uZmlnRmlsZXMgPSBuZXcgU2V0PHN0cmluZz4oWyd0c2NvbmZpZy5qc29uJ10pO1xuICAgIGZvciAoY29uc3QgdGFyZ2V0IG9mIHByb2plY3QudGFyZ2V0cy52YWx1ZXMoKSkge1xuICAgICAgc3dpdGNoICh0YXJnZXQuYnVpbGRlcikge1xuICAgICAgICBjYXNlIEJ1aWxkZXJzLkthcm1hOlxuICAgICAgICBjYXNlIEJ1aWxkZXJzLlNlcnZlcjpcbiAgICAgICAgY2FzZSBCdWlsZGVycy5Ccm93c2VyOlxuICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGFyZ2V0Lm9wdGlvbnM/LlsndHNDb25maWcnXTtcbiAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdHNDb25maWdGaWxlcy5hZGQodmFsdWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHR5cGVzSnNvblBhdGg6IEpTT05QYXRoID0gWydjb21waWxlck9wdGlvbnMnLCAndHlwZXMnXTtcbiAgICBmb3IgKGNvbnN0IHBhdGggb2YgdHNDb25maWdGaWxlcykge1xuICAgICAgaWYgKCFob3N0LmV4aXN0cyhwYXRoKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QganNvbiA9IG5ldyBKU09ORmlsZShob3N0LCBwYXRoKTtcbiAgICAgIGNvbnN0IHR5cGVzID0ganNvbi5nZXQodHlwZXNKc29uUGF0aCkgPz8gW107XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkodHlwZXMpKSB7XG4gICAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBUeXBlU2NyaXB0IGNvbmZpZ3VyYXRpb24gZmlsZSAnJHtcbiAgICAgICAgICAgIHBhdGh9JyBoYXMgYW4gaW52YWxpZCAndHlwZXMnIHByb3BlcnR5LiBJdCBtdXN0IGJlIGFuIGFycmF5LmApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBoYXNMb2NhbGl6ZVR5cGUgPVxuICAgICAgICAgIHR5cGVzLnNvbWUoKHQpID0+IHQgPT09IGxvY2FsaXplVHlwZSB8fCB0ID09PSAnQGFuZ3VsYXIvbG9jYWxpemUvaW5pdCcpO1xuICAgICAgaWYgKGhhc0xvY2FsaXplVHlwZSkge1xuICAgICAgICAvLyBTa2lwIGhhcyBhbHJlYWR5IGxvY2FsaXplIHR5cGUuXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBqc29uLm1vZGlmeSh0eXBlc0pzb25QYXRoLCBbLi4udHlwZXMsIGxvY2FsaXplVHlwZV0pO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gbW92ZVRvRGVwZW5kZW5jaWVzKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpOiB2b2lkIHtcbiAgaWYgKCFob3N0LmV4aXN0cygncGFja2FnZS5qc29uJykpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBSZW1vdmUgdGhlIHByZXZpb3VzIGRlcGVuZGVuY3kgYW5kIGFkZCBpbiBhIG5ldyBvbmUgdW5kZXIgdGhlIGRlc2lyZWQgdHlwZS5cbiAgcmVtb3ZlUGFja2FnZUpzb25EZXBlbmRlbmN5KGhvc3QsICdAYW5ndWxhci9sb2NhbGl6ZScpO1xuICBhZGRQYWNrYWdlSnNvbkRlcGVuZGVuY3koaG9zdCwge1xuICAgIG5hbWU6ICdAYW5ndWxhci9sb2NhbGl6ZScsXG4gICAgdHlwZTogTm9kZURlcGVuZGVuY3lUeXBlLkRlZmF1bHQsXG4gICAgdmVyc2lvbjogYH4wLjAuMC1QTEFDRUhPTERFUmAsXG4gIH0pO1xuXG4gIC8vIEFkZCBhIHRhc2sgdG8gcnVuIHRoZSBwYWNrYWdlIG1hbmFnZXIuIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2Ugd2UgdXBkYXRlZFxuICAvLyBcInBhY2thZ2UuanNvblwiIGFuZCB3ZSB3YW50IGxvY2sgZmlsZXMgdG8gcmVmbGVjdCB0aGlzLlxuICBjb250ZXh0LmFkZFRhc2sobmV3IE5vZGVQYWNrYWdlSW5zdGFsbFRhc2soKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG9wdGlvbnM6IFNjaGVtYSk6IFJ1bGUge1xuICByZXR1cm4gKCkgPT4ge1xuICAgIC8vIFdlIGZhdm9yIHRoZSBuYW1lIG9wdGlvbiBiZWNhdXNlIHRoZSBwcm9qZWN0IG9wdGlvbiBoYXMgYVxuICAgIC8vIHNtYXJ0IGRlZmF1bHQgd2hpY2ggY2FuIGJlIHBvcHVsYXRlZCBldmVuIHdoZW4gdW5zcGVjaWZpZWQgYnkgdGhlIHVzZXIuXG4gICAgY29uc3QgcHJvamVjdE5hbWUgPSBvcHRpb25zLm5hbWUgPz8gb3B0aW9ucy5wcm9qZWN0O1xuXG4gICAgaWYgKCFwcm9qZWN0TmFtZSkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oJ09wdGlvbiBcInByb2plY3RcIiBpcyByZXF1aXJlZC4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2hhaW4oW1xuICAgICAgYWRkVHlwZVNjcmlwdENvbmZpZ1R5cGVzKHByb2plY3ROYW1lKSxcbiAgICAgIC8vIElmIGAkbG9jYWxpemVgIHdpbGwgYmUgdXNlZCBhdCBydW50aW1lIHRoZW4gbXVzdCBpbnN0YWxsIGBAYW5ndWxhci9sb2NhbGl6ZWBcbiAgICAgIC8vIGludG8gYGRlcGVuZGVuY2llc2AsIHJhdGhlciB0aGFuIHRoZSBkZWZhdWx0IG9mIGBkZXZEZXBlbmRlbmNpZXNgLlxuICAgICAgb3B0aW9ucy51c2VBdFJ1bnRpbWUgPyBtb3ZlVG9EZXBlbmRlbmNpZXMgOiBub29wKCksXG4gICAgXSk7XG4gIH07XG59XG4iXX0=
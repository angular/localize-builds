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
    exports.localizePolyfill = `import '@angular/localize/init';`;
    function getRelevantTargetDefinitions(project, builderName) {
        const definitions = [];
        project.targets.forEach((target) => {
            if (target.builder === builderName) {
                definitions.push(target);
            }
        });
        return definitions;
    }
    function getOptionValuesForTargetDefinition(definition, optionName) {
        const optionValues = [];
        if (definition.options && optionName in definition.options) {
            let optionValue = definition.options[optionName];
            if (typeof optionValue === 'string') {
                optionValues.push(optionValue);
            }
        }
        if (!definition.configurations) {
            return optionValues;
        }
        Object.values(definition.configurations)
            .forEach((configuration) => {
            if (configuration && optionName in configuration) {
                const optionValue = configuration[optionName];
                if (typeof optionValue === 'string') {
                    optionValues.push(optionValue);
                }
            }
        });
        return optionValues;
    }
    function getFileListForRelevantTargetDefinitions(project, builderName, optionName) {
        const fileList = [];
        const definitions = getRelevantTargetDefinitions(project, builderName);
        definitions.forEach((definition) => {
            const optionValues = getOptionValuesForTargetDefinition(definition, optionName);
            optionValues.forEach((filePath) => {
                if (fileList.indexOf(filePath) === -1) {
                    fileList.push(filePath);
                }
            });
        });
        return fileList;
    }
    function prependToTargetFiles(project, builderName, optionName, str) {
        return (host) => {
            const fileList = getFileListForRelevantTargetDefinitions(project, builderName, optionName);
            fileList.forEach((path) => {
                const data = host.read(path);
                if (!data) {
                    // If the file doesn't exist, just ignore it.
                    return;
                }
                const content = core_1.virtualFs.fileBufferToString(data);
                if (content.includes(exports.localizePolyfill) ||
                    content.includes(exports.localizePolyfill.replace(/'/g, '"'))) {
                    // If the file already contains the polyfill (or variations), ignore it too.
                    return;
                }
                // Add string at the start of the file.
                const recorder = host.beginUpdate(path);
                recorder.insertLeft(0, str);
                host.commitUpdate(recorder);
            });
        };
    }
    function moveToDependencies(host, context) {
        if (host.exists('package.json')) {
            // Remove the previous dependency and add in a new one under the desired type.
            (0, dependencies_1.removePackageJsonDependency)(host, '@angular/localize');
            (0, dependencies_1.addPackageJsonDependency)(host, {
                name: '@angular/localize',
                type: dependencies_1.NodeDependencyType.Default,
                version: `~14.2.0+sha-59a6fe7`
            });
            // Add a task to run the package manager. This is necessary because we updated
            // "package.json" and we want lock files to reflect this.
            context.addTask(new tasks_1.NodePackageInstallTask());
        }
    }
    function default_1(options) {
        return (host) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a;
            // We favor the name option because the project option has a
            // smart default which can be populated even when unspecified by the user.
            const projectName = (_a = options.name) !== null && _a !== void 0 ? _a : options.project;
            if (!projectName) {
                throw new schematics_1.SchematicsException('Option "project" is required.');
            }
            const workspace = yield (0, workspace_1.getWorkspace)(host);
            const project = workspace.projects.get(projectName);
            if (!project) {
                throw new schematics_1.SchematicsException(`Invalid project name (${projectName})`);
            }
            const localizeStr = `/***************************************************************************************************
 * Load \`$localize\` onto the global scope - used if i18n tags appear in Angular templates.
 */
${exports.localizePolyfill}
`;
            return (0, schematics_1.chain)([
                prependToTargetFiles(project, workspace_models_1.Builders.Browser, 'polyfills', localizeStr),
                prependToTargetFiles(project, workspace_models_1.Builders.Server, 'main', localizeStr),
                // If `$localize` will be used at runtime then must install `@angular/localize`
                // into `dependencies`, rather than the default of `devDependencies`.
                options.useAtRuntime ? moveToDependencies : (0, schematics_1.noop)(),
            ]);
        });
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zY2hlbWF0aWNzL25nLWFkZC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7R0FRRzs7Ozs7Ozs7Ozs7Ozs7SUFFSCwrQ0FBMkQ7SUFDM0QsMkRBQTBHO0lBQzFHLDREQUF3RTtJQUN4RSwyRUFBbUk7SUFDbkkscUVBQW1FO0lBQ25FLG1GQUFzRTtJQUl6RCxRQUFBLGdCQUFnQixHQUFHLGtDQUFrQyxDQUFDO0lBRW5FLFNBQVMsNEJBQTRCLENBQ2pDLE9BQXFDLEVBQUUsV0FBcUI7UUFDOUQsTUFBTSxXQUFXLEdBQWtDLEVBQUUsQ0FBQztRQUN0RCxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQW1DLEVBQVEsRUFBRTtZQUNwRSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEtBQUssV0FBVyxFQUFFO2dCQUNsQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzFCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRUQsU0FBUyxrQ0FBa0MsQ0FDdkMsVUFBdUMsRUFBRSxVQUFrQjtRQUM3RCxNQUFNLFlBQVksR0FBYSxFQUFFLENBQUM7UUFDbEMsSUFBSSxVQUFVLENBQUMsT0FBTyxJQUFJLFVBQVUsSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFO1lBQzFELElBQUksV0FBVyxHQUFZLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDMUQsSUFBSSxPQUFPLFdBQVcsS0FBSyxRQUFRLEVBQUU7Z0JBQ25DLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDaEM7U0FDRjtRQUNELElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFO1lBQzlCLE9BQU8sWUFBWSxDQUFDO1NBQ3JC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QkErQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKlxuICogQGZpbGVvdmVydmlldyBTY2hlbWF0aWNzIGZvciBuZy1uZXcgcHJvamVjdCB0aGF0IGJ1aWxkcyB3aXRoIEJhemVsLlxuICovXG5cbmltcG9ydCB7dmlydHVhbEZzLCB3b3Jrc3BhY2VzfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQge2NoYWluLCBub29wLCBSdWxlLCBTY2hlbWF0aWNDb250ZXh0LCBTY2hlbWF0aWNzRXhjZXB0aW9uLCBUcmVlfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge05vZGVQYWNrYWdlSW5zdGFsbFRhc2t9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzL3Rhc2tzJztcbmltcG9ydCB7YWRkUGFja2FnZUpzb25EZXBlbmRlbmN5LCBOb2RlRGVwZW5kZW5jeVR5cGUsIHJlbW92ZVBhY2thZ2VKc29uRGVwZW5kZW5jeX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L2RlcGVuZGVuY2llcyc7XG5pbXBvcnQge2dldFdvcmtzcGFjZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L3dvcmtzcGFjZSc7XG5pbXBvcnQge0J1aWxkZXJzfSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvd29ya3NwYWNlLW1vZGVscyc7XG5cbmltcG9ydCB7U2NoZW1hfSBmcm9tICcuL3NjaGVtYSc7XG5cbmV4cG9ydCBjb25zdCBsb2NhbGl6ZVBvbHlmaWxsID0gYGltcG9ydCAnQGFuZ3VsYXIvbG9jYWxpemUvaW5pdCc7YDtcblxuZnVuY3Rpb24gZ2V0UmVsZXZhbnRUYXJnZXREZWZpbml0aW9ucyhcbiAgICBwcm9qZWN0OiB3b3Jrc3BhY2VzLlByb2plY3REZWZpbml0aW9uLCBidWlsZGVyTmFtZTogQnVpbGRlcnMpOiB3b3Jrc3BhY2VzLlRhcmdldERlZmluaXRpb25bXSB7XG4gIGNvbnN0IGRlZmluaXRpb25zOiB3b3Jrc3BhY2VzLlRhcmdldERlZmluaXRpb25bXSA9IFtdO1xuICBwcm9qZWN0LnRhcmdldHMuZm9yRWFjaCgodGFyZ2V0OiB3b3Jrc3BhY2VzLlRhcmdldERlZmluaXRpb24pOiB2b2lkID0+IHtcbiAgICBpZiAodGFyZ2V0LmJ1aWxkZXIgPT09IGJ1aWxkZXJOYW1lKSB7XG4gICAgICBkZWZpbml0aW9ucy5wdXNoKHRhcmdldCk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGRlZmluaXRpb25zO1xufVxuXG5mdW5jdGlvbiBnZXRPcHRpb25WYWx1ZXNGb3JUYXJnZXREZWZpbml0aW9uKFxuICAgIGRlZmluaXRpb246IHdvcmtzcGFjZXMuVGFyZ2V0RGVmaW5pdGlvbiwgb3B0aW9uTmFtZTogc3RyaW5nKTogc3RyaW5nW10ge1xuICBjb25zdCBvcHRpb25WYWx1ZXM6IHN0cmluZ1tdID0gW107XG4gIGlmIChkZWZpbml0aW9uLm9wdGlvbnMgJiYgb3B0aW9uTmFtZSBpbiBkZWZpbml0aW9uLm9wdGlvbnMpIHtcbiAgICBsZXQgb3B0aW9uVmFsdWU6IHVua25vd24gPSBkZWZpbml0aW9uLm9wdGlvbnNbb3B0aW9uTmFtZV07XG4gICAgaWYgKHR5cGVvZiBvcHRpb25WYWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG9wdGlvblZhbHVlcy5wdXNoKG9wdGlvblZhbHVlKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFkZWZpbml0aW9uLmNvbmZpZ3VyYXRpb25zKSB7XG4gICAgcmV0dXJuIG9wdGlvblZhbHVlcztcbiAgfVxuICBPYmplY3QudmFsdWVzKGRlZmluaXRpb24uY29uZmlndXJhdGlvbnMpXG4gICAgICAuZm9yRWFjaCgoY29uZmlndXJhdGlvbjogUmVjb3JkPHN0cmluZywgdW5rbm93bj58dW5kZWZpbmVkKTogdm9pZCA9PiB7XG4gICAgICAgIGlmIChjb25maWd1cmF0aW9uICYmIG9wdGlvbk5hbWUgaW4gY29uZmlndXJhdGlvbikge1xuICAgICAgICAgIGNvbnN0IG9wdGlvblZhbHVlOiB1bmtub3duID0gY29uZmlndXJhdGlvbltvcHRpb25OYW1lXTtcbiAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvblZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgb3B0aW9uVmFsdWVzLnB1c2gob3B0aW9uVmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gIHJldHVybiBvcHRpb25WYWx1ZXM7XG59XG5cbmZ1bmN0aW9uIGdldEZpbGVMaXN0Rm9yUmVsZXZhbnRUYXJnZXREZWZpbml0aW9ucyhcbiAgICBwcm9qZWN0OiB3b3Jrc3BhY2VzLlByb2plY3REZWZpbml0aW9uLCBidWlsZGVyTmFtZTogQnVpbGRlcnMsIG9wdGlvbk5hbWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgZmlsZUxpc3Q6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IGRlZmluaXRpb25zID0gZ2V0UmVsZXZhbnRUYXJnZXREZWZpbml0aW9ucyhwcm9qZWN0LCBidWlsZGVyTmFtZSk7XG4gIGRlZmluaXRpb25zLmZvckVhY2goKGRlZmluaXRpb246IHdvcmtzcGFjZXMuVGFyZ2V0RGVmaW5pdGlvbik6IHZvaWQgPT4ge1xuICAgIGNvbnN0IG9wdGlvblZhbHVlcyA9IGdldE9wdGlvblZhbHVlc0ZvclRhcmdldERlZmluaXRpb24oZGVmaW5pdGlvbiwgb3B0aW9uTmFtZSk7XG4gICAgb3B0aW9uVmFsdWVzLmZvckVhY2goKGZpbGVQYXRoOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgIGlmIChmaWxlTGlzdC5pbmRleE9mKGZpbGVQYXRoKSA9PT0gLTEpIHtcbiAgICAgICAgZmlsZUxpc3QucHVzaChmaWxlUGF0aCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gZmlsZUxpc3Q7XG59XG5cbmZ1bmN0aW9uIHByZXBlbmRUb1RhcmdldEZpbGVzKFxuICAgIHByb2plY3Q6IHdvcmtzcGFjZXMuUHJvamVjdERlZmluaXRpb24sIGJ1aWxkZXJOYW1lOiBCdWlsZGVycywgb3B0aW9uTmFtZTogc3RyaW5nLCBzdHI6IHN0cmluZykge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUpID0+IHtcbiAgICBjb25zdCBmaWxlTGlzdCA9IGdldEZpbGVMaXN0Rm9yUmVsZXZhbnRUYXJnZXREZWZpbml0aW9ucyhwcm9qZWN0LCBidWlsZGVyTmFtZSwgb3B0aW9uTmFtZSk7XG5cbiAgICBmaWxlTGlzdC5mb3JFYWNoKChwYXRoOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IGRhdGEgPSBob3N0LnJlYWQocGF0aCk7XG4gICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgLy8gSWYgdGhlIGZpbGUgZG9lc24ndCBleGlzdCwganVzdCBpZ25vcmUgaXQuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29udGVudCA9IHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoZGF0YSk7XG4gICAgICBpZiAoY29udGVudC5pbmNsdWRlcyhsb2NhbGl6ZVBvbHlmaWxsKSB8fFxuICAgICAgICAgIGNvbnRlbnQuaW5jbHVkZXMobG9jYWxpemVQb2x5ZmlsbC5yZXBsYWNlKC8nL2csICdcIicpKSkge1xuICAgICAgICAvLyBJZiB0aGUgZmlsZSBhbHJlYWR5IGNvbnRhaW5zIHRoZSBwb2x5ZmlsbCAob3IgdmFyaWF0aW9ucyksIGlnbm9yZSBpdCB0b28uXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIHN0cmluZyBhdCB0aGUgc3RhcnQgb2YgdGhlIGZpbGUuXG4gICAgICBjb25zdCByZWNvcmRlciA9IGhvc3QuYmVnaW5VcGRhdGUocGF0aCk7XG4gICAgICByZWNvcmRlci5pbnNlcnRMZWZ0KDAsIHN0cik7XG4gICAgICBob3N0LmNvbW1pdFVwZGF0ZShyZWNvcmRlcik7XG4gICAgfSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIG1vdmVUb0RlcGVuZGVuY2llcyhob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSB7XG4gIGlmIChob3N0LmV4aXN0cygncGFja2FnZS5qc29uJykpIHtcbiAgICAvLyBSZW1vdmUgdGhlIHByZXZpb3VzIGRlcGVuZGVuY3kgYW5kIGFkZCBpbiBhIG5ldyBvbmUgdW5kZXIgdGhlIGRlc2lyZWQgdHlwZS5cbiAgICByZW1vdmVQYWNrYWdlSnNvbkRlcGVuZGVuY3koaG9zdCwgJ0Bhbmd1bGFyL2xvY2FsaXplJyk7XG4gICAgYWRkUGFja2FnZUpzb25EZXBlbmRlbmN5KGhvc3QsIHtcbiAgICAgIG5hbWU6ICdAYW5ndWxhci9sb2NhbGl6ZScsXG4gICAgICB0eXBlOiBOb2RlRGVwZW5kZW5jeVR5cGUuRGVmYXVsdCxcbiAgICAgIHZlcnNpb246IGB+MC4wLjAtUExBQ0VIT0xERVJgXG4gICAgfSk7XG5cbiAgICAvLyBBZGQgYSB0YXNrIHRvIHJ1biB0aGUgcGFja2FnZSBtYW5hZ2VyLiBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIHdlIHVwZGF0ZWRcbiAgICAvLyBcInBhY2thZ2UuanNvblwiIGFuZCB3ZSB3YW50IGxvY2sgZmlsZXMgdG8gcmVmbGVjdCB0aGlzLlxuICAgIGNvbnRleHQuYWRkVGFzayhuZXcgTm9kZVBhY2thZ2VJbnN0YWxsVGFzaygpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvcHRpb25zOiBTY2hlbWEpOiBSdWxlIHtcbiAgcmV0dXJuIGFzeW5jIChob3N0OiBUcmVlKSA9PiB7XG4gICAgLy8gV2UgZmF2b3IgdGhlIG5hbWUgb3B0aW9uIGJlY2F1c2UgdGhlIHByb2plY3Qgb3B0aW9uIGhhcyBhXG4gICAgLy8gc21hcnQgZGVmYXVsdCB3aGljaCBjYW4gYmUgcG9wdWxhdGVkIGV2ZW4gd2hlbiB1bnNwZWNpZmllZCBieSB0aGUgdXNlci5cbiAgICBjb25zdCBwcm9qZWN0TmFtZSA9IG9wdGlvbnMubmFtZSA/PyBvcHRpb25zLnByb2plY3Q7XG5cbiAgICBpZiAoIXByb2plY3ROYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbignT3B0aW9uIFwicHJvamVjdFwiIGlzIHJlcXVpcmVkLicpO1xuICAgIH1cblxuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGF3YWl0IGdldFdvcmtzcGFjZShob3N0KTtcbiAgICBjb25zdCBwcm9qZWN0OiB3b3Jrc3BhY2VzLlByb2plY3REZWZpbml0aW9ufHVuZGVmaW5lZCA9IHdvcmtzcGFjZS5wcm9qZWN0cy5nZXQocHJvamVjdE5hbWUpO1xuICAgIGlmICghcHJvamVjdCkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYEludmFsaWQgcHJvamVjdCBuYW1lICgke3Byb2plY3ROYW1lfSlgKTtcbiAgICB9XG5cbiAgICBjb25zdCBsb2NhbGl6ZVN0ciA9XG4gICAgICAgIGAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBMb2FkIFxcYCRsb2NhbGl6ZVxcYCBvbnRvIHRoZSBnbG9iYWwgc2NvcGUgLSB1c2VkIGlmIGkxOG4gdGFncyBhcHBlYXIgaW4gQW5ndWxhciB0ZW1wbGF0ZXMuXG4gKi9cbiR7bG9jYWxpemVQb2x5ZmlsbH1cbmA7XG5cbiAgICByZXR1cm4gY2hhaW4oW1xuICAgICAgcHJlcGVuZFRvVGFyZ2V0RmlsZXMocHJvamVjdCwgQnVpbGRlcnMuQnJvd3NlciwgJ3BvbHlmaWxscycsIGxvY2FsaXplU3RyKSxcbiAgICAgIHByZXBlbmRUb1RhcmdldEZpbGVzKHByb2plY3QsIEJ1aWxkZXJzLlNlcnZlciwgJ21haW4nLCBsb2NhbGl6ZVN0ciksXG4gICAgICAvLyBJZiBgJGxvY2FsaXplYCB3aWxsIGJlIHVzZWQgYXQgcnVudGltZSB0aGVuIG11c3QgaW5zdGFsbCBgQGFuZ3VsYXIvbG9jYWxpemVgXG4gICAgICAvLyBpbnRvIGBkZXBlbmRlbmNpZXNgLCByYXRoZXIgdGhhbiB0aGUgZGVmYXVsdCBvZiBgZGV2RGVwZW5kZW5jaWVzYC5cbiAgICAgIG9wdGlvbnMudXNlQXRSdW50aW1lID8gbW92ZVRvRGVwZW5kZW5jaWVzIDogbm9vcCgpLFxuICAgIF0pO1xuICB9O1xufVxuIl19
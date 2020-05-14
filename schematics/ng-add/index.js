/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
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
        define("@angular/localize/schematics/ng-add", ["require", "exports", "tslib", "@angular-devkit/core", "@angular-devkit/schematics", "@schematics/angular/utility/workspace", "@schematics/angular/utility/workspace-models"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.localizePolyfill = void 0;
    var tslib_1 = require("tslib");
    var core_1 = require("@angular-devkit/core");
    var schematics_1 = require("@angular-devkit/schematics");
    var workspace_1 = require("@schematics/angular/utility/workspace");
    var workspace_models_1 = require("@schematics/angular/utility/workspace-models");
    exports.localizePolyfill = "import '@angular/localize/init';";
    function getRelevantTargetDefinitions(project, builderName) {
        var definitions = [];
        project.targets.forEach(function (target) {
            if (target.builder === builderName) {
                definitions.push(target);
            }
        });
        return definitions;
    }
    function getOptionValuesForTargetDefinition(definition, optionName) {
        var optionValues = [];
        if (definition.options && optionName in definition.options) {
            var optionValue = definition.options[optionName];
            if (typeof optionValue === 'string') {
                optionValues.push(optionValue);
            }
        }
        if (!definition.configurations) {
            return optionValues;
        }
        Object.values(definition.configurations)
            .forEach(function (configuration) {
            if (configuration && optionName in configuration) {
                var optionValue = configuration[optionName];
                if (typeof optionValue === 'string') {
                    optionValues.push(optionValue);
                }
            }
        });
        return optionValues;
    }
    function getFileListForRelevantTargetDefinitions(project, builderName, optionName) {
        var fileList = [];
        var definitions = getRelevantTargetDefinitions(project, builderName);
        definitions.forEach(function (definition) {
            var optionValues = getOptionValuesForTargetDefinition(definition, optionName);
            optionValues.forEach(function (filePath) {
                if (fileList.indexOf(filePath) === -1) {
                    fileList.push(filePath);
                }
            });
        });
        return fileList;
    }
    function prependToTargetFiles(project, builderName, optionName, str) {
        return function (host) {
            var fileList = getFileListForRelevantTargetDefinitions(project, builderName, optionName);
            fileList.forEach(function (path) {
                var data = host.read(path);
                if (!data) {
                    // If the file doesn't exist, just ignore it.
                    return;
                }
                var content = core_1.virtualFs.fileBufferToString(data);
                if (content.includes(exports.localizePolyfill) ||
                    content.includes(exports.localizePolyfill.replace(/'/g, '"'))) {
                    // If the file already contains the polyfill (or variations), ignore it too.
                    return;
                }
                // Add string at the start of the file.
                var recorder = host.beginUpdate(path);
                recorder.insertLeft(0, str);
                host.commitUpdate(recorder);
            });
        };
    }
    function default_1(options) {
        var _this = this;
        return function (host) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var workspace, project, localizeStr;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.name) {
                            throw new schematics_1.SchematicsException('Option "name" is required.');
                        }
                        return [4 /*yield*/, workspace_1.getWorkspace(host)];
                    case 1:
                        workspace = _a.sent();
                        project = workspace.projects.get(options.name);
                        if (!project) {
                            throw new schematics_1.SchematicsException("Invalid project name (" + options.name + ")");
                        }
                        localizeStr = "/***************************************************************************************************\n * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.\n */\n" + exports.localizePolyfill + "\n";
                        return [2 /*return*/, schematics_1.chain([
                                prependToTargetFiles(project, workspace_models_1.Builders.Browser, 'polyfills', localizeStr),
                                prependToTargetFiles(project, workspace_models_1.Builders.Server, 'main', localizeStr),
                            ])];
                }
            });
        }); };
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zY2hlbWF0aWNzL25nLWFkZC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7R0FRRzs7Ozs7Ozs7Ozs7Ozs7SUFFSCw2Q0FBMkQ7SUFDM0QseURBQWtGO0lBQ2xGLG1FQUFtRTtJQUNuRSxpRkFBc0U7SUFLekQsUUFBQSxnQkFBZ0IsR0FBRyxrQ0FBa0MsQ0FBQztJQUVuRSxTQUFTLDRCQUE0QixDQUNqQyxPQUFxQyxFQUFFLFdBQXFCO1FBQzlELElBQU0sV0FBVyxHQUFrQyxFQUFFLENBQUM7UUFDdEQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFtQztZQUMxRCxJQUFJLE1BQU0sQ0FBQyxPQUFPLEtBQUssV0FBVyxFQUFFO2dCQUNsQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzFCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRUQsU0FBUyxrQ0FBa0MsQ0FDdkMsVUFBdUMsRUFBRSxVQUFrQjtRQUM3RCxJQUFNLFlBQVksR0FBYSxFQUFFLENBQUM7UUFDbEMsSUFBSSxVQUFVLENBQUMsT0FBTyxJQUFJLFVBQVUsSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFO1lBQzFELElBQUksV0FBVyxHQUFZLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDMUQsSUFBSSxPQUFPLFdBQVcsS0FBSyxRQUFRLEVBQUU7Z0JBQ25DLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDaEM7U0FDRjtRQUNELElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFO1lBQzlCLE9BQU8sWUFBWSxDQUFDO1NBQ3JCO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMs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QUFJLE1BQUcsQ0FBQyxDQUFDO3lCQUN6RTt3QkFFSyxXQUFXLEdBQ2IsNE1BR04sd0JBQWdCLE9BQ2pCLENBQUM7d0JBRUUsc0JBQU8sa0JBQUssQ0FBQztnQ0FDWCxvQkFBb0IsQ0FBQyxPQUFPLEVBQUUsMkJBQVEsQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFdBQVcsQ0FBQztnQ0FDekUsb0JBQW9CLENBQUMsT0FBTyxFQUFFLDJCQUFRLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxXQUFXLENBQUM7NkJBQ3BFLENBQUMsRUFBQzs7O2FBQ0osQ0FBQztJQUNKLENBQUM7SUF4QkQsNEJBd0JDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqXG4gKiBAZmlsZW92ZXJ2aWV3IFNjaGVtYXRpY3MgZm9yIG5nLW5ldyBwcm9qZWN0IHRoYXQgYnVpbGRzIHdpdGggQmF6ZWwuXG4gKi9cblxuaW1wb3J0IHt2aXJ0dWFsRnMsIHdvcmtzcGFjZXN9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7Y2hhaW4sIFJ1bGUsIFNjaGVtYXRpY3NFeGNlcHRpb24sIFRyZWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7Z2V0V29ya3NwYWNlfSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvd29ya3NwYWNlJztcbmltcG9ydCB7QnVpbGRlcnN9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS93b3Jrc3BhY2UtbW9kZWxzJztcblxuaW1wb3J0IHtTY2hlbWF9IGZyb20gJy4vc2NoZW1hJztcblxuXG5leHBvcnQgY29uc3QgbG9jYWxpemVQb2x5ZmlsbCA9IGBpbXBvcnQgJ0Bhbmd1bGFyL2xvY2FsaXplL2luaXQnO2A7XG5cbmZ1bmN0aW9uIGdldFJlbGV2YW50VGFyZ2V0RGVmaW5pdGlvbnMoXG4gICAgcHJvamVjdDogd29ya3NwYWNlcy5Qcm9qZWN0RGVmaW5pdGlvbiwgYnVpbGRlck5hbWU6IEJ1aWxkZXJzKTogd29ya3NwYWNlcy5UYXJnZXREZWZpbml0aW9uW10ge1xuICBjb25zdCBkZWZpbml0aW9uczogd29ya3NwYWNlcy5UYXJnZXREZWZpbml0aW9uW10gPSBbXTtcbiAgcHJvamVjdC50YXJnZXRzLmZvckVhY2goKHRhcmdldDogd29ya3NwYWNlcy5UYXJnZXREZWZpbml0aW9uKTogdm9pZCA9PiB7XG4gICAgaWYgKHRhcmdldC5idWlsZGVyID09PSBidWlsZGVyTmFtZSkge1xuICAgICAgZGVmaW5pdGlvbnMucHVzaCh0YXJnZXQpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkZWZpbml0aW9ucztcbn1cblxuZnVuY3Rpb24gZ2V0T3B0aW9uVmFsdWVzRm9yVGFyZ2V0RGVmaW5pdGlvbihcbiAgICBkZWZpbml0aW9uOiB3b3Jrc3BhY2VzLlRhcmdldERlZmluaXRpb24sIG9wdGlvbk5hbWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgY29uc3Qgb3B0aW9uVmFsdWVzOiBzdHJpbmdbXSA9IFtdO1xuICBpZiAoZGVmaW5pdGlvbi5vcHRpb25zICYmIG9wdGlvbk5hbWUgaW4gZGVmaW5pdGlvbi5vcHRpb25zKSB7XG4gICAgbGV0IG9wdGlvblZhbHVlOiB1bmtub3duID0gZGVmaW5pdGlvbi5vcHRpb25zW29wdGlvbk5hbWVdO1xuICAgIGlmICh0eXBlb2Ygb3B0aW9uVmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBvcHRpb25WYWx1ZXMucHVzaChvcHRpb25WYWx1ZSk7XG4gICAgfVxuICB9XG4gIGlmICghZGVmaW5pdGlvbi5jb25maWd1cmF0aW9ucykge1xuICAgIHJldHVybiBvcHRpb25WYWx1ZXM7XG4gIH1cbiAgT2JqZWN0LnZhbHVlcyhkZWZpbml0aW9uLmNvbmZpZ3VyYXRpb25zKVxuICAgICAgLmZvckVhY2goKGNvbmZpZ3VyYXRpb246IFJlY29yZDxzdHJpbmcsIHVua25vd24+fHVuZGVmaW5lZCk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAoY29uZmlndXJhdGlvbiAmJiBvcHRpb25OYW1lIGluIGNvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICBjb25zdCBvcHRpb25WYWx1ZTogdW5rbm93biA9IGNvbmZpZ3VyYXRpb25bb3B0aW9uTmFtZV07XG4gICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25WYWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIG9wdGlvblZhbHVlcy5wdXNoKG9wdGlvblZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICByZXR1cm4gb3B0aW9uVmFsdWVzO1xufVxuXG5mdW5jdGlvbiBnZXRGaWxlTGlzdEZvclJlbGV2YW50VGFyZ2V0RGVmaW5pdGlvbnMoXG4gICAgcHJvamVjdDogd29ya3NwYWNlcy5Qcm9qZWN0RGVmaW5pdGlvbiwgYnVpbGRlck5hbWU6IEJ1aWxkZXJzLCBvcHRpb25OYW1lOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IGZpbGVMaXN0OiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBkZWZpbml0aW9ucyA9IGdldFJlbGV2YW50VGFyZ2V0RGVmaW5pdGlvbnMocHJvamVjdCwgYnVpbGRlck5hbWUpO1xuICBkZWZpbml0aW9ucy5mb3JFYWNoKChkZWZpbml0aW9uOiB3b3Jrc3BhY2VzLlRhcmdldERlZmluaXRpb24pOiB2b2lkID0+IHtcbiAgICBjb25zdCBvcHRpb25WYWx1ZXMgPSBnZXRPcHRpb25WYWx1ZXNGb3JUYXJnZXREZWZpbml0aW9uKGRlZmluaXRpb24sIG9wdGlvbk5hbWUpO1xuICAgIG9wdGlvblZhbHVlcy5mb3JFYWNoKChmaWxlUGF0aDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICBpZiAoZmlsZUxpc3QuaW5kZXhPZihmaWxlUGF0aCkgPT09IC0xKSB7XG4gICAgICAgIGZpbGVMaXN0LnB1c2goZmlsZVBhdGgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIGZpbGVMaXN0O1xufVxuXG5mdW5jdGlvbiBwcmVwZW5kVG9UYXJnZXRGaWxlcyhcbiAgICBwcm9qZWN0OiB3b3Jrc3BhY2VzLlByb2plY3REZWZpbml0aW9uLCBidWlsZGVyTmFtZTogQnVpbGRlcnMsIG9wdGlvbk5hbWU6IHN0cmluZywgc3RyOiBzdHJpbmcpIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlKSA9PiB7XG4gICAgY29uc3QgZmlsZUxpc3QgPSBnZXRGaWxlTGlzdEZvclJlbGV2YW50VGFyZ2V0RGVmaW5pdGlvbnMocHJvamVjdCwgYnVpbGRlck5hbWUsIG9wdGlvbk5hbWUpO1xuXG4gICAgZmlsZUxpc3QuZm9yRWFjaCgocGF0aDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBkYXRhID0gaG9zdC5yZWFkKHBhdGgpO1xuICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgIC8vIElmIHRoZSBmaWxlIGRvZXNuJ3QgZXhpc3QsIGp1c3QgaWdub3JlIGl0LlxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbnRlbnQgPSB2aXJ0dWFsRnMuZmlsZUJ1ZmZlclRvU3RyaW5nKGRhdGEpO1xuICAgICAgaWYgKGNvbnRlbnQuaW5jbHVkZXMobG9jYWxpemVQb2x5ZmlsbCkgfHxcbiAgICAgICAgICBjb250ZW50LmluY2x1ZGVzKGxvY2FsaXplUG9seWZpbGwucmVwbGFjZSgvJy9nLCAnXCInKSkpIHtcbiAgICAgICAgLy8gSWYgdGhlIGZpbGUgYWxyZWFkeSBjb250YWlucyB0aGUgcG9seWZpbGwgKG9yIHZhcmlhdGlvbnMpLCBpZ25vcmUgaXQgdG9vLlxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCBzdHJpbmcgYXQgdGhlIHN0YXJ0IG9mIHRoZSBmaWxlLlxuICAgICAgY29uc3QgcmVjb3JkZXIgPSBob3N0LmJlZ2luVXBkYXRlKHBhdGgpO1xuICAgICAgcmVjb3JkZXIuaW5zZXJ0TGVmdCgwLCBzdHIpO1xuICAgICAgaG9zdC5jb21taXRVcGRhdGUocmVjb3JkZXIpO1xuICAgIH0pO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvcHRpb25zOiBTY2hlbWEpOiBSdWxlIHtcbiAgcmV0dXJuIGFzeW5jIChob3N0OiBUcmVlKSA9PiB7XG4gICAgaWYgKCFvcHRpb25zLm5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKCdPcHRpb24gXCJuYW1lXCIgaXMgcmVxdWlyZWQuJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgd29ya3NwYWNlID0gYXdhaXQgZ2V0V29ya3NwYWNlKGhvc3QpO1xuICAgIGNvbnN0IHByb2plY3Q6IHdvcmtzcGFjZXMuUHJvamVjdERlZmluaXRpb258dW5kZWZpbmVkID0gd29ya3NwYWNlLnByb2plY3RzLmdldChvcHRpb25zLm5hbWUpO1xuICAgIGlmICghcHJvamVjdCkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYEludmFsaWQgcHJvamVjdCBuYW1lICgke29wdGlvbnMubmFtZX0pYCk7XG4gICAgfVxuXG4gICAgY29uc3QgbG9jYWxpemVTdHIgPVxuICAgICAgICBgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTG9hZCBcXGAkbG9jYWxpemVcXGAgb250byB0aGUgZ2xvYmFsIHNjb3BlIC0gdXNlZCBpZiBpMThuIHRhZ3MgYXBwZWFyIGluIEFuZ3VsYXIgdGVtcGxhdGVzLlxuICovXG4ke2xvY2FsaXplUG9seWZpbGx9XG5gO1xuXG4gICAgcmV0dXJuIGNoYWluKFtcbiAgICAgIHByZXBlbmRUb1RhcmdldEZpbGVzKHByb2plY3QsIEJ1aWxkZXJzLkJyb3dzZXIsICdwb2x5ZmlsbHMnLCBsb2NhbGl6ZVN0ciksXG4gICAgICBwcmVwZW5kVG9UYXJnZXRGaWxlcyhwcm9qZWN0LCBCdWlsZGVycy5TZXJ2ZXIsICdtYWluJywgbG9jYWxpemVTdHIpLFxuICAgIF0pO1xuICB9O1xufVxuIl19
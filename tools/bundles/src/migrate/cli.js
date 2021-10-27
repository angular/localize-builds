#!/usr/bin/env node

      import {createRequire as __cjsCompatRequire} from 'module';
      const require = __cjsCompatRequire(import.meta.url);
    
import "../../chunk-KZHPLSGS.js";

// bazel-out/k8-fastbuild/bin/packages/localize/tools/src/migrate/cli.mjs
import { ConsoleLogger, LogLevel, NodeJSFileSystem, setFileSystem } from "@angular/compiler-cli/private/localize";
import glob from "glob";
import yargs from "yargs";

// bazel-out/k8-fastbuild/bin/packages/localize/tools/src/migrate/index.mjs
import { getFileSystem } from "@angular/compiler-cli/private/localize";

// bazel-out/k8-fastbuild/bin/packages/localize/tools/src/migrate/migrate.mjs
function migrateFile(sourceCode, mapping) {
  const legacyIds = Object.keys(mapping);
  for (const legacyId of legacyIds) {
    const cannonicalId = mapping[legacyId];
    const pattern = new RegExp(escapeRegExp(legacyId), "g");
    sourceCode = sourceCode.replace(pattern, cannonicalId);
  }
  return sourceCode;
}
function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
}

// bazel-out/k8-fastbuild/bin/packages/localize/tools/src/migrate/index.mjs
function migrateFiles({ rootPath: rootPath2, translationFilePaths: translationFilePaths2, mappingFilePath, logger: logger2 }) {
  const fs2 = getFileSystem();
  const absoluteMappingPath = fs2.resolve(rootPath2, mappingFilePath);
  const mapping = JSON.parse(fs2.readFile(absoluteMappingPath));
  if (Object.keys(mapping).length === 0) {
    logger2.warn(`Mapping file at ${absoluteMappingPath} is empty. Either there are no messages that need to be migrated, or the extraction step failed to find them.`);
  } else {
    translationFilePaths2.forEach((path) => {
      const absolutePath = fs2.resolve(rootPath2, path);
      const sourceCode = fs2.readFile(absolutePath);
      fs2.writeFile(absolutePath, migrateFile(sourceCode, mapping));
    });
  }
}

// bazel-out/k8-fastbuild/bin/packages/localize/tools/src/migrate/cli.mjs
var args = process.argv.slice(2);
var options = yargs(args).option("r", {
  alias: "root",
  default: ".",
  describe: "The root path for other paths provided in these options.\nThis should either be absolute or relative to the current working directory.",
  type: "string"
}).option("f", {
  alias: "files",
  required: true,
  describe: "A glob pattern indicating what files to migrate. This should be relative to the root path",
  type: "string"
}).option("m", {
  alias: "mapFile",
  required: true,
  describe: "Path to the migration mapping file generated by `localize-extract`. This should be relative to the root path.",
  type: "string"
}).strict().help().parseSync();
var fs = new NodeJSFileSystem();
setFileSystem(fs);
var rootPath = options.r;
var translationFilePaths = glob.sync(options.f, { cwd: rootPath, nodir: true });
var logger = new ConsoleLogger(LogLevel.warn);
migrateFiles({ rootPath, translationFilePaths, mappingFilePath: options.m, logger });
process.exit(0);
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
//# sourceMappingURL=cli.js.map

import * as prettier from "prettier";
const fs = require("fs");
const path = require("path");

export function generateExports(
  buildFolder: string,
  exportFilename: string,
  exportFileExtension: string,
  ignoreFilenames: Array<string>,
  prettierConfig: prettier.Options,
) {
  const files: string[] = fs
    .readdirSync(buildFolder)
    .filter(
      (filename: string) =>
        filename.endsWith(exportFileExtension) && !ignoreFilenames.includes(filename),
    );
  const contractNames = files.map(file => file.replace(exportFileExtension, ""));
  let exportContent = "";
  contractNames.forEach(contractName => {
    exportContent = exportContent.concat(`import { ${contractName} } from "./${contractName}";\n`);
  });
  exportContent = exportContent.concat(`\nexport {\n  ${contractNames.join(",\n  ")}\n};`);
  const exportFilepath: string = path.join(buildFolder, exportFilename);
  fs.writeFileSync(exportFilepath, prettier.format(exportContent, prettierConfig));
}

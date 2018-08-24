"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prettier = require("prettier");
const fs = require("fs");
const path = require("path");
function generateExports(buildFolder, exportFilename, exportFileExtension, ignoreFilenames, prettierConfig) {
    const files = fs
        .readdirSync(buildFolder)
        .filter((filename) => filename.endsWith(exportFileExtension) && !ignoreFilenames.includes(filename));
    const contractNames = files.map(file => file.replace(exportFileExtension, ""));
    let exportContent = "import { TruffleContract } from './typechain-runtime';";
    contractNames.forEach(contractName => {
        exportContent = exportContent.concat(`import { ${contractName} } from "./${contractName}";\n`);
    });
    exportContent = exportContent.concat(`\nexport {\n  ${contractNames.concat("TruffleContract").join(",\n  ")}\n};`);
    const exportFilepath = path.join(buildFolder, exportFilename);
    fs.writeFileSync(exportFilepath, prettier.format(exportContent, prettierConfig));
}
exports.generateExports = generateExports;

import * as commandLineArgs from "command-line-args";

const DEFAULT_EXTENSION = ".ts";
const DEFAULT_GLOB_PATTERN = "**/*.abi";

export interface IOptions {
  glob: string;
  extension: string;
  force: boolean;
  outDir?: string;
  cwd?: string;
}

export function parseArgs(): IOptions {
  const optionDefinitions = [
    { name: "force", alias: "f", type: Boolean },
    { name: "glob", type: String, defaultOption: true },
    { name: "outDir", type: String },
    { name: "extension", type: String },
  ];

  const rawOptions = commandLineArgs(optionDefinitions);

  return {
    extension: rawOptions.extension || DEFAULT_EXTENSION,
    force: !!rawOptions.force,
    glob: rawOptions.glob || DEFAULT_GLOB_PATTERN,
    outDir: rawOptions.outDir,
  };
}

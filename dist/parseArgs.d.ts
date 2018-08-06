export interface IOptions {
    glob: string;
    force: boolean;
    outDir?: string;
    cwd?: string;
}
export declare function parseArgs(): IOptions;

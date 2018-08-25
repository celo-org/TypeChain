import { EvmType } from "./typeParser";
export interface AbiParameter {
    name: string;
    type: EvmType;
}
export interface ConstructorDeclaration {
    inputs: Array<AbiParameter>;
}
export interface FunctionDeclaration {
    name: string;
    inputs: Array<AbiParameter>;
    outputs: Array<EvmType>;
}
export interface Contract {
    constructor: ConstructorDeclaration;
    constantFunctions: Array<FunctionDeclaration>;
    functions: Array<FunctionDeclaration>;
}
export interface RawAbiParameter {
    name: string;
    type: string;
}
export interface RawAbiDefinition {
    name: string;
    constant: boolean;
    payable: boolean;
    inputs: RawAbiParameter[];
    outputs: RawAbiParameter[];
    type: string;
}
export declare function parse(abi: Array<RawAbiDefinition>): Contract;
export declare function extractAbi(rawJson: string): RawAbiDefinition[];

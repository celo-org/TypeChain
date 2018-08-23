import { EvmType } from "./typeParser";
export interface AbiParameter {
    name: string;
    type: EvmType;
}
export interface ConstructorDeclaration {
    inputs: Array<AbiParameter>;
}
export interface ConstantDeclaration {
    name: string;
    output: EvmType;
}
export interface ConstantFunctionDeclaration {
    name: string;
    inputs: Array<AbiParameter>;
    outputs: Array<EvmType>;
}
export interface FunctionDeclaration {
    name: string;
    inputs: Array<AbiParameter>;
    outputs: Array<EvmType>;
    payable: boolean;
}
export interface Contract {
    constructor: ConstructorDeclaration;
    constantFunctions: Array<ConstantFunctionDeclaration>;
    functions: Array<FunctionDeclaration>;
    events: Array<EventDeclaration>;
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
export interface EventDeclaration {
    name: string;
    inputs: EventArgDeclaration[];
}
export interface EventArgDeclaration {
    isIndexed: boolean;
    name: string;
    type: EvmType;
}
export interface RawEventAbiDefinition {
    type: "event";
    anonymous: boolean;
    name: string;
    inputs: RawEventArgAbiDefinition[];
}
export interface RawEventArgAbiDefinition {
    indexed: boolean;
    name: string;
    type: string;
}
export declare function parse(abi: Array<RawAbiDefinition>): Contract;
export declare function parseEvent(abiPiece: RawEventAbiDefinition): EventDeclaration;
export declare function extractAbi(rawJson: string): RawAbiDefinition[];
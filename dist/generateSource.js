"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abiParser_1 = require("./abiParser");
const utils_1 = require("./utils");
const typeParser_1 = require("./typeParser");
function generateSource(abi, context) {
    const parsedContractAbi = abiParser_1.parse(abi);
    return codeGenForContract(abi, parsedContractAbi, context);
}
exports.generateSource = generateSource;
// @todo better typings for web3
function codeGenForContract(abi, input, context) {
    const typeName = `${context.fileName}`;
    return `/* GENERATED BY TYPECHAIN VER. ${utils_1.getVersion()} */
/* tslint:disable */

// Types for view functions
${input.constantFunctions
        .map(constantFunction => {
        const functionHeader = `(${constantFunction.inputs
            .map(codeGenForParams)
            .join(", ")}): Promise<${codeGenForOutputTypeList(constantFunction.outputs)}>`;
        const functionType = `(${constantFunction.inputs
            .map(codeGenForParams)
            .join(", ")}) => Promise<${codeGenForOutputTypeList(constantFunction.outputs)}>`;
        return `interface ${constantFunction.name}Type {
        ${functionHeader};
        call: ${functionType};
      };`;
    })
        .join(";\n\n")}

// Types for functions
${input.functions
        .map(func => {
        const functionHeader = `(${func.inputs
            .map(codeGenForParams)
            .concat("options?: any")
            .join(", ")}): Promise<Transaction>`;
        const functionType = `(${func.inputs
            .map(codeGenForParams)
            .concat("options?: any")
            .join(", ")}) => Promise<${codeGenForOutputTypeList(func.outputs)}>`;
        return `interface ${func.name}Type {
      ${functionHeader};
      call: ${functionType};
    };`;
    })
        .join(";\n\n")}

export declare class ${typeName} {
    static new(options?: any): ${typeName}
    static at(address: string): ${typeName}
    static deployed(): ${typeName}
    static setProvider(provider: any): void
    address: string

    // View functions
    ${input.constantFunctions
        .map(constantFunction => `public ${constantFunction.name}: ${constantFunction.name}Type`)
        .join(";\n")}

    // Functions
    ${input.functions.map(func => `${func.name}: ${func.name}Type`).join(";\n")}
  }`;
}
function codeGenForParams(param, index) {
    return `${param.name || `arg${index}`}: ${param.type.generateCodeForInput()}`;
}
function codeGenForArgs(param, index) {
    const isArray = param.type instanceof typeParser_1.ArrayType;
    const paramName = param.name || `arg${index}`;
    return isArray ? `${paramName}.map(val => val.toString())` : `${paramName}.toString()`;
}
function codeGenForOutputTypeList(output) {
    if (output.length === 1) {
        return output[0].generateCodeForOutput();
    }
    else {
        return `[${output.map(x => x.generateCodeForOutput()).join(", ")}]`;
    }
}
function codeGenForEventArgs(args, onlyIndexed) {
    return `{${args
        .filter(arg => arg.isIndexed || !onlyIndexed)
        .map(arg => {
        const inputCodegen = arg.type.generateCodeForInput();
        // if we're specifying a filter, you can take a single value or an array of values to check for
        const argType = `${inputCodegen}${onlyIndexed ? ` | Array<${inputCodegen}>` : ""}`;
        return `${arg.name}${onlyIndexed ? "?" : ""}: ${argType}`;
    })
        .join(`, `)}}`;
}

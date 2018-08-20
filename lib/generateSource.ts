import { RawAbiDefinition, parse, Contract, AbiParameter, EventArgDeclaration } from "./abiParser";
import { getVersion } from "./utils";
import { EvmType, ArrayType } from "./typeParser";

export interface IContext {
  fileName: string;
  relativeRuntimePath: string;
}

export function generateSource(abi: Array<RawAbiDefinition>, context: IContext): string {
  const parsedContractAbi = parse(abi);

  return codeGenForContract(abi, parsedContractAbi, context);
}

// @todo better typings for web3
function codeGenForContract(abi: Array<RawAbiDefinition>, input: Contract, context: IContext) {
  const typeName = `${context.fileName}`;
  return `/* GENERATED BY TYPECHAIN VER. ${getVersion()} */
/* tslint:disable */
  
import { BigNumber } from "bignumber.js";

${input.constantFunctions
    .map(constantFunction => {
      const functionHeader: string = `(${constantFunction.inputs
        .map(codeGenForParams)
        .join(", ")}): Promise<${codeGenForOutputTypeList(constantFunction.outputs)}>`;
      const functionType: string = `(${constantFunction.inputs
        .map(codeGenForParams)
        .join(", ")}) => Promise<${codeGenForOutputTypeList(constantFunction.outputs)}>`;
      return `interface ${constantFunction.name}Type {
        ${functionHeader};
        call: ${functionType};
      };`;
    })
    .join(";\n")}

${input.constants
    .map(constant => {
      const functionHeader: string = `(): Promise<${constant.output.generateCodeForOutput()}>`;
      const functionType: string = `() => Promise<${constant.output.generateCodeForOutput()}>`;
      return `interface ${constant.name}Type {
         ${functionHeader};
         call: ${functionType};
       };`;
    })
    .join("\n")}

${input.functions
    .map(func => {
      const functionHeader: string = `(${func.inputs
        .map(codeGenForParams)
        .concat("options?: any")
        .join(", ")}): Promise<Transaction>`;
      const functionType: string = `(${func.inputs
        .map(codeGenForParams)
        .concat("options?: any")
        .join(", ")}) => Promise<${codeGenForOutputTypeList(func.outputs)}>`;
      return `interface ${func.name}Type {
      ${functionHeader};
      call: ${functionType};
    };`;
    })
    .join(";\n")}

declare class ${typeName} {
    static new(options: any): ${typeName}
    static setProvider(provider: any): void
    ${input.constants.map(constant => `${constant.name}: ${constant.name}Type`).join("\n")}
    ${input.constantFunctions
      .map(constantFunction => `public ${constantFunction.name}: ${constantFunction.name}Type`)
      .join(";\n")}
    ${input.functions.map(func => `${func.name}: ${func.name}Type`).join(";\n")}
  }`;
}

function codeGenForParams(param: AbiParameter, index: number): string {
  return `${param.name || `arg${index}`}: ${param.type.generateCodeForInput()}`;
}

function codeGenForArgs(param: AbiParameter, index: number): string {
  const isArray = param.type instanceof ArrayType;
  const paramName = param.name || `arg${index}`;
  return isArray ? `${paramName}.map(val => val.toString())` : `${paramName}.toString()`;
}

function codeGenForOutputTypeList(output: Array<EvmType>): string {
  if (output.length === 1) {
    return output[0].generateCodeForOutput();
  } else {
    return `[${output.map(x => x.generateCodeForOutput()).join(", ")}]`;
  }
}

function codeGenForEventArgs(args: EventArgDeclaration[], onlyIndexed: boolean) {
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

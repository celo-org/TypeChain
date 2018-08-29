import debug from "./debug";
import { EvmType, VoidType, parseEvmType } from "./typeParser";
import chalk from "chalk";
import { MalformedAbiError } from "./errors";
import { logger } from "./logger";

const { yellow } = chalk;

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
  outputs: Array<EvmType>; //we dont care about named returns for now
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

export function parse(abi: Array<RawAbiDefinition>): Contract {
  let constructor: ConstructorDeclaration = { inputs: [] };
  const constantFunctions: Array<FunctionDeclaration> = [];
  const functions: Array<FunctionDeclaration> = [];

  abi.forEach(abiPiece => {
    // @todo implement missing abi pieces
    if (abiPiece.type === "constructor") {
      constructor = parseConstructor(abiPiece);
      return;
    }
    // skip fallback functions
    if (abiPiece.type === "fallback") {
      return;
    }

    if (abiPiece.type === "function") {
      if (checkForOverloads(constantFunctions, functions, abiPiece.name)) {
        logger.log(yellow(`Detected overloaded constant function ${abiPiece.name} skipping...`));
        return;
      }

      if (abiPiece.constant) {
        constantFunctions.push(parseConstantFunction(abiPiece));
      } else {
        functions.push(parseFunctionDeclaration(abiPiece));
      }
      return;
    }

    // ignore events
    if (abiPiece.type === "event") {
      return;
    }

    throw new Error(`Unrecognized abi element: ${abiPiece.type}`);
  });

  return {
    constructor,
    constantFunctions,
    functions,
  };
}

function checkForOverloads(
  constantFunctions: Array<FunctionDeclaration>,
  functions: Array<FunctionDeclaration>,
  name: string,
) {
  return (
    constantFunctions.find(f => f.name === name) ||
    functions.find(f => f.name === name)
  );
}

function parseOutputs(outputs: Array<RawAbiParameter>): EvmType[] {
  if (outputs.length === 0) {
    return [new VoidType()];
  } else {
    return outputs.map(param => parseEvmType(param.type));
  }
}

function parseConstructor(abiPiece: RawAbiDefinition): ConstructorDeclaration {
  return {
    inputs: abiPiece.inputs.map(parseRawAbiParameter)
  }
}

function parseConstantFunction(abiPiece: RawAbiDefinition): FunctionDeclaration {
  debug(`Parsing constant function "${abiPiece.name}"`);
  return {
    name: abiPiece.name,
    inputs: abiPiece.inputs.map(parseRawAbiParameter),
    outputs: parseOutputs(abiPiece.outputs),
  };
}

function parseFunctionDeclaration(abiPiece: RawAbiDefinition): FunctionDeclaration {
  debug(`Parsing function declaration "${abiPiece.name}"`);
  return {
    name: abiPiece.name,
    inputs: abiPiece.inputs.map(parseRawAbiParameter),
    outputs: parseOutputs(abiPiece.outputs),
  };
}

function parseRawAbiParameter(rawAbiParameter: RawAbiParameter): AbiParameter {
  return {
    name: rawAbiParameter.name,
    type: parseEvmType(rawAbiParameter.type),
  };
}

export function extractAbi(rawJson: string): RawAbiDefinition[] {
  let json;
  try {
    json = JSON.parse(rawJson);
  } catch {
    throw new MalformedAbiError("Not a json");
  }

  if (!json) {
    throw new MalformedAbiError("Not a json");
  }

  if (Array.isArray(json)) {
    return json;
  }

  if (Array.isArray(json.abi)) {
    return json.abi;
  }

  throw new MalformedAbiError("Not a valid ABI");
}

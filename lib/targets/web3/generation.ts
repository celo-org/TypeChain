import {
  Contract,
  AbiParameter,
  ConstantFunctionDeclaration,
  FunctionDeclaration,
  ConstantDeclaration,
  EventDeclaration,
} from "../../parser/abiParser";
import {
  EvmType,
  IntegerType,
  UnsignedIntegerType,
  AddressType,
  VoidType,
  BytesType,
  BooleanType,
  ArrayType,
  StringType,
  TupleType,
} from "../../parser/typeParser";

export function codegen(contract: Contract) {
  const template = `
  import Contract, { CustomOptions, contractOptions } from "web3/eth/contract";
  import { TransactionObject, BlockType } from "web3/eth/types";
  import { Callback, EventLog } from "web3/types";
  import { EventEmitter } from "events";
  import { Provider } from "web3/providers";

  export class ${contract.name} extends Contract {
    constructor(
        jsonInterface: any[],
        address?: string,
        options?: CustomOptions
    );
    _address: string;
    options: contractOptions;
    methods: {
      ${contract.constantFunctions.map(generateFunction).join("\n")}
      ${contract.functions.map(generateFunction).join("\n")}
      ${contract.constants.map(generateConstants).join("\n")}
    };
    deploy(options: {
        data: string;
        arguments: any[];
    }): TransactionObject<Contract>;
    events: {
      ${contract.events.map(generateEvents).join("\n")}
      allEvents: (
          options?: {
              filter?: object;
              fromBlock?: BlockType;
              topics?: (null|string)[];
          },
          cb?: Callback<EventLog>
      ) => EventEmitter;
    };
    getPastEvents(
        event: string,
        options?: {
            filter?: object;
            fromBlock?: BlockType;
            toBlock?: BlockType;
            topics?: (null|string)[];
        },
        cb?: Callback<EventLog[]>
    ): Promise<EventLog[]>;
    setProvider(provider: Provider): void;
    clone(): ${contract.name};
}
  `;

  return template;
}

function generateFunction(fn: ConstantFunctionDeclaration | FunctionDeclaration): string {
  return `
  ${fn.name}(${generateInputTypes(fn.inputs)}): TransactionObject<${generateOutputTypes(
    fn.outputs,
  )}>;
`;
}

function generateConstants(fn: ConstantDeclaration): string {
  return `${fn.name}(): TransactionObject<${generateOutputType(fn.output)}>;`;
}

function generateInputTypes(input: Array<AbiParameter>): string {
  if (input.length === 0) {
    return "";
  }
  return (
    input
      .map((input, index) => `${input.name || `arg${index}`}: ${generateInputType(input.type)}`)
      .join(", ") + ", "
  );
}

function generateOutputTypes(outputs: Array<AbiParameter>): string {
  if (outputs.length === 1) {
    return generateOutputType(outputs[0].type);
  } else {
    return `{ 
      ${outputs.map(t => t.name && `${t.name}: ${generateOutputType(t.type)}, `).join("")}
      ${outputs.map((t, i) => `${i}: ${generateOutputType(t.type)}`).join(", ")}
      }`;
  }
}

function generateEvents(event: EventDeclaration) {
  return `
  ${event.name}(
    options?: {
        filter?: object;
        fromBlock?: BlockType;
        topics?: (null|string)[];
    },
    cb?: Callback<EventLog>): EventEmitter;
  `;
}

function generateInputType(evmType: EvmType): string {
  switch (evmType.constructor) {
    case IntegerType:
      return "number | string";
    case UnsignedIntegerType:
      return "number | string";
    case AddressType:
      return "string";
    case BytesType:
      return "string | number[]";
    case ArrayType:
      return `(${generateInputType((evmType as ArrayType).itemType)})[]`;
    case BooleanType:
      return "boolean";
    case StringType:
      return "string";
    case TupleType:
      return generateTupleType(evmType as TupleType, generateInputType);

    default:
      throw new Error(`Unrecognized type ${evmType}`);
  }
}

function generateOutputType(evmType: EvmType): string {
  switch (evmType.constructor) {
    case IntegerType:
      return "string";
    case UnsignedIntegerType:
      return "string";
    case AddressType:
      return "string";
    case VoidType:
      return "void";
    case BytesType:
      return "string";
    case ArrayType:
      return `(${generateOutputType((evmType as ArrayType).itemType)})[]`;
    case BooleanType:
      return "boolean";
    case StringType:
      return "string";
    case TupleType:
      return generateTupleType(evmType as TupleType, generateOutputType);

    default:
      throw new Error(`Unrecognized type ${evmType}`);
  }
}

function generateTupleType(tuple: TupleType, generator: (evmType: EvmType) => string) {
  return (
    "{" +
    tuple.components
      .map(component => `${component.name}: ${generator(component.type)}`)
      .join(", ") +
    "}"
  );
}

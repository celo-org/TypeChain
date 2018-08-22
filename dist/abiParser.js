"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("./debug");
const typeParser_1 = require("./typeParser");
const chalk_1 = require("chalk");
const errors_1 = require("./errors");
const logger_1 = require("./logger");
const { yellow } = chalk_1.default;
function parse(abi) {
    let constructor = { inputs: [] };
    const constantFunctions = [];
    const functions = [];
    const events = [];
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
                logger_1.logger.log(yellow(`Detected overloaded constant function ${abiPiece.name} skipping...`));
                return;
            }
            if (abiPiece.constant) {
                constantFunctions.push(parseConstantFunction(abiPiece));
            }
            else {
                functions.push(parseFunctionDeclaration(abiPiece));
            }
            return;
        }
        if (abiPiece.type === "event") {
            const eventAbi = abiPiece;
            if (eventAbi.anonymous) {
                logger_1.logger.log(yellow("Skipping anonymous event..."));
                return;
            }
            events.push(parseEvent(eventAbi));
            return;
        }
        throw new Error(`Unrecognized abi element: ${abiPiece.type}`);
    });
    return {
        constructor,
        constantFunctions,
        functions,
        events,
    };
}
exports.parse = parse;
function checkForOverloads(constantFunctions, functions, name) {
    return (constantFunctions.find(f => f.name === name) ||
        functions.find(f => f.name === name));
}
function parseOutputs(outputs) {
    if (outputs.length === 0) {
        return [new typeParser_1.VoidType()];
    }
    else {
        return outputs.map(param => typeParser_1.parseEvmType(param.type));
    }
}
function parseEvent(abiPiece) {
    debug_1.default(`Parsing event "${abiPiece.name}"`);
    return {
        name: abiPiece.name,
        inputs: abiPiece.inputs.map(parseRawEventArg),
    };
}
exports.parseEvent = parseEvent;
function parseRawEventArg(eventArg) {
    return {
        name: eventArg.name,
        isIndexed: eventArg.indexed,
        type: typeParser_1.parseEvmType(eventArg.type),
    };
}
function parseConstructor(abiPiece) {
    return {
        inputs: abiPiece.inputs.map(parseRawAbiParameter)
    };
}
function parseConstantFunction(abiPiece) {
    debug_1.default(`Parsing constant function "${abiPiece.name}"`);
    return {
        name: abiPiece.name,
        inputs: abiPiece.inputs.map(parseRawAbiParameter),
        outputs: parseOutputs(abiPiece.outputs),
    };
}
function parseFunctionDeclaration(abiPiece) {
    debug_1.default(`Parsing function declaration "${abiPiece.name}"`);
    return {
        name: abiPiece.name,
        inputs: abiPiece.inputs.map(parseRawAbiParameter),
        outputs: parseOutputs(abiPiece.outputs),
        payable: abiPiece.payable,
    };
}
function parseRawAbiParameter(rawAbiParameter) {
    return {
        name: rawAbiParameter.name,
        type: typeParser_1.parseEvmType(rawAbiParameter.type),
    };
}
function extractAbi(rawJson) {
    let json;
    try {
        json = JSON.parse(rawJson);
    }
    catch (_a) {
        throw new errors_1.MalformedAbiError("Not a json");
    }
    if (!json) {
        throw new errors_1.MalformedAbiError("Not a json");
    }
    if (Array.isArray(json)) {
        return json;
    }
    if (Array.isArray(json.abi)) {
        return json.abi;
    }
    throw new errors_1.MalformedAbiError("Not a valid ABI");
}
exports.extractAbi = extractAbi;

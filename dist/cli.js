#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const parseArgs_1 = require("./parseArgs");
const generateTypeChainWrappers_1 = require("./generateTypeChainWrappers");
const logger_1 = require("./logger");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        global.IS_CLI = true;
        const options = parseArgs_1.parseArgs();
        yield generateTypeChainWrappers_1.generateTypeChainWrappers(options);
    });
}
main().catch(e => {
    // tslint:disable-next-line
    logger_1.logger.error("Error occured: ", e.message);
    process.exit(1);
});

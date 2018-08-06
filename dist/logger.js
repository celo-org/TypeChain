"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const { red, yellow } = chalk_1.default;
class Logger {
    log(...args) {
        if (!global.IS_CLI) {
            return;
        }
        // tslint:disable-next-line
        console.log(...args);
    }
    warn(...args) {
        if (!global.IS_CLI) {
            return;
        }
        // tslint:disable-next-line
        console.warn(yellow(...args));
    }
    error(...args) {
        if (!global.IS_CLI) {
            return;
        }
        // tslint:disable-next-line
        console.error(red(...args));
    }
}
exports.Logger = Logger;
exports.logger = new Logger();

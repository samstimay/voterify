"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = exports.logger = void 0;
class Logger {
    debug(...args) {
        // @ts-ignore
        console.log.apply(console, Array.prototype.slice.call(args));
    }
    error(...args) {
        // @ts-ignore
        console.error.apply(console, Array.prototype.slice.call(args));
    }
    message(...args) {
        // @ts-ignore
        console.log.apply(console, Array.prototype.slice.call(args));
    }
    parseExpress(req, res) {
        return JSON.stringify({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            url: req.url,
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
        });
    }
}
const logger = new Logger();
exports.logger = logger;
class Errors {
    static trace() {
        this.showStack && console.trace();
    }
    static onCrash(res, error, msg) {
        console.log('\x1b[31m%s\x1b[0m', 'onCrash', error, msg);
        this.trace();
        return res.json({ status: 'crash', error: error });
    }
    static onCatch(res, error, msg) {
        console.log('\x1b[36m%s\x1b[0m', 'onCatch', error, msg);
        this.trace();
        if (res)
            return res.json({ status: 'fail', error: error });
        return '';
    }
    static authFailed(req, res) {
        return res.json({ status: 'auth-failed', error: req.url });
    }
    static notImplemented(res) {
        return res.json({ error: 'not implemented' });
    }
    static log(msg) {
        this.trace();
        console.log('Error: ', msg);
        return msg;
    }
}
exports.Errors = Errors;
Errors.showStack = true;
//# sourceMappingURL=log.js.map
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
            ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress
        });
    }
}
const logger = new Logger();
class Errors {
    static trace() {
        this.showStack && console.trace();
    }
    static onCrash(res, error, msg) {
        console.log("onCrash", error, msg);
        this.trace();
        return res.json({ status: "crash", error: error });
    }
    static onCatch(res, error, msg) {
        console.log("onCatch", error, msg);
        this.trace();
        if (res)
            return res.json({ status: "fail", error: error });
        return '';
    }
    static authFailed(req, res) {
        return res.json({ status: "auth-failed", error: req.url });
    }
    static notImplemented(res) {
        return res.json({ error: "not implemented" });
    }
    static log(msg) {
        this.trace();
        console.log("Error: ", msg);
    }
}
Errors.showStack = true;
export { logger, Errors };
//# sourceMappingURL=log.js.map
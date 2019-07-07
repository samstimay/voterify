import { Request, Response } from "express";

class Logger {
    debug(...args: string[]) {
        // @ts-ignore
        console.log.apply(console, Array.prototype.slice.call(args));
    }
    error(...args: string[]) {
        // @ts-ignore
        console.error.apply(console, Array.prototype.slice.call(args));
    }
    message(...args: string[]) {
        // @ts-ignore
        console.log.apply(console, Array.prototype.slice.call(args));
    }
    parseExpress(req: Request, res: Response) {
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

    public static showStack: Boolean = true;

    public static trace() {
        this.showStack && console.trace();
    }

    public static onCrash(res: Response, error: any, msg?: string) {
        console.log("onCrash", error, msg);
        this.trace();
        return res.json({ status: "crash", error: error });
    }
    public static onCatch(res?: Response, error?: any, msg?: string) {
        console.log("onCatch", error, msg);
        this.trace();
        if(res)
            return res.json({ status: "fail", error: error });
        return '';
    }
    public static authFailed(req: Request, res: Response) {
        return res.json({ status: "auth-failed", error: req.url });
    }
    public static notImplemented(res: Response) {
        return res.json({ error: "not implemented" });
    }
    public static log(msg: string) {
        this.trace();
        console.log("Error: ", msg)
    }
}

export { logger, Errors };

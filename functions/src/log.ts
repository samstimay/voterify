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
    public static onCrash(res: Response, error: any, msg?: string) {
        console.log("onCrash", error, msg);
        return res.json({ status: "crash", error: error });
    }
    public static onCatch(res: Response, error: any, msg?: string) {
        console.log("onCatch", error, msg);
        return res.json({ status: "fail", error: error });
    }
    public static authFailed(req: Request, res: Response) {
        return res.json({ status: "auth-failed", error: req.url });
    }
    public static notImplemented(res: Response) {
        return res.json({ error: "not implemented" });
    }
    public static generic(msg: string) {
        console.log("Error: ", msg)
    }
}

export { logger, Errors };

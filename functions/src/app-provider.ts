import { Application } from "express";
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");

class AppProvider {
    private expressApp: Application;
    constructor() {
        this.expressApp = express();
    }

    init() {
        this.expressApp.use(cors({ credentials: true, origin: true }));
        this.expressApp.use(bodyParser.json());

        // middleware
        this.expressApp.use(function(req: any, res: any, next: any) {
            if (!req.headers.authorization) {
                return res.status(403).json({ error: "No credentials sent!" });
            }
            next();
        });

        this.expressApp.get("/", function(req: any, res: any) {
            return res.json({ hi: "there" });
        });
    }

    app(): Application {
        return this.expressApp;
    }
}

export { AppProvider };

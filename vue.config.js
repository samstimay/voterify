var preConfig = require("./config/preConfig")

preConfig()

module.exports = {
    lintOnSave: process.env.NODE_ENV !== "production"
}

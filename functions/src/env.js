"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Env = void 0;
const settings = require('../settings.json');
console.log(settings);
class EnvironmentConfig {
    firebaseConfig() {
        return settings.firebase;
    }
}
const Env = new EnvironmentConfig();
exports.Env = Env;
//# sourceMappingURL=env.js.map
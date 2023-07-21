const settings = require("../settings.json");
console.log(settings);
class EnvironmentConfig {
    firebaseConfig() {
        return settings.firebase;
    }
}
const Env = new EnvironmentConfig();
export { Env };
//# sourceMappingURL=env.js.map
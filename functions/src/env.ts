const settings = require("../settings.json");
console.log(settings);

class EnvironmentConfig {
    public firebaseConfig(): object {
        return settings.firebase;
    }
}

const Env = new EnvironmentConfig();

export { Env };

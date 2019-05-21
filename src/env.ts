class EnvironmentConfig {
    public firebaseConfig() {
        return {
            apiKey: "AIzaSyA6PINilo0TTOspPfbh4_TiWMOvfQ7PhJQ",
            authDomain: "voterify-7637e.firebaseapp.com",
            databaseURL: "https://voterify-7637e.firebaseio.com",
            projectId: "voterify-7637e",
            storageBucket: "voterify-7637e.appspot.com",
            messagingSenderId: "245719463941"
        };
    }
}

const Env = new EnvironmentConfig();

export { Env };

class EnvironmentConfig {
    public firebaseConfig() {
        return {
            apiKey: "AIzaSyDd8iTyIgWi7VSsaLWrGY7cnF---YfWQ9k",
            authDomain: "voteryapp.firebaseapp.com",
            projectId: "voteryapp",
            storageBucket: "voteryapp.appspot.com",
            messagingSenderId: "441767404698",
            appId: "1:441767404698:web:16ce72c88ae89ceade2b23",
            measurementId: "G-SE5ENMFTMZ"
        }
    }
}

const Env = new EnvironmentConfig()

export { Env }

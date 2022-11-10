class EnvironmentConfig {
    public firebaseConfig() {
        return {
            apiKey: "AIzaSyDGdRlCdJ5FFLBTczMw5DXIFXSJ8nyt_EA",
            authDomain: "votery-2d68d.firebaseapp.com",
            projectId: "votery-2d68d",
            storageBucket: "votery-2d68d.appspot.com",
            messagingSenderId: "222816326380",
            appId: "1:222816326380:web:be489f2e738ed0d8050bc9",
            measurementId: "G-R54XLE88LS"
        }
    }
}

const Env = new EnvironmentConfig()

export { Env }

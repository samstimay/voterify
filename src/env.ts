class EnvironmentConfig {
    public firebaseConfig() {
        return {
            apiKey: 'AIzaSyCWFNeONYw-XgFdgg5ixZUdXy_0nw9EfXg',
            authDomain: 'votery-1bfb6.firebaseapp.com',
            databaseURL: 'https://votery-1bfb6.firebaseio.com',
            projectId: 'votery-1bfb6',
            storageBucket: 'votery-1bfb6.appspot.com',
            messagingSenderId: '1084565131396',
            appId: '1:1084565131396:web:7f7b08daaad409f4'
        }
    }
}

const Env = new EnvironmentConfig()

export { Env }

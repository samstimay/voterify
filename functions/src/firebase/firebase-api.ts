import firebase from './firebaseAdmin-provider'
import fb from 'firebase/compat/app'
import Database = fb.database.Database
import Firestore = fb.firestore.Firestore

class FirebaseApi {
    public async authToken(token: string) {
        return await firebase.auth().signInWithCustomToken(token)
    }

    public firestore(): Firestore {
        return firebase.firestore()
    }
    public database(): Database {
        return firebase.database()
    }
}

const firebaseApi = new FirebaseApi()

export { firebaseApi }

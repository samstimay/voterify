import firebase from './firebase-provider'
import ApplicationVerifier = firebase.auth.ApplicationVerifier
class FirebaseAuth {
    public phone(phoneNumber: string, appVerifier: ApplicationVerifier) {
        return firebase
            .auth()
            .signInWithPhoneNumber(phoneNumber, appVerifier)
            .then(function(confirmationResult) {
                ;(window as any).confirmationResult = confirmationResult
            })
    }

    public getAuthToken() {
        return firebase.auth().currentUser.getIdToken(true)
    }

    public isAuthorized(): boolean {
        return firebase.auth().currentUser != null
    }

    public get confirmation() {
        return (window as any).confirmationResult
    }

    public signOut() {
        return firebase.auth().signOut()
    }
}

const firebaseAuth = new FirebaseAuth()

export default firebaseAuth

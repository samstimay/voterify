import { getAuth, signInWithPhoneNumber  } from "firebase/auth";

class FirebaseAuth {
    public phone(phoneNumber, appVerifier) {
        const auth = getAuth()
        return signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then(function (confirmationResult) {
                ;(window as any).confirmationResult = confirmationResult
            })
    }

    public getAuthToken() {
        return getAuth().currentUser.getIdToken(true)
    }

    public isAuthorized(): boolean {
        return getAuth().currentUser != null
    }

    public get confirmation() {
        return (window as any).confirmationResult
    }

    public signOut() {
        return getAuth().signOut()
    }
}

const firebaseAuth = new FirebaseAuth()

export default firebaseAuth

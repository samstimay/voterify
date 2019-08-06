import firebase from "./firebaseAdmin-provider";
class FirebaseApi {
    async authToken(token) {
        return await firebase.auth().signInWithCustomToken(token);
    }
    firestore() {
        return firebase.firestore();
    }
    database() {
        return firebase.database();
    }
}
const firebaseApi = new FirebaseApi();
export { firebaseApi };
//# sourceMappingURL=firebase-api.js.map
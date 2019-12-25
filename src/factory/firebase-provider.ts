import firebase from 'firebase'
import { Env } from '../env'

// Initialize Firebase

firebase.initializeApp(Env.firebaseConfig())
firebase.auth().useDeviceLanguage()

export default firebase

import { Env } from '../env'
import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';

// Initialize Firebase

const app = initializeApp(Env.firebaseConfig())
const functions = getFunctions(app);

export default app

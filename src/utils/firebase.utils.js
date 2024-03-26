import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    
} from 'firebase/auth'
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    collection,
    writeBatch,
    query,
    getDocs
} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAdnKrFQhhf6DqLm1NmIYg6LxEdU2eaXC4",
    authDomain: "crwn-clothing-db-b7f60.firebaseapp.com",
    projectId: "crwn-clothing-db-b7f60",
    storageBucket: "crwn-clothing-db-b7f60.appspot.com",
    messagingSenderId: "1082532613013",
    appId: "1:1082532613013:web:6e2c2b63c2223376bb049c"
};

const firebaseApp = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
    prompt: "select_account"
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
export const db = getFirestore();

export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
    const collectionRef = collection(db, collectionKey)
    const batch = writeBatch(db);

    objectsToAdd.forEach((object) => {
        const docRef = doc(collectionRef, object.title.toLowerCase());
        batch.set(docRef, object)
    });

    await batch.commit();
    console.log('done')
}

export const getCategoriesAndDocuments = async () => {
    const collectionRef = collection(db, 'categories');
    const q = query(collectionRef);

    const querySnapshot = await getDocs(q);
    const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
        const {title, items} = docSnapshot.data();
        acc[title.toLowerCase()] = items;
        return acc;
    }, {});

    return categoryMap;
}

export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {
    const userDocRef = doc(db, 'users', userAuth.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();

        try {
            await setDoc(userDocRef, {
                displayName,
                email,
                createdAt,
                ...additionalInformation
            })
        } catch (error) {
            console.log('error creating the user', error.message)
        }

    }
    else { return userDocRef };
}

export const createAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;
    return await createUserWithEmailAndPassword(auth, email, password)
}
export const signInWithEmailAndPasswordMethod = async (email, password) => {
    if (!email || !password) return;
    return await signInWithEmailAndPassword(auth, email, password)
}

export const signOutUser = async () => await signOut(auth)

export const onAuthStateChangedListener = (callback) => {onAuthStateChanged(auth, callback)}
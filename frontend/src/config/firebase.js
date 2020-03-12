import firebase from "firebase";

const config = {
  apiKey: "AIzaSyCoN3nkJqy1rvUYDN4UJNYmme_1nQ6V178",
  authDomain: "wts1-76545.firebaseapp.com",
  databaseURL: "https://wts1-76545.firebaseio.com",
  projectId: "wts1-76545",
  storageBucket: "wts1-76545.appspot.com",
  messagingSenderId: "661454573597",
  appId: "1:661454573597:web:b56ca871beb498da"
};

const firebaseApp = firebase.initializeApp(config);

const fs = firebase.firestore;
const db = firebaseApp.firestore();
const firebaseAuth = firebaseApp.auth();

export { firebaseApp, fs, db, firebaseAuth };

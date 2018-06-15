// This import every services of firebase
// import firebase from "firebase";

// This import loads the firebase namespace along with all its type information.
import firebase from 'firebase/app';

// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/database';

let config = {
  apiKey: 'AIzaSyCmRVEMzNqPfUPQKiAPDbvZBUCJNjhkKMw',
  authDomain: 'fccrecipe-8d9ba.firebaseapp.com',
  databaseURL: 'https://fccrecipe-8d9ba.firebaseio.com',
  projectId: 'fccrecipe-8d9ba',
  storageBucket: 'fccrecipe-8d9ba.appspot.com',
  messagingSenderId: '240169389160'
};

firebase.initializeApp(config);
// Get a reference to the database service
let database = firebase.database(); //this doesnt have to be database only

export default database;

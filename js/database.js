var firebaseConfig = {
    apiKey: "AIzaSyCd1u5yfo5LWEYowHItmIi-ZtQsAKjsdgI",
    authDomain: "hotel-stella.firebaseapp.com",
    databaseURL: "https://hotel-stella-default-rtdb.firebaseio.com",
    projectId: "hotel-stella",
    storageBucket: "hotel-stella.appspot.com",
    messagingSenderId: "429414871961",
    appId: "1:429414871961:web:58a260d0bd39251acbd908"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

var database = firebase.database()

var objectRef = database.ref().child('object');
objectRef.on('value', snap => console.log(snap.val()))


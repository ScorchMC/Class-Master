// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyD0CokJpQFldX5p30nWx9PmsouWRlbsR4I",
    authDomain: "class-master-db1f5.firebaseapp.com",
    projectId: "class-master-db1f5",
    storageBucket: "class-master-db1f5.appspot.com",
    messagingSenderId: "1:220188454292:web:ed4e2bc8652d43316eb381",
    appId: "G-9DDDYTFZYB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Listen for auth state changes
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        fetchUserDetails(user);
        fetchUserProfilePicture(user);
    } else {
        // No user is signed in
        console.log("No user is signed in");
        // Redirect to signup page
        window.location.href = "signup.html";
    }
});

// Fetch user details
function fetchUserDetails(user) {
    var db = firebase.firestore();
    var docRef = db.collection("users").doc(user.uid);

    docRef.get().then(doc => {
        if (doc.exists) {
            document.getElementById("userName").textContent = doc.data().firstName + " " + doc.data().lastName;
        } else {
            console.log("No such document!");
        }
    }).catch(error => {
        console.log("Error getting document:", error);
    });
}

// Fetch user profile picture
function fetchUserProfilePicture(user) {
    var storageRef = firebase.storage().ref();
    var profilePicRef = storageRef.child('profile-pictures/' + user.uid);

    profilePicRef.getDownloadURL().then(url => {
        // Got the download URL, set it as the src of the img tag
        document.getElementById('userProfilePic').src = url;
    }).catch(error => {
        // Handle any errors
        console.error('Error getting profile picture URL:', error);
    });
}

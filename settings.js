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

  // Add this at the top of your settings.js file
window.addEventListener('load', function() {
  // Get the saved theme from localStorage
  var theme = localStorage.getItem('theme');

  // If there's a saved theme, apply it
  if (theme) {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(theme + '-theme');
  }
});

  document.getElementById("profile-settings-button").addEventListener("click", function() {
    document.getElementById("profile-settings").style.display = "block";
    document.getElementById("notification-settings").style.display = "none";
    document.getElementById("theme-settings").style.display = "none";
    document.getElementById("subscription-settings").style.display = "none";
  });

  document.getElementById("notification-settings-button").addEventListener("click", function() {
    document.getElementById("profile-settings").style.display = "none";
    document.getElementById("notification-settings").style.display = "block";
    document.getElementById("theme-settings").style.display = "none";
    document.getElementById("subscription-settings").style.display = "none";
  });

  document.getElementById("theme-settings-button").addEventListener("click", function() {
    document.getElementById("profile-settings").style.display = "none";
    document.getElementById("notification-settings").style.display = "none";
    document.getElementById("theme-settings").style.display = "block";
    document.getElementById("subscription-settings").style.display = "none";
  });

  document.getElementById("subscription-settings-button").addEventListener("click", function() {
    document.getElementById("profile-settings").style.display = "none";
    document.getElementById("notification-settings").style.display = "none";
    document.getElementById("theme-settings").style.display = "none";
    document.getElementById("subscription-settings").style.display = "block";
  });
  document.getElementById("change-password").addEventListener("click", function(event) {
  event.preventDefault();

  const user = firebase.auth().currentUser;
  const emailAddress = user.email;

  firebase.auth().sendPasswordResetEmail(emailAddress)
    .then(() => {
      // Password reset email sent!
      alert("Password reset email sent!");
    })
    .catch((error) => {
      // Handle password reset error here
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
    });
});
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var db = firebase.firestore();
    var docRef = db.collection("users").doc(user.uid);

    docRef.get().then((doc) => {
        if (doc.exists) {
            document.getElementById("firstname").value = doc.data().firstName;
            document.getElementById("lastname").value = doc.data().lastName;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

    if (user) {
      // User is signed in, get the profile picture
      var storageRef = firebase.storage().ref();
      var profilePicRef = storageRef.child('profile-pictures/' + user.uid);
  
      // Get the download URL
      profilePicRef.getDownloadURL().then((url) => {
        // Got the download URL, set it as the src of the img tag
        document.getElementById('userProfilePic').src = url;
      }).catch((error) => {
        // Handle any errors
        console.error('Error getting profile picture URL:', error);
      });
    } else {
      // No user is signed in, use the default profile picture
      document.getElementById('userProfilePic').src = 'business-man-profile-vector.jpg';
    }

  } document.getElementById("save-changes").addEventListener("click", function(event) {
  event.preventDefault();

  // Add this where you handle the "Save Changes" button click
document.getElementById('save-changes').addEventListener('click', function() {
  // Get the selected theme
  var theme = document.getElementById('theme').value;

  // Store the theme in localStorage
  localStorage.setItem('theme', theme);

  // Apply the new theme
  document.body.classList.remove('light-theme', 'dark-theme');
  document.body.classList.add(theme + '-theme');
});

  const user = firebase.auth().currentUser;
  if (user) {
    var db = firebase.firestore();
    var userRef = db.collection("users").doc(user.uid);

    // Get the form data
    var firstName = document.getElementById("firstname").value;
    var lastName = document.getElementById("lastname").value;
    var notifications = document.getElementById("notifications").checked;
    var theme = document.getElementById("theme").value;

    // Update the user's data
    userRef.update({
      firstName: firstName,
      lastName: lastName,
      notifications: notifications,
      theme: theme
    })
    .then(() => {
      console.log("User data updated!");
      // Redirect to the home screen
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Error updating user data:", error);
    });
  } else {
    console.log("No user is signed in.");
  }
});

  
});

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

var storage = firebase.storage();

document.getElementById("signup-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmpassword").value;
  const profilePicture = document.getElementById("profile-picture").files[0];

  // Check if all fields are filled out
  if (!firstname || !lastname || !email || !password || !confirmPassword || !profilePicture) {
    alert("Please fill out all fields");
    return;
  }

  // Check if first name and last name are not more than 15 characters
  if (firstname.length > 15 || lastname.length > 15) {
    alert("First name and last name should not exceed 15 characters");
    return;
  }

  // Check if profile picture size is not more than 5MB
  if (profilePicture.size > 5 * 1024 * 1024) {
    alert("Profile picture should not exceed 5MB");
    return;
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, password)
.then((userCredential) => {
  // Sign up successful.
  var user = userCredential.user;

  // Upload profile picture to Firebase Storage
  var uploadTask = storage.ref('profile-pictures/' + user.uid).put(profilePicture);

  uploadTask.on('state_changed', function(snapshot){
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
  }, function(error) {
    // Handle unsuccessful uploads
    console.error(error);
  }, function() {
    // Handle successful uploads on complete
    console.log('Profile picture uploaded successfully');
  });

  // Store user information in Firestore
  firebase.firestore().collection('users').doc(user.uid).set({
    firstName: firstname,
    lastName: lastname,
    email: email,
    // any other user information you want to store
  })
  .then(() => {
    // User information stored successfully!
    // You can add any actions you want to perform after the user information is stored
  })
  .catch((error) => {
    // Handle Firestore error here
    console.error('Error writing user data to Firestore:', error);
  });

  // Send email verification
  user.sendEmailVerification()
    .then(() => {
      // Email verification sent!
      // Inform the user
      alert("Please verify your email to be redirected to the home page");
      
      // Check email verification status every 10 seconds
      var checkEmailVerified = setInterval(function() {
        user.reload().then(() => {
          if (user.emailVerified) {
            // Email has been verified
            // Redirect to home page
            window.location.href = "index.html"; // replace with your home page URL
            clearInterval(checkEmailVerified);
          }
        });
      }, 1000);
    })
    .catch((error) => {
      // Handle email verification error here
      console.error('Error sending email verification:', error);
    });
})
.catch((error) => {
  // Handle sign up error here
  var errorCode = error.code;
  var errorMessage = error.message;
  
  alert(errorMessage);
});

});
document.addEventListener('DOMContentLoaded', (event) => {
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyD0CokJpQFldX5p30nWx9PmsouWRlbsR4I",
        authDomain: "class-master-db1f5.firebaseapp.com",
        projectId: "class-master-db1f5",
        storageBucket: "class-master-db1f5.appspot.com",
        messagingSenderId: "1:220188454292:web:ed4e2bc8652d43316eb381",
        appId: "G-9DDDYTFZYB"
    };
    $(document).ready(function() {
        $('#subject-selection').select2();
    });

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Initialize Cloud Functions
    const generateContent = firebase.functions().httpsCallable('generateContent');

    // Listen for auth state changes
    firebase.auth().onAuthStateChanged(user => {
        const logoutButton = document.getElementById('logout-button');
        const settingsButton = document.getElementById('settings-button');
        const userProfilePicListItem = document.getElementById('userProfilePicListItem');
        const userName = document.getElementById('userName');
        const createButton = document.querySelector('#create-button a');
        const pricingButton = document.getElementById('pricing-button');
        const markTestsButton = document.getElementById('mark-tests-button');

        if (user) {
            // User is signed in.
            // Hide the Sign-Up and Login buttons, show the Log Out button
            document.querySelector('.nav-link[href="signup.html"]').style.display = 'none';
            document.querySelector('.nav-link[href="login.html"]').style.display = 'none';
            pricingButton.style.display = 'none';
            settingsButton.style.display = 'block';
            logoutButton.style.display = 'block';
            markTestsButton.style.display = 'block';
            userProfilePicListItem.style.display = 'block';

            // Get user's first and last name
            const db = firebase.firestore();
            db.collection("users").doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    userName.textContent = doc.data().firstName + " " + doc.data().lastName;
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });

            // User is signed in, get the profile picture
            const storageRef = firebase.storage().ref();
            const profilePicRef = storageRef.child('profile-pictures/' + user.uid);

            // Get the download URL
            profilePicRef.getDownloadURL().then((url) => {
                // Got the download URL, set it as the src of the img tag
                document.getElementById('userProfilePic').src = url;
            }).catch((error) => {
                // Handle any errors
                console.error('Error getting profile picture URL:', error);
            });

            // Set the "Create" button to redirect to the create.html page
            createButton.onclick = function() {
                window.location.href = 'create.html';
            }
        } else {
            // No user is signed in.
            // Show the Sign-Up and Login buttons, hide the Log Out button
            document.querySelector('.nav-link[href="signup.html"]').style.display = 'block';
            document.querySelector('.nav-link[href="login.html"]').style.display = 'block';
            settingsButton.style.display = 'none';
            logoutButton.style.display = 'none';
            markTestsButton.style.display = 'none';
            userProfilePicListItem.style.display = 'none';

            // Set the "Create" button to redirect to the signup.html page
            createButton.onclick = function() {
                window.location.href = 'signup.html';
            }
        }
    });

    document.getElementById('logout-button').addEventListener('click', function(event) {
        event.preventDefault();
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            console.log('User signed out.');
        }).catch(function(error) {
            // An error happened.
            console.error('Error signing out:', error);
        });
    });
});


// Call the generateContent function when the button is clicked
console.log('About to add event listener to button');
document.getElementById('generate-content-button').addEventListener('click', function() {
    // Show the spinner
document.getElementById('loading-spinner').style.display = 'block';

const taskDuration = document.getElementById('task-duration').value;
const resourceType = document.getElementById('resource-selection').value;
const topic = document.getElementById('topic-field').value;
const subject = document.getElementById('subject-selection').value;
const curriculum = document.getElementById('curriculum-selection').value;
const book = document.getElementById('book-selection').value;
const chapters = document.getElementById('chapters-option').checked ? document.getElementById('chapter-field').value : null;
const pages = document.getElementById('pages-option').checked ? document.getElementById('page-field-start').value + '-' + document.getElementById('page-field-end').value : null;
const yearLevel = document.getElementById('year-group-selection').value;
const additionalComments = document.getElementById('additional-comments').value;

const data = {
    taskDuration: taskDuration,
    resourceType: resourceType,
    topic: topic,
    subject: subject,
    curriculum: curriculum,
    book: book,
    chapters: chapters,
    pages: pages,
    yearLevel: yearLevel,
    additionalComments: additionalComments,
};

console.log('Sending data:', data); // Add this line
console.log('About to call generateContent with data:', data);

generateContent(data)
.then(result => {
    // Hide the spinner
document.getElementById('loading-spinner').style.display = 'none';

    // Check if the response contains the expected properties
if (result && result.data && result.data.content) {
    const content = result.data.content;
    const images = result.data.images;
    const resourceDisplay = document.getElementById('resource-display');

    // Clear the resource display
resourceDisplay.innerHTML = '';

    // Create a text node for the text content and append it to the resource display
const textNode = document.createTextNode(content);
resourceDisplay.appendChild(textNode);

if (Array.isArray(images)) {
    images.forEach(imageUrl => {
        if (typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.style.width = '100%';
            resourceDisplay.appendChild(imgElement);
        }
    });
}
} else {
    console.error('Unexpected response from server:', result);
}
})
.catch(error => {
    // Hide the spinner
document.getElementById('loading-spinner').style.display = 'none';

console.error('Error generating content:', error);
});
});

function searchByISBN(isbn) {
var openLibraryUrl = "https://openlibrary.org/api/books?bibkeys=ISBN:" + isbn + "&format=json&jscmd=data";
var googleBooksUrl = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;

var openLibraryRequest = fetch(openLibraryUrl)
.then(response => response.json())
.then(data => {
    var bookKey = "ISBN:" + isbn;
    if (data[bookKey]) {
        var book = data[bookKey];
        return {
            id: isbn,
            text: book.title + " by " + (book.authors ? book.authors[0].name : "Unknown")
        };
    } else {
        return null;
    }
});

var googleBooksRequest = fetch(googleBooksUrl)
.then(response => response.json())
.then(data => {
    if (data.totalItems > 0) {
        var book = data.items[0].volumeInfo;
        return {
            id: isbn,
            text: book.title + " by " + (book.authors ? book.authors[0] : "Unknown")
        };
    } else {
        return null;
    }
});

return Promise.all([openLibraryRequest, googleBooksRequest])
.then(results => results.filter(result => result !== null))
.catch(error => {
    console.error("Error:", error);
    return [];
});
}

$(document).ready(function() {
var $bookSelection = $('#book-selection');

$bookSelection.select2({
    minimumInputLength: 10,
    placeholder: "Type the ISBN of the book",
    ajax: {
        delay: 250,
        transport: function(params, success, failure) {
            searchByISBN(params.data.term)
                .then(books => {
                    var results = books;
                    // Always include the user's input as a selectable option
results.push({
                        id: params.data.term,
                        text: params.data.term
                    });
                    success({ results: results });
                })
                .catch(error => {
                    failure(error);
                });
        }
    }
});
});
function initCreatePage() {
    // Initialize Select2 plugin
    $('#subject-selection').select2();
    var $bookSelection = $('#book-selection');
    $bookSelection.select2({
        minimumInputLength: 10,
        placeholder: "Type the ISBN of the book",
        ajax: {
            delay: 250,
            transport: function(params, success, failure) {
                searchByISBN(params.data.term)
                    .then(books => {
                        var results = books;
                        // Always include the user's input as a selectable option
                        results.push({
                            id: params.data.term,
                            text: params.data.term
                        });
                        success({ results: results });
                    })
                    .catch(error => {
                        failure(error);
                    });
            }
        }
    });
}

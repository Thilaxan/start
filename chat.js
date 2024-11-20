var firebaseConfig = {
  apiKey: "AIzaSyCR_wZAVK7Z6xFg7FyB6-NRravQczyEm-k",
  authDomain: "abcd-d6b82.firebaseapp.com",
  databaseURL: "https://abcd-d6b82-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "abcd-d6b82",
  storageBucket: "abcd-d6b82.firebasestorage.app",
  messagingSenderId: "781068846223",
  appId: "1:781068846223:web:087e3595872da34d315cfa",
  measurementId: "G-W3GDC5B7XS"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const auth = firebase.auth();

// Check if user is logged in
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location = "index.html"; // Redirect to login if not logged in
  }
});

// Logout
document.getElementById("logout").addEventListener("click", () => {
  auth.signOut().then(() => {
    window.location = "index.html";
  });
});

// Send Message
function sendMessage(e) {
  e.preventDefault();
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;

  if (message.trim() === "") return;

  messageInput.value = "";

  const timestamp = Date.now();
  db.ref("messages/" + timestamp).set({
    username: auth.currentUser.displayName,
    message: message,
    timestamp: timestamp
  });
}

document.getElementById("message-form").addEventListener("submit", sendMessage);

// Fetch Messages
const fetchChat = db.ref("messages/");
fetchChat.on("child_added", snapshot => {
  const messages = snapshot.val();
  const isCurrentUser = messages.username === auth.currentUser.displayName;

  const message = `
    <li class="${isCurrentUser ? "sent" : "receive"}">
      <span>${messages.username}: </span>${messages.message}
    </li>
  `;
  document.getElementById("messages").innerHTML += message;
});

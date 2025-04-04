// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyCqc5VUuX0P67Cp0wISnpLz37hbPnp41I0",
    authDomain: "counselling-project-4acc0.firebaseapp.com",
    projectId: "counselling-project-4acc0",
    storageBucket: "counselling-project-4acc0.firebaseapp.com",
    messagingSenderId: "780148150029",
    appId: "1:780148150029:web:169fd60e538377b05e6a44"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// WebSocket Connection
const socket = io("http://127.0.0.1:5000");

//user login
//const login=()=>{console.log("successful")}
async function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    try {
        let response = await fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        let resultText = await response.text();
        console.log("Raw response:", resultText); // Debugging step

        let result;
        try {
            result = JSON.parse(resultText);
        } catch (error) {
            console.error("JSON parsing error:", error);
            alert("❌ Server returned an invalid response.");
            return;
        }

        console.log("Parsed response:", result);

        if (response.ok) {
            // Only store token and username if login is successful
            if (result.token) {
                localStorage.setItem("token", result.token);
                localStorage.setItem("username", result.username);
                alert("✅ Login successful! Welcome " + result.username);
                window.location.href = "/dashboard"; // Redirect to home/dashboard
            } else {
                alert("❌ Unexpected error: Token not found.");
            }
        } else {
            alert("❌ " + (result.error || "Login failed."));
        }
    } catch (error) {
        console.error("Request error:", error);
        alert("❌ Request failed: " + error);
    }
}

// // Handle user login
// function login(event) {
//     event.preventDefault();

//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     // Dummy check for login (In a real app, you would make an API call here)
//     if (email === "test@example.com" && password === "password123") {
//         // Save user data to localStorage
//         localStorage.setItem("username", email);
//         // Redirect to the dashboard
//         window.location.href = "/dashboard"; // Change to the correct dashboard route
//     } else {
//         alert("Invalid credentials, please try again.");
//     }
// }

// Register User
async function register() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let username = document.getElementById("username").value;

    try {
        let response = await fetch("http://127.0.0.1:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, username })
        });

        let result = await response.json();
        alert(response.ok ? "✅ " + result.message : "❌ " + result.error);
        // window.location.href = "/login_page"; // Redirect to home/dashboard

    } catch (error) {
        alert("❌ Request failed: " + error);
    }
}



// // Handle user registration
// function register(event) {
//     event.preventDefault();

//     const username = document.getElementById('username').value;
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     // Dummy registration logic (In a real app, you would make an API call here)
//     if (username && email && password) {
//         alert("Registration successful. You can now log in.");
//         window.location.href = "/login"; // Redirect to the login page after successful registration
//     } else {
//         alert("Please fill in all fields.");
//     }
// }

// Handle password reset
function resetPassword(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;

    // Dummy password reset (In a real app, you would make an API call here)
    if (email) {
        alert(`Password reset link sent to ${email}.`);
        window.location.href = "/login"; // Redirect to the login page after password reset
    } else {
        alert("Please enter your email address.");
    }
}

// window.onload = function () {
//     let token = localStorage.getItem("token");
//     if (!token) {
//         localStorage.removeItem("username"); // Clear incorrect session
//     }
// };

// Handle user logout
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username"); 
    window.location.href = "/login"; // Redirect to login
}































// AI Chatbot Interaction
function sendMessage() {
    let userInput = document.getElementById("chatInput").value;

    fetch("http://127.0.0.1:5000/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("chatResponse").innerText = data.response || "Error: " + data.error;
    })
    .catch(error => console.error("Error:", error));
}

// WebSocket Chatroom
function sendChat() {
    let message = document.getElementById("messageInput").value;
    socket.emit("message", { message });
}

socket.on("response", data => {
    let chatMessages = document.getElementById("chatMessages");
    let newMessage = document.createElement("p");
    newMessage.textContent = data.message;
    chatMessages.appendChild(newMessage);
});

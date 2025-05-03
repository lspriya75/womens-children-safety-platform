from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
# from flask_jwt_extended import create_access_token, jwt_required, JWTManager
import firebase_admin
from firebase_admin import credentials, auth, firestore
import os
from dotenv import load_dotenv
import requests
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
import secrets
import csv
import random
import pandas as pd
import ssl

# Load environment variables
load_dotenv()

# Get Google Maps API key from environment variables
GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')
print(f"Loaded Google Maps API key (first 10 chars): {GOOGLE_MAPS_API_KEY[:10] if GOOGLE_MAPS_API_KEY else 'None'}")

# Configure SSL context
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

class User(UserMixin):
    def __init__(self, uid, email, username):
        self.id = uid
        self.email = email
        self.username = username

# Initialize Flask app
app = Flask(__name__, template_folder="templates")
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', secrets.token_hex(32))
CORS(app)

# Initialize SocketIO without eventlet
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading', logger=True, engineio_logger=True)

# Initialize Firebase
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Initialize Login Manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login_page'

# User loader callback
@login_manager.user_loader
def load_user(user_id):
    try:
        # Get user document from Firestore
        user_doc = db.collection("users").document(user_id).get()
        if user_doc.exists:
            user_data = user_doc.to_dict()
            return User(
                uid=user_id,
                email=user_data.get('email'),
                username=user_data.get('username')
            )
    except Exception as e:
        print(f"Error loading user: {e}")
    return None

# Initialize Mistral AI
client = MistralClient(api_key=os.getenv('MISTRAL_API_KEY'))

@app.route("/")
def home():
    return render_template("homepage.html")

@app.route("/dashboard")
@login_required
def dashboard():
    return render_template("test-dashboard.html", username=current_user.username)

@app.route("/counseling_platform")
@login_required
def counseling_platform():
    return render_template("counseling_platform.html")

@app.route("/safety_tips")
@login_required
def safety_tips():
    return render_template("safety_tips.html", username=current_user.username)

@app.route("/games")
@login_required
def games():
    return render_template("games.html")

@app.route("/login_page")
def login_page():
    return render_template("login_page.html")

@app.route("/register_page")
def register_page():
    return render_template("register_page.html")

@app.route('/forgot_password')
def forgot_password():
    return render_template('forgot_password.html')

# User Registration
@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.json
        if not data or "email" not in data or "password" not in data or "username" not in data:
            return jsonify({"error": "Email, password, and username are required"}), 400
            
        email = data["email"]
        password = data["password"]
        username = data["username"]
        
        # Validate input
        if len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters long"}), 400
            
        if not email or '@' not in email:
            return jsonify({"error": "Please provide a valid email address"}), 400
            
        if not username or len(username) < 3:
            return jsonify({"error": "Username must be at least 3 characters long"}), 400
        
        # Create user in Firebase
        try:
            user = auth.create_user(
                email=email, 
                password=password, 
                display_name=username
            )
            
            # Store user data in Firestore
            db.collection("users").document(user.uid).set({
                "email": email,
                "username": username,
                "role": "user",
                "created_at": firestore.SERVER_TIMESTAMP
            })
            
            # Set session variables
            session["username"] = username
            
            return jsonify({
                "message": "User registered successfully",
                "username": username
            }), 201
        except Exception as e:
            error_message = str(e)
            if "EMAIL_EXISTS" in error_message:
                return jsonify({"error": "This email is already registered"}), 409
            else:
                return jsonify({"error": f"Registration failed: {error_message}"}), 400
                
    except Exception as e:
        print("Registration error:", str(e))  # Debugging
        return jsonify({"error": "Internal server error: " + str(e)}), 500

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        if not data or "email" not in data or "password" not in data:
            return jsonify({"error": "Email and password are required"}), 400
            
        email = data["email"]
        password = data["password"]

        # Firebase Authentication REST API endpoint
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={os.getenv('FIREBASE_WEB_API_KEY')}"
        payload = {
            "email": email,
            "password": password,
            "returnSecureToken": True
        }
        headers = {
            "Content-Type": "application/json"
        }

        response = requests.post(url, json=payload, headers=headers, verify=False)
        firebase_response = response.json()
        
        print("Firebase Response:", firebase_response)  # Debugging Line

        if "idToken" not in firebase_response:
            error_message = firebase_response.get("error", {}).get("message", "Invalid credentials")
            return jsonify({"error": error_message}), 401

        # Get user information
        token = firebase_response["idToken"]
        user_id = firebase_response.get("localId")
        
        # Get user details from Firestore
        user_doc = db.collection("users").document(user_id).get()
        
        if user_doc.exists:
            user_data = user_doc.to_dict()
            username = user_data.get("username", email.split('@')[0])
        else:
            username = email.split('@')[0]

        # Create User object and log in
        user = User(uid=user_id, email=email, username=username)
        login_user(user)
        
        # Store in session
        session["username"] = username
        session["token"] = token
        session.modified = True

        return jsonify({
            "message": "Login successful", 
            "token": token, 
            "username": username
        })
    except Exception as e:
        print("Login error:", str(e))  # Debugging
        return jsonify({"error": "Internal server error: " + str(e)}), 500

# # Load responses from CSV
# def load_responses():
#     responses = {}
#     with open("responses.csv", "r", encoding="utf-8") as file:
#         reader = csv.DictReader(file)
#         for row in reader:
#             keyword = row["Keyword(s)"].lower()
#             responses[keyword] = {
#                 "response": row["Response"],
#                 "follow_up": row["Follow-up Question"]
#             }
#     return responses

# responses_data = load_responses()
# conversation_history = {}  # Stores past messages for each user


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))

# Load responses from CSV
def load_responses():

    

    responses = {}
    with open("responses.csv", newline="", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            keywords = row["Keyword(s)"].split(",")  # Support multiple keywords
            for keyword in keywords:
                responses[keyword.strip().lower()] = row["Response"]
    return responses

    
responses_dict = load_responses()

def load_resp():
    try:
        df = pd.read_csv("safety_tips.csv")
        tips = df["Response"].dropna().tolist()  # Remove empty values
        if not tips:
            tips = ["No safety tips available at the moment."]
        return tips
    except Exception as e:
        print(f"Error loading safety tips: {e}")
        return ["Error loading safety tips. Please try again later."]

safety_responses = load_resp()



# @app.route("/chatbot", methods=["POST"])
# def chatbot():
#     data = request.get_json()
#     user_id = data.get("user_id", "default")  # Track users (if multi-user support is needed)
#     user_input = data.get("message", "").lower()

#     if user_id not in conversation_history:
#         conversation_history[user_id] = []

#     response_text = "I'm not sure how to respond to that. Can you tell me more?"
#     follow_up_text = None

#     # Match user input with keywords
#     for keyword, details in responses_data.items():
#         if keyword in user_input:
#             response_text = details["response"]
#             follow_up_text = details["follow_up"]
#             break

#     # Store user message and bot response in history
#     conversation_history[user_id].append({"user": user_input, "bot": response_text})

#     # Return response + follow-up question (for interactive chat)
#     return jsonify({
#         "response": response_text,
#         "follow_up": follow_up_text if follow_up_text else ""
#     })



@app.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.json
    user_message = data.get("message", "").lower()

    # Find matching response
    for keyword in responses_dict:
        if keyword in user_message:
            return jsonify({"response": responses_dict[keyword]})

    return jsonify({"response": "I'm here to listen. Can you tell me more?"})


@app.route("/get_safety_tip", methods=["GET"])
@login_required
def get_safety_tip():
    if safety_responses:
        return jsonify({"response": random.choice(safety_responses)})
    return jsonify({"response": "No safety tips available."})



# # Chatbot API using Mistral AI
# @app.route("/chatbot", methods=["POST"])
# def chatbot():
#     try:
#         data = request.get_json()
#         if not data or "message" not in data:
#             return jsonify({"error": "Invalid request. 'message' field is required."}), 400

#         user_message = data["message"].strip()
#         if not user_message:
#             return jsonify({"error": "Message cannot be empty."}), 400

#         messages = [ChatMessage(role="user", content=user_message)]
#         response = client.chat(model="mistral-tiny", messages=messages)

#         if response and response.choices:
#             single_response = response.choices[0].message.content
#         else:
#             single_response = "No response received."

#         return jsonify({"response": single_response})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

@socketio.on("message")
def handle_message(data):
    emit("response", {"message": data["message"]}, broadcast=True)

@app.route('/safety-map')
@login_required
def safety_map():
    return render_template('safety_map.html')

@app.route('/get_locations')
def get_locations():
    # In a real application, this would fetch from a database
    locations = [
        {
            "id": 1,
            "name": "Avaniyapuram Police Station",
            "type": "police",
            "address": "Avaniyapuram, Madurai, Tamil Nadu 625012",
            "phone": "0452-2456789",
            "coordinates": [9.9177, 78.1197]
        },
        # Add more locations here
    ]
    return jsonify(locations)

@app.route("/emergency_map")
@login_required
def emergency_map():
    if not GOOGLE_MAPS_API_KEY:
        print("Error: Google Maps API key is missing!")
        return "Error: Google Maps API key is not configured. Please check your .env file.", 500
    print(f"Rendering emergency map with API key: {GOOGLE_MAPS_API_KEY[:10]}...")
    return render_template("emergency_map.html", 
                         username=current_user.username,
                         google_maps_api_key=GOOGLE_MAPS_API_KEY)

if __name__ == "__main__":
    socketio.run(app, debug=True, use_reloader=False, host='0.0.0.0', port=5001)
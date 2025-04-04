from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_cors import CORS
from flask_socketio import SocketIO, emit
# from flask_jwt_extended import create_access_token, jwt_required, JWTManager
import firebase_admin
from firebase_admin import credentials, auth, firestore
import os, requests
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
import secrets
import csv
import random
import pandas as pd

FIREBASE_WEB_API_KEY = "AIzaSyCqc5VUuX0P67Cp0wISnpLz37hbPnp41I0"

# Initialize Flask app
app = Flask(__name__, template_folder="templates")
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize Firebase
cred = credentials.Certificate("serviceAccountKey.json")  # Replace with your Firebase credentials
firebase_admin.initialize_app(cred)
db = firestore.client()

app.config["SECRET_KEY"] = secrets.token_hex(32)
# app.config["JWT_SECRET_KEY"] = "d8fc7a68612e7266c79174d0d6d3095976d687100be054d3dcc4a777d4ba4450"
# jwt = JWTManager(app)

# Initialize Mistral AI
MISTRAL_API_KEY = "VHUs9iQAEX5Zo5AAHf4tfAS4bDiehPrU"  # Replace with your actual API key
client = MistralClient(api_key=MISTRAL_API_KEY)

@app.route("/")
def homepage():
    return render_template("homepage.html")


@app.route("/dashboard")
def dashboard():
    if "username" in session:
        return render_template("test-dashboard.html", username=session["username"])
    return redirect(url_for("login_page"))

@app.route("/counseling_platform")
def counseling_platform():
    if "username" in session:
        return render_template("counseling_platform.html", username=session["username"])
    return redirect(url_for("login_page"))

@app.route("/safety_tips")
def safety_tips():
    if "username" in session:
        return render_template("safety_tips.html", username=session["username"])
    return redirect(url_for("login_page"))

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
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_WEB_API_KEY}"
        payload = {
            "email": email,
            "password": password,
            "returnSecureToken": True
        }
        headers = {
            "Content-Type": "application/json"
        }

        response = requests.post(url, json=payload, headers=headers)
        firebase_response = response.json()
        
        print("Firebase Response:", firebase_response)  # Debugging Line

        if "idToken" not in firebase_response:
            error_message = firebase_response.get("error", {}).get("message", "Invalid credentials")
            return jsonify({"error": error_message}), 401

        # Get user information
        token = firebase_response["idToken"]
        
        # Get user details from Firestore
        user_id = firebase_response.get("localId")
        user_doc = db.collection("users").document(user_id).get()
        
        if user_doc.exists:
            user_data = user_doc.to_dict()
            username = user_data.get("username", email.split('@')[0])
        else:
            # Fallback if user document doesn't exist
            username = email.split('@')[0]

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
def logout():
    # Clear the session
    session.clear()
    return redirect(url_for("homepage"))

@app.route("/games")
def games():
    if "username" in session:
        return render_template("games.html", username=session["username"])
    return redirect(url_for("login_page"))

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
    df = pd.read_csv("safety_tips.csv")
    return df["Response"].dropna().tolist()  # Remove empty values

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

if __name__ == "__main__":
    socketio.run(app, debug=True, use_reloader=False)
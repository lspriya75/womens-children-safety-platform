class SupportChatbot {
    constructor() {
        this.responses = {
            greetings: [
                "Hello! How can I help you today?",
                "Hi there! I'm here to support you. What's on your mind?",
                "Welcome! I'm your supportive chat companion. How are you feeling?"
            ],
            stress: [
                "I understand you're feeling stressed. Would you like to try a breathing exercise?",
                "Stress can be overwhelming. Let's work through this together. What's causing your stress?",
                "I'm here to help you manage your stress. Would you like to try some relaxation techniques?"
            ],
            anxiety: [
                "Anxiety can be difficult to deal with. Would you like to try a grounding exercise?",
                "I hear your anxiety. Let's try to calm your mind together. What helps you feel more grounded?",
                "You're not alone in feeling anxious. Would you like to try some calming techniques?"
            ],
            fear: [
                "I'm here with you, and you're safe. Would you like to talk about what's making you feel scared?",
                "Your safety is important. Are you in a safe place right now?",
                "It's okay to feel afraid. Would you like to talk about it or would you prefer some safety tips?"
            ],
            default: [
                "I'm here to listen. Would you like to tell me more?",
                "How can I best support you right now?",
                "I'm here for you. What would be most helpful?"
            ]
        };
    }

    generateResponse(userInput) {
        const input = userInput.toLowerCase();
        
        if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
            return this.getRandomResponse(this.responses.greetings);
        }
        
        if (input.includes('stress') || input.includes('overwhelm') || input.includes('pressure')) {
            return this.getRandomResponse(this.responses.stress);
        }
        
        if (input.includes('anxious') || input.includes('nervous') || input.includes('worry')) {
            return this.getRandomResponse(this.responses.anxiety);
        }
        
        if (input.includes('scared') || input.includes('afraid') || input.includes('fear')) {
            return this.getRandomResponse(this.responses.fear);
        }
        
        return this.getRandomResponse(this.responses.default);
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Initialize chatbot and handle messages
const chatbot = new SupportChatbot();

function initializeChat() {
    const chatbox = document.getElementById('chatbox');
    const initialMessage = chatbot.generateResponse('hello');
    appendMessage('bot', initialMessage);
}

function handleUserInput(event) {
    event.preventDefault();
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    appendMessage('user', message);
    userInput.value = '';
    
    setTimeout(() => {
        const response = chatbot.generateResponse(message);
        appendMessage('bot', response);
    }, 500);
}

function appendMessage(sender, message) {
    const chatbox = document.getElementById('chatbox');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

function openSupportChat() {
    document.querySelector('.games-grid').style.display = 'none';
    document.getElementById('chat-container').style.display = 'flex';
    initializeChat();
}

function closeSupportChat() {
    document.querySelector('.games-grid').style.display = 'grid';
    document.getElementById('chat-container').style.display = 'none';
}
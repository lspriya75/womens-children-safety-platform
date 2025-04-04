class CounselingBot {
    constructor() {
        this.currentTopic = 'general';
        this.isProcessing = false;
        this.responses = {
            emergency: {
                keywords: ['emergency', 'help', 'danger', 'unsafe', 'scared', 'threat'],
                responses: [
                    {
                        text: "I understand you're in a difficult situation. Here are some immediate steps you can take:",
                        options: [
                            "Call emergency services (911) immediately if you're in immediate danger",
                            "Contact the National Domestic Violence Hotline: 1-800-799-SAFE",
                            "Find a safe location away from the threat",
                            "Would you like me to provide more specific safety resources?"
                        ]
                    }
                ]
            },
            mental: {
                keywords: ['anxious', 'depressed', 'sad', 'worried', 'stress', 'overwhelmed'],
                responses: [
                    {
                        text: "I hear that you're going through a difficult time. Let's work through this together:",
                        options: [
                            "Would you like to try a calming breathing exercise?",
                            "Should we discuss some stress management techniques?",
                            "Would you like to talk about what's troubling you?",
                            "I can connect you with professional mental health resources"
                        ]
                    }
                ]
            },
            safety: {
                keywords: ['safety', 'plan', 'protect', 'secure', 'prevention'],
                responses: [
                    {
                        text: "Your safety is the top priority. Here are some safety planning steps:",
                        options: [
                            "Create an emergency contact list",
                            "Prepare an emergency escape bag",
                            "Learn about safe locations in your area",
                            "Would you like a detailed safety planning guide?"
                        ]
                    }
                ]
            },
            resources: {
                keywords: ['resources', 'information', 'help', 'support', 'services'],
                responses: [
                    {
                        text: "I can help you find the resources you need. Here are some options:",
                        options: [
                            "Local women's shelters and safe houses",
                            "Legal aid services and advocacy groups",
                            "Counseling and support groups",
                            "Would you like specific contact information for any of these?"
                        ]
                    }
                ]
            }
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Topic selection
        document.querySelectorAll('.topic-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.setTopic(button.dataset.topic);
            });
        });

        // Quick reply buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.quick-replies button')) {
                const text = e.target.textContent;
                this.handleUserInput(text);
            }
        });

        // Send message button
        document.querySelector('.send-btn').addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key in textarea
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Clear chat
        document.querySelector('.clear-chat').addEventListener('click', () => {
            this.clearChat();
        });

        // Auto-resize textarea
        const textarea = document.getElementById('chatInput');
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        });
    }

    setTopic(topic) {
        document.querySelectorAll('.topic-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-topic="${topic}"]`).classList.add('active');
        this.currentTopic = topic;
    }

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message || this.isProcessing) return;
        
        this.addMessage(message, 'user');
        input.value = '';
        input.style.height = 'auto';
        
        await this.processUserInput(message);
    }

    addMessage(message, type, options = []) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
                ${options.length > 0 ? `
                    <div class="quick-replies">
                        ${options.map(option => `<button>${option}</button>`).join('')}
                    </div>
                ` : ''}
            </div>
            <span class="message-time">${time}</span>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async processUserInput(input) {
        this.isProcessing = true;
        this.showTypingIndicator();

        // Analyze input for keywords and determine appropriate response
        const response = this.analyzeInput(input);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.hideTypingIndicator();
        this.addMessage(response.text, 'bot', response.options);
        this.isProcessing = false;
    }

    analyzeInput(input) {
        input = input.toLowerCase();
        
        // Check for emergency keywords first
        if (this.containsKeywords(input, this.responses.emergency.keywords)) {
            return this.responses.emergency.responses[0];
        }

        // Check other categories based on current topic and keywords
        for (const [category, data] of Object.entries(this.responses)) {
            if (this.containsKeywords(input, data.keywords)) {
                return data.responses[0];
            }
        }

        // Default response if no keywords match
        return {
            text: "I want to help you. Could you please provide more details about what you're looking for?",
            options: [
                "I need emergency help",
                "I'm feeling anxious",
                "I need safety advice",
                "Show me resources"
            ]
        };
    }

    containsKeywords(input, keywords) {
        return keywords.some(keyword => input.includes(keyword));
    }

    showTypingIndicator() {
        const indicator = document.querySelector('.typing-indicator');
        indicator.style.display = 'block';
    }

    hideTypingIndicator() {
        const indicator = document.querySelector('.typing-indicator');
        indicator.style.display = 'none';
    }

    clearChat() {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.innerHTML = `
            <div class="message bot-message welcome-message">
                <div class="message-content">
                    <p>Hello, I'm here to support you. How can I help you today?</p>
                    <div class="quick-replies">
                        <button>I need emergency help</button>
                        <button>I'm feeling anxious</button>
                        <button>I need safety advice</button>
                        <button>Show me resources</button>
                    </div>
                </div>
                <span class="message-time">Just now</span>
            </div>
        `;
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.counselingBot = new CounselingBot();
}); 
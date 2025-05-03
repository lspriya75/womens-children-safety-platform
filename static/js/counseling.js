class CounselingBot {
    constructor() {
        this.currentTopic = 'general';
        this.isProcessing = false;
        this.responses = {
            emergency: {
                keywords: ['emergency', 'help', 'danger', 'unsafe', 'scared', 'threat', 'abuse', 'violence', 'stalking', 'harassment', 'attack', 'hurt', 'fear', 'panic', 'crisis'],
                responses: [
                    {
                        text: "I understand you're in a difficult situation. Here are some immediate steps you can take:",
                        options: [
                            "Call emergency services (911) immediately if you're in immediate danger",
                            "Contact the National Domestic Violence Hotline: 1-800-799-SAFE",
                            "Find a safe location away from the threat",
                            "Would you like me to provide more specific safety resources?"
                        ]
                    },
                    {
                        text: "Your safety is the top priority. Here are some immediate actions you can take:",
                        options: [
                            "Call 911 for immediate police assistance",
                            "Contact a local women's shelter",
                            "Get to a safe public place",
                            "Would you like help creating a safety plan?"
                        ]
                    }
                ]
            },
            harassment: {
                keywords: ['harassment', 'stalking', 'cyberstalking', 'bullying', 'intimidation', 'threats', 'unwanted contact', 'following', 'tracking', 'monitoring', 'cyberbullying', 'online harassment', 'social media harassment', 'workplace harassment', 'sexual harassment', 'verbal abuse', 'emotional abuse', 'psychological abuse'],
                responses: [
                    {
                        text: "I understand you're experiencing harassment. Here's what you need to know:",
                        options: [
                            "Document all incidents with dates, times, and evidence",
                            "File a police complaint under relevant sections",
                            "Contact a harassment support helpline",
                            "Would you like information about legal protection?"
                        ]
                    },
                    {
                        text: "For workplace harassment, you have specific rights:",
                        options: [
                            "File a complaint with HR or management",
                            "Contact the Equal Employment Opportunity Commission",
                            "Document everything and gather evidence",
                            "Would you like guidance on workplace harassment laws?"
                        ]
                    },
                    {
                        text: "For cyber harassment and stalking:",
                        options: [
                            "Save all messages, emails, and social media interactions",
                            "Change passwords and enable two-factor authentication",
                            "Report to social media platforms and authorities",
                            "Would you like tips for online safety?"
                        ]
                    }
                ]
            },
            sexual_abuse: {
                keywords: ['sexual abuse', 'sexual assault', 'rape', 'molestation', 'sexual violence', 'sexual harassment', 'sexual exploitation', 'trafficking', 'sexual coercion', 'date rape', 'marital rape', 'sexual trauma', 'sexual exploitation', 'child sexual abuse', 'incest', 'sexual grooming'],
                responses: [
                    {
                        text: "I hear you, and I believe you. Here's what you need to know about sexual abuse:",
                        options: [
                            "Seek immediate medical attention if needed",
                            "Contact rape crisis center or helpline",
                            "File a police report (you can do this later)",
                            "Would you like information about support services?"
                        ]
                    },
                    {
                        text: "Important steps after sexual assault:",
                        options: [
                            "Get a medical examination (evidence collection)",
                            "Save all evidence (clothes, messages, etc.)",
                            "Contact a sexual assault advocate",
                            "Would you like information about legal options?"
                        ]
                    },
                    {
                        text: "For child sexual abuse situations:",
                        options: [
                            "Contact child protection services immediately",
                            "Report to authorities (mandatory reporting)",
                            "Seek specialized counseling for children",
                            "Would you like guidance on supporting a child?"
                        ]
                    },
                    {
                        text: "Legal rights and protections:",
                        options: [
                            "Right to file criminal charges",
                            "Right to protection orders",
                            "Right to victim compensation",
                            "Would you like specific legal information?"
                        ]
                    }
                ]
            },
            mental: {
                keywords: ['anxious', 'depressed', 'sad', 'worried', 'stress', 'overwhelmed', 'panic', 'fear', 'trauma', 'ptsd', 'grief', 'lonely', 'isolated', 'hopeless', 'suicidal', 'mental health', 'therapy', 'counseling'],
                responses: [
                    {
                        text: "I hear that you're going through a difficult time. Let's work through this together:",
                        options: [
                            "Would you like to try a calming breathing exercise?",
                            "Should we discuss some stress management techniques?",
                            "Would you like to talk about what's troubling you?",
                            "I can connect you with professional mental health resources"
                        ]
                    },
                    {
                        text: "Your feelings are valid, and it's okay to ask for help. Here are some options:",
                        options: [
                            "Let's try a grounding exercise to help you feel more present",
                            "Would you like to learn some coping strategies?",
                            "I can help you find a therapist or counselor",
                            "Would you like to talk about what's causing these feelings?"
                        ]
                    }
                ]
            },
            safety: {
                keywords: ['safety', 'plan', 'protect', 'secure', 'prevention', 'self-defense', 'escape', 'hide', 'document', 'evidence', 'records', 'protection order', 'restraining order', 'safe house', 'shelter'],
                responses: [
                    {
                        text: "Your safety is the top priority. Here are some safety planning steps:",
                        options: [
                            "Create an emergency contact list",
                            "Prepare an emergency escape bag",
                            "Learn about safe locations in your area",
                            "Would you like a detailed safety planning guide?"
                        ]
                    },
                    {
                        text: "Let's work on creating a comprehensive safety plan:",
                        options: [
                            "Document everything - keep records of incidents",
                            "Create a code word with trusted friends/family",
                            "Plan multiple escape routes from your home",
                            "Would you like help with any specific safety measure?"
                        ]
                    }
                ]
            },
            resources: {
                keywords: ['resources', 'information', 'help', 'support', 'services', 'shelter', 'housing', 'legal', 'medical', 'financial', 'education', 'job', 'employment', 'transportation', 'childcare', 'food', 'clothing'],
                responses: [
                    {
                        text: "I can help you find the resources you need. Here are some options:",
                        options: [
                            "Local women's shelters and safe houses",
                            "Legal aid services and advocacy groups",
                            "Counseling and support groups",
                            "Would you like specific contact information for any of these?"
                        ]
                    },
                    {
                        text: "Here are additional resources that might be helpful:",
                        options: [
                            "Housing assistance programs",
                            "Job training and employment services",
                            "Childcare and education resources",
                            "Would you like information about any specific type of help?"
                        ]
                    }
                ]
            },
            children: {
                keywords: ['child', 'children', 'kid', 'kids', 'daughter', 'son', 'parent', 'mother', 'father', 'family', 'custody', 'visitation', 'childcare', 'school', 'education', 'protection', 'safety'],
                responses: [
                    {
                        text: "Protecting children is crucial. Here are some resources and guidance:",
                        options: [
                            "Child safety planning strategies",
                            "Resources for children's counseling",
                            "Legal resources for custody and protection",
                            "Would you like specific information about child safety?"
                        ]
                    },
                    {
                        text: "Let's discuss ways to keep children safe and supported:",
                        options: [
                            "Age-appropriate safety conversations",
                            "School safety protocols",
                            "Child-friendly support services",
                            "Would you like guidance on talking to children about safety?"
                        ]
                    }
                ]
            },
            legal: {
                keywords: ['law', 'legal', 'rights', 'protection order', 'restraining order', 'custody', 'divorce', 'court', 'police', 'report', 'file complaint', 'section', 'IPC', 'POCSO', 'domestic violence', 'harassment', 'stalking', 'cybercrime', 'sexual assault', 'rape', 'abuse', 'violence', 'discrimination', 'equal rights', 'property rights', 'inheritance', 'maintenance', 'alimony', 'child support'],
                responses: [
                    {
                        text: "Understanding your legal rights is important. Here's information about key laws protecting women and children:",
                        options: [
                            "Protection of Women from Domestic Violence Act, 2005",
                            "POCSO Act (Protection of Children from Sexual Offences)",
                            "Section 498A IPC (Cruelty by husband or relatives)",
                            "Would you like more specific legal information?"
                        ]
                    },
                    {
                        text: "Here are important legal provisions you should know about:",
                        options: [
                            "Section 354 IPC (Assault or criminal force to woman with intent to outrage her modesty)",
                            "Section 376 IPC (Punishment for rape)",
                            "Section 509 IPC (Word, gesture or act intended to insult the modesty of a woman)",
                            "Would you like information about filing a complaint?"
                        ]
                    },
                    {
                        text: "Legal remedies available for women and children:",
                        options: [
                            "How to file a police complaint",
                            "Process for obtaining protection orders",
                            "Legal aid and free legal services",
                            "Would you like guidance on court procedures?"
                        ]
                    },
                    {
                        text: "Important legal rights for women and children:",
                        options: [
                            "Right to maintenance and alimony",
                            "Property and inheritance rights",
                            "Child custody and visitation rights",
                            "Would you like information about any specific legal right?"
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

        // Check for specific queries that might need custom responses
        const specificResponse = this.handleSpecificQueries(input);
        if (specificResponse) {
            return specificResponse;
        }

        // Check for specific categories based on current topic and keywords
        let bestMatch = null;
        let highestMatchCount = 0;
        
        for (const [category, data] of Object.entries(this.responses)) {
            const matchCount = this.countKeywordMatches(input, data.keywords);
            if (matchCount > highestMatchCount) {
                highestMatchCount = matchCount;
                bestMatch = category;
            }
        }
        
        // If we found a good match, return the appropriate response
        if (bestMatch && highestMatchCount > 0) {
            // Get all responses for the best matching category
            const categoryResponses = this.responses[bestMatch].responses;
            
            // If there are multiple responses, try to select the most relevant one
            if (categoryResponses.length > 1) {
                // Check for specific keywords that might indicate which response is most relevant
                for (let i = 0; i < categoryResponses.length; i++) {
                    const response = categoryResponses[i];
                    // If this is a follow-up question to a previous response, use the next response
                    if (this.isFollowUpQuestion(input, response)) {
                        return response;
                    }
                }
            }
            
            // Return the first response if no better match is found
            return categoryResponses[0];
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

    handleSpecificQueries(input) {
        // Handle specific queries that might not be caught by keyword matching
        
        // Check for questions about specific laws
        if (input.includes('section') || input.includes('law') || input.includes('act')) {
            if (input.includes('498a') || input.includes('498 a') || input.includes('498-a')) {
                return {
                    text: "Section 498A of the Indian Penal Code deals with cruelty by husband or relatives of husband. This law protects women from:",
                    options: [
                        "Physical and mental cruelty",
                        "Demand for dowry",
                        "Harassment for dowry",
                        "Would you like information about filing a complaint under this section?"
                    ]
                };
            }
            
            if (input.includes('354') || input.includes('376') || input.includes('509')) {
                return {
                    text: "These sections of the Indian Penal Code protect women from sexual offenses:",
                    options: [
                        "Section 354: Assault or criminal force to woman with intent to outrage her modesty",
                        "Section 376: Punishment for rape",
                        "Section 509: Word, gesture or act intended to insult the modesty of a woman",
                        "Would you like information about filing a complaint under these sections?"
                    ]
                };
            }
            
            if (input.includes('pocso') || input.includes('child') && input.includes('law')) {
                return {
                    text: "The POCSO Act (Protection of Children from Sexual Offences) provides for child-friendly procedures for reporting, recording of evidence, investigation and speedy trial through special courts.",
                    options: [
                        "Mandatory reporting of child sexual abuse",
                        "Child-friendly procedures in court",
                        "Strict punishment for offenders",
                        "Would you like information about reporting child sexual abuse?"
                    ]
                };
            }
        }
        
        // Check for questions about specific types of harassment
        if (input.includes('workplace') || input.includes('office') || input.includes('job') && (input.includes('harassment') || input.includes('bullying'))) {
            return {
                text: "Workplace harassment is serious and you have rights. Here's what you should know:",
                options: [
                    "Document all incidents with dates, times, and witnesses",
                    "File a formal complaint with HR or management",
                    "Contact the Equal Employment Opportunity Commission",
                    "Would you like information about workplace harassment laws?"
                ]
            };
        }
        
        if (input.includes('online') || input.includes('cyber') || input.includes('social media') && (input.includes('harassment') || input.includes('stalking'))) {
            return {
                text: "Cyber harassment and stalking can be frightening. Here's how to protect yourself:",
                options: [
                    "Save all messages, emails, and social media interactions as evidence",
                    "Change passwords and enable two-factor authentication",
                    "Report to social media platforms and file a police complaint",
                    "Would you like tips for online safety?"
                ]
            };
        }
        
        // Check for questions about specific types of abuse
        if (input.includes('child') && (input.includes('abuse') || input.includes('molestation') || input.includes('exploitation'))) {
            return {
                text: "Child abuse is a serious crime that requires immediate action. Here's what you should do:",
                options: [
                    "Contact child protection services immediately",
                    "Report to authorities (mandatory reporting)",
                    "Seek specialized counseling for the child",
                    "Would you like guidance on supporting a child who has experienced abuse?"
                ]
            };
        }
        
        // If no specific query is matched, return null to continue with the regular analysis
        return null;
    }

    countKeywordMatches(input, keywords) {
        return keywords.filter(keyword => input.includes(keyword)).length;
    }
    
    isFollowUpQuestion(input, response) {
        // Check if the input is asking for more information about a previous response
        const followUpIndicators = ['more', 'how', 'what', 'where', 'when', 'why', 'tell me', 'explain', 'details', 'specific'];
        return followUpIndicators.some(indicator => input.includes(indicator));
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
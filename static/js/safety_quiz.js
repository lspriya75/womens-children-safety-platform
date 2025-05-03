const safetyQuizQuestions = [
    {
        question: "What should you do if you feel someone is following you?",
        options: [
            "Keep walking normally and ignore it",
            "Head to a crowded, well-lit area or a safe space like a store",
            "Confront the person immediately",
            "Run as fast as you can"
        ],
        correct: 1,
        explanation: "Moving to a crowded, well-lit area increases your safety and decreases the likelihood of any harmful situations."
    },
    {
        question: "Which of these is NOT a recommended safety practice when using ride-sharing services?",
        options: [
            "Verify the license plate number",
            "Share your trip details with friends",
            "Get in quickly without checking the driver's photo",
            "Wait for your ride indoors"
        ],
        correct: 2,
        explanation: "Always verify the driver's photo along with the car details before getting in."
    },
    {
        question: "What is the best way to store emergency contact numbers?",
        options: [
            "Only in your phone",
            "Written on a piece of paper in your wallet",
            "Both in your phone and written down",
            "Memorize them only"
        ],
        correct: 2,
        explanation: "Having both digital and physical copies ensures you can access emergency contacts even if your phone is lost or dead."
    },
    {
        question: "What should you do if you receive suspicious messages from unknown numbers?",
        options: [
            "Reply to ask who they are",
            "Block the number and report if harassment continues",
            "Share the messages on social media",
            "Ignore but keep the number unblocked"
        ],
        correct: 1,
        explanation: "Blocking unwanted contacts and reporting harassment is the safest approach."
    },
    {
        question: "Which is the most secure way to share your location with trusted contacts?",
        options: [
            "Post it publicly on social media",
            "Use private location sharing features with selected contacts",
            "Send your location to a group chat",
            "Tell everyone where you're going"
        ],
        correct: 1,
        explanation: "Using private location sharing features with trusted contacts maintains privacy while ensuring safety."
    }
];

let currentQuestion = 0;
let score = 0;
let quizStarted = false;
let currentQuizQuestions = [];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function selectRandomQuestions() {
    // Create a copy of all questions and shuffle them
    const shuffledQuestions = shuffleArray([...safetyQuizQuestions]);
    // Take the first 5 questions
    currentQuizQuestions = shuffledQuestions.slice(0, 5);
}

function startQuiz() {
    quizStarted = true;
    currentQuestion = 0;
    score = 0;
    selectRandomQuestions(); // Select new random questions each time
    displayQuestion();
    document.getElementById('quiz-start-section').style.display = 'none';
    document.getElementById('quiz-question-section').style.display = 'block';
    updateProgress();
}

function displayQuestion() {
    const questionData = currentQuizQuestions[currentQuestion];
    document.getElementById('question-text').textContent = questionData.question;
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    questionData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'quiz-option';
        button.textContent = option;
        button.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(button);
    });
    
    updateProgress();
}

function checkAnswer(selectedIndex) {
    const questionData = currentQuizQuestions[currentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    
    options.forEach(option => option.disabled = true);
    
    if (selectedIndex === questionData.correct) {
        score++;
        options[selectedIndex].classList.add('correct');
    } else {
        options[selectedIndex].classList.add('incorrect');
        options[questionData.correct].classList.add('correct');
    }
    
    document.getElementById('explanation').textContent = questionData.explanation;
    document.getElementById('explanation').style.display = 'block';
    
    setTimeout(() => {
        document.getElementById('explanation').style.display = 'none';
        nextQuestion();
    }, 3000);
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < currentQuizQuestions.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('quiz-question-section').style.display = 'none';
    document.getElementById('quiz-results-section').style.display = 'block';
    
    const percentage = (score / currentQuizQuestions.length) * 100;
    document.getElementById('quiz-score').textContent = 
        `You scored ${score} out of ${currentQuizQuestions.length} (${percentage}%)`;
    
    let message = '';
    if (percentage === 100) {
        message = 'Excellent! You have a great understanding of safety practices!';
    } else if (percentage >= 80) {
        message = 'Great job! You know your safety well!';
    } else if (percentage >= 60) {
        message = 'Good effort! Consider reviewing some safety guidelines.';
    } else {
        message = 'You might want to review safety guidelines to better protect yourself.';
    }
    
    document.getElementById('quiz-message').textContent = message;
}

function restartQuiz() {
    document.getElementById('quiz-results-section').style.display = 'none';
    document.getElementById('quiz-start-section').style.display = 'block';
    currentQuestion = 0;
    score = 0;
}

function updateProgress() {
    const progress = document.getElementById('quiz-progress');
    progress.textContent = `Question ${currentQuestion + 1} of ${currentQuizQuestions.length}`;
}

function closeQuiz() {
    document.getElementById('quiz-container').style.display = 'none';
}

function openQuiz() {
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('quiz-start-section').style.display = 'block';
    document.getElementById('quiz-question-section').style.display = 'none';
    document.getElementById('quiz-results-section').style.display = 'none';
} 
let questionCount = 0;

function addQuestion() {
    questionCount++;
    const questionType = document.getElementById('questionType').value;
    const questionsContainer = document.getElementById('questionsContainer');

    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');

    const questionLabel = document.createElement('label');
    questionLabel.innerText = `Question ${questionCount}:`;
    questionDiv.appendChild(questionLabel);

    const questionInput = document.createElement('input');
    questionInput.type = 'text';
    questionInput.placeholder = 'Enter the question text';
    questionInput.id = `question${questionCount}`;
    questionDiv.appendChild(questionInput);

    if (questionType === 'MCQ') {
        const optionA = createOptionInput('A');
        const optionB = createOptionInput('B');
        const optionC = createOptionInput('C');
        const optionD = createOptionInput('D');
        questionDiv.appendChild(optionA);
        questionDiv.appendChild(optionB);
        questionDiv.appendChild(optionC);
        questionDiv.appendChild(optionD);
    }

    if (questionType === 'trueFalse') {
        const trueOption = createOptionInput('True');
        const falseOption = createOptionInput('False');
        questionDiv.appendChild(trueOption);
        questionDiv.appendChild(falseOption);
    }

    if (questionType === 'shortAnswer') {
        const answerInput = document.createElement('textarea');
        answerInput.placeholder = 'Enter your answer';
        questionDiv.appendChild(answerInput);
    }

    questionsContainer.appendChild(questionDiv);
}

function createOptionInput(optionLabel) {
    const optionDiv = document.createElement('div');
    const optionInput = document.createElement('input');
    optionInput.type = 'text';
    optionInput.placeholder = `${optionLabel} Option`;
    optionDiv.appendChild(optionInput);
    return optionDiv;
}

document.getElementById('quizForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const quizTitle = document.getElementById('quizTitle').value;
    const quizDeadline = document.getElementById('quizDeadline').value;
    const quizTimeLimit = document.getElementById('quizTimeLimit').value;
    const questions = [];

    for (let i = 1; i <= questionCount; i++) {
        const question = document.getElementById(`question${i}`).value;
        if (!question) {
            alert('Please enter all questions');
            return;
        }

        const questionType = document.getElementById('questionType').value;
        const options = [];
        if (questionType === 'MCQ') {
            options.push(document.querySelector(`#question${i} input[placeholder="A Option"]`).value);
            options.push(document.querySelector(`#question${i} input[placeholder="B Option"]`).value);
            options.push(document.querySelector(`#question${i} input[placeholder="C Option"]`).value);
            options.push(document.querySelector(`#question${i} input[placeholder="D Option"]`).value);
        }
        questions.push({ question, type: questionType, options });
    }

    const quiz = {
        title: quizTitle,
        deadline: quizDeadline,
        timeLimit: quizTimeLimit,
        questions
    };

    localStorage.setItem('quizData', JSON.stringify(quiz));

    alert('Quiz created successfully!');
});

function viewResponses() {
    // You will fetch student responses from localStorage or a database here.
    alert('Displaying student responses (to be implemented).');
}

function viewPerformance() {
    // You will calculate and display performance summary here.
    alert('Displaying performance summary (to be implemented).');
}

// Function to create quiz (send data to backend)
function createQuiz() {
    const quizTitle = document.getElementById('quizTitle').value;
    const quizDeadline = document.getElementById('quizDeadline').value;
    const quizTimeLimit = document.getElementById('quizTimeLimit').value;

    const questions = []; // Collect all questions and options

    // Collect questions here...
    
    const quizData = {
        title: quizTitle,
        deadline: quizDeadline,
        timeLimit: quizTimeLimit,
        questions: questions
    };

    fetch('http://localhost:3000/createQuiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Quiz created successfully!');
    })
    .catch(error => console.error('Error creating quiz:', error));
}

// Function to submit student responses
function submitResponses(studentId, quizId, responses) {
    const responseData = {
        studentId: studentId,
        quizId: quizId,
        responses: responses
    };

    fetch('http://localhost:3000/submitResponses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responseData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Responses submitted and graded!');
    })
    .catch(error => console.error('Error submitting responses:', error));
}

// Function to view performance summary
function viewPerformance() {
    fetch('http://localhost:3000/viewPerformance')
    .then(response => response.json())
    .then(data => {
        // Display the performance data here
        console.log(data);
    })
    .catch(error => console.error('Error fetching performance:', error));
}

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',  // replace with your MySQL password
    database: 'quiz_system'  // replace with your database name
});

// Test the database connection
db.connect(err => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + db.threadId);
});

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint to create a quiz
app.post('/createQuiz', (req, res) => {
    const { title, deadline, timeLimit, questions } = req.body;
    
    // Insert quiz details into the quizzes table
    db.query(
        'INSERT INTO quizzes (title, deadline, time_limit) VALUES (?, ?, ?)',
        [title, deadline, timeLimit],
        function(err, results) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            const quizId = results.insertId;

            // Insert questions into the questions table
            questions.forEach(question => {
                db.query(
                    'INSERT INTO questions (quiz_id, question_text, type) VALUES (?, ?, ?)',
                    [quizId, question.text, question.type],
                    function(err, questionResults) {
                        if (err) {
                            return res.status(500).json({ error: 'Database error' });
                        }

                        const questionId = questionResults.insertId;

                        // Insert options for MCQs
                        if (question.type === 'MCQ') {
                            question.options.forEach(option => {
                                db.query(
                                    'INSERT INTO options (question_id, option_text) VALUES (?, ?)',
                                    [questionId, option],
                                    function(err) {
                                        if (err) {
                                            return res.status(500).json({ error: 'Database error' });
                                        }
                                    }
                                );
                            });
                        }
                    }
                );
            });

            res.status(200).json({ message: 'Quiz created successfully' });
        }
    );
});

// Endpoint to submit student responses
app.post('/submitResponses', (req, res) => {
    const { studentId, quizId, responses } = req.body;

    // Insert student responses into the responses table
    responses.forEach(response => {
        db.query(
            'INSERT INTO responses (student_id, quiz_id, question_id, response) VALUES (?, ?, ?, ?)',
            [studentId, quizId, response.questionId, response.answer],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }
            }
        );
    });

    // Calculate score
    let score = 0;
    responses.forEach(response => {
        db.query(
            'SELECT * FROM questions WHERE id = ?',
            [response.questionId],
            function(err, questionResults) {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }
                const question = questionResults[0];
                if (question.type === 'MCQ') {
                    // Check if the MCQ response is correct
                    db.query(
                        'SELECT * FROM options WHERE question_id = ? AND option_text = ?',
                        [response.questionId, response.answer],
                        function(err, optionResults) {
                            if (err) {
                                return res.status(500).json({ error: 'Database error' });
                            }
                            if (optionResults.length > 0) {
                                score++;
                            }
                        }
                    );
                } else if (question.type === 'shortAnswer') {
                    // Manually grade short answers (for simplicity, assume all short answers are correct here)
                    score++;
                }
            }
        );
    });

    // Insert the score into the performance table
    db.query(
        'INSERT INTO performance (student_id, quiz_id, score, total_questions) VALUES (?, ?, ?, ?)',
        [studentId, quizId, score, responses.length],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(200).json({ message: 'Responses submitted and graded' });
        }
    );
});

// Endpoint to view performance summary
app.get('/viewPerformance', (req, res) => {
    db.query(
        'SELECT * FROM performance',
        function(err, results) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(200).json(results);
        }
    );
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// JavaScript for Login Page (index.html)

//const validUsernames = ["student123", "student456", "student789"]; // Example student usernames

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value;

    // Check if the username exists in the list of valid students
    if (!validUsernames.includes(username)) {
        alert('Invalid username. Please check your input.');
        return;
    }

    console.log('Username:', username, 'Email:', email);

    // Simulate login success and redirection to the student's quiz dashboard
    alert('Login successful! Redirecting to your quizzes...');
    
    // Store the username and email for later use (e.g., displaying on the dashboard)
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);

    // Redirect to the student's quiz dashboard page
    window.location.href = "student_dashboard.html"; // Assuming the dashboard page exists
});

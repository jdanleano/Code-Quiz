// This is where I declare my variables for the questions, querySelect link to my HTML file, and variable for my timer
var questions = [
    {
        question: "What kind of language is Javascript?",
        choices: ["Object-Oriented", "Object-Based", "Procedural", "None of the Above"],
        answer: "Object-Oriented"
    },
    {
        question: "Which of the following methods is used to access HTML elements using Javascript?",
        choices: ["getElementbyId()", "getElementbyClassName()", "Both A and B", "None of the Above"],
        answer: "Both A and B"
    },
    {
        question: "How can a datatype be declared to be a constant type?",
        choices: ["let", "var", "const", "constant"],
        answer: "const"
    },
    {
        question: "What keyword is used to check whether a given property is valid or not?",
        choices: ["is in", "in", "exists", "lies"],
        answer: "in"
    },
    {
        question: "Which function is used to serialize an object into a JSON string in Javascript?",
        choices: ["stringify()", "parse()", "convert()", "None of the Above"],
        answer: "stringify()"
    },
]

var score = 0;
var questionIndex = 0;

var highScoreBtn = document.querySelector("#view-high-scores");
var clearScoreBtn = document.querySelector("#clear-high-scores");
var currentTime = document.querySelector("#timer");
var startTime = document.querySelector("#start");
var questionsEl = document.querySelector("#questionsEl");
var container = document.querySelector("#container");

var timeLeft = 100;
var holdInterval = 0;
var penalty = 10;
var createUl = document.createElement("ul");

// This event listener is for the timer to start when the start button (test your might button is clicked). This will also start the give question function right after to generate the first question. 
startTime.addEventListener("click", function () {
    if (holdInterval === 0) {
        holdInterval = setInterval(function () {
            timeLeft--;
            currentTime.textContent = "Time: " + timeLeft;

            if (timeLeft <= 0) {
                clearInterval(holdInterval);
                completed();
                currentTime.textContent = "Time is up!";
            }
        }, 1000)
    }
    giveQuestion(questionIndex)
});

// This is the event listener I added for the clear high score button to clear once clicked. 
clearScoreBtn.addEventListener("click", function () {
    localStorage.clear();
})

// This function below is added to generate the questions variable into a list item for the choices. It is also being placed in the area of the HTML desiganted for the questions. A for look is also used to generage the questions and choices. 
function giveQuestion(questionIndex) {
    questionsEl.innerHTML = "";
    createUl.innerHTML = "";

    for (var i = 0; i < questions.length; i++) {
        var userQuestion = questions[questionIndex].question;
        var userChoices = questions[questionIndex].choices;
        questionsEl.textContent = userQuestion;
    }

    userChoices.forEach(function (newItem) {
        var listItem = document.createElement("li");
        listItem.textContent = newItem;
        questionsEl.appendChild(createUl);
        createUl.appendChild(listItem);
        listItem.addEventListener("click", (compare));
    })
}

// This function is to compare the selected answer if it is correct or incorrect. A message is also generated in a created div where is say Congratulations once the quis is completed. 
function compare(event) {
    var element = event.target;

    if (element.matches("li")) {

        var createDiv = document.createElement("div");
        createDiv.setAttribute("id", "createDiv");
        if (element.textContent == questions[questionIndex].answer) {
            score++;
            createDiv.textContent = "Correct! " + questions[questionIndex].answer + " is right!";
        } else {
            timeLeft = timeLeft - penalty;
            createDiv.textContent = "Wrong! The correct answer is " + questions[questionIndex].answer;
        }
    }
    questionIndex++;

    if (questionIndex >= questions.length) {
        completed();
        createDiv.textContent = "Congratulations! You have completed Java Kombat! You got " + score + "/" + questions.length + " Correct!";
    } else {
        giveQuestion(questionIndex);
    }
    questionsEl.appendChild(createDiv);
}

// This function is run once the last question is answered and a final score is generated. This includes an H1, a message stating your final score, an input box for initials to be entered, and a submit button that will add your initials and score to localStorage.
function completed() {
    questionsEl.innerHTML = "";
    currentTime.innerHTML = "";

    var createH1 = document.createElement("h1");
    createH1.setAttribute("id", "createH1");
    createH1.textContent = "Completed!"

    questionsEl.appendChild(createH1);

    var createP = document.createElement("p");
    createP.setAttribute("id", "createP");

    questionsEl.appendChild(createP);

    if (timeLeft >= 0) {
        var timeRemaining = timeLeft;
        var createP2 = document.createElement("p");
        clearInterval(holdInterval);
        createP.textContent = "Your Final Score is: " + timeRemaining;

        questionsEl.appendChild(createP2);
    }

    var createLabel = document.createElement("label");
    createLabel.setAttribute("id", "createLabel");
    createLabel.textContent = "Enter your initials: ";

    questionsEl.appendChild(createLabel);

    var createInput = document.createElement("input");
    createInput.setAttribute("type", "text");
    createInput.setAttribute("id", "initials");
    createInput.textContent = "";

    questionsEl.appendChild(createInput);

    var submitBtn = document.createElement("button");
    submitBtn.setAttribute("type", "submit");
    submitBtn.setAttribute("id", "Submit");
    submitBtn.textContent = "Submit";

    questionsEl.appendChild(submitBtn);

    // This is the event listener that will view the high scores from localStorage.
    highScoreBtn.addEventListener("click", function () {

        var quizUsers = "";
        var substringTest = "";
        var highScores = "";

        for (var i = 0; i < localStorage.length; i++) {
            var checkUserValue = [];

            quizUsers = localStorage.getItem(localStorage.key(i));
            substringTest = quizUsers.substring(0, 4)
            if (substringTest == "quiz") {
                checkUserValue = quizUsers.split(",");
                var userName = checkUserValue[0]
                highScores += "User " + userName.substring(4) + " high score is: " + checkUserValue[1] + "\n";
            }
        }
        window.alert(highScores);

    })

    // This is the event listener for the submit button that will submit and log the initials and score as a string to localStorage.
    submitBtn.addEventListener("click", function () {

        var quizLocalStorage = "quiz";
        var quizUserDetails = "";
        var value = [];

        quizUserDetails = quizLocalStorage + createInput.value
        value = [quizUserDetails, timeLeft]

        //This test is added so the rest of the high scores would load correctly in localStorage.
        if (!localStorage.length) {
            localStorage.setItem("test", "test");
        }

        for (var i = 0; i < localStorage.length; i++) {

            var checkUser = "";
            var checkUserValue = [];

            quizUserDetails = quizLocalStorage + createInput.value;

            checkUser = localStorage.getItem(quizUserDetails);

            if (checkUser == null) {
                localStorage.setItem(quizUserDetails, value);
                window.alert("Your score of " + timeLeft + " has been submitted!")
                break;
            } else if (checkUser != null) {
                checkUserValue = checkUser.split(",");
            }
            if (quizUserDetails == checkUserValue[0] && timeLeft == checkUserValue[1]) {
                localStorage.setItem(quizUserDetails, value);
                window.alert(timeLeft + " " + "is the latest entry for user initial " + createInput.value + ". Entry will not be added.")
                break;
            } else if (createInput.value == "") {
                window.alert("Please enter an initial");
                break;
            } else if (quizUserDetails == checkUserValue[0] && timeLeft > checkUserValue[1]) {
                localStorage.setItem(quizUserDetails, value);
                window.alert("New high score of " + timeLeft + " has been submitted!.\nYour previous score was " + checkUserValue[1])
                break;
            } else if (quizUserDetails == checkUserValue[0] && timeLeft < checkUserValue[1]) {
                localStorage.setItem(quizUserDetails, value);
                window.alert("Your previous code of " + checkUserValue[1] + " was higher. Entry will not be added.");
                break;
            } else {
                localStorage.setItem(quizUserDetails, value);
                window.alert("Your score of " + timeLeft + " has been submitted!")
                break;
            }

        }

    })
}
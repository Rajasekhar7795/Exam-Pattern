const questions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "London"],
    correct: "Paris",
    time: 10,
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correct: "4",
    time: 10,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Venus", "Mars", "Jupiter"],
    correct: "Mars",
    time: 10,
  },
];

let timers = [];
let answers = {};
let frozen = [];
let expired = [];
let intervals = [];

const quizContainer = document.getElementById("quiz");
const resultContainer = document.getElementById("result");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restart");

function initializeQuiz() {
  quizContainer.innerHTML = "";
  resultContainer.classList.add("hidden");
  answers = {};
  frozen = questions.map(() => false);
  expired = questions.map(() => false);
  timers = questions.map((q) => q.time);
  intervals.forEach((interval) => clearInterval(interval));
  intervals = [];

  questions.forEach((q, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question-container");
    questionDiv.setAttribute("data-index", index);

    const headerDiv = document.createElement("div");
    headerDiv.classList.add("question-header");

    const questionText = document.createElement("p");
    questionText.textContent = `Q${index + 1}. ${q.question}`;

    const timerSpan = document.createElement("span");
    timerSpan.textContent = `${q.time}s`;
    timerSpan.setAttribute("id", `timer-${index}`);

    headerDiv.appendChild(questionText);
    headerDiv.appendChild(timerSpan);

    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("options");

    q.options.forEach((opt) => {
      const button = document.createElement("button");
      button.textContent = opt;
      button.classList.add("option-button");
      button.addEventListener("click", () => handleAnswer(index, opt));
      optionsDiv.appendChild(button);
    });

    const statusP = document.createElement("p");
    statusP.classList.add("status");
    statusP.setAttribute("id", `status-${index}`);

    questionDiv.appendChild(headerDiv);
    questionDiv.appendChild(optionsDiv);
    questionDiv.appendChild(statusP);

    quizContainer.appendChild(questionDiv);

    startTimer(index);
  });
}

function startTimer(index) {
  const timerSpan = document.getElementById(`timer-${index}`);
  intervals[index] = setInterval(() => {
    if (!frozen[index] && timers[index] > 0) {
      timers[index]--;
      timerSpan.textContent = `${timers[index]}s`;
      if (timers[index] === 0) {
        freezeQuestion(index, true);
      }
    }
  }, 1000);
}

function freezeQuestion(index, timeExpired = false) {
  frozen[index] = true;
  if (timeExpired) {
    expired[index] = true;
  }
  clearInterval(intervals[index]);

  const questionDiv = document.querySelector(`.question-container[data-index='${index}']`);
  const buttons = questionDiv.querySelectorAll(".option-button");
  buttons.forEach((btn) => {
    btn.classList.add("disabled");
    btn.disabled = true;
  });

  const statusP = document.getElementById(`status-${index}`);
  if (timeExpired) {
    statusP.textContent = "Time up";
    statusP.classList.add("time-up");
  } else {
    statusP.textContent = "Answer locked";
    statusP.classList.add("locked");
  }

  if (frozen.every((f) => f)) {
    showResult();
  }
}

function handleAnswer(index, selectedOption) {
  if (frozen[index]) return;
  answers[index] = selectedOption;

  const questionDiv = document.querySelector(`.question-container[data-index='${index}']`);
  const buttons = questionDiv.querySelectorAll(".option-button");
  buttons.forEach((btn) => {
    if (btn.textContent === selectedOption) {
      btn.classList.add("selected");
    }
  });

  freezeQuestion(index);
}

function showResult() {
  let score = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.correct) {
      score++;
    }
  });
  scoreDisplay.textContent = `You scored: ${score} / ${questions.length}`;
  resultContainer.classList.remove("hidden");
}

restartButton.addEventListener("click", initializeQuiz);

initializeQuiz();

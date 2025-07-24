// quiz.js
import {
  getElement,
  showElement,
  hideElement,
  setText,
  createAnswerButton,
  updateScoreDisplay,
  lockAnswers,
  markCorrectAnswer,
  updateProgressBar,
} from "./dom.js";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  startTimer,
} from "./utils.js";

console.log("Quiz JS loaded...");

// Questions séparées par difficulté
const easyQuestions = [
  {
    text: "Quelle est la capitale de la France ?",
    answers: ["Marseille", "Paris", "Lyon", "Bordeaux"],
    correct: 1,
    timeLimit: 10,
    difficulty: "easy",
  },
  {
    text: "Combien font 2 + 3 ?",
    answers: ["3", "4", "5", "1"],
    correct: 2,
    timeLimit: 5,
    difficulty: "easy",
  },
  {
    text: "Combien de côtés a un rectangle ?",
    answers: ["3", "4", "5", "6"],
    correct: 1,
    timeLimit: 7,
    difficulty: "easy",
  },
  {
    text: "Quel fruit est jaune ?",
    answers: ["Pomme", "Banane", "Cerise", "Raisin"],
    correct: 1,
    timeLimit: 7,
    difficulty: "easy",
  },
  {
    text: "Combien font 1 x 0 ?",
    answers: ["0", "1", "2", "3"],
    correct: 0,
    timeLimit: 5,
    difficulty: "easy",
  },
  {
    text: "Quel est le contraire de chaud ?",
    answers: ["Froid", "Humide", "Sec", "Lourd"],
    correct: 0,
    timeLimit: 7,
    difficulty: "easy",
  },
  {
    text: "Quel est le cinquième mois de l'année ?",
    answers: ["Mars", "Avril", "Mai", "Juin"],
    correct: 2,
    timeLimit: 7,
    difficulty: "easy",
  },
];

const mediumQuestions = [
  {
    text: "Quel est le plus grand océan du monde ?",
    answers: ["Atlantique", "Indien", "Arctique", "Pacifique"],
    correct: 3,
    timeLimit: 10,
    difficulty: "medium",
  },
  {
    text: "Quel est l'élément chimique dont le symbole est O ?",
    answers: ["Or", "Oxygène", "Osmium", "Ozone"],
    correct: 1,
    timeLimit: 12,
    difficulty: "medium",
  },
  {
    text: "Qui a peint la Joconde ?",
    answers: ["Van Gogh", "Picasso", "Léonard de Vinci", "Monet"],
    correct: 2,
    timeLimit: 12,
    difficulty: "medium",
  },
  {
    text: "Quel est le plus long fleuve du monde ?",
    answers: ["Nil", "Amazon", "Yangtsé", "Mississippi"],
    correct: 1,
    timeLimit: 12,
    difficulty: "medium",
  },
  {
    text: "Quel est le plus haut sommet du monde ?",
    answers: ["K2", "Everest", "Mont Blanc", "Kilimandjaro"],
    correct: 1,
    timeLimit: 12,
    difficulty: "medium",
  },
  {
    text: "Qui a écrit 'Le Petit Prince' ?",
    answers: ["Saint-Exupéry", "Hugo", "Zola", "Camus"],
    correct: 0,
    timeLimit: 12,
    difficulty: "medium",
  },
];

const hardQuestions = [
  {
    text: "En quelle année a eu lieu la Révolution française ?",
    answers: ["1789", "1815", "1848", "1914"],
    correct: 0,
    timeLimit: 15,
    difficulty: "hard",
  },
  {
    text: "Combien d'états composent les États-Unis ?",
    answers: ["50", "48", "52", "45"],
    correct: 0,
    timeLimit: 12,
    difficulty: "hard",
  },
  {
    text: "Quel est le nombre Pi arrondi à 3 décimales ?",
    answers: ["3.142", "3.141", "3.143", "3.140"],
    correct: 0,
    timeLimit: 15,
    difficulty: "hard",
  },
  {
    text: "Quel est le plus grand désert du monde ?",
    answers: ["Sahara", "Antarctique", "Gobi", "Kalahari"],
    correct: 1,
    timeLimit: 15,
    difficulty: "hard",
  },
  {
    text: "Combien de chromosomes possède l'humain ?",
    answers: ["46", "23", "44", "48"],
    correct: 0,
    timeLimit: 15,
    difficulty: "hard",
  },
  {
    text: "Quel est le plus grand pays du monde par superficie ?",
    answers: ["Canada", "Chine", "États-Unis", "Russie"],
    correct: 3,
    timeLimit: 15,
    difficulty: "hard",
  },
  {
    text: "Qui a écrit 'Voyage au centre de la Terre' ?",
    answers: ["Proust", "Vernes", "Sartre", "Flaubert"],
    correct: 1,
    timeLimit: 15,
    difficulty: "hard",
  },
  {
    text: "Quel est le point de fusion de l'eau en degrés Celsius ?",
    answers: ["0", "100", "-10", "50"],
    correct: 0,
    timeLimit: 15,
    difficulty: "hard",
  },
  {
    text: "Quel scientifique a proposé la théorie de la relativité ?",
    answers: ["Newton", "Einstein", "Galilée", "Bohr"],
    correct: 1,
    timeLimit: 15,
    difficulty: "hard",
  },
];

// Génère la liste des questions à poser (ordre croissant de difficulté)
function generateQuizQuestions() {
  // Retourne toutes les questions dans l'ordre : faciles, moyennes, difficiles
  return [...easyQuestions, ...mediumQuestions, ...hardQuestions];
}

let questions = []; // Initialisé vide

let currentQuestionIndex = 0;
let score = 0;
let bestScore = loadFromLocalStorage("bestScore", 0);
let timerId = null;

// DOM Elements
const introScreen = getElement("#intro-screen");
const questionScreen = getElement("#question-screen");
const resultScreen = getElement("#result-screen");

const bestScoreValue = getElement("#best-score-value");
const bestScoreEnd = getElement("#best-score-end");

const questionText = getElement("#question-text");
const answersDiv = getElement("#answers");
const nextBtn = getElement("#next-btn");
const startBtn = getElement("#start-btn");
const restartBtn = getElement("#restart-btn");

const scoreText = getElement("#score-text");
const timerText = getElement("#timer-text");
const timerBar = getElement("#timer-bar");

const currentQuestionIndexSpan = getElement("#current-question-index");
const totalQuestionsSpan = getElement("#total-questions");

// Init
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", restartQuiz);

setText(bestScoreValue, bestScore);

function startQuiz() {
  hideElement(introScreen);
  showElement(questionScreen);

  currentQuestionIndex = 0;
  score = 0;

  questions = generateQuizQuestions(); // Génère les questions à chaque partie
  setText(totalQuestionsSpan, questions.length);

  showQuestion();
}

function showQuestion() {
  clearInterval(timerId);

  const q = questions[currentQuestionIndex];
  setText(questionText, q.text);
  setText(currentQuestionIndexSpan, currentQuestionIndex + 1);

  // Update progress bar for questions
  updateProgressBar(
    "#progress-bar",
    currentQuestionIndex + 1,
    questions.length
  );

  answersDiv.innerHTML = "";
  q.answers.forEach((answer, index) => {
    const btn = createAnswerButton(answer, () => selectAnswer(index, btn));
    answersDiv.appendChild(btn);
  });

  nextBtn.classList.add("hidden");

  // Reset timer bar
  if (timerBar) timerBar.style.width = "100%";

  // Format initial timer text
  const initialTime = q.timeLimit;
  setText(
    timerText,
    `${initialTime} seconde${initialTime > 1 ? "s" : ""}`
  );

  timerId = startTimer(
    q.timeLimit,
    (timeLeft) => {
      // Format timer text with plural handling
      const timeString = `${timeLeft} seconde${timeLeft > 1 ? "s" : ""}`;
      setText(timerText, timeString);

      // Update timer progress bar
      updateProgressBar("#timer-bar", timeLeft, q.timeLimit);
    },
    () => {
      lockAnswers(answersDiv);
      markCorrectAnswer(answersDiv, q.correct); // Show correct answer if time runs out
      nextBtn.classList.remove("hidden");
    }
  );
}

function selectAnswer(index, btn) {
  clearInterval(timerId);

  const q = questions[currentQuestionIndex];
  if (index === q.correct) {
    score++;
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
  }

  markCorrectAnswer(answersDiv, q.correct);
  lockAnswers(answersDiv);
  nextBtn.classList.remove("hidden");
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  hideElement(questionScreen);
  showElement(resultScreen);

  updateScoreDisplay(scoreText, score, questions.length);

  if (score > bestScore) {
    bestScore = score;
    saveToLocalStorage("bestScore", bestScore);
  }
  setText(bestScoreEnd, bestScore);
}

function restartQuiz() {
  hideElement(resultScreen);
  showElement(introScreen);

  setText(bestScoreValue, bestScore);
}

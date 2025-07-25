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
    timeLimit: 10,
    difficulty: "easy",
  },
  {
    text: "Combien de côtés a un rectangle ?",
    answers: ["3", "4", "5", "6"],
    correct: 1,
    timeLimit: 10,
    difficulty: "easy",
  },
  {
    text: "Quel fruit est jaune ?",
    answers: ["Pomme", "Banane", "Cerise", "Raisin"],
    correct: 1,
    timeLimit: 10,
    difficulty: "easy",
  },
  {
    text: "Combien font 1 x 0 ?",
    answers: ["0", "1", "2", "3"],
    correct: 0,
    timeLimit: 10,
    difficulty: "easy",
  },
  {
    text: "Quel est le contraire de chaud ?",
    answers: ["Froid", "Humide", "Sec", "Lourd"],
    correct: 0,
    timeLimit: 10,
    difficulty: "easy",
  },
  {
    text: "Quel est le cinquième mois de l'année ?",
    answers: ["Mars", "Avril", "Mai", "Juin"],
    correct: 2,
    timeLimit: 10,
    difficulty: "easy",
  },
];

const mediumQuestions = [
  {
    text: "Quel est le plus grand océan du monde ?",
    answers: ["Atlantique", "Indien", "Arctique", "Pacifique"],
    correct: 3,
    timeLimit: 20,
    difficulty: "medium",
    hint: "Il borde la côte ouest des États-Unis."
  },
  {
    text: "Quel est l'élément chimique dont le symbole est O ?",
    answers: ["Or", "Oxygène", "Osmium", "Ozone"],
    correct: 1,
    timeLimit: 20,
    difficulty: "medium",
    hint: "C'est essentiel à la respiration."
  },
  {
    text: "Qui a peint la Joconde ?",
    answers: ["Van Gogh", "Picasso", "Léonard de Vinci", "Monet"],
    correct: 2,
    timeLimit: 20,
    difficulty: "medium",
    hint: "Cet artiste était aussi inventeur."
  },
  {
    text: "Quel est le plus long fleuve du monde ?",
    answers: ["Nil", "Amazon", "Yangtsé", "Mississippi"],
    correct: 1,
    timeLimit: 20,
    difficulty: "medium",
    hint: "Il traverse l'Amérique du Sud."
  },
  {
    text: "Quel est le plus haut sommet du monde ?",
    answers: ["K2", "Everest", "Mont Blanc", "Kilimandjaro"],
    correct: 1,
    timeLimit: 20,
    difficulty: "medium",
    hint: "Il se trouve dans l'Himalaya."
  },  
  {
    text: "En quelle année a eu lieu la Révolution française ?",
    answers: ["1789", "1815", "1848", "1914"],
    correct: 0,
    timeLimit: 25,
    difficulty: "medium",
    hint: "C'est la fin du XVIIIe siècle."
  },
];

const hardQuestions = [
  {
    text: "Qui a écrit 'Le Petit Prince' ?",
    answers: ["Saint-Exupéry", "Hugo", "Zola", "Camus"],
    correct: 0,
    timeLimit: 20,
    difficulty: "hard",
    hint: "Son prénom est Antoine."
  },
  {
    text: "Combien d'états composent les États-Unis ?",
    answers: ["50", "48", "52", "45"],
    correct: 0,
    timeLimit: 25,
    difficulty: "hard",
    hint: "Ce n'est pas 52."
  },
  {
    text: "Quel est le nombre Pi arrondi à 3 décimales ?",
    answers: ["3.142", "3.141", "3.143", "3.140"],
    correct: 0,
    timeLimit: 25,
    difficulty: "hard",
    hint: "C'est le nombre utilisé pour calculer le cercle."
  },
  {
    text: "Quel est le plus grand désert du monde ?",
    answers: ["Sahara", "Antarctique", "Gobi", "Kalahari"],
    correct: 1,
    timeLimit: 25,
    difficulty: "hard",
    hint: "Il est situé au pôle sud."
  },
  {
    text: "Combien de chromosomes possède l'humain ?",
    answers: ["46", "23", "44", "48"],
    correct: 0,
    timeLimit: 25,
    difficulty: "hard",
    hint: "Les chromosomes se comptent en paires."
  },
  {
    text: "Quel est le plus grand pays du monde par superficie ?",
    answers: ["Canada", "Chine", "États-Unis", "Russie"],
    correct: 3,
    timeLimit: 25,
    difficulty: "hard",
    hint: "C'est un pays où il fait généralement froid."
  },
  {
    text: "Qui a écrit 'Voyage au centre de la Terre' ?",
    answers: ["Proust", "Vernes", "Ferry", "Flaubert"],
    correct: 1,
    timeLimit: 25,
    difficulty: "hard",
    hint: "Son prénom est Jules."
  },
  {
    text: "Quel est le point de fusion de l'eau en degrés Celsius ?",
    answers: ["0", "100", "-10", "50"],
    correct: 0,
    timeLimit: 25,
    difficulty: "hard",
    hint: "C'est la température à laquelle la glace fond."
  },
  {
    text: "Quel scientifique a proposé la théorie de la relativité ?",
    answers: ["Newton", "Einstein", "Galilée", "Hofmann"],
    correct: 1,
    timeLimit: 25,
    difficulty: "hard",
    hint: "Son prénom est Albert."
  },
];

// Génère la liste des questions à poser (ordre croissant de difficulté)
// Fonction utilitaire pour mélanger un tableau
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Sélectionne n éléments aléatoires d'un tableau
function pickRandom(array, n) {
  return shuffleArray([...array]).slice(0, n);
}

function generateQuizQuestions() {
  // 3 easy, 4 medium, 3 hard
  const easy = pickRandom(easyQuestions, 3);
  const medium = pickRandom(mediumQuestions, 4);
  const hard = pickRandom(hardQuestions, 3);
  return [...easy, ...medium, ...hard];
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

// --- THEME TOGGLE LOGIC ---
const themeToggle = getElement("#theme-toggle");
const body = document.body;
const mainLogo = getElement(".main-logo");

const applyTheme = (theme) => {
  body.setAttribute("data-theme", theme);
  mainLogo.src =
    theme === "dark"
      ? "../assets/img/QuizCampus-logo-dark.webp"
      : "../assets/img/QuizCampus-logo.webp";
  saveToLocalStorage("theme", theme);
};

const currentTheme = loadFromLocalStorage("theme", "light");
applyTheme(currentTheme);

themeToggle.addEventListener("click", () => {
  const newTheme = body.getAttribute("data-theme") === "light" ? "dark" : "light";
  applyTheme(newTheme);
});
// --- END THEME TOGGLE LOGIC ---

// Ajout du bouton indice uniquement pour medium et hard
const hintBtn = document.createElement("button");
hintBtn.innerHTML = "💡"; // Utilisation d'une icône
hintBtn.id = "hint-btn";
hintBtn.title = "Afficher l'indice"; // Tooltip pour l'accessibilité

const hintDiv = document.createElement("div");
hintDiv.id = "hint-div";
hintDiv.className = "hint-popup"; // Nouvelle classe pour le style
questionScreen.appendChild(hintDiv);

hintBtn.addEventListener("click", (e) => {
  const q = questions[currentQuestionIndex];
  if (q.difficulty === "easy") {
    return; // Ne rien faire si la question est facile
  }

  const hintText = q.hint || "Aucun indice disponible pour cette question.";
  hintDiv.textContent = hintText;

  // --- DYNAMIC POSITIONING ---
  const btnRect = e.currentTarget.getBoundingClientRect();
  const screenRect = questionScreen.getBoundingClientRect();
  const top = btnRect.bottom - screenRect.top + 8;
  const left = btnRect.left - screenRect.left + btnRect.width / 2;
  hintDiv.style.top = `${top}px`;
  hintDiv.style.left = `${left}px`;
  // --- END DYNAMIC POSITIONING ---

  // Afficher le popup et le cacher après quelques secondes
  hintDiv.classList.add("visible");
  setTimeout(() => {
    hintDiv.classList.remove("visible");
  }, 4000); // L'indice reste visible 4 secondes
});

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
  questionText.textContent = q.text;
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

  // Affiche ou masque le bouton indice selon la difficulté
  if (q.difficulty !== "easy") {
    questionText.appendChild(document.createTextNode(" "));
    questionText.appendChild(hintBtn);
  }

  // Reset timer bar
  if (timerBar) timerBar.style.width = "100%";

  // Format initial timer text
  const initialTime = q.timeLimit;
  setText(timerText, `${initialTime} seconde${initialTime > 1 ? "s" : ""}`);

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
      hintDiv.classList.remove("visible"); // Cacher l'indice si le temps est écoulé
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
    hintDiv.classList.remove("visible"); // Cacher l'indice à la question suivante
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

  // --- PARTAGE RESEAUX SOCIAUX ---
  let shareDiv = document.getElementById("share-div");
  if (!shareDiv) {
    shareDiv = document.createElement("div");
    shareDiv.id = "share-div";
    shareDiv.style.marginTop = "2em";
    shareDiv.style.display = "flex";
    shareDiv.style.gap = "1em";
    shareDiv.style.justifyContent = "center";
    resultScreen.appendChild(shareDiv);
  }
  shareDiv.innerHTML = "";

  const quizUrl = encodeURIComponent(window.location.href);
  const quizText = encodeURIComponent(`J'ai obtenu ${score}/${questions.length} sur QuizCampus ! Viens essayer toi aussi !`);

  // X (Twitter)
  const xBtn = document.createElement("button");
  xBtn.innerHTML = "<img src='https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg' alt='X' style='width:24px;height:24px;vertical-align:middle;'> X";
  xBtn.className = "btn share-btn";
  xBtn.onclick = () => {
    window.open(`https://twitter.com/intent/tweet?text=${quizText}&url=${quizUrl}`, "_blank");
  };
  shareDiv.appendChild(xBtn);

  // Instagram (pas de partage direct, propose de copier le texte)
  const instaBtn = document.createElement("button");
  instaBtn.innerHTML = "<img src='https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg' alt='Instagram' style='width:24px;height:24px;vertical-align:middle;'> Instagram";
  instaBtn.className = "btn share-btn";
  instaBtn.onclick = () => {
    navigator.clipboard.writeText(`J'ai obtenu ${score}/${questions.length} sur QuizCampus ! ${window.location.href}`);
    alert("Texte copié ! Partage-le sur Instagram dans ta story ou ta bio.");
  };
  shareDiv.appendChild(instaBtn);

  // Facebook
  const fbBtn = document.createElement("button");
  fbBtn.innerHTML = "<img src='https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg' alt='Facebook' style='width:24px;height:24px;vertical-align:middle;'> Facebook";
  fbBtn.className = "btn share-btn";
  fbBtn.onclick = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${quizUrl}&quote=${quizText}`, "_blank");
  };
  shareDiv.appendChild(fbBtn);
  // --- FIN PARTAGE ---
}

function restartQuiz() {
  hideElement(resultScreen);
  showElement(introScreen);

  setText(bestScoreValue, bestScore);
}

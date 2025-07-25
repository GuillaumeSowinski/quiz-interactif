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
  applyTranslations,
} from "./dom.js";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  startTimer,
} from "./utils.js";
import { translations } from "./i18n.js";

console.log("Quiz JS loaded...");

// --- INTERNATIONALIZED QUESTIONS ---
const easyQuestions = [
  {
    text: {
      fr: "Quelle est la capitale de la France ?",
      en: "What is the capital of France?",
    },
    answers: {
      fr: ["Marseille", "Paris", "Lyon", "Bordeaux"],
      en: ["Marseille", "Paris", "Lyon", "Bordeaux"],
    },
    correct: 1,
    timeLimit: 10,
    difficulty: "easy",
  },
  {
    text: { fr: "Combien font 2 + 3 ?", en: "What is 2 + 3?" },
    answers: { fr: ["3", "4", "5", "1"], en: ["3", "4", "5", "1"] },
    correct: 2,
    timeLimit: 10,
    difficulty: "easy",
  },
  {
    text: {
      fr: "Combien de côtés a un rectangle ?",
      en: "How many sides does a rectangle have?",
    },
    answers: { fr: ["3", "4", "5", "6"], en: ["3", "4", "5", "6"] },
    correct: 1,
    timeLimit: 10,
    difficulty: "easy",
  },
  {
    text: {
      fr: "Quel fruit est jaune ?",
      en: "What fruit is yellow?",
    },
    answers: { fr: ["Pomme", "Banane", "Cerise", "Raisin"], en: ["Apple", "Banana", "Cherry", "Raisin"] },
    correct: 1,
    timeLimit: 10,
    difficulty: "easy",
  },
  {
    text: {
      fr: "Combien font 1 x 0 ?",
      en: "What is 1 x 0?",
    },
    answers: { fr: ["0", "1", "2", "3"], en: ["0", "1", "2", "3"] },
    correct: 0,
    timeLimit: 10,
    difficulty: "easy",
  },
  {
    text: {
      fr: "Quel est le contraire de chaud ?",
      en: "What is the opposite of hot?",
    },
    answers: { fr: ["Froid", "Humide", "Sec", "Lourd"], en: ["Cold", "Humid", "Dry", "Heavy"] },
    correct: 0,
    timeLimit: 10,
    difficulty: "easy",
  },
  {
    text: {
      fr: "Quel est le cinquième mois de l'année ?",
      en: "What is the fifth month of the year?",
    },
    answers: { fr: ["Mars", "Avril", "Mai", "Juin"], en: ["March", "April", "May", "June"] },
    correct: 2,
    timeLimit: 10,
    difficulty: "easy",
  },
];

const mediumQuestions = [
  {
    text: {
      fr: "Quel est le plus grand océan du monde ?",
      en: "What is the largest ocean in the world?",
    },
    answers: {
      fr: ["Atlantique", "Indien", "Arctique", "Pacifique"],
      en: ["Atlantic", "Indian", "Arctic", "Pacific"],
    },
    correct: 3,
    timeLimit: 20,
    difficulty: "medium",
    hint: {
      fr: "Il borde la côte ouest des États-Unis.",
      en: "It borders the west coast of the United States.",
    },
  },
  {
    text: {
      fr: "Quel est l'élément chimique dont le symbole est O ?",
      en: "What is the chemical element with the symbol O?",
    },
    answers: {
      fr: ["Or", "Oxygène", "Osmium", "Ozone"],
      en: ["Gold", "Oxygen", "Osmium", "Ozone"],
    },
    correct: 1,
    timeLimit: 20,
    difficulty: "medium",
    hint: {
      fr: "C'est essentiel à la respiration.",
      en: "It is essential for respiration.",
    },
  },
  {
    text: {
      fr: "Qui a peint la Joconde ?",
      en: "Who painted the Mona Lisa?",
    },
    answers: {
      fr: ["Van Gogh", "Picasso", "Léonard de Vinci", "Monet"],
      en: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Monet"],
    },
    correct: 2,
    timeLimit: 20,
    difficulty: "medium",
    hint: {
      fr: "Cet artiste était aussi inventeur.",
      en: "This artist was also an inventor.",
    },
  },
  {
    text: {
      fr: "Quel est le plus long fleuve du monde ?",
      en: "What is the longest river in the world?",
    },
    answers: { fr: ["Nil", "Amazon", "Yangtsé", "Mississippi"], en: ["Nil", "Amazon", "Yangtsé", "Mississippi"] },
    correct: 1,
    timeLimit: 20,
    difficulty: "medium",
    hint: {
      fr: "Il traverse l'Amérique du Sud.",
      en: "It traverses South America.",
    },
  },
  {
    text: {
      fr: "Quel est le plus haut sommet du monde ?",
      en: "What is the highest mountain in the world?",
    },
    answers: { fr: ["K2", "Everest", "Mont Blanc", "Kilimandjaro"], en: ["K2", "Everest", "Mont Blanc", "Kilimandjaro"] },
    correct: 1,
    timeLimit: 20,
    difficulty: "medium",
    hint: {
      fr: "Il se trouve dans l'Himalaya.",
      en: "It is located in the Himalayas.",
    },
  },
  {
    text: {
      fr: "En quelle année a eu lieu la Révolution française ?",
      en: "In what year did the French Revolution take place?",
    },
    answers: { fr: ["1789", "1815", "1848", "1914"], en: ["1789", "1815", "1848", "1914"] },
    correct: 0,
    timeLimit: 25,
    difficulty: "medium",
    hint: {
      fr: "C'est la fin du XVIIIe siècle.",
      en: "It was the end of the 18th century.",
    },
  },
];

const hardQuestions = [
  {
    text: {
      fr: "Qui a écrit 'Le Petit Prince' ?",
      en: "Who wrote 'The Little Prince'?",
    },
    answers: {
      fr: ["Saint-Exupéry", "Hugo", "Zola", "Camus"],
      en: ["Saint-Exupéry", "Hugo", "Zola", "Camus"],
    },
    correct: 0,
    timeLimit: 20,
    difficulty: "hard",
    hint: { fr: "Son prénom est Antoine.", en: "His first name is Antoine." },
  },
  {
    text: {
      fr: "Combien d'états composent les États-Unis ?",
      en: "How many states make up the United States?",
    },
    answers: { fr: ["50", "48", "52", "45"], en: ["50", "48", "52", "45"] },
    correct: 0,
    timeLimit: 25,
    difficulty: "hard",
    hint: {
      fr: "Ce n'est pas 52.",
      en: "It's not 52.",
    },
  },
  {
    text: {
      fr: "Quel est le nombre Pi arrondi à 3 décimales ?",
      en: "What is the number Pi rounded to 3 decimal places?",
    },
    answers: {
      fr: ["3.142", "3.141", "3.143", "3.140"],
      en: ["3.142", "3.141", "3.143", "3.140"],
    },
    correct: 0,
    timeLimit: 25,
    difficulty: "hard",
    hint: {
      fr: "C'est le nombre utilisé pour calculer le cercle.",
      en: "It's the number used to calculate the circle.",
    },
  },
  {
    text: {
      fr: "Quel est le plus grand désert du monde ?",
      en: "What is the largest desert in the world?",
    },
    answers: { fr: ["Sahara", "Antarctique", "Gobi", "Kalahari"], en: ["Sahara", "Antarctica", "Gobi", "Kalahari"] },
    correct: 1,
    timeLimit: 25,
    difficulty: "hard",
    hint: {
      fr: "Il est situé au pôle sud.",
      en: "It is located at the South Pole.",
    },
  },
  {
    text: {
      fr: "Combien de chromosomes possède l'humain ?",
      en: "How many chromosomes does a human have?",
    },
    answers: { fr: ["46", "23", "44", "48"], en: ["46", "23", "44", "48"] },
    correct: 0,
    timeLimit: 25,
    difficulty: "hard",
    hint: {
      fr: "Les chromosomes se comptent en paires.",
      en: "Chromosomes are counted in pairs.",
    },
  },
  {
    text: {
      fr: "Quel est le plus grand pays du monde par superficie ?",
      en: "What is the largest country in the world by area?",
    },
    answers: { fr: ["Canada", "Chine", "États-Unis", "Russie"], en: ["Canada", "China", "United States", "Russia"] },
    correct: 3,
    timeLimit: 25,
    difficulty: "hard",
    hint: {
      fr: "C'est un pays où il fait généralement froid.",
      en: "It's a country where it's generally cold.",
    },
  },
  {
    text: {
      fr: "Qui a écrit 'Voyage au centre de la Terre' ?",
      en: "Who wrote 'Journey to the Center of the Earth'?",
    },
    answers: { fr: ["Proust", "Vernes", "Ferry", "Flaubert"], en: ["Proust", "Vernes", "Ferry", "Flaubert"] },
    correct: 1,
    timeLimit: 25,
    difficulty: "hard",
    hint: { fr: "Son prénom est Jules.", en: "His first name is Jules." },
  },
  {
    text: {
      fr: "Quel est le point de fusion de l'eau en degrés Celsius ?",
      en: "What is the melting point of water in degrees Celsius?",
    },
    answers: { fr: ["0", "100", "-10", "50"], en: ["0", "100", "-10", "50"] },
    correct: 0,
    timeLimit: 25,
    difficulty: "hard",
    hint: {
      fr: "C'est la température à laquelle la glace fond.",
      en: "It's the temperature at which ice melts.",
    },
  },
  {
    text: {
      fr: "Quel scientifique a proposé la théorie de la relativité ?",
      en: "Which scientist proposed the theory of relativity?",
    },
    answers: {
      fr: ["Newton", "Einstein", "Galilée", "Hofmann"],
      en: ["Newton", "Einstein", "Galileo", "Hofmann"],
    },
    correct: 1,
    timeLimit: 25,
    difficulty: "hard",
    hint: { fr: "Son prénom est Albert.", en: "His first name is Albert." },
  },
];
// --- END INTERNATIONALIZED QUESTIONS ---

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

// --- STATE MANAGEMENT ---
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let bestScore = loadFromLocalStorage("bestScore", 0);
let currentLang = loadFromLocalStorage("language", "fr");
let timerId = null;
// --- END STATE MANAGEMENT ---

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

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners();
  applyLanguage(currentLang);
  setText(bestScoreValue, bestScore);
});

function initializeEventListeners() {
  startBtn.addEventListener("click", startQuiz);
  nextBtn.addEventListener("click", nextQuestion);
  restartBtn.addEventListener("click", restartQuiz);
  themeToggle.addEventListener("click", toggleTheme);
  languageToggle.addEventListener("click", toggleLanguage);
}
// --- END INITIALIZATION ---

// --- LANGUAGE LOGIC ---
function applyLanguage(lang) {
  document.body.dataset.lang = lang;
  currentLang = lang;
  saveToLocalStorage("language", lang);

  // Translate all UI elements with data-i18n attribute
  applyTranslations(translations[lang]);

  // If a quiz is in progress, refresh the current question display
  if (questionScreen.style.display === "block") {
    showQuestion();
  }
}

function toggleLanguage() {
  const newLang = currentLang === "fr" ? "en" : "fr";
  applyLanguage(newLang);
}
// --- END LANGUAGE LOGIC ---

// --- THEME TOGGLE LOGIC ---
const themeToggle = getElement("#theme-toggle");
const languageToggle = getElement("#language-toggle");
const body = document.body;
const mainLogo = getElement(".main-logo");

function applyTheme(theme) {
  body.dataset.theme = theme;
  mainLogo.src =
    theme === "dark"
      ? "../assets/img/QuizCampus-logo-dark.webp"
      : "../assets/img/QuizCampus-logo.webp";
  saveToLocalStorage("theme", theme);
}

function toggleTheme() {
  const newTheme = body.dataset.theme === "light" ? "dark" : "light";
  applyTheme(newTheme);
}

const currentTheme = loadFromLocalStorage("theme", "light");
applyTheme(currentTheme);
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

  const hintText = q.hint ? q.hint[currentLang] || "Aucun indice disponible pour cette question." : "Aucun indice disponible pour cette question.";
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

function startQuiz() {
  hideElement(introScreen);
  showElement(questionScreen);

  currentQuestionIndex = 0;
  score = 0;

  questions = generateQuizQuestions();
  setText(totalQuestionsSpan, questions.length);

  showQuestion();
}

function showQuestion() {
  clearInterval(timerId);

  const q = questions[currentQuestionIndex];
  questionText.textContent = q.text[currentLang]; // Use current language
  setText(currentQuestionIndexSpan, currentQuestionIndex + 1);

  updateProgressBar("#progress-bar", currentQuestionIndex + 1, questions.length);

  answersDiv.innerHTML = "";
  q.answers[currentLang].forEach((answer, index) => { // Use current language
    const btn = createAnswerButton(answer, () => selectAnswer(index, btn));
    answersDiv.appendChild(btn);
  });

  nextBtn.classList.add("hidden");

  if (q.difficulty !== "easy") {
    questionText.appendChild(document.createTextNode(" "));
    questionText.appendChild(hintBtn);
  }

  if (timerBar) timerBar.style.width = "100%";

  const initialTime = q.timeLimit;
  // Use translation function for timer text
  setText(timerText, translations[currentLang]["timer-text"](initialTime));

  timerId = startTimer(
    q.timeLimit,
    (timeLeft) => {
      // Use translation function for timer text
      setText(timerText, translations[currentLang]["timer-text"](timeLeft));
      updateProgressBar("#timer-bar", timeLeft, q.timeLimit);
    },
    () => {
      hintDiv.classList.remove("visible");
      lockAnswers(answersDiv);
      markCorrectAnswer(answersDiv, q.correct);
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

  // Use translation function for score text
  const scoreString = translations[currentLang]["score-text"](score, questions.length);
  setText(scoreText, scoreString);

  if (score > bestScore) {
    bestScore = score;
    saveToLocalStorage("bestScore", bestScore);
  }
  setText(bestScoreEnd, bestScore);

  // --- PARTAGE RESEAUX SOCIAUX (Internationalized) ---
  let shareDiv = document.getElementById("share-div");
  if (!shareDiv) {
    shareDiv = document.createElement("div");
    shareDiv.id = "share-div";
    resultScreen.appendChild(shareDiv);
  }
  shareDiv.innerHTML = "";

  const quizUrl = encodeURIComponent(window.location.href);
  // Use translation function for share text
  const quizText = encodeURIComponent(translations[currentLang]["share-text"](score, questions.length));

  // X (Twitter)
  const xBtn = document.createElement("button");
  xBtn.innerHTML = "<img src='https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg' alt='X'> X";
  xBtn.title = translations[currentLang]["share-on-x"];
  xBtn.className = "share-btn";
  xBtn.onclick = () => {
    window.open(`https://twitter.com/intent/tweet?text=${quizText}&url=${quizUrl}`, "_blank");
  };
  shareDiv.appendChild(xBtn);

  // Instagram
  const instaBtn = document.createElement("button");
  instaBtn.innerHTML = "<img src='https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg' alt='Instagram'> Instagram";
  instaBtn.title = translations[currentLang]["share-on-instagram"];
  instaBtn.className = "share-btn";
  instaBtn.onclick = () => {
    // Use translation function for share text
    navigator.clipboard.writeText(translations[currentLang]["share-text"](score, questions.length) + ` ${window.location.href}`);
    alert(translations[currentLang]["clipboard-copy-success"]);
  };
  shareDiv.appendChild(instaBtn);

  // Facebook
  const fbBtn = document.createElement("button");
  fbBtn.innerHTML = "<img src='https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg' alt='Facebook'> Facebook";
  fbBtn.title = translations[currentLang]["share-on-facebook"];
  fbBtn.className = "share-btn";
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

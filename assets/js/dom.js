// dom.js
export const getElement = (selector) => document.querySelector(selector);
export const showElement = (element) => (element.style.display = "block");
export const hideElement = (element) => (element.style.display = "none");
export const setText = (element, text) => (element.textContent = text);

export const createAnswerButton = (text, onClick) => {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.addEventListener("click", onClick);
  return btn;
};

export const updateScoreDisplay = (scoreElement, score, total) => {
  scoreElement.textContent = `Votre score : ${score} / ${total}`;
};

export const lockAnswers = (container) => {
  const buttons = container.querySelectorAll("button");
  buttons.forEach((btn) => (btn.disabled = true));
};

export const markCorrectAnswer = (container, correctIndex) => {
  const buttons = container.querySelectorAll("button");
  if (buttons[correctIndex]) {
    buttons[correctIndex].classList.add("correct");
  }
};

export const updateProgressBar = (
  progressBarId,
  currentValue,
  maxValue
) => {
  const progressBar = getElement(progressBarId);
  if (progressBar) {
    const percentage = (currentValue / maxValue) * 100;
    progressBar.style.width = `${percentage}%`;
  }
};

export const applyTranslations = (translationMap) => {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    const target = element.dataset.i18nTarget;

    if (translationMap[key]) {
      if (target === "title") {
        element.setAttribute("title", translationMap[key]);
      } else {
        // Comportement par défaut pour les autres éléments (p, h2, etc.)
        element.textContent = translationMap[key];
      }
    }
  });
};

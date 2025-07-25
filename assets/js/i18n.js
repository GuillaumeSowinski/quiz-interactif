// quiz-interactif/assets/js/i18n.js
export const translations = {
  fr: {
    "theme-toggle-title": "Basculer le thème",
    "lang-toggle-title": "Changer de langue",
    "intro-notice": "Testez vos connaissances en quelques questions chronométrées !",
    "best-score-label": "Meilleur Score",
    "start-button": "Commencer le quiz",
    "next-button": "Question suivante",
    "final-result-title": "Résultat final",
    "restart-button": "Recommencer",
    "share-on-x": "Partager sur X",
    "share-on-instagram": "Partager sur Instagram",
    "share-on-facebook": "Partager sur Facebook",
    "clipboard-copy-success": "Texte copié ! Partage-le sur Instagram dans ta story ou ta bio.",
    "no-hint-available": "Aucun indice disponible pour cette question.",
    "score-text": (score, total) => `Votre score : ${score} / ${total}`,
    "share-text": (score, total) => `J'ai obtenu ${score}/${total} sur QuizCampus ! Viens essayer toi aussi !`,
    "timer-text": (timeLeft) => `${timeLeft} seconde${timeLeft > 1 ? "s" : ""}`
  },
  en: {
    "theme-toggle-title": "Toggle theme",
    "lang-toggle-title": "Switch language",
    "intro-notice": "Test your knowledge with a few timed questions!",
    "best-score-label": "Best Score",
    "start-button": "Start Quiz",
    "next-button": "Next Question",
    "final-result-title": "Final Result",
    "restart-button": "Restart",
    "share-on-x": "Share on X",
    "share-on-instagram": "Share on Instagram",
    "share-on-facebook": "Share on Facebook",
    "clipboard-copy-success": "Text copied! Share it on your Instagram story or bio.",
    "no-hint-available": "No hint available for this question.",
    "score-text": (score, total) => `Your score: ${score} / ${total}`,
    "share-text": (score, total) => `I got ${score}/${total} on QuizCampus! Come and try it too!`,
    "timer-text": (timeLeft) => `${timeLeft} second${timeLeft > 1 ? "s" : ""}`
  }
}; 